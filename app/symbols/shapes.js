var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var AbstractLine=require('core/shapes').AbstractLine;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var d2=require('d2/d2');

class SymbolShapeFactory{
	
	createShape(data){
		if (data.tagName.toLowerCase() == 'pin') {
			var pin = new Pin();
			pin.fromXML(data);
			return pin;
		}
		if (data.tagName.toLowerCase() == 'rectangle') {
			var roundRect = new RoundRect(0,0,0,0, 0,0);
			roundRect.fromXML(data);
			return roundRect;
		}
		if (data.tagName.toLowerCase() == 'ellipse') {
			var circle = new Ellipse(0, 0);
			circle.fromXML(data);
			return circle;
		}
		if (data.tagName.toLowerCase() == 'line') {
			var line = new Line(0);
			line.fromXML(data);
			return line;
		}
		if (data.tagName.toLowerCase() == 'arc') {
			var arc = new Arc(0, 0, 0, 0);			
			arc.fromXML(data);
			return arc;
		}
		if (data.tagName.toLowerCase() == 'label') {
			var label = new FontLabel(0,0);
			label.fromXML(data);		
			return label;
		}
		if (data.tagName.toLowerCase() == 'triangle') {
			var triangle = new Triangle(0);
			triangle.fromXML(data);		
			return triangle;
		}	
		if (data.tagName.toLowerCase() == 'arrow') {
			var arrow = new ArrowLine();
			arrow.fromXML(data);		
			return arrow;
		}	
	}
}

class Line extends AbstractLine{
constructor(thickness) {
	super(1,core.Layer.LAYER_ALL);	
	this.fillColor='#000000';
	this.selectionRectWidth=4;
}
clone() {
	  var copy = new Line(this.thickness);
	  copy.polyline=this.polyline.clone();
	  copy.thickness=this.thickness;
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
			g2.strokeStyle = "#808080";
		else
			g2.strokeStyle = this.fillColor;
		
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
		
		
		if (this.selection&&this.isControlPointVisible) {
			this.drawControlShape(g2, viewportWindow, scale);
		}

}
fromXML(data){
   	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			this.polyline.points.push(new d2.Point(x, y));
	   }
	   if(j$(data).attr("thickness")){
	      this.thickness=(parseInt(j$(data).attr("thickness")));
	   }else{
		   this.thickness=parseInt(tokens[tokens.length-1]); 
	   }
}
toXML(){
	var result = "<line  thickness=\"" + this.thickness + "\">";
	this.polyline.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,1) + "," + utilities.roundFloat(point.y,1) + ",";
	},this);
	result += "</line>\r\n";
	return result;	
}
}
class FontLabel extends Shape{
	constructor(x, y) {
		super(x, y, 0, 0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Label");		
		this.texture=new font.SymbolFontTexture("Label","label",x,y,0,8);
	}
	clone(){
		var copy = new FontLabel(this.x,this.y);
		copy.texture = this.texture.clone();  				
		return copy;
	}
	getClickableOrder() {		
		return 0;
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
    rotate(rotation){
    	this.texture.setRotation(rotation);	      
    }
    mirror(line){
    	let oldalignment = this.texture.shape.alignment;
    	this.texture.mirror(line);	
        if (line.isVertical) { //right-left mirroring
            if (this.texture.shape.alignment == oldalignment) {
                this.texture.shape.anchorPoint.set(this.texture.shape.anchorPoint.x +
                                        (this.texture.shape.metrics.ascent - this.texture.shape.metrics.descent),this.texture.shape.anchorPoint.y);
            }
        } else { //***top-botom mirroring          
            if (this.texture.shape.alignment == oldalignment) {
            	this.texture.shape.anchorPoint.set(this.texture.shape.anchorPoint.x,this.texture.shape.anchorPoint.y +(this.texture.shape.metrics.ascent - this.texture.shape.metrics.descent));
            }
        }        
      
    }
    move(xoffset,yoffset) {
        this.texture.move(xoffset, yoffset);
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
fromXML(data){	 		
    this.texture.fillColor ="#" +(j$(data).attr("color") & 0x00FFFFFF).toString(16).padStart(6, '0');
	this.texture.fromXML(j$(data).text());
}
static formatToXML(texture){
	return "<label color=\""+utilities.hexToDec(texture.fillColor)+"\">"+texture.toXML()+"</label>";
}
toXML(){
    if(this.texture!=null&&!this.texture.isEmpty()){
        return "<label color=\""+utilities.hexToDec(this.texture.fillColor)+"\">"+this.texture.toXML()+"</label>";
    }else
        return "";  	
}    
}
class Arc extends Shape{
	constructor(x,y,w,h) {
	   super(x,y, w, h, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Arc");		
		this.arc=new d2.Arcellipse(new d2.Point(x,y),w,h);
		this.selectionRectWidth=4;
		this.fillColor='#000000';							
	}
	clone(){
		var copy = new Arc(this.arc.pc.x,this.arc.pc.y,this.arc.w,this.arc.h);
		copy.arc=this.arc.clone();
		copy.fill=this.fill;
		copy.thickness=this.thickness;
		return copy;
	}
    alignResizingPointToGrid(point) {

    }	
    getClickableOrder() {        
        return this.getBoundingShape().area;
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
    	if(this.fill==core.Fill.EMPTY) {
    	  return (this.arc.isPointOn(new d2.Point(x,y),this.thickness));
    	}else {    		
    	  return this.arc.contains(x, y);	
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
	rotate(rotation){	
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
	mirror(line) {
	    this.arc.mirror(line);
	}
	move(xoffset,yoffset) {
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
			
		  
			let e=this.arc.clone();	
			e.scale(scale.getScale());
	        e.move(-viewportWindow.x,- viewportWindow.y);
					  
			if (this.fill == core.Fill.EMPTY) {
				if (this.selection) {
					g2.strokeStyle = "#808080";
				} else {
					g2.strokeStyle = this.fillColor;
				}
				e.paint(g2);
			}else if(this.fill == core.Fill.GRADIENT){ 
			  g2._fill=true;		  
			  var grd = g2.createLinearGradient(e.box.x,e.box.y, e.box.max.x,e.box.max.y);
			  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
			  grd.addColorStop(1, "white");
			  g2.fillStyle = grd;
			  e.paint(g2);
			  g2._fill=false;
	          g2.strokeStyle=(this.selection?"#808080":this.fillColor);
	          e.paint(g2);
			}else {
				g2._fill=true;
				if (this.selection) {
					g2.fillStyle = "#808080";
				} else {
					g2.fillStyle = this.fillColor;
				}			
				e.paint(g2);
				g2._fill=false;
			}   

			
			
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
fromXML(data) {
		
    if(data.textContent.length>0){
    	var tokens = data.textContent.split(",");
    	let x=parseInt(tokens[0]);
    	let y=parseInt(tokens[1]);
    	let w=parseInt(tokens[2]);
    	let h=parseInt(tokens[3]);
    	this.arc.pc.set(x+w/2,y+h/2);
    	this.arc.w=w/2;
    	this.arc.h=h/2;
	
	
    	this.arc.endAngle = parseInt(tokens[4]);        
    	this.arc.startAngle = parseInt(tokens[5]);
    
    	this.thickness = parseInt(tokens[6]);
		this.fill = parseInt(tokens[7]);
    }else{    	
        let x=parseFloat(j$(data).attr("x"));
        let y=parseFloat(j$(data).attr("y"));
        let w=parseFloat(j$(data).attr("width"));
        let h=parseFloat(j$(data).attr("height"));
        
        this.arc.pc.set(x,y);
        this.arc.w=w;
        this.arc.h=h;
        
        this.arc.startAngle = parseFloat(j$(data).attr("start"));       
        this.arc.endAngle = parseFloat(j$(data).attr("extend"));
        
        this.thickness=(parseInt(j$(data).attr("thickness")));
        this.fill = (parseInt(j$(data).attr("fill")));  	
    }
  
}
toXML(){
 return '<arc  x="'+utilities.roundFloat(this.arc.pc.x,1)+'" y="'+utilities.roundFloat(this.arc.pc.y,1)+'" width="'+utilities.roundFloat(this.arc.w,1)+ '" height="'+utilities.roundFloat(this.arc.h,1)+ '"  thickness="'+this.thickness+'" start="'+utilities.roundFloat(this.arc.startAngle,1)+'" extend="'+utilities.roundFloat(this.arc.endAngle,1)+'" fill="'+this.fill+'" />\r\n';
}
}
class Ellipse extends Shape{
	constructor(w, h) {
		super(0,0, w, h, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Ellipse");		
		this.ellipse=new d2.Ellipse(new d2.Point(0,0),w,h);
		//this.ellipse.rotate(60);
		this.selectionRectWidth=4;
		this.fillColor='#000000';	
	}
	clone(){
		var copy = new Ellipse(this.ellipse.w,this.ellipse.h);
		copy.ellipse=this.ellipse.clone();
		copy.thickness=this.thickness;
		copy.fill=this.fill;
		return copy;
	}
    alignResizingPointToGrid(point) {

    }	
    getClickableOrder() {        
        return this.getBoundingShape().area;
    }	
	calculateShape() {
		return this.ellipse.box;		
	}
	getCenter() {
	    return this.ellipse.pc;
	}
	isClicked(x, y) {		
		if(this.fill==core.Fill.EMPTY) {    	  
		  return this.ellipse.isPointOn(new d2.Point(x, y),this.thickness);
    	}else {    		
    	  return this.ellipse.contains(x, y);	
    	}
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
	move(xoffset,yoffset) {
        this.ellipse.move(xoffset, yoffset);
    }
    mirror(line){
       this.ellipse.mirror(line);	
    }
    rotate(rotation){			   
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

		let e=this.ellipse.clone();	
		e.scale(scale.getScale());
        e.move(-viewportWindow.x,- viewportWindow.y);
		e.paint(g2);
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "#808080";
			} else {
				g2.strokeStyle = this.fillColor;
			}
			e.paint(g2);
		}else if(this.fill == core.Fill.GRADIENT){ 
		  g2._fill=true;		  
		  var grd = g2.createLinearGradient(e.box.x,e.box.y, e.box.max.x,e.box.max.y);
		  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
		  grd.addColorStop(1, "white");
		  g2.fillStyle = grd;
		  e.paint(g2);
		  g2._fill=false;
          g2.strokeStyle=(this.selection?"#808080":this.fillColor);
          e.paint(g2);
		}else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "#808080";
			} else {
				g2.fillStyle = this.fillColor;
			}			
			e.paint(g2);
			g2._fill=false;
		} 
		
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
fromXML(data) {
    if(j$(data).attr("width")!=undefined){
        let x=(parseFloat(j$(data).attr("x")));
        let y=(parseFloat(j$(data).attr("y")));
        this.ellipse.pc.set(x,y);
        this.ellipse.w=parseFloat(j$(data).attr("width"));
        this.ellipse.h=parseFloat(j$(data).attr("height"));  
        this.thickness=(parseInt(j$(data).attr("thickness")));
        this.fill=parseInt(j$(data).attr("fill"));  
        this.fill=(this.fill==0?1:this.fill);
    }else{			
    	var tokens = data.textContent.split(",");
    	let x=parseInt(tokens[0]);
    	let y=parseInt(tokens[1]);
    	let w=parseInt(tokens[2]);
    	let h=parseInt(tokens[3]);
    	this.ellipse.pc.set(x+w/2,y+h/2);
    	this.ellipse.w=w/2;
    	this.ellipse.h=h/2;
    	this.thickness=parseInt(tokens[4]);	
    }
    
}
toXML() {
    return "<ellipse x=\""+utilities.roundFloat(this.ellipse.pc.x,1)+"\" y=\""+utilities.roundFloat(this.ellipse.pc.y,1)+"\" width=\""+utilities.roundFloat(this.ellipse.w,1)+"\" height=\""+utilities.roundFloat(this.ellipse.h,1)+"\" thickness=\""+this.thickness+"\" fill=\""+this.fill+"\"/>\r\n";
}
}


class RoundRect extends Shape{
	constructor(x, y, width, height,arc,thickness) {
		super(x, y, width, height, thickness,core.Layer.LAYER_ALL);
		this.setDisplayName("Rect");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='#000000';
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone(){
		var copy = new RoundRect(this.x,this.y,this.width,this.height,0,this.thickness);
		copy.roundRect = this.roundRect.clone();		
		copy.fill = this.fill;		
		return copy;
	}
    getClickableOrder() {        
        return this.getBoundingShape().area;
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
	    return box.center;
	}
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}	
	isClicked(x, y) {
		if(this.fill==core.Fill.EMPTY) { 		
		 return this.roundRect.isPointOn(new d2.Point(x, y),this.thickness);
		}else{
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
	rotate(rotation){		
		this.roundRect.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}
    mirror(line){
    	this.roundRect.mirror(line);
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
		

		let r=this.roundRect.clone();	
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "#808080";
			} else {
				g2.strokeStyle = this.fillColor;
			}
			r.paint(g2);
		}else if(this.fill == core.Fill.GRADIENT){ 
		  
		  g2.globalAlpha=0.5;	
		  g2._fill=true;		  
		  var grd = g2.createLinearGradient(r.box.x,r.box.y, r.box.max.x,r.box.max.y);
		  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
		  grd.addColorStop(1, "white");
		  g2.fillStyle = grd;
		  r.paint(g2);
		  g2._fill=false;
          g2.strokeStyle=(this.selection?"#808080":this.fillColor);
          r.paint(g2);
          g2.globalAlpha=1;
		}else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "#808080";
			} else {
				g2.fillStyle = this.fillColor;
			}			
			r.paint(g2);
			g2._fill=false;
		}        
        
		
		
		
		

		if (this.isSelected()&&this.isControlPointVisible) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}	
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.roundRect.vertices); 		
}	
fromXML(data){
    if(j$(data).attr("points")!=undefined){                
        this.roundRect.rounding=(parseInt(j$(data).attr("arc")));
        var tokens = j$(data).attr("points").split(",");
 	    var len = Math.floor(tokens.length / 2) * 2;
 	    var points=[]
	    for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			points.push(new d2.Point(x, y));
	    }   
 	   this.roundRect.setPoints(points);
        this.thickness=(parseInt(j$(data).attr("thickness")));
        this.fill=parseInt(j$(data).attr("fill"));  
        this.fill=(this.fill==0?1:this.fill);
    }else{
	 var tokens = data.textContent.split(",");
	 this.roundRect.setRect(parseInt(tokens[0]),parseInt(tokens[1]),parseInt(tokens[2]),parseInt(tokens[3]));
	    
     this.thickness=(parseInt(tokens[4]));
     this.fill=parseInt(tokens[5]); 
	 this.roundRect.setRounding(parseInt(tokens[6]));
	}
}
toXML() {
	let box=this.roundRect.box;
    return "<rectangle>"+ utilities.roundFloat(box.min.x,1)+","+ utilities.roundFloat(box.min.y,1)+","+ utilities.roundFloat(box.width,1)+","+ utilities.roundFloat(box.height,1)+","+this.thickness+","+this.fill +","+this.roundRect.rounding+"</rectangle>\r\n";
}
}
class ArrowLine extends Shape{
	constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Arrow");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='#000000';	
	    this.line=new d2.Segment(0,0,20,20);
	    this.arrow=new d2.Polygon();
	    this.arrow.points=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)];
	    this.headSize;	    
	    this.setHeadSize(3);
}
clone(){
    var copy=new ArrowLine();
    copy.headSize=this.headSize;
    copy.fill=this.fill;
    copy.thinkness=this.thickness;
    copy.line=this.line.clone();
    copy.arrow=this.arrow.clone();    
    return copy;
}
calculateShape() {
	return this.line.box;		
}
getClickableOrder() {        
    return 4;
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
rotate(rotation){		
	this.arrow.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	this.line.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
}
move(xoffset, yoffset) {
	this.line.move(xoffset,yoffset);
	this.arrow.move(xoffset,yoffset);
}
mirror(line){
	this.line.mirror(line);
	this.arrow.mirror(line);
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.line.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth = this.thickness * scale.getScale();

	if (this.selection) {
		g2.strokeStyle = "#808080";
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
			g2.strokeStyle = "#808080";
		} else {
			g2.strokeStyle = this.fillColor;
		}
	} else {
		g2._fill=true;
		if (this.selection) {
			g2.fillStyle = "#808080";
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
fromXML(data) { 	
	if(j$(data).attr("thickness")){
		var tokens = data.textContent.split(",");	
		this.line.ps.set(parseInt(tokens[0]),parseInt(tokens[1]));	
		this.line.pe.set(parseInt(tokens[2]),parseInt(tokens[3]));
		this.thickness= parseInt(j$(data).attr("thickness"));
		this.fill=parseInt(j$(data).attr("fill"));
		this.setHeadSize(parseInt(j$(data).attr("head")));		
	}else{
		var tokens = data.textContent.split(",");	
		this.line.ps.set(parseInt(tokens[0]),parseInt(tokens[1]));	
		this.line.pe.set(parseInt(tokens[2]),parseInt(tokens[3]));
		this.thickness=parseInt(tokens[4]);
		this.setHeadSize(parseInt(tokens[5]));
		this.fill=parseInt(tokens[6]);
	}
}
toXML(){
    return "<arrow thickness=\"" + this.thickness + "\" fill=\"" + this.fill + "\"  head=\"" + this.headSize+ "\">" + utilities.roundFloat(this.line.ps.x,1) + "," + utilities.roundFloat(this.line.ps.y,1) + "," + utilities.roundFloat(this.line.pe.x,1) + "," + utilities.roundFloat(this.line.pe.y,1) + "</arrow>\r\n";	
}
}
class Triangle extends Shape{
	constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Triangle");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='#000000';
	    this.shape=new d2.Polygon();
	    this.shape.points=[new d2.Point(0,0),new d2.Point(20,20),new d2.Point(0,40)];	    	    	    
}
clone(){
    var copy=new Triangle();
    copy.shape=this.shape.clone();  
    copy.fill = this.fill;
    return copy;
}
getClickableOrder() {        
    return this.getBoundingShape().area;
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
  if(this.fill==core.Fill.EMPTY) { 
	return this.shape.isPointOn({"x":x,"y":y},this.thickness<4?4:this.thickness);
  }else{
	return this.shape.contains({"x":x,"y":y});
  }	
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
rotate(rotation){		
	this.shape.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
}
move(xoffset, yoffset) {
	this.shape.move(xoffset,yoffset);	
}
mirror(line){
	this.shape.mirror(line);
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.shape.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth = this.thickness * scale.getScale();
	let a=this.shape.clone();	
	a.scale(scale.getScale());
    a.move(-viewportWindow.x,- viewportWindow.y);
	a.paint(g2);
	if (this.fill == core.Fill.EMPTY) {
		if (this.selection) {
			g2.strokeStyle = "#808080";
		} else {
			g2.strokeStyle = this.fillColor;
		}
		a.paint(g2);
	}else if(this.fill == core.Fill.GRADIENT){ 
	  g2._fill=true;		  
	  var grd = g2.createLinearGradient(a.box.x,a.box.y, a.box.max.x,a.box.max.y);
	  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
	  grd.addColorStop(1, "white");
	  g2.fillStyle = grd;
	  a.paint(g2);
	  g2._fill=false;
      g2.strokeStyle=(this.selection?"#808080":this.fillColor);
      a.paint(g2);
	}else {
		g2._fill=true;
		if (this.selection) {
			g2.fillStyle = "#808080";
		} else {
			g2.fillStyle = this.fillColor;
		}			
		a.paint(g2);
		g2._fill=false;
	} 

	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}
//***old schema
//DIRECTION_WEST = 0x01;
//DIRECTION_NORTH = 0x02;
//DIRECTION_EAST = 0x04;
//DIRECTION_SOUTH = 0x08;
initPoints(orientation,x,y,width,height){     
    if(orientation==0x01){   
    	this.shape.points[0].set(x,y+height/2);        
    	this.shape.points[1].set(x+width,y);    	
    	this.shape.points[2].set(x+width,y+height);    	       
    }else if(orientation==0x02){    	
    	this.shape.points[0].set(x+width/2, y);
    	this.shape.points[1].set(x+width, y+height);
    	this.shape.points[2].set(x, y+height);            
    }else if(orientation==0x04){                  
    	this.shape.points[0].set(x+width,y+height/2);
    	this.shape.points[1].set(x,y+height);
    	this.shape.points[2].set(x,y);            
    }else{      
    	this.shape.points[0].set(x+width/2,y+height);
    	this.shape.points[1].set(x,y);
    	this.shape.points[2].set(x+width,y);
      
    }
    
}
fromXML(data){
	if(j$(data).attr("thickness")){
		this.thickness=parseInt(j$(data).attr("thickness"));
		this.fill=parseInt(j$(data).attr("fill"));
		var tokens = data.textContent.split(",");		
		    	
		this.shape.points[0].set(parseFloat(tokens[0]),parseFloat(tokens[1]));
		this.shape.points[1].set(parseFloat(tokens[2]),parseFloat(tokens[3]));
		this.shape.points[2].set(parseFloat(tokens[4]),parseFloat(tokens[5]));
	}else{
		var tokens = data.textContent.split(",");	
        var orientation=parseInt(tokens[0]);
        this.initPoints(orientation,parseFloat(tokens[1]),parseFloat(tokens[2]),parseFloat(tokens[3]),parseFloat(tokens[4]));           
        this.thickness=parseInt(tokens[5]);
        this.fill=parseInt(tokens[6]);   		
	}
    
}
toXML(){
	let points="";
	this.shape.points.forEach(function(point) {
	   points += utilities.roundFloat(point.x,1) + "," + utilities.roundFloat(point.y,1) + ",";
	});	
    return "<triangle thickness=\"" + this.thickness + "\" fill=\"" + this.fill + "\">"+points+"</triangle>\r\n";	
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
mirror:function(isHorizontal,orientation){
    if (isHorizontal) {
        if (orientation == Orientation.EAST)
            return Orientation.WEST;
        else if (orientation == Orientation.WEST)
            return Orientation.EAST;
        else
            return orientation;
    } else {
        if (orientation == Orientation.NORTH)
            return Orientation.SOUTH;
        else if (orientation == Orientation.SOUTH)
            return Orientation.NORTH;
        else
            return orientation;
    }	
},      
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
};
var PIN_LENGTH = 2 * utilities.POINT_TO_POINT;

class Pin extends Shape{
constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Pin");		
		this.selectionRectWidth=4;
		this.fillColor='#000000';
	    this.segment=new d2.Segment(0,0,0,0);        
        this.type = PinType.COMPLEX;
        this.style = Style.LINE;

 	    this.name=new font.SymbolFontTexture("XXX","name",-8,2,0,8);
	    this.number=new font.SymbolFontTexture("1","number",10,-1,0,8);
	    this.init(Orientation.EAST);
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
    this.move(point.x - center.x,point.y - center.y);
    return new d2.Point(point.x - center.x, point.y - center.y);  
}
getClickableOrder() {        
    return 1;
}
getClickedTexture(x,y) {
	if(this.type==PinType.SIMPLE){
		return null;
	}
    if(this.name.isClicked(x, y))
        return this.name;
    else if(this.number.isClicked(x, y))
        return this.number;
    else
    return null;
}
getPinPoint(){
	return this.segment.ps;
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
mirror(line){	
  let pinorientation=this.segment.isHorizontal?TextOrientation.HORIZONTAL:TextOrientation.VERTICAL;
  
  let oposname= utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
  let oposnumber= utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	
  
  let oalignmentname=TextAlignment.getOrientation(this.name.shape.alignment);
  let alignmentname=this.name.shape.alignment;
  let oalignmentnumber=TextAlignment.getOrientation(this.number.shape.alignment);
  let alignmentnumber=this.number.shape.alignment;
	
  this.segment.mirror(line);	
  if(line.isVertical){ //left-right 	 	  
	  this.orientation = Orientation.mirror(true,this.orientation);	  
  }else{	  
	  this.orientation = Orientation.mirror(false,this.orientation);
  }	
  this.name.mirror(line);
  this.number.mirror(line);
  
  if(oalignmentname!=pinorientation){  //pin and text different orientation
	  this.__normalizeText(this.name, alignmentname, line.isVertical);
  }else{
	  let nposname=utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);  
	  this.normalizeText(this.name,oposname,nposname);
  }
  
  if(oalignmentnumber!=pinorientation){  //pin and text different orientation
	  this.__normalizeText(this.number, alignmentnumber, line.isVertical); 
  }else{
	  let nposnumber=utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);  
	  this.normalizeText(this.number,oposnumber,nposnumber);  
  }

}

rotate(rotation){
	let pinorientation=this.segment.isHorizontal?TextOrientation.HORIZONTAL:TextOrientation.VERTICAL;
	
	//read current position	
	let oposname= utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	let oposnumber= utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	
	let oalignmentname=TextAlignment.getOrientation(this.name.shape.alignment);
	let alignmentname=this.name.shape.alignment;
	let oalignmentnumber=TextAlignment.getOrientation(this.number.shape.alignment);
	let alignmentnumber=this.number.shape.alignment;
	
	this.segment.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	this.orientation=Orientation.rotate(rotation.angle>0?false:true,this.orientation);
	this.name.rotate(rotation);
	this.number.rotate(rotation);
	
    if(oalignmentname!=pinorientation){  //pin and text different orientation
        this._normalizeText(this.name,oalignmentname, rotation.angle);  
    }else{  //pin and text same orientation
      //read new position
    	let nposname=utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);   
    	this.normalizeText(this.name,oposname,nposname);            
    }

    if(oalignmentnumber!=pinorientation){  //pin and text different orientation
        this._normalizeText(this.number,oalignmentnumber, rotation.angle);  
    }else{  //pin and text same orientation

    	let nposnumber=utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);    	
    	this.normalizeText(this.number,oposnumber,nposnumber);
    }    
	
	
}
normalizeText(text,opos,npos){
	if(opos==npos){
	   return;	
	}
	text.mirror(new d2.Line(this.segment.ps,this.segment.pe));
}
//pin and text have different orientation
_normalizeText(text,orientation,angle){
    if(angle<0){  //clockwise              
        if(orientation == TextOrientation.HORIZONTAL){
            text.shape.anchorPoint.set(text.shape.anchorPoint.x+(text.shape.metrics.ascent-text.shape.metrics.descent),text.shape.anchorPoint.y);            
        }
    }else{                   
        if(orientation == TextOrientation.VERTICAL){
            text.shape.anchorPoint.set(text.shape.anchorPoint.x,text.shape.anchorPoint.y+(text.shape.metrics.ascent-text.shape.metrics.descent));                   
        }
    }
}
//pin and text have different orientation
__normalizeText(text, alignment, isVertical){
    if (isVertical) { //right-left mirroring
        if (text.shape.alignment == alignment) {
            text.shape.anchorPoint.set(text.shape.anchorPoint.x +
                                    (text.shape.metrics.ascent - text.shape.metrics.descent),text.shape.anchorPoint.y);
        }
    } else { //***top-botom mirroring          
        if (text.shape.alignment == alignment) {
            text.shape.anchorPoint.set(text.shape.anchorPoint.x,text.shape.anchorPoint.y +(text.shape.metrics.ascent - text.shape.metrics.descent));
        }
    }  
}
move(xoffset,yoffset) {
    this.segment.move(xoffset,yoffset);
	this.name.move(xoffset,yoffset);
	this.number.move(xoffset,yoffset);
}
calculateShape() {
	return this.segment.box;
}
/*
 * keep text orientation too, observing text normalization
 */
setOrientation(orientation){
 let o=this.orientation;
 let r={originx:this.segment.ps.x,
	       originy:this.segment.ps.y,
	       angle:-90};
 
 while(o!=orientation){
	 switch (o) {
	 case Orientation.EAST:        
		 //o=Orientation.SOUTH;
		 this.rotate(r);
     break;
	 case Orientation.WEST:
		 //o=Orientation.NORTH;
		 this.rotate(r);
     break;
	 case Orientation.NORTH:
		 //o=Orientation.EAST;
		 this.rotate(r);
     break;
	 case Orientation.SOUTH:    	
		 //o=Orientation.WEST;
		 this.rotate(r);
  
	 }
	 o=this.orientation; 
 }
}

init(orientation){
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
setPinType(type){
	this.type=type;
	this.init(this.orientation);
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
		g2.strokeStyle = "#0000ff";
	  	this.name.fillColor = "#808080";
	  	this.number.fillColor = "#808080";
	} else {
		g2.strokeStyle = this.fillColor;
	  	this.name.fillColor = this.fillColor;
		this.number.fillColor =this.fillColor;
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
	if (this.type == PinType.COMPLEX) {		  
      this.name.paint(g2, viewportWindow, scale);
      this.number.paint(g2, viewportWindow, scale);
	}
    if (this.isSelected()) {
        let c=new d2.Circle(this.segment.pe.clone(), 2);
        c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
        c.paint(g2,false);        
    }
}
fromXML(data){
	this.type=parseInt(j$(data).attr("type"));
	if(j$(data).attr("style")){
	  this.style=parseInt(j$(data).attr("style"));
	}else{
	  this.style=0;		
	}
	let a=j$(data).find("a");
	if(a.length>0){   //old schema
	  var tokens = a.text().split(",");
	  this.segment.ps.set(parseFloat(tokens[0]),parseFloat(tokens[1]));
	  this.init(parseInt(tokens[3]));
	}else{
        this.segment.ps.set(parseFloat(j$(data).attr("x")),parseFloat(j$(data).attr("y")));   
        this.init(parseInt(j$(data).attr("orientation")));	
	}
    var number=(j$(data).find("number").text()); 
	var name=(j$(data).find("name").text());
	if(number==''){
	  this.number.setText('');
	  this.number.shape.anchorPoint.set(this.segment.ps.x,this.segment.ps.y);
	}else{
	  this.number.fromXML(number);
	}
	if(name==''){
	  this.name.setText('');
	  this.name.shape.anchorPoint.set(this.segment.ps.x,this.segment.ps.y);
	}else{
	  this.name.fromXML(name);
	}	
}
toXML(){
	let xml="<pin type=\"" + this.type + "\"  style=\"" + this.style + "\"   x=\""+utilities.roundFloat(this.segment.ps.x,1)+"\" y=\""+utilities.roundFloat(this.segment.ps.y,1)+"\" orientation=\""+this.orientation+"\">\r\n";	
    if(this.type == PinType.COMPLEX){
	 if (!this.number.isEmpty())
    	xml+="<number>" +
                  this.number.toXML() +
             "</number>\r\n";
     if (!this.name.isEmpty())
       xml+="<name>" +
                  this.name.toXML() +
             "</name>\r\n";	
    }
	xml+="</pin>";
	return xml;
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
		PIN_LENGTH,
		Orientation,
		SymbolShapeFactory
	}