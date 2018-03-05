var FontMetrics=require('core/text/fontmetrics');

var getCanvas=function(){
	  return j$('#mycanvas')[0].getContext("2d");
};
/*Text Rectangle
*
*                  |-ascent----------------|
*                  |                       |
*       anchorPoint|-----------------------|
*                  |_descent_______________|
*
*
*
*
*
*/
class TextMetrics{
	 constructor() {
	        this.updated = false;
	        this.fontSize=-1;
	        this.width=this.height=0;
	        this.descent=0;
	        this.ascent=0;
//	        this.metrics = FontMetrics({
//	        	  fontFamily: 'Monospace',	        	  
//	        	  fontWeight: 'normal',
//	        	  fontSize: 12,
//	        	  origin: 'baseline'
//	        	});
//	        console.log(this.metrics);
		 }	
UpdateMetrics() {
	this.updated=false;
	this.fontSize=-1;
}

calculateMetrics(alignment,fontSize,text) {
    if(this.fontSize!=fontSize){
        this.fontSize=fontSize;
        this.updated = false;
    }
    
    if(this.updated==true){
        return;
    }
    
    if(fontSize>1000){
        this.fixTextMetrics(alignment, fontSize,  text);
        this.updated=true;
        return;
    }    
    
    var ctx=getCanvas();
    ctx.font=""+this.fontSize+"px monospace";
    
    this.width=ctx.measureText(text).width;
    this.height=this.fontSize;
    
    this.updated=true;
}

fixTextMetrics(alignment, fontSize, text){
	tmHelper.UpdateMetrics();
	tmHelper.calculateMetrics(alignment,600, text);
    
    
    let scale=parseFloat(fontSize/tmHelper.fontSize);
    this.width=(Math.round(scale))*tmHelper.width;
    this.height=(Math.round(scale))*tmHelper.height;
}
		 
}

var tmHelper=new TextMetrics();

class FontTexture{
 constructor(tag,text,x,y,alignment,fontSize) {
    this.tag=tag;
	this.text=text;
    this.anchorPoint=new core.Point(x,y);
	this.alignment=alignment;
	this.fontSize=fontSize;
	this.selection=false;
	this.baseTextMetrics=new TextMetrics();  
 }
 clone(){
     var copy=new FontTexture(this.tag,this.text,this.anchorPoint.x,this.anchorPoint.y,new core.Alignment(this.alignment.get()),this.fontSize);
     return copy;	 
 }
 copy(texture){
     this.anchorPoint.x=texture.anchorPoint.x;
     this.anchorPoint.y=texture.anchorPoint.y;
     this.text = texture.text;
     this.tag = texture.tag;
     this.alignment=texture.alignment;
     this.fontSize=texture.fontSize;               
     this.baseTextMetrics.UpdateMetrics();
 }
isEmpty() {
     return this.text==null||this.text.length==0;
 }
 setLocation(x,y){
	 this.anchorPoint.x=x;
	 this.anchorPoint.y=y;
 }
 fromXML(node){
     if (node == null || node.length==0) {
         this.text = "";
         return;
     }
     var tokens=node.split(',');
     this.text=tokens[0];
     this.anchorPoint.setLocation(parseInt(tokens[1]),
             parseInt(tokens[2])); 
     this.alignment.set(AlignEnum.parse(tokens[3]));
     this.fontSize=parseInt(tokens[5]);
 }
 toXML(){
     return (this.text=="" ? "" :
         this.text + "," + this.anchorPoint.x + "," + this.anchorPoint.y +
         "," + AlignEnum.format(this.alignment.get())+",PLAIN,"+this.fontSize);	 
 }
 getTag(){
	 return this.tag;
 }
 getAlignment(){
   return this.alignment;
 }
 setSelected(selection) {
     this.selection=selection;
}	
isSelected() {
     return this.selection;
}
setText(text) {
    this.text = text;
    this.baseTextMetrics.UpdateMetrics();
}
isClicked(x,y){
    var r=this.getBoundingRect();
    if ((r != null) && (r.contains(x, y)))
        return true;
    else
        return false;
 }
 getBoundingRect(){
     if (this.text == null || this.text.length == 0){
         return null;
     }   
     //recalculate or buffer
     this.baseTextMetrics.calculateMetrics(this.alignment, this.fontSize, this.text);
	 
     var r=null;
	 switch(this.alignment.get()){
	   case AlignEnum.RIGHT:
	    r= new core.Rectangle(this.anchorPoint.x-this.baseTextMetrics.width,this.anchorPoint.y-this.baseTextMetrics.height,this.baseTextMetrics.width,this.baseTextMetrics.height);
	    break;
	   case AlignEnum.LEFT:
	    r= new core.Rectangle(this.anchorPoint.x,this.anchorPoint.y-this.baseTextMetrics.height,this.baseTextMetrics.width,this.baseTextMetrics.height);
	   break;
	   case AlignEnum.TOP:
	    r= new core.Rectangle(this.anchorPoint.x - this.baseTextMetrics.height,
                           this.anchorPoint.y, this.baseTextMetrics.height,this.baseTextMetrics.width);
	   break;
	   case AlignEnum.BOTTOM:
	   	 r= new core.Rectangle(this.anchorPoint.x - this.baseTextMetrics.height,
                           this.anchorPoint.y - this.baseTextMetrics.width,
                           this.baseTextMetrics.height, this.baseTextMetrics.width);

	 }
	 
	 return r;
	 
 }
 Move(xoffset, yoffset){
         this.anchorPoint.setLocation(this.anchorPoint.x + xoffset,
                                this.anchorPoint.y + yoffset);
 }
Mirror(A,B) {
     utilities.mirrorPoint(A,B, this.anchorPoint);
     if (A.x ==B.x) { //right-left mirroring
         this.alignment.Mirror(true);
         //if (this.alignment == oldAlignment) {
         //    this.anchorPoint.setLocation(this.anchorPoint.x +
         //                            (compositeTextMetrics.getBaseTextMetrics().getAscent() - compositeTextMetrics.getBaseTextMetrics().getDescent()),
         //                            anchorPoint.y);
         //}
     } else { //***top-botom mirroring
         this.alignment.Mirror(false);
         //if (this.alignment == oldAlignment) {
         //    this.anchorPoint.setLocation(anchorPoint.x,
         //                            anchorPoint.y +
         //                            (compositeTextMetrics.getBaseTextMetrics().getAscent() - compositeTextMetrics.getBaseTextMetrics().getDescent()));
         //}
     }
     
     this.baseTextMetrics.UpdateMetrics();

 }
 Rotate(rotation){
	 let p=utilities.rotate(this.anchorPoint, rotation.originx, rotation.originy, rotation.angle);
	 this.anchorPoint.setLocation(p.x,p.y);
	 let oldorientation=this.alignment.getOrientation();
	 if(rotation.angle>0){  //clockwise
	    this.alignment.Rotate(true);
	    if(oldorientation == OrientEnum.HORIZONTAL){
	    	this.anchorPoint.setLocation(this.anchorPoint.x+this.fontSize/2,this.anchorPoint.y);
	    }
	 }else{
		this.alignment.Rotate(false);  
	    if(oldorientation == OrientEnum.VERTICAL){
	       this.anchorPoint.setLocation(this.anchorPoint.x,this.anchorPoint.y+this.fontSize/2);	
	    }
	 }
 }
  Paint(g2,viewportWindow,scalableTransformation){
	 if(this.isEmpty()){
	   return;	 
	 } 
	 g2.font = ""+parseInt(this.fontSize*scalableTransformation.getScale())+"px monospace";
	 if(this.selection)
	   g2.fillStyle = 'gray';
	 else
	   g2.fillStyle = 'white';
	 
	
	 var scaledPoint=this.anchorPoint.getScaledPoint(scalableTransformation);
	 scaledPoint.setLocation(scaledPoint.x-viewportWindow.x, scaledPoint.y-viewportWindow.y);
     
	 
	 switch(this.alignment.get()){
	   case AlignEnum.RIGHT:
	   	 g2.textAlign = 'right';
		 g2.fillText(this.text, scaledPoint.x, scaledPoint.y); 
	   break;
	   case AlignEnum.LEFT:
	   	 g2.textAlign = 'left';
		 g2.fillText(this.text, scaledPoint.x, scaledPoint.y);
	   break;
	   case AlignEnum.TOP:
	   g2.save();
	   g2.textAlign = 'right';
	   g2.translate(scaledPoint.x, scaledPoint.y);
       g2.rotate(-0.5*Math.PI);
       g2.fillText(this.text , 0, 0);
       g2.restore();
	   break;
	   case AlignEnum.BOTTOM:
	   g2.save();
	   g2.textAlign = 'left';
	   g2.translate(scaledPoint.x, scaledPoint.y);
       g2.rotate(-0.5*Math.PI);
       g2.fillText(this.text , 0, 0);
       g2.restore();	   	   
	 }
	 
	 
	 if(this.selection){
		 this.drawControlShape(g2,viewportWindow,scalableTransformation); 
	 }
  }
  drawControlShape(g2,viewportWindow,scale){
      
      var track=new mywebpcb.core.Track();
	  
      track.setTrack(this.anchorPoint.x-SELECT_RECT_WIDTH,this.anchorPoint.y,this.anchorPoint.x+SELECT_RECT_WIDTH,this.anchorPoint.y); 
      track.drawTrack(g2, viewportWindow, scale,'blue');
      
      track.setTrack(this.anchorPoint.x,this.anchorPoint.y-SELECT_RECT_WIDTH,this.anchorPoint.x,this.anchorPoint.y+SELECT_RECT_WIDTH); 
      track.drawTrack(g2, viewportWindow, scale,'blue');
    
      
  }
 	
}

var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   FontTexture
}