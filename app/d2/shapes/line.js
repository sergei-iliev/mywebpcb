module.exports = function(d2) {
	
	d2.Line = class Line{
		constructor(p1,p2) {
			this.p1=p1;
			this.p2=p2;
		}
	    /*
	     * Find point belonging to line, which the pt projects on.
	     */
		projectionPoint(pt){
			let v1=new d2.Vector(this.p1,pt);
			let v2=new d2.Vector(this.p1,this.p2); 	
		    
			let v=v1.projectionOn(v2);
	    	//translate point
			let x=this.p1.x +v.x;
			let y=this.p1.y +v.y;
		    return new d2.Point(x,y);
		}
		get isHorizontal(){
			let v=new d2.Vector(this.p1,this.p2);
			let oy=new d2.Vector(1,0);
			//are they colinear?
			return d2.utils.EQ(v.cross(oy),0);			
		}
		get isVertical(){
			let v=new d2.Vector(this.p1,this.p2);
			let oy=new d2.Vector(0,1);
			//are they colinear?
			return d2.utils.EQ(v.cross(oy),0);
		}
        rotate(angle,center){            
            this.p1.rotate(angle,center);
            this.p2.rotate(angle,center);            
        }
        
		paint(g2){			
			g2.moveTo(this.p1.x, this.p1.y);
			g2.lineTo(this.p2.x, this.p2.y);
			
			g2.stroke();
		}
	
	}
}