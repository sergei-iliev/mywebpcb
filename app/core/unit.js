var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var shape = require('core/shapes');
var events=require('core/events');
var GlyphManager=require('core/text/d2glyph').GlyphManager;
var ViewportWindow=require('core/core').ViewportWindow;
var d2=require('d2/d2');
var UndoProvider=require('core/undo').UndoProvider
var MementoType=require('core/undo').MementoType
var CompositeMemento=require('core/undo').CompositeMemento
//**********************UnitMgr***************************************
var UnitMgr=(function(){
	var instance=null;
	//private
    function getPinsRect(shapes){
        var x1=Number.MAX_VALUE,y1=Number.MAX_VALUE,x2=Number.MIN_VALUE,y2=Number.MIN_VALUE;
        var isPinnable=false;        

        shapes.forEach(function(shape) {            
            if(typeof shape.getPinPoint === 'function'){
                let point=shape.getPinPoint();                
                x1 = Math.min(x1, point.x);
                y1 = Math.min(y1, point.y);
                x2 = Math.max(x2, point.x);
                y2 = Math.max(y2, point.y);                
                isPinnable=true;	
            }
            if(typeof shape.getPinsRect==='function'){
            	let box=shape.getPinsRect();
                x1 = Math.min(x1, box.min.x);
                y1 = Math.min(y1, box.min.y);
                x2 = Math.max(x2, box.max.x);
                y2 = Math.max(y2, box.max.y);                            	
            	isPinnable=true;
            }
           });
        
        if(isPinnable)
            return  d2.Box.fromRect(x1,y1,x2-x1,y2-y1);          
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
      		 shape.move((point.x - r.x),(point.y - r.y));
           });
        }
        moveBlock(shapes, xoffset,yoffset){
        	   shapes.forEach(function(shape) {
         		shape.move(xoffset,yoffset);
               });
         }    
        mirrorBlock(shapes,line){	
     	   shapes.forEach(function(shape) {
        		shape.mirror(line);
           });
        }
        rotateBlock(shapes, rotation){
       	   shapes.forEach(function(shape) {
        		shape.rotate(rotation);
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
        sendToBack(shapes,target){
        	let box=target.getBoundingShape();
        	let min=Number.MAX_VALUE;
        	let sind=-1;
        	for(let i=0;i<shapes.length;i++){
        		if(shapes[i].uuid===target.uuid){
        			sind=i;
        			continue;
        		}
        		if(box.intersects(shapes[i].getBoundingShape())){
        			min = Math.min(min,i);
        		}
        		
        	}
            if(min<Number.MAX_VALUE){
            	let tmp=shapes[min];
            	shapes[min]=shapes[sind];
            	shapes[sind]=tmp;
            }
        	
        }
        bringToFront(shapes,target){
        	let box=target.getBoundingShape();
        	let max=Number.MIN_VALUE;
        	let sind=-1;
        	for(let i=0;i<shapes.length;i++){
        		if(shapes[i].uuid===target.uuid){
        			sind=i;
        			continue;
        		}
        		if(box.intersects(shapes[i].getBoundingShape())){
        			max = Math.max(max,i);
        		}
        		
        	}        	
            if(max>Number.MIN_VALUE){
            	let tmp=shapes[max];
            	shapes[max]=shapes[sind];
            	shapes[sind]=tmp;
            }
        	
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
        //this.silent=false; 	 
    	this.scalableTransformation=new core.ScalableTransformation(8,4,13);
    	this.uuid=core.UUID();
    	this.shapes=[];
    	this.width=width;
    	this.height=height;
    	this.unitName="Unknown";
    	this.grid=new core.Grid(0.8,core.Units.MM);
        this.viewportPositionX = 0;
        this.viewportPositionY = 0;
        this.frame=new core.UnitFrame(this.width,this.height);
        this.coordinateSystem;//=new core.CoordinateSystem(this);
		this.ruler=new shape.Ruler();
		this.shapeFactory=null;
		this.undoProvider = new UndoProvider();
        
    }
setViewportPositionValue(viewportPositionX,viewportPositionY) {
        this.viewportPositionX = viewportPositionX;
        this.viewportPositionY = viewportPositionY;
       }
fireShapeEvent(event){
		if(!core.isEventEnabled)
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
 		  shape.clear();
 		  shape=null;
       },this);
        this.shapes=[];	
	}
add(shape){
	 if(shape==undefined){
		return;	
	 }
	 shape.owningUnit=this;
	 this.shapes.push(shape);
	 this.fireShapeEvent({target:shape,type:events.Event.ADD_SHAPE});
}
getBoundingRect() {
        return this.getShapesRect(this.shapes);
    }
getShapesRect(shapes) {
        var r = new d2.Box(0,0,0,0);
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
         	      item.clear();
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
buildClickedShapesList(x,  y,  isTextIncluded){
   var orderElements = [];
   let len=this.shapes.length;
   for(i=0;i<len;i++){   
       if(isTextIncluded){
    	if((undefined !=this.shapes[i]['getTextureByTag'])&&this.shapes[i].getClickedTexture(x, y)){                               
             orderElements.splice(0, 0, this.shapes[i]);
             continue;
        }
       }     
       if(this.isShapeVisibleOnLayers(this.shapes[i])&&this.shapes[i].isClicked(x, y)){
          orderElements.push(this.shapes[i]);       
       }  
   }
   return orderElements;
}
getClickedShape( x,  y,  isTextIncluded){
    let clickedShapes = this.buildClickedShapesList(x,y,isTextIncluded);
    if(clickedShapes.length==0){
        return null;
    }
    clickedShapes.sort(function(o1, o2){
       
            //both on same side
    	 if(o1.owningUnit.compositeLayer!=undefined){    
    	   let s1=core.Layer.Side.resolve(o1.copper.getLayerMaskID());
           let s2=core.Layer.Side.resolve(o2.copper.getLayerMaskID());
           let active=o1.owningUnit.compositeLayer.activeSide;
             //active layer has presedense
           if(s1!=s2){
               if(s1==active){
                     return -1;
                 }else{
                     return 1;
                 }
           }
    	 }

       if ((o1.getClickableOrder() - o2.getClickableOrder()) == 0)
           return 0;
       if ((o1.getClickableOrder() - o2.getClickableOrder()) > 0)
           return 1;
       else
           return -1;
       
   }.bind(this));
    
       
    return clickedShapes[0]; 
}
isShapeVisibleOnLayers(shape){
   if (undefined !=this.compositeLayer) {	
    if(shape.isVisibleOnLayers(this.compositeLayer.getLayerMaskID())){
      return true;
    }else{
      return false;  
    }    
   }else{
	   return true;
   }
}
//buildClickableOrderItem(x,  y,  isTextIncluded){
//     var orderElements = [];
//     var index = 0;
//     this.shapes.forEach(function(shape){
//         if(isTextIncluded){
//           	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
//           	    orderElements.push({index:index,orderWeight:0});
//           	}
//         }		 
//         
//		if(!shape.isClicked(x, y)){
//               index++;
//               return; 
//        }
//         //***give selected a higher priority
//        orderElements.push({index:index,
//         	                orderWeight:shape.isSelected() && shape.getOrderWeight() > 1 ? 2 : shape.getOrderWeight()});
//
//         index++;
//     }.bind(this));
//     return orderElements;
// }
//getClickedShape( x,  y,  isTextIncluded){
// 	       var result=null;
// 	       var orderElements=this.buildClickableOrderItem(x,y,isTextIncluded);
//
// 	       orderElements.sort(function(a,b) {
// 	    	   if (a.orderWeight < b.orderWeight){
// 		    	      return -1;
// 	    	   }
// 		       if (a.orderWeight > b.orderWeight){
// 		    	     return 1;
// 		       }	     
// 		       return 0;
// 		    });
// 	    
// 	       orderElements.some(function(item) {			   
// 	    	    var shape=this.shapes[item.index];
//				
//                 if(isTextIncluded){
//                 	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
//                 	    result=shape;
//                 		return true;
//                 	}
//                 }
// 	 		   
// 	 		    //if (shape.isClicked(x, y)) {
//                 result=shape;
// 				 return true;				 
//                //}  
//				 
//            }.bind(this));
// 		   
// 		   return result;
// 	}
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
getShapes(...args) {
	if(args.length==1){  //clazz
		let clazz=args[0];
        var selectionList=[];
  	    this.shapes.forEach(function(shape) {
            if (shape instanceof clazz) {
         	   selectionList.push(shape);				
            }
         });           
         return selectionList;
	}else{      //clazz,layerid
		let clazz=args[0];
		let layermaskId=args[1];
		
        var selectionList=[];
  	    for(let shape of this.shapes) {
            if ((shape instanceof clazz)&&(shape.isVisibleOnLayers(layermaskId))) {
         	   selectionList.push(shape);				
            }
         };           
         return selectionList;		
	}
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
setSelectedShape(uuid,flag){
	   this.shapes.some(function(shape) {
		   if(shape.uuid==uuid){
			   shape.setSelected(flag);
			   return true;
		   }else{
			   return false;
		   }	
		   
       });	
} 	
setSelected(flag) {
 	   this.shapes.forEach(function(shape) {
 			shape.setSelected(flag);
        });
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
 		   this.shapes[i].paint(g2,viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);  
 	   }
 	   this.shapes.forEach((shape)=>{	 	    	
			if ((typeof shape.drawControlShape === 'function')&&shape.isSelected()) {					                
				shape.drawControlShape(g2, viewportWindow,this.scalableTransformation);
        	}
 	   });
 	   //grid
       this.grid.paint(g2,viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
        //coordinate system
       if(this.coordinateSystem!=null){
         this.coordinateSystem.paint(g2, viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
       }	
         //ruler
	   this.ruler.paint(g2, viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
        //frame
       if(this.frame!=null){
	     this.frame.paint(g2, viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
       }
}    
redo(){
	console.log(22);
        let memento=null;
        //***skip duplicates
        while(true){
            memento = this.undoProvider.redo();
            if (memento == null) {
              return false;
            }else{                
              if((memento.mementoType==MementoType.CREATE_MEMENTO)||(memento.mementoType==MementoType.DELETE_MEMENTO)){
                  break;
              }
              //***eigther composite or single memento
              if(memento.isSameState(this)){
                   continue; 
              }else{
                   break;  
              }                 
            }            
        }
    switch (memento.mementoType) {
	   case MementoType.CREATE_MEMENTO:
              let shape=this.shapeFactory.createShapeFromMemento(memento);
              this.add(shape);                 
			break;
		case MementoType.DELETE_MEMENTO:
		
		break;

        default:
            if(memento instanceof CompositeMemento){
               //this.setState(memento); 
               // ((CompositeMemento)memento).loadStateTo(this);
            }else{
               let element = this.getShape(memento.uuid);
               element.setState(memento);
               //fireShapeEvent(new ShapeEvent(element, ShapeEvent.PROPERTY_CHANGE));
            
            }
			
	}
    
	
}    
undo(undocallback){
  let memento=null;
          //***skip duplicates
        while(true){
          memento = this.undoProvider.undo();  
        //***CHECK the validity of a memento   
          if (memento == null) {
            return false;
          }else{
              if((memento.mementoType==MementoType.CREATE_MEMENTO)||(memento.mementoType==MementoType.DELETE_MEMENTO)){
                  break;
              }
              //***eigther composite or single memento
              if(memento.isSameState(this)){                
                 continue; 
              }else{
                 break;  
              }                  
          }
        } 
    switch (memento.mementoType) {
	   case MementoType.CREATE_MEMENTO:
            this.remove(memento.uuid);
			break;
		case MementoType.DELETE_MEMENTO:
		
		break;

        default:
            if(memento instanceof CompositeMemento){
               //this.setState(memento); 
               // ((CompositeMemento)memento).loadStateTo(this);
            }else{
               let element = this.getShape(memento.uuid);
               element.setState(memento);
               //fireShapeEvent(new ShapeEvent(element, ShapeEvent.PROPERTY_CHANGE));
            
            }
			
	}
	
}  
registerMemento(memento){           
   this.undoProvider.registerMemento(memento);    	
}

}

//**********************UnitContainer*******************************************
class UnitContainer{
	constructor(){
	      //this.silent= silent || false;;	
		  this.unitsmap=new Map();
		  this.unit=null;
		  this.fileName="";
		  this.libraryname="";
		  this.categoryname="";	
	}
    setFileName(fileName) {
        this.fileName = fileName;
        this.formatedFileName=this.fileName;
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
		if(!core.isEventEnabled)
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
	constructor(canvas,popup){
	GlyphManager.getInstance();    
    
	if(canvas!=null){	
      this.canvas = j$('#'+canvas);
  	  this.ctx = this.canvas[0].getContext("2d");
  	  
  	  //keypress
  	  j$('body').keydown(j$.proxy(this.keyPress,this));
  	  //right popup
  	  //j$('body').on('contextmenu', '#'+canvas, function(e){ return false; });
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
	
	this.mode=core.ModeEnum.COMPONENT_MODE;
	this.backgroundColor="black";
	this.view=null;
	this.cursor=null;
	
}
resumeLine(line,handleKey,event) {	
	console.log(this.lineBendingProcessor);
	  line.resumeLine(event.x,event.y);
	  this.eventMgr.setEventHandle(handleKey,line);
} 
getMode(){
	return this.mode; 
} 
getEventMgr(){
	return this.eventMgr;
	}	  
getModel(){
	return this.model;
    }
setView(_view){
    this.view=_view; 
    }
getView(){
	return this.view;  
	}
getParameter(key) {
		return this.parameters.get(key); 
	}
	 
setParameter(key,value){
	    this.parameters.set(key,value); 
	}
setViewportPosition(x,y) {
    var xx=x*this.getModel().getUnit().getScalableTransformation().getScale();
    var yy=y*this.getModel().getUnit().getScalableTransformation().getScale();
    
    xx=(xx-(this.width/2));
    yy=(yy-(this.height/2));    

	this.viewportWindow.x= parseInt(xx);
    this.viewportWindow.y= parseInt(yy);
}
setSize( width, height){
     this.viewportWindow.setSize(width,height);      
 }
clear(){
	this.viewportWindow.setSize(1,1); 
    this.getEventMgr().resetEventHandle();
    this.getModel().clear();
  }
fireContainerEvent(event){
	
	  if(!core.isEventEnabled)
		return;
	
	  mywebpcb.trigger('container:inspector',event); 
}
defaultKeyPress(e){
   if (event.ctrlKey && event.key === 'z') {	
         this.getModel().getUnit().undo(this.getEventMgr().targetEventHandle);         
         this.repaint();         
   }else if(event.ctrlKey && event.key === 'y') {
         this.getModel().getUnit().redo(this.getEventMgr().targetEventHandle);         
         this.repaint();         	  
   }
	
}
keyPress(event){
	  if(event.target.tagName=="INPUT"){
		  return;
	  }
	  
	 //if(event.target instanceof HTMLBodyElement||event.target instanceof HTMLCanvasElement){
		 event.preventDefault();
	     if (this.getEventMgr().targetEventHandle == null || !this.getEventMgr().targetEventHandle.keyPressed(event)) {
	            this.defaultKeyPress(event)
	     }
	 //}	 
}
getScaledEvent(event){
	  var x,y;
	  if (event.pageX != undefined && event.pageY != undefined) {
		   x = event.pageX;
		   y = event.pageY;
	  }else {
		   x = event.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
		   y = event.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	 }
	       x -= parseInt(this.canvas.offset().left);
	       y -= parseInt(this.canvas.offset().top);
	  
	  return new events.MouseScaledEvent(x,y,this.getModel().getUnit().getScalableTransformation().getInversePoint(this.viewportWindow.x+x,this.viewportWindow.y+y),event);     
}
dblClick(event){
	  event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		 return; 
	  }
		
    var scaledEvent =this.getScaledEvent(event);

	  if (this.getEventMgr().getTargetEventHandle() != null) {
	            this.getEventMgr().getTargetEventHandle().dblClick(scaledEvent);
	  } 	  
}
mouseUp(event){
    event.preventDefault();
	if (this.getModel().getUnit() == null) { 
			 return; 
    }
	this.canvas.off('mousemove',j$.proxy(this.mouseDrag,this));
	this.canvas.on('mousemove',j$.proxy(this.mouseMove,this));
	
    var scaledEvent =this.getScaledEvent(event);

	if (this.getEventMgr().getTargetEventHandle() != null) {
            this.getEventMgr().getTargetEventHandle().mouseReleased(scaledEvent);
    }      
	   	
}
mouseDrag(event){
    event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
			 return; 
	  }
       
     var scaledEvent =this.getScaledEvent(event);  
	  
	if(event.button==0&&this.getEventMgr().getTargetEventHandle() != null) {		
            this.getEventMgr().getTargetEventHandle().mouseDragged(scaledEvent);
      }
	   
  }
mouseMove(event){
	   event.preventDefault();
	   if (this.getModel().getUnit() == null) { 
			return; 
	   }
	   
	   var scaledEvent =this.getScaledEvent(event);  
	     
	   if(this.getEventMgr().getTargetEventHandle() != null) {		
	            this.getEventMgr().getTargetEventHandle().mouseMove(scaledEvent);
	   }

}
mouseWheelMoved(event){
    event.preventDefault();    
	  if (this.getModel().getUnit() == null) { 
		return; 
	  }
	var e=this.getScaledEvent(event);

	if(event.originalEvent.wheelDelta /120 > 0) {
		   this.zoomOut(e.windowx,e.windowy);
      }
      else{
		   this.zoomIn(e.windowx,e.windowy);
      }
}

zoomIn(x,y){
    if(this.getModel().getUnit().getScalableTransformation().scaleIn()){
        this.viewportWindow.scaleIn(x,y, this.getModel().getUnit().getScalableTransformation());
        this.repaint();         
    }else{
        return false;
    } 
	//this.hbar.off(); 
	//this.vbar.off(); 

	//set new maximum 
	//this.hbar.jqxScrollBar({ value:this.viewportWindow.x,width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
	//this.vbar.jqxScrollBar({ value:this.viewportWindow.y,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});
	
	//this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
	//this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	
	return true;
}
zoomOut(x,y){
    if(this.getModel().getUnit().getScalableTransformation().scaleOut()){
            this.viewportWindow.scaleOut(x,y, this.getModel().getUnit().getScalableTransformation());
            this.repaint();                       
    }else{
            return false;
    }

	//this.hbar.off(); 
	//this.vbar.off(); 
              //set new maximum 
   	//this.hbar.jqxScrollBar({value:this.viewportWindow.x, width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
	//this.vbar.jqxScrollBar({value:this.viewportWindow.y, width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});

	//this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
	//this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	
	return true;
}
//vStateChanged(event){
//    this.viewportWindow.y= parseInt(event.currentValue);
//    this.repaint();	
//  }
//hStateChanged(event){
//    this.viewportWindow.x= parseInt(event.currentValue);
//    this.repaint();
//  }
screenResized(e){	  
	  var container = j$(this.canvas).parent();	  	    	  
	  var oldwidth=this.width;
	  this.width=j$(container).width();  //mind combo width
	  
	  if(oldwidth==this.width){
		  return;
	  }
	  //set canvas width
	  this.canvas.attr('width',this.width);
	  this.componentResized();
	  this.repaint();
	}
componentResized(){
    if(this.getModel().getUnit()==null){
  	  this.setSize(1,1);  	  
    }else{
  	  this.setSize(this.width,this.height);         
    }  
	  
}
setContainerCursor(_cursor) {
    this.cursor = _cursor;
}
getContainerCursor() {
    return this.cursor;
}
repaint(){
	  if(this.getModel().getUnit()!=null){
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height); 
	  this.getModel().getUnit().paint(this.ctx,this.viewportWindow);
      if (this.cursor != null) {
      	this.cursor.paint(this.ctx,this.viewportWindow, this.getModel().getUnit().getScalableTransformation(),core.Layer.Copper.All.getLayerMaskID());

      }
	  }else{
	        this.ctx.clearRect(0, 0, this.width, this.height);  
	  }
}
}
module.exports ={
		Unit,
		UnitContainer,
		UnitComponent,
		UnitMgr
}
