var d2=require('d2/d2');

const Resizable = {
  getBendingPointClicked(x,y,distance) {
	var rect = d2.Box.fromRect(x
			- distance / 2, y - distance
			/ 2, distance, distance);

    let point = null;

	this.getLinePoints().some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;    
  },
isControlRectClicked(x, y,viewportWindow) {
        let pt=new d2.Point(x,y);
		pt.scale(this.owningUnit.scalableTransformation.getScale())
		pt.move(-viewportWindow.x,- viewportWindow.y);
        let result=null;
		this.getLinePoints().every(v=>{
			var tmp=v.clone();
	        tmp.scale(this.owningUnit.scalableTransformation.getScale());
	        tmp.move(-viewportWindow.x,- viewportWindow.y);

	        if(d2.utils.LE(pt.distanceTo(tmp),this.selectionRectWidth/2)){
		          result=v
	              return false
	        }	        
            return true
		})
        
        return result;

},
removePoint(x, y) {
    let point=this.getBendingPointClicked(x, y,this.bendingPointDistance);
    if (point != null) {
	    //find this index
        let idx=-1
    	for(let i=0;i<this.getLinePoints().length;i++){
	       if(this.getLinePoints()[i]==point){
				idx=i
				break
	       }
		}
        if(idx!=-1)
    	   delete this.getLinePoints().splice(idx,1)

    }
}
}
module.exports = {
	Resizable
}


