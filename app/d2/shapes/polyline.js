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