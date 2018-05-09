var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/core').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var glyph=require('core/text/glyph');
var font=require('core/text/font');
var Circle =require('pads/shapes').Circle;
var Arc =require('pads/shapes').Arc;
var Line =require('pads/shapes').Line;
var RoundRect =require('pads/shapes').RoundRect;
var GlyphLabel=require('pads/shapes').GlyphLabel;

class BoardShapeFactory{
	
	createShape(data){
//		if (data.tagName.toLowerCase() == 'footprint') {
//			var pad = new Pad(0, 0, 0, 0);
//			pad.fromXML(data);
//			return pad;
//		}
//		if (data.tagName.toLowerCase() == 'rectangle') {
//			var roundRect = new RoundRect(0, 0, 0, 0, 0,0, core.Layer.SILKSCREEN_LAYER_FRONT);
//			roundRect.fromXML(data);
//			return roundRect;
//		}
		if (data.tagName.toLowerCase() == 'ellipse') {
			var circle = new Circle(0, 0, 0, 0, 0);
			circle.fromXML(data);
			return circle;
		}
		if (data.tagName.toLowerCase() == 'line') {
			var line = new PCBLine( 0, 0, 0, 0, 0);
			line.fromXML(data);
			return line;
		}
//		if (data.tagName.toLowerCase() == 'arc') {
//			var arc = new Arc(0, 0, 0, 0, 0);
//			arc.fromXML(data);
//			return arc;
//		}
//		if (data.tagName.toLowerCase() == 'label') {
//			var label = new GlyphLabel(0, 0, 0);
//			label.fromXML(data);		
//			return label;
//		}
	}
}
class PCBFootprint extends Shape{
constructor(layermaskId){
		super(0,0,0,0,0,layermaskId);
   	    this.shapes=[];
		this.text = new core.ChipText();
	    this.text.Add(new glyph.GlyphTexture("","reference", 0, 0,  core.MM_TO_COORD(1.2)));
	    this.text.Add(new glyph.GlyphTexture("","value", 8,8,core.MM_TO_COORD(1.2)));		 	    
        this.units=core.Units.MM;
        this.value=2.54;  
	}
clone(){
        var copy=new PCBFootprint(this.copper.getLayerMaskID());
        copy.text =this.text.clone();
        copy.shapes=[];
        copy.units=this.units;
        copy.value=this.value;
        this.shapes.forEach(function(shape){ 
          copy.shapes.push(shape.clone());  
        });
        return copy;        
    }
add(shape){
    if (shape == null)
          return;   
    this.shapes.push(shape);  
} 
getChipText() {
    return this.text;
}
getSide(){
    return core.Layer.Side.resolve(this.copper.getLayerMaskID());       
}
clear() {    
	this.shapes.forEach(function(shape) {
		  shape.owningUnit=null;
		  shape.Clear();
		  shape=null;
     });
     this.shapes=[];	
     this.text.Clear();
}
getOrderWeight() {
   var r=this.getBoundingShape();
   return (r.width);
}
calculateShape() {
 	var r = new core.Rectangle(0,0,0,0);
 	var x1 = Number.MAX_VALUE; 
 	var y1 = Number.MAX_VALUE;
 	var x2 = Number.MIN_VALUE;
 	var y2 = Number.MIN_VALUE;
 	
 	
    //***empty schematic,element,package
    if (this.shapes.length == 0) {
        return r;
    }

    var len=this.shapes.length;
	    for(var i=0;i<len;i++){
        var tmp = this.shapes[i].getBoundingShape();
        if (tmp != null) {
            x1 = Math.min(x1, tmp.x);
            y1 = Math.min(y1, tmp.y);
            x2 = Math.max(x2, tmp.x+tmp.width);
            y2 = Math.max(y2, tmp.y+tmp.height);
        }
        
    }
    r.setRect(x1, y1, x2 - x1, y2 - y1);
    return r;
}	
Move(xoffset,yoffset){
	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].Move(xoffset,yoffset);  
	   }	
	   this.text.Move(xoffset,yoffset);
}
Rotate(rotation){
	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].Rotate(rotation);  
	   }	
	   this.text.Rotate(rotation);
}
Paint(g2, viewportWindow, scale,layermask) {        
     
	   var rect = this.getBoundingShape().getScaledRect(scale);
	   if (!rect.intersects(viewportWindow)) {
		 return;
	   }
	 
	   var len=this.shapes.length;
	   for(i=0;i<len;i++){
		  this.shapes[i].Paint(g2,viewportWindow,scale);  
	   }
	   
    this.text.Paint(g2,viewportWindow,scale,layermask);      
    
    if(this.selection){

		g2.globalCompositeOperation = 'lighter';
		g2.beginPath();
		utilities.roundrect(g2, rect.x - viewportWindow.x, rect.y
				- viewportWindow.y, rect.width, rect.height, 3000
				* scale.getScale());
		
		g2.closePath();
		g2.fillStyle = "gray";
		g2.fill();
		g2.globalCompositeOperation = 'source-over';
    }
 }    

}

class PCBCircle extends Circle{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
    }	
    clone(){
    	return new PCBCircle(this.x,this.y,this.width,this.thickness,this.copper.getLayerMaskID());
    }    
}

class PCBArc extends Arc{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
    }	
    clone() {
		var copy = new PCBArc(this.x, this.y, this.width,
						this.thickness,this.copper.getLayerMaskID());
		copy.startAngle = this.startAngle;
		copy.extendAngle = this.extendAngle;
		copy.fill = this.fill;
		return copy;
}    
}

class PCBLabel extends GlyphLabel{
    constructor( layermaskId) {
        super("Label",core.MM_TO_COORD(0.3),layermaskId);
    }
clone(){
	var copy = new PCBLabel(this.copper.getLayerMaskID());
    copy.texture = this.texture.clone();        
    copy.copper=this.copper;
    return copy;
}    
getDrawingOrder() {
        let order=super.getDrawingOrder();
        if(this.owningUnit==null){            
           return order;
        }
        
        if(owningUnit.getActiveSide()==Layer.Side.resolve(this.copper.getLayerMaskID())){
          order= 4;
        }else{
          order= 3; 
        }  
        return order;
    }
}
class PCBLine extends Line{
constructor(thickness,layermaskId){
        super(thickness,layermaskId);
    }
clone() {
		var copy = new PCBLine(this.thickness,this.copper.getLayerMaskID());
		for (var index = 0; index < this.points.length; index++) {
			  copy.points.push(new core.Point(this.points[index].x,this.points[index].y));
		}
		return copy;

	}    
}
class PCBRoundRect extends RoundRect{
constructor( x, y,  width,height,arc,  thickness, layermaskid) {
        super( x, y, width,height,arc, thickness, layermaskid);
    }
clone(){
	var copy = new PCBRoundRect(this.getX(), this.getY(), this.width, this.height, this.arc,
			this.thickness,this.copper.getLayerMaskID());
	copy.roundRect = new core.Rectangle(this.roundRect.x,
			this.roundRect.y, this.roundRect.width, this.roundRect.height);
	copy.fill = this.fill;
	copy.arc=this.arc;
	return copy;	
}    
}
class PCBTrack extends Shape{
	
}

class PCBVia extends Shape{
	
}


module.exports ={
		PCBFootprint,
		PCBLabel,
		PCBCircle,
		PCBRoundRect,
		PCBArc,
		PCBVia,
		PCBTrack,
		PCBLine,
		BoardShapeFactory
		
}