var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');

const QUEUE_DEPTH = 17;
const MementoType = Object.freeze({
    CREATE_MEMENTO:0,
    DELETE_MEMENTO:1,
    MOVE_MEMENTO:2,    
    MEMENTO:3
})

class AbstractMemento{

    constructor(mementoType){    
       this. uuid=null;
       this.parentUUID=null;
       this.mementoType;
       this.layerindex;    
       this.thickness;    
       this.fill;    
       this.rotation;    
       this.mementoType = mementoType;
    }
    
        
clear(){
       uuid=null;
       parentUUID=null;
    }

loadStateTo(shape){
        shape.setUUID(UUID.fromString(uuid.toString()));
        shape.setCopper(Layer.Copper.values()[layerindex]);
        shape.setThickness(this.thickness);
        shape.setFill(Fill.values()[this.fill]);
        shape.rotation=rotation;
    }
    
saveStateFrom(shape) {
        //common fields
        this.layerindex=shape.getCopper().ordinal();
        this.thickness=shape.getThickness();
        this.fill=shape.getFill().ordinal();
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
                Utils.EQ(other.rotation,this.rotation)&&
                other.layerindex==this.layerindex
               );
        
      
    }    
    isSameState(unit) {
        let other=unit.getShape(this.uuid);              
        return (other.thickness==this.thickness&&other.fill==this.fill&&other.getCopper().ordinal()==this.layerindex&& Utils.EQ(other.rotation,this.rotation));                                
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
        return this.queue[currentIndex--];
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
                let _memento = queue.remove(j);
                _memento.clear();
             }
        }

        this.queue.push(memento);  
        this.currentIndex = this.queue.length-1; 
    }

}

module.exports ={
		UndoProvider,	
		MementoType,	
}