var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');
var HorizontalToVerticalProcessor=require('core/line/linebendingprocessor').HorizontalToVerticalProcessor;
var VerticalToHorizontalProcessor=require('core/line/linebendingprocessor').VerticalToHorizontalProcessor;

var SCHWire=require('circuit/shapes').SCHWire;
var SCHBus=require('circuit/shapes').SCHBus;

class CircuitContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
	}
registerSymbolPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='editsymbolid' ><td style='padding: 0.4em;'>Edit Symbol</td></tr>";
	    items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	    items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	    items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	    items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
	    items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
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
registerWirePopup(target,event){	 	     	           
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='hvid' ><td style='padding: 0.4em;'>Horizontal To Vertical Bending</td></tr>";
	    items+="<tr id='vhid' ><td style='padding: 0.4em;'>Vertical to Horizontal Bending</td></tr>";
	    items+="<tr id='defaultbendid'><td style='padding: 0.4em;'>Default Bending</td></tr>";
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

actionPerformed(id,context){	
    let line =this.component.lineBendingProcessor.line;
	if(id=='hvid'){		
		this.component.lineBendingProcessor=new HorizontalToVerticalProcessor();
		this.component.lineBendingProcessor.initialize(line);
		return
	}
	if(id=='vhid'){
		this.component.lineBendingProcessor=new VerticalToHorizontalProcessor();
		this.component.lineBendingProcessor.initialize(line);
	    return
	}
	if (id=="resumeid") {
	        if(context.target instanceof SCHBus){                
	            this.component.getView().setButtonGroup(core.ModeEnum.BUS_MODE);
	            this.component.setMode(core.ModeEnum.BUS_MODE);	            	            
	        }else{
	        	this.component.getView().setButtonGroup(core.ModeEnum.WIRE_MODE);
	        	this.component.setMode(core.ModeEnum.WIRE_MODE);	        	
	        }
	        this.component.resumeLine(context.target,"wire",  {x:this.x, y:this.y,which:3});
	        return;
	} 	
   super.actionPerformed(id,context);
   
}


}

module.exports ={
		CircuitContextMenu
		}