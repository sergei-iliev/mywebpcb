var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var SymbolLoadView=require('symbols/views/symbolloadview');
var CircuitMgr = require('circuit/d/circuitcomponent').CircuitMgr;
var CircuitContainer = require('circuit/d/circuitcomponent').CircuitContainer;
var UnitMgr = require('core/unit').UnitMgr;
//var BoardLoadView=require('board/views/boardloadview');
//var BoardSaveView=require('board/views/boardsaveview');



var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.circuitComponent=opt.circuitComponent;
		mywebpcb.bind('libraryview:load',this.onsymbolload,this);
		mywebpcb.bind('workspaceview:load',this.oncircuitload,this);
		this.bind();
		this.update();
	},
	bind:function(){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
			    j$("#"+model.id).bind( "click",{model:model},j$.proxy(this.onclick,this));
			}),this);	
		j$("#importfromclipboardid").click(j$.proxy(this.onimport,this));
	},
	update:function(){
		_.each(this.collection.models,function(model,index,list) {
              model.update();
			});
	
	},
	togglegroup:function(group){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
			if(model.attributes.group===group){
				model.attributes.active=false;
		    }
		}),this);		
	},
	onimport:function(event){
		navigator.clipboard.readText().then(data =>{ 
		      let circuitContainer=new CircuitContainer(true);
		      let xml=(j$.parseXML(data));		    	  
		      //disable 
		      core.isEventEnabled=false;
		      circuitContainer.parse(xml);
		      core.isEventEnabled=true;
		  	  mywebpcb.trigger('workspaceview:load',circuitContainer);
			});
	},	
	onclick:function(event){
	    event.preventDefault();
	    
	    //is this a group button
	    if(event.data.model.attributes.active&&event.data.model.attributes.group!=''){
	    	return;
	    }
	    if(event.data.model.attributes.group!=''){
	    	//toggle group
	    	this.togglegroup(event.data.model.attributes.group);
		    event.data.model.attributes.active=!event.data.model.attributes.active;
	    }
		this.update();
		if(event.data.model.id=='newboardid'){
			var board=new mywebpcb.board.Board(core.MM_TO_COORD(80),core.MM_TO_COORD(80));
            board.name="Sergio Leone";
			this.circuitComponent.getModel().add(board);
            this.circuitComponent.getModel().setActiveUnitUUID(board.getUUID());
            this.circuitComponent.componentResized(); 
            this.circuitComponent.repaint();
            this.circuitComponent.getModel().fireUnitEvent({target:this.circuitComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
		}
		if(event.data.model.id=='saveid'){
			new BoardSaveView({model:this.circuitComponent.model}).render();			
		}

		if(event.data.model.id=='loadid'){
			 new BoardLoadView({circuitComponent:this.circuitComponent}).render();			
		}
		//set mode
		if(event.data.model.id=='rectid'){
		    this.circuitComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='buspinid'){
		    this.circuitComponent.setMode(core.ModeEnum.BUSPIN_MODE);
		}
		if(event.data.model.id=='junctionid'){
			this.circuitComponent.setMode(core.ModeEnum.JUNCTION_MODE);
		}		
		if(event.data.model.id=='connectorid'){
		   this.circuitComponent.setMode(core.ModeEnum.CONNECTOR_MODE);
		}
//		if(event.data.model.id=='anchorid'){
//			event.data.model.setActive(!event.data.model.isActive());  
//			this.circuitComponent.setParameter("snaptogrid",event.data.model.isActive());
//		}		
		if(event.data.model.id=='rectid'){
			this.circuitComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='wireid'){
			this.circuitComponent.setMode(core.ModeEnum.WIRE_MODE);
		}
		if(event.data.model.id=='busid'){
			this.circuitComponent.setMode(core.ModeEnum.BUS_MODE);
		}
		if(event.data.model.id=='labelid'){
			this.circuitComponent.setMode(core.ModeEnum.LABEL_MODE);
		}	
		if(event.data.model.id=='selectionid'){
		  //Board mode
		   this.circuitComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		}
		if(event.data.model.id=='loadsymbolid'){
			 new SymbolLoadView({enabled:true}).render();			
		}
		
		if(event.data.model.id=='originid'){			 
			event.data.model.setActive(!event.data.model.isActive());
			if(event.data.model.isActive()){
			  this.circuitComponent.getModel().getUnit().coordinateSystem=new shape.CoordinateSystem(this.circuitComponent.getModel().getUnit());
			  this.circuitComponent.setMode(core.ModeEnum.ORIGIN_SHIFT_MODE);
			}else{
			  this.circuitComponent.getModel().getUnit().coordinateSystem=null;
			  this.circuitComponent.setMode(core.ModeEnum.COMPONENT_MODE);
			}
		}
		if((event.data.model.id=='rotateleftid')||(event.data.model.id=='rotaterightid')){
            shapes= this.circuitComponent.getModel().getUnit().shapes;
            if(shapes.length==0){
               return; 
            }  
			//shapes= this.circuitComponent.getModel().getUnit().getSelectedShapes();
			var r=this.circuitComponent.getModel().getUnit().getShapesRect(shapes);
               
            UnitMgr.getInstance().rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(event.data.model.id==("rotateleftid")?1:-1)*(90.0)));
            UnitMgr.getInstance().alignBlock(this.circuitComponent.getModel().getUnit().grid,shapes);  
            
            this.circuitComponent.repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.circuitComponent.ZoomIn(parseInt(this.circuitComponent.width/2),parseInt(this.circuitComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.circuitComponent.ZoomOut(parseInt(this.circuitComponent.width/2),parseInt(this.circuitComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.circuitComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			
            this.circuitComponent.setScrollPosition(parseInt(this.circuitComponent.getModel().getUnit().width/2),
            		parseInt(this.circuitComponent.getModel().getUnit().height/2));
		}		
	},
	onsymbolload:function(selectedModel){
		  let scaledEvent=this.circuitComponent.getScaledEvent(selectedModel.event);
		//****load it    	
		  this.circuitComponent.setMode(core.ModeEnum.SYMBOL_MODE);		
		  var schsymbol=CircuitMgr.getInstance().createSCHSymbol(selectedModel.getUnit());
		  
          //            //***set chip cursor
		  schsymbol.move(-1 * schsymbol.getBoundingShape().center.x,
                         -1 * schsymbol.getBoundingShape().center.y);
          
          
		  this.circuitComponent.setContainerCursor(schsymbol);
          this.circuitComponent.getEventMgr().setEventHandle("cursor", schsymbol);
          
          this.circuitComponent.mouseMove(selectedModel.event);
          //this.circuitComponent.Repaint();
	},
	oncircuitload:function(selectedModel){
		  this.circuitComponent.clear();
		  this.circuitComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  for(let unit of selectedModel.getUnits()){
			  core.isEventEnabled=false;
			  var copy=unit.clone();	
			  core.isEventEnabled=true;
			  this.circuitComponent.getModel().add(copy);  
			  copy.notifyListeners(events.Event.ADD_SHAPE);
		  };
		  
		  this.circuitComponent.getModel().setActiveUnit(0);
		  this.circuitComponent.getModel().formatedFileName=selectedModel.formatedFileName;
		  this.circuitComponent.getModel().libraryname=selectedModel.libraryname;
		  this.circuitComponent.getModel().categoryname=selectedModel.categoryname;
		  
		  this.circuitComponent.componentResized();

	        //position on center
          var rect=this.circuitComponent.getModel().getUnit().getBoundingRect();
          this.circuitComponent.setScrollPosition(rect.center.x,rect.center.y);
          this.circuitComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.circuitComponent.getModel().fireUnitEvent({target:this.circuitComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.circuitComponent.repaint();
		  //set button group
		  this.circuitComponent.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);

		  
	},
    setButtonGroup:function(requestedMode) {
         if (requestedMode == core.ModeEnum.COMPONENT_MODE) {
        	 //find selection button and pressed
        	 var model=this.collection.get('selectionid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();
         }

}
});

module.exports =ToggleButtonView
