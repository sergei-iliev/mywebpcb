var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var SymbolFontTexture=require('core/text/d2font').SymbolFontTexture;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var Pin=require('symbols/shapes').Pin;
var FontLabel=require('symbols/shapes').FontLabel;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var d2=require('d2/d2');
var AbstractLine=require('core/shapes').AbstractLine;
var SymbolType = require('core/core').SymbolType;

class CircuitShapeFactory{		
		createShape(data){
			if (data.tagName.toLowerCase() == 'module') {
				var symbol = new SCHSymbol();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'wire') {
				var symbol = new SCHWire();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'bus') {
				var symbol = new SCHBus();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'buspin') {
				var symbol = new SCHBusPin();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'junction') {
				var symbol = new SCHJunction();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'label') {
				var symbol = new SCHFontLabel();
				symbol.fromXML(data);
				return symbol;
			}			
			return null;
		}
		
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
	    
	    this.type=SymbolType.SYMBOL;
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
getClickedTexture(x,y) {
    if(this.reference.isClicked(x, y))
        return this.reference;
    else if(this.unit.isClicked(x, y))
        return this.unit;
    else
    return null;
}
isClickedTexture(x,y) {
    return this.getClickedTexture(x, y)!=null;
}
getTextureByTag(tag) {
    if(tag===(this.reference.tag))
        return this.reference;
    else if(tag===(this.unit.tag))
        return this.value;
    else
    return null;
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
	
    
    if(this.isSelected()){
    	g2.globalCompositeOperation = 'lighter';
    	rect.move(-viewportWindow.x,- viewportWindow.y);
    	g2.fillStyle = "blue";
        g2._fill=true;
        rect.paint(g2);
        g2._fill=false;
        g2.globalCompositeOperation = 'source-over';
        
        this.unit.fillColor = "blue";
        this.unit.paint(g2, viewportWindow, scale, layersmask);
        this.reference.fillColor = "blue";
        this.reference.paint(g2, viewportWindow, scale, layersmask);
    }else{
        this.unit.fillColor = "black";
        this.unit.paint(g2, viewportWindow, scale, layersmask);
        this.reference.fillColor = "black";
        this.reference.paint(g2, viewportWindow, scale, layersmask);
    	
    }
 }
fromXML(data){
	this.type=SymbolType.parse(j$(data).attr("type"));
	this.displayName=j$(data).find("name")[0].textContent;	
	
	var reference=j$(data).find("reference")[0];
	var label=j$(reference).find("label")[0];
	
	if(label!=undefined){
	  this.reference.fromXML(label.textContent);
	}
	var unit=j$(data).find("unit")[0];
	var label=j$(unit).find("label")[0];
	
	if(label!=undefined){
	  this.unit.fromXML(label.textContent);
	}
	
	var that=this;
	var shapeFactory=new SymbolShapeFactory();
	 
	j$(data).find('elements').children().each(function(){
         var shape=shapeFactory.createShape(this);
         that.add(shape);
	});	
	
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
class SCHWire extends AbstractLine{
	constructor(){
		   super(1,core.Layer.LAYER_ALL);
	       this.displayName = "Wire";	
	   	   this.selectionRectWidth=4;
		}
	clone() {
		var copy = new SCHWire();		
		copy.polyline=this.polyline.clone();
		return copy;
	}
	paint(g2, viewportWindow, scale,layersmask) {		
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}

		
		

		g2.lineWidth = this.thickness * scale.getScale();

		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = "black";

		let a=this.polyline.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		// draw floating point
		if (this.isFloating()) {
				let p = this.floatingMidPoint.clone();
				p.scale(scale.getScale());
				p.move( - viewportWindow.x, - viewportWindow.y);
				g2.lineTo(p.x, p.y);									
				g2.stroke();							    		
			
				p = this.floatingEndPoint.clone();
				p.scale(scale.getScale());
				p.move( - viewportWindow.x, - viewportWindow.y);
				g2.lineTo(p.x, p.y);									
				g2.stroke();					
		}

	    if((this.isSelected())/*&&(!this.isSublineSelected())*/){
	    	this.drawControlPoints(g2, viewportWindow, scale);
		}
		    
		    
	}	
	fromXML(data){
		
		var points= j$(data).find('wirepoints')[0];
		var tokens = points.textContent.split("|");
		
		for (var index = 0; index < tokens.length; index ++) {
			if(tokens[index].length>1){
				let points =tokens[index].split(",");
				let x = parseFloat(points[0]);
			    let y = parseFloat(points[1]);
			    this.polyline.points.push(new d2.Point(x, y));
			}
		}
	}
}

class SCHBus extends SCHWire{
	constructor(){
		   super(1,core.Layer.LAYER_ALL);
	       this.displayName = "Bus";	
	   	   this.selectionRectWidth=4;
	   	   this.thickness=4;
		}
	clone() {
		var copy = new SCHBus();		
		copy.polyline=this.polyline.clone();
		return copy;
	}	
}
class SCHBusPin extends AbstractLine{
	constructor(){
		   super(1,core.Layer.LAYER_ALL);
	       this.displayName = "BusPin";	
	   	   this.selectionRectWidth=4;	
	   	   this.polyline.points.push(new d2.Point(0, 0));
	   	   this.polyline.points.push(new d2.Point(-8, -8));
		   this.texture=new SymbolFontTexture("XXX","name", 5, 0,2,8);
		}
	clone() {
		var copy = new SCHBusPin();		
		copy.texture =this.texture.clone();  
		copy.polyline=this.polyline.clone();
		return copy;
	}
	alignResizingPointToGrid(targetPoint) {
	    this.owningUnit.grid.snapToGrid(targetPoint);         
	}	
	calculateShape(){
		return this.polyline.box;
	}
	getClickedTexture(x,y) {
	    if(this.texture.isClicked(x, y))
	        return this.texture;	    
	    else
	    	return null;
	}
    
    isControlRectClicked( x,  y) {
    	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);

        if(rect.contains(this.polyline.points[1])){
           return this.polyline.points[1]; 
        }else{
           return null;
        }
    }	
	isClickedTexture(x,y) {
	    return this.getClickedTexture(x, y)!=null;
	}
	getTextureByTag(tag) {
	    if(tag===(this.texture.tag))
	        return this.texture;	    
	    else
	    	return null;
	}	
	setSelected (selection) {
		super.setSelected(selection);		
	    this.texture.setSelected(selection);
	    
	}	
	move(xoffset,yoffset){
		   super.move(xoffset,yoffset);
		   this.texture.move(xoffset,yoffset);
	}	
	rotate(rotation){
		super.rotate(rotation);
	 	let oldorientation=TextAlignment.getOrientation(this.texture.shape.alignment);	
	 	this.texture.rotate(rotation);
		   if(rotation.angle<0){  //clockwise		   
			   if(oldorientation == TextOrientation.HORIZONTAL){
				   this.texture.shape.anchorPoint.set(this.texture.shape.anchorPoint.x+(this.texture.shape.metrics.ascent-this.texture.shape.metrics.descent),this.texture.shape.anchorPoint.y);            
			   }
		   }else{		    
			   if(oldorientation == TextOrientation.VERTICAL){
				   this.texture.shape.anchorPoint.set(this.texture.shape.anchorPoint.x,this.texture.shape.anchorPoint.y+(this.texture.shape.metrics.ascent-this.texture.shape.metrics.descent));	           
			   }
		   }			
		
	}
	Resize(xoffset, yoffset, clickedPoint) {
		clickedPoint.set(clickedPoint.x + xoffset,
									clickedPoint.y + yoffset);
	}
	paint(g2, viewportWindow, scale,layersmask) {		
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}

		
		

		g2.lineWidth = this.thickness * scale.getScale();

		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = "black";

		let a=this.polyline.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		
		// draw floating point
		if (this.isFloating()) {
				let p = this.floatingMidPoint.clone();
				p.scale(scale.getScale());
				p.move( - viewportWindow.x, - viewportWindow.y);
				g2.lineTo(p.x, p.y);									
				g2.stroke();							    		
			
				p = this.floatingEndPoint.clone();
				p.scale(scale.getScale());
				p.move( - viewportWindow.x, - viewportWindow.y);
				g2.lineTo(p.x, p.y);									
				g2.stroke();					
		}
		
        this.texture.paint(g2, viewportWindow, scale);
		  
        if (this.isSelected()) {
            let c=new d2.Circle(this.polyline.points[0].clone(), 2);
            c.scale(scale.getScale());
            c.move(-viewportWindow.x,- viewportWindow.y);
            c.paint(g2,false);        
        
            
            utilities.drawCrosshair(g2,viewportWindow,scale,null,2,[this.polyline.points[1]]);
        }
        
        
		    
	}	
	fromXML(data){
		var points= j$(data).find('wirepoints')[0];
		var tokens = points.textContent.split("|");		
			
		let pt =tokens[0].split(",");
		let x = parseFloat(pt[0]);
		let y = parseFloat(pt[1]);
		this.polyline.points[0].set(x, y);
		
		pt =tokens[1].split(",");
		x = parseFloat(pt[0]);
		y = parseFloat(pt[1]);
		this.polyline.points[1].set(x, y);
		
		var texture=j$(data).find("name")[0];	
		this.texture.fromXML(texture.textContent);
	    
	}
}

var ConnectorType={
    INPUT:0,
    OUTPUT:1  
}

var Style={
    BOX:0,
    ARROW:1,
    CIRCLE:2  
}; 

class SCHConnector extends Shape{
	constructor(){
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.type=ConnectorType.OUTPUT;
		this.displayName="Connector";
		this.pin=new Pin();
		this.pin.setPinType(PinType.SIMPLE);
		this.shape=new CircleShape(this);
	}
	clone(){
		 var copy=new SCHConnector();
		 copy.type=this.type;
		 copy.pin=this.pin.clone();
		 
		 switch(this.getStyle()){
		 case Style.BOX:
			 
			 break;
		 case Style.ARROW:
			 break;
		 case Style.CIRCLE:
			 copy.shape=new CircleShape(this);
		 }
		 return copy;
	}
	getStyle(){
		if(this.shape instanceof BoxShape){
			return  Style.BOX;
		}else if(this.style instanceof ArrowShape){
			return  Style.ARROW;
		}else{
			return  Style.CIRCLE;
		}
	}
	move(xoff,yoff){
	   this.pin.move(xoff,yoff);	
	   this.shape.move(xoff,yoff);
	}
	paint(g2, viewportWindow, scale,layersmask) { 
		this.pin.paint(g2,viewportWindow, scale,layersmask);
		this.shape.paint(g2,viewportWindow, scale);
	}
}
class BoxShape{
	constructor(){
		
	}
	
}
class ArrowShape{
	constructor(){
		
	}
	
}
class CircleShape{
	constructor(connector){
		this.connector=connector
		this.circle=new d2.Circle(new d2.Point(0,0),2);
		this.calculatePoints();
	}
	calculatePoints(){
		switch(this.connector.pin.orientation){
	    case Orientation.EAST:        	    	
	    	this.circle.pc.set(this.connector.pin.segment.pe.x+2,this.connector.pin.segment.pe.y); 
	        break;
	    case Orientation.WEST:
	    	console.log(2);    	
	        break;
	    case Orientation.NORTH:
	    	console.log(3);    	
	        break;
	    case Orientation.SOUTH:
	    	console.log(4);
		}
	}
	move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}
	paint(g2,viewportWindow,scale){
	     
   	  	var rect = this.circle.box;
   	  	rect.scale(scale.getScale());
   	  	if (!rect.intersects(viewportWindow)) {
  		  return;
   	  	}		
	    
		if(this.connector.isSelected())
	        g2.fillStyle = "gray";  
	    else{
	        g2.fillStyle = "black";
	    }
	    
		
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
						
	}
}
class SCHJunction extends Shape{
	constructor(){
	  super(0, 0, 0, 0, 1,core.Layer.LAYER_ALL);	
	  this.displayName = "Junction";	
	  this.selectionRectWidth=2;	
	  this.circle=new d2.Circle(new d2.Point(0,0),this.selectionRectWidth);	
	}
	clone(){
	   	var copy = new SCHJunction();
		 copy.circle.pc.x=this.circle.pc.x;
		 copy.circle.pc.y=this.circle.pc.y;
		 copy.circle.r=this.circle.r;	        	        
	     return copy;
	}		
alignToGrid(isRequired) {
    let point=this.owningUnit.getGrid().positionOnGrid(this.circle.pc.x, this.circle.pc.y);
    this.circle.pc.set(point.x,point.y);    
    return null;
}
move(xoffset, yoffset) {
	this.circle.move(xoffset,yoffset);
} 
rotate(rotation){	  
	this.circle.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	   
}
calculateShape() {
    return this.circle.box;
}
paint(g2, viewportWindow, scale,layersmask) {  
	  var rect = this.circle.box;
  	  rect.scale(scale.getScale());
  	  if (!rect.intersects(viewportWindow)) {
  		  return;
  	  }		
  	  g2.lineWidth=(scale.getScale())*this.thickness;
  	  if (this.selection) {
  		 g2.fillStyle = "gray";
  	  } else {
		 g2.fillStyle = "blue";
  	  }

    let c=this.circle.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
    g2._fill=true;
    c.paint(g2);
    g2._fill=false;
  	  
}
fromXML(data){
	var tokens = data.textContent.split(",");	
	this.circle.pc.set(parseFloat(tokens[0]),parseFloat(tokens[1]));
}
}
module.exports ={
		SCHSymbol,
		SCHWire,
		SCHBus,
		SCHBusPin,
		SCHFontLabel,		
		SCHJunction,
		SCHConnector,
		CircuitShapeFactory,
		
}