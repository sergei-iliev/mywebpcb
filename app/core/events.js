var core = require('core/core');
var ResizeableShape = require('core/core').ResizeableShape;
var UnitMgr = require('core/core').UnitMgr;
var Rectangle = require('core/core').Rectangle;

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
	 Attach(){
	     this.ctrlButtonPress = false;
	     this.mx=0;
	     this.my=0;  
	     if(this.target!=null){
	          this.target.enableCache(false);
	     }	     
	 }
	 dblClick(){
 
	 }
	 keyPress(keyevent){
		 
	 }
	 setTarget(target){
       this.target=target;
	 }
	 Clear(){
		 
	 }
	 Detach(){
	        if(this.target!=null){
	            this.target.enableCache(true);
	          }
	          this.Clear();
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
		this.mx=event.x;
		this.my=event.y;
		this.component.Repaint();
	 }
	 mouseReleased(event){
		this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
				 
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		this.component.Repaint();
	 }
	 
	 mouseDragged(event){
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
   
   this.component.hbar.jqxScrollBar('setPosition',newX); 
   this.component.vbar.jqxScrollBar('setPosition',newY);
   
   this.mx = event.windowx;
   this.my = event.windowy;
   this.component.Repaint();  
		 }
mouseMove(event){
		 
		 }	 
}

class UnitEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectionRect=new Rectangle(0,0,0,0);
	 }
	 Attach(){
		 super.Attach();
	     this.selectionRect.setRect(0,0,0,0);
	 }
	 mousePressed(event){
		this.component.getModel().getUnit().setSelected(false);
		this.component.Repaint();
			
		if(super.isRightMouseButton(event)){
			this.component.popup.registerUnitPopup(this.target,event);
			this.component.popup.open(event.data.originalEvent.clientX,event.data.originalEvent.clientY);		
			return;
		} 
		this.mx=event.windowx;
		this.my=event.windowy;
	 }
	 mouseReleased(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
	     let r=new Rectangle(this.component.viewportWindow.x+this.selectionRect.x,this.component.viewportWindow.y+this.selectionRect.y,this.selectionRect.width,this.selectionRect.height);
		 this.component.getModel().getUnit().setSelectedInRect(this.component.getModel().getUnit().getScalableTransformation().getInverseRect(r));
	     this.component.Repaint();
	 }
	 mouseDragged(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
	 	  let w = event.windowx-this.mx;
	      let h = event.windowy-this.my;
		
		  let x=this.mx - (w < 0 ? Math.abs(w) : 0);
		  let y=this.my - (h < 0 ? Math.abs(h) : 0);
		
	      this.selectionRect.setRect(x,y,Math.abs(w),Math.abs(h));	
	      this.component.Repaint();
		  
		  this.component.ctx.globalCompositeOperation='lighter';
	      this.component.ctx.beginPath();
	      this.component.ctx.rect(this.selectionRect.x,this.selectionRect.y,this.selectionRect.width,this.selectionRect.height);
	      this.component.ctx.fillStyle = 'gray';
	      this.component.ctx.fill();
	      this.component.ctx.lineWidth = 1;
	      this.component.ctx.strokeStyle = '#5B5B5B';
	      this.component.ctx.stroke();
		  this.component.ctx.globalCompositeOperation='source-over';
	 }
	 mouseMove(event){

	 }	 
}

class OriginEventHandle extends EventHandle{
constructor(component) {
		super(component);		
	}
Attach(){
		 super.Attach();
		 this.component.getModel().getUnit().getCoordinateSystem().Reset(0,0);  
	 }
mousePressed(event){
		 if (event.which == 3) {
		   this.component.getModel().getUnit().getCoordinateSystem().Reset(0,0);   
		 }else{
		   this.component.getModel().getUnit().getCoordinateSystem().Reset(event.x,event.y); 
		 }
	     this.mx = event.x;
	     this.my = event.y; 
	     this.component.getModel().getUnit().setSelected(false);	     
		 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);	
	 }
mouseReleased(event){
		 this.component.getModel().getUnit().getCoordinateSystem().alignToGrid(false || this.component.getParameter("snaptogrid")); 
         this.component.setMode(core.ModeEnum.COMPONENT_MODE);	 
}
	mouseDragged(event){
		 this.mouseMove(event);
		 }
	 mouseMove(event){
	        let new_mx = event.x;
	        let new_my = event.y;
	       
	        this.component.getModel().getUnit().getCoordinateSystem().Move((new_mx - this.mx), (new_my - this.my));
	        this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:Event.PROPERTY_CHANGE});

	        this.mx = new_mx;
	        this.my = new_my;     
	        this.component.Repaint();   		 
		 }
}

class CursorEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
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
	         this.component.Repaint();	            
	 }
	 mouseReleased(event){

	 }
	 mouseDragged(event){

	 }
	 mouseMove(event){
		    let new_mx;
			let new_my;
			if(this.target instanceof ResizeableShape){
		    	//center the mouse pointer
			   new_mx = event.x-(this.target.width/2);
			   new_my = event.y-(this.target.height/2);		      	
		    }else{
		 	   new_mx = event.x;
		       new_my = event.y;
		    }
			
		    this.target.Move(new_mx - this.mx, new_my - this.my);

		    this.mx = new_mx;
		    this.my = new_my;
			this.component.Repaint(); 
	 }
}

class BlockEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectedShapes=[];
	 }
	 Attach(){
		 super.Attach();
	     this.selectedShapes = this.component.getModel().getUnit().getSelectedShapes(false);
	 }
	 Detach(){
	     this.selectedShapes=null;
	     super.Detach();
	 }
	 mousePressed(event){
		this.mx=event.x;
		this.my=event.y;
	 }
	 mouseReleased(event){
		UnitMgr.getInstance().alignBlock(this.component.getModel().getUnit().grid, this.selectedShapes);
		this.component.Repaint();
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
		
	    core.UnitMgr.getInstance().moveBlock(this.selectedShapes,new_mx - this.mx, new_my - this.my);
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();
	   
	 }
	 mouseMove(event){
	 
	 }
}

class TextureEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.texture=null;
	 }
Clear() {
	 this.texture=null;
}
mousePressed(event){
   this.component.getModel().getUnit().setSelected(false);
   this.target.setSelected(true);
	this.mx=event.x;
	this.my=event.y;

	this.texture= this.target.getChipText().getClickedTexture(event.x,event.y);  
	this.component.Repaint();
	
}
mouseReleased(event){

}
mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
		
		this.texture.Move(new_mx - this.mx, new_my - this.my);
		this.target.owningUnit.fireShapeEvent({target:this.target,type: Event.PROPERTY_CHANGE});
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();       
}
mouseMove(event){

}
}

class MeasureEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
Attach(){
	 super.Attach();
}	 
Detach() {
    this.component.getModel().getUnit().ruler.resizingPoint=null;
    super.Detach();
}
mouseReleased(e){

}
mouseDragged(e){
}
mousePressed(e) {        
        this.component.getModel().getUnit().ruler.resizingPoint=new core.Point(e.x,e.y);
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
        
        this.component.Repaint();
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
   EventHandle,
   MeasureEventHandle
}