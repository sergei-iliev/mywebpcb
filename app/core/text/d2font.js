var d2=require('d2/d2');
//class TextureCache{
//	constructor(shape) {
//		this.shape=shape;
//		this.rotation=0;
//		this.fontSize=0;
//		this.text=0;
//	}
//	reset(shape,fontSize,text,rotation){
//		this.shape=shape;
//		this.rotation=rotation;
//		this.fontSize=fontSize;
//		this.text=text;
//	
//	}
//}
class FontTexture{
 constructor(text,tag,x,y,fontSize,rotation) {
    this.tag=tag;
	this.shape=new d2.FontText(x,y,text,fontSize,rotation);    
	this.selection=false;
	this.selectionRectWidth=3000;
	this.constSize=false;
	this.fillColor='white'; 
    this.shape.style='plain';
    this.isTextLayoutVisible=false;
	//this.cache=new TextureCache(this);
 }
clone(){
     var copy=new FontTexture(this.shape.text,this.tag,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.fontSize,this.shape.rotation);     
     copy.fillColor=this.fillColor;
     copy.shape.style=this.shape.style;
     copy.isTextLayoutVisible=this.isTextLayoutVisible;
     return copy;	 
 } 
isEmpty() {
     return this.shape.text==null||this.shape.text.length==0;
 }
isClicked(x,y){
    if (this.shape.text == null || this.shape.text.length == 0){
        return false;
    } 
    return this.shape.contains(new d2.Point(x,y));
    
}
getBoundingRect(){
    if (this.shape.text == null || this.shape.text.length == 0){
        return null;
    } 
    let box=this.shape.box;
    let rect= new d2.Rectangle(box.x,box.y,box.width,box.height);
    rect.rotate(this.shape.rotation,this.shape.anchorPoint);
    return rect;
}
getBoundingShape() {
    if (this.shape.text == null || this.shape.text.length == 0) {
          return null;
    }
     return this.shape.box;
}
setLocation(x,y){
	this.shape.setLocation(x,y);
}
setText(text){
	this.shape.setText(text);
}
setSize(size){
	this.shape.setSize(size);
}
setRotation(rotate,pt){	
  this.shape.rotate(rotate,pt);
}
move(xoffset, yoffset){
   this.shape.move(xoffset, yoffset);  
}
setSide(side,  line,  angle) { 
    this.shape.mirror(line); 
    this.shape.rotation=angle;
}
setSelected(selection){
	this.selection=selection;
}
paint(g2,viewportWindow,scale){
	 if(this.isEmpty()){
	   return;	 
	 }
	 if(this.constSize){
	   g2.font = ""+parseInt(this.shape.fontSize)+"px Monospace";
	 }else{	 
		 if(this.shape.fontSize*scale.getScale()<8){
			 return;
		 }
		 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
	 }
	 g2.fillStyle = this.fillColor;
	 
	 
//     let t=this.shape.clone();
//     t.scale(scale.getScale());
//     t.move(-viewportWindow.x,- viewportWindow.y);     
//     t.paint(g2);
  
	 this.shape.scalePaint(g2,viewportWindow,scale.getScale());
	 if(this.isTextLayoutVisible){
		let box=this.getBoundingRect();
	  	box.scale(scale.getScale());
	  	box.move(-viewportWindow.x,- viewportWindow.y);
		g2.lineWidth =1;
 		g2.strokeStyle = 'blue';
	  	box.paint(g2);
	 }
     if(this.selection){
 		 g2.lineWidth =1;
 		 g2.strokeStyle = 'blue';
 		 let p=this.shape.anchorPoint.clone();
         p.scale(scale.getScale());
         p.move(-viewportWindow.x,- viewportWindow.y);
         p.paint(g2);    	 
     }
	
}
toXML(){
    return (this.text=="" ? "" :
        this.shape.text + "," + utilities.roundFloat(this.shape.anchorPoint.x,2) + "," + utilities.roundFloat(this.shape.anchorPoint.y,2) +
        ",,PLAIN,"+this.shape.fontSize+"," +this.shape.rotation);	 
}
fromXML(node){
    if (node == null || node.length==0) {
        this.text = "";
        return;
    }
    var tokens=node.split(',');
    this.shape.anchorPoint.set(parseInt(tokens[1]),
            parseInt(tokens[2]));     
    
    this.shape.setText(tokens[0]);
    this.shape.setSize(parseInt(tokens[5]));
    this.shape.rotate(parseFloat(tokens[6])||0);
    
}
}
TextAlignment={
		  RIGHT:0,
		  TOP:1,
		  LEFT:2,
		  BOTTOM:3,
		  parse:function(align){
			  switch(align){
			  case 'LEFT':
				     return this.LEFT;
			  case 'RIGHT':
					 return this.RIGHT; 
			  case 'TOP':
					 return this.TOP;
			  case 'BOTTOM':
					 return this.BOTTOM;			 
			  default:
				  throw new TypeError('Unrecognized align type:'+align+' to parse');  
			  } 	  
		  },
		  mirror:function(align,isHorizontal){	          	               	                 
	               if(isHorizontal){
	                   if(align==this.LEFT)
	                     return this.RIGHT;
	                   else if(align==this.RIGHT)
	                     return this.LEFT;
	                   else
	                     return align;
	                  }else{
	                   if(align==this.BOTTOM)
	                     return this.TOP;
	                   else if(align==this.TOP)
	                     return this.BOTTOM;
	                   else
	                     return align;  
	                  }  
		  },
	      rotate:function(align,isClockwise){       
	           if(align==this.LEFT){
	              if(isClockwise)
	                return this.TOP;
	              else
	                return this.BOTTOM;
	           }else if(align==this.RIGHT){
	                if(isClockwise)
	                  return this.BOTTOM;
	                else
	                  return this.TOP;           
	            }else if(align==this.TOP){
	               if(isClockwise) 
	                   return this.RIGHT;
	               else
	                   return this.LEFT;           
	               }               
	               else if(align==this.BOTTOM){
	                if(isClockwise)
	                    return this.LEFT;
	                else
	                   return this.RIGHT;
	               }
	                      
	      },		  
	      getOrientation:function(align){
	    	  if(align==0||align==2){
	    		return  TextOrientation.HORIZONTAL; 
	    	  }else{
	    		return  TextOrientation.VERTICAL;  
	    	  }
	           
	      },
		  from:function(align){
			 switch(align){
			 case 0:return 'RIGHT';
			 case 1:return 'TOP';
			 case 2:return 'LEFT';
			 case 3:return 'BOTTOM';
			 } 
		  }
}
TextOrientation={
        HORIZONTAL:0,
        VERTICAL:1,        
}


class SymbolFontTexture{
	constructor(text,tag,x,y,alignment,fontSize) {
	    this.tag=tag;
		this.shape=new d2.BaseFontText(x,y,text,alignment,fontSize);    
		this.selection=false;
		this.selectionRectWidth=3000;
		this.constSize=false;		    
		this.selectionRectWidth=4;
		this.fillColor='black';
	    this.isTextLayoutVisible=false;
	}
	clone(){
	    var copy=new SymbolFontTexture(this.shape.text,this.tag,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.alignment,this.shape.fontSize);     
	    copy.fillColor=this.fillColor;
	    return copy;	 
	} 
	copy( _copy){    
	    this.shape.anchorPoint.set(_copy.shape.anchorPoint.x,_copy.shape.anchorPoint.y); 
	    this.shape.alignment = _copy.shape.alignment;
	    this.shape.text=_copy.shape.text;
	    this.shape.style=_copy.shape.style;
	    this.shape.setSize(_copy.shape.size);                
	}	
	isEmpty() {
	     return this.shape.text==null||this.shape.text.length==0;
	}	
	isClicked(x,y){
	    if (this.shape.text == null || this.shape.text.length == 0){
	        return false;
	    } 
	    return this.shape.box.contains(x,y);
	    
	}	
	getBoundingShape() {
	    if (this.shape.text == null || this.shape.text.length == 0) {
	          return null;
	    }
	    return this.shape.box;
	}	
	setText(text){
		this.shape.setText(text);
	}
	setSize(size){
		this.shape.setSize(size);
	}	
	setSelected(selection){
		this.selection=selection;
	}	
	setAlignment(align){
		this.shape.alignment=align;
	}
	getAlignment(){
      return this.shape.alignment;
	}	
	rotate(rotation){		   
	   this.shape.anchorPoint.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
	   if(rotation.angle<0){  //clockwise
		   this.shape.alignment=TextAlignment.rotate(this.shape.alignment,true);
	   }else{
		   this.shape.alignment=TextAlignment.rotate(this.shape.alignment,false); 
	   }			 	
		
	}
	mirror(line){
        let oldalignment = this.shape.alignment;
        this.shape.mirror(line);
        if (line.isVertical) { //right-left mirroring
        	this.shape.alignment = TextAlignment.mirror(oldalignment,true);
        } else { //***top-botom mirroring
        	this.shape.alignment = TextAlignment.mirror(oldalignment,false);            
        }
	}
	move(xoffset, yoffset){
		this.shape.move(xoffset, yoffset);  
	}
	paint(g2,viewportWindow,scale){
		 if(this.isEmpty()){
			   return;	 
			 }
			 if(this.constSize){
			   g2.font = ""+parseInt(this.shape.fontSize)+"px Monospace";
			 }else{	 
				 if(this.shape.fontSize*scale.getScale()<8){
					 return;
				 }
				 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
			 }
			 
			 g2.fillStyle =this.fillColor;			 			 

			 this.shape.scalePaint(g2,viewportWindow,scale.getScale());
			 if(this.isTextLayoutVisible){
				let box=this.shape.box;
			  	box.scale(scale.getScale());
			  	box.move(-viewportWindow.x,- viewportWindow.y);
				g2.lineWidth =1;
		 		g2.strokeStyle = 'blue';
			  	box.paint(g2);
			 }

	     if(this.selection){
	 		 g2.lineWidth =1;
	 		 g2.strokeStyle = 'blue';
	 		 let p=this.shape.anchorPoint.clone();
	         p.scale(scale.getScale());
	         p.move(-viewportWindow.x,- viewportWindow.y);
	         p.paint(g2);    	 
	     }
		
	}	
	fromXML(node){
	    if (node == null || node.length==0) {
	        this.text = "";
	        return;
	    }
	    var tokens=node.split(',');
	    this.shape.alignment=(TextAlignment.parse(tokens[3]));
	    this.shape.setText(tokens[0]);
	    this.shape.anchorPoint.set(parseInt(tokens[1]),
	            parseInt(tokens[2]));     
	    this.style=tokens[4];    
	    this.shape.setSize(parseInt(tokens[5]));

	}
	toXML(){
	    return (this.shape.text==="" ? "" :
	        this.shape.text + "," + utilities.roundFloat(this.shape.anchorPoint.x,1) + "," + utilities.roundFloat(this.shape.anchorPoint.y,1) +
	        ","+ TextAlignment.from(this.shape.alignment)+","+this.shape.style.toUpperCase()+","+this.shape.fontSize);	
	}
	}

var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   TextAlignment,TextOrientation,
   FontTexture,
   SymbolFontTexture
}