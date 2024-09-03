const DP_TOL = 0.000001;

module.exports = function(d2) {
	d2.utils={
		 DP_TOL: DP_TOL,
			
		 drawCrosshair:function(g2,length,points){                
				

		        points.forEach(function(point){
		        	let line = new d2.Segment(point.x - length, point.y, point.x + length, point.y);
					line.paint(g2);
		            
					line = new d2.Segment(point.x, point.y - length, point.x, point.y + length);            
					line.paint(g2);
		        });	
	   	 },
	   	/*****
	   	*
	   	*   Intersect Line with Line
	   	*
	   	*****/
	   	 intersectLineLine : function(a1, a2, b1, b2) {
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
	   	},	   	 
	   	/*****
	   	*
	   	*   Intersect Line with Rectangle
	   	*
	   	*****/
	   	intersectLineRectangle: function(a1, a2, r1, r2) {
	   	    var min        = this.min(r1,r2);
	   	    var max        = this.max(r1,r2);
	   	    var topRight   = new d2.Point( max.x, min.y );
	   	    var bottomLeft = new d2.Point( min.x, max.y );
	   	    
	   	    var inter1 = this.intersectLineLine(min, topRight, a1, a2);
	   	    var inter2 = this.intersectLineLine(topRight, max, a1, a2);
	   	    var inter3 = this.intersectLineLine(max, bottomLeft, a1, a2);
	   	    var inter4 = this.intersectLineLine(bottomLeft, min, a1, a2);
	   	    
	   	    return inter1||inter2||inter3||inter4;
	   	},
	   	min:function(p1,p2){
	   		return new d2.Point(Math.min(p1.x,p2.x),Math.min(p1.y,p2.y));	
	   	},
	   	max:function(p1,p2){
	   	    return new d2.Point(Math.max(p1.x,p2.x),Math.max(p1.y,p2.y));	
	   	},	   	
	   radians:function(degrees) {
			  return degrees * Math.PI / 180;
	   },
			 
			// Converts from radians to degrees.
	   degrees :function(radians) {
			  return radians * 180 / Math.PI;
	   },
	   EQ_0(x) {
		    return ((x) < DP_TOL && (x) > -DP_TOL);
	   },	   
	   GT: (x,y) => {
	        return ( (x)-(y) >  DP_TOL );
	   },
	   GE: (x,y) => {
	        return ( (x)-(y) > -DP_TOL );
	   },
	   EQ: function(x,y) {
	        return ( (x)-(y) <  DP_TOL && (x)-(y) > -DP_TOL );
	   },
	   LT:function(x,y){
	        return ( (x)-(y) < -DP_TOL );
	    },
	   LE:function(x,y){
	        return ( (x)-(y) <  DP_TOL );
	    },
    }

};