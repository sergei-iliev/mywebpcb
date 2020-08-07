var fontmetrics=require('d2/text/fontmetrics');

/*Text Rectangle
*
*                  |-ascent----------------|
*                  |                       |
*       anchorPoint|-----------------------|
*                  |_descent_______________|
*
*
*
*
*
*/
class TextMetrics{
	 constructor() {
		    this.BUG_FONT_SIZE=100;
		    this.updated = false;
	        this.fontSize=-1;
	        this.width=this.height=0;
	        this.descent=0;
	        this.ascent=0;
	        this.xHeight=0;
		 }	
	
updateMetrics() {
       this.updated=false;
       this.fontSize=-1;
}
/*
calculateMetrics(fontSize,text) {
	    if(this.fontSize!=fontSize){
	        this.fontSize=fontSize;
	        this.updated = false;
	    }else{
	       return;	
	    }     
	    
	    var ctx=fontmetrics.getCanvasContext();	    	    
	    	    
        	let metrics = fontmetrics.FontMetrics({
		    	  fontFamily: 'Monospace',
		    	  fontWeight: 'normal',
		    	  fontSize: 10,
		    	  origin: 'baseline'
   	        });
        	
        	ctx.font=""+this.fontSize+"px Monospace";		
            this.width=ctx.measureText(text).width;
            this.xHeight=metrics.xHeight;
    	    this.ascent=Math.abs(metrics.ascent*this.fontSize);
	        this.descent=Math.abs(metrics.descent*this.fontSize);
	        this.height=this.fontSize;	     
	    
	        this.updated=true; 
	    	    
	       	 
}
*/
calculateMetrics(fontSize,text) {
    this.fontSize=fontSize;    
    var ctx=fontmetrics.getCanvasContext();	    	    
    	    
    	let metrics = fontmetrics.FontMetrics({
	    	  fontFamily: 'Monospace',
	    	  fontWeight: 'normal',
	    	  fontSize: 10,
	    	  origin: 'baseline'
	        });
    	
    	ctx.font=""+this.fontSize+"px Monospace";		
        this.width=ctx.measureText(text).width;
        this.xHeight=metrics.xHeight;
	    this.ascent=Math.abs(metrics.ascent*this.fontSize);
        this.descent=Math.abs(metrics.descent*this.fontSize);
        this.height=this.fontSize;	     
    
        this.updated=true; 	
}
}

module.exports = function(d2) {
	d2.BaseFontText = class BaseFontText{
		constructor(x,y,text,alignment,fontSize){
			this.anchorPoint=new d2.Point(x,y);
			this.text=text;
			this.fontSize=fontSize;
		    this.alignment=alignment;	
		    this.style='plain';
		    this.metrics=new TextMetrics();  
		    this.metrics.calculateMetrics(this.fontSize,this.text);
		}
clone(){
			let copy=new BaseFontText(this.anchorPoint.x,this.anchorPoint.y,this.text,this.alignment,this.fontSize);		
			copy.style=this.style;
			return copy;
		}
setText(text){
			this.text=text;
			this.metrics.calculateMetrics(this.fontSize,this.text);
		}	
mirror(line){
	 this.anchorPoint.mirror(line); 	
}
setSize(size){
	this.fontSize=size;
	this.metrics.calculateMetrics(this.fontSize,this.text);
}
mirror(line){
	 this.anchorPoint.mirror(line); 	
}
scale(alpha){
  	this.anchorPoint.scale(alpha);
	this.fontSize=parseInt(this.fontSize*alpha);
	this.metrics.calculateMetrics(this.fontSize,this.text);
	
}
setLocation(x,y){
	this.anchorPoint.set(x,y);			
}
move(offsetX,offsetY){
	this.anchorPoint.move(offsetX,offsetY);
}
get box(){
    if (this.text == null || this.text.length == 0){
        return null;
    }   
    //recalculate or buffer
    //this.metrics.calculateMetrics(this.fontSize, this.text);
    var b=null;
	 switch(this.alignment){
	   case 0:
		  b= d2.Box.fromRect(this.anchorPoint.x,this.anchorPoint.y-this.metrics.ascent,this.metrics.width,this.metrics.height);	    
	    break;
	   case 1:
		  b= d2.Box.fromRect(this.anchorPoint.x-this.metrics.width,this.anchorPoint.y-this.metrics.ascent,this.metrics.width,this.metrics.height);
	   break;
	   case 2:
		    b=d2.Box.fromRect(this.anchorPoint.x - this.metrics.ascent,
	                          this.anchorPoint.y, this.metrics.height,this.metrics.width);
	   break;	   
	   case 3:
		   	 b= d2.Box.fromRect(this.anchorPoint.x - this.metrics.ascent,
	                          this.anchorPoint.y - this.metrics.width,
	                          this.metrics.height, this.metrics.width);
	   break;	   	 
	 }
	 
	 return b;
	 
}	
scalePaint(g2,viewportWindow,alpha){
	let scaledAnchorPoint=this.anchorPoint.clone();			
  	scaledAnchorPoint.scale(alpha);
  	scaledAnchorPoint.move(-viewportWindow.x,- viewportWindow.y);
  	
	let scaledFontSize=parseInt(this.fontSize*alpha);
	
	
	g2.font =(this.style==='plain'?'':this.style)+" "+(scaledFontSize)+"px Monospace";
	g2.textBaseline='alphabetic'; 
    switch(this.alignment){
	   case 0:
	   	 g2.textAlign = 'left';				   	 
		 g2.fillText(this.text, scaledAnchorPoint.x, scaledAnchorPoint.y); 
	   break;
	   case 1:
	   	 g2.textAlign = 'right';
		 g2.fillText(this.text, scaledAnchorPoint.x, scaledAnchorPoint.y);
	   break;
	   case 3:
	   g2.save();
	   g2.textAlign = 'left';
	   g2.translate(scaledAnchorPoint.x, scaledAnchorPoint.y);
	   g2.rotate(-0.5*Math.PI);
	   g2.fillText(this.text , 0, 0);
	   g2.restore();
	   break;
	   case 2:
	   g2.save();
	   g2.textAlign = 'right';
	   g2.translate(scaledAnchorPoint.x, scaledAnchorPoint.y);
	   g2.rotate(-0.5*Math.PI);
	   g2.fillText(this.text , 0, 0);
	   g2.restore();	   	   
	}	
}	
paint(g2){				 
		
		g2.font =(this.style==='plain'?'':this.style)+" "+(this.fontSize)+"px Monospace";
				 let r=this.box;
				 g2.lineWidth=1;
				 r.paint(g2);
				 
	    g2.textBaseline='alphabetic'; 
	    switch(this.alignment){
				   case 0:
				   	 g2.textAlign = 'left';				   	 
					 g2.fillText(this.text, this.anchorPoint.x, this.anchorPoint.y); 
				   break;
				   case 1:
				   	 g2.textAlign = 'right';
					 g2.fillText(this.text, this.anchorPoint.x, this.anchorPoint.y);
				   break;
				   case 2:
				   g2.save();
				   g2.textAlign = 'left';
				   g2.translate(this.anchorPoint.x, this.anchorPoint.y);
			       g2.rotate(-0.5*Math.PI);
			       g2.fillText(this.text , 0, 0);
			       g2.restore();
				   break;
				   case 3:
				   g2.save();
				   g2.textAlign = 'right';
				   g2.translate(this.anchorPoint.x, this.anchorPoint.y);
			       g2.rotate(-0.5*Math.PI);
			       g2.fillText(this.text , 0, 0);
			       g2.restore();	   	   
				 }
				 
	     d2.utils.drawCrosshair(g2,6,[this.anchorPoint]);
	     
	}		
		
};		
/*******************************************************************************************/	
	d2.FontText = class FontText{
		constructor(x,y,text,fontSize,rotation){
			this.anchorPoint=new d2.Point(x,y);
			this.text=text;
			this.fontSize=fontSize;
		    this.rotation=rotation;	
		    this.style='plain';
		    this.metrics=new TextMetrics();  
		    this.metrics.calculateMetrics(this.fontSize,this.text);
		}
		clone(){
			let copy=new FontText(this.anchorPoint.x,this.anchorPoint.y,this.text,this.fontSize,this.rotation);		
			copy.style=this.style;
			return copy;
		}
		setText(text){
			this.text=text;
			this.metrics.calculateMetrics(this.fontSize,this.text);
		}
		setSize(size){
			this.fontSize=size;
			this.metrics.calculateMetrics(this.fontSize,this.text);
		}
		scale(alpha){
	      	this.anchorPoint.scale(alpha);
			this.fontSize=parseInt(this.fontSize*alpha);
			this.metrics.calculateMetrics(this.fontSize,this.text);
			
		}
		setLocation(x,y){
			this.anchorPoint.set(x,y);			
		}
		move(offsetX,offsetY){
			this.anchorPoint.move(offsetX,offsetY);
		}
		rotate(angle, center = {x:this.anchorPoint.x, y:this.anchorPoint.y}) {        	
        	this.anchorPoint.rotate((angle-this.rotation),center);
        	this.rotation=angle;
        	this.metrics.calculateMetrics(this.fontSize,this.text);
        }
		mirror(line){
			 this.anchorPoint.mirror(line); 	
		}
		//anchor point is text center
		get box(){
			let ps=this.anchorPoint.clone();
			ps.move(-(this.metrics.width/2),-(this.metrics.height/2));
			
			let pe=this.anchorPoint.clone();
			pe.move(this.metrics.width/2,this.metrics.height/2);			
			return new d2.Box([ps,pe]);	
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){			   
			
			/*
			 * Based on the assumption that anchorPoint is middle normal aligned
			 */
			
			let ps=this.anchorPoint.clone();
			ps.move(-(this.metrics.width/2),0);
			
			let pe=this.anchorPoint.clone();
			pe.move(this.metrics.width/2,0);
			
			let l=new d2.Line(ps,pe);
			l.rotate(this.rotation,this.anchorPoint);

        	let projectionPoint=l.projectionPoint(pt);
        	
		    let a=(projectionPoint.x-ps.x)/((pe.x-ps.x)==0?1:pe.x-ps.x);
		    let b=(projectionPoint.y-ps.y)/((pe.y-ps.y)==0?1:pe.y-ps.y);

		    let dist=projectionPoint.distanceTo(pt);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(Math.abs(this.metrics.xHeight * (this.fontSize)))){
		        	return true;
		        }    
		    	
		    }
			return false;        	
		}
		/*
		 * Avoid recalculating text metrics!!!!!!!!!
		 */
		scalePaint(g2,viewportWindow,alpha){
			let scaledAnchorPoint=this.anchorPoint.clone();			
	      	scaledAnchorPoint.scale(alpha);
	      	scaledAnchorPoint.move(-viewportWindow.x,- viewportWindow.y);
			let scaledFontSize=parseInt(this.fontSize*alpha);
			
			
			g2.font =(this.style==='plain'?'':this.style)+" "+(scaledFontSize)+"px Monospace";
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.save();
			g2.translate(scaledAnchorPoint.x,scaledAnchorPoint.y);
			
			g2.rotate(d2.utils.radians(360-this.rotation));
			
//			if(0<=this.rotation&&this.rotation<90){
//			  g2.rotate(d2.utils.radians(360-this.rotation));
//			}else if(90<=this.rotation&&this.rotation<=180){
//			  g2.rotate(d2.utils.radians(180-this.rotation));	
//			}else{
//			  g2.rotate(d2.utils.radians(360-(this.rotation-180)));	
//			}
            //let box=this.box;
            //box.move(-this.anchorPoint.x,-this.anchorPoint.y);
            //box.paint(g2);
            
			g2.fillText(this.text,0,0);				
			g2.restore();
			
		}		
		paint(g2){					
			g2.font =(this.style==='plain'?'':this.style)+" "+(this.fontSize)+"px Monospace";
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.save();
			g2.translate(this.anchorPoint.x,this.anchorPoint.y);
			g2.rotate(d2.utils.radians(360-this.rotation));
//			if(0<=this.rotation&&this.rotation<90){
//			  g2.rotate(d2.utils.radians(360-this.rotation));
//			}else if(90<=this.rotation&&this.rotation<=180){
//			  g2.rotate(d2.utils.radians(180-this.rotation));	
//			}else{
//			  g2.rotate(d2.utils.radians(360-(this.rotation-180)));	
//			}
            //let box=this.box;
            //box.move(-this.anchorPoint.x,-this.anchorPoint.y);
            //box.paint(g2);
            
			g2.fillText(this.text,0,0);				
			g2.restore();

		}
	}

}