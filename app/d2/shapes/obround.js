module.exports = function(d2) {
	
	d2.Obround = class Obround{
		/**
		 * Obround is regarded as a line with variable thickness
		 * @input pt - center 
		 * @input width - relative,  line width + 2  arcs at both ends
		 * this.width=ps to pe + 2 rcs radius
		 * @input height - relative but still height
		 * @warning obround may change its width and height - it should recalculate its size
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
		get box(){
			 let r=this.getDiameter()/2;
	         //first point		 
			 let v=new d2.Vector(this.pe,this.ps);
			 let n=v.normalize();
			 let a=this.ps.x +r*n.x;
			 let b=this.ps.y +r*n.y;			 
			 
			 			 
			 v.rotate90CW();
			 let norm=v.normalize();
			 
			 let x=a +r*norm.x;
			 let y=b +r*norm.y;			 
			 let pa=new d2.Point(x,y);
			 
			 norm.invert();
			 x=a +r*norm.x;
			 y=b +r*norm.y;			 
			 let pb=new d2.Point(x,y);
			 //second point
			 v=new d2.Vector(this.ps,this.pe);
			 n=v.normalize();
			 let c=this.pe.x +r*n.x;
			 let d=this.pe.y +r*n.y;			 
			 
			 v.rotate90CW();
			 norm=v.normalize();
			 
			 x=c +r*norm.x;
			 y=d +r*norm.y;			 
			 let pc=new d2.Point(x,y);
			 
			 norm.invert();
			 x=c +r*norm.x;
			 y=d +r*norm.y;			 
			 let pd=new d2.Point(x,y);
			 
			 return new d2.Box(
		                [
		                pa,pb,pc,pd]
		            );			
		}

		setSize(width,height){
			  this.height=height;
			  this.width=width;
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
		    //arc diameter
		    let r=(this.width>this.height?this.height:this.width);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(r/2)){
		        	return true;
		        }    
		    	
		    }
        	
		    //check the 2 circles
        	if (d2.utils.LE(this.ps.distanceTo(pt), r/2)){
                return true;
        	}
        	if (d2.utils.LE(this.pe.distanceTo(pt), r/2)){
                return true;
        	}
        	return false;
		    
		}
		get center(){
			return this.pc;
		}		
		reset(){			
			let w=0,h=0;
			if(this.width>this.height){  //horizontal
			  w=this.width;
			  h=this.height;
   			  let d=(w-h);//always positive
			  this.ps=new d2.Point(this.pc.x-(d/2),this.pc.y);
			  this.pe=new d2.Point(this.pc.x+(d/2),this.pc.y);								   	
			}else{						 //vertical
			  w=this.height;
			  h=this.width;
  			  let d=(w-h);//always positive
			  this.ps=new d2.Point(this.pc.x,this.pc.y-(d/2));
			  this.pe=new d2.Point(this.pc.x,this.pc.y+(d/2));								   				  
			}
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
        mirror(line){
            this.pc.mirror(line);
            this.ps.mirror(line);
            this.pe.mirror(line);        
        }    	
        move(offsetX,offsetY){
            this.pc.move(offsetX,offsetY);
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);
        }  
	    grow(offset){
	        if(d2.utils.GE(this.width,this.height)){
	            this.height +=  2*offset;
	        } else {
	            this.width +=  2*offset;
	        }
	    }
	    getDiameter(){
	        if(d2.utils.GE(this.width,this.height)){
	            return this.height;
	        } else {
	            return this.width;
	        }
	    }
	    
		paint(g2){
			g2.beginPath();
			let l=g2.lineWidth;
			g2.lineWidth=this.getDiameter();
			g2.lineCap="round";
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();		    
			g2.lineWidth =l;
		}
			
	}
}