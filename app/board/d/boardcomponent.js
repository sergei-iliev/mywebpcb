var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var events=require('core/events');
var BoardShapeFactory=require('board/shapes').BoardShapeFactory;
var BoardEventMgr = require('board/events').BoardEventMgr;
var CompositeLayer = require('core/core').CompositeLayer;
var BoardContextMenu=require('board/popup/boardpopup').BoardContextMenu;
var PCBFootprint=require('board/shapes').PCBFootprint;
var PCBLabel=require('board/shapes').PCBLabel;
var PCBCircle=require('board/shapes').PCBCircle;
var PCBArc=require('board/shapes').PCBArc;

var shapes=require('pads/shapes');
//**********************UnitMgr***************************************
var BoardMgr=(function(){
	var instance=null;

class manager{
	createPCBFootprint(footprint,activeSide) {
        var pcbfootprint = new PCBFootprint(core.Layer.LAYER_FRONT);
        var len=footprint.shapes.length;
 	    for(var i=0;i<len;i++){
 	    	var shape=footprint.shapes[i];
	               if (shape instanceof shapes.GlyphLabel) {
	   				 if(shape.texture.tag=="value"){
	   					pcbfootprint.getChipText().getTextureByTag("value").copy(shape.texture); 
	   					pcbfootprint.getChipText().getTextureByTag("value").layermaskId=shape.copper.getLayerMaskID();
	   					continue;
	   				 }
	   				 if(shape.texture.tag=="reference"){
		   			    pcbfootprint.getChipText().getTextureByTag("reference").copy(shape.texture); 
		   			    pcbfootprint.getChipText().getTextureByTag("reference").layermaskId=shape.copper.getLayerMaskID();
		   			    continue;
	   				 }  
	               }
	         
	         pcbfootprint.add(shape.clone());
	               
	               
	    }
        pcbfootprint.setDisplayName(footprint.name);
        pcbfootprint.units=footprint.getGrid().getGridUnits();
        pcbfootprint.value=footprint.getGrid().getGridValue();
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
     var len=this.shapes.length;
	 for(var i=0;i<len;i++){
         var clone=this.shapes[i].clone();
	       copy.add(clone);
	 }
	 copy.silent=false;
	 return copy;
	}	
}

class BoardContainer extends UnitContainer{
constructor(silent) {
      super(silent);
  	  this.formatedFileName="Boards";
  	}
}

class BoardComponent extends UnitComponent{
constructor(hbar,vbar,canvas,popup) {
     super(hbar,vbar,canvas,popup);    
	
	this.eventMgr=new BoardEventMgr(this); 
	this.model=new BoardContainer();
	this.popup=new BoardContextMenu(this,popup);
      
}
setMode(_mode){
	  this.mode=_mode;
	  let shape=null;
      if (this.cursor != null) {
          this.cursor.Clear();
          this.cursor = null;
      }
      this.eventMgr.resetEventHandle();
      
      switch (this.mode) {
      case core.ModeEnum.RECT_MODE:
//          shape=new mywebpads.Pad(this.getModel().getUnit(),0,0,mywebpads.Grid.MM_TO_COORD(1.6),mywebpads.Grid.MM_TO_COORD(1.6));
//          shape.drill=(new mywebpads.Drill(null,mywebpads.Grid.MM_TO_COORD(0.8),mywebpads.Grid.MM_TO_COORD(0.8)));
//          this.setContainerCursor(shape);               
//          this.getEventMgr().setEventHandle("cursor",shape);  
        break;
//      case  mywebpads.ModeEnum.RECT_MODE:
//          shape=new mywebpads.RoundRect(this.getModel().getUnit(),0,0,mywebpads.Grid.MM_TO_COORD(4),mywebpads.Grid.MM_TO_COORD(4),mywebpads.Grid.MM_TO_COORD(0.8),mywebpads.Grid.MM_TO_COORD(0.2));
//          this.setContainerCursor(shape);               
//          this.getEventMgr().setEventHandle("cursor",shape); 
//        break;
//      case  mywebpads.ModeEnum.LINE_MODE:
//        
//        break;
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
//      case  mywebpads.ModeEnum.LABEL_MODE:
//          shape=new mywebpads.Label(this.getModel().getUnit(),0,0,mywebpads.Grid.MM_TO_COORD(1));
//          this.setContainerCursor(shape);               
//          this.getEventMgr().setEventHandle("cursor",shape); 
//        break;
      case core.ModeEnum.ORIGIN_SHIFT_MODE:  
          this.eventMgr.setEventHandle("origin",null);   
          break;          
      default:
        this.Repaint();
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
         		
          if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
              this.getEventMgr().setEventHandle("origin",null); 
        	  break;
          }  
    		
    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y);
		  if(shape!=null){
            this.getEventMgr().setEventHandle("resize",shape);  
		  }else{
		     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
		     
		     if(shape!=null){
			   if (UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes) && shape.isSelected()){					   
                 this.getEventMgr().setEventHandle("block", shape);						 
		       }else if ((!(shape instanceof PCBLabel))&&(undefined !=shape['getChipText'])&&shape.getChipText().isClicked(scaledEvent.x, scaledEvent.y)){
			     this.getEventMgr().setEventHandle("texture",shape);
               }else if(shape instanceof PCBFootprint){
            	 this.getEventMgr().setEventHandle("symbol",shape);
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
                !(this.getEventMgr().getTargetEventHandle() instanceof mywebpads.LineEventHandle)) {
//
//                shape = new mywebpads.Line(this.getModel().getUnit(),mywebpads.Grid.MM_TO_COORD(0.2));
//                this.getModel().getUnit().Add(shape);
//                
//            	this.getEventMgr().setEventHandle("line", shape);
            }
	  break;
    	case core.ModeEnum.DRAGHEAND_MODE:  
    		this.getEventMgr().setEventHandle("dragheand", null);
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