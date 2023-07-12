var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var d2=require('d2/d2');


const QUEUE_DEPTH = 20;
const MementoType = Object.freeze({
    CREATE_MEMENTO:0,
    DELETE_MEMENTO:1,
    MOVE_MEMENTO:2,    
    MEMENTO:3
})

class AbstractMemento{

    constructor(mementoType){    
       this.uuid=null;
       this.parentUUID=null;
       this.mementoType;
       this.layermaskId;    
       this.thickness;    
       this.fill;    
       this.rotation;    
       this.mementoType = mementoType;
    }
    
        
clear(){
       //this.uuid=null;
       //this.parentUUID=null;
    }

loadStateTo(shape){
        shape.uuid=(this.uuid);
        shape.copper=core.Layer.Copper.resolve(this.layermaskId);
        shape.thickness=(this.thickness);
        shape.fill=this.fill;
        shape.rotation=this.rotation;
    }
    
saveStateFrom(shape) {
        //common fields
        this.layermaskId=shape.copper.getLayerMaskID();
        this.thickness=shape.thickness;
        this.fill=shape.fill;
        this.rotation=shape.rotation
        this.uuid=shape.uuid          
    }
    
equals(obj){
        if(this==obj){
          return true;  
        }
        if(!(obj instanceof AbstractMemento)){
          return false;  
        }         
        let other=obj;
        return (other.mementoType==this.mementoType&&
                other.uuid==this.uuid&&
                other.thickness==this.thickness&&
                other.fill==this.fill&&
                d2.utils.EQ(other.rotation,this.rotation)&&
                other.layermaskId==this.layermaskId
               );
        
      
    }    
    isSameState(unit) {
        let other=unit.getShape(this.uuid);              
        return (other.thickness==this.thickness&&other.fill==this.fill&&other.copper.getLayerMaskID()==this.layermaskId&& Utils.EQ(other.rotation,this.rotation));                                
    }
}
class SymbolFontTextureMemento extends AbstractMemento{
    constructor(mementoType){
	 	super(mementoType);	
	    this.text;      
        this.alignment
        this.fontSize
        this.fontStyle;                         
        this.x=0;
        this.y=0;
        this.tag;
	}
    loadStateTo(texture) {             
             texture.shape.alignment=this.alignment;
             texture.shape.fontSize=this.fontSize;
             texture.shape.fontStyle=this.fontStyle;
             texture.shape.anchorPoint.set(x, y);
             texture.tag = this.tag;   
             texture.setText(text);
         }	
   saveStateFrom(texture) {             
             //this.id=symbol.id;
             x = texture.shape.anchorPoint.x;
             y = texture.shape.anchorPoint.y;
             this.tag = texture.tag;
             this.text = texture.shape.text;
             this.fontSize=texture.shape.fontSize;
             this.fontStyle=texture.shape.fontStyle;
             this.alignment=texture.shape.alignment;
         }	
   equals(obj) {
             if (this == obj) {
                 return true;
             }
             if (!(obj instanceof SymbolFontTextureMemento)) {
                 return false;
             }            
             return (                     
                     other.tag.equals(this.tag) &&
                     other.text.equals(this.text) &&
                     Utils.EQ(other.x,this.x)  &&
                     Utils.EQ(other.y,this.y) &&
                     other.alignment==this.alignment &&
                     other.fontSize==this.fontSize &&
                     other.fontStyle==this.fontStyle);
         }

		
}
class CompositeMemento extends AbstractMemento{
    constructor(mementoType){
	 	super(mementoType);	
	}

}
//**********************Undo Provider***************************************
class UndoProvider{
	constructor(){
		this.queue=[];
		this.currentIndex=0; 		
	}
redo() {
        if (this.currentIndex >=(this.queue.length-1)) {
            return null;
        }
        return this.queue[++this.currentIndex];
    }

undo() {
        if (this.currentIndex ==-1) {
            return null;
        }
        if(this.queue.length==0){
           return null;  
        }
        return this.queue[this.currentIndex--];
    }	
clear() {
        for (let memento in this.queue) {
            memento.clear();
        }
        this.queue=[];
        this.currentIndex = 0;
    }
registerMemento(memento) {	    
        //***1.Skip add if same memento as last one on the stack
        for(let i=this.queue.length-1;i>0;i--){
            let prevMemento=this.queue[i];
                if(prevMemento.equals(memento)){ 
                  memento.clear();
                  return;  
                }              
            break;
        }   
     
        
        if (this.currentIndex >= QUEUE_DEPTH) {
            let _memento = this.queue.shift();
            _memento.clear();
            this.currentIndex = this.queue.length-1; 
        }        
        
        if (this.queue.length == 0 || this.currentIndex == this.queue.length - 1) {
        } else {
             for (let j = this.currentIndex + 1; this.currentIndex < this.queue.length - 1; ) {
	            let _memento=this.queue[j];           
				_memento.clear();                
				this.queue.splice(j,1);
                
             }
        }

        this.queue.push(memento);  
        this.currentIndex = this.queue.length-1; 
console.log(this.queue.length);
    }

}

module.exports ={
		UndoProvider,	
		MementoType,
		AbstractMemento,
		CompositeMemento,
		SymbolFontTextureMemento,	
}