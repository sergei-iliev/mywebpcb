var d2=require('d2/d2');

class FontTexture{
 constructor(tag,text,x,y,alignment,fontSize) {
    this.tag=tag;
	this.shape=new d2.FontText(new d2.Point(x,y),text,fontSize);    
	this.alignment=alignment;
	this.selection=false;
	this.selectionRectWidth=3000;
	
 }
clone(){
     var copy=new FontTexture(this.tag,this.shape.text,this.shape.anchorPoint.x,this.shape.anchorPoint.y,null,this.shape.fontSize);     
     return copy;	 
 } 
isEmpty() {
     return this.shape.text==null||this.shape.text.length==0;
 }
isClicked(x,y){
    if (this.shape.text == null || this.shape.text.length == 0){
        return false;
    } 
    return this.shape.contains(new d2.Point(x,y));
    
}
getBoundingRect(){
    if (this.shape.text == null || this.shape.text.length == 0){
        return null;
    } 
    
}

setText(text){
	this.shape.setText(text);
}
setRotation(rotate,pt){	
  this.shape.rotate(rotate,pt);
}
Move(xoffset, yoffset){
   this.shape.move(xoffset, yoffset);  
}

Paint(g2,viewportWindow,scale){
	 if(this.isEmpty()){
	   return;	 
	 }
	 
	 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
	 if(this.selection)
	   g2.fillStyle = 'gray';
	 else
	   g2.fillStyle = 'white';
	 
	 let t=this.shape.clone();
     t.scale(scale.getScale());
     t.move(-viewportWindow.x,- viewportWindow.y);
	 
     t.paint(g2);

	
}


}

var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   FontTexture
}