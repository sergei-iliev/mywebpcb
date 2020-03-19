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
        this.texture.setSelected(selected);
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

	  if (this.selection) {
	  		this.texture.fillColor = "gray";
	  } else {
	  		this.texture.fillColor = 'black';
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
        EAST:3
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
        this.orientation = Orientation.EAST;
        this.type = PinType.COMPLEX;
        this.style = Style.LINE;
 	    
 	    this.name=new font.SymbolFontTexture("XXX","name",-8,0,8,0);
	    this.number=new font.SymbolFontTexture("1","number",6,-4,8,0);
	    this.segment=new d2.Segment(0,0,0,0);
	    this.createPinLine();
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
Move(xoffset,yoffset) {
    this.segment.move(xoffset,yoffset);
	this.name.Move(xoffset,yoffset);
	this.number.Move(xoffset,yoffset);
}
calculateShape() {
	return this.segment.box;
} 
createPinLine(){
    switch (this.orientation) {
    case Orientation.EAST:        
        this.segment.pe.set(this.getX() + (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2), this.getY());
        break;
    case Orientation.WEST:
    	this.segment.pe.set(this.getX() - (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2), this.getY());    	
        break;
    case Orientation.NORTH:
    	this.segment.pe.set(this.getX(), this.getY() - (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2));    	
        break;
    case Orientation.SOUTH:    	
    	this.segment.pe.set(this.getX(), this.getY() + (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2));
    }   
}
getCenter(){
	return this.segment.ps;
}


paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.segment.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	g2.lineWidth = this.thickness * scale.getScale();

	if (this.selection) {
		g2.strokeStyle = "gray";
	  	this.name.fillColor = "gray";
	  	this.number.fillColor = "gray";
	} else {
		g2.strokeStyle = this.fillColor;
	  	this.name.fillColor = 'black';
		this.number.fillColor = 'black';
	}


	let r=this.segment.clone();	
	r.scale(scale.getScale());
    r.move(-viewportWindow.x,- viewportWindow.y);
	r.paint(g2);
	
	  
    this.name.paint(g2, viewportWindow, scale);
    this.number.paint(g2, viewportWindow, scale);	
}
	
}
module.exports ={
		Arc,
		Pin,
		Ellipse,
		Line,
		FontLabel,
		RoundRect,
		SymbolShapeFactory
	}