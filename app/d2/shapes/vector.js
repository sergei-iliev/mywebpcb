module.exports = function(d2) {
	
	d2.Vector = class Vector{
		constructor(...args) {
			 this.x = 0;
	         this.y = 0;
	         
             let a1 = args[0];
             let a2 = args[1];

             if (typeof(a1) == "number" && typeof(a2) == "number") {
                 this.x = a1;
                 this.y = a2;
                 return;
             }

             if (a1 instanceof d2.Point && a2 instanceof d2.Point) {
                 this.x = a2.x - a1.x;
                 this.y = a2.y - a1.y;
                 return;
             }	         
		}
		
		set(...args){
			  if (typeof(args[0]) == "number") {
				  this.x=args[2] - args[0];   //x2-x1
				  this.y=args[3] - args[1];  	//y2-y1
			  }else{
	              this.x = args[1].x - args[0].x;
	              this.y = args[1].y - args[0].y;
			  }       
		} 
		
        clone() {
            return new Vector(this.x, this.y);
        }
        
        get length() {
            return Math.sqrt(this.dot(this));
        }        
        
        /**
         * Returns scalar product (dot product) of two vectors <br/>
         * <code>dot_product = (this * v)</code>
         */
        dot(v) {
            return ( this.x * v.x + this.y * v.y );
        }
        
        /**
         * Returns vector product (cross product) of two vectors <br/>
         * <code>cross_product = (this x v)</code>
         */
        cross(v) {
            return ( this.x * v.y - this.y * v.x );
        } 
        /**
         * Slope of the vector in degrees from 0 to 360
         */
        get slope() {
            let angle = Math.atan2(this.y, this.x);
            if (angle<0) angle = 2*Math.PI + angle;
            
            return d2.utils.degrees(angle);
        }
        invert() {
            this.x=-this.x;
            this.y=-this.y;
        }
        /**
         * Returns unit vector.<br/>
         */
        normalize() {            
            return ( new Vector(this.x / this.length, this.y / this.length) );            
        }        
        /**
         * Returns new vector rotated by given angle,
         * positive angle defines rotation in counter clockwise direction,
         * negative - in clockwise direction
         */
        rotate(angle) {
            let point = new d2.Point(this.x, this.y);
            point.rotate(angle);
            this.x=point.x
            this.y=point.y;
        }        
        /**
         *rotate 90 degrees counter clockwise         
         */
        rotate90CCW() {
        	let x=this.x;
        	let y=this.y;
            this.x=-1*y;
            this.y= x;
        }    
        /**
         * rotate 90 degrees clockwise
         */
        rotate90CW() {
        	let x=this.x;
        	let y=this.y;        	
            this.x=y;
            this.y=-1*x;
        };
        
        /**
         * Return angle between this vector and other vector. <br/>
         * Angle is measured from 0 to 2*PI in the counter clockwise direction
         * from current vector to other.
         */
        angleTo(v) {
            let norm1 = this.normalize();
            let norm2 = v.normalize();
            let angle = Math.atan2(norm1.cross(norm2), norm1.dot(norm2));
            if (angle<0) angle += 2*Math.PI;
            return d2.utils.degrees(angle);
        }
        /**
         * Return vector projection of the current vector on another vector
         * @param {Vector} v Another vector
         * @returns {Vector}
         */
        projectionOn(v){
            let n = v.normalize();
            let d = this.dot(n);
            n.multiply(d);
            return n;
        }
        isCollinearTo(v){
        	let a=Math.abs(this.x/v.x);
        	let b=Math.abs(this.y/v.y);
        	return d2.utils.EQ(a,b);
        }
        multiply(scalar) {
            this.x=scalar * this.x;
            this.y=scalar * this.y;
        }
        add(v){
        	return new Vector(this.x+v.x,this.y+v.y);
        }

	}
	
}	