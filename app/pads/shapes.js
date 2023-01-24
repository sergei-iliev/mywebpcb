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
	if (data.tagName.toLowerCase() == 'solidregion') {
		var region = new SolidRegion(0);
		region.fromXML(data);		
		return region;
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
getLabel(){
  return this.texture;
}
get vertices(){
	  return [];	
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
getClickableOrder(){
	return 1;
}
setSide(side, line,angle) {
    this.copper=(core.Layer.Side.change(this.copper.getLayerMaskID()));
    this.texture.setSide(side, line, angle);
}
setSelected(selected) {
    this.texture.setSelected(selected);
}
isSelected() {
   return this.texture.selection;
}
rotate(rotation) {	
	this.texture.rotate(rotation.angle,rotation.origin);	
}
mirror(line) {

}
move(xoffset,yoffset) {
  this.texture.move(xoffset, yoffset);
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
paint(g2, viewportWindow, scale,layersmask) {
      if((this.copper.getLayerMaskID()&layersmask)==0){
        return;
      }
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
		this.texture.paint(g2, viewportWindow, scale,this.copper.getLayerMaskID());
    }
}	
class RoundRect extends Shape{
	constructor(x, y, width, height,arc,thickness,layermaskid) {
		super(x, y, width, height, thickness,layermaskid);
		this.setDisplayName("Rect");		
		this.selectionRectWidth=3000;
		this.resizingPoint = null;
		//this.rotation=0;
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone() {
		var copy = new RoundRect(0,0,0,0,0,this.thickness,this.copper.getLayerMaskID());
		copy.roundRect = this.roundRect.clone();
		copy.rotation=this.rotation;
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
	get vertices(){
	  return this.roundRect.vertices;	
	}
	isClicked(x, y) {		
	  if(this.fill==core.Fill.EMPTY) {
    		return this.roundRect.isPointOn(new d2.Point(x, y),this.thickness);
      }else {    		
      	    return this.roundRect.contains(new d2.Point(x, y));	
      } 			
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
	setRotation(rotate,center){
		let alpha=rotate-this.rotation;
		let box=this.roundRect.box;
		if(center==undefined){
		  this.roundRect.rotate(alpha,box.center);
		}else{
		  this.roundRect.rotate(alpha,center);	 	
		}
		this.rotation=rotate;
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
	move(xoffset, yoffset) {
		this.roundRect.move(xoffset,yoffset);
	}
	mirror(line){
		this.roundRect.mirror(line);
	}	
	rotate(rotation){	
		//fix angle
		let alpha=this.rotation+rotation.angle;
		if(alpha>=360){
			alpha-=360
		}
		if(alpha<0){
		 alpha+=360; 
		}	
		this.rotation=alpha;		
		this.roundRect.rotate(rotation.angle,rotation.origin);
	}
	Resize(xoffset, yoffset,clickedPoint){
		this.roundRect.resize(xoffset, yoffset,clickedPoint);
	}
	getClickableOrder(){
		return this.roundRect.area; 
	}	
	toXML() {
		let points="";
		this.roundRect.points.forEach(function(point) {
			points += utilities.roundFloat(point.x,4) + "," + utilities.roundFloat(point.y,4) + ",";
		},this);
		return "<rectangle copper=\"" + this.copper.getName()
		        +"\" thickness=\"" + this.thickness
				+ "\" fill=\"" + this.fill + "\" arc=\"" + this.roundRect.rounding
				+"\" points=\"" + points
				+ "\"></rectangle>";
	}
	fromXML(data) {
		if(j$(data)[0].hasAttribute("copper")){
		  this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
		}
		if(j$(data).attr("width")!=undefined){
		  this.roundRect.setRect(parseInt(j$(data).attr("x")),parseInt(j$(data).attr("y")),parseInt(j$(data).attr("width")),parseInt(j$(data).attr("height")),parseInt(j$(data).attr("arc"))/2);
		}else{			
			var pts=j$(data).attr("points");			
			var lastchar = pts[pts.length - 1];
			if(lastchar==","){
				pts=pts.substr(0,pts.length - 1); 
			}
			var array = JSON.parse("[" +pts+ "]");
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
		this.fill=(this.fill==0?1:this.fill);
	}
	paint(g2, viewportWindow, scale,layersmask) {
	    if((this.copper.getLayerMaskID()&layersmask)==0){
	        return;
	    }		
		var rect = this.roundRect.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
		  g2.globalCompositeOperation = 'source-atop';	
		}else{
		  g2.globalCompositeOperation = 'lighter';
		}
		g2.lineWidth = this.thickness * scale.getScale();
		g2.lineCap = 'round';
		g2.lineJoin = 'round';

		if (this.fill == core.Fill.EMPTY) {		
			if (this.selection) {
				g2.globalCompositeOperation = 'source-over';
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}			
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.globalCompositeOperation = 'source-over';
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
		
		g2.globalCompositeOperation = 'source-over';

	}

drawControlShape(g2, viewportWindow, scale){
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
		//this.rotation=0;
	}
clone() {
	let copy=new Circle(this.circle.center.x,this.circle.center.y,this.circle.radius,this.thickness,this.copper.getLayerMaskID());
	copy.rotation=this.rotation;
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
alignResizingPointToGrid(targetPoint) {   

}
get vertices(){
	  return this.circle.vertices;	
	}
isClicked(x, y) {	
	if(this.fill==core.Fill.EMPTY) {
        	  return (this.circle.isPointOn(new d2.Point(x,y),this.thickness/2));
        }else {    		
        	  return this.circle.contains(new d2.Point(x, y));	
        }
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
        return "<circle copper=\""+this.copper.getName()+"\" x=\""+utilities.roundFloat(this.circle.pc.x,4)+"\" y=\""+utilities.roundFloat(this.circle.pc.y,4)+"\" radius=\""+utilities.roundFloat(this.circle.r,4)+"\" thickness=\""+this.thickness+"\" fill=\""+this.fill+"\"/>";
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
	mirror(line){
	   this.circle.mirror(line);	
	}
    
	move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}	
	setRotation(rotate,center){
		let alpha=rotate-this.rotation;
		if(center==null){
			this.circle.rotate(alpha,this.circle.center);
		}else{
			this.circle.rotate(alpha,center);	 	
		}
		this.rotation=rotate;						
	}		
	rotate(rotation){
		//fix angle
		let alpha=this.rotation+rotation.angle;
		if(alpha>=360){
			alpha-=360
		}
		if(alpha<0){
		 alpha+=360; 
		}	
		this.rotation=alpha;
		this.circle.rotate(rotation.angle,rotation.origin);
	}
	Resize(xoffset, yoffset,point) {    
		let radius=this.circle.r;

        if(d2.utils.EQ(point.x,this.circle.pc.x)){
          if(point.y>this.circle.pc.y){
        	  radius+=yoffset;
          }else{
        	  radius-=yoffset;  
          }	
        }
        if(d2.utils.EQ(point.y,this.circle.pc.y)){
            if(point.x>this.circle.pc.x){
          	  radius+=xoffset;
            }else{
          	  radius-=xoffset;  
            }	
        }
        if(radius>0){ 
          this.circle.r=radius;
        }
    }	
	paint(g2, viewportWindow, scale,layersmask) {
	    if((this.copper.getLayerMaskID()&layersmask)==0){
	        return;
	    }		
		var rect = this.circle.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		// ****3 http://scienceprimer.com/draw-oval-html5-canvas
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
		  g2.globalCompositeOperation = 'source-atop';	
		}else{
		  g2.globalCompositeOperation = 'lighter';
		}
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
		
		  
 }
drawControlShape(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.circle.vertices);	
}
getClickableOrder(){
	return this.circle.area; 
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
			this.arc=new d2.Arc(new d2.Point(x,y),r,50,170);
			this.A;
			this.B;
			this.M;
			//this.rotation=0;
			this.arcType=core.ArcType.CENTER_POINT_ARC;
	}
	clone() {

			var copy = new Arc(this.arc.center.x,this.arc.center.y, this.arc.r,this.thickness,this.copper.getLayerMaskID());		
	        copy.arc.startAngle = this.arc.startAngle;
	        copy.arc.endAngle = this.arc.endAngle; 
	        copy.rotation=this.rotation;
			copy.fill = this.fill;
			return copy;
	}
	calculateShape() {
		return this.arc.box;	
	}
	alignResizingPointToGrid(isStartPoint) {
		let A=this.arc.start.clone(),B=this.arc.end.clone();				
	    let targetPoint;

		if(isStartPoint){  //start point click	    		    	
	    	 targetPoint=this.owningUnit.grid.positionOnGrid(A.x,A.y);
	    	 this.resizeStartEndPoint((targetPoint.x-A.x),(targetPoint.y-A.y),isStartPoint);
	    }else{	    	
	    	targetPoint=this.owningUnit.grid.positionOnGrid(B.x,B.y);
	    	this.resizeStartEndPoint((targetPoint.x-B.x),(targetPoint.y-B.y),isStartPoint);
	    }			        
	}
	getClickableOrder(){
		return this.arc.area; 
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
			this.arc.startAngle = parseInt(j$(data).attr("start"));
	        this.arc.endAngle = parseInt(j$(data).attr("extend"));        
			this.thickness = (parseInt(j$(data).attr("thickness")));
			this.fill=parseInt(j$(data).attr("fill"));
	}
	toXML() {
	    return '<arc copper="'+this.copper.getName()+'"  x="'+utilities.roundFloat(this.arc.pc.x,4)+'" y="'+utilities.roundFloat(this.arc.pc.y,4)+'" radius="'+utilities.roundFloat(this.arc.r,4)+'"  thickness="'+this.thickness+'" start="'+utilities.roundFloat(this.arc.startAngle,2)+'" extend="'+utilities.roundFloat(this.arc.endAngle,2)+'" fill="'+this.fill+'" />';
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
	get vertices(){
		  return this.arc.vertices;	
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
    	if(this.fill==core.Fill.EMPTY) {
      	  return (this.arc.isPointOn(new d2.Point(x,y),this.thickness/2));
      	}else {    		
      	  return this.arc.contains(new d2.Point(x, y));	
      	}
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
		let alpha=rotate-this.rotation;
		if(center==undefined){
			this.arc.rotate(alpha,this.arc.center);
		}else{
			this.arc.rotate(alpha,center);	 	
		}
		this.rotation=rotate;
	}
	rotate(rotation){
		//fix angle
	  let alpha=this.rotation+rotation.angle;
	  if(alpha>=360){
			alpha-=360
	  }
	  if(alpha<0){
		 alpha+=360; 
	  }	
	  this.rotation=alpha;	
	  this.arc.rotate(rotation.angle,rotation.origin); 
	}
	mirror(line) {
	  this.arc.mirror(line);
	}
	resizeStartEndPoint(xoffset,yoffset,isStartPoint){
		let A=this.arc.start.clone(),B=this.arc.end.clone(),M=this.arc.middle.clone(),O=new d2.Point();
		let middleSegment=new d2.Segment(A,B);
		let middlePoint=middleSegment.middle();
		
		let delta=M.distanceTo(middlePoint);
	    if(isStartPoint){  //start point click	    		    	
	    	A.move(xoffset,yoffset);	    	
	    }else{	    	
	    	B.move(xoffset,yoffset);
	    }
	    	middleSegment.set(A.x,A.y,B.x,B.y);
	    	middlePoint=middleSegment.middle();
	    	O.set(middlePoint);
	    	M.set(middlePoint);
	    	
	    	let v=new d2.Vector(middlePoint,A);
	    	if(this.arc.endAngle>0){
	    	  v.rotate90CW();
	    	}else{
	    	  v.rotate90CCW();	
	    	}
	    	let norm=v.normalize();
			let x=M.x +delta*norm.x;
			let y=M.y +delta*norm.y;
			M.set(x,y);	//new position of mid point
	    	//same calculation - arc on 3 points
			let C=M;  
			let C1=O;
	    
			x=C1.distanceTo(A);
			y=C1.distanceTo(C);


			let l=(x*x)/y;
			let lambda=(l-y)/2;

			v=new d2.Vector(C,C1);
			norm=v.normalize();			  
		
			let a=C1.x +lambda*norm.x;
			let b=C1.y + lambda*norm.y;
			let center=new d2.Point(a,b);
	        let r = center.distanceTo(A);
			
			let startAngle =new d2.Vector(center,A).slope;
			let endAngle = new d2.Vector(center, B).slope;
	    

			let start = 360 - startAngle;		
			let end= (360-endAngle)-start;		
			
			if(this.arc.endAngle<0){  //negative extend
				if(end>0){			  
				  end=end-360;
				}
			}else{		//positive extend			
				if(end<0){ 					   
					end=360-Math.abs(end);
				}			
			}

		
			this.arc.center.set(center.x,center.y);
			this.arc.r=r;
			this.arc.startAngle=start;
			this.arc.endAngle=end;		
			
			if(isStartPoint){
				this.resizingPoint=this.arc.start;
			}else{
				this.resizingPoint=this.arc.end;
			}
	}
	/*
	 * Resize through mouse position point
	 */
//	Resize(xoffset, yoffset,point) {
//	    	
//	    this.resizingPoint=this.calculateResizingMidPoint(point);
//	    
//		//old middle point on arc
//		let a1=this.arc.middle;  
//		//mid point on line
//		let m=new d2.Point((this.arc.start.x+this.arc.end.x)/2,(this.arc.start.y+this.arc.end.y)/2);
//		//new middle point on arc
//		let a2=this.resizingPoint;  //new middle
//		
//		//do they belong to the same plane in regard to m 
//		let vec = new d2.Vector(m, a2);
//		let linevec=new d2.Vector(m,a1);
//	    let samePlane = d2.utils.GT(vec.dot(linevec.normalize()), 0);
//	    
//	    
//	//which plane
//	    	
//		if(!samePlane){
//	      //return;
//		}
//			let C=this.resizingPoint;  //projection
//			let C1=m;
//	    
//			let y=C1.distanceTo(C);
//			let x=C1.distanceTo(this.arc.start);
//	    
//			let l=(x*x)/y;
//			let lambda=(l-y)/2;
//
//			let v=new d2.Vector(C,C1);
//			let norm=v.normalize();			  
//		
//			let a=C1.x +lambda*norm.x;
//			let b=C1.y + lambda*norm.y;
//			let center=new d2.Point(a,b);
//	        let r = center.distanceTo(this.arc.start);
//			
//			let startAngle =new d2.Vector(center,this.arc.start).slope;
//			let endAngle = new d2.Vector(center, this.arc.end).slope;
//	    
//
//			let start = 360 - startAngle;		
//			let end= (360-endAngle)-start;		
//			
//			if(this.arc.endAngle<0){  //negative extend
//				if(end>0){			  
//				  end=end-360;
//				}
//			}else{		//positive extend			
//				if(end<0){ 					   
//					end=360-Math.abs(end);
//				}			
//			}
//
//		
//			this.arc.center.set(center.x,center.y);
//			this.arc.r=r;
//			this.arc.startAngle=start;
//			this.arc.endAngle=end;  
//		
//}
Resize(xoffset, yoffset,point) {  
	//previous mid pont
	let oldM=this.M.clone();		
    this.M=this.calculateResizingMidPoint(point);
    
     
	//mid point on line
	let m=new d2.Point((this.A.x+this.B.x)/2,(this.A.y+this.B.y)/2);
		
	
		let C=this.M;  //projection
		let C1=m;
    
		let y=C1.distanceTo(C);
		let x=C1.distanceTo(this.A);
    
		let l=(x*x)/y;
		let lambda=(l-y)/2;

		let v=new d2.Vector(C,C1);
		let norm=v.normalize();			  
	
		let a=C1.x +lambda*norm.x;
		let b=C1.y + lambda*norm.y;
		let center=new d2.Point(a,b);
        let r = center.distanceTo(this.A);
			        
        
     	let startAngle =new d2.Vector(center,this.A).slope;
		let endAngle = new d2.Vector(center, this.B).slope;
	
		let start = 360 - startAngle;		
		let end= (360-endAngle)-start;		
		
		if(this.arc.endAngle<0){  //negative extend
			if(end>0){			  
			  end=end-360;
			}
		}else{		//positive extend			
			if(end<0){ 					   
				end=360-Math.abs(end);
			}			
		}
		this.arc.center.set(center.x,center.y);
		this.arc.r=r;
		this.arc.startAngle=start;
		
        //check if M and oldM on the same plane	    
	    if(utilities.isLeftPlane(this.A,this.B,this.M)!=utilities.isLeftPlane(this.A,this.B,oldM)){		     					
			if(this.arc.endAngle<0){  //negative extend
			 this.arc.endAngle=(360-end);
			}else{
			 this.arc.endAngle=-1*(360-end);	
			}						     		
	    }else{							
	    	this.arc.endAngle=end;			
	    }			   
	
	    this.resizingPoint=this.arc.middle;
}	
calculateResizingMidPoint(pt){
	let middle=new d2.Point((this.A.x+this.B.x)/2,(this.A.y+this.B.y)/2);
	let line=new d2.Line(middle,this.M);
	return line.projectionPoint(new d2.Point(pt.x,pt.y));	
}
move(xoffset,yoffset){
	  this.arc.move(xoffset,yoffset);	
	}
paint(g2, viewportWindow, scale,layersmask) {
	    if((this.copper.getLayerMaskID()&layersmask)==0){
	    	return;
	    }
		var rect = this.arc.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		
		g2.beginPath(); // clear the canvas context
		g2.lineCap = 'round';

						
		g2.lineWidth = this.thickness * scale.getScale();
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
			  g2.globalCompositeOperation = 'source-atop';	
		}else{
			  g2.globalCompositeOperation = 'lighter';
		}				
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
			    

	}
	drawControlShape(g2, viewportWindow, scale) {		
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,[this.arc.center,this.arc.start,this.arc.end,this.arc.middle]);	
	}
	setResizingPoint(pt){
		this.resizingPoint=pt;
	}
	getResizingPoint() {
		return this.resizingPoint;
	}
}


class SolidRegion extends Shape{
	constructor(layermaskId) {
        super( 0, 0, 0,0, 0, layermaskId);
        this.displayName = "Solid Region";
        this.floatingStartPoint=new d2.Point();
        this.floatingEndPoint=new d2.Point();                 
        this.selectionRectWidth = 3000;
        this.polygon=new d2.Polygon();
        this.resizingPoint;
        //this.rotation=0;
    }
clone(){
	  var copy=new SolidRegion(this.copper.getLayerMaskID());
      copy.polygon=this.polygon.clone();
      copy.rotation=this.rotation;
      return copy;
}
getClickableOrder(){
	return this.polygon.box.area; 
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
move(xoffset, yoffset) {
	this.polygon.move(xoffset,yoffset);
}
mirror(line) {
    this.polygon.mirror(line);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotation;
	let box=this.polygon.box;
	if(center==null){
		this.polygon.rotate(alpha,box.center);
	}else{
		this.polygon.rotate(alpha,center);	 	
	}
	this.rotation=rotate;
}
rotate(rotation) {
	//fix angle
	let alpha=this.rotation+rotation.angle;
	if(alpha>=360){
		alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotation=alpha;
	this.polygon.rotate(rotation.angle,rotation.origin);
}
paint(g2, viewportWindow, scale,layersmask) {		
    if((this.copper.getLayerMaskID()&layersmask)==0){
        return;
    }
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
	g2.globalCompositeOperation = 'lighter';
	a.paint(g2);
	g2.globalCompositeOperation = 'source-over';
	g2._fill=false;    
}

drawControlShape(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.polygon.points);	
}
toXML() {
	var result = "<solidregion copper=\"" + this.copper.getName() + "\">";
	this.polygon.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,4) + "," + utilities.roundFloat(point.y,4) + ",";
	});
	result += "</solidregion>";
	return result;
}
fromXML(data) {
       if(j$(data).attr("copper")!=null){
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
       }else{
        this.copper=core.Layer.Copper.FSilkS;
       }	
   	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseFloat(tokens[index]);
			var y = parseFloat(tokens[index + 1]);
			this.polygon.points.push(new d2.Point(x, y));
		}
}
}

class Line extends AbstractLine{
constructor(thickness,layermaskId) {
			super(thickness,layermaskId);	
}
clone() {
		  var copy = new Line(this.thickness,this.copper.getLayerMaskID());
		  copy.polyline=this.polyline.clone();
		  copy.rotation=this.rotation;
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

getOrderWeight() {
	return 2;
}
paint(g2, viewportWindow, scale,layersmask) {		
       if((this.copper.getLayerMaskID()&layersmask)==0){
         return;
       }	
	   var rect = this.polyline.box;
	   rect.scale(scale.getScale());		
	   if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	   }
				
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		g2.lineWidth = this.thickness * scale.getScale();
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
			  g2.globalCompositeOperation = 'source-atop';	
		}else{
			  g2.globalCompositeOperation = 'lighter';
		}
		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = this.copper.getColor();

		let a=this.polyline.clone();
		if (this.isFloating()) {                                                    
            if(this.resumeState==ResumeState.ADD_AT_FRONT){                
                let p = this.floatingEndPoint.clone();
                a.points.unshift(p);               
            }else{		                            
                let p = this.floatingEndPoint.clone();
                a.add(p);    
            }
		} 	
		
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		
		g2.globalCompositeOperation = 'source-over';				

}

toXML() {
	var result = "<line copper=\"" + this.copper.getName()
								+ "\" thickness=\"" + this.thickness + "\">";
	this.polyline.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,5) + "," + utilities.roundFloat(point.y,5) + ",";
	},this);
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
			var x = parseFloat(tokens[index]);
			var y = parseFloat(tokens[index + 1]);
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
	 move( xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	 }
	 getWidth(){
		 return 2*this.circle.r;
	 }
	 setWidth(width){
		 this.circle.r=width/2;
	 }
	 //rotate(rotation) {
	 //	 this.circle.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
	 //}	   
	 mirror( line) {
	       this.circle.mirror(line);
	 }
	 rotate(alpha,origin){
	    if(origin==null){
	       this.circle.rotate(alpha);
	    }else{
	       this.circle.rotate(alpha,origin);	
	    }		 
	 }
	paint(g2,viewportWindow,scale){
	    g2._fill=true;
	    g2.fillStyle = 'black';
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
		g2._fill=false;
	}
	toXML(){
	    return "<drill type=\"CIRCULAR\" x=\""+utilities.roundFloat(this.circle.pc.x,4)+"\" y=\""+utilities.roundFloat(this.circle.pc.y,4)+"\" width=\""+utilities.roundFloat(2*this.circle.radius,2)+"\" />";	
	}
	fromXML(data){ 
	   this.setLocation(parseFloat(j$(data).attr("x")),parseFloat(j$(data).attr("y")));
	   this.setWidth(parseFloat(j$(data).attr("width")));  	   
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
	   //this.rotation=0;
	   this.offset=new d2.Point(0,0);
	   this.shape=new CircularShape(0,0,width,this);
	   this.setType(PadType.THROUGH_HOLE);	   
	   this.setDisplayName("Pad");
	   
	   this.number=new font.FontTexture("1","number",x,y,4000,0);
	   this.netvalue=new font.FontTexture("","netvalue",x,y,4000,0);   
	}
clone(){
	     var copy=new Pad(0,0,this.width,this.height);
	     copy.setType(this.type);
	     copy.width=this.width;
	     copy.height=this.height;
	     copy.rotation=this.rotation;
	     copy.shape=this.shape.copy(copy);
	     copy.copper=this.copper;
	     copy.number=this.number.clone();
	     copy.netvalue=this.netvalue.clone();
	     if(this.drill!=null){
	    	 copy.drill=this.drill.clone();
	     }
	     return copy;
	}

getClickedTexture(x,y) {
    if(this.number.isClicked(x, y))
        return this.number;
    else if(this.netvalue.isClicked(x, y))
        return this.netvalue;
    else
    return null;
}
isClickedTexture(x,y) {
    return this.getClickedTexture(x, y)!=null;
}
getTextureByTag(tag) {
    if(tag===(this.number.tag))
        return this.number;
    else if(tag===(this.netvalue.tag))
        return this.netvalue;
    else
    return null;
}
getCenter(){
	return this.shape.center;
}
toXML(){
	    var xml="<pad copper=\""+this.copper.getName()+"\" type=\"" +PadType.format(this.type) + "\" shape=\""+PadShape.format(this.getShape())+"\" x=\""+utilities.roundFloat(this.shape.center.x,4)+"\" y=\""+utilities.roundFloat(this.shape.center.y,4)+"\" width=\""+utilities.roundFloat(this.getWidth(),2)+"\" height=\""+utilities.roundFloat(this.getHeight(),2)+"\" rt=\""+utilities.roundFloat(this.rotation,2)+"\">\r\n";
	        //xml+=this.shape.toXML()+"\r\n";
	        xml+="<offset x=\""+this.offset.x+"\" y=\""+this.offset.y+"\" />\r\n";
	    
	        if (!this.number.isEmpty())
	        	xml+="<number>" +
	                      this.number.toXML() +
	                      "</number>\r\n";
	    if (!this.netvalue.isEmpty())
	           xml+="<netvalue>" +
	                      this.netvalue.toXML() +
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
		      
			  let x=(parseFloat(j$(data).attr("x")));
			  let y=(parseFloat(j$(data).attr("y")));
		      this.width=(parseFloat(j$(data).attr("width")));
		      this.height=(parseFloat(j$(data).attr("height")));
		      
		      if(j$(data).attr("rt")!=undefined)
		        this.rotation=(parseFloat(j$(data).attr("rt")));
		      
		      this.setShape(x,y,PadShape.parse(j$(data).attr("shape")));
			  
		      var offset=(j$(data).find("offset"));
		      this.offset.x=(parseFloat(j$(offset).attr("x")));
		      this.offset.y=(parseFloat(j$(offset).attr("y")));
		      
		      if(this.drill!=null){
		          this.drill.fromXML(j$(data).find("drill"));
		      }   

		      var number=(j$(data).find("number").text()); 
			  var netvalue=(j$(data).find("netvalue").text());
			  if(number==''){
				  this.number.setLocation(this.getX(), this.getY());
			  }else{
				  this.number.fromXML(number);
			  }
			  if(netvalue==''){
				  this.netvalue.setLocation(this.getX(), this.getY());
			  }else{
				  this.netvalue.fromXML(netvalue);
			  }
		     
	}

getPinPoint() {        
    return this.shape.center;
}
alignToGrid(isRequired){
	     var center=this.shape.center;
	     var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
	     this.move(point.x - center.x,point.y - center.y);
	     return null;     
	}	
getClickableOrder(){
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
	if(this.isControlPointVisible){
		this.number.setSelected(selection);
		this.netvalue.setSelected(selection);
	}
}
move(xoffset, yoffset){
	   this.shape.move(xoffset, yoffset);
	   
	   if(this.drill!=null){
	     this.drill.move(xoffset, yoffset);
	   }
	   this.number.move(xoffset,yoffset);
	   this.netvalue.move(xoffset,yoffset);
	   
	}

mirror(line) {

}
setSide(side, line, angle) {
    this.copper=core.Layer.Side.change(this.copper.getLayerMaskID());
    this.netvalue.setSide(side,line,angle);
    this.number.setSide(side,line,angle);
    this.shape.mirror(line);
    if(this.drill!=null){
       this.drill.mirror(line);
    }
    this.rotation=angle;
}
setRotation(rotate,center){	
	let alpha=rotate-this.rotation;	
	
	  this.shape.rotate(alpha,center);
	  this.number.setRotation(rotate,center);
	  this.netvalue.setRotation(rotate,center);
	  if(this.drill!=null){
	    this.drill.rotate(alpha,center);	   
	  }
	this.rotation=rotate;
}
rotate(rotation){
	let alpha=this.rotation+rotation.angle;
	if(alpha>=360){
		alpha-=360
	}
	 if(alpha<0){
		 alpha+=360; 
	 }
	this.shape.rotate(rotation.angle,rotation.origin);	
    if(this.drill!=null){
     this.drill.rotate(rotation.angle,rotation.origin);
    }	
	this.number.setRotation(alpha,rotation.origin);
	this.netvalue.setRotation(alpha,rotation.origin);
	this.rotation=alpha;
	
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
	    if(this.rotation!=0){
		  this.shape.rotate(this.rotation);
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
	        this.shape.setSize(width,this.height);    
	    }
setHeight(height){	        
			this.height=height;
	        this.shape.setSize(this.width,height);
	    }
calculateShape() {
	return this.shape.box;
} 
validateClearance(source){
    //1 is different layer and SMD -> no clearance
    if ((source.copper.getLayerMaskID() & this.copper.getLayerMaskID()) == 0) {
        //if(this.type==PadType.SMD)
           return false; //not on the same layer
    }	
    //2. is same net 
    //if(isSameNet(source)&&source.getPadConnection()==PadShape.PadConnection.DIRECT){
    //    return;
    //}
    
    //3. is pad  within copper area
    let rect = this.getBoundingShape();
        rect.grow(source.clearance);
        
    if(!source.getBoundingShape().intersects(rect)){
          return false; 
    }  	
    return true;
}
drawClearence(g2,viewportWindow,scale,source){
    if(!this.validateClearance(source)){
        return;
    }
    
    //g2.save();     
    //g2.clip(source.clip);

	this.shape.drawClearence(g2,viewportWindow,scale,source);
	//g2.restore();
}
paint(g2,viewportWindow,scale,layersmask){
	if((this.copper.getLayerMaskID()&layersmask)!=0) {
	switch(this.type){
	    case PadType.THROUGH_HOLE:
	        if(this.shape.paint(g2, viewportWindow, scale)){
	         if(this.drill!=null){
	            this.drill.paint(g2, viewportWindow, scale);
	         }
	        }
	        break;
	    case PadType.SMD:
	        this.shape.paint(g2, viewportWindow, scale);
	        break;
	    
	    }
	    this.number.paint(g2, viewportWindow, scale);
	    this.netvalue.paint(g2, viewportWindow, scale);
	 }
	}
}
	//----------CircularShape-------------------
class CircularShape{
	constructor(x,y,width,pad){
		this.pad=pad;
		this.circle=new d2.Circle(new d2.Point(x,y),width/2);		
	}
	drawClearence(g2,viewportWindow,scale,source){
	    let c=this.circle.clone();
	    
		
		g2._fill=true;
		g2.fillStyle = "black";	
		
		c.grow(source.clearance);
		
		
	    c.scale(scale.getScale());		
	    c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
	    g2._fill=false;			
	}	
    paint(g2,viewportWindow,scale){
    	 var rect = this.circle.box;
       	 rect.scale(scale.getScale());
       	 if (!rect.intersects(viewportWindow)) {
      		  return;
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
    mirror(line) {
        this.circle.mirror(line);
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
    setSize(width,height) {
	   this.circle.r=width/2;
	}
    

}
//------------RectangularShape----------------
class RectangularShape{
	constructor(x,y,width,height,pad){
		this.pad=pad;
		this.rect=new d2.Rectangle(new d2.Point(x-width/2,y-height/2),width,height);			
}
drawClearence(g2,viewportWindow,scale,source){
    let r=this.rect.clone();
    
	
	g2._fill=true;
	g2.fillStyle = "black";	
	
	r.grow(source.clearance);
	
    r.scale(scale.getScale());		
    r.move(-viewportWindow.x,- viewportWindow.y);
	r.paint(g2);
	
    g2._fill=false;			
}
paint(g2,viewportWindow,scale){
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
mirror( line) {
    this.rect.mirror(line);
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
setSize(width,height) {
		   this.rect.setSize(width,height);
		   this.rect.rotate(this.pad.rotation);
}
}
//------------OvalShape-----------------------
class OvalShape{
	constructor(x,y,width,height,pad){
	   this.pad=pad;
	   this.obround=new d2.Obround(new d2.Point(x,y),width,height);
	}
	drawClearence(g2,viewportWindow,scale,source){
		let o=this.obround.clone();
	    o.grow(source.clearance);
	    g2.strokeStyle = "black";  

		o.scale(scale.getScale());
	    o.move(-viewportWindow.x,- viewportWindow.y);
		o.paint(g2);
		
	}
paint(g2,viewportWindow,scale){
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
mirror(line) {
    this.obround.mirror(line);
}
get box(){
	return this.obround.box;
}
get center(){
	return this.obround.center;	
}
setSize(width,height) {	    
	    this.obround.setSize(width,height);
	    this.obround.rotate(this.pad.rotation);
}
}

//--------------PolygonShape-------------------------
class PolygonShape{
constructor(x,y,width,pad){
		this.pad=pad;
		this.hexagon=new d2.Hexagon(new d2.Point(x,y),width);		
}	
drawClearence(g2,viewportWindow,scale,source){
	    let h=this.hexagon.clone();
	    h.grow(source.clearance);
     
	    g2._fill=true;		   
		g2.fillStyle = "black";	
	    h.scale(scale.getScale());
        h.move(-viewportWindow.x,- viewportWindow.y);
	    h.paint(g2);
	    
	    g2._fill=false;
}
paint(g2, viewportWindow, scale) {
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
mirror(line) {
   this.hexagon.mirror(line);
}
setSize(width,height) {
   this.hexagon.setWidth(width);
   this.hexagon.rotate(this.pad.rotation);
}
	
}
module.exports ={
	GlyphLabel,
	Line,
	RoundRect,
	Circle,
	Arc,
	SolidRegion,
	Pad,Drill,PadType,
	FootprintShapeFactory
}
