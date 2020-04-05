var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var SymbolLoadView=require('symbols/views/symbolloadview');
var SymbolSaveView=require('symbols/views/symbolsaveview');
var Symbol=require('symbols/d/symbolcomponent').Symbol;
var UnitMgr = require('core/unit').UnitMgr;
var SymbolContainer=require('symbols/d/symbolcomponent').SymbolContainer;

var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.symbolComponent=opt.symbolComponent;
		mywebpcb.bind('libraryview:load',this.onload,this);
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
		      let footprintContainer=new FootprintContainer(true);
		      //disable 
		      core.isEventEnabled=false;
		      footprintContainer.parse(data);
		      core.isEventEnabled=true;
		  	  mywebpcb.trigger('libraryview:load',footprintContainer);
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
//		if(event.data.model.id=='newfootprintid'){
			
//			var footprint=new Footprint(core.MM_TO_COORD(50),core.MM_TO_COORD(50));
//            footprint.name="Sergio Leone";
//			this.footprintComponent.getModel().add(footprint);
//            this.footprintComponent.getModel().setActiveUnitUUID(footprint.getUUID());
//            this.footprintComponent.componentResized(); 
//            this.footprintComponent.Repaint();
//            this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
//		}
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
			new SymbolSaveView({symbolComponent:this.symbolComponent}).render();			
		}

		if(event.data.model.id=='loadid'){
			 new SymbolLoadView({enabled:false}).render();			
			 
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
		   this.symbolComponent.setMode(core.ModeEnum.LINE_MODE);
		}
		if(event.data.model.id=='anchorid'){
			event.data.model.setActive(!event.data.model.isActive());  
			this.symbolComponent.setParameter("snaptogrid",event.data.model.isActive());
		}
		if(event.data.model.id=='originid'){	
			event.data.model.setActive(!event.data.model.isActive());
			if(event.data.model.isActive()){
			  this.symbolComponent.getModel().getUnit().coordinateSystem=new shape.CoordinateSystem(this.symbolComponent.getModel().getUnit());
			  this.symbolComponent.getModel().getUnit().coordinateSystem.selectionRectWidth=4;
			  this.symbolComponent.setMode(core.ModeEnum.ORIGIN_SHIFT_MODE);
			}else{
			  this.symbolComponent.getModel().getUnit().coordinateSystem=null;
			  this.symbolComponent.setMode(core.ModeEnum.COMPONENT_MODE);
			}
						
		}
		
		if(event.data.model.id=='pinid'){ 
			this.symbolComponent.setMode(core.ModeEnum.PIN_MODE);
		}	
		if(event.data.model.id=='arrowid'){ 
			this.symbolComponent.setMode(core.ModeEnum.ARROW_MODE);
		}
		if(event.data.model.id=='triangleid'){ 
			this.symbolComponent.setMode(core.ModeEnum.TRIANGLE_MODE);
		}		
		if(event.data.model.id=='measureid'){ 
			this.symbolComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
		}
		if(event.data.model.id=='rectid'){
			this.symbolComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='ellipseid'){
			this.symbolComponent.setMode(core.ModeEnum.ELLIPSE_MODE);
		}
		if(event.data.model.id=='arcid'){
			this.symbolComponent.setMode(core.ModeEnum.ARC_MODE);
		}
		if(event.data.model.id=='labelid'){
			this.symbolComponent.setMode(core.ModeEnum.LABEL_MODE);
		}
		if(event.data.model.id=='padid'){
			this.symbolComponent.setMode(core.ModeEnum.PAD_MODE);
		}
		if(event.data.model.id=='solidregionid'){
			this.symbolComponent.setMode(core.ModeEnum.SOLID_REGION);
		}		
		if(event.data.model.id=='selectionid'){
		   this.symbolComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		}		
		if((event.data.model.id=='rotateleftid')||(event.data.model.id=='rotaterightid')){
            shapes= this.symbolComponent.getModel().getUnit().shapes;
            if(shapes.length==0){
               return; 
            }  
			//shapes= this.footprintComponent.getModel().getUnit().getSelectedShapes();
			var r=this.symbolComponent.getModel().getUnit().getShapesRect(shapes);
            
            UnitMgr.getInstance().rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(event.data.model.id==("rotateleftid")?1:-1)*(90.0)));   
            UnitMgr.getInstance().alignBlock(this.symbolComponent.getModel().getUnit().grid,shapes);  
            
            this.symbolComponent.repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.symbolComponent.ZoomIn(parseInt(this.symbolComponent.width/2),parseInt(this.symbolComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.symbolComponent.ZoomOut(parseInt(this.symbolComponent.width/2),parseInt(this.symbolComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.symbolComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			
            this.symbolComponent.setScrollPosition(parseInt(this.symbolComponent.getModel().getUnit().width/2),
            		parseInt(this.symbolComponent.getModel().getUnit().height/2));
		}		
        if (event.data.model.id=='measureid') {
            this.symbolComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
        }		
	},
	onload:function(selectedModel){
		//****load it    	
		  this.symbolComponent.Clear();
		  this.symbolComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  
		  for(let unit of selectedModel.getUnits()){
			  core.isEventEnabled=false;
			  var copy=unit.clone();
			  core.isEventEnabled=true;
			  
			  this.symbolComponent.getModel().add(copy);  			  			  
			  copy.notifyListeners(events.Event.ADD_SHAPE);
		  };
		  
		  
		  
		  this.symbolComponent.getModel().setActiveUnit(0);
		  this.symbolComponent.getModel().formatedFileName=selectedModel.formatedFileName;
		  this.symbolComponent.getModel().libraryname=selectedModel.libraryname;
		  this.symbolComponent.getModel().categoryname=selectedModel.categoryname;
		  
		  this.symbolComponent.componentResized();
        //position on center
          let rect=this.symbolComponent.getModel().getUnit().getBoundingRect();
          this.symbolComponent.setScrollPosition(rect.center.x,rect.center.y);
          this.symbolComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.symbolComponent.getModel().fireUnitEvent({target:this.symbolComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.symbolComponent.repaint();
		  //set button group
		  this.symbolComponent.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		  
	        //position all to symbol center
		  for(let unit of this.symbolComponent.getModel().getUnits()){			   
	            let r=unit.getBoundingRect();
	            var x=unit.getScalableTransformation().getScale()*r.x-(this.symbolComponent.viewportWindow.width-unit.getScalableTransformation().getScale()*r.width)/2;
	            var y=unit.getScalableTransformation().getScale()*r.y-(this.symbolComponent.viewportWindow.height-unit.getScalableTransformation().getScale()*r.height)/2;;
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
