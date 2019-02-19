var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var Circle =require('pads/shapes').Circle;
var Arc =require('pads/shapes').Arc;
var Line =require('pads/shapes').Line;
var RoundRect =require('pads/shapes').RoundRect;
var GlyphLabel=require('pads/shapes').GlyphLabel;
var AbstractLine=require('core/shapes').AbstractLine;
var FootprintShapeFactory=require('pads/shapes').FootprintShapeFactory;
var d2=require('d2/d2');

class BoardShapeFactory{
	
	createShape(data){
		if (data.tagName.toLowerCase() == 'footprint') {
			var footprint = new PCBFootprint(0, 0, 0, 0,0,0);
			footprint.fromXML(data);
			return footprint;
		}
		if (data.tagName.toLowerCase() == 'via') {
			var via = new PCBVia(0, 0, 0, 0,0,0);
			via.fromXML(data);
			return via;
		}		
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
		if (data.tagName.toLowerCase() == 'track') {
		    var track = new PCBTrack(0, 0, 0, 0, 0);
		    track.fromXML(data);
		    return track;
	    }		
//		if (data.tagName.toLowerCase() == 'arc') {
//			var arc = new Arc(0, 0, 0, 0, 0);
//			arc.fromXML(data);
//			return arc;
//		}
		if (data.tagName.toLowerCase() == 'label') {
			var label = new PCBLabel(0, 0, 0);
			label.fromXML(data);		
			return label;
		}
		return null;
	}
}
class PCBFootprint extends Shape{
constructor(layermaskId){
		super(0,0,0,0,0,layermaskId);
		this.displayName = "Footprint";
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
        copy.displayName=this.displayName;
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
		  shape.clear();
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
	var r = new d2.Box(0,0,0,0);
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
     
	   var rect = this.getBoundingShape();		
	   rect.scale(scale.getScale());
	   if (!rect.intersects(viewportWindow)) {
		 return;
	   }
		
	   var len=this.shapes.length;
	   for(i=0;i<len;i++){
		  this.shapes[i].Paint(g2,viewportWindow,scale);  
	   }
    this.text.text.forEach(function(texture){
           //if((texture.getLayermaskId()&layermask)!=0){            
       texture.fillColor=(this.selection?'gray':'cyan');
       texture.Paint(g2,viewportWindow,scale,layermask);
           //}
    },this);      
    
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
fromXML(data){
	 this.copper=core.Layer.Copper.valueOf(j$(data).attr("layer"));
	 this.value=parseFloat(j$(data).find("units").attr("raster"));
     this.units=core.Units.MM;	
     
	 var reference=j$(data).find("reference")[0];
 	 var value=j$(data).find("value")[0];
 	 
 	 
//	 if(reference!=null&&reference.text()!=''){
//           var label = new GlyphLabel(0,0,0);
//           label.fromXML(reference[0]);
//           label.texture.tag="reference";
//           this.add(label);      
// 	 }
// 	 if(value!=null&&value.text()!=''){
//           var label = new GlyphLabel(0,0,0);
//           label.fromXML(value[0]);
//           label.texture.tag="value";
//           this.add(label);	 		   
// 	 }
 	 
 	 var texture=this.text.getTextureByTag("reference");
 	 texture.fromXML(reference);
 	 
 	 var texture=this.text.getTextureByTag("value");
 	 texture.fromXML(value);
 	 
 	 this.displayName=j$(data).find("name")[0].textContent;	
 	 
	 var that=this;
	 var shapeFactory=new FootprintShapeFactory();
	 
	 j$(data).find('shapes').children().each(function(){
         var shape=shapeFactory.createShape(this);
         that.add(shape);
	 });
}
}

class PCBCircle extends Circle{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
    }	
    clone(){
    	let copy = new PCBCircle(this.x,this.y,this.width,this.thickness,this.copper.getLayerMaskID());
    	copy.circle=this.circle.clone();
    	copy.fill=this.fill;
    	return copy;
    }    
}

class PCBArc extends Arc{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
    }	
    clone() {
		var copy = new PCBArc(this.x, this.y, this.width,
						this.thickness,this.copper.getLayerMaskID());
        copy.arc=this.arc.clone();
		copy.arc.startAngle = this.arc.startAngle;
        copy.arc.endAngle = this.arc.endAngle;         
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
fromXML(data){
    //extract layer info        
    if(j$(data).attr("layer")!=null){
       this.copper =core.Layer.Copper.valueOf(j$(data).attr("layer"));
    }else{
       this.copper=core.Layer.Copper.FSilkS;
    }
    this.texture.fromXML(data);  	
}
}
class PCBLine extends Line{
constructor(thickness,layermaskId){
        super(thickness,layermaskId);
    }
clone() {
		var copy = new PCBLine(this.thickness,this.copper.getLayerMaskID());
		  copy.polyline=this.polyline.clone();
		  return copy;
	}    
}
class PCBRoundRect extends RoundRect{
constructor( x, y,  width,height,arc,  thickness, layermaskid) {
        super( x, y, width,height,arc, thickness, layermaskid);
        this.displayName = "Rect";
    }
clone(){
	var copy = new PCBRoundRect(0,0,0,0,0,this.thickness,this.copper.getLayerMaskID());
	copy.roundRect = this.roundRect.clone();
	copy.fill = this.fill;
	copy.arc=this.arc;
	return copy;	
}    
}
//************************PCBTrack********************
class PCBTrack extends AbstractLine{
constructor(thickness,layermaskId){
       super(thickness,layermaskId);
       this.displayName = "Track";
	}
clone() {
	var copy = new PCBTrack(this.thickness,this.copper.getLayerMaskID());
		for (var index = 0; index < this.points.length; index++) {
		   copy.points.push(new core.Point(this.points[index].x,this.points[index].y));
		}
	return copy;

	}

getDrawingOrder() {
    let order=super.getDrawingOrder();
    if(this.owningUnit==null){            
        return order;
    }
    
//    if(this.owningUnit.getActiveSide()==Layer.Side.resolve(this.copper.getLayerMaskID())){
//       order= 4;
//     }else{
//       order= 3; 
//     }  
    return order;     
}

getOrderWeight() {
    return 4;
}

Paint(g2, viewportWindow, scale) {
	var rect = this.getBoundingShape().getScaledRect(scale);
	if (!this.isFloating()
							&& (!rect.intersects(viewportWindow))) {
		return;
	}
					// scale points
	let dst = [];
	this.points.forEach(function(wirePoint) {
		dst.push(wirePoint.getScaledPoint(scale));
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

	g2.lineWidth = this.thickness * scale.getScale();

	// draw floating point
	if (this.isFloating()) {
			let p = this.floatingEndPoint.getScaledPoint(scale);
				g2.lineTo(p.x - viewportWindow.x, p.y
								- viewportWindow.y);
	}

	if (this.selection)
		g2.strokeStyle = "gray";
	else
		g2.strokeStyle = this.copper.getColor();

	g2.stroke();
	g2.globalCompositeOperation = 'source-over';


}
drawControlShape(g2, viewportWindow, scale){   
    if((!this.isSelected())/*&&(!this.isSublineSelected())*/){
      return;
    }
    super.drawControlShape(g2, viewportWindow, scale);
}
fromXML(data) {

       this.copper =core.Layer.Copper.valueOf(j$(data).attr("layer"));
	   this.thickness = (parseInt(j$(data).attr("thickness")));
	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			this.points.push(new core.Point(x, y));
		}
}
}
class PCBHole extends Shape{
	constructor() {
		super(0, 0, 0, 0,0,core.Layer.LAYER_ALL);		
		this.displayName='Hole';	
        this.fillColor='white';
        this.selectionRectWidth = 3000;
        this.circle=new d2.Circle(new d2.Point(0,0),core.MM_TO_COORD(1.6)/2);
   	}
clone(){
	   	var copy = new PCBHole();
		 copy.circle.pc.x=this.circle.pc.x;
		 copy.circle.pc.y=this.circle.pc.y;
		 copy.circle.r=this.circle.r;	        	        
	     return copy;
}	
alignToGrid(isRequired) {
	    if(isRequired){
	       return super.alignToGrid(isRequired);
	    }else{
	        return null;
	    }
	}
Move(xoffset, yoffset) {
	this.circle.move(xoffset,yoffset);
}
getOrderWeight() {
    return 3;
}
setWidth(width){
	  this.circle.r=width/2;
	}
calculateShape() {
	    return this.circle.box;
	}	
Paint(g2, viewportWindow, scale) {	
	var rect = this.calculateShape();
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth=(scale.getScale())*1000;
	if (this.selection) {
		g2.strokeStyle = "gray";
	} else {
		g2.strokeStyle = "white";
	}

    let c=this.circle.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	
	if(this.selection){
	  utilities.drawCrosshair(g2, viewportWindow, scale,null,this.selectionRectWidth,[this.circle.center]);
	}
}
fromXML(node) {
	this.setX(parseInt(j$(data).attr("x")));
	this.setY(parseInt(j$(data).attr("y")));
	this.setWidth(parseInt(j$(data).attr("width")));	      
} 

}
class PCBVia extends Shape{
constructor() {
		super(0, 0, 0, 0,core.MM_TO_COORD(0.3),core.Layer.LAYER_ALL);		
		this.outer=new d2.Circle(new d2.Point(0,0),core.MM_TO_COORD(0.8));
		this.inner=new d2.Circle(new d2.Point(0,0),core.MM_TO_COORD(0.4));
        this.selectionRectWidth = 3000;
		this.displayName='Via';	
        this.fillColor='white';         
   	}

clone(){
   	var copy = new PCBVia();
        copy.inner=this.inner.clone();
        copy.outer=this.outer.clone();
        return copy;
   	}

alignToGrid(isRequired) {
    if(isRequired){
       return super.alignToGrid(isRequired);
    }else{
        return null;
    }
}
Move(xoffset, yoffset) {
   this.outer.move(xoffset,yoffset);
   this.inner.move(xoffset,yoffset);
}
setWidth(width){

}
calculateShape() {
    return this.outer.box;
}
Paint(g2, viewportWindow, scale) {
	
	var rect = this.calculateShape();
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2._fill=true;
	if (this.selection) {
		g2.fillStyle = "gray";
	} else {
		g2.fillStyle = "white";
	}

	let c=this.outer.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	

	g2.fillStyle = "black";	
	c=this.inner.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	
    g2._fill=false;
	if(this.selection){
	   utilities.drawCrosshair(g2, viewportWindow, scale,null,this.selectionRectWidth,[this.inner.center]);
	}    
}
getOrderWeight() {
    return 3;
}
fromXML(data) {
	this.setX(parseInt(j$(data).attr("x")));
	this.setY(parseInt(j$(data).attr("y")));
	this.setWidth(parseInt(j$(data).attr("width")));
	this.thickness = (parseInt(j$(data).attr("drill")));  	
}
}
class Polygon{
	constructor(){
		this.points=[];
	}
add(point){
  this.points.push(point);	
}
insert(point, index) {
    this.points.splice(index, 0, point);
}
contains(x,y){
	  let inside = false;
      // use some raycasting to test hits
      // https://github.com/substack/point-in-polygon/blob/master/index.js
      
	  //flat out points
	  let p = [];

      for (let i = 0, il = this.points.length; i < il; i++)
      {
          p.push(this.points[i].x, this.points[i].y);
      }

	  
	  let length = p.length / 2;

      for (let i = 0, j = length - 1; i < length; j = i++)
      {
          let xi = p[i * 2];
          let yi = p[(i * 2) + 1];
          let xj = p[j * 2];
          let yj = p[(j * 2) + 1];
          let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);

          if (intersect)
          {
              inside = !inside;
          }
      }

      return inside;
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
        this.displayName = "Copper Area";
        this.clearance=core.MM_TO_COORD(0.2); 
        this.floatingStartPoint=new core.Point();
        this.floatingEndPoint=new core.Point();                 
        this.selectionRectWidth = 3000;
        this.fill=core.Fill.FILLED;
        this.polygon=new Polygon();
        this.resizingPoint;
    }
clone(){
    let copy=new PCBCopperArea(this.copper.getLayerMaskID());
    this.polygon.points.forEach(function(point){
    	copy.polygon.points.push(new core.Point(point.x,point.y));
    });  
    return copy;	
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
isClicked(x,y){
  return this.polygon.contains(x,y);
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
Rotate(rotation) {
	this.polygon.points.forEach(function(point) {
				var p = utilities.rotate(point,
									rotation.originx, rotation.originy,
									rotation.angle);
				point.setLocation(p.x, p.y);
	});
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
    if((!this.isSelected())){
        return;
    }  
	utilities.drawCrosshair(g2, viewportWindow,scalableTransformation,this.resizingPoint,this.selectionRectWidth,this.polygon.points);
}
fromXML(data){
    this.copper =core.Layer.Copper.valueOf(j$(data).attr("layer"));
	this.clearance = (parseInt(j$(data).attr("clearance")));
	this.net=(j$(data).attr("net"));
	
	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			this.polygon.points.push(new core.Point(x, y));
	   }
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
		PCBHole,
		PCBTrack,
		PCBLine,
		BoardShapeFactory
		
}