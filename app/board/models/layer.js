

var LayerModel = Backbone.Model.extend({

        defaults:{
            name: 'Layer name',
            color: 100,
            checked: false
        },
        
        toggle: function(){
            this.set('checked', !this.get('checked'));
        }
});
var LayerCollection = Backbone.Collection.extend({
    model: LayerModel,
    
    getChecked: function(){
        return this.where({checked:true});
    }
});

module.exports ={
	LayerModel,
	LayerCollection
}