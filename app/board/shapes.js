var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var Circle =require('pads/shapes').Circle;
var Arc =require('pads/shapes').Arc;
var Pad =require('pads/shapes').Pad;
var Line =require('pads/shapes').Line;
var RoundRect =require('pads/shapes').RoundRect;
var SolidRegion =require('pads/shapes').SolidRegion;
var GlyphLabel=require('pads/shapes').GlyphLabel;
var AbstractLine=require('core/shapes').AbstractLine;
var FootprintShapeFactory=require('pads/shapes').FootprintShapeFactory;
var d2=require('d2/d2');


class BoardShapeFactory{
	
	createShape(data){
		if (data.tagName.toLowerCase() == 'footprint') {
			var footprint = new PCBFootprint(0, 0, 0, 0,0,0);
			footprint.fromXML(data);
			return footprint;
		}
		if (data.tagName.toLowerCase() == 'via') {
			var via = new PCBVia(0, 0, 0, 0,0,0);
			via.fromXML(data);
			return via;
		}		
		if (data.tagName.toLowerCase() == 'circle') {
			var circle = new PCBCircle(0, 0, 0, 0, 0);
			circle.fromXML(data);
			return circle;
		}
		if (data.tagName.toLowerCase() == 'arc') {
			var arc = new PCBArc(0, 0, 0, 0, 0);
			arc.fromXML(data);
			return arc;
		}
		if (data.tagName.toLowerCase() == 'rectangle') {
			var roundRect = new PCBRoundRect(0, 0, 0, 0, 0,0, core.Layer.SILKSCREEN_LAYER_FRONT);
			roundRect.fromXML(data);
			return roundRect;
		}
		if (data.tagName.toLowerCase() == 'line') {
			var line = new PCBLine( 0, 0, 0, 0, 0);
			line.fromXML(data);
			return line;
		}
		if (data.tagName.toLowerCase() == 'copperarea') {
			var area = new PCBCopperArea( 0, 0, 0, 0, 0);
			area.fromXML(data);
			return area;
		}
		if (data.tagName.toLowerCase() == 'track') {
		    var track = new PCBTrack(0, 0, 0, 0, 0);
		    track.fromXML(data);
		    return track;
	    }		
		if (data.tagName.toLowerCase() == 'hole') {
			var hole = new PCBHole(0, 0, 0, 0, 0);
			hole.fromXML(data);
			return hole;
		}
		if (data.tagName.toLowerCase() == 'label') {
			var label = new PCBLabel(0, 0, 0);
			label.fromXML(data);		
			return label;
		}
		return null;
	}
}

class PCBFootprint extends Shape{
constructor(layermaskId){
		super(0,0,0,0,0,layermaskId);
		this.displayName = "Footprint";
   	    this.shapes=[];
	    this.reference=(new glyph.GlyphTexture("","reference", 0, 0,  core.MM_TO_COORD(1.2)));
	    this.value=(new glyph.GlyphTexture("","value", 8,8,core.MM_TO_COORD(1.2)));		 	    
        this.units=core.Units.MM;
        this.val=2.54;  
        this.rotation=0;
	}
clone(){
        var copy=new PCBFootprint(this.copper.getLayerMaskID());
        copy.shapes=[];
        copy.rotation=this.rotation;
        copy.units=this.units;
        copy.val=this.val;
        copy.value =this.value.clone();
        copy.reference =this.reference.clone();        
        copy.displayName=this.displayName;
        this.shapes.forEach(function(shape){ 
          copy.add(shape.clone());  
        });
        return copy;        
    }
add(shape){
    if (shape == null)
          return;
    shape.isControlPointVisible=false;
    this.shapes.push(shape);  
}
getPinsRect(){
    var x1=Number.MAX_VALUE,y1=Number.MAX_VALUE,x2=Number.MIN_VALUE,y2=Number.MIN_VALUE;
    var isPinnable=false;
    //***empty schematic,element,package
    if (this.shapes.length == 0) {
        return null;
    }

    this.shapes.forEach(function(shape) { 
        if(shape instanceof Pad){
          let p=shape.getPinPoint();
          x1=Math.min(x1,p.x );
          y1=Math.min(y1,p.y);
          x2=Math.max(x2,p.x);
          y2=Math.max(y2,p.y);             
          isPinnable=true;
        }
    });
    if(isPinnable)
        return  d2.Box.fromRect(x1,y1,x2-x1,y2-y1);          
    else
        return null;  
    
}
getPads(){
   return this.shapes.filter(s => s instanceof Pad);        
}
getClickedTexture(x,y) {
    if(this.reference.isClicked(x, y))
        return this.reference;
    else if(this.value.isClicked(x, y))
        return this.value;
    else
    return null;
}
isClickedTexture(x,y) {
    return this.getClickedTexture(x, y)!=null;
}
getTextureByTag(tag) {
    if(tag===(this.reference.tag))
        return this.reference;
    else if(tag===(this.value.tag))
        return this.value;
    else
    return null;
}
setSide(side){
    //mirror footprint
    let r=this.getBoundingShape();
    let p=r.center;
    let line= new d2.Line(new d2.Point(p.x,p.y-10),new d2.Point(p.x,p.y+10));
    
    this.shapes.forEach(shape=>{
        shape.setSide(side,line,(360-this.rotation));
    });  
    this.reference.setSide(side,line,(360-this.rotation));       
    this.value.setSide(side,line,(360-this.rotation));       
    
    this.copper=(core.Layer.Side.change(this.copper.getLayerMaskID()));
    this.rotation=360-this.rotation;	
}
getSide(){
    return core.Layer.Side.resolve(this.copper.getLayerMaskID());       
}

clear() {    
	this.shapes.forEach(function(shape) {
		  shape.owningUnit=null;
		  shape.clear();
		  shape=null;
     });
     this.shapes=[];	
     this.value.clear();
     this.reference.clear();
}
getOrderWeight() {
   var r=this.getBoundingShape();
   return (r.width);
}
isClicked(x,y){
	var r=this.getBoundingShape();
	if(!r.contains(x,y)){
		return false;
	}
	let ps=new d2.Polygon();
	var result= this.shapes.some(function(shape) {
	   if(!(shape instanceof Line)){ 
		return shape.isClicked(x,y);
	   }else{
		ps.points.push(...shape.vertices);  //line vertices   
		return false;
	   }
	});		
	if(result){
		return true;//click on a anything but a Line
	}
	
	this.sortPolygon(ps.points);  //line only
	return ps.contains(x,y);
}

isVisibleOnLayers(layermasks){
    for(const shape of this.shapes){
       if(shape.isVisibleOnLayers(layermasks))
         return true;
    }
    return false;
}  

isClickedOnLayers(x, y, layermasks) {
    for(const shape of this.shapes){
        if(shape.isVisibleOnLayers(layermasks)){
            if(shape.isClicked(x, y))
              return true;
        }             
    }
    return false;   
}
getPolygonCentroid(points){
	let x=0,y=0;
	points.forEach(p=>{
		x+=p.x;
		y+=p.y;
	});
	return new d2.Point(x/points.length,y/points.length);
}
sortPolygon(points){
	let center=this.getPolygonCentroid(points);
	
	points.sort((a,b)=>{
	 let a1=(utilities.degrees(Math.atan2(a.x-center.x,a.y-center.y))+360)%360;
	 let a2=(utilities.degrees(Math.atan2(b.x-center.x,b.y-center.y))+360)%360;
	 return (a1-a2);
	});
}

setSelected (selection) {
	super.setSelected(selection);
	this.shapes.forEach(function(shape) {	
		  shape.setSelected(selection);
		  	 
   });	
    this.value.setSelected(selection);
    this.reference.setSelected(selection);
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
	   this.value.move(xoffset,yoffset);
}
setRotation(rotate){
	let center=this.getBoundingShape().center;
	let len=this.shapes.length;
	for(var i=0;i<len;i++){
		
	   this.shapes[i].setRotation(rotate,center);  
	}	
    this.value.setRotation(rotate,center);
    this.reference.setRotation(rotate,center);
	this.rotation=rotate;
}
rotate(rotation){
	//fix angle
	   let alpha=this.rotation+rotation.angle;
	   if(alpha>=360){
		 alpha-=360
	   }
	   if(alpha<0){
		 alpha+=360; 
	   }

	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].rotate(rotation);  
	   }
	  
	   this.value.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	   this.reference.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	   this.rotation=alpha;
}
drawClearence(g2,viewportWindow,scale,source){
    let rect=this.getBoundingShape();
    if (!rect.intersects(source.getBoundingShape())) {    
    	return;
    }
    
    rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	var len=this.shapes.length;
	for(i=0;i<len;i++){
	  if(this.shapes[i] instanceof Pad){
		  this.shapes[i].drawClearence(g2,viewportWindow,scale,source); 
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
	if((this.value.layermaskId&layersmask)!=0) {
    	this.value.fillColor=core.Layer.Copper.resolve(this.value.layermaskId).getColor();
    	this.value.paint(g2, viewportWindow, scale, layersmask);
	}
	if((this.reference.layermaskId&layersmask)!=0) {
    	this.reference.fillColor=core.Layer.Copper.resolve(this.reference.layermaskId).getColor();
    	this.reference.paint(g2, viewportWindow, scale, layersmask);
	}
 }    
fromXML(data){
	 this.copper=core.Layer.Copper.valueOf(j$(data).attr("layer"));
	 this.val=parseFloat(j$(data).find("units").attr("raster"));
     this.units=core.Units.MM;	
     
	 var reference=j$(data).find("reference")[0];
 	 var value=j$(data).find("value")[0];
 	 	
 	 this.reference.fromXML(reference);
 	 
 	 this.value.fromXML(value);
 	 
 	 this.displayName=j$(data).find("name")[0].textContent;	
 	 
	 var that=this;
	 var shapeFactory=new FootprintShapeFactory();
	 
	 j$(data).find('shapes').children().each(function(){
         var shape=shapeFactory.createShape(this);
         that.add(shape);
	 });
}

toXML() {
    let xml="<footprint layer=\""+this.copper.getName()+"\">\r\n";
           xml+="<name>"+this.displayName+"</name>\r\n";
           xml+="<units raster=\""+this.val+"\">"+this.units+"</units>\r\n"; 
           xml+="<reference layer=\""+core.Layer.Copper.resolve(this.reference.layermaskId).getName()+"\">"+this.reference.toXML()+"</reference>\r\n";                           
           xml+="<value layer=\""+core.Layer.Copper.resolve(this.value.layermaskId).getName()+"\">"+this.value.toXML()+"</value>\r\n";             
           xml+="<shapes>\r\n";
           this.shapes.forEach(
            s=>xml+=s.toXML()
           )
           xml+="\r\n</shapes>\r\n";
           xml+="</footprint>";                 
    return xml;  
}
}

class PCBCircle extends Circle{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
    }	
    clone(){
    	let copy = new PCBCircle(this.x,this.y,this.width,this.thickness,this.copper.getLayerMaskID());
    	copy.circle=this.circle.clone();
    	copy.fill=this.fill;
    	return copy;
    }  
	paint(g2, viewportWindow, scale,layersmask) {	    		
		var rect = this.circle.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
		  g2.globalCompositeOperation = 'source-atop';	
		}else{
		  g2.globalCompositeOperation = 'lighter';
		}
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}			
		}

		let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		g2._fill=false;

		g2.globalCompositeOperation = 'source-over';
		
		  
 }
    
    
}

class PCBArc extends Arc{
    constructor( x, y,  r,  thickness, layermaskid) {
        super( x, y, r, thickness, layermaskid);
    }	
    clone() {
		var copy = new PCBArc(this.x, this.y, this.width,
						this.thickness,this.copper.getLayerMaskID());
        copy.arc=this.arc.clone();
		copy.arc.startAngle = this.arc.startAngle;
        copy.arc.endAngle = this.arc.endAngle;         
		copy.fill = this.fill;
		return copy;
}    
    paint(g2, viewportWindow, scale,layersmask) {	    
		var rect = this.arc.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		
		g2.beginPath(); // clear the canvas context
		g2.lineCap = 'round';

						
		g2.lineWidth = this.thickness * scale.getScale();
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
			  g2.globalCompositeOperation = 'source-atop';	
		}else{
			  g2.globalCompositeOperation = 'lighter';
		}				
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
					g2.strokeStyle = "gray";
			} else {
					g2.strokeStyle = this.copper.getColor();
			}
			g2._fill=false;
		} else {
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}
			g2._fill=true;
		}

		let a=this.arc.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);

		g2._fill=undefined;
		
		g2.globalCompositeOperation = 'source-over';
			    

	}
    
}

class PCBLabel extends GlyphLabel{
    constructor( layermaskId) {
        super("Label",core.MM_TO_COORD(0.3),layermaskId);
        this.clearance=0;
    }
clone(){
	var copy = new PCBLabel(this.copper.getLayerMaskID());
    copy.texture = this.texture.clone();        
    copy.copper=this.copper;
	return copy;
} 
drawClearence(g2,viewportWindow,scale,source){
   if((source.copper.getLayerMaskID()&this.copper.getLayerMaskID())==0){        
	   return;  //not on the same layer
   }
   let clear=this.clearance!=0?this.clearance:source.clearance;
   
   let rect=this.texture.getBoundingShape();
   rect.min.move(-clear,-clear);
   rect.max.move(clear,clear);
   
   if (!rect.intersects(source.getBoundingShape())) {
		return;
   }

    let r=this.texture.getBoundingRect();
 
	r.grow(clear);
    r.scale(scale.getScale());
	if (!r.intersects(viewportWindow)) {
		return;
	}
	
	g2._fill=true;
	g2.fillStyle = "black";	
	
	
    r.move(-viewportWindow.x,- viewportWindow.y);
	r.paint(g2);
	
    g2._fill=false;	
   
}
getDrawingOrder() {
        let order=super.getDrawingOrder();
        if(this.owningUnit==null){            
           return order;
        }
        
        if(this.owningUnit.activeSide==core.Layer.Side.resolve(this.copper.getLayerMaskID())){
          order= 4;
        }else{
          order= 3; 
        }  
        return order;
    }
paint(g2, viewportWindow, scale,layersmask) {    
		var rect = this.texture.getBoundingShape();
			rect.scale(scale.getScale());
			if (!rect.intersects(viewportWindow)) {
				return;
			}

		if (this.selection) {
			this.texture.fillColor = "gray";
		} else {
			this.texture.fillColor = this.copper.getColor();
		}
		this.texture.paint(g2, viewportWindow, scale,this.copper.getLayerMaskID());
  }
}
class PCBLine extends Line{
constructor(thickness,layermaskId){
        super(thickness,layermaskId);
    }
clone() {
		var copy = new PCBLine(this.thickness,this.copper.getLayerMaskID());
		  copy.polyline=this.polyline.clone();
		  return copy;
	}
paint(g2, viewportWindow, scale,layersmask) {		    
	   var rect = this.polyline.box;
	   rect.scale(scale.getScale());		
	   if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	   }
				
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		g2.lineWidth = this.thickness * scale.getScale();
		if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
			  g2.globalCompositeOperation = 'source-atop';	
		}else{
			  g2.globalCompositeOperation = 'lighter';
		}
		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = this.copper.getColor();

		let a=this.polyline.clone();
		if (this.isFloating()) {                                                    
         if(this.resumeState==ResumeState.ADD_AT_FRONT){                
             let p = this.floatingEndPoint.clone();
             a.points.unshift(p);               
         }else{		                            
             let p = this.floatingEndPoint.clone();
             a.add(p);    
         }
		} 	
		
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		
		g2.globalCompositeOperation = 'source-over';				

}
	  
}
class PCBSolidRegion extends SolidRegion{
	constructor(layermaskId){
	        super(layermaskId);
	    }
	clone() {
			var copy = new PCBSolidRegion(this.copper.getLayerMaskID());
			  copy.polygon=this.polygon.clone();  
			  return copy;
		}    
	paint(g2, viewportWindow, scale,layersmask) {			    
		var rect = this.polygon.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}
		
		g2.lineWidth = 1;
		
		if(this.isFloating()){
	      g2.strokeStyle = this.copper.getColor();		
		}else{
		  g2._fill=true;
		  if (this.selection) {
			 g2.fillStyle = "gray";
		  } else {
			 g2.fillStyle = this.copper.getColor();
		  }
		}

		

		let a=this.polygon.clone();	
		if (this.isFloating()) {
			let p = this.floatingEndPoint.clone();
			a.add(p);	
	    }
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		g2.globalCompositeOperation = 'lighter';
		a.paint(g2);
		g2.globalCompositeOperation = 'source-over';
		g2._fill=false;    
	}

}

class PCBRoundRect extends RoundRect{
constructor( x, y,  width,height,arc,  thickness, layermaskid) {
        super( x, y, width,height,arc, thickness, layermaskid);
        this.displayName = "Rect";
    }
clone(){
	var copy = new PCBRoundRect(0,0,0,0,0,this.thickness,this.copper.getLayerMaskID());
	copy.roundRect = this.roundRect.clone();
	copy.fill = this.fill;
	copy.arc=this.arc;
	return copy;	
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.roundRect.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	if(this.copper.getLayerMaskID()==core.Layer.BOARD_OUTLINE_LAYER){
	  g2.globalCompositeOperation = 'source-atop';	
	}else{
	  g2.globalCompositeOperation = 'lighter';
	}
	g2.lineWidth = this.thickness * scale.getScale();
	g2.lineCap = 'round';
	g2.lineJoin = 'round';

	if (this.fill == core.Fill.EMPTY) {		
		if (this.selection) {
			g2.globalCompositeOperation = 'source-over';
			g2.strokeStyle = "gray";
		} else {
			g2.strokeStyle = this.copper.getColor();
		}			
	} else {
		g2._fill=true;
		if (this.selection) {
			g2.globalCompositeOperation = 'source-over';
			g2.fillStyle = "gray";
		} else {
			g2.fillStyle = this.copper.getColor();
		}			
	}

	let r=this.roundRect.clone();	
	r.scale(scale.getScale());
    r.move(-viewportWindow.x,- viewportWindow.y);
	r.paint(g2);
	
	g2._fill=false;
	
	g2.globalCompositeOperation = 'source-over';

}

}
//************************PCBTrack********************
class PCBTrack extends AbstractLine{
constructor(thickness,layermaskId){
       super(thickness,layermaskId);
       this.displayName = "Track";
       this.clearance=0;
	}
clone() {
	var copy = new PCBTrack(this.thickness,this.copper.getLayerMaskID());
	copy.clearance=this.clearance=0;
	copy.resumeState=this.resumeState;
	copy.polyline=this.polyline.clone();
	return copy;

	}
getDrawingOrder() {
    let order=super.getDrawingOrder();
    if(this.owningUnit==null){            
        return order;
    }
    
    if(this.owningUnit.activeSide==core.Layer.Side.resolve(this.copper.getLayerMaskID())){
       order= 4;
     }else{
       order= 3; 
     }  
    return order;     
}
getOrderWeight() {
    return 4;
}
drawClearence(g2,viewportWindow,scale,source){
   if((source.copper.getLayerMaskID()&this.copper.getLayerMaskID())==0){        
	   return;  //not on the same layer
   }
   g2.lineWidth=(this.thickness+2*(this.clearance!=0?this.clearance:source.clearance))*scale.getScale(); 
   g2.strokeStyle = "black";
   
    
   
   g2.save();   
   g2.clip(source.clip);
   
   let a=this.polyline.clone();
   a.scale(scale.getScale());
   a.move( - viewportWindow.x, - viewportWindow.y);		
   a.paint(g2);

   g2.restore();
}
getSegments(){
    let list=[];
    let prevPoint = this.polyline.points[0];        
    for(let point of this.polyline.points){                          
        if(prevPoint.equals(point)){                        
            prevPoint = point;
            continue;
        }                       
        list.push(new d2.Segment(prevPoint.x,prevPoint.y,point.x,point.y));
        
        prevPoint = point;
    }
    return list;         
}
getNetShapes(selectedShapes){
	let net=[];
	//1.vias
    let vias=this.owningUnit.getShapes(PCBVia);
    
    vias.forEach(via=>{
        if(selectedShapes.has(via.uuid)){
            return;
        }else if(this.polyline.intersect(via.outer)){
           net.push(via); 
        }
    });
    //2.track on same layer
    let sameSideTracks=this.owningUnit.getShapes(PCBTrack,this.copper.getLayerMaskID());         
    let  circle=new d2.Circle(new d2.Point(0,0),0);
    for(let track of sameSideTracks ){
        if(track==this){
            continue;
        }
        if(selectedShapes.has(track.uuid)){
            continue;
        }
        //my points on another
        for(let pt of this.polyline.points){
            circle.pc=pt;
            circle.r=this.thickness/2;
            if(track.polyline.intersect(circle)){
               net.push(track);
               break;
            }   
        }
        //another points on me
        for(let pt of track.polyline.points){
            circle.pc=pt;
            circle.r=track.thickness/2;
            if(this.polyline.intersect(circle)){
               net.push(track);
               break;
            }   
        }            
        
    }
    //my track crossing other track on same layer
    let segments=this.getSegments();
    for(let track of sameSideTracks){
        if(track==this){
            continue;
        }
        if(selectedShapes.has(track.uuid)){
            continue;
        }            
        for(let segment of segments){
          //is my segment crossing anyone elses's?
            for(let other of track.getSegments()){
                if(segment.intersect(other)){
                    net.push(track);
                    break;
                }
            }
        }
        
    }
    //3.Footprint pads on me
    let footprints=this.owningUnit.getShapes(PCBFootprint);         
    //the other side
    let oppositeSideTracks=this.owningUnit.getShapes(PCBTrack,core.Layer.Side.change(this.copper.getLayerMaskID()).getLayerMaskID());    
    
    let bothSideTracks = [...sameSideTracks, ...oppositeSideTracks];
    for(let footprint of footprints){
        let pads=footprint.getPads();        
        for(let pad of pads){              
            for(let pt of this.polyline.points){
                if(pad.shape.contains(pt)){  //found pad on track -> investigate both SMD and THROUGH_HOLE
                    for(let track of bothSideTracks ){  //each track on SAME layer
                        //another points on me
                        for(let p of track.polyline.points){
                            if(pad.shape.contains(p)){
                                  if(selectedShapes.has(track.uuid)){
                                      continue;
                                  }
                                  //track and pad should be on the same layer
                                  if((this.copper.getLayerMaskID()&pad.copper.getLayerMaskID())!=0){
                                      if((track.copper.getLayerMaskID()&pad.copper.getLayerMaskID())!=0){ 
                                            net.push(track);
                                            break;
                                      }
                                  }
                            }
                        }   
                    }                        
                }               
            }
        }    	
    }
    
    return net;
}
paint(g2, viewportWindow, scale,layersmask) {    	
	var rect = this.polyline.box;
	rect.scale(scale.getScale());		
	if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	}

	if(this.owningUnit.compositeLayer.activeSide== core.Layer.Side.resolve(this.copper.getLayerMaskID())){
		g2.globalCompositeOperation = 'source-over';
	}else{
		g2.globalCompositeOperation = 'lighter';
	}
	g2.lineCap = 'round';
	g2.lineJoin = 'round';
	
    
	g2.lineWidth = this.thickness * scale.getScale();


	if (this.selection)
		g2.strokeStyle = "gray";
	else
		g2.strokeStyle = this.copper.getColor();

	let a=this.polyline.clone();
	
	
	
	// draw floating point
	if (this.isFloating()) {
		if(this.resumeState==ResumeState.ADD_AT_FRONT){
			let p = this.floatingMidPoint.clone();
			a.points.unshift(p);						    		
		
			p = this.floatingEndPoint.clone();
			a.points.unshift(p);			
		}else{
			let p = this.floatingMidPoint.clone();
			a.add(p);						    		
		
			p = this.floatingEndPoint.clone();
			a.add(p);
		}	
	}
	a.scale(scale.getScale());
	a.move( - viewportWindow.x, - viewportWindow.y);	
	a.paint(g2);	

	g2.globalCompositeOperation = 'source-over';

}
//drawControlShape(g2, viewportWindow, scale){       
//    this.drawControlShape(g2, viewportWindow, scale);
//}
fromXML(data) {
       this.copper =core.Layer.Copper.valueOf(j$(data).attr("layer"));
	   this.thickness = (parseInt(j$(data).attr("thickness")));
	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseFloat(tokens[index]);
			var y = parseFloat(tokens[index + 1]);
			this.polyline.points.push(new d2.Point(x, y));
		}
}
toXML() {
	var result = "<track layer=\"" + this.copper.getName()
								+ "\" thickness=\"" + this.thickness + "\" clearance=\"" + this.clearance + "\" net=\"" + this.net +"\">";
	this.polyline.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,5) + "," + utilities.roundFloat(point.y,5) + ",";
	},this);
	result += "</track>";
	return result;
}
}
class PCBHole extends Shape{
	constructor() {
		super(0, 0, 0, 0,0,core.Layer.LAYER_ALL);		
		this.displayName='Hole';	
        this.fillColor='white';
        this.selectionRectWidth = 3000;
        this.circle=new d2.Circle(new d2.Point(0,0),core.MM_TO_COORD(1.6)/2);
        this.clearance=0;
   	}
clone(){
	   	var copy = new PCBHole();
		 copy.circle.pc.x=this.circle.pc.x;
		 copy.circle.pc.y=this.circle.pc.y;
		 copy.circle.r=this.circle.r;	        	        
	     return copy;
}	
alignToGrid(isRequired) {
	    if(isRequired){
	       return super.alignToGrid(isRequired);
	    }else{
	        return null;
	    }
	}
move(xoffset, yoffset) {
	this.circle.move(xoffset,yoffset);
}
getOrderWeight() {
    return 3;
}
setWidth(width){
	  this.circle.r=width/2;
	}
calculateShape() {
	    return this.circle.box;
	}
drawClearence(g2, viewportWindow,scale, source) {
	
    let r=this.circle.r+(this.clearance!=0?this.clearance:source.clearance);
    let c=new d2.Circle(this.circle.pc.clone(),r);
	let rect=c.box;
	if (!rect.intersects(source.getBoundingShape())) {
		return;
	}

	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	g2._fill=true;
	g2.fillStyle = "black";	
	
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	
    g2._fill=false;	
}
paint(g2, viewportWindow, scale,layersmask) {	
	var rect = this.calculateShape();
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth=(scale.getScale())*1000;
	if (this.selection) {
		g2.strokeStyle = "gray";
	} else {
		g2.strokeStyle = "white";
	}

    let c=this.circle.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	
}
drawControlShape(g2, viewportWindow,scale){
	utilities.drawCrosshair(g2, viewportWindow, scale,null,this.selectionRectWidth,[this.circle.center]);
}
toXML(){
    return "<hole x=\""+utilities.roundFloat(this.circle.pc.x,5)+"\" y=\""+utilities.roundFloat(this.circle.pc.y,5)+"\" width=\""+this.circle.r*2+"\"  clearance=\""+this.clearance+"\" />";	
}
fromXML(data) {
	let x=parseFloat(j$(data).attr("x"));
	let y=parseFloat(j$(data).attr("y"));
    this.circle.pc.set(x,y);

	this.circle.r=(parseInt(j$(data).attr("width")))/2;	
	this.clearance=(parseInt(j$(data).attr("clearance")));		
} 

}
class PCBVia extends Shape{
constructor() {
		super(0, 0, 0, 0,core.MM_TO_COORD(0.3),core.Layer.LAYER_BACK|core.Layer.LAYER_FRONT);		
		this.outer=new d2.Circle(new d2.Point(0,0),core.MM_TO_COORD(0.8));
		this.inner=new d2.Circle(new d2.Point(0,0),core.MM_TO_COORD(0.4));
        this.selectionRectWidth = 3000;
		this.displayName='Via';	
        this.fillColor='white'; 
        this.clearance=0;
   	}

clone(){
   	var copy = new PCBVia();
        copy.inner=this.inner.clone();
        copy.outer=this.outer.clone();
        return copy;
   	}

alignToGrid(isRequired) {
    if(isRequired){
       return super.alignToGrid(isRequired);
    }else{
        return null;
    }
}
move(xoffset, yoffset) {
   this.outer.move(xoffset,yoffset);
   this.inner.move(xoffset,yoffset);
}
rotate(rotation) {
	this.inner.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
	this.outer.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
setWidth(width){

}
calculateShape() {
    return this.outer.box;
}
getNetShapes(selected) {
    let net=[]; 
    let tracks=this.owningUnit.getShapes(PCBTrack); 
    for(let  track of tracks){
        if(selected.has(track.uuid)){
            continue;
        }            

        if(track.polyline.intersect(this.outer)){
           net.push(track); 
        }
    }
    return net;
}
drawClearence(g2, viewportWindow,scale, source) {    
	
    let r=this.outer.r+(this.clearance!=0?this.clearance:source.clearance);
    let c=new d2.Circle(this.outer.pc.clone(),r);
	let rect=c.box;
	if (!rect.intersects(source.getBoundingShape())) {
		return;
	}

	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	g2._fill=true;
	g2.fillStyle = "black";	
	
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	
    g2._fill=false;
}
paint(g2, viewportWindow, scale,layersmask) {   
	var rect = this.calculateShape();
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2._fill=true;
	if (this.selection) {
		g2.fillStyle = "gray";
	} else {
		g2.fillStyle = "white";
	}

	let c=this.outer.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	

	g2.fillStyle = "black";	
	c=this.inner.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
	c.paint(g2);
	
    g2._fill=false;
	if(this.selection){
	   utilities.drawCrosshair(g2, viewportWindow, scale,null,this.selectionRectWidth,[this.inner.center]);
	}    
}
getOrderWeight() {
    return 3;
}
fromXML(data) {
	let x=parseFloat(j$(data).attr("x"));
	let y=parseFloat(j$(data).attr("y"));
    this.inner.pc.set(x,y);
    this.outer.pc.set(x,y);


	this.outer.r=(parseInt(j$(data).attr("width")))/2;
	this.inner.r = (parseInt(j$(data).attr("drill")))/2;
	this.clearance=(parseInt(j$(data).attr("clearance")));
}
toXML() {
    return "<via x=\""+utilities.roundFloat(this.inner.center.x,5)+"\" y=\""+utilities.roundFloat(this.inner.center.y,5)+"\" width=\""+this.outer.r*2+"\" drill=\""+this.inner.r*2+"\"   clearance=\""+this.clearance+"\" net=\""+(this.net==null?"":this.net)+"\" />";    
}
}
class PCBCopperArea extends Shape{
	constructor( layermaskid) {
        super( 0, 0, 0,0, 0, layermaskid);
        this.displayName = "Copper Area";
        this.clearance=core.MM_TO_COORD(0.2); 
        this.floatingStartPoint=new d2.Point();
        this.floatingEndPoint=new d2.Point();                 
        this.selectionRectWidth = 3000;
        this.fill=core.Fill.FILLED;
        this.polygon=new d2.Polygon();
        this.resizingPoint;
        this.clip=null;
        this.net='gnd';
    }
clone(){
    let copy=new PCBCopperArea(this.copper.getLayerMaskID());
    copy.polygon=this.polygon.clone();  
    return copy;	
}

prepareClippingRegion(viewportWindow,scale){
    let arr=[];
    this.polygon.points.forEach(function(point){
        let p=point.clone();            
        p.scale(scale.getScale());
        p.move(-viewportWindow.x,-viewportWindow.y);
        arr.push(p);    
	}.bind(this));
    //prepare clip only once
    this.clip = new Path2D();    
    this.clip.moveTo(arr[0].x,arr[0].y);
    for (var i = 1; i < arr.length; i++) {
 	   this.clip.lineTo(arr[i].x, arr[i].y);
    } 
    
}

alignResizingPointToGrid(pt) {
    this.owningUnit.getGrid().snapToGrid(pt);
}
calculateShape(){  	    
   return this.polygon.box;
}	

getLinePoints() {
   return this.polygon.points;
}
add(point) {
    this.polygon.add(point);
}
getDrawingOrder() {
    if(this.owningUnit==null){            
        return super.getDrawingOrder();
    }
    
    if(this.owningUnit.compositeLayer.activeSide==core.Layer.Side.resolve(this.copper.getLayerMaskID())){
       return 2;
    }else{
       return 1; 
    }
}
setResizingPoint(point) {
    this.resizingPoint=point;
}
isFloating() {
    return (!this.floatingStartPoint.equals(this.floatingEndPoint));                
}
isClicked(x,y){
	  var result = false;
		// build testing rect
	  var rect = d2.Box.fromRect(x
								- (3000 / 2), y
								- (3000 / 2), 3000,
								3000);
	  var r1 = rect.min;
	  var r2 = rect.max;

	  // ***make lines and iterate one by one
	  var prevPoint = this.polygon.points[this.polygon.points.length-1];

	  this.polygon.points.some(function(wirePoint) {
							// skip first point
							{
								if (utilities.intersectLineRectangle(
										prevPoint, wirePoint, r1, r2)) {
									result = true;
									return true;
								}
								prevPoint = wirePoint;
							}

						});

	return result;
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polygon.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
isInRect(r) {

    return this.polygon.points.every(function(wirePoint){
    	return r.contains(wirePoint.x,wirePoint.y);                        
    });
    
}
reset(){
	this.resetToPoint(this.floatingStartPoint);	
}
resetToPoint(p){
    this.floatingStartPoint.set(p.x,p.y);
    this.floatingEndPoint.set(p.x,p.y); 
}
rotate(rotation) {
	this.polygon.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
paint(g2,viewportWindow,scale, layersmask){
	var rect = this.polygon.box;
	rect.scale(scale.getScale());		
	if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	}
	
	g2.lineWidth = 1;
	
	if(this.isFloating()){
      g2.strokeStyle = this.copper.getColor();		
	}else{
	  g2._fill=true;
	  if (this.selection) {
		 g2.fillStyle = "gray";
	  } else {
		 g2.fillStyle = this.copper.getColor();
	  }
	}
	let a=this.polygon.clone();	
	if (this.isFloating()) {
		let p = this.floatingEndPoint.clone();
		a.add(p);	
    }
	a.scale(scale.getScale());
	a.move( - viewportWindow.x, - viewportWindow.y);		
	a.paint(g2);
	g2._fill=false;
    
    
    //draw clearence background
    this.prepareClippingRegion(viewportWindow, scale);
    this.owningUnit.shapes.forEach(target=>{
    	if(target.drawClearence!=undefined){
         target.drawClearence(g2, viewportWindow, scale, this);
    	}
    });
	
	
//	let dst = [];
//	this.polygon.points.forEach(function(point) {
//		dst.push(point.getScaledPoint(scale));
//	});
//	g2.globalCompositeOperation = 'lighter';
//	g2.beginPath();
//	g2.lineCap = 'round';
//	g2.lineJoin = 'round';
//	g2.moveTo(dst[0].x - viewportWindow.x, dst[0].y
//							- viewportWindow.y);
//	for (var i = 1; i < dst.length; i++) {
//						g2.lineTo(dst[i].x - viewportWindow.x, dst[i].y
//								- viewportWindow.y);
//	}
//	
//	// draw floating point
//	if (this.isFloating()) {
//			let p = this.floatingEndPoint.getScaledPoint(scale);
//				g2.lineTo(p.x - viewportWindow.x, p.y
//								- viewportWindow.y);
//	}
//	g2.closePath();
//
//	if (this.selection){
//		g2.fillStyle = "gray";
//    }else{    	
//		g2.fillStyle = this.copper.getColor();
//	}
//    g2.fill();   
//    
//    if(this.isSelected()){  
//    	g2.lineWidth=1;
//    	g2.strokeStyle = "blue";                   
//        g2.stroke();
//    
//        this.drawControlShape(g2,viewportWindow,scale);
//    }
//    
//	g2.globalCompositeOperation = 'source-over';
}	
drawControlShape(g2, viewportWindow, scale) {
	if (this.isSelected()) {	
	  utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.polygon.points);
	}
}
fromXML(data){
    this.copper =core.Layer.Copper.valueOf(j$(data).attr("layer"));
	this.clearance = (parseInt(j$(data).attr("clearance")));
	this.net=(j$(data).attr("net"));
	
	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseFloat(tokens[index]);
			var y = parseFloat(tokens[index + 1]);
			this.polygon.points.push(new d2.Point(x, y));
	   }
}
toXML() {
	var result = "<copperarea layer=\"" + this.copper.getName()
								+ "\" padconnect=\"" + this.padConnection + "\" clearance=\"" + this.clearance + "\" net=\"" + this.net +"\">";
	this.polygon.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,5) + "," + utilities.roundFloat(point.y,5) + ",";
	},this);
	result += "</copperarea>";
	return result;
}
}
class BoardOutlineShapeFactory{
	static createRect(board){
		//create 4 lines connected
		let line=new PCBLine(core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);
		line.add(0,0);
		line.add(board.width,0);
		board.add(line);

		line=new PCBLine(core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);		
		line.add(board.width,0);
		line.add(board.width,board.height);
		board.add(line);
		
		line=new PCBLine(core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);		
		line.add(board.width,board.height);
		line.add(0,board.height);
		board.add(line);

		line=new PCBLine(core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);		
		line.add(0,board.height);
		line.add(0,0);
		board.add(line);		
	}
	static createRoundRect(board){
	  let rect=new RoundRect(0,0,board.width,board.height,core.MM_TO_COORD(5));
	  for(const a of rect.roundRect.arcs){
		let arc=new PCBArc(a.pc.x ,a.pc.y,a.r,core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);
		arc.setExtendAngle(a.endAngle);		    		
		arc.setStartAngle(a.startAngle);       
		board.add(arc);    		 
	  }
	  for(const s of rect.roundRect.segments){
		let line=new PCBLine(core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);		
		line.add(s.ps.x,s.ps.y);
		line.add(s.pe.x,s.pe.y);
		board.add(line);				 
	  }
	}
	
	static createCircle(board){
		let d=Math.min(board.width,board.height);
		let x=board.width/2;
		let y=board.height/2;
		
		let circle=new PCBCircle(x,y,d/2,core.MM_TO_COORD(0.5),core.Layer.BOARD_OUTLINE_LAYER);
		board.add(circle);
	}
	
}
module.exports ={
		PCBCopperArea,
		PCBFootprint,
		PCBLabel,
		PCBCircle,
		PCBRoundRect,
		PCBArc,
		PCBVia,
		PCBHole,
		PCBTrack,
		PCBLine,
		PCBSolidRegion,
		BoardShapeFactory,
		BoardOutlineShapeFactory
		
}