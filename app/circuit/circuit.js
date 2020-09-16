var core = require('core/core');
var events = require('core/events');
var Circuit=require('circuit/d/circuitcomponent').Circuit;
var togglebutton=require('core/models/togglebutton');
var ToggleButtonView=require('circuit/views/togglebuttonview');
var mywebpcb=require('core/core').mywebpcb;
var CircuitsPanelView=require('circuit/views/circuitspanelview').CircuitsPanelView;
var CircuitComponent=require('circuit/d/circuitcomponent').CircuitComponent;


(function($){
	
	j$=jQuery.noConflict();
	
	j$( document ).ready(function() {
		    _.extend(mywebpcb, Backbone.Events);
		    
			//prevent context menu
			document.body.oncontextmenu = (e) => {e.preventDefault()};
		    
			//enable tooltips
			j$('[data-toggle="tooltip"]').tooltip();

			var sc=new CircuitComponent('jqxHorizontalScrollBar','jqxVerticalScrollBar','mycanvas','popup-menu');
			
			//create ui
			var toggleButtonCollection=new togglebutton.ToggleButtonCollection(
			[new togglebutton.ToggleButtonModel({id:'mainmenuid'}),
			 new togglebutton.ToggleButtonModel({id:'printfootrpintid'}),
			 new togglebutton.ToggleButtonModel({id:'saveid'}),
			 new togglebutton.ToggleButtonModel({id:'loadid'}),
			 new togglebutton.ToggleButtonModel({id:'zoominid'}),
			 new togglebutton.ToggleButtonModel({id:'zoomoutid'}),
			 new togglebutton.ToggleButtonModel({id:'rotateleftid'}),
			 new togglebutton.ToggleButtonModel({id:'rotaterightid'}),
			 new togglebutton.ToggleButtonModel({id:'grabid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'tocenterid'}),
			 new togglebutton.ToggleButtonModel({active:true,id:'selectionid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'loadsymbolid'}),
			 new togglebutton.ToggleButtonModel({id:'rectid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'wireid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'busid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'lineid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'pinid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'arrowid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'junctionid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'labelid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'anchorid'}),
			 new togglebutton.ToggleButtonModel({id:'originid'}),
			 new togglebutton.ToggleButtonModel({id:'measureid',group:'lefttogglegroup'})
			]
			);
			
			 var view=new ToggleButtonView({collection:toggleButtonCollection,circuitComponent:sc});
			 sc.setView(view);
	         
			 //creat tree			 
			 j$('#jqxTree').jqxTree({ height: '250px', width: '100%'});
				
			 var circuitsPanel=new CircuitsPanelView({circuitComponent:sc,name:'jqxTree'});
			 circuitsPanel.render();
				//***add footprint
			 sc.getModel().add(new Circuit(1200,800));
			 sc.getModel().setActiveUnit(0);
			 sc.getModel().fireUnitEvent({target:sc.getModel().getUnit(),type:events.Event.SELECT_UNIT});
				
			 sc.componentResized();
			 sc.repaint();
				//init symbol load dialog
				j$('#SymbolLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
				});
				
			//init load dialog
				j$('#CircuitLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
                });
				
			//init save dialog
				j$('#CircuitSaveDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 350,
		            height: 270,
		            autoOpen:false
                });	
		   //load demo footprint
			    	//loadDemo(fc);
	});	
//	loadDemo=function(fc){
//		
//	    j$.ajax({
//	        type: 'GET',
//	        contentType: 'application/xml',
//	        url: 'demo/pads.xml',
//	        dataType: "xml",
//	        beforeSend:function(){
//		          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
//		    },
//	        success: function(data, textStatus, jqXHR){
//
//	      //****load it    	
//	      		  fc.Clear();
//	      		  fc.getModel().parse(data);
//	      		  fc.getModel().setActiveUnit(0);
//	      		  fc.componentResized();
//	                //position on center
//	              var rect=fc.getModel().getUnit().getBoundingRect();
//	              fc.setScrollPosition(rect.center.x,rect.center.y);
//	              fc.getModel().fireUnitEvent({target:fc.getModel().getUnit(),type: events.Event.SELECT_UNIT});
//	      		  fc.repaint();
//	      		  //set button group
//	      		  fc.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);	        
//	        },
//	        
//	        error: function(jqXHR, textStatus, errorThrown){
//	            	alert(errorThrown+":"+jqXHR.responseText);
//	        },
//	        complete:function(jqXHR, textStatus){
//	        	j$('#mywebpadsid').unblock();
//	        }	        
//	    });	
//	}
	
	
})(jQuery);