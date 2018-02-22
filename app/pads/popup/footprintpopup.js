var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');

class FootprintContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
	}	
registerUnitPopup(target,event){	          	            
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='selectallid' ><td style='padding: 0.4em;'>Select All</td></tr>";
	    items+="<tr id='undoid'><td style='padding: 0.4em;'>Undo</td></tr>";	  
	    items+="<tr id='redoid'><td style='padding: 0.4em;'>Redo</td></tr>";
	    items+="<tr id='loadid'><td style='padding: 0.4em'>Load</td></tr>";
	    items+="<tr id='reloadid'><td style='padding: 0.4em'>Reload</td></tr>";
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="<tr id='copyid'><td style='padding: 0.4em'>Copy</td></tr>";
	    items+="<tr id='pasteid'><td style='padding: 0.4em'>Paste</td></tr>";		    
	    items+="<tr id='positiontocenterid'><td style='padding: 0.4em'>Position drawing to center</td></tr>";
	    items+="</table></div>";
	    this.setContent(items,{target:target});	    
}

attachEventListeners(context){
	  var placeholder=document.getElementById('menu-items');		  
	  var rows=placeholder.getElementsByTagName("table")[0].rows;
	  var self=this;
	  for (var i = 0; i < rows.length; i++) {
	      //closure		   
	      (function(row) {
	          row.addEventListener("click", function() {	    		          	    	  		        	 
	        	  self.close();	        	  
	        	  self.actionPerformed(row.id,context);
	          });
	      })(rows[i]);
	  }
}
actionPerformed(id,context){
 if(id=='positiontocenterid'){
     let unit=this.component.getModel().getUnit();           
     let rect =unit.getBoundingRect();
    
     let x=rect.getCenterX();
     let y=rect.getCenterY();
     
     let unitMgr = core.UnitMgr.getInstance();
     
     unitMgr.moveBlock(unit.shapes, (unit.width/2)-x, (unit.height/2)-y);
     unitMgr.alignBlock(unit.grid,unit.shapes);
      
     //scroll to center
     this.component.setScrollPosition((unit.width/2), (unit.height/2));
    
 }
 if(id=='selectallid'){ 
     this.component.getModel().getUnit().setSelected(true);
     this.component.Repaint();  
 }
 
}


}

module.exports ={
		FootprintContextMenu
		}