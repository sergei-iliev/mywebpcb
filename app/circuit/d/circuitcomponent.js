var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var CircuitEventMgr = require('circuit/events').CircuitEventMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var utilities = require('core/utilities');
var events=require('core/events');
var d2=require('d2/d2');
var CircuitContextMenu=require('circuit/popup/circuitpopup').CircuitContextMenu;
var shapes=require('symbols/shapes');
var SCHSymbol=require('circuit/shapes').SCHSymbol;
var SCHFontLabel=require('circuit/shapes').SCHFontLabel;
//**********************UnitMgr***************************************
var CircuitMgr=(function(){
	var instance=null;

class manager{
	createSCHSymbol(symbol) {		
        var schsymbol = new SCHSymbol();
        var len=symbol.shapes.length;
 	    for(var i=0;i<len;i++){
 	    	var shape=symbol.shapes[i];
	               if (shape instanceof shapes.FontLabel) {
	   				 if(shape.texture.tag=="unit"){
	   					schsymbol.unit.copy(shape.texture); 
	   					continue;
	   				 }
	   				 if(shape.texture.tag=="reference"){
		   			    schsymbol.reference.copy(shape.texture); 
		   			    continue;
	   				 }  
	               }
	         
	         schsymbol.add(shape.clone());
	               
	               
	    }
 	    schsymbol.setDisplayName(symbol.unitName);
 	    schsymbol.units=symbol.getGrid().getGridUnits();
 	    schsymbol.val=symbol.getGrid().getGridValue();
 	    return schsymbol; 	          
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
class Circuit extends Unit{
	constructor(width,height) {
	  super(width,height); 
      this.scalableTransformation.reset(1.2,2,2,15);
	  //this.shapeFactory = new SymbolShapeFactory();
      this.grid.setGridUnits(8, core.Units.PIXEL);
      this.grid.pointsColor='black';             
      this.frame.color='black';
	}
	
	
}
class CircuitContainer extends UnitContainer{
	constructor() {
	  super();
	  this.formatedFileName="Circuit";
	}
}
class CircuitComponent extends UnitComponent{
	constructor(hbar,vbar,canvas,popup) {
	     super(hbar,vbar,canvas,popup);    
		
		this.eventMgr=new CircuitEventMgr(this); 
		this.model=new CircuitContainer();
		this.popup=new CircuitContextMenu(this,popup);
	    //this.lineBendingProcessor=new DefaultLineBendingProcessor(); 
		this.backgroundColor='white';  
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
	      case  core.ModeEnum.LABEL_MODE:
	          shape=new SCHFontLabel(0,0);
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
				   if ((UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes)&& shape.isSelected())||event.ctrlKey){					   
	                 this.getEventMgr().setEventHandle("block", shape);						 
			       }else if ((!(shape instanceof SCHFontLabel))&&(undefined !=shape['getTextureByTag'])&&shape.getClickedTexture(scaledEvent.x, scaledEvent.y)!=null){
				     this.getEventMgr().setEventHandle("texture",shape);
	               }else if(shape instanceof SCHSymbol){
	            	 this.getEventMgr().setEventHandle("symbol",shape);
			       }else
			         this.getEventMgr().setEventHandle("move",shape);
			     }else{
			         this.getEventMgr().setEventHandle("component",null);
			     }
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
		   CircuitContainer,
		   Circuit,
		   CircuitMgr,
		   CircuitComponent	   
}