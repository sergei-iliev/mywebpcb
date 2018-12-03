var d2=require('d2/d2');

class FontTexture{
 constructor(tag,text,x,y,fontSize) {
    this.tag=tag;
	this.shape=new d2.FontText(new d2.Point(x,y),text,fontSize);    
	this.selection=false;
	this.selectionRectWidth=3000;
	
 }
clone(){
     var copy=new FontTexture(this.tag,this.shape.text,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.fontSize);     
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
setLocation(x,y){
	this.shape.anchorPoint.set(x,y);
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
toXML(){
    return (this.text=="" ? "" :
        this.shape.text + "," + this.shape.anchorPoint.x + "," + this.shape.anchorPoint.y +
        "," +this.shape.rotation+","+this.shape.fontSize);	 
}
fromXML(node){
    if (node == null || node.length==0) {
        this.text = "";
        return;
    }
    var tokens=node.split(',');
    this.shape.anchorPoint.set(parseInt(tokens[1]),
            parseInt(tokens[2]));     
    
    this.shape.setText(tokens[0]);
    this.shape.setSize(parseInt(tokens[5]));
}
}

var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   FontTexture
}