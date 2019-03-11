var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var AbstractLine=require('core/shapes').AbstractLine;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var d2=require('d2/d2');


class FootprintShapeFactory{
	
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
		var label = new GlyphLabel(0, 0, 0);
		label.fromXML(data);		
		return label;
	}
}
}	

class GlyphLabel extends Shape{
constructor(text,thickness,layermaskId) {
		super( 0, 0, 0, 0, thickness,layermaskId);
		this.setDisplayName("Label");
		this.texture=new glyph.GlyphTexture(text,"",0,0,thickness);
        this.texture.setSize(core.MM_TO_COORD(2));
	}
clone(){
    var copy = new GlyphLabel(this.text,this.thickness,this.layermaskId);    
        copy.texture = this.texture.clone();        
        copy.copper=this.copper;
		return copy;
    }
setCopper(copper){
	this.copper= copper;
	//mirror horizontally
	let line=new d2.Line(this.texture.anchorPoint,new d2.Point(this.texture.anchorPoint.x,this.texture.anchorPoint.y+100));
	
	let side=core.Layer.Side.resolve(this.copper.getLayerMaskID());
	
	this.texture.mirror(side==core.Layer.Side.BOTTOM,line);
}
setRotation(rotate,center){
	if(center==undefined){
		  this.texture.setRotation(rotate,this.getCenter());
	}else{
		  this.texture.setRotation(rotate,center);	
	}
}
calculateShape(){ 
  return this.texture.getBoundingShape();
}
isClicked(x,y){
    return this.texture.isClicked(x,y);
}
getCenter(){
   return this.texture.getBoundingShape().center;
}
getTexture(){
  return this.texture;    
}
setSelected(selected) {
    this.texture.isSelected=selected;
}
isSelected() {
   return this.texture.isSelected;
}
Rotate(rotation) {	
	this.texture.Rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
}
Mirror(line) {

}
Move(xoffset,yoffset) {
  this.texture.Move(xoffset, yoffset);
}
toXML() {
    if (!this.texture.isEmpty())
        return "<label layer=\""+this.copper.getName()+"\">" + this.texture.toXML() + "</label>";
    else
        return "";
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
Paint(g2, viewportWindow, scale) {
        //if((this.getCopper().getLayerMaskID()&layermask)==0){
        //    return;
        //}
		var rect = this.texture.getBoundingShape();
			rect.scale(scale.getScale());
			if (!rect.intersects(viewportWindow)) {
				return;
			}

		if (this.selection) {
			this.texture.fillColor = "gray";
		} else {
			this.texture.fillColor = this.copper.getColor();
		}
		this.texture.Paint(g2, viewportWindow, scale,this.copper.getLayerMaskID());
    }
}	
class RoundRect extends Shape{
	constructor(x, y, width, height,arc,thickness,layermaskid) {
		super(x, y, width, height, thickness,layermaskid);
		this.setDisplayName("Rect");		
		this.selectionRectWidth=3000;
		this.resizingPoint = null;
		this.rotate=0;
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone() {
		var copy = new RoundRect(0,0,0,0,0,this.thickness,this.copper.getLayerMaskID());
		copy.roundRect = this.roundRect.clone();
		copy.rotate=this.rotate;
		copy.fill = this.fill;		
		return copy;
	}
	calculateShape() {
		return this.roundRect.box;		
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
		this.roundRect.vertices.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	setRotation(rotate,center){
		let alpha=rotate-this.rotate;
		let box=this.roundRect.box;
		if(center==undefined){
		  this.roundRect.rotate(alpha,box.center);
		}else{
		  this.roundRect.rotate(alpha,center);	 	
		}
		this.rotate=rotate;
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
	Mirror(line){
		this.roundRect.mirror(line);
	}
	Rotate(rotation){		
		this.roundRect.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}
	Resize(xoffset, yoffset,clickedPoint){
		this.roundRect.resize(xoffset, yoffset,clickedPoint);
	}
	getOrderWeight(){
		 return this.roundRect.box.width*this.roundRect.box.height; 
	}	
	toXML() {
		return "<rectangle copper=\"" + this.copper.getName()
		        +"\" thickness=\"" + this.thickness
				+ "\" fill=\"" + this.fill + "\" arc=\"" + this.roundRect.rounding
				+"\" points=\"" + this.roundRect.points
				+ "\" rt=\""+this.rotate+"\"></rectangle>";
	}
	fromXML(data) {
		if(j$(data)[0].hasAttribute("copper")){
		  this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
		}
		if(j$(data).attr("width")!=undefined){
		  this.roundRect.setRect(parseInt(j$(data).attr("x")),parseInt(j$(data).attr("y")),parseInt(j$(data).attr("width")),parseInt(j$(data).attr("height")),parseInt(j$(data).attr("arc")));
		}else{			
			var array = JSON.parse("[" + j$(data).attr("points") + "]");
			let points=[];
			points.push(new d2.Point(array[0],array[1]));
			points.push(new d2.Point(array[2],array[3]));
			points.push(new d2.Point(array[4],array[5]));
			points.push(new d2.Point(array[6],array[7]));
			this.roundRect.rounding=parseInt(j$(data).attr("arc"));
			this.roundRect.setPoints(points);
		}
		
		this.thickness = (parseInt(j$(data).attr("thickness")));
		this.fill = parseInt(j$(data).attr("fill"));
	}
	Paint(g2, viewportWindow, scale) {
		var rect = this.roundRect.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			g2.globalCompositeOperation = 'lighter';
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}
			g2.globalCompositeOperation = 'source-over';
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}			
		}
		let r=this.roundRect.clone();	
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		r.paint(g2);
		
		g2._fill=false;
		
		

		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}

drawControlPoints(g2, viewportWindow, scale){
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.roundRect.vertices); 		
	}	
}

class Circle extends Shape{
	constructor(x,y,r,thickness,layermaskId) {
		super(0, 0, 0, 0, thickness,
				layermaskId);
		this.setDisplayName("Circle");
		this.selectionRectWidth=3000;
		this.resizingPoint=null;
		this.circle=new d2.Circle(new d2.Point(x,y),r);
		this.rotate=0;
	}
clone() {
	let copy=new Circle(this.circle.center.x,this.circle.center.y,this.circle.radius,this.thickness,this.copper.getLayerMaskID());
	copy.rotate=this.rotate;
	copy.fill=this.fill;
	return copy				
	}	
calculateShape(){    
	 return this.circle.box;	 
    }
alignToGrid(isRequired) {
        if(isRequired){
          return super.alignToGrid(isRequired);
        }else{
            return null;
        }
}
alignResizingPointToGrid(point) {          
        this.width=this.owningUnit.getGrid().lengthOnGrid(this.width);                
}
isClicked(x, y) {
	if (this.circle.contains(new d2.Point(x, y)))
		return true;
	else
		return false;
	}
isControlRectClicked(x,y) {
   	let pt=new d2.Point(x,y);
   	let result=null
	this.circle.vertices.some(v=>{
   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
   		  	result=v;
   			return true;
   		}else{
   			return false;
   		}
   	});
   	return result;
    }	
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	if(center==undefined){
		this.circle.rotate(alpha,this.circle.center);
	}else{
		this.circle.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
	toXML() {
        return "<circle copper=\""+this.copper.getName()+"\" x=\""+(this.circle.pc.x)+"\" y=\""+(this.circle.pc.y)+"\" radius=\""+(this.circle.r)+"\" thickness=\""+this.thickness+"\" fill=\""+this.fill+"\"/>";
	}
	fromXML(data) {	        
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
        
 		let xx=parseInt(j$(data).attr("x"));
 		let yy=parseInt(j$(data).attr("y"));
 		
 		if(j$(data).attr("width")!=undefined){
 			let diameter=parseInt(parseInt(j$(data).attr("width")));
 	        this.circle.pc.set(xx+(parseInt(diameter/2)),yy+(parseInt(diameter/2)));
 	        this.circle.r=parseInt(diameter/2); 			
 		}else{
 			let radius=parseInt(parseInt(j$(data).attr("radius")));
 	        this.circle.pc.set(xx,yy);
 	        this.circle.r=radius; 			 		
 		}
 		 
         
 		 this.thickness = (parseInt(j$(data).attr("thickness")));
 		 this.fill = parseInt(j$(data).attr("fill")); 		
	}
	Mirror(line){
	   this.circle.mirror(line);	
	}
	Move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}	
	Rotate(rotation){
		this.circle.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}
	Resize(xoffset, yoffset,point) {    
        let quadrant= utilities.getQuadrantLocation(point,this.circle.center.x,this.circle.center.y);
        let radius=this.circle.r;
        switch(quadrant){
        case utilities.QUADRANT.FIRST:case utilities.QUADRANT.FORTH: 
            //uright
             if(xoffset<0){
               //grows             
                radius+=Math.abs(xoffset);
             }else{
               //shrinks
                radius-=Math.abs(xoffset);
             }             
            break;
        case utilities.QUADRANT.SECOND:case utilities.QUADRANT.THIRD:
            //uleft
             if(xoffset<0){
               //shrinks             
                radius-=Math.abs(xoffset);
             }else{
               //grows
                radius+=Math.abs(xoffset);
             }             
            break;        
        }
         
        this.circle.r=radius;
    }	
	Paint(g2, viewportWindow, scale) {
		var rect = this.circle.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		// ****3 http://scienceprimer.com/draw-oval-html5-canvas
		g2.globalCompositeOperation = 'lighter';
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}			
		}

		let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		g2._fill=false;

		g2.globalCompositeOperation = 'source-over';
		
		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
  } 
 }
drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.circle.vertices);	
}
getOrderWeight(){
	 return this.circle.r*this.circle.r; 
}
getResizingPoint() {
        return null;
}

setResizingPoint(point) {

}

}

class Arc extends Shape{
constructor(x,y,r,thickness,layermaskid){	
        super(0, 0, 0,0,thickness,layermaskid);  
		this.setDisplayName("Arc");
		this.selectionRectWidth=3000;
		this.resizingPoint=null;
		this.arc=new d2.Arc(new d2.Point(x,y),r,50,70);
		this.rotate=0;
}
clone() {
		var copy = new Arc(this.arc.center.x,this.arc.center.y, this.arc.r,this.thickness,this.copper.getLayerMaskID());		
        copy.arc.startAngle = this.arc.startAngle;
        copy.arc.endAngle = this.arc.endAngle; 
        copy.rotate=this.rotate;
		copy.fill = this.fill;
		return copy;
}
calculateShape() {
	return this.arc.box;	
}
getOrderWeight(){
    return this.arc.r*this.arc.r; 
}
fromXML(data){
        
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));        
		let xx=parseInt(j$(data).attr("x"));
		let yy=parseInt(j$(data).attr("y"));
		
 		if(j$(data).attr("width")!=undefined){
 			let diameter=parseInt(parseInt(j$(data).attr("width")));
 	        this.arc.pc.set(xx+(parseInt(diameter/2)),yy+(parseInt(diameter/2)));
 	        this.arc.r=parseInt(diameter/2); 			
 		}else{
 			let radius=parseInt(parseInt(j$(data).attr("radius")));
 	        this.arc.pc.set(xx,yy);
 	        this.arc.r=radius; 			 		
 		}
		let diameter=parseInt(parseInt(j$(data).attr("width"))); 
		
        //this.arc.pc.set(xx+(parseInt(diameter/2)),yy+(parseInt(diameter/2)));
        //this.arc.r = parseInt(diameter/2);
        
		this.arc.startAngle = parseInt(j$(data).attr("start"));
        this.arc.endAngle = parseInt(j$(data).attr("extend"));        
		this.thickness = (parseInt(j$(data).attr("thickness")));
		this.fill = (parseInt(j$(data).attr("fill"))||0);
}
toXML() {
    return '<arc copper="'+this.copper.getName()+'"  x="'+(this.arc.pc.x)+'" y="'+(this.arc.pc.y)+'" radius="'+(this.arc.r)+'"  thickness="'+this.thickness+'" start="'+this.arc.startAngle+'" extend="'+this.arc.endAngle+'" fill="'+this.fill+'" />';
}
setRadius(r){
	this.arc.r=r;	
}
setExtendAngle(extendAngle){
    this.arc.endAngle=utilities.round(extendAngle);
}
setStartAngle(startAngle){        
    this.arc.startAngle=utilities.round(startAngle);
}

isControlRectClicked(x,y) {
	 if(this.isStartAnglePointClicked(x,y)){
		    return this.arc.start;
		 }
	 if(this.isExtendAnglePointClicked(x,y)){
		    return this.arc.end;
		 }
	 if(this.isMidPointClicked(x,y)){
		    return this.arc.middle;	 
		 }
	     return null;
	}
isClicked(x, y) {
	if (this.arc.contains(new d2.Point(x, y)))
		return true;
	else
		return false;
	}
isMidPointClicked(x,y){
    let p=this.arc.middle;
    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                 this.selectionRectWidth, this.selectionRectWidth);
    if (box.contains({x,y})) {
        return true;
    }else{                   
        return false;
	}	
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
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	if(center==undefined){
		this.arc.rotate(alpha,this.arc.center);
	}else{
		this.arc.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
Rotate(rotation){
  this.arc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy)); 
}
Mirror(line) {
  this.arc.mirror(line);
}
/*
 * Resize through mouse position point
 */
Resize(xoffset, yoffset,point) {    
    let pt=this.calculateResizingMidPoint(point.x,point.y);
    let r=this.arc.center.distanceTo(pt);
    this.arc.r=r;
}
Move(xoffset,yoffset){
  this.arc.move(xoffset,yoffset);	
}
Paint(g2, viewportWindow, scale) {
		
		var rect = this.arc.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		g2.globalCompositeOperation = 'lighter';
		g2.beginPath(); // clear the canvas context
		g2.lineCap = 'round';

						
		g2.lineWidth = this.thickness * scale.getScale();
        		
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
					g2.strokeStyle = "gray";
			} else {
					g2.strokeStyle = this.copper.getColor();
			}
			g2._fill=false;
		} else {
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}
			g2._fill=true;
		}

		let a=this.arc.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);

		g2._fill=undefined;
		
		g2.globalCompositeOperation = 'source-over';

		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
		
}
drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[this.arc.start,this.arc.end,this.arc.middle]);	
}
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
calculateResizingMidPoint(x,y){
	//let a=this.arc.middle;
	//let b=new d2.Point(this.arc.center.x,this.arc.center.y);
	let line=new d2.Line(this.arc.center,this.arc.middle);
	return line.projectionPoint(new d2.Point(x,y));
	
//	let a=this.arc.middle;
//	let b=new d2.Point(this.arc.center.x,this.arc.center.y);
//	//let p=this.resizingPoint;
//	let p={x,y};
//	
//	let atob = { x: b.x - a.x, y: b.y - a.y };
//    let atop = { x: p.x - a.x, y: p.y - a.y };
//    let len = atob.x * atob.x + atob.y * atob.y;
//    let dot = atop.x * atob.x + atop.y * atob.y;
//    let t = dot / len ;
//  
//    return new d2.Point(a.x + atob.x * t,a.y + atob.y * t);	
}
//drawMousePoint(g2,viewportWindow,scale){
//
//	let point=this.calculateResizingMidPoint(this.resizingPoint.x,this.resizingPoint.y);
//    
//	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[point]);
//    
//}

}
class SolidRegion extends Shape{
	constructor(layermaskId) {
        super( 0, 0, 0,0, 0, layermaskId);
        this.displayName = "Solid Region";
        this.floatingStartPoint=new d2.Point();
        this.floatingEndPoint=new d2.Point();                 
        this.selectionRectWidth = 3000;
        this.fill=core.Fill.FILLED;
        this.polygon=new d2.Polygon();
        this.resizingPoint;
    }
clone(){
	  var copy=new SolidRegion(this.copper.getLayerMaskID());
      copy.polygon=this.polygon.clone();  
      return copy;
}
alignResizingPointToGrid(targetPoint) {
    this.owningUnit.grid.snapToGrid(targetPoint);         
}
calculateShape() {
	return this.polygon.box;	
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
isClicked(x,y){
	  return this.polygon.contains(x,y);
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polygon.points.some(function(wirePoint) {
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
reset(){
	this.resetToPoint(this.floatingStartPoint);	
}
resetToPoint(p){
    this.floatingStartPoint.set(p.x,p.y);
    this.floatingEndPoint.set(p.x,p.y); 
}
Move(xoffset, yoffset) {
	this.polygon.move(xoffset,yoffset);
}
Mirror(line) {
    this.polygon.mirror(line);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	let box=this.polygon.box;
	if(center==undefined){
		this.polygon.rotate(alpha,box.center);
	}else{
		this.polygon.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
Rotate(rotation) {
	this.polygon.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
Paint(g2, viewportWindow, scale) {		
	var rect = this.polygon.box;
	rect.scale(scale.getScale());		
	if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	}
	
	g2.lineWidth = 1;
	
	if(this.isFloating()){
      g2.strokeStyle = this.copper.getColor();		
	}else{
	  g2._fill=true;
	  if (this.selection) {
		 g2.fillStyle = "gray";
	  } else {
		 g2.fillStyle = this.copper.getColor();
	  }
	}

	

	let a=this.polygon.clone();	
	if (this.isFloating()) {
		let p = this.floatingEndPoint.clone();
		a.add(p);	
    }
	a.scale(scale.getScale());
	a.move( - viewportWindow.x, - viewportWindow.y);		
	a.paint(g2);
	g2._fill=false;
    
	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}
drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.polygon.points);	
}
}
class Line extends AbstractLine{
constructor(thickness,layermaskId) {
			super(thickness,layermaskId);	
}
clone() {
		  var copy = new Line(this.thickness,this.copper.getLayerMaskID());
		  copy.polyline=this.polyline.clone();
		  return copy;
		}
alignToGrid(isRequired) {
    if (isRequired) {
        this.polyline.points.forEach(function(wirePoint){
            let point = this.owningUnit.getGrid().positionOnGrid(wirePoint.x, wirePoint.y);
              wirePoint.set(point.x,point.y);
        }.bind(this));
    }
    return null;
}
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	let box=this.polyline.box;
	if(center==undefined){
		this.polyline.rotate(alpha,box.center);
	}else{
		this.polyline.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
getOrderWeight() {
	return 2;
}

Paint(g2, viewportWindow, scale) {		
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}
				
		g2.globalCompositeOperation = 'lighter';
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		g2.lineWidth = this.thickness * scale.getScale();


		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = this.copper.getColor();

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
		
		g2.globalCompositeOperation = 'source-over';
		if (this.selection) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}

}

toXML() {
	var result = "<line copper=\"" + this.copper.getName()
								+ "\" thickness=\"" + this.thickness + "\">";
	this.polyline.points.forEach(function(point) {
		result += point.x + "," + point.y + ",";
	});
	result += "</line>";
	return result;
}
fromXML(data) {
       if(j$(data).attr("copper")!=null){
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
       }else{
        this.copper=core.Layer.Copper.FSilkS;
       }	
	   this.thickness = (parseInt(j$(data).attr("thickness")));
   	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			this.polyline.points.push(new d2.Point(x, y));
		}
}
}


class Drill{
	 constructor(x,y,width) {
	    this.circle=new d2.Circle(new d2.Point(x,y),width/2);
	 }
	 clone(){
		 let copy= new Drill(0);
		 copy.circle.pc.x=this.circle.pc.x;
		 copy.circle.pc.y=this.circle.pc.y;
		 copy.circle.r=this.circle.r;
		 return copy;
	 }
	 setLocation(x,y){
        this.circle.pc.x=x;
        this.circle.pc.y=y;
	 }
	 Move( xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	 }
	 getWidth(){
		 return 2*this.circle.r;
	 }
	 setWidth(width){
		 this.circle.r=width/2;
	 }
	 setRotation(rotate,center){
	    this.circle.rotate(rotate,center); 
	 }
	 Rotate(rotation) {	    		    
	    	this.circle.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	 } 
	Paint(g2,viewportWindow,scale){
	    g2._fill=true;
	    g2.fillStyle = 'black';
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
		g2._fill=false;
	}
	toXML(){
	    return "<drill type=\"CIRCULAR\" x=\""+this.circle.pc.x+"\" y=\""+this.circle.pc.y+"\" width=\""+2*this.circle.radius+"\" />";	
	}
	fromXML(data){ 
	   this.setLocation(parseInt(j$(data).attr("x")),parseInt(j$(data).attr("y")));
	   this.setWidth(parseInt(j$(data).attr("width")));  	   
	}
}


PadShape={
	 RECTANGULAR:0,
	 CIRCULAR:1,
	 OVAL:2,
	 POLYGON:3,
	 parse:function(shape){
		 switch(shape){
		  case 'RECTANGULAR':
			     return this.RECTANGULAR;
				 break;
		  case 'CIRCULAR':
				 return this.CIRCULAR;
				 break; 
		  case 'OVAL':
				 return this.OVAL;
				 break;	
		  case 'POLYGON':
				 return this.POLYGON;
				 break;					 
		  default:
			  throw new TypeError('Unrecognized pad Shape:'+shape+' to parse');  
		  } 
	 },
	format:function(shape){
		if(shape==this.RECTANGULAR)
			return 'RECTANGULAR';
		if(shape==this.CIRCULAR)
			return 'CIRCULAR';
		if(shape==this.OVAL)
			return 'OVAL';
		if(shape==this.POLYGON)
			return 'POLYGON';
		else
			return '';
	} 
};
	    
PadType={
	   THROUGH_HOLE:0,
	   SMD:1,
	   CONNECTOR:2,
	   parse:function(type){
		  switch(type){
		  case 'THROUGH_HOLE':
			     return this.THROUGH_HOLE;
				 break;
		  case 'SMD':
				 return this.SMD;
				 break; 
		  case 'CONNECTOR':
				 return this.CONNECTOR;
				 break;	
		  default:
			  throw new TypeError('Unrecognized pad Type:'+type+' to parse');  
		  } 
	   },
	   format:function(type){
		  if(type==this.THROUGH_HOLE)
			 return 'THROUGH_HOLE';
		  if(type==this.SMD)
				 return 'SMD';
		  if(type==this.CONNECTOR)
				 return 'CONNECTOR';
		  else
			  return '';
	   }
};

class Pad extends Shape{
	constructor(x,y,width,height) {
	   super(0, 0, width, height, -1, core.Layer.LAYER_BACK);
	   this.drill=null;
	   this.rotate=0;
	   this.offset=new d2.Point(0,0);
	   this.shape=new CircularShape(0,0,width,this);
	   this.setType(PadType.THROUGH_HOLE);	   
	   this.setDisplayName("Pad");
	   this.text=new core.ChipText();
	   this.text.Add(new font.FontTexture("number","1",x,y,4000));
	   this.text.Add(new font.FontTexture("netvalue","",x,y,4000));   
	}
clone(){
	     var copy=new Pad(0,0,this.width,this.height);
	     copy.setType(this.type);
	     copy.width=this.width;
	     copy.height=this.height;
	     copy.rotate=this.rotate;
	     copy.shape=this.shape.copy(copy);
	     copy.copper=this.copper;
	     copy.text=this.text.clone();
	     if(this.drill!=null){
	    	 copy.drill=this.drill.clone();
	     }
	     return copy;
	}
getChipText() {
	    return this.text;
}
getCenter(){
	return this.shape.center;
}
toXML(){
	    var xml="<pad copper=\""+this.copper.getName()+"\" type=\"" +PadType.format(this.type) + "\" shape=\""+PadShape.format(this.getShape())+"\" x=\""+this.shape.center.x+"\" y=\""+this.shape.center.y+"\" width=\""+this.getWidth()+"\" height=\""+this.getHeight()+"\" rt=\""+this.rotate+"\">\r\n";
	        //xml+=this.shape.toXML()+"\r\n";
	        xml+="<offset x=\""+this.offset.x+"\" y=\""+this.offset.y+"\" />\r\n";
	    
	        if (!this.text.getTextureByTag("number").isEmpty())
	        	xml+="<number>" +
	                      this.text.getTextureByTag("number").toXML() +
	                      "</number>\r\n";
	    if (!this.text.getTextureByTag("netvalue").isEmpty())
	           xml+="<netvalue>" +
	                      this.text.getTextureByTag("netvalue").toXML() +
	                      "</netvalue>\r\n";
	    if(this.drill!=null){
	        xml+=this.drill.toXML()+"\r\n";  
	    }
	    xml+="</pad>";
	    return xml;	
	}	
fromXML(data){   
		      this.copper=core.Layer.Copper.valueOf(j$(data).attr("copper"));
		      this.setType(PadType.parse(j$(data).attr("type")));
		      
			  let x=(parseInt(j$(data).attr("x")));
			  let y=(parseInt(j$(data).attr("y")));
		      this.width=(parseInt(j$(data).attr("width")));
		      this.height=(parseInt(j$(data).attr("height")));
		      
		      if(j$(data).attr("rt")!=undefined)
		        this.rotate=(parseInt(j$(data).attr("rt")));
		      
		      this.setShape(x,y,PadShape.parse(j$(data).attr("shape")));
			  
		      var offset=(j$(data).find("offset"));
		      this.offset.x=(parseInt(j$(offset).attr("x")));
		      this.offset.y=(parseInt(j$(offset).attr("y")));
		      
		      if(this.drill!=null){
		          this.drill.fromXML(j$(data).find("drill"));
		      }   

		      var number=(j$(data).find("number").text()); 
			  var netvalue=(j$(data).find("netvalue").text());
			  if(number==''){
				  this.text.getTextureByTag("number").setLocation(this.getX(), this.getY());
			  }else{
				  this.text.getTextureByTag("number").fromXML(number);
			  }
			  if(netvalue==''){
				  this.text.getTextureByTag("netvalue").setLocation(this.getX(), this.getY());
			  }else{
				  this.text.getTextureByTag("netvalue").fromXML(netvalue);
			  }
		     
	}
getPinsRect() {
	     return d2.Box.fromRect(this.shape.center.x, this.shape.center.y, 0,0);
	}
alignToGrid(isRequired){
	     var center=this.shape.center;
	     var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
	     this.Move(point.x - center.x,point.y - center.y);
	     return null;     
	}	
getOrderWeight(){
	     return 2; 
	}
isClicked(x,y){
	    if(this.shape.contains(new d2.Point(x,y)))
	     return true;
	    else
	     return false;  
	 }
isInRect(r) {
		 let rect=super.getBoundingShape();
	     if(r.contains(rect.center))
	         return true;
	        else
	         return false; 
	}
setSelected (selection) {
	super.setSelected(selection);
	this.text.setSelected(selection);
}
Move(xoffset, yoffset){
	   this.shape.move(xoffset, yoffset);
	   
	   if(this.drill!=null){
	     this.drill.Move(xoffset, yoffset);
	   }
	   this.text.Move(xoffset,yoffset);
	   
	}

Mirror(line) {
//    let source = new d2.Point(this.x,this.y);
//    utilities.mirrorPoint(A, B, source);
//    this.setX(source.x);
//    this.setY(source.y);
//    if (this.drill != null) {
//        this.drill.Mirror(A, B);
//    }
//    this.text.Mirror(A, B);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotate;	
	if(center==null){
	  this.shape.rotate(alpha);
	  this.text.setRotation(rotate,this.shape.center);
	}else{
	  this.shape.rotate(alpha,center);
	  this.text.setRotation(rotate,center);
	    if(this.drill!=null){
	        this.drill.setRotation(rotate,center);
	    }	  
	}
	this.rotate=rotate;
}
Rotate(rotation){
	let alpha=this.rotate+rotation.angle;
	if(alpha>=360){
		alpha-=360
	}
	 if(alpha<0){
		 alpha+=360; 
	 }
	this.shape.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
    if(this.drill!=null){
     this.drill.Rotate(rotation);
    }	
	this.text.setRotation(alpha,new d2.Point(rotation.originx,rotation.originy));
	this.rotate=alpha;
	
	}
setType(type) {
	        this.type = type;
	        switch(type){
	        case PadType.THROUGH_HOLE:
	            if(this.drill==null){
	            	this.drill=new Drill(this.shape.center.x,this.shape.center.y,core.MM_TO_COORD(0.8));		               	                
	            }
	            break;
	        case PadType.SMD:
	                this.drill=null;
	            break;
			}
}
setShape(...args){
	    let shape,x,y; 
	    if(args.length==1){
	      x=this.shape.center.x;
	      y=this.shape.center.y;
	      shape=args[0];
	    }else{
		  x=args[0];
		  y=args[1];
		  shape=args[2];	      	
	    }
	    switch(shape){
	    case PadShape.CIRCULAR:
	        this.shape=new CircularShape(x,y,this.width,this);
	    break;
	     case PadShape.OVAL: 
	        this.shape=new OvalShape(x,y,this.width,this.height,this);
	        break;
	    case PadShape.RECTANGULAR:
	        this.shape=new RectangularShape(x,y,this.width,this.height,this);
	        break;
	    case PadShape.POLYGON:
		    this.shape = new PolygonShape(x,y,this.width,this);
	        break;
	    } 
	    //restore rotation
	    if(this.rotate!=0){
		  this.shape.rotate(this.rotate);
	    }
}
getShape(){
		if(this.shape instanceof CircularShape)
	        return PadShape.CIRCULAR;
		if(this.shape instanceof RectangularShape)
	        return PadShape.RECTANGULAR;
		if(this.shape instanceof OvalShape)
	        return PadShape.OVAL;
		if(this.shape instanceof PolygonShape)
	        return PadShape.POLYGON;		
}    
setWidth(width){
	        this.width=width;
	        this.shape.setWidth(width);    
	    }
setHeight(height){
	        this.height=height;
	        this.shape.setHeight(height);
	    }
calculateShape() {
	return this.shape.box;
} 
Paint(g2,viewportWindow,scale){
	    switch(this.type){
	    case PadType.THROUGH_HOLE:
	        if(this.shape.Paint(g2, viewportWindow, scale)){
	         if(this.drill!=null){
	            this.drill.Paint(g2, viewportWindow, scale);
	         }
	        }
	        break;
	    case PadType.SMD:
	        this.shape.Paint(g2, viewportWindow, scale);
	        break;
	    
	    }
	    this.text.Paint(g2, viewportWindow, scale);	    
	 }

}
	//----------CircularShape-------------------
class CircularShape{
	constructor(x,y,width,pad){
		this.pad=pad;
		this.circle=new d2.Circle(new d2.Point(x,y),width/2);		
	}
    Paint(g2,viewportWindow,scale){
	     var box=this.circle.box;
	     box.scale(scale.scale);     
       //check if outside of visible window
	     var window=new d2.Box(0,0,0,0);
	     window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
         if(!box.intersects(window)){
           return false;
         }
	    
	    
		if(this.pad.isSelected())
	        g2.fillStyle = "gray";  
	    else{
	        g2.fillStyle = this.pad.copper.getColor();
	    }
	    g2._fill=true;
		
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
		g2._fill=false;
		
		return true;
	}
    copy(pad){
  	  let _copy=new CircularShape(0,0,0,pad);
  	  _copy.circle=this.circle.clone();	  
  	  return _copy;  
  	} 
    rotate(alpha,origin){
    	if(origin==null){
    	  this.circle.rotate(alpha);
    	}else{
    	  this.circle.rotate(alpha,origin);	
    	}
    }    
    contains(pt){
    	return this.circle.contains(pt);
    }
	move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}	
	get box(){
		return this.circle.box;
	}
	get center(){
		return this.circle.center;	
	}
    setWidth(width) {
	   this.circle.r=width/2;
	}
    setHeight(height){
	
    }

}
//------------RectangularShape----------------
class RectangularShape{
	constructor(x,y,width,height,pad){
		this.pad=pad;
		this.rect=new d2.Rectangle(new d2.Point(x-width/2,y-height/2),width,height);			
}
Paint(g2,viewportWindow,scale){
	   var box=this.rect.box;
	   box.scale(scale.scale);     
       //check if outside of visible window
	   var window=new d2.Box(0,0,0,0);
	   window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
       if(!box.intersects(window)){
         return false;
       }
       
	    if(this.pad.isSelected())
	      g2.fillStyle = "gray";  
	    else{
	      g2.fillStyle = this.pad.copper.getColor();
	    }
	    g2._fill=true;
        let r=this.rect.clone();
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		r.paint(g2);
	    
		g2._fill=false;
	    return true;
}
copy(pad){
  let _copy=new RectangularShape(0,0,0,0,pad);
  _copy.rect=this.rect.clone();	  
  return _copy;  
}
contains(pt){
	return this.rect.contains(pt);
}
rotate(alpha,origin){
	if(origin==null){
		  this.rect.rotate(alpha);
	}else{
		  this.rect.rotate(alpha,origin);	
	}
	
}
move(xoffset, yoffset) {
	this.rect.move(xoffset,yoffset);
}
get box(){
	return this.rect.box;
}
get center(){
	return this.rect.box.center;	
}
setWidth(width) {
		   this.rect.setSize(this.pad.width,this.pad.height);
		   this.rect.rotate(this.pad.rotate);
}
setHeight(height) {
		   this.rect.setSize(this.pad.width,this.pad.height);
		   this.rect.rotate(this.pad.rotate);
}
}
//------------OvalShape-----------------------
class OvalShape{
	constructor(x,y,width,height,pad){
	   this.pad=pad;
	   this.obround=new d2.Obround(new d2.Point(x,y),width,height);
	}
Paint(g2,viewportWindow,scale){
	     var box=this.obround.box;
	     box.scale(scale.scale);     
       //check if outside of visible window
	     var window=new d2.Box(0,0,0,0);
	     window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
         if(!box.intersects(window)){
           return false;
         }
         
	     g2.lineWidth = this.obround.width * scale.getScale();
	     if(this.pad.isSelected())
	        g2.strokeStyle = "gray";  
	     else{
	        g2.strokeStyle = this.pad.copper.getColor();
	     }
	      
		   let o=this.obround.clone();
		   o.scale(scale.getScale());
	       o.move(-viewportWindow.x,- viewportWindow.y);
		   o.paint(g2);

	      return true;
}
copy(pad){
	  let _copy=new OvalShape(0,0,0,0,pad);
	  _copy.obround=this.obround.clone();	  
	  return _copy;  
	}
rotate(alpha,origin){
	if(origin==null){
	  this.obround.rotate(alpha);
	}else{
	  this.obround.rotate(alpha,origin);	
	}
}
contains(pt){
	return this.obround.contains(pt);
}
move(xoffset, yoffset) {
	this.obround.move(xoffset,yoffset);
}
get box(){
	return this.obround.box;
}
get center(){
	return this.obround.center;	
}
setWidth(width) {	    
	    this.obround.setWidth(width);
}
setHeight(height) {	    
	    this.obround.setHeight(height);
	    this.obround.rotate(this.pad.rotate);
}
}

//--------------PolygonShape-------------------------
class PolygonShape{
constructor(x,y,width,pad){
		this.pad=pad;
		this.hexagon=new d2.Hexagon(new d2.Point(x,y),width);		
}	

Paint(g2, viewportWindow, scale) {
		   var box=this.hexagon.box;
		   box.scale(scale.scale);     
	       //check if outside of visible window
		   var window=new d2.Box(0,0,0,0);
		   window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
	       if(!box.intersects(window)){
	         return false;
	       }
	       if(this.pad.isSelected()){
	         g2.fillStyle = "gray";  
		   }else{
	         g2.fillStyle = this.pad.copper.getColor();
	       }
	        
		   g2._fill=true;		   
	       let p=this.hexagon.clone();
		   p.scale(scale.getScale());
	       p.move(-viewportWindow.x,- viewportWindow.y);
		   p.paint(g2);
		    
		   g2._fill=false;
            
           return true;
}
copy(pad){
	  let _copy=new PolygonShape(0,0,0,pad);
	  _copy.hexagon=this.hexagon.clone();	  
	  return _copy;  
	}
contains(pt){
		return this.hexagon.contains(pt);
	}
rotate(alpha,origin){
	if(origin==null){
	  this.hexagon.rotate(alpha);
	}else{
	  this.hexagon.rotate(alpha,origin);	
	}
}
get box(){
	return this.hexagon.box;
}
get center(){
	return this.hexagon.center;	
}
move(xoffset, yoffset) {
		this.hexagon.move(xoffset,yoffset);
	}
setWidth(width) {
        this.hexagon.setWidth(width);
}
setHeight(height) {
            
}	
}
module.exports ={
	GlyphLabel,
	Line,
	RoundRect,
	Circle,
	Arc,
	SolidRegion,
	Pad,Drill,
	FootprintShapeFactory
}
