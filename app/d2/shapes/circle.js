
module.exports = function(d2) {

    d2.Circle = class Circle {
        /**
        *
        * @param {Point} pc - circle center point
        * @param {number} r - circle radius
        */
       constructor(pc, r) {
           this.pc = pc;
           this.r = r;
           this.vert=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)]
       }
       clone() {
           return new d2.Circle(this.pc.clone(), this.r);
       } 
       assign(drawing) {
    	this.pc.set(drawing.pc);
    	this.r=drawing.r;
       }
       get area(){
           return  ( Math.PI * this.r*this.r );	
       }
       get center() {
           return this.pc;
       }
       get radius(){
    	   return this.r;
       }
       get box() {
           return new d2.Box(
               this.pc.x - this.r,
               this.pc.y - this.r,
               this.pc.x + this.r,
               this.pc.y + this.r
           );
       }       
	   get vertices() {
		  this.vert[0].x=this.pc.x-this.r;
          this.vert[0].y=this.pc.y;
		  this.vert[1].x=this.pc.x;
          this.vert[1].y=this.pc.y-this.r;
		  this.vert[2].x=this.pc.x+this.r;
		  this.vert[2].y=this.pc.y;
          this.vert[3].x=this.pc.x;
		  this.vert[3].y=this.pc.y+this.r;
          return this.vert;
	   }
       contains(pt){
    	   return d2.utils.LE(pt.distanceTo(this), this.r);    	   
       }
       isPointOn(pt,diviation){
		  //test distance
		  let dist=this.pc.distanceTo(pt);
		  return ((this.r-diviation)<dist&&(this.r+diviation)>dist);
	   }
       rotate(angle,center = {x:this.pc.x, y:this.pc.y}){
    	  this.pc.rotate(angle,center);    	  
       }
       move(offX,offY){
    	  this.pc.move(offX,offY); 
       }
       mirror(line){
    	   this.pc.mirror(line);
       }
       scale(alpha){
    	   this.pc.scale(alpha);
    	   this.r*=alpha;
       }
       resize(xoffset, yoffset, point) {
        let radius=this.r;

        if(d2.utils.EQ(point.x,this.pc.x)){
          if(point.y>this.pc.y){
                  radius+=yoffset;
          }else{
                  radius-=yoffset;  
          }     
        }
        if(d2.utils.EQ(point.y,this.pc.y)){
            if(point.x>this.pc.x){
                  radius+=xoffset;
            }else{
                  radius-=xoffset;  
            }   
        }
        if(radius>0){ 
          this.r=radius;
        }       
        for(let p of this.vertices){
        	if(point==p) {
        		return p;
        	}
        }
        return null;
    }    
    grow(offset){
     	  this.r+=offset; 
       }
       paint(g2){
       	g2.beginPath();       	
       	g2.arc(this.pc.x,this.pc.y,this.r,0,2*Math.PI,true);
    	  if(g2._fill!=undefined&&g2._fill){
        	  g2.fill();	
          }else{
        	  g2.stroke();
          }
       }       
       
    }
}    