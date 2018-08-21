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
       get center() {
           return this.pc;
       }
       contains(pt){
    	   return d2.utils.LE(pt.distanceTo(this), this.r);    	   
       }
       rotate(angle,center = {x:0, y:0}){
    	  this.pc.rotate(angle,center);    	  
       }
       move(offX,offY){
    	  this.pc.move(offX,offY); 
       }
       mirror(line){
    	   this.pc.mirror(line);
       }
       paint(g2){
       	g2.beginPath();       	
       	g2.arc(this.pc.x,this.pc.y,this.r,0,2*Math.PI,true);
       	g2.stroke();
       }       
       
    }
}    