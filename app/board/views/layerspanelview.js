var LayerCollection = require('board/models/layer').LayerCollection;
var LayerModel = require('board/models/layer').LayerModel;

var LayerView=Backbone.View.extend({
	tagName: 'div',
	initialize: function(){
    	
    },
    render:function(){
        this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('name') + '" /> ' + this.model.get('name'));
        this.$('input').prop('checked', this.model.get('checked'));
        
    	return this;
    }	
});

var LayersPanelView=Backbone.View.extend({
	  // Base the view on an existing element
	el:'#layer-panel-view-id',
    initialize: function(){
    	j$(this.el).empty();
    	this.collection=new LayerCollection([
                                         new LayerModel({ name: 'web development'}),
                                         new LayerModel({ name: 'web design'}),
                                         new LayerModel({ name: 'photography'}),
                                         new LayerModel({ name: 'coffee drinking'})
                                     ]);
    	this.list = j$('#layer-panel-view-id');
    	this.collection.forEach(function(item){
    		  var view = new LayerView({ model: item });
    		  j$(this.el).append(view.render().el);              
    	}.bind(this));
    	j$("#LayerVisibilityDialog").modal('show');
    },
    render:function(){
    	
    }
});

module.exports =LayersPanelView;
	
