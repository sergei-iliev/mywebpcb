var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var AbstractLine=require('core/shapes').AbstractLine;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var d2=require('d2/d2');

class SymbolShapeFactory{
	
	createShape(data){
		if (data.tagName.toLowerCase() == 'pad') {
			var pad = new Pad(0, 0, 0, 0);
			pad.fromXML(data);
			return pad;
		}
		if (data.tagName.toLowerCase() == 'rectangle') {
			var roundRect = new RoundRect(0, 0, 0, 0, 0,0, core.Layer.SILKSCREEN_LAYER_FRONT);
			roundRect.fromXML(data);
			return roundRect;
		}
		if (data.tagName.toLowerCase() == 'circle') {
			var circle = new Circle(0, 0, 0, 0, 0);
			circle.fromXML(data);
			return circle;
		}
		if (data.tagName.toLowerCase() == 'ellipse') {
			var circle = new Circle(0, 0, 0, 0, 0);
			circle.fromXML(data);
			return circle;
		}
		if (data.tagName.toLowerCase() == 'line') {
			var line = new Line( 0, 0, 0, 0, 0);
			line.fromXML(data);
			return line;
		}
		if (data.tagName.toLowerCase() == 'arc') {
			var arc = new Arc(0, 0, 0, 0, 0);
			arc.fromXML(data);
			return arc;
		}
		if (data.tagName.toLowerCase() == 'label') {
			var label = new FontLabel(0,0);
			label.fromXML(data);		
			return label;
		}
		if (data.tagName.toLowerCase() == 'solidregion') {
			var region = new SolidRegion(0);
			region.fromXML(data);		
			return region;
		}	

	}
}

class Line extends AbstractLine{
constructor(thickness) {
	super(1,core.Layer.LAYER_ALL);	
	this.fillColor='black';
	this.selectionRectWidth=4;
}

paint(g2, viewportWindow, scale,layersmask) {			
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}
				

		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		g2.lineWidth = this.thickness * scale.getScale();


		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = this.fillColor;
		
		let a=this.polyline.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		// draw floating point
		if (this.isFloating()) {
				let p = this.floatingEndPoint.clone();
				p.scale(scale.getScale());
				p.move( - viewportWindow.x, - viewportWindow.y);
					g2.lineTo(p.x, p.y);									
					g2.stroke();					
		}
		
		if (this.selection&&this.isControlPointVisible) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}

}

}
class FontLabel extends Shape{
	constructor(x, y) {
		super(x, y, 0, 0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Label");		
		this.texture=new font.SymbolFontTexture("Label","label",x,y,8,0);
		this.texture.fillColor = '#000000';
		this.rotate=0;
	}
	clone(){
		var copy = new FontLabel(this.x,this.y);
		copy.texture = this.texture.clone();  				
		return copy;
	}
	calculateShape(){ 
		  return this.texture.getBoundingShape();
		}
	isClicked(x, y) {
		if (this.texture.isClicked(x, y))
			return true;
		else
			return false;
	}    
    setSelected(selected) {
        this.texture.selection=selected;
    }
    
    isSelected() {
        return this.texture.selection;
    }	
    getTexture(){
		  return this.texture;
		}
    Rotate(rotation){
       this.texture.rotate(rotation);
    }    
    Move(xoffset,yoffset) {
        this.texture.Move(xoffset, yoffset);
    }
   getCenter() {        
        return this.texture.shape.anchorPoint;
   }
paint(g2, viewportWindow, scale,layersmask) {	
	  var rect = this.texture.getBoundingShape();
	  rect.scale(scale.getScale());
	  if (!rect.intersects(viewportWindow)) {
	  	return;
	  }

	  this.texture.paint(g2, viewportWindow, scale);
}
	    
    
}
class Arc extends Shape{
	constructor(x,y,w,h) {
	   super(x,y, w, h, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Arc");		
		this.arc=new d2.Arcellipse(new d2.Point(x,y),w,h);
		this.selectionRectWidth=4;
		this.fillColor='black';								
	}
	clone(){
		var copy = new Arc(this.arc.pc.x,this.arc.pc.y,this.arc.w,this.arc.h);
		copy.arc=this.arc.clone();				
		return copy;
	}
	calculateShape() {
		return this.arc.box;		
	}
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null;
		this.arc.vertices.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	isClicked(x, y) {
		if (this.arc.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	isStartAnglePointClicked(x,y){	
	    let p=this.arc.start;
	    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
	                 this.selectionRectWidth, this.selectionRectWidth);
	    if (box.contains({x,y})) {
	        return true;
	    }else{                   
	        return false;
		}
	}	
	isExtendAnglePointClicked(x,y){
	    let p=this.arc.end;
	    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
	                 this.selectionRectWidth, this.selectionRectWidth);
	    if (box.contains({x,y})) {
	        return true;
	    }else{                   
	        return false;
		}
	}	
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}
	getCenter() {
	    return this.arc.pc;
	}
	setExtendAngle(extendAngle){
	    this.arc.endAngle=utilities.round(extendAngle);
	}
	setStartAngle(startAngle){        
	    this.arc.startAngle=utilities.round(startAngle);
	}	
	Rotate(rotation){	
		   this.arc.pc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
		   let w=this.arc.w;
		   this.arc.w=this.arc.h;
		   this.arc.h=w;
		   this.arc.startAngle+=rotation.angle;
      	   if(this.arc.startAngle>=360){
    		 this.arc.startAngle-=360;
    	   }
    	   if(this.arc.startAngle<0){
    		 this.arc.startAngle+=360; 
    	   }
	} 	
    Move(xoffset,yoffset) {
        this.arc.move(xoffset, yoffset);
    }
	Resize(xoffset, yoffset,clickedPoint){
		this.arc.resize(xoffset, yoffset,clickedPoint);
	}
	paint(g2, viewportWindow, scale,layersmask) {	
	  	  var rect = this.arc.box;
	  	  rect.scale(scale.getScale());
	  	  if (!rect.intersects(viewportWindow)) {
	  		  return;
	  	  }

		  g2.lineWidth = this.thickness * scale.getScale();
		  g2.lineCap = 'round';
		  g2.lineJoin = 'round';
			
		  if (this.fill == core.Fill.EMPTY) {
				if (this.selection) {
					g2.strokeStyle = "gray";
				} else {
					g2.strokeStyle = this.fillColor;
				}
			} else {
				g2._fill=true;
				if (this.selection) {
					g2.fillStyle = "gray";
				} else {
					g2.fillStyle = this.fillColor;
				}			
			}
			let e=this.arc.clone();	
			e.scale(scale.getScale());
	        e.move(-viewportWindow.x,- viewportWindow.y);
			e.paint(g2);
			
			g2._fill=false;
			if (this.isSelected()) {
				this.drawControlPoints(g2, viewportWindow, scale);
			}		
	}
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.arc.vertices); 		
}	
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
}
class Ellipse extends Shape{
	constructor(w, h) {
		super(0,0, w, h, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Ellipse");		
		this.ellipse=new d2.Ellipse(new d2.Point(0,0),w,h);
		this.selectionRectWidth=4;
		this.fillColor='black';
		this.rotate=0;
	}
	clone(){
		var copy = new Ellipse(this.ellipse.w,this.ellipse.h);
		copy.ellipse=this.ellipse.clone();
				
		return copy;
	}
	calculateShape() {
		return this.ellipse.box;		
	}
	getCenter() {
	    return this.ellipse.pc;
	}
	isClicked(x, y) {
		if (this.ellipse.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}	
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null
		this.ellipse.vertices.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
    Move(xoffset,yoffset) {
        this.ellipse.move(xoffset, yoffset);
    }
	Rotate(rotation){			   
	   this.ellipse.pc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	   let w=this.ellipse.w;
	   this.ellipse.w=this.ellipse.h;
	   this.ellipse.h=w;
	}    
	Resize(xoffset, yoffset,clickedPoint){
		this.ellipse.resize(xoffset, yoffset,clickedPoint);
	}    
    paint(g2, viewportWindow, scale,layersmask) {	
  	  var rect = this.ellipse.box;
  	  rect.scale(scale.getScale());
  	  if (!rect.intersects(viewportWindow)) {
  		  return;
  	  }

		g2.lineWidth = this.thickness * scale.getScale();
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.fillColor;
			}
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.fillColor;
			}			
		}
		let e=this.ellipse.clone();	
		e.scale(scale.getScale());
        e.move(-viewportWindow.x,- viewportWindow.y);
		e.paint(g2);
		
		g2._fill=false;
		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}	
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.ellipse.vertices); 		
	}	
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
}
class RoundRect extends Shape{
	constructor(x, y, width, height,arc,thickness) {
		super(x, y, width, height, thickness,core.Layer.LAYER_ALL);
		this.setDisplayName("Rect");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='black';
		//this.rotate=0;
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone(){
		var copy = new RoundRect(this.x,this.y,this.width,this.height,0,this.thickness);
		copy.roundRect = this.roundRect.clone();		
		copy.fill = this.fill;		
		return copy;
	}
	calculateShape() {
		return this.roundRect.box;		
	}
    alignResizingPointToGrid(targetPoint){
        let point=this.owningUnit.getGrid().positionOnGrid(targetPoint.x,targetPoint.y);  
        this.Resize(point.x -targetPoint.x,point.y-targetPoint.y,targetPoint);     
    }	
	getCenter() {
		let box=this.roundRect.box;
	    return new d2.Point(box.center.x,box.center.y);
	}
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}	
	isClicked(x, y) {
		if (this.roundRect.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null
		this.roundRect.points.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	setRounding(rounding){	  
		  this.roundRect.setRounding(rounding);
		}
	setResizingPoint(pt){
			this.resizingPoint=pt;
		}
	getResizingPoint() {
			return this.resizingPoint;
		}	
	Move(xoffset, yoffset) {
		this.roundRect.move(xoffset,yoffset);
	}
	Rotate(rotation){		
		this.roundRect.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}	
	Resize(xoffset, yoffset,clickedPoint){
		this.roundRect.resize(xoffset, yoffset,clickedPoint);
	}
	paint(g2, viewportWindow, scale,layersmask) {	
		
		var rect = this.roundRect.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		
		g2.lineWidth = this.thickness * scale.getScale();
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		
		if (this.fill == core.Fill.EMPTY) {
			g2.globalCompositeOperation = 'lighter';
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.fillColor;
			}
			g2.globalCompositeOperation = 'source-over';
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.fillColor;
			}			
		}
		let r=this.roundRect.clone();	
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		r.paint(g2);
		
		g2._fill=false;
		
		

		if (this.isSelected()&&this.isControlPointVisible) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}	
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.roundRect.vertices); 		
}		
}

class ArrowLine extends Shape{
	constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Arrow");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='black';	
	    this.line=new d2.Segment(0,0,20,20);
	    this.arrow=new d2.Polygon();
	    this.arrow.points=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)];
	    this.headSize;	    
	    this.setHeadSize(3);
}
clone(){
    var copy=new ArrowLine();
    copy.headSize=this.headSize;
    copy.line=this.line.clone();
    copy.arrow=this.arrow.clone();    
    return copy;
}
calculateShape() {
	return this.line.box;		
}
isClicked(x, y) {
	if (this.arrow.contains(new d2.Point(x, y))){
		return true;
	}else{
		  var rect = d2.Box.fromRect(x
					- (this.selectionRectWidth / 2), y
					- (this.selectionRectWidth / 2), this.selectionRectWidth,
					this.selectionRectWidth);
		  
			if (utilities.intersectLineRectangle(
					this.line.ps,this.line.pe, rect.min, rect.max)) {			
				return true;
			}else{
				return false
			}
	}
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	
		if (rect.contains(this.line.ps)){
		  return this.line.ps;	
		}else if(rect.contains(this.line.pe)) {					
		  return this.line.pe;
		}else{
		  return null;
		}
}
setHeadSize(headSize) {

    this.headSize = headSize;
    this.arrow.points[0].set(this.line.pe.x,this.line.pe.y);
    this.arrow.points[1].set(this.line.pe.x-2*headSize,this.line.pe.y -headSize);
    this.arrow.points[2].set(this.line.pe.x-2*headSize,this.line.pe.y+headSize);  
    let angle = Math.atan2(((this.line.pe.y) - (this.line.ps.y)),((this.line.pe.x - this.line.ps.x)));
    let deg=-1*utilities.degrees(angle);
    
    this.arrow.rotate(deg,this.line.pe);
}	
Resize(xoffset,yoffset,clickedPoint) {    
    clickedPoint.set(clickedPoint.x + xoffset, 
                             clickedPoint.y + yoffset);
    this.setHeadSize(this.headSize);
}
Rotate(rotation){		
	this.arrow.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	this.line.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
}
Move(xoffset, yoffset) {
	this.line.move(xoffset,yoffset);
	this.arrow.move(xoffset,yoffset);
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.line.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth = this.thickness * scale.getScale();

	if (this.selection) {
		g2.strokeStyle = "gray";
	} else {
		g2.strokeStyle = this.fillColor;
	}


	
	let l=this.line.clone();
	l.pe.set((this.arrow.points[1].x + this.arrow.points[2].x)/2, (this.arrow.points[1].y + this.arrow.points[2].y)/2);
	l.scale(scale.getScale());
    l.move(-viewportWindow.x,- viewportWindow.y);
	l.paint(g2);
	
	if (this.fill == core.Fill.EMPTY) {
		if (this.selection) {
			g2.strokeStyle = "gray";
		} else {
			g2.strokeStyle = this.fillColor;
		}
	} else {
		g2._fill=true;
		if (this.selection) {
			g2.fillStyle = "gray";
		} else {
			g2.fillStyle = this.fillColor;
		}			
	}
	let a=this.arrow.clone();	
	a.scale(scale.getScale());
    a.move(-viewportWindow.x,- viewportWindow.y);
	a.paint(g2);
	g2._fill=false;	
	
	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}	
drawControlPoints(g2, viewportWindow, scale){
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,[this.line.ps,this.line.pe]); 		
}	
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
}
class Triangle extends Shape{
	constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Triangle");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='black';	
	    this.shape=new d2.Polygon();
	    this.shape.points=[new d2.Point(0,0),new d2.Point(20,20),new d2.Point(0,40)];	    	    	    
}
clone(){
    var copy=new Triangle();
    copy.shape=this.shape.clone();    
    return copy;
}
alignResizingPointToGrid(targetPoint){
    let point=this.owningUnit.getGrid().positionOnGrid(targetPoint.x,targetPoint.y);  
    this.Resize(point.x -targetPoint.x,point.y-targetPoint.y,targetPoint);     
}
calculateShape() {
  return this.shape.box;		
}
getCenter(){
	return this.shape.box.center;
}
isClicked(x, y) {
  return this.shape.contains(new d2.Point(x, y));	
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.shape.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
		  point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
Rotate(rotation){		
	this.shape.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
}
Move(xoffset, yoffset) {
	this.shape.move(xoffset,yoffset);	
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.shape.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth = this.thickness * scale.getScale();
	
	if (this.fill == core.Fill.EMPTY) {
		if (this.selection) {
			g2.strokeStyle = "gray";
		} else {
			g2.strokeStyle = this.fillColor;
		}
	} else {
		g2._fill=true;
		if (this.selection) {
			g2.fillStyle = "gray";
		} else {
			g2.fillStyle = this.fillColor;
		}			
	}
	let a=this.shape.clone();	
	a.scale(scale.getScale());
    a.move(-viewportWindow.x,- viewportWindow.y);
	a.paint(g2);
	g2._fill=false;	
	
	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}

drawControlPoints(g2, viewportWindow, scale){
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.shape.points); 		
}
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
}
Style ={
    LINE:0, /*default*/
    INVERTED:1,
    CLOCK:2,
    INVERTED_CLOCK:3,
    INPUT_LOW:4,
    CLOCK_LOW:5,
    OUTPUT_LOW:6,
    FALLING_EDGE_CLOCK:7,
    NON_LOGIC:8
}
Orientation={
        NORTH:0,
        SOUTH:1,
        WEST:2,
        EAST:3,
rotate:function(isClockwise,orientation) {
       if (isClockwise) {
               if (orientation == Orientation.NORTH)
                    return Orientation.EAST;
                else if (orientation == Orientation.EAST)
                    return Orientation.SOUTH;
                else if (orientation == Orientation.SOUTH)
                    return Orientation.WEST;
                else
                    return Orientation.NORTH;
        } else {
                if (orientation == Orientation.NORTH)
                    return Orientation.WEST;
                else if (orientation == Orientation.WEST)
                    return Orientation.SOUTH;
                else if (orientation == Orientation.SOUTH)
                    return Orientation.EAST;
                else
                    return Orientation.NORTH;
        }
  }        
}
PinType={
		SIMPLE:0,
		COMPLEX:1,

//		   parse:function(type){
//			  switch(type){
//			  case 'THROUGH_HOLE':
//				     return this.THROUGH_HOLE;
//					 break;
//			  case 'SMD':
//					 return this.SMD;
//					 break; 
//			  case 'CONNECTOR':
//					 return this.CONNECTOR;
//					 break;	
//			  default:
//				  throw new TypeError('Unrecognized pad Type:'+type+' to parse');  
//			  } 
//		   },
//		   format:function(type){
//			  if(type==this.THROUGH_HOLE)
//				 return 'THROUGH_HOLE';
//			  if(type==this.SMD)
//					 return 'SMD';
//			  if(type==this.CONNECTOR)
//					 return 'CONNECTOR';
//			  else
//				  return '';
//		   }
};
var PIN_LENGTH = 2 * utilities.POINT_TO_POINT;

class Pin extends Shape{
constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Pin");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='black';	
	    this.segment=new d2.Segment(0,0,0,0);        
        this.type = PinType.COMPLEX;
        this.style = Style.LINE;
 	    
 	    this.name=new font.SymbolFontTexture("XXX","name",-8,0,8,0);
	    this.number=new font.SymbolFontTexture("1","number",10,-4,8,0);
	    this.setOrientation(Orientation.EAST);
	}
clone(){
    var copy=new Pin();
    copy.orientation=this.orientation;
    copy.type=this.type;
    copy.style=this.style;
    copy.name=this.name.clone();
    copy.number=this.number.clone();
    copy.segment=this.segment.clone();
    return copy;
}

alignToGrid(isRequired) {
    var center=this.segment.ps;
    var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
    this.Move(point.x - center.x,point.y - center.y);
    return new d2.Point(point.x - center.x, point.y - center.y);  
}
getClickedTexture(x,y) {
    if(this.name.isClicked(x, y))
        return this.name;
    else if(this.number.isClicked(x, y))
        return this.number;
    else
    return null;
}
isClickedTexture(x,y) {
    return this.getClickedTexture(x, y)!=null;
}
getTextureByTag(tag) {
    if(tag===(this.name.tag))
        return this.name;
    else if(tag===(this.number.tag))
        return this.number;
    else
    return null;
}
isClicked(x, y) {
	  var rect = d2.Box.fromRect(x
				- (this.selectionRectWidth / 2), y
				- (this.selectionRectWidth / 2), this.selectionRectWidth,
				this.selectionRectWidth);
	  
		if (utilities.intersectLineRectangle(
				this.segment.ps,this.segment.pe, rect.min, rect.max)) {			
			return true;
		}else{
			return false
		}
		
}
Rotate(rotation){
	//read current position	
	let oposname= utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	let oposnumber= utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	
	this.segment.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	this.orientation=Orientation.rotate(rotation.angle>0?false:true,this.orientation);
	this.name.rotate(rotation);
	this.number.rotate(rotation);
	
	//read new position
	let nposname=utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);	
	this.normalizeText(this.name,oposname,nposname);

	
	let nposnumber=utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);	
	this.normalizeText(this.number,oposnumber,nposnumber);
	
}
normalizeText(text,opos,npos){
	if(opos==npos){
	   return;	
	}
	if(this.orientation==Orientation.EAST||this.orientation==Orientation.WEST){	//horizontal
	  let off=this.segment.ps.y-text.shape.anchorPoint.y;
	  text.Move(0,2*off);
	}else{	//vertical
	  let off=this.segment.ps.x-text.shape.anchorPoint.x;
	  text.Move(2*off,0);		  
	}	
}
Move(xoffset,yoffset) {
    this.segment.move(xoffset,yoffset);
	this.name.Move(xoffset,yoffset);
	this.number.Move(xoffset,yoffset);
}
calculateShape() {
	return this.segment.box;
} 
setOrientation(orientation){
	this.orientation=orientation;
    switch (this.orientation) {
    case Orientation.EAST:        
        this.segment.pe.set(this.segment.ps.x + (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2), this.segment.ps.y);
        break;
    case Orientation.WEST:
    	this.segment.pe.set(this.segment.ps.x - (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2), this.segment.ps.y);    	
        break;
    case Orientation.NORTH:
    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y - (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2));    	
        break;
    case Orientation.SOUTH:    	
    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y + (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2));
    }   
}
getCenter(){
	return this.segment.ps;
}
setSelected (selection) {
	super.setSelected(selection);
	this.number.setSelected(selection);
	this.name.setSelected(selection);
}

paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.segment.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	

	g2.lineWidth = this.thickness ;
	if (this.selection) {
		g2.strokeStyle = "gray";
	  	this.name.fillColor = "gray";
	  	this.number.fillColor = "gray";
	} else {
		g2.strokeStyle = this.fillColor;
	  	this.name.fillColor = 'black';
		this.number.fillColor = 'black';
	}
	
	switch(this.style){
	case Style.LINE:
		this.drawPinLine(g2, viewportWindow, scale,0);
		break;
	case Style.INVERTED:
		this.drawPinLine(g2, viewportWindow, scale,(PIN_LENGTH / 3));
		this.drawInverted(g2, viewportWindow, scale);
		break;	  
	case Style.CLOCK:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawTriState(g2, viewportWindow, scale);
		break;
	case Style.INVERTED_CLOCK:
		this.drawPinLine(g2, viewportWindow, scale,(PIN_LENGTH / 3));
		this.drawInverted(g2, viewportWindow, scale);
		this.drawTriState(g2, viewportWindow, scale);
		break;
	case Style.INPUT_LOW:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawInputLow(g2, viewportWindow, scale);
		break;
	case Style.CLOCK_LOW:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawInputLow(g2, viewportWindow, scale);
		this.drawTriState(g2, viewportWindow, scale);
		break;
	case  Style.OUTPUT_LOW:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawOutputLow(g2, viewportWindow, scale);
		break;
	case  Style.FALLING_EDGE_CLOCK:
		this.drawPinLine(g2, viewportWindow, scale,PIN_LENGTH/ 6);
		this.drawFallingEdgeClock(g2, viewportWindow, scale);
		break;
		  
	}
	


	
	  
    this.name.paint(g2, viewportWindow, scale);
    this.number.paint(g2, viewportWindow, scale);	
}
drawPinLine(g2,viewportWindow, scale,offset){	
    let line=this.segment.clone();            
        
    switch (this.orientation) {
    case Orientation.SOUTH:
    	line.ps.set(line.ps.x,line.ps.y+offset);
        break;
    case Orientation.NORTH:
    	line.ps.set(line.ps.x,line.ps.y-offset);
        break;
    case Orientation.WEST:
    	line.ps.set(line.ps.x-offset,line.ps.y);  
        break;
    case Orientation.EAST:
    	line.ps.set(line.ps.x+offset,line.ps.y);    	
        break;
    }
	line.scale(scale.getScale());
    line.move(-viewportWindow.x,- viewportWindow.y);
    
    line.paint(g2);
}
drawFallingEdgeClock( g2, viewportWindow,scale) {
	let pinlength = PIN_LENGTH *scale.getScale(); 
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
    case Orientation.SOUTH:
        line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y + pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y + pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.NORTH:
        line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y - pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y - pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.WEST:
        line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                      x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                      x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.EAST:
        line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                      x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                      x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    }
}
drawOutputLow(g2,viewportWindow, scale) {
	let pinlength = PIN_LENGTH *scale.getScale(); 
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
    case Orientation.SOUTH:
        line.set(x - viewportWindow.x, y+ (pinlength / 3) - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y  - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.NORTH:
        line.set(x - viewportWindow.x, y- (pinlength / 3) - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.WEST:
        line.set(x - viewportWindow.x, y- (pinlength / 6) - viewportWindow.y, x - (pinlength / 3) - viewportWindow.x,
                      y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.EAST:
        line.set(x - viewportWindow.x, y - (pinlength / 6) - viewportWindow.y, x + (pinlength / 3) - viewportWindow.x,
                      y  - viewportWindow.y);
        line.paint(g2);
        break;
    }

}
drawInputLow(g2,viewportWindow, scale) {
	let pinlength = PIN_LENGTH *scale.getScale(); 
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
    case Orientation.SOUTH:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y + (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        line.set(x - (pinlength / 6) - viewportWindow.x, y + (pinlength / 3) - viewportWindow.y,
                      x - viewportWindow.x, y + (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.NORTH:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y - (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        line.set(x - (pinlength / 6) - viewportWindow.x, y - (pinlength / 3) - viewportWindow.y,
                      x - viewportWindow.x, y - (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.WEST:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x - (pinlength / 3) - viewportWindow.x,
                      y - (pinlength / 6) - viewportWindow.y);
        line.paint(g2);
        line.set(x - (pinlength / 3) - viewportWindow.x, y - (pinlength / 6) - viewportWindow.y,
                      x - (pinlength / 3) - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.EAST:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x + (pinlength / 3) - viewportWindow.x,
                      y - (pinlength / 6) - viewportWindow.y);
        line.paint(g2);
        line.set(x + (pinlength / 3) - viewportWindow.x, y - (pinlength / 6) - viewportWindow.y,
                      x + (pinlength / 3) - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    }

}
drawTriState(g2, viewportWindow, scale){
    let pinlength = PIN_LENGTH *scale.getScale();    
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
      case Orientation.EAST:
          line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                  x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
          line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                  x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
    	  break;
      case Orientation.WEST:
          line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                  x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
          line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                  x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
    	  break;
      case Orientation.NORTH:
          line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y + pinlength / 6 - viewportWindow.y);
          line.paint(g2);
          line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y + pinlength / 6 - viewportWindow.y);
          line.paint(g2);
    	  break;
      case Orientation.SOUTH:
          line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y - pinlength / 6 - viewportWindow.y);
          line.paint(g2);
          line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y - pinlength / 6 - viewportWindow.y);
          line.paint(g2);
    	  break;	    	  	    
    }
}
drawInverted(g2, viewportWindow, scale){
    let invertCircleRadios = (PIN_LENGTH / 6);
    let circle=new d2.Circle(new d2.Point(this.segment.ps.x,this.segment.ps.y),invertCircleRadios);
    switch (this.orientation) {
      case Orientation.EAST:
    	  circle.move(invertCircleRadios,0);
    	  break;
      case Orientation.WEST:
    	  circle.move(-invertCircleRadios,0);
    	  break;
      case Orientation.NORTH:
    	  circle.move(0,-invertCircleRadios);
    	  break;
      case Orientation.SOUTH:
    	  circle.move(0,invertCircleRadios);
    	  break;	    	  	    
    }
	circle.scale(scale.getScale());
	circle.move(-viewportWindow.x,- viewportWindow.y);
	circle.paint(g2);	
}	
}
module.exports ={
		ArrowLine,
		Triangle,
		Arc,
		Pin,
		Ellipse,
		Line,
		FontLabel,
		RoundRect,
		SymbolShapeFactory
	}