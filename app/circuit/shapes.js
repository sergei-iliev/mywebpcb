var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var SymbolFontTexture=require('core/text/d2font').SymbolFontTexture;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var Pin=require('symbols/shapes').Pin;
var FontLabel=require('symbols/shapes').FontLabel;
var PIN_LENGTH=require('symbols/shapes').PIN_LENGTH;
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
			if (data.tagName.toLowerCase() == 'noconnector') {
				var symbol = new SCHNoConnector();
				symbol.fromXML(data);
				return symbol;
			}						
			if (data.tagName.toLowerCase() == 'connector') {
				var symbol = new SCHConnector();
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
getClickableOrder() {
	var box = this.getBoundingShape();	
	return box.width*box.height;
}
setSelected(selected) {        
    super.setSelected(selected);
    
    this.shapes.forEach(shape=>{   
      shape.fillColor=(selected?"blue":"black");
    });
    this.unit.setSelected(selected);
    this.reference.setSelected(selected);        
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
        return this.unit;
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
	  
	   this.unit.setRotation(rotation);
	   this.reference.setRotation(rotation);
}
mirror(line){
	var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].mirror(line);  
	   } 	   
	   this.mirrorText(line,this.unit);
	   this.mirrorText(line,this.reference);	   
}
mirrorText(line,texture){
   	let oldalignment = texture.shape.alignment;
	texture.mirror(line);	
    if (line.isVertical) { //right-left mirroring
        if (texture.shape.alignment == oldalignment) {
            texture.shape.anchorPoint.set(texture.shape.anchorPoint.x +
                                    (texture.shape.metrics.ascent - texture.shape.metrics.descent),texture.shape.anchorPoint.y);
        }
    } else { //***top-botom mirroring          
        if (texture.shape.alignment == oldalignment) {
        	texture.shape.anchorPoint.set(texture.shape.anchorPoint.x,texture.shape.anchorPoint.y +(texture.shape.metrics.ascent - texture.shape.metrics.descent));
        }
    } 	
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
fromXML(data){
	this.type=SymbolType.parse(j$(data).attr("type"));
	this.displayName=j$(data).find("name")[0].textContent;	
	
	var reference=j$(data).find("reference")[0];
	var label=j$(reference).find("label")[0];
	
	if(label!=undefined){
	  this.reference.fromXML(label.textContent);
	  this.reference.fillColor="#" +(j$(label).attr("color") & 0x00FFFFFF).toString(16).padStart(6, '0');	  
	}else{
	  this.reference.fromXML(reference.textContent);
	}
	var unit=j$(data).find("unit")[0];
	var label=j$(unit).find("label")[0];
	
	if(label!=undefined){	  		
	  this.unit.fromXML(label.textContent);	  
	  this.unit.fillColor="#" +(j$(label).attr("color") & 0x00FFFFFF).toString(16).padStart(6, '0');
	}else{
	  this.unit.fromXML(unit.textContent);	 
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
    
    alignToGrid(isRequired) {
       let point=this.polyline.points[1]; 
       let p=this.owningUnit.grid.positionOnGrid(point.x,point.y);        
        
       this.texture.move(p.x-point.x,p.y-point.y);  
       point.set(p);
        
       point=this.polyline.points[0]; 
       p=this.owningUnit.grid.positionOnGrid(point.x,point.y);        
       point.set(p);      
             
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
		this.selectionRectWidth=4;
		this.texture=new SymbolFontTexture("Nikola","name", -4, 0,0,8);		
		this.type=ConnectorType.INPUT;
		this.displayName="Connector";
		this.segment=new d2.Segment(0,0,(PIN_LENGTH / 2),0);		
		this.shape=new ArrowShape(this);
	}
	clone(){
		 var copy=new SCHConnector();
		 copy.type=this.type;
		 copy.segment=this.segment.clone();
		 copy.texture =this.texture.clone(); 
		 switch(this.getStyle()){
		 case Style.BOX:
			 copy.shape=new BoxShape(copy);
			 break;
		 case Style.ARROW:
			 copy.shape=new ArrowShape(copy);
			 break;
		 case Style.CIRCLE:
			 copy.shape=new CircleShape(copy);
		 }
		 return copy;
	}
	getClickableOrder() {		
		return 4;
	}	
	alignToGrid(isRequired) {
	    var center=this.segment.ps;
	    var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
	    this.move(point.x - center.x,point.y - center.y);	     	       
	    return new d2.Point(point.x - center.x, point.y - center.y);
	}
	getTextureByTag(tag) {
	    if(tag===(this.texture.tag))
	        return this.texture;	    
	    else
	    return null;
	}	
	getClickedTexture(x,y) {
	    if(this.texture.isClicked(x, y))
	        return this.texture;	    
	    else
	    return null;
	}
	isClickedTexture(x,y) {
	    return this.getClickedTexture(x, y)!=null;
	}	
	calculateShape(){
		return this.segment.box;
	}
	setSelected (selection) {
		super.setSelected(selection);
		this.texture.setSelected(selection);		
	}	
	setType(type){
		this.type=type;
		this.shape.calculatePoints();
	}
    setText(text){
        this.texture.setText(text);
        this.shape.calculatePoints();
     } 	
	isClicked(x,y){
		  var rect = d2.Box.fromRect(x
					- (this.selectionRectWidth / 2), y
					- (this.selectionRectWidth / 2), this.selectionRectWidth,
					this.selectionRectWidth);
		  
		if (utilities.intersectLineRectangle(
				this.segment.ps,this.segment.pe, rect.min, rect.max)) {			
				return true;
		}else if(this.texture.isClicked(x,y)){
	    	return true;
	    }else
	     return   this.shape.contains(new d2.Point(x,y));
	 }	
	getStyle(){
		if(this.shape instanceof BoxShape){
			return  Style.BOX;
		}else if(this.shape instanceof ArrowShape){
			return  Style.ARROW;
		}else{
			return  Style.CIRCLE;
		}
	}
	setStyle(shape){
	  switch(shape){
	  case Style.ARROW:
		this.shape=new ArrowShape(this);  
		break;
	  case Style.BOX:
		this.shape=new BoxShape(this);
		break;
	  case Style.CIRCLE:
		this.shape=new CircleShape(this);	  
	  }
	  this.shape.calculatePoints();
	}
	rotate(rotation){
		this.segment.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
		this.texture.setRotation(rotation);
		this.shape.calculatePoints();				
	}	
	mirror(line){
    	this.segment.mirror(line);
    	this.texture.mirror(line);
    	this.shape.calculatePoints();
    }
	move(xoff,yoff){
	   this.segment.move(xoff,yoff);	
	   this.shape.move(xoff,yoff);
	   this.texture.move(xoff,yoff);
	}
	paint(g2, viewportWindow, scale,layersmask) { 
		var rect = this.segment.box;
		rect.scale(scale.getScale());		
		if (!rect.intersects(viewportWindow)) {
			return;
		}
   	  	if(this.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";	        
	    }
   	  	//utilities.drawCrosshair(g2, viewportWindow, scale,null,2,[this.segment.ps.clone()]);
	    let line=this.segment.clone();                	    
		line.scale(scale.getScale());
	    line.move(-viewportWindow.x,- viewportWindow.y);	    
	    g2.lineWidth = this.thickness * scale.getScale();
	    line.paint(g2);
	    
		this.shape.paint(g2,viewportWindow, scale);
		this.texture.paint(g2,viewportWindow, scale);
	}
	init(orientation){
	
	    switch (orientation) {
	    case Orientation.EAST:        
	        this.segment.pe.set(this.segment.ps.x + (PIN_LENGTH / 2), this.segment.ps.y);
	        break;
	    case Orientation.WEST:
	    	this.segment.pe.set(this.segment.ps.x - (PIN_LENGTH / 2), this.segment.ps.y);    	
	        break;
	    case Orientation.NORTH:
	    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y - (PIN_LENGTH / 2));    	
	        break;
	    case Orientation.SOUTH:    	
	    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y + (PIN_LENGTH / 2));
	    }   
	}	
	fromXML(data){		
		var tokens = j$(data).find("a")[0].textContent.split(",");
		this.segment.ps.set(parseFloat(tokens[0]),parseFloat(tokens[1]));
		this.init(parseInt(tokens[3]));
		
		this.setStyle(Number.parseInt(j$(data).attr("style")));
		this.setType(Number.parseInt(j$(data).find("type")[0].textContent));
		var texture=j$(data).find("name")[0];	
		this.texture.fromXML(texture.textContent);
		
		this.shape.calculatePoints();
	}	
}
class BoxShape{
	constructor(connector){
		this.connector=connector
		this.polygon=new d2.Polygon();
		this.calculatePoints();	
	}
	calculatePoints(){
		  this.polygon.points.length=0;
		  let rect=this.connector.texture.shape.box;
		  let width=2+rect.width; 
		  let height=2+rect.height;
	
		  switch(this.connector.type) {
		  case ConnectorType.OUTPUT:
		  if(this.connector.segment.isVertical){
			  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
			  let v1=v.clone();
			  v1.rotate90CCW();
			  let norm=v1.normalize();			  
			  let xx=this.connector.segment.ps.x +4*norm.x;
			  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(xx,yy));
			  
			  let v2=v.clone();
			  v2.rotate90CW();
			  norm=v2.normalize();			  
			  let x=this.connector.segment.ps.x +4*norm.x;
			  let y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  v2.rotate90CCW();
			  norm=v2.normalize();			  
			  x=x +height*norm.x;
			  y=y +height*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  norm=v.normalize();			  
			  x=this.connector.segment.ps.x +(4+height)*norm.x;
			  y=this.connector.segment.ps.y +(4+height)*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));

			  
			  v1.rotate90CW();
			  norm=v1.normalize();			  
			  xx=xx +height*norm.x;
			  yy=yy +height*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(xx,yy));  			  
		  }else{
				  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
				  
				  let v1=v.clone();
				  v1.rotate90CCW();
				  let norm=v1.normalize();			  
				  let xx=this.connector.segment.ps.x +4*norm.x;
				  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));
				  
				  let v2=v.clone();
				  v2.rotate90CW();
				  norm=v2.normalize();			  
				  let x=this.connector.segment.ps.x +4*norm.x;
				  let y=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  v2.rotate90CCW();
				  norm=v2.normalize();			  
				  x=x +width*norm.x;
				  y=y +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  norm=v.normalize();			  
				  x=this.connector.segment.ps.x +(4+width)*norm.x;
				  y=this.connector.segment.ps.y +(4+width)*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));

				  
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  xx=xx +width*norm.x;
				  yy=yy +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));  			  
		   }
		  break;
		  case ConnectorType.INPUT:
			  if(this.connector.segment.isVertical){
				  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);				  				  				  
				  let norm=v.normalize();			  
				  let xx=this.connector.segment.ps.x +4*norm.x;
				  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  
				  
				  
				  let v1=v.clone();
				  v1.rotate90CCW();
				  norm=v1.normalize();			  
				  xx=(xx) +4*norm.x;
				  yy=(yy) +4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));
				  
				  norm=v.normalize();			  
				  let x=xx +height*norm.x;
				  let y=yy +height*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));

				  v1=v.clone();
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +8*norm.x;
				  y=y +8*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +height*norm.x;
				  y=y +height*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  this.polygon.points.push(this.connector.segment.ps.clone());
			  }else{
				  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);				  				  				  
				  let norm=v.normalize();			  
				  let xx=this.connector.segment.ps.x +4*norm.x;
				  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  
				  
				  
				  let v1=v.clone();
				  v1.rotate90CCW();
				  norm=v1.normalize();			  
				  xx=(xx) +4*norm.x;
				  yy=(yy) +4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));
				  
				  norm=v.normalize();			  
				  let x=xx +width*norm.x;
				  let y=yy +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));

				  v1=v.clone();
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +8*norm.x;
				  y=y +8*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +width*norm.x;
				  y=y +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  this.polygon.points.push(this.connector.segment.ps.clone()); 
			  }
			  break;
		  }
	}
    contains(pt){
    	return this.polygon.contains(pt);
    }
	move(xoffset, yoffset) {
		this.polygon.move(xoffset,yoffset);
	}	
	paint(g2,viewportWindow,scale){
   	  	var rect = this.polygon.box;
   	  	rect.scale(scale.getScale());
   	  	if (!rect.intersects(viewportWindow)) {
  		  return;
   	  	}		
	    
	    let p=this.polygon.clone();
		p.scale(scale.getScale());
        p.move(-viewportWindow.x,- viewportWindow.y);
        
   	  	if(this.connector.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";
	        
	    }
   	  	p.paint(g2);		
	}	
}
class ArrowShape{
	constructor(connector){
		this.connector=connector
		this.polygon=new d2.Polygon();
		this.calculatePoints();		
	}
	calculatePoints(){
		  this.polygon.points.length=0;
		  
		  switch(this.connector.type) {
		  case ConnectorType.OUTPUT:
			  {let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
			  let norm=v.normalize();			  
			  let x=this.connector.segment.ps.x +4*norm.x;
			  let y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
		  
			  let v1=v.clone();
			  v1.rotate90CCW();
			  norm=v1.normalize();			  
			  x=this.connector.segment.ps.x +4*norm.x;
			  y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
		  
			  let v2=v.clone();
			  v2.rotate90CW();
			  norm=v2.normalize();			  
			  x=this.connector.segment.ps.x +4*norm.x;
			  y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  break;
			  }
		  case ConnectorType.INPUT:
			  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
			  let norm=v.normalize();			  
			  let xx=this.connector.segment.ps.x +4*norm.x;
			  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  
			  let v1=v.clone();
			  v1.rotate90CCW();
			  norm=v1.normalize();			  
			  let x=xx +4*norm.x;
			  let y=yy + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  v1=v.clone();
			  v1.rotate90CW();
			  norm=v1.normalize();			  
			  x=xx +4*norm.x;
			  y=yy + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  this.polygon.points.push(this.connector.segment.ps.clone());
		  }
	}	
    contains(pt){
    	return this.polygon.contains(pt);
    }
	move(xoffset, yoffset) {
		this.polygon.move(xoffset,yoffset);
	}
	paint(g2,viewportWindow,scale){
   	  	var rect = this.polygon.box;
   	  	rect.scale(scale.getScale());
   	  	if (!rect.intersects(viewportWindow)) {
  		  return;
   	  	}		
	    
	    let p=this.polygon.clone();
		p.scale(scale.getScale());
        p.move(-viewportWindow.x,- viewportWindow.y);
        
   	  	if(this.connector.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";
	        
	    }
   	  	p.paint(g2);		
	}
}

class CircleShape{
	constructor(connector){
		this.connector=connector
		this.circle=new d2.Circle(new d2.Point(0,0),4);
		this.calculatePoints();
	}
	calculatePoints(){
		  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
		  let norm=v.normalize();			  
		  let x=this.connector.segment.ps.x +4*norm.x;
		  let y=this.connector.segment.ps.y + 4*norm.y;				
		 	   	
		  this.circle.pc.set(x,y); 
	}
    contains(pt){
    	return this.circle.contains(pt);
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
	    
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
        
   	  	if(this.connector.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";
	        
	    }
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
getClickableOrder() {		
	return 1;
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
mirror(line){
	this.circle.mirror(line);	
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
  		 g2.fillStyle = "blue";
  	  } else {
		 g2.fillStyle = "black";
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
class SCHNoConnector extends Shape{
	constructor(){
		  super(0, 0, 0, 0, 1,core.Layer.LAYER_ALL);	
		  this.displayName = "NoConnector";	
		  this.selectionRectWidth=3;	
		  this.point=new d2.Point(0,0);
			
		}
clone(){
		   	var copy = new SCHNoConnector();
		   	copy.point=this.point.clone();		   	 	         	        
		    return copy;
		}		
alignToGrid(isRequired) {
    this.owningUnit.getGrid().snapToGrid(this.point);         
    return null;
}
getClickableOrder() {		
	return 3;
}
calculateShape(){
    return d2.Box.fromRect(this.point.x - this.selectionRectWidth, this.point.y - this.selectionRectWidth, 2 * this.selectionRectWidth,
            2 * this.selectionRectWidth);
}		
move(xoffset,yoffset){
	this.point.move(xoffset,yoffset);
}
rotate(rotation){
	this.point.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	   
}
mirror(line){
	this.point.mirror(line);	
}
paint(g2, viewportWindow, scale,layersmask) {  
	  var rect = this.getBoundingShape();
	  rect.scale(scale.getScale());
	  if (!rect.intersects(viewportWindow)) {
		  return;
	  }	  
	  
	  g2.lineWidth=(scale.getScale())*this.thickness;
 	  	if(this.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";	        
	    }
	  let line=new d2.Segment(this.point.x-this.selectionRectWidth, this.point.y-this.selectionRectWidth,this.point.x+this.selectionRectWidth, this.point.y+this.selectionRectWidth);	  	 
	  line.scale(scale.getScale());
	  line.move(-viewportWindow.x,- viewportWindow.y);  
	  line.paint(g2);  
	  
	  line.set(this.point.x-this.selectionRectWidth, this.point.y+this.selectionRectWidth,this.point.x+this.selectionRectWidth, this.point.y-this.selectionRectWidth);	  	 
	  line.scale(scale.getScale());
	  line.move(-viewportWindow.x,- viewportWindow.y);  
	  line.paint(g2);  
	  
	  
}
fromXML(data){
	let x=parseFloat(j$(data).attr("x"));
	let y=parseFloat(j$(data).attr("y"));			
	this.point.set(x,y);
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
		SCHNoConnector,
		CircuitShapeFactory,
		
}