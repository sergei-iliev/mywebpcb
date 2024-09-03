module.exports = function(d2) {
	
	d2.Point = class Point{
		constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new d2.Point(this.x, this.y);
        }
        set(...args){
           if(args.length==1){//point
             this.x=args[0].x;
             this.y=args[0].y;
           }else{	   //coordinates
            this.x=args[0];
            this.y=args[1];
           }
        }
//		translate(vec) {       
//		       this.x += vec.x;
//		       this.y += vec.y;
//		    }
		
		/**
	     * Returns new point translated by given vector.
	     * Translation vector may by also defined by a pair of numbers.
	     * @param {Vector} vector - Translation vector defined as Flatten.Vector or
	     * @param {number|number} - Translation vector defined as pair of numbers
	     * @returns {Point}
	     */
	    translate(...args) {
	        if (args.length == 1 &&(args[0] instanceof d2.Vector || !isNaN(args[0].x) && !isNaN(args[0].y))) {
	            this.x += args[0].x;
	            this.y += args[0].y;
	        }

	        if (args.length == 2 && (typeof (args[0]) == "number") && (typeof (args[1]) == "number")) {
	           this.x += args[0];
	           this.y += args[1];
	        }
	    }		
	    /**
	     * Returns bounding box of a point
	     * @returns {Box}
	     */
	    get box() {
	        return new d2.Box(this.x, this.y, this.x, this.y);
	    }	    
		scale(alpha){
		       this.x *=alpha;
		       this.y *=alpha;		  		
		}
        /**
         * rotates by given angle around given center point.
         * If center point is omitted, rotates around zero point (0,0).
         * Positive value of angle defines rotation in counter clockwise direction,
         * negative angle defines rotation in clockwise clockwise direction
         * @param {number} angle - angle in degrees
         * @param {Point} [center=(0,0)] center
         */
		rotate(angle, center = {x:0, y:0}) {
			    
		        let a=-1*d2.utils.radians(angle);		        
			    let x_rot = center.x + (this.x - center.x) * Math.cos(a) - (this.y - center.y) * Math.sin(a);
		        let y_rot = center.y + (this.x - center.x) * Math.sin(a) + (this.y - center.y) * Math.cos(a);
	            
		        this.x=x_rot;
		        this.y=y_rot;
		    }
		move(offsetX,offsetY){
	        this.x+=offsetX;
	        this.y+=offsetY;	
		}   
		/*
		 * Mirror point around horizontal or vertical line
		 */
		mirror(line){
		 let prj=line.projectionPoint(this);
		 let v=new d2.Vector(this,prj);
		 prj.translate(v); 
		 this.x=prj.x;
		 this.y=prj.y;	
		}
		distanceTo(shape) {
		        if (shape instanceof d2.Point) {
		            let dx = shape.x - this.x;
		            let dy = shape.y - this.y;
		            return Math.sqrt(dx*dx + dy*dy);
		        }	
	            if (shape instanceof d2.Circle) {
		            let dx = shape.center.x - this.x;
		            let dy = shape.center.y - this.y;
		            return Math.sqrt(dx*dx + dy*dy);	               
	            }
		}
		
		/**
	     * Returns true if point is on a shape, false otherwise
	     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon
	     * @returns {boolean}
	     */
	    on(shape) {
	        if (shape instanceof d2.Point) {
	            return this.equalTo(shape);
	        }

//	        if (shape instanceof Flatten.Line) {
//	            return shape.contains(this);
//	        }
//
//	        if (shape instanceof Flatten.Circle) {
//	            return shape.contains(this);
//	        }
//
//	        if (shape instanceof Flatten.Segment) {
//	            return shape.contains(this);
//	        }

	        if (shape instanceof d2.Arc) {
	            return shape.contains(this);
	        }

	        if (shape instanceof d2.Polygon) {
	            return shape.contains(this);
	        }
	    }
		
        equals(pt) {
            return d2.utils.EQ(this.x, pt.x) && d2.utils.EQ(this.y, pt.y);
        }
        toString(){
           return this.x+","+this.y;	
        }
		paint(g2){
		  d2.utils.drawCrosshair(g2,10,[this]);
		}
	}

}