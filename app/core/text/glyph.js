var d2=require('d2/d2');

class Glyph{

constructor(){
    this.character=null;
    //distance to next symbol
    this.delta=8;
    this.points=[];
    
    this.minx=0;
	this.miny=0;
    this.maxx=0;
	this.maxy=0;  
}
clone(){
        
        var copy=new Glyph();
        copy.points=[];
        for(let i=0;i<this.points.length;i++){
           copy.points.push(new d2.Point(this.points[i].x,this.points[i].y));           
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
        for(let i=0;i<this.points.length;i++){
          this.points[i].x=ratio*this.points[i].x;                
          this.points[i].y=ratio*this.points[i].y;  
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
        
        for(let i=0;i<this.points.length;i++){
            if(this.minx>this.points[i].x){
                this.minx=this.points[i].x;
            }
            if(this.miny>this.points[i].y){
                this.miny=this.points[i].y;
            }
            if(this.maxx<this.points[i].x){
              this.maxx=this.points[i].x;
            }
            if(this.maxy<this.points[i].y){
              this.maxy=this.points[i].y;
            }            
        }
}
getLinesNumber() {
 return this.points.length/2;
}
getGlyphWidth(){
 return this.maxx-this.minx; 
}
    
getGlyphHeight(){
 return this.maxy-this.miny;  
}

setSize(size){
  this.resetGlyph(size); 
}

resetGlyph(size){
        let glyph = GlyphManager.getInstance().getGlyph(this.character);    
        for(let i=0;i<this.points.length;i++){
          this.points[i].x=glyph.points[i].x;
          this.points[i].y=glyph.points[i].y;  
        }
        this.scale(size);
}
Rotate(rotation) {
        for(let i=0;i<this.points.length;i++){
			  var p = utilities.rotate(this.points[i],
									rotation.originx, rotation.originy,
									rotation.angle);
			this.points[i].set(p.x,p.y);						
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
	   
	   that.points.push(new d2.Point(array[0],array[1]));
	   that.points.push(new d2.Point(array[2],array[3]));
	   
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
    this.alignment = new core.Alignment(core.AlignEnum.LEFT);
	
    this.selectionRectWidth=3000;        
    this.text = this.resetGlyphText(text);
    this.width=0;
	this.height=0;
    this.size=size;
	this.fillColor='gray';
    this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
    this.isSelected=false;	
}
copy( _copy){    
    this.anchorPoint.setLocation(_copy.anchorPoint.x,_copy.anchorPoint.y); 
    this.text = _copy.text;
    this.tag = _copy.tag;   
    this.fillColor=_copy.fillColor;
    this.alignment=_copy.alignment;
    this.thickness=_copy.thickness;
    this.setSize(_copy.size);                
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
		
       copy.thickness = this.thickness;
       copy.alignment = new core.Alignment(this.alignment.get());
	
    
    
    
	copy.fillColor=this.fillColor;
    copy.layermaskId=this.layermaskId;		
		
       return copy;
}
resetGlyphText(text) {
        this.Clear();
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

resetGlyphBox(){
   switch(this.alignment.getOrientation()){
        case core.OrientEnum.HORIZONTAL:
            this.glyphs.forEach(function(glyph){
                this.width += glyph.getGlyphWidth() + glyph.delta;
                this.height = Math.max(glyph.getGlyphHeight() + glyph.miny, this.height);
            }.bind(this));        
            break;
        case core.OrientEnum.VERTICAL:
            this.glyphs.forEach(function(glyph){
                this.height += glyph.getGlyphHeight() + glyph.delta;
                this.width = Math.max(glyph.getGlyphWidth()+glyph.minx, this.width);
            }.bind(this));            
            break;
        }
}
isEmpty() {
   return this.text == null || this.text.length == 0;
}
Clear() {
    this.glyphs=[];
    this.width=0;
    this.height=0;
}
getSize() {
   return this.size;
}

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
        //reset orientation
        if(this.alignment.getOrientation() == core.OrientEnum.VERTICAL){
            let rotation = core.AffineTransform.createRotateInstance(0, 0,-90);
            this.glyphs.forEach(function(glyph){
                glyph.Rotate(rotation);
            });
        }
		
        //reset box
        this.resetGlyphBox();
    }
setText(text) {
        //read original text
        this.text = this.resetGlyphText(text);
        //reset size
        this.glyphs.forEach(function(glyph){
            glyph.setSize(core.COORD_TO_MM(this.size));
        }.bind(this));
        //reset orientation
        if(this.alignment.getOrientation() == core.OrientEnum.VERTICAL){
            let rotation = core.AffineTransform.createRotateInstance(0, 0,-90);
            this.glyphs.forEach(function(glyph){
                glyph.Rotate(rotation);
            });
        }
        //reset box
        this.resetGlyphBox();
        
}	
isClicked(x, y) {
    let r=this.getBoundingShape();
    if ((r != null) && (r.contains(x, y)))
        return true;
    else
        return false;

}

Rotate(rotation){
	 let p=utilities.rotate(this.anchorPoint, rotation.originx, rotation.originy, rotation.angle);
	 this.anchorPoint.set(p.x,p.y);
        
	 if(rotation.angle>0){  //clockwise
	    this.alignment.Rotate(true);	    
	 }else{
		this.alignment.Rotate(false);  	    
	 }
	 
      let w=this.height;
      let h=this.width;
        
      switch(this.alignment.get()){
        case core.AlignEnum.LEFT:
                //read original text
                this.text = this.resetGlyphText(this.text);
                        //reset height
                this.glyphs.forEach(function(glyph){
                  glyph.setSize(core.COORD_TO_MM(this.size));                    
                }.bind(this));             
              break;
        case core.AlignEnum.RIGHT:
            //read original text
            this.text = this.resetGlyphText(this.text);
            //reset height
            this.glyphs.forEach(function(glyph){
                 glyph.setSize(core.COORD_TO_MM(this.size));
            }.bind(this));                           
            break;
        case core.AlignEnum.BOTTOM:
            //read original text
            this.text = this.resetGlyphText(this.text);
            //reset height
            this.glyphs.forEach(function(glyph){
                 glyph.setSize(core.COORD_TO_MM(this.size));
            }.bind(this)); 
            //rotate
            let bottomrotation = core.AffineTransform.createRotateInstance(0, 0,-90);
            this.glyphs.forEach(function(glyph){
                glyph.Rotate(bottomrotation);
            }.bind(this));
              break;
        case core.AlignEnum.TOP:
            //read original text
            this.text = this.resetGlyphText(this.text);
            //reset height
            this.glyphs.forEach(function(glyph){
                 glyph.setSize(core.COORD_TO_MM(this.size));
            }.bind(this)); 
            //rotate
            let toprotation = core.AffineTransform.createRotateInstance(0, 0,-90);
            this.glyphs.forEach(function(glyph){
                glyph.Rotate(toprotation);
            });           
            break;
        }
        this.width=w;
        this.height=h;
      
        //***compencate the baseline!
        if(rotation.angle>0){  //clockwise           
            if(this.alignment.getOrientation()==core.OrientEnum.VERTICAL){               
               this.anchorPoint.x+=this.width;
            }            
        }else{
            if(this.alignment.getOrientation()==core.OrientEnum.HORIZONTAL){               
               this.anchorPoint.y+=this.height;
            }
        }	
}
setAlignment(alignment){
            if (alignment == core.AlignEnum.LEFT)
                  this.anchorPoint.setLocation(this.anchorPoint.x - this.width,this.anchorPoint.y);
            else if(alignment == core.AlignEnum.RIGHT){
                            this.anchorPoint.setLocation(this.anchorPoint.x + this.width,
                                                    this.anchorPoint.y);
            }else if (alignment == core.AlignEnum.TOP){
                this.anchorPoint.setLocation(this.anchorPoint.x,
                                        this.anchorPoint.y - this.height);
            }else{
                this.anchorPoint.setLocation(this.anchorPoint.x,
                                         this.anchorPoint.y + this.height);
            }
            this.alignment.set(alignment); 
          
}
getAlignment(){
	   return this.alignment;
	 }
setOrientation(orientation) { 

      let r=this.getBoundingShape();
      let rotation;
      if(orientation==core.OrientEnum.VERTICAL){ //from horizontal to vertical
        rotation = core.AffineTransform.createRotateInstance(r.getCenterX(), r.getCenterY(),-90);        
      }else{
        rotation = core.AffineTransform.createRotateInstance(r.getCenterX(), r.getCenterY(),90);                       
      }
      this.Rotate(rotation);       
}
getBoundingShape() {
      if (this.text == null || this.text.length == 0) {
            return null;
      }
        
      let r = new d2.Box(0,0,0,0);
      switch (this.alignment.get()) {
      case core.AlignEnum.LEFT:
            //left bottom
            r.setRect(this.anchorPoint.x, this.anchorPoint.y - this.height, this.width, this.height);
            break;
        case core.AlignEnum.RIGHT:
            //right bottom
            r.setRect(this.anchorPoint.x-this.width, this.anchorPoint.y - this.height, this.width, this.height);                        
            break;
        case core.AlignEnum.BOTTOM:
            r.setRect(this.anchorPoint.x-this.width, this.anchorPoint.y-this.height, this.width, this.height);
            break;
        case core.AlignEnum.TOP:
            r.setRect(this.anchorPoint.x-this.width, this.anchorPoint.y, this.width, this.height);            
            break;
        }
        return r;
}
Move(xoffset,yoffset) {
    this.anchorPoint.set(this.anchorPoint.x + xoffset, this.anchorPoint.y + yoffset);
}	

Mirror(A,B) {
    utilities.mirrorPoint(A,B, this.anchorPoint);
            
    if (A.x ==B.x) { //right-left mirroring
        this.alignment.Mirror(true);            
    } else { //***top-botom mirroring
        this.alignment.Mirror(false);          
    }                
}
Paint(g2,viewportWindow,scale,layermaskId){
        if (this.isEmpty()) {
            return;
        }
        let side= core.Layer.Side.resolve(layermaskId);
		
        if (this.isSelected)
            g2.strokeStyle='gray';
        else
            g2.strokeStyle=this.fillColor;

        let lineThickness = this.thickness * scale.getScale();

        let r = this.getBoundingShape();
	   
	    let r2=r.clone();
	    r2.scale(scale.getScale());
	    r2.move(- viewportWindow.x,- viewportWindow.y);
        r2.paint(g2);		 

	   let segment=new d2.Segment(0,0,0,0);
	   g2.lineWidth = this.thickness * scale.getScale();
	   g2.lineCap = 'round';
	   g2.lineJoin = 'round';
	   
	   let xoffset = 0,yoffset=0;
       switch (this.alignment.get()) {		
	     case core.AlignEnum.LEFT:
            this.glyphs.forEach(function(glyph) {
                if(glyph.character==' '){
                    xoffset += glyph.delta;
                    return;
                }
                let A=new d2.Point(r.x,r.y);
                let B=new d2.Point(r.x,r.y+r.height);
                let j = 0;
                for (let i = 0; i < glyph.getLinesNumber(); i++, j = (j + 2)) {
                    
					
					if(side==core.Layer.Side.BOTTOM){
                     let start=new d2.Point(glyph.points[j].x + this.anchorPoint.x + xoffset,
                                    glyph.points[j].y + this.anchorPoint.y - r.height);                                       
                     utilities.mirrorPoint(A, B, start);                     
                    
                     let end=new d2.Point(glyph.points[j + 1].x + this.anchorPoint.x + xoffset,
                                    glyph.points[j + 1].y + this.anchorPoint.y - r.height);                                        
                     utilities.mirrorPoint(A, B, end);
					 
					 segment.set(start.x+r.width, start.y,end.x+r.width,end.y);
					 segment.scale(scale.getScale());
					 segment.move(-viewportWindow.x,- viewportWindow.y);
                     segment.paint(g2); 
					}else{
 					 segment.set(glyph.points[j].x + this.anchorPoint.x + xoffset,glyph.points[j].y + this.anchorPoint.y - r.height,glyph.points[j + 1].x + this.anchorPoint.x + xoffset,glyph.points[j + 1].y + this.anchorPoint.y - r.height);
					 segment.scale(scale.getScale());
					 segment.move(-viewportWindow.x,- viewportWindow.y);
                     segment.paint(g2); 
				   }
                }
                xoffset += glyph.getGlyphWidth() + glyph.delta;
            }.bind(this));
			
		 break;
	     case core.AlignEnum.RIGHT:
            this.glyphs.forEach(function(glyph) {
                if(glyph.character==' '){
                    xoffset += glyph.delta;
                    return;
                }
                let A=new d2.Point(r.x+r.width,r.y);
                let B=new d2.Point(r.x+r.width,r.y+r.height);
                let j = 0;
                for (let i = 0; i < glyph.getLinesNumber(); i++, j = (j + 2)) {
                    if(side==core.Layer.Side.BOTTOM){
                     let start=new d2.Point(glyph.points[j].x + this.anchorPoint.x + xoffset - r.width,
                                    glyph.points[j].y + this.anchorPoint.y - r.height);
                    
                    
                     utilities.mirrorPoint(A, B, start);                     
                    
                     let end=new d2.Point(glyph.points[j + 1].x + this.anchorPoint.x + xoffset -r.width,
                                    glyph.points[j + 1].y + this.anchorPoint.y - r.height);
                    
                    
                     utilities.mirrorPoint(A, B, end);
					 segment.set(start.x-r.width, start.y,end.x-r.width, end.y);
					 segment.scale(scale.getScale());
					 segment.move(-viewportWindow.x,- viewportWindow.y);
                     segment.paint(g2);                     
                     					 
                    }else{
   					 segment.set(glyph.points[j].x + this.anchorPoint.x + xoffset - r.width,glyph.points[j].y + this.anchorPoint.y - r.height,glyph.points[j + 1].x + this.anchorPoint.x + xoffset -r.width,glyph.points[j + 1].y + this.anchorPoint.y - r.height);
   					 segment.scale(scale.getScale());
   					 segment.move(-viewportWindow.x,- viewportWindow.y);
                     segment.paint(g2);                     	
					}
                }
                xoffset += glyph.getGlyphWidth() + glyph.delta;
            }.bind(this)); 
         break;		 
	   case core.AlignEnum.BOTTOM:
            this.glyphs.forEach(function(glyph) {
                if(glyph.character==' '){
                    xoffset += glyph.delta;
                    return;
                }
                let A=new d2.Point(r.x,r.y+r.height);
                let B=new d2.Point(r.x+r.width,r.y+r.height);
                let j = 0;
                for (let i = 0; i < glyph.getLinesNumber(); i++, j = (j + 2)) {
                    if(side==core.Layer.Side.BOTTOM){
                     let start=new d2.Point(glyph.points[j].x + this.anchorPoint.x  - r.width,
                                    glyph.points[j].y + this.anchorPoint.y-yoffset);
                    
                    
                     utilities.mirrorPoint(A, B, start);
                    
                     let end =new d2.Point(glyph.points[j + 1].x + this.anchorPoint.x  -r.width,
                                    glyph.points[j + 1].y + this.anchorPoint.y-yoffset);
                    
                    
                     utilities.mirrorPoint(A, B, end);
					 segment.set(start.x, start.y-r.height,end.x, end.y-r.height);
					 segment.scale(scale.getScale());
					 segment.move(-viewportWindow.x,- viewportWindow.y);
                     segment.paint(g2); 
                     
					}else{
	   			     segment.set(glyph.points[j].x + this.anchorPoint.x  - r.width,
                                 glyph.points[j].y + this.anchorPoint.y-yoffset,glyph.points[j + 1].x + this.anchorPoint.x  - r.width,glyph.points[j + 1].y + this.anchorPoint.y-yoffset);
	   				 segment.scale(scale.getScale());
	   				 segment.move(-viewportWindow.x,- viewportWindow.y);
	                 segment.paint(g2); 						                     
                    }
                }
                yoffset += glyph.getGlyphHeight() + glyph.delta;
            }.bind(this));	   
	   break;
	   case core.AlignEnum.TOP:
            this.glyphs.forEach(function(glyph) {
                if(glyph.character==' '){
                    xoffset += glyph.delta;
                    return;
                }
                let A=new d2.Point(r.x,r.y);
                let B=new d2.Point(r.x+r.width,r.y);
                let j = 0;
                for (let i = 0; i < glyph.getLinesNumber(); i++, j = (j + 2)) {
                   if(side==core.Layer.Side.BOTTOM){
                    let start=new d2.Point(glyph.points[j].x + this.anchorPoint.x  - r.width,
                                    glyph.points[j].y + this.anchorPoint.y-yoffset+r.height);
                    
                    
                    utilities.mirrorPoint(A, B, start);                                        
                    let end=new d2.Point(glyph.points[j + 1].x + this.anchorPoint.x  - r.width,
                                    glyph.points[j + 1].y + this.anchorPoint.y-yoffset+r.height);
                    
                    
                    utilities.mirrorPoint(A, B, end);        
					segment.set(start.x, start.y+r.height,end.x, end.y+r.height);
					segment.scale(scale.getScale());
					segment.move(-viewportWindow.x,- viewportWindow.y);
                    segment.paint(g2); 					
                   }else{ 
  	   			    segment.set(glyph.points[j].x + this.anchorPoint.x  - r.width,glyph.points[j].y + this.anchorPoint.y-yoffset+r.height,glyph.points[j + 1].x + this.anchorPoint.x  - r.width,glyph.points[j + 1].y + this.anchorPoint.y-yoffset+r.height);
   				    segment.scale(scale.getScale());
   				    segment.move(-viewportWindow.x,- viewportWindow.y);
                    segment.paint(g2); 				
				   }
                }
                yoffset += glyph.getGlyphHeight() + glyph.delta;
	   }.bind(this));            

	   break;	   
	  }

	    if (this.isSelected){
            this.drawControlShape(g2,viewportWindow,scale);
        }
}
drawControlShape(g2, viewportWindow,scale){
    utilities.drawCrosshair(g2, viewportWindow, scale, null, this.selectionRectWidth, [this.anchorPoint]);
}
toXML() {
    return (this.text=="" ? "" :
            this.text + "," + this.anchorPoint.x + "," + this.anchorPoint.y +
            "," + AlignEnum.format(this.alignment.get())+","+this.thickness+","+this.size);
}
fromXML(node){	
	
	if (node == null || j$(node).text().length==0) {
         this.text = "";
         return;
     }
	 //layer?
     if(j$(node).attr("copper")!=null){
        this.layermaskId=core.Layer.Copper.valueOf(j$(data).attr("copper")).getLayerMaskID();
       }else{
    	this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
     }
	 var tokens=j$(node).text().split(',');
     this.text=tokens[0];
	 
     this.anchorPoint.setLocation(parseInt(tokens[1]),
             parseInt(tokens[2]));  
	 this.alignment.set(AlignEnum.parse(tokens[3]));
	 this.thickness=parseInt(tokens[4]); 
	 if(isNaN(this.thickness)){
		 this.thickness=2000;
	 } 
     let size=parseInt(tokens[5]);
     if(isNaN(size)){
    	 size=20000;
     }
     //invalidate
     this.setSize(size);
	
	
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
   GlyphTexture
}
