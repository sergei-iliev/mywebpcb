module.exports = function(d2) {

    d2.Polygon = class Polygon {
    	constructor() {
    		this.points=[];
    	}
    	clone(){
    	    let copy=new d2.Polygon();
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    	    return copy;	
    	}
    	add(point){
    	    this.points.push(point);	
    	}
        contains(...args){
          let x=0;
          let y=0;

       	  if(args.length==1){//point
                x=args[0].x;
                y=args[0].y;
          }else{	   //coordinates
               x=args[0];
               y=args[1];
          }	
      	  let inside = false;
          // use some raycasting to test hits
          // https://github.com/substack/point-in-polygon/blob/master/index.js
          
    	  //flat out points
    	  let p = [];

          for (let i = 0, il = this.points.length; i < il; i++)
          {
              p.push(this.points[i].x, this.points[i].y);
          }

    	  
    	  let length = p.length / 2;

          for (let i = 0, j = length - 1; i < length; j = i++)
          {
              let xi = p[i * 2];
              let yi = p[(i * 2) + 1];
              let xj = p[j * 2];
              let yj = p[(j * 2) + 1];
              let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);

              if (intersect)
              {
                  inside = !inside;
              }
          }

          return inside;   	   
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
        get box(){
          return new d2.Box(this.points);	
        }
        /*
         * suppose a closed polygon
         */
		get vertices() {
		    return this.points;	
		}       
        isPointOn(pt,diviation){    	       
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
	          //close polygon	
	          segment.set(prevPoint.x,prevPoint.y,this.points[0].x,this.points[0].y);
              if(segment.isPointOn(pt,diviation)){
                  return true;
              }
	          
	          return false;
        } 		
        paint(g2){
	    	g2.beginPath();
	    	g2.moveTo(this.points[0].x,this.points[0].y);
	    	for (var i = 1; i < this.points.length; i++) {
	    						g2.lineTo(this.points[i].x, this.points[i].y);
	    	}
	    	g2.closePath();                    
	    	if(g2._fill!=undefined&&g2._fill){
	        	  g2.fill();	
	        }else{
	        	  g2.stroke();
	        }
        }
    }
}