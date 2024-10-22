var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');

class FootprintContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
	}	
registerLineSelectPopup(target,event){
	  let bending=target.isControlRectClicked(event.x,event.y,this.component.viewportWindow);
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='cloneid' ><td style='padding: 0.4em;'>Clone</td></tr>";
	    if(bending!=null){
	      if(target.isEndPoint(event.x,event.y)){	
	        items+="<tr id='resumeid'><td style='padding: 0.4em;'>Resume</td></tr>";
	      }
	    }else{
	    	items+="<tr id='addbendingpointid'><td style='padding: 0.4em;'>Add Bending point</td></tr>";	
	    }
	    
	    if(bending!=null){
	      items+="<tr id='deletebendingpointid'><td style='padding: 0.4em'>Delete Bending point</td></tr>";
	    }
		items+="<tr id='sendbackid'><td style='padding: 0.4em'>Send To Back</td></tr>";
		items+="<tr id='bringfrontid'><td style='padding: 0.4em'>Bring To Front</td></tr>";	  
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(event,items,{target:target});		
	    
}
registerUnitPopup(target,event){	          	            
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='selectallid' ><td style='padding: 0.4em;'>Select All</td></tr>";
	    items+="<tr id='undoid'><td style='padding: 0.4em;'>Undo</td></tr>";	  
	    items+="<tr id='redoid'><td style='padding: 0.4em;'>Redo</td></tr>";
	    items+="<tr id='loadid'><td style='padding: 0.4em'>Load</td></tr>";
	    items+="<tr id='reloadid'><td style='padding: 0.4em'>Reload</td></tr>";
	    items+="<tr id='deleteunit'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="<tr id='copyid'><td style='padding: 0.4em'>Copy</td></tr>";
	    items+="<tr id='pasteid'><td style='padding: 0.4em'>Paste</td></tr>";		    
	    items+="<tr id='positiontocenterid'><td style='padding: 0.4em'>Position drawing to center</td></tr>";
	    items+="</table></div>";
	    this.setContent(event,items,{target:target});		    
	    
}
registerBlockPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	    items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	    items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	    items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
	    items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(event,items,{target:target});		
				
}
registerLinePopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='deletelastpointid' ><td style='padding: 0.4em;'>Delete Last Point</td></tr>";
	    items+="<tr id='deletelineid'><td style='padding: 0.4em;'>Delete Line</td></tr>";	  
	    items+="<tr id='cancelid'><td style='padding: 0.4em;'>Cancel</td></tr>";	    	    	
	    items+="</table></div>";
	    this.setContent(event,items,{target:target});	  	
}
actionPerformed(id,context){ 	
	
   super.actionPerformed(id,context);
   
}


}

module.exports ={
		FootprintContextMenu
		}