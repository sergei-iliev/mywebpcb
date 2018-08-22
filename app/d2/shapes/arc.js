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
        
        get end() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate((this.startAngle+this.endAngle), this.pc);
            return p0;
        }
        
        get sweep(){
        	return Math.abs(this.endAngle);
        }
        get box(){
          return new d2.Box([this.start,this.end,this.middle]);      	
        }
        contains(pt){
        	//is outside of the circle
        	if (d2.utils.GE(this.pc.distanceTo(pt), this.r)){
                return false;
        	}    
        	//check polygon between 3 points
        	let polygon=new d2.Polygon();
        	polygon.add(this.pc);
        	polygon.add(this.start);
        	polygon.add(this.end);
        	if(polygon.contains(pt)){
        		return false;
        	}
        	
        	let angle =360- (new d2.Vector(this.pc, pt).slope);        	
        	let sweep=this.sweep

        	if(this.endAngle>0){
        		if((this.startAngle+sweep)>360){
        			sweep=(this.startAngle+sweep)-360;                	  	
        			return (d2.utils.GE(angle,this.startAngle)||d2.utils.GE(sweep,angle));
        		}else{
        			return (d2.utils.GE(angle,this.startAngle)&&d2.utils.GE(this.startAngle+sweep,angle));
        		}
        	}else{
        		if((this.startAngle-this.sweep)>0){
        		   return (d2.utils.GE(this.startAngle,angle)&&d2.utils.GE(angle,this.startAngle-this.sweep));
        		}else{
        		   sweep=360-(this.sweep-this.startAngle);                	  		        		   
        		   return (d2.utils.GE(this.startAngle,angle)||d2.utils.GE(angle,sweep));
        		}
        	}
        	
        }
        move(offsetX,offsetY){
          this.pc.move(offsetX,offsetY);	
        }
        rotate(angle,center = {x:0, y:0}){
        	 this.pc.rotate(angle,center);
        	 this.startAngle+=angle;
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
        	
        	console.log(this.startAngle);
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
        	g2.stroke();
        	
            //let ps=this.start;
            //let pe=this.end;
            //let pm=this.middle;
            //d2.utils.drawCrosshair(g2,5,[ps,pe,pm]);
        }
        

    }
}