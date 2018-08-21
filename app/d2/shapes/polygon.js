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
        contains(pt){
          let x=pt.x;
          let y=pt.y;
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
        rotate(angle,center = {x:0, y:0}){
            this.points.forEach(point=>{
            	point.rotate(angle,center);
            });
        }
        paint(g2){
        	g2.beginPath();
        	g2.moveTo(this.points[0].x,this.points[0].y);
        	for (var i = 1; i < this.points.length; i++) {
        						g2.lineTo(this.points[i].x, this.points[i].y);
        	}
        	g2.closePath();                  
            g2.stroke();
        }
    }
}