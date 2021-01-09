module.exports = function(d2) {
	
	d2.Segment = class Segment{
		constructor(...args) {
            if (args.length == 2 && args[0] instanceof d2.Point && args[1] instanceof d2.Point) {
                this.ps = args[0].clone();
                this.pe = args[1].clone();
                return;
            }

            if (args.length == 4) {
                this.ps = new d2.Point(args[0], args[1]);
                this.pe = new d2.Point(args[2], args[3]);
                return;
            }
        }
        clone() {
            return new Segment(this.ps, this.pe);
        }
        set(x1,y1,x2,y2){
        	this.ps.set(x1,y1);
        	this.pe.set(x2,y2);
        }
        get length() {
            return this.ps.distanceTo(this.pe);
        } 
        get box() {
            return new d2.Box(
                Math.min(this.ps.x, this.pe.x),
                Math.min(this.ps.y, this.pe.y),
                Math.max(this.ps.x, this.pe.x),
                Math.max(this.ps.y, this.pe.y)
            )
        }
		get isHorizontal(){						
			return d2.utils.EQ(this.ps.y,this.pe.y);			
		}
		get isVertical(){
			return d2.utils.EQ(this.ps.x,this.pe.x);
		}        
        middle() {
            return new d2.Point((this.ps.x + this.pe.x)/2, (this.ps.y + this.pe.y)/2);
        }
        translate(vec) {
            this.ps.translate(vec);
            this.pe.translate(vec);
        }
        contains(pt){
      	   return false;    	   
        }
        projectionPoint(pt) {
            let v1 = new d2.Vector(this.ps, pt);
            let v2 = new d2.Vector(this.ps, this.pe);

            let v = v1.projectionOn(v2);
            //translate point
            let x = this.ps.x + v.x;
            let y = this.ps.y + v.y;
            return new d2.Point(x, y);
        }        
        intersect(shape){
          if(shape instanceof d2.Circle){  
            let projectionPoint = this.projectionPoint(shape.pc);

            let a = (projectionPoint.x - this.ps.x) / ((this.pe.x - this.ps.x) == 0 ? 1 : this.pe.x - this.ps.x);
            let b = (projectionPoint.y - this.ps.y) / ((this.pe.y - this.ps.y) == 0 ? 1 : this.pe.y - this.ps.y);

            let dist = projectionPoint.distanceTo(shape.pc);
            
            if (0 <= a && a <= 1 && 0 <= b && b <= 1) { //is projection between start and end point
                if (!d2.utils.GT(dist,shape.r)) {
                    return true;
                }
            }
            //end points in circle?
            if (d2.utils.LE(this.ps.distanceTo(shape.pc), shape.r)) {
                return true;
            }
            if (d2.utils.LE(this.pe.distanceTo(shape.pc), shape.r)) {
                return true;
            }        
          }
           
          
          return false;
        }        
        rotate(angle, center = {x:0, y:0}) {
          this.ps.rotate(angle,center);
          this.pe.rotate(angle,center);
        }
        move(offsetX,offsetY){
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);           	
        }
        mirror(line){
        	this.ps.mirror(line);
        	this.pe.mirror(line);
        }
        scale(alpha){
        	this.ps.scale(alpha);
        	this.pe.scale(alpha);        	
        }
		paint(g2){	
			g2.beginPath();
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();
		}
    }
}