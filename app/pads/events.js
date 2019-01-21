var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var d2 = require('d2/d2');

class ArcMidPointEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
 
mousePressed(event){
	if(super.isRightMouseButton(event)){
            if (this.target["getLinePoints"]!=undefined){
            	this.component.popup.registerLineSelectPopup(this.target,event);            
            }            
    }
     
    this.component.getModel().getUnit().setSelected(false);
    this.target.setSelected(true);
	this.mx=event.x;
	this.my=event.y;
        
    this.targetPoint=this.target.isControlRectClicked(event.x,event.y);
    this.target.setResizingPoint(this.targetPoint);
    
    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
    
	this.component.Repaint();
 }
 mouseReleased(event){
	    if(this.component.getParameter("snaptogrid")){
         this.target.alignResizingPointToGrid(this.targetPoint);
	     this.component.Repaint();	 
		}
	    this.target.resizingPoint=null;
 }
 mouseDragged(event){
 	let new_mx = event.x;
    let new_my = event.y;
    
    this.target.Resize(0,0,event);
    
    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
    this.mx = new_mx;
    this.my = new_my;
	this.component.Repaint();
 }
 mouseMove(event){
 
 }
}

class ArcStartAngleEventHandle extends EventHandle{
 constructor(component) {
	 super(component);
 }
 mousePressed(event){
 }
 mouseDragged(event){
 	let new_mx = event.x;
    let new_my = event.y;
    
	
        
    let centerX=this.target.arc.center.x;
    let centerY=this.target.arc.center.y;
           
    let start = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

    if(start<0){
        this.target.setStartAngle(-1*(start));            
    }else{
        this.target.setStartAngle(360-(start));            
    }
		
	this.mx = new_mx;
    this.my = new_my;

	this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
		
	this.component.Repaint();
 }
mouseReleased(event){

} 
mouseMove(event){
 
}

}	
class ArcExtendAngleEventHandler extends EventHandle{
 constructor(component) {
	 super(component);

 }
 mousePressed(event){
 }
 mouseDragged(event){
 	let new_mx = event.x;
    let new_my = event.y;
        
    let centerX=this.target.arc.center.x;
    let centerY=this.target.arc.center.y;
        
        
    let extend = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

    if(extend<0){
        extend=(-1*(extend));                  
    }else{
        extend=(360-extend);         
    }
        
        //-360<extend<360 
    let extendAngle=this.target.arc.endAngle;
    if(extendAngle<0){        
          if(extend-this.target.arc.startAngle>0) {                
              this.target.setExtendAngle(((extend-this.target.arc.startAngle))-360);
          }else{
              this.target.setExtendAngle(extend-this.target.arc.startAngle);
            }
        }else{           
            if(extend-this.target.arc.startAngle>0) {
              this.target.setExtendAngle(extend-this.target.arc.startAngle);
            }else{
              this.target.setExtendAngle((360-this.target.arc.startAngle)+extend);
            }
        }
        
    //***update PropertiesPanel           
	this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
		
	this.component.Repaint();
 }
mouseReleased(event){

} 
mouseMove(event){
 
}

}

class LineEventHandle extends EventHandle{
constructor(component) {
		 super(component);
		 (function(that){
			   //private
			   var line=null;
			    /*
			     * Wiring rule-> discard point if overlaps with last line point
			     */
			    function isOverlappedPoint( line, pointToAdd){
			        if(line.polyline.points.length>0){
			          let lastPoint=line.polyline.points[line.polyline.points.length-1]; 
			            //***is this the same point as last one?   
			          if(pointToAdd.equals(lastPoint))
			            return true;    
			        }
			        return false;
			    }
			    /*
			     * Wiring rule -> if the point is on a line with previous,shift the previous the the new one,
			     *                 without adding the point
			     */
			   function isPointOnLine(line,pointToAdd){
			         if(line.polyline.points.length>=2){
			             let lastPoint=line.polyline.points[line.polyline.points.length-1];  
			             let lastlastPoint=line.polyline.points[line.polyline.points.length-2]; 
			            
			            //***check if point to add overlaps last last point
			            if(lastlastPoint.equals(pointToAdd)){
			              line.deleteLastPoint();
			              lastPoint.setLocation(pointToAdd);  
			              return true;
			            }
			            if((lastPoint.x==pointToAdd.x&&lastlastPoint.x==pointToAdd.x)||(lastPoint.y==pointToAdd.y&&lastlastPoint.y==pointToAdd.y)){                  
			                lastPoint.setLocation(pointToAdd);                           
			                return true;
			            }                    
			         }
			        return false;
			    };
		       that.lineBendingProcessor={
			  
		       Initialize:function(_line){
				  line=_line; 
			   },
			   addLinePoint:function(p){				  
				        let result=false;
				        if(!isOverlappedPoint(line,p)){
				            if(!isPointOnLine(line,p)){
				                line.polyline.add(p);   
				                result=true;
				            }               
				        }         
				        line.resetToPoint(p); 
				        return result;
			   },
			   Release:function(){
			          line.reset(); 
			          if(line.polyline.points.length<2){
			                line.owningUnit.remove(line.getUUID());                
			          }
			 
			   }
			   
			};
			
		 })(this);
	 }
mousePressed(event){
	this.component.popup.close();
	
	if(super.isRightMouseButton(event)){
	  //if(this.target.points.length<2){		 
	  //   this.component.getModel().getUnit().remove(this.target.getUUID());                
	  //   this.target=null;
	  //}		
	  //this.component.setMode(core.ModeEnum.LINE_MODE);
	  //this.component.Repaint();	
	   this.component.popup.registerLinePopup(this.target,event);
	  	
		
	   return; 
	}
	
	this.component.getModel().getUnit().setSelected(false);
	this.lineBendingProcessor.Initialize(this.target);
	this.target.setSelected(true);
	
    this.target.setResizingPoint(new d2.Point(event.x,event.y));
    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
	
    if(this.component.getParameter("snaptogrid")){
    	let p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y); 
    	this.lineBendingProcessor.addLinePoint(p);	
    }else{
       this.lineBendingProcessor.addLinePoint(new d2.Point(event.x,event.y));
    }
	this.component.Repaint();	 
   }
 mouseReleased(event){

   }
 mouseDragged(event){
   }
 mouseMove(event){
	 this.target.floatingEndPoint.set(event.x,event.y); 
	 this.target.floatingMidPoint.set(event.x,event.y);
	 this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
	 this.component.Repaint(); 
   }
 dblClick(){
     this.target.reset();  
     this.target.setSelected(false);
     this.component.getEventMgr().resetEventHandle();
     this.component.Repaint();	 
	 } 
// keyPressed(event){
//	 if(event.keyCode==27){   //ESCAPE
//       console.log(33);      
//			 //this.dblClick(null);
//		   //this.component.getView().setButtonGroup(ModeEnum.COMPONENT_MODE);
//	       //this.component.setMode(ModeEnum.COMPONENT_MODE);  
//     }   
// }
 Detach(){
	 if(this.target!=null){
		 this.lineBendingProcessor.Release();
	     this.target.reset();  
	 }	     
	 super.Detach();
 }    
}
class SolidRegionEventHandle extends EventHandle{
	constructor(component) {
		 super(component);
	 }
mousePressed(event){
      this.mx=event.x;
	  this.my=event.y;
	  if(super.isRightMouseButton(event)){                                  
           return;
      }
      this.component.getModel().getUnit().setSelected(false);
	  this.target.setSelected(true);

      let p;      
      
      if(this.component.getParameter("snaptogrid")){
        p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y);       		
      }else{
        p=new d2.Point(event.x,event.y);
      }
      let justcreated=this.target.polygon.points.length==2;
      
      if(this.target.getLinePoints().length==0){
    	  this.target.add(p);    
          //avoid point over point
      }else if(!this.target.getLinePoints()[this.target.getLinePoints().length-1].equals(p)){
    	  this.target.add(p);           
      }
      
      
	  this.component.Repaint();	   
	    
	 }
mouseReleased(event){
		
	 }
	 
mouseDragged(event){
		
	 }
mouseMove(event){
    this.target.floatingEndPoint.set(event.x,event.y);   
    this.component.Repaint();	 
	 }	 
dblClick(){
      
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.Repaint();	 
} 
Detach() {
    this.target.reset(); 
    if(this.target.polygon.points.length<3){
        this.target.owningUnit.remove(this.target.uuid);
    }
    super.Detach();
}	
}
class FootprintEventMgr{
 constructor(component) {
    this.component=component;
	this.targetEventHandle=null;	
	this.hash = new Map();
	this.hash.set("arc.mid.point",new ArcMidPointEventHandle(component));
	this.hash.set("arc.start.angle",new ArcStartAngleEventHandle(component));
	this.hash.set("arc.extend.angle",new ArcExtendAngleEventHandler(component));
	this.hash.set("move",new events.MoveEventHandle(component));
	this.hash.set("resize",new events.ResizeEventHandle(component));
    this.hash.set("component",new events.UnitEventHandle(component));
	this.hash.set("block",new events.BlockEventHandle(component));
	this.hash.set("line",new LineEventHandle(component));
	this.hash.set("cursor",new events.CursorEventHandle(component));
	this.hash.set("texture",new events.TextureEventHandle(component));
	this.hash.set("dragheand",new events.DragingEventHandle(component));
	this.hash.set("origin",new events.OriginEventHandle(component));
	this.hash.set("measure",new events.MeasureEventHandle(component));
	this.hash.set("solidregion",new SolidRegionEventHandle(component));
 }
 //****private
 getEventHandle(eventKey,target) {
    var handle=this.hash.get(eventKey);
	if(handle!=null){
	  handle.setTarget(target);
	  if(eventKey=='resize'||eventKey=='move'||eventKey=='line'||eventKey=='texture'){
	     this.component.getModel().getUnit().fireShapeEvent({target:target,type:events.Event.SELECT_SHAPE});
	  }
	  if(eventKey=='component'||eventKey=="origin"){
		 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:events.Event.SELECT_UNIT});
	  }
	  handle.Attach();
	}
	return handle;
 }
 
 getTargetEventHandle(){
   return this.targetEventHandle;
 }
 
 setEventHandle(eventKey,target){
        this.resetEventHandle();
        this.targetEventHandle=this.getEventHandle(eventKey,target);
    }
 
 resetEventHandle(){
	    //hide context menu
	    this.component.popup.close();
        if (this.targetEventHandle != null) {
            this.targetEventHandle.Detach();
        }
        this.targetEventHandle = null;                
    }
 
}

module.exports ={
	  FootprintEventMgr,
	  ArcExtendAngleEventHandler,
	  ArcStartAngleEventHandle,
	  LineEventHandle,
	  SolidRegionEventHandle
}