var core=require('core/core');
var d2=require('d2/d2');
var utilities =require('core/utilities');

class LineBendingProcessor{
constructor () {
	    this.line;	    
	    this.isGridAlignable=false;
  }	
initialize(line){           
      this.line=line         
  }
addLinePoint(point){
	
}   

moveLinePoint(x,y){

}
release(){
	this.line.reset();	
}
isOverlappedPoint(pointToAdd){
    if(this.line.getLinePoints().length>0){      
      let lastPoint;
          if(this.line.resumeState==core.ResumeState.ADD_AT_END){
        	  lastPoint=this.line.getLinePoints()[(this.line.getLinePoints().length-1)];                 
          }else{
              lastPoint=this.line.getLinePoints()[0]; 
          }
      //***is this the same point as last one?   
      if(d2.utils.EQ(pointToAdd.x,lastPoint.x)&&d2.utils.EQ(pointToAdd.y,lastPoint.y))
        return true;    
    }
    return false;
}
isPointOnLine(pointToAdd){
    if(this.line.getLinePoints().length>=2){
        //let lastPoint=this.line.getLinePoints()[(this.line.getLinePoints().length-1)]; 
        //let lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2];
    	let lastPoint,lastlastPoint;
    	if(this.line.resumeState==core.ResumeState.ADD_AT_END){  
            lastPoint=this.line.getLinePoints()[(this.line.getLinePoints().length-1)]; 
            lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 
        }else{
            lastPoint=this.line.getLinePoints()[0];  
            lastlastPoint=this.line.getLinePoints()[1];                  
        }    	
      //***check if point to add overlaps last last point
      if(lastlastPoint.equals(pointToAdd)){
        //this.line.deleteLastPoint();
        lastPoint.set(pointToAdd);  
        return true;
      }
      if((d2.utils.EQ(lastPoint.x,pointToAdd.x)&&d2.utils.EQ(lastlastPoint.x,pointToAdd.x))||(d2.utils.EQ(lastPoint.y,pointToAdd.y)&&d2.utils.EQ(lastlastPoint.y,pointToAdd.y))){                
        lastPoint.set(pointToAdd);                           
        return true;
      }                    
   }
   return false;	
}
isSlopeInterval(p1,p2){
	if(d2.utils.EQ(p1.x,p2.x)){
		return false;
	}
	if(d2.utils.EQ(p1.y,p2.y)){
		return false;
	}
	return true;	
}
}
class LineSlopBendingProcessor extends LineBendingProcessor{
	constructor () {
		super();
  }	

addLinePoint( point) {
        if(this.line.getLinePoints().length==0){
             this.line.reset(point);
        }               
        let result=false;
        if(!this.isOverlappedPoint(point)){
            if(!this.isPointOnLine(point)) {
                let midP,endP;
               
                if(this.isGridAlignable){
                  midP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
                  endP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
                }else{
                  midP=new d2.Point(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
                  endP=new d2.Point(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
                  
                }
                if(this.isOverlappedPoint(midP)){
                   this.line.addPoint(endP);
                   result=true;  
                }else if(!this.isPointOnLine(midP)){
                   this.line.addPoint(midP);
                   result=true;
                } 
            }  
        }  
    
        this.line.shiftFloatingPoints(); 
        return result;
        
        
}	
moveLinePoint(x,y){
	
	    if(this.line.getLinePoints().length>1){
	        //line is resumed if line end is not slope then go on from previous segment	        
	        let lastPoint,lastlastPoint;
	        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
	            lastPoint=this.line.getLinePoints()[0];  
	            lastlastPoint=this.line.getLinePoints()[1];  
	        }else{
		    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
		        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
	        }	        
	        if(this.isSlopeInterval(lastPoint, lastlastPoint)){
	        	this.handleLine(x, y);
	        }else{
	           this.handleSlope(x, y); 
	        }
	        
	    }else{
	        this.handleLine(x, y);
	    }	
	}

handleSlope(x,y){    
    this.line.floatingEndPoint.set(x,y);
    let quadrant = utilities.getQuadrantLocation(this.line.floatingStartPoint,this.line.floatingEndPoint);
    let dx=Math.abs(this.line.floatingStartPoint.x-this.line.floatingEndPoint.x);
    let dy=Math.abs(this.line.floatingStartPoint.y-this.line.floatingEndPoint.y); 
    
    
    if(dx>=dy){ 
        switch(quadrant){
            case  utilities.QUADRANT.FIRST:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x+dy,this.line.floatingEndPoint.y); 
                  break;            
            case  utilities.QUADRANT.SECOND:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x-dy,this.line.floatingEndPoint.y);  
                  break;             
            case  utilities.QUADRANT.THIRD:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x-dy,this.line.floatingEndPoint.y);   
                  break; 
            case  utilities.QUADRANT.FORTH:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x+dy,this.line.floatingEndPoint.y);                        
                  break;                
        }
    }else{
        switch(quadrant){
            case  utilities.QUADRANT.FIRST:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y-dx);                        
                  break;            
            case  utilities.QUADRANT.SECOND:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y-dx); 
                  break;             
            case  utilities.QUADRANT.THIRD:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y+dx); 
                  break; 
            case  utilities.QUADRANT.FORTH:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y+dx);                        
                  break;                
        }            
    }
       
}        
	
handleLine( x,  y){        
        this.line.floatingEndPoint.set(x,y);
        let quadrant = utilities.getQuadrantLocation(this.line.floatingStartPoint,this.line.floatingEndPoint);
        let dx=Math.abs(this.line.floatingStartPoint.x-this.line.floatingEndPoint.x);
        let dy=Math.abs(this.line.floatingStartPoint.y-this.line.floatingEndPoint.y); 
        
        if(dx>=dy){ 
            switch(quadrant){
                case  utilities.QUADRANT.FIRST:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x-dy,this.line.floatingStartPoint.y); 
                      break;            
                case  utilities.QUADRANT.SECOND:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x+dy,this.line.floatingStartPoint.y);  
                      break;             
                case  utilities.QUADRANT.THIRD:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x+dy,this.line.floatingStartPoint.y);   
                      break; 
                case  utilities.QUADRANT.FORTH:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x-dy,this.line.floatingStartPoint.y);                        
                      break;                
            }
        }else{
        	switch(quadrant){
                case  utilities.QUADRANT.FIRST:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y+dx);                        
                      break;            
                case  utilities.QUADRANT.SECOND:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y+dx); 
                      break;             
                case  utilities.QUADRANT.THIRD:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y-dx); 
                      break; 
                case  utilities.QUADRANT.FORTH:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y-dx);                        
                      break;                
            }            
        }
        
    }	
	
}
class SlopLineBendingProcessor extends LineSlopBendingProcessor{
	constructor () {
		super();
  }		
addLinePoint( point) {
		super.addLinePoint(point);
	}
moveLinePoint(x,y){
    if(this.line.getLinePoints().length>1){
        let lastPoint,lastlastPoint;
        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
            lastPoint=this.line.getLinePoints()[0];  
            lastlastPoint=this.line.getLinePoints()[1];  
        }else{
	    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
	        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
        }        
        
        if(this.isSlopeInterval(lastPoint, lastlastPoint)){
           this.handleLine(x, y);
        }else{
           this.handleSlope(x, y); 
        }
        
    }else{
        this.handleSlope(x, y);
    }	
}	
	
}
class DefaultLineBendingProcessor extends LineBendingProcessor {
constructor () {
		super();
  }	   
addLinePoint(point) {      
       let result=false;
       if(!this.isOverlappedPoint(point)){
           if(!this.isPointOnLine(point)){
               this.line.addPoint(point);   
               result=true;
           }               
       }         
       this.line.reset(point); 
       return result;
    }

moveLinePoint( x,  y) {
      this.line.floatingEndPoint.set(x,y); 
      this.line.floatingMidPoint.set(x,y);
    }

}

class HorizontalToVerticalProcessor extends LineBendingProcessor{
  constructor () {
		super();
  }
  addLinePoint( point) {
      if(this.line.getLinePoints().length==0){
          this.line.reset(point);
     }               
     let result=false;
     if(!this.isOverlappedPoint(point)){
         if(!this.isPointOnLine(point)) {
             let midP,endP;
            
             if(this.isGridAlignable){
               midP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
               endP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
             }else{
               midP=new d2.Point(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
               endP=new d2.Point(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
               
             }
             if(this.isOverlappedPoint(midP)){
                this.line.addPoint(endP);
                result=true;  
             }else if(!this.isPointOnLine(midP)){
                this.line.addPoint(midP);
                result=true;
             } 
         }  
     }  
 
     this.line.shiftFloatingPoints(); 
     return result;
  }	
  moveLinePoint(x,y){		
	    if(this.line.getLinePoints().length>1){
	        //line is resumed if line end is not slope then go on from previous segment	    	
	        let lastPoint,lastlastPoint;
	        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
	            lastPoint=this.line.getLinePoints()[0];  
	            lastlastPoint=this.line.getLinePoints()[1];  
	        }else{
		    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
		        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
	        }  	        
	        
	        if(this.isHorizontalInterval(lastPoint, lastlastPoint)){
	           this.handleVertical(x, y);
	        }else{
	           this.handleHorizontal(x, y); 
	        }
	        
	    }else{
	        this.handleHorizontal(x, y);
	    }	
	}  
  handleVertical( x,  y){
	  this.line.floatingEndPoint.set(x,y);
	  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y); 
  }
  handleHorizontal( x,  y){        
      this.line.floatingEndPoint.set(x,y);
      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y); 
                        
  }	
  isHorizontalInterval(p1,p2){
		if(d2.utils.EQ(p1.x,p2.x)){
			return false;
		}		
		return true;	
	}  
}

class VerticalToHorizontalProcessor extends HorizontalToVerticalProcessor{
constructor () {
			super();
	  }
addLinePoint( point) {
			super.addLinePoint(point);
		}
moveLinePoint(x,y){
    if(this.line.getLinePoints().length>1){
        //line is resumed if line end is not slope then go on from previous segment
        let lastPoint,lastlastPoint;
        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
            lastPoint=this.line.getLinePoints()[0];  
            lastlastPoint=this.line.getLinePoints()[1];  
        }else{
	    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
	        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
        }  
        if(this.isHorizontalInterval(lastPoint, lastlastPoint)){
           this.handleVertical(x, y);
        }else{
           this.handleHorizontal(x, y); 
        }
        
    }else{
        this.handleVertical(x, y);
    }		
	}	  
}
module.exports ={
		SlopLineBendingProcessor,
		LineSlopBendingProcessor,
		DefaultLineBendingProcessor,
		HorizontalToVerticalProcessor,
		VerticalToHorizontalProcessor,
}