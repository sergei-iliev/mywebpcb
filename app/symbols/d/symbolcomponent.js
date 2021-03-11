var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var SymbolType = require('core/core').SymbolType;
var events=require('core/events');
var RoundRect=require('symbols/shapes').RoundRect;
var FontLabel=require('symbols/shapes').FontLabel;
var Ellipse=require('symbols/shapes').Ellipse;
var Line=require('symbols/shapes').Line;
var Arc=require('symbols/shapes').Arc;
var Pin=require('symbols/shapes').Pin;
var ArrowLine=require('symbols/shapes').ArrowLine;
var Triangle=require('symbols/shapes').Triangle;
var SymbolContextMenu=require('symbols/popup/symbolpopup').SymbolContextMenu;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var SymbolEventMgr = require('symbols/events').SymbolEventMgr;
var LineEventHandle=require('core/events').LineEventHandle;
var DefaultLineBendingProcessor=require('core/line/linebendingprocessor').DefaultLineBendingProcessor;
var d2=require('d2/d2');
var utilities=require('core/utilities');


//**********************UnitMgr***************************************
var SymbolMgr=(function(){
	var instance=null;

class manager{
	getLabels(unit) {		
        var len=symbol.shapes.length;
          
    }       
    
    }
	return {getInstance:function(){
		    if (!instance) {
              instance = new manager();
            }
            return instance;
	      }
	};
		
	
})();
class Symbol extends Unit{
constructor(width,height) {
       super(width,height);
       this.scalableTransformation.reset(1.2,2,2,15);
	   this.shapeFactory = new SymbolShapeFactory();
       this.grid.setGridUnits(8, core.Units.PIXEL);
       this.grid.pointsColor='#000000'; 
       this.type=SymbolType.SYMBOL;
       this.isTextLayoutVisible = false;
       this.frame.color='#000000';
	}
clone(){
	  var copy=new Symbol(this.width,this.height);
	  //copy.silent=true;
	  copy.unitName=this.unitName;
	  copy.grid=this.grid.clone();

      var len=this.shapes.length;
	  for(var i=0;i<len;i++){
           var clone=this.shapes[i].clone();
	       copy.add(clone);
	  }
	  //copy.silent=false;
	  return copy;
	}	
parse(data){
	 	   this.unitName=j$(data).find("name").first().text();
	 	   var reference=j$(data).find("reference");
	 	   var value=j$(data).find("unit");
	 	  
	 	   if(reference!=null&&reference.text()!=''){
		        var label = new FontLabel(0,0);
		        if(reference[0].children[0]){
		          label.fromXML(reference[0].children[0]);   //new schema
		        }else{
		          label.fromXML(reference[0]);	
		        }
		        label.texture.tag="reference";
		        this.add(label);      		 	      
	 	   }
	 	   if(value!=null&&value.text()!=''){
		        var label = new FontLabel(0,0);
		        if(value[0].children[0]){
		        	label.fromXML(value[0].children[0]);  //new schema
		        }else{
		        	label.fromXML(value[0]);  
		        }
		        label.texture.tag="unit";
		        this.add(label);  
	 	   }
	 	   var that=this;
	 	   j$(data).find('elements').children().each(function(){
               var shape=that.shapeFactory.createShape(this);
               that.add(shape);
	 	   });
	}	
setTextLayoutVisibility( isTextLayoutVisible) {
    this.isTextLayoutVisible = isTextLayoutVisible;
    this.shapes.forEach((shape)=>{            
        if(shape instanceof Pin){
          shape.name.isTextLayoutVisible=isTextLayoutVisible;
          shape.number.isTextLayoutVisible=isTextLayoutVisible;
        }  
       });
}
format(){   
   var xml="<module width=\""+ this.width +"\" height=\""+this.height+"\">\r\n"; 
   xml+="<name>"+this.unitName+"</name>\r\n";
   //***reference
   var text=UnitMgr.getInstance().getLabelByTag(this,'reference');
   if(text!=null){
       xml+="<reference>";
       xml+=text.toXML();
       xml+="</reference>\r\n";
   } 
   //value
   text=UnitMgr.getInstance().getLabelByTag(this,'unit');
   if(text!=null){
       xml+="<unit>";
       xml+=text.toXML();
       xml+="</unit>\r\n";
   }    
 
   xml+="<elements>\r\n";
   this.shapes.forEach(function(shape) {
	   if(!((shape instanceof FontLabel)&&(shape.texture.tag=='reference'||shape.texture.tag=='unit'))){
		   xml+=shape.toXML();  
	   }
   });
   xml+="</elements>\r\n";   
   xml+="</module>";
   return xml;
}	
}

class SymbolContainer extends UnitContainer{
    constructor() {
       super();
       this.formatedFileName="Symbols"
	}
    getType() {
        if(this.unitsmap.size==0){
          return Type.SYMBOL;  //default
        }else{    		
          return this.getUnits().next().value.type; 
        }
    }
    
    setType(type) {
      let units=this.unitsmap.values();
  	  for(let i=0;i<this.unitsmap.size;i++){
          let aunit=units.next();
  		  aunit.value.type=type;
  	  }
    }
    parse(xml){
    	  this.setFileName(j$(xml).find("filename").text());
    	  this.libraryname=(j$(xml).find("library").text());
    	  this.categoryname=(j$(xml).find("category").text());    	  
    	 
    	  var that=this;
	      j$(xml).find("module").each(j$.proxy(function(){
	    	var symbol=new Symbol(j$(this).attr("width"),j$(this).attr("height"));	    	    
	    	//silent mode
	    	//footprint.silent=that.silent;
	    	//need to have a current unit
            that.add(symbol);
            symbol.parse(this);
	    }),that);	
    }
    format() {
        var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n"; 
        xml+="<modules identity=\"Symbol\" type=\""+core.SymbolType.valueOf(this.getType())+"\" version=\""+utilities.version.SYMBOL_VERSION+"\">\r\n";      
    	let units=this.unitsmap.values();
  	    for(let i=0;i<this.unitsmap.size;i++){
          let unit=units.next().value;
          xml+=unit.format();
  		  xml+="\r\n";
  	    }    	    	
        xml+="</modules>";
        console.log(xml);
        return xml;
    }
	
}


class SymbolComponent extends UnitComponent{
  constructor(hbar,vbar,canvas,popup) {
	super(hbar,vbar,canvas,popup); 
	
	this.eventMgr=new SymbolEventMgr(this); 
	this.model=new SymbolContainer();
	this.popup=new SymbolContextMenu(this,popup);
	this.backgroundColor='white';  
	this.lineBendingProcessor=new DefaultLineBendingProcessor();  
}
setMode(_mode){
	this.mode=_mode;
	let shape=null;
	 if (this.cursor != null) {
	     this.cursor.clear();
	     this.cursor = null;
	 }
	 this.eventMgr.resetEventHandle();
	        
	 switch (this.mode) {
     		case core.ModeEnum.SOLID_REGION:
         	break;	 
	        case core.ModeEnum.ARROW_MODE:
	            shape=new ArrowLine();	            	            		                        
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	          break;
	        case core.ModeEnum.TRIANGLE_MODE:
	            shape=new Triangle();	            	            		                        
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	          break;
	        case  core.ModeEnum.RECT_MODE:
	            shape=new RoundRect(0,0,15,15,0,1);	            
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.LINE_MODE:
	          
	          break;
	        case  core.ModeEnum.ELLIPSE_MODE:	
	            shape=new Ellipse(20,15);
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.ARC_MODE:
	        	shape=new Arc(0,0,30,40);
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case core.ModeEnum.PIN_MODE:
	            shape=new Pin();
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	            break;	          
	        case  core.ModeEnum.LABEL_MODE:
	            shape=new FontLabel(0,0);			
		        this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case core.ModeEnum.ORIGIN_SHIFT_MODE:  
	            this.getEventMgr().setEventHandle("origin",null);   
	            break;          
	        default:
	          this.repaint();
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
         if(this.getModel().getUnit().getCoordinateSystem()!=null){ 
    	  if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
              this.getEventMgr().setEventHandle("origin",null); 
        	  break;
          } 
         }
    		
    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y);
    	  if(shape!=null){
                if(shape instanceof Arc){
                     if(shape.isStartAnglePointClicked(scaledEvent.x , scaledEvent.y)){ 
                         this.getEventMgr().setEventHandle("arc.start.angle",shape);                    
                     }else if(shape.isExtendAnglePointClicked(scaledEvent.x , scaledEvent.y)){
                         this.getEventMgr().setEventHandle("arc.extend.angle",shape);                      
//                     }else if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y)){
//                    	  this.getEventMgr().setEventHandle("arc.mid.point",shape);
                     }else{
                          this.getEventMgr().setEventHandle("resize",shape);    
                     }
                   }else{
						this.getEventMgr().setEventHandle("resize",shape); 
                    }
			
 
		  }else{		    		     
		     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
		     
		     if(shape!=null){
		       if ((UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes)&& shape.isSelected())||event.ctrlKey){			   
                 this.getEventMgr().setEventHandle("block", shape);						 
		       }else if ((!(shape instanceof FontLabel))&&(undefined !=shape['getTextureByTag'])&&shape.getClickedTexture(scaledEvent.x, scaledEvent.y)!=null){
			     this.getEventMgr().setEventHandle("texture",shape);
               }else
		         this.getEventMgr().setEventHandle("move",shape);
		     }else{
		         this.getEventMgr().setEventHandle("component",null);
		     }		     
		     
		  }
		  break;
    	case core.ModeEnum.SOLID_REGION:
            //is this a new copper area
            if ((this.getEventMgr().targetEventHandle == null) ||
                !(this.getEventMgr().targetEventHandle instanceof SolidRegionEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape =new SolidRegion(core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                this.getEventMgr().setEventHandle("solidregion", shape);
            }     		
    		break;
    	case core.ModeEnum.LINE_MODE:
            //***is this a new wire
            if ((this.getEventMgr().getTargetEventHandle() == null) ||
                !(this.getEventMgr().getTargetEventHandle() instanceof LineEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape = new Line(1);
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
                     this.repaint();
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
}


module.exports ={
	   SymbolMgr,	
	   SymbolContainer,
	   Symbol,
	   SymbolComponent	   
}