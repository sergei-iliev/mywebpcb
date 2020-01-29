var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var pad_events=require('pads/events');
var d2=require('d2/d2');

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
				this.component.repaint();
				this.component.popup.registerFootprintPopup(this.target,event);            
	            return;
	   }
	   if(event.data.ctrlKey){
		   this.component.getModel().getUnit().setSelectedShape(this.target.uuid,
                   !this.target.isSelected());
    
           this.ctrlButtonPress = true;
           this.component.repaint();
           return;		   
	   }
	   this.component.getModel().getUnit().setSelected(false);
	   this.target.setSelected(true);
	   this.component.repaint();	   
	    
	 }
 mouseReleased(event){
		if(super.isRightMouseButton(event)){
			 return;
		}
		this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
				 
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		this.component.repaint();
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
		this.component.repaint();
	 }
	 mouseMove(event){
	 
	 }	 
	
}
class TrackEventHandle extends EventHandle{
constructor(component) {
		 super(component);
}

Attach() {        
    super.Attach();
    console.log(111);
    this.component.lineBendingProcessor.initialize(this.target);
}
mousePressed(event){
    if(this.isRightMouseButton(event)){           
		this.component.popup.registerTrackPopup(this.target,event);            
        return;
    }
    
    this.component.getModel().getUnit().setSelected(false);
    this.target.setSelected(true); 
    
    let p;      
    if(this.component.getParameter("snaptogrid")){        
        p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y);  
        this.component.lineBendingProcessor.isGridAlignable=true;
    }else{
    	p=new d2.Point(event.x,event.y);
        this.component.lineBendingProcessor.isGridAlignable=false;
    }
    
    //this.component.getModel().getUnit().fireShapeEvent(new ShapeEvent(this.target, ShapeEvent.PROPERTY_CHANGE)); 
    
    let justcreated=this.target.getLinePoints().length==1; 
        
    if(this.component.lineBendingProcessor.addLinePoint(p)){
        if(justcreated){
            //getComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.CREATE_MEMENTO));   
            //getComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.MOVE_MEMENTO));    
        }
        if(this.target.getLinePoints().length>=2){
           //this.component.getModel().getUnit().registerMemento(getTarget().getState(MementoType.MOVE_MEMENTO));    
        }            
    }
    this.component.repaint(); 
}
mouseReleased(event){
	
}
mouseMove(event){
	this.component.lineBendingProcessor.moveLinePoint(event.x,event.y);    
	this.component.repaint();   	 
}	
mouseDragged(event){
	
}
dblClick(){
	this.target.reset();
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.repaint();	 
} 
Detach() {
    this.target.reset(); 
    if(this.target.getLinePoints().length<2){
        this.target.owningUnit.remove(this.target.uuid);
    }
    super.Detach();
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
        p=new d2.Point(event.x,event.y);
      }
      let justcreated=this.target.polygon.points.length==2;
      
      if(this.target.getLinePoints().length==0){
    	  this.target.add(p);    
          //avoid point over point
      }else if(!this.target.getLinePoints()[this.target.getLinePoints().length-1].equals(p)){
    	  this.target.add(p);           
      }
      
      
	  this.component.repaint();	   
	    
	 }
mouseReleased(event){
		
	 }
	 
mouseDragged(event){
		
	 }
mouseMove(event){
    this.target.floatingEndPoint.set(event.x,event.y);   
    this.component.repaint();	 
	 }	 
dblClick(){
      
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.repaint();	 
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
		this.hash.set("arc.mid.point",new pad_events.ArcMidPointEventHandle(component));
		this.hash.set("arc.start.angle",new pad_events.ArcStartAngleEventHandle(component));
		this.hash.set("arc.extend.angle",new pad_events.ArcExtendAngleEventHandler(component));
		this.hash.set("move",new events.MoveEventHandle(component));
		this.hash.set("resize",new events.ResizeEventHandle(component));
	    this.hash.set("component",new events.UnitEventHandle(component));
		this.hash.set("block",new events.BlockEventHandle(component));
		this.hash.set("line",new events.LineEventHandle(component));
		this.hash.set("cursor",new events.CursorEventHandle(component));
		this.hash.set("symbol",new FootprintEventHandle(component));
		this.hash.set("texture",new events.TextureEventHandle(component));
		this.hash.set("dragheand",new events.DragingEventHandle(component));
		this.hash.set("origin",new events.OriginEventHandle(component));
		this.hash.set("measure",new events.MeasureEventHandle(component));
		this.hash.set("track",new TrackEventHandle(component));
		this.hash.set("copperarea",new CopperAreaEventHandle(component));
		this.hash.set("solidregion",new pad_events.SolidRegionEventHandle(component));		
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
		  CopperAreaEventHandle,
		  TrackEventHandle
	}