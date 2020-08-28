var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');



class CircuitContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
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
   super.actionPerformed(id,context);
   
}


}

module.exports ={
		CircuitContextMenu
		}