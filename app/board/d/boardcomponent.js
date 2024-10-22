var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var utilities = require('core/utilities');
var events=require('core/events');
var BoardShapeFactory=require('board/shapes').BoardShapeFactory;
var BoardEventMgr = require('board/events').BoardEventMgr;
var CompositeLayer = require('core/core').CompositeLayer;
var BoardContextMenu=require('board/popup/boardpopup').BoardContextMenu;
var PCBFootprint=require('board/shapes').PCBFootprint;
var PCBLabel=require('board/shapes').PCBLabel;
var PCBCircle=require('board/shapes').PCBCircle;
var PCBArc=require('board/shapes').PCBArc;
var PCBVia=require('board/shapes').PCBVia;
var PCBHole=require('board/shapes').PCBHole;
var PCBLine=require('board/shapes').PCBLine;
var PCBRoundRect=require('board/shapes').PCBRoundRect;
var PCBCopperArea=require('board/shapes').PCBCopperArea;
var PCBTrack=require('board/shapes').PCBTrack;
var PCBSolidRegion=require('board/shapes').PCBSolidRegion;
var SolidRegionEventHandle=require('pads/events').SolidRegionEventHandle;
var d2=require('d2/d2');

var LineEventHandle=require('core/events').LineEventHandle;
var CopperAreaEventHandle=require('board/events').CopperAreaEventHandle;
var TrackEventHandle=require('board/events').TrackEventHandle;
var DefaultLineBendingProcessor=require('core/line/linebendingprocessor').DefaultLineBendingProcessor;

var shapes=require('pads/shapes');
//**********************UnitMgr***************************************
var BoardMgr=(function(){
	var instance=null;

class manager{
	deleteBoardOutlineShapes(board){
	  	let uuids=[];
	  	for(let shape of board.shapes){	  		
	  		if((shape.copper.getLayerMaskID()&core.Layer.BOARD_OUTLINE_LAYER)!=0){
	  		  uuids.push(shape.uuid);
	  		}
	  	}
	  	for(let uuid of uuids){
	  	   board.remove(uuid);
	  	} 
	  	
	}
	createPCBFootprint(footprint,activeSide) {
        var pcbfootprint = new PCBFootprint(core.Layer.LAYER_FRONT);
        var len=footprint.shapes.length;
 	    for(var i=0;i<len;i++){
 	    	var shape=footprint.shapes[i];
	               if (shape instanceof shapes.GlyphLabel) {
	   				 if(shape.texture.tag=="value"){
	   					pcbfootprint.value.copy(shape.texture); 
	   					pcbfootprint.value.layermaskId=shape.copper.getLayerMaskID();
	   					continue;
	   				 }
	   				 if(shape.texture.tag=="reference"){
		   			    pcbfootprint.reference.copy(shape.texture); 
		   			    pcbfootprint.reference.layermaskId=shape.copper.getLayerMaskID();
		   			    continue;
	   				 }  
	               }
	         
	         pcbfootprint.add(shape.clone());
	               
	               
	    }
 	    pcbfootprint.setDisplayName(footprint.unitName);
        pcbfootprint.units=footprint.getGrid().getGridUnits();
        pcbfootprint.val=footprint.getGrid().getGridValue();
 	    return pcbfootprint; 	          
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
class Board extends Unit{
constructor(width,height) {
  super(width,height); 
  this.shapeFactory = new BoardShapeFactory();
  this.compositeLayer = new CompositeLayer();  
}	
clone(){
	 var copy=new Board(this.width,this.height);
	 copy.silent=true;	 
	 copy.grid=this.grid.clone();
	 copy.unitName=this.unitName;
     var len=this.shapes.length;
	 for(var i=0;i<len;i++){
         var clone=this.shapes[i].clone();
	       copy.add(clone);
	 }
	 copy.silent=false;
	 return copy;
	}
add(shape){
    if (this.shapes.length == 0) {
        super.add(shape);
    } else {
    	let len=this.shapes.length;
    	shape.owningUnit=this;
    	for(let i=0;i<len;i++){                      
            if (this.shapes[i].getDrawingLayerPriority() >= shape.getDrawingLayerPriority()) {             
                this.shapes.splice(i, 0,shape);           	    
        	    this.fireShapeEvent({target:shape,type:events.Event.ADD_SHAPE});
                return;
            }
    	}
        super.add(shape);
    }
}
buildClickedShapesList(x,  y,  isTextIncluded){	
	   var orderElements = [];
	   let len=this.shapes.length;
	   for(i=len;i-->0;){   
	       if(isTextIncluded){
	    	if((undefined !=this.shapes[i]['getTextureByTag'])&&this.shapes[i].getClickedTexture(x, y)){                               
	             orderElements.splice(0, 0, this.shapes[i]);
	             continue;
	        }
	       }     	       
	       if(this.isShapeVisibleOnLayers(this.shapes[i])&&this.shapes[i].isClickedOnLayers(x, y,this.compositeLayer.getLayerMaskID())){	   
	          orderElements.push(this.shapes[i]);	       
	       }  
	   }
	   return orderElements;
}

getClickedShape( x,  y,  isTextIncluded) {
        let clickedShapes = this.buildClickedShapesList(x,y,isTextIncluded);
        if(clickedShapes.length==0){
            return null;
        }
        //Text?       
		if((undefined !=clickedShapes[0]['getTextureByTag'])&&clickedShapes[0].getClickedTexture(x, y)){                                            
             return clickedShapes[0];
        }
                
        let result=null;
        for(let shape of clickedShapes){
            if(result==null){
                result=shape;
            }else if(shape.getDrawingLayerPriority()==result.getDrawingLayerPriority()){
                if(shape.getClickableOrder()<result.getClickableOrder()){
                    result=shape;
                }
            }
        
        }
        return result;  
}
reorder(){
    this.shapes.sort(function(a,b){
		if (a.getDrawingLayerPriority() > b.getDrawingLayerPriority()) {  
			return 1;
		}else if(a.getDrawingLayerPriority() < b.getDrawingLayerPriority()){
			return -1;
		}else
			return 0;
	});
}
setActiveSide(side) {
    this.compositeLayer.activeSide=side;
    this.reorder();
}
selectNetAt(target){
   let targets=new core.Queue();	   
   targets.enqueue(target);
   
   let selectedShapes=new Set();
   selectedShapes.add(target.uuid);
   
   while(!targets.isEmpty()){
	   let shape=targets.dequeue();  
	   let list=shape.getNetShapes(selectedShapes);
       for(let item of list){
           if(!selectedShapes.has(item.uuid)){
               selectedShapes.add(item.uuid);
               targets.enqueue(item);
           }
       }
   }
  
   for(let  uuid of selectedShapes){
       this.getShape(uuid).setSelected(true);
   }
}

paint(g2, viewportWindow){
	   let len=this.shapes.length;
 	   for(let i=0;i<len;i++){ 		 
 		 if((this.shapes[i] instanceof PCBFootprint)||(this.shapes[i].copper.getLayerMaskID()&this.compositeLayer.getLayerMaskID())!=0){   		   
 			 this.shapes[i].paint(g2,viewportWindow,this.scalableTransformation,this.compositeLayer.getLayerMaskID());
 		 }
 	   }
 	   this.shapes.forEach((shape)=>{ 	    	
			if ((typeof shape.drawControlShape === 'function')&&shape.isSelected()) {					                
				shape.drawControlShape(g2, viewportWindow,this.scalableTransformation);
        	}
 	   });
 	   //grid
       this.grid.paint(g2,viewportWindow,this.scalableTransformation);
        //coordinate system
       if(this.coordinateSystem!=null){
         this.coordinateSystem.paint(g2, viewportWindow,this.scalableTransformation);
       }	
         //ruler
	   this.ruler.paint(g2, viewportWindow,this.scalableTransformation);
        //frame
       if(this.frame!=null){
	     this.frame.paint(g2, viewportWindow,this.scalableTransformation);
       }
}
parse(data){	
	this.unitName=j$(data).find("name").first().text();
	this.grid.setGridUnits(j$(data).find("units").first().attr("raster"),core.Units.MM);
	var that=this;
	
   	j$(data).find('symbols').children().each(function(){   	  
   	   var shape=that.shapeFactory.createShape(this);   	   
       if(shape!=null){    
         that.add(shape);
       }	  
   	});	
}
format(){   
	   var xml="<board width=\""+ this.width +"\" height=\""+this.height+"\">\r\n"; 
	   xml+="<name>"+this.unitName+"</name>\r\n";
	   xml+="<units raster=\"" + this.grid.getGridValue() + "\">MM</units>\r\n";
	   
	   xml+="<symbols>\r\n";
	   this.shapes.forEach(s=>{
		  xml+=s.toXML()+"\r\n";
	   });
	   xml+="</symbols>\r\n";   
	   xml+="</board>";
	   return xml;
	}	


}

class BoardContainer extends UnitContainer{
constructor() {
      super();
  	  this.formatedFileName="Boards";
  	}
parse(xml){
	  this.workspacename=(j$(xml).find("workspaceName").text());	   	
	  this.setFileName(j$(xml).find("projectName").text());
	  var that=this;
	  
      j$(xml).find("board").each(j$.proxy(function(){
    	var board=new Board(Number.parseInt(j$(this).attr("width")),Number.parseInt(j$(this).attr("height")));
    	//need to have a current unit 
        that.add(board);
        board.parse(this);
    }),that);	
}
format() {
    var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n"; 
    xml+="<boards identity=\"Board\" version=\""+utilities.version.BOARD_VERSION+"\">\r\n";      
	let units=this.unitsmap.values();
	for(let i=0;i<this.unitsmap.size;i++){
      let unit=units.next().value;
      xml+=unit.format();
	  xml+="\r\n";
	}    	    	
    xml+="</boards>";
    return xml;
}

}

class BoardComponent extends UnitComponent{
constructor(canvas,popup) {
     super(canvas,popup);    
	
	this.eventMgr=new BoardEventMgr(this); 
	this.model=new BoardContainer();
	this.popup=new BoardContextMenu(this,popup);
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
      	
      case core.ModeEnum.HOLE_MODE:          
          shape = new PCBHole();
          this.setContainerCursor(shape);
          this.getEventMgr().setEventHandle("cursor", shape);
          break;      
      case core.ModeEnum.VIA_MODE:          
          shape = new PCBVia();
          this.setContainerCursor(shape);
          this.getEventMgr().setEventHandle("cursor", shape);
          break;
      case  core.ModeEnum.RECT_MODE:
          shape=new PCBRoundRect(0,0,core.MM_TO_COORD(4),core.MM_TO_COORD(4),core.MM_TO_COORD(1),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);
          this.setContainerCursor(shape);               
          this.getEventMgr().setEventHandle("cursor",shape); 
        break;
      case  core.ModeEnum.ELLIPSE_MODE:
          shape=new PCBCircle(0,0,core.MM_TO_COORD(4),core.MM_TO_COORD(0.2), core.Layer.SILKSCREEN_LAYER_FRONT);
          this.setContainerCursor(shape);               
          this.eventMgr.setEventHandle("cursor",shape); 
        break;
      case  core.ModeEnum.ARC_MODE:
      	  shape=new PCBArc(0,0,core.MM_TO_COORD(4),core.MM_TO_COORD(0.2), core.Layer.SILKSCREEN_LAYER_FRONT);
          this.setContainerCursor(shape);               
          this.getEventMgr().setEventHandle("cursor",shape); 
        break;
      case  core.ModeEnum.LABEL_MODE:
          shape=new PCBLabel(core.Layer.SILKSCREEN_LAYER_FRONT);
          this.setContainerCursor(shape);               
          this.getEventMgr().setEventHandle("cursor",shape); 
        break;
      case core.ModeEnum.ORIGIN_SHIFT_MODE:  
          this.eventMgr.setEventHandle("origin",null);   
          break;          
      default:
        this.repaint();
    }       
}

mouseDown(event){
    event.preventDefault();
    //this.canvas.focus();
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
               /*
                * 1.Coordinate origin
                * 2.Control rect/reshape point
                * 3.selected shapes comes before control points
                */	 
    	  if(this.getModel().getUnit().getCoordinateSystem()!=null){ 		
           if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
              this.getEventMgr().setEventHandle("origin",null); 
        	  break;
           }  
    	  }
    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y,this.viewportWindow);
		  if(shape!=null){                                    
                if(shape instanceof PCBArc){
                	if(shape.arcType==core.ArcType.CENTER_POINT_ARC){
                     if(shape.isStartAnglePointClicked(scaledEvent.x , scaledEvent.y,this.viewportWindow)){ 
                         this.getEventMgr().setEventHandle("arc.start.angle",shape);                    
                     }else if(shape.isExtendAnglePointClicked(scaledEvent.x , scaledEvent.y,this.viewportWindow)){
                         this.getEventMgr().setEventHandle("arc.extend.angle",shape);                      
                     }else if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y,this.viewportWindow)){
                    	  this.getEventMgr().setEventHandle("arc.mid.point",shape,);
                     }
                	}else{    
                  	  if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y,this.viewportWindow)){
                      	  this.getEventMgr().setEventHandle("arc.mid.point",shape);
                        }else{
                      	  this.getEventMgr().setEventHandle("arc.resize",shape);
                        }
                	}
                  }else{
						this.getEventMgr().setEventHandle("resize",shape); 
                  }              
		  }else{
		     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
		     
		     if(shape!=null){
			   if ((UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes)&& shape.isSelected())||event.ctrlKey){					   
                 this.getEventMgr().setEventHandle("block", shape);						 
		       }else if ((!(shape instanceof PCBLabel))&&(undefined !=shape['getTextureByTag'])&&shape.getClickedTexture(scaledEvent.x, scaledEvent.y)!=null){
			     this.getEventMgr().setEventHandle("texture",shape);
               }else if(shape instanceof PCBFootprint){
	              //is this pad click?
                  var pad=shape.isPadClicked(scaledEvent.x, scaledEvent.y);                                                  	                                  	  	  		         
                  this.getEventMgr().setEventHandle("symbol",shape);       
				  shape.selectedPad=pad               
			   }else if(shape instanceof PCBTrack){				    
	                if(shape.isSegmentClicked(scaledEvent,this.viewportWindow)){
					  if(shape.isSingleSegment()){
			             this.getEventMgr().setEventHandle("move",shape);
                      }else{
                         this.getEventMgr().setEventHandle("move.segment",shape);
					  }
					}
		       }else
		         this.getEventMgr().setEventHandle("move",shape);
		     }else{
		         this.getEventMgr().setEventHandle("component",null);
		     }
		  }
		  break;
    	case core.ModeEnum.TRACK_MODE:
    		
            //***is this a new wire
            if ((this.getEventMgr().getTargetEventHandle() == null) ||
                !(this.getEventMgr().getTargetEventHandle() instanceof TrackEventHandle)) {
               	if(event.which!=1){
            		return;
            	}
                shape = new PCBTrack(core.MM_TO_COORD(0.4),core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);                
            	this.getEventMgr().setEventHandle("track", shape);
            }
	    break;
    	case core.ModeEnum.SOLID_REGION:
            //is this a new copper area
            if ((this.getEventMgr().targetEventHandle == null) ||
                !(this.getEventMgr().targetEventHandle instanceof SolidRegionEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape =new PCBSolidRegion(core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                this.getEventMgr().setEventHandle("solidregion", shape);
            }     		
    		break;	    
        case  core.ModeEnum.COPPERAREA_MODE:
            //is this a new copper area
            if ((this.getEventMgr().targetEventHandle == null) ||
                !(this.getEventMgr().targetEventHandle instanceof CopperAreaEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape =
                    new PCBCopperArea(core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                this.getEventMgr().setEventHandle("copperarea", shape);
            }    	  
      	  break;	    
    	case core.ModeEnum.LINE_MODE:
            //***is this a new wire
            if ((this.getEventMgr().getTargetEventHandle() == null) ||
                !(this.getEventMgr().getTargetEventHandle() instanceof LineEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape = new PCBLine(core.MM_TO_COORD(0.3),core.Layer.SILKSCREEN_LAYER_FRONT);
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
}










module.exports ={
		   BoardContainer,
		   Board,
		   BoardMgr,
		   BoardComponent	   
}