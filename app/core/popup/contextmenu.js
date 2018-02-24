var core=require('core/core');

class ContextMenu{
constructor(component,placeholderid){
	this.component=component;
	this.placeholder = document.getElementById(placeholderid);	
	this.content="";
}	
open(x,y){  
    this.placeholder.style.left=x+"px";
    this.placeholder.style.top=y+"px";
    this.show();				  
}
show(){
    if (!this.opened) {
	   this.placeholder.className = "visible";
	}    
	this.opened = true;		  		  
}
close() {        
    this.placeholder.className = "hidden";
    this.opened = false;  
}	
setContent(content,context) {
    this.placeholder.innerHTML ="<div class='content'>" + content + "</div>";
    //attach event listeners
    this.attachEventListeners(context);
}	

attachEventListeners(context){
	
}

actionPerformed(id,context){
	 if(id=='positiontocenterid'){
	     let unit=this.component.getModel().getUnit();           
	     let rect =unit.getBoundingRect();
	    
	     let x=rect.getCenterX();
	     let y=rect.getCenterY();
	     
	     let unitMgr = core.UnitMgr.getInstance();
	     
	     unitMgr.moveBlock(unit.shapes, (unit.width/2)-x, (unit.height/2)-y);
	     unitMgr.alignBlock(unit.grid,unit.shapes);
	      
	     //scroll to center
	     this.component.setScrollPosition((unit.width/2), (unit.height/2));
	    
	 }
     if (id=='deleteid') {
    	 let unit=this.component.getModel().getUnit(); 
    	 let unitMgr = core.UnitMgr.getInstance();        
         unitMgr.deleteBlock(unit,unit.getSelectedShapes(false));
         this.component.Repaint();                     
     } 
	 if(id=='cloneid'){
		 let unit=this.component.getModel().getUnit();  
		 let unitMgr = core.UnitMgr.getInstance();
         unitMgr.cloneBlock(unit,unit.getSelectedShapes(true));
         let shapes= unit.getSelectedShapes(false); 
         let r=unit.getShapesRect(shapes);
         unitMgr.moveBlock(shapes,
                              r.width,r.height);
         unitMgr.alignBlock(unit.grid,shapes);
         
         this.component.Repaint();
         //***emit property event change
         if (shapes.length == 1) {            
	       unit.fireShapeEvent({target:shapes[0],type:Event.SELECT_SHAPE});
         }             
         return; 		 
	 }
	 if(id=='selectallid'){ 
	     this.component.getModel().getUnit().setSelected(true);
	     this.component.Repaint();  
	 }	
}
}

module.exports ={
		   ContextMenu
}