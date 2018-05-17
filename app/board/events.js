var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var pad_events=require('pads/events');

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
class CopperAreaEventHandle extends EventHandle{
	constructor(component) {
		 super(component);
	 }
mousePressed(event){
      this.mx=event.x;
	  this.my=event.y;
	  if(super.isRightMouseButton(event)){                                  
           return;
      }
      this.component.getModel().getUnit().setSelected(false);
	  this.target.setSelected(true);

      let p;      
      
      if(this.component.getParameter("snaptogrid")){
        p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y);       		
      }else{
        p=new core.Point(event.x,event.y);
      }
      let justcreated=this.target.polygon.points.length==2;
      
      this.target.add(p);
      
	  this.component.Repaint();	   
	    
	 }
mouseReleased(event){
		
	 }
	 
mouseDragged(event){
		
	 }
mouseMove(event){
    this.target.floatingEndPoint.setLocation(event.x,event.y);   
    this.component.Repaint();	 
	 }	 
dblClick(){
      
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.Repaint();	 
} 
Detach() {
    this.target.reset(); 
    if(this.target.polygon.points.length<3){
        this.target.owningUnit.remove(this.target.uuid);
    }
    super.Detach();
}	
}

class BoardEventMgr{
	 constructor(component) {
	    this.component=component;
		this.targetEventHandle=null;	
		this.hash = new Map();
//		this.hash.set("arc.mid.point",new ArcMidPointEventHandle(component));
		this.hash.set("arc.start.angle",new pad_events.ArcStartAngleEventHandle(component));
		this.hash.set("arc.extend.angle",new pad_events.ArcExtendAngleEventHandler(component));
		this.hash.set("move",new events.MoveEventHandle(component));
		this.hash.set("resize",new events.ResizeEventHandle(component));
	    this.hash.set("component",new events.UnitEventHandle(component));
		this.hash.set("block",new events.BlockEventHandle(component));
		this.hash.set("line",new pad_events.LineEventHandle(component));
		this.hash.set("cursor",new events.CursorEventHandle(component));
		this.hash.set("symbol",new FootprintEventHandle(component));
//		this.hash.set("texture",new events.TextureEventHandle(component));
		this.hash.set("dragheand",new events.DragingEventHandle(component));
		this.hash.set("origin",new events.OriginEventHandle(component));
		this.hash.set("measure",new events.MeasureEventHandle(component));
		this.hash.set("copperarea",new CopperAreaEventHandle(component));
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
		  BoardEventMgr,
		  CopperAreaEventHandle
	}