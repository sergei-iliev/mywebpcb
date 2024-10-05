var core = require('core/core');
var DefaultLineBendingProcessor=require('core/line/linebendingprocessor').DefaultLineBendingProcessor;
var d2=require('d2/d2');
var utilities =require('core/utilities'); 
var MementoType = require('core/undo').MementoType;
Event={
	    SELECT_SHAPE:1,
	    DELETE_SHAPE:2,
	    RENAME_SHAPE:3,
	    ADD_SHAPE:4,
	    PROPERTY_CHANGE:5,
	    ADD_UNIT:6,
	    DELETE_UNIT:7,
	    SELECT_UNIT:8,  
	    RENAME_UNIT:9,
	    SELECT_CONTAINER:10,
	    RENAME_CONTAINER:11,
	    DELETE_CONTAINER:12
};

class EventHandle{
	 constructor(component) {
	     this.component=component;
	     this.mx=0;
		 this.mx=0;
		 this.target=null;
	 }	
	 attach(){
	     this.ctrlButtonPress = false;
	     this.mx=0;
	     this.my=0;  	     
	 }
	 dblClick(){
 
	 }
	 keyPressed(event){
		 //default
		 if(this.component.popup.isOpen()){
			this.component.popup.close(); 
			return; 
		 }
		 if (this.component.getModel().getUnit() != null) { 
			 if (event.keyCode == 8) { //BACKSPACE
				 this.component.getModel().getUnit().getSelectedShapes().forEach(function(shape) {
					 this.component.getModel().getUnit().remove(shape.getUUID());	
		           }.bind(this));  
				 this.component.repaint();
			 }
			 if (this.component.getEventMgr().getTargetEventHandle() != null&&event.keyCode==27) {	
			   this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		       this.component.setMode(core.ModeEnum.COMPONENT_MODE);       
		     } 
		 }		 
	 }
	 setTarget(target){
       this.target=target;
	 }
	 clear(){
		 
	 }
	 detach(){
	   this.clear();
	 }
isRightMouseButton(e){	 
	  return e.which!=1
}
}

class MoveEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 mousePressed(event){	
	    this.component.getModel().getUnit().setSelected(false);
	    this.target.setSelected(true);
		this.component.repaint();
		if(super.isRightMouseButton(event)){
            if (this.target["getLinePoints"]!=undefined){
            	this.component.popup.registerLineSelectPopup(this.target,event);
            }else if(this.target["getPinsRect"]!=undefined){
            	this.component.popup.registerPadPopup(this.target,event);
            }
            else{	
                this.component.popup.registerShapePopup(this.target,event);
                
            }
            return;
        }
	    
	    this.mx=event.x;
		this.my=event.y;
				
		//uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.MOVE_MEMENTO));    
	 }
	 mouseReleased(event){
		if(super.isRightMouseButton(event)){
			 return;
		}
		this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
        //uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.MOVE_MEMENTO));				 
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		this.component.repaint();
	 }
	 
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
			 return;
		} 
	 	let new_mx = event.x;
	    let new_my = event.y;
		
	    this.target.move(new_mx - this.mx, new_my - this.my);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();
	 }
	 mouseMove(event){
	 
	 }	 
}

class ResizeEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.targetPoint=null;
	 }
	 mousePressed(event){
		if(super.isRightMouseButton(event)){
	            if (this.target["getLinePoints"]!=undefined){
	            	this.component.popup.registerLineSelectPopup(this.target,event);            
	            }            
	    }
	     
	    this.component.getModel().getUnit().setSelected(false);
	    this.target.setSelected(true);
		this.mx=event.x;
		this.my=event.y;
	        
	    this.targetPoint=this.target.isControlRectClicked(event.x,event.y,this.component.viewportWindow);
	    this.target.setResizingPoint(this.targetPoint);
	    //uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.MOVE_MEMENTO));
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    
		this.component.repaint();
	 }
	 mouseReleased(event){
		    if(this.component.getParameter("snaptogrid")){
	         this.target.alignResizingPointToGrid(this.targetPoint);
		     this.component.repaint();	 
			}
			//uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.MOVE_MEMENTO));
			
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;

	    this.target.Resize(new_mx - this.mx, new_my - this.my,this.targetPoint);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();
	 }
	 mouseMove(event){
	 
	 }
	clear() {
    	this.target.setResizingPoint(null);
        this.targetPoint=null;        
    }
}
class DragingEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
mousePressed(event){
   this.mx = event.windowx;
   this.my = event.windowy;
   
		 }
mouseReleased(event){

		 }
mouseDragged(event){
   var newX =this.component.viewportWindow.x- (event.windowx - this.mx);
   var newY =this.component.viewportWindow.y- (event.windowy - this.my);        
    

   this.component.viewportWindow.x=newX;
   this.component.viewportWindow.y=newY;
   
   //this.component.hbar.jqxScrollBar('setPosition',newX); 
   //this.component.vbar.jqxScrollBar('setPosition',newY);
   
   this.mx = event.windowx;
   this.my = event.windowy;
   this.component.repaint();  
		 }
mouseMove(event){
		 
		 }	 
}

class UnitEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectionBox=new d2.Box(0,0,0,0);
	 }
	 attach(){
		 super.attach();
	     this.selectionBox.setRect(0,0,0,0);
	 }
	 mousePressed(event){
		this.component.getModel().getUnit().setSelected(false);
		this.component.repaint();
			
		if(super.isRightMouseButton(event)){
			this.component.popup.registerUnitPopup(this.target,event);
			//this.component.popup.open(event.data.originalEvent.clientX,event.data.originalEvent.clientY);		
			return;
		} 
		this.mx=event.windowx;
		this.my=event.windowy;
	 }
	 mouseReleased(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
		 this.selectionBox.move(this.component.viewportWindow.x,this.component.viewportWindow.y);
		 this.component.getModel().getUnit().setSelectedInRect(this.component.getModel().getUnit().getScalableTransformation().getInverseRect(this.selectionBox));
	     this.component.repaint();
	 }
	 mouseDragged(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
	 	  let w = event.windowx-this.mx;
	      let h = event.windowy-this.my;
		
		  let x=this.mx - (w < 0 ? Math.abs(w) : 0);
		  let y=this.my - (h < 0 ? Math.abs(h) : 0);
		
	      this.selectionBox.setRect(x,y,Math.abs(w),Math.abs(h));	
	      this.component.repaint();
		  
		  this.component.ctx.save();		  
	      this.component.ctx.globalAlpha =0.5; 		  
		  this.component.ctx.fillStyle = 'blue';
		  this.component.ctx.fillRect(this.selectionBox.x,this.selectionBox.y,this.selectionBox.width,this.selectionBox.height);
          		  
          
	      this.component.ctx.lineWidth = 1;
	      this.component.ctx.strokeStyle = 'blue';
	      this.component.ctx.stroke();
		  this.component.ctx.restore();

	 }
	 mouseMove(event){

	 }	 
}

class OriginEventHandle extends EventHandle{
constructor(component) {
		super(component);		
	}
attach(){
		 super.attach();
		 this.component.getModel().getUnit().coordinateSystem.reset(0,0);  
	 }
mousePressed(event){
	     this.component.getModel().getUnit().getCoordinateSystem().reset(event.x,event.y); 
	     this.mx = event.x;
	     this.my = event.y; 
	     this.component.getModel().getUnit().setSelected(false);	     
		 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		 
	 }
mouseReleased(event){
	if (event.which == 3) {
      //this.component.getModel().getUnit().coordinateSystem=null;   		 			   	
	}else{
	   this.component.getModel().getUnit().getCoordinateSystem().alignToGrid(false || this.component.getParameter("snaptogrid")); 
	}
	this.component.setMode(core.ModeEnum.COMPONENT_MODE);	 
}
mouseDragged(event){
		 this.mouseMove(event);
		 }
mouseMove(event){
	        let new_mx = event.x;
	        let new_my = event.y;
	       
	        this.component.getModel().getUnit().getCoordinateSystem().move((new_mx - this.mx), (new_my - this.my));
	        this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:Event.PROPERTY_CHANGE});

	        this.mx = new_mx;
	        this.my = new_my;     
	        this.component.repaint();   		 
		 }

}

class CursorEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 attach(){
		 super.attach();
		    this.mx = this.target.getCenter().x;
		    this.my = this.target.getCenter().y;
	 }	 
	 mousePressed(event){
		 if(event.which==3){
			 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
	         this.component.setMode(core.ModeEnum.COMPONENT_MODE);  
			 return;
		 }
	     var shape = this.target.clone();	            
	         this.component.getModel().getUnit().add(shape);       
	         this.component.getModel().getUnit().setSelected(false);
	         shape.setSelected(true);
	         shape.alignToGrid();
	         this.component.getModel().getUnit().fireShapeEvent({target:shape,type:Event.SELECT_SHAPE});
	         this.component.repaint();	            
	 }
	 mouseReleased(event){

	 }
	 mouseDragged(event){

	 }
	 mouseMove(event){		    
		 	let new_mx = event.x;
		    let   new_my = event.y;
		    
			
		    this.target.move(new_mx - this.mx, new_my - this.my);

		    this.mx = new_mx;
		    this.my = new_my;
			this.component.repaint(); 
	 }
}
class LineEventHandle extends EventHandle{
	constructor(component) {
			 super(component);
    }
	attach() {        
	    super.attach();
	    this.component.lineBendingProcessor=new DefaultLineBendingProcessor(); 
	    this.component.lineBendingProcessor.initialize(this.target);
	}	
	mousePressed(event){
		this.component.popup.close();
		
		if(super.isRightMouseButton(event)){	
		   this.component.popup.registerLinePopup(this.target,event);
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
	           //uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.CREATE_MEMENTO));   
	           //uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.MOVE_MEMENTO));    
	        }
	        if(this.target.getLinePoints().length>=2){
	          //uncomment this.component.getModel().getUnit().registerMemento(this.target.getState(MementoType.MOVE_MEMENTO));    
	        }            
	    }
	    this.component.repaint();  
}
mouseReleased(event){

	   }
mouseDragged(event){
	   }
mouseMove(event){
	this.component.lineBendingProcessor.moveLinePoint(event.x,event.y);    
	this.component.repaint();  
	   }

keyPressed(event){
	 if(this.component.getEventMgr().getTargetEventHandle() != null&&event.keyCode==27){   //ESCAPE      
		 this.component.lineBendingProcessor.release();
		 this.component.getEventMgr().resetEventHandle();
		 this.component.repaint();
	 }   
}

dblClick(){
	this.target.reset();
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.repaint();	 
} 
detach() {
    this.target.reset(); 
    if(this.target.getLinePoints().length<2){
        this.target.owningUnit.remove(this.target.uuid);
    }
    super.detach();
}   
}
class BlockEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectedShapes=[];
	 }
	 attach(){
		 super.attach();
	     this.selectedShapes = this.component.getModel().getUnit().getSelectedShapes(false);
	 }
	 detach(){
	     this.selectedShapes=null;
	     super.detach();
	 }
	 mousePressed(event){
		if(super.isRightMouseButton(event)){
		   this.component.popup.registerBlockPopup(this.target,event);					
		   return;
		}   
		if(event.data.ctrlKey){
		  this.component.getModel().getUnit().setSelectedShape(this.target.uuid,
	                   !this.target.isSelected());
	      this.ctrlButtonPress = true;
	      this.component.repaint();
	      return;		   
		}		
		this.mx=event.x;
		this.my=event.y;
	 }
	 mouseReleased(event){
		if(super.isRightMouseButton(event)){
		  return;
		}
		UnitMgr.getInstance().alignBlock(this.component.getModel().getUnit().grid, this.selectedShapes);
		this.component.repaint();
	 }
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
		  return;	 
		}
		let new_mx = event.x;
	    let new_my = event.y;
		
	    UnitMgr.getInstance().moveBlock(this.selectedShapes,new_mx - this.mx, new_my - this.my);
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();
	   
	 }
	 mouseMove(event){
	 
	 }
}

class TextureEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.texture=null;
	 }
clear() {
	 this.texture=null;
}
mousePressed(event){
   this.component.getModel().getUnit().setSelected(false);
   this.target.setSelected(true);
	this.mx=event.x;
	this.my=event.y;

	this.texture= this.target.getClickedTexture(event.x,event.y);  
	this.component.repaint();
	
}
mouseReleased(event){

}
mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
		
		this.texture.move(new_mx - this.mx, new_my - this.my);
		this.target.owningUnit.fireShapeEvent({target:this.target,type: Event.PROPERTY_CHANGE});
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();       
}
mouseMove(event){

}
}

class MeasureEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
attach(){
	 super.attach();
}	 
detach() {
    this.component.getModel().getUnit().ruler.resizingPoint=null;
    super.detach();
}
mouseReleased(e){

}
mouseDragged(e){
}
mousePressed(e) {        
        this.component.getModel().getUnit().ruler.resizingPoint=new d2.Point(e.x,e.y);
        this.mx = e.x;
        this.my = e.y;
}
mouseMove(e) {
        let new_mx = e.x;
        let new_my = e.y;
        this.component.getModel().getUnit().ruler.Resize(new_mx - this.mx, new_my - this.my);
        // update our data
        this.mx = new_mx;
        this.my = new_my;
        
        this.component.repaint();
    }	
}

class MouseScaledEvent{
 constructor(x,y,basePoint,originalEvent) {
   this.windowx=x;
   this.windowy=y;
   this.x=basePoint.x;
   this.y=basePoint.y;
   this.which=originalEvent.which;
   this.data=originalEvent;
 }
 toString(){
   return    "base x="+this.x+
             "; base y="+this.y+
			 "; window x="+this.windowx+
			 "; window y="+this.windowy+
			 "; which="+this.which; 
 }
}
class MoveLineSegmentHandle extends EventHandle{
constructor(component) {
		 super(component);		 
	     this.adapter;
	 }
mousePressed(event){
    this.component.getModel().getUnit().setSelected(false);
    this.target.setSelected(true);
	this.component.repaint();
    if(this.isRightMouseButton(event)){          
		this.component.popup.registerLineSelectPopup(this.target,event);           
        return;
    }         
    
    let segment=this.target.getSegmentClicked(event);
        
    //this.adapter=new  MoveLineSegmentAdapter(this.target,segment)
    this.adapter=new  End90DegreeMoveLineSegmentAdapter(this.target,segment)
 }
 mouseReleased(event){
	 	if(this.isRightMouseButton(event)){ 
			return
		}
		
	    if(this.component.getParameter("snaptogrid")){
          this.target.alignResizingPointToGrid(this.adapter.segment.ps);
          this.target.alignResizingPointToGrid(this.adapter.segment.pe);	      
		}	    
		this.adapter.validateNonZeroVector();
		
		this.component.repaint();	 
 }
 mouseDragged(event){
    this.adapter.moveSegment(new d2.Point(event.x,event.y));    
	this.component.repaint();
 }
 mouseMove(event){
 
 }
}

/**movable segment track  */
class MoveLineSegmentAdapter{
constructor(track,segment) {
		 this.segments=track.polyline.segments
		 this.segment=segment
	     this.isMidSegment=false
         this.copy=segment.clone()
	 }
moveSegment(p){	
	 if(this.segment==null){
	  return	
	 }	 
     if(this.isSingleSegment()){
	   this.moveSingleSegment(p)
	 }else if(this.isEndSegment()){
	   this.isMidSegment=false
	   this.moveEndSegment(p)	
	 }else{
		this.isMidSegment=true
		this.moveMidSegment(p)
	 }
}
isSingleSegment(){
	return this.segments.length==1
}	
isEndSegment(){
	 //find neigbor segment
	 let segm=this.findPrev()     	 
     if(segm==null){
	     return true;
	 }

     segm=this.findNext()     
     return segm==null;		
}
moveSingleSegment(p){
}
moveEndSegment(p){
     //find neigbor segment
	 let segm=this.findPrev()     
	 if(segm==null){
	   	segm=this.findNext()
	 }
	 //find common point and end point on same segm
     let commonpoint=segm.pe //common point between target segment and segm
     let endpoint1=segm.ps   //distant point from common one		
	 if(segm.ps==this.segment.ps||segm.ps==this.segment.pe){	  
	   commonpoint=segm.ps
       endpoint1=segm.pe	   
     }
	 //find free end point on this.segment
	 let endpoint2=this.segment.ps
     if(commonpoint==this.segment.ps){
	   endpoint2=this.segment.pe	
	 }
//find the direction of movement in regard to mouse point and segm end point
     let invertDirection=true;
     if(utilities.isLeftPlane(this.segment.ps,this.segment.pe,p)==utilities.isLeftPlane(this.segment.ps,this.segment.pe,endpoint1)){		
	 	invertDirection=false;	    
     }
//1. move common point
     let projPoint=this.segment.projectionPoint(p)	 
     let distance=projPoint.distanceTo(p)		
    
     let vsegment=new d2.Vector(commonpoint,endpoint2);
     let vsegm=new d2.Vector(commonpoint,endpoint1);

	 
     let angle=vsegment.angleTo(vsegm);
     if(angle>180){
        angle=360-angle    
	 }
	//find units to move along segm
	let sina=Math.sin(d2.utils.radians(angle))
    let delta=distance/sina

    let inverted=vsegm.clone()
    if(invertDirection){
      inverted.invert();
	}
    let norm=inverted.normalize();
	  
      
    let x=commonpoint.x +delta*norm.x;
	let y=commonpoint.y +delta*norm.y;
	
//2. move free end point of this.segment
    let xx=endpoint2.x +delta*norm.x;
	let yy=endpoint2.y +delta*norm.y;
    	
    endpoint2.set(xx,yy)
    commonpoint.set(x,y)
	
}
moveMidSegment(p){
	 //find neigbor segment
	 let prevsegm=this.findPrev()     	      
     let nextsegm=this.findNext()     

//1. prev segment movement
	 //find common point and end point of  prev segment
     let prevpoint=prevsegm.pe	//common point between target segment and prev
     let endpoint1=prevsegm.ps  //distance point
	 if(prevsegm.ps==this.segment.ps||prevsegm.ps==this.segment.pe){	  
	   prevpoint=prevsegm.ps
       endpoint1=prevsegm.pe	   
     }

	 //find end point on this.segment
	 let endpoint2=this.segment.ps
     if(prevpoint==this.segment.ps){
	   endpoint2=this.segment.pe	
	 }

     //find the direction of movement in regard to mouse point and prevsegm end point
     let invertDirection=true;
     if(utilities.isLeftPlane(this.segment.ps,this.segment.pe,p)==utilities.isLeftPlane(this.segment.ps,this.segment.pe,endpoint1)){		
	 	invertDirection=false;	    
     }	 

     let projPoint=this.segment.projectionPoint(p)	 
     let distance=projPoint.distanceTo(p)		
    
     let vsegment=new d2.Vector(prevpoint,endpoint2);
     let vsegm=new d2.Vector(prevpoint,endpoint1);
	 
     let angle=vsegment.angleTo(vsegm);
     if(angle>180){
        angle=360-angle    
	 }
	//find units to move along segm
	let sina=Math.sin(d2.utils.radians(angle))
    let delta=distance/sina

    let inverted=vsegm.clone()
    if(invertDirection){
    	inverted.invert();
	}

    let norm=inverted.normalize();
	  
      
    let x=prevpoint.x +delta*norm.x;
	let y=prevpoint.y +delta*norm.y;
    


//2. next segment movement
	 //find common point and end point on same segm - prev
     let nextpoint=nextsegm.pe //common point between target segment and next segment
     endpoint1=nextsegm.ps
	 if(nextsegm.ps==this.segment.ps||nextsegm.ps==this.segment.pe){	  
	   nextpoint=nextsegm.ps
       endpoint1=nextsegm.pe	   
     }

	 //find end point on this.segment
	 endpoint2=this.segment.ps
     if(nextpoint==this.segment.ps){
	   endpoint2=this.segment.pe	
	 }
     //find the direction of movement in regard to mouse point and nextsegm end point
     invertDirection=true;
     if(utilities.isLeftPlane(this.segment.ps,this.segment.pe,p)==utilities.isLeftPlane(this.segment.ps,this.segment.pe,endpoint1)){		
	 	invertDirection=false;	    
     }	 

      projPoint=this.segment.projectionPoint(p)	 
      distance=projPoint.distanceTo(p)		
    
      vsegment=new d2.Vector(nextpoint,endpoint2);
      vsegm=new d2.Vector(nextpoint,endpoint1);
	 
     angle=vsegment.angleTo(vsegm);
     if(angle>180){
        angle=360-angle    
	 }
	//find units to move along segm
	 sina=Math.sin(d2.utils.radians(angle))
     delta=distance/sina

     inverted=vsegm.clone()
     if(invertDirection){
    	inverted.invert();
	 }

     norm=inverted.normalize();

    let xx=nextpoint.x +delta*norm.x;
	let yy=nextpoint.y +delta*norm.y;
    nextpoint.set(xx,yy)
    
    prevpoint.set(x,y)	
}
/*
Avoid loosing direction vectors by moving point to overlapping position
*/
validateNonZeroVector(){		  
	  for(let s of this.segments){				
		  if(isNaN(s.length)||d2.utils.EQ(s.length,0)){
			this.segment.set(this.copy.ps.x,this.copy.ps.y,this.copy.pe.x,this.copy.pe.y);
			break;
		  }
	  }		
}
findPrev(){
	let prev=null;
	for(let s of this.segments){				
		if(s.same(this.segment)){
			return prev;
		}
		prev=s;
	}
	return null;
}
findNext(){		
	let next=null;
	for (var i = this.segments.length - 1; i >= 0; i--) {
		if(this.segments[i].same(this.segment)){
			return next;
		}
		next=this.segments[i];
    	
	}
	return null;		
}
}
/*
Make end segment move 90 degree wise only
*/
class End90DegreeMoveLineSegmentAdapter extends MoveLineSegmentAdapter{
	constructor(track,segment) {
	  super(track,segment)
	}
moveEndSegment(p){
	if(!(this.segment.isVertical||this.segment.isHorizontal)){		
		super.moveEndSegment(p)
		return;
	}
	
	 //find neigbor segment
	 let segm=this.findPrev()     
	 if(segm==null){
	   	segm=this.findNext()
	 }
	 //find common point and end point on same segm
     let commonpoint=segm.pe //common point between target segment and segm
     let endpoint1=segm.ps   //distant point from common one		
	 if(segm.ps==this.segment.ps||segm.ps==this.segment.pe){	  
	   commonpoint=segm.ps
       endpoint1=segm.pe	   
     }
	 //find free end point on this.segment
	 let endpoint2=this.segment.ps
     if(commonpoint==this.segment.ps){
	   endpoint2=this.segment.pe	
	 }
//find the direction of movement in regard to mouse point and segm end point
     let invertDirection=true;     
     if(utilities.isLeftPlane(this.segment.ps,this.segment.pe,p)===utilities.isLeftPlane(this.segment.ps,this.segment.pe,endpoint1)){		
	 	invertDirection=false;	    
     }
//1. move common point
     let projPoint=this.segment.projectionPoint(p)	 
     let distance=projPoint.distanceTo(p)		
    
     let vsegment=new d2.Vector(commonpoint,endpoint2);
     let vsegm=new d2.Vector(commonpoint,endpoint1);

	 
     let angle=vsegment.angleTo(vsegm);
     if(angle>180){
        angle=360-angle    
	 }
	//find units to move along segm
	let sina=Math.sin(d2.utils.radians(angle))
    let delta=distance/sina

    let inverted=vsegm.clone()
    if(invertDirection){
      inverted.invert();
	}
    let norm=inverted.normalize();
	  
      
    let x=commonpoint.x +delta*norm.x;
	let y=commonpoint.y +delta*norm.y;
	
//2. move free end point of this.segment
    let xx,yy;   
    if(this.segment.isHorizontal){     
     xx=endpoint2.x
	 yy=y
    }else{
	 xx=x
	 yy=endpoint2.y
	}	
    endpoint2.set(xx,yy)
    commonpoint.set(x,y)

}	
} 
module.exports ={
   Event,
   MouseScaledEvent,
   TextureEventHandle,
   BlockEventHandle,
   CursorEventHandle,
   OriginEventHandle,
   UnitEventHandle,
   DragingEventHandle,
   MoveEventHandle,
   ResizeEventHandle,
   EventHandle,
   LineEventHandle,
   MeasureEventHandle,
   MoveLineSegmentAdapter,
   MoveLineSegmentHandle
}
var UnitMgr = require('core/unit').UnitMgr;
