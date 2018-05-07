var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');

class FootprintEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
mousePressed(event){
       this.mx=event.x;
	   this.my=event.y;

	   if(super.isRightMouseButton(event)){                       
			    this.component.getModel().getUnit().setSelected(false);
			    this.target.setSelected(true);
				this.component.Repaint();
				this.component.popup.registerChipPopup(this.target,event);            
	            return;
	   }
	   if(event.data.ctrlKey){
		   this.component.getModel().getUnit().setSelectedShape(this.target.uuid,
                   !this.target.isSelected());
    
           this.ctrlButtonPress = true;
           this.component.Repaint();
           return;		   
	   }
	   this.component.getModel().getUnit().setSelected(false);
	   this.target.setSelected(true);
	   this.component.Repaint();	   
	    
	 }
 mouseReleased(event){
		if(super.isRightMouseButton(event)){
			 return;
		}
		this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
				 
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		this.component.Repaint();
	 }
	 
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
			 return;
		} 
	 	let new_mx = event.x;
	    let new_my = event.y;
		
	    this.target.Move(new_mx - this.mx, new_my - this.my);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();
	 }
	 mouseMove(event){
	 
	 }	 
	
}
class BoardEventMgr{
	 constructor(component) {
	    this.component=component;
		this.targetEventHandle=null;	
		this.hash = new Map();
//		this.hash.set("arc.mid.point",new ArcMidPointEventHandle(component));
//		this.hash.set("arc.start.angle",new ArcStartAngleEventHandle(component));
//		this.hash.set("arc.extend.angle",new ArcExtendAngleEventHandler(component));
		this.hash.set("move",new events.MoveEventHandle(component));
		this.hash.set("resize",new events.ResizeEventHandle(component));
	    this.hash.set("component",new events.UnitEventHandle(component));
		this.hash.set("block",new events.BlockEventHandle(component));
//		this.hash.set("line",new LineEventHandle(component));
		this.hash.set("cursor",new events.CursorEventHandle(component));
		this.hash.set("symbol",new FootprintEventHandle(component));
//		this.hash.set("texture",new events.TextureEventHandle(component));
		this.hash.set("dragheand",new events.DragingEventHandle(component));
		this.hash.set("origin",new events.OriginEventHandle(component));
		this.hash.set("measure",new events.MeasureEventHandle(component));
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
		  handle.Attach();
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
	            this.targetEventHandle.Detach();
	        }
	        this.targetEventHandle = null;                
	    }
	 
	}

	module.exports ={
		  BoardEventMgr		  
	}