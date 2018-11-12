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
	rotate(rotation) {
	        for(let i=0;i<this.segments.length;i++){
	        	this.segments[i].rotate(rotation.angle,{x:rotation.originx, y:rotation.originy});						
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
	    this.text = this.resetGlyphText(text);
	    this.width=0;
		this.height=0;
	    this.setSize(size);
		this.fillColor='gray';
	    this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
	    this.isSelected=false;	
	}
clear() {
    this.glyphs=[];
    this.width=0;
    this.height=0;
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
        //arrange it according to anchor point
        this.resetGlyphsLine();
        return result;
}
resetGlyphsLine(){
	let xoffset = 0,yoffset=0;
    this.glyphs.forEach(function(glyph) {
        if(glyph.character==' '){
            xoffset += glyph.delta;
            return;
        }
        //calculate its width
        glyph.resize();
        for (let i = 0; i < glyph.segments.length ; i++) {            			
        	glyph.segments[i].move(this.anchorPoint.x + xoffset,this.anchorPoint.y + yoffset); 			  		  
        }
        xoffset += glyph.width + glyph.delta;
    }.bind(this));	
}

//resetGlyphBox(){
//	   switch(this.alignment.getOrientation()){
//	        case core.OrientEnum.HORIZONTAL:
//	            this.glyphs.forEach(function(glyph){
//	                this.width += glyph.getGlyphWidth() + glyph.delta;
//	                this.height = Math.max(glyph.getGlyphHeight() + glyph.miny, this.height);
//	            }.bind(this));        
//	            break;
//	        case core.OrientEnum.VERTICAL:
//	            this.glyphs.forEach(function(glyph){
//	                this.height += glyph.getGlyphHeight() + glyph.delta;
//	                this.width = Math.max(glyph.getGlyphWidth()+glyph.minx, this.width);
//	            }.bind(this));            
//	            break;
//	        }
//	}
setSize(size) {
    if (this.text == null) {
        return;
    }
    this.size=size;
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //reset box
    //this.resetGlyphBox();
}
getBoundingShape() {
    if (this.text == null || this.text.length == 0) {
          return null;
    }
      
    return this.glyphs[0].box;
}

Move(xoffset,yoffset) {
    this.anchorPoint.move(xoffset,yoffset);
    this.glyphs.forEach(function(glyph){
        glyph.move(xoffset,yoffset);
    }.bind(this));      
}
Paint(g2,viewportWindow,scale,layermaskId){
   if (this.isEmpty()) {
        return;
   }
	
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