

class ContextMenu{
constructor(component,placeholderid){
	this.component=component;
	this.placeholder = document.getElementById(placeholderid);	
	this.content="";
}	
open(x,y){  
    this.placeholder.style.left=x+"px";
    this.placeholder.style.top=y+"px";
    this.show();				  
}
show(){
    if (!this.opened) {
	   this.placeholder.className = "visible";
	}    
	this.opened = true;		  		  
}
close() {        
    this.placeholder.className = "hidden";
    this.opened = false;
}	
setContent(content,context) {
    this.placeholder.innerHTML = "<div class='content'>" + content + "</div>";
    //attach event listeners
    this.attachEventListeners(context);
}	

attachEventListeners(context){
	
}

}

module.exports ={
		   ContextMenu
}