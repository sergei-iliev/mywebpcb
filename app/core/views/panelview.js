var core=require('core/core');

//**********************BaseBuilder*******************************************
var BaseBuilder=Backbone.View.extend({
	  initialize:function(component){
		this.component=component;  
	  }, 	
	  setTarget:function(target){
		  this.target=target;
	  },
	  fillComboBox:function(items){
		  var result="";
		  var len = items.length;
		  for (var i=0; i<len; ++i) {
			  if(items[i].selected!=undefined&&items[i].selected==true){
				 selected="selected"; 
			  }else{
				 selected=""; 
			  }
			  result+="<option value='"+items[i].id+"' "+selected+">"+ items[i].value+"</option>";
		  }
		  return result;
	  },
	  reloadComboBox:function(combo,items){
			j$('#'+combo).empty();  
			  var len = items.length;
			  for (var i=0; i<len; ++i) {
				  if(items[i].selected!=undefined&&items[i].selected==true){
					  j$('#'+combo).append('<option value=' + items[i].id + ' selected>' +  items[i].value + '</option>'); 
				  }else{
					  j$('#'+combo).append('<option value=' + items[i].id + '>' +  items[i].value + '</option>');
				  }
			  }			
	  },
	  validateAlignmentComboText:function(combo,texture){
		if(texture.alignment.getOrientation()==OrientEnum.HORIZONTAL){
			this.reloadComboBox(combo,[{id:0,value:'LEFT',selected:true},{id:1,value:'RIGHT'}]);
		}else{
			this.reloadComboBox(combo,[{id:2,value:'TOP',selected:true},{id:3,value:'BOTTOM'}]);
		}
		j$('#'+combo).val(texture.alignment.get());
	  },
	  
	  toUnitX:function(value){        
	      var coordinateSystem=this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	    	  return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value-coordinateSystem.x);  
	      else
	          return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value);      
	  },
	  toUnitY:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value-coordinateSystem.y);
	      else
	    	return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value);	  
	  },  
	  fromUnitX:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value))+coordinateSystem.x;
	      else
	    	return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value));	  
	  },
	  fromUnitY:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value))+coordinateSystem.y;
	      else
	    	return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value));  
	  }
	  
});

module.exports ={
		BaseBuilder
}