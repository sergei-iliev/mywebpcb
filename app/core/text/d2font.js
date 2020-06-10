var d2=require('d2/d2');
//class TextureCache{
//	constructor(shape) {
//		this.shape=shape;
//		this.rotation=0;
//		this.fontSize=0;
//		this.text=0;
//	}
//	reset(shape,fontSize,text,rotation){
//		this.shape=shape;
//		this.rotation=rotation;
//		this.fontSize=fontSize;
//		this.text=text;
//	
//	}
//}
class FontTexture{
 constructor(text,tag,x,y,fontSize,rotation) {
    this.tag=tag;
	this.shape=new d2.FontText(x,y,text,fontSize,rotation);    
	this.selection=false;
	this.selectionRectWidth=3000;
	this.constSize=false;
	this.fillColor='white'; 
    this.shape.style='plain';
    this.isTextLayoutVisible=false;
	//this.cache=new TextureCache(this);
 }
clone(){
     var copy=new FontTexture(this.shape.text,this.tag,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.fontSize,this.shape.rotation);     
     copy.fillColor=this.fillColor;
     copy.shape.style=this.shape.style;
     copy.isTextLayoutVisible=this.isTextLayoutVisible;
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
    let box=this.shape.box;
    let rect= new d2.Rectangle(box.x,box.y,box.width,box.height);
    rect.rotate(this.shape.rotation,this.shape.anchorPoint);
    return rect;
}
getBoundingShape() {
    if (this.shape.text == null || this.shape.text.length == 0) {
          return null;
    }
     return this.shape.box;
}
setLocation(x,y){
	this.shape.setLocation(x,y);
}
setText(text){
	this.shape.setText(text);
}
setSize(size){
	this.shape.setSize(size);
}
setRotation(rotate,pt){	
  this.shape.rotate(rotate,pt);
}
Move(xoffset, yoffset){
   this.shape.move(xoffset, yoffset);  
}
setSide(side,  line,  angle) { 
    this.shape.mirror(line); 
    this.shape.rotation=angle;
}
setSelected(selection){
	this.selection=selection;
}
paint(g2,viewportWindow,scale){
	 if(this.isEmpty()){
	   return;	 
	 }
	 if(this.constSize){
	   g2.font = ""+parseInt(this.shape.fontSize)+"px Monospace";
	 }else{	 
		 if(this.shape.fontSize*scale.getScale()<8){
			 return;
		 }
		 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
	 }
	 g2.fillStyle = this.fillColor;
	 
	 
//     let t=this.shape.clone();
//     t.scale(scale.getScale());
//     t.move(-viewportWindow.x,- viewportWindow.y);     
//     t.paint(g2);
  
	 this.shape.scalePaint(g2,viewportWindow,scale.getScale());
	 if(this.isTextLayoutVisible){
		let box=this.getBoundingRect();
	  	box.scale(scale.getScale());
	  	box.move(-viewportWindow.x,- viewportWindow.y);
		g2.lineWidth =1;
 		g2.strokeStyle = 'blue';
	  	box.paint(g2);
	 }
     if(this.selection){
 		 g2.lineWidth =1;
 		 g2.strokeStyle = 'blue';
 		 let p=this.shape.anchorPoint.clone();
         p.scale(scale.getScale());
         p.move(-viewportWindow.x,- viewportWindow.y);
         p.paint(g2);    	 
     }
	
}
toXML(){
    return (this.text=="" ? "" :
        this.shape.text + "," + utilities.roundFloat(this.shape.anchorPoint.x,2) + "," + utilities.roundFloat(this.shape.anchorPoint.y,2) +
        ",,PLAIN,"+this.shape.fontSize+"," +this.shape.rotation);	 
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
    this.shape.rotate(parseFloat(tokens[6])||0);
    
}
}
TextOrientation={
        HORIZONTAL:0,
        VERTICAL:1,        
}
class SymbolFontTexture extends FontTexture{
constructor(text,tag,x,y,fontSize,rotation) {
       super(text,tag,x,y,fontSize,rotation);
       this.selectionRectWidth=4;
       this.fillColor='black'; 
}
clone(){
    var copy=new SymbolFontTexture(this.shape.text,this.tag,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.fontSize,this.shape.rotation);     
    copy.fillColor=this.fillColor;
    return copy;	 
} 
setOrientation(orientation){
    switch (orientation) {
    case TextOrientation.HORIZONTAL:
       if(this.shape.rotation==90){
    	this.rotate({angle:-90,originx:this.shape.anchorPoint.x,originy:this.shape.anchorPoint.y});
       }
       break;
    case TextOrientation.VERTICAL:
    	if(this.shape.rotation==0){	
          this.rotate({angle:90,originx:this.shape.anchorPoint.x,originy:this.shape.anchorPoint.y});
    	}       
    }	
}
getOrientation(){
	if(this.shape.rotation==90){
		return TextOrientation.VERTICAL;
	}else{
		return TextOrientation.HORIZONTAL
	}
}
rotate(rotation){	
    //redesign!!!!!!!!
 	this.shape.anchorPoint.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
 	this.shape.metrics.calculateMetrics(this.shape.fontSize,this.shape.text);
 	if(this.shape.rotation==90){
 		this.shape.rotation=0;
 	}else{
 		this.shape.rotation=90;
 	}
 } 	    

fromXML(node){
    if (node == null || node.length==0) {
        this.text = "";
        return;
    }

    var tokens=node.split(',');
    this.shape.setText(tokens[0]);
    this.shape.anchorPoint.set(parseInt(tokens[1]),
            parseInt(tokens[2]));     
    this.style=tokens[4];    
    this.shape.setSize(parseInt(tokens[5]));
    //TOP, BOTTOM alignment
    if(tokens[3]=='TOP'||tokens[3]=='BOTTOM'){
    	this.shape.rotation=90;	
    }
}
toXML(){
    return (this.shape.text==="" ? "" :
        this.shape.text + "," + utilities.roundFloat(this.shape.anchorPoint.x,1) + "," + utilities.roundFloat(this.shape.anchorPoint.y,1) +
        ",,"+this.shape.style.toUpperCase()+","+this.shape.fontSize+"," +this.shape.rotation);	
}
}
var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   TextOrientation,
   FontTexture,
   SymbolFontTexture
}