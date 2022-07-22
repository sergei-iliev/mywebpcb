module.exports = function(d2) {
	d2.Polyline = class{
	   constructor(){
		 this.points = [];
		   
	   }
   	   clone(){
   			let copy=new d2.Polyline();
   			this.points.forEach(function(point){
   				copy.points.push(point.clone());
   			});  
   			return copy;	
   	   }
   	   remove(x,y){
       	let item=new d2.Point(x,y);
   		var tempArr = this.points.filter(function(point) { 
    	    return ! point.equals(item);
    	});
   		this.points=tempArr;
   	   }
	   add(...args){
          if(args.length==1){//point               
               this.points.push(new d2.Point(args[0].x,args[0].y));  
          }else{	   //coordinates             
             this.points.push(new d2.Point(args[0],args[1]));              
          }		   
		 
	   }
       move(offsetX,offsetY){
           this.points.forEach(point=>{
           	point.move(offsetX,offsetY);
           });	
       }
       mirror(line){
       	this.points.forEach(point=>{
           	point.mirror(line);
           });        	
       }
       scale(alpha){
           this.points.forEach(point=>{
           	point.scale(alpha);
           });        	
       }
       rotate(angle,center = {x:0, y:0}){
           this.points.forEach(point=>{
           	point.rotate(angle,center);
           });
       }
       isPointOn(pt,diviation){
    		  var result = false;
    			// build testing rect
    		  
    		  var rect = d2.Box.fromRect(pt.x
    									- (diviation / 2), pt.y
    									- (diviation / 2), diviation,
    									diviation);
    		  var r1 = rect.min;
    		  var r2 = rect.max;

    		  // ***make lines and iterate one by one
    		  var prevPoint = this.points[0];

    		  this.points.some(function(wirePoint) {
    								// skip first point
    								{
    									if (d2.utils.intersectLineRectangle(
    											prevPoint, wirePoint, r1, r2)) {
    										result = true;
    										return true;
    									}
    									prevPoint = wirePoint;
    								}

    							});

    		return result;
    	   
       }
       intersect(shape){
    	   let segment=new d2.Segment(0,0,0,0);
    	   if(shape instanceof d2.Circle){
    	          let prevPoint = this.points[0];        
    	          for(let point of this.points){    	        	  
    	              if(prevPoint.equals(point)){    	            	  
    	            	  prevPoint = point;
    	                  continue;
    	              }    	              
    	              segment.set(prevPoint.x,prevPoint.y,point.x,point.y);
    	              if(segment.intersect(shape)){
    	                  return true;
    	              }
    	              prevPoint = point;
    	          }
    		   
    	   }
    	   
       }
       get box(){
         return new d2.Box(this.points);	
       }
	   get vertices() {
		    return this.points;	
	   } 
       isPointOnSegment(pt,diviation){    	       
     	  let segment=new d2.Segment(0,0,0,0);	   
	          let prevPoint = this.points[0];        
	          for(let point of this.points){    	        	  
	              if(prevPoint.equals(point)){    	            	  
	            	  prevPoint = point;
	                  continue;
	              }    	              
	              segment.set(prevPoint.x,prevPoint.y,point.x,point.y);
	              if(segment.isPointOn(pt,diviation)){
	                  return true;
	              }
	              prevPoint = point;
	          }		
	          
	          return false;
       } 	   
	   paint(g2){
		  g2.beginPath(); 
		  g2.moveTo(this.points[0].x, this.points[0].y);
		  
 		  this.points.forEach((point)=>{
			 g2.lineTo(point.x, point.y); 			  
 		  });
		  

		  g2.stroke();
	   }
	   
	}
	
}