var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/core').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var glyph=require('core/text/glyph');
var font=require('core/text/font');

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
    return new core.Point(this.texture.getBoundingShape().getCenterX(),this.texture.getBoundingShape().getCenterY());
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
class RoundRect extends ResizeableShape{
	constructor(x, y, width, height, arc,thickness,layermaskid) {
		super(x, y, width, height, thickness,layermaskid);
		this.setDisplayName("Rect");
		this.arc = arc;
		this.selectionRectWidth=3000;
		this.roundRect = new core.Rectangle(0, 0, 0, 0);
	}
	clone() {
		var copy = new RoundRect(this.getX(), this
				.getY(), this.getWidth(), this.getHeight(), this.arc,
				this.thickness,this.copper.getLayerMaskID());
		copy.roundRect = new core.Rectangle(this.roundRect.x,
				this.roundRect.y, this.roundRect.width, this.roundRect.height);
		copy.fill = this.fill;
		copy.arc=this.arc;
		return copy;
	}
	calculateShape() {
		return new core.Rectangle(this.getX(), this.getY(), this
				.getWidth(), this.getHeight());

	}
	isClicked(x, y) {
		this.roundRect.setRect(this.getX(), this.getY(), this.getWidth(), this
				.getHeight());
		if (this.roundRect.contains(x, y))
			return true;
		else
			return false;
	}
	toXML() {
		return "<rectangle copper=\"" + this.copper.getName() + "\" x=\""
				+ this.upperLeft.x + "\" y=\"" + this.upperLeft.y
				+ "\" width=\"" + this.getWidth() + "\" height=\""
				+ this.getHeight() + "\" thickness=\"" + this.thickness
				+ "\" fill=\"" + this.fill + "\" arc=\"" + this.arc
				+ "\"/>";
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
		var rect = this.getBoundingShape().getScaledRect(scale);
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		g2.globalCompositeOperation = 'lighter';
		g2.beginPath();
		utilities.roundrect(g2, rect.x - viewportWindow.x, rect.y
				- viewportWindow.y, rect.width, rect.height, this.arc
				* scale.getScale());
		g2.closePath();
		g2.lineWidth = this.thickness * scale.getScale();
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}

			g2.stroke();
		} else {
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}
			g2.fill();
		}

		g2.globalCompositeOperation = 'source-over';

		if (this.isSelected()) {
			this.drawControlShape(g2, viewportWindow, scale);
		}
	}

}

class Circle extends Shape{
	constructor(x,y,r,thickness,layermaskId) {
		super(x, y, r, r, thickness,
				layermaskId);
		this.setDisplayName("Circle");
		this.selectionRectWidth=3000;
	}
	clone() {
		var copy =new Circle(this.x,this.y,this.width,this.thickness,this.copper.getLayerMaskID());
		return copy;
	}	
calculateShape(){    
	return new core.Rectangle(this.getX()-this.getWidth(),this.getY()-this.getWidth(),2*this.getWidth(),2*this.getWidth());
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
isControlRectClicked(xx,yy) {
            let rect=new core.Rectangle();
			rect.setRect((this.x-this.width) - this.selectionRectWidth / 2, (this.y-this.width) - this.selectionRectWidth / 2,
                         this.selectionRectWidth, this.selectionRectWidth);
            if (rect.contains(xx,yy)) {
                return new core.Point((this.x-this.width),(this.y-this.width));
            }
            rect.setRect((this.x+this.width) - this.selectionRectWidth / 2, (this.y-this.width) - this.selectionRectWidth / 2,
                         this.selectionRectWidth, this.selectionRectWidth);
            if (rect.contains(xx,yy)){
                return new core.Point((this.x+this.width),(this.y-this.width));
            }
            rect.setRect((this.x-this.width) - this.selectionRectWidth / 2, (this.y+this.width) - this.selectionRectWidth / 2,
                         this.selectionRectWidth, this.selectionRectWidth);
            if (rect.contains(xx,yy)){
                return new core.Point((this.x-this.width),(this.y+this.width));
            }

            rect.setRect((this.x+this.width) - this.selectionRectWidth / 2, (this.y+this.width) - this.selectionRectWidth / 2,
                         this.selectionRectWidth, this.selectionRectWidth);
            if (rect.contains(xx,yy)){
                return new core.Point((this.x+this.width),(this.y+this.width));
            }

        return null;
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
	Paint(g2, viewportWindow, scale) {
		let rect = this.getBoundingShape().getScaledRect(scale);
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		// ****3 http://scienceprimer.com/draw-oval-html5-canvas
		g2.globalCompositeOperation = 'lighter';
		g2.beginPath(); // clear the canvas context
		g2.arc(rect.getCenterX() - viewportWindow.x,rect.getCenterY() - viewportWindow.y,rect.width/2,0,2*Math.PI);
		
		g2.closePath();
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}

			g2.stroke();
		} else {
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}
			g2.fill();
		}

		g2.globalCompositeOperation = 'source-over';

		if (this.isSelected()) {
			this.drawControlShape(g2, viewportWindow, scale);
  } 
 }
drawControlShape(g2, viewportWindow, scale) {

        let line=new core.Line();

        g2.strokeStyle='blue';
		g2.lineWidth = 1;
        
        //top
            line.setLine((this.getX()-this.getWidth()) - this.selectionRectWidth,this.getY()-this.getWidth(), (this.getX()-this.getWidth()) + this.selectionRectWidth, this.getY()-this.getWidth());
            line.draw(g2, viewportWindow, scale);

            line.setLine((this.getX()-this.getWidth()), this.getY()-this.getWidth() - this.selectionRectWidth, (this.getX()-this.getWidth()), this.getY()-this.getWidth() + this.selectionRectWidth);
            line.draw(g2, viewportWindow, scale);
        
            line.setLine((this.getX()+this.getWidth()) - this.selectionRectWidth, this.getY()-this.getWidth(), (this.getX()+this.getWidth()) + this.selectionRectWidth, this.getY()-this.getWidth());
            line.draw( g2, viewportWindow, scale);

            line.setLine((this.getX()+this.getWidth()), this.getY()-this.getWidth() - this.selectionRectWidth, (this.getX()+this.getWidth()), this.getY()-this.getWidth() + this.selectionRectWidth);
            line.draw(g2, viewportWindow, scale);
        //bottom
            line.setLine((this.getX()-this.getWidth()) - this.selectionRectWidth, this.getY()+this.getWidth(), (this.getX()-this.getWidth()) + this.selectionRectWidth, this.getY()+this.getWidth());
            line.draw(g2, viewportWindow, scale);

            line.setLine((this.getX()-this.getWidth()), this.getY()+this.getWidth() - this.selectionRectWidth, (this.getX()-this.getWidth()), this.getY()+this.getWidth() + this.selectionRectWidth);
            line.draw(g2, viewportWindow, scale);
        
            line.setLine((this.getX()+this.getWidth()) - this.selectionRectWidth, this.getY()+this.getWidth(), (this.getX()+this.getWidth()) + this.selectionRectWidth, this.getY()+this.getWidth());
            line.draw( g2, viewportWindow, scale);

            line.setLine((this.getX()+this.getWidth()), this.getY()+this.getWidth() - this.selectionRectWidth, (this.getX()+this.getWidth()), this.getY()+this.getWidth() + this.selectionRectWidth);
            line.draw(g2, viewportWindow, scale);
      
//center
//            line.setLine((this.getX()) - this.selectionRectWidth, this.getY(), (this.getX()) + this.selectionRectWidth, this.getY());
//            line.draw( g2, viewportWindow, scale);
//
//            line.setLine((this.getX()), this.getY() - this.selectionRectWidth, this.getX(), this.getY() + this.selectionRectWidth);
//            line.draw( g2, viewportWindow, scale);

       
}
getOrderWeight(){
      return ((2*this.width)*(2*this.width)); 
}
getResizingPoint() {
        return null;
}

setResizingPoint(point) {

}
Resize(xoffset, yoffset,point) {    
        let quadrant= utilities.getQuadrantLocation(point,this.x,this.y);
        switch(quadrant){
        case utilities.QUADRANT.FIRST:case utilities.QUADRANT.FORTH: 
            //uright
             if(xoffset<0){
               //grows             
                this.width+=Math.abs(xoffset);
             }else{
               //shrinks
                this.width-=Math.abs(xoffset);
             }             
            break;
        case utilities.QUADRANT.SECOND:case utilities.QUADRANT.THIRD:
            //uleft
             if(xoffset<0){
               //shrinks             
                this.width-=Math.abs(xoffset);
             }else{
               //grows
                this.width+=Math.abs(xoffset);
             }             
            break;        
        }

    }	
}
class Arc extends Circle{
constructor(x,y,r,thickness,layermaskid){	
        super(x, y, r,thickness,layermaskid);  
        this.startAngle=30;
        this.extendAngle=50;
		this.setDisplayName("Arc");
		this.resizingPoint=null;
}
clone() {
		var copy = new Arc(this.x, this.y, this.width,
						this.thickness,this.copper.getLayerMaskID());
		copy.startAngle = this.startAngle;
		copy.extendAngle = this.extendAngle;
		copy.fill = this.fill;
		return copy;
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
    this.extendAngle=utilities.round(extendAngle);
}
setStartAngle(startAngle){        
    this.startAngle=utilities.round(startAngle);
}
isControlRectClicked(x,y) {
   let result= super.isControlRectClicked(x, y);
   if(result==null){
	 if(this.isStartAnglePointClicked(x,y)){
	    return this.getStartPoint();
	 }
	 if(this.isExtendAnglePointClicked(x,y)){
	    return this.getEndPoint();
	 }
	 if(this.isMidPointClicked(x,y)){
	    return this.getMidPoint();	 
	 }
     return null;	 
   }else{
     return result;
   }
   
}
isMidPointClicked(x,y){
	let rect=new core.Rectangle();

    let p=this.getMidPoint();
    rect.setRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                 this.selectionRectWidth, this.selectionRectWidth);
    if (rect.contains(x,y)) {
        return true;
    }else{                   
        return false;
	}	
}
isStartAnglePointClicked(x,y){
			let rect=new core.Rectangle();

            let p=this.getStartPoint();
            rect.setRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                         this.selectionRectWidth, this.selectionRectWidth);
            if (rect.contains(x,y)) {
                return true;
            }else{                   
                return false;
			}
}
isExtendAnglePointClicked(x,y){
			let rect=new core.Rectangle();
            
            let  p=this.getEndPoint();
            rect.setRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                         this.selectionRectWidth, this.selectionRectWidth);
            if (rect.contains(x,y)) {
                return true;
            }else{                   
                return false;
			}
}	
convert(start,extend){
		
		let s = 360 - start;
		let e=0;
		if(extend>0){
		 e = 360 - (start+extend); 
		}else{
		 if(start>Math.abs(extend)){  	
		   e = s+Math.abs(extend); 
		 }else{
           e = Math.abs(extend+start);   		 
		 }		 
		}
		return new core.Point(s,e);
}
recalculateArc(isClockwise){
	let resizingMidPoint=this.calculateResizingMidPoint();
	this.drawRadius();

}
calculateResizingMidPoint(){
	let a=this.getMidPoint();
	let b=new core.Point(this.x,this.y);
	let p=this.resizingPoint;
	
	let atob = { x: b.x - a.x, y: b.y - a.y };
    let atop = { x: p.x - a.x, y: p.y - a.y };
    let len = atob.x * atob.x + atob.y * atob.y;
    let dot = atop.x * atob.x + atop.y * atob.y;
    let t = dot / len ;
  
    return new core.Point(a.x + atob.x * t,a.y + atob.y * t);	
}

drawMousePoint(g2,viewportWindow,scale){

	let point=this.calculateResizingMidPoint();
    
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[point]);
    
    //this.drawRadius(g2,viewportWindow,scale);
}

distance(p1,p2){
	   let dx=(p1.x-p2.x);
	   let dy=(p1.y-p2.y);
	   return Math.sqrt(dx*dx + dy*dy);	
}
/*
 * draw current radius static
 */
drawRadius(){
   let a=this.getStartPoint();
   let b=this.getEndPoint();
  
   let P=new core.Point((a.x+b.x)/2,(a.y+b.y)/2);
   
   
   //distance
   let m=this.distance(a,P);
   let q=this.distance(a,b);
  
   let midP=this.getMidPoint();
   let A=this.distance(midP,P);

   //radius
   let R=((m*m)+(A*A))/(2*A);
   
   
   //calculate centeX and centerY
   let basex = Math.sqrt(Math.pow(R,2)-Math.pow(m,2))*((a.y-b.y)/q); //calculate once
   let basey = Math.sqrt(Math.pow(R,2)-Math.pow(m,2))*((b.x-a.x)/q); //calculate once   
   
   let cX=basex+P.x;
   let cY=basey+P.y;
   let C1=new core.Point(cX,cY);
   
   
    cX=P.x-basex;
    cY=P.y-basey;
    let C2=new core.Point(cX,cY);
    
     
    
  
    //which of the 2 points is correct
    let dist1=Math.round(this.distance(midP,C1));
    let dist2=Math.round(this.distance(midP,C2));
    

    if(Math.round(R)==dist1){
    	//utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[C1]);
    	let startAngle = (180/Math.PI*Math.atan2(a.y-C1.y, a.x-C1.x));    	    	
    	
    	if(-180<startAngle&&startAngle<0){
    		startAngle=Math.abs(startAngle);
    	}else if(0<startAngle&&startAngle<=180){
    		startAngle=360-startAngle;
    	}
    	
    	let endAngle =  (180/Math.PI*Math.atan2(b.y-C1.y, b.x-C1.x));
    	
    	console.log(startAngle+' -------------- '+endAngle);
    	
    }else{
    	//utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[C2]);
    	let startAngle = (180/Math.PI*Math.atan2(a.y-C2.y, a.x-C2.x));
    	if(-180<startAngle&&startAngle<0){
    		startAngle=Math.abs(startAngle);
    	}else{
    		startAngle=360-startAngle;
    	}
    	let endAngle =  (180/Math.PI*Math.atan2(b.y-C2.y, b.x-C2.x));
    	console.log(endAngle);
    	if(-180<endAngle&&endAngle<0){
    		endAngle=Math.abs(endAngle);
    	}else{
    		endAngle=(360-endAngle);
    	}
    	
    	
    	
    	console.log(startAngle+' ++++++ '+endAngle);
    	

    }
    
    
}
Rotate(rotation){
   super.Rotate(rotation);
   if(rotation.angle>0) {        //right                               
       if((this.startAngle-90)<0){
          this.startAngle=360-(90-this.startAngle); 
       }else{
          this.startAngle+=-90;   
       }                                 
   }else{                          //left                                
       if((this.startAngle+90)>360){
         this.startAngle=90-(360-this.startAngle);
       }else{
         this.startAngle+=90; 
       }             
   } 
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
Paint(g2, viewportWindow, scale) {
		
		var rect = this.getBoundingShape().getScaledRect(scale);
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		// ****3 http://scienceprimer.com/draw-oval-html5-canvas
		g2.globalCompositeOperation = 'lighter';
		g2.beginPath(); // clear the canvas context
		g2.lineCap = 'round';
		/*
		convert to API angles
		*/
		let angles=this.convert(this.startAngle,this.extendAngle);
		
		g2.arc(rect.getCenterX() - viewportWindow.x, rect.getCenterY()
						- viewportWindow.y, rect.width / 2, utilities
						.radians(angles.x), utilities
						.radians(angles.y), this.extendAngle>0);
						
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
					g2.strokeStyle = "gray";
			} else {
					g2.strokeStyle = this.copper.getColor();
			}

				g2.stroke();
		} else {
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}
				g2.fill();
		}

				g2.globalCompositeOperation = 'source-over';

		if (this.isSelected()) {
			this.drawControlShape(g2, viewportWindow, scale);
			this.drawArcPoints(g2, viewportWindow, scale);
		}
		

        if(this.resizingPoint!=null){
		   this.drawMousePoint(g2,viewportWindow,scale);
        }
}

//find the point between start and end point
getMidPoint(){
    let r=this.getWidth();  
    let x = r * Math.cos(-Math.PI/180*(this.startAngle+(this.extendAngle/2))) + this.getX();
    let y = r * Math.sin(-Math.PI/180*(this.startAngle+(this.extendAngle/2))) + this.getY();
    return new core.Point(x,y);
}

getStartPoint() {
        let r=this.getWidth();                
        let x = r * Math.cos(-Math.PI/180*(this.startAngle)) + this.getX();
        let y = r * Math.sin(-Math.PI/180*(this.startAngle)) + this.getY();
        return new core.Point(x,y);
}
getEndPoint() {
        let r=this.getWidth();  
        let x = r * Math.cos(-Math.PI/180*(this.startAngle+this.extendAngle)) + this.getX();
        let y = r * Math.sin(-Math.PI/180*(this.startAngle+this.extendAngle)) + this.getY();
        return new core.Point(x,y);
}
drawArcPoints(g2, viewportWindow, scale){
        let start=this.getStartPoint();
        let end=this.getEndPoint();
		let mid=this.getMidPoint();
		
        let line=new core.Line();
        line.setLine(start.x - this.selectionRectWidth, start.y, start.x + this.selectionRectWidth, start.y);
        line.draw(g2, viewportWindow, scale);		
		
        line.setLine(start.x, start.y- this.selectionRectWidth, start.x , start.y+ this.selectionRectWidth);
        line.draw(g2, viewportWindow, scale);		
		
        line.setLine(end.x - this.selectionRectWidth, end.y, end.x + this.selectionRectWidth, end.y);
        line.draw(g2, viewportWindow, scale);		
		
        line.setLine(end.x, end.y- this.selectionRectWidth, end.x , end.y+ this.selectionRectWidth);
        line.draw(g2, viewportWindow, scale);    
        
        line.setLine(mid.x - this.selectionRectWidth, mid.y, mid.x + this.selectionRectWidth, mid.y);
        line.draw(g2, viewportWindow, scale);		
		
        line.setLine(mid.x, mid.y- this.selectionRectWidth, mid.x , mid.y+ this.selectionRectWidth);
        line.draw(g2, viewportWindow, scale);    

    }

}
/*
class Arc extends SquareResizableShape{
			constructor(x, y, width, height,
					thickness) {
				super(x, y, width, thickness,
						core.Layer.SILKSCREEN_LAYER_FRONT);
				this.startAngle = 30;
				this.extendAngle = 180;
				this.setDisplayName("Arc");
			}
			clone() {
				var copy = new Arc(this.owningUnit, this.getX(), this
						.getY(), this.getWidth(), this.getHeight(),
						this.thickness);
				copy.roundRect = new core.Rectangle(this.getX(), this
						.getY(), this.getWidth(), this.getWidth());
				copy.startAngle = this.startAngle;
				copy.extendAngle = this.extendAngle;
				copy.fill = this.fill;
				return copy;
			}
			calculateShapeCacheBounds() {
				return new core.Rectangle(this.getX(), this.getY(), this
						.getWidth(), this.getHeight());
			}
			isClicked(x, y) {
				var rect = this.getBoundingRect()
				if (rect.contains(x, y))
					return true;
				else
					return false;
			}
			Paint(g2, viewportWindow, scale) {
				var rect = this.getBoundingRect().getScaledRect(scale);
				if (!rect.intersects(viewportWindow)) {
					return;
				}
				// ****3 http://scienceprimer.com/draw-oval-html5-canvas
				g2.globalCompositeOperation = 'lighter';
				g2.beginPath(); // clear the canvas context
				g2.arc(rect.getCenterX() - viewportWindow.x, rect.getCenterY()
						- viewportWindow.y, rect.width / 2, mywebpcb.utilities
						.radians(this.startAngle), mywebpcb.utilities
						.radians(this.extendAngle), false);
				g2.lineWidth = this.thickness * scale.getScale();

				if (this.fill == mywebpcb.core.Fill.EMPTY) {
					if (this.selection) {
						g2.strokeStyle = "gray";
					} else {
						g2.strokeStyle = this.copper.getColor();
					}

					g2.stroke();
				} else {
					if (this.selection) {
						g2.fillStyle = "gray";
					} else {
						g2.fillStyle = this.copper.getColor();
					}
					g2.fill();
				}

				g2.globalCompositeOperation = 'source-over';

				if (this.isSelected()) {
					this.drawControlShape(g2, viewportWindow, scale);
				}
			}
			Rotate(rotation) {
				super.Rotate(rotation);
				var start = this.startAngle;
				if (rotation.angle > 0) { // right
					if ((this.extendAngle + 90) > 360) {
						this.startAngle = (this.startAngle + 90) - 360;
						this.extendAngle = (this.extendAngle - start)
								+ this.startAngle;
					} else {
						this.startAngle += 90;
						this.extendAngle += 90;
					}
				} else { // left
					if ((this.startAngle - 90) < 0
							&& (this.extendAngle - 90) > 0) {

					} else {
						this.startAngle -= 90;
						this.extendAngle -= 90;
					}
				}
			}
			toXML() {
				return "";
			}
			fromXML(data) {
				this.setX(parseInt(j$(data).attr("x")));
				this.setY(parseInt(j$(data).attr("y")));
				this.setWidth(parseInt(j$(data).attr("width")));
				var start = parseInt(j$(data).attr("start"));
				var extend = parseInt(j$(data).attr("extend"));
				this.startAngle = 360 - (start + extend);
				this.extendAngle = 360 - start;
				if (start < 0) {
					this.startAngle -= 360;
					this.extendAngle -= 360;
				}
				this.thickness = (parseInt(j$(data).attr("thickness")));
				this.fill = parseInt(j$(data).attr("fill"));
			}

}
*/
class Line extends Shape{
constructor(thickness,layermaskId) {
			super(0, 0, 0, 0, thickness,layermaskId);
			this.selectionRectWidth = 3000;
			this.setDisplayName("Line");			
			this.points = [];
			this.floatingStartPoint = new core.Point(0, 0); // ***the
																				// last
																				// wire
																				// point
			this.floatingMidPoint = new core.Point(0, 0); // ***mid
																			// 90
																			// degree
																			// forming
			this.floatingEndPoint = new core.Point(0, 0);
}
getLinePoints(){
	return this.points;
}
Clear(){
	this.points=null;
}
clone() {
		var copy = new Line(this.thickness,this.copper.getLayerMaskID());
			for (var index = 0; index < this.points.length; index++) {
						copy.points.push(new core.Point(this.points[index].x,this.points[index].y));
			}
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
alignResizingPointToGrid(targetPoint) {
     this.owningUnit.grid.snapToGrid(targetPoint);         
}
isClicked(x, y) {
	  var result = false;
		// build testing rect
	  var rect = new core.Rectangle(x
								- (this.thickness / 2), y
								- (this.thickness / 2), this.thickness,
								this.thickness);
	  var r1 = new core.Point(rect.getMinX(), rect.getMinY());
	  var r2 = new core.Point(rect.getMaxX(), rect.getMaxY());

	  // ***make lines and iterate one by one
	  var prevPoint = this.points[0];

	  this.points.some(function(wirePoint) {
							// skip first point
							{
								if (utilities.intersectLineRectangle(
										prevPoint, wirePoint, r1, r2)) {
									result = true;
									return true;
								}
								prevPoint = wirePoint;
							}

						});

 	return result;
}

getResizingPoint() {
	return this.resizingPoint;
}
getOrderWeight() {
	return 2;
}
setResizingPoint(point) {
  this.resizingPoint = point;
}
resetToPoint(point) {
	this.floatingStartPoint.setLocationPoint(point);
	this.floatingMidPoint.setLocationPoint(point);
	this.floatingEndPoint.setLocationPoint(point);
}
reset() {
	this.resetToPoint(this.floatingStartPoint);
}
reverse(x,y) {
    let p=this.isBendingPointClicked(x, y);
    if (this.points[0].x == p.x &&
        this.points[0].y == p.y) {
    	this.points.reverse(); 
    }       
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.setLocation(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}

insertPoint( x, y) {
    
    let flag = false;
    let point = this.owningUnit.grid.positionOnGrid(x, y);

    var rect = new core.Rectangle(x - this.owningUnit.grid.getGridPointToPoint(),
                      y - this.owningUnit.grid.getGridPointToPoint() ,
                      2*this.owningUnit.grid.getGridPointToPoint(),
                      2*this.owningUnit.grid.getGridPointToPoint());

    let line = new core.Line();


    let tmp = new core.Point(point.x, point.y);
    let midium = new core.Point();

    //***add point to the end;
    this.points.push(point);

    let prev = this.points[0];
    this.points.forEach(function(next){
        if(prev!=next){
    	 if (!flag) {
            //***find where the point is - 2 points between the new one
            line.setLine(prev.x,prev.y, next.x,next.y);
            if (line.intersectRect(rect))
                flag = true;
         } else {
            midium.setLocationPoint(tmp); //midium.setPin(tmp.getPin());
            tmp.setLocationPoint(prev); //tmp.setPin(prev.getPin());
            prev.setLocationPoint(midium); //prev.setPin(midium.getPin());
         }
        }
        prev = next;
    });
    if (flag)
        prev.setLocationPoint(tmp); //prev.setPin(tmp.getPin());
}
removePoint(x, y) {
    let point = this.isBendingPointClicked(x, y);
    if (point != null) {
    	
    	var tempArr = this.points.filter(function(item) { 
    	    return item !== point;
    	});
        
    	this.points=tempArr;
    }
}
deleteLastPoint() {
	if (this.points.length == 0)
		return;

	this.points.pop();

						// ***reset floating start point
	if (this.points.length > 0)
					this.floatingStartPoint
									.setLocation(this.points[this.points.length - 1]);
}
isEndPoint(x,y){
    if (this.points.length< 2) {
        return false;
    }

    let point = this.isBendingPointClicked(x, y);
    if (point == null) {
        return false;
    }
    //***head point
    if (this.points[0].x == point.x && this.points[0].y == point.y) {
        return true;
    }
    //***tail point
    if ((this.points[this.points.length - 1].x == point.x )&& (this.points[this.points.length - 1].y == point.y)) {
        return true;
    }
    return false;	
}
isInRect(r) {
	var result = true;
	this.points.some(function(wirePoint) {
			if (!r.contains(wirePoint.x, wirePoint.y)) {
				result = false;
				return true;
			}else{
			  return false;
			}
	});
	return result;
}
setSelected(selection) {
     super.setSelected(selection);
     if (!selection) {
        this.resizingPoint = null;
     }
}
isBendingPointClicked( x,  y) {
	var rect = new core.Rectangle(x
			- this.selectionRectWidth / 2, y - this.selectionRectWidth
			/ 2, this.selectionRectWidth, this.selectionRectWidth);

    let point = null;

	this.points.some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
isControlRectClicked(x, y) {
	var rect = new core.Rectangle(x
								- this.selectionRectWidth / 2, y - this.selectionRectWidth
								/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.points.some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
Move(xoffset, yoffset) {
	this.points.forEach(function(wirePoint) {
		wirePoint.setLocation(wirePoint.x + xoffset,
									wirePoint.y + yoffset);
	});
}
Mirror(A,B) {
	this.points.forEach(function(wirePoint) {
		wirePoint.setLocationPoint(utilities.mirrorPoint(A,B, wirePoint));
	});
}
Rotate(rotation) {
	this.points.forEach(function(wirePoint) {
				var p = utilities.rotate(wirePoint,
									rotation.originx, rotation.originy,
									rotation.angle);
				wirePoint.setLocation(p.x, p.y);
	});
}
calculateShape() {
	var rect = new core.Rectangle();
	var x1 = Number.MAX_VALUE, y1 = Number.MAX_VALUE,
								x2 = Number.MIN_VALUE, y2 = Number.MIN_VALUE;

	this.points.forEach(function(point) {
							x1 = Math.min(x1, point.x);
							y1 = Math.min(y1, point.y);
							x2 = Math.max(x2, point.x);
							y2 = Math.max(y2, point.y);
	});

	rect.setRect(x1, y1, (x2 - x1) == 0 ? 1 : x2 - x1, y2
								- y1 == 0 ? 1 : y2 - y1);

						return rect;
}
drawControlShape(g2, viewportWindow,scalableTransformation) {
	var line=new core.Line();
	g2.lineWidth=1; 
						
	this.points.forEach(function(wirePoint) {
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
isFloating() {
	return (!(this.floatingStartPoint
								.equals(this.floatingEndPoint) && this.floatingStartPoint
								.equals(this.floatingMidPoint)));
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

		if (this.selection) {
			this.drawControlShape(g2, viewportWindow, scale);
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


class Drill extends Shape{
	 constructor(width,height) {
		super(0,0,width,height,-1);
	 }
	 setLocation(x,y){
	   this.x=x;
	   this.y=y;
	 }
	Move( xoffset, yoffset) {
	      this.x+=xoffset;
	      this.y+=yoffset;
	    }
	Rotate(rotation) {
	    	var a=new core.Point(this.x,this.y);
	    	var p=utilities.rotate(a, rotation.originx, rotation.originy, rotation.angle);
	        this.setX(p.x);
	        this.setY(p.y);
	        var w=this.getWidth();
	        this.setWidth(this.getHeight());
	        this.setHeight(w);        
	 } 
    Mirror(A,B) {
        let source=new core.Point(this.x,this.y);
        utilities.mirrorPoint(A,B, source); 
        this.setX(source.x);
        this.setY(source.y);
    }	
	calculateShape() {
		 return new core.Rectangle((this.getX()-this.getWidth()/2),(this.getY()-this.getWidth()/2),this.getWidth(),this.getWidth());
	}
	Paint(g2,viewportWindow,scale){
		var rect=this.getBoundingShape().getScaledRect(scale);
	    g2.beginPath(); //clear the canvas context
		g2.arc((rect.x+(rect.width/2))-viewportWindow.x, (rect.y+(rect.width/2))-viewportWindow.y, rect.width/2, 0, 2 * Math.PI, false);
	    g2.closePath();
	    g2.fillStyle = 'black';
	    g2.fill();
	}
	toXML(){
	    return "<drill type=\"CIRCULAR\" x=\""+this.getX()+"\" y=\""+this.getY()+"\" width=\""+this.getWidth()+"\" height=\""+this.getHeight()+"\" />";	
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
	   super(x, y, width, height, -1, core.Layer.LAYER_BACK);
	   this.arc=width;
	   this.drill=null;
	   this.setType(PadType.THROUGH_HOLE);
	   this.setShape(PadShape.CIRCULAR);
	   this.offset=new core.Point(0,0);
	   this.setDisplayName("Pad");
	   
	   this.text=new core.ChipText();
	   this.text.Add(new font.FontTexture("number","",x,y,new core.Alignment(core.AlignEnum.LEFT),4000));
	   this.text.Add(new font.FontTexture("netvalue","",x,y,new core.Alignment(core.AlignEnum.LEFT),4000));   
	}
clone(){
	     var copy=new Pad(this.x,this.y,this.width,this.height);
	     copy.setType(this.type);
		 copy.setX(this.getX());
		 copy.setY(this.getY());
	     copy.setWidth(this.getWidth());
	     copy.setHeight(this.getHeight());
	     copy.arc=this.arc;     
	     copy.setShape(this.getShape());
	     copy.copper=this.copper;
	     copy.text=this.text.clone();
	     if(this.drill!=null){
	    	 copy.drill=new Drill(this.drill.width,this.drill.height);
	    	 copy.drill.setLocation(this.drill.x,this.drill.y);
	     }
	     return copy;
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
	     return new core.Rectangle(this.x, this.y, 0,0);
	}
alignToGrid(isRequired){
	     var point=this.owningUnit.getGrid().positionOnGrid(this.x,this.y);
	     this.Move(point.x - this.x,point.y - this.y);
	     return null;     
	}	
getOrderWeight(){
	     return 2; 
	}
isClicked(x,y){
	    let rect=super.getBoundingShape();
	    if(rect.contains(x,y))
	     return true;
	    else
	     return false;  
	 }
isInRect(r) {
		 let rect=super.getBoundingShape();
	     if(r.contains(rect.getCenterX(),rect.getCenterY()))
	         return true;
	        else
	         return false; 
	}	
Move(xoffset, yoffset){
	   this.x+=xoffset;
	   this.y+=yoffset;
	   if(this.drill!=null){
	     this.drill.Move(xoffset, yoffset);
	   }
	   this.text.Move(xoffset,yoffset);
	   
	}

Mirror(A,B) {
    let source = new core.Point(this.x,this.y);
    utilities.mirrorPoint(A, B, source);
    this.setX(source.x);
    this.setY(source.y);
    if (this.drill != null) {
        this.drill.Mirror(A, B);
    }
    this.text.Mirror(A, B);
}
Rotate(rotation){
		var a=new core.Point(this.getX(),this.getY());
		var p=utilities.rotate(a, rotation.originx, rotation.originy, rotation.angle);
	    this.setX(p.x);
	    this.setY(p.y);
	    let w=this.getWidth();
	    this.setWidth(this.getHeight());
	    this.setHeight(w);
	    if(this.drill!=null){
	       this.drill.Rotate(rotation);
	    }
	    this.text.Rotate(rotation);		
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
	        return new core.Rectangle((this.getX()-this.getWidth()/2)-this.offset.x,(this.getY()-this.getHeight()/2)-this.offset.y,this.getWidth(),this.getHeight());
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
		this.setWidth(this.pad.getWidth());
	}
    Paint(g2,viewportWindow,scale){
		var rect=this.pad.getBoundingShape().getScaledRect(scale);
	    //check if outside of visible window
	    if(!rect.intersects(viewportWindow)){
	    	return false;
	    }
		
	    g2.beginPath(); //clear the canvas context
		g2.arc((rect.x+(rect.width/2))-viewportWindow.x, (rect.y+(rect.width/2))-viewportWindow.y, rect.width/2, 0, 2 * Math.PI, false);
		g2.closePath();
		if(this.pad.isSelected())
	        g2.fillStyle = "gray";  
	    else{
	        g2.fillStyle = this.pad.copper.getColor();
	    }
	    g2.fill();

	    return true;
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
	}
Paint(g2,viewportWindow,scale){
		  var rect=this.pad.getBoundingShape().getScaledRect(scale);
	      //check if outside of visible window
	      if(!rect.intersects(viewportWindow)){
	        return false;
	      }
		  g2.beginPath(); //clear the canvas context
		  utilities.roundrect(g2,rect.x-viewportWindow.x, rect.y-viewportWindow.y, rect.width, rect.height,this.pad.arc*scale.getScale());
	      g2.closePath();
	      if(this.pad.isSelected())
	        g2.fillStyle = "gray";  
	      else{
	        g2.fillStyle = this.pad.copper.getColor();
	      }
	      g2.fill();

	      return true;
}
setWidth(width) {
	    this.pad.width=width;
	    if(width<this.pad.height){
	      this.pad.arc=width;
	    }else{
	      this.pad.arc=this.pad.height;  
	    }
}
setHeight(height) {
	    this.pad.height=height;
	    if(height<this.pad.width){
	      this.pad.arc=height;
	    }else{
	      this.pad.arc=this.pad.width;  
	    }
}
}
//------------RectangularShape----------------
class RectangularShape{
	constructor(pad){
		this.pad=pad;
}
Paint(g2,viewportWindow,scale){
		var rect=this.pad.getBoundingShape().getScaledRect(scale);
	    //check if outside of visible window
	    if(!rect.intersects(viewportWindow)){
	        return false;
	    }
	    g2.beginPath();
	    utilities.roundrect(g2,rect.x-viewportWindow.x, rect.y-viewportWindow.y, rect.width, rect.height,0);
	    g2.closePath();
	    if(this.pad.isSelected())
	      g2.fillStyle = "gray";  
	    else{
	      g2.fillStyle = this.pad.copper.getColor();
	    }
	    g2.fill();

	    return true;
}
setWidth(width) {
		   this.pad.width=width;
}
setHeight(height) {
		    this.pad.height=height;           
}
}
//--------------PolygonShape-------------------------
class PolygonShape{
constructor(pad){
		this.pad=pad;
		this.polygon=[];		
		this.initPoints(this.pad.width / 2);
}	
initPoints(r) {
           
            let da = (2 * Math.PI) / 6;
            let lim = (2 * Math.PI) - (da / 2);

            
            var point=new core.Point(r * Math.cos(0), r * Math.sin(0));            
            this.polygon.push(point);
			for (let a = da; a < lim; a += da) {
                point=new core.Point(r * Math.cos(a),r * Math.sin(a));
                this.polygon.push(point);
			}                       
}
Paint(g2, viewportWindow, scale) {
		   var rect=this.pad.getBoundingShape().getScaledRect(scale);
	       //check if outside of visible window
	       if(!rect.intersects(viewportWindow)){
	         return false;
	       }

		   						// scale points
		   let dst = [];
		   let tmp =new core.Point();
		   this.polygon.forEach(function(point) {
			  tmp.setLocation(point.x+this.pad.x,point.y+this.pad.y);
			  dst.push(tmp.getScaledPoint(scale));
		   }.bind(this));
           
	       g2.beginPath();
		   g2.moveTo((dst[0].x) - viewportWindow.x, (dst[0].y)
								- viewportWindow.y);
		   for (var i = 1; i < dst.length; i++) {
							g2.lineTo(dst[i].x - viewportWindow.x, dst[i].y
									- viewportWindow.y);
		   }
	       
		   g2.closePath();
	       if(this.pad.isSelected()){
	         g2.fillStyle = "gray";  
		   }else{
	         g2.fillStyle = this.pad.copper.getColor();
	       }
	       g2.fill();
            
           return true;
}
setWidth(width) {
            this.pad.width=width;
            this.pad.height=width;
            this.initPoints(this.pad.width / 2);
}
setHeight(height) {
            //this.pad.height=height;
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
