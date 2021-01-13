var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');
var LineSlopBendingProcessor=require('core/line/linebendingprocessor').LineSlopBendingProcessor;
var SlopLineBendingProcessor=require('core/line/linebendingprocessor').SlopLineBendingProcessor;


var PCBLine=require('board/shapes').PCBLine;
var PCBTrack=require('board/shapes').PCBTrack;

class BoardContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
	}
registerTrackPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='lineslopebendid' ><td style='padding: 0.4em;'>Line Slope Bending</td></tr>";
	    items+="<tr id='slopelinebendid' ><td style='padding: 0.4em;'>Slope Line Bending</td></tr>";
	    items+="<tr id='defaultbendid'><td style='padding: 0.4em;'>Default Bending</td></tr>";	  
	    items+="</table></div>";
	    this.setContent(items,{target:target});	    
	    this.open(event);		
}
registerFootprintPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='selectallid' ><td style='padding: 0.4em;'>Edit Footprint</td></tr>";
	    items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	    items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	    items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";	    
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Wire ends connect</td></tr>";	
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Wire ends disconnect</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	    
	    this.open(event);		
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
	    this.setContent(items,{target:target});	    
	    this.open(event);	
}
registerLineSelectPopup(target,event){
	  let bending=target.isBendingPointClicked(event.x,event.y);
	  var items="<div id='menu-items'><table style='cursor: default;'>";		
	    items+="<tr id='tracknetselectid' ><td style='padding: 0.4em;'>Track Net Select</td></tr>";
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
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
	    this.open(event);	
}
registerBlockPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	    items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	    items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
		this.open(event);		
}
//registerLinePopup(target,event){
//	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
//	    items+="<tr id='deletelastpointid' ><td style='padding: 0.4em;'>Delete Last Point</td></tr>";
//	    items+="<tr id='deletelineid'><td style='padding: 0.4em;'>Delete Line</td></tr>";	  
//	    items+="<tr id='cancelid'><td style='padding: 0.4em;'>Cancel</td></tr>";	    	    	
//	    items+="</table></div>";
//	    this.setContent(items,{target:target});	
//	    this.open(event);	  	
//}


actionPerformed(id,context){
   if(id=="tracknetselectid"){
	   context.target.owningUnit.selectNetAt(context.target);
	   this.component.repaint();
	   return;
   }	
   if (id=="resumeid") {
        if(context.target instanceof PCBTrack){                
            this.component.getView().setButtonGroup(core.ModeEnum.TRACK_MODE);
            this.component.setMode(core.ModeEnum.TRACK_MODE);
            this.component.resumeLine(context.target,"track",  {x:this.x, y:this.y,which:3});
            
        }else{
        	this.component.getView().setButtonGroup(core.ModeEnum.LINE_MODE);
        	this.component.setMode(core.ModeEnum.LINE_MODE);
        	this.component.resumeLine(context.target,"line",  {x:this.x, y:this.y,which:3});
        }

        return;
    }  	
    let line =this.component.lineBendingProcessor.line;
	if(id=='lineslopebendid'){		
		this.component.lineBendingProcessor=new LineSlopBendingProcessor();
		this.component.lineBendingProcessor.initialize(line);
	}
	if(id=='slopelinebendid'){
		this.component.lineBendingProcessor=new SlopLineBendingProcessor();
		this.component.lineBendingProcessor.initialize(line);
	}

   super.actionPerformed(id,context);
   
}


}

module.exports ={
		BoardContextMenu
		}