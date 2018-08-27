var core=require('core/core');

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
var roundDouble=function(number){
	return Math.round(number*10000)/10000 ;
}
var round=function(angle){
	return Math.round(angle*100.0)/100.0;
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
var getQuadrantLocation=function(origin,x,y) {
        if (x >= origin.x && y <= origin.y)
            return QUADRANT.FIRST;
        else if (x <= origin.x && y <= origin.y)
            return QUADRANT.SECOND;
        else if (x <= origin.x && y >= origin.y)
            return QUADRANT.THIRD;
        else
            return QUADRANT.FORTH;
}
	
var drawCrosshair=function(g2,viewportWindow,scale,resizingPoint,length,points){
        let line = new core.Line();
        
		g2.lineWidth = 1;

        points.forEach(function(point){
            if (resizingPoint != null && resizingPoint.equals(point))
                g2.strokeStyle = 'yellow';
            else
                g2.strokeStyle='blue';
			
            line.setLine(point.x - length, point.y, point.x + length, point.y);
            line.draw(g2, viewportWindow, scale);

            line.setLine(point.x, point.y - length, point.x, point.y + length);            
			line.draw(g2,viewportWindow,scale);
        });	

}

var radians = function(degrees) {
	  return degrees * Math.PI / 180;
};
	 
var degrees = function(radians) {
	  return radians * 180 / Math.PI;
};

var rotate=function(point, originX, originY, angle){
	angle = angle * Math.PI / 180.0;
		return {
				x: Math.cos(angle) * (point.x-originX) - Math.sin(angle) * (point.y-originY) + originX,
				y: Math.sin(angle) * (point.x-originX) + Math.cos(angle) * (point.y-originY) + originY
	    };
};

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
    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new core.Point( max.x, min.y );
    var bottomLeft = new core.Point( min.x, max.y );
    
    var inter1 = intersectLineLine(min, topRight, a1, a2);
    var inter2 = intersectLineLine(topRight, max, a1, a2);
    var inter3 = intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = intersectLineLine(bottomLeft, min, a1, a2);
    
    return inter1||inter2||inter3||inter4;
};
//*******DELETE*************
var roundrect=function (g2,x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
		g2.moveTo(x+r, y);
		g2.arcTo(x+w, y,   x+w, y+h, r);
		g2.arcTo(x+w, y+h, x,   y+h, r);
		g2.arcTo(x,   y+h, x,   y,   r);
		g2.arcTo(x,   y,   x+w, y,   r);
};

var ellipse=function(g2,xC, yC, width, height, rotation) {
	var x, y, rW, rH, inc;
	inc = 0.01 //value by which we increment the angle in each step
	rW = width / 2; //horizontal radius
	rH = height / 2; //vertical radius
	x = xC + rW * Math.cos(rotation); // ...we will treat this as angle = 0
	y = yC + rW * Math.sin(rotation);

	g2.moveTo(x, y); //set the starting position
		for (var angle = inc; angle<2*Math.PI; angle+=inc) { //increment the angle from just past zero to full circle (2 Pi radians)
			x = xC + rW * Math.cos(angle) * Math.cos(rotation) - rH * Math.sin(angle) * Math.sin(rotation);
			y = yC + rW * Math.cos(angle) * Math.sin(rotation) + rH * Math.sin(angle) * Math.cos(rotation);
			g2.lineTo(x, y); //draw a straight line segment. if the increment is small enough, this will be
								//indistinguishable from a curve in an on-screen pixel array
		}
};

var textHeight=function(text, font) {

    var fontDraw = document.createElement("canvas");

    var height = 100;
    var width = 100;

    // here we expect that font size will be less canvas geometry
    fontDraw.setAttribute("height", height);
    fontDraw.setAttribute("width", width);

    var ctx = fontDraw.getContext('2d');
    // black is default
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.font = font;
    ctx.fillText(text/*'Eg'*/, 0, 0);

    var pixels = ctx.getImageData(0, 0, width, height).data;

    // row numbers where we first find letter end where it ends 
    var start = -1;
    var end = -1;

    for (var row = 0; row < height; row++) {
        for (var column = 0; column < width; column++) {

            var index = (row * width + column) * 4;

            // if pixel is not white (background color)
            if (pixels[index] == 0) {
                // we havent met white (font color) pixel
                // on the row and the letters was detected
                if (column == width - 1 && start != -1) {
                    end = row;
                    row = height;
                    break;
                }
                continue;
            }
            else {
                // we find top of letter
                if (start == -1) {
                    start = row;
                }
                // ..letters body
                break;
            }

        }

    }
   /*
    document.body.appendChild(fontDraw);
    fontDraw.style.pixelLeft = 400;
    fontDraw.style.pixelTop = 400;
    fontDraw.style.position = "absolute";
   */

    return end - start;

};

version=(function(){
	return {
		MYWEBPCB_VERSION:"2.1",
	    SYMBOL_VERSION:"2.0",
        CIRCUIT_VERSION:"1.2",     
        FOOTPRINT_VERSION:"1.0", 
        BOARD_VERSION:"2.0" 
	};
})();

module.exports = {
  version,
  round,
  roundDouble,
  getQuadrantLocation,
  textHeight,
  drawCrosshair,
  //ellipse,
  roundrect,
  intersectLineRectangle,
  intersectLineLine,
  rotate,
  degrees,
  radians,
  QUADRANT,
  mirrorPoint
}
