module.exports = function(d2) {
	d2.FontText = class FontText{
		constructor(pt,text,fontSize){
			this.anchorPoint=pt;
			this.text=text;
			this.fontSize=fontSize;
		    this.rotation=0;	
		}
		clone(){
			let copy=new FontText(this.anchorPoint.clone(),this.text,this.size);
			copy.rotation=this.rotation;
			return copy;
		}
		scale(alpha){
	      	this.anchorPoint.scale(alpha);
			this.fontSize*=alpha;
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
		paint(g2){			
			g2.save();
			g2.translate(this.anchorPoint.x,this.anchorPoint.y);
			g2.rotate(d2.utils.radians(this.rotation));
			
			//let m=g2.measureText(this.text);
		
			g2.fillText(this.text,0,0);
				
			g2.restore();			
			
			
		}
	}

}