var core=require('core/core');
var utilities =require('core/utilities');
var d2=require('d2/d2');
var font = require('core/text/d2font');

class Shape{
	constructor(x, y, width, height, thickness,
			layermask) {
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
		this.copper = core.Layer.Copper.resolve(layermask);
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
getDrawingOrder() {
    return 100;
}
getOrderWeight() {
		return (this.getWidth() * this.getHeight());
	}
getUUID() {
		return this.uuid;
	}
calculateShape() {

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
getBoundingShape() {
	return this.calculateShape();
	}
setSelected (selection) {
		this.selection = selection;
	}
isSelected() {
		return this.selection;
	}

Move(xoffset,yoffset) {
      this.setX(this.getX() + xoffset);
      this.setY(this.getY() + yoffset);    
}

Mirror(line) {

}
    

Rotate(rotation) {
		let point = new Point(this.getX(), this.getY());
		point = utilities.rotate(point, rotation.originx,rotation.originy, rotation.angle);
	
        this.x=(point.x);
        this.y=(point.y);
}	
fromXML(data) {

	}

} 

/**********************Ruler**********************************/
class Ruler extends Shape{
constructor () {
	super(0, 0, 0, 0, 0, 0);
    this.text=new font.FontTexture('label','',0,0,20);
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
                
        this.text.Paint(g2, viewportWindow, scale);

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
		this.selectionRectWidth = 3000;
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
		this.rotate=0;
		
}
getLinePoints(){
		return this.polyline.points;
	}
Clear(){
		this.polyline.points=null;		
	}
alignResizingPointToGrid(targetPoint) {
    this.owningUnit.grid.snapToGrid(targetPoint);         
}
isClicked(x, y) {
	  var result = false;
		// build testing rect
	  var rect = d2.Box.fromRect(x
								- (this.thickness / 2), y
								- (this.thickness / 2), this.thickness,
								this.thickness);
	  var r1 = rect.min;
	  var r2 = rect.max;

	  // ***make lines and iterate one by one
	  var prevPoint = this.polyline.points[0];

	  this.polyline.points.some(function(wirePoint) {
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
resetToPoint(point) {
	this.floatingStartPoint.set(point);
	this.floatingMidPoint.set(point);
	this.floatingEndPoint.set(point);
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
	clickedPoint.set(clickedPoint.x + xoffset,
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
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polyline.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}

Move(xoffset, yoffset) {
	this.polyline.move(xoffset,yoffset);
}
Mirror(line) {
    this.polyline.mirror(line);
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
Rotate(rotation) {
	//fix angle
	let alpha=this.rotate+rotation.angle;
	if(alpha>=360){
	  alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotate=alpha;	
	this.polyline.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
calculateShape() {
	return this.polyline.box;
}


drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.polyline.points);	
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
		AbstractLine
}