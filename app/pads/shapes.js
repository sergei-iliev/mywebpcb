var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/core').Shape;
var AbstractLine=require('core/shapes').AbstractLine;
var ResizeableShape=require('core/core').ResizeableShape;
var glyph=require('core/text/glyph');
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
calculateShape(){ 
  return this.texture.getBoundingShape();
}
getCenter() {
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
  this.texture.Rotate(rotation);
}
Mirror(A,B) {
  this.texture.Mirror(A,B);
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
        let scaledRect = this.texture.getBoundingShape().getScaledRect(scale);
        if(!scaledRect.intersects(viewportWindow)){
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
		this.arc=arc;
		this.rotate=0;
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone() {
		var copy = new RoundRect(0,0,0,0, this.arc,this.thickness,this.copper.getLayerMaskID());
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
	setRotation(rotate){
		let alpha=rotate-this.rotate;
		let box=this.roundRect.box;
		this.roundRect.rotate(alpha,box.center);
		this.rotate=rotate;
	}
	setRounding(rounding){
	  this.arc=rounding;
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
	getOrderWeight(){
		 return this.roundRect.box.width*this.roundRect.box.height; 
	}	
	toXML() {
		return "<rectangle copper=\"" + this.copper.getName() + "\" x=\""
				+ this.upperLeft.x + "\" y=\"" + this.upperLeft.y
				+ "\" width=\"" + this.getWidth() + "\" height=\""
				+ this.getHeight() + "\" thickness=\"" + this.thickness
				+ "\" fill=\"" + this.fill + "\" arc=\"" + this.arc
				+ "\"></rectangle>";
	}
	fromXML(data) {
		if(j$(data)[0].hasAttribute("copper")){
		  this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
		}
		this.setX(parseInt(j$(data).attr("x")));
		this.setY(parseInt(j$(data).attr("y")));
		this.setWidth(parseInt(j$(data).attr("width")));
		this.setHeight(parseInt(j$(data).attr("height")));
		this.arc = (parseInt(j$(data).attr("arc")));
		this.thickness = (parseInt(j$(data).attr("thickness")));
		this.fill = parseInt(j$(data).attr("fill"));
	}
	Paint(g2, viewportWindow, scale) {
		var rect = this.roundRect.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		g2.globalCompositeOperation = 'lighter';
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}

		} else {
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
		
		g2.globalCompositeOperation = 'source-over';

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
	}
clone() {
	return new Circle(this.circle.center.x,this.circle.center.y,this.circle.radius,this.thickness,this.copper.getLayerMaskID());				
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
	toXML() {
        return "<ellipse copper=\""+this.copper.getName()+"\" x=\""+(this.x-this.width)+"\" y=\""+(this.y-this.width)+"\" width=\""+(2*this.width)+"\" height=\""+(2*this.width)+"\" thickness=\""+this.thickness+"\" fill=\""+this.fill+"\"/>";
	}
	fromXML(data) {	
        if(j$(data).attr("copper")!=null){
            this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
         }else{
            this.copper=core.Layer.Copper.FSilkS;
         }
 		let xx=parseInt(j$(data).attr("x"));
 		let yy=parseInt(j$(data).attr("y"));
 		
 		let diameter=parseInt(parseInt(j$(data).attr("width")));
         //center x
         this.setX(xx+(parseInt(diameter/2)));
         //center y
         this.setY(yy+(parseInt(diameter/2)));
         //radius
         this.setWidth(parseInt(diameter/2));
         this.setHeight(parseInt(diameter/2));

 		 this.thickness = (parseInt(j$(data).attr("thickness")));
 		 this.fill = parseInt(j$(data).attr("fill"));
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
        this.startAngle=30;
        this.extendAngle=50;
		this.setDisplayName("Arc");
		this.rotate=0;
		this.selectionRectWidth=3000;
		this.resizingPoint=null;
		this.arc=new d2.Arc(new d2.Point(x,y),r,this.startAngle,this.extendAngle);
}
clone() {
		var copy = new Arc(this.arc.center.x,this.arc.center.y, this.arc.r,this.thickness,this.copper.getLayerMaskID());
		copy.startAngle = this.startAngle;
		copy.extendAngle = this.extendAngle;
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
        if(j$(data).attr("copper")!=null){
           this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
        }else{
           this.copper=core.Layer.Copper.FSilkS;
        }
		let xx=parseInt(j$(data).attr("x"));
		let yy=parseInt(j$(data).attr("y"));
		
		let diameter=parseInt(parseInt(j$(data).attr("width")));
        //center x
        this.setX(xx+(parseInt(diameter/2)));
        //center y
        this.setY(yy+(parseInt(diameter/2)));
        //radius
        this.setWidth(parseInt(diameter/2));
        this.setHeight(parseInt(diameter/2));  
		
		
		this.startAngle = parseInt(j$(data).attr("start"));
		this.extendAngle = parseInt(j$(data).attr("extend"));
		
		this.thickness = (parseInt(j$(data).attr("thickness")));				
}
toXML() {
    return '<arc copper="'+this.copper.getName()+'"  x="'+(this.x-this.width)+'" y="'+(this.y-this.width)+'" width="'+(2*this.width)+'"  thickness="'+this.thickness+'" start="'+this.startAngle+'" extend="'+this.extendAngle+'" />';
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
Rotate(rotation){
  this.arc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy)); 
}
Mirror(A,B) {
    super.Mirror(A,B);
    if(A.x==B.x){
      //***which place in regard to x origine   
      //***tweak angles 
        if(this.startAngle<=180){
         this.startAngle=(180-this.startAngle);
        }else{
         this.startAngle=(180+(360 -this.startAngle));
        }
      this.extendAngle=(-1)*this.extendAngle;
    }else{    //***top-botom mirroring
      //***which place in regard to y origine    
      //***tweak angles
      this.startAngle=360-this.startAngle;
      this.extendAngle=(-1)*this.extendAngle;
    }
}
/*
 * Resize through mouse position point
 */
Resize(xoffset, yoffset,point) {    
    let pt=this.calculateResizingMidPoint(point.x,point.y);
    
    let p=new d2.Point(pt.x,pt.y);
    let r=this.arc.center.distanceTo(p);

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
	let a=this.arc.middle;
	let b=new d2.Point(this.arc.center.x,this.arc.center.y);
	//let p=this.resizingPoint;
	let p={x,y};
	
	let atob = { x: b.x - a.x, y: b.y - a.y };
    let atop = { x: p.x - a.x, y: p.y - a.y };
    let len = atob.x * atob.x + atob.y * atob.y;
    let dot = atop.x * atob.x + atop.y * atob.y;
    let t = dot / len ;
  
    return new d2.Point(a.x + atob.x * t,a.y + atob.y * t);	
}
drawMousePoint(g2,viewportWindow,scale){

	let point=this.calculateResizingMidPoint(this.resizingPoint.x,this.resizingPoint.y);
    
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[point]);
    
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
        this.points.forEach(function(wirePoint){
            let point = this.owningUnit.getGrid().positionOnGrid(wirePoint.x, wirePoint.y);
              wirePoint.setLocation(point.x,point.y);
        }.bind(this));
    }
    return null;
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
	this.points.forEach(function(point) {
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
			this.points.push(new core.Point(x, y));
		}
}
}


class Drill{
	 constructor(width) {
	    this.circle=new d2.Circle(new d2.Point(0,0),width/2);
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
	    return "<drill type=\"CIRCULAR\" x=\""+this.circle.pc.x+"\" y=\""+this.circle.pc.y+"\" width=\""+this.circle.radius+"\" height=\""+this.circle.radius+"\" />";	
	}
	fromXML(data){ 
	   this.setX(parseInt(j$(data).attr("x")));
	   this.setY(parseInt(j$(data).attr("y")));
	   this.setWidth(parseInt(j$(data).attr("width")));
	   this.setHeight(parseInt(j$(data).attr("height")));
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

class Pad extends core.Shape{
	constructor(x,y,width,height) {
	   super(0, 0, width, height, -1, core.Layer.LAYER_BACK);
	   this.drill=null;
	   this.offset=new d2.Point(0,0);
	   this.setType(PadType.THROUGH_HOLE);
	   this.setShape(PadShape.CIRCULAR);
	   this.shape.move(x,y);
	   this.setDisplayName("Pad");
	   this.rotate=0;
	   this.text=new core.ChipText();
	   this.text.Add(new font.FontTexture("number","1",x,y,new core.Alignment(core.AlignEnum.LEFT),4000));
	   this.text.Add(new font.FontTexture("netvalue","",x,y,new core.Alignment(core.AlignEnum.LEFT),4000));   
	}
clone(){
	     var copy=new Pad(0,0,this.width,this.height);
	     copy.setType(this.type);
		 copy.setX(this.getX());
		 copy.setY(this.getY());
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
setRotation(rotate){
	let alpha=rotate-this.rotate;	
	this.shape.rotate(alpha);
	this.text.setRotation(rotate,this.shape.center);
	this.rotate=rotate;
}
getChipText() {
	    return this.text;
}
toXML(){
	    var xml="<pad copper=\""+this.copper.getName()+"\" type=\"" +PadType.format(this.type) + "\" shape=\""+PadShape.format(this.getShape())+"\" x=\""+this.getX()+"\" y=\""+this.getY()+"\" width=\""+this.getWidth()+"\" height=\""+this.getHeight()+"\" arc=\""+this.arc+"\">\r\n";
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
			  this.setX(parseInt(j$(data).attr("x")));
			  this.setY(parseInt(j$(data).attr("y")));
		      this.setWidth(parseInt(j$(data).attr("width")));
		      this.setHeight(parseInt(j$(data).attr("height")));
		      this.arc=(parseInt(j$(data).attr("arc")));
		      this.setShape(PadShape.parse(j$(data).attr("shape")));
			  
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
Move(xoffset, yoffset){
	   this.x+=xoffset;
	   this.y+=yoffset;
	   this.shape.move(xoffset, yoffset);
	   
	   if(this.drill!=null){
	     this.drill.Move(xoffset, yoffset);
	   }
	   this.text.Move(xoffset,yoffset);
	   
	}

Mirror(A,B) {
    let source = new d2.Point(this.x,this.y);
    utilities.mirrorPoint(A, B, source);
    this.setX(source.x);
    this.setY(source.y);
    if (this.drill != null) {
        this.drill.Mirror(A, B);
    }
    this.text.Mirror(A, B);
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
	                this.drill=new Drill(this.owningUnit,20,20);
	                this.drill.setLocation(this.x,this.y);
	            }
	            break;
	        case PadType.SMD:
	                this.drill=null;
	            break;
			}
}
setShape(shape){
	    switch(shape){
	    case PadShape.CIRCULAR:
	        this.shape=new CircularShape(this);
	    break;
	     case PadShape.OVAL: 
	        this.shape=new OvalShape(this);
	        break;
	    case PadShape.RECTANGULAR:
	        this.shape=new RectangularShape(this);
	        break;
	    case PadShape.POLYGON:
		    this.shape = new PolygonShape(this);
	        break;
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
	        this.shape.setWidth(width);    
	    }
setHeight(height){
	        this.shape.setHeight(height);
	    }
calculateShape() {
	return this.shape.box;
} 
setLocation( x,  y) {
		 throw new IllegalStateException("Doubt that setLocation will be invoked");
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
	constructor(pad){
		this.pad=pad;
		this.circle=new d2.Circle(new d2.Point(pad.getX(),pad.getY()),pad.getWidth()/2);		
		this.setWidth(this.pad.getWidth());
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
  	  let _copy=new CircularShape(pad);
  	  _copy.obround=this.circle.clone();	  
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
	   this.pad.width=width;
	   this.setHeight(width);
	}
    setHeight(height) {
	    this.pad.height=height;           
	}
}	
//------------OvalShape-----------------------
class OvalShape{
	constructor(pad){
	   this.pad=pad;
	   this.obround=new d2.Obround(new d2.Point(pad.getX(),pad.getY()),pad.getWidth(),pad.getHeight());
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
	  let _copy=new OvalShape(pad);
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
	    this.pad.width=width;
	    this.obround.setWidth(width);
}
setHeight(height) {
	    this.pad.height=height;
	    this.obround.setHeight(height);
	    this.obround.rotate(this.pad.rotate);
}
}
//------------RectangularShape----------------
class RectangularShape{
	constructor(pad){
		this.pad=pad;
		this.rect=new d2.Rectangle(new d2.Point((pad.getX()-pad.getWidth()/2)-pad.offset.x,(pad.getY()-pad.getHeight()/2)-pad.offset.y),pad.getWidth(),pad.getHeight());			
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
  let _copy=new RectangularShape(pad);
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
		   this.pad.width=width;
		   this.rect.setSize(this.pad.width,this.pad.height);
		   this.rect.rotate(this.pad.rotate);
}
setHeight(height) {
		   this.pad.height=height;
		   this.rect.setSize(this.pad.width,this.pad.height);
		   this.rect.rotate(this.pad.rotate);
}
}
//--------------PolygonShape-------------------------
class PolygonShape{
constructor(pad){
		this.pad=pad;
		this.hexagon=new d2.Hexagon(new d2.Point(pad.getX(),pad.getY()),this.pad.width);		
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
	  let _copy=new PolygonShape(pad);
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
            this.pad.width=width;
            this.pad.height=width;
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
	Pad,Drill,
	FootprintShapeFactory
}
