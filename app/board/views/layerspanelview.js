var LayerCollection = require('board/models/layer').LayerCollection;
var LayerModel = require('board/models/layer').LayerModel;
var Layer = require('core/core').Layer;

var LayerView=Backbone.View.extend({
	tagName: 'div',
	initialize: function(opt){
		this.boardComponent=opt.boardComponent;
		
    },
    events: {
        "click .layer-check": 'onChange'
    },
    
    onChange:function(){
    	this.model.toggle();
    	this.boardComponent.getModel().getUnit().compositeLayer.setLayerVisible(this.model.get('value'),this.model.get('checked'));
    	this.boardComponent.repaint();
    },
    render:function(){
        this.$el.html('<input type="checkbox" style="width:3vw;height:3vh;" class="layer-check" value="' + this.model.get('value') + '" /> ' + this.model.get('name'));
        this.$('input').prop('checked', this.model.get('checked'));
        
    	return this;
    }	
});

var LayersPanelView=Backbone.View.extend({
	  // Base the view on an existing element
	el:'#layer-panel-view-id',
    initialize: function(boardComponent){
    	j$(this.el).empty();
    	this.collection=new LayerCollection([
                                         new LayerModel({ name: 'Top Layer',value:Layer.LAYER_FRONT,checked:boardComponent.getModel().getUnit().compositeLayer.isLayerVisible(Layer.LAYER_FRONT)}),
                                         new LayerModel({ name: 'Bottom Layer',value:Layer.LAYER_BACK,checked:boardComponent.getModel().getUnit().compositeLayer.isLayerVisible(Layer.LAYER_BACK)}),
                                         new LayerModel({ name: 'Top Silk Layer',value:Layer.SILKSCREEN_LAYER_FRONT,checked:boardComponent.getModel().getUnit().compositeLayer.isLayerVisible(Layer.SILKSCREEN_LAYER_FRONT)}),
                                         new LayerModel({ name: 'Bottom Silk Layer',value:Layer.SILKSCREEN_LAYER_BACK,checked:boardComponent.getModel().getUnit().compositeLayer.isLayerVisible(Layer.SILKSCREEN_LAYER_BACK)}),
                                         new LayerModel({ name: 'Board Outline',value:Layer.BOARD_OUTLINE_LAYER,checked:boardComponent.getModel().getUnit().compositeLayer.isLayerVisible(Layer.BOARD_OUTLINE_LAYER)})
                                     ]);
    	this.list = j$('#layer-panel-view-id');
    	this.collection.forEach(function(item){
    		  var view = new LayerView({ model: item,boardComponent:boardComponent });
    		  j$(this.el).append(view.render().el);              
    	}.bind(this));
    	j$("#LayerVisibilityDialog").modal('show');
    },
    render:function(){
    	
    }
});

module.exports =LayersPanelView;
	
