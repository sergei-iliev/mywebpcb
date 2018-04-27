var core = require('core/core');
var events=require('core/events');
var GlyphManager=require('core/text/glyph').GlyphManager;
var ViewportWindow=require('core/core').ViewportWindow;

//**********************UnitMgr***************************************
var UnitMgr=(function(){
	var instance=null;
	//private
    function getPinsRect(shapes){
        var x1=Number.MAX_VALUE,y1=Number.MAX_VALUE,x2=Number.MIN_VALUE,y2=Number.MIN_VALUE;
        var isPinnable=false;        
        
        shapes.forEach(function(shape) {            
            if(typeof shape.getPinsRect === 'function'){
                r=shape.getPinsRect();
                x1=Math.min(x1,r.x );
                y1=Math.min(y1,r.y);
                x2=Math.max(x2,r.x+r.width);
                y2=Math.max(y2,r.y +r.height);             
                isPinnable=true;	
            }  
           });
        
        if(isPinnable)
            return new core.Rectangle(x1,y1,x2-x1,y2-y1);            
        else
            return null;  
        };

class manager{
        alignBlock(grid,shapes) {
            let r = getPinsRect(shapes);
            if (r == null) {
                return;
            }
            let point =grid.positionOnGrid(r.x, r.y); 
            
      	   shapes.forEach(function(shape) {
      		 shape.Move((point.x - r.x),(point.y - r.y));
           });
        }
        moveBlock(shapes, xoffset,yoffset){
        	   shapes.forEach(function(shape) {
         		shape.Move(xoffset,yoffset);
               });
         }    
        mirrorBlock(shapes,A,B){
     	   shapes.forEach(function(shape) {
        		shape.Mirror(A,B);
           });
        }
        rotateBlock(shapes, rotation){
       	   shapes.forEach(function(shape) {
        		shape.Rotate(rotation);
                });
        }
        deleteBlock(unit,shapes){
        	shapes.forEach(function(shape) {               
               unit.remove(shape.uuid);
            });	
        }
        cloneBlock(unit,shapes){
            //***disselect old block
            unit.setSelected(false);
            shapes.forEach(function(shape) {
            	let copy = shape.clone();
            	copy.setSelected(true);
            	unit.add(copy);
            });
        }
        isBlockSelected(shapes){
            var count = 0;
    	    shapes.forEach(function(shape) {
                   if (shape.isSelected()) {
    					count++;
                    }  
               });
            return count > 1;
        }        
        getLabelByTag(unit,tag){
           let result=null;
       	   unit.shapes.some(function(shape) {
       		if(undefined !=shape['getTexture']){
       			let text=shape.getTexture();
       		    if (text.tag==tag){        			
        				result=shape;
        			    return true;
        			}
        				
            }
       		return false;
           });
            return result;
        }
    
    }
	return {getInstance:function(){
		    if (!instance) {
              instance = new manager();
            }
            return instance;
	      }
	};
		
	
})();
//**********************Unit*******************************************
class Unit{
    constructor(width,height) {
        this.silent=false; 	 
    	this.scalableTransformation=new core.ScalableTransformation(8,4,13);
    	this.uuid=core.UUID();
    	this.shapes=[];
    	this.width=width;
    	this.height=height;
    	this.name="Uknown";
    	this.grid=new core.Grid(0.8,core.Units.MM);
        this.scrollPositionXValue = 0;
        this.scrollPositionYValue = 0;
        this.frame=new core.UnitFrame(this.width,this.height);
        this.coordinateSystem=new core.CoordinateSystem(this);
		this.ruler=new core.Ruler();
		this.shapeFactory=null;
        
    }
setScrollPositionValue(scrollPositionXValue,scrollPositionYValue) {
        this.scrollPositionXValue = scrollPositionXValue;
        this.scrollPositionYValue = scrollPositionYValue;
       }
fireShapeEvent(event){
		if(this.silent)
			return;
		switch(event.type){
		  case events.Event.SELECT_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.DELETE_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.RENAME_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.ADD_SHAPE:	 
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		}       	
}
	
getCoordinateSystem(){
        return this.coordinateSystem;
    }
getSelectedShapes() {
       var v=[];
       var len=this.shapes.length;
 	   for(var i=0;i<len;i++){
            if (this.shapes[i].isSelected()) {
				v.push(this.shapes[i]);
            } 
 	    }
       return v;
    }	
release(){
		this.clear();
		
	}
clear(){
        //***go through all lists and delete them
 	   this.shapes.forEach(function(shape) {
 		  shape.owningUnit=null;
 		  shape.Clear();
 		  shape=null;
       },this);
        this.shapes=[];	
	}
getBoundingRect() {
        return this.getShapesRect(this.shapes);
    }
getShapesRect(shapes) {
        var r = new core.Rectangle(0,0,0,0);
        var x1 = Number.MAX_VALUE; 
        var y1 = Number.MAX_VALUE;
        var x2 = Number.MIN_VALUE;
        var y2 = Number.MIN_VALUE;

        //***empty schematic,element,package
        if (shapes.length == 0) {
            return r;
        }
        var len=shapes.length;
  	    for(var i=0;i<len;i++){
            var tmp = shapes[i].getBoundingShape();
            if (tmp != null) {
                x1 = Math.min(x1, tmp.x);
                y1 = Math.min(y1, tmp.y);
                x2 = Math.max(x2, tmp.x+tmp.width);
                y2 = Math.max(y2, tmp.y+tmp.height);
            }
            
        }
        r.setRect(x1, y1, x2 - x1, y2 - y1);
        return r;
    }	
remove(uuid) {
 	   this.shapes = this.shapes.filter(function(item) { 
               if(item.getUUID()==uuid){
			      this.fireShapeEvent({target:item,type:events.Event.DELETE_SHAPE});
         	      item.Clear();
         	      item=null;
				  return false;
			   }
			   return true;
        }.bind(this));
}  
getGrid(){
 	  return this.grid;
 	}
getUUID(){
 	  return this.uuid;  
 	}
getWidth(){
 		return this.width;
 	}
getHeight(){
 	return this.height;
 	}
buildClickableOrderItem(x,  y,  isTextIncluded){
     var orderElements = [];
     var index = 0;
     this.shapes.forEach(function(shape){
         if(isTextIncluded){
           	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
           	    orderElements.push({index:index,orderWeight:0});
           	}
         }		 
         
		if(!shape.isClicked(x, y)){
               index++;
               return; 
        }
         //***give selected a higher priority
        orderElements.push({index:index,
         	                orderWeight:shape.isSelected() && shape.getOrderWeight() > 1 ? 2 : shape.getOrderWeight()});

         index++;
     }.bind(this));
     return orderElements;
 }
getClickedShape( x,  y,  isTextIncluded){
 	       var result=null;
 	       var orderElements=this.buildClickableOrderItem(x,y,isTextIncluded);
 	       
 	      
 	       orderElements.sort(function(a,b) {
 	    	   if (a.orderWeight < b.orderWeight){
 		    	      return -1;
 	    	   }
 		       if (a.orderWeight > b.orderWeight){
 		    	     return 1;
 		       }	     
 		       return 0;
 		    });
 	    
 	       orderElements.some(function(item) {			   
 	    	    var shape=this.shapes[item.index];
				
                 if(isTextIncluded){
                 	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
                 	    result=shape;
                 		return true;
                 	}
                 }
 	 		   
 	 		    //if (shape.isClicked(x, y)) {
                 result=shape;
 				 return true;				 
                //}  
				 
            }.bind(this));
 		   
 		   return result;
 	}
isControlRectClicked( x,  y) {
         /*
          * if two symbols overlap and one is selected
          * then the selected should be checked for control rect click first
          */
         
         var shape = this.getShape(this.getSelected());		 
         if ((shape != null)&&(shape['isControlRectClicked']!=undefined)&&(shape.isControlRectClicked(x, y) != null)){
                return shape;
         }
         return null;
     }
getShapes(clazz) {
        var selectionList=[];
  	    this.shapes.forEach(function(shape) {
            if (shape instanceof clazz) {
         	   selectionList.push(shape);				
            }
         });           
         return selectionList;
 }    
getShape(uuid){
 	    if (uuid == null){
             return null;
         }    
 	   var shape=null;
 	   this.shapes.forEach(function(ashape) {
             if (ashape.getUUID()==uuid) {
                shape=ashape;
 				return;
             }
        }.bind(this));
 	   
         return shape;
 	}
getSelected() {
 	   var uuid=-1;
 	   this.shapes.forEach(function(shape) {
             if (shape.isSelected()) {
                 uuid=shape.getUUID();
 				return;
             }
        }.bind(this));
         return uuid;
     }
 	
setSelected(flag) {
 	   this.shapes.forEach(j$.proxy(function(shape) {
 			shape.setSelected(flag);
        },this));
     }
setSelectedInRect(r){
 	   this.shapes.forEach(j$.proxy(function(shape) {
 	        if (shape.isInRect(r)) {
                 shape.setSelected(true);
             }
        },this));	
     }	
getScalableTransformation(){
 	  return this.scalableTransformation;
 	}
notifyListeners(eventType) {
  	   this.shapes.forEach(j$.proxy(function(shape) {
  		  this.fireShapeEvent({target:shape,type:eventType}); 
       },this));
 }	
 setSize(width,height){
     this.width = width;
     this.height = height;
     this.frame.setSize(width, height);	
 }
paint(g2, viewportWindow){
 	   let len=this.shapes.length;
 	   for(let i=0;i<len;i++){
 		   this.shapes[i].Paint(g2,viewportWindow,this.scalableTransformation);  
 	   }
 	   //grid
        this.grid.paint(g2,viewportWindow,this.scalableTransformation);
        //coordinate system
        this.coordinateSystem.Paint(g2, viewportWindow,this.scalableTransformation);
		//ruler
		this.ruler.Paint(g2, viewportWindow,this.scalableTransformation);
        //frame
        this.frame.paint(g2, viewportWindow,this.scalableTransformation);
     }    
       
}

//**********************UnitContainer*******************************************
class UnitContainer{
	constructor(silent){
	      this.silent= silent || false;;	
		  this.unitsmap=new Map();
		  this.unit=null;
		  this.formatedFileName="";
		  this.libraryname="";
		  this.categoryname="";	
	}
    setFileName(formatedFileName) {
        this.formatedFileName = formatedFileName;
    }
	add(unit){
	  this.unitsmap.set(unit.getUUID(), unit);
      if(this.unitsmap.size==1){
          this.setActiveUnit(0);   
      }
      this.fireUnitEvent({target:unit,type:events.Event.ADD_UNIT});
      
	}
    delete( uuid) {
        var _unit = this.unitsmap.get(uuid);
        if(_unit==null){
            return;
        }
        _unit.release();
        this.fireUnitEvent({target:_unit,type:events.Event.DELETE_UNIT});
        if (_unit == this.unit) {
            this.unit = null;
        }
        _unit = null;
        this.unitsmap.delete(uuid);
    }
    clear(){
    	for(let item of this.unitsmap.keys()){
    		  this.delete(item);
    		  this.unitsmap.delete(item);
        };
		this.unitsmap.clear();
    }	
	getUnits() {
        return this.unitsmap.values();
    }
    setActiveUnitUUID(uuid){
    	this.unit=this.unitsmap.get(Number(uuid));
    }
	setActiveUnit(index) {	
	let units=this.unitsmap.values();
	  for(let i=0;i<this.unitsmap.size;i++){
        let aunit=units.next();
		if(index==i){
		  this.unit=aunit.value;
		  break;
		}
	  }
    }
	getUnit(){
	  return this.unit;
	}
	fireUnitEvent(event){
		if(this.silent)
			return;
		switch(event.type){
		  case events.Event.ADD_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.DELETE_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.SELECT_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.RENAME_UNIT:	 
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		}  		
	}	
}

//**********************UnitComponent*******************************************
class UnitComponent{
	constructor(hbar,vbar,canvas,popup){
	GlyphManager.getInstance();
    
	if(canvas!=null){	
        this.canvas = j$('#'+canvas);
  	  this.ctx = this.canvas[0].getContext("2d");
  	  
  	  //keypress
  	  j$('body').keydown(j$.proxy(this.keyPress,this));
  	  //right popup
  	  j$('body').on('contextmenu', '#'+canvas, function(e){ return false; });
  	  //mouse wheel event
  	  j$('#'+canvas).bind('mousewheel',j$.proxy(this.mouseWheelMoved,this));
  	  //mouse click event 
  	  j$('#'+canvas).on('mouseup',j$.proxy(this.mouseUp,this)); 
  	  j$('#'+canvas).on('mousedown',j$.proxy(this.mouseDown,this));
  	  j$('#'+canvas).on('mousemove',j$.proxy(this.mouseMove,this));
  	  j$(window).resize(j$.proxy(this.screenResized,this));
  	  j$('#'+canvas).dblclick(j$.proxy(this.dblClick,this));
  	}
	
    var container = j$(this.canvas).parent();	  
	this.width=j$(container).width();
	this.height=j$(container).height();

	//set canvas width
	this.canvas.attr('width',this.width);
	this.canvas.attr('height',this.height); 
	
	this.viewportWindow=new ViewportWindow(0,0,this.width,this.height);
	this.parameters=new Map();
	this.parameters.set("snaptogrid",false);
	if(hbar!=null&&vbar!=null){
		this.hbar = j$('#'+hbar);
		this.vbar=j$('#'+vbar);
		this.hbar.jqxScrollBar({ width: '100%', height: 18, min: 0, max: 100});
		this.vbar.jqxScrollBar({ width: 18, height:'100%', min: 0, max: 100, vertical: true});
		this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
		this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	}
}
	
}
module.exports ={
		Unit,
		UnitContainer,
		UnitComponent,
		UnitMgr
}
