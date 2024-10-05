module.exports = function(d2) {

    d2.Ellipse = class Ellipse {
        constructor(pc,w,h) {
            this.pc = pc;
            this.w = w;
            this.h=h;
        	this.vert=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)];        	        	
            this.rotation=0;
        }
        clone(){
        	let copy=new d2.Ellipse(this.pc.clone(),this.w,this.h);
        	copy.rotation=this.rotation;
        	return copy;
        }
        get box(){
        	let topleft=this.pc.clone();
        	topleft.move(-this.w,-this.h);
        	let rect=new d2.Rectangle(topleft,2*this.w,2*this.h);
        	rect.rotate(this.rotation,this.pc);
        	return rect.box;
        }
		rotate(angle,center = {x:this.box.center.x, y:this.box.center.y}){
			this.pc.rotate(angle,center);
			this.rotation=angle;
		}
        scale(alpha){
     	   this.pc.scale(alpha);
     	   this.w*=alpha;
     	   this.h*=alpha;
        }
        isPointOn(pt,diviation){
        	//find where the point is    
        	let x=pt.x;
        	let y=pt.y;
        	let alpha=this.convert(this.rotation);
            var cos = Math.cos(alpha),
                sin = Math.sin(alpha);
            var dx  = (x - this.pc.x),
                dy  = (y - this.pc.y);
            var tdx = cos * dx + sin * dy,
                tdy = sin * dx - cos * dy;

            let pos=(tdx * tdx) / (this.w * this.w) + (tdy * tdy) / (this.h * this.h);
            //is pt on shape
            if(d2.utils.EQ(pos,1)){
            	return true;
            }
            let v=new d2.Vector(this.pc,pt);
		    let norm=v.normalize();			  
			//1.in
		    if(pos<1){
			    let xx=pt.x +diviation*norm.x;
				let yy=pt.y +diviation*norm.y;
				//check if new point is out
				if(!this.contains(new d2.Point(xx,yy))){
					return true;
				}
		    }else{  //2.out
			    let xx=pt.x - diviation*norm.x;
				let yy=pt.y - diviation*norm.y;
				//check if new point is in
				if(this.contains(new d2.Point(xx,yy))){
					return true;
				}		    	
		    }

          	return false;
        }        
        contains(...args) {
	       let x,y;
	       if(args.length==1){
        	  x=args[0].x;
        	  y=args[0].y;		
	       }else{
        	  x=args[0];
        	  y=args[1];				
		   }
        	let alpha=this.convert(this.rotation);
            var cos = Math.cos(alpha),
                sin = Math.sin(alpha);
            var dx  = (x - this.pc.x),
                dy  = (y - this.pc.y);
            var tdx = cos * dx + sin * dy,
                tdy = sin * dx - cos * dy;

            return (tdx * tdx) / (this.w * this.w) + (tdy * tdy) / (this.h * this.h) <= 1;
        }

		resize(offX,offY,pt){
		  if(pt.equals(this.vert[0])){
				let point=this.vert[0];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				let x=pt.x +v.x;
				//let y=pt.y + v.y;
				if(this.pc.x>x){
				  this.w=this.pc.x-x;
				}
		  }else if(pt.equals(this.vert[1])){
				let point=this.vert[1];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				//let x=pt.x +v.x;
				let y=pt.y + v.y;
				if(this.pc.y>y){
				  this.h=this.pc.y-y;
				}
		  }else if(pt.equals(this.vert[2])){
				let point=this.vert[2];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				let x=pt.x +v.x;
				//let y=pt.y + v.y;
				if(x>this.pc.x){
				   this.w=x-this.pc.x;
				}
		  }else{
				let point=this.vert[3];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				//let x=pt.x +v.x;
				let y=pt.y + v.y;
				if(y>this.pc.y){
				   this.h=y-this.pc.y;
				}
		  }
		}
        get vertices(){        	
          this.vert[0].set(this.pc.x-this.w,this.pc.y);
          this.vert[1].set(this.pc.x,this.pc.y-this.h);
          this.vert[2].set(this.pc.x+this.w,this.pc.y);
          this.vert[3].set(this.pc.x,this.pc.y+this.h);        	        	
          return this.vert;
        }
        move(offsetX,offsetY){
            this.pc.move(offsetX,offsetY);       	
        }
        mirror(line){
        	this.pc.mirror(line);	
        }
        convert(a){
          return -1*d2.utils.radians(a);	
        }
        paint(g2){
        	g2.beginPath();  
           	
           	let alpha=this.convert(this.rotation);
           	
           	g2.ellipse(this.pc.x,this.pc.y,this.w, this.h,alpha, 0, 2 * Math.PI);
        	  if(g2._fill!=undefined&&g2._fill){
            	  g2.fill();	
              }else{
            	  g2.stroke();
              }
        }         
        
    }
}