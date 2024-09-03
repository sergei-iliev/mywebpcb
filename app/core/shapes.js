var core=require('core/core');
var utilities =require('core/utilities');
var d2=require('d2/d2');
var font = require('core/text/d2font');


const ResumeState = Object.freeze({
	ADD_AT_FRONT:0,
	ADD_AT_END:1
})
class Shape{
	constructor(x, y, width, height, thickness,
			layermaskId) {
		this.owningUnit=null;
		this.uuid = core.UUID();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.thickness = thickness;
		this.selection = false;
		this.displayName = "noname";
		this.fill = Fill.EMPTY;
		this.fillColor;		 
		this.isControlPointVisible=true;
		this.copper = core.Layer.Copper.resolve(layermaskId);
		this.rotation=0;
		this.selectionRectWidth=5
	}
getCenter(){
	return new d2.Point(this.x,this.y);
}	
setDisplayName(displayName) {
		this.displayName = displayName;
	}
clear() {
    this.owningUnit=null;
	}
clone() {
	copy=new Shape(this.x,this.y,this.width,this.height,this.layermask);
	copy.fill=this.fill;	
	return copy;
	}
alignToGrid(isRequired) {
        let point=this.owningUnit.getGrid().positionOnGrid(this.getX(), this.getY());
        this.setX(point.x);
        this.setY(point.y);      
        return null;
}
setX(x) {
		this.x = x;
	}
getX() {
		return this.x;
	}
setY(y) {
		this.y = y;
	}
getY() {
		return this.y;
	}
setWidth(width) {
		this.width = width;
	}
getWidth() {
		return this.width;
	}
setHeight (height) {
		this.height = height;
	}
getHeight() {
		return this.height;
	}
getDrawingLayerPriority() {
    return 100;
}
getClickableOrder() {
		return 100;
}
getUUID() {
		return this.uuid;
	}
calculateShape() {

	}
isVisibleOnLayers(layermasks){
    if((this.copper.getLayerMaskID()&layermasks)!=0){
        return true;
    }else{
        return false;
    }
}
isInRect(r){
	let rect=this.getBoundingShape();
        if(r.contains(rect.center))
            return true;
           else
            return false; 		
	}
isClicked(x,y) {
        let r=this.getBoundingShape();
        if(r.contains(x,y))
         return true;
        else
         return false;           
}
isClickedOnLayers(x, y, layermasks) {        
  return this.isClicked(x, y);
}
getBoundingShape() {
	return this.calculateShape();
	}
setState(memento) {
   memento.loadStateTo(this);
} 
setSelected (selection) {
		this.selection = selection;
	}
isSelected() {
		return this.selection;
	}

move(xoffset,yoffset) {
      this.setX(this.getX() + xoffset);
      this.setY(this.getY() + yoffset);    
}

mirror(line) {

}
setSide(side, line, angle) {
    this.copper=(core.Layer.Side.change(this.copper.getLayerMaskID()));
    this.mirror(line);
    this.rotation=angle;
}     

rotate(rotation) {
//		let point = new Point(this.getX(), this.getY());
//		point = utilities.rotate(point, rotation.originx,rotation.originy, rotation.angle);
//	
//        this.x=(point.x);
//        this.y=(point.y);
}	
fromXML(data) {

	}

} 

/**********************Ruler**********************************/
class Ruler extends Shape{
constructor () {
	super(0, 0, 0, 0, 0, 0);
    this.text=new font.FontTexture('label','',0,0,core.MM_TO_COORD(1),0);
    this.text.constSize=true;
    this.text.fillColor='white';        
	this.resizingPoint=null;
}
Resize( xOffset, yOffset) {
    this.resizingPoint.set(this.resizingPoint.x+xOffset,this.resizingPoint.y+yOffset);
    this.text.shape.anchorPoint.set(this.resizingPoint.x, this.resizingPoint.y);
}	
paint( g2,  viewportWindow,  scale) {        
		if(this.resizingPoint==null){
            return;
        }
        this.text.setText(parseFloat(core.COORD_TO_MM(this.resizingPoint.distanceTo(new d2.Point(this.x,this.y)))).toFixed(4)+' MM');
                
        this.text.paint(g2, viewportWindow, scale);
        let line=new d2.Segment(this.x,this.y,this.resizingPoint.x,this.resizingPoint.y);

        g2.strokeStyle  = 'white';
		g2.lineWidth=1; 
        
        line.scale(scale.getScale());
        line.move(-viewportWindow.x,-viewportWindow.y);
        line.paint(g2);
		
    }	
}
/**********************Coordinate System**********************************/
class CoordinateSystem extends Shape {
	constructor (owningUnit) {
		super(0, 0, 0, 0, 0, 0);
		this.owningUnit=owningUnit;
        this.selectionRectWidth=3000;		
	}
alignToGrid(isRequired) {
    if(isRequired){
           return super.alignToGrid(isRequired);
    }else{
          return null;
    }
}
calculateShape() {
    return d2.Box.fromRect(this.x-this.selectionRectWidth/2,this.y-this.selectionRectWidth/2,this.selectionRectWidth,this.selectionRectWidth);
}
reset(x, y) {
		if (x < 0) {
			x = 0;
		} else if (x > this.owningUnit.getWidth()) {
			x = this.owningUnit.getWidth();
		}
		if (y < 0) {
			y = 0;
		} else if (y > this.owningUnit.getWidth()) {
			y = this.owningUnit.getWidth();
		}
		this.x=x;
		this.y=y;
}

paint(g2, viewportWindow, scale) {
		var line = new d2.Segment(0,0,0,0);		

		g2.strokeStyle  = 'blue';
		g2.lineWidth=1; 
	

		line.set(0, this.y, this.owningUnit.getWidth(),
				this.y);
		line.scale(scale.getScale());
		line.move(-viewportWindow.x,- viewportWindow.y);
	    line.paint(g2);
	    
	
		line.set(this.x, 0, this.x, this.owningUnit.getHeight());
		line.scale(scale.getScale());
		line.move(-viewportWindow.x,- viewportWindow.y);		
		line.paint(g2);
	}
}
class AbstractLine extends Shape{
	constructor(thickness,layermaskId) {
		super(0, 0, 0, 0, thickness,layermaskId);
		//this.selectionRectWidth = 3000;
		this.setDisplayName("Line");			
		this.polyline=new d2.Polyline();
		this.floatingStartPoint = new d2.Point(); // ***the
																			// last
																			// wire
																			// point
		this.floatingMidPoint = new d2.Point(); // ***mid
																		// 90
																		// degree
																		// forming
		this.floatingEndPoint = new d2.Point();
		//this.rotation=0;
	    this.resumeState=core.ResumeState.ADD_AT_END;
		
}
get vertices(){
	  return this.polyline.points;	
	}	
getLinePoints(){
		return this.polyline.points;
	}
clear(){
		this.polyline.points=null;		
	}
alignResizingPointToGrid(targetPoint) {
    this.owningUnit.grid.snapToGrid(targetPoint);         
}
getClickableOrder(){
	return 2;
}
isSegmentClicked(pt){				      
	  if(this.isControlRectClicked(pt.x,pt.y))
          return false;
      if(this.polyline.isPointOnSegment(pt,this.selectionRectWidth/2)){
	    return true;
      }
	  return false
	}
getSegmentClicked(pt){
		      let segment=new d2.Segment(0,0,0,0);	   
	          let prevPoint = this.polyline.points[0];        
	          for(let point of this.polyline.points){    	        	  
	              if(prevPoint.equals(point)){    	            	  
	            	  prevPoint = point;
	                  continue;
	              }    	              	              
                  segment.ps=prevPoint;
                  segment.pe=point;
	              if(segment.isPointOn(pt,this.selectionRectWidth)){
	                  return segment
	              }
	              prevPoint = point;
	          }			       	          
	       return null;
}
/*
getSegments(){
    let list=[];
    let prevPoint = this.polyline.points[0];        
    for(let point of this.polyline.points){                          
        if(prevPoint.equals(point)){                        
            prevPoint = point;
            continue;
        }                       
        list.push(new d2.Segment(prevPoint.x,prevPoint.y,point.x,point.y));
        
        prevPoint = point;
    }
    return list;         
}
*/
isSingleSegment(){
   return this.polyline.points.length==2;	
}
isClicked(x, y) {
	 return this.polyline.isPointOn({"x":x,"y":y},this.thickness<4?4:this.thickness);
}
add(x,y){
    if(this.resumeState==ResumeState.ADD_AT_FRONT)
        this.polyline.points.unshift(new d2.Point(x,y));        
    else
        this.polyline.add(x,y);  	
}
addPoint(point) {
    this.add(point.x,point.y);	
}

reset(...args) {
   if(args.length==0){
	this.floatingStartPoint.set(this.floatingStartPoint);
	this.floatingMidPoint.set(this.floatingStartPoint);
	this.floatingEndPoint.set(this.floatingStartPoint);	  
   }else{	
	this.floatingStartPoint.set(args[0]);
	this.floatingMidPoint.set(args[0]);
	this.floatingEndPoint.set(args[0]);
   }
}

Resize(xoffset, yoffset, clickedPoint) {	
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
resumeLine( x,  y) {        
    //the end or beginning
    if (this.polyline.points.length ==0) {
      this.resumeState=core.ResumeState.ADD_AT_END;
      return;
    }
    
    let point=this.isBendingPointClicked(x, y);
    if(point==null){
        this.resumeState=code.ResumeState.ADD_AT_END;
    }
    //***head point
    if (this.polyline.points[0].x==point.x&&this.polyline.points[0].y==point.y) {
        this.resumeState=core.ResumeState.ADD_AT_FRONT;
    }
    //***tail point
    if (this.polyline.points[this.polyline.points.length - 1].x==point.x&& this.polyline.points[this.polyline.points.length - 1].y==point.y) {
        this.resumeState=core.ResumeState.ADD_AT_END;
    }        
    
    if(this.resumeState==ResumeState.ADD_AT_FRONT)
       this.reset(this.polyline.points[0]);
    else
       this.reset(this.polyline.points[this.polyline.points.length-1]);
}
shiftFloatingPoints(){
    if(this.resumeState==ResumeState.ADD_AT_FRONT){
        this.floatingStartPoint.set(this.polyline.points[0].x,this.polyline.points[0].y);
        this.floatingMidPoint.set(this.floatingEndPoint.x, this.floatingEndPoint.y);                  
    }else{
    	this.floatingStartPoint.set(this.polyline.points[this.polyline.points.length-1].x, this.polyline.points[this.polyline.points.length-1].y);
        this.floatingMidPoint.set(this.floatingEndPoint.x, this.floatingEndPoint.y); 	    
    }
	    
}
insertPoint( x, y) {
       let rect = d2.Box.fromRect(x - (this.thickness / 2), y- (this.thickness / 2), this.thickness,this.thickness);             
       let count=-1,index=-1;
        
        
        //***make lines and iterate one by one
        let prevPoint =this.polyline.points[0];        
        for(let point of this.polyline.points) {
            count++;                     
            if (utilities.intersectLineRectangle(prevPoint,point, rect.min, rect.max)) {		            
                index=count;
                break;
            }    
            prevPoint = point;
        }        
        if(index!=-1){
           this.polyline.points.splice(index,0, new d2.Point(x,y)); 
        }
	
/*    
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
*/
}
removePoint(x, y) {
    let point = this.isBendingPointClicked(x, y);
    if (point != null) {
    	
    	var tempArr = this.polyline.points.filter(function(item) { 
    	    return item !== point;
    	});
        
    	this.polyline.points=tempArr;
    }
}
deleteLastPoint() {
	if (this.polyline.points.length == 0)
		return;

    if(this.resumeState==ResumeState.ADD_AT_FRONT){
        this.polyline.points.shift();
    }else{   
        this.polyline.points.pop();
    }	
	// ***reset floating start point
	if (this.polyline.points.length > 0)
					this.floatingStartPoint
									.set(this.polyline.points[this.polyline.points.length - 1]);    
}
isEndPoint(x,y){
    if (this.polyline.points.length< 2) {
        return false;
    }

    let point = this.isBendingPointClicked(x, y);
    if (point == null) {
        return false;
    }
    //***head point
    if (this.polyline.points[0].x == point.x && this.polyline.points[0].y == point.y) {
        return true;
    }
    //***tail point
    if ((this.polyline.points[this.polyline.points.length - 1].x == point.x )&& (this.polyline.points[this.polyline.points.length - 1].y == point.y)) {
        return true;
    }
    return false;	
}
getEndPoint(x,y){
    if (this.polyline.points.length< 2) {
        return null;
    }

    let point = this.isBendingPointClicked(x, y);
    if (point == null) {
        return null;
    }
    //***head point
    if (this.polyline.points[0].x == point.x && this.polyline.points[0].y == point.y) {
    	return this.polyline.points.get(0);
    }
    //***tail point
    if ((this.polyline.points[this.polyline.points.length - 1].x == point.x )&& (this.polyline.points[this.polyline.points.length - 1].y == point.y)) {
    	return (this.polyline.points.get(this.polyline.points.size() - 1));
    }
    return false;		
}
isInRect(r) {
	var result = true;
	this.polyline.points.some(function(wirePoint) {
			if (!r.contains(wirePoint)) {
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
	var rect = d2.Box.fromRect(x
			- this.selectionRectWidth / 2, y - this.selectionRectWidth
			/ 2, this.selectionRectWidth, this.selectionRectWidth);

    let point = null;

	this.polyline.points.some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
isControlRectClicked(x, y,viewportWindow) {
        let pt=new d2.Point(x,y);
		pt.scale(this.owningUnit.scalableTransformation.getScale())
		pt.move(-viewportWindow.x,- viewportWindow.y);
        let result=null;
		this.polyline.points.every(v=>{
			var tmp=v.clone();
	        tmp.scale(this.owningUnit.scalableTransformation.getScale());
	        tmp.move(-viewportWindow.x,- viewportWindow.y);

	        if(d2.utils.LE(pt.distanceTo(tmp),this.selectionRectWidth/2)){
		          result=v
	              return false
	        }	        
            return true
		})
        
        return result;

}

move(xoffset, yoffset) {
	this.polyline.move(xoffset,yoffset);
}
mirror(line) {
    this.polyline.mirror(line);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotation;
	let box=this.polyline.box;
	if(center==undefined){
		this.polyline.rotate(alpha,box.center);
	}else{
		this.polyline.rotate(alpha,center);	 	
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
	this.polyline.rotate(rotation.angle,rotation.origin);
}
calculateShape() {
	return this.polyline.box;
}


drawControlShape(g2, viewportWindow, scale) {
        let pt=null;
        if(this.resizingPoint!=null){
            pt=this.resizingPoint.clone();
            pt.scale(scale.getScale());
            pt.move(-viewportWindow.x,- viewportWindow.y);
        }
        let r=this.polyline.clone(); 
        r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);    
        utilities.drawCircle(g2,  pt,this.selectionRectWidth,r.points); 
     	
	
}

isFloating() {
	return (!(this.floatingStartPoint
								.equals(this.floatingEndPoint) && this.floatingStartPoint
								.equals(this.floatingMidPoint)));
}
getResizingPoint() {
	return this.resizingPoint;
}

setResizingPoint(point) {
	this.resizingPoint = point;
}



}
module.exports ={
		Shape,
		CoordinateSystem,
		Ruler,
		AbstractLine,
		ResumeState
}