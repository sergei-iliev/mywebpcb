module.exports = function(d2) {

    d2.Hexagon = class Hexagon extends d2.Polygon {
    	constructor(center,width) {
    		super();
    		this.center=center;
    		this.width=width;
    		this.reset();
    	}
    	
    	reset(){
            let da = (2 * Math.PI) / 6;
            let lim = (2 * Math.PI) - (da / 2);

            let r=this.width/2;
            var point=new d2.Point(r * Math.cos(0), r * Math.sin(0));
            point.move(this.center.x,this.center.y);            
            this.add(point);
			for (let a = da; a < lim; a += da) {
                point=new d2.Point(r * Math.cos(a),r * Math.sin(a));
                point.move(this.center.x,this.center.y);
                this.add(point);
			}      		
    	}
    	
    	
    }
}