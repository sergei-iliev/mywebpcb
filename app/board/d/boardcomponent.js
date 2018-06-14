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
var PCBVia=require('board/shapes').PCBVia;
var PCBHole=require('board/shapes').PCBHole;
var PCBLine=require('board/shapes').PCBLine;
var PCBRoundRect=require('board/shapes').PCBRoundRect;
var PCBCopperArea=require('board/shapes').PCBCopperArea;
var PCBTrack=require('board/shapes').PCBTrack;

var LineEventHandle=require('pads/events').LineEventHandle;
var CopperAreaEventHandle=require('board/events').CopperAreaEventHandle;

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
	 copy.unitName=this.unitName;
     var len=this.shapes.length;
	 for(var i=0;i<len;i++){
         var clone=this.shapes[i].clone();
	       copy.add(clone);
	 }
	 copy.silent=false;
	 return copy;
	}
paint(g2, viewportWindow){
	   let len=this.shapes.length;
 	   for(let i=0;i<len;i++){
 		   this.shapes[i].Paint(g2,viewportWindow,this.scalableTransformation);  
 	   }
 	   this.shapes.forEach(function(shape){
 	    if (shape instanceof PCBTrack || shape instanceof PCBCopperArea) {
           shape.drawControlShape(g2, viewportWindow,this.scalableTransformation);
        }
 	   },this);
 	   //grid
        this.grid.paint(g2,viewportWindow,this.scalableTransformation);
        //coordinate system
        this.coordinateSystem.Paint(g2, viewportWindow,this.scalableTransformation);
		//ruler
		this.ruler.Paint(g2, viewportWindow,this.scalableTransformation);
        //frame
        this.frame.paint(g2, viewportWindow,this.scalableTransformation);
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
}

class BoardContainer extends UnitContainer{
constructor(silent) {
      super(silent);
  	  this.fileName="Boards";
  	}
parse(xml){
	  this.filename=(j$(xml).find("filename").text());
	  this.libraryname=(j$(xml).find("library").text());
	  this.categoryname=(j$(xml).find("category").text()); 	

	  var that=this;
      j$(xml).find("board").each(j$.proxy(function(){
    	var board=new Board(j$(this).attr("width"),j$(this).attr("height"));
    	//silent mode
    	board.silent=that.silent;
    	//need to have a current unit 
        that.add(board);
        board.parse(this);
    }),that);	
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
              if(shape instanceof PCBArc){
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
                !(this.getEventMgr().getTargetEventHandle() instanceof LineEventHandle)) {
               	if(event.which!=1){
            		return;
            	}
                shape = new PCBTrack(core.MM_TO_COORD(0.4),core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);                
            	this.getEventMgr().setEventHandle("line", shape);
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
}










module.exports ={
		   BoardContainer,
		   Board,
		   BoardMgr,
		   BoardComponent	   
}