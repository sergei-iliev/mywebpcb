var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/core').Shape;

class AbstractLine extends Shape{
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
	utilities.drawCrosshair(g2, viewportWindow,scalableTransformation,this.resizingPoint,this.selectionRectWidth,this.points);
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
		AbstractLine
}