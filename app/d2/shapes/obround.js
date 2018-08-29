module.exports = function(d2) {
	
	d2.Obround = class Obround{
		/**
		 * @input pt - center 
		 * @input width - relative,  means arc
		 * @input height - relative but still height
		 */
		constructor(pt,width,height) {
			this.pc=pt.clone();
			this.width=width;
			this.height=height;
			this.ps;
			this.pe;
			this.reset();
		}
		clone(){
			let copy=new Obround(this.pc,this.width,this.height);
			copy.ps.x=this.ps.x;
			copy.ps.y=this.ps.y;
			
			copy.pe.x=this.pe.x;
			copy.pe.y=this.pe.y;
			return copy;
		}
		setWidth(width){
			this.width=width;			
		}
		setHeight(height){
		    this.height=height;
		    this.reset();
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){			
			let l=new d2.Line(this.ps,this.pe);
        	let projectionPoint=l.projectionPoint(pt);
			
		    let a=(projectionPoint.x-this.ps.x)/((this.pe.x-this.ps.x)==0?1:this.pe.x-this.ps.x);
		    let b=(projectionPoint.y-this.ps.y)/((this.pe.y-this.ps.y)==0?1:this.pe.y-this.ps.y);
		    
		    let dist=projectionPoint.distanceTo(pt);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(this.width/2)){
		        	return true;
		        }    
		    	
		    }
        	//check the 2 circles
        	if (d2.utils.LE(this.ps.distanceTo(pt), this.width/2)){
                return true;
        	}
        	if (d2.utils.LE(this.pe.distanceTo(pt), this.width/2)){
                return true;
        	}
        	return false;
		    
		}
		reset(){
			this.ps=new d2.Point(this.pc.x-(this.height/2),this.pc.y);
			this.pe=new d2.Point(this.pc.x+(this.height/2),this.pc.y);								   	
		}
    	rotate(angle,center = {x:this.pc.x, y:this.pc.y}){
    	   this.pc.rotate(angle,center);
      	   this.ps.rotate(angle,center);
      	   this.pe.rotate(angle,center);      	   
      	}
    	scale(alpha){
      	  this.pc.scale(alpha);
      	  this.ps.scale(alpha);
      	  this.pe.scale(alpha);
      	  this.width*=alpha;
      	  this.height*=alpha;
      	  
      	}
        move(offsetX,offsetY){
            this.pc.move(offsetX,offsetY);
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);
        }    	
		paint(g2){
			g2.beginPath();
			g2.lineCap="round";
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();		    
			
		}
			
	}
}