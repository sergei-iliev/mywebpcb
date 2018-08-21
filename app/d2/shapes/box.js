module.exports = function(d2) {

  d2.Box = class Box {
	  constructor(...args) {
          if (typeof(args[0]) == "number") {
              this.min = new d2.Point(args[0],args[1]);
              this.max = new d2.Point(args[2],args[3]);
              
          }

          if (args[0] instanceof d2.Point) {
        	  let x=Number.MAX_VALUE,y=Number.MAX_VALUE;
        	  for(var i = 0; i < arguments.length; ++ i){
        	     x=Math.min(x,arguments[i].x);
        	     y=Math.min(y,arguments[i].y);
        	  }  
        	  this.min=new d2.Point(x,y);

        	  x=Number.MIN_VALUE,y=Number.MIN_VALUE;
        	  for(var i = 0; i < arguments.length; ++ i){
         	     x=Math.max(x,arguments[i].x);
         	     y=Math.max(y,arguments[i].y);
         	  }  
        	  this.max=new d2.Point(x,y);
        	  
          }
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
	  
  }
}