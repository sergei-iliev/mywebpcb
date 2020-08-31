var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var SymbolFontTexture=require('core/text/d2font').SymbolFontTexture;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var Pin=require('symbols/shapes').Pin;
var FontLabel=require('symbols/shapes').FontLabel;
var d2=require('d2/d2');

class CircuitShapeFactory{
	
}

class SCHSymbol extends  Shape{
constructor(){
		super(0,0,0,0,0,0);
		this.displayName = "Symbol";
   	    this.shapes=[];
   	 
	    this.reference=new SymbolFontTexture("","reference", 0, 0,1,8);
	    this.unit=new SymbolFontTexture("","unit", 0,0,1,0);		 	
	    
	    this.reference.fillColor='black';
	    this.unit.fillColor='black';
}
clone(){
    var copy=new SCHSymbol();
    copy.shapes=[];
    copy.unit =this.unit.clone();
    copy.reference =this.reference.clone();        
    copy.displayName=this.displayName;
    this.shapes.forEach(function(shape){ 
      copy.add(shape.clone());  
    });
    return copy; 	
}
alignToGrid(isRequired) {
    let r=this.getPinsRect();
    //may not have pins
    if(r==null){
       return null;
    }
    let point=this.owningUnit.getGrid().positionOnGrid(r.min.x,r.min.y); 
    this.move(point.x-r.min.x,point.y-r.min.y);
    return null;
}
add(shape){
    if (shape == null)
          return;    
    this.shapes.push(shape);  
}
getPinsRect(){
	var r = new d2.Box(0,0,0,0);
 	var x1 = Number.MAX_VALUE; 
 	var y1 = Number.MAX_VALUE;
 	var x2 = Number.MIN_VALUE;
 	var y2 = Number.MIN_VALUE;       
    let isPinnable=false;
    
    this.shapes.forEach(shape=>{ 
      if(shape instanceof Pin){          
          let p=shape.getPinPoint();
          x1=Math.min(x1,p.x );
          y1=Math.min(y1,p.y);
          x2=Math.max(x2,p.x+0);
          y2=Math.max(y2,p.y +0);             
          isPinnable=true;
      }
    });
    if(isPinnable){
        r.setRect(x1,y1,x2-x1,y2-y1);
        return r;
    }else
        return null; 	
}
calculateShape() {
	var r = new d2.Box(0,0,0,0);
 	var x1 = Number.MAX_VALUE; 
 	var y1 = Number.MAX_VALUE;
 	var x2 = Number.MIN_VALUE;
 	var y2 = Number.MIN_VALUE;
 	
 	
    //***empty schematic,element,package
    if (this.shapes.length == 0) {
        return r;
    }

    var len=this.shapes.length;
	    for(var i=0;i<len;i++){
        var tmp = this.shapes[i].getBoundingShape();
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
move(xoffset,yoffset){
	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].move(xoffset,yoffset);  
	   }	
	   this.reference.move(xoffset,yoffset);
	   this.unit.move(xoffset,yoffset);
}
rotate(rotation){
	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].rotate(rotation);  
	   }
	  
	   this.unit.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	   this.reference.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
}
paint(g2, viewportWindow, scale,layersmask) {        
    
	var rect = this.getBoundingShape();		
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
	 return;
	}
		
	var len=this.shapes.length;
	for(i=0;i<len;i++){
		  this.shapes[i].paint(g2,viewportWindow,scale,layersmask);  
	}    
	
    this.unit.paint(g2, viewportWindow, scale, layersmask);
    this.reference.paint(g2, viewportWindow, scale, layersmask);
 } 
}
class SCHFontLabel extends FontLabel{
	constructor(x, y) {
		super(x, y, 0, 0, 1,core.Layer.LAYER_ALL);		
	}
	clone(){
		var copy = new SCHFontLabel(this.x,this.y);
		copy.texture = this.texture.clone();  				
		return copy;
	}
	
	
}
class SCHJunction extends Shape{
	constructor(){
	  this.selectionRectWidth=4;	
	  this.shape=new d2.Circle(new d2.Point(0,0),this.selectionRectWidth);	
	}
	
paint(g2, viewportWindow, scale,layersmask) {  
		
}

}
module.exports ={
		SCHSymbol,
		SCHFontLabel,
		SCHJunction,
		
}