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
}

module.exports = function(d2) {
	d2.FontText = class FontText{
		constructor(pt,text,fontSize){
			this.anchorPoint=pt;
			this.text=text;
			this.fontSize=fontSize;
		    this.rotation=0;	
		    this.metrics=new TextMetrics();  
		}
		clone(){
			let copy=new FontText(this.anchorPoint.clone(),this.text,this.size);
			copy.rotation=this.rotation;
			return copy;
		}
		setText(text){
			this.text=text;
			this.metrics.updateMetrics();
		}
		setSize(size){
			this.fontSize=size;
			this.metrics.updateMetrics();
		}
		scale(alpha){
	      	this.anchorPoint.scale(alpha);
			this.fontSize*=alpha;
			this.metrics.updateMetrics();
			
		}
		move(offsetX,offsetY){
			this.anchorPoint.move(offsetX,offsetY);
		}
		rotate(angle, center = {x:this.anchorPoint.x, y:this.anchorPoint.y}) {
        	this.rotation=angle;
        	this.anchorPoint.rotate(angle,center);
        }
		mirror(line){
		   	
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){	
		    //recalculate or buffer
		    this.metrics.calculateMetrics(this.fontSize, this.text);
			
			let ps=this.anchorPoint;
			let pe=new d2.Point(ps.x,ps.y);
			pe.move(this.metrics.width,0);
			
			pe.rotate(this.rotation,this.anchorPoint);
			
			let l=new d2.Line(ps,pe);
        	let projectionPoint=l.projectionPoint(pt);
        	
		    let a=(projectionPoint.x-ps.x)/((pe.x-ps.x)==0?1:pe.x-ps.x);
		    let b=(projectionPoint.y-ps.y)/((pe.y-ps.y)==0?1:pe.y-ps.y);

		    let dist=projectionPoint.distanceTo(pt);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(Math.abs(this.metrics.xHeight * (this.fontSize)))){
		        	return true;
		        }    
		    	
		    }
        	
		}
		paint(g2){		
			g2.font = ""+parseInt(this.fontSize)+"px Monospace";
			g2.save();
			g2.translate(this.anchorPoint.x,this.anchorPoint.y);
			g2.rotate(d2.utils.radians(360-this.rotation));
			

			g2.fillText(this.text,0,0);
				
			g2.restore();			
			
			
		}
	}

}