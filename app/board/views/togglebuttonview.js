var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var FootprintLoadView=require('pads/views/footprintloadview');
var Board=require('board/d/boardcomponent').Board;
var BoardMgr = require('board/d/boardcomponent').BoardMgr;
var BoardOutlineShapeFactory = require('board/shapes').BoardOutlineShapeFactory;
var BoardContainer = require('board/d/boardcomponent').BoardContainer;
var UnitMgr = require('core/unit').UnitMgr;
var BoardLoadView=require('board/views/boardloadview');
var BoardSaveView=require('board/views/boardsaveview');
var LayersPanelView=require('board/views/layerspanelview');
var d2=require('d2/d2');

var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.boardComponent=opt.boardComponent;
		mywebpcb.bind('libraryview:load',this.onfootprintload,this);
		mywebpcb.bind('workspaceview:load',this.onboardload,this);
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
		if(event.data.model.id=='importfromclipboardid'){	
			navigator.clipboard.readText().then(data =>{ 
			      let boardContainer=new BoardContainer(true);
			      let xml=(j$.parseXML(data));		    	  
			      //disable 
			      core.isEventEnabled=false;
			      boardContainer.parse(xml);
			      core.isEventEnabled=true;
			  	  mywebpcb.trigger('workspaceview:load',boardContainer);
				});
		}
		if(event.data.model.id=='exporttoclipboardid'){	
			navigator.clipboard.writeText(this.boardComponent.getModel().format());
		}
		if(event.data.model.id=='addunitid'){			
			var board=new Board(core.MM_TO_COORD(80),core.MM_TO_COORD(80));
            board.unitName="Unknown";
			this.boardComponent.getModel().add(board);
            this.boardComponent.getModel().setActiveUnitUUID(board.getUUID());
            this.boardComponent.componentResized(); 
            this.boardComponent.repaint();
            this.boardComponent.getModel().fireUnitEvent({target:this.boardComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
		}
		if(event.data.model.id=='boardoutlineroundrectid'){
			BoardMgr.getInstance().deleteBoardOutlineShapes(this.boardComponent.getModel().getUnit());
			BoardOutlineShapeFactory.createRoundRect(this.boardComponent.getModel().getUnit());
			this.boardComponent.repaint();
		}
		if(event.data.model.id=='boardoutlinerectid'){
			BoardMgr.getInstance().deleteBoardOutlineShapes(this.boardComponent.getModel().getUnit());
			BoardOutlineShapeFactory.createRect(this.boardComponent.getModel().getUnit());
			this.boardComponent.repaint();
		}
		if(event.data.model.id=='boardoutlinecircleid'){
			BoardMgr.getInstance().deleteBoardOutlineShapes(this.boardComponent.getModel().getUnit());
			BoardOutlineShapeFactory.createCircle(this.boardComponent.getModel().getUnit());
			this.boardComponent.repaint();
		}
		if(event.data.model.id=='saveid'){
			new BoardSaveView({model:this.boardComponent.model}).render();			
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
			var r=this.boardComponent.getModel().getUnit().getShapesRect(shapes);
               
            UnitMgr.getInstance().rotateBlock(shapes,{origin:new d2.Point(r.center.x,r.center.y),angle:(event.data.model.id==("rotateleftid")?1:-1)*(90.0)});
            UnitMgr.getInstance().alignBlock(this.boardComponent.getModel().getUnit().grid,shapes);  
            
            this.boardComponent.repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.boardComponent.ZoomOut(parseInt(this.boardComponent.width/2),parseInt(this.boardComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.boardComponent.ZoomIn(parseInt(this.boardComponent.width/2),parseInt(this.boardComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.boardComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			this.boardComponent.getModel().getUnit().getScalableTransformation().setScaleFactor(this.boardComponent.getModel().getUnit().getScalableTransformation().maxScaleFactor);
            this.boardComponent.setScrollPosition(parseInt(this.boardComponent.getModel().getUnit().width/2),
            		parseInt(this.boardComponent.getModel().getUnit().height/2));
			this.boardComponent.repaint();
		}	
		if(event.data.model.id=='layerid'){
			new LayersPanelView(this.boardComponent);		
		}		
	},
	onfootprintload:function(selectedModel){
		  let scaledEvent=this.boardComponent.getScaledEvent(selectedModel.event);
		//****load it    	
		  this.boardComponent.setMode(core.ModeEnum.FOOTPRINT_MODE);		  
		  var pcbfootprint=BoardMgr.getInstance().createPCBFootprint(selectedModel.getUnit());
		  
          //            //***set chip cursor
          pcbfootprint.move(-1 * pcbfootprint.getBoundingShape().center.x,
                         -1 * pcbfootprint.getBoundingShape().center.y);
          
          //pcbfootprint.Move(scaledEvent.x,
          //        scaledEvent.y);
          
		  this.boardComponent.setContainerCursor(pcbfootprint);
          this.boardComponent.getEventMgr().setEventHandle("cursor", pcbfootprint);
          
          this.boardComponent.mouseMove(selectedModel.event);
          //this.boardComponent.Repaint();
	},
	onboardload:function(selectedModel){
		  this.boardComponent.clear();
		  this.boardComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  for(let unit of selectedModel.getUnits()){
			  core.isEventEnabled=false;
			  var copy=unit.clone();	
			  core.isEventEnabled=true;
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
          this.boardComponent.setScrollPosition(rect.center.x,rect.center.y);
          this.boardComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.boardComponent.getModel().fireUnitEvent({target:this.boardComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.boardComponent.repaint();
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
         if(requestedMode==core.ModeEnum.LINE_MODE){
        	 var model=this.collection.get('lineid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();          
         }
         if(requestedMode==core.ModeEnum.TRACK_MODE){
        	 var model=this.collection.get('trackid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();          
         }
         

}
});

module.exports =ToggleButtonView
