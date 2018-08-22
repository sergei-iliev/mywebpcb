module.exports = function(d2) {
	
	d2.Oval = class Oval extends d2.Rectangle{
		constructor(p1,width,height) {
		  super(p1,width,height);	
		  this.width=0;
		  this.height=0;
		  this.arc=0;
		  this.segments=[];
	      this.arcs=[];
	         
		  this.setWidth(width);
		  this.setHeight(height);
		  
		  this.reset();
		}
        createArc(center, start, end){
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            
            let r = (new d2.Vector(center, start)).length;
            return new d2.Arc(center, r, startAngle, 180);        	
        }
        findArcPoints(p1,p2,p3,p4){
    		  let pt=p1;
      		  let v=new d2.Vector(pt,p2);
      		  let norm=v.normalize();  		  
      		  let x=pt.x +(this.arc/2)*norm.x;
      		  let y=pt.y + (this.arc/2)*norm.y;  			
      		  let A=new d2.Point(x,y);
      		  
    		  //end angle point 
   		      pt=p4;
   		      v=new d2.Vector(pt,p3);
   		      norm=v.normalize();		  
   		      x=pt.x +(this.arc/2)*norm.x;
   		      y=pt.y +(this.arc/2)*norm.y;			
   		      let B=new d2.Point(x,y);		  		  
   		   
   		   
   		      //center is the mid point
   		      let C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
   		   
              return [C,A,B];   		     
        }
        //****TEST************
        eval(g2){
      //*********************LEFT****************************  	
  		  //start angle point
//  		  let pt=this.points[0];
//  		  let v=new d2.Vector(pt,this.points[1]);
//  		  let norm=v.normalize();  		  
//  		  let x=pt.x +(this.arc/2)*norm.x;
//  		  let y=pt.y + (this.arc/2)*norm.y;  			
//  		  let A=new d2.Point(x,y);    
//  		  //d2.utils.drawCrosshair(g2,10,[A]);
//  		  
//  		  
//		  //end angle point 
//		   pt=this.points[3];
//		   v=new d2.Vector(pt,this.points[2]);
//		   norm=v.normalize();		  
//		   x=pt.x +(this.arc/2)*norm.x;
//		   y=pt.y +(this.arc/2)*norm.y;			
//		   let B=new d2.Point(x,y);		  		  
//		   //d2.utils.drawCrosshair(g2,10,[B]);
//		   
//		   //center is the mid point
//		   let C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
//		   //d2.utils.drawCrosshair(g2,10,[C]);
//		     
//		   let arc=this.createArc(C,A,B);
//		   arc.paint(g2);
		   
			let r=this.findArcPoints(this.points[0],this.points[1],this.points[2],this.points[3]);  
			let arc=this.createArc(r[0],r[1],r[2]);			
			arc.paint(g2);	
       //************************RIGHT************************
//	  		  //start angle point
//	  		 pt=this.points[1];
//	  		 v=new d2.Vector(pt,this.points[0]);
//	  		 norm=v.normalize();  		  
//	  		 x=pt.x +(this.arc/2)*norm.x;
//	  		 y=pt.y + (this.arc/2)*norm.y;  			
//	  		 A=new d2.Point(x,y);    
//	  		 //d2.utils.drawCrosshair(g2,10,[A]);
//	  		  
//	  		  
//			  //end angle point 
//			   pt=this.points[2];
//			   v=new d2.Vector(pt,this.points[3]);
//			   norm=v.normalize();		  
//			   x=pt.x +(this.arc/2)*norm.x;
//			   y=pt.y +(this.arc/2)*norm.y;			
//			   B=new d2.Point(x,y);		  		  
//			   //d2.utils.drawCrosshair(g2,10,[B]);
//			   
//			   //center is the mid point			  			   
//			   C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
//			   //d2.utils.drawCrosshair(g2,10,[C]);
//			     
//			   arc=this.createArc(C,B,A);
//			   arc.paint(g2);		   
		   
			r=this.findArcPoints(this.points[1],this.points[0],this.points[3],this.points[2]);  
			arc=this.createArc(r[0],r[2],r[1]);			
			arc.paint(g2);
		   
        }
        resize(offX,offY,point){
    		super.resize(offX,offY,point);
    		this.reset(); 	
        }
		reset(){
			 this.segments=[];
	         this.arcs=[];
			 //segments 
	         let top=new d2.Segment(0,0,0,0);
	    	 this.segments.push(top);
	    	   
	    	 let bottom=new d2.Segment(0,0,0,0);
	    	 this.segments.push(bottom);
	    	 
	    	 
	    	 
	         //arcs
			 let r=this.findArcPoints(this.points[0],this.points[1],this.points[2],this.points[3]);  
			 this.arcs.push(this.createArc(r[0],r[1],r[2]));			
			 top.ps=r[1].clone();
			 bottom.ps=r[2].clone();  	
				
			 r=this.findArcPoints(this.points[1],this.points[0],this.points[3],this.points[2]);  
			 this.arcs.push(this.createArc(r[0],r[2],r[1]));	
			 top.pe=r[1].clone();
			 bottom.pe=r[2].clone();  	
			  
				
        }
        
        setWidth(width) {
            this.width=width;
            if (width < this.height) {
                this.arc = width;
            } else {
                this.arc = this.height;
            }
        }

        setHeight(height) {
            this.height=height;
            if (height < this.width) {
                this.arc =this.height;
            } else {
                this.arc = this.width;
            }
        }
    	rotate(angle,center = {x:0, y:0}){
     	   super.rotate(angle,center);
     	   this.reset();    	
     	}
    	mirror(line){
    	   super.mirror(line);
    	   this.reset();
			this.arcs.forEach(arc=>{
				arc.endAngle=-1*arc.endAngle;
			});  
    	}
    	scale(alpha){
    	  super.scale(alpha);
    	  this.reset();
    	}
        paint(g2){	
			this.segments.forEach(segment=>{
				segment.paint(g2);
			});
			
			this.arcs.forEach(arc=>{
				arc.paint(g2);
			});  			
			
        }
	}
	
}	