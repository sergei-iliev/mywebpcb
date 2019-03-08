var core = require('core/core');
var events = require('core/events');
var togglebutton=require('core/models/togglebutton');
var ToggleButtonView=require('board/views/togglebuttonview');
var mywebpcb=require('core/core').mywebpcb;
var BoardsPanelView=require('board/views/boardspanelview').BoardsPanelView;
var BoardComponent=require('board/d/boardcomponent').BoardComponent;
var Board=require('board/d/boardcomponent').Board;

(function($){
	
	
	j$=jQuery.noConflict();
	
	j$( document ).ready(function() {
		    _.extend(mywebpcb, Backbone.Events);
			
		    //prevent context menu
			document.body.oncontextmenu = (e) => {e.preventDefault()};
			
		    //enable tooltips
			j$('[data-toggle="tooltip"]').tooltip();
			
			var bc=new BoardComponent('jqxScrollBar','jqxVerticalScrollBar','mycanvas','popup-menu');
			//create ui
			var toggleButtonCollection=new togglebutton.ToggleButtonCollection(
			[new togglebutton.ToggleButtonModel({id:'newboardid'}),
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
			 new togglebutton.ToggleButtonModel({id:'loadfootprintid'}),
			 new togglebutton.ToggleButtonModel({id:'ellipseid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'arcid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'lineid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'solidregionid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'rectid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'trackid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'holeid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'viaid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'labelid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'copperareaid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'anchorid'}),
			 new togglebutton.ToggleButtonModel({id:'originid'}),
			 new togglebutton.ToggleButtonModel({id:'measureid',group:'lefttogglegroup'})
			 ]);
		
			 var view=new ToggleButtonView({collection:toggleButtonCollection,boardComponent:bc});
			 bc.setView(view);
			 //creat tree			 			 
			 j$('#jqxTree').jqxTree({ height: '250px', width: '100%'});
			 j$('#jqxTree').css('visibility', 'visible');
			    
			 var boardsPanel=new BoardsPanelView({boardComponent:bc,name:'jqxTree',height: '250px', width: '170px'});
			     boardsPanel.render();
				//***add footprint
			 bc.getModel().add(new Board(core.MM_TO_COORD(100),core.MM_TO_COORD(50)));
			 bc.getModel().setActiveUnit(0);
			 bc.getModel().fireUnitEvent({target:bc.getModel().getUnit(),type:events.Event.SELECT_UNIT});
				
			 bc.componentResized();
			 bc.Repaint();
			 
			//init footprint load dialog
				j$('#FootprintLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
             });
			//init board load dialog
			 j$('#BoardLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
             });				
	});
})(jQuery);