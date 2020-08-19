module.exports = function(d2) {
    /*
     * Round rectangle is represented by 4 segments and 4 arcs
     */
    d2.RoundRectangle = class RoundRectangle  extends d2.Rectangle{
    	constructor(p1,width,height,rounding) {
    		super(p1,width,height);
    		this.p1=p1;
    		this.width=width;
    		this.height=height;
    		this.rounding=rounding;
    		this.segments=[new d2.Segment(0,0,0,0),new d2.Segment(0,0,0,0),new d2.Segment(0,0,0,0),new d2.Segment(0,0,0,0)];
    		this.arcs = [new d2.Arc(),new d2.Arc(),new d2.Arc(),new d2.Arc()];  
    		
    		this.reset();
    	}
    	clone(){
    		let copy=new d2.RoundRectangle(new d2.Point(),0,0,this.rounding);
    		copy.points=[];
    		this.points.forEach(point=>{
    			copy.points.push(point.clone());
    		});
    		copy.reset();
    		return copy;
    	}
    	setPoints(points){
    	   this.points=[];
    	   this.points=points;
    	   this.reset();
    	}
    	setRect(x,y,width,height,rounding){
    		super.setRect(x,y,width,height);
    		this.rounding=rounding;
    		this.p1.set(x,y);
    		this.width=width;
    		this.height=height;
    		this.reset();
    	}    	
        /**
         * Create specific rounding arc 90 degrees long
         * @param center of the arc
         * @param start angle point
         * @param end angle point
         */
        resetArc(arc,center,start,end) {
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            if (d2.utils.EQ(startAngle, endAngle)) {
              endAngle = 360;
            }
            let r = (new d2.Vector(center, start)).length;         	  
            arc.pc=center;
            arc.r=r;
            arc.startAngle=startAngle;
            arc.endAngle=90;

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
			  let v=new d2.Vector(p1,p2);
			  let norm=v.normalize();			  
			  let x=p1.x +this.rounding*norm.x;
			  let y=p1.y + this.rounding*norm.y;				
			  let A=new d2.Point(x,y);

				
			  //end angle point 
			   v=new d2.Vector(p1,p3);
			   norm=v.normalize();			  
			   x=p1.x +this.rounding*norm.x;
			   y=p1.y + this.rounding*norm.y;				
			   let B=new d2.Point(x,y);
			   
			   //center
			   v=new d2.Vector(p1,B);			   
			   x=A.x +v.x;
			   y=A.y +v.y;			   
			   let C=new d2.Point(x,y);
			   
			   return [C,A,B];
			   			
		}
    	reset(){
            if (this.rounding == 0) {
            	 
                this.segments[0].set(this.points[0].x,this.points[0].y,this.points[1].x, this.points[1].y);
                this.segments[1].set(this.points[1].x,this.points[1].y,this.points[2].x, this.points[2].y);
                this.segments[2].set(this.points[2].x,this.points[2].y,this.points[3].x, this.points[3].y);
                this.segments[3].set(this.points[3].x,this.points[3].y,this.points[0].x, this.points[0].y);               

            } else {
                //rect
                let top = this.segments[0];
                let right = this.segments[1];    
                let bottom = this.segments[2];
                let left =this.segments[3];
     

                //arcs
                let r = this.findArcPoints(this.points[0], this.points[1], this.points[3]);
                this.resetArc(this.arcs[0],r[0], r[1], r[2]);
                top.ps = r[1].clone();
                left.ps = r[2].clone();

                r = this.findArcPoints(this.points[1], this.points[2], this.points[0]);
                this.resetArc(this.arcs[1],r[0], r[1], r[2]);
                top.pe = r[2].clone();
                right.ps = r[1].clone();

                r = this.findArcPoints(this.points[2], this.points[3], this.points[1]);
                this.resetArc(this.arcs[2] ,r[0], r[1], r[2]);
                right.pe = r[2].clone();
                bottom.ps = r[1].clone();


                r = this.findArcPoints(this.points[3], this.points[0], this.points[2]);
                this.resetArc(this.arcs[3],r[0], r[1], r[2]);
                bottom.pe = r[2].clone();
                left.pe = r[1].clone();
            }    		    	
    	}
    	resize(offX,offY,point){
    		super.resize(offX,offY,point);
    		this.reset();
    	}
    	rotate(angle,center = {x:0, y:0}){
    	   super.rotate(angle,center);
    	   this.reset();    	
    	}
    	move(offX,offY){
    	   super.move(offX,offY);
    	   this.reset();
    	}
        contains(pt){
      	   if(!super.contains(pt)){
      		   return false;
      	   }    	   
      	   
      	   //constrauct polygon
      	   let pol=new d2.Polygon();
      	   this.segments.forEach(segment=>{
      		 pol.add(segment.ps);
      		 pol.add(segment.pe);
      	   });
      	   
      	   return pol.contains(pt);
         }
		scale(alpha){
			super.scale(alpha);
			this.rounding*=alpha;
			this.reset();
		}
		setRounding(rounding){
		 this.rounding=rounding;
		 this.reset();
		}
    	mirror(line){
    		super.mirror(line);
    		let p=this.points[0];
    		this.points[0]=this.points[1];
    		this.points[1]=p
    		
    		p=this.points[2];
    		this.points[2]=this.points[3];
    		this.points[3]=p
    		
    		this.reset();
    	}
		get box(){
			return super.box;
		}
		get polygon() {
			let vertices=[];
			let p=this.segments[0].ps;
			
    		this.segments.forEach(segment=>{
    		   let a=p.distanceTo(segment.ps);
    		   let b=p.distanceTo(segment.pe);
    		   if(a<b){
    		     vertices.push(segment.ps);
			     vertices.push(segment.pe);
    		   }else{
        		 vertices.push(segment.pe);
    			 vertices.push(segment.ps);    			   
    		   }
			   p=vertices[vertices.length-1];  //keep the last one
			});
          return vertices;		   	
		}
    	paint(g2){
    		if(g2._fill!=undefined&&g2._fill){
    			let vertices=this.polygon;
        		
    	    	g2.beginPath();	    		    		    	
    	    	g2.moveTo(vertices[0].x,vertices[0].y);
    	    	for (var i = 1; i < vertices.length; i++) {
    	    						g2.lineTo(vertices[i].x, vertices[i].y);
    	    	}
    	    	g2.closePath(); 
    	    	g2.fill();    	    	       		
    	    	if(this.rounding!=0){
    	    	 this.arcs.forEach(arc=>{
    				var circle=new d2.Circle(arc.pc,arc.r);
    	    		circle.paint(g2);
    			 });
    	    	}
    		}else{
			 this.segments.forEach(segment=>{
				segment.paint(g2);
			 });
			
			 if(this.rounding!=0){
			  this.arcs.forEach(arc=>{
				arc.paint(g2);
			  });
			 }
    		}
    	}
    }
    
}