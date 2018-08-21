module.exports = function(d2) {
	
	d2.Point = class Point{
		constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new d2.Point(this.x, this.y);
        }
		translate(vec) {       
		       this.x += vec.x;
		       this.y += vec.y;
		    }
		
		scale(){
				
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
		
		paint(g2){
		  d2.utils.drawCrosshair(g2,10,[this]);
		}
	}

}