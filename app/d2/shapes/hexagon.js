module.exports = function(d2) {

    d2.Hexagon = class Hexagon extends d2.Polygon {
    	constructor(center,width) {
    		super();
    		this.center=center;
    		this.width=width;    		
    		this.reset();
    	}
    	clone(){
    		let copy=new Hexagon(this.center.clone(),this.width);    	    
    		copy.points=[];
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    		return copy;
    	}
        assign(drawing) {
        this.center.set(drawing.center);                        
        this.width=drawing.width;
        	for(let i=0;i<this.points.length;i++) {
        		this.points[i].set(drawing.points[i]);
    	    }
	    }     
    	scale(alpha){
        	this.center.scale(alpha);
        	this.width*=alpha;  
        	super.scale(alpha);        	              	  
        }    	
		setWidth(width){
			  this.width=width;
			  this.reset();			    
		}
		grow(offset) {
		       this.width += 2 * offset;
		       let a =(2*offset)/Math.sqrt(3);
		            

		       let v=new d2.Vector(0,0);
		        
		            for(i=0;i<this.points.length;i++){
		                v.set(this.center, this.points[i]);
		                let norm = v.normalize();
		                let x = this.points[i].x + a * norm.x;
		                let y = this.points[i].y + a * norm.y;
		        
		                this.points[i].set(x, y);
		            }
		            
		            
		}		
        move(offsetX,offsetY){
        	this.center.move(offsetX,offsetY);
            this.points.forEach(point=>{
            	point.move(offsetX,offsetY);
            });	
        }        
        mirror(line) {        
          super.mirror(line);
          this.center.mirror(line);
        }
		rotate(angle,center = {x:this.center.x, y:this.center.y}){
			this.center.rotate(angle,center);
			super.rotate(angle,center);
		}        
    	reset(){
    		this.points=[];
    		
            let da = (2 * Math.PI) / 6;
            let lim = (2 * Math.PI) - (da / 2);

            let r=this.width/2;
            var point=new d2.Point(r * Math.cos(0), r * Math.sin(0));
            point.move(this.center.x,this.center.y);            
            this.add(point);
			for (let a = da; a < lim; a += da) {
                point=new d2.Point(r * Math.cos(a),r * Math.sin(a));
                point.move(this.center.x,this.center.y);
                this.add(point);
			}      		
    	}
   	
    	
    	
    }
}