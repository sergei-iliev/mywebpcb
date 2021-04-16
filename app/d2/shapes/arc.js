module.exports = function(d2) {

  d2.Arc = class Arc {
        /**
         *
         * @param {Point} pc - arc center
         * @param {number} r - arc radius
         * @param {number} startAngle - start angle in degrees from 0 to 360
         * @param {number} endAngle - end angle in degrees from -360 to 360        
         */
        constructor(pc=new d2.Point(), r=1, startAngle=0, endAngle=360) {
            this.pc = pc;
            this.r = r;
            this.startAngle = startAngle;
            this.endAngle = endAngle;            
        } 
        clone(){
           return new d2.Arc(this.pc.clone(),this.r,this.startAngle,this.endAngle);  	
        }
        get area(){
           return  ( Math.PI * this.r*this.r ) * ( this.sweep / 360 )	
        }
        get center(){
        	return this.pc;
        }
        get start() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate(this.startAngle, this.pc);
            return p0;
        }
                
        get middle() {
            let angle = this.endAngle>0 ? this.startAngle + this.sweep/2 : this.startAngle - this.sweep/2;
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate(angle, this.pc);
            return p0;
        }
        get length() {
            return Math.abs(this.sweep * this.r);
        }
        get end() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate((this.startAngle+this.endAngle), this.pc);
            return p0;
        }
        
        get sweep(){
        	return Math.abs(this.endAngle);
        }
        get box(){
        	let points = [];
            let p1=this.pc.clone();p1.translate(this.r, 0);
            if (p1.on(this)) {
                points.push(p1);
            }            
            let p2=this.pc.clone();p2.translate(0,this.r);
            if (p2.on(this)) {
                points.push(p2);
            }            
            let p3=this.pc.clone();p3.translate(-this.r,0);
            if (p3.on(this)) {
                points.push(p3);
            }
            let p4=this.pc.clone();p4.translate(0,-this.r);
            if (p4.on(this)) {
                points.push(p4);
            }
        	
            points.push(this.start);
            points.push(this.end);
            return new d2.Box(points);
        }
      
        get vertices() {
            return this.box.vertices;
        }
        
        isPointOn(pt,diviation){
    		let isInside=false;
        	let clickedAngle =new d2.Vector(this.pc,pt).slope;    		            		
    		let angle = 360 - clickedAngle;		
    		//test angle		
    	    if(this.endAngle>0){ //counter clockwise    	    	
    	    	if(angle-this.startAngle>0){
    	    	  angle=(angle-this.startAngle);
    	    	}else{
    	    	  angle=((360-this.startAngle)+angle);	
    	    	}
    	    	isInside=(angle<this.endAngle);
    	    }else{ //clockwise    	    	
    	    	if((angle-this.startAngle)>0){
    	    	  angle=((angle-360)-this.startAngle);	
    	    	}else{
    	    	  angle=angle-this.startAngle;
    	    	}
    	    	isInside=(Math.abs(angle)<Math.abs(this.endAngle));
    	    }    		
    		if(!isInside){
    			return false;
    		}
    		//test distance
    		let dist=this.pc.distanceTo(pt);

    		return ((this.r-diviation)<dist&&(this.r+diviation)>dist);
    			    		
        }
        contains(pt){
        	//is on circle
            if (!d2.utils.EQ(this.pc.distanceTo(pt), this.r)){
            	//is outside of the circle
            	if (d2.utils.GE(this.pc.distanceTo(pt), this.r)){
                    return false;
            	}                
            }
        	
            let l=new d2.Line(this.pc,this.middle);
        	let projectionPoint=l.projectionPoint(pt);
        	
        	let mid=new d2.Point((this.start.x+this.end.x)/2,(this.start.y+this.end.y)/2);  
        	
        	let dist1=this.middle.distanceTo(mid);
        	let dist2=this.middle.distanceTo(projectionPoint);
        	
        	return d2.utils.GE(dist1,dist2);

        }
        move(offsetX,offsetY){
          this.pc.move(offsetX,offsetY);	
        }
        rotate(angle,center = {x:0, y:0}){
        	 this.pc.rotate(angle,center);
        	 this.startAngle+=angle;
        	 if(this.startAngle>=360){
        		 this.startAngle-=360;
        	 }
        	 if(this.startAngle<0){
        		 this.startAngle+=360; 
        	 }
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
        scale(alpha){
           this.pc.scale(alpha);
           this.r*=alpha;
        }
        convert(start,extend){
    		
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
        paint(g2){
        	g2.beginPath();
        	//convert to HTML Canvas API
    		let angles=this.convert(this.startAngle,this.endAngle);
        	g2.arc(this.pc.x,this.pc.y,this.r, d2.utils.radians(angles[0]), d2.utils.radians(angles[1]),this.endAngle>0);        	
        	
        	if(g2._fill!=undefined&&g2._fill){
          	  g2.fill();	
          	}else{
          	  g2.stroke();
          	}            
        	
            //let ps=this.start;
            //let pe=this.end;
            //let pm=this.middle;
            //d2.utils.drawCrosshair(g2,5,[p1,p2,p3,p4]);
            
        }
        

    }
}