var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var FootprintLoadView=require('pads/views/footprintloadview');
var FootprintSaveView=require('pads/views/footprintsaveview');
var Footprint=require('pads/d/footprintcomponent').Footprint;
var UnitMgr = require('core/unit').UnitMgr;

var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.footprintComponent=opt.footprintComponent;
		mywebpcb.bind('libraryview:load',this.onload,this);
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
		if(event.data.model.id=='newfootprintid'){
			var footprint=new Footprint(core.MM_TO_COORD(50),core.MM_TO_COORD(50));
            footprint.name="Sergio Leone";
			this.footprintComponent.getModel().add(footprint);
            this.footprintComponent.getModel().setActiveUnitUUID(footprint.getUUID());
            this.footprintComponent.componentResized(); 
            this.footprintComponent.Repaint();
            this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
		}
		if(event.data.model.id=='saveid'){
//		    j$.ajax({
//		        type: 'GET',
//		        contentType: 'application/xml',
//		        url: '/rest/demo',
//		        dataType: "xml",
//		        beforeSend:function(){
//			          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
//			        },
//		        success: j$.proxy(this.onloadsuccess,this),
//		        
//		        error: function(jqXHR, textStatus, errorThrown){
//		            	alert(errorThrown+":"+jqXHR.responseText);
//		        },
//		        complete:function(jqXHR, textStatus){
//		        	j$('#mywebpadsid').unblock();
//		        }
//		    });
			console.log(this.footprintComponent.getModel().format());
			new FootprintSaveView({footprintComponent:this.footprintComponent}).render();			
		}

		if(event.data.model.id=='loadid'){
			 new FootprintLoadView({enabled:false}).render();			
			 /**
		    j$.ajax({
		        type: 'GET',
		        contentType: 'application/xml',
		        url: '/rest/demo',
		        dataType: "xml",
		        beforeSend:function(){
			          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
			        },
		        success: j$.proxy(this.onloadsuccess,this),
		        
		        error: function(jqXHR, textStatus, errorThrown){
		            //if(jqXHR.status==404){
		            	//data=jqXHR.responseJSON;
		            	//clean error list
		            	//$("#errorsres ul").empty();
		            	//for(var i = 0; i < data.length; i++) {
		            	//	$("#errorsres ul").append('<li>'+data[i]+'</li>');
		            	//}
		            //}else{
		            	alert(errorThrown+":"+jqXHR.responseText);
		            //}
		        },
		        complete:function(jqXHR, textStatus){
		        	j$('#mywebpadsid').unblock();
		        }
		    });
		    */
		}
		//set mode
		if(event.data.model.id=='lineid'){
		  //Line mode
		   this.footprintComponent.setMode(core.ModeEnum.LINE_MODE);
		}
		if(event.data.model.id=='anchorid'){
			event.data.model.setActive(!event.data.model.isActive());  
			this.footprintComponent.setParameter("snaptogrid",event.data.model.isActive());
		}
		if(event.data.model.id=='originid'){	
			event.data.model.setActive(!event.data.model.isActive());
			if(event.data.model.isActive()){
			  this.footprintComponent.getModel().getUnit().coordinateSystem=new shape.CoordinateSystem(this.footprintComponent.getModel().getUnit());
			  this.footprintComponent.setMode(core.ModeEnum.ORIGIN_SHIFT_MODE);
			}else{
			  this.footprintComponent.getModel().getUnit().coordinateSystem=null;
			  this.footprintComponent.setMode(core.ModeEnum.COMPONENT_MODE);
			}
						
		}
		if(event.data.model.id=='measureid'){ 
			this.footprintComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
		}
		if(event.data.model.id=='rectid'){
			this.footprintComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='ellipseid'){
			this.footprintComponent.setMode(core.ModeEnum.ELLIPSE_MODE);
		}
		if(event.data.model.id=='arcid'){
			this.footprintComponent.setMode(core.ModeEnum.ARC_MODE);
		}
		if(event.data.model.id=='labelid'){
			this.footprintComponent.setMode(core.ModeEnum.LABEL_MODE);
		}
		if(event.data.model.id=='padid'){
			this.footprintComponent.setMode(core.ModeEnum.PAD_MODE);
		}
		if(event.data.model.id=='solidregionid'){
			this.footprintComponent.setMode(core.ModeEnum.SOLID_REGION);
		}		
		if(event.data.model.id=='selectionid'){
		  //Footprint mode
		   this.footprintComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		}		
		if((event.data.model.id=='rotateleftid')||(event.data.model.id=='rotaterightid')){
            shapes= this.footprintComponent.getModel().getUnit().shapes;
            if(shapes.length==0){
               return; 
            }  
			//shapes= this.footprintComponent.getModel().getUnit().getSelectedShapes();
			var r=this.footprintComponent.getModel().getUnit().getShapesRect(shapes);
            
            UnitMgr.getInstance().rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(event.data.model.id==("rotateleftid")?1:-1)*(90.0)));   
            UnitMgr.getInstance().alignBlock(this.footprintComponent.getModel().getUnit().grid,shapes);  
            
            this.footprintComponent.Repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.footprintComponent.ZoomIn(parseInt(this.footprintComponent.width/2),parseInt(this.footprintComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.footprintComponent.ZoomOut(parseInt(this.footprintComponent.width/2),parseInt(this.footprintComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.footprintComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			
            this.footprintComponent.setScrollPosition(parseInt(this.footprintComponent.getModel().getUnit().width/2),
            		parseInt(this.footprintComponent.getModel().getUnit().height/2));
		}		
        if (event.data.model.id=='measureid') {
            this.footprintComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
        }		
	},
	onload:function(selectedModel){
		//****load it    	
		  this.footprintComponent.Clear();
		  this.footprintComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  
		  for(let unit of selectedModel.getUnits()){
			  core.isEventEnabled=false;
			  var copy=unit.clone();
			  core.isEventEnabled=true;
			  
			  this.footprintComponent.getModel().add(copy);  			  			  
			  copy.notifyListeners(events.Event.ADD_SHAPE);
		  };
		  
		  
		  
		  this.footprintComponent.getModel().setActiveUnit(0);
		  this.footprintComponent.getModel().formatedFileName=selectedModel.formatedFileName;
		  this.footprintComponent.getModel().libraryname=selectedModel.libraryname;
		  this.footprintComponent.getModel().categoryname=selectedModel.categoryname;
		  
		  this.footprintComponent.componentResized();
        //position on center
          let rect=this.footprintComponent.getModel().getUnit().getBoundingRect();
          this.footprintComponent.setScrollPosition(rect.center.x,rect.center.y);
          this.footprintComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.footprintComponent.Repaint();
		  //set button group
		  this.footprintComponent.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		  
	        //position all to symbol center
		  for(let unit of this.footprintComponent.getModel().getUnits()){			   
	            let r=unit.getBoundingRect();
	            var x=unit.getScalableTransformation().getScale()*r.x-(this.footprintComponent.viewportWindow.width-unit.getScalableTransformation().getScale()*r.width)/2;
	            var y=unit.getScalableTransformation().getScale()*r.y-(this.footprintComponent.viewportWindow.height-unit.getScalableTransformation().getScale()*r.height)/2;;
	            unit.setScrollPositionValue(x,y);            			  
		  }		

	},
//	onloadsuccess:function(data, textStatus, jqXHR){
//		  this.footprintComponent.Clear();
//		  this.footprintComponent.setMode(ModeEnum.COMPONENT_MODE);
//		  this.footprintComponent.getModel().Parse(data);
//		  this.footprintComponent.getModel().setActiveUnit(0);
//		  this.footprintComponent.componentResized();
//          //position on center
//          rect=this.footprintComponent.getModel().getUnit().getBoundingRect();
//          this.footprintComponent.setScrollPosition(rect.getCenterX(),rect.getCenterY());
//          this.footprintComponent.fireContainerEvent({target:null,type: mywebpads.container.Event.RENAME_CONTAINER});
//          this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type: mywebpads.unit.Event.RENAME_UNIT});
//		  this.footprintComponent.Repaint();
//		  //set button group
//		  this.footprintComponent.getView().setButtonGroup(ModeEnum.COMPONENT_MODE);
//	},
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

}
});

module.exports =ToggleButtonView
