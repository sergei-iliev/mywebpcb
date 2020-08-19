var d2=require('d2/d2');

class Glyph{

	constructor(){
	    this.character=null;
	    //distance to next symbol
	    this.delta=8;
	    this.segments=[];
	    
	    this.minx=0;
		this.miny=0;
	    this.maxx=0;
		this.maxy=0;  
	}
	clone(){	        
	        var copy=new Glyph();
	        copy.segments=[];
	        for(let i=0;i<this.segments.length;i++){
	           copy.segments.push(this.segments[i].clone());           
	        }
			copy.character=this.character;
	        copy.delta=this.delta;
			
	        copy.minx=this.minx;
		    copy.miny=this.miny;
	        copy.maxx=this.maxx;
		    copy.maxy=this.maxy;          
	        return copy;
	}

	    /*
	     * Enlarge to real size
	     * 200 1 mm 
	     */

	    /*Height comes in mm!!!!!!!!!!!!!!!!!!!!
	     * assume that the step is 0.1(20)
	     */
	scale(size){                        
	        let ratio=20*((size*10));
	        for(let i=0;i<this.segments.length;i++){
                 this.segments[i].scale(ratio);
	        }             
	        this.delta*=ratio;
	        this.resize();
	    }
	    //protected void 
	resize(){
	        this.minx=Number.MAX_VALUE;
	        this.miny=Number.MAX_VALUE;
	        this.maxx=Number.MIN_VALUE;
	        this.maxy=Number.MIN_VALUE;
	        
	        
	        for(let i=0;i<this.segments.length;i++){
	        	let box=this.segments[i].box;	            
	        	
	            if(this.minx>box.min.x){
	                this.minx=box.min.x;
	            }
	            if(this.miny>box.min.y){
	                this.miny=box.min.y;
	            }
	            if(this.maxx<box.max.x){
	              this.maxx=box.max.x;
	            }
	            if(this.maxy<box.max.y){
	              this.maxy=box.max.y;
	            }            
	        }
	}
	move(xoffset,yoffset){
		this.segments.forEach(function(segment){
			segment.move(xoffset,yoffset);
		});
		this.resize();
	}
	get width(){
	 return this.maxx-this.minx; 
	}
	    
	get height(){
	 return this.maxy-this.miny;  
	}

	setSize(size){
	  this.resetGlyph(size); 
	}
    get box(){
    	return new d2.Box(this.minx,this.miny,this.maxx,this.maxy);
    }
	resetGlyph(size){
	        let glyph = GlyphManager.getInstance().getGlyph(this.character);    
	        for(let i=0;i<this.segments.length;i++){
	          this.segments[i].ps.set(glyph.segments[i].ps);
	          this.segments[i].pe.set(glyph.segments[i].pe);
	        }
	        this.scale(size);
	}
	rotate(angle,pt) {
	        for(let i=0;i<this.segments.length;i++){
	        	this.segments[i].rotate(angle,pt);						
	        }
	        this.resize();
	}
	mirror(line){
        for(let i=0;i<this.segments.length;i++){
        	this.segments[i].mirror(line);						
        }
        this.resize();
	}
	fromXML(node){
		this.character=j$(node).attr("char");
		this.delta=parseInt(j$(node).attr("delta"));		
		let that=this;

		j$(node).children().each(function(){

		   let line=this.textContent;
		   let array=line.split(',');
		   that.segments.push(new d2.Segment(array[0],array[1],array[2],array[3]));
		});
		
	}
}

class GlyphTexture{
	constructor(text,tag, x,y,size){	    
		this.tag=tag;
	    this.id=1;
		this.anchorPoint = new d2.Point(x, y);
	    this.glyphs = [];
	    this.thickness = core.MM_TO_COORD(0.2);	    
		
	    this.selectionRectWidth=3000;        
	    this.text = text;
		this.height=0;
		this.width=0;
	    this.setSize(size);
		this.fillColor='gray';
	    this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
	    this.selection=false;	
	    this.rotation=0;
	    this.mirrored=false;
}
clone(){
	       var copy = new GlyphTexture(this.text,this.tag,this.x,this.y,this.size);
	       copy.anchorPoint = new d2.Point(this.anchorPoint.x,this.anchorPoint.y);       
		   copy.glyphs = [];
	       copy.width=this.width;
		   copy.height=this.height;    
		   this.glyphs.forEach(function(glyph) {
	            copy.glyphs.push(glyph.clone());
	       });
		   copy.mirrored=this.mirrored;
		   copy.rotation=this.rotation;
	       copy.thickness = this.thickness;
		   copy.fillColor=this.fillColor;
	       copy.layermaskId=this.layermaskId;		
			
	       return copy;
}
copy( _copy){    
    this.anchorPoint.set(_copy.anchorPoint.x,_copy.anchorPoint.y); 
    this.text = _copy.text;
    this.tag = _copy.tag;
    this.rotation=_copy.rotation;
    this.mirrored=_copy.mirrored;
    this.fillColor=_copy.fillColor;    
    this.thickness=_copy.thickness;
    this.setSize(_copy.size);                
}
clear() {
    this.glyphs=[];
    this.width=0;
    this.height=0;
}
setSelected(selection){
	this.selection=selection;
}
isEmpty() {
	   return this.text == null || this.text.length == 0;
}
resetGlyphText(text) {
        this.clear();
        if (text == null) {
            return null;
        }
        let result = "";

        for (let i=0;i<text.length;i++) {
            let glyph = GlyphManager.getInstance().getGlyph(text.charAt(i));
            if (glyph != null) {
                this.glyphs.push(glyph);
                result+=text.charAt(i);
            } else {
                this.glyphs.push(GlyphManager.getInstance().getGlyph('!'));
                result+='!';
            }             
        }
        return result;
}
resetGlyphsLine(){
	let xoffset = 0,yoffset=0;
    this.glyphs.forEach(function(glyph) {
        if(glyph.character==' '){
            xoffset += glyph.delta;
            this.width += glyph.delta;
            return;
        }
        //calculate its width
        glyph.resize();
        yoffset=glyph.height;
        for (let i = 0; i < glyph.segments.length ; i++) {        	
        	glyph.segments[i].move(this.anchorPoint.x + xoffset,this.anchorPoint.y); 			  		  
        }        
        xoffset += glyph.width + glyph.delta;
        this.height = Math.max(glyph.height+ glyph.miny, this.height);
        this.width += glyph.width + glyph.delta;
    }.bind(this));
    
    this.glyphs.forEach(function(glyph) {
        for (let i = 0; i < glyph.segments.length ; i++) {        	
        	glyph.segments[i].move(0,-this.height); 			  		  
        }        
    }.bind(this));
    
}
reset(){
    if (this.text == null) {
        return;
    }
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //arrange it according to anchor point
    this.resetGlyphsLine();
    //rotate
	this.glyphs.forEach(function(glyph){		  
		glyph.rotate(this.rotation,this.anchorPoint);		     
    }.bind(this));
}
setSize(size) {

    this.size=size;
    if(this.mirrored){
       let line=new d2.Line(this.anchorPoint,new d2.Point(this.anchorPoint.x,this.anchorPoint.y+100));
       this.mirror(true,line);
    }else{
       this.reset();
    }
}
setText(text) {
    //read original text
    this.text = text;
    if(this.mirrored){
      let line=new d2.Line(this.anchorPoint,new d2.Point(this.anchorPoint.x,this.anchorPoint.y+100));
      this.mirror(true,line);
    }else{
      this.reset();
    }
}
getBoundingShape() {
    if (this.text == null || this.text.length == 0) {
          return null;
    }
     return this.getBoundingRect().box;
}
//@private
getBoundingRect(){
    if(this.mirrored){
        let rect= new d2.Rectangle(this.anchorPoint.x-this.width,this.anchorPoint.y-this.height,this.width,this.height);
        rect.rotate(this.rotation,this.anchorPoint);
        return rect;
     }else{    	
        let rect= new d2.Rectangle(this.anchorPoint.x,this.anchorPoint.y-this.height,this.width,this.height);
        rect.rotate(this.rotation,this.anchorPoint);
        return rect;
     }	
}
isClicked(x,y){
    if (this.text == null || this.text.length == 0){
        return false;
    } 
    return this.getBoundingRect().contains(x,y);   
}
mirror(mirrored,line){
	this.mirrored=mirrored;
	
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //arrange it according to anchor point
    this.resetGlyphsLine();
    
    this.anchorPoint.mirror(line);
    this.glyphs.forEach(function(glyph){
       if(this.mirrored){
    	glyph.mirror(line);    	        
       } 
       glyph.rotate(this.rotation,this.anchorPoint);
        
    }.bind(this));
        
}
setSide(side,  line, angle) {
    this.mirrored=(side==core.Layer.Side.BOTTOM);
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));         
    this.anchorPoint.mirror(line);
    //arrange it according to anchor point
    this.resetGlyphsLine();

     //mirror text around anchor point
    let ln=new d2.Line(new d2.Point(this.anchorPoint.x,this.anchorPoint.y-20),new d2.Point(this.anchorPoint.x,this.anchorPoint.y+20));
    this.glyphs.forEach(glyph=>{
       if(this.mirrored){
           glyph.mirror(ln);                        
       }
       glyph.rotate(angle,this.anchorPoint);                   
    });
    
    let copper=core.Layer.Side.change(this.layermaskId);
    this.fillColor=copper.getColor();
    this.layermaskId=copper.getLayerMaskID();
    this.rotation=angle;
}

move(xoffset,yoffset) {
    this.anchorPoint.move(xoffset,yoffset);
    this.glyphs.forEach(function(glyph){
        glyph.move(xoffset,yoffset);
    }.bind(this));      
}
setLocation(x,y){
	let xx=x-this.anchorPoint.x;
	let yy=y-this.anchorPoint.y;
	this.move(xx,yy);
}
setRotation(rotate,pt){
	let alpha=rotate-this.rotation;
	this.anchorPoint.rotate(alpha,pt);
	this.glyphs.forEach(function(glyph){
		glyph.rotate(alpha,pt);   
	}.bind(this));	
	this.rotation=rotate;   	
}
rotate(rotate,pt){
	//fix angle
	let alpha=this.rotation+rotate;
	if(alpha>=360){
		alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotation=alpha;
	//rotate anchor point
	this.anchorPoint.rotate(rotate,pt);
	//rotate glyphs
	this.glyphs.forEach(function(glyph){
	   glyph.rotate(rotate,pt);   
	}.bind(this));	
		
}
paint(g2,viewportWindow,scale,layermaskId){
   if (this.isEmpty()) {
        return;
   }

   if (this.selection)
       g2.strokeStyle='gray';
   else
       g2.strokeStyle=this.fillColor;

   g2.lineWidth = this.thickness * scale.getScale();
   g2.lineCap = 'round';
   g2.lineJoin = 'round';
   
   this.glyphs.forEach(function(glyph){
	   for(let i=0;i<glyph.segments.length;i++){	
		   if(glyph.character==' '){
			   continue;
		   }
		   let copy=glyph.segments[i].clone();
		     copy.scale(scale.getScale());
			 copy.move(-viewportWindow.x,- viewportWindow.y);
	         copy.paint(g2); 
	   }
   });
   
   //let box=this.getBoundingRect();
   //box.scale(scale.getScale());
   //box.move(-viewportWindow.x,- viewportWindow.y);
   //box.paint(g2);
   
   if (this.selection){
       this.drawControlShape(g2,viewportWindow,scale);
   }   
}
drawControlShape(g2, viewportWindow,scale){
    utilities.drawCrosshair(g2, viewportWindow, scale, null, this.selectionRectWidth, [this.anchorPoint]);
}
toXML(){
    return (this.isEmpty()? "" :
        this.text + "," + utilities.roundFloat(this.anchorPoint.x,4) + "," + utilities.roundFloat(this.anchorPoint.y,4) +
        ",,"+utilities.roundFloat(this.thickness,2)+","+utilities.roundFloat(this.size,2)+","+utilities.roundFloat(this.rotation,2));	
}
fromXML(node){	
	if (node == null || j$(node).text().length==0) {
         this.text = "";
         return;
     }
	 var tokens=j$(node).text().split(',');
     this.text=tokens[0];
     
	 //layer?
     if(j$(node).attr("layer")!=null){
        this.layermaskId=core.Layer.Copper.valueOf(j$(node).attr("layer")).getLayerMaskID();
       }else{
    	this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
     }
     
	 
     this.anchorPoint.set(parseInt(tokens[1]),
             parseInt(tokens[2]));  

	 this.thickness=parseInt(tokens[4]); 
	 if(isNaN(this.thickness)){
		 this.thickness=2000;
	 } 
     let size=parseInt(tokens[5]);
     if(isNaN(size)){
    	 size=20000;
     }
     this.size=size;

	 let rotate=parseFloat(tokens[6]);
     if(isNaN(rotate)){
    	 rotate=0;
     }
	 this.rotation=rotate;
	 
	 //mirror?
     let side=core.Layer.Side.resolve(this.layermaskId);
	 if(side==core.Layer.Side.BOTTOM){
		this.mirrored=true;		 
	 }

	 //invalidate
	 this.setText(this.text);
}
}
var GlyphManager = (function () {

	var instance=null;
	 

	class manager{
	constructor(){
	   this.glyphs=new Map();	
	   this.initialize();
	}

	initialize(){
	  	    j$.ajax({
		        type: 'GET',
		        contentType: 'application/xml',
		        url: 'fonts/defaultfont.xml',
		        dataType: "xml",	        
		        success: j$.proxy(this.onLoadFont,this),
		        
		        error: function(jqXHR, textStatus, errorThrown){
		            	alert(errorThrown+":"+jqXHR.responseText);
		        },
		    });
	}

	onLoadFont(data){
	let that=this;
		 	   j$(data).find('symbol').each(function(){
	               var glyph=new Glyph();
				   glyph.fromXML(this);
				   that.glyphs.set(glyph.character,glyph);
		 	   });

	}	

	getGlyph(symbol){
	      let glyph= this.glyphs.get(symbol);    
	      if(glyph!=null){      
	        return glyph.clone();        
	      }
	      return null;
	    }
	}
	    return {
	        getInstance: function () {
	            if (!instance) {
	                instance = new manager();
	            }
	            return instance;
	        }
	    };
	})();

	var core=require('core/core');
	var utilities=require('core/utilities');
	
module.exports ={
			   Glyph,
			   GlyphTexture,
			   GlyphManager
			}	