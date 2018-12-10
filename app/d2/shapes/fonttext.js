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
	        this.width=this.height=0;
	        this.descent=0;
	        this.ascent=0;
	        this.xHeight=0;
		 }	
	
recalculateMetrics(fontSize,text) {
    var ctx=fontmetrics.getCanvasContext();	    	    
    	    
    	let metrics = fontmetrics.FontMetrics({
	    	  fontFamily: 'Monospace',
	    	  fontWeight: 'normal',
	    	  fontSize: 10,
	    	  origin: 'baseline'
	        });
    	
    	ctx.font=""+fontSize+"px Monospace";		
        this.width=ctx.measureText(text).width;
        this.xHeight=metrics.xHeight;
	    this.ascent=Math.abs(metrics.ascent*fontSize);
        this.descent=Math.abs(metrics.descent*fontSize);
        this.height=fontSize;	     	
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
		    this.metrics.recalculateMetrics(this.fontSize,this.text);
		}
		clone(){
			let copy=new FontText(this.anchorPoint.clone(),this.text,this.size);
			copy.rotation=this.rotation;
			return copy;
		}
		setText(text){
			this.text=text;
			this.metrics.recalculateMetrics(this.fontSize,this.text);
		}
		setSize(size){
			this.fontSize=size;
			this.metrics.recalculateMetrics(this.fontSize,this.text);
		}
		scale(alpha){
	      	this.anchorPoint.scale(alpha);
			this.fontSize*=alpha;
			this.metrics.recalculateMetrics(this.fontSize,this.text);
			
		}
		move(offsetX,offsetY){
			this.anchorPoint.move(offsetX,offsetY);
		}
		rotate(angle, center = {x:this.anchorPoint.x, y:this.anchorPoint.y}) {        	
        	this.anchorPoint.rotate((angle-this.rotation),center);
        	this.rotation=angle;
        	this.metrics.recalculateMetrics(this.fontSize,this.text);
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
			let ps=new d2.Point(this.anchorPoint.x-(this.metrics.width/2),this.anchorPoint.y);
			let pe=new d2.Point(ps.x,ps.y);
			pe.move(this.metrics.width,0);
			
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
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.fillText(this.text,this.anchorPoint.x,this.anchorPoint.y);
		}
	}

}