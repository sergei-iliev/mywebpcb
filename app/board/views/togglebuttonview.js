var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var FootprintLoadView=require('pads/views/footprintloadview');
var BoardMgr = require('board/d/boardcomponent').BoardMgr;
var UnitMgr = require('core/unit').UnitMgr;
var BoardLoadView=require('board/views/boardloadview');

var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.boardComponent=opt.boardComponent;
		mywebpcb.bind('libraryview:load',this.onfootprintload,this);
		mywebpcb.bind('workspaceview:load',this.onload,this);
		this.bind();
		this.update();
	},
	bind:function(){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
			    j$("#"+model.id).bind( "click",{model:model},j$.proxy(this.onclick,this));
			}),this);	
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
			this.boardComponent.getModel().add(board);
            this.boardComponent.getModel().setActiveUnitUUID(board.getUUID());
            this.boardComponent.componentResized(); 
            this.boardComponent.Repaint();
            this.boardComponent.getModel().fireUnitEvent({target:this.boardComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
		}
		if(event.data.model.id=='saveid'){
			new mywebpcb.board.views.BoardSaveView({boardComponent:this.boardComponent}).render();			
		}

		if(event.data.model.id=='loadid'){
			 new BoardLoadView({boardComponent:this.boardComponent}).render();			
		}
		//set mode
		if(event.data.model.id=='rectid'){
		    this.boardComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='lineid'){
		    this.boardComponent.setMode(core.ModeEnum.LINE_MODE);
		}
		if(event.data.model.id=='solidregionid'){
			this.boardComponent.setMode(core.ModeEnum.SOLID_REGION);
		}		
		if(event.data.model.id=='trackid'){
		  //Track mode
		   this.boardComponent.setMode(core.ModeEnum.TRACK_MODE);
		}
		if(event.data.model.id=='anchorid'){
			event.data.model.setActive(!event.data.model.isActive());  
			this.boardComponent.setParameter("snaptogrid",event.data.model.isActive());
		}		
		if(event.data.model.id=='rectid'){
			this.boardComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='ellipseid'){
			this.boardComponent.setMode(core.ModeEnum.ELLIPSE_MODE);
		}
		if(event.data.model.id=='arcid'){
			this.boardComponent.setMode(core.ModeEnum.ARC_MODE);
		}
		if(event.data.model.id=='labelid'){
			this.boardComponent.setMode(core.ModeEnum.LABEL_MODE);
		}
		if(event.data.model.id=='viaid'){
			this.boardComponent.setMode(core.ModeEnum.VIA_MODE);
		}
		if(event.data.model.id=='holeid'){
			this.boardComponent.setMode(core.ModeEnum.HOLE_MODE);
		}		
		if(event.data.model.id=='selectionid'){
		  //Board mode
		   this.boardComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		}
		if(event.data.model.id=='loadfootprintid'){
			 new FootprintLoadView({enabled:true}).render();			
		}
		if(event.data.model.id=='measureid'){ 
			this.boardComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
		}		
		if(event.data.model.id=='originid'){			 
			event.data.model.setActive(!event.data.model.isActive());
			if(event.data.model.isActive()){
			  this.boardComponent.getModel().getUnit().coordinateSystem=new shape.CoordinateSystem(this.boardComponent.getModel().getUnit());
			  this.boardComponent.setMode(core.ModeEnum.ORIGIN_SHIFT_MODE);
			}else{
			  this.boardComponent.getModel().getUnit().coordinateSystem=null;
			  this.boardComponent.setMode(core.ModeEnum.COMPONENT_MODE);
			}
		}
		if(event.data.model.id=='copperareaid'){
		    this.boardComponent.setMode(core.ModeEnum.COPPERAREA_MODE);
		}
		if((event.data.model.id=='rotateleftid')||(event.data.model.id=='rotaterightid')){
            shapes= this.boardComponent.getModel().getUnit().shapes;
            if(shapes.length==0){
               return; 
            }  
			//shapes= this.boardComponent.getModel().getUnit().getSelectedShapes();
			var r=this.boardComponent.getModel().getUnit().getShapesRect(shapes);
            UnitMgr.getInstance().rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.getCenterX(),r.getCenterY(),(event.data.model.id==("rotateleftid")?-1:1)*(90.0)));   
            UnitMgr.getInstance().alignBlock(this.boardComponent.getModel().getUnit().grid,shapes);  
            
            this.boardComponent.Repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.boardComponent.ZoomIn(parseInt(this.boardComponent.width/2),parseInt(this.boardComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.boardComponent.ZoomOut(parseInt(this.boardComponent.width/2),parseInt(this.boardComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.boardComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			
            this.boardComponent.setScrollPosition(parseInt(this.boardComponent.getModel().getUnit().width/2),
            		parseInt(this.boardComponent.getModel().getUnit().height/2));
		}			
	},
	onfootprintload:function(selectedModel){
		  let scaledEvent=this.boardComponent.getScaledEvent(selectedModel.event);
		//****load it    	
		  this.boardComponent.setMode(core.ModeEnum.FOOTPRINT_MODE);		  
		  var pcbfootprint=BoardMgr.getInstance().createPCBFootprint(selectedModel.getUnit());
		  
          //            //***set chip cursor
          pcbfootprint.Move(-1 * pcbfootprint.getBoundingShape().center.x,
                         -1 * pcbfootprint.getBoundingShape().center.y);
          
          //pcbfootprint.Move(scaledEvent.x,
          //        scaledEvent.y);
          
		  this.boardComponent.setContainerCursor(pcbfootprint);
          this.boardComponent.getEventMgr().setEventHandle("cursor", pcbfootprint);
          
          this.boardComponent.mouseMove(selectedModel.event);
          //this.boardComponent.Repaint();
	},
	onload:function(selectedModel){
		  this.boardComponent.Clear();
		  this.boardComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  for(let unit of selectedModel.getUnits()){
			  var copy=unit.clone();			  
			  this.boardComponent.getModel().add(copy);  
			  copy.notifyListeners(events.Event.ADD_SHAPE);
		  };
		  
		  this.boardComponent.getModel().setActiveUnit(0);
		  this.boardComponent.getModel().formatedFileName=selectedModel.formatedFileName;
		  this.boardComponent.getModel().libraryname=selectedModel.libraryname;
		  this.boardComponent.getModel().categoryname=selectedModel.categoryname;
		  
		  this.boardComponent.componentResized();

	        //position on center
          var rect=this.boardComponent.getModel().getUnit().getBoundingRect();
          this.boardComponent.setScrollPosition(rect.getCenterX(),rect.getCenterY());
          this.boardComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.boardComponent.getModel().fireUnitEvent({target:this.boardComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.boardComponent.Repaint();
		  //set button group
		  this.boardComponent.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);

		  
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
