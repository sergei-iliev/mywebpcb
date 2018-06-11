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
		if (data.tagName.toLowerCase() == 'copperarea') {
			var area = new PCBCopperArea( 0, 0, 0, 0, 0);
			area.fromXML(data);
			return area;
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
		this.displayname = "Footprint";
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
        this.displayname = "Circle";
    }	
    clone(){
    	return new PCBCircle(this.x,this.y,this.width,this.thickness,this.copper.getLayerMaskID());
    }    
}

class PCBArc extends Arc{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
        this.displayname = "Arc";
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
        this.displayname = "Line";
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
        this.displayname = "Rect";
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
class Polygon{
	constructor(){
		this.points=[];
	}
add(point){
  this.points.push(point);	
}	
getBoundingRect(){	
	let r= new core.Rectangle(0,0,0,0);
	
    var x1 = Number.MAX_VALUE; 
    var y1 = Number.MAX_VALUE;
    var x2 = Number.MIN_VALUE;
    var y2 = Number.MIN_VALUE;

    this.points.forEach(function(p) {
        x1 = Math.min(x1, p.x);
        y1 = Math.min(y1, p.y);
        x2 = Math.max(x2, p.x);
        y2 = Math.max(y2, p.y);
    });

    r.setRect(x1, y1, x2 - x1, y2 - y1);
    return r;	
}

}
class PCBCopperArea extends Shape{
	constructor( layermaskid) {
        super( 0, 0, 0,0, 0, layermaskid);
        this.displayname = "Copper Area";
        this.clearance=core.MM_TO_COORD(0.2); 
        this.points=[];
        this.floatingStartPoint=new core.Point();
        this.floatingEndPoint=new core.Point();                 
        this.selectionRectWidth = 3000;
        this.fill=core.Fill.FILLED;
        this.polygon=new Polygon();
        this.resizingPoint;
    }
calculateShape(){  	    
   return this.polygon.getBoundingRect();
}	

getLinePoints() {
   return this.polygon.points;
}
add(point) {
    this.polygon.add(point);
}
setResizingPoint(point) {
    this.resizingPoint=point;
}
isFloating() {
    return (!this.floatingStartPoint.equals(this.floatingEndPoint));                
}
isControlRectClicked(x, y) {
	var rect = new core.Rectangle(x
								- this.selectionRectWidth / 2, y - this.selectionRectWidth
								/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polygon.points.some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
isInRect(r) {

    return this.polygon.points.every(function(wirePoint){
    	return r.contains(wirePoint.x,wirePoint.y);                        
    });
    
}
reset(){
	this.resetToPoint(this.floatingStartPoint);	
}
resetToPoint(p){
    this.floatingStartPoint.setLocation(p.x,p.y);
    this.floatingEndPoint.setLocation(p.x,p.y); 
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.setLocation(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
Paint(g2,viewportWindow,scale, layersmask){
	var rect = this.getBoundingShape().getScaledRect(scale);
	if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	}
	let dst = [];
	this.polygon.points.forEach(function(point) {
		dst.push(point.getScaledPoint(scale));
	});
	g2.globalCompositeOperation = 'lighter';
	g2.beginPath();
	g2.lineCap = 'round';
	g2.lineJoin = 'round';
	g2.moveTo(dst[0].x - viewportWindow.x, dst[0].y
							- viewportWindow.y);
	for (var i = 1; i < dst.length; i++) {
						g2.lineTo(dst[i].x - viewportWindow.x, dst[i].y
								- viewportWindow.y);
	}
	
	// draw floating point
	if (this.isFloating()) {
			let p = this.floatingEndPoint.getScaledPoint(scale);
				g2.lineTo(p.x - viewportWindow.x, p.y
								- viewportWindow.y);
	}
	g2.closePath();

	if (this.selection){
		g2.fillStyle = "gray";
    }else{    	
		g2.fillStyle = this.copper.getColor();
	}
    g2.fill();   
    
    if(this.isSelected()){  
    	g2.lineWidth=1;
    	g2.strokeStyle = "blue";                   
        g2.stroke();
    
        this.drawControlShape(g2,viewportWindow,scale);
    }
    
	g2.globalCompositeOperation = 'source-over';
}	
drawControlShape(g2, viewportWindow,scalableTransformation) {
	var line=new core.Line();
	g2.lineWidth=1; 						
	this.polygon.points.forEach(function(wirePoint) {
		if (this.resizingPoint != null
									&& this.resizingPoint.equals(wirePoint))
			g2.strokeStyle  = 'yellow';
		else
			g2.strokeStyle  = 'blue';

		line.setLine(wirePoint.x - this.selectionRectWidth,
									wirePoint.y, wirePoint.x
											+ this.selectionRectWidth, wirePoint.y);
	    line.draw(g2, viewportWindow,
									scalableTransformation);

	    line.setLine(wirePoint.x, wirePoint.y
									- this.selectionRectWidth, wirePoint.x,
									wirePoint.y + this.selectionRectWidth);
		line.draw(g2, viewportWindow,
									scalableTransformation);
	}.bind(this));
}
}

module.exports ={
		PCBCopperArea,
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