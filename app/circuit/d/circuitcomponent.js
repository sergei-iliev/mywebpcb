var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var CircuitEventMgr = require('circuit/events').CircuitEventMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var utilities = require('core/utilities');
var events=require('core/events');
var d2=require('d2/d2');
var CircuitContextMenu=require('circuit/popup/circuitpopup').CircuitContextMenu;
var shapes=require('symbols/shapes');
var WireEventHandle=require('circuit/events').WireEventHandle;
var SCHSymbol=require('circuit/shapes').SCHSymbol;
var SCHWire=require('circuit/shapes').SCHWire;
var SCHBus=require('circuit/shapes').SCHBus;
var SCHFontLabel=require('circuit/shapes').SCHFontLabel;
var SCHJunction=require('circuit/shapes').SCHJunction;
var SCHBusPin=require('circuit/shapes').SCHBusPin;
var SCHConnector=require('circuit/shapes').SCHConnector;
var SCHNoConnector=require('circuit/shapes').SCHNoConnector;
var CircuitShapeFactory=require('circuit/shapes').CircuitShapeFactory;
var HorizontalToVerticalProcessor=require('core/line/linebendingprocessor').HorizontalToVerticalProcessor;
var VerticalToHorizontalProcessor=require('core/line/linebendingprocessor').VerticalToHorizontalProcessor;


//**********************UnitMgr***************************************
var CircuitMgr=(function(){
	var instance=null;

class manager{
	createSCHSymbol(symbol) {		
        var schsymbol = new SCHSymbol();
        var len=symbol.shapes.length;
 	    for(var i=0;i<len;i++){
 	    	var shape=symbol.shapes[i];      
 	    	if (shape instanceof shapes.FontLabel) {
	            		
	   				 if(shape.texture.tag=="unit"){
	   					 
	   					schsymbol.unit.copy(shape.texture); 
	   					continue;
	   				 }
	   				 if(shape.texture.tag=="reference"){
		   			    schsymbol.reference.copy(shape.texture); 
		   			    continue;
	   				 }  
	               }
	         
	         schsymbol.add(shape.clone());
	               
	               
	    }
 	    schsymbol.setDisplayName(symbol.unitName);
 	    schsymbol.units=symbol.getGrid().getGridUnits();
 	    schsymbol.val=symbol.getGrid().getGridValue();
 	    return schsymbol; 	          
    }       
    
    }
	return {getInstance:function(){
		    if (!instance) {
              instance = new manager();
            }
            return instance;
	      }
	};
		
	
})();
class Circuit extends Unit{
	constructor(width,height) {
	  super(width,height); 
      this.scalableTransformation.reset(1.2,2,2,15);
	  this.shapeFactory = new CircuitShapeFactory();
      this.grid.setGridUnits(8, core.Units.PIXEL);
      this.grid.pointsColor='black';             
      this.frame.color='black';
	}
	clone(){
		 var copy=new Circuit(this.width,this.height);
		 copy.silent=true;	 
		 copy.grid=this.grid.clone();
		 copy.unitName=this.unitName;
	     var len=this.shapes.length;
		 for(var i=0;i<len;i++){
	         var clone=this.shapes[i].clone();
		       copy.add(clone);
		 }
		 copy.silent=false;
		 return copy;		
	}
	format(){    
 	   var xml="<circuit width=\""+ this.width +"\" height=\""+this.height+"\">\r\n"; 
	   xml+="<name>"+this.unitName+"</name>\r\n";
       xml+="<symbols>\r\n";
       //***   Chip symbols
       xml+="<chips>\r\n";
       this.shapes.forEach(s=>{ 
           if (s instanceof SCHSymbol)
               xml+= s.toXML();
	   });
       xml+="</chips>\r\n";
       //***   Bus symbols
       xml+="<busses>\r\n";
       this.shapes.forEach(s=>{ 
           if (s instanceof SCHBus)
               xml+= s.toXML();
	   });       
       xml+="</busses>\r\n";	   
       //***   Wire symbols
       xml+="<wires>\r\n";
       this.shapes.forEach(s=>{ 
           if (s instanceof SCHWire)
               xml+= s.toXML();
	   });        
       xml+="</wires>\r\n";
       //***  BusPins
       xml+="<buspins>\r\n";
       this.shapes.forEach(s=>{ 
           if (s instanceof SCHBusPin)
               xml+= s.toXML();
	   }); 
       xml+="</buspins>\r\n";  
       //***   Junction symbols
       xml+="<junctions>\r\n";
       this.shapes.forEach(s=>{ 
           if (s instanceof SCHJunction)
               xml+= s.toXML();
       });
       xml+="</junctions>\r\n";    
       //***  Labels without parent
       xml+="<labels>\r\n";
       this.shapes.forEach(s=>{ 
           if (s instanceof SCHFontLabel)
               xml+= s.toXML();
       });
       xml+="</labels>\r\n";      
       
       xml+="</symbols>\r\n";
	   xml+="</circuit>";
	   return xml;        
	}
	parse(data){
		this.unitName=j$(data).find("name").first().text();

		var that=this;
		
	   	j$(data).find('chips').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});	
	   	j$(data).find('wires').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});		
	   	j$(data).find('busses').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});	
	   	j$(data).find('buspins').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});	
	   	j$(data).find('junctions').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});	 
	   	j$(data).find('labels').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});	
	   	j$(data).find('connectors').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});	
	   	j$(data).find('noconnectors').children().each(function(){
	   		var shape=that.shapeFactory.createShape(this); 
	   		if(shape!=null){
	   			that.add(shape);
	   		} 	   	   
	   	   	  
	   	});		   	
	}	
	
}
class CircuitContainer extends UnitContainer{
	constructor() {
	  super();
	  this.formatedFileName="Circuit";
	}
	parse(data){
		//this.unitName=j$(data).find("name").first().text();
		var that=this;
		
	   	

	    j$(data).find("circuit").each(j$.proxy(function(){
	      	var circuit=new Circuit(j$(this).attr("width"),j$(this).attr("height"));
	      	//need to have a current unit 
	          that.add(circuit);
	          circuit.parse(this);
	    }),that);	   	
	}
	format() {
	    var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n"; 
	    xml+="<circuits identity=\"Circuit\" version=\""+utilities.version.CIRCUIT_VERSION+"\">\r\n";      
		let units=this.unitsmap.values();
		for(let i=0;i<this.unitsmap.size;i++){
	      let unit=units.next().value;
	      xml+=unit.format();
		  xml+="\r\n";
		}    	    	
	    xml+="</circuits>";
	    return xml;
	}	
}
class CircuitComponent extends UnitComponent{
	constructor(hbar,vbar,canvas,popup) {
	     super(hbar,vbar,canvas,popup);    
		this.setParameter("snaptogrid",true);
		this.eventMgr=new CircuitEventMgr(this); 
		this.model=new CircuitContainer();
		this.popup=new CircuitContextMenu(this,popup);
	    this.lineBendingProcessor=new HorizontalToVerticalProcessor(); 
		this.backgroundColor='white';  
	}
	setMode(_mode){
		  this.mode=_mode;
		  let shape=null;
	      if (this.cursor != null) {
	          this.cursor.clear();
	          this.cursor = null;
	      }
	      this.eventMgr.resetEventHandle();
	      
	      switch (this.mode) {
	      case  core.ModeEnum.LABEL_MODE:
	          shape=new SCHFontLabel(0,0);
	          this.setContainerCursor(shape);               
	          this.getEventMgr().setEventHandle("cursor",shape); 
	        break;
	      case  core.ModeEnum.JUNCTION_MODE:
	          shape=new SCHJunction();
	          this.setContainerCursor(shape);               
	          this.getEventMgr().setEventHandle("cursor",shape); 
	        break;
	      case  core.ModeEnum.CONNECTOR_MODE:
	          shape=new SCHConnector();
	          this.setContainerCursor(shape);               
	          this.getEventMgr().setEventHandle("cursor",shape); 
	        break;	    
	      case  core.ModeEnum.NOCONNECTOR_MODE:
	          shape=new SCHNoConnector();
	          this.setContainerCursor(shape);               
	          this.getEventMgr().setEventHandle("cursor",shape); 
	        break;	        
	      case core.ModeEnum.BUSPIN_MODE:
	            shape = new SCHBusPin();        
	            this.setContainerCursor(shape);
	            this.getEventMgr().setEventHandle("cursor", shape);
	            break;	        
	      case core.ModeEnum.ORIGIN_SHIFT_MODE:  
	          this.eventMgr.setEventHandle("origin",null);   
	          break;          
	      default:
	        this.repaint();
	    }       
	}
mouseDown(event){
	    event.preventDefault();
	    //this.canvas.focus();
		if (this.getModel().getUnit() == null) { 
		   return; 
		}

	    this.canvas.on('mousemove',j$.proxy(this.mouseDrag,this));
	    this.canvas.off('mousemove',j$.proxy(this.mouseMove,this));
	    
		//****Dynamic event handling
	    var scaledEvent =this.getScaledEvent(event);
		

		if(this.getModel().getUnit()==null){
	          this.getEventMgr().resetEventHandle();
	    }else{
	    	switch (this.getMode()){
	    	case  core.ModeEnum.COMPONENT_MODE:
	               /*
	                * 1.Coordinate origin
	                * 2.Control rect/reshape point
	                * 3.selected shapes comes before control points
	                */	 
	    	  if(this.getModel().getUnit().getCoordinateSystem()!=null){ 		
	           if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
	              this.getEventMgr().setEventHandle("origin",null); 
	        	  break;
	           }  
	    	  }
	   
	    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y);
	    	  if(shape!=null){
//	              if(shape instanceof PCBArc){
//	                  if(shape.isStartAnglePointClicked(scaledEvent.x , scaledEvent.y)){ 
//	                      this.getEventMgr().setEventHandle("arc.start.angle",shape);                    
//	                  }else if(shape.isExtendAnglePointClicked(scaledEvent.x , scaledEvent.y)){
//	                      this.getEventMgr().setEventHandle("arc.extend.angle",shape);                      
//	                  }else if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y)){
//	                 	  this.getEventMgr().setEventHandle("arc.mid.point",shape);
//	                  }else{
//	                       this.getEventMgr().setEventHandle("resize",shape);    
//	                  }
	                 //}else{
							this.getEventMgr().setEventHandle("resize",shape); 
	                 //}                            
	              
			  }else{
			     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
			     
			     if(shape!=null){
				   if ((UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes)&& shape.isSelected())||event.ctrlKey){					   
	                 this.getEventMgr().setEventHandle("block", shape);						 
			       }else if ((!(shape instanceof SCHFontLabel))&&(undefined !=shape['getTextureByTag'])&&shape.getClickedTexture(scaledEvent.x, scaledEvent.y)!=null){
				     this.getEventMgr().setEventHandle("texture",shape);
	               }else if(shape instanceof SCHSymbol){
	            	 this.getEventMgr().setEventHandle("symbol",shape);
			       }else
			         this.getEventMgr().setEventHandle("move",shape);
			     }else{
			         this.getEventMgr().setEventHandle("component",null);
			     }
			  }
			  break;
	    	 case core.ModeEnum.WIRE_MODE:
	    		
	            //***is this a new wire
	            if ((this.getEventMgr().getTargetEventHandle() == null) ||
	                !(this.getEventMgr().getTargetEventHandle() instanceof WireEventHandle)) {
	               	if(event.which!=1){
	            		return;
	            	}
	                shape = new SCHWire();
	                this.getModel().getUnit().add(shape);                
	            	this.getEventMgr().setEventHandle("wire", shape);
	            }
		    break;
	     	case core.ModeEnum.DRAGHEAND_MODE:  
	    		this.getEventMgr().setEventHandle("dragheand", null);
	    	  break;
	    	 case core.ModeEnum.BUS_MODE:
		    		
		            //***is this a new wire
		            if ((this.getEventMgr().getTargetEventHandle() == null) ||
		                !(this.getEventMgr().getTargetEventHandle() instanceof WireEventHandle)) {
		               	if(event.which!=1){
		            		return;
		            	}
		                shape = new SCHBus();
		                this.getModel().getUnit().add(shape);                
		            	this.getEventMgr().setEventHandle("wire", shape);
		            }
			    break;	    
    
   	  
	    	}
	    	
		}
		
		if (this.getEventMgr().getTargetEventHandle() != null) {
	      this.getEventMgr().getTargetEventHandle().mousePressed(scaledEvent);
	    } 
		
	  }	
mouseWheelMoved(event){
    event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		return; 
	  }
	var e=this.getScaledEvent(event);
	if(event.originalEvent.wheelDelta /120 > 0) {
		   this.ZoomIn(e.windowx,e.windowy);
    }
    else{
		   this.ZoomOut(e.windowx,e.windowy);
    }
} 
}
module.exports ={
		   CircuitContainer,
		   Circuit,
		   CircuitMgr,
		   CircuitComponent	   
}