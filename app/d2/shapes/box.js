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
//          if (args[0] instanceof d2.Point) {
//        	  let x=Number.MAX_VALUE,y=Number.MAX_VALUE;
//        	  for(var i = 0; i < arguments.length; ++ i){
//        	     x=Math.min(x,arguments[i].x);
//        	     y=Math.min(y,arguments[i].y);
//        	  }  
//        	  this.min=new d2.Point(x,y);
//
//        	  x=Number.MIN_VALUE,y=Number.MIN_VALUE;
//        	  for(var i = 0; i < arguments.length; ++ i){
//         	     x=Math.max(x,arguments[i].x);
//         	     y=Math.max(y,arguments[i].y);
//         	  }  
//        	  this.max=new d2.Point(x,y);
//        	  
//          }
	  }
	  setRect(x,y,width,height){
		  this.min=new d2.Point(x,y);
		  this.max=new d2.Point(x+width,y+height);
	  }
      get center() {
          return new d2.Point( (this.min.x + this.max.x)/2, (this.min.y + this.max.y)/2 );
      }
      
      get width(){
    	  return this.max.x-this.min.x;
      }
      
      get height(){
    	  return this.max.y-this.min.y;
      }
      contains(pt){
    	  if(this.min.x<=pt.x&&pt.x<=this.max.x){
    	    if(this.min.y<=pt.y&&pt.y<=this.max.y)
    		  return true;
    	  }
    	  return false;
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