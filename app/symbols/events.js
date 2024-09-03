var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var d2 = require('d2/d2');

class SymbolEventMgr{
	 constructor(component) {
	    this.component=component;
		this.targetEventHandle=null;	
		this.hash = new Map();
		this.hash.set("move",new events.MoveEventHandle(component));
		this.hash.set("resize",new events.ResizeEventHandle(component));
	    this.hash.set("component",new events.UnitEventHandle(component));
		this.hash.set("block",new events.BlockEventHandle(component));
		this.hash.set("line",new events.LineEventHandle(component));
		this.hash.set("cursor",new events.CursorEventHandle(component));
		this.hash.set("texture",new events.TextureEventHandle(component));
		this.hash.set("dragheand",new events.DragingEventHandle(component));
		this.hash.set("origin",new events.OriginEventHandle(component));
		this.hash.set("measure",new events.MeasureEventHandle(component));
		this.hash.set("arc.start.angle",new ArcStartAngleEventHandle(component));
		this.hash.set("arc.extend.angle",new ArcExtendAngleEventHandler(component));
	 }
	 //****private
	 getEventHandle(eventKey,target) {
	    var handle=this.hash.get(eventKey);
		if(handle!=null){
		  handle.setTarget(target);
		  if(eventKey=='resize'||eventKey=='move'||eventKey=='line'||eventKey=='texture'){
		     this.component.getModel().getUnit().fireShapeEvent({target:target,type:events.Event.SELECT_SHAPE});
		  }
		  if(eventKey=='component'||eventKey=="origin"){
			 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:events.Event.SELECT_UNIT});
		  }
		  handle.attach();
		}
		return handle;
	 }
	 
	 getTargetEventHandle(){
	   return this.targetEventHandle;
	 }
	 
	 setEventHandle(eventKey,target){
	        this.resetEventHandle();
	        this.targetEventHandle=this.getEventHandle(eventKey,target);
	    }
	 
	 resetEventHandle(){
		    //hide context menu
		    this.component.popup.close();
	        if (this.targetEventHandle != null) {
	            this.targetEventHandle.detach();
	        }
	        this.targetEventHandle = null;                
	    }
	 
	}

class ArcStartAngleEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 mousePressed(event){
		this.target.resizingPoint=this.target.arc.start
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
	    
		
	        
	    let centerX=this.target.arc.center.x;
	    let centerY=this.target.arc.center.y;
	           
	    let start = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

	    if(start<0){
	        this.target.setStartAngle(-1*(start));            
	    }else{
	        this.target.setStartAngle(360-(start));            
	    }
			
		this.mx = new_mx;
	    this.my = new_my;

		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
			
		this.component.repaint();
	 }
	mouseReleased(event){

	} 
	mouseMove(event){
	 
	}
	clear(){
		this.target.resizingPoint=null
	}
}	
class ArcExtendAngleEventHandler extends EventHandle{
	 constructor(component) {
		 super(component);

	 }
	 mousePressed(event){
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
	        
	    let centerX=this.target.arc.center.x;
	    let centerY=this.target.arc.center.y;
	        
	        
	    let extend = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

	    if(extend<0){
	        extend=(-1*(extend));                  
	    }else{
	        extend=(360-extend);         
	    }
	        
	        //-360<extend<360 
	    let extendAngle=this.target.arc.endAngle;
	    if(extendAngle<0){        
	          if(extend-this.target.arc.startAngle>0) {                
	              this.target.setExtendAngle(((extend-this.target.arc.startAngle))-360);
	          }else{
	              this.target.setExtendAngle(extend-this.target.arc.startAngle);
	            }
	        }else{           
	            if(extend-this.target.arc.startAngle>0) {
	              this.target.setExtendAngle(extend-this.target.arc.startAngle);
	            }else{
	              this.target.setExtendAngle((360-this.target.arc.startAngle)+extend);
	            }
	        }
	        
	    //***update PropertiesPanel           
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
			
		this.component.repaint();
	 }
	mouseReleased(event){

	} 
	mouseMove(event){
	 
	}

}

module.exports ={
		SymbolEventMgr
	}