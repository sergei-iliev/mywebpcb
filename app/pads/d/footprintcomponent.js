var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var Unit = require('core/core').Unit;
var ViewportWindow=require('core/core').ViewportWindow;
var FootprintEventMgr = require('pads/events').FootprintEventMgr;
var events=require('core/events');
var RoundRect=require('pads/shapes').RoundRect;
var Circle=require('pads/shapes').Circle;
var Arc=require('pads/shapes').Arc;
var Pad=require('pads/shapes').Pad;
var FootprintShapeFactory=require('pads/shapes').FootprintShapeFactory;
var Drill=require('pads/shapes').Drill;
var GlyphLabel=require('pads/shapes').GlyphLabel;
var Line=require('pads/shapes').Line;
var LineEventHandle=require('pads/events').LineEventHandle;
var FootprintContextMenu=require('pads/popup/footprintpopup').FootprintContextMenu;
var GlyphManager=require('core/text/glyph').GlyphManager;

class Footprint extends Unit{
constructor(width,height) {
       super(width,height); 
	   this.shapeFactory = new FootprintShapeFactory();
	}
clone(){
	  var copy=new Footprint(this.width,this.height);
	  copy.silent=true;
	  copy.name=this.name;
	  copy.grid=this.grid.clone();
      var len=this.shapes.length;
	  for(var i=0;i<len;i++){
           var clone=this.shapes[i].clone();
	       copy.add(clone);
	  }
	  copy.silent=false;
	  return copy;
	}
add(shape){
	 if(shape==undefined){
		return;	
	 }

	 if(shape instanceof Pad){
	   this.shapes.unshift(shape); 	 
	 }else{	
	   this.shapes.push(shape);
	 }
	 shape.owningUnit=this;
	 this.fireShapeEvent({target:shape,type:events.Event.ADD_SHAPE});
	}	
parse(data){
	 	   //this.width=j$(data).attr("width");
	 	   //this.height=j$(data).attr("height");
	 	   this.name=j$(data).find("name").text();
	 	   this.grid.setGridUnits(j$(data).find("units").attr("raster"),core.Units.MM);
	 	   
	 	   var reference=j$(data).find("reference");
	 	   var value=j$(data).find("value");
	 	   if(reference!=null&&reference.text()!=''){
	           var label = new GlyphLabel(0,0,0);
	           label.fromXML(reference[0]);
	           label.texture.tag="reference";
	           this.add(label);      
	 	   }
	 	   if(value!=null&&value.text()!=''){
	           var label = new GlyphLabel(0,0,0);
	           label.fromXML(value[0]);
	           label.texture.tag="value";
	           this.add(label);	 		   
	 	   }
	 	   var that=this;
	 	   j$(data).find('shapes').children().each(function(){
               var shape=that.shapeFactory.createShape(this);			   
               that.add(shape);
	 	   });


	}	
format(){   
   var xml="<footprint width=\""+ this.width +"\" height=\""+this.height+"\">\r\n"; 
   xml+="<name>"+this.name+"</name>\r\n";
   //***reference
   var text=mywebpcb.core.UnitMgr.getInstance().getTextureByTag(this,'reference');
   if(text!=null){
       xml+="<reference>";
       xml+=text.toXML();
       xml+="</reference>\r\n";
   } 
   //value
   text=mywebpcb.core.UnitMgr.getInstance().getTextureByTag(this,'value');
   if(text!=null){
       xml+="<value>";
       xml+=text.toXML();
       xml+="</value>\r\n";
   }    
   xml+="<units raster=\""+this.grid.getGridValue()+"\">MM</units>\r\n"; 
   xml+="<shapes>\r\n";
   this.shapes.each(function(shape) {
	   xml+=shape.toXML();
   });
   xml+="</shapes>\r\n";   
   xml+="</footprint>";
   return xml;
}	
}

class FootprintContainer{
    constructor(silent) {
      this.silent= silent || false;;	
	  this.unitsmap=new Map();
	  this.unit=null;
	  this.formatedFileName="Footprints";
	  this.libraryname="";
	  this.categoryname="";
	}
    setFileName(formatedFileName) {
        this.formatedFileName = formatedFileName;
    }
	add(unit){
	  this.unitsmap.set(unit.getUUID(), unit);
      if(this.unitsmap.size==1){
          this.setActiveUnit(0);   
      }
      this.fireUnitEvent({target:unit,type:events.Event.ADD_UNIT});
      
	}
    Delete( uuid) {
        var _unit = this.unitsmap.get(uuid);
        if(_unit==null){
            return;
        }
        _unit.release();
        this.fireUnitEvent({target:_unit,type:events.Event.DELETE_UNIT});
        if (_unit == this.unit) {
            this.unit = null;
        }
        _unit = null;
        //this.unitsmap.unset(uuid);
    }
    clear(){
    	for(let item of this.unitsmap.keys()){
    		  this.Delete(item);
    		  this.unitsmap.delete(item);
        };
		this.unitsmap.clear();
    }
    parse(xml){
    	  this.formatedFileName=(j$(xml).find("filename").text());
    	  this.libraryname=(j$(xml).find("library").text());
    	  this.categoryname=(j$(xml).find("category").text());    	  
    	  
    	  var that=this;
	      j$(xml).find("footprint").each(j$.proxy(function(){
	    	var footprint=new Footprint(j$(this).attr("width"),j$(this).attr("height"));
	    	footprint.name=j$(this).find("name").text();
	    	//silent mode
	    	footprint.silent=that.silent;
	    	//need to have a current unit 
            that.add(footprint);
            footprint.parse(this);
	    }),that);	
    }
    format() {
        var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n"; 
        xml+="<footprints identity=\"Footprint\" version=\"1.0\">\r\n";      
    	this.unitsmap.values().each(function(item) {
  		  xml+=item.format();
  		  xml+="\r\n";
  		},this);        
        xml+="</footprints>";
        return xml;
    }
	getUnits() {
        return this.unitsmap.values();
    }
    setActiveUnitUUID(uuid){
    	this.unit=this.unitsmap.get(Number(uuid));
    }
	setActiveUnit(index) {	
	let units=this.unitsmap.values();
	  for(let i=0;i<this.unitsmap.size;i++){
        let aunit=units.next();
		if(index==i){
		  this.unit=aunit.value;
		  break;
		}
	  }
    }
	getUnit(){
	  return this.unit;
	}
	fireUnitEvent(event){
		if(this.silent)
			return;
		switch(event.type){
		  case events.Event.ADD_UNIT:
			  mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.DELETE_UNIT:
			  mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.SELECT_UNIT:
			  mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.RENAME_UNIT:	 
			  mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  mywebpcb.trigger('unit:inspector',event);
			  break;
		}  		
	}
	
}


class FootprintComponent{
  constructor(hbar,vbar,canvas,popup) {
	GlyphManager.getInstance();
	
    if(canvas!=null){	
      this.canvas = j$('#'+canvas);
	  this.ctx = this.canvas[0].getContext("2d");
	  
	  //keypress
	  j$('body').keydown(j$.proxy(this.keyPress,this));
	  //right popup
	  j$('body').on('contextmenu', '#'+canvas, function(e){ return false; });
	  //mouse wheel event
	  j$('#'+canvas).bind('mousewheel',j$.proxy(this.mouseWheelMoved,this));
	  //mouse click event 
	  j$('#'+canvas).on('mouseup',j$.proxy(this.mouseUp,this)); 
	  j$('#'+canvas).on('mousedown',j$.proxy(this.mouseDown,this));
	  j$('#'+canvas).on('mousemove',j$.proxy(this.mouseMove,this));
	  j$(window).resize(j$.proxy(this.screenResized,this));
	  j$('#'+canvas).dblclick(j$.proxy(this.dblClick,this));
	}
	
	(function(that){
	  let eventMgr=new FootprintEventMgr(that); 
	  let model=new FootprintContainer();
	  let mode=core.ModeEnum.COMPONENT_MODE;
	  let cursor=null;
	  let view=null;
	  var shape=null;
	  
	  that.getEventMgr=function(){
	     return eventMgr;
	  };	  
	  that.getModel=function(){
		return model;
	  };
	  that.setContainerCursor=function(_cursor) {
	        //this.setCursor(Cursor.getDefaultCursor());
	        cursor = _cursor;
	  };
	  that.getContainerCursor=function() {
	        return cursor;
	  };
	  that.setView=function(_view){
		 view=_view; 
	  };
	  that.getView=function(){
		return view;  
	  };
	  that.setMode=function(_mode){
		mode=_mode;
        if (cursor != null) {
            cursor.Clear();
            cursor = null;
        }
        eventMgr.resetEventHandle();
        
        switch (mode) {
        case core.ModeEnum.PAD_MODE:
            shape=new Pad(0,0,core.MM_TO_COORD(1.52),core.MM_TO_COORD(1.52));
            shape.drill=new Drill(core.MM_TO_COORD(0.8),core.MM_TO_COORD(0.8));			                        
            this.setContainerCursor(shape);               
            this.getEventMgr().setEventHandle("cursor",shape);  
          break;
        case  core.ModeEnum.RECT_MODE:
            shape=new RoundRect(0,0,core.MM_TO_COORD(7),core.MM_TO_COORD(7),core.MM_TO_COORD(0.8),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);
            this.setContainerCursor(shape);               
            this.getEventMgr().setEventHandle("cursor",shape); 
          break;
        case  core.ModeEnum.LINE_MODE:
          
          break;
        case  core.ModeEnum.ELLIPSE_MODE:	
            shape=new Circle(0,0,core.MM_TO_COORD(3.4),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);
            this.setContainerCursor(shape);               
            this.getEventMgr().setEventHandle("cursor",shape); 
          break;
        case  core.ModeEnum.ARC_MODE:
        	shape=new Arc(0,0,core.MM_TO_COORD(3.4),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);
            this.setContainerCursor(shape);               
            this.getEventMgr().setEventHandle("cursor",shape); 
          break;
        case  core.ModeEnum.LABEL_MODE:
            shape=new GlyphLabel("sergei_iliev@yahoo.com",core.MM_TO_COORD(0.3),core.Layer.SILKSCREEN_LAYER_FRONT);			
	        this.setContainerCursor(shape);               
            this.getEventMgr().setEventHandle("cursor",shape); 
          break;
        case core.ModeEnum.ORIGIN_SHIFT_MODE:  
            this.getEventMgr().setEventHandle("origin",null);   
            break;          
        default:
          that.Repaint();
      }       
	  };
	 that.getMode=function(){
		return mode; 
	 }; 
	})(this);

    var container = j$(this.canvas).parent();	  
	this.width=j$(container).width();
	this.height=j$(container).height();

	//set canvas width
	this.canvas.attr('width',this.width);
	this.canvas.attr('height',this.height); 
	
	this.viewportWindow=new ViewportWindow(0,0,this.width,this.height);
	this.parameters=new Map();
	this.parameters.set("snaptogrid",false);
	this.popup=new FootprintContextMenu(this,popup);
	if(hbar!=null&&vbar!=null){
		this.hbar = j$('#'+hbar);
		this.vbar=j$('#'+vbar);
		this.hbar.jqxScrollBar({ width: '100%', height: 18, min: 0, max: 100});
		this.vbar.jqxScrollBar({ width: 18, height:'100%', min: 0, max: 100, vertical: true});
		this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
		this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	}
}
 
getParameter(key) {
	return this.parameters.get(key); 
}
 
setParameter(key,value){
    this.parameters.set(key,value); 
}

setScrollPosition(x,y) {
     var xx=x*this.getModel().getUnit().getScalableTransformation().getScale();
     var yy=y*this.getModel().getUnit().getScalableTransformation().getScale();
     
     xx=parseInt(xx-(this.width/2));
     yy=parseInt(yy-(this.height/2));

     this.hbar.jqxScrollBar('setPosition',xx); 
     this.vbar.jqxScrollBar('setPosition',yy);
}
setSize( width, height){
      this.viewportWindow.setSize(width,height);      
  }
Clear(){
		this.viewportWindow.setSize(1,1); 
	    this.getEventMgr().resetEventHandle();
	    this.getModel().clear();
	  }
fireContainerEvent(event){
	  mywebpcb.trigger('container:inspector',event); 
}
keyPress(event){
	  if(event.target.tagName=="INPUT"){
		  return;
	  }
	 //if(event.target instanceof HTMLBodyElement||event.target instanceof HTMLCanvasElement){
		 event.preventDefault();
		 if (this.getModel().getUnit() != null) { 
			 if (event.keyCode == 8) { //BACKSPACE
				 this.getModel().getUnit().getSelectedShapes().forEach(function(shape) {
					 this.getModel().getUnit().remove(shape.getUUID());	
		           }.bind(this));  
				 this.Repaint();
			 }
			 if (this.getEventMgr().getTargetEventHandle() != null&&event.keyCode==27) {	
			   this.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		       this.setMode(core.ModeEnum.COMPONENT_MODE);       
		     } 
		 }
	 //}	 
  }
getScaledEvent(event){
	  var x,y;
	  if (event.pageX != undefined && event.pageY != undefined) {
		   x = event.pageX;
		   y = event.pageY;
	  }else {
		   x = event.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
		   y = event.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	 }
	       x -= parseInt(this.canvas.offset().left);
	       y -= parseInt(this.canvas.offset().top);
	  
	  return new events.MouseScaledEvent(x,y,this.getModel().getUnit().getScalableTransformation().getInversePoint(this.viewportWindow.x+x,this.viewportWindow.y+y),event);     
  }
dblClick(event){
	  event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		 return; 
	  }
		
      var scaledEvent =this.getScaledEvent(event);

	  if (this.getEventMgr().getTargetEventHandle() != null) {
	            this.getEventMgr().getTargetEventHandle().dblClick(scaledEvent);
	  } 	  
}
//  contextMenu:function(event){ 
//	  var x,y;
//	  if (event.pageX != undefined && event.pageY != undefined) {
//		   x = event.pageX;
//		   y = event.pageY;
//	  }else {
//		   x = event.clientX + document.body.scrollLeft +
//	            document.documentElement.scrollLeft;
//		   y = event.clientY + document.body.scrollTop +
//	            document.documentElement.scrollTop;
//	 }
//	       x -= parseInt(this.canvas.offset().left);
//	       y -= parseInt(this.canvas.offset().top);
//	       
//	       
//  },
mouseUp(event){
    event.preventDefault();
	if (this.getModel().getUnit() == null) { 
			 return; 
    }
	this.canvas.off('mousemove',j$.proxy(this.mouseDrag,this));
	this.canvas.on('mousemove',j$.proxy(this.mouseMove,this));
	
    var scaledEvent =this.getScaledEvent(event);

	if (this.getEventMgr().getTargetEventHandle() != null) {
            this.getEventMgr().getTargetEventHandle().mouseReleased(scaledEvent);
    }      
	   	
}
mouseDrag(event){
    event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
			 return; 
	  }
       
     var scaledEvent =this.getScaledEvent(event);  
	  
	if(event.button==0&&this.getEventMgr().getTargetEventHandle() != null) {		
            this.getEventMgr().getTargetEventHandle().mouseDragged(scaledEvent);
      }
	   
  }
mouseMove(event){
	   event.preventDefault();
	   if (this.getModel().getUnit() == null) { 
			return; 
	   }
	   
	   var scaledEvent =this.getScaledEvent(event);  
	     
	   if(this.getEventMgr().getTargetEventHandle() != null) {		
	            this.getEventMgr().getTargetEventHandle().mouseMove(scaledEvent);
	   }

  }
mouseDown(event){
    event.preventDefault();

	if (this.getModel().getUnit() == null) { 
	   return; 
	}

    this.canvas.on('mousemove',j$.proxy(this.mouseDrag,this));
    this.canvas.off('mousemove',j$.proxy(this.mouseMove,this));
    
	//****Dynamic event handling
    var scaledEvent =this.getScaledEvent(event);
	

	if(this.getModel().getUnit()==null){
          this.getEventMgr().resetEventHandle();
    }else{
    	switch (this.getMode()){
    	case  core.ModeEnum.COMPONENT_MODE:
          if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
              this.getEventMgr().setEventHandle("origin",null); 
        	  break;
          }  
    		
    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y);
		  if(shape!=null){
                if(shape instanceof Arc){
                     if(shape.isStartAnglePointClicked(scaledEvent.x , scaledEvent.y)){ 
                         this.getEventMgr().setEventHandle("arc.start.angle",shape);                    
                     }else if(shape.isExtendAnglePointClicked(scaledEvent.x , scaledEvent.y)){
                         this.getEventMgr().setEventHandle("arc.extend.angle",shape);                      
                     }else if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y)){
                    	  this.getEventMgr().setEventHandle("arc.mid.point",shape);
                     }else{
                          this.getEventMgr().setEventHandle("resize",shape);    
                     }
                    }else{
						this.getEventMgr().setEventHandle("resize",shape); 
                    }
			
 
		  }else{
		     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
		     
		     if(shape!=null){
			   if (core.UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes) && shape.isSelected()){
                 this.getEventMgr().setEventHandle("block", null);						 
		       }else if ((!(shape instanceof GlyphLabel))&&(undefined !=shape['getChipText'])&&shape.getChipText().isClicked(scaledEvent.x, scaledEvent.y)){
			     this.getEventMgr().setEventHandle("texture",shape);
               }else
		         this.getEventMgr().setEventHandle("move",shape);
		     }else{
		         this.getEventMgr().setEventHandle("component",null);
		     }
		  }
		  break;
    	case core.ModeEnum.LINE_MODE:
            //***is this a new wire
            if ((this.getEventMgr().getTargetEventHandle() == null) ||
                !(this.getEventMgr().getTargetEventHandle() instanceof LineEventHandle)) {

                shape = new Line(core.MM_TO_COORD(0.3),core.Layer.SILKSCREEN_LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                
            	this.getEventMgr().setEventHandle("line", shape);
            }
    	  break;
    	case core.ModeEnum.DRAGHEAND_MODE:  
    		this.getEventMgr().setEventHandle("dragheand", null);
    	  break;	
    	case core.ModeEnum.MEASUMENT_MODE:
                if ((this.getEventMgr().getTargetEventHandle() != null) ||
                    (this.getEventMgr().getTargetEventHandle() instanceof events.MeasureEventHandle)) {
                     this.getModel().getUnit().ruler.resizingPoint=null;
                     this.getEventMgr().resetEventHandle();
                     this.Repaint();
                }else{
                   this.getEventMgr().setEventHandle("measure",this.getModel().getUnit().ruler);   
				   this.getModel().getUnit().ruler.setX(scaledEvent.x);
				   this.getModel().getUnit().ruler.setY(scaledEvent.y);                   
                }
		  break;
		}
	}
	
	if (this.getEventMgr().getTargetEventHandle() != null) {
      this.getEventMgr().getTargetEventHandle().mousePressed(scaledEvent);
    } 
	
  }
mouseWheelMoved(event){
      event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		return; 
	  }
	var e=this.getScaledEvent(event);
	if(event.originalEvent.wheelDelta /120 > 0) {
		   this.ZoomIn(e.windowx,e.windowy);
        }
        else{
		   this.ZoomOut(e.windowx,e.windowy);
        }
  }
ZoomIn(x,y){
        if(this.getModel().getUnit().getScalableTransformation().ScaleOut()){
            this.viewportWindow.scalein(x,y, this.getModel().getUnit().getScalableTransformation());
            this.Repaint();         
        }else{
            return false;
        } 
		this.hbar.off(); 
		this.vbar.off(); 
		//set new maximum 
		this.hbar.jqxScrollBar({ value:this.viewportWindow.x,width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
		this.vbar.jqxScrollBar({ value:this.viewportWindow.y,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});
		
		this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
		this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
		
		return true;
  }
ZoomOut(x,y){
        if(this.getModel().getUnit().getScalableTransformation().ScaleIn()){
                this.viewportWindow.scaleout(x,y, this.getModel().getUnit().getScalableTransformation());
                this.Repaint();                       
        }else{
                return false;
        }

		this.hbar.off(); 
		this.vbar.off(); 
                  //set new maximum 
	   	this.hbar.jqxScrollBar({value:this.viewportWindow.x, width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
		this.vbar.jqxScrollBar({value:this.viewportWindow.y, width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});
	
		this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
		this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
		
		return true;
  }
vStateChanged(event){
    this.viewportWindow.y= parseInt(event.currentValue);
    this.Repaint();
	
  }
hStateChanged(event){
    this.viewportWindow.x= parseInt(event.currentValue);
    this.Repaint();
  }
screenResized(e){	  
	  var container = j$('#mycanvasframe');	  
	  var oldwidth=this.width;
	  this.width=j$(container).width()-18;  //mind combo width
	  
	  if(oldwidth==this.width){
		  return;
	  }
	  //set canvas width
	  this.canvas.attr('width',this.width);
	  this.componentResized();
	  this.Repaint();
}
componentResized(){
      if(this.getModel().getUnit()==null){
    	  this.setSize(1,1);
    	  this.hbar.jqxScrollBar({ width: this.width, height: 18, min: 0, max: 1});
		  this.vbar.jqxScrollBar({ width: 18, min: 0, max: 1, vertical: true});
      }else{
    	this.setSize(this.width,this.height); 
        
    	var hCurrentValue = this.hbar.jqxScrollBar('value');
        var vCurrentValue = this.vbar.jqxScrollBar('value');
    	
    	
  		this.hbar.jqxScrollBar({ value:hCurrentValue,width:this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
  		this.vbar.jqxScrollBar({ value:vCurrentValue,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height), vertical: true});
      }  
	  
  }
Repaint(){
	  if(this.getModel().getUnit()!=null){
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0, 0, this.width, this.height); 
		this.getModel().getUnit().paint(this.ctx,this.viewportWindow);
        if (this.getContainerCursor() != null) {
        	this.getContainerCursor().Paint(this.ctx,this.viewportWindow, this.getModel().getUnit().getScalableTransformation());

        }
	  }else{
	        this.ctx.clearRect(0, 0, this.width, this.height);  
	  }
  }
 
}


module.exports ={
	   FootprintContainer,
	   Footprint,
	   FootprintComponent	   
}