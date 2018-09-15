module.exports = function(d2) {
	/*
	 * rectangle is represented by 4 points
	 */
	d2.Rectangle = class Rectangle extends d2.Polygon{
		constructor(p1,width,height) {
			super();
			this.points.push(p1.clone());     //topleft point
			this.points.push(new d2.Point(p1.x+width,p1.y));
			this.points.push(new d2.Point(p1.x+width,p1.y+height));
			this.points.push(new d2.Point(p1.x,p1.y+height));
		}
		clone(){
    	    let copy=new d2.Rectangle(new d2.Point(0,0),0,0);
    	    copy.points=[];
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    	    return copy;
		}
		reset(width,height){
			let pc=this.box.center;			
			this.points=[];
			this.points.push(new d2.Point(pc.x-(width/2),pc.y-(height/2)));     //topleft point
			this.points.push(new d2.Point(pc.x+(width/2),pc.y-(height/2)));
			this.points.push(new d2.Point(pc.x+(width/2),pc.y+(height/2)));
			this.points.push(new d2.Point(pc.x-(width/2),pc.y+(height/2)));						
		}
		setSize(width,height){
		  this.reset(width,height);			    
		}
		createArc(center, start, end) {
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            
            if (d2.utils.EQ(startAngle, endAngle)) {
                endAngle = 360;
            }
            let r = (new d2.Vector(center, start)).length;
            return new d2.Arc(center, r, startAngle, 90);
        }
        //****TEST************
		eval(g2){
		  //start angle point
//		  let pt=this.points[0];
//		  let v=new d2.Vector(pt,this.points[1]);
//		  let norm=v.normalize();
//		  
//		  let x=pt.x +this.rounding*norm.x;
//		  let y=pt.y + this.rounding*norm.y;
//			
//		  let A=new d2.Point(x,y);
//		  
//		  //d2.utils.drawCrosshair(g2,10,[A]);
//			
//		  //end angle point 
//		   pt=this.points[0];
//		   v=new d2.Vector(pt,this.points[3]);
//		   norm=v.normalize();
//		  
//		   x=pt.x +this.rounding*norm.x;
//		   y=pt.y + this.rounding*norm.y;
//			
//		   let A1=new d2.Point(x,y);
//		  
//		  
//		  // d2.utils.drawCrosshair(g2,10,[A1]);
//		   
//		   //center
//		   v=new d2.Vector(pt,A1);
//		   
//		   x=A.x +v.x;
//		   y=A.y +v.y;
//		   
//		   let C=new d2.Point(x,y);
//		   //d2.utils.drawCrosshair(g2,10,[C]);
			
		   let r=this.findArcPoints(this.points[0],this.points[1],this.points[3]);
		   let arc=this.createArc(r[0],r[1],r[2]);
		   arc.paint(g2);
		   //----------------------RT-------------------------------------
//			//start angle point
//			let pt=this.points[1];
//			let v=new d2.Vector(pt,this.points[2]);
//			let norm=v.normalize();
//			  
//			let x=pt.x +this.rounding*norm.x;
//			let y=pt.y + this.rounding*norm.y;
//				
//			let A=new d2.Point(x,y);
//			  
//			//d2.utils.drawCrosshair(g2,10,[A]);
//			
//			  //end angle point 
//			pt=this.points[1];
//			v=new d2.Vector(pt,this.points[0]);
//			norm=v.normalize();
//			  
//			x=pt.x +this.rounding*norm.x;
//			y=pt.y + this.rounding*norm.y;
//				
//			let A1=new d2.Point(x,y);
//			  
//			  
//			//d2.utils.drawCrosshair(g2,10,[A1]);
//			   //center
//			v=new d2.Vector(pt,A1);
//			   
//			x=A.x +v.x;
//			y=A.y +v.y;
//			   
//			let C=new d2.Point(x,y);
//			//d2.utils.drawCrosshair(g2,10,[C]);
		    
		    r=this.findArcPoints(this.points[1],this.points[2],this.points[0]);   
			arc=this.createArc(r[0],r[1],r[2]);
			arc.paint(g2);	
/*
			//----------------------RB-------------------------------------
			//start angle point
			pt=this.points[2];
			v=new d2.Vector(pt,this.points[1]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A=new d2.Point(x,y);
			  
			//d2.utils.drawCrosshair(g2,10,[A]);			
			  //end angle point 
			pt=this.points[2];
			v=new d2.Vector(pt,this.points[3]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A1=new d2.Point(x,y);			  			  
			//d2.utils.drawCrosshair(g2,10,[A1]);		
			
			   //center
			v=new d2.Vector(pt,A1);			   
			x=A.x +v.x;
			y=A.y +v.y;
			   
			C=new d2.Point(x,y);
			//d2.utils.drawCrosshair(g2,10,[C]);			
*/			
			r=this.findArcPoints(this.points[2],this.points[3],this.points[1]);  
			arc=this.createArc(r[0],r[1],r[2]);
			arc.paint(g2);	
/*			
			//----------------------LB-------------------------------------
			//start angle point
			pt=this.points[3];
			v=new d2.Vector(pt,this.points[2]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A=new d2.Point(x,y);
			  
			//d2.utils.drawCrosshair(g2,10,[A]);
			  //end angle point 
			pt=this.points[3];
			v=new d2.Vector(pt,this.points[0]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A1=new d2.Point(x,y);			  			  
			//d2.utils.drawCrosshair(g2,10,[A1]);				
			   //center
			v=new d2.Vector(pt,A1);			   
			x=A.x +v.x;
			y=A.y +v.y;
			   
			C=new d2.Point(x,y);
			//d2.utils.drawCrosshair(g2,10,[C]);			
*/			
			r=this.findArcPoints(this.points[3],this.points[0],this.points[2]);  
			arc=this.createArc(r[0],r[1],r[2]);			
			arc.paint(g2);	
	
		}
        /**
        *
        * @param {Point} p1 corner point
        * @param {Point} p2 left point
        * @param {Point} p3 right point   
        * @returns {array of arc points[center,start point,end point]}           
        */
		findArcPoints(p1,p2,p3){
			  //start angle point
			  //let pt=this.points[0];
			  let v=new d2.Vector(p1,p2);
			  let norm=v.normalize();
			  
			  let x=p1.x +this.rounding*norm.x;
			  let y=p1.y + this.rounding*norm.y;
				
			  let A=new d2.Point(x,y);
			  
			  //d2.utils.drawCrosshair(g2,10,[A]);
				
			  //end angle point 
			   //pt=this.points[0];
			   v=new d2.Vector(p1,p3);
			   norm=v.normalize();
			  
			   x=p1.x +this.rounding*norm.x;
			   y=p1.y + this.rounding*norm.y;
				
			   let A1=new d2.Point(x,y);
			  
			  
			  // d2.utils.drawCrosshair(g2,10,[A1]);
			   
			   //center
			   v=new d2.Vector(p1,A1);
			   
			   x=A.x +v.x;
			   y=A.y +v.y;
			   
			   let C=new d2.Point(x,y);
			   //d2.utils.drawCrosshair(g2,10,[C]);
			   
			   return [C,A,A1];
			   			
		}
		resize(offX,offY,point){
			if(point==this.points[2]){
	    	//do same
				let pt=this.points[2];
				pt.move(offX,offY);
	    	//do left 
				let v1=new d2.Vector(this.points[0],pt);
				let v2=new d2.Vector(this.points[0],this.points[1]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[1].x=this.points[0].x +v.x;
				this.points[1].y=this.points[0].y + v.y;
	    	
	    	//do right 
				v2=new d2.Vector(this.points[0],this.points[3]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[3].x=this.points[0].x +v.x;
				this.points[3].y=this.points[0].y + v.y;
	    	
	    	
			}else if(point==this.points[1]){
		    	//do same
				let pt=this.points[1];
				pt.move(offX,offY);

	    		    	//do left 
				let v1=new d2.Vector(this.points[3],pt);
				let v2=new d2.Vector(this.points[3],this.points[0]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[0].x=this.points[3].x +v.x;
				this.points[0].y=this.points[3].y + v.y;
	    	//do right 
				v2=new d2.Vector(this.points[3],this.points[2]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[2].x=this.points[3].x +v.x;
				this.points[2].y=this.points[3].y + v.y;				
			}else if(point==this.points[3]){
		    	//do same
				let pt=this.points[3];
				pt.move(offX,offY);		
				
		    	//do left 
				let v1=new d2.Vector(this.points[1],pt);
				let v2=new d2.Vector(this.points[1],this.points[0]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[0].x=this.points[1].x +v.x;
				this.points[0].y=this.points[1].y + v.y;
				
		    	//do right 
				v2=new d2.Vector(this.points[1],this.points[2]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[2].x=this.points[1].x +v.x;
				this.points[2].y=this.points[1].y + v.y;
			}else{
		    	//do same
				let pt=this.points[0];
				pt.move(offX,offY);		
				
		    	//do left 
				let v1=new d2.Vector(this.points[2],pt);
				let v2=new d2.Vector(this.points[2],this.points[1]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[1].x=this.points[2].x +v.x;
				this.points[1].y=this.points[2].y + v.y;
				
		    	//do right 
				v2=new d2.Vector(this.points[2],this.points[3]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[3].x=this.points[2].x +v.x;
				this.points[3].y=this.points[2].y + v.y;				
			}
	    	
		}
		rotate(angle,center = {x:this.box.center.x, y:this.box.center.y}){
			super.rotate(angle,center);
		}
		get box(){
			return super.box;
		}
		get vertices() {
		    return this.points;	
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