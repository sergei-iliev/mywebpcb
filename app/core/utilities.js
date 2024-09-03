var core=require('core/core');
var d2=require('d2/d2');

    /*
     * Find out in which quadrant is a point B, in regard to a point origine A
     *
     *        2   |  1
     *        ----------
     *        3   |  4
     */
var QUADRANT=(function(){
	return{
        FIRST:1,
        SECOND:2,
        THIRD:3,
        FORTH:4
	}
})();

var POSITION=(function(){
	return{
        TOP_LEFT:1,
        BOTTOM_RIGHT:2,
        findPositionToLine:function(x,y,l1,l2){
        	if(l1.y==l2.y){ //horizontal line
        	   if(y<l1.y){
        		   return POSITION.TOP_LEFT;
        	   }else{
        		   return POSITION.BOTTOM_RIGHT;
        	   }	
        	}else{ 	//vertical line
         	   if(x<l1.x){
        		   return POSITION.TOP_LEFT;
        	   }else{
        		   return POSITION.BOTTOM_RIGHT;
        	   }	        		
        	}
        }
	}
})();


var POINT_TO_POINT=8;
var  DISTANCE = 3000;
var roundDouble=function(number){
	return roundFloat(number,4);
}

var round=function(angle){
	return Math.round(angle*100.0)/100.0;
}

var roundFloat=function(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
var mirrorPoint=function(A,B,sourcePoint){
        let x = sourcePoint.x, y = sourcePoint.y;
        //***is this right-left mirroring
        if (A.x == B.x) {
            //***which place in regard to x origine
            if ((x - A.x) < 0)
                x = A.x + (A.x - x);
            else
                x = A.x - (x - A.x);
        } else { //***top-botom mirroring
            //***which place in regard to y origine
            if ((y - A.y) < 0)
                y = A.y + (A.y - y);
            else
                y = A.y - (y - A.y);
        }

        sourcePoint.setLocation(x, y);
        return sourcePoint;	
}
var getQuadrantLocation=function(origin,point) {
        if (point.x >= origin.x && point.y <= origin.y)
            return QUADRANT.FIRST;
        else if (point.x <= origin.x && point.y <= origin.y)
            return QUADRANT.SECOND;
        else if (point.x <= origin.x && point.y >= origin.y)
            return QUADRANT.THIRD;
        else
            return QUADRANT.FORTH;
}
var drawCircle=function(g2,resizingPoint,length,points) {    	    	
    	let circle=new d2.Circle(new d2.Point(0,0),length)
        points.forEach(function(point) {
            if (resizingPoint != null && resizingPoint.equals(point))
                g2.fillStyle ='yellow'
            else
                g2.fillStyle ='blue'

            circle.pc.x=point.x
            circle.pc.y=point.y
			g2._fill=true
            circle.paint(g2)
			g2._fill=false
            
        })            	    	    	
}
var drawCrosshair=function(g2,viewportWindow,scale,resizingPoint,length,points){
        let line = new d2.Segment(0,0,0,0);
        
		g2.lineWidth = 1;

        points.forEach(function(point){
            if (resizingPoint != null && resizingPoint.equals(point))
                g2.strokeStyle = 'yellow';
            else
                g2.strokeStyle='blue';
			
            line.set(point.x - length, point.y, point.x + length, point.y);
            line.scale(scale.getScale());
            line.move(-viewportWindow.x,-viewportWindow.y);
            line.paint(g2);

            line.set(point.x, point.y - length, point.x, point.y + length);            
            line.scale(scale.getScale());
            line.move(-viewportWindow.x,-viewportWindow.y);
            line.paint(g2);
        });	

}

var radians = function(degrees) {
	  return degrees * Math.PI / 180;
};
	 
var degrees = function(radians) {
	  return radians * 180 / Math.PI;
};

//var rotate=function(point, originX, originY, angle){
//	angle = angle * Math.PI / 180.0;
//		return {
//				x: Math.cos(angle) * (point.x-originX) - Math.sin(angle) * (point.y-originY) + originX,
//				y: Math.sin(angle) * (point.x-originX) + Math.cos(angle) * (point.y-originY) + originY
//	    };
//};

/**
a = line point 1; b = line point 2; c = point to check against.
If the formula is equal to 0, the points are colinear.
If the line is horizontal, then this returns true if the point is above the line.
**/
var isLeftPlane=function(a, b, c){
   return ((c.x - a.x)*(b.y - a.y) - (c.y - a.y)*(b.x - a.x)) > 0;
}	
/*****
*
*   Intersect Line with Line
*
*****/
var intersectLineLine = function(a1, a2, b1, b2) {
    var result=false;
    
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
};
/*****
*
*   Intersect Line with Rectangle
*
*****/
var intersectLineRectangle = function(a1, a2, r1, r2) {
    var min        = Min(r1,r2);
    var max        = Max(r1,r2);
    var topRight   = new d2.Point( max.x, min.y );
    var bottomLeft = new d2.Point( min.x, max.y );
    
    var inter1 = intersectLineLine(min, topRight, a1, a2);
    var inter2 = intersectLineLine(topRight, max, a1, a2);
    var inter3 = intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = intersectLineLine(bottomLeft, min, a1, a2);
    
    return inter1||inter2||inter3||inter4;
};
var Min=function(p1,p2){
	return new d2.Point(Math.min(p1.x,p2.x),Math.min(p1.y,p2.y));	
}
var Max=function(p1,p2){
    return new d2.Point(Math.max(p1.x,p2.x),Math.max(p1.y,p2.y));	
}
//*******DELETE*************
//var roundrect=function (g2,x, y, w, h, r) {
//	if (w < 2 * r) r = w / 2;
//	if (h < 2 * r) r = h / 2;
//		g2.moveTo(x+r, y);
//		g2.arcTo(x+w, y,   x+w, y+h, r);
//		g2.arcTo(x+w, y+h, x,   y+h, r);
//		g2.arcTo(x,   y+h, x,   y,   r);
//		g2.arcTo(x,   y,   x+w, y,   r);
//};

var hexToDec=function(hex) {
	var result = 0, digitValue;
	hex = hex.toLowerCase();
	for (var i = 0; i < hex.length; i++) {
		digitValue = '0123456789abcdefgh'.indexOf(hex[i]);
		result = result * 16 + digitValue;
	}
	return result;
}
var arrayEquals=function(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

version=(function(){
	return {
		MYWEBPCB_VERSION:"8.0",
	    SYMBOL_VERSION:"8.0",
        CIRCUIT_VERSION:"8.0",     
        FOOTPRINT_VERSION:"8.0", 
        BOARD_VERSION:"8.0" 
	};
})();

module.exports = {
  version,
  isLeftPlane,
  round,
  roundDouble,
  roundFloat,
  getQuadrantLocation,  
  drawCrosshair,
  drawCircle,
  intersectLineRectangle,
  intersectLineLine,
  degrees,
  radians,
  hexToDec,
  QUADRANT,
  POINT_TO_POINT,
  POSITION,
  mirrorPoint,
  arrayEquals
}
