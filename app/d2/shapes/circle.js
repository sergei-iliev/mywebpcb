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
		   return [new d2.Point(this.pc.x-this.r,this.pc.y),new d2.Point(this.pc.x,this.pc.y-this.r),new d2.Point(this.pc.x+this.r,this.pc.y),new d2.Point(this.pc.x,this.pc.y+this.r)];
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