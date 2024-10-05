module.exports = function(d2) {
    /**
    *
    * @param {Point} pc - arc center
    * @param {number} w - horizontal radius
    * @param {number} w - vertical radius
    * @param {number} startAngle - start angle in degrees from 0 to 360
    * @param {number} endAngle - end angle in degrees from -360 to 360        
    */
    d2.Arcellipse = class Arcellipse extends d2.Ellipse {
        constructor(pc,w,h) {
      	    super(pc,w,h);    	
            this.startAngle = 20;
            this.vert=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)];
            this.endAngle = 190;           
        }
        clone(){
        	let copy=new d2.Arcellipse(this.pc.clone(),this.w,this.h);
            copy.startAngle = this.startAngle;
            copy.endAngle = this.endAngle;
        	copy.rotation=this.rotation;
        	return copy;
        }
        get center(){
        	return this.pc;
        }
        get start() {
        	let angles=this._convert(this.startAngle,this.endAngle);
            let x=this.pc.x+(this.w*Math.cos(d2.utils.radians(angles[0])));
            let y=this.pc.y+(this.h*Math.sin(d2.utils.radians(angles[0])));
            
            let p=new d2.Point(x,y);
            p.rotate(this.rotation,this.pc);
            return  p;
        }
        get sweep(){        
        	return Math.abs(this.endAngle);
		}
        get middle() {
            let angle = this.endAngle>0 ? this.startAngle + this.sweep/2 : this.startAngle - this.sweep/2;
        
			let x=this.pc.x+(this.w*Math.cos(-1*d2.utils.radians(angle)));
			let y=this.pc.y+(this.h*Math.sin(-1*d2.utils.radians(angle)));
        
			let p=new d2.Point(x,y);
			p.rotate(this.rotation,this.pc);
			return  p;       
		}		
        get end() {
        	let angles=this._convert(this.startAngle,this.endAngle);
            let x=this.pc.x+(this.w*Math.cos(d2.utils.radians(angles[1])));
            let y=this.pc.y+(this.h*Math.sin(d2.utils.radians(angles[1])));
            
            let p=new d2.Point(x,y);
            p.rotate(this.rotation,this.pc);
            return  p; 
        }
        get vertices(){        	
            this.vert[0].set(this.pc.x-this.w,this.pc.y);
            this.vert[1].set(this.pc.x,this.pc.y-this.h);
            this.vert[2].set(this.pc.x+this.w,this.pc.y);
            this.vert[3].set(this.pc.x,this.pc.y+this.h);       	        	
            let s=this.start;
            let e=this.end;
            this.vert[4].set(s.x,s.y);
            this.vert[5].set(e.x,e.y);   
            return this.vert;
        }
        contains( x,  y) {    
    		var c=super.contains(x, y);
    		if(!c) {
    			return c;
    		}
    	
        	let l=new d2.Line(this.start,this.end);
        	let result=l.isLeftOrTop(this.middle);
        	//are they on the same line side?
        	return (l.isLeftOrTop(new d2.Point(x,y))==result);    	    	
        }
        
        isPointOn(pt,diviation){
    	//same as ellipse
        let alpha=-1*d2.utils.radians(this.rotation);
        let cos = Math.cos(alpha),
        sin = Math.sin(alpha);
        let dx  = (pt.x - this.pc.x),
        dy  = (pt.y - this.pc.y);
        let tdx = cos * dx + sin * dy,
        tdy = sin * dx - cos * dy;

       
        let pos= (tdx * tdx) / (this.w * this.w) + (tdy * tdy) / (this.h * this.h);
        
        
        let v=new d2.Vector(this.pc,pt);
	    let norm=v.normalize();			  
		//1.in
	    if(pos<1){
		    let xx=pt.x +diviation*norm.x;
			let yy=pt.y +diviation*norm.y;
			//check if new point is out
			if(super.contains(xx,yy)){
				return false;
			}
	    }else{  //2.out
		    let xx=pt.x - diviation*norm.x;
			let yy=pt.y - diviation*norm.y;
			//check if new point is in
			if(!this.contains(xx,yy)){
				return false;
			}		    	
	    }    	
        //narrow down to start and end point/angle
        	let start=new d2.Vector(this.pc,this.start).slope;
        	let end=new d2.Vector(this.pc,this.end).slope;        	        	        	        	
        	let clickedAngle =new d2.Vector(this.pc,pt).slope;
        	
        	if(this.endAngle>0){
        	  if(start>end){
        		  return (start>=clickedAngle)&&(clickedAngle>=end);	
        	  }else{
        		  return !((start<=clickedAngle)&&(clickedAngle<=end));        		  
        	  }
        	}else{
        	 if(start>end){
    			return !((start>=clickedAngle)&&(clickedAngle>=end));
    		 }else{        			
    			return (start<=clickedAngle)&&(clickedAngle<=end);
    		 }        		
        	}       	        	        	        	
        }
        _convert(start,extend){
    		
    		let s = 360 - start;
    		let e=0;
    		if(extend>0){
    		 e = 360 - (start+extend); 
    		}else{
    		 if(start>Math.abs(extend)){  	
    		   e = s+Math.abs(extend); 
    		 }else{
               e = Math.abs(extend+start);   		 
    		 }		 
    		}
    		return  [s,e];
        } 
        mirror(line){
        	this.pc.mirror(line);
        	this.endAngle=-1*this.endAngle;
        	if(line.isVertical){
        		if(this.startAngle>=0&&this.startAngle<=180){
        		  this.startAngle=180-this.startAngle;  
        		}else{
        		  this.startAngle=180+(360-this.startAngle);		
        		}
        	}else{
        		this.startAngle=360-this.startAngle; 
        	}	
        	
        }        
        paint(g2){
        	g2.beginPath();  
           	
        	//d2.utils.drawCrosshair(g2,5,[this.start,this.end]);
        	
           	let alpha=this.convert(this.rotation);           	
           	let angles=this._convert(this.startAngle,this.endAngle);
           
           	
           	g2.beginPath();
           	g2.ellipse(this.pc.x,this.pc.y,this.w, this.h,alpha,d2.utils.radians(angles[0]), d2.utils.radians(angles[1]),this.endAngle>0);
        	  if(g2._fill!=undefined&&g2._fill){
            	  g2.fill();	
              }else{
            	  g2.stroke();
              }
        }         
        
    }
}