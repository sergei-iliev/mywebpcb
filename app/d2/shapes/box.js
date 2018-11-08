module.exports = function(d2) {

  d2.Box = class Box {
	  constructor(...args) {
          if (typeof(args[0]) == "number") {   // 4 numbers for min and max points
              this.min = new d2.Point(args[0],args[1]);
              this.max = new d2.Point(args[2],args[3]);
              return;
          }
          
          if(arguments.length==1){              //array of points
        	  let x=Number.MAX_VALUE,y=Number.MAX_VALUE;
        	  for(var i = 0; i < arguments[0].length; ++ i){
        	     x=Math.min(x,arguments[0][i].x);
        	     y=Math.min(y,arguments[0][i].y);
        	  }  
        	  this.min=new d2.Point(x,y);

        	  x=Number.MIN_VALUE,y=Number.MIN_VALUE;
        	  for(var i = 0; i < arguments[0].length; ++ i){
         	     x=Math.max(x,arguments[0][i].x);
         	     y=Math.max(y,arguments[0][i].y);
         	  }  
        	  this.max=new d2.Point(x,y);
        	  return;
          }
	  }
	  static fromRect(x,y,width,height){
			var box=new d2.Box(0,0,0,0);
			box.setRect(x,y,width,height);
			return box;
	  }
	  clone(){
		  return new d2.Box([this.min,this.max]);
	  }
	  setRect(x,y,width,height){
		  this.min.set(x,y);
		  this.max.set(x+width,y+height);
	  }
      get center() {
          return new d2.Point( (this.min.x + this.max.x)/2, (this.min.y + this.max.y)/2 );
      }
      get x(){
    	 return this.min.x; 
      }
      get y(){
    	  return this.min.y; 
      }
      get width(){
    	  return this.max.x-this.min.x;
      }
      
      get height(){
    	  return this.max.y-this.min.y;
      }
      scale(alpha){
    	this.min.scale(alpha);
    	this.max.scale(alpha);
      }
      contains(...args){
    	if(args.length==1){  //point  
    	  if(this.min.x<=args[0].x&&args[0].x<=this.max.x){
    	    if(this.min.y<=args[0].y&&args[0].y<=this.max.y)
    		  return true;
    	  }
    	  return false;
    	}else{       //coordinates
      	  if(this.min.x<=args[0]&&args[0]<=this.max.x){
      	    if(this.min.y<=args[1]&&args[1]<=this.max.y)
      		  return true;
      	  }
      	  return false;    		
    	}  
      }
      not_intersects(other) {
          return (
              this.max.x < other.min.x ||
              this.min.x > other.max.x ||
              this.max.y < other.min.y ||
              this.min.y > other.max.y
          );
      }
      move(offsetX,offsetY){
    	  this.min.move(offsetX,offsetY);
    	  this.max.move(offsetX,offsetY);
      }
      intersects(other) {
    	  if (other instanceof d2.Box) {
    		  return !this.not_intersects(other);  
    	  }else{
    		  //window rect
    		  let o=new d2.Box(other.x,other.y,other.x+other.width,other.y+other.height);
    		  return !this.not_intersects(o);
    	  }
          
      }
      
	  get vertices() {
		 return [this.min,new d2.Point(this.max.x,this.min.y),this.max,new d2.Point(this.min.x,this.max.y)];	
	  }
      paint(g2){
    	    g2.rect(this.min.x,this.min.y,this.width,this.height);                   
	        g2.stroke();
      }
  }
}