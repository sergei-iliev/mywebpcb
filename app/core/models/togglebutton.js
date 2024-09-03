

/*
 * ToggleButton model on the UI
 */
var ToggleButtonModel=Backbone.Model.extend({
	defaults: {
	  active:false,
      id:'unkown',
      group:''
	},
    update:function(){
       if(this.attributes.active){	
         j$('#'+this.id).addClass("active");
       }else{
    	 j$('#'+this.id).removeClass("active");  
       }
    },	
	setActive:function(active){
		this.attributes.active=active;
		this.update();
	},
    isActive:function(){
    	return this.attributes.active;
    }
});

/*
* Button Collection
*/
var ToggleButtonCollection=Backbone.Collection.extend({
	model: ToggleButtonModel
});

module.exports ={
	ToggleButtonCollection,
	ToggleButtonModel
}