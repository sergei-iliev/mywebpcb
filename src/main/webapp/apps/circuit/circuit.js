(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("circuit/circuit.js", function(exports, require, module) {
var core = require('core/core');
var events = require('core/events');
var Circuit=require('circuit/d/circuitcomponent').Circuit;
var togglebutton=require('core/models/togglebutton');
var ToggleButtonView=require('circuit/views/togglebuttonview');
var mywebpcb=require('core/core').mywebpcb;
var CircuitsPanelView=require('circuit/views/circuitspanelview').CircuitsPanelView;
var CircuitComponent=require('circuit/d/circuitcomponent').CircuitComponent;


(function($){
	
	j$=jQuery.noConflict();
	
	j$( document ).ready(function() {
		    _.extend(mywebpcb, Backbone.Events);
		    
			//prevent context menu
			document.body.oncontextmenu = (e) => {e.preventDefault()};
		    
			//enable tooltips
			j$('[data-toggle="tooltip"]').tooltip();

			var sc=new CircuitComponent('jqxHorizontalScrollBar','jqxVerticalScrollBar','mycanvas','popup-menu');
			
			//create ui
			var toggleButtonCollection=new togglebutton.ToggleButtonCollection(
			[
			 new togglebutton.ToggleButtonModel({id:'exporttoclipboardid'}),
			 new togglebutton.ToggleButtonModel({id:'importfromclipboardid'}),
			 new togglebutton.ToggleButtonModel({id:'addunitid'}),
			 new togglebutton.ToggleButtonModel({id:'mainmenuid'}),
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
			 new togglebutton.ToggleButtonModel({id:'loadsymbolid'}),
			 new togglebutton.ToggleButtonModel({id:'connectorid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'noconnectorid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'netlabelid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'wireid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'busid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'buspinid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'pinid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'arrowid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'junctionid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'labelid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'anchorid'}),
			 new togglebutton.ToggleButtonModel({id:'originid'}),
			 new togglebutton.ToggleButtonModel({id:'measureid',group:'lefttogglegroup'})
			]
			);
			
			 var view=new ToggleButtonView({collection:toggleButtonCollection,circuitComponent:sc});
			 sc.setView(view);
	         
			 //creat tree			 
			 j$('#jqxTree').jqxTree({ height: '250px', width: '100%'});
				
			 var circuitsPanel=new CircuitsPanelView({circuitComponent:sc,name:'jqxTree'});
			 circuitsPanel.render();
				//***add footprint
			 sc.getModel().add(new Circuit(1200,800));
			 sc.getModel().setActiveUnit(0);
			 sc.getModel().fireUnitEvent({target:sc.getModel().getUnit(),type:events.Event.SELECT_UNIT});
				
			 sc.componentResized();
			 sc.repaint();
				//init symbol load dialog
				j$('#SymbolLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
				});
				
			//init load dialog
				j$('#CircuitLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
                });				
			//init save dialog
				j$('#CircuitSaveDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 350,
		            height: 270,
		            autoOpen:false
                });	
		   //load demo footprint
			    	//loadDemo(fc);
	});	
//	loadDemo=function(fc){
//		
//	    j$.ajax({
//	        type: 'GET',
//	        contentType: 'application/xml',
//	        url: 'demo/pads.xml',
//	        dataType: "xml",
//	        beforeSend:function(){
//		          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
//		    },
//	        success: function(data, textStatus, jqXHR){
//
//	      //****load it    	
//	      		  fc.Clear();
//	      		  fc.getModel().parse(data);
//	      		  fc.getModel().setActiveUnit(0);
//	      		  fc.componentResized();
//	                //position on center
//	              var rect=fc.getModel().getUnit().getBoundingRect();
//	              fc.setScrollPosition(rect.center.x,rect.center.y);
//	              fc.getModel().fireUnitEvent({target:fc.getModel().getUnit(),type: events.Event.SELECT_UNIT});
//	      		  fc.repaint();
//	      		  //set button group
//	      		  fc.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);	        
//	        },
//	        
//	        error: function(jqXHR, textStatus, errorThrown){
//	            	alert(errorThrown+":"+jqXHR.responseText);
//	        },
//	        complete:function(jqXHR, textStatus){
//	        	j$('#mywebpadsid').unblock();
//	        }	        
//	    });	
//	}
	
	
})(jQuery);
});

require.register("circuit/d/circuitcomponent.js", function(exports, require, module) {
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
var SCHNetLabel=require('circuit/shapes').SCHNetLabel;
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
      this.scalableTransformation.reset(1.2,0,0,15);
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
       //***  Labels without parent
       xml+="<connectors>\r\n";
       this.shapes.forEach(s=>{ 
    	   if (s instanceof SCHConnector){
               xml+= s.toXML();
           }
       });
       xml+="</connectors>\r\n";                 
       
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
	   	j$(data).find('netlabels').children().each(function(){
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
	    console.log(xml);
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
	      case  core.ModeEnum.NETLABEL_MODE:
	    	  shape=new SCHNetLabel();	          
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
});

;require.register("circuit/events.js", function(exports, require, module) {
var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var d2 = require('d2/d2');

class SymbolEventHandle extends EventHandle{
	constructor(component) {
			 super(component);
		 }
	mousePressed(event){
	       this.mx=event.x;
		   this.my=event.y;

		   if(super.isRightMouseButton(event)){                       
				    this.component.getModel().getUnit().setSelected(false);
				    this.target.setSelected(true);
					this.component.repaint();
					this.component.popup.registerSymbolPopup(this.target,event);            
		            return;
		   }
		   if(event.data.ctrlKey){
			   this.component.getModel().getUnit().setSelectedShape(this.target.uuid,
	                   !this.target.isSelected());
	    
	           this.ctrlButtonPress = true;
	           this.component.repaint();
	           return;		   
		   }
		   this.component.getModel().getUnit().setSelected(false);
		   this.target.setSelected(true);
		   this.component.repaint();	   
		    
		 }
	 mouseReleased(event){
			if(super.isRightMouseButton(event)){
				 return;
			}
			this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
					 
			this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
			this.component.repaint();
		 }
		 
		 mouseDragged(event){
			if(super.isRightMouseButton(event)){
				 return;
			} 
		 	let new_mx = event.x;
		    let new_my = event.y;
			
		    this.target.move(new_mx - this.mx, new_my - this.my);
		    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		    this.mx = new_mx;
		    this.my = new_my;
			this.component.repaint();
		 }
		 mouseMove(event){
		 
		 }	 
		
}
class WireEventHandle extends EventHandle{
	constructor(component) {
		 super(component);
}

attach() {        
   super.attach();
   this.component.lineBendingProcessor.initialize(this.target);
}
mousePressed(event){
   if(this.isRightMouseButton(event)){           
		this.component.popup.registerWirePopup(this.target,event);            
       return;
   }
   
   this.component.getModel().getUnit().setSelected(false);
   this.target.setSelected(true); 
   
   let p;      
   if(this.component.getParameter("snaptogrid")){        
       p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y);  
       this.component.lineBendingProcessor.isGridAlignable=true;
   }else{
   	p=new d2.Point(event.x,event.y);
       this.component.lineBendingProcessor.isGridAlignable=false;
   }
   
   //this.component.getModel().getUnit().fireShapeEvent(new ShapeEvent(this.target, ShapeEvent.PROPERTY_CHANGE)); 
   
   let justcreated=this.target.getLinePoints().length==1; 
       
   if(this.component.lineBendingProcessor.addLinePoint(p)){
       if(justcreated){
           //getComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.CREATE_MEMENTO));   
           //getComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.MOVE_MEMENTO));    
       }
       if(this.target.getLinePoints().length>=2){
          //this.component.getModel().getUnit().registerMemento(getTarget().getState(MementoType.MOVE_MEMENTO));    
       }            
   }
   this.component.repaint(); 
}
mouseReleased(event){
	
}
mouseMove(event){
	this.component.lineBendingProcessor.moveLinePoint(event.x,event.y);    
	this.component.repaint();   	 
}	
mouseDragged(event){
	
}
dblClick(){
	this.target.reset();
   this.target.setSelected(false);
   this.component.getEventMgr().resetEventHandle();
   this.component.repaint();	 
} 
detach() {
   this.target.reset(); 
   if(this.target.getLinePoints().length<2){
       this.target.owningUnit.remove(this.target.uuid);
   }
   super.detach();
}
}

class CircuitEventMgr{
	 constructor(component) {
	    this.component=component;
		this.targetEventHandle=null;	
		this.hash = new Map();
		this.hash.set("move",new events.MoveEventHandle(component));
		this.hash.set("resize",new events.ResizeEventHandle(component));
	    this.hash.set("component",new events.UnitEventHandle(component));
		this.hash.set("block",new events.BlockEventHandle(component));
		this.hash.set("wire",new WireEventHandle(component));
		this.hash.set("cursor",new events.CursorEventHandle(component));
		this.hash.set("symbol",new SymbolEventHandle(component));
		this.hash.set("texture",new events.TextureEventHandle(component));
		this.hash.set("dragheand",new events.DragingEventHandle(component));
		this.hash.set("origin",new events.OriginEventHandle(component));
		this.hash.set("measure",new events.MeasureEventHandle(component));		
		
	 }
	 //****private
	 getEventHandle(eventKey,target) {
	    var handle=this.hash.get(eventKey);
		if(handle!=null){
		  handle.setTarget(target);
		  if(eventKey=='resize'||eventKey=='move'||eventKey=='line'||eventKey=='texture'){
		     this.component.getModel().getUnit().fireShapeEvent({target:target,type:events.Event.SELECT_SHAPE});
		  }
		  if(eventKey=='component'||eventKey=="origin"){
			 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:events.Event.SELECT_UNIT});
		  }
		  handle.attach();
		}
		return handle;
	 }
	 
	 getTargetEventHandle(){
	   return this.targetEventHandle;
	 }
	 
	 setEventHandle(eventKey,target){
	        this.resetEventHandle();
	        this.targetEventHandle=this.getEventHandle(eventKey,target);
	    }
	 
	 resetEventHandle(){
		    //hide context menu
		    this.component.popup.close();
	        if (this.targetEventHandle != null) {
	            this.targetEventHandle.detach();
	        }
	        this.targetEventHandle = null;                
	    }
	 
	}

module.exports ={
		CircuitEventMgr,
		WireEventHandle
	}
});

;require.register("circuit/popup/circuitpopup.js", function(exports, require, module) {
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
registerWirePopup(target,event){	          	            
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='hvid' ><td style='padding: 0.4em;'>Horizontal To Vertical Bending</td></tr>";
	    items+="<tr id='vhid' ><td style='padding: 0.4em;'>Vertical to Horizontal Bending</td></tr>";
	    items+="<tr id='defaultbendid'><td style='padding: 0.4em;'>Default Bending</td></tr>";
	    items+="</table></div>";
	    this.setContent(items,{target:target});	    
	    this.open(event);	
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
	    this.setContent(items,{target:target});	
		this.open(event);		
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
});

;require.register("circuit/shapes.js", function(exports, require, module) {
var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var ResizeableShape=require('core/core').ResizeableShape;
var SymbolFontTexture=require('core/text/d2font').SymbolFontTexture;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var Pin=require('symbols/shapes').Pin;
var FontLabel=require('symbols/shapes').FontLabel;
var PIN_LENGTH=require('symbols/shapes').PIN_LENGTH;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var d2=require('d2/d2');
var AbstractLine=require('core/shapes').AbstractLine;
var SymbolType = require('core/core').SymbolType;

class CircuitShapeFactory{		
		createShape(data){
			if (data.tagName.toLowerCase() == 'module') {
				var symbol = new SCHSymbol();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'wire') {
				var symbol = new SCHWire();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'bus') {
				var symbol = new SCHBus();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'buspin') {
				var symbol = new SCHBusPin();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'junction') {
				var symbol = new SCHJunction();
				symbol.fromXML(data);
				return symbol;
			}
			if (data.tagName.toLowerCase() == 'label') {
				var symbol = new SCHFontLabel();
				symbol.fromXML(data);
				return symbol;
			}			
			if (data.tagName.toLowerCase() == 'noconnector') {
				var symbol = new SCHNoConnector();
				symbol.fromXML(data);
				return symbol;
			}						
			if (data.tagName.toLowerCase() == 'connector') {
				var symbol = new SCHConnector();
				symbol.fromXML(data);
				return symbol;
			}	
			if (data.tagName.toLowerCase() == 'netlabel') {
				var symbol = new SCHNetLabel();
				symbol.fromXML(data);
				return symbol;
			}			
			return null;
		}
		
}

class SCHSymbol extends  Shape{
constructor(){
		super(0,0,0,0,0,0);
		this.displayName = "Symbol";
   	    this.shapes=[];
   	 
	    this.reference=new SymbolFontTexture("","reference", 0, 0,1,8);
	    this.unit=new SymbolFontTexture("","unit", 0,0,1,0);		 	
	    
	    this.reference.fillColor='#000000';
	    this.unit.fillColor='#000000';
	    
	    this.type=SymbolType.SYMBOL;
}
clone(){
    var copy=new SCHSymbol();
    copy.shapes=[];
    copy.unit =this.unit.clone();
    copy.reference =this.reference.clone();        
    copy.displayName=this.displayName;
    this.shapes.forEach(function(shape){ 
      copy.add(shape.clone());  
    });
    return copy; 	
}
alignToGrid(isRequired) {
    let r=this.getPinsRect();
    //may not have pins
    if(r==null){
       return null;
    }
    let point=this.owningUnit.getGrid().positionOnGrid(r.min.x,r.min.y); 
    this.move(point.x-r.min.x,point.y-r.min.y);
    return null;
}
add(shape){
    if (shape == null)
          return;    
    this.shapes.push(shape);  
}
getPinsRect(){
	var r = new d2.Box(0,0,0,0);
 	var x1 = Number.MAX_VALUE; 
 	var y1 = Number.MAX_VALUE;
 	var x2 = Number.MIN_VALUE;
 	var y2 = Number.MIN_VALUE;       
    let isPinnable=false;
    
    this.shapes.forEach(shape=>{ 
      if(shape instanceof Pin){          
          let p=shape.getPinPoint();
          x1=Math.min(x1,p.x );
          y1=Math.min(y1,p.y);
          x2=Math.max(x2,p.x+0);
          y2=Math.max(y2,p.y +0);             
          isPinnable=true;
      }
    });
    if(isPinnable){
        r.setRect(x1,y1,x2-x1,y2-y1);
        return r;
    }else
        return null; 	
}
calculateShape() {
	var r = new d2.Box(0,0,0,0);
 	var x1 = Number.MAX_VALUE; 
 	var y1 = Number.MAX_VALUE;
 	var x2 = Number.MIN_VALUE;
 	var y2 = Number.MIN_VALUE;
 	
 	
    //***empty schematic,element,package
    if (this.shapes.length == 0) {
        return r;
    }

    var len=this.shapes.length;
	    for(var i=0;i<len;i++){
        var tmp = this.shapes[i].getBoundingShape();
        if (tmp != null) {
            x1 = Math.min(x1, tmp.x);
            y1 = Math.min(y1, tmp.y);
            x2 = Math.max(x2, tmp.x+tmp.width);
            y2 = Math.max(y2, tmp.y+tmp.height);
        }
        
    }
    r.setRect(x1, y1, x2 - x1, y2 - y1);
    return r;
}
getClickableOrder() {
	var box = this.getBoundingShape();	
	return box.width*box.height;
}
setSelected(selected) {        
    super.setSelected(selected);
    
    this.shapes.forEach(shape=>{   
      shape.fillColor=(selected?"blue":"#000000");
    });
    this.unit.setSelected(selected);
    this.reference.setSelected(selected);        
}
getClickedTexture(x,y) {
    if(this.reference.isClicked(x, y))
        return this.reference;
    else if(this.unit.isClicked(x, y))
        return this.unit;
    else
    return null;
}
isClickedTexture(x,y) {
    return this.getClickedTexture(x, y)!=null;
}
getTextureByTag(tag) {
    if(tag===(this.reference.tag))
        return this.reference;
    else if(tag===(this.unit.tag))
        return this.unit;
    else
    return null;
}
move(xoffset,yoffset){
	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].move(xoffset,yoffset);  
	   }	
	   this.reference.move(xoffset,yoffset);
	   this.unit.move(xoffset,yoffset);
}
rotate(rotation){
	   var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].rotate(rotation);  
	   }
	  
	   this.unit.setRotation(rotation);
	   this.reference.setRotation(rotation);
}
mirror(line){
	var len=this.shapes.length;
	   for(var i=0;i<len;i++){
		   this.shapes[i].mirror(line);  
	   } 	   
	   this.mirrorText(line,this.unit);
	   this.mirrorText(line,this.reference);	   
}
mirrorText(line,texture){
   	let oldalignment = texture.shape.alignment;
	texture.mirror(line);	
    if (line.isVertical) { //right-left mirroring
        if (texture.shape.alignment == oldalignment) {
            texture.shape.anchorPoint.set(texture.shape.anchorPoint.x +
                                    (texture.shape.metrics.ascent - texture.shape.metrics.descent),texture.shape.anchorPoint.y);
        }
    } else { //***top-botom mirroring          
        if (texture.shape.alignment == oldalignment) {
        	texture.shape.anchorPoint.set(texture.shape.anchorPoint.x,texture.shape.anchorPoint.y +(texture.shape.metrics.ascent - texture.shape.metrics.descent));
        }
    } 	
}
paint(g2, viewportWindow, scale,layersmask) {        
    
	var rect = this.getBoundingShape();		
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
	 return;
	}
		
	var len=this.shapes.length;
	for(i=0;i<len;i++){
		  this.shapes[i].paint(g2,viewportWindow,scale,layersmask);  
	}    
    this.unit.paint(g2, viewportWindow, scale, layersmask);
    this.reference.paint(g2, viewportWindow, scale, layersmask);
    	
    
 }
toXML(){    
    var xml="<module type=\""+SymbolType.valueOf(this.type)+"\" >\r\n";
    //xml.append("<footprint library=\""+ (packaging.getFootprintLibrary()==null?"":packaging.getFootprintLibrary())+"\" category=\""+(packaging.getFootprintCategory()==null?"":packaging.getFootprintCategory())+"\"  filename=\""+(packaging.getFootprintFileName()==null?"":packaging.getFootprintFileName())+"\" name=\""+(packaging.getFootprintName()==null?"":packaging.getFootprintName())+"\"/>\r\n");
    xml+="<name>"+this.displayName+"</name>\r\n";
    xml+="<reference>"+FontLabel.formatToXML(this.reference)+"</reference>\r\n";                           
    xml+=("<unit>"+ FontLabel.formatToXML(this.unit)+"</unit>\r\n");
    xml+="<elements>\r\n";        
    var len=this.shapes.length;
    for(i=0;i<len;i++){
		  xml+=this.shapes[i].toXML();  
	}
    xml+="</elements>\r\n";
    xml+="</module>\r\n"; 
    return xml;
}
fromXML(data){
	this.type=SymbolType.parse(j$(data).attr("type"));
	this.displayName=j$(data).find("name")[0].textContent;	
	
	var reference=j$(data).find("reference")[0];
	var label=j$(reference).find("label")[0];
	
	if(label!=undefined){
	  this.reference.fromXML(label.textContent);
	  this.reference.fillColor="#" +(j$(label).attr("color") & 0x00FFFFFF).toString(16).padStart(6, '0');	  
	}else{
	  this.reference.fromXML(reference.textContent);
	}
	var unit=j$(data).find("unit")[0];
	var label=j$(unit).find("label")[0];
	
	if(label!=undefined){	  		
	  this.unit.fromXML(label.textContent);	  
	  this.unit.fillColor="#" +(j$(label).attr("color") & 0x00FFFFFF).toString(16).padStart(6, '0');
	}else{
	  this.unit.fromXML(unit.textContent);	 
	}
	
	var that=this;
	var shapeFactory=new SymbolShapeFactory();
	 
	j$(data).find('elements').children().each(function(){
         var shape=shapeFactory.createShape(this);
         that.add(shape);
	});	
	
}
}
class SCHFontLabel extends FontLabel{
	constructor(x, y) {
		super(x, y, 0, 0, 1,core.Layer.LAYER_ALL);		
	}	
	clone(){
		var copy = new SCHFontLabel(this.x,this.y);
		copy.texture = this.texture.clone();  				
		return copy;
	}	
//    toXML(){
//        if(this.texture!=null&&!this.texture.isEmpty())
//          return "<label color=\""+this.texture.fillColor.getRGB()+"\">"+this.texture.toXML()+"</label>\r\n";
//        else
//          return "";          
//    }
}
class SCHWire extends AbstractLine{
	constructor(){
		   super(1,core.Layer.LAYER_ALL);
	       this.displayName = "Wire";	
	   	   this.selectionRectWidth=4;
		}
	clone() {
		var copy = new SCHWire();		
		copy.polyline=this.polyline.clone();
		return copy;
	}
	paint(g2, viewportWindow, scale,layersmask) {		
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}

		
		

		g2.lineWidth = this.thickness * scale.getScale();

		if (this.selection)
			g2.strokeStyle = "blue";
		else
			g2.strokeStyle = "black";

		let a=this.polyline.clone();
		
		// draw floating point
		if (this.isFloating()) {
			if(this.resumeState==ResumeState.ADD_AT_FRONT){
				let p = this.floatingMidPoint.clone();
				a.points.unshift(p);						    		
			
				p = this.floatingEndPoint.clone();
				a.points.unshift(p);			
			}else{
				let p = this.floatingMidPoint.clone();
				a.add(p);						    		
			
				p = this.floatingEndPoint.clone();
				a.add(p);
			}			
		}
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);

	    if((this.isSelected())/*&&(!this.isSublineSelected())*/){
	    	this.drawControlPoints(g2, viewportWindow, scale);
		}
		    
		    
	}	
	toXML(){		
		let xml="<wire thickness=\""+this.thickness+"\">";
		xml+="<wirepoints>";		
		this.polyline.points.forEach(function(point) {
			xml += utilities.roundFloat(point.x,1) + "," + utilities.roundFloat(point.y,1) + "|";
		},this);		
		xml+="</wirepoints>\r\n";
		xml+="</wire>\r\n";
		return xml;
	}	
	fromXML(data){
		
		var points= j$(data).find('wirepoints')[0];
		var tokens = points.textContent.split("|");
		
		for (var index = 0; index < tokens.length; index ++) {
			if(tokens[index].length>1){
				let points =tokens[index].split(",");
				let x = parseFloat(points[0]);
			    let y = parseFloat(points[1]);
			    this.polyline.points.push(new d2.Point(x, y));
			}
		}
	}
}

class SCHBus extends SCHWire{
	constructor(){
		   super(1,core.Layer.LAYER_ALL);
	       this.displayName = "Bus";	
	   	   this.selectionRectWidth=4;
	   	   this.thickness=4;
		}
	clone() {
		var copy = new SCHBus();		
		copy.polyline=this.polyline.clone();
		return copy;
	}
	toXML(){		
		let xml="<bus thickness=\""+this.thickness+"\">";
		xml+="<wirepoints>";		
		this.polyline.points.forEach(function(point) {
			xml += utilities.roundFloat(point.x,1) + "," + utilities.roundFloat(point.y,1) + "|";
		},this);		
		xml+="</wirepoints>\r\n";
		xml+="</bus>\r\n";
		return xml;
	}
}
class SCHBusPin extends AbstractLine{
	constructor(){
		   super(1,core.Layer.LAYER_ALL);
	       this.displayName = "BusPin";	
	   	   this.selectionRectWidth=4;	
	   	   this.polyline.points.push(new d2.Point(0, 0));
	   	   this.polyline.points.push(new d2.Point(-8, -8));
		   this.texture=new SymbolFontTexture("XXX","name", 5, 0,2,8);
		}
	clone() {
		var copy = new SCHBusPin();		
		copy.texture =this.texture.clone();  
		copy.polyline=this.polyline.clone();
		return copy;
	}
    
    alignToGrid(isRequired) {
       let point=this.polyline.points[1]; 
       let p=this.owningUnit.grid.positionOnGrid(point.x,point.y);        
        
       this.texture.move(p.x-point.x,p.y-point.y);  
       point.set(p);
        
       point=this.polyline.points[0]; 
       p=this.owningUnit.grid.positionOnGrid(point.x,point.y);        
       point.set(p);      
             
    }	
	alignResizingPointToGrid(targetPoint) {
	    this.owningUnit.grid.snapToGrid(targetPoint);         
	}	
	calculateShape(){
		return this.polyline.box;
	}
	getClickedTexture(x,y) {
	    if(this.texture.isClicked(x, y))
	        return this.texture;	    
	    else
	    	return null;
	}
    
    isControlRectClicked( x,  y) {
    	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);

        if(rect.contains(this.polyline.points[1])){
           return this.polyline.points[1]; 
        }else{
           return null;
        }
    }	
	isClickedTexture(x,y) {
	    return this.getClickedTexture(x, y)!=null;
	}
	getTextureByTag(tag) {
	    if(tag===(this.texture.tag))
	        return this.texture;	    
	    else
	    	return null;
	}	
	setSelected (selection) {
		super.setSelected(selection);		
	    this.texture.setSelected(selection);
	    
	}	
	move(xoffset,yoffset){
		   super.move(xoffset,yoffset);
		   this.texture.move(xoffset,yoffset);
	}
	mirror(line){
		super.mirror(line);
		this.texture.setMirror(line);
	}
	rotate(rotation){
		super.rotate(rotation);	
	 	this.texture.setRotation(rotation);				
	}
	Resize(xoffset, yoffset, clickedPoint) {
		clickedPoint.set(clickedPoint.x + xoffset,
									clickedPoint.y + yoffset);
	}
	paint(g2, viewportWindow, scale,layersmask) {		
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}

		g2.lineWidth = this.thickness * scale.getScale();

		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = "black";

		let a=this.polyline.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		
		
        this.texture.paint(g2, viewportWindow, scale);
		  
        if (this.isSelected()) {
            let c=new d2.Circle(this.polyline.points[0].clone(), 2);
            c.scale(scale.getScale());
            c.move(-viewportWindow.x,- viewportWindow.y);
            c.paint(g2,false);        
        
            
            utilities.drawCrosshair(g2,viewportWindow,scale,null,2,[this.polyline.points[1]]);
        }
        
        
		    
	}
	toXML(){
        let xml="<buspin>\r\n";
        xml+="<name>"+this.texture.toXML()+"</name>\r\n";
        xml+="<wirepoints>";
        xml+=utilities.roundDouble(this.polyline.points[0].x,1)+","+utilities.roundDouble(this.polyline.points[0].y,1)+"|";
        xml+=utilities.roundDouble(this.polyline.points[1].x,1)+","+utilities.roundDouble(this.polyline.points[1].y,1)+"|";
        xml+="</wirepoints>\r\n";       
        xml+="</buspin>\r\n";
        return xml;
	}	
	fromXML(data){
		var points= j$(data).find('wirepoints')[0];
		var tokens = points.textContent.split("|");		
			
		let pt =tokens[0].split(",");
		let x = parseFloat(pt[0]);
		let y = parseFloat(pt[1]);
		this.polyline.points[0].set(x, y);
		
		pt =tokens[1].split(",");
		x = parseFloat(pt[0]);
		y = parseFloat(pt[1]);
		this.polyline.points[1].set(x, y);
		
		var texture=j$(data).find("name")[0];	
		this.texture.fromXML(texture.textContent);
	    
	}
}

var ConnectorType={
    INPUT:0,
    OUTPUT:1  
}

var Style={
    BOX:0,
    ARROW:1,
    CIRCLE:2  
}; 

class SCHConnector extends Shape{
	constructor(){
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.selectionRectWidth=4;
		this.texture=new SymbolFontTexture("Label","name", -4, 2,0,8);		
		this.type=ConnectorType.INPUT;
		this.displayName="Connector";
		this.segment=new d2.Segment(0,0,(PIN_LENGTH / 2),0);		
		this.shape=new BoxShape(this);
	}
	clone(){
		 var copy=new SCHConnector();
		 copy.type=this.type;
		 copy.segment=this.segment.clone();
		 copy.texture =this.texture.clone(); 
		 switch(this.getStyle()){
		 case Style.BOX:
			 copy.shape=new BoxShape(copy);
			 break;
		 case Style.ARROW:
			 copy.shape=new ArrowShape(copy);
			 break;
		 case Style.CIRCLE:
			 copy.shape=new CircleShape(copy);
		 }
		 return copy;
	}
	getClickableOrder() {		
		return 4;
	}	
	alignToGrid(isRequired) {
	    var center=this.segment.ps;
	    var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
	    this.move(point.x - center.x,point.y - center.y);	     	       
	    return new d2.Point(point.x - center.x, point.y - center.y);
	}
    getPinPoint() {     
        return this.segment.ps;
    }	
	getTextureByTag(tag) {
	    if(tag===(this.texture.tag))
	        return this.texture;	    
	    else
	    return null;
	}	
	getClickedTexture(x,y) {
	    if(this.texture.isClicked(x, y))
	        return this.texture;	    
	    else
	    return null;
	}
	isClickedTexture(x,y) {
	    return this.getClickedTexture(x, y)!=null;
	}	
	calculateShape(){
		return this.segment.box;
	}
	setSelected (selection) {
		super.setSelected(selection);
		this.texture.setSelected(selection);		
	}	
	setType(type){
		this.type=type;
		this.shape.calculatePoints();
	}
    setText(text){
        this.texture.setText(text);
        this.shape.calculatePoints();
     } 	
	isClicked(x,y){
		  var rect = d2.Box.fromRect(x
					- (this.selectionRectWidth / 2), y
					- (this.selectionRectWidth / 2), this.selectionRectWidth,
					this.selectionRectWidth);
		  
		if (utilities.intersectLineRectangle(
				this.segment.ps,this.segment.pe, rect.min, rect.max)) {			
				return true;
		}else if(this.texture.isClicked(x,y)){
	    	return true;
	    }else
	     return   this.shape.contains(new d2.Point(x,y));
	 }	
	getStyle(){
		if(this.shape instanceof BoxShape){
			return  Style.BOX;
		}else if(this.shape instanceof ArrowShape){
			return  Style.ARROW;
		}else{
			return  Style.CIRCLE;
		}
	}
	setStyle(shape){
	  switch(shape){
	  case Style.ARROW:
		this.shape=new ArrowShape(this);  
		break;
	  case Style.BOX:
		this.shape=new BoxShape(this);
		break;
	  case Style.CIRCLE:
		this.shape=new CircleShape(this);	  
	  }
	  this.shape.calculatePoints();
	}
	rotate(rotation){
		this.segment.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
		this.texture.setRotation(rotation);
		this.shape.calculatePoints();				
	}	
	mirror(line){
    	this.segment.mirror(line);
    	this.texture.setMirror(line);
    	this.shape.calculatePoints();
    }
	move(xoff,yoff){
	   this.segment.move(xoff,yoff);	
	   this.shape.move(xoff,yoff);
	   this.texture.move(xoff,yoff);
	}
	paint(g2, viewportWindow, scale,layersmask) { 
		var rect = this.segment.box;
		rect.scale(scale.getScale());		
		if (!rect.intersects(viewportWindow)) {
			return;
		}
   	  	if(this.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";	        
	    }
   	  	//utilities.drawCrosshair(g2, viewportWindow, scale,null,2,[this.segment.ps.clone()]);
	    let line=this.segment.clone();                	    
		line.scale(scale.getScale());
	    line.move(-viewportWindow.x,- viewportWindow.y);	    
	    g2.lineWidth = this.thickness * scale.getScale();
	    line.paint(g2);
	    
		this.shape.paint(g2,viewportWindow, scale);
		this.texture.paint(g2,viewportWindow, scale);
	}
	init(orientation){
	
	    switch (orientation) {
	    case Orientation.EAST:        
	        this.segment.pe.set(this.segment.ps.x + (PIN_LENGTH / 2), this.segment.ps.y);
	        break;
	    case Orientation.WEST:
	    	this.segment.pe.set(this.segment.ps.x - (PIN_LENGTH / 2), this.segment.ps.y);    	
	        break;
	    case Orientation.NORTH:
	    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y - (PIN_LENGTH / 2));    	
	        break;
	    case Orientation.SOUTH:    	
	    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y + (PIN_LENGTH / 2));
	    }   
	}
    getOrientation(){
        if(this.segment.isHorizontal){
            if(this.segment.ps.x<this.segment.pe.x){
                return Orientation.EAST;
            }else{
                return Orientation.WEST;           
            }
        }else{
            if(this.segment.ps.y<this.segment.pe.y){
                return Orientation.SOUTH;
            }else{
                return Orientation.NORTH;           
            }            
        }        
    }	
	toXML(){	   		
        let xml="<connector type=\""+this.type+"\" style=\""+this.getStyle()+"\" >\r\n";        
        xml+="<name>"+this.texture.toXML()+"</name>\r\n";
        xml+="<a x=\""+utilities.roundDouble(this.segment.ps.x,1)+"\" y=\""+utilities.roundDouble(this.segment.ps.y,1)+"\"  orientation=\""+this.getOrientation()+"\"/>\r\n";        
        xml+="</connector>\r\n";
        return xml;
	}	
	fromXML(data){				
		if(j$(data).attr("type")){
            this.setType(Number.parseInt(j$(data).attr("type")));
            this.setStyle(Number.parseInt(j$(data).attr("style")));
            
			var texture=j$(data).find("name")[0];	
			this.texture.fromXML(texture.textContent);
			
			let a=j$(data).find("a");
			this.segment.ps.set(Number.parseFloat(j$(a).attr("x")),Number.parseFloat(j$(a).attr("y")));
			this.init(Number.parseInt(j$(a).attr("orientation")));
			
		}else{
			var tokens = j$(data).find("a")[0].textContent.split(",");
			this.segment.ps.set(parseFloat(tokens[0]),parseFloat(tokens[1]));
			this.init(parseInt(tokens[3]));
		
			this.setStyle(Number.parseInt(j$(data).attr("style")));
			this.setType(Number.parseInt(j$(data).find("type")[0].textContent));
			var texture=j$(data).find("name")[0];	
			this.texture.fromXML(texture.textContent);
		
			this.shape.calculatePoints();
		}
	}	
}
class BoxShape{
	constructor(connector){
		this.connector=connector
		this.polygon=new d2.Polygon();
		this.calculatePoints();	
	}
	calculatePoints(){
		  this.polygon.points.length=0;
		  let rect=this.connector.texture.shape.box;
		  let width=2+rect.width; 
		  let height=2+rect.height;
	
		  switch(this.connector.type) {
		  case ConnectorType.OUTPUT:
		  if(this.connector.segment.isVertical){
			  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
			  let v1=v.clone();
			  v1.rotate90CCW();
			  let norm=v1.normalize();			  
			  let xx=this.connector.segment.ps.x +4*norm.x;
			  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(xx,yy));
			  
			  let v2=v.clone();
			  v2.rotate90CW();
			  norm=v2.normalize();			  
			  let x=this.connector.segment.ps.x +4*norm.x;
			  let y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  v2.rotate90CCW();
			  norm=v2.normalize();			  
			  x=x +height*norm.x;
			  y=y +height*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  norm=v.normalize();			  
			  x=this.connector.segment.ps.x +(4+height)*norm.x;
			  y=this.connector.segment.ps.y +(4+height)*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));

			  
			  v1.rotate90CW();
			  norm=v1.normalize();			  
			  xx=xx +height*norm.x;
			  yy=yy +height*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(xx,yy));  			  
		  }else{
				  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
				  
				  let v1=v.clone();
				  v1.rotate90CCW();
				  let norm=v1.normalize();			  
				  let xx=this.connector.segment.ps.x +4*norm.x;
				  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));
				  
				  let v2=v.clone();
				  v2.rotate90CW();
				  norm=v2.normalize();			  
				  let x=this.connector.segment.ps.x +4*norm.x;
				  let y=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  v2.rotate90CCW();
				  norm=v2.normalize();			  
				  x=x +width*norm.x;
				  y=y +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  norm=v.normalize();			  
				  x=this.connector.segment.ps.x +(4+width)*norm.x;
				  y=this.connector.segment.ps.y +(4+width)*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));

				  
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  xx=xx +width*norm.x;
				  yy=yy +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));  			  
		   }
		  break;
		  case ConnectorType.INPUT:
			  if(this.connector.segment.isVertical){
				  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);				  				  				  
				  let norm=v.normalize();			  
				  let xx=this.connector.segment.ps.x +4*norm.x;
				  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  
				  
				  
				  let v1=v.clone();
				  v1.rotate90CCW();
				  norm=v1.normalize();			  
				  xx=(xx) +4*norm.x;
				  yy=(yy) +4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));
				  
				  norm=v.normalize();			  
				  let x=xx +height*norm.x;
				  let y=yy +height*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));

				  v1=v.clone();
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +8*norm.x;
				  y=y +8*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +height*norm.x;
				  y=y +height*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  this.polygon.points.push(this.connector.segment.ps.clone());
			  }else{
				  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);				  				  				  
				  let norm=v.normalize();			  
				  let xx=this.connector.segment.ps.x +4*norm.x;
				  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
				  
				  
				  
				  let v1=v.clone();
				  v1.rotate90CCW();
				  norm=v1.normalize();			  
				  xx=(xx) +4*norm.x;
				  yy=(yy) +4*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(xx,yy));
				  
				  norm=v.normalize();			  
				  let x=xx +width*norm.x;
				  let y=yy +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));

				  v1=v.clone();
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +8*norm.x;
				  y=y +8*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  v1.rotate90CW();
				  norm=v1.normalize();			  
				  x=x +width*norm.x;
				  y=y +width*norm.y;						 	   	
				  this.polygon.points.push(new d2.Point(x,y));
				  
				  this.polygon.points.push(this.connector.segment.ps.clone()); 
			  }
			  break;
		  }
	}
    contains(pt){
    	return this.polygon.contains(pt);
    }
	move(xoffset, yoffset) {
		this.polygon.move(xoffset,yoffset);
	}	
	paint(g2,viewportWindow,scale){
   	  	var rect = this.polygon.box;
   	  	rect.scale(scale.getScale());
   	  	if (!rect.intersects(viewportWindow)) {
  		  return;
   	  	}		
	    
	    let p=this.polygon.clone();
		p.scale(scale.getScale());
        p.move(-viewportWindow.x,- viewportWindow.y);
        
   	  	if(this.connector.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";
	        
	    }
   	  	p.paint(g2);		
	}	
}
class ArrowShape{
	constructor(connector){
		this.connector=connector
		this.polygon=new d2.Polygon();
		this.calculatePoints();		
	}
	calculatePoints(){
		  this.polygon.points.length=0;
		  
		  switch(this.connector.type) {
		  case ConnectorType.OUTPUT:
			  {let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
			  let norm=v.normalize();			  
			  let x=this.connector.segment.ps.x +4*norm.x;
			  let y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
		  
			  let v1=v.clone();
			  v1.rotate90CCW();
			  norm=v1.normalize();			  
			  x=this.connector.segment.ps.x +4*norm.x;
			  y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
		  
			  let v2=v.clone();
			  v2.rotate90CW();
			  norm=v2.normalize();			  
			  x=this.connector.segment.ps.x +4*norm.x;
			  y=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  break;
			  }
		  case ConnectorType.INPUT:
			  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
			  let norm=v.normalize();			  
			  let xx=this.connector.segment.ps.x +4*norm.x;
			  let yy=this.connector.segment.ps.y + 4*norm.y;						 	   	
			  
			  let v1=v.clone();
			  v1.rotate90CCW();
			  norm=v1.normalize();			  
			  let x=xx +4*norm.x;
			  let y=yy + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  v1=v.clone();
			  v1.rotate90CW();
			  norm=v1.normalize();			  
			  x=xx +4*norm.x;
			  y=yy + 4*norm.y;						 	   	
			  this.polygon.points.push(new d2.Point(x,y));
			  
			  this.polygon.points.push(this.connector.segment.ps.clone());
		  }
	}	
    contains(pt){
    	return this.polygon.contains(pt);
    }
	move(xoffset, yoffset) {
		this.polygon.move(xoffset,yoffset);
	}
	paint(g2,viewportWindow,scale){
   	  	var rect = this.polygon.box;
   	  	rect.scale(scale.getScale());
   	  	if (!rect.intersects(viewportWindow)) {
  		  return;
   	  	}		
	    
	    let p=this.polygon.clone();
		p.scale(scale.getScale());
        p.move(-viewportWindow.x,- viewportWindow.y);
        
   	  	if(this.connector.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";
	        
	    }
   	  	p.paint(g2);		
	}
}

class CircleShape{
	constructor(connector){
		this.connector=connector
		this.circle=new d2.Circle(new d2.Point(0,0),4);
		this.calculatePoints();
	}
	calculatePoints(){
		  let v=new d2.Vector(this.connector.segment.pe,this.connector.segment.ps);
		  let norm=v.normalize();			  
		  let x=this.connector.segment.ps.x +4*norm.x;
		  let y=this.connector.segment.ps.y + 4*norm.y;				
		 	   	
		  this.circle.pc.set(x,y); 
	}
    contains(pt){
    	return this.circle.contains(pt);
    }
	move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}
	paint(g2,viewportWindow,scale){
   	  	var rect = this.circle.box;
   	  	rect.scale(scale.getScale());
   	  	if (!rect.intersects(viewportWindow)) {
  		  return;
   	  	}		
	    
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
        
   	  	if(this.connector.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";
	        
	    }
   	  	c.paint(g2);
				
	}
}
const OFFSET=2;
class SCHNetLabel extends Shape{
	constructor(){
		  super(0, 0, 0, 0, 1,core.Layer.LAYER_ALL);	
		  this.displayName = "NetLabel";	
		  this.selectionRectWidth=2;		      
	      this.texture=new SymbolFontTexture("netLabel","name", -4, 2,0,8);
	      this.point=new d2.Point(0,0);
	      this.setTextLocation(); 
		}
clone(){
		   	var copy = new SCHNetLabel();
			copy.texture=this.texture.clone();
			copy.point=this.point.clone();
		    return copy;
		}
alignToGrid( isRequired) {        
    let p=this.owningUnit.getGrid().positionOnGrid(this.point.x,this.point.y);
    this.move(p.x - this.point.x,p.y - this.point.y);   
    return null;
}  
calculateShape() {        
    return this.texture.getBoundingShape();
}
move( xoffset, yoffset) {
    this.point.move(xoffset,yoffset);        
    this.texture.move(xoffset, yoffset);     
}
rotate( rotation) {
    this.point.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
    this.texture.setRotation(rotation);        
}
mirror( line) {        
    this.point.mirror(line);
    this.texture.setMirror(line);                  
}
setAlignment(alignment){
    this.texture.setAlignment(alignment);            
    this.setTextLocation();
}
setTextLocation(){
	let orientation=TextAlignment.getOrientation(this.texture.shape.alignment);	
    if(orientation==TextOrientation.HORIZONTAL){      
      this.texture.shape.anchorPoint.set(this.point.x+OFFSET,this.point.y-OFFSET);
    }else{      
      this.texture.shape.anchorPoint.set(this.point.x-OFFSET,this.point.y-OFFSET);  
    }
}
paint( g2,viewportWindow,  scale, layersmask) {
  
              let rect = this.texture.getBoundingShape();
              rect.scale(scale.getScale());
              if (!rect.intersects(viewportWindow)) {
                    return;
              }
              this.texture.fillColor=(this.selection?'blue':'black');        
              this.texture.paint(g2, viewportWindow, scale,layersmask);   
              
              if(this.selection){
            	  g2.fillStyle = "gray";            	  
                  let c=new d2.Circle(this.point.clone(),this.selectionRectWidth);
                  c.scale(scale.getScale());
                  c.move(-viewportWindow.getX() ,- viewportWindow.getY());        
                  g2._fill=true;
                  c.paint(g2); 
                  g2._fill=false;
              }
                
                
}
toXML(){	
    return "<netlabel x=\""+utilities.roundDouble(this.point.x,1)+"\" y=\""+utilities.roundDouble(this.point.y,1)+"\" >"+this.texture.toXML()+"</netlabel>\r\n"        
}
fromXML(data){		
	this.point.set(parseFloat(j$(data).attr("x")),parseFloat(j$(data).attr("y")));
	this.texture.fromXML(j$(data).textContent);
	this.setTextLocation();
}
}
class SCHJunction extends Shape{
	constructor(){
	  super(0, 0, 0, 0, 1,core.Layer.LAYER_ALL);	
	  this.displayName = "Junction";	
	  this.selectionRectWidth=2;	
	  this.circle=new d2.Circle(new d2.Point(0,0),this.selectionRectWidth);	
	}
	clone(){
	   	var copy = new SCHJunction();
		 copy.circle.pc.x=this.circle.pc.x;
		 copy.circle.pc.y=this.circle.pc.y;
		 copy.circle.r=this.circle.r;	        	        
	     return copy;
	}	
getClickableOrder() {		
	return 1;
}	
alignToGrid(isRequired) {
    let point=this.owningUnit.getGrid().positionOnGrid(this.circle.pc.x, this.circle.pc.y);
    this.circle.pc.set(point.x,point.y);    
    return null;
}
move(xoffset, yoffset) {
	this.circle.move(xoffset,yoffset);
} 
rotate(rotation){	  
	this.circle.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	   
}
mirror(line){
	this.circle.mirror(line);	
}
calculateShape() {
    return this.circle.box;
}
paint(g2, viewportWindow, scale,layersmask) {  
	  var rect = this.circle.box;
  	  rect.scale(scale.getScale());
  	  if (!rect.intersects(viewportWindow)) {
  		  return;
  	  }		
  	  g2.lineWidth=(scale.getScale())*this.thickness;
  	  if (this.selection) {
  		 g2.fillStyle = "blue";
  	  } else {
		 g2.fillStyle = "black";
  	  }

    let c=this.circle.clone();
	c.scale(scale.getScale());
    c.move(-viewportWindow.x,- viewportWindow.y);
    g2._fill=true;
    c.paint(g2);
    g2._fill=false;
  	  
}
toXML(){	
    return "<junction x=\""+utilities.roundDouble(this.circle.pc.x,1)+"\" y=\""+utilities.roundDouble(this.circle.pc.y,1)+"\" />\r\n";        
}
fromXML(data){
	if(j$(data).attr("x")){
		this.circle.pc.set(parseFloat(j$(data).attr("x")),parseFloat(j$(data).attr("y")));
	}else{
		var tokens = data.textContent.split(",");	
		this.circle.pc.set(parseFloat(tokens[0]),parseFloat(tokens[1]));
	}
}
}
class SCHNoConnector extends Shape{
	constructor(){
		  super(0, 0, 0, 0, 1,core.Layer.LAYER_ALL);	
		  this.displayName = "NoConnector";	
		  this.selectionRectWidth=3;	
		  this.point=new d2.Point(0,0);
			
		}
clone(){
		   	var copy = new SCHNoConnector();
		   	copy.point=this.point.clone();		   	 	         	        
		    return copy;
		}		
alignToGrid(isRequired) {
    this.owningUnit.getGrid().snapToGrid(this.point);         
    return null;
}
getClickableOrder() {		
	return 3;
}
calculateShape(){
    return d2.Box.fromRect(this.point.x - this.selectionRectWidth, this.point.y - this.selectionRectWidth, 2 * this.selectionRectWidth,
            2 * this.selectionRectWidth);
}		
move(xoffset,yoffset){
	this.point.move(xoffset,yoffset);
}
rotate(rotation){
	this.point.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	   
}
mirror(line){
	this.point.mirror(line);	
}
paint(g2, viewportWindow, scale,layersmask) {  
	  var rect = this.getBoundingShape();
	  rect.scale(scale.getScale());
	  if (!rect.intersects(viewportWindow)) {
		  return;
	  }	  
	  
	  g2.lineWidth=(scale.getScale())*this.thickness;
 	  	if(this.isSelected()){
	        g2.strokeStyle = "blue";   	        
   	           	        
   	  	}else{
	        g2.strokeStyle = "black";	        
	    }
	  let line=new d2.Segment(this.point.x-this.selectionRectWidth, this.point.y-this.selectionRectWidth,this.point.x+this.selectionRectWidth, this.point.y+this.selectionRectWidth);	  	 
	  line.scale(scale.getScale());
	  line.move(-viewportWindow.x,- viewportWindow.y);  
	  line.paint(g2);  
	  
	  line.set(this.point.x-this.selectionRectWidth, this.point.y+this.selectionRectWidth,this.point.x+this.selectionRectWidth, this.point.y-this.selectionRectWidth);	  	 
	  line.scale(scale.getScale());
	  line.move(-viewportWindow.x,- viewportWindow.y);  
	  line.paint(g2);  
	  
	  
}
toXML(){	
	return "<noconnector x=\""+utilities.roundDouble(this.point.x,1)+"\" y=\""+utilities.roundDouble(this.point.y,1)+"\" />\r\n";        	
}

fromXML(data){
	let x=parseFloat(j$(data).attr("x"));
	let y=parseFloat(j$(data).attr("y"));			
	this.point.set(x,y);
}
	
}
module.exports ={
		SCHSymbol,
		SCHNetLabel,
		SCHWire,
		SCHBus,
		SCHBusPin,
		SCHFontLabel,		
		SCHJunction,
		SCHConnector,
		SCHNoConnector,
		CircuitShapeFactory,
		
}
});

;require.register("circuit/views/circuitloadview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var CircuitContainer=require('circuit/d/circuitcomponent').CircuitContainer;

CircuitLoadView=Backbone.View.extend({
	  initialize:function(opt){
			j$('#CircuitLoadDialog').jqxWindow('open');
			j$('#CircuitLoadDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#CircuitLoadDialog').on('close', j$.proxy(this.onclose,this)); 
			this.unitSelectionPanel=new core.UnitSelectionPanel({selectorid:'circuitselectionpanel',canvasprefixid:'c',enabled:opt.enabled});
			this.unitSelectionPanel.textColor='black';
			this.unitSelectionPanel.backColor='white';
		    this.unitSelectionPanel.unitSelectionGrid.scaleFactor=1;
		    this.unitSelectionPanel.unitSelectionGrid.scaleRatio=0.96;    
		    this.unitSelectionPanel.unitSelectionGrid.minScaleFactor=1;
		    this.unitSelectionPanel.unitSelectionGrid.maxScaleFactor=10;
			this.libraryview=new LibraryView({unitSelectionPanel:this.unitSelectionPanel});  
	    	this.buttonview=new ButtonLoadView({unitSelectionPanel:this.unitSelectionPanel});  
		  },
    onclose:function(){
  	  this.undelegateEvents();
  	  this.unitSelectionPanel.release();
  	  this.libraryview.clear();
  	  this.buttonview.clear();
  	  this.remove();
  	  this.unbind();
    },		  
    render:function(){
  	this.libraryview.render();  
  	this.buttonview.render();
  	this.unitSelectionPanel.render();
    }
		  
});

LibraryView=Backbone.View.extend({
	el:"#projectcomboslot",
	initialize:function(opt){
		this.unitSelectionPanel=opt.unitSelectionPanel;
		j$('#circuittree').jqxTree({width: '100%',height:'260px'});
		//bind select element
		j$('#circuittree').on('select',j$.proxy(this.onvaluechange,this));			
        this.loadworkspaces();
	},
	clear:function(){
	    //unbind select element		
		j$('#circuittree').off('select',j$.proxy(this.onvaluechange,this));
		j$('#circuittree').jqxTree('clear');
		this.undelegateEvents();
	},
    events: {
        'change #projectcombo':'onchange',
    },
    onchange:function(event){
    	this.loadboards(j$('#projectcombo').val()); 
    },
    onvaluechange:function(event){
        //is this category or footprint selection
    	var item = j$('#circuittree').jqxTree('getItem', event.args.element);
    	var  url=j$('#projectcombo').val()+'/'+item.value.project;	
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url:encodeURI('/rest/circuits/workspaces/'+url),
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#CircuitLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(function(data, textStatus, jqXHR){
	            this.unitSelectionPanel.release();
	            
	            let circuitContainer=new CircuitContainer(true);	            
	            core.isEventEnabled=false;
	            circuitContainer.parse(data);
	            core.isEventEnabled=true;
	            this.unitSelectionPanel.unitSelectionGrid.setModel(circuitContainer);
	            this.unitSelectionPanel.unitSelectionGrid.scaleFactor=11;
	            this.unitSelectionPanel.unitSelectionGrid.build();   
	            this.unitSelectionPanel.render();	        	
	        },this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#CircuitLoadDialog').unblock();
	        }
	    });
    	
    },
    loadworkspaces:function(){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/circuits/workspaces',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#CircuitLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadworkspaces,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#CircuitLoadDialog').unblock();
	        }
	    });
	    
	}, 
	onloadworkspaces:function(data, textStatus, jqXHR){
		var that=this; 
		j$(data).find("name").each(j$.proxy(function(){
		  j$('#projectcombo').append('<option value="' +j$(this).text()+ '">' +  j$(this).text() + '</option>');
		}),that);

		this.loadboards(j$('#projectcombo').val());
	},	
	loadboards:function(workspace){
		if(workspace==null){
			return;
		}
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: encodeURI('/rest/circuits/workspaces/'+workspace),
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#CircuitLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadboards,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#CircuitLoadDialog').unblock();
	        }
	    });		
	},
	onloadboards:function(data, textStatus, jqXHR){
		var that=this; 
		j$('#circuittree').jqxTree('clear');
		j$(data).find("name").each(j$.proxy(function(){	
			j$('#circuittree').jqxTree('addTo', { label: j$(this).text(),value:{project:j$(this).attr("project"),fullname:(j$(this).attr("fullname")!=undefined?j$(this).text():undefined)}}, null);         
		}),that);		
		j$('#circuittree').jqxTree('render');
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append("<select class=\"form-control input-sm\" id=\"projectcombo\"></select>");
		
	}
});
ButtonLoadView=Backbone.View.extend({
	el:"#circuitbuttonslot",
	initialize:function(opt){
	  this.unitSelectionPanel=opt.unitSelectionPanel;
    },	
    clear:function(){
       this.undelegateEvents();
    },
    events: {
        "click  #loadbuttonid" : "onload",	
        "click  #closebuttonid" : "onclose",	
    },
    onload:function(){
    	 if(this.unitSelectionPanel.unitSelectionGrid.model==null){
    		 return;
    	 }
    	mywebpcb.trigger('workspaceview:load',this.unitSelectionPanel.unitSelectionGrid.model);
		//close dialog 
		j$('#CircuitLoadDialog').jqxWindow('close');
		
    },
    onclose:function(){
    	j$('#CircuitLoadDialog').jqxWindow('close'); 	
    },
    
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
		"<button  id=\"loadbuttonid\" class=\"btn btn-default\">Load</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebuttonid\" class=\"btn btn-default\">Close</button>");
	}
});

module.exports =CircuitLoadView;
});

require.register("circuit/views/circuitsaveview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var CircuitContainer=require('circuit/d/circuitcomponent').BoardContainer;


var CircuitSaveView=Backbone.View.extend({
	initialize:function(opt){
			this.model=opt.model; 
			j$('#CircuitSaveDialog').jqxWindow({height: 300, width: 420});
			j$('#CircuitSaveDialog').jqxWindow('open');
			j$('#CircuitSaveDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#CircuitSaveDialog').on('close', j$.proxy(this.onclose,this)); 				    	
			this.workspaceview=new WorkspaceView(opt);
			this.buttonview=new ButtonView(opt); 
			
	},
	onclose:function(){
		this.buttonview.clear();	
	},
    render:function(){ 
    	this.buttonview.render();
    }
		  
});

WorkspaceView=Backbone.View.extend({
	initialize:function(opt){
		this.model=opt.model;
		j$('#workspacecomboid').editableSelect('clear');
		j$('#projectnameid').val(this.model.formatedFileName);
		j$('#workspacecomboid').val('');
		 this.loadworkspaces();
	},
    loadworkspaces:function(){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/circuits/workspaces',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#CircuitSaveDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadworkspaces,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#CircuitSaveDialog').unblock();
	        }
	    });    	
    },
    onloadworkspaces:function(data, textStatus, jqXHR){
		let that=this;
    	j$(data).find("name").each(j$.proxy(function(){
		  j$('#workspacecomboid').editableSelect('add',j$(this).text());
		}),that);  	
    },

	render:function(){

		
	}
});

ButtonView=Backbone.View.extend({
	el:"#savebuttonslot",
	initialize:function(opt){
	  this.model=opt.model;
    },	
    clear:function(){
       this.undelegateEvents();
    },
    events: {
        "click  #savebuttonid" : "onsave",	
        "click  #closebuttonid" : "onclose",	
    },
    onsave:function(){    	
    	let workspace=j$('#workspacecomboid').val()!=''?j$('#workspacecomboid').val():'null';
	    let name=j$('#projectnameid').val()!=''?j$('#projectnameid').val():'null'	
    	j$.ajax({
	        type: 'POST',
	        contentType: 'application/xml',
	        url: '/rest/circuits/workspaces/'+workspace+'?projectName='+name+'&overwrite='+j$('#overrideCheck').is(":checked"),
	        dataType: "xml",
	        data:this.model.format(),
	        beforeSend:function(){
		          j$('#CircuitSaveDialog').block({message:'<h5>Saving...</h5>'});	
		        },
	        success: function(){
	    		//close dialog 
	    		j$('#CircuitSaveDialog').jqxWindow('close');
	        },	        		        
	        error: function(jqXHR, textStatus, errorThrown){
	            //if(jqXHR.status==404){
	            	//data=jqXHR.responseJSON;
	            	//clean error list
	            	//$("#errorsres ul").empty();
	            	//for(var i = 0; i < data.length; i++) {
	            	//	$("#errorsres ul").append('<li>'+data[i]+'</li>');
	            	//}
	            //}else{
	            	alert(errorThrown+":"+jqXHR.responseText);
	            //}
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#CircuitSaveDialog').unblock();
	        }
	    });    	
    },
    onclose:function(){
    	j$('#CircuitSaveDialog').jqxWindow('close'); 	
    },
    
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
		"<button  id=\"savebuttonid\" class=\"btn btn-default\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebuttonid\" class=\"btn btn-default\">Close</button>");
	}
});

module.exports =CircuitSaveView
});

;require.register("circuit/views/circuitspanelview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var events=require('core/events');
var core=require('core/core');
//var UnitMgr = require('core/unit').UnitMgr;
var utilities =require('core/utilities');
var BaseBuilder = require('core/views/panelview').BaseBuilder;
var SCHSymbol=require('circuit/shapes').SCHSymbol;
var SCHFontLabel=require('circuit/shapes').SCHFontLabel;
var SCHJunction=require('circuit/shapes').SCHJunction;
var SCHBusPin=require('circuit/shapes').SCHBusPin;
var SCHWire=require('circuit/shapes').SCHWire;
var SCHConnector=require('circuit/shapes').SCHConnector;
var SCHNoConnector=require('circuit/shapes').SCHNoConnector;
var SCHNetLabel=require('circuit/shapes').SCHNetLabel;

var ComponentPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  ComponentPanelBuilder.__super__.initialize(component);	
      this.id="componentpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',	
    },
	onclick:function(event){
		event.preventDefault();
		alert("Hello from me with event.");
	},
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='nameid'){
			 this.target.getModel().setFileName(j$("#nameid").val()); 
			 this.target.fireContainerEvent({target:null,type:events.Event.RENAME_CONTAINER});
		 }
		 //mycanvas.focus();
		
	},
	updateui:function(){
		j$("#nameid").val(this.target.getModel().formatedFileName);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+
				"</td></tr>"+
		"</table>");
			
		return this;
	}
});
var LabelPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		LabelPanelBuilder.__super__.initialize(component);	
		this.id="labelpanelbuilder";   
    },
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #textid' : 'onenter',	
        'keypress #rotateid' : 'onenter',
        'keypress #sizeid' : 'onenter',	
        'keypress #thicknessid' : 'onenter',	
		'change #alignmentid':'onchange',
		'change #colorid':'onchange',
        'change #styleid': 'onchange', 
    },
    onchange:function(event){      
	  if(event.target.id=='alignmentid'){
		  this.target.texture.shape.alignment= (parseInt(j$("#alignmentid").val()));
      }
	  if(event.target.id=='colorid'){		  	
		  this.target.texture.fillColor=(j$('#colorid').val());			  
	  }
	  if(event.target.id=='styleid'){
		  this.target.texture.shape.style=(j$('#styleid').val());			  
	  }	  
      this.component.repaint(); 
    },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='textid'){
			 this.target.texture.setText(j$('#textid').val());			  
		 }
		 if(event.target.id=='sizeid'){
			 this.target.texture.setSize((parseInt(j$('#sizeid').val())));			 
		 }	          
		 if((event.target.id=='yid')||(event.target.id=='xid')){	            
			 this.target.texture.setLocation(this.fromUnitX(j$('#xid').val()),this.fromUnitY(j$('#yid').val()));  
	     }		 
		 this.component.repaint();     		    	
    },
	updateui:function(){
	 j$('#textid').val(this.target.texture.shape.text);	
	 j$('#xid').val(utilities.roundFloat(this.target.texture.shape.anchorPoint.x,1));
	 j$('#yid').val(utilities.roundFloat(this.target.texture.shape.anchorPoint.y,1));	 
	 j$("#alignmentid").val(this.target.texture.shape.alignment);
	 j$('#colorid').val(this.target.texture.fillColor);		
	 j$('#sizeid').val(this.target.texture.shape.fontSize);
	 j$('#styleid').val(this.target.texture.shape.style);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Text</td><td><input type='text' id='textid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Text Orientation</td><td>" +
				"<select class=\"form-control input-sm\" id=\"alignmentid\">"+
				this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='padding:7px'>Color</td><td><input type='color' id='colorid' value='#ff0000'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Style</td><td>" +
				"<select class=\"form-control input-sm\" id=\"styleid\">"+
				this.fillComboBox([{id:'plain',value:'PLAIN',selected:true},{id:'bold',value:'BOLD'},{id:'italic',value:'ITALIC'}])+
			    "</select>" +
				"</td></tr>"+								
				"<tr><td style='padding:7px'>Size</td><td><input type='text' id='sizeid' value='' class='form-control input-sm\'></td></tr>"+				
		        "</table>");
			
		return this;
	}
});
var BusPinPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		BusPinPanelBuilder.__super__.initialize(component);
		this.id="buspinpanelbuilder";  
    },	
    events: {               
        'keypress #buspinnameid' : 'onenter',
        'change #alignmentid': 'onchange',        
    },
    onchange:function(event){
        if(event.target.id=='alignmentid'){
        	this.target.getTextureByTag("name").setAlignment(parseInt(j$("#alignmentid").val()));        	
        }
        this.component.repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='buspinnameid'){ 
			 this.target.getTextureByTag("name").setText(j$('#buspinnameid').val()); 
		 }		 	 
		 this.component.repaint(); 		 
    },

	updateui:function(){
		   var texture=this.target.texture;
		   j$("#buspinnameid").val(texture==null?"":texture.shape.text);
		   j$('#alignmentid').val(this.target.getTextureByTag("name").getAlignment()); 
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='padding:7px'>Name</td><td><input type='text' id='buspinnameid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Text Alignment</td><td>" +
				"<select class=\"form-control input-sm\" id=\"alignmentid\">"+
				this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
			    "</select>" +
				"</td></tr>"+											
		"</table>");
			
		return this;
	}
});
var NetLabelPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		NetLabelPanelBuilder.__super__.initialize(component);
		this.id="netlabelpanelbuilder";  
    },	
    events: {               
        'keypress #netlabelnameid' : 'onenter',
        'change #alignmentid': 'onchange',        
    },
    onchange:function(event){
        if(event.target.id=='alignmentid'){
        	this.target.setAlignment(parseInt(j$("#alignmentid").val()));        	
        }
        this.component.repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='netlabelnameid'){ 
			 this.target.texture.setText(j$('#netlabelnameid').val()); 
		 }		 	 
		 this.component.repaint(); 		 
    },

	updateui:function(){
		   var texture=this.target.texture;
		   j$("#netlabelnameid").val(texture==null?"":texture.shape.text);
		   j$('#alignmentid').val(this.target.texture.getAlignment()); 
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='padding:7px'>Name</td><td><input type='text' id='netlabelnameid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Text Alignment</td><td>" +
				"<select class=\"form-control input-sm\" id=\"alignmentid\">"+
				this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
			    "</select>" +
				"</td></tr>"+											
		"</table>");
			
		return this;
	}
});
var ConnectorPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		ConnectorPanelBuilder.__super__.initialize(component);
		this.id="connectorpanelbuilder";  
    },	
    events: {        
        'keypress #connectornameid' : 'onenter',                       
        'change #typeid': 'onchange',    
        'change #styleid': 'onchange',  
    },
    onchange:function(event){
        if(event.target.id=='typeid'){
        	this.target.setType(Number.parseInt(j$('#typeid').val()));        	
        }
        if(event.target.id=='styleid'){
        	this.target.setStyle(Number.parseInt(j$('#styleid').val()));        	
        }
        this.component.repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='connectornameid'){ 
			 this.target.setText(j$('#connectornameid').val()); 
		 }		 	 
		 this.component.repaint(); 		 
    },

	updateui:function(){		   
		   j$('#connectornameid').val(this.target.texture.shape.text);
		   j$('#styleid').val(this.target.getStyle()); 
		   j$('#typeid').val(this.target.type);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+										
				"<tr><td style='padding:7px'>Label</td><td><input type='text' id='connectornameid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Shape</td><td>" +
				"<select class=\"form-control input-sm\" id=\"styleid\">"+
				this.fillComboBox([{id:0,value:'BOX'},{id:1,value:'ARROW'},{id:2,value:'CIRCLE'}])+
			    "</select>" +
				"</td></tr>"+	
				"<tr><td style='width:50%;padding:7px'>Type</td><td>" +
				"<select class=\"form-control input-sm\" id=\"typeid\">"+
				this.fillComboBox([{id:0,value:'INPUT'},{id:1,value:'OUTPUT'}])+
			    "</select>" +
				"</td></tr>"+											
		"</table>");
			
		return this;
	}
});

var SymbolPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  SymbolPanelBuilder.__super__.initialize(component);
      this.id="symbolpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',   
        'keypress #unitid' : 'onenter',	
        'keypress #referenceid' : 'onenter',
        'change #reference-alignmentid': 'onchange',
        'change #unit-alignmentid': 'onchange',
    },
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='nameid'){
			 this.target.displayName=j$("#nameid").val(); 
			 this.component.getModel().fireUnitEvent({target:this.target,type:events.Event.RENAME_UNIT});		   
		 }
		 if(event.target.id=='referenceid'){
		   var texture=this.target.reference;
		   texture.setText(j$("#referenceid").val());
		 }
		 if(event.target.id=='unitid'){
		   var texture=this.target.unit;
		   texture.setText(j$("#unitid").val());
		 }
		 this.component.repaint();   
	},   
	onchange:function(event){
        if(event.target.id=='reference-alignmentid'){
        	this.target.getTextureByTag("reference").setAlignment(parseInt(j$("#reference-alignmentid").val()));        	
        }
        if(event.target.id=='unit-alignmentid'){
        	this.target.getTextureByTag("unit").setAlignment(parseInt(j$("#unit-alignmentid").val()));        	
        }        
        this.component.repaint(); 
	},	
	updateui:function(){
		   j$("#nameid").val(this.target.displayName);
		   j$("#referenceid").val(this.target.getTextureByTag("reference").shape.text);
		   j$("#unitid").val(this.target.getTextureByTag("unit").shape.text);
		   j$('#reference-alignmentid').val(this.target.getTextureByTag("reference").getAlignment());
		   j$('#unit-alignmentid').val(this.target.getTextureByTag("unit").getAlignment());
	},
	render:function(){	
		j$(this.el).empty();
		j$(this.el).append(
		"<table width='100%'>"+
		"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+
		"<tr><td style='width:50%;padding:7px'>Reference</td><td><input type='text' id='referenceid' value='' class='form-control input-sm\'></td></tr>"+
		"<tr><td style='width:50%;padding:7px'>Text Alignment</td><td>" +
		"<select class=\"form-control input-sm\" id=\"reference-alignmentid\">"+
		this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
	    "</select>" +
		"</td></tr>"+											
		
		"<tr><td style='width:50%;padding:7px'>Value</td><td><input type='text' id='unitid' value='' class='form-control input-sm\'></td></tr>"+							
		"<tr><td style='width:50%;padding:7px'>Text Alignment</td><td>" +
		"<select class=\"form-control input-sm\" id=\"unit-alignmentid\">"+
		this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
	    "</select>" +
		"</td></tr>"+											

		"</table>");
			
		return this;
	}
});

var CircuitPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  CircuitPanelBuilder.__super__.initialize(component);
      this.id="circuitpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',
        'keypress #widthid':'onenter',
        'keypress #heightid':'onenter',
        //'keypress #originxid':'onenter',
        //'keypress #originyid':'onenter',
    },
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='widthid'||event.target.id=='heightid'){           
		    this.component.getModel().getUnit().setSize(core.MM_TO_COORD(parseFloat(j$('#widthid').val())),core.MM_TO_COORD(parseFloat(j$('#heightid').val())));  
		    this.component.componentResized();     
		    this.component.repaint();
		 }
		 if(event.target.id=='nameid'){			 
			 this.target.unitName=j$("#nameid").val(); 
			 this.component.getModel().fireUnitEvent({target:this.target,type:events.Event.RENAME_UNIT});
		 }
//		 if(event.target.id=='originxid'||event.target.id=='originyid'){           
//			    this.component.getModel().getUnit().getCoordinateSystem().reset(core.MM_TO_COORD(parseFloat(j$('#originxid').val())),core.MM_TO_COORD(parseFloat(j$('#originyid').val())));  
//			    this.component.componentResized();     
//			    this.component.repaint();
//		 }
		 //mycanvas.focus();
	},
	updateui:function(){
	   j$("#nameid").val(this.target.unitName);
	   j$("#widthid").val(this.target.width);    
	   j$("#heightid").val(this.target.height);	 
//	   if(this.component.getModel().getUnit().coordinateSystem!=null){
//		     j$("#originxid").val(utilities.roundFloat(this.component.getModel().getUnit().getCoordinateSystem().getX(),1));    
//		     j$("#originyid").val(utilities.roundFloat(this.component.getModel().getUnit().getCoordinateSystem().getY(),1));
//	   }	   
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+					
				"<tr><td style='padding:7px'>Width</td><td><input type='text' id='widthid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Height</td><td><input type='text' id='heightid' value='' class='form-control input-sm\'></td></tr>"+							
				//"<tr><td style='width:50%;padding:7px'>Origin X</td><td><input type='text' id='originxid' value='' class='form-control input-sm\'></td></tr>"+
				//"<tr><td style='width:50%;padding:7px'>Origin Y</td><td><input type='text' id='originyid' value='' class='form-control input-sm\'></td></tr>"+

		"</table>");
			
		return this;
	}
});

var CircuitsTree=Backbone.View.extend({	
	initialize:function(opt){		
	    //creat tree
		this.name=opt.name;
		this.circuitComponent=opt.circuitComponent;		
		this.$tree=j$('#'+opt.name);
		//bind select element
		this.$tree.on('select',j$.proxy(this.valuechanged,this));
	    
	    mywebpcb.bind('shape:inspector',this.onshapeevent,this);
		mywebpcb.bind('unit:inspector',this.onunitevent,this);
		mywebpcb.bind('container:inspector',this.oncontainerevent,this);
	},
	addUnit:function(unit){
		var treeItems = this.$tree.jqxTree('getItems');
		var firstItem = treeItems[0];
		var firstItemElement = firstItem.element;
		this.$tree.jqxTree('addTo', { label: unit.unitName,id:unit.getUUID(),value:111}, firstItemElement);	
		this.$tree.jqxTree('expandItem', firstItemElement);
	    //bypass select event
		this.$tree.off('select',j$.proxy(this.valuechanged,this));
		this.$tree.jqxTree('selectItem',  j$("#"+unit.getUUID())[0]);
		this.$tree.on('select',j$.proxy(this.valuechanged,this));
	},
	valuechanged:function(event){
		var id=event.args.element.id;
        var item = this.$tree.jqxTree('getItem', event.args.element);
        
		if(id=="root"){
			mywebpcb.trigger('tree:select',{target:null,type:events.Event.SELECT_CONTAINER}); 
		}

		if(item.value==111){
		   //unit	
			this.circuitComponent.getModel().getUnit().setScrollPositionValue(this.circuitComponent.viewportWindow.x,this.circuitComponent.viewportWindow.y);
			
			this.circuitComponent.getModel().setActiveUnitUUID(item.id);
			this.circuitComponent.getModel().getUnit().setSelected(false);
			this.circuitComponent.componentResized();
			
			this.circuitComponent.hbar.jqxScrollBar({ value:this.circuitComponent.getModel().getUnit().scrollPositionXValue});
			this.circuitComponent.vbar.jqxScrollBar({ value:this.circuitComponent.getModel().getUnit().scrollPositionYValue});
			
			this.circuitComponent.repaint();
			mywebpcb.trigger('tree:select',{target:this.circuitComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 
		}
		if(item.value==222){
			//is this the same shape of the current unit
			if(this.circuitComponent.getModel().getUnit().getUUID()!=item.parentId){
		 		   this.$tree.off('select',j$.proxy(this.valuechanged,this));
		 		   this.$tree.jqxTree('selectItem',  j$("#"+item.parentId)[0]);
		 		   this.circuitComponent.getModel().setActiveUnitUUID(item.parentId);
		 		   this.$tree.on('select',j$.proxy(this.valuechanged,this));
			}
			   //shape
			var shape=this.circuitComponent.getModel().getUnit().getShape(item.id);
			this.circuitComponent.getModel().getUnit().setSelected(false);
			shape.setSelected(true);			
			this.circuitComponent.repaint();
			            
	        //position on shape center
            var rect=shape.getBoundingShape();            
            this.circuitComponent.setScrollPosition(rect.center.x,rect.center.y);
             		  
			mywebpcb.trigger('tree:select',{target:shape,type:events.Event.SELECT_SHAPE}); 	
		}
	
	},
	oncontainerevent:function(event){
	      switch (event.type) {
	      case events.Event.SELECT_CONTAINER:

	         break;
	      case events.Event.RENAME_CONTAINER:
	    	  var element=j$('#root')[0];
	    	  this.$tree.jqxTree('updateItem', { label: this.circuitComponent.getModel().formatedFileName},element);
	    	  this.$tree.jqxTree('render');
	         break; 
	      case events.Event.DELETE_CONTAINER:

	         break; 
	     }   	
	},
    onunitevent:function(event){
 	   if(event.type==events.Event.ADD_UNIT){
 		   //add unit to tree
 		   this.addUnit(event.target);
 	   }
 	   if(event.type==events.Event.SELECT_UNIT){
 		   //select unit
 		   this.$tree.off('select',j$.proxy(this.valuechanged,this));
 		   this.$tree.jqxTree('selectItem',  j$("#"+event.target.getUUID())[0]);
 		   this.$tree.on('select',j$.proxy(this.valuechanged,this));
 	   }
 	   if(event.type==events.Event.DELETE_UNIT){
	 		    this.$tree.jqxTree('removeItem', j$("#"+event.target.getUUID())[0], false);
	            // update the tree.
		 		this.$tree.jqxTree('render');
 	   } 
 	   if(event.type==events.Event.RENAME_UNIT){
           var selectedItem = this.$tree.jqxTree('selectedItem');
           if (selectedItem != null) {
        	   this.$tree.jqxTree('updateItem', { label: event.target.unitName}, selectedItem.element);
        	   this.$tree.jqxTree('render');
           }  
 	   }
 	   
    },
	onshapeevent:function(event){
	 	if(event.type==events.Event.ADD_SHAPE){
	 		   //add shape to tree
	 		var element=j$("li #"+event.target.owningUnit.getUUID())[0];	 
	 		this.$tree.jqxTree('addTo', { label:event.target.displayName,id:event.target.getUUID(),value:222 }, element, false);
	 		this.$tree.jqxTree('render');
	 	}
	 	if(event.type==events.Event.SELECT_SHAPE){
	 		this.$tree.off('select',j$.proxy(this.valuechanged,this));
	 		this.$tree.jqxTree('selectItem',  j$("#"+event.target.getUUID())[0]);	 		
	 		this.$tree.jqxTree('render');
	 		this.$tree.jqxTree('expandItem', j$("#"+event.target.getUUID())[0]);
	 		this.$tree.jqxTree('ensureVisible',  j$("#"+event.target.getUUID())[0]);
	 		this.$tree.on('select',j$.proxy(this.valuechanged,this));
	 	}
	 	if(event.type==events.Event.DELETE_SHAPE){
	 		this.$tree.jqxTree('removeItem', j$("#"+event.target.getUUID())[0], false);
  		   //select unit
	 		this.$tree.off('select',j$.proxy(this.valuechanged,this));
	 		this.$tree.jqxTree('selectItem',  j$("#"+event.target.owningUnit.getUUID())[0]);
	 		this.$tree.on('select',j$.proxy(this.valuechanged,this));
            // update the tree.
	 		this.$tree.jqxTree('render');
	 	}
	 	
	},
	update:function(){
		
	},
	render:function(){
	  //tree is already shown	
	}
});

var CircuitsInspector=Backbone.View.extend({	
	initialize:function(opt){
		this.circuitComponent=opt.circuitComponent;
		this.collection=new Backbone.Collection([
		                                         new CircuitPanelBuilder(this.circuitComponent),
		                                         new LabelPanelBuilder(this.circuitComponent),
		                                         new SymbolPanelBuilder(this.circuitComponent),
		                                         new ComponentPanelBuilder(this.circuitComponent),
		                                         new BusPinPanelBuilder(this.circuitComponent),
		                                         new NetLabelPanelBuilder(this.circuitComponent),
		                                         new ConnectorPanelBuilder(this.circuitComponent),
		                                         ]);
		this.el= '#circuitsinspectorid';	
		//select container
		this.panel=this.collection.get('componentpanelbuilder');
		this.panel.attributes.delegateEvents();
		this.panel.attributes.setTarget(this.circuitComponent);
		//this.oncontainerevent({target:this.circuitComponent,type:mywebpads.container.Event.SELECT_CONTAINER});
		
		mywebpcb.bind('shape:inspector',this.onshapeevent,this);
		mywebpcb.bind('unit:inspector',this.onunitevent,this);
		mywebpcb.bind('container:inspector',this.oncontainerevent,this);
		
		mywebpcb.bind('tree:select',this.ontreeevent,this);
    },
    ontreeevent:function(event){
    	if(event.type==events.Event.SELECT_CONTAINER){
              this.oncontainerevent(event);
    	}
    	if(event.type==events.Event.SELECT_UNIT){
    		  this.onunitevent(event);
    	}
    	if(event.type==events.Event.SELECT_SHAPE){
    		  this.onshapeevent(event);
    	}
    },
    oncontainerevent:function(event){
    	if(event.type==events.Event.SELECT_CONTAINER){
	 		   //select unit
	 		  if(this.panel.id!='componentpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('componentpanelbuilder');
	 			this.panel.attributes.delegateEvents();
	 			this.panel.attributes.setTarget(this.circuitComponent);
	 			this.render(); 
	 		  }
 	    } 
    	this.panel.attributes.updateui();
    },
    onunitevent:function(event){	
	 	   if(event.type==events.Event.ADD_UNIT){
	 		   //add unit to tree
		 		  if(this.panel.id!='circuitpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('circuitpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.render(); 
			 	  }
	 	   }
	 	  if(event.type==events.Event.PROPERTY_CHANGE){
	 		  
	 	  }
	 	  if(event.type==events.Event.SELECT_UNIT){
	 		   //select unit
	 		  if(this.panel.id!='circuitpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('circuitpanelbuilder');
	 			this.panel.attributes.delegateEvents();
	 			this.render(); 
	 		  }
	 	   }
	 	   if(event.type==events.Event.DELETE_UNIT){
		 		  if(this.panel.id!='componentpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('componentpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.panel.attributes.setTarget(this.circuitComponent);
			 			this.render(); 
			 			this.panel.attributes.updateui();
			 		  }
		 		 return;
	 	   } 	
			//update panel ui values
		   this.panel.attributes.setTarget(event.target);
		   this.panel.attributes.updateui();
    },
	onshapeevent:function(event){
		switch(event.type){
		case events.Event.PROPERTY_CHANGE:
		case events.Event.SELECT_SHAPE:
		if(event.target instanceof SCHSymbol){
			if(this.panel.id!='symbolpanelbuilder'){
					this.panel.attributes.remove();
					this.panel=this.collection.get('symbolpanelbuilder');
					this.panel.attributes.delegateEvents();
					this.render();
		    }
		}			
		if(event.target instanceof SCHFontLabel){
			if(this.panel.id!='labelpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('labelpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof SCHJunction || event.target instanceof SCHNoConnector){			
			if(this.panel.id!='circuitpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('circuitpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.panel.attributes.setTarget(event.target.owningUnit);
				this.render();
				this.panel.attributes.updateui();
		    }
			return;
		}
		if(event.target instanceof SCHWire){
			if(this.panel.id!='circuitpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('circuitpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.panel.attributes.setTarget(event.target.owningUnit);
				this.render();
				this.panel.attributes.updateui();
		    }
			return;
		}		
		if(event.target instanceof SCHConnector){
			if(this.panel.id!='connectorpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('connectorpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}		
		
		if((event.target instanceof SCHBusPin)){
			if(this.panel.id!='buspinpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('buspinpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}
		}	
		if((event.target instanceof SCHNetLabel)){
			if(this.panel.id!='netlabelpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('netlabelpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}
		}
//		if(event.target instanceof PCBSolidRegion){
//			if(this.panel.id!='solidregionpanelbuilder'){
//				this.panel.attributes.remove();
//				this.panel=this.collection.get('solidregionpanelbuilder');
//				this.panel.attributes.delegateEvents();
//				this.render();
//			}				
//		}
//		if((event.target instanceof PCBTrack)){
//			if(this.panel.id!='trackpanelbuilder'){
//				this.panel.attributes.remove();
//				this.panel=this.collection.get('trackpanelbuilder');
//				this.panel.attributes.delegateEvents();
//				this.render();
//			}
//		}		
//		if(event.target instanceof PCBArc){
//			if(this.panel.id!='arcpanelbuilder'){
//				this.panel.attributes.remove();
//				this.panel=this.collection.get('arcpanelbuilder');
//				this.panel.attributes.delegateEvents();
//				this.render();
//			}	
//		}
		//update panel ui values
		this.panel.attributes.setTarget(event.target);
		this.panel.attributes.updateui();
		break;
		case events.Event.DELETE_SHAPE:
			//select unit
//	 		  if(this.panel.id!='footprintpanelbuilder'){	
//	 			this.panel.attributes.remove();
//	 			this.panel=this.collection.get('footprintpanelbuilder');
//	 			this.panel.attributes.delegateEvents();
//	 			this.render(); 
//	 			this.panel.attributes.setTarget(event.target.owningUnit);
//	 			this.panel.attributes.updateui();
//	 		  }			
		break;	
	   }

	},
	update:function(event){
		
	},
	render:function(){
	  j$(this.el).empty();
	  j$(this.el).append(this.panel.attributes.render().el);
	}
});

/**
 * Represents Tree View and Properties Inspector
 */
var CircuitsPanelView=Backbone.View.extend({
	initialize:function(opt){
       this.footprintstree=new CircuitsTree(opt);
       this.footprintinspector=new CircuitsInspector(opt);
	},
	update:function(){
		
	},
	render:function(){
		 this.footprintstree.render();
		 this.footprintinspector.render();
	},
	
});

module.exports ={
		   CircuitsPanelView	   
	}
});

;require.register("circuit/views/togglebuttonview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var SymbolLoadView=require('symbols/views/symbolloadview');
var Circuit=require('circuit/d/circuitcomponent').Circuit;
var CircuitMgr = require('circuit/d/circuitcomponent').CircuitMgr;
var CircuitContainer = require('circuit/d/circuitcomponent').CircuitContainer;
var UnitMgr = require('core/unit').UnitMgr;
var CircuitLoadView=require('circuit/views/circuitloadview');
var CircuitSaveView=require('circuit/views/circuitsaveview');



var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.circuitComponent=opt.circuitComponent;
		mywebpcb.bind('libraryview:load',this.onsymbolload,this);
		mywebpcb.bind('workspaceview:load',this.oncircuitload,this);
		this.bind();
		this.update();
	},
	bind:function(){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
			    j$("#"+model.id).bind( "click",{model:model},j$.proxy(this.onclick,this));
			}),this);	
	},
	update:function(){
		_.each(this.collection.models,function(model,index,list) {
              model.update();
			});
	
	},
	togglegroup:function(group){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
			if(model.attributes.group===group){
				model.attributes.active=false;
		    }
		}),this);		
	},

	onclick:function(event){
	    event.preventDefault();
	    
	    //is this a group button
	    if(event.data.model.attributes.active&&event.data.model.attributes.group!=''){
	    	return;
	    }
	    if(event.data.model.attributes.group!=''){
	    	//toggle group
	    	this.togglegroup(event.data.model.attributes.group);
		    event.data.model.attributes.active=!event.data.model.attributes.active;
	    }
		this.update();
		if(event.data.model.id=='importfromclipboardid'){	
			navigator.clipboard.readText().then(data =>{ 				 
			      let circuitContainer=new CircuitContainer(true);
			      let xml=(j$.parseXML(data));		    	  
			      //disable 
			      core.isEventEnabled=false;
			      circuitContainer.parse(xml);
			      core.isEventEnabled=true;
			  	  mywebpcb.trigger('workspaceview:load',circuitContainer);
				});	
		}
		if(event.data.model.id=='exporttoclipboardid'){	
			navigator.clipboard.writeText(this.circuitComponent.getModel().format());
		}		
		if(event.data.model.id=='addunitid'){			
			var circuit=new Circuit(1200,800);
			circuit.unitName="Unknown";
			this.circuitComponent.getModel().add(circuit);
            this.circuitComponent.getModel().setActiveUnitUUID(circuit.getUUID());
            this.circuitComponent.componentResized(); 
            this.circuitComponent.repaint();
            this.circuitComponent.getModel().fireUnitEvent({target:this.circuitComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
		}
		if(event.data.model.id=='saveid'){
			new CircuitSaveView({model:this.circuitComponent.model}).render();			
		}

		if(event.data.model.id=='loadid'){
			 new CircuitLoadView({circuitComponent:this.circuitComponent}).render();			
		}
		//set mode
		if(event.data.model.id=='rectid'){
		    this.circuitComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='buspinid'){
		    this.circuitComponent.setMode(core.ModeEnum.BUSPIN_MODE);
		}
		if(event.data.model.id=='junctionid'){
			this.circuitComponent.setMode(core.ModeEnum.JUNCTION_MODE);
		}		
		if(event.data.model.id=='connectorid'){
		   this.circuitComponent.setMode(core.ModeEnum.CONNECTOR_MODE);
		}
		if(event.data.model.id=='noconnectorid'){
		   this.circuitComponent.setMode(core.ModeEnum.NOCONNECTOR_MODE);
		}
		if(event.data.model.id=='netlabelid'){
			  this.circuitComponent.setMode(core.ModeEnum.NETLABEL_MODE);
		}		
//		if(event.data.model.id=='anchorid'){
//			event.data.model.setActive(!event.data.model.isActive());  
//			this.circuitComponent.setParameter("snaptogrid",event.data.model.isActive());
//		}		
		if(event.data.model.id=='rectid'){
			this.circuitComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='wireid'){
			this.circuitComponent.setMode(core.ModeEnum.WIRE_MODE);
		}
		if(event.data.model.id=='busid'){
			this.circuitComponent.setMode(core.ModeEnum.BUS_MODE);
		}
		if(event.data.model.id=='labelid'){
			this.circuitComponent.setMode(core.ModeEnum.LABEL_MODE);
		}	
		if(event.data.model.id=='selectionid'){
		  //Board mode
		   this.circuitComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		}
		if(event.data.model.id=='loadsymbolid'){
			 new SymbolLoadView({enabled:true}).render();			
		}
		
		if(event.data.model.id=='originid'){			 
			event.data.model.setActive(!event.data.model.isActive());
			if(event.data.model.isActive()){
			  this.circuitComponent.getModel().getUnit().coordinateSystem=new shape.CoordinateSystem(this.circuitComponent.getModel().getUnit());
			  this.circuitComponent.getModel().getUnit().coordinateSystem.selectionRectWidth=4;
			  this.circuitComponent.setMode(core.ModeEnum.ORIGIN_SHIFT_MODE);
			}else{
			  this.circuitComponent.getModel().getUnit().coordinateSystem=null;
			  this.circuitComponent.setMode(core.ModeEnum.COMPONENT_MODE);
			}
		}
		if((event.data.model.id=='rotateleftid')||(event.data.model.id=='rotaterightid')){
            shapes= this.circuitComponent.getModel().getUnit().shapes;
            if(shapes.length==0){
               return; 
            }  
			//shapes= this.circuitComponent.getModel().getUnit().getSelectedShapes();
			var r=this.circuitComponent.getModel().getUnit().getShapesRect(shapes);
               
            UnitMgr.getInstance().rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(event.data.model.id==("rotateleftid")?1:-1)*(90.0)));
            UnitMgr.getInstance().alignBlock(this.circuitComponent.getModel().getUnit().grid,shapes);  
            
            this.circuitComponent.repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.circuitComponent.ZoomIn(parseInt(this.circuitComponent.width/2),parseInt(this.circuitComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.circuitComponent.ZoomOut(parseInt(this.circuitComponent.width/2),parseInt(this.circuitComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.circuitComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			
            this.circuitComponent.setScrollPosition(parseInt(this.circuitComponent.getModel().getUnit().width/2),
            		parseInt(this.circuitComponent.getModel().getUnit().height/2));
		}		
	},
	onsymbolload:function(selectedModel){
		  let scaledEvent=this.circuitComponent.getScaledEvent(selectedModel.event);
		//****load it    	
		  this.circuitComponent.setMode(core.ModeEnum.SYMBOL_MODE);		
		  var schsymbol=CircuitMgr.getInstance().createSCHSymbol(selectedModel.getUnit());
		  
          //            //***set chip cursor
		  schsymbol.move(-1 * schsymbol.getBoundingShape().center.x,
                         -1 * schsymbol.getBoundingShape().center.y);
          
          
		  this.circuitComponent.setContainerCursor(schsymbol);
          this.circuitComponent.getEventMgr().setEventHandle("cursor", schsymbol);
          
          this.circuitComponent.mouseMove(selectedModel.event);
          //this.circuitComponent.Repaint();
	},
	oncircuitload:function(selectedModel){
		  this.circuitComponent.clear();
		  this.circuitComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  for(let unit of selectedModel.getUnits()){
			  core.isEventEnabled=false;
			  var copy=unit.clone();	
			  core.isEventEnabled=true;
			  this.circuitComponent.getModel().add(copy);  
			  copy.notifyListeners(events.Event.ADD_SHAPE);
		  };
		  
		  this.circuitComponent.getModel().setActiveUnit(0);
		  this.circuitComponent.getModel().formatedFileName=selectedModel.formatedFileName;
		  this.circuitComponent.getModel().libraryname=selectedModel.libraryname;
		  this.circuitComponent.getModel().categoryname=selectedModel.categoryname;
		  
		  this.circuitComponent.componentResized();

	        //position on center
          var rect=this.circuitComponent.getModel().getUnit().getBoundingRect();
          this.circuitComponent.setScrollPosition(rect.center.x,rect.center.y);
          this.circuitComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.circuitComponent.getModel().fireUnitEvent({target:this.circuitComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.circuitComponent.repaint();
		  //set button group
		  this.circuitComponent.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);

		  
	},
    setButtonGroup:function(requestedMode) {
         if (requestedMode == core.ModeEnum.COMPONENT_MODE) {
        	 //find selection button and pressed
        	 var model=this.collection.get('selectionid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();
         }
         if(requestedMode==core.ModeEnum.WIRE_MODE){
        	 var model=this.collection.get('wireid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();          
         }
         if(requestedMode==core.ModeEnum.BUS_MODE){
        	 var model=this.collection.get('busid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();          
         }

}
});

module.exports =ToggleButtonView

});

;require.register("core/core.js", function(exports, require, module) {
var d2=require('d2/d2');

var mywebpcb = mywebpcb || {};

var SELECT_RECT_WIDTH = 3000; 
 
var  UUID=(function(){
	 var count=0;
	 return function(){
		 return ++count;
	 }
})();

GridRaster=[{id:2.54,value:2.54},{id:1.27,value:1.27},{id:0.635,value:0.635},{id:0.508,value:0.508},{id:0.254,value:0.254},{id:0.127,value:0.127},{id:0.0635,value:0.0635},{id:0.0508,value:0.0508},{id:0.0254,value:0.0254},{id:0.0127,value:0.0127},{id:5.0,value:5.0},{id:2.5,value:2.5},{id:1.0,value:1.0},{id:0.5,value:0.5},{id:0.25,value:0.25},{id:0.8,value:0.8},{id:0.2,value:0.2},{id:0.1,value:0.1},{id:0.05,value:0.05},{id:0.025,value:0.025},{id:0.01,value:0.01}];
ResumeState={
		 ADD_AT_FRONT:0,
		 ADD_AT_END:1		
};
Fill = {
		EMPTY : 1,
		FILLED : 2,
		GRADIENT : 3,
		toString : {
			1 : {
				name : "EMPTY"
			},
			2 : {
				name : "FILLED"
			},
			3 : {
				name : "GRADIENT"
			}
		},
};

var Units=(function(){
	return {
        MM:0,
        INCH:1,
        PIXEL:2		
	}
})();
SymbolType={
		SYMBOL:0,
		GROUND:1,
		POWER:2,
		valueOf:function(v){
		   switch(v){
		   case 0:return "SYMBOL";
		   case 1:return "GROUND";
		   case 2:return "POWER";
		   }	
		},
		parse:function(v){
			switch(v){
			   case "SYMBOL": return 0;
			   case "GROUND":return 1;
			   case "POWER":return 2;		
			}
		}
	 };
var ModeEnum=(function(){
	return{
		   COMPONENT_MODE:0,		   
		   PAD_MODE : 1,
		   RECT_MODE : 2,
		   LINE_MODE : 3,
		   ELLIPSE_MODE : 4,
		   ARC_MODE : 5,
		   LABEL_MODE : 6,
		   DRAGHEAND_MODE:7,
		   ORIGIN_SHIFT_MODE:8,
		   FOOTPRINT_MODE:9,
		   TRACK_MODE:10,
		   MEASUMENT_MODE : 12,
		   COPPERAREA_MODE:13,
		   VIA_MODE:14,
		   HOLE_MODE:15,
		   SOLID_REGION_MODE:16,
		   PIN_MODE:17,
		   ARROW_MODE:18,
		   TRIANGLE_MODE:19,
		   SYMBOL_MODE:20,
		   JUNCTION_MODE:21,
		   WIRE_MODE:22,
		   BUS_MODE:23,
		   BUSPIN_MODE:24,
		   NOCONNECTOR_MODE:25,
		   NETLABEL_MODE:26,
	}
})();

var BOARD_LAYERS=[{id:'FCu',value:'FCu',selected:true},{id:'BCu',value:'BCu'},{id:'BSilkS',value:'BSilkS'},{id:'FSilkS',value:'FSilkS'},{id:'All',value:'All'},{id:'None',value:'None'}];
var PCB_SYMBOL_LAYERS=[{id:'FCu',value:'FCu',selected:true},{id:'BCu',value:'BCu'},{id:'BSilkS',value:'BSilkS'},{id:'FSilkS',value:'FSilkS'}];

var Layer=(function(){
	return{
	    /* Layer identification (layer number) */
	       FIRST_COPPER_LAYER  :    0,
	       LAYER_N_BACK         :   0,
	       LAYER_N_2              : 1,
	       LAYER_N_3             :  2,
	       LAYER_N_4             :  3,
	       LAYER_N_5             :  4,
	       LAYER_N_6             :  5,
	       LAYER_N_7             :  6,
	       LAYER_N_8             :  7,
	       LAYER_N_9              : 8,
	       LAYER_N_10             : 9,
	       LAYER_N_11             : 10,
	       LAYER_N_12            :  11,
	       LAYER_N_13             : 12,
	       LAYER_N_14             : 13,
	       LAYER_N_15             : 14,
	       LAYER_N_FRONT          : 15,
	       LAST_COPPER_LAYER      : 15,
	       NB_COPPER_LAYERS       : (15 + 1),

	      FIRST_NO_COPPER_LAYER  : 16,
	      ADHESIVE_N_BACK        :16,
	      ADHESIVE_N_FRONT       : 17,
	      //SOLDERPASTE_N_BACK      :18,
	      //SOLDERPASTE_N_FRONT     :19,
	      SILKSCREEN_N_BACK       :20,
	      SILKSCREEN_N_FRONT      :21,
	      SOLDERMASK_N_BACK       :22,
	      SOLDERMASK_N_FRONT      :23,
	      DRAW_N                  :24,
	      COMMENT_N               :25,
	      ECO1_N                  :26,
	      ECO2_N                  :27,
	      EDGE_N                  :28,
	      LAST_NO_COPPER_LAYER    :28,
	      UNUSED_LAYER_29         :29,
	      UNUSED_LAYER_30         :30,
	      UNUSED_LAYER_31         :31,
	      NB_LAYERS               :(28 + 1),

	      LAYER_COUNT             :32,

	    // Masks to identify a layer by a bit map
	      LAYER_BACK        :      (1 << 0),     ///< bit mask for copper layer
	      LAYER_2            :     (1 << 1),        ///< bit mask for layer 2
	      LAYER_3            :     (1 << 2),        ///< bit mask for layer 3
	      LAYER_4            :     (1 << 3),        ///< bit mask for layer 4
	      LAYER_5             :    (1 << 4),        ///< bit mask for layer 5
	      LAYER_6             :    (1 << 5),        ///< bit mask for layer 6
	      LAYER_7             :    (1 << 6),        ///< bit mask for layer 7
	      LAYER_8             :    (1 << 7),        ///< bit mask for layer 8
	      LAYER_9             :    (1 << 8),        ///< bit mask for layer 9
	      LAYER_10             :   (1 << 9),       ///< bit mask for layer 10
	      LAYER_11            :   (1 << 10),       ///< bit mask for layer 11
	      LAYER_12            :    (1 << 11),       ///< bit mask for layer 12
	      LAYER_13            :    (1 << 12),       ///< bit mask for layer 13
	      LAYER_14            :    (1 << 13),      ///< bit mask for layer 14
	      LAYER_15            :    (1 << 14),      ///< bit mask for layer 15
	      LAYER_FRONT          :   (1 << 15),    ///< bit mask for component layer
	      ADHESIVE_LAYER_BACK    : (1 << 16),
	      ADHESIVE_LAYER_FRONT   : (1 << 17),
		  SILKSCREEN_LAYER_BACK :  (1 << 20),
	      SILKSCREEN_LAYER_FRONT : (1 << 21),
		  SOLDERMASK_LAYER_BACK  : (1 << 22),
	      SOLDERMASK_LAYER_FRONT : (1 << 23),
	      DRAW_LAYER             : (1 << 25),
	      COMMENT_LAYER          : (1 << 26),
	      ECO1_LAYER             : (1 << 27),
	      ECO2_LAYER             : (1 << 28),
	      EDGE_LAYER             : (1 << 29),
	      
	      LAYER_ALL :0xFFFFFF,
	          
	      BOARD_COLOR_FRONT:'rgb(56,0,0)',
	      BOARD_COLOR_BACK:'rgb(0,0,56)',
	      BOARD_COLOR_ALL:'black',
	    Side:{
		   TOP:1,
           BOTTOM:2,
           change:function(layermaskId){
        	   
               if ( layermaskId== Layer.LAYER_FRONT) {
                   return Layer.Copper.BCu;
               } else if (layermaskId == Layer.SILKSCREEN_LAYER_FRONT) {
                   return Layer.Copper.BSilkS;
               } else if (layermaskId == Layer.SOLDERMASK_LAYER_FRONT) {
                   return Layer.Copper.BMask;
               } else if (layermaskId == Layer.LAYER_BACK) {
                   return Layer.Copper.FCu;
               } else if (layermaskId == Layer.SILKSCREEN_LAYER_BACK) {
                   return Layer.Copper.FSilkS;
               } else if (layermaskId == Layer.SOLDERMASK_LAYER_BACK) {
                   return Layer.Copper.FMask;
               }

               return Layer.Copper.All;        	   
           },
		   resolve:function(layermaskId) {
            if (layermaskId == Layer.LAYER_BACK) {
                return Layer.Side.BOTTOM;
            } else if (layermaskId == Layer.SILKSCREEN_LAYER_BACK) {
                return Layer.Side.BOTTOM;
            } else if (layermaskId == Layer.SOLDERMASK_LAYER_BACK) {
                return Layer.Side.BOTTOM;
            }
            return Layer.Side.TOP;
           }
		},			
		Copper:{
			FCu:{
		          toString:function(){
		              return "F.Cu";
		          },
		          getName:function(){
		              return "FCu";
		          },
		          getLayerMaskID:function(){
		              return Layer.LAYER_FRONT;
		          },
		          getColor:function(){
		              return 'red';
		          },
		          getBoardColor:function(){
		              return Layer.BOARD_COLOR_FRONT;
		          }				
			},
			BCu:{
	            toString:function(){
	                return "B.Cu";
	            },
	            getName:function(){
	                return "BCu";
	            },
	            getLayerMaskID:function(){
	                return Layer.LAYER_BACK;
	            },
	            getColor:function(){
	                return 'green';
	            },
	            getBoardColor:function(){
	                  return Layer.BOARD_COLOR_BACK;
	            },				
			},
			Cu:{
	            toString:function(){
	                return "Cu";
	            },
	            getName:function(){
	                return "Cu";
	            },
	            getLayerMaskID:function(){	                
	                return Layer.LAYER_FRONT | Layer.LAYER_BACK;
	            },
	            getColor:function(){
	            	return 'rgb(128,128,0)';
	            },
	            getBoardColor:function(){
	                  return Layer.BOARD_COLOR_BACK;
	            },				
			},			
	        FSilkS:{
		          toString:function(){
		              return "F.SilkS";
		          },
		          getName:function(){
		              return "FSilkS";
		          },
		          getLayerMaskID:function(){
		              return Layer.SILKSCREEN_LAYER_FRONT;
		          },
		          getColor:function(){
		              return 'cyan';
		          },
		          getBoardColor:function(){
		                return Layer.BOARD_COLOR_FRONT;
		          }
		        },
		    BSilkS:{
		          toString:function(){
		              return "B.SilkS";
		          },
		          getName:function(){
		              return "BSilkS";
		          },
		          getLayerMaskID:function(){
		              return Layer.SILKSCREEN_LAYER_BACK;
		          },
		          getColor:function(){
		              return 'magenta';
		          },
		          getBoardColor:function(){
		                return Layer.BOARD_COLOR_BACK;
		          }
		        }, 			
			All:{
	            toString:function(){
	                return "All";
	            },
	            getName:function(){
	                return "All";
	            },
	            getLayerMaskID:function(){
	                return Layer.LAYER_ALL;
	            },	            
	            getColor:function(){
	                return 'rgb(128,128,0)';
	            },
	            getBoardColor:function(){
	                  return 'black';
	            }
			},
			None:{
	            toString:function(){
	                return "None";
	            },
	            getName:function(){
	                return "None";
	            },
	            getLayerMaskID:function(){
	                return 0;
	            },
	            getColor:function(){
	                return 'gray';
	            },
	            getBoardColor:function(){
	                  return 'black';
	            }				
			},
	        resolve:function(layermask){
	            if(layermask==Layer.LAYER_FRONT){
	                return Layer.Copper.FCu;
	            }
	            if(layermask==Layer.SILKSCREEN_LAYER_FRONT){
	                return Layer.Copper.FSilkS;
	            }
	            if(layermask==Layer.LAYER_BACK){
	                return Layer.Copper.BCu;
	            }
	            if(layermask==Layer.SILKSCREEN_LAYER_BACK){
	                return Layer.Copper.BSilkS;
	            }	            
	            if(layermask==(Layer.LAYER_BACK|Layer.LAYER_FRONT)){
	                return Layer.Copper.Cu;
	            } 
	            if (layermask == Layer.LAYER_ALL) {
	                return Layer.Copper.All;
	            }else{
	                return Layer.Copper.None;
	            }	            	            
	        },
			valueOf:function(copper){
				switch(copper){
				case 'FCu': return this.FCu;
				case 'BCu': return this.BCu;
				case 'Cu': return this.Cu;
				case 'FSilkS':return this.FSilkS;
				case 'BSilkS':return this.BSilkS;
				case 'All': return this.All;
				case 'None': return this.None;
					default:
						throw  'Unknown copper text : '+copper;
				}
			}
		}
	};
})();

var isEventEnabled=true;

class CompositeLayer{
  constructor() {
	     this.compositelayer=Layer.LAYER_ALL;
	     this.activeSide=Layer.Side.TOP;
  }
isLayerVisible(mask) {
	     return (this.compositelayer & mask)!=0;          
  } 
getLayerMaskID() {
    return this.compositelayer;
}
setLayerVisible(mask,flag) {
    if(flag){
        this.compositelayer |= mask;     
    }else{
        this.compositelayer &= ~mask;
    }
}
	  
}

var AffineTransform=(function(){
	var x,y,a;
	return{
		createRotateInstance:function(originx,originy,angle){
			x=originx;
			y=originy;
			a=angle;
			return {
				originx:x,
				originy:y,
				angle:a,
				toString:function(){
				  return "x="+x+",y="+y+"angle="+a;	
				}
			};
		},
	}; 
})();

class ScalableTransformation{
  constructor(scaleFactor,minScaleFactor,maxScaleFactor) {	    
        this.reset(0.5,scaleFactor,minScaleFactor,maxScaleFactor);
  }
  getScaleRatio(){
     return this.scaleRatio;  
   }
   
  getInverseScaleRatio(){
	return 1/this.scaleRatio;
  }
  getScaleFactor(){
     return this.scaleFactor;  
  }
  setScaleFactor(newScaleFactor){
    this.Reset(newScaleFactor,this.minScaleFactor,this.maxScaleFactor); 
  } 
  reset(scaleRatio,scaleFactor,minScaleFactor,maxScaleFactor){
        this.scaleFactor=scaleFactor;
        this.maxScaleFactor=maxScaleFactor;
        this.minScaleFactor=minScaleFactor;
        this.scaleRatio=scaleRatio;
        this.scale=this.calculateTransformation();
  }
  getScale(){
     return this.scale;
  }
  scaleOut(){
        this.scaleFactor --;
        if (this.scaleFactor == this.minScaleFactor-1) {
                this.scaleFactor = this.minScaleFactor;
                return false;
        }
        
        this.scale=this.calculateTransformation();
        return true;
  }
  scaleIn(){
            this.scaleFactor++ ;
            if (this.scaleFactor == this.maxScaleFactor) {
                this.scaleFactor = this.maxScaleFactor-1;
                return false;
            }            
            this.scale=this.calculateTransformation();
            return true;    
  }
  getInversePoint(x,y){
       let s=1.0;
       if(this.scaleFactor!=0){     
           for(let i=0;i<this.scaleFactor;i++){
             s*=this.getInverseScaleRatio();
           }
       }
	  return new d2.Point(x*s,y*s);
}
  getInverseRect(r){
       let s=1.0;
       if(this.scaleFactor!=0){     
           for(let i=0;i<this.scaleFactor;i++){
             s*=this.getInverseScaleRatio();
           }
       }
	  return d2.Box.fromRect(r.x*s,r.y*s,r.width*s,r.height*s);
  }  
  calculateTransformation(){
       let x=1.0;
       if(this.scaleFactor!=0){     
           for(let i=0;i<this.scaleFactor;i++){
             x*=this.scaleRatio;
           }
       }
       return x;
  }
}

class ViewportWindow{
	 constructor(x,y,width,height){
	   this.x=x;
	   this.y=y;
	   this.width=width;
	   this.height=height;
	 }
	 getX(){
	   return this.x;
	 }
	 getY(){
	   return this.y;
	 }
	 getWidth(){
	   return this.width;
	 }
	 getHeight(){
	   return this.height;
	 }
	 setSize(width,height){
	     this.width=width;
	     this.height=height;	 
	 }
	 scaleIn( xx, yy,scale){ 
	    let a=(this.x+xx)*scale.getScaleRatio();
		let b=(this.y+yy)*scale.getScaleRatio();
	    this.x=a-xx;
	    this.y=b-yy;
	 }
	 scaleOut( xx, yy,scale){ 	    
        let a=(this.x+xx)*scale.getInverseScaleRatio();
        let b=(this.y+yy)*scale.getInverseScaleRatio();
        this.x=a-xx;
        this.y=b-yy;
	 }
	 toString(){
	   return "{"+this.x+","+this.y+","+this.width+","+this.height+"}";
	 }
}

    //must be 10000 for printing
var MM_TO_COORD=function(mm){
      return Math.floor(mm*10000);
}
 
var COORD_TO_MM=function(coord){ 
	return (coord/10000);    
}
   
class Grid{
 constructor(value,units) {
   this.gridPointToPoint=0;
   this.pixelToPixelLimit=10;
   this.paintable=true;
   this.pointsColor='white';
   this.setGridUnits(value,units);
 }
 clone(){
	var copy=new Grid(this.value,this.units);
	copy.pointsColor=this.pointsColor;
	return copy;
 }
getGridPointToPoint(){
     return this.gridPointToPoint;
}
getGridUnits(){
    return this.units;
}
setGridUnits(value,units){
     this.value=value;
     this.units=units;
     switch(units){
     case Units.MM:
         this.gridPointToPoint=MM_TO_COORD(value);
         break;
     case Units.INCH:
         throw  "BG is in EU -> stick to mm for now.";
     case Units.PIXEL:
         this.gridPointToPoint=value;        
     }          
}
setGridValue(value){
     this.setGridUnits(value,this.units);
}
getGridValue(){
    return this.value; 
} 
UNIT_TO_COORD(mm){
    switch(this.units){ 
      case Units.MM:
          return MM_TO_COORD(mm);
      case Units.INCH:
          throw  "BG is in EU -> stick to mm for now.";
      case Units.PIXEL:
          return mm;
    default:
        throw "Unknown/unsupported units.";
    }            
}
COORD_TO_UNIT(coord){
    switch(this.units){ 
      case Units.MM:
          return COORD_TO_MM(coord);
      case Units.INCH:
          throw  "BG is in EU -> stick to mm for now.";
      case Units.PIXEL:
          return coord;
    default:
        throw  "Unknown/unsupported units.";
    }            
  }
paint(g2,viewportWindow,scalableTransformation){
	if(this.paintable){
	 this.drawPoints(g2, viewportWindow, scalableTransformation);
    }
 }
 drawPoints(g2, viewportWindow, scalableTransformation){
   var w = 0, h = 0;
 
        //scale out the visible static rectangle to the real schema size to see which point fall in to be rendered.
        //scale back to origine
    let r=d2.Box.fromRect(parseInt(viewportWindow.x/scalableTransformation.getScale()),parseInt(viewportWindow.y/scalableTransformation.getScale()),parseInt(viewportWindow.getWidth()/scalableTransformation.getScale()),parseInt(viewportWindow.getHeight()/scalableTransformation.getScale()));

    
    let position=this.positionOnGrid(r.x,r.y);
	
	if(!this.isGridDrawable(position,scalableTransformation)){        		  
		return;
    }
		
	let point=new d2.Point();  
	g2.strokeStyle = this.pointsColor;				 
    g2.lineWidth = 1;
     
	for (let h =position.y; h <= position.y+r.height; h += this.gridPointToPoint) {
            for (w =position.x; w <=position.x+r.width; w += this.gridPointToPoint) {
                 point.set(w, h); 
                 //let scaledPoint=point.clone();
                 point.scale(scalableTransformation.scale);
                	 
                 point.set(point.x-viewportWindow.x,point.y-viewportWindow.y);
                 //***no need to draw outside of visible rectangle
                 //if(point.x>viewportWindow.getWidth()||point.y>viewportWindow.getHeight()){                   
                 //  continue;  
                 //}   
                
				 
             	g2.beginPath();
            	g2.arc(point.x,point.y,0.1, 0, 2 * Math.PI, false);
			    g2.stroke();
				 
            }
	}
   
 }
isGridDrawable(point,scalableTransformation){
        let x=point.x*scalableTransformation.scale;    
	    let xx=(point.x+this.gridPointToPoint)*scalableTransformation.scale;
	    return  (parseInt(Math.round(xx-x)))>this.pixelToPixelLimit;   
    }
positionOnGrid( x,  y) {        
        let ftmp     =  x / this.gridPointToPoint;
        let xx = ( parseInt( Math.round( ftmp )) ) * this.gridPointToPoint;

        ftmp     = y / this.gridPointToPoint;
        let yy = ( parseInt( Math.round( ftmp )) ) * this.gridPointToPoint;
        return new d2.Point(xx,yy);        
    } 
lengthOnGrid(length){
        let  ftmp     =  length / this.gridPointToPoint;
        let xx = ( parseInt(Math.round( ftmp ) )) * this.gridPointToPoint;        
        return xx;	
}
snapToGrid(p){        
   p.set(this.lengthOnGrid(p.x), this.lengthOnGrid(p.y));
} 
}
 
class UnitFrame{
constructor(width,height) {
	      this.rectangle=new d2.Box(0,0,0,0);
	      this.offset=0;
	      this.setSize(width,height); 
	      this.color="white";
}
setSize(width,height) {
    this.width=width;
    this.height=height;
    this.rectangle.setRect(this.offset,this.offset,this.width-(2*this.offset),this.height-(2*this.offset));
 }	  
 
paint(g2, viewportWindow, scale) {
	  var rect=this.rectangle.clone();	  
	  rect.scale(scale.scale);
	  
      if(!rect.intersects(viewportWindow)){
      	  return;   
      }
      g2.beginPath();
      g2.lineWidth="1";
      g2.strokeStyle = this.color;
      g2.rect(rect.x-viewportWindow.x, rect.y-viewportWindow.y, rect.width, rect.height);      
      g2.stroke(); 
}
setOffset(offset) {
    this.offset=offset;
    this.rectangle.setRect(this.offset,this.offset,this.width-(2*this.offset),this.height-(2*this.offset));
 }
getOffset(){
   return this.offset;    
 }	  
}

//-----------------------Queue--------------------
class Queue {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return (this.items.length === 0);
    }

    enqueue(item) {
        this.items.unshift(item);
    }

    dequeue() {
        return this.items.pop();
    }

    size() {
        return this.items.length;
    }
}
//-----------------------UnitSelectionCell---------
var UnitSelectionCell = function (uuid,x, y,width,height,name) {
	 return {
	       x: x-20,
	       y: y-20,
	       width:width+(2*20),
	       height:height+(2*20),
	       name:name,
	       selected:false,
	       uuid:uuid
	 };
}

//------------------------UnitSelectionGrid--------
var UnitSelectionGrid = Backbone.Model.extend({
	initialize: function(){
    this.model=null;
    this.cells=[];
    this.scaleFactor=10;
    this.scaleRatio=0.5;    
    this.minScaleFactor=4;
    this.maxScaleFactor=13;
  },
setModel:function(model){
		this.model=model;
	},
getModel:function(model){
		return	this.model;
},
release:function(){
	this.cells=[];
	if(this.model!=null){
	   this.model.clear();
	}   
	this.model=null;
},

build:function(){
	 var width=300;
	 for(let unit of this.model.getUnits()){
	     //hide grid
		 unit.getGrid().paintable=false;
		 //hide frame
		 unit.frame=null;
		 //make it smaller
		 //unit.scalableTransformation=new ScalableTransformation(this.scaleFactor,4,13);
	     unit.scalableTransformation.reset(this.scaleRatio,this.scaleFactor,this.minScaleFactor,this.maxScaleFactor);
		 var w=Math.round(unit.getBoundingRect().width*unit.scalableTransformation.getScale());
		 width=Math.max(width,w);
       
	  }
	 for(let unit of this.model.getUnits()){     
		 var r=unit.getBoundingRect();
		 var x=Math.round(r.x*unit.scalableTransformation.getScale());
		 var y=Math.round(r.y*unit.scalableTransformation.getScale());
         var height=Math.round(r.height*unit.getScalableTransformation().getScale());
         var cell=UnitSelectionCell(unit.getUUID(),x,y,width,height,unit.unitName);
         cell.selected=( this.model.getUnit()==unit?true:false);
         this.cells.push(cell);        
	  }
	 
}

});

//------------------------UnitSelectionPanel-------
var UnitSelectionPanel=Backbone.View.extend({
	//el:"#unitselectionpanel",
	initialize: function(opt){		
	this.setElement('#'+opt.selectorid);
	this.unitSelectionGrid=new UnitSelectionGrid();
	this.canvasprefixid=opt.canvasprefixid;
    this.enabled=opt.enabled;
    this.textColor='white';
    this.backColor='black';
  },
  events: {
	  'click [type="checkbox"]': 'checkBoxClick',
	  'click' : 'panelClick',
  },
  panelClick:function(event){
	  if(event.originalEvent.target.id==""){
		  return;
	  }
      let uuid=(j$('#'+event.originalEvent.target.id).data('uuid'));
      if(this.enabled){
		  this.unitSelectionGrid.getModel().setActiveUnitUUID(uuid);		  		 
		  
		  var group = "input:checkbox[name='cb']";
		  j$(group).prop("checked", false);
		  
		  j$('#'+uuid).prop("checked",true);
	  }
  },	  
  checkBoxClick:function(event){
	  
	  var j$box = j$(event.currentTarget);
	  if (j$box.is(":checked")) {
	    // the name of the box is retrieved using the .attr() method
	    // as it is assumed and expected to be immutable
	    var group = "input:checkbox[name='" + j$box.attr("name") + "']";
	    // the checked state of the group/box on the other hand will change
	    // and the current value is retrieved using .prop() method
	    j$(group).prop("checked", false);
	    j$box.prop("checked", true);
	  } else {
	    j$box.prop("checked", true);
	  }
	  if(this.enabled){
		  this.unitSelectionGrid.getModel().setActiveUnitUUID(parseInt(j$box[0].id));
	  }
  },
  release:function(){
  	this.unitSelectionGrid.release();  
  	this.undelegateEvents();
  },
  repaint:function(){
  	if(this.unitSelectionGrid.model!=null){
  		var i=0;
		for(let unit of this.unitSelectionGrid.model.getUnits()){  	
  	        var cell=this.unitSelectionGrid.cells[i];
  			var canvas = j$('#'+this.canvasprefixid+(i));
  	  	    var ctx = canvas[0].getContext("2d");
  	        ctx.fillStyle = this.backColor;
  	        ctx.fillRect(0, 0, cell.width, cell.height);  
  	        unit.paint(ctx,d2.Box.fromRect(cell.x,cell.y,cell.width,cell.height));
  	        i++;
  
  		  };
  	}
  },
  render:function(){
		    	//create picker
		    var panel=""
		    if(this.unitSelectionGrid.model!=null){
		      for(i=0;i<this.unitSelectionGrid.cells.length;i++){
		    	var cell=this.unitSelectionGrid.cells[i];
		    	
		    	panel+="<div><canvas id=\""+this.canvasprefixid+i+"\" width=\""+cell.width+"px\" height=\""+cell.height+"px\"  data-uuid=\""+cell.uuid+"\" >"+
		        "</canvas></div>"+
		        "<div><input type=checkbox name='cb' id='"+cell.uuid+"' style='vertical-align: -2px;margin-left:10px;margin-right:5px;' "+
		        (cell.selected?" checked ":(this.enabled?" ":" checked "))+
		        (this.enabled?'':'disabled')+"><label for='"+cell.uuid+"' style='color:"+this.textColor+"'>"+cell.name+"</label></div>";		       
			   }
		      }
			 j$(this.el).empty();
			 j$(this.el).append(
				"<div style=\"background-color:"+this.backColor+"\">"+panel+
				"</div>"				
		     );	
			 this.repaint();
			 this.delegateEvents();
	}
});


module.exports ={
	mywebpcb,	
	UUID,
	GridRaster,
	Fill,
	Units,
	ModeEnum,
	BOARD_LAYERS,PCB_SYMBOL_LAYERS,
	Layer,
	ScalableTransformation,
	ViewportWindow,
	Grid,	
	UnitFrame,
	AffineTransform,
    MM_TO_COORD,
    COORD_TO_MM,
	UnitSelectionPanel,
	CompositeLayer,
	isEventEnabled,
	SymbolType,
	Queue,
	ResumeState,
}

var events=require('core/events');
var utilities=require('core/utilities');
var font = require('core/text/d2font');
});

require.register("core/events.js", function(exports, require, module) {
var core = require('core/core');
var DefaultLineBendingProcessor=require('core/line/linebendingprocessor').DefaultLineBendingProcessor;
var d2=require('d2/d2');

Event={
	    SELECT_SHAPE:1,
	    DELETE_SHAPE:2,
	    RENAME_SHAPE:3,
	    ADD_SHAPE:4,
	    PROPERTY_CHANGE:5,
	    ADD_UNIT:6,
	    DELETE_UNIT:7,
	    SELECT_UNIT:8,  
	    RENAME_UNIT:9,
	    SELECT_CONTAINER:10,
	    RENAME_CONTAINER:11,
	    DELETE_CONTAINER:12
};

class EventHandle{
	 constructor(component) {
	     this.component=component;
	     this.mx=0;
		 this.mx=0;
		 this.target=null;
	 }	
	 attach(){
	     this.ctrlButtonPress = false;
	     this.mx=0;
	     this.my=0;  	     
	 }
	 dblClick(){
 
	 }
	 keyPressed(event){
		 //default
		 if(this.component.popup.isOpen()){
			this.component.popup.close(); 
			return; 
		 }
		 if (this.component.getModel().getUnit() != null) { 
			 if (event.keyCode == 8) { //BACKSPACE
				 this.component.getModel().getUnit().getSelectedShapes().forEach(function(shape) {
					 this.component.getModel().getUnit().remove(shape.getUUID());	
		           }.bind(this));  
				 this.component.repaint();
			 }
			 if (this.component.getEventMgr().getTargetEventHandle() != null&&event.keyCode==27) {	
			   this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		       this.component.setMode(core.ModeEnum.COMPONENT_MODE);       
		     } 
		 }		 
	 }
	 setTarget(target){
       this.target=target;
	 }
	 clear(){
		 
	 }
	 detach(){
	   this.clear();
	 }
isRightMouseButton(e){	 
	  return e.which!=1
}
}

class MoveEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 mousePressed(event){	
	    this.component.getModel().getUnit().setSelected(false);
	    this.target.setSelected(true);
		this.component.repaint();
		if(super.isRightMouseButton(event)){
            if (this.target["getLinePoints"]!=undefined){
            	this.component.popup.registerLineSelectPopup(this.target,event);
            }else if(this.target["getPinsRect"]!=undefined){
            	this.component.popup.registerPadPopup(this.target,event);
            }
            else{
                this.component.popup.registerShapePopup(this.target,event);
                
            }
            return;
        }
	    
	    this.mx=event.x;
		this.my=event.y;
	 }
	 mouseReleased(event){
		if(super.isRightMouseButton(event)){
			 return;
		}
		this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
				 
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		this.component.repaint();
	 }
	 
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
			 return;
		} 
	 	let new_mx = event.x;
	    let new_my = event.y;
		
	    this.target.move(new_mx - this.mx, new_my - this.my);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();
	 }
	 mouseMove(event){
	 
	 }	 
}

class ResizeEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.targetPoint=null;
	 }
	 mousePressed(event){
		if(super.isRightMouseButton(event)){
	            if (this.target["getLinePoints"]!=undefined){
	            	this.component.popup.registerLineSelectPopup(this.target,event);            
	            }            
	    }
	     
	    this.component.getModel().getUnit().setSelected(false);
	    this.target.setSelected(true);
		this.mx=event.x;
		this.my=event.y;
	        
	    this.targetPoint=this.target.isControlRectClicked(event.x,event.y);
	    this.target.setResizingPoint(this.targetPoint);
	    
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    
		this.component.repaint();
	 }
	 mouseReleased(event){
		    if(this.component.getParameter("snaptogrid")){
	         this.target.alignResizingPointToGrid(this.targetPoint);
		     this.component.repaint();	 
			}
			
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
	    this.target.Resize(new_mx - this.mx, new_my - this.my,this.targetPoint);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();
	 }
	 mouseMove(event){
	 
	 }
	 
}
class DragingEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
mousePressed(event){
   this.mx = event.windowx;
   this.my = event.windowy;
   
		 }
mouseReleased(event){

		 }
mouseDragged(event){
   var newX =this.component.viewportWindow.x- (event.windowx - this.mx);
   var newY =this.component.viewportWindow.y- (event.windowy - this.my);        
    

   this.component.viewportWindow.x=newX;
   this.component.viewportWindow.y=newY;
   
   this.component.hbar.jqxScrollBar('setPosition',newX); 
   this.component.vbar.jqxScrollBar('setPosition',newY);
   
   this.mx = event.windowx;
   this.my = event.windowy;
   this.component.repaint();  
		 }
mouseMove(event){
		 
		 }	 
}

class UnitEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectionBox=new d2.Box(0,0,0,0);
	 }
	 attach(){
		 super.attach();
	     this.selectionBox.setRect(0,0,0,0);
	 }
	 mousePressed(event){
		this.component.getModel().getUnit().setSelected(false);
		this.component.repaint();
			
		if(super.isRightMouseButton(event)){
			this.component.popup.registerUnitPopup(this.target,event);
			//this.component.popup.open(event.data.originalEvent.clientX,event.data.originalEvent.clientY);		
			return;
		} 
		this.mx=event.windowx;
		this.my=event.windowy;
	 }
	 mouseReleased(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
		 this.selectionBox.move(this.component.viewportWindow.x,this.component.viewportWindow.y);
		 this.component.getModel().getUnit().setSelectedInRect(this.component.getModel().getUnit().getScalableTransformation().getInverseRect(this.selectionBox));
	     this.component.repaint();
	 }
	 mouseDragged(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
	 	  let w = event.windowx-this.mx;
	      let h = event.windowy-this.my;
		
		  let x=this.mx - (w < 0 ? Math.abs(w) : 0);
		  let y=this.my - (h < 0 ? Math.abs(h) : 0);
		
	      this.selectionBox.setRect(x,y,Math.abs(w),Math.abs(h));	
	      this.component.repaint();
		  
		  this.component.ctx.globalCompositeOperation='lighter';
	      this.component.ctx.beginPath();
	      this.component.ctx.rect(this.selectionBox.x,this.selectionBox.y,this.selectionBox.width,this.selectionBox.height);
	      this.component.ctx.fillStyle = 'gray';
	      this.component.ctx.fill();
		  this.component.ctx.globalCompositeOperation='source-over';
	      this.component.ctx.lineWidth = 1;
	      this.component.ctx.strokeStyle = '#5B5B5B';
	      this.component.ctx.stroke();
	 }
	 mouseMove(event){

	 }	 
}

class OriginEventHandle extends EventHandle{
constructor(component) {
		super(component);		
	}
attach(){
		 super.attach();
		 this.component.getModel().getUnit().coordinateSystem.reset(0,0);  
	 }
mousePressed(event){
	     this.component.getModel().getUnit().getCoordinateSystem().reset(event.x,event.y); 
	     this.mx = event.x;
	     this.my = event.y; 
	     this.component.getModel().getUnit().setSelected(false);	     
		 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		 
	 }
mouseReleased(event){
	if (event.which == 3) {
      //this.component.getModel().getUnit().coordinateSystem=null;   		 			   	
	}else{
	   this.component.getModel().getUnit().getCoordinateSystem().alignToGrid(false || this.component.getParameter("snaptogrid")); 
	}
	this.component.setMode(core.ModeEnum.COMPONENT_MODE);	 
}
mouseDragged(event){
		 this.mouseMove(event);
		 }
mouseMove(event){
	        let new_mx = event.x;
	        let new_my = event.y;
	       
	        this.component.getModel().getUnit().getCoordinateSystem().move((new_mx - this.mx), (new_my - this.my));
	        this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:Event.PROPERTY_CHANGE});

	        this.mx = new_mx;
	        this.my = new_my;     
	        this.component.repaint();   		 
		 }

}

class CursorEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 attach(){
		 super.attach();
		    this.mx = this.target.getCenter().x;
		    this.my = this.target.getCenter().y;
	 }	 
	 mousePressed(event){
		 if(event.which==3){
			 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
	         this.component.setMode(core.ModeEnum.COMPONENT_MODE);  
			 return;
		 }
	     var shape = this.target.clone();	            
	         this.component.getModel().getUnit().add(shape);       
	         this.component.getModel().getUnit().setSelected(false);
	         shape.setSelected(true);
	         shape.alignToGrid();
	         this.component.getModel().getUnit().fireShapeEvent({target:shape,type:Event.SELECT_SHAPE});
	         this.component.repaint();	            
	 }
	 mouseReleased(event){

	 }
	 mouseDragged(event){

	 }
	 mouseMove(event){		    
		 	let new_mx = event.x;
		    let   new_my = event.y;
		    
			
		    this.target.move(new_mx - this.mx, new_my - this.my);

		    this.mx = new_mx;
		    this.my = new_my;
			this.component.repaint(); 
	 }
}
class LineEventHandle extends EventHandle{
	constructor(component) {
			 super(component);
    }
	attach() {        
	    super.attach();
	    this.component.lineBendingProcessor=new DefaultLineBendingProcessor(); 
	    this.component.lineBendingProcessor.initialize(this.target);
	}	
	mousePressed(event){
		this.component.popup.close();
		
		if(super.isRightMouseButton(event)){	
		   this.component.popup.registerLinePopup(this.target,event);
		   return; 
		}
		
		this.component.getModel().getUnit().setSelected(false);		
		this.target.setSelected(true);
		
	    let p;      
	    if(this.component.getParameter("snaptogrid")){        
	        p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y);  
	        this.component.lineBendingProcessor.isGridAlignable=true;
	    }else{
	    	p=new d2.Point(event.x,event.y);
	        this.component.lineBendingProcessor.isGridAlignable=false;
	    }
	    
	    //this.component.getModel().getUnit().fireShapeEvent(new ShapeEvent(this.target, ShapeEvent.PROPERTY_CHANGE)); 
	    
	    let justcreated=this.target.getLinePoints().length==1; 
	        
	    if(this.component.lineBendingProcessor.addLinePoint(p)){
	        if(justcreated){
	            //getComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.CREATE_MEMENTO));   
	            //getComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.MOVE_MEMENTO));    
	        }
	        if(this.target.getLinePoints().length>=2){
	           //this.component.getModel().getUnit().registerMemento(getTarget().getState(MementoType.MOVE_MEMENTO));    
	        }            
	    }
	    this.component.repaint();  
}
mouseReleased(event){

	   }
mouseDragged(event){
	   }
mouseMove(event){
	this.component.lineBendingProcessor.moveLinePoint(event.x,event.y);    
	this.component.repaint();  
	   }
dblClick(){
	this.target.reset();
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.repaint();	 
} 
detach() {
    this.target.reset(); 
    if(this.target.getLinePoints().length<2){
        this.target.owningUnit.remove(this.target.uuid);
    }
    super.detach();
}   
}
class BlockEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectedShapes=[];
	 }
	 attach(){
		 super.attach();
	     this.selectedShapes = this.component.getModel().getUnit().getSelectedShapes(false);
	 }
	 detach(){
	     this.selectedShapes=null;
	     super.detach();
	 }
	 mousePressed(event){
		if(super.isRightMouseButton(event)){
		   this.component.popup.registerBlockPopup(this.target,event);					
		   return;
		}   
		if(event.data.ctrlKey){
		  this.component.getModel().getUnit().setSelectedShape(this.target.uuid,
	                   !this.target.isSelected());
	      this.ctrlButtonPress = true;
	      this.component.repaint();
	      return;		   
		}		
		this.mx=event.x;
		this.my=event.y;
	 }
	 mouseReleased(event){
		if(super.isRightMouseButton(event)){
		  return;
		}
		UnitMgr.getInstance().alignBlock(this.component.getModel().getUnit().grid, this.selectedShapes);
		this.component.repaint();
	 }
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
		  return;	 
		}
		let new_mx = event.x;
	    let new_my = event.y;
		
	    UnitMgr.getInstance().moveBlock(this.selectedShapes,new_mx - this.mx, new_my - this.my);
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();
	   
	 }
	 mouseMove(event){
	 
	 }
}

class TextureEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.texture=null;
	 }
clear() {
	 this.texture=null;
}
mousePressed(event){
   this.component.getModel().getUnit().setSelected(false);
   this.target.setSelected(true);
	this.mx=event.x;
	this.my=event.y;

	this.texture= this.target.getClickedTexture(event.x,event.y);  
	this.component.repaint();
	
}
mouseReleased(event){

}
mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
		
		this.texture.move(new_mx - this.mx, new_my - this.my);
		this.target.owningUnit.fireShapeEvent({target:this.target,type: Event.PROPERTY_CHANGE});
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.repaint();       
}
mouseMove(event){

}
}

class MeasureEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
attach(){
	 super.attach();
}	 
detach() {
    this.component.getModel().getUnit().ruler.resizingPoint=null;
    super.detach();
}
mouseReleased(e){

}
mouseDragged(e){
}
mousePressed(e) {        
        this.component.getModel().getUnit().ruler.resizingPoint=new d2.Point(e.x,e.y);
        this.mx = e.x;
        this.my = e.y;
}
mouseMove(e) {
        let new_mx = e.x;
        let new_my = e.y;
        this.component.getModel().getUnit().ruler.Resize(new_mx - this.mx, new_my - this.my);
        // update our data
        this.mx = new_mx;
        this.my = new_my;
        
        this.component.repaint();
    }	
}

class MouseScaledEvent{
 constructor(x,y,basePoint,originalEvent) {
   this.windowx=x;
   this.windowy=y;
   this.x=basePoint.x;
   this.y=basePoint.y;
   this.which=originalEvent.which;
   this.data=originalEvent;
 }
 toString(){
   return    "base x="+this.x+
             "; base y="+this.y+
			 "; window x="+this.windowx+
			 "; window y="+this.windowy+
			 "; which="+this.which; 
 }
}

 
module.exports ={
   Event,
   MouseScaledEvent,
   TextureEventHandle,
   BlockEventHandle,
   CursorEventHandle,
   OriginEventHandle,
   UnitEventHandle,
   DragingEventHandle,
   MoveEventHandle,
   ResizeEventHandle,
   EventHandle,
   LineEventHandle,
   MeasureEventHandle
}
var UnitMgr = require('core/unit').UnitMgr;

});

require.register("core/line/linebendingprocessor.js", function(exports, require, module) {
var core=require('core/core');
var d2=require('d2/d2');
var utilities =require('core/utilities');

class LineBendingProcessor{
constructor () {
	    this.line;	    
	    this.isGridAlignable=false;
  }	
initialize(line){           
      this.line=line         
  }
addLinePoint(point){
	
}   

moveLinePoint(x,y){

}
isOverlappedPoint(pointToAdd){
    if(this.line.getLinePoints().length>0){      
      let lastPoint;
          if(this.line.resumeState==core.ResumeState.ADD_AT_END){
        	  lastPoint=this.line.getLinePoints()[(this.line.getLinePoints().length-1)];                 
          }else{
              lastPoint=this.line.getLinePoints()[0]; 
          }
      //***is this the same point as last one?   
      if(d2.utils.EQ(pointToAdd.x,lastPoint.x)&&d2.utils.EQ(pointToAdd.y,lastPoint.y))
        return true;    
    }
    return false;
}
isPointOnLine(pointToAdd){
    if(this.line.getLinePoints().length>=2){
        //let lastPoint=this.line.getLinePoints()[(this.line.getLinePoints().length-1)]; 
        //let lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2];
    	let lastPoint,lastlastPoint;
    	if(this.line.resumeState==core.ResumeState.ADD_AT_END){  
            lastPoint=this.line.getLinePoints()[(this.line.getLinePoints().length-1)]; 
            lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 
        }else{
            lastPoint=this.line.getLinePoints()[0];  
            lastlastPoint=this.line.getLinePoints()[1];                  
        }    	
      //***check if point to add overlaps last last point
      if(lastlastPoint.equals(pointToAdd)){
        //this.line.deleteLastPoint();
        lastPoint.set(pointToAdd);  
        return true;
      }
      if((d2.utils.EQ(lastPoint.x,pointToAdd.x)&&d2.utils.EQ(lastlastPoint.x,pointToAdd.x))||(d2.utils.EQ(lastPoint.y,pointToAdd.y)&&d2.utils.EQ(lastlastPoint.y,pointToAdd.y))){                
        lastPoint.set(pointToAdd);                           
        return true;
      }                    
   }
   return false;	
}
isSlopeInterval(p1,p2){
	if(d2.utils.EQ(p1.x,p2.x)){
		return false;
	}
	if(d2.utils.EQ(p1.y,p2.y)){
		return false;
	}
	return true;	
}
}
class LineSlopBendingProcessor extends LineBendingProcessor{
	constructor () {
		super();
  }	

addLinePoint( point) {
        if(this.line.getLinePoints().length==0){
             this.line.reset(point);
        }               
        let result=false;
        if(!this.isOverlappedPoint(point)){
            if(!this.isPointOnLine(point)) {
                let midP,endP;
               
                if(this.isGridAlignable){
                  midP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
                  endP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
                }else{
                  midP=new d2.Point(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
                  endP=new d2.Point(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
                  
                }
                if(this.isOverlappedPoint(midP)){
                   this.line.addPoint(endP);
                   result=true;  
                }else if(!this.isPointOnLine(midP)){
                   this.line.addPoint(midP);
                   result=true;
                } 
            }  
        }  
    
        this.line.shiftFloatingPoints(); 
        return result;
        
        
}	
moveLinePoint(x,y){
	
	    if(this.line.getLinePoints().length>1){
	        //line is resumed if line end is not slope then go on from previous segment	        
	        let lastPoint,lastlastPoint;
	        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
	            lastPoint=this.line.getLinePoints()[0];  
	            lastlastPoint=this.line.getLinePoints()[1];  
	        }else{
		    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
		        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
	        }	        
	        if(this.isSlopeInterval(lastPoint, lastlastPoint)){
	        	this.handleLine(x, y);
	        }else{
	           this.handleSlope(x, y); 
	        }
	        
	    }else{
	        this.handleLine(x, y);
	    }	
	}

handleSlope(x,y){    
    this.line.floatingEndPoint.set(x,y);
    let quadrant = utilities.getQuadrantLocation(this.line.floatingStartPoint,this.line.floatingEndPoint);
    let dx=Math.abs(this.line.floatingStartPoint.x-this.line.floatingEndPoint.x);
    let dy=Math.abs(this.line.floatingStartPoint.y-this.line.floatingEndPoint.y); 
    
    
    if(dx>=dy){ 
        switch(quadrant){
            case  utilities.QUADRANT.FIRST:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x+dy,this.line.floatingEndPoint.y); 
                  break;            
            case  utilities.QUADRANT.SECOND:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x-dy,this.line.floatingEndPoint.y);  
                  break;             
            case  utilities.QUADRANT.THIRD:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x-dy,this.line.floatingEndPoint.y);   
                  break; 
            case  utilities.QUADRANT.FORTH:
                  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x+dy,this.line.floatingEndPoint.y);                        
                  break;                
        }
    }else{
        switch(quadrant){
            case  utilities.QUADRANT.FIRST:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y-dx);                        
                  break;            
            case  utilities.QUADRANT.SECOND:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y-dx); 
                  break;             
            case  utilities.QUADRANT.THIRD:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y+dx); 
                  break; 
            case  utilities.QUADRANT.FORTH:
                  this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y+dx);                        
                  break;                
        }            
    }
       
}        
	
handleLine( x,  y){        
        this.line.floatingEndPoint.set(x,y);
        let quadrant = utilities.getQuadrantLocation(this.line.floatingStartPoint,this.line.floatingEndPoint);
        let dx=Math.abs(this.line.floatingStartPoint.x-this.line.floatingEndPoint.x);
        let dy=Math.abs(this.line.floatingStartPoint.y-this.line.floatingEndPoint.y); 
        
        if(dx>=dy){ 
            switch(quadrant){
                case  utilities.QUADRANT.FIRST:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x-dy,this.line.floatingStartPoint.y); 
                      break;            
                case  utilities.QUADRANT.SECOND:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x+dy,this.line.floatingStartPoint.y);  
                      break;             
                case  utilities.QUADRANT.THIRD:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x+dy,this.line.floatingStartPoint.y);   
                      break; 
                case  utilities.QUADRANT.FORTH:
                      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x-dy,this.line.floatingStartPoint.y);                        
                      break;                
            }
        }else{
        	switch(quadrant){
                case  utilities.QUADRANT.FIRST:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y+dx);                        
                      break;            
                case  utilities.QUADRANT.SECOND:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y+dx); 
                      break;             
                case  utilities.QUADRANT.THIRD:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y-dx); 
                      break; 
                case  utilities.QUADRANT.FORTH:
                      this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y-dx);                        
                      break;                
            }            
        }
        
    }	
	
}
class SlopLineBendingProcessor extends LineSlopBendingProcessor{
	constructor () {
		super();
  }		
addLinePoint( point) {
		super.addLinePoint(point);
	}
moveLinePoint(x,y){
    if(this.line.getLinePoints().length>1){
        let lastPoint,lastlastPoint;
        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
            lastPoint=this.line.getLinePoints()[0];  
            lastlastPoint=this.line.getLinePoints()[1];  
        }else{
	    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
	        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
        }        
        
        if(this.isSlopeInterval(lastPoint, lastlastPoint)){
           this.handleLine(x, y);
        }else{
           this.handleSlope(x, y); 
        }
        
    }else{
        this.handleSlope(x, y);
    }	
}	
	
}
class DefaultLineBendingProcessor extends LineBendingProcessor {
constructor () {
		super();
  }	   
addLinePoint(point) {      
       let result=false;
       if(!this.isOverlappedPoint(point)){
           if(!this.isPointOnLine(point)){
               this.line.addPoint(point);   
               result=true;
           }               
       }         
       this.line.reset(point); 
       return result;
    }

moveLinePoint( x,  y) {
      this.line.floatingEndPoint.set(x,y); 
      this.line.floatingMidPoint.set(x,y);
    }

}

class HorizontalToVerticalProcessor extends LineBendingProcessor{
  constructor () {
		super();
  }
  addLinePoint( point) {
      if(this.line.getLinePoints().length==0){
          this.line.reset(point);
     }               
     let result=false;
     if(!this.isOverlappedPoint(point)){
         if(!this.isPointOnLine(point)) {
             let midP,endP;
            
             if(this.isGridAlignable){
               midP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
               endP=this.line.owningUnit.getGrid().positionOnGrid(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
             }else{
               midP=new d2.Point(this.line.floatingMidPoint.x,this.line.floatingMidPoint.y);
               endP=new d2.Point(this.line.floatingEndPoint.x,this.line.floatingEndPoint.y);
               
             }
             if(this.isOverlappedPoint(midP)){
                this.line.addPoint(endP);
                result=true;  
             }else if(!this.isPointOnLine(midP)){
                this.line.addPoint(midP);
                result=true;
             } 
         }  
     }  
 
     this.line.shiftFloatingPoints(); 
     return result;
  }	
  moveLinePoint(x,y){		
	    if(this.line.getLinePoints().length>1){
	        //line is resumed if line end is not slope then go on from previous segment	    	
	        let lastPoint,lastlastPoint;
	        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
	            lastPoint=this.line.getLinePoints()[0];  
	            lastlastPoint=this.line.getLinePoints()[1];  
	        }else{
		    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
		        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
	        }  	        
	        
	        if(this.isHorizontalInterval(lastPoint, lastlastPoint)){
	           this.handleVertical(x, y);
	        }else{
	           this.handleHorizontal(x, y); 
	        }
	        
	    }else{
	        this.handleHorizontal(x, y);
	    }	
	}  
  handleVertical( x,  y){
	  this.line.floatingEndPoint.set(x,y);
	  this.line.floatingMidPoint.set(this.line.floatingStartPoint.x,this.line.floatingEndPoint.y); 
  }
  handleHorizontal( x,  y){        
      this.line.floatingEndPoint.set(x,y);
      this.line.floatingMidPoint.set(this.line.floatingEndPoint.x,this.line.floatingStartPoint.y); 
                        
  }	
  isHorizontalInterval(p1,p2){
		if(d2.utils.EQ(p1.x,p2.x)){
			return false;
		}		
		return true;	
	}  
}

class VerticalToHorizontalProcessor extends HorizontalToVerticalProcessor{
constructor () {
			super();
	  }
addLinePoint( point) {
			super.addLinePoint(point);
		}
moveLinePoint(x,y){
    if(this.line.getLinePoints().length>1){
        //line is resumed if line end is not slope then go on from previous segment
        let lastPoint,lastlastPoint;
        if(this.line.resumeState==core.ResumeState.ADD_AT_FRONT){	        	
            lastPoint=this.line.getLinePoints()[0];  
            lastlastPoint=this.line.getLinePoints()[1];  
        }else{
	    	lastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-1];  
	        lastlastPoint=this.line.getLinePoints()[this.line.getLinePoints().length-2]; 	        		             
        }  
        if(this.isHorizontalInterval(lastPoint, lastlastPoint)){
           this.handleVertical(x, y);
        }else{
           this.handleHorizontal(x, y); 
        }
        
    }else{
        this.handleVertical(x, y);
    }		
	}	  
}
module.exports ={
		SlopLineBendingProcessor,
		LineSlopBendingProcessor,
		DefaultLineBendingProcessor,
		HorizontalToVerticalProcessor,
		VerticalToHorizontalProcessor,
}
});

;require.register("core/models/togglebutton.js", function(exports, require, module) {


/*
 * ToggleButton model on the UI
 */
var ToggleButtonModel=Backbone.Model.extend({
	defaults: {
	  active:false,
      id:'unkown',
      group:''
	},
    update:function(){
       if(this.attributes.active){	
         j$('#'+this.id).addClass("active");
       }else{
    	 j$('#'+this.id).removeClass("active");  
       }
    },	
	setActive:function(active){
		this.attributes.active=active;
		this.update();
	},
    isActive:function(){
    	return this.attributes.active;
    }
});

/*
* Button Collection
*/
var ToggleButtonCollection=Backbone.Collection.extend({
	model: ToggleButtonModel
});

module.exports ={
	ToggleButtonCollection,
	ToggleButtonModel
}
});

;require.register("core/popup/contextmenu.js", function(exports, require, module) {
var core=require('core/core');
var UnitMgr = require('core/unit').UnitMgr;
var d2=require('d2/d2');
var DefaultLineBendingProcessor=require('core/line/linebendingprocessor').DefaultLineBendingProcessor;

class ContextMenu{
constructor(component,placeholderid){
	this.component=component;
	this.placeholder = document.getElementById(placeholderid);	
	this.content="";
	this.x=this.y=0;
	this.opened = false;	
}
registerShapePopup(target,event){
var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
  items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
  items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
  items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
  items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
  items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
  items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
  items+="</table></div>";
  this.setContent(items,{target:target});	
  this.open(event);	
}
registerLineSelectPopup(target,event){
	  let bending=target.isBendingPointClicked(event.x,event.y);
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
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
	    this.open(event);	
}
open(event){ 
	this.x=event.x;
	this.y=event.y;
    this.placeholder.style.left=event.data.originalEvent.offsetX+"px";
    this.placeholder.style.top=event.data.originalEvent.offsetY+"px";
    this.show();				  
}
show(){
    if (!this.opened) {
	   this.placeholder.className = "visible";
	}    
	this.opened = true;		  		  
}
close() {
	
	j$(this.placeholder).removeClass("visible");
	j$(this.placeholder).empty();
    this.opened = false;  
}
isOpen(){
	return this.opened;
}
setContent(content,context) {
    this.placeholder.innerHTML ="<div class='content'>" + content + "</div>";
    //attach event listeners
    this.attachEventListeners(context);
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
	
	if(id=='defaultbendid'){
		let line =this.component.lineBendingProcessor.line;
		this.component.lineBendingProcessor=new DefaultLineBendingProcessor();
		this.component.lineBendingProcessor.initialize(line);
	}	
	if (id=="resumeid") {
	        this.component.getView().setButtonGroup(core.ModeEnum.LINE_MODE);
	        this.component.setMode(core.ModeEnum.LINE_MODE);         
	        this.component.resumeLine(context.target,"line", {x:this.x, y:this.y,which:3});
	 } 
	 if(id=='cancelid') {
		   this.component.getEventMgr().resetEventHandle();
		   context.target.setSelected(false);
		   this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
	       this.component.setMode(core.ModeEnum.COMPONENT_MODE); 
	       this.component.repaint();
	 }
     if (id=="addbendingpointid") {
    	 let line=context.target;
         line.insertPoint(this.x, this.y);
         
         this.component.repaint();
         return;
    }	 
     if(id=='deletelastpointid') {
        let line=context.target;
        line.deleteLastPoint();

        if (line.polyline.points.length == 1) {
            //getUnitComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.DELETE_MEMENTO));
            this.component.getEventMgr().resetEventHandle();
            this.component.getModel().getUnit().remove(line.uuid);
        }

         this.component.repaint();
         return;
     }
     if(id=='deletebendingpointid'){
    	 let line=context.target;
    	 line.removePoint(this.x,this.y);
         //***delete wire if one point remains only
         if (line.getLinePoints().length == 1) {
        	 this.component.getEventMgr().resetEventHandle();
        	 this.component.getModel().getUnit().remove(line.uuid);
         }
         this.component.repaint();
         return;
     }
     if (id=="deletelineid") {
    	 let line=context.target;
         //this.component.getModel().getUnit().registerMemento(getTarget().getState(MementoType.DELETE_MEMENTO));
         this.component.getEventMgr().resetEventHandle();
         this.component.getModel().getUnit().remove(line.uuid);
         this.component.repaint();                    
   } 
	 if(id=='topbottomid'||id=='leftrightid'){
         let shapes= this.component.getModel().getUnit().getSelectedShapes(false);         
         if(shapes.length==0){
             return; 
         }
         
         let r=this.component.getModel().getUnit().getShapesRect(shapes);       
         let unitMgr = UnitMgr.getInstance();
         let p=this.component.getModel().getUnit().grid.positionOnGrid(r.center.x,r.center.y); 
         if(id=='topbottomid'){
             unitMgr.mirrorBlock(shapes,new d2.Line(new d2.Point(p.x-10,p.y),new d2.Point(p.x+10,p.y)));
         }else{
             unitMgr.mirrorBlock(shapes,new d2.Line(new d2.Point(p.x,p.y-10),new d2.Point(p.x,p.y+10)));
         }         
         unitMgr.alignBlock(this.component.getModel().getUnit().grid,shapes);
         this.component.repaint();		 
	 }	
	 if(id=='rotaterightid'||id=='rotateleftid'){
         let shapes= this.component.getModel().getUnit().getSelectedShapes(false);         
         if(shapes.length==0){
             return; 
         }
         
         let r=this.component.getModel().getUnit().getShapesRect(shapes);       
         let unitMgr = UnitMgr.getInstance();
         
         unitMgr.rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(id==("rotateleftid")?1:-1)*(90.0)));
         
         unitMgr.alignBlock(this.component.getModel().getUnit().grid,shapes);
         this.component.repaint();		 
	 }
	 if(id=='positiontocenterid'){
	     let unit=this.component.getModel().getUnit();           
	     let rect =unit.getBoundingRect();
	    
	     let x=rect.center.x;
	     let y=rect.center.y;
	     
	     let unitMgr = UnitMgr.getInstance();
	     
	     unitMgr.moveBlock(unit.shapes, (unit.width/2)-x, (unit.height/2)-y);
	     unitMgr.alignBlock(unit.grid,unit.shapes);
	      
	     //scroll to center
	     this.component.setScrollPosition((unit.width/2), (unit.height/2));
	     this.component.repaint();
	 }
	 if(id=='deleteunit'){
         this.component.getModel().delete(this.component.getModel().getUnit().getUUID());
         if (this.component.getModel().unitsmap.size> 0) {
        	 this.component.getModel().setActiveUnit(0);
        	 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:Event.SELECT_UNIT});
         }else{
        	 this.component.clear();
        	 this.component.fireContainerEvent({target:null, type:Event.DELETE_CONTAINER});
         }
         this.component.repaint();  
	 }
     if (id=='deleteid') {
    	 let unit=this.component.getModel().getUnit(); 
    	 let unitMgr = UnitMgr.getInstance();        
         unitMgr.deleteBlock(unit,unit.getSelectedShapes(false));
         this.component.repaint();                     
     } 
	 if(id=='cloneid'){
		 let unit=this.component.getModel().getUnit();  
		 let unitMgr = UnitMgr.getInstance();
         unitMgr.cloneBlock(unit,unit.getSelectedShapes(true));
         let shapes= unit.getSelectedShapes(false); 
         let r=unit.getShapesRect(shapes);
         unitMgr.moveBlock(shapes,
                              r.width,r.height);
         unitMgr.alignBlock(unit.grid,shapes);
         
         this.component.repaint();
         //***emit property event change
         if (shapes.length == 1) {            
	       unit.fireShapeEvent({target:shapes[0],type:Event.SELECT_SHAPE});
         }             
         return; 		 
	 }
	 if(id=='selectallid'){ 
	     this.component.getModel().getUnit().setSelected(true);
	     this.component.repaint();  
	 }	
}
}

module.exports ={
		   ContextMenu
}
});

;require.register("core/shapes.js", function(exports, require, module) {
var core=require('core/core');
var utilities =require('core/utilities');
var d2=require('d2/d2');
var font = require('core/text/d2font');

class Shape{
	constructor(x, y, width, height, thickness,
			layermask) {
		this.owningUnit=null;
		this.uuid = core.UUID();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.thickness = thickness;
		this.selection = false;
		this.displayName = "noname";
		this.fill = Fill.EMPTY;
		this.fillColor;		 
		this.isControlPointVisible=true;
		this.copper = core.Layer.Copper.resolve(layermask);
	}
getCenter(){
	return new d2.Point(this.x,this.y);
}	
setDisplayName(displayName) {
		this.displayName = displayName;
	}
clear() {
    this.owningUnit=null;
	}
clone() {
	copy=new Shape(this.x,this.y,this.width,this.height,this.layermask);
	copy.fill=this.fill;	
	return copy;
	}
alignToGrid(isRequired) {
        let point=this.owningUnit.getGrid().positionOnGrid(this.getX(), this.getY());
        this.setX(point.x);
        this.setY(point.y);      
        return null;
}
setX(x) {
		this.x = x;
	}
getX() {
		return this.x;
	}
setY(y) {
		this.y = y;
	}
getY() {
		return this.y;
	}
setWidth(width) {
		this.width = width;
	}
getWidth() {
		return this.width;
	}
setHeight (height) {
		this.height = height;
	}
getHeight() {
		return this.height;
	}
getDrawingOrder() {
    return 100;
}
getClickableOrder() {
		return 100;
}
getUUID() {
		return this.uuid;
	}
calculateShape() {

	}
isVisibleOnLayers(layermasks){
    if((this.copper.getLayerMaskID()&layermasks)!=0){
        return true;
    }else{
        return false;
    }
}
isInRect(r){
	let rect=this.getBoundingShape();
        if(r.contains(rect.center))
            return true;
           else
            return false; 		
	}
isClicked(x,y) {
        let r=this.getBoundingShape();
        if(r.contains(x,y))
         return true;
        else
         return false;           
}
isClickedOnLayers(x, y, layermasks) {        
  return this.isClicked(x, y);
}
getBoundingShape() {
	return this.calculateShape();
	}
setSelected (selection) {
		this.selection = selection;
	}
isSelected() {
		return this.selection;
	}

move(xoffset,yoffset) {
      this.setX(this.getX() + xoffset);
      this.setY(this.getY() + yoffset);    
}

mirror(line) {

}
setSide(side, line, angle) {
    this.copper=(core.Layer.Side.change(this.copper.getLayerMaskID()));
    this.mirror(line);
    this.rotation=angle;
}     

rotate(rotation) {
//		let point = new Point(this.getX(), this.getY());
//		point = utilities.rotate(point, rotation.originx,rotation.originy, rotation.angle);
//	
//        this.x=(point.x);
//        this.y=(point.y);
}	
fromXML(data) {

	}

} 

/**********************Ruler**********************************/
class Ruler extends Shape{
constructor () {
	super(0, 0, 0, 0, 0, 0);
    this.text=new font.FontTexture('label','',0,0,core.MM_TO_COORD(1),0);
    this.text.constSize=true;
    this.text.fillColor='white';        
	this.resizingPoint=null;
}
Resize( xOffset, yOffset) {
    this.resizingPoint.set(this.resizingPoint.x+xOffset,this.resizingPoint.y+yOffset);
    this.text.shape.anchorPoint.set(this.resizingPoint.x, this.resizingPoint.y);
}	
paint( g2,  viewportWindow,  scale) {        
		if(this.resizingPoint==null){
            return;
        }
        this.text.setText(parseFloat(core.COORD_TO_MM(this.resizingPoint.distanceTo(new d2.Point(this.x,this.y)))).toFixed(4)+' MM');
                
        this.text.paint(g2, viewportWindow, scale);
        let line=new d2.Segment(this.x,this.y,this.resizingPoint.x,this.resizingPoint.y);

        g2.strokeStyle  = 'white';
		g2.lineWidth=1; 
        
        line.scale(scale.getScale());
        line.move(-viewportWindow.x,-viewportWindow.y);
        line.paint(g2);
		
    }	
}
/**********************Coordinate System**********************************/
class CoordinateSystem extends Shape {
	constructor (owningUnit) {
		super(0, 0, 0, 0, 0, 0);
		this.owningUnit=owningUnit;
        this.selectionRectWidth=3000;		
	}
alignToGrid(isRequired) {
    if(isRequired){
           return super.alignToGrid(isRequired);
    }else{
          return null;
    }
}
calculateShape() {
    return d2.Box.fromRect(this.x-this.selectionRectWidth/2,this.y-this.selectionRectWidth/2,this.selectionRectWidth,this.selectionRectWidth);
}
reset(x, y) {
		if (x < 0) {
			x = 0;
		} else if (x > this.owningUnit.getWidth()) {
			x = this.owningUnit.getWidth();
		}
		if (y < 0) {
			y = 0;
		} else if (y > this.owningUnit.getWidth()) {
			y = this.owningUnit.getWidth();
		}
		this.x=x;
		this.y=y;
}

paint(g2, viewportWindow, scale) {
		var line = new d2.Segment(0,0,0,0);		

		g2.strokeStyle  = 'blue';
		g2.lineWidth=1; 
	

		line.set(0, this.y, this.owningUnit.getWidth(),
				this.y);
		line.scale(scale.getScale());
		line.move(-viewportWindow.x,- viewportWindow.y);
	    line.paint(g2);
	    
	
		line.set(this.x, 0, this.x, this.owningUnit.getHeight());
		line.scale(scale.getScale());
		line.move(-viewportWindow.x,- viewportWindow.y);		
		line.paint(g2);
	}
}
class AbstractLine extends Shape{
	constructor(thickness,layermaskId) {
		super(0, 0, 0, 0, thickness,layermaskId);
		this.selectionRectWidth = 3000;
		this.setDisplayName("Line");			
		this.polyline=new d2.Polyline();
		this.floatingStartPoint = new d2.Point(); // ***the
																			// last
																			// wire
																			// point
		this.floatingMidPoint = new d2.Point(); // ***mid
																		// 90
																		// degree
																		// forming
		this.floatingEndPoint = new d2.Point();
		this.rotation=0;
	    this.resumeState=core.ResumeState.ADD_AT_END;
		
}
get vertices(){
	  return this.polyline.points;	
	}	
getLinePoints(){
		return this.polyline.points;
	}
clear(){
		this.polyline.points=null;		
	}
alignResizingPointToGrid(targetPoint) {
    this.owningUnit.grid.snapToGrid(targetPoint);         
}
getClickableOrder(){
	return 2;
}
isClicked(x, y) {
	  var result = false;
		// build testing rect
	  var width=this.thickness<4?4:this.thickness;
	  var rect = d2.Box.fromRect(x
								- (width / 2), y
								- (width / 2), width,
								width);
	  var r1 = rect.min;
	  var r2 = rect.max;

	  // ***make lines and iterate one by one
	  var prevPoint = this.polyline.points[0];

	  this.polyline.points.some(function(wirePoint) {
							// skip first point
							{
								if (utilities.intersectLineRectangle(
										prevPoint, wirePoint, r1, r2)) {
									result = true;
									return true;
								}
								prevPoint = wirePoint;
							}

						});

	return result;
}
add(x,y){
    if(this.resumeState==ResumeState.ADD_AT_FRONT)
        this.polyline.points.unshift(new d2.Point(x,y));        
    else
        this.polyline.add(x,y);  	
}
addPoint(point) {
    this.add(point.x,point.y);	
}

reset(...args) {
   if(args.length==0){
	this.floatingStartPoint.set(this.floatingStartPoint);
	this.floatingMidPoint.set(this.floatingStartPoint);
	this.floatingEndPoint.set(this.floatingStartPoint);	  
   }else{	
	this.floatingStartPoint.set(args[0]);
	this.floatingMidPoint.set(args[0]);
	this.floatingEndPoint.set(args[0]);
   }
}

Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
resumeLine( x,  y) {        
    //the end or beginning
    if (this.polyline.points.length ==0) {
      this.resumeState=core.ResumeState.ADD_AT_END;
      return;
    }
    
    let point=this.isBendingPointClicked(x, y);
    if(point==null){
        this.resumeState=code.ResumeState.ADD_AT_END;
    }
    //***head point
    if (this.polyline.points[0].x==point.x&&this.polyline.points[0].y==point.y) {
        this.resumeState=core.ResumeState.ADD_AT_FRONT;
    }
    //***tail point
    if (this.polyline.points[this.polyline.points.length - 1].x==point.x&& this.polyline.points[this.polyline.points.length - 1].y==point.y) {
        this.resumeState=core.ResumeState.ADD_AT_END;
    }        
    
    if(this.resumeState==ResumeState.ADD_AT_FRONT)
       this.reset(this.polyline.points[0]);
    else
       this.reset(this.polyline.points[this.polyline.points.length-1]);
}
shiftFloatingPoints(){
    if(this.resumeState==ResumeState.ADD_AT_FRONT){
        this.floatingStartPoint.set(this.polyline.points[0].x,this.polyline.points[0].y);
        this.floatingMidPoint.set(this.floatingEndPoint.x, this.floatingEndPoint.y);                  
    }else{
    	this.floatingStartPoint.set(this.polyline.points[this.polyline.points.length-1].x, this.polyline.points[this.polyline.points.length-1].y);
        this.floatingMidPoint.set(this.floatingEndPoint.x, this.floatingEndPoint.y); 	    
    }
	    
}
insertPoint( x, y) {
    
    let flag = false;
    let point = this.owningUnit.grid.positionOnGrid(x, y);

    var rect = new core.Rectangle(x - this.owningUnit.grid.getGridPointToPoint(),
                      y - this.owningUnit.grid.getGridPointToPoint() ,
                      2*this.owningUnit.grid.getGridPointToPoint(),
                      2*this.owningUnit.grid.getGridPointToPoint());

    let line = new core.Line();


    let tmp = new core.Point(point.x, point.y);
    let midium = new core.Point();

    //***add point to the end;
    this.points.push(point);

    let prev = this.points[0];
    this.points.forEach(function(next){
        if(prev!=next){
    	 if (!flag) {
            //***find where the point is - 2 points between the new one
            line.setLine(prev.x,prev.y, next.x,next.y);
            if (line.intersectRect(rect))
                flag = true;
         } else {
            midium.setLocationPoint(tmp); //midium.setPin(tmp.getPin());
            tmp.setLocationPoint(prev); //tmp.setPin(prev.getPin());
            prev.setLocationPoint(midium); //prev.setPin(midium.getPin());
         }
        }
        prev = next;
    });
    if (flag)
        prev.setLocationPoint(tmp); //prev.setPin(tmp.getPin());
}
removePoint(x, y) {
    let point = this.isBendingPointClicked(x, y);
    if (point != null) {
    	
    	var tempArr = this.points.filter(function(item) { 
    	    return item !== point;
    	});
        
    	this.points=tempArr;
    }
}
deleteLastPoint() {
	if (this.polyline.points.length == 0)
		return;

    if(this.resumeState==ResumeState.ADD_AT_FRONT){
        this.polyline.points.shift();
    }else{   
        this.polyline.points.pop();
    }	
	// ***reset floating start point
	if (this.polyline.points.length > 0)
					this.floatingStartPoint
									.set(this.polyline.points[this.polyline.points.length - 1]);    
}
isEndPoint(x,y){
    if (this.polyline.points.length< 2) {
        return false;
    }

    let point = this.isBendingPointClicked(x, y);
    if (point == null) {
        return false;
    }
    //***head point
    if (this.polyline.points[0].x == point.x && this.polyline.points[0].y == point.y) {
        return true;
    }
    //***tail point
    if ((this.polyline.points[this.polyline.points.length - 1].x == point.x )&& (this.polyline.points[this.polyline.points.length - 1].y == point.y)) {
        return true;
    }
    return false;	
}
getEndPoint(x,y){
    if (this.polyline.points.length< 2) {
        return null;
    }

    let point = this.isBendingPointClicked(x, y);
    if (point == null) {
        return null;
    }
    //***head point
    if (this.polyline.points[0].x == point.x && this.polyline.points[0].y == point.y) {
    	return this.polyline.points.get(0);
    }
    //***tail point
    if ((this.polyline.points[this.polyline.points.length - 1].x == point.x )&& (this.polyline.points[this.polyline.points.length - 1].y == point.y)) {
    	return (this.polyline.points.get(this.polyline.points.size() - 1));
    }
    return false;		
}
isInRect(r) {
	var result = true;
	this.polyline.points.some(function(wirePoint) {
			if (!r.contains(wirePoint)) {
				result = false;
				return true;
			}else{
			  return false;
			}
	});
	return result;
}
setSelected(selection) {
     super.setSelected(selection);
     if (!selection) {
        this.resizingPoint = null;
     }
}
isBendingPointClicked( x,  y) {
	var rect = d2.Box.fromRect(x
			- this.selectionRectWidth / 2, y - this.selectionRectWidth
			/ 2, this.selectionRectWidth, this.selectionRectWidth);

    let point = null;

	this.polyline.points.some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polyline.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}

move(xoffset, yoffset) {
	this.polyline.move(xoffset,yoffset);
}
mirror(line) {
    this.polyline.mirror(line);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotation;
	let box=this.polyline.box;
	if(center==undefined){
		this.polyline.rotate(alpha,box.center);
	}else{
		this.polyline.rotate(alpha,center);	 	
	}
	this.rotation=rotate;
}
rotate(rotation) {
	//fix angle
	let alpha=this.rotation+rotation.angle;
	if(alpha>=360){
	  alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotation=alpha;	
	this.polyline.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
calculateShape() {
	return this.polyline.box;
}


drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.polyline.points);	
}
isFloating() {
	return (!(this.floatingStartPoint
								.equals(this.floatingEndPoint) && this.floatingStartPoint
								.equals(this.floatingMidPoint)));
}
getResizingPoint() {
	return this.resizingPoint;
}

setResizingPoint(point) {
	this.resizingPoint = point;
}



}
module.exports ={
		Shape,
		CoordinateSystem,
		Ruler,
		AbstractLine
}
});

;require.register("core/text/d2font.js", function(exports, require, module) {
var d2=require('d2/d2');
//class TextureCache{
//	constructor(shape) {
//		this.shape=shape;
//		this.rotation=0;
//		this.fontSize=0;
//		this.text=0;
//	}
//	reset(shape,fontSize,text,rotation){
//		this.shape=shape;
//		this.rotation=rotation;
//		this.fontSize=fontSize;
//		this.text=text;
//	
//	}
//}
class FontTexture{
 constructor(text,tag,x,y,fontSize,rotation) {
    this.tag=tag;
	this.shape=new d2.FontText(x,y,text,fontSize,rotation);    
	this.selection=false;
	this.selectionRectWidth=3000;
	this.constSize=false;
	this.fillColor='#ffffff'; 
    this.shape.style='plain';
    this.isTextLayoutVisible=false;
	//this.cache=new TextureCache(this);
 }
clone(){
     var copy=new FontTexture(this.shape.text,this.tag,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.fontSize,this.shape.rotation);     
     copy.fillColor=this.fillColor;
     copy.shape.style=this.shape.style;
     copy.isTextLayoutVisible=this.isTextLayoutVisible;
     return copy;	 
 } 
isEmpty() {
     return this.shape.text==null||this.shape.text.length==0;
 }
isClicked(x,y){
    if (this.shape.text == null || this.shape.text.length == 0){
        return false;
    } 
    return this.shape.contains(new d2.Point(x,y));
    
}
getBoundingRect(){
    if (this.shape.text == null || this.shape.text.length == 0){
        return null;
    } 
    let box=this.shape.box;
    let rect= new d2.Rectangle(box.x,box.y,box.width,box.height);
    rect.rotate(this.shape.rotation,this.shape.anchorPoint);
    return rect;
}
getBoundingShape() {
    if (this.shape.text == null || this.shape.text.length == 0) {
          return null;
    }
     return this.shape.box;
}
setLocation(x,y){
	this.shape.setLocation(x,y);
}
setText(text){
	this.shape.setText(text);
}
setSize(size){
	this.shape.setSize(size);
}
setRotation(rotate,pt){	
  this.shape.rotate(rotate,pt);
}
move(xoffset, yoffset){
   this.shape.move(xoffset, yoffset);  
}
setSide(side,  line,  angle) { 
    this.shape.mirror(line); 
    this.shape.rotation=angle;
}
setSelected(selection){
	this.selection=selection;
}
paint(g2,viewportWindow,scale){
	 if(this.isEmpty()){
	   return;	 
	 }
	 if(this.constSize){
	   g2.font = ""+parseInt(this.shape.fontSize)+"px Monospace";
	 }else{	 
		 if(this.shape.fontSize*scale.getScale()<8){
			 return;
		 }
		 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
	 }
	 g2.fillStyle = this.fillColor;
	 
	 
//     let t=this.shape.clone();
//     t.scale(scale.getScale());
//     t.move(-viewportWindow.x,- viewportWindow.y);     
//     t.paint(g2);
  
	 this.shape.scalePaint(g2,viewportWindow,scale.getScale());
	 if(this.isTextLayoutVisible){
		let box=this.getBoundingRect();
	  	box.scale(scale.getScale());
	  	box.move(-viewportWindow.x,- viewportWindow.y);
		g2.lineWidth =1;
 		g2.strokeStyle = 'blue';
	  	box.paint(g2);
	 }
     if(this.selection){
 		 g2.lineWidth =1;
 		 g2.strokeStyle = 'blue';
 		 let p=this.shape.anchorPoint.clone();
         p.scale(scale.getScale());
         p.move(-viewportWindow.x,- viewportWindow.y);
         p.paint(g2);    	 
     }
	
}
toXML(){
    return (this.text=="" ? "" :
        this.shape.text + "," + utilities.roundFloat(this.shape.anchorPoint.x,3) + "," + utilities.roundFloat(this.shape.anchorPoint.y,3) +
        ",,PLAIN,"+this.shape.fontSize+"," +this.shape.rotation);	 
}
fromXML(node){
    if (node == null || node.length==0) {
        this.text = "";
        return;
    }
    var tokens=node.split(',');
    this.shape.anchorPoint.set(parseInt(tokens[1]),
            parseInt(tokens[2]));     
    
    this.shape.setText(tokens[0]);
    this.shape.setSize(parseInt(tokens[5]));
    this.shape.rotate(parseFloat(tokens[6])||0);
    
}
}
TextAlignment={
		  RIGHT:0,
		  TOP:1,
		  LEFT:2,
		  BOTTOM:3,
		  parse:function(align){
			  switch(align){
			  case 'LEFT':
				     return this.LEFT;
			  case 'RIGHT':
					 return this.RIGHT; 
			  case 'TOP':
					 return this.TOP;
			  case 'BOTTOM':
					 return this.BOTTOM;			 
			  default:
				  throw new TypeError('Unrecognized align type:'+align+' to parse');  
			  } 	  
		  },
		  mirror:function(align,isHorizontal){	          	               	                 
	               if(isHorizontal){
	                   if(align==this.LEFT)
	                     return this.RIGHT;
	                   else if(align==this.RIGHT)
	                     return this.LEFT;
	                   else
	                     return align;
	                  }else{
	                   if(align==this.BOTTOM)
	                     return this.TOP;
	                   else if(align==this.TOP)
	                     return this.BOTTOM;
	                   else
	                     return align;  
	                  }  
		  },
	      rotate:function(align,isClockwise){       
	           if(align==this.LEFT){
	              if(isClockwise)
	                return this.TOP;
	              else
	                return this.BOTTOM;
	           }else if(align==this.RIGHT){
	                if(isClockwise)
	                  return this.BOTTOM;
	                else
	                  return this.TOP;           
	            }else if(align==this.TOP){
	               if(isClockwise) 
	                   return this.RIGHT;
	               else
	                   return this.LEFT;           
	               }               
	               else if(align==this.BOTTOM){
	                if(isClockwise)
	                    return this.LEFT;
	                else
	                   return this.RIGHT;
	               }
	                      
	      },		  
	      getOrientation:function(align){
	    	  if(align==0||align==2){
	    		return  TextOrientation.HORIZONTAL; 
	    	  }else{
	    		return  TextOrientation.VERTICAL;  
	    	  }
	           
	      },
		  from:function(align){
			 switch(align){
			 case 0:return 'RIGHT';
			 case 1:return 'TOP';
			 case 2:return 'LEFT';
			 case 3:return 'BOTTOM';
			 } 
		  }
}
TextOrientation={
        HORIZONTAL:0,
        VERTICAL:1,        
}


class SymbolFontTexture{
	constructor(text,tag,x,y,alignment,fontSize) {
	    this.tag=tag;
		this.shape=new d2.BaseFontText(x,y,text,alignment,fontSize);    
		this.selection=false;
		this.selectionRectWidth=3000;
		this.constSize=false;		    
		this.selectionRectWidth=4;
		this.fillColor='#000000';
	    this.isTextLayoutVisible=false;
	}
	clone(){
	    var copy=new SymbolFontTexture(this.shape.text,this.tag,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.alignment,this.shape.fontSize);     
	    copy.fillColor=this.fillColor;
	    copy.shape.style=this.shape.style;
	    return copy;	 
	} 
	copy( _copy){    
	    this.shape.anchorPoint.set(_copy.shape.anchorPoint.x,_copy.shape.anchorPoint.y); 
	    this.shape.alignment = _copy.shape.alignment;
	    this.shape.text=_copy.shape.text;
	    this.shape.style=_copy.shape.style;
	    this.shape.rotation=_copy.shape.rotation;
	    this.fillColor=_copy.fillColor;
	    this.shape.setSize(_copy.shape.fontSize);                
	}	
	isEmpty() {
	     return this.shape.text==null||this.shape.text.length==0;
	}	
	isClicked(x,y){
	    if (this.shape.text == null || this.shape.text.length == 0){
	        return false;
	    } 
	    return this.shape.box.contains(x,y);
	    
	}	
	getBoundingShape() {
	    if (this.shape.text == null || this.shape.text.length == 0) {
	          return null;
	    }
	    return this.shape.box;
	}	
	setText(text){
		this.shape.setText(text);
	}
	setSize(size){
		this.shape.setSize(size);
	}	
	setSelected(selection){
		this.selection=selection;
	}	
	setAlignment(align){
		this.shape.alignment=align;
	}
	getAlignment(){
      return this.shape.alignment;
	}	
	rotate(rotation){		   
	   this.shape.anchorPoint.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
	   if(rotation.angle<0){  //clockwise
		   this.shape.alignment=TextAlignment.rotate(this.shape.alignment,true);
	   }else{
		   this.shape.alignment=TextAlignment.rotate(this.shape.alignment,false); 
	   }			 	
		
	}
	/*
	 * Take into account text offset from anchro point when rotating
	 */
	setRotation(rotation){
	   let oldorientation=TextAlignment.getOrientation(this.shape.alignment);	
	   this.rotate(rotation);
	   if(rotation.angle<0){  //clockwise		   
		   if(oldorientation == TextOrientation.HORIZONTAL){
			   this.shape.anchorPoint.set(this.shape.anchorPoint.x+(this.shape.metrics.ascent-this.shape.metrics.descent),this.shape.anchorPoint.y);            
		   }
		}else{		    
		   if(oldorientation == TextOrientation.VERTICAL){
			   this.shape.anchorPoint.set(this.shape.anchorPoint.x,this.shape.anchorPoint.y+(this.shape.metrics.ascent-this.shape.metrics.descent));	           
		   }
		}		
	}
	mirror(line){
        let oldalignment = this.shape.alignment;
        this.shape.mirror(line);
        if (line.isVertical) { //right-left mirroring
        	this.shape.alignment = TextAlignment.mirror(oldalignment,true);
        } else { //***top-botom mirroring
        	this.shape.alignment = TextAlignment.mirror(oldalignment,false);            
        }
	}
	setMirror(line){
		let alignment = this.shape.alignment;       
        this.mirror(line);      
        if (line.isVertical) { //right-left mirroring
            if (this.shape.alignment == alignment) { //same alignment
                this.shape.anchorPoint.set(this.shape.anchorPoint.x +
                                        (this.shape.metrics.ascent - this.shape.metrics.descent),this.shape.anchorPoint.y);
            }
        } else { //***top-botom mirroring          
            if (this.shape.alignment == alignment) {
                this.shape.anchorPoint.set(this.shape.anchorPoint.x,this.shape.anchorPoint.y +(this.shape.metrics.ascent - this.shape.metrics.descent));
            }
        } 		
	}
	move(xoffset, yoffset){
		this.shape.move(xoffset, yoffset);  
	}
	paint(g2,viewportWindow,scale){
		 if(this.isEmpty()){
			   return;	 
			 }
			 if(this.constSize){
			   g2.font = ""+parseInt(this.shape.fontSize)+"px Monospace";
			 }else{	 
				 if(this.shape.fontSize*scale.getScale()<8){
					 return;
				 }
				 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
			 }
			 
			 g2.fillStyle =this.fillColor;			 			 
			 this.shape.scalePaint(g2,viewportWindow,scale.getScale());
			if(this.isTextLayoutVisible){
				let box=this.shape.box;
			  	box.scale(scale.getScale());
			  	box.move(-viewportWindow.x,- viewportWindow.y);
				g2.lineWidth =1;
		 		g2.strokeStyle = 'blue';
			  	box.paint(g2);
			}

	     if(this.selection){
	 		 g2.lineWidth =1;
	 		 g2.strokeStyle = 'blue';
	 		 let p=this.shape.anchorPoint.clone();
	         p.scale(scale.getScale());
	         p.move(-viewportWindow.x,- viewportWindow.y);
	         p.paint(g2);    	 
	     }
		
	}	
	fromXML(node){
	    if (node == null || node.length==0) {
	        this.text = "";
	        return;
	    }
	    var tokens=node.split(',');
	    this.shape.alignment=(TextAlignment.parse(tokens[3]));
	    this.shape.setText(tokens[0]);
	    this.shape.anchorPoint.set(parseInt(tokens[1]),
	            parseInt(tokens[2]));  
	    if(tokens[4]){
	    	this.shape.style=tokens[4].toLowerCase();	
	    }
	    if(tokens[5]){    
	    	this.shape.setSize(parseInt(tokens[5]));
	    }

	}
	toXML(){
	    return (this.shape.text==="" ? "" :
	        this.shape.text + "," + utilities.roundFloat(this.shape.anchorPoint.x,1) + "," + utilities.roundFloat(this.shape.anchorPoint.y,1) +
	        ","+ TextAlignment.from(this.shape.alignment)+","+this.shape.style.toUpperCase()+","+this.shape.fontSize);	
	}
	}

var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   TextAlignment,TextOrientation,
   FontTexture,
   SymbolFontTexture
}
});

;require.register("core/text/d2glyph.js", function(exports, require, module) {
var d2=require('d2/d2');

class Glyph{

	constructor(){
	    this.character=null;
	    //distance to next symbol
	    this.delta=8;
	    this.segments=[];
	    
	    this.minx=0;
		this.miny=0;
	    this.maxx=0;
		this.maxy=0;  
	}
	clone(){	        
	        var copy=new Glyph();
	        copy.segments=[];
	        for(let i=0;i<this.segments.length;i++){
	           copy.segments.push(this.segments[i].clone());           
	        }
			copy.character=this.character;
	        copy.delta=this.delta;
			
	        copy.minx=this.minx;
		    copy.miny=this.miny;
	        copy.maxx=this.maxx;
		    copy.maxy=this.maxy;          
	        return copy;
	}

	    /*
	     * Enlarge to real size
	     * 200 1 mm 
	     */

	    /*Height comes in mm!!!!!!!!!!!!!!!!!!!!
	     * assume that the step is 0.1(20)
	     */
	scale(size){                        
	        let ratio=20*((size*10));
	        for(let i=0;i<this.segments.length;i++){
                 this.segments[i].scale(ratio);
	        }             
	        this.delta*=ratio;
	        this.resize();
	    }
	    //protected void 
	resize(){
	        this.minx=Number.MAX_VALUE;
	        this.miny=Number.MAX_VALUE;
	        this.maxx=Number.MIN_VALUE;
	        this.maxy=Number.MIN_VALUE;
	        
	        
	        for(let i=0;i<this.segments.length;i++){
	        	let box=this.segments[i].box;	            
	        	
	            if(this.minx>box.min.x){
	                this.minx=box.min.x;
	            }
	            if(this.miny>box.min.y){
	                this.miny=box.min.y;
	            }
	            if(this.maxx<box.max.x){
	              this.maxx=box.max.x;
	            }
	            if(this.maxy<box.max.y){
	              this.maxy=box.max.y;
	            }            
	        }
	}
	move(xoffset,yoffset){
		this.segments.forEach(function(segment){
			segment.move(xoffset,yoffset);
		});
		this.resize();
	}
	get width(){
	 return this.maxx-this.minx; 
	}
	    
	get height(){
	 return this.maxy-this.miny;  
	}

	setSize(size){
	  this.resetGlyph(size); 
	}
    get box(){
    	return new d2.Box(this.minx,this.miny,this.maxx,this.maxy);
    }
	resetGlyph(size){
	        let glyph = GlyphManager.getInstance().getGlyph(this.character);    
	        for(let i=0;i<this.segments.length;i++){
	          this.segments[i].ps.set(glyph.segments[i].ps);
	          this.segments[i].pe.set(glyph.segments[i].pe);
	        }
	        this.scale(size);
	}
	rotate(angle,pt) {
	        for(let i=0;i<this.segments.length;i++){
	        	this.segments[i].rotate(angle,pt);						
	        }
	        this.resize();
	}
	mirror(line){
        for(let i=0;i<this.segments.length;i++){
        	this.segments[i].mirror(line);						
        }
        this.resize();
	}
	fromXML(node){
		this.character=j$(node).attr("char");
		this.delta=parseInt(j$(node).attr("delta"));		
		let that=this;

		j$(node).children().each(function(){

		   let line=this.textContent;
		   let array=line.split(',');
		   that.segments.push(new d2.Segment(array[0],array[1],array[2],array[3]));
		});
		
	}
}

class GlyphTexture{
	constructor(text,tag, x,y,size){	    
		this.tag=tag;
	    this.id=1;
		this.anchorPoint = new d2.Point(x, y);
	    this.glyphs = [];
	    this.thickness = core.MM_TO_COORD(0.2);	    
		
	    this.selectionRectWidth=3000;        
	    this.text = text;
		this.height=0;
		this.width=0;
	    this.setSize(size);
		this.fillColor='gray';
	    this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
	    this.selection=false;	
	    this.rotation=0;
	    this.mirrored=false;
}
clone(){
	       var copy = new GlyphTexture(this.text,this.tag,this.x,this.y,this.size);
	       copy.anchorPoint = new d2.Point(this.anchorPoint.x,this.anchorPoint.y);       
		   copy.glyphs = [];
	       copy.width=this.width;
		   copy.height=this.height;    
		   this.glyphs.forEach(function(glyph) {
	            copy.glyphs.push(glyph.clone());
	       });
		   copy.mirrored=this.mirrored;
		   copy.rotation=this.rotation;
	       copy.thickness = this.thickness;
		   copy.fillColor=this.fillColor;
	       copy.layermaskId=this.layermaskId;		
			
	       return copy;
}
copy( _copy){    
    this.anchorPoint.set(_copy.anchorPoint.x,_copy.anchorPoint.y); 
    this.text = _copy.text;
    this.tag = _copy.tag;
    this.rotation=_copy.rotation;
    this.mirrored=_copy.mirrored;
    this.fillColor=_copy.fillColor;    
    this.thickness=_copy.thickness;
    this.setSize(_copy.size);                
}
clear() {
    this.glyphs=[];
    this.width=0;
    this.height=0;
}
setSelected(selection){
	this.selection=selection;
}
isEmpty() {
	   return this.text == null || this.text.length == 0;
}
resetGlyphText(text) {
        this.clear();
        if (text == null) {
            return null;
        }
        let result = "";

        for (let i=0;i<text.length;i++) {
            let glyph = GlyphManager.getInstance().getGlyph(text.charAt(i));
            if (glyph != null) {
                this.glyphs.push(glyph);
                result+=text.charAt(i);
            } else {
                this.glyphs.push(GlyphManager.getInstance().getGlyph('!'));
                result+='!';
            }             
        }
        return result;
}
resetGlyphsLine(){
	let xoffset = 0,yoffset=0;
    this.glyphs.forEach(function(glyph) {
        if(glyph.character==' '){
            xoffset += glyph.delta;
            this.width += glyph.delta;
            return;
        }
        //calculate its width
        glyph.resize();
        yoffset=glyph.height;
        for (let i = 0; i < glyph.segments.length ; i++) {        	
        	glyph.segments[i].move(this.anchorPoint.x + xoffset,this.anchorPoint.y); 			  		  
        }        
        xoffset += glyph.width + glyph.delta;
        this.height = Math.max(glyph.height+ glyph.miny, this.height);
        this.width += glyph.width + glyph.delta;
    }.bind(this));
    
    this.glyphs.forEach(function(glyph) {
        for (let i = 0; i < glyph.segments.length ; i++) {        	
        	glyph.segments[i].move(0,-this.height); 			  		  
        }        
    }.bind(this));
    
}
reset(){
    if (this.text == null) {
        return;
    }
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //arrange it according to anchor point
    this.resetGlyphsLine();
    //rotate
	this.glyphs.forEach(function(glyph){		  
		glyph.rotate(this.rotation,this.anchorPoint);		     
    }.bind(this));
}
setSize(size) {

    this.size=size;
    if(this.mirrored){
       let line=new d2.Line(this.anchorPoint,new d2.Point(this.anchorPoint.x,this.anchorPoint.y+100));
       this.mirror(true,line);
    }else{
       this.reset();
    }
}
setText(text) {
    //read original text
    this.text = text;
    if(this.mirrored){
      let line=new d2.Line(this.anchorPoint,new d2.Point(this.anchorPoint.x,this.anchorPoint.y+100));
      this.mirror(true,line);
    }else{
      this.reset();
    }
}
getBoundingShape() {
    if (this.text == null || this.text.length == 0) {
          return null;
    }
     return this.getBoundingRect().box;
}
//@private
getBoundingRect(){
    if(this.mirrored){
        let rect= new d2.Rectangle(this.anchorPoint.x-this.width,this.anchorPoint.y-this.height,this.width,this.height);
        rect.rotate(this.rotation,this.anchorPoint);
        return rect;
     }else{    	
        let rect= new d2.Rectangle(this.anchorPoint.x,this.anchorPoint.y-this.height,this.width,this.height);
        rect.rotate(this.rotation,this.anchorPoint);
        return rect;
     }	
}
isClicked(x,y){
    if (this.text == null || this.text.length == 0){
        return false;
    } 
    return this.getBoundingRect().contains(x,y);   
}
mirror(mirrored,line){
	this.mirrored=mirrored;
	
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //arrange it according to anchor point
    this.resetGlyphsLine();
    
    this.anchorPoint.mirror(line);
    this.glyphs.forEach(function(glyph){
       if(this.mirrored){
    	glyph.mirror(line);    	        
       } 
       glyph.rotate(this.rotation,this.anchorPoint);
        
    }.bind(this));
        
}
setSide(side,  line, angle) {
    this.mirrored=(side==core.Layer.Side.BOTTOM);
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));         
    this.anchorPoint.mirror(line);
    //arrange it according to anchor point
    this.resetGlyphsLine();

     //mirror text around anchor point
    let ln=new d2.Line(new d2.Point(this.anchorPoint.x,this.anchorPoint.y-20),new d2.Point(this.anchorPoint.x,this.anchorPoint.y+20));
    this.glyphs.forEach(glyph=>{
       if(this.mirrored){
           glyph.mirror(ln);                        
       }
       glyph.rotate(angle,this.anchorPoint);                   
    });
    
    let copper=core.Layer.Side.change(this.layermaskId);
    this.fillColor=copper.getColor();
    this.layermaskId=copper.getLayerMaskID();
    this.rotation=angle;
}

move(xoffset,yoffset) {
    this.anchorPoint.move(xoffset,yoffset);
    this.glyphs.forEach(function(glyph){
        glyph.move(xoffset,yoffset);
    }.bind(this));      
}
setLocation(x,y){
	let xx=x-this.anchorPoint.x;
	let yy=y-this.anchorPoint.y;
	this.move(xx,yy);
}
setRotation(rotate,pt){
	let alpha=rotate-this.rotation;
	this.anchorPoint.rotate(alpha,pt);
	this.glyphs.forEach(function(glyph){
		glyph.rotate(alpha,pt);   
	}.bind(this));	
	this.rotation=rotate;   	
}
rotate(rotate,pt){
	//fix angle
	let alpha=this.rotation+rotate;
	if(alpha>=360){
		alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotation=alpha;
	//rotate anchor point
	this.anchorPoint.rotate(rotate,pt);
	//rotate glyphs
	this.glyphs.forEach(function(glyph){
	   glyph.rotate(rotate,pt);   
	}.bind(this));	
		
}
paint(g2,viewportWindow,scale,layermaskId){
   if (this.isEmpty()) {
        return;
   }

   if (this.selection)
       g2.strokeStyle='gray';
   else
       g2.strokeStyle=this.fillColor;

   g2.lineWidth = this.thickness * scale.getScale();
   g2.lineCap = 'round';
   g2.lineJoin = 'round';
   
   this.glyphs.forEach(function(glyph){
	   for(let i=0;i<glyph.segments.length;i++){	
		   if(glyph.character==' '){
			   continue;
		   }
		   let copy=glyph.segments[i].clone();
		     copy.scale(scale.getScale());
			 copy.move(-viewportWindow.x,- viewportWindow.y);
	         copy.paint(g2); 
	   }
   });
   
   //let box=this.getBoundingRect();
   //box.scale(scale.getScale());
   //box.move(-viewportWindow.x,- viewportWindow.y);
   //box.paint(g2);
   
   if (this.selection){
       this.drawControlShape(g2,viewportWindow,scale);
   }   
}
drawControlShape(g2, viewportWindow,scale){
    utilities.drawCrosshair(g2, viewportWindow, scale, null, this.selectionRectWidth, [this.anchorPoint]);
}
toXML(){
    return (this.isEmpty()? "" :
        this.text + "," + utilities.roundFloat(this.anchorPoint.x,4) + "," + utilities.roundFloat(this.anchorPoint.y,4) +
        ",,"+utilities.roundFloat(this.thickness,2)+","+utilities.roundFloat(this.size,2)+","+utilities.roundFloat(this.rotation,2));	
}
fromXML(node){	
	if (node == null || j$(node).text().length==0) {
         this.text = "";
         return;
     }
	 var tokens=j$(node).text().split(',');
     this.text=tokens[0];
     
	 //layer?
     if(j$(node).attr("layer")!=null){
        this.layermaskId=core.Layer.Copper.valueOf(j$(node).attr("layer")).getLayerMaskID();
       }else{
    	this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
     }
     
	 
     this.anchorPoint.set(parseInt(tokens[1]),
             parseInt(tokens[2]));  

	 this.thickness=parseInt(tokens[4]); 
	 if(isNaN(this.thickness)){
		 this.thickness=2000;
	 } 
     let size=parseInt(tokens[5]);
     if(isNaN(size)){
    	 size=20000;
     }
     this.size=size;

	 let rotate=parseFloat(tokens[6]);
     if(isNaN(rotate)){
    	 rotate=0;
     }
	 this.rotation=rotate;
	 
	 //mirror?
     let side=core.Layer.Side.resolve(this.layermaskId);
	 if(side==core.Layer.Side.BOTTOM){
		this.mirrored=true;		 
	 }

	 //invalidate
	 this.setText(this.text);
}
}
var GlyphManager = (function () {

	var instance=null;
	 

	class manager{
	constructor(){
	   this.glyphs=new Map();	
	   this.initialize();
	}

	initialize(){
	  	    j$.ajax({
		        type: 'GET',
		        contentType: 'application/xml',
		        url: 'fonts/defaultfont.xml',
		        dataType: "xml",	        
		        success: j$.proxy(this.onLoadFont,this),
		        
		        error: function(jqXHR, textStatus, errorThrown){
		            	alert(errorThrown+":"+jqXHR.responseText);
		        },
		    });
	}

	onLoadFont(data){
	let that=this;
		 	   j$(data).find('symbol').each(function(){
	               var glyph=new Glyph();
				   glyph.fromXML(this);
				   that.glyphs.set(glyph.character,glyph);
		 	   });

	}	

	getGlyph(symbol){
	      let glyph= this.glyphs.get(symbol);    
	      if(glyph!=null){      
	        return glyph.clone();        
	      }
	      return null;
	    }
	}
	    return {
	        getInstance: function () {
	            if (!instance) {
	                instance = new manager();
	            }
	            return instance;
	        }
	    };
	})();

	var core=require('core/core');
	var utilities=require('core/utilities');
	
module.exports ={
			   Glyph,
			   GlyphTexture,
			   GlyphManager
			}	
});

;require.register("core/unit.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var shape = require('core/shapes');
var events=require('core/events');
var GlyphManager=require('core/text/d2glyph').GlyphManager;
var ViewportWindow=require('core/core').ViewportWindow;
var d2=require('d2/d2');

//**********************UnitMgr***************************************
var UnitMgr=(function(){
	var instance=null;
	//private
    function getPinsRect(shapes){
        var x1=Number.MAX_VALUE,y1=Number.MAX_VALUE,x2=Number.MIN_VALUE,y2=Number.MIN_VALUE;
        var isPinnable=false;        

        shapes.forEach(function(shape) {            
            if(typeof shape.getPinPoint === 'function'){
                let point=shape.getPinPoint();                
                x1 = Math.min(x1, point.x);
                y1 = Math.min(y1, point.y);
                x2 = Math.max(x2, point.x);
                y2 = Math.max(y2, point.y);                
                isPinnable=true;	
            }
            if(typeof shape.getPinsRect==='function'){
            	let box=shape.getPinsRect();
                x1 = Math.min(x1, box.min.x);
                y1 = Math.min(y1, box.min.y);
                x2 = Math.max(x2, box.max.x);
                y2 = Math.max(y2, box.max.y);                            	
            	isPinnable=true;
            }
           });
        
        if(isPinnable)
            return  d2.Box.fromRect(x1,y1,x2-x1,y2-y1);          
        else
            return null;  
        };

class manager{
        alignBlock(grid,shapes) {
            let r = getPinsRect(shapes);
            if (r == null) {
                return;
            }
            let point =grid.positionOnGrid(r.x, r.y); 
            
      	   shapes.forEach(function(shape) {
      		 shape.move((point.x - r.x),(point.y - r.y));
           });
        }
        moveBlock(shapes, xoffset,yoffset){
        	   shapes.forEach(function(shape) {
         		shape.move(xoffset,yoffset);
               });
         }    
        mirrorBlock(shapes,line){	
     	   shapes.forEach(function(shape) {
        		shape.mirror(line);
           });
        }
        rotateBlock(shapes, rotation){
       	   shapes.forEach(function(shape) {
        		shape.rotate(rotation);
                });
        }
        deleteBlock(unit,shapes){
        	shapes.forEach(function(shape) {               
               unit.remove(shape.uuid);
            });	
        }
        cloneBlock(unit,shapes){
            //***disselect old block
            unit.setSelected(false);
            shapes.forEach(function(shape) {
            	let copy = shape.clone();
            	copy.setSelected(true);
            	unit.add(copy);
            });
        }
        isBlockSelected(shapes){
            var count = 0;
    	    shapes.forEach(function(shape) {
                   if (shape.isSelected()) {
    					count++;
                    }  
               });
            return count > 1;
        }        
        getLabelByTag(unit,tag){
           let result=null;
       	   unit.shapes.some(function(shape) {
       		if(undefined !=shape['getTexture']){
       			let text=shape.getTexture();
       		    if (text.tag==tag){        			
        				result=shape;
        			    return true;
        			}
        				
            }
       		return false;
           });
            return result;
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
//**********************Unit*******************************************
class Unit{
    constructor(width,height) {
        //this.silent=false; 	 
    	this.scalableTransformation=new core.ScalableTransformation(8,4,13);
    	this.uuid=core.UUID();
    	this.shapes=[];
    	this.width=width;
    	this.height=height;
    	this.unitName="Unknown";
    	this.grid=new core.Grid(0.8,core.Units.MM);
        this.scrollPositionXValue = 0;
        this.scrollPositionYValue = 0;
        this.frame=new core.UnitFrame(this.width,this.height);
        this.coordinateSystem;//=new core.CoordinateSystem(this);
		this.ruler=new shape.Ruler();
		this.shapeFactory=null;
        
    }
setScrollPositionValue(scrollPositionXValue,scrollPositionYValue) {
        this.scrollPositionXValue = scrollPositionXValue;
        this.scrollPositionYValue = scrollPositionYValue;
       }
fireShapeEvent(event){
		if(!core.isEventEnabled)
			return;

		switch(event.type){
		  case events.Event.SELECT_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.DELETE_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.RENAME_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.ADD_SHAPE:	 
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		}       	
}
	
getCoordinateSystem(){
        return this.coordinateSystem;
    }
getSelectedShapes() {
       var v=[];
       var len=this.shapes.length;
 	   for(var i=0;i<len;i++){
            if (this.shapes[i].isSelected()) {
				v.push(this.shapes[i]);
            } 
 	    }
       return v;
    }	
release(){
		this.clear();
		
	}
clear(){
        //***go through all lists and delete them
 	   this.shapes.forEach(function(shape) {
 		  shape.owningUnit=null;
 		  shape.clear();
 		  shape=null;
       },this);
        this.shapes=[];	
	}
add(shape){
	 if(shape==undefined){
		return;	
	 }
	 shape.owningUnit=this;
	 this.shapes.push(shape);
	 this.fireShapeEvent({target:shape,type:events.Event.ADD_SHAPE});
}
getBoundingRect() {
        return this.getShapesRect(this.shapes);
    }
getShapesRect(shapes) {
        var r = new d2.Box(0,0,0,0);
        var x1 = Number.MAX_VALUE; 
        var y1 = Number.MAX_VALUE;
        var x2 = Number.MIN_VALUE;
        var y2 = Number.MIN_VALUE;

        //***empty schematic,element,package
        if (shapes.length == 0) {
            return r;
        }
        var len=shapes.length;
  	    for(var i=0;i<len;i++){
  	    	var tmp = shapes[i].getBoundingShape();
            if (tmp != null) {
                x1 = Math.min(x1, tmp.x);
                y1 = Math.min(y1, tmp.y);
                x2 = Math.max(x2, tmp.x+tmp.width);
                y2 = Math.max(y2, tmp.y+tmp.height);
            }
            
        }
        r.setRect(x1, y1, x2 - x1, y2 - y1);
        return r;
    }	
remove(uuid) {
 	   this.shapes = this.shapes.filter(function(item) { 
               if(item.getUUID()==uuid){
			      this.fireShapeEvent({target:item,type:events.Event.DELETE_SHAPE});
         	      item.clear();
         	      item=null;
				  return false;
			   }
			   return true;
        }.bind(this));
}  
getGrid(){
 	  return this.grid;
 	}
getUUID(){
 	  return this.uuid;  
 	}
getWidth(){
 		return this.width;
 	}
getHeight(){
 	return this.height;
 	}
buildClickedShapesList(x,  y,  isTextIncluded){
   var orderElements = [];
   let len=this.shapes.length;
   for(i=0;i<len;i++){   
       if(isTextIncluded){
    	if((undefined !=this.shapes[i]['getTextureByTag'])&&this.shapes[i].getClickedTexture(x, y)){                               
             orderElements.splice(0, 0, this.shapes[i]);
             continue;
        }
       }     
       if(this.isShapeVisibleOnLayers(this.shapes[i])&&this.shapes[i].isClicked(x, y)){
          orderElements.push(this.shapes[i]);       
       }  
   }
   return orderElements;
}
getClickedShape( x,  y,  isTextIncluded){
    let clickedShapes = this.buildClickedShapesList(x,y,isTextIncluded);
    if(clickedShapes.length==0){
        return null;
    }
    clickedShapes.sort(function(o1, o2){
       
            //both on same side
    	 if(o1.owningUnit.compositeLayer!=undefined){    
    	   let s1=core.Layer.Side.resolve(o1.copper.getLayerMaskID());
           let s2=core.Layer.Side.resolve(o2.copper.getLayerMaskID());
           let active=o1.owningUnit.compositeLayer.activeSide;
             //active layer has presedense
           if(s1!=s2){
               if(s1==active){
                     return -1;
                 }else{
                     return 1;
                 }
           }
    	 }

       if ((o1.getClickableOrder() - o2.getClickableOrder()) == 0)
           return 0;
       if ((o1.getClickableOrder() - o2.getClickableOrder()) > 0)
           return 1;
       else
           return -1;
       
   }.bind(this));
    
       
    return clickedShapes[0]; 
}
isShapeVisibleOnLayers(shape){
   if (undefined !=this.compositeLayer) {	
    if(shape.isVisibleOnLayers(this.compositeLayer.getLayerMaskID())){
      return true;
    }else{
      return false;  
    }    
   }else{
	   return true;
   }
}
//buildClickableOrderItem(x,  y,  isTextIncluded){
//     var orderElements = [];
//     var index = 0;
//     this.shapes.forEach(function(shape){
//         if(isTextIncluded){
//           	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
//           	    orderElements.push({index:index,orderWeight:0});
//           	}
//         }		 
//         
//		if(!shape.isClicked(x, y)){
//               index++;
//               return; 
//        }
//         //***give selected a higher priority
//        orderElements.push({index:index,
//         	                orderWeight:shape.isSelected() && shape.getOrderWeight() > 1 ? 2 : shape.getOrderWeight()});
//
//         index++;
//     }.bind(this));
//     return orderElements;
// }
//getClickedShape( x,  y,  isTextIncluded){
// 	       var result=null;
// 	       var orderElements=this.buildClickableOrderItem(x,y,isTextIncluded);
//
// 	       orderElements.sort(function(a,b) {
// 	    	   if (a.orderWeight < b.orderWeight){
// 		    	      return -1;
// 	    	   }
// 		       if (a.orderWeight > b.orderWeight){
// 		    	     return 1;
// 		       }	     
// 		       return 0;
// 		    });
// 	    
// 	       orderElements.some(function(item) {			   
// 	    	    var shape=this.shapes[item.index];
//				
//                 if(isTextIncluded){
//                 	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
//                 	    result=shape;
//                 		return true;
//                 	}
//                 }
// 	 		   
// 	 		    //if (shape.isClicked(x, y)) {
//                 result=shape;
// 				 return true;				 
//                //}  
//				 
//            }.bind(this));
// 		   
// 		   return result;
// 	}
isControlRectClicked( x,  y) {
         /*
          * if two symbols overlap and one is selected
          * then the selected should be checked for control rect click first
          */
         
         var shape = this.getShape(this.getSelected());		 
         if ((shape != null)&&(shape['isControlRectClicked']!=undefined)&&(shape.isControlRectClicked(x, y) != null)){
                return shape;
         }
         return null;
     }
getShapes(...args) {
	if(args.length==1){  //clazz
		let clazz=args[0];
        var selectionList=[];
  	    this.shapes.forEach(function(shape) {
            if (shape instanceof clazz) {
         	   selectionList.push(shape);				
            }
         });           
         return selectionList;
	}else{      //clazz,layerid
		let clazz=args[0];
		let layermaskId=args[1];
		
        var selectionList=[];
  	    for(let shape of this.shapes) {
            if ((shape instanceof clazz)&&(shape.isVisibleOnLayers(layermaskId))) {
         	   selectionList.push(shape);				
            }
         };           
         return selectionList;		
	}
 }    
getShape(uuid){
 	    if (uuid == null){
             return null;
         }    
 	   var shape=null;
 	   this.shapes.forEach(function(ashape) {
             if (ashape.getUUID()==uuid) {
                shape=ashape;
 				return;
             }
        }.bind(this));
 	   
         return shape;
 	}
getSelected() {
 	   var uuid=-1;
 	   this.shapes.forEach(function(shape) {
             if (shape.isSelected()) {
                 uuid=shape.getUUID();
 				return;
             }
        }.bind(this));
         return uuid;
     }
setSelectedShape(uuid,flag){
	   this.shapes.some(function(shape) {
		   if(shape.uuid==uuid){
			   shape.setSelected(flag);
			   return true;
		   }else{
			   return false;
		   }	
		   
       });	
} 	
setSelected(flag) {
 	   this.shapes.forEach(function(shape) {
 			shape.setSelected(flag);
        });
     }
setSelectedInRect(r){
 	   this.shapes.forEach(j$.proxy(function(shape) {
 	        if (shape.isInRect(r)) {
                 shape.setSelected(true);
             }
        },this));	
     }	
getScalableTransformation(){
 	  return this.scalableTransformation;
 	}
notifyListeners(eventType) {
  	   this.shapes.forEach(j$.proxy(function(shape) {
  		  this.fireShapeEvent({target:shape,type:eventType}); 
       },this));
 }	
 setSize(width,height){
     this.width = width;
     this.height = height;
     this.frame.setSize(width, height);	
 }
paint(g2, viewportWindow){
 	   let len=this.shapes.length;
 	   for(let i=0;i<len;i++){
 		   this.shapes[i].paint(g2,viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);  
 	   }
 	   //grid
       this.grid.paint(g2,viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
        //coordinate system
       if(this.coordinateSystem!=null){
         this.coordinateSystem.paint(g2, viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
       }	
         //ruler
	   this.ruler.paint(g2, viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
        //frame
       if(this.frame!=null){
	     this.frame.paint(g2, viewportWindow,this.scalableTransformation,core.Layer.LAYER_ALL);
       }
     }    
       
}

//**********************UnitContainer*******************************************
class UnitContainer{
	constructor(){
	      //this.silent= silent || false;;	
		  this.unitsmap=new Map();
		  this.unit=null;
		  this.fileName="";
		  this.libraryname="";
		  this.categoryname="";	
	}
    setFileName(fileName) {
        this.fileName = fileName;
        this.formatedFileName=this.fileName;
    }
	add(unit){
	  this.unitsmap.set(unit.getUUID(), unit);
      if(this.unitsmap.size==1){
          this.setActiveUnit(0);   
      }
      this.fireUnitEvent({target:unit,type:events.Event.ADD_UNIT});
      
	}
    delete( uuid) {
        var _unit = this.unitsmap.get(uuid);
        if(_unit==null){
            return;
        }
        _unit.release();
        this.fireUnitEvent({target:_unit,type:events.Event.DELETE_UNIT});
        if (_unit == this.unit) {
            this.unit = null;
        }
        _unit = null;
        this.unitsmap.delete(uuid);
    }
    clear(){
    	for(let item of this.unitsmap.keys()){
    		  this.delete(item);
    		  this.unitsmap.delete(item);
        };
		this.unitsmap.clear();
    }	
	getUnits() {
        return this.unitsmap.values();
    }
    setActiveUnitUUID(uuid){
    	this.unit=this.unitsmap.get(Number(uuid));
    }
	setActiveUnit(index) {	
	let units=this.unitsmap.values();
	  for(let i=0;i<this.unitsmap.size;i++){
        let aunit=units.next();
		if(index==i){
		  this.unit=aunit.value;
		  break;
		}
	  }
    }
	getUnit(){
	  return this.unit;
	}

	fireUnitEvent(event){
		if(!core.isEventEnabled)
			return;
		
		switch(event.type){
		  case events.Event.ADD_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.DELETE_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.SELECT_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.RENAME_UNIT:	 
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		}  		
	}	
}

//**********************UnitComponent*******************************************
class UnitComponent{
	constructor(hbar,vbar,canvas,popup){
	GlyphManager.getInstance();
    
	if(canvas!=null){	
        this.canvas = j$('#'+canvas);
  	  this.ctx = this.canvas[0].getContext("2d");
  	  
  	  //keypress
  	  j$('body').keydown(j$.proxy(this.keyPress,this));
  	  //right popup
  	  j$('body').on('contextmenu', '#'+canvas, function(e){ return false; });
  	  //mouse wheel event
  	  j$('#'+canvas).bind('mousewheel',j$.proxy(this.mouseWheelMoved,this));
  	  //mouse click event 
  	  j$('#'+canvas).on('mouseup',j$.proxy(this.mouseUp,this)); 
  	  j$('#'+canvas).on('mousedown',j$.proxy(this.mouseDown,this));
  	  j$('#'+canvas).on('mousemove',j$.proxy(this.mouseMove,this));
  	  j$(window).resize(j$.proxy(this.screenResized,this));
  	  j$('#'+canvas).dblclick(j$.proxy(this.dblClick,this));
  	}
	
    var container = j$(this.canvas).parent();	  
	this.width=j$(container).width();
	this.height=j$(container).height();

	//set canvas width
	this.canvas.attr('width',this.width);
	this.canvas.attr('height',this.height); 
	
	this.viewportWindow=new ViewportWindow(0,0,this.width,this.height);
	this.parameters=new Map();
	this.parameters.set("snaptogrid",false);
	if(hbar!=null&&vbar!=null){
		this.hbar = j$('#'+hbar);
		this.vbar=j$('#'+vbar);
		this.hbar.jqxScrollBar({ width: '100%', height: 18, min: 0, max: 100});
		this.vbar.jqxScrollBar({ width: 18, height:'100%', min: 0, max: 100, vertical: true});
		this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
		this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	}
	
	this.mode=core.ModeEnum.COMPONENT_MODE;
	this.backgroundColor="black";
	this.view=null;
	this.cursor=null;
	
}
resumeLine(line,handleKey,event) {	
	console.log(this.lineBendingProcessor);
	  line.resumeLine(event.x,event.y);
	  this.eventMgr.setEventHandle(handleKey,line);
} 
getMode(){
	return this.mode; 
} 
getEventMgr(){
	return this.eventMgr;
	}	  
getModel(){
	return this.model;
    }
setView(_view){
    this.view=_view; 
    }
getView(){
	return this.view;  
	}
getParameter(key) {
		return this.parameters.get(key); 
	}
	 
setParameter(key,value){
	    this.parameters.set(key,value); 
	}
setScrollPosition(x,y) {
    var xx=x*this.getModel().getUnit().getScalableTransformation().getScale();
    var yy=y*this.getModel().getUnit().getScalableTransformation().getScale();
    
    xx=parseInt(xx-(this.width/2));
    yy=parseInt(yy-(this.height/2));

    this.hbar.jqxScrollBar('setPosition',xx); 
    this.vbar.jqxScrollBar('setPosition',yy);
}
setSize( width, height){
     this.viewportWindow.setSize(width,height);      
 }
clear(){
	this.viewportWindow.setSize(1,1); 
    this.getEventMgr().resetEventHandle();
    this.getModel().clear();
  }
fireContainerEvent(event){
	
	  if(!core.isEventEnabled)
		return;
	
	  mywebpcb.trigger('container:inspector',event); 
}
keyPress(event){
	  if(event.target.tagName=="INPUT"){
		  return;
	  }
	  
	 //if(event.target instanceof HTMLBodyElement||event.target instanceof HTMLCanvasElement){
		 event.preventDefault();
	     if (this.getEventMgr().targetEventHandle != null && this.getModel().getUnit() != null) {
	            this.getEventMgr().targetEventHandle.keyPressed(event);
	     }
	 //}	 
}
getScaledEvent(event){
	  var x,y;
	  if (event.pageX != undefined && event.pageY != undefined) {
		   x = event.pageX;
		   y = event.pageY;
	  }else {
		   x = event.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
		   y = event.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	 }
	       x -= parseInt(this.canvas.offset().left);
	       y -= parseInt(this.canvas.offset().top);
	  
	  return new events.MouseScaledEvent(x,y,this.getModel().getUnit().getScalableTransformation().getInversePoint(this.viewportWindow.x+x,this.viewportWindow.y+y),event);     
}
dblClick(event){
	  event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		 return; 
	  }
		
    var scaledEvent =this.getScaledEvent(event);

	  if (this.getEventMgr().getTargetEventHandle() != null) {
	            this.getEventMgr().getTargetEventHandle().dblClick(scaledEvent);
	  } 	  
}
mouseUp(event){
    event.preventDefault();
	if (this.getModel().getUnit() == null) { 
			 return; 
    }
	this.canvas.off('mousemove',j$.proxy(this.mouseDrag,this));
	this.canvas.on('mousemove',j$.proxy(this.mouseMove,this));
	
    var scaledEvent =this.getScaledEvent(event);

	if (this.getEventMgr().getTargetEventHandle() != null) {
            this.getEventMgr().getTargetEventHandle().mouseReleased(scaledEvent);
    }      
	   	
}
mouseDrag(event){
    event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
			 return; 
	  }
       
     var scaledEvent =this.getScaledEvent(event);  
	  
	if(event.button==0&&this.getEventMgr().getTargetEventHandle() != null) {		
            this.getEventMgr().getTargetEventHandle().mouseDragged(scaledEvent);
      }
	   
  }
mouseMove(event){
	   event.preventDefault();
	   if (this.getModel().getUnit() == null) { 
			return; 
	   }
	   
	   var scaledEvent =this.getScaledEvent(event);  
	     
	   if(this.getEventMgr().getTargetEventHandle() != null) {		
	            this.getEventMgr().getTargetEventHandle().mouseMove(scaledEvent);
	   }

}
mouseWheelMoved(event){
    event.preventDefault();    
	  if (this.getModel().getUnit() == null) { 
		return; 
	  }
	var e=this.getScaledEvent(event);

	if(event.originalEvent.wheelDelta /120 > 0) {
		   this.ZoomOut(e.windowx,e.windowy);
      }
      else{
		   this.ZoomIn(e.windowx,e.windowy);
      }
}
ZoomIn(x,y){
    if(this.getModel().getUnit().getScalableTransformation().scaleIn()){
        this.viewportWindow.scaleIn(x,y, this.getModel().getUnit().getScalableTransformation());
        this.repaint();         
    }else{
        return false;
    } 
	this.hbar.off(); 
	this.vbar.off(); 

	//set new maximum 
	this.hbar.jqxScrollBar({ value:this.viewportWindow.x,width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
	this.vbar.jqxScrollBar({ value:this.viewportWindow.y,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});
	
	this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
	this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	
	return true;
}
ZoomOut(x,y){
    if(this.getModel().getUnit().getScalableTransformation().scaleOut()){
            this.viewportWindow.scaleOut(x,y, this.getModel().getUnit().getScalableTransformation());
            this.repaint();                       
    }else{
            return false;
    }

	this.hbar.off(); 
	this.vbar.off(); 
              //set new maximum 
   	this.hbar.jqxScrollBar({value:this.viewportWindow.x, width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
	this.vbar.jqxScrollBar({value:this.viewportWindow.y, width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});

	this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
	this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	
	return true;
}
vStateChanged(event){
    this.viewportWindow.y= parseInt(event.currentValue);
    this.repaint();
	
  }
hStateChanged(event){
    this.viewportWindow.x= parseInt(event.currentValue);
    this.repaint();
  }
screenResized(e){	  
	  var container = j$('#mycanvasframe');	  
	  var oldwidth=this.width;
	  this.width=j$(container).width()-18;  //mind combo width
	  
	  if(oldwidth==this.width){
		  return;
	  }
	  //set canvas width
	  this.canvas.attr('width',this.width);
	  this.componentResized();
	  this.repaint();
	}
componentResized(){
    if(this.getModel().getUnit()==null){
  	  this.setSize(1,1);
  	  this.hbar.jqxScrollBar({ width: this.width, height: 18, min: 0, max: 1});
		  this.vbar.jqxScrollBar({ width: 18, min: 0, max: 1, vertical: true});
    }else{
  	this.setSize(this.width,this.height); 
      
  	var hCurrentValue = this.hbar.jqxScrollBar('value');
      var vCurrentValue = this.vbar.jqxScrollBar('value');
  	
  	
		this.hbar.jqxScrollBar({ value:hCurrentValue,width:this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
		this.vbar.jqxScrollBar({ value:vCurrentValue,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height), vertical: true});
    }  
	  
}
setContainerCursor(_cursor) {
    this.cursor = _cursor;
}
getContainerCursor() {
    return this.cursor;
}
repaint(){
	  if(this.getModel().getUnit()!=null){
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height); 
	  this.getModel().getUnit().paint(this.ctx,this.viewportWindow);
      if (this.cursor != null) {
      	this.cursor.paint(this.ctx,this.viewportWindow, this.getModel().getUnit().getScalableTransformation(),core.Layer.Copper.All.getLayerMaskID());

      }
	  }else{
	        this.ctx.clearRect(0, 0, this.width, this.height);  
	  }
}
}
module.exports ={
		Unit,
		UnitContainer,
		UnitComponent,
		UnitMgr
}

});

;require.register("core/utilities.js", function(exports, require, module) {
var core=require('core/core');
var d2=require('d2/d2');

    /*
     * Find out in which quadrant is a point B, in regard to a point origine A
     *
     *        2   |  1
     *        ----------
     *        3   |  4
     */
var QUADRANT=(function(){
	return{
        FIRST:1,
        SECOND:2,
        THIRD:3,
        FORTH:4
	}
})();

var POSITION=(function(){
	return{
        TOP_LEFT:1,
        BOTTOM_RIGHT:2,
        findPositionToLine:function(x,y,l1,l2){
        	if(l1.y==l2.y){ //horizontal line
        	   if(y<l1.y){
        		   return POSITION.TOP_LEFT;
        	   }else{
        		   return POSITION.BOTTOM_RIGHT;
        	   }	
        	}else{ 	//vertical line
         	   if(x<l1.x){
        		   return POSITION.TOP_LEFT;
        	   }else{
        		   return POSITION.BOTTOM_RIGHT;
        	   }	        		
        	}
        }
	}
})();


var POINT_TO_POINT=8;

var roundDouble=function(number){
	return roundFloat(number,4);
}

var round=function(angle){
	return Math.round(angle*100.0)/100.0;
}

var roundFloat=function(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
var mirrorPoint=function(A,B,sourcePoint){
        let x = sourcePoint.x, y = sourcePoint.y;
        //***is this right-left mirroring
        if (A.x == B.x) {
            //***which place in regard to x origine
            if ((x - A.x) < 0)
                x = A.x + (A.x - x);
            else
                x = A.x - (x - A.x);
        } else { //***top-botom mirroring
            //***which place in regard to y origine
            if ((y - A.y) < 0)
                y = A.y + (A.y - y);
            else
                y = A.y - (y - A.y);
        }

        sourcePoint.setLocation(x, y);
        return sourcePoint;	
}
var getQuadrantLocation=function(origin,point) {
        if (point.x >= origin.x && point.y <= origin.y)
            return QUADRANT.FIRST;
        else if (point.x <= origin.x && point.y <= origin.y)
            return QUADRANT.SECOND;
        else if (point.x <= origin.x && point.y >= origin.y)
            return QUADRANT.THIRD;
        else
            return QUADRANT.FORTH;
}
var drawCrosshair=function(g2,viewportWindow,scale,resizingPoint,length,points){
        let line = new d2.Segment(0,0,0,0);
        
		g2.lineWidth = 1;

        points.forEach(function(point){
            if (resizingPoint != null && resizingPoint.equals(point))
                g2.strokeStyle = 'yellow';
            else
                g2.strokeStyle='blue';
			
            line.set(point.x - length, point.y, point.x + length, point.y);
            line.scale(scale.getScale());
            line.move(-viewportWindow.x,-viewportWindow.y);
            line.paint(g2);

            line.set(point.x, point.y - length, point.x, point.y + length);            
            line.scale(scale.getScale());
            line.move(-viewportWindow.x,-viewportWindow.y);
            line.paint(g2);
        });	

}

var radians = function(degrees) {
	  return degrees * Math.PI / 180;
};
	 
var degrees = function(radians) {
	  return radians * 180 / Math.PI;
};

//var rotate=function(point, originX, originY, angle){
//	angle = angle * Math.PI / 180.0;
//		return {
//				x: Math.cos(angle) * (point.x-originX) - Math.sin(angle) * (point.y-originY) + originX,
//				y: Math.sin(angle) * (point.x-originX) + Math.cos(angle) * (point.y-originY) + originY
//	    };
//};

/*****
*
*   Intersect Line with Line
*
*****/
var intersectLineLine = function(a1, a2, b1, b2) {
    var result=false;
    
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
};
/*****
*
*   Intersect Line with Rectangle
*
*****/
var intersectLineRectangle = function(a1, a2, r1, r2) {
    var min        = Min(r1,r2);
    var max        = Max(r1,r2);
    var topRight   = new d2.Point( max.x, min.y );
    var bottomLeft = new d2.Point( min.x, max.y );
    
    var inter1 = intersectLineLine(min, topRight, a1, a2);
    var inter2 = intersectLineLine(topRight, max, a1, a2);
    var inter3 = intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = intersectLineLine(bottomLeft, min, a1, a2);
    
    return inter1||inter2||inter3||inter4;
};
var Min=function(p1,p2){
	return new d2.Point(Math.min(p1.x,p2.x),Math.min(p1.y,p2.y));	
}
var Max=function(p1,p2){
    return new d2.Point(Math.max(p1.x,p2.x),Math.max(p1.y,p2.y));	
}
//*******DELETE*************
//var roundrect=function (g2,x, y, w, h, r) {
//	if (w < 2 * r) r = w / 2;
//	if (h < 2 * r) r = h / 2;
//		g2.moveTo(x+r, y);
//		g2.arcTo(x+w, y,   x+w, y+h, r);
//		g2.arcTo(x+w, y+h, x,   y+h, r);
//		g2.arcTo(x,   y+h, x,   y,   r);
//		g2.arcTo(x,   y,   x+w, y,   r);
//};

var hexToDec=function(hex) {
	var result = 0, digitValue;
	hex = hex.toLowerCase();
	for (var i = 0; i < hex.length; i++) {
		digitValue = '0123456789abcdefgh'.indexOf(hex[i]);
		result = result * 16 + digitValue;
	}
	return result;
}
version=(function(){
	return {
		MYWEBPCB_VERSION:"8.0",
	    SYMBOL_VERSION:"8.0",
        CIRCUIT_VERSION:"8.0",     
        FOOTPRINT_VERSION:"8.0", 
        BOARD_VERSION:"8.0" 
	};
})();

module.exports = {
  version,
  round,
  roundDouble,
  roundFloat,
  getQuadrantLocation,  
  drawCrosshair,
  intersectLineRectangle,
  intersectLineLine,
  degrees,
  radians,
  hexToDec,
  QUADRANT,
  POINT_TO_POINT,
  POSITION,
  mirrorPoint
}

});

;require.register("core/views/panelview.js", function(exports, require, module) {
var core=require('core/core');

//**********************BaseBuilder*******************************************
var BaseBuilder=Backbone.View.extend({
	  initialize:function(component){
		this.component=component;  
	  }, 	
	  setTarget:function(target){
		  this.target=target;
	  },
	  fillComboBox:function(items){
		  var result="";
		  var len = items.length;
		  for (var i=0; i<len; ++i) {
			  if(items[i].selected!=undefined&&items[i].selected==true){
				 selected="selected"; 
			  }else{
				 selected=""; 
			  }
			  result+="<option value='"+items[i].id+"' "+selected+">"+ items[i].value+"</option>";
		  }
		  return result;
	  },
	  reloadComboBox:function(combo,items){
			j$('#'+combo).empty();  
			  var len = items.length;
			  for (var i=0; i<len; ++i) {
				  if(items[i].selected!=undefined&&items[i].selected==true){
					  j$('#'+combo).append('<option value=' + items[i].id + ' selected>' +  items[i].value + '</option>'); 
				  }else{
					  j$('#'+combo).append('<option value=' + items[i].id + '>' +  items[i].value + '</option>');
				  }
			  }			
	  },
	  validateAlignmentComboText:function(combo,texture){
		if(texture.alignment.getOrientation()==OrientEnum.HORIZONTAL){
			this.reloadComboBox(combo,[{id:0,value:'LEFT',selected:true},{id:1,value:'RIGHT'}]);
		}else{
			this.reloadComboBox(combo,[{id:2,value:'TOP',selected:true},{id:3,value:'BOTTOM'}]);
		}
		j$('#'+combo).val(texture.alignment.get());
	  },
	  
	  toUnitX:function(value){        
	      var coordinateSystem=this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	    	  return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value-coordinateSystem.x);  
	      else
	          return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value);      
	  },
	  toUnitY:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value-coordinateSystem.y);
	      else
	    	return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value);	  
	  },  
	  fromUnitX:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value))+coordinateSystem.x;
	      else
	    	return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value));	  
	  },
	  fromUnitY:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value))+coordinateSystem.y;
	      else
	    	return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value));  
	  }
	  
});

module.exports ={
		BaseBuilder
}
});

;require.register("d2/d2.js", function(exports, require, module) {
		
var d2 ={
		
};

require("./shapes/fonttext")(d2);
require("./shapes/point")(d2);
require("./shapes/box")(d2);
require("./shapes/line")(d2);
require("./shapes/segment")(d2);
require("./shapes/vector")(d2);
require("./shapes/polygon")(d2);
require("./shapes/rectangle")(d2);
require("./shapes/hexagon")(d2);
require("./shapes/arc")(d2);
require("./shapes/circle")(d2);
require("./shapes/roundrectangle")(d2);
require("./shapes/oval")(d2);
require("./shapes/obround")(d2);
require("./shapes/polyline")(d2);
require("./shapes/ellipse")(d2);
require("./shapes/arcellipse")(d2);
require("./shapes/utils")(d2);

module.exports = d2;
});

require.register("d2/shapes/arc.js", function(exports, require, module) {
module.exports = function(d2) {

  d2.Arc = class Arc {
        /**
         *
         * @param {Point} pc - arc center
         * @param {number} r - arc radius
         * @param {number} startAngle - start angle in degrees from 0 to 360
         * @param {number} endAngle - end angle in degrees from -360 to 360        
         */
        constructor(pc=new d2.Point(), r=1, startAngle=0, endAngle=360) {
            this.pc = pc;
            this.r = r;
            this.startAngle = startAngle;
            this.endAngle = endAngle;            
        } 
        clone(){
           return new d2.Arc(this.pc.clone(),this.r,this.startAngle,this.endAngle);  	
        }
        get area(){
           return  ( Math.PI * this.r*this.r ) * ( this.sweep / 360 )	
        }
        get center(){
        	return this.pc;
        }
        get start() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate(this.startAngle, this.pc);
            return p0;
        }
                
        get middle() {
            let angle = this.endAngle>0 ? this.startAngle + this.sweep/2 : this.startAngle - this.sweep/2;
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate(angle, this.pc);
            return p0;
        }
        get length() {
            return Math.abs(this.sweep * this.r);
        }
        get end() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate((this.startAngle+this.endAngle), this.pc);
            return p0;
        }
        
        get sweep(){
        	return Math.abs(this.endAngle);
        }
        get box(){
        	let points = [];
            let p1=this.pc.clone();p1.translate(this.r, 0);
            if (p1.on(this)) {
                points.push(p1);
            }            
            let p2=this.pc.clone();p2.translate(0,this.r);
            if (p2.on(this)) {
                points.push(p2);
            }            
            let p3=this.pc.clone();p3.translate(-this.r,0);
            if (p3.on(this)) {
                points.push(p3);
            }
            let p4=this.pc.clone();p4.translate(0,-this.r);
            if (p4.on(this)) {
                points.push(p4);
            }
        	
            points.push(this.start);
            points.push(this.end);
            return new d2.Box(points);
        }
      
        get vertices() {
            return this.box.vertices;
        }
        
        isPointOn(pt,diviation){
    		let isInside=false;
        	let clickedAngle =new d2.Vector(this.pc,pt).slope;    		            		
    		let angle = 360 - clickedAngle;		
    		//test angle		
    	    if(this.endAngle>0){ //counter clockwise    	    	
    	    	if(angle-this.startAngle>0){
    	    	  angle=(angle-this.startAngle);
    	    	}else{
    	    	  angle=((360-this.startAngle)+angle);	
    	    	}
    	    	isInside=(angle<this.endAngle);
    	    }else{ //clockwise    	    	
    	    	if((angle-this.startAngle)>0){
    	    	  angle=((angle-360)-this.startAngle);	
    	    	}else{
    	    	  angle=angle-this.startAngle;
    	    	}
    	    	isInside=(Math.abs(angle)<Math.abs(this.endAngle));
    	    }    		
    		if(!isInside){
    			return false;
    		}
    		//test distance
    		let dist=this.pc.distanceTo(pt);

    		return ((this.r-diviation)<dist&&(this.r+diviation)>dist);
    			    		
        }
        contains(pt){
        	//is on circle
            if (!d2.utils.EQ(this.pc.distanceTo(pt), this.r)){
            	//is outside of the circle
            	if (d2.utils.GE(this.pc.distanceTo(pt), this.r)){
                    return false;
            	}                
            }
        	
            let l=new d2.Line(this.pc,this.middle);
        	let projectionPoint=l.projectionPoint(pt);
        	
        	let mid=new d2.Point((this.start.x+this.end.x)/2,(this.start.y+this.end.y)/2);  
        	
        	let dist1=this.middle.distanceTo(mid);
        	let dist2=this.middle.distanceTo(projectionPoint);
        	
        	return d2.utils.GE(dist1,dist2);

        }
        move(offsetX,offsetY){
          this.pc.move(offsetX,offsetY);	
        }
        rotate(angle,center = {x:0, y:0}){
        	 this.pc.rotate(angle,center);
        	 this.startAngle+=angle;
        	 if(this.startAngle>=360){
        		 this.startAngle-=360;
        	 }
        	 if(this.startAngle<0){
        		 this.startAngle+=360; 
        	 }
        }
        mirror(line){
        	this.pc.mirror(line);
        	this.endAngle=-1*this.endAngle;
        	if(line.isVertical){
        		if(this.startAngle>=0&&this.startAngle<=180){
        		  this.startAngle=180-this.startAngle;  
        		}else{
        		  this.startAngle=180+(360-this.startAngle);		
        		}
        	}else{
        		this.startAngle=360-this.startAngle; 
        	}	
        	
        }
        scale(alpha){
           this.pc.scale(alpha);
           this.r*=alpha;
        }
        convert(start,extend){
    		
    		let s = 360 - start;
    		let e=0;
    		if(extend>0){
    		 e = 360 - (start+extend); 
    		}else{
    		 if(start>Math.abs(extend)){  	
    		   e = s+Math.abs(extend); 
    		 }else{
               e = Math.abs(extend+start);   		 
    		 }		 
    		}
    		return  [s,e];
        }
        paint(g2){
        	g2.beginPath();
        	//convert to HTML Canvas API
    		let angles=this.convert(this.startAngle,this.endAngle);
        	g2.arc(this.pc.x,this.pc.y,this.r, d2.utils.radians(angles[0]), d2.utils.radians(angles[1]),this.endAngle>0);        	
        	
        	if(g2._fill!=undefined&&g2._fill){
          	  g2.fill();	
          	}else{
          	  g2.stroke();
          	}            
        	
            //let ps=this.start;
            //let pe=this.end;
            //let pm=this.middle;
            //d2.utils.drawCrosshair(g2,5,[p1,p2,p3,p4]);
            
        }
        

    }
}
});

;require.register("d2/shapes/arcellipse.js", function(exports, require, module) {
module.exports = function(d2) {
    /**
    *
    * @param {Point} pc - arc center
    * @param {number} w - horizontal radius
    * @param {number} w - vertical radius
    * @param {number} startAngle - start angle in degrees from 0 to 360
    * @param {number} endAngle - end angle in degrees from -360 to 360        
    */
    d2.Arcellipse = class Arcellipse extends d2.Ellipse {
        constructor(pc,w,h) {
      	    super(pc,w,h);    	
            this.startAngle = 20;
            this.rotation=0;
            this.endAngle = 90;
            this.vert=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)]; 
        }
        clone(){
        	let copy=new d2.Arcellipse(this.pc.clone(),this.w,this.h);
            copy.startAngle = this.startAngle;
            copy.endAngle = this.endAngle;
        	copy.rotation=this.rotation;
        	return copy;
        }
        get center(){
        	return this.pc;
        }
        get start() {
        	let angles=this._convert(this.startAngle,this.endAngle);
            let x=this.pc.x+(this.w*Math.cos(d2.utils.radians(angles[0])));
            let y=this.pc.y+(this.h*Math.sin(d2.utils.radians(angles[0])));
            
            let p=new d2.Point(x,y);
            p.rotate(this.rotation,this.pc);
            return  p;
        }
        
        get end() {
        	let angles=this._convert(this.startAngle,this.endAngle);
            let x=this.pc.x+(this.w*Math.cos(d2.utils.radians(angles[1])));
            let y=this.pc.y+(this.h*Math.sin(d2.utils.radians(angles[1])));
            
            let p=new d2.Point(x,y);
            p.rotate(this.rotation,this.pc);
            return  p; 
        }
        get vertices(){        	
            this.vert[0].set(this.pc.x-this.w,this.pc.y);
            this.vert[1].set(this.pc.x,this.pc.y-this.h);
            this.vert[2].set(this.pc.x+this.w,this.pc.y);
            this.vert[3].set(this.pc.x,this.pc.y+this.h);       	        	
            let s=this.start;
            let e=this.end;
            this.vert[4].set(s.x,s.y);
            this.vert[5].set(e.x,e.y);   
            return this.vert;
        }
        _convert(start,extend){
    		
    		let s = 360 - start;
    		let e=0;
    		if(extend>0){
    		 e = 360 - (start+extend); 
    		}else{
    		 if(start>Math.abs(extend)){  	
    		   e = s+Math.abs(extend); 
    		 }else{
               e = Math.abs(extend+start);   		 
    		 }		 
    		}
    		return  [s,e];
        } 
        mirror(line){
        	this.pc.mirror(line);
        	this.endAngle=-1*this.endAngle;
        	if(line.isVertical){
        		if(this.startAngle>=0&&this.startAngle<=180){
        		  this.startAngle=180-this.startAngle;  
        		}else{
        		  this.startAngle=180+(360-this.startAngle);		
        		}
        	}else{
        		this.startAngle=360-this.startAngle; 
        	}	
        	
        }        
        paint(g2){
        	g2.beginPath();  
           	
        	//d2.utils.drawCrosshair(g2,5,[this.start,this.end]);
        	
           	let alpha=this.convert(this.rotation);           	
           	let angles=this._convert(this.startAngle,this.endAngle);
           	
           	
           	g2.beginPath();
           	g2.ellipse(this.pc.x,this.pc.y,this.w, this.h,alpha,d2.utils.radians(angles[0]), d2.utils.radians(angles[1]),this.endAngle>0);
        	  if(g2._fill!=undefined&&g2._fill){
            	  g2.fill();	
              }else{
            	  g2.stroke();
              }
        }         
        
    }
}
});

;require.register("d2/shapes/box.js", function(exports, require, module) {
module.exports = function(d2) {

  d2.Box = class Box {
	  constructor(...args) {
          if (typeof(args[0]) == "number") {   // 4 numbers for min and max points
              this.min = new d2.Point(args[0],args[1]);
              this.max = new d2.Point(args[2],args[3]);
              return;
          }
          
          if(arguments.length==1){              //array of points
        	  let x=Number.MAX_VALUE,y=Number.MAX_VALUE;
        	  for(var i = 0; i < arguments[0].length; ++ i){
        	     x=Math.min(x,arguments[0][i].x);
        	     y=Math.min(y,arguments[0][i].y);
        	  }  
        	  this.min=new d2.Point(x,y);

        	  x=Number.MIN_VALUE,y=Number.MIN_VALUE;
        	  for(var i = 0; i < arguments[0].length; ++ i){
         	     x=Math.max(x,arguments[0][i].x);
         	     y=Math.max(y,arguments[0][i].y);
         	  }  
        	  this.max=new d2.Point(x,y);
        	  return;
          }
	  }
	  static fromRect(x,y,width,height){
			var box=new d2.Box(0,0,0,0);
			box.setRect(x,y,width,height);
			return box;
	  }
	  clone(){
		  return new d2.Box([this.min,this.max]);
	  }
	  get area(){
		 return (this.max.x-this.min.x)*(this.max.y-this.min.y);  
	  }
	  setRect(x,y,width,height){
		  this.min.set(x,y);
		  this.max.set(x+width,y+height);
	  }
      get center() {
          return new d2.Point( (this.min.x + this.max.x)/2, (this.min.y + this.max.y)/2 );
      }
      get x(){
    	 return this.min.x; 
      }
      get y(){
    	  return this.min.y; 
      }
      get width(){
    	  return this.max.x-this.min.x;
      }
      
      get height(){
    	  return this.max.y-this.min.y;
      }
      scale(alpha){
    	this.min.scale(alpha);
    	this.max.scale(alpha);
      }
      /**
       * Returns new box merged with other box
       * @param {Box} other_box - Other box to merge with
       * @returns {Box}
       */
      merge(other_box) {
          return new d2.Box(
              this.min === undefined ? other_box.min.x : Math.min(this.min.x, other_box.min.x),
              this.min === undefined ? other_box.min.y : Math.min(this.min.y, other_box.min.y),
              this.max === undefined ? other_box.max.x : Math.max(this.max.x, other_box.max.x),
              this.max === undefined ? other_box.max.y : Math.max(this.max.y, other_box.max.y)
          );
      }
      
      contains(...args){
    	if(args.length==1){  //point  
    	  if(this.min.x<=args[0].x&&args[0].x<=this.max.x){
    	    if(this.min.y<=args[0].y&&args[0].y<=this.max.y)
    		  return true;
    	  }
    	  return false;
    	}else{       //coordinates
      	  if(this.min.x<=args[0]&&args[0]<=this.max.x){
      	    if(this.min.y<=args[1]&&args[1]<=this.max.y)
      		  return true;
      	  }
      	  return false;    		
    	}  
      }
      not_intersects(other) {
          return (
              this.max.x < other.min.x ||
              this.min.x > other.max.x ||
              this.max.y < other.min.y ||
              this.min.y > other.max.y
          );
      }
      move(offsetX,offsetY){
    	  this.min.move(offsetX,offsetY);
    	  this.max.move(offsetX,offsetY);
      }
      intersects(other) {
    	  if (other instanceof d2.Box) {
    		  return !this.not_intersects(other);  
    	  }else{
    		  //window rect
    		  let o=new d2.Box(other.x,other.y,other.x+other.width,other.y+other.height);
    		  return !this.not_intersects(o);
    	  }
          
      }
      
	  get vertices() {
		 return [this.min,new d2.Point(this.max.x,this.min.y),this.max,new d2.Point(this.min.x,this.max.y)];	
	  }
      paint(g2){
    	    g2.beginPath();
    	    g2.rect(this.min.x,this.min.y,this.width,this.height);                   
        	  if(g2._fill!=undefined&&g2._fill){
            	  g2.fill();	
              }else{
            	  g2.stroke();
              }
      }
  }
}
});

;require.register("d2/shapes/circle.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Circle = class Circle {
        /**
        *
        * @param {Point} pc - circle center point
        * @param {number} r - circle radius
        */
       constructor(pc, r) {
           this.pc = pc;
           this.r = r;
       }
       clone() {
           return new d2.Circle(this.pc.clone(), this.r);
       } 
       get area(){
           return  ( Math.PI * this.r*this.r );	
       }
       get center() {
           return this.pc;
       }
       get radius(){
    	   return this.r;
       }
       get box() {
           return new d2.Box(
               this.pc.x - this.r,
               this.pc.y - this.r,
               this.pc.x + this.r,
               this.pc.y + this.r
           );
       }       
	   get vertices() {
		   return [new d2.Point(this.pc.x-this.r,this.pc.y),new d2.Point(this.pc.x,this.pc.y-this.r),new d2.Point(this.pc.x+this.r,this.pc.y),new d2.Point(this.pc.x,this.pc.y+this.r)];
	   }
       contains(pt){
    	   return d2.utils.LE(pt.distanceTo(this), this.r);    	   
       }
       rotate(angle,center = {x:this.pc.x, y:this.pc.y}){
    	  this.pc.rotate(angle,center);    	  
       }
       move(offX,offY){
    	  this.pc.move(offX,offY); 
       }
       mirror(line){
    	   this.pc.mirror(line);
       }
       scale(alpha){
    	   this.pc.scale(alpha);
    	   this.r*=alpha;
       }
       grow(offset){
     	  this.r+=offset; 
       }
       paint(g2){
       	g2.beginPath();       	
       	g2.arc(this.pc.x,this.pc.y,this.r,0,2*Math.PI,true);
    	  if(g2._fill!=undefined&&g2._fill){
        	  g2.fill();	
          }else{
        	  g2.stroke();
          }
       }       
       
    }
}    
});

;require.register("d2/shapes/ellipse.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Ellipse = class Ellipse {
        constructor(pc,w,h) {
            this.pc = pc;
            this.w = w;
            this.h=h;
        	this.vert=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)];        	        	
            this.rotation=0;
        }
        clone(){
        	let copy=new d2.Ellipse(this.pc.clone(),this.w,this.h);
        	copy.rotation=this.rotation;
        	return copy;
        }
        get box(){
        	let topleft=this.pc.clone();
        	topleft.move(-this.w,-this.h);
        	let rect=new d2.Rectangle(topleft,2*this.w,2*this.h);
        	rect.rotate(this.rotation,this.pc);
        	return rect.box;
        }
		rotate(angle,center = {x:this.box.center.x, y:this.box.center.y}){
			this.pc.rotate(angle,center);
			this.rotation=angle;
		}
        scale(alpha){
     	   this.pc.scale(alpha);
     	   this.w*=alpha;
     	   this.h*=alpha;
        }
        contains(pt,g) {
        	let x=pt.x;
        	let y=pt.y;
        	let alpha=this.convert(this.rotation);
            var cos = Math.cos(alpha),
                sin = Math.sin(alpha);
            var dx  = (x - this.pc.x),
                dy  = (y - this.pc.y);
            var tdx = cos * dx + sin * dy,
                tdy = sin * dx - cos * dy;

            return (tdx * tdx) / (this.w * this.w) + (tdy * tdy) / (this.h * this.h) <= 1;
        }
		resize(offX,offY,pt){
		  if(pt.equals(this.vert[0])){
				let point=this.vert[0];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				let x=pt.x +v.x;
				//let y=pt.y + v.y;
				if(this.pc.x>x){
				  this.w=this.pc.x-x;
				}
		  }else if(pt.equals(this.vert[1])){
				let point=this.vert[1];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				//let x=pt.x +v.x;
				let y=pt.y + v.y;
				if(this.pc.y>y){
				  this.h=this.pc.y-y;
				}
		  }else if(pt.equals(this.vert[2])){
				let point=this.vert[2];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				let x=pt.x +v.x;
				//let y=pt.y + v.y;
				if(x>this.pc.x){
				   this.w=x-this.pc.x;
				}
		  }else{
				let point=this.vert[3];
				point.move(offX,offY);

				let v1=new d2.Vector(pt,point);
				let v2=new d2.Vector(this.pc,pt);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				//let x=pt.x +v.x;
				let y=pt.y + v.y;
				if(y>this.pc.y){
				   this.h=y-this.pc.y;
				}
		  }
		}
        get vertices(){        	
          this.vert[0].set(this.pc.x-this.w,this.pc.y);
          this.vert[1].set(this.pc.x,this.pc.y-this.h);
          this.vert[2].set(this.pc.x+this.w,this.pc.y);
          this.vert[3].set(this.pc.x,this.pc.y+this.h);        	        	
          return this.vert;
        }
        move(offsetX,offsetY){
            this.pc.move(offsetX,offsetY);       	
        }
        mirror(line){
        	this.pc.mirror(line);	
        }
        convert(a){
          return -1*d2.utils.radians(a);	
        }
        paint(g2){
        	g2.beginPath();  
           	
           	let alpha=this.convert(this.rotation);
           	
           	g2.ellipse(this.pc.x,this.pc.y,this.w, this.h,alpha, 0, 2 * Math.PI);
        	  if(g2._fill!=undefined&&g2._fill){
            	  g2.fill();	
              }else{
            	  g2.stroke();
              }
        }         
        
    }
}
});

;require.register("d2/shapes/fonttext.js", function(exports, require, module) {
var fontmetrics=require('d2/text/fontmetrics');

/*Text Rectangle
*
*                  |-ascent----------------|
*                  |                       |
*       anchorPoint|-----------------------|
*                  |_descent_______________|
*
*
*
*
*
*/
class TextMetrics{
	 constructor() {
		    this.BUG_FONT_SIZE=100;
		    this.updated = false;
	        this.fontSize=-1;
	        this.width=this.height=0;
	        this.descent=0;
	        this.ascent=0;
	        this.xHeight=0;
		 }	
	
updateMetrics() {
       this.updated=false;
       this.fontSize=-1;
}
/*
calculateMetrics(fontSize,text) {
	    if(this.fontSize!=fontSize){
	        this.fontSize=fontSize;
	        this.updated = false;
	    }else{
	       return;	
	    }     
	    
	    var ctx=fontmetrics.getCanvasContext();	    	    
	    	    
        	let metrics = fontmetrics.FontMetrics({
		    	  fontFamily: 'Monospace',
		    	  fontWeight: 'normal',
		    	  fontSize: 10,
		    	  origin: 'baseline'
   	        });
        	
        	ctx.font=""+this.fontSize+"px Monospace";		
            this.width=ctx.measureText(text).width;
            this.xHeight=metrics.xHeight;
    	    this.ascent=Math.abs(metrics.ascent*this.fontSize);
	        this.descent=Math.abs(metrics.descent*this.fontSize);
	        this.height=this.fontSize;	     
	    
	        this.updated=true; 
	    	    
	       	 
}
*/
calculateMetrics(fontSize,text) {
    this.fontSize=fontSize;    
    var ctx=fontmetrics.getCanvasContext();	    	    
    	    
    	let metrics = fontmetrics.FontMetrics({
	    	  fontFamily: 'Monospace',
	    	  fontWeight: 'normal',
	    	  fontSize: 10,
	    	  origin: 'baseline'
	        });
    	
    	ctx.font=""+this.fontSize+"px Monospace";		
        this.width=ctx.measureText(text).width;
        this.xHeight=metrics.xHeight;
	    this.ascent=Math.abs(metrics.ascent*this.fontSize);
        this.descent=Math.abs(metrics.descent*this.fontSize);
        this.height=this.fontSize;	     
    
        this.updated=true; 	
}
}
/*
TextAlignment={
		  RIGHT:0,
		  TOP:1,
		  LEFT:2,
		  BOTTOM:3;
}
*/
module.exports = function(d2) {
	d2.BaseFontText = class BaseFontText{
		constructor(x,y,text,alignment,fontSize){
			this.anchorPoint=new d2.Point(x,y);
			this.text=text;
			this.fontSize=fontSize;
		    this.alignment=alignment;	
		    this.style='plain';
		    this.metrics=new TextMetrics();  
		    this.metrics.calculateMetrics(this.fontSize,this.text);
		}
clone(){
			let copy=new BaseFontText(this.anchorPoint.x,this.anchorPoint.y,this.text,this.alignment,this.fontSize);		
			copy.style=this.style;
			return copy;
		}
mirror(line){
	 this.anchorPoint.mirror(line); 	
}
setText(text){
			this.text=text;
			this.metrics.calculateMetrics(this.fontSize,this.text);
		}	
setSize(size){
	this.fontSize=size;
	this.metrics.calculateMetrics(this.fontSize,this.text);
}
scale(alpha){
  	this.anchorPoint.scale(alpha);
	this.fontSize=parseInt(this.fontSize*alpha);
	this.metrics.calculateMetrics(this.fontSize,this.text);
	
}
setLocation(x,y){
	this.anchorPoint.set(x,y);			
}
move(offsetX,offsetY){
	this.anchorPoint.move(offsetX,offsetY);
}
get box(){
    if (this.text == null || this.text.length == 0){
        return null;
    }   
    //recalculate or buffer
    //this.metrics.calculateMetrics(this.fontSize, this.text);
    var b=null;
	 switch(this.alignment){
	   case 2:
		  b= d2.Box.fromRect(this.anchorPoint.x,this.anchorPoint.y-this.metrics.ascent,this.metrics.width,this.metrics.height);	    
	    break;
	   case 0:
		  b= d2.Box.fromRect(this.anchorPoint.x-this.metrics.width,this.anchorPoint.y-this.metrics.ascent,this.metrics.width,this.metrics.height);
	   break;
	   case 1:
		    b=d2.Box.fromRect(this.anchorPoint.x - this.metrics.ascent,
	                          this.anchorPoint.y, this.metrics.height,this.metrics.width);
	   break;	   
	   case 3:
		   	 b= d2.Box.fromRect(this.anchorPoint.x - this.metrics.ascent,
	                          this.anchorPoint.y - this.metrics.width,
	                          this.metrics.height, this.metrics.width);
	   break;	   	 
	 }
	 
	 return b;
	 
}		
scalePaint(g2,viewportWindow,alpha){
	let scaledAnchorPoint=this.anchorPoint.clone();			
  	scaledAnchorPoint.scale(alpha);
  	scaledAnchorPoint.move(-viewportWindow.x,- viewportWindow.y);
  	
	let scaledFontSize=parseInt(this.fontSize*alpha);
	
	
	g2.font =(this.style==='plain'?'':this.style)+" "+(scaledFontSize)+"px Monospace";
	g2.textBaseline='alphabetic'; 
    switch(this.alignment){
	   case 2:
	   	 	g2.textAlign = 'left';				   	 
	   	 	g2.fillText(this.text, scaledAnchorPoint.x, scaledAnchorPoint.y); 
	   break;
	   case 0:
	   	 	g2.textAlign = 'right';
	   	 	g2.fillText(this.text, scaledAnchorPoint.x, scaledAnchorPoint.y);
	   break;
	   case 3:
		   	g2.save();
		   	g2.textAlign = 'left';
		   	g2.translate(scaledAnchorPoint.x, scaledAnchorPoint.y);
		   	g2.rotate(-0.5*Math.PI);
		   	g2.fillText(this.text , 0, 0);
		   	g2.restore();
	   break;
	   case 1:
		   g2.save();
		   g2.textAlign = 'right';
		   g2.translate(scaledAnchorPoint.x, scaledAnchorPoint.y);
		   g2.rotate(-0.5*Math.PI);
		   g2.fillText(this.text , 0, 0);
		   g2.restore();	   	   
	}	
}	
paint(g2){				 
		
		g2.font =(this.style==='plain'?'':this.style)+" "+(this.fontSize)+"px Monospace";
				 let r=this.box;
				 g2.lineWidth=1;
				 r.paint(g2);
				 
	    g2.textBaseline='alphabetic'; 
	    switch(this.alignment){
				   case 2:
				   	 g2.textAlign = 'left';				   	 
					 g2.fillText(this.text, this.anchorPoint.x, this.anchorPoint.y); 
				   break;
				   case 0:
				   	 g2.textAlign = 'right';
					 g2.fillText(this.text, this.anchorPoint.x, this.anchorPoint.y);
				   break;
				   case 1:
				   g2.save();
				   g2.textAlign = 'left';
				   g2.translate(this.anchorPoint.x, this.anchorPoint.y);
			       g2.rotate(-0.5*Math.PI);
			       g2.fillText(this.text , 0, 0);
			       g2.restore();
				   break;
				   case 3:
				   g2.save();
				   g2.textAlign = 'right';
				   g2.translate(this.anchorPoint.x, this.anchorPoint.y);
			       g2.rotate(-0.5*Math.PI);
			       g2.fillText(this.text , 0, 0);
			       g2.restore();	   	   
				 }
				 
	     d2.utils.drawCrosshair(g2,6,[this.anchorPoint]);
	     
	}		
		
};		
/*******************************************************************************************/	
	d2.FontText = class FontText{
		constructor(x,y,text,fontSize,rotation){
			this.anchorPoint=new d2.Point(x,y);
			this.text=text;
			this.fontSize=fontSize;
		    this.rotation=rotation;	
		    this.style='plain';
		    this.metrics=new TextMetrics();  
		    this.metrics.calculateMetrics(this.fontSize,this.text);
		}
		clone(){
			let copy=new FontText(this.anchorPoint.x,this.anchorPoint.y,this.text,this.fontSize,this.rotation);		
			copy.style=this.style;
			return copy;
		}
		setText(text){
			this.text=text;
			this.metrics.calculateMetrics(this.fontSize,this.text);
		}
		setSize(size){
			this.fontSize=size;
			this.metrics.calculateMetrics(this.fontSize,this.text);
		}
		scale(alpha){
	      	this.anchorPoint.scale(alpha);
			this.fontSize=parseInt(this.fontSize*alpha);
			this.metrics.calculateMetrics(this.fontSize,this.text);
			
		}
		setLocation(x,y){
			this.anchorPoint.set(x,y);			
		}
		move(offsetX,offsetY){
			this.anchorPoint.move(offsetX,offsetY);
		}
		rotate(angle, center = {x:this.anchorPoint.x, y:this.anchorPoint.y}) {        	
        	this.anchorPoint.rotate((angle-this.rotation),center);
        	this.rotation=angle;
        	this.metrics.calculateMetrics(this.fontSize,this.text);
        }
		mirror(line){
			 this.anchorPoint.mirror(line); 	
		}
		//anchor point is text center
		get box(){
			let ps=this.anchorPoint.clone();
			ps.move(-(this.metrics.width/2),-(this.metrics.height/2));
			
			let pe=this.anchorPoint.clone();
			pe.move(this.metrics.width/2,this.metrics.height/2);			
			return new d2.Box([ps,pe]);	
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){			   
			
			/*
			 * Based on the assumption that anchorPoint is middle normal aligned
			 */
			
			let ps=this.anchorPoint.clone();
			ps.move(-(this.metrics.width/2),0);
			
			let pe=this.anchorPoint.clone();
			pe.move(this.metrics.width/2,0);
			
			let l=new d2.Line(ps,pe);
			l.rotate(this.rotation,this.anchorPoint);

        	let projectionPoint=l.projectionPoint(pt);
        	
		    let a=(projectionPoint.x-ps.x)/((pe.x-ps.x)==0?1:pe.x-ps.x);
		    let b=(projectionPoint.y-ps.y)/((pe.y-ps.y)==0?1:pe.y-ps.y);

		    let dist=projectionPoint.distanceTo(pt);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(Math.abs(this.metrics.xHeight * (this.fontSize)))){
		        	return true;
		        }    
		    	
		    }
			return false;        	
		}
		/*
		 * Avoid recalculating text metrics!!!!!!!!!
		 */
		scalePaint(g2,viewportWindow,alpha){
			let scaledAnchorPoint=this.anchorPoint.clone();			
	      	scaledAnchorPoint.scale(alpha);
	      	scaledAnchorPoint.move(-viewportWindow.x,- viewportWindow.y);
			let scaledFontSize=parseInt(this.fontSize*alpha);
			
			
			g2.font =(this.style==='plain'?'':this.style)+" "+(scaledFontSize)+"px Monospace";
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.save();
			g2.translate(scaledAnchorPoint.x,scaledAnchorPoint.y);
			
			g2.rotate(d2.utils.radians(360-this.rotation));
			
//			if(0<=this.rotation&&this.rotation<90){
//			  g2.rotate(d2.utils.radians(360-this.rotation));
//			}else if(90<=this.rotation&&this.rotation<=180){
//			  g2.rotate(d2.utils.radians(180-this.rotation));	
//			}else{
//			  g2.rotate(d2.utils.radians(360-(this.rotation-180)));	
//			}
            //let box=this.box;
            //box.move(-this.anchorPoint.x,-this.anchorPoint.y);
            //box.paint(g2);
            
			g2.fillText(this.text,0,0);				
			g2.restore();
			
		}		
		paint(g2){					
			g2.font =(this.style==='plain'?'':this.style)+" "+(this.fontSize)+"px Monospace";
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.save();
			g2.translate(this.anchorPoint.x,this.anchorPoint.y);
			g2.rotate(d2.utils.radians(360-this.rotation));
//			if(0<=this.rotation&&this.rotation<90){
//			  g2.rotate(d2.utils.radians(360-this.rotation));
//			}else if(90<=this.rotation&&this.rotation<=180){
//			  g2.rotate(d2.utils.radians(180-this.rotation));	
//			}else{
//			  g2.rotate(d2.utils.radians(360-(this.rotation-180)));	
//			}
            //let box=this.box;
            //box.move(-this.anchorPoint.x,-this.anchorPoint.y);
            //box.paint(g2);
            
			g2.fillText(this.text,0,0);				
			g2.restore();

		}
	}

}
});

;require.register("d2/shapes/hexagon.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Hexagon = class Hexagon extends d2.Polygon {
    	constructor(center,width) {
    		super();
    		this.center=center;
    		this.width=width;    		
    		this.reset();
    	}
    	clone(){
    		let copy=new Hexagon(this.center.clone(),this.width);    	    
    		copy.points=[];
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    		return copy;
    	}
    	scale(alpha){
        	this.center.scale(alpha);
        	this.width*=alpha;  
        	super.scale(alpha);        	              	  
        }    	
		setWidth(width){
			  this.width=width;
			  this.reset();			    
		}
		grow(offset) {
		       this.width += 2 * offset;
		       let a =(2*offset)/Math.sqrt(3);
		            

		       let v=new d2.Vector(0,0);
		        
		            for(i=0;i<this.points.length;i++){
		                v.set(this.center, this.points[i]);
		                let norm = v.normalize();
		                let x = this.points[i].x + a * norm.x;
		                let y = this.points[i].y + a * norm.y;
		        
		                this.points[i].set(x, y);
		            }
		            
		            
		}		
        move(offsetX,offsetY){
        	this.center.move(offsetX,offsetY);
            this.points.forEach(point=>{
            	point.move(offsetX,offsetY);
            });	
        }        
        mirror(line) {        
          super.mirror(line);
          this.center.mirror(line);
        }
		rotate(angle,center = {x:this.center.x, y:this.center.y}){
			this.center.rotate(angle,center);
			super.rotate(angle,center);
		}        
    	reset(){
    		this.points=[];
    		
            let da = (2 * Math.PI) / 6;
            let lim = (2 * Math.PI) - (da / 2);

            let r=this.width/2;
            var point=new d2.Point(r * Math.cos(0), r * Math.sin(0));
            point.move(this.center.x,this.center.y);            
            this.add(point);
			for (let a = da; a < lim; a += da) {
                point=new d2.Point(r * Math.cos(a),r * Math.sin(a));
                point.move(this.center.x,this.center.y);
                this.add(point);
			}      		
    	}
   	
    	
    	
    }
}
});

;require.register("d2/shapes/line.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Line = class Line{
		constructor(p1,p2) {
			this.p1=p1;
			this.p2=p2;
		}
	    /*
	     * Find point belonging to line, which the pt projects on.
	     */
		projectionPoint(pt){
			let v1=new d2.Vector(this.p1,pt);
			let v2=new d2.Vector(this.p1,this.p2); 	
		    
			let v=v1.projectionOn(v2);
	    	//translate point
			let x=this.p1.x +v.x;
			let y=this.p1.y +v.y;
		    return new d2.Point(x,y);
		}
		get isHorizontal(){
			let v=new d2.Vector(this.p1,this.p2);
			let oy=new d2.Vector(1,0);
			//are they colinear?
			return d2.utils.EQ(v.cross(oy),0);			
		}
		get isVertical(){
			let v=new d2.Vector(this.p1,this.p2);
			let oy=new d2.Vector(0,1);
			//are they colinear?
			return d2.utils.EQ(v.cross(oy),0);
		}
        rotate(angle,center){            
            this.p1.rotate(angle,center);
            this.p2.rotate(angle,center);            
        }
        get vertices() {
            return [this.p1.clone(),this.p2.clone()];
        }
		paint(g2){			
			g2.moveTo(this.p1.x, this.p1.y);
			g2.lineTo(this.p2.x, this.p2.y);
			
			g2.stroke();
		}
	
	}
}
});

;require.register("d2/shapes/obround.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Obround = class Obround{
		/**
		 * Obround is regarded as a line with variable thickness
		 * @input pt - center 
		 * @input width - relative,  line width + 2  arcs at both ends
		 * this.width=ps to pe + 2 rcs radius
		 * @input height - relative but still height
		 * @warning obround may change its width and height - it should recalculate its size
		 */
		constructor(pt,width,height) {
			this.pc=pt.clone();
			this.width=width;
			this.height=height;
			this.ps;
			this.pe;
			this.reset();
		}
		clone(){
			let copy=new Obround(this.pc,this.width,this.height);
			copy.ps.x=this.ps.x;
			copy.ps.y=this.ps.y;
			
			copy.pe.x=this.pe.x;
			copy.pe.y=this.pe.y;
			return copy;
		}
		get box(){
			 let r=this.getDiameter()/2;
	         //first point		 
			 let v=new d2.Vector(this.pe,this.ps);
			 let n=v.normalize();
			 let a=this.ps.x +r*n.x;
			 let b=this.ps.y +r*n.y;			 
			 
			 			 
			 v.rotate90CW();
			 let norm=v.normalize();
			 
			 let x=a +r*norm.x;
			 let y=b +r*norm.y;			 
			 let pa=new d2.Point(x,y);
			 
			 norm.invert();
			 x=a +r*norm.x;
			 y=b +r*norm.y;			 
			 let pb=new d2.Point(x,y);
			 //second point
			 v=new d2.Vector(this.ps,this.pe);
			 n=v.normalize();
			 let c=this.pe.x +r*n.x;
			 let d=this.pe.y +r*n.y;			 
			 
			 v.rotate90CW();
			 norm=v.normalize();
			 
			 x=c +r*norm.x;
			 y=d +r*norm.y;			 
			 let pc=new d2.Point(x,y);
			 
			 norm.invert();
			 x=c +r*norm.x;
			 y=d +r*norm.y;			 
			 let pd=new d2.Point(x,y);
			 
			 return new d2.Box(
		                [
		                pa,pb,pc,pd]
		            );			
		}
		setWidth(width){
			this.width=width;	
			this.reset();
		}
		setHeight(height){
		    this.height=height;
		    this.reset();
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){			
			let l=new d2.Line(this.ps,this.pe);
        	let projectionPoint=l.projectionPoint(pt);
			
		    let a=(projectionPoint.x-this.ps.x)/((this.pe.x-this.ps.x)==0?1:this.pe.x-this.ps.x);
		    let b=(projectionPoint.y-this.ps.y)/((this.pe.y-this.ps.y)==0?1:this.pe.y-this.ps.y);
		    
		    let dist=projectionPoint.distanceTo(pt);
		    //arc diameter
		    let r=(this.width>this.height?this.height:this.width);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(r/2)){
		        	return true;
		        }    
		    	
		    }
        	
		    //check the 2 circles
        	if (d2.utils.LE(this.ps.distanceTo(pt), r/2)){
                return true;
        	}
        	if (d2.utils.LE(this.pe.distanceTo(pt), r/2)){
                return true;
        	}
        	return false;
		    
		}
		get center(){
			return this.pc;
		}		
		reset(){
			let w=0,h=0;
			if(this.width>this.height){  //horizontal
			  w=this.width;
			  h=this.height;
   			  let d=(w-h);//always positive
			  this.ps=new d2.Point(this.pc.x-(d/2),this.pc.y);
			  this.pe=new d2.Point(this.pc.x+(d/2),this.pc.y);								   	
			}else{						 //vertical
			  w=this.height;
			  h=this.width;
  			  let d=(w-h);//always positive
			  this.ps=new d2.Point(this.pc.x,this.pc.y-(d/2));
			  this.pe=new d2.Point(this.pc.x,this.pc.y+(d/2));								   				  
			}
		}
    	rotate(angle,center = {x:this.pc.x, y:this.pc.y}){
    	   this.pc.rotate(angle,center);
      	   this.ps.rotate(angle,center);
      	   this.pe.rotate(angle,center);      	   
      	}
    	scale(alpha){
      	  this.pc.scale(alpha);
      	  this.ps.scale(alpha);
      	  this.pe.scale(alpha);
      	  this.width*=alpha;
      	  this.height*=alpha;
      	  
      	}
        mirror(line){
            this.pc.mirror(line);
            this.ps.mirror(line);
            this.pe.mirror(line);        
        }    	
        move(offsetX,offsetY){
            this.pc.move(offsetX,offsetY);
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);
        }  
	    grow(offset){
	        if(d2.utils.GE(this.width,this.height)){
	            this.height +=  2*offset;
	        } else {
	            this.width +=  2*offset;
	        }
	    }
	    getDiameter(){
	        if(d2.utils.GE(this.width,this.height)){
	            return this.height;
	        } else {
	            return this.width;
	        }
	    }
	    
		paint(g2){
			g2.beginPath();
			let l=g2.lineWidth;
			g2.lineWidth=this.getDiameter();
			g2.lineCap="round";
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();		    
			g2.lineWidth =l;
		}
			
	}
}
});

;require.register("d2/shapes/oval.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Oval = class Oval extends d2.Rectangle{
		constructor(p1,width,height) {
		  super(p1,width,height);	
		  this.width=0;
		  this.height=0;
		  this.arc=0;
		  this.segments=[];
	      this.arcs=[];
	         
		  this.setWidth(width);
		  this.setHeight(height);
		  
		  this.reset();
		}
        createArc(center, start, end){
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            
            let r = (new d2.Vector(center, start)).length;
            return new d2.Arc(center, r, startAngle, 180);        	
        }
        findArcPoints(p1,p2,p3,p4){
    		  let pt=p1;
      		  let v=new d2.Vector(pt,p2);
      		  let norm=v.normalize();  		  
      		  let x=pt.x +(this.arc/2)*norm.x;
      		  let y=pt.y + (this.arc/2)*norm.y;  			
      		  let A=new d2.Point(x,y);
      		  
    		  //end angle point 
   		      pt=p4;
   		      v=new d2.Vector(pt,p3);
   		      norm=v.normalize();		  
   		      x=pt.x +(this.arc/2)*norm.x;
   		      y=pt.y +(this.arc/2)*norm.y;			
   		      let B=new d2.Point(x,y);		  		  
   		   
   		   
   		      //center is the mid point
   		      let C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
   		   
              return [C,A,B];   		     
        }
        //****TEST************
        eval(g2){
      //*********************LEFT****************************  	
  		  //start angle point
//  		  let pt=this.points[0];
//  		  let v=new d2.Vector(pt,this.points[1]);
//  		  let norm=v.normalize();  		  
//  		  let x=pt.x +(this.arc/2)*norm.x;
//  		  let y=pt.y + (this.arc/2)*norm.y;  			
//  		  let A=new d2.Point(x,y);    
//  		  //d2.utils.drawCrosshair(g2,10,[A]);
//  		  
//  		  
//		  //end angle point 
//		   pt=this.points[3];
//		   v=new d2.Vector(pt,this.points[2]);
//		   norm=v.normalize();		  
//		   x=pt.x +(this.arc/2)*norm.x;
//		   y=pt.y +(this.arc/2)*norm.y;			
//		   let B=new d2.Point(x,y);		  		  
//		   //d2.utils.drawCrosshair(g2,10,[B]);
//		   
//		   //center is the mid point
//		   let C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
//		   //d2.utils.drawCrosshair(g2,10,[C]);
//		     
//		   let arc=this.createArc(C,A,B);
//		   arc.paint(g2);
		   
			let r=this.findArcPoints(this.points[0],this.points[1],this.points[2],this.points[3]);  
			let arc=this.createArc(r[0],r[1],r[2]);			
			arc.paint(g2);	
       //************************RIGHT************************
//	  		  //start angle point
//	  		 pt=this.points[1];
//	  		 v=new d2.Vector(pt,this.points[0]);
//	  		 norm=v.normalize();  		  
//	  		 x=pt.x +(this.arc/2)*norm.x;
//	  		 y=pt.y + (this.arc/2)*norm.y;  			
//	  		 A=new d2.Point(x,y);    
//	  		 //d2.utils.drawCrosshair(g2,10,[A]);
//	  		  
//	  		  
//			  //end angle point 
//			   pt=this.points[2];
//			   v=new d2.Vector(pt,this.points[3]);
//			   norm=v.normalize();		  
//			   x=pt.x +(this.arc/2)*norm.x;
//			   y=pt.y +(this.arc/2)*norm.y;			
//			   B=new d2.Point(x,y);		  		  
//			   //d2.utils.drawCrosshair(g2,10,[B]);
//			   
//			   //center is the mid point			  			   
//			   C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
//			   //d2.utils.drawCrosshair(g2,10,[C]);
//			     
//			   arc=this.createArc(C,B,A);
//			   arc.paint(g2);		   
		   
			r=this.findArcPoints(this.points[1],this.points[0],this.points[3],this.points[2]);  
			arc=this.createArc(r[0],r[2],r[1]);			
			arc.paint(g2);
		   
        }
        resize(offX,offY,point){
    		super.resize(offX,offY,point);
    		this.reset(); 	
        }
		reset(){
			 this.segments=[];
	         this.arcs=[];
			 //segments 
	         let top=new d2.Segment(0,0,0,0);
	    	 this.segments.push(top);
	    	   
	    	 let bottom=new d2.Segment(0,0,0,0);
	    	 this.segments.push(bottom);
	    	 
	    	 
	    	 
	         //arcs
			 let r=this.findArcPoints(this.points[0],this.points[1],this.points[2],this.points[3]);  
			 this.arcs.push(this.createArc(r[0],r[1],r[2]));			
			 top.ps=r[1].clone();
			 bottom.ps=r[2].clone();  	
				
			 r=this.findArcPoints(this.points[1],this.points[0],this.points[3],this.points[2]);  
			 this.arcs.push(this.createArc(r[0],r[2],r[1]));	
			 top.pe=r[1].clone();
			 bottom.pe=r[2].clone();  	
			  
				
        }
        
        setWidth(width) {
            this.width=width;
            if (width < this.height) {
                this.arc = width;
            } else {
                this.arc = this.height;
            }
        }

        setHeight(height) {
            this.height=height;
            if (height < this.width) {
                this.arc =this.height;
            } else {
                this.arc = this.width;
            }
        }
    	rotate(angle,center = {x:0, y:0}){
     	   super.rotate(angle,center);
     	   this.reset();    	
     	}
    	mirror(line){
    	   super.mirror(line);
    	   this.reset();
			this.arcs.forEach(arc=>{
				arc.endAngle=-1*arc.endAngle;
			});  
    	}
    	scale(alpha){
    	  super.scale(alpha);
    	  this.reset();
    	}
        paint(g2){	
			this.segments.forEach(segment=>{
				segment.paint(g2);
			});
			
			this.arcs.forEach(arc=>{
				arc.paint(g2);
			});  			
			
        }
	}
	
}	
});

;require.register("d2/shapes/point.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Point = class Point{
		constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new d2.Point(this.x, this.y);
        }
        set(...args){
           if(args.length==1){//point
             this.x=args[0].x;
             this.y=args[0].y;
           }else{	   //coordinates
            this.x=args[0];
            this.y=args[1];
           }
        }
//		translate(vec) {       
//		       this.x += vec.x;
//		       this.y += vec.y;
//		    }
		
		/**
	     * Returns new point translated by given vector.
	     * Translation vector may by also defined by a pair of numbers.
	     * @param {Vector} vector - Translation vector defined as Flatten.Vector or
	     * @param {number|number} - Translation vector defined as pair of numbers
	     * @returns {Point}
	     */
	    translate(...args) {
	        if (args.length == 1 &&(args[0] instanceof d2.Vector || !isNaN(args[0].x) && !isNaN(args[0].y))) {
	            this.x += args[0].x;
	            this.y += args[0].y;
	        }

	        if (args.length == 2 && (typeof (args[0]) == "number") && (typeof (args[1]) == "number")) {
	           this.x += args[0];
	           this.y += args[1];
	        }
	    }		
	    /**
	     * Returns bounding box of a point
	     * @returns {Box}
	     */
	    get box() {
	        return new d2.Box(this.x, this.y, this.x, this.y);
	    }	    
		scale(alpha){
		       this.x *=alpha;
		       this.y *=alpha;		  		
		}
        /**
         * rotates by given angle around given center point.
         * If center point is omitted, rotates around zero point (0,0).
         * Positive value of angle defines rotation in counter clockwise direction,
         * negative angle defines rotation in clockwise clockwise direction
         * @param {number} angle - angle in degrees
         * @param {Point} [center=(0,0)] center
         */
		rotate(angle, center = {x:0, y:0}) {
			    
		        let a=-1*d2.utils.radians(angle);		        
			    let x_rot = center.x + (this.x - center.x) * Math.cos(a) - (this.y - center.y) * Math.sin(a);
		        let y_rot = center.y + (this.x - center.x) * Math.sin(a) + (this.y - center.y) * Math.cos(a);
	            
		        this.x=x_rot;
		        this.y=y_rot;
		    }
		move(offsetX,offsetY){
	        this.x+=offsetX;
	        this.y+=offsetY;	
		}   
		/*
		 * Mirror point around horizontal or vertical line
		 */
		mirror(line){
		 let prj=line.projectionPoint(this);
		 let v=new d2.Vector(this,prj);
		 prj.translate(v); 
		 this.x=prj.x;
		 this.y=prj.y;	
		}
		distanceTo(shape) {
		        if (shape instanceof d2.Point) {
		            let dx = shape.x - this.x;
		            let dy = shape.y - this.y;
		            return Math.sqrt(dx*dx + dy*dy);
		        }	
	            if (shape instanceof d2.Circle) {
		            let dx = shape.center.x - this.x;
		            let dy = shape.center.y - this.y;
		            return Math.sqrt(dx*dx + dy*dy);	               
	            }
		}
		
		/**
	     * Returns true if point is on a shape, false otherwise
	     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon
	     * @returns {boolean}
	     */
	    on(shape) {
	        if (shape instanceof d2.Point) {
	            return this.equalTo(shape);
	        }

//	        if (shape instanceof Flatten.Line) {
//	            return shape.contains(this);
//	        }
//
//	        if (shape instanceof Flatten.Circle) {
//	            return shape.contains(this);
//	        }
//
//	        if (shape instanceof Flatten.Segment) {
//	            return shape.contains(this);
//	        }

	        if (shape instanceof d2.Arc) {
	            return shape.contains(this);
	        }

	        if (shape instanceof d2.Polygon) {
	            return shape.contains(this);
	        }
	    }
		
        equals(pt) {
            return d2.utils.EQ(this.x, pt.x) && d2.utils.EQ(this.y, pt.y);
        }
        toString(){
           return this.x+","+this.y;	
        }
		paint(g2){
		  d2.utils.drawCrosshair(g2,10,[this]);
		}
	}

}
});

;require.register("d2/shapes/polygon.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Polygon = class Polygon {
    	constructor() {
    		this.points=[];
    	}
    	clone(){
    	    let copy=new d2.Polygon();
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    	    return copy;	
    	}
    	add(point){
    	    this.points.push(point);	
    	}
        contains(...args){
          let x=0;
          let y=0;

       	  if(args.length==1){//point
                x=args[0].x;
                y=args[0].y;
          }else{	   //coordinates
               x=args[0];
               y=args[1];
          }	
      	  let inside = false;
          // use some raycasting to test hits
          // https://github.com/substack/point-in-polygon/blob/master/index.js
          
    	  //flat out points
    	  let p = [];

          for (let i = 0, il = this.points.length; i < il; i++)
          {
              p.push(this.points[i].x, this.points[i].y);
          }

    	  
    	  let length = p.length / 2;

          for (let i = 0, j = length - 1; i < length; j = i++)
          {
              let xi = p[i * 2];
              let yi = p[(i * 2) + 1];
              let xj = p[j * 2];
              let yj = p[(j * 2) + 1];
              let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);

              if (intersect)
              {
                  inside = !inside;
              }
          }

          return inside;   	   
        }
        move(offsetX,offsetY){
            this.points.forEach(point=>{
            	point.move(offsetX,offsetY);
            });	
        }
        mirror(line){
        	this.points.forEach(point=>{
            	point.mirror(line);
            });        	
        }
        scale(alpha){
            this.points.forEach(point=>{
            	point.scale(alpha);
            });        	
        }
        rotate(angle,center = {x:0, y:0}){
            this.points.forEach(point=>{
            	point.rotate(angle,center);
            });
        }
        get box(){
          return new d2.Box(this.points);	
        }
		get vertices() {
		    return this.points;	
		}        
        paint(g2){
	    	g2.beginPath();
	    	g2.moveTo(this.points[0].x,this.points[0].y);
	    	for (var i = 1; i < this.points.length; i++) {
	    						g2.lineTo(this.points[i].x, this.points[i].y);
	    	}
	    	g2.closePath();                    
	    	if(g2._fill!=undefined&&g2._fill){
	        	  g2.fill();	
	        }else{
	        	  g2.stroke();
	        }
        }
    }
}
});

;require.register("d2/shapes/polyline.js", function(exports, require, module) {
module.exports = function(d2) {
	d2.Polyline = class{
	   constructor(){
		 this.points = [];
		   
	   }
   	   clone(){
   			let copy=new d2.Polyline();
   			this.points.forEach(function(point){
   				copy.points.push(point.clone());
   			});  
   			return copy;	
   	   }
   	   remove(x,y){
       	let item=new d2.Point(x,y);
   		var tempArr = this.points.filter(function(point) { 
    	    return ! point.equals(item);
    	});
   		this.points=tempArr;
   	   }
	   add(...args){
          if(args.length==1){//point               
               this.points.push(new d2.Point(args[0].x,args[0].y));  
          }else{	   //coordinates             
             this.points.push(new d2.Point(args[0],args[1]));              
          }		   
		 
	   }
       move(offsetX,offsetY){
           this.points.forEach(point=>{
           	point.move(offsetX,offsetY);
           });	
       }
       mirror(line){
       	this.points.forEach(point=>{
           	point.mirror(line);
           });        	
       }
       scale(alpha){
           this.points.forEach(point=>{
           	point.scale(alpha);
           });        	
       }
       rotate(angle,center = {x:0, y:0}){
           this.points.forEach(point=>{
           	point.rotate(angle,center);
           });
       }
       intersect(shape){
    	   let segment=new d2.Segment(0,0,0,0);
    	   if(shape instanceof d2.Circle){
    	          let prevPoint = this.points[0];        
    	          for(let point of this.points){    	        	  
    	              if(prevPoint.equals(point)){    	            	  
    	            	  prevPoint = point;
    	                  continue;
    	              }    	              
    	              segment.set(prevPoint.x,prevPoint.y,point.x,point.y);
    	              if(segment.intersect(shape)){
    	                  return true;
    	              }
    	              prevPoint = point;
    	          }
    		   
    	   }
    	   
       }
       get box(){
         return new d2.Box(this.points);	
       }
	   get vertices() {
		    return this.points;	
	   } 	   
	   paint(g2){
		  g2.beginPath(); 
		  g2.moveTo(this.points[0].x, this.points[0].y);
		  
 		  this.points.forEach((point)=>{
			 g2.lineTo(point.x, point.y); 			  
 		  });
		  

		  g2.stroke();
	   }
	   
	}
	
}
});

;require.register("d2/shapes/rectangle.js", function(exports, require, module) {
module.exports = function(d2) {
	/*
	 * rectangle is represented by 4 points
	 */
	d2.Rectangle = class Rectangle extends d2.Polygon{
		constructor(...args) {
			super();
			if(args.length==3){     //***topleft point,width,height
			  let p1=args[0];
			  let width=args[1];
			  let height=args[2];
			  
			  this.points.push(p1.clone());     
			  this.points.push(new d2.Point(p1.x+width,p1.y));
			  this.points.push(new d2.Point(p1.x+width,p1.y+height));
			  this.points.push(new d2.Point(p1.x,p1.y+height));
			}
			if(args.length==4){	  //***x,y,width,height
				  let p1=new d2.Point(args[0],args[1]);
				  let width=args[2];
				  let height=args[3];
				  
				  this.points.push(p1);     
				  this.points.push(new d2.Point(p1.x+width,p1.y));
				  this.points.push(new d2.Point(p1.x+width,p1.y+height));
				  this.points.push(new d2.Point(p1.x,p1.y+height));				
			}
		}
		clone(){
    	    let copy=new d2.Rectangle(new d2.Point(0,0),0,0);
    	    copy.points=[];
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    	    return copy;
		}
		get area(){
			return (this.points[0].distanceTo(this.points[1]))*(this.points[1].distanceTo(this.points[2]));
		}
		reset(width,height){
			let pc=this.box.center;			
			this.points=[];
			this.points.push(new d2.Point(pc.x-(width/2),pc.y-(height/2)));     //topleft point
			this.points.push(new d2.Point(pc.x+(width/2),pc.y-(height/2)));
			this.points.push(new d2.Point(pc.x+(width/2),pc.y+(height/2)));
			this.points.push(new d2.Point(pc.x-(width/2),pc.y+(height/2)));						
		}
		setSize(width,height){
		  this.reset(width,height);			    
		}
		setRect(x,y,width,height){						  
			  this.points[0].set(x,y);			  
			  this.points[1].set(x+width,y);
			  this.points[2].set(x+width,y+height);
			  this.points[3].set(x,y+height);									
		}
		createArc(center, start, end) {
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            
            if (d2.utils.EQ(startAngle, endAngle)) {
                endAngle = 360;
            }
            let r = (new d2.Vector(center, start)).length;
            return new d2.Arc(center, r, startAngle, 90);
        }
        //****TEST************
		eval(g2){
		  //start angle point
//		  let pt=this.points[0];
//		  let v=new d2.Vector(pt,this.points[1]);
//		  let norm=v.normalize();
//		  
//		  let x=pt.x +this.rounding*norm.x;
//		  let y=pt.y + this.rounding*norm.y;
//			
//		  let A=new d2.Point(x,y);
//		  
//		  //d2.utils.drawCrosshair(g2,10,[A]);
//			
//		  //end angle point 
//		   pt=this.points[0];
//		   v=new d2.Vector(pt,this.points[3]);
//		   norm=v.normalize();
//		  
//		   x=pt.x +this.rounding*norm.x;
//		   y=pt.y + this.rounding*norm.y;
//			
//		   let A1=new d2.Point(x,y);
//		  
//		  
//		  // d2.utils.drawCrosshair(g2,10,[A1]);
//		   
//		   //center
//		   v=new d2.Vector(pt,A1);
//		   
//		   x=A.x +v.x;
//		   y=A.y +v.y;
//		   
//		   let C=new d2.Point(x,y);
//		   //d2.utils.drawCrosshair(g2,10,[C]);
			
		   let r=this.findArcPoints(this.points[0],this.points[1],this.points[3]);
		   let arc=this.createArc(r[0],r[1],r[2]);
		   arc.paint(g2);
		   //----------------------RT-------------------------------------
//			//start angle point
//			let pt=this.points[1];
//			let v=new d2.Vector(pt,this.points[2]);
//			let norm=v.normalize();
//			  
//			let x=pt.x +this.rounding*norm.x;
//			let y=pt.y + this.rounding*norm.y;
//				
//			let A=new d2.Point(x,y);
//			  
//			//d2.utils.drawCrosshair(g2,10,[A]);
//			
//			  //end angle point 
//			pt=this.points[1];
//			v=new d2.Vector(pt,this.points[0]);
//			norm=v.normalize();
//			  
//			x=pt.x +this.rounding*norm.x;
//			y=pt.y + this.rounding*norm.y;
//				
//			let A1=new d2.Point(x,y);
//			  
//			  
//			//d2.utils.drawCrosshair(g2,10,[A1]);
//			   //center
//			v=new d2.Vector(pt,A1);
//			   
//			x=A.x +v.x;
//			y=A.y +v.y;
//			   
//			let C=new d2.Point(x,y);
//			//d2.utils.drawCrosshair(g2,10,[C]);
		    
		    r=this.findArcPoints(this.points[1],this.points[2],this.points[0]);   
			arc=this.createArc(r[0],r[1],r[2]);
			arc.paint(g2);	
/*
			//----------------------RB-------------------------------------
			//start angle point
			pt=this.points[2];
			v=new d2.Vector(pt,this.points[1]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A=new d2.Point(x,y);
			  
			//d2.utils.drawCrosshair(g2,10,[A]);			
			  //end angle point 
			pt=this.points[2];
			v=new d2.Vector(pt,this.points[3]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A1=new d2.Point(x,y);			  			  
			//d2.utils.drawCrosshair(g2,10,[A1]);		
			
			   //center
			v=new d2.Vector(pt,A1);			   
			x=A.x +v.x;
			y=A.y +v.y;
			   
			C=new d2.Point(x,y);
			//d2.utils.drawCrosshair(g2,10,[C]);			
*/			
			r=this.findArcPoints(this.points[2],this.points[3],this.points[1]);  
			arc=this.createArc(r[0],r[1],r[2]);
			arc.paint(g2);	
/*			
			//----------------------LB-------------------------------------
			//start angle point
			pt=this.points[3];
			v=new d2.Vector(pt,this.points[2]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A=new d2.Point(x,y);
			  
			//d2.utils.drawCrosshair(g2,10,[A]);
			  //end angle point 
			pt=this.points[3];
			v=new d2.Vector(pt,this.points[0]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A1=new d2.Point(x,y);			  			  
			//d2.utils.drawCrosshair(g2,10,[A1]);				
			   //center
			v=new d2.Vector(pt,A1);			   
			x=A.x +v.x;
			y=A.y +v.y;
			   
			C=new d2.Point(x,y);
			//d2.utils.drawCrosshair(g2,10,[C]);			
*/			
			r=this.findArcPoints(this.points[3],this.points[0],this.points[2]);  
			arc=this.createArc(r[0],r[1],r[2]);			
			arc.paint(g2);	
	
		}
        /**
        *
        * @param {Point} p1 corner point
        * @param {Point} p2 left point
        * @param {Point} p3 right point   
        * @returns {array of arc points[center,start point,end point]}           
        */
		findArcPoints(p1,p2,p3){
			  //start angle point
			  //let pt=this.points[0];
			  let v=new d2.Vector(p1,p2);
			  let norm=v.normalize();
			  
			  let x=p1.x +this.rounding*norm.x;
			  let y=p1.y + this.rounding*norm.y;
				
			  let A=new d2.Point(x,y);
			  
			  //d2.utils.drawCrosshair(g2,10,[A]);
				
			  //end angle point 
			   //pt=this.points[0];
			   v=new d2.Vector(p1,p3);
			   norm=v.normalize();
			  
			   x=p1.x +this.rounding*norm.x;
			   y=p1.y + this.rounding*norm.y;
				
			   let A1=new d2.Point(x,y);
			  
			  
			  // d2.utils.drawCrosshair(g2,10,[A1]);
			   
			   //center
			   v=new d2.Vector(p1,A1);
			   
			   x=A.x +v.x;
			   y=A.y +v.y;
			   
			   let C=new d2.Point(x,y);
			   //d2.utils.drawCrosshair(g2,10,[C]);
			   
			   return [C,A,A1];
			   			
		}
		resize(offX,offY,point){
			if(point==this.points[2]){
	    	//do same
				let pt=this.points[2];
				pt.move(offX,offY);
	    	//do left 
				let v1=new d2.Vector(this.points[0],pt);
				let v2=new d2.Vector(this.points[0],this.points[1]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[1].x=this.points[0].x +v.x;
				this.points[1].y=this.points[0].y + v.y;
	    	
	    	//do right 
				v2=new d2.Vector(this.points[0],this.points[3]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[3].x=this.points[0].x +v.x;
				this.points[3].y=this.points[0].y + v.y;
	    	
	    	
			}else if(point==this.points[1]){
		    	//do same
				let pt=this.points[1];
				pt.move(offX,offY);

	    		    	//do left 
				let v1=new d2.Vector(this.points[3],pt);
				let v2=new d2.Vector(this.points[3],this.points[0]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[0].x=this.points[3].x +v.x;
				this.points[0].y=this.points[3].y + v.y;
	    	//do right 
				v2=new d2.Vector(this.points[3],this.points[2]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[2].x=this.points[3].x +v.x;
				this.points[2].y=this.points[3].y + v.y;				
			}else if(point==this.points[3]){
		    	//do same
				let pt=this.points[3];
				pt.move(offX,offY);		
				
		    	//do left 
				let v1=new d2.Vector(this.points[1],pt);
				let v2=new d2.Vector(this.points[1],this.points[0]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[0].x=this.points[1].x +v.x;
				this.points[0].y=this.points[1].y + v.y;
				
		    	//do right 
				v2=new d2.Vector(this.points[1],this.points[2]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[2].x=this.points[1].x +v.x;
				this.points[2].y=this.points[1].y + v.y;
			}else{
		    	//do same
				let pt=this.points[0];
				pt.move(offX,offY);		
				
		    	//do left 
				let v1=new d2.Vector(this.points[2],pt);
				let v2=new d2.Vector(this.points[2],this.points[1]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[1].x=this.points[2].x +v.x;
				this.points[1].y=this.points[2].y + v.y;
				
		    	//do right 
				v2=new d2.Vector(this.points[2],this.points[3]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[3].x=this.points[2].x +v.x;
				this.points[3].y=this.points[2].y + v.y;				
			}
	    	
		}
grow(offset){
	 //help point
	        let v=new d2.Vector(this.points[3] ,this.points[0]);
	        let norm = v.normalize();        
	        let x = this.points[0].x + offset * norm.x;
	        let y = this.points[0].y + offset * norm.y;
	        this.points[0].set(x, y); 
	//help point        
	        v.set(this.points[2],this.points[1]);
	        norm = v.normalize();        
	        x = this.points[1].x + offset * norm.x;
	        y = this.points[1].y + offset * norm.y;
	        this.points[1].set(x, y);
	//help point
	        v.set(this.points[0] ,this.points[3]);
	        norm = v.normalize();            
	        x = this.points[3].x + offset * norm.x;
	        y = this.points[3].y + offset * norm.y;
	        this.points[3].set(x, y); 
	//help point                
	        v.set(this.points[1] ,this.points[2]);
	        norm = v.normalize();                
	        x = this.points[2].x + offset * norm.x;
	        y = this.points[2].y + offset * norm.y;
	        this.points[2].set(x, y);   
	        
	//point 1;index 0        
	        v.set(this.points[1] ,this.points[0]);
	        norm = v.normalize();         
	        let x1 = this.points[0].x + offset * norm.x;
	        let y1 = this.points[0].y + offset * norm.y;
	        
	               
	//point 2;index 1
	        v.set(this.points[0] ,this.points[1]);
	        norm = v.normalize();         
	        let x2 = this.points[1].x + offset * norm.x;
	        let y2 = this.points[1].y + offset * norm.y;
	        
	        
	        

	//point 3;index 2                
	        v.set(this.points[3] ,this.points[2]);
	        norm = v.normalize();                 
	        let x3 = this.points[2].x + offset * norm.x;
	        let y3 = this.points[2].y + offset * norm.y;
	        
	                       
	//point 4;index 3 
	        v.set(this.points[2] ,this.points[3]);
	        norm = v.normalize();                 
	        let x4 = this.points[3].x + offset * norm.x;
	        let y4 = this.points[3].y + offset * norm.y;
	                
	        
	        this.points[0].set(x1, y1);
	        this.points[1].set(x2, y2);
	        this.points[2].set(x3, y3);
	        this.points[3].set(x4, y4);
	    }
intersects(r) {
			let box=this.box;	
	    // calculate the left common area coordinate:
			let left = Math.max( box.min.x, r.x );
	    // calculate the right common area coordinate:
			let right  = Math.min( box.min.x +box.width, r.x + r.width );
	    // calculate the upper common area coordinate:
			let top    = Math.max( box.min.y,r.y );
	    // calculate the lower common area coordinate:
			let bottom = Math.min( box.min.y +box.height, r.y + r.height );
	
	    // if a common area exists, it must have a positive (null accepted) size
			if( left <= right && top <= bottom )
				return true;
			else
				return false;			  	    
		
		}
		
	    contains(...args){
	      	if(args.length==1){  //point  
	      	  return super.contains(args[0]);
	      	}else{       //coordinates
	      	  return super.contains({x:args[0],y:args[1]});    		
	      	}  
	    }
		rotate(angle,center = {x:this.box.center.x, y:this.box.center.y}){
			super.rotate(angle,center);
		}
		get box(){
			return super.box;
		}
		get center(){
			return super.box.center;
		}
		get vertices() {
		    return this.points;	
		}
		paint(g2){
	    	g2.beginPath();
	    	g2.moveTo(this.points[0].x,this.points[0].y);
	    	for (var i = 1; i < this.points.length; i++) {
	    						g2.lineTo(this.points[i].x, this.points[i].y);
	    	}
	    	g2.closePath();                    
	    	if(g2._fill!=undefined&&g2._fill){
	        	  g2.fill();	
	        }else{
	        	  g2.stroke();
	        }
		}
	}

}
});

;require.register("d2/shapes/roundrectangle.js", function(exports, require, module) {
module.exports = function(d2) {
    /*
     * Round rectangle is represented by 4 segments and 4 arcs
     */
    d2.RoundRectangle = class RoundRectangle  extends d2.Rectangle{
    	constructor(p1,width,height,rounding) {
    		super(p1,width,height);
    		this.p1=p1;
    		this.width=width;
    		this.height=height;
    		this.rounding=rounding;
    		this.segments=[new d2.Segment(0,0,0,0),new d2.Segment(0,0,0,0),new d2.Segment(0,0,0,0),new d2.Segment(0,0,0,0)];
    		this.arcs = [new d2.Arc(),new d2.Arc(),new d2.Arc(),new d2.Arc()];  
    		
    		this.reset();
    	}
    	clone(){
    		let copy=new d2.RoundRectangle(new d2.Point(),0,0,this.rounding);
    		copy.points=[];
    		this.points.forEach(point=>{
    			copy.points.push(point.clone());
    		});
    		copy.reset();
    		return copy;
    	}
    	setPoints(points){
    	   this.points=[];
    	   this.points=points;
    	   this.reset();
    	}
    	setRect(x,y,width,height,rounding){
    		super.setRect(x,y,width,height);
    		this.rounding=rounding;
    		this.p1.set(x,y);
    		this.width=width;
    		this.height=height;
    		this.reset();
    	}    	
        /**
         * Create specific rounding arc 90 degrees long
         * @param center of the arc
         * @param start angle point
         * @param end angle point
         */
        resetArc(arc,center,start,end) {
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            if (d2.utils.EQ(startAngle, endAngle)) {
              endAngle = 360;
            }
            let r = (new d2.Vector(center, start)).length;         	  
            arc.pc=center;
            arc.r=r;
            arc.startAngle=startAngle;
            arc.endAngle=90;

        }    	
        /**
        *
        * @param {Point} p1 corner point
        * @param {Point} p2 left point
        * @param {Point} p3 right point   
        * @returns {array of arc points[center,start point,end point]}           
        */
		findArcPoints(p1,p2,p3){
			  //start angle point
			  let v=new d2.Vector(p1,p2);
			  let norm=v.normalize();			  
			  let x=p1.x +this.rounding*norm.x;
			  let y=p1.y + this.rounding*norm.y;				
			  let A=new d2.Point(x,y);

				
			  //end angle point 
			   v=new d2.Vector(p1,p3);
			   norm=v.normalize();			  
			   x=p1.x +this.rounding*norm.x;
			   y=p1.y + this.rounding*norm.y;				
			   let B=new d2.Point(x,y);
			   
			   //center
			   v=new d2.Vector(p1,B);			   
			   x=A.x +v.x;
			   y=A.y +v.y;			   
			   let C=new d2.Point(x,y);
			   
			   return [C,A,B];
			   			
		}
    	reset(){
            if (this.rounding == 0) {
            	 
                this.segments[0].set(this.points[0].x,this.points[0].y,this.points[1].x, this.points[1].y);
                this.segments[1].set(this.points[1].x,this.points[1].y,this.points[2].x, this.points[2].y);
                this.segments[2].set(this.points[2].x,this.points[2].y,this.points[3].x, this.points[3].y);
                this.segments[3].set(this.points[3].x,this.points[3].y,this.points[0].x, this.points[0].y);               

            } else {
                //rect
                let top = this.segments[0];
                let right = this.segments[1];    
                let bottom = this.segments[2];
                let left =this.segments[3];
     

                //arcs
                let r = this.findArcPoints(this.points[0], this.points[1], this.points[3]);
                this.resetArc(this.arcs[0],r[0], r[1], r[2]);
                top.ps = r[1].clone();
                left.ps = r[2].clone();

                r = this.findArcPoints(this.points[1], this.points[2], this.points[0]);
                this.resetArc(this.arcs[1],r[0], r[1], r[2]);
                top.pe = r[2].clone();
                right.ps = r[1].clone();

                r = this.findArcPoints(this.points[2], this.points[3], this.points[1]);
                this.resetArc(this.arcs[2] ,r[0], r[1], r[2]);
                right.pe = r[2].clone();
                bottom.ps = r[1].clone();


                r = this.findArcPoints(this.points[3], this.points[0], this.points[2]);
                this.resetArc(this.arcs[3],r[0], r[1], r[2]);
                bottom.pe = r[2].clone();
                left.pe = r[1].clone();
            }    		    	
    	}
    	resize(offX,offY,point){
    		super.resize(offX,offY,point);
    		this.reset();
    	}
    	rotate(angle,center = {x:0, y:0}){
    	   super.rotate(angle,center);
    	   this.reset();    	
    	}
    	move(offX,offY){
    	   super.move(offX,offY);
    	   this.reset();
    	}
        contains(pt){
      	   if(!super.contains(pt)){
      		   return false;
      	   }    	   
      	   
      	   //constrauct polygon
      	   let pol=new d2.Polygon();
      	   this.segments.forEach(segment=>{
      		 pol.add(segment.ps);
      		 pol.add(segment.pe);
      	   });
      	   
      	   return pol.contains(pt);
         }
		scale(alpha){
			super.scale(alpha);
			this.rounding*=alpha;
			this.reset();
		}
		setRounding(rounding){
		 this.rounding=rounding;
		 this.reset();
		}
    	mirror(line){
    		super.mirror(line);
    		let p=this.points[0];
    		this.points[0]=this.points[1];
    		this.points[1]=p
    		
    		p=this.points[2];
    		this.points[2]=this.points[3];
    		this.points[3]=p
    		
    		this.reset();
    	}
		get box(){
			return super.box;
		}
		get polygon() {
			let vertices=[];
			let p=this.segments[0].ps;
			
    		this.segments.forEach(segment=>{
    		   let a=p.distanceTo(segment.ps);
    		   let b=p.distanceTo(segment.pe);
    		   if(a<b){
    		     vertices.push(segment.ps);
			     vertices.push(segment.pe);
    		   }else{
        		 vertices.push(segment.pe);
    			 vertices.push(segment.ps);    			   
    		   }
			   p=vertices[vertices.length-1];  //keep the last one
			});
          return vertices;		   	
		}
    	paint(g2){
    		if(g2._fill!=undefined&&g2._fill){
    			let vertices=this.polygon;
        		
    	    	g2.beginPath();	    		    		    	
    	    	g2.moveTo(vertices[0].x,vertices[0].y);
    	    	for (var i = 1; i < vertices.length; i++) {
    	    						g2.lineTo(vertices[i].x, vertices[i].y);
    	    	}
    	    	g2.closePath(); 
    	    	g2.fill();    	    	       		
    	    	if(this.rounding!=0){
    	    	 this.arcs.forEach(arc=>{
    				var circle=new d2.Circle(arc.pc,arc.r);
    	    		circle.paint(g2);
    			 });
    	    	}
    		}else{
			 this.segments.forEach(segment=>{
				segment.paint(g2);
			 });
			
			 if(this.rounding!=0){
			  this.arcs.forEach(arc=>{
				arc.paint(g2);
			  });
			 }
    		}
    	}
    }
    
}
});

;require.register("d2/shapes/segment.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Segment = class Segment{
		constructor(...args) {
            if (args.length == 2 && args[0] instanceof d2.Point && args[1] instanceof d2.Point) {
                this.ps = args[0].clone();
                this.pe = args[1].clone();
                return;
            }

            if (args.length == 4) {
                this.ps = new d2.Point(args[0], args[1]);
                this.pe = new d2.Point(args[2], args[3]);
                return;
            }
        }
        clone() {
            return new Segment(this.ps, this.pe);
        }
        set(x1,y1,x2,y2){
        	this.ps.set(x1,y1);
        	this.pe.set(x2,y2);
        }
        get length() {
            return this.ps.distanceTo(this.pe);
        } 
        get box() {
            return new d2.Box(
                Math.min(this.ps.x, this.pe.x),
                Math.min(this.ps.y, this.pe.y),
                Math.max(this.ps.x, this.pe.x),
                Math.max(this.ps.y, this.pe.y)
            )
        }
		get isHorizontal(){						
			return d2.utils.EQ(this.ps.y,this.pe.y);			
		}
		get isVertical(){
			return d2.utils.EQ(this.ps.x,this.pe.x);
		}        
        middle() {
            return new d2.Point((this.ps.x + this.pe.x)/2, (this.ps.y + this.pe.y)/2);
        }
        translate(vec) {
            this.ps.translate(vec);
            this.pe.translate(vec);
        }
        contains(pt){
      	   return false;    	   
        }
        projectionPoint(pt) {
            let v1 = new d2.Vector(this.ps, pt);
            let v2 = new d2.Vector(this.ps, this.pe);

            let v = v1.projectionOn(v2);
            //translate point
            let x = this.ps.x + v.x;
            let y = this.ps.y + v.y;
            return new d2.Point(x, y);
        }   
      //https://github.com/psalaets/line-intersect        
        intersect(shape){
          if(shape instanceof d2.Circle){  
            let projectionPoint = this.projectionPoint(shape.pc);

            let a = (projectionPoint.x - this.ps.x) / ((this.pe.x - this.ps.x) == 0 ? 1 : this.pe.x - this.ps.x);
            let b = (projectionPoint.y - this.ps.y) / ((this.pe.y - this.ps.y) == 0 ? 1 : this.pe.y - this.ps.y);

            let dist = projectionPoint.distanceTo(shape.pc);
            
            if (0 <= a && a <= 1 && 0 <= b && b <= 1) { //is projection between start and end point
                if (!d2.utils.GT(dist,shape.r)) {
                    return true;
                }
            }
            //end points in circle?
            if (d2.utils.LE(this.ps.distanceTo(shape.pc), shape.r)) {
                return true;
            }
            if (d2.utils.LE(this.pe.distanceTo(shape.pc), shape.r)) {
                return true;
            }        
          }else if(shape instanceof d2.Segment){
              let x1=this.ps.x, y1=this.ps.y, x2=this.pe.x, y2=this.pe.y, x3=shape.ps.x, y3=shape.ps.y, x4=shape.pe.x, y4=shape.pe.y; 
              let denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
              let numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
              let numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

              if (denom == 0) {
                if (numeA == 0 && numeB == 0) {
                  return false;  //COLINEAR;
                }
                return false; //PARALLEL;
              }

              let uA = numeA / denom;
              let uB = numeB / denom;

              if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
                return true;
                //return intersecting({
                //  x: x1 + (uA * (x2 - x1)),
                //  y: y1 + (uA * (y2 - y1))
                //});
              }

              return false;        	  
          }
           
          
          return false;
        }        
        rotate(angle, center = {x:0, y:0}) {
          this.ps.rotate(angle,center);
          this.pe.rotate(angle,center);
        }
        move(offsetX,offsetY){
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);           	
        }
        mirror(line){
        	this.ps.mirror(line);
        	this.pe.mirror(line);
        }
        scale(alpha){
        	this.ps.scale(alpha);
        	this.pe.scale(alpha);        	
        }
		paint(g2){	
			g2.beginPath();
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();
		}
    }
}
});

;require.register("d2/shapes/utils.js", function(exports, require, module) {
const DP_TOL = 0.000001;

module.exports = function(d2) {
	d2.utils={
		 DP_TOL: DP_TOL,
			
		 drawCrosshair:function(g2,length,points){                
				

		        points.forEach(function(point){
		        	let line = new d2.Segment(point.x - length, point.y, point.x + length, point.y);
					line.paint(g2);
		            
					line = new d2.Segment(point.x, point.y - length, point.x, point.y + length);            
					line.paint(g2);
		        });	
	   	 },
	
	   radians:function(degrees) {
			  return degrees * Math.PI / 180;
	   },
			 
			// Converts from radians to degrees.
	   degrees :function(radians) {
			  return radians * 180 / Math.PI;
	   },
	   EQ_0(x) {
		    return ((x) < DP_TOL && (x) > -DP_TOL);
	   },	   
	   GT: (x,y) => {
	        return ( (x)-(y) >  DP_TOL );
	   },
	   GE: (x,y) => {
	        return ( (x)-(y) > -DP_TOL );
	   },
	   EQ: function(x,y) {
	        return ( (x)-(y) <  DP_TOL && (x)-(y) > -DP_TOL );
	   },
	   LT:function(x,y){
	        return ( (x)-(y) < -DP_TOL );
	    },
	   LE:function(x,y){
	        return ( (x)-(y) <  DP_TOL );
	    },
    }

};
});

require.register("d2/shapes/vector.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Vector = class Vector{
		constructor(...args) {
			 this.x = 0;
	         this.y = 0;
	         
             let a1 = args[0];
             let a2 = args[1];

             if (typeof(a1) == "number" && typeof(a2) == "number") {
                 this.x = a1;
                 this.y = a2;
                 return;
             }

             if (a1 instanceof d2.Point && a2 instanceof d2.Point) {
                 this.x = a2.x - a1.x;
                 this.y = a2.y - a1.y;
                 return;
             }	         
		}
		
		set(...args){
			  if (typeof(args[0]) == "number") {
				  this.x=args[2] - args[0];   //x2-x1
				  this.y=args[3] - args[1];  	//y2-y1
			  }else{
	              this.x = args[1].x - args[0].x;
	              this.y = args[1].y - args[0].y;
			  }       
		} 
		
        clone() {
            return new Vector(this.x, this.y);
        }
        
        get length() {
            return Math.sqrt(this.dot(this));
        }        
        
        /**
         * Returns scalar product (dot product) of two vectors <br/>
         * <code>dot_product = (this * v)</code>
         */
        dot(v) {
            return ( this.x * v.x + this.y * v.y );
        }
        
        /**
         * Returns vector product (cross product) of two vectors <br/>
         * <code>cross_product = (this x v)</code>
         */
        cross(v) {
            return ( this.x * v.y - this.y * v.x );
        } 
        /**
         * Slope of the vector in degrees from 0 to 360
         */
        get slope() {
            let angle = Math.atan2(this.y, this.x);
            if (angle<0) angle = 2*Math.PI + angle;
            
            return d2.utils.degrees(angle);
        }
        invert() {
            this.x=-this.x;
            this.y=-this.y;
        }
        /**
         * Returns unit vector.<br/>
         */
        normalize() {            
            return ( new Vector(this.x / this.length, this.y / this.length) );            
        }        
        /**
         * Returns new vector rotated by given angle,
         * positive angle defines rotation in counter clockwise direction,
         * negative - in clockwise direction
         */
        rotate(angle) {
            let point = new d2.Point(this.x, this.y);
            point.rotate(angle);
            this.x=point.x
            this.y=point.y;
        }        
        /**
         *rotate 90 degrees counter clockwise         
         */
        rotate90CCW() {
        	let x=this.x;
        	let y=this.y;
            this.x=-1*y;
            this.y= x;
        }    
        /**
         * rotate 90 degrees clockwise
         */
        rotate90CW() {
        	let x=this.x;
        	let y=this.y;        	
            this.x=y;
            this.y=-1*x;
        };
        
        /**
         * Return angle between this vector and other vector. <br/>
         * Angle is measured from 0 to 2*PI in the counter clockwise direction
         * from current vector to other.
         */
        angleTo(v) {
            let norm1 = this.normalize();
            let norm2 = v.normalize();
            let angle = Math.atan2(norm1.cross(norm2), norm1.dot(norm2));
            if (angle<0) angle += 2*Math.PI;
            return angle;
        }
        /**
         * Return vector projection of the current vector on another vector
         * @param {Vector} v Another vector
         * @returns {Vector}
         */
        projectionOn(v){
            let n = v.normalize();
            let d = this.dot(n);
            n.multiply(d);
            return n;
        }
        
        multiply(scalar) {
            this.x=scalar * this.x;
            this.y=scalar * this.y;
        }
        add(v){
        	return new Vector(this.x+v.x,this.y+v.y);
        }

	}
	
}	
});

;require.register("d2/text/fontmetrics.js", function(exports, require, module) {
// ��������������������������������������������������
// Variables
// ��������������������������������������������������

let initialized = false
let padding
let context
let canvas

// ��������������������������������������������������
// Settings
// ��������������������������������������������������

const settings = {
  chars: {
    capHeight: 'S',
    baseline: 'n',
    xHeight: 'x',
    descent: 'p',
    ascent: 'h',
    tittle: 'i'
  }
}

// ��������������������������������������������������
// Methods
// ��������������������������������������������������

const initialize = () => {
  canvas = document.createElement('canvas')
  context = canvas.getContext('2d')
  initialized = true
}
const getCanvasContext=()=>{
	 if (!initialized) initialize()
	   return context;
}
const setFont = (fontFamily, fontSize, fontWeight) => {
  if (!initialized) initialize()
  padding = fontSize * 0.5
  canvas.width = fontSize * 2
  canvas.height = fontSize * 2 + padding
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  context.textBaseline = 'top'
  context.textAlign = 'center'	  
}

const setAlignment = (baseline = 'top') => {
  const ty = baseline === 'bottom' ? canvas.height : 0
  context.setTransform(1, 0, 0, 1, 0, ty)
  context.textBaseline = baseline
}

const updateText = (text) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, padding, canvas.width)
}
const computeLineHeight = () => {
  const letter = 'A'
  setAlignment('bottom')
  const gutter = canvas.height - measureBottom(letter)
  setAlignment('top')
  return measureBottom(letter) + gutter
}

const getPixels = (text) => {
  updateText(text)
  return context.getImageData(0, 0, canvas.width, canvas.height).data
}

const getFirstIndex = (pixels) => {
  for (let i = 3, n = pixels.length; i < n; i += 4) {
    if (pixels[i] > 0) return (i - 3) / 4
  } return pixels.length
}

const getLastIndex = (pixels) => {
  for (let i = pixels.length - 1; i >= 3; i -= 4) {
    if (pixels[i] > 0) return i / 4
  } return 0
}

const normalize = (metrics, fontSize, origin) => {
  const result = {}
  const offset = metrics[origin]
  for (let key in metrics) { 
	   if(key!='width'){
	     result[key] = (metrics[key] - offset) / fontSize;
	   }else{
		 result[key]= metrics[key];  
	   }
	  }
  return result;
}

const measureTop = (text) => (
  Math.round(
    getFirstIndex(
      getPixels(text)
    ) / canvas.width
  ) - padding
)

const measureBottom = (text) => (
  Math.round(
    getLastIndex(
      getPixels(text)
    ) / canvas.width
  ) - padding
)

const getMetrics = (chars = settings.chars) => ({
  capHeight: measureTop(chars.capHeight),
  baseline: measureBottom(chars.baseline),
  xHeight: measureTop(chars.xHeight),
  descent: measureBottom(chars.descent),
  bottom: computeLineHeight(),
  ascent: measureTop(chars.ascent),
  tittle: measureTop(chars.tittle),
  top: 0
})

// ��������������������������������������������������
// FontMetrics
// ��������������������������������������������������

const FontMetrics = ({
  fontFamily = 'Times',
  fontWeight = 'normal',
  fontSize = 10,
  origin = 'baseline'
  
} = {}) => (
  setFont(fontFamily, fontSize, fontWeight), {
    ...normalize(getMetrics(), fontSize, origin),
    fontFamily,
    fontWeight,
    fontSize,

  }
)

FontMetrics.settings = settings

// ��������������������������������������������������
// Exports
// ��������������������������������������������������

module.exports = {
		FontMetrics,
		getCanvasContext
}
});

;require.register("symbols/d/symbolcomponent.js", function(exports, require, module) {
var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var SymbolType = require('core/core').SymbolType;
var events=require('core/events');
var RoundRect=require('symbols/shapes').RoundRect;
var FontLabel=require('symbols/shapes').FontLabel;
var Ellipse=require('symbols/shapes').Ellipse;
var Line=require('symbols/shapes').Line;
var Arc=require('symbols/shapes').Arc;
var Pin=require('symbols/shapes').Pin;
var ArrowLine=require('symbols/shapes').ArrowLine;
var Triangle=require('symbols/shapes').Triangle;
var SymbolContextMenu=require('symbols/popup/symbolpopup').SymbolContextMenu;
var SymbolShapeFactory=require('symbols/shapes').SymbolShapeFactory;
var SymbolEventMgr = require('symbols/events').SymbolEventMgr;
var LineEventHandle=require('core/events').LineEventHandle;
var DefaultLineBendingProcessor=require('core/line/linebendingprocessor').DefaultLineBendingProcessor;
var d2=require('d2/d2');
var utilities=require('core/utilities');


//**********************UnitMgr***************************************
var SymbolMgr=(function(){
	var instance=null;

class manager{
	getLabels(unit) {		
        var len=symbol.shapes.length;
          
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
class Symbol extends Unit{
constructor(width,height) {
       super(width,height);
       this.scalableTransformation.reset(1.2,2,2,15);
	   this.shapeFactory = new SymbolShapeFactory();
       this.grid.setGridUnits(8, core.Units.PIXEL);
       this.grid.pointsColor='#000000'; 
       this.type=SymbolType.SYMBOL;
       this.isTextLayoutVisible = false;
       this.frame.color='#000000';
	}
clone(){
	  var copy=new Symbol(this.width,this.height);
	  //copy.silent=true;
	  copy.unitName=this.unitName;
	  copy.grid=this.grid.clone();

      var len=this.shapes.length;
	  for(var i=0;i<len;i++){
           var clone=this.shapes[i].clone();
	       copy.add(clone);
	  }
	  //copy.silent=false;
	  return copy;
	}	
parse(data){
	 	   this.unitName=j$(data).find("name").first().text();
	 	   var reference=j$(data).find("reference");
	 	   var value=j$(data).find("unit");
	 	  
	 	   if(reference!=null&&reference.text()!=''){
		        var label = new FontLabel(0,0);
		        if(reference[0].children[0]){
		          label.fromXML(reference[0].children[0]);   //new schema
		        }else{
		          label.fromXML(reference[0]);	
		        }
		        label.texture.tag="reference";
		        this.add(label);      		 	      
	 	   }
	 	   if(value!=null&&value.text()!=''){
		        var label = new FontLabel(0,0);
		        if(value[0].children[0]){
		        	label.fromXML(value[0].children[0]);  //new schema
		        }else{
		        	label.fromXML(value[0]);  
		        }
		        label.texture.tag="unit";
		        this.add(label);  
	 	   }
	 	   var that=this;
	 	   j$(data).find('elements').children().each(function(){
               var shape=that.shapeFactory.createShape(this);
               that.add(shape);
	 	   });
	}	
setTextLayoutVisibility( isTextLayoutVisible) {
    this.isTextLayoutVisible = isTextLayoutVisible;
    this.shapes.forEach((shape)=>{            
        if(shape instanceof Pin){
          shape.name.isTextLayoutVisible=isTextLayoutVisible;
          shape.number.isTextLayoutVisible=isTextLayoutVisible;
        }  
       });
}
format(){   
   var xml="<module width=\""+ this.width +"\" height=\""+this.height+"\">\r\n"; 
   xml+="<name>"+this.unitName+"</name>\r\n";
   //***reference
   var text=UnitMgr.getInstance().getLabelByTag(this,'reference');
   if(text!=null){
       xml+="<reference>";
       xml+=text.toXML();
       xml+="</reference>\r\n";
   } 
   //value
   text=UnitMgr.getInstance().getLabelByTag(this,'unit');
   if(text!=null){
       xml+="<unit>";
       xml+=text.toXML();
       xml+="</unit>\r\n";
   }    
 
   xml+="<elements>\r\n";
   this.shapes.forEach(function(shape) {
	   if(!((shape instanceof FontLabel)&&(shape.texture.tag=='reference'||shape.texture.tag=='unit'))){
		   xml+=shape.toXML();  
	   }
   });
   xml+="</elements>\r\n";   
   xml+="</module>";
   return xml;
}	
}

class SymbolContainer extends UnitContainer{
    constructor() {
       super();
       this.formatedFileName="Symbols"
	}
    getType() {
        if(this.unitsmap.size==0){
          return Type.SYMBOL;  //default
        }else{    		
          return this.getUnits().next().value.type; 
        }
    }
    
    setType(type) {
      let units=this.unitsmap.values();
  	  for(let i=0;i<this.unitsmap.size;i++){
          let aunit=units.next();
  		  aunit.value.type=type;
  	  }
    }
    parse(xml){
    	  this.setFileName(j$(xml).find("filename").text());
    	  this.libraryname=(j$(xml).find("library").text());
    	  this.categoryname=(j$(xml).find("category").text());    	  
    	 
    	  var that=this;
	      j$(xml).find("module").each(j$.proxy(function(){
	    	var symbol=new Symbol(j$(this).attr("width"),j$(this).attr("height"));	    	    
	    	//silent mode
	    	//footprint.silent=that.silent;
	    	//need to have a current unit
            that.add(symbol);
            symbol.parse(this);
	    }),that);	
    }
    format() {
        var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n"; 
        xml+="<modules identity=\"Symbol\" type=\""+core.SymbolType.valueOf(this.getType())+"\" version=\""+utilities.version.SYMBOL_VERSION+"\">\r\n";      
    	let units=this.unitsmap.values();
  	    for(let i=0;i<this.unitsmap.size;i++){
          let unit=units.next().value;
          xml+=unit.format();
  		  xml+="\r\n";
  	    }    	    	
        xml+="</modules>";
        console.log(xml);
        return xml;
    }
	
}


class SymbolComponent extends UnitComponent{
  constructor(hbar,vbar,canvas,popup) {
	super(hbar,vbar,canvas,popup); 
	
	this.eventMgr=new SymbolEventMgr(this); 
	this.model=new SymbolContainer();
	this.popup=new SymbolContextMenu(this,popup);
	this.backgroundColor='white';  
	this.lineBendingProcessor=new DefaultLineBendingProcessor();  
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
     		case core.ModeEnum.SOLID_REGION:
         	break;	 
	        case core.ModeEnum.ARROW_MODE:
	            shape=new ArrowLine();	            	            		                        
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	          break;
	        case core.ModeEnum.TRIANGLE_MODE:
	            shape=new Triangle();	            	            		                        
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	          break;
	        case  core.ModeEnum.RECT_MODE:
	            shape=new RoundRect(0,0,15,15,0,1);	            
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.LINE_MODE:
	          
	          break;
	        case  core.ModeEnum.ELLIPSE_MODE:	
	            shape=new Ellipse(20,15);
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.ARC_MODE:
	        	shape=new Arc(0,0,30,40);
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case core.ModeEnum.PIN_MODE:
	            shape=new Pin();
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	            break;	          
	        case  core.ModeEnum.LABEL_MODE:
	            shape=new FontLabel(0,0);			
		        this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case core.ModeEnum.ORIGIN_SHIFT_MODE:  
	            this.getEventMgr().setEventHandle("origin",null);   
	            break;          
	        default:
	          this.repaint();
	      }       
} 


//  contextMenu:function(event){ 
//	  var x,y;
//	  if (event.pageX != undefined && event.pageY != undefined) {
//		   x = event.pageX;
//		   y = event.pageY;
//	  }else {
//		   x = event.clientX + document.body.scrollLeft +
//	            document.documentElement.scrollLeft;
//		   y = event.clientY + document.body.scrollTop +
//	            document.documentElement.scrollTop;
//	 }
//	       x -= parseInt(this.canvas.offset().left);
//	       y -= parseInt(this.canvas.offset().top);
//	       
//	       
//  },



mouseDown(event){
    event.preventDefault();

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
         if(this.getModel().getUnit().getCoordinateSystem()!=null){ 
    	  if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
              this.getEventMgr().setEventHandle("origin",null); 
        	  break;
          } 
         }
    		
    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y);
    	  if(shape!=null){
                if(shape instanceof Arc){
                     if(shape.isStartAnglePointClicked(scaledEvent.x , scaledEvent.y)){ 
                         this.getEventMgr().setEventHandle("arc.start.angle",shape);                    
                     }else if(shape.isExtendAnglePointClicked(scaledEvent.x , scaledEvent.y)){
                         this.getEventMgr().setEventHandle("arc.extend.angle",shape);                      
//                     }else if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y)){
//                    	  this.getEventMgr().setEventHandle("arc.mid.point",shape);
                     }else{
                          this.getEventMgr().setEventHandle("resize",shape);    
                     }
                   }else{
						this.getEventMgr().setEventHandle("resize",shape); 
                    }
			
 
		  }else{		    		     
		     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
		     
		     if(shape!=null){
		       if ((UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes)&& shape.isSelected())||event.ctrlKey){			   
                 this.getEventMgr().setEventHandle("block", shape);						 
		       }else if ((!(shape instanceof FontLabel))&&(undefined !=shape['getTextureByTag'])&&shape.getClickedTexture(scaledEvent.x, scaledEvent.y)!=null){
			     this.getEventMgr().setEventHandle("texture",shape);
               }else
		         this.getEventMgr().setEventHandle("move",shape);
		     }else{
		         this.getEventMgr().setEventHandle("component",null);
		     }		     
		     
		  }
		  break;
    	case core.ModeEnum.SOLID_REGION:
            //is this a new copper area
            if ((this.getEventMgr().targetEventHandle == null) ||
                !(this.getEventMgr().targetEventHandle instanceof SolidRegionEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape =new SolidRegion(core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                this.getEventMgr().setEventHandle("solidregion", shape);
            }     		
    		break;
    	case core.ModeEnum.LINE_MODE:
            //***is this a new wire
            if ((this.getEventMgr().getTargetEventHandle() == null) ||
                !(this.getEventMgr().getTargetEventHandle() instanceof LineEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape = new Line(1);
                this.getModel().getUnit().add(shape);
                
            	this.getEventMgr().setEventHandle("line", shape);
            }
    	  break;
    	case core.ModeEnum.DRAGHEAND_MODE:  
    		this.getEventMgr().setEventHandle("dragheand", null);
    	  break;	
    	case core.ModeEnum.MEASUMENT_MODE:
                if ((this.getEventMgr().getTargetEventHandle() != null) ||
                    (this.getEventMgr().getTargetEventHandle() instanceof events.MeasureEventHandle)) {
                     this.getModel().getUnit().ruler.resizingPoint=null;
                     this.getEventMgr().resetEventHandle();
                     this.repaint();
                }else{
                   this.getEventMgr().setEventHandle("measure",this.getModel().getUnit().ruler);   
				   this.getModel().getUnit().ruler.setX(scaledEvent.x);
				   this.getModel().getUnit().ruler.setY(scaledEvent.y);                   
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
	   SymbolMgr,	
	   SymbolContainer,
	   Symbol,
	   SymbolComponent	   
}
});

;require.register("symbols/events.js", function(exports, require, module) {
var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var d2 = require('d2/d2');

class SymbolEventMgr{
	 constructor(component) {
	    this.component=component;
		this.targetEventHandle=null;	
		this.hash = new Map();
		this.hash.set("move",new events.MoveEventHandle(component));
		this.hash.set("resize",new events.ResizeEventHandle(component));
	    this.hash.set("component",new events.UnitEventHandle(component));
		this.hash.set("block",new events.BlockEventHandle(component));
		this.hash.set("line",new events.LineEventHandle(component));
		this.hash.set("cursor",new events.CursorEventHandle(component));
		this.hash.set("texture",new events.TextureEventHandle(component));
		this.hash.set("dragheand",new events.DragingEventHandle(component));
		this.hash.set("origin",new events.OriginEventHandle(component));
		this.hash.set("measure",new events.MeasureEventHandle(component));
		this.hash.set("arc.start.angle",new ArcStartAngleEventHandle(component));
		this.hash.set("arc.extend.angle",new ArcExtendAngleEventHandler(component));
	 }
	 //****private
	 getEventHandle(eventKey,target) {
	    var handle=this.hash.get(eventKey);
		if(handle!=null){
		  handle.setTarget(target);
		  if(eventKey=='resize'||eventKey=='move'||eventKey=='line'||eventKey=='texture'){
		     this.component.getModel().getUnit().fireShapeEvent({target:target,type:events.Event.SELECT_SHAPE});
		  }
		  if(eventKey=='component'||eventKey=="origin"){
			 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:events.Event.SELECT_UNIT});
		  }
		  handle.attach();
		}
		return handle;
	 }
	 
	 getTargetEventHandle(){
	   return this.targetEventHandle;
	 }
	 
	 setEventHandle(eventKey,target){
	        this.resetEventHandle();
	        this.targetEventHandle=this.getEventHandle(eventKey,target);
	    }
	 
	 resetEventHandle(){
		    //hide context menu
		    this.component.popup.close();
	        if (this.targetEventHandle != null) {
	            this.targetEventHandle.detach();
	        }
	        this.targetEventHandle = null;                
	    }
	 
	}

class ArcStartAngleEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 mousePressed(event){
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
	    
		
	        
	    let centerX=this.target.arc.center.x;
	    let centerY=this.target.arc.center.y;
	           
	    let start = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

	    if(start<0){
	        this.target.setStartAngle(-1*(start));            
	    }else{
	        this.target.setStartAngle(360-(start));            
	    }
			
		this.mx = new_mx;
	    this.my = new_my;

		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
			
		this.component.repaint();
	 }
	mouseReleased(event){

	} 
	mouseMove(event){
	 
	}

}	
class ArcExtendAngleEventHandler extends EventHandle{
	 constructor(component) {
		 super(component);

	 }
	 mousePressed(event){
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
	        
	    let centerX=this.target.arc.center.x;
	    let centerY=this.target.arc.center.y;
	        
	        
	    let extend = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

	    if(extend<0){
	        extend=(-1*(extend));                  
	    }else{
	        extend=(360-extend);         
	    }
	        
	        //-360<extend<360 
	    let extendAngle=this.target.arc.endAngle;
	    if(extendAngle<0){        
	          if(extend-this.target.arc.startAngle>0) {                
	              this.target.setExtendAngle(((extend-this.target.arc.startAngle))-360);
	          }else{
	              this.target.setExtendAngle(extend-this.target.arc.startAngle);
	            }
	        }else{           
	            if(extend-this.target.arc.startAngle>0) {
	              this.target.setExtendAngle(extend-this.target.arc.startAngle);
	            }else{
	              this.target.setExtendAngle((360-this.target.arc.startAngle)+extend);
	            }
	        }
	        
	    //***update PropertiesPanel           
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
			
		this.component.repaint();
	 }
	mouseReleased(event){

	} 
	mouseMove(event){
	 
	}

}

module.exports ={
		SymbolEventMgr
	}
});

;require.register("symbols/popup/symbolpopup.js", function(exports, require, module) {
var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');

class SymbolContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
	}	
//registerPinPopup(target,event){
//	var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
//	  items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
//	  items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
//	  items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
//	  items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
//	  items+="</table></div>";
//	  this.setContent(items,{target:target});	
//	  this.open(event);	
//	}
registerShapePopup(target,event){
	var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	  items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	  items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	  items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	  items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
	  items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
	  items+="<tr id='sendbackid'><td style='padding: 0.4em'>Send To Back</td></tr>";
	  items+="<tr id='sendfrontid'><td style='padding: 0.4em'>Send To Front</td></tr>";	  
	  items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
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
registerBlockPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	    items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	    items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	    items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
	    items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
		this.open(event);		
}
registerLinePopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='deletelastpointid' ><td style='padding: 0.4em;'>Delete Last Point</td></tr>";
	    items+="<tr id='deletelineid'><td style='padding: 0.4em;'>Delete Line</td></tr>";	  
	    items+="<tr id='cancelid'><td style='padding: 0.4em;'>Cancel</td></tr>";	    	    	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
	    this.open(event);	  	
}

actionPerformed(id,context){ 	
	
   super.actionPerformed(id,context);
   
}


}

module.exports ={
		SymbolContextMenu
		}
});

;require.register("symbols/shapes.js", function(exports, require, module) {
var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var AbstractLine=require('core/shapes').AbstractLine;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var d2=require('d2/d2');

class SymbolShapeFactory{
	
	createShape(data){
		if (data.tagName.toLowerCase() == 'pin') {
			var pin = new Pin();
			pin.fromXML(data);
			return pin;
		}
		if (data.tagName.toLowerCase() == 'rectangle') {
			var roundRect = new RoundRect(0,0,0,0, 0,0);
			roundRect.fromXML(data);
			return roundRect;
		}
		if (data.tagName.toLowerCase() == 'ellipse') {
			var circle = new Ellipse(0, 0);
			circle.fromXML(data);
			return circle;
		}
		if (data.tagName.toLowerCase() == 'line') {
			var line = new Line(0);
			line.fromXML(data);
			return line;
		}
		if (data.tagName.toLowerCase() == 'arc') {
			var arc = new Arc(0, 0, 0, 0);			
			arc.fromXML(data);
			return arc;
		}
		if (data.tagName.toLowerCase() == 'label') {
			var label = new FontLabel(0,0);
			label.fromXML(data);		
			return label;
		}
		if (data.tagName.toLowerCase() == 'triangle') {
			var triangle = new Triangle(0);
			triangle.fromXML(data);		
			return triangle;
		}	
		if (data.tagName.toLowerCase() == 'arrow') {
			var arrow = new ArrowLine();
			arrow.fromXML(data);		
			return arrow;
		}	
	}
}

class Line extends AbstractLine{
constructor(thickness) {
	super(1,core.Layer.LAYER_ALL);	
	this.fillColor='#000000';
	this.selectionRectWidth=4;
}
clone() {
	  var copy = new Line(this.thickness);
	  copy.polyline=this.polyline.clone();
	  copy.thickness=this.thickness;
	  return copy;
	}
alignToGrid(isRequired) {
if (isRequired) {
  this.polyline.points.forEach(function(wirePoint){
      let point = this.owningUnit.getGrid().positionOnGrid(wirePoint.x, wirePoint.y);
        wirePoint.set(point.x,point.y);
  }.bind(this));
}
return null;
}
paint(g2, viewportWindow, scale,layersmask) {			
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}
				

		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		g2.lineWidth = this.thickness * scale.getScale();


		if (this.selection)
			g2.strokeStyle = "#808080";
		else
			g2.strokeStyle = this.fillColor;
		
		let a=this.polyline.clone();
		if (this.isFloating()) {                                                    
		            if(this.resumeState==ResumeState.ADD_AT_FRONT){                
		                let p = this.floatingEndPoint.clone();
		                a.points.unshift(p);               
		            }else{		                            
		                let p = this.floatingEndPoint.clone();
		                a.add(p);    
		            }
	   } 		
		
		
		
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		
		if (this.selection&&this.isControlPointVisible) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}

}
fromXML(data){
   	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			this.polyline.points.push(new d2.Point(x, y));
	   }
	   if(j$(data).attr("thickness")){
	      this.thickness=(parseInt(j$(data).attr("thickness")));
	   }else{
		   this.thickness=parseInt(tokens[tokens.length-1]); 
	   }
}
toXML(){
	var result = "<line  thickness=\"" + this.thickness + "\">";
	this.polyline.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,1) + "," + utilities.roundFloat(point.y,1) + ",";
	},this);
	result += "</line>\r\n";
	return result;	
}
}
class FontLabel extends Shape{
	constructor(x, y) {
		super(x, y, 0, 0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Label");		
		this.texture=new font.SymbolFontTexture("Label","label",x,y,0,8);
	}
	clone(){
		var copy = new FontLabel(this.x,this.y);
		copy.texture = this.texture.clone();  				
		return copy;
	}
	getClickableOrder() {		
		return 0;
	}	
	calculateShape(){ 
		  return this.texture.getBoundingShape();
		}
	isClicked(x, y) {
		if (this.texture.isClicked(x, y))
			return true;
		else
			return false;
	}    
    setSelected(selected) {
        this.texture.selection=selected;
    }
    
    isSelected() {
        return this.texture.selection;
    }	
    getTexture(){
		  return this.texture;
		}
    rotate(rotation){
    	this.texture.setRotation(rotation);	      
    }
    mirror(line){
    	let oldalignment = this.texture.shape.alignment;
    	this.texture.mirror(line);	
        if (line.isVertical) { //right-left mirroring
            if (this.texture.shape.alignment == oldalignment) {
                this.texture.shape.anchorPoint.set(this.texture.shape.anchorPoint.x +
                                        (this.texture.shape.metrics.ascent - this.texture.shape.metrics.descent),this.texture.shape.anchorPoint.y);
            }
        } else { //***top-botom mirroring          
            if (this.texture.shape.alignment == oldalignment) {
            	this.texture.shape.anchorPoint.set(this.texture.shape.anchorPoint.x,this.texture.shape.anchorPoint.y +(this.texture.shape.metrics.ascent - this.texture.shape.metrics.descent));
            }
        }        
      
    }
    move(xoffset,yoffset) {
        this.texture.move(xoffset, yoffset);
    }
   getCenter() {        
        return this.texture.shape.anchorPoint;
   }
paint(g2, viewportWindow, scale,layersmask) {	
	  var rect = this.texture.getBoundingShape();
	  rect.scale(scale.getScale());
	  if (!rect.intersects(viewportWindow)) {
	  	return;
	  }
	  this.texture.paint(g2, viewportWindow, scale);
}
fromXML(data){	 		
    this.texture.fillColor ="#" +(j$(data).attr("color") & 0x00FFFFFF).toString(16).padStart(6, '0');
	this.texture.fromXML(j$(data).text());
}
static formatToXML(texture){
	return "<label color=\""+utilities.hexToDec(texture.fillColor)+"\">"+texture.toXML()+"</label>";
}
toXML(){
    if(this.texture!=null&&!this.texture.isEmpty()){
        return "<label color=\""+utilities.hexToDec(this.texture.fillColor)+"\">"+this.texture.toXML()+"</label>";
    }else
        return "";  	
}    
}
class Arc extends Shape{
	constructor(x,y,w,h) {
	   super(x,y, w, h, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Arc");		
		this.arc=new d2.Arcellipse(new d2.Point(x,y),w,h);
		this.selectionRectWidth=4;
		this.fillColor='#000000';							
	}
	clone(){
		var copy = new Arc(this.arc.pc.x,this.arc.pc.y,this.arc.w,this.arc.h);
		copy.arc=this.arc.clone();
		copy.fill=this.fill;
		copy.thickness=this.thickness;
		return copy;
	}
    alignResizingPointToGrid(point) {

    }	
    getClickableOrder() {        
        return this.getBoundingShape().area;
    }	
	calculateShape() {
		return this.arc.box;		
	}
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null;
		this.arc.vertices.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	isClicked(x, y) {
		if (this.arc.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	isStartAnglePointClicked(x,y){	
	    let p=this.arc.start;
	    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
	                 this.selectionRectWidth, this.selectionRectWidth);
	    if (box.contains({x,y})) {
	        return true;
	    }else{                   
	        return false;
		}
	}	
	isExtendAnglePointClicked(x,y){
	    let p=this.arc.end;
	    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
	                 this.selectionRectWidth, this.selectionRectWidth);
	    if (box.contains({x,y})) {
	        return true;
	    }else{                   
	        return false;
		}
	}	
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}
	getCenter() {
	    return this.arc.pc;
	}
	setExtendAngle(extendAngle){
	    this.arc.endAngle=utilities.round(extendAngle);
	}
	setStartAngle(startAngle){        
	    this.arc.startAngle=utilities.round(startAngle);
	}	
	rotate(rotation){	
		   this.arc.pc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
		   let w=this.arc.w;
		   this.arc.w=this.arc.h;
		   this.arc.h=w;
		   this.arc.startAngle+=rotation.angle;
      	   if(this.arc.startAngle>=360){
    		 this.arc.startAngle-=360;
    	   }
    	   if(this.arc.startAngle<0){
    		 this.arc.startAngle+=360; 
    	   }
	} 	
	mirror(line) {
	    this.arc.mirror(line);
	}
	move(xoffset,yoffset) {
        this.arc.move(xoffset, yoffset);
    }
	Resize(xoffset, yoffset,clickedPoint){
		this.arc.resize(xoffset, yoffset,clickedPoint);
	}
	paint(g2, viewportWindow, scale,layersmask) {	
	  	  var rect = this.arc.box;
	  	  rect.scale(scale.getScale());
	  	  if (!rect.intersects(viewportWindow)) {
	  		  return;
	  	  }

		  g2.lineWidth = this.thickness * scale.getScale();
		  g2.lineCap = 'round';
		  g2.lineJoin = 'round';
			
		  
			let e=this.arc.clone();	
			e.scale(scale.getScale());
	        e.move(-viewportWindow.x,- viewportWindow.y);
					  
			if (this.fill == core.Fill.EMPTY) {
				if (this.selection) {
					g2.strokeStyle = "#808080";
				} else {
					g2.strokeStyle = this.fillColor;
				}
				e.paint(g2);
			}else if(this.fill == core.Fill.GRADIENT){ 
			  g2._fill=true;		  
			  var grd = g2.createLinearGradient(e.box.x,e.box.y, e.box.max.x,e.box.max.y);
			  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
			  grd.addColorStop(1, "white");
			  g2.fillStyle = grd;
			  e.paint(g2);
			  g2._fill=false;
	          g2.strokeStyle=(this.selection?"#808080":this.fillColor);
	          e.paint(g2);
			}else {
				g2._fill=true;
				if (this.selection) {
					g2.fillStyle = "#808080";
				} else {
					g2.fillStyle = this.fillColor;
				}			
				e.paint(g2);
				g2._fill=false;
			}   

			
			
			if (this.isSelected()) {
				this.drawControlPoints(g2, viewportWindow, scale);
			}		
	}
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.arc.vertices); 		
}	
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
fromXML(data) {
		
    if(data.textContent.length>0){
    	var tokens = data.textContent.split(",");
    	let x=parseInt(tokens[0]);
    	let y=parseInt(tokens[1]);
    	let w=parseInt(tokens[2]);
    	let h=parseInt(tokens[3]);
    	this.arc.pc.set(x+w/2,y+h/2);
    	this.arc.w=w/2;
    	this.arc.h=h/2;
	
	
    	this.arc.endAngle = parseInt(tokens[4]);        
    	this.arc.startAngle = parseInt(tokens[5]);
    
    	this.thickness = parseInt(tokens[6]);
		this.fill = parseInt(tokens[7]);
    }else{    	
        let x=parseFloat(j$(data).attr("x"));
        let y=parseFloat(j$(data).attr("y"));
        let w=parseFloat(j$(data).attr("width"));
        let h=parseFloat(j$(data).attr("height"));
        
        this.arc.pc.set(x,y);
        this.arc.w=w;
        this.arc.h=h;
        
        this.arc.startAngle = parseFloat(j$(data).attr("start"));       
        this.arc.endAngle = parseFloat(j$(data).attr("extend"));
        
        this.thickness=(parseInt(j$(data).attr("thickness")));
        this.fill = (parseInt(j$(data).attr("fill")));  	
    }
  
}
toXML(){
 return '<arc  x="'+utilities.roundFloat(this.arc.pc.x,1)+'" y="'+utilities.roundFloat(this.arc.pc.y,1)+'" width="'+utilities.roundFloat(this.arc.w,1)+ '" height="'+utilities.roundFloat(this.arc.h,1)+ '"  thickness="'+this.thickness+'" start="'+utilities.roundFloat(this.arc.startAngle,1)+'" extend="'+utilities.roundFloat(this.arc.endAngle,1)+'" fill="'+this.fill+'" />\r\n';
}
}
class Ellipse extends Shape{
	constructor(w, h) {
		super(0,0, w, h, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Ellipse");		
		this.ellipse=new d2.Ellipse(new d2.Point(0,0),w,h);
		this.selectionRectWidth=4;
		this.fillColor='#000000';	
	}
	clone(){
		var copy = new Ellipse(this.ellipse.w,this.ellipse.h);
		copy.ellipse=this.ellipse.clone();
		copy.thickness=this.thickness;
		copy.fill=this.fill;
		return copy;
	}
    alignResizingPointToGrid(point) {

    }	
    getClickableOrder() {        
        return this.getBoundingShape().area;
    }	
	calculateShape() {
		return this.ellipse.box;		
	}
	getCenter() {
	    return this.ellipse.pc;
	}
	isClicked(x, y) {
		if (this.ellipse.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}	
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null
		this.ellipse.vertices.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	move(xoffset,yoffset) {
        this.ellipse.move(xoffset, yoffset);
    }
    mirror(line){
       this.ellipse.mirror(line);	
    }
    rotate(rotation){			   
	   this.ellipse.pc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	   let w=this.ellipse.w;
	   this.ellipse.w=this.ellipse.h;
	   this.ellipse.h=w;
	}    
	Resize(xoffset, yoffset,clickedPoint){
		this.ellipse.resize(xoffset, yoffset,clickedPoint);
	}    
    paint(g2, viewportWindow, scale,layersmask) {	
  	  var rect = this.ellipse.box;
  	  rect.scale(scale.getScale());
  	  if (!rect.intersects(viewportWindow)) {
  		  return;
  	  }

		g2.lineWidth = this.thickness * scale.getScale();

		let e=this.ellipse.clone();	
		e.scale(scale.getScale());
        e.move(-viewportWindow.x,- viewportWindow.y);
		e.paint(g2);
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "#808080";
			} else {
				g2.strokeStyle = this.fillColor;
			}
			e.paint(g2);
		}else if(this.fill == core.Fill.GRADIENT){ 
		  g2._fill=true;		  
		  var grd = g2.createLinearGradient(e.box.x,e.box.y, e.box.max.x,e.box.max.y);
		  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
		  grd.addColorStop(1, "white");
		  g2.fillStyle = grd;
		  e.paint(g2);
		  g2._fill=false;
          g2.strokeStyle=(this.selection?"#808080":this.fillColor);
          e.paint(g2);
		}else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "#808080";
			} else {
				g2.fillStyle = this.fillColor;
			}			
			e.paint(g2);
			g2._fill=false;
		} 
		
		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}	
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.ellipse.vertices); 		
	}	
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
fromXML(data) {
    if(j$(data).attr("width")!=undefined){
        let x=(parseFloat(j$(data).attr("x")));
        let y=(parseFloat(j$(data).attr("y")));
        this.ellipse.pc.set(x,y);
        this.ellipse.w=parseFloat(j$(data).attr("width"));
        this.ellipse.h=parseFloat(j$(data).attr("height"));  
        this.thickness=(parseInt(j$(data).attr("thickness")));
        this.fill=parseInt(j$(data).attr("fill"));  
        this.fill=(this.fill==0?1:this.fill);
    }else{			
    	var tokens = data.textContent.split(",");
    	let x=parseInt(tokens[0]);
    	let y=parseInt(tokens[1]);
    	let w=parseInt(tokens[2]);
    	let h=parseInt(tokens[3]);
    	this.ellipse.pc.set(x+w/2,y+h/2);
    	this.ellipse.w=w/2;
    	this.ellipse.h=h/2;
    	this.thickness=parseInt(tokens[4]);	
    }
    
}
toXML() {
    return "<ellipse x=\""+utilities.roundFloat(this.ellipse.pc.x,1)+"\" y=\""+utilities.roundFloat(this.ellipse.pc.y,1)+"\" width=\""+utilities.roundFloat(this.ellipse.w,1)+"\" height=\""+utilities.roundFloat(this.ellipse.h,1)+"\" thickness=\""+this.thickness+"\" fill=\""+this.fill+"\"/>\r\n";
}
}


class RoundRect extends Shape{
	constructor(x, y, width, height,arc,thickness) {
		super(x, y, width, height, thickness,core.Layer.LAYER_ALL);
		this.setDisplayName("Rect");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='#000000';
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone(){
		var copy = new RoundRect(this.x,this.y,this.width,this.height,0,this.thickness);
		copy.roundRect = this.roundRect.clone();		
		copy.fill = this.fill;		
		return copy;
	}
    getClickableOrder() {        
        return this.getBoundingShape().area;
    }
	calculateShape() {
		return this.roundRect.box;		
	}
    alignResizingPointToGrid(targetPoint){
        let point=this.owningUnit.getGrid().positionOnGrid(targetPoint.x,targetPoint.y);  
        this.Resize(point.x -targetPoint.x,point.y-targetPoint.y,targetPoint);     
    }	
	getCenter() {
		let box=this.roundRect.box;
	    return box.center;
	}
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}	
	isClicked(x, y) {
		if (this.roundRect.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null
		this.roundRect.points.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	setRounding(rounding){	  
		  this.roundRect.setRounding(rounding);
		}
	setResizingPoint(pt){
			this.resizingPoint=pt;
		}
	getResizingPoint() {
			return this.resizingPoint;
		}	
	move(xoffset, yoffset) {
		this.roundRect.move(xoffset,yoffset);
	}
	rotate(rotation){		
		this.roundRect.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}
    mirror(line){
    	this.roundRect.mirror(line);
    }	
	Resize(xoffset, yoffset,clickedPoint){
		this.roundRect.resize(xoffset, yoffset,clickedPoint);
	}
	paint(g2, viewportWindow, scale,layersmask) {	
		
		var rect = this.roundRect.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		
		g2.lineWidth = this.thickness * scale.getScale();
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		let r=this.roundRect.clone();	
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "#808080";
			} else {
				g2.strokeStyle = this.fillColor;
			}
			r.paint(g2);
		}else if(this.fill == core.Fill.GRADIENT){ 
		  
		  g2.globalAlpha=0.5;	
		  g2._fill=true;		  
		  var grd = g2.createLinearGradient(r.box.x,r.box.y, r.box.max.x,r.box.max.y);
		  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
		  grd.addColorStop(1, "white");
		  g2.fillStyle = grd;
		  r.paint(g2);
		  g2._fill=false;
          g2.strokeStyle=(this.selection?"#808080":this.fillColor);
          r.paint(g2);
          g2.globalAlpha=1;
		}else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "#808080";
			} else {
				g2.fillStyle = this.fillColor;
			}			
			r.paint(g2);
			g2._fill=false;
		}        
        
		
		
		
		

		if (this.isSelected()&&this.isControlPointVisible) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}	
drawControlPoints(g2, viewportWindow, scale){
		utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.roundRect.vertices); 		
}	
fromXML(data){
    if(j$(data).attr("points")!=undefined){                
        this.roundRect.rounding=(parseInt(j$(data).attr("arc")));
        var tokens = j$(data).attr("points").split(",");
 	    var len = Math.floor(tokens.length / 2) * 2;
 	    var points=[]
	    for (var index = 0; index < len; index += 2) {
			var x = parseInt(tokens[index]);
			var y = parseInt(tokens[index + 1]);
			points.push(new d2.Point(x, y));
	    }   
 	   this.roundRect.setPoints(points);
        this.thickness=(parseInt(j$(data).attr("thickness")));
        this.fill=parseInt(j$(data).attr("fill"));  
        this.fill=(this.fill==0?1:this.fill);
    }else{
	 var tokens = data.textContent.split(",");
	 this.roundRect.setRect(parseInt(tokens[0]),parseInt(tokens[1]),parseInt(tokens[2]),parseInt(tokens[3]));
	    
     this.thickness=(parseInt(tokens[4]));
     this.fill=parseInt(tokens[5]); 
	 this.roundRect.setRounding(parseInt(tokens[6]));
	}
}
toXML() {
	let box=this.roundRect.box;
    return "<rectangle>"+ utilities.roundFloat(box.min.x,1)+","+ utilities.roundFloat(box.min.y,1)+","+ utilities.roundFloat(box.width,1)+","+ utilities.roundFloat(box.height,1)+","+this.thickness+","+this.fill +","+this.roundRect.rounding+"</rectangle>\r\n";
}
}
class ArrowLine extends Shape{
	constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Arrow");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='#000000';	
	    this.line=new d2.Segment(0,0,20,20);
	    this.arrow=new d2.Polygon();
	    this.arrow.points=[new d2.Point(0,0),new d2.Point(0,0),new d2.Point(0,0)];
	    this.headSize;	    
	    this.setHeadSize(3);
}
clone(){
    var copy=new ArrowLine();
    copy.headSize=this.headSize;
    copy.fill=this.fill;
    copy.thinkness=this.thickness;
    copy.line=this.line.clone();
    copy.arrow=this.arrow.clone();    
    return copy;
}
calculateShape() {
	return this.line.box;		
}
getClickableOrder() {        
    return 4;
}
isClicked(x, y) {
	if (this.arrow.contains(new d2.Point(x, y))){
		return true;
	}else{
		  var rect = d2.Box.fromRect(x
					- (this.selectionRectWidth / 2), y
					- (this.selectionRectWidth / 2), this.selectionRectWidth,
					this.selectionRectWidth);
		  
			if (utilities.intersectLineRectangle(
					this.line.ps,this.line.pe, rect.min, rect.max)) {			
				return true;
			}else{
				return false
			}
	}
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	
		if (rect.contains(this.line.ps)){
		  return this.line.ps;	
		}else if(rect.contains(this.line.pe)) {					
		  return this.line.pe;
		}else{
		  return null;
		}
}
setHeadSize(headSize) {

    this.headSize = headSize;
    this.arrow.points[0].set(this.line.pe.x,this.line.pe.y);
    this.arrow.points[1].set(this.line.pe.x-2*headSize,this.line.pe.y -headSize);
    this.arrow.points[2].set(this.line.pe.x-2*headSize,this.line.pe.y+headSize);  
    let angle = Math.atan2(((this.line.pe.y) - (this.line.ps.y)),((this.line.pe.x - this.line.ps.x)));
    let deg=-1*utilities.degrees(angle);    
    this.arrow.rotate(deg,this.line.pe);
}	
Resize(xoffset,yoffset,clickedPoint) {    
    clickedPoint.set(clickedPoint.x + xoffset, 
                             clickedPoint.y + yoffset);
    this.setHeadSize(this.headSize);
}
rotate(rotation){		
	this.arrow.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	this.line.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
}
move(xoffset, yoffset) {
	this.line.move(xoffset,yoffset);
	this.arrow.move(xoffset,yoffset);
}
mirror(line){
	this.line.mirror(line);
	this.arrow.mirror(line);
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.line.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth = this.thickness * scale.getScale();

	if (this.selection) {
		g2.strokeStyle = "#808080";
	} else {
		g2.strokeStyle = this.fillColor;
	}


	
	let l=this.line.clone();
	l.pe.set((this.arrow.points[1].x + this.arrow.points[2].x)/2, (this.arrow.points[1].y + this.arrow.points[2].y)/2);
	l.scale(scale.getScale());
    l.move(-viewportWindow.x,- viewportWindow.y);
	l.paint(g2);
	
	if (this.fill == core.Fill.EMPTY) {
		if (this.selection) {
			g2.strokeStyle = "#808080";
		} else {
			g2.strokeStyle = this.fillColor;
		}
	} else {
		g2._fill=true;
		if (this.selection) {
			g2.fillStyle = "#808080";
		} else {
			g2.fillStyle = this.fillColor;
		}			
	}
	let a=this.arrow.clone();	
	a.scale(scale.getScale());
    a.move(-viewportWindow.x,- viewportWindow.y);
	a.paint(g2);
	g2._fill=false;	
	
	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}	
drawControlPoints(g2, viewportWindow, scale){
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,[this.line.ps,this.line.pe]); 		
}	
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
fromXML(data) { 	
	if(j$(data).attr("thickness")){
		var tokens = data.textContent.split(",");	
		this.line.ps.set(parseInt(tokens[0]),parseInt(tokens[1]));	
		this.line.pe.set(parseInt(tokens[2]),parseInt(tokens[3]));
		this.thickness= parseInt(j$(data).attr("thickness"));
		this.fill=parseInt(j$(data).attr("fill"));
		this.setHeadSize(parseInt(j$(data).attr("head")));		
	}else{
		var tokens = data.textContent.split(",");	
		this.line.ps.set(parseInt(tokens[0]),parseInt(tokens[1]));	
		this.line.pe.set(parseInt(tokens[2]),parseInt(tokens[3]));
		this.thickness=parseInt(tokens[4]);
		this.setHeadSize(parseInt(tokens[5]));
		this.fill=parseInt(tokens[6]);
	}
}
toXML(){
    return "<arrow thickness=\"" + this.thickness + "\" fill=\"" + this.fill + "\"  head=\"" + this.headSize+ "\">" + utilities.roundFloat(this.line.ps.x,1) + "," + utilities.roundFloat(this.line.ps.y,1) + "," + utilities.roundFloat(this.line.pe.x,1) + "," + utilities.roundFloat(this.line.pe.y,1) + "</arrow>\r\n";	
}
}
class Triangle extends Shape{
	constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Triangle");		
		this.selectionRectWidth=4;
		this.resizingPoint = null;
		this.fillColor='#000000';
	    this.shape=new d2.Polygon();
	    this.shape.points=[new d2.Point(0,0),new d2.Point(20,20),new d2.Point(0,40)];	    	    	    
}
clone(){
    var copy=new Triangle();
    copy.shape=this.shape.clone();  
    copy.fill = this.fill;
    return copy;
}
getClickableOrder() {        
    return this.getBoundingShape().area;
}
alignResizingPointToGrid(targetPoint){
    let point=this.owningUnit.getGrid().positionOnGrid(targetPoint.x,targetPoint.y);  
    this.Resize(point.x -targetPoint.x,point.y-targetPoint.y,targetPoint);     
}
calculateShape() {
  return this.shape.box;		
}
getCenter(){
	return this.shape.box.center;
}
isClicked(x, y) {
  return this.shape.contains(new d2.Point(x, y));	
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.shape.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
		  point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
rotate(rotation){		
	this.shape.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
}
move(xoffset, yoffset) {
	this.shape.move(xoffset,yoffset);	
}
mirror(line){
	this.shape.mirror(line);
}
paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.shape.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	g2.lineWidth = this.thickness * scale.getScale();
	let a=this.shape.clone();	
	a.scale(scale.getScale());
    a.move(-viewportWindow.x,- viewportWindow.y);
	a.paint(g2);
	if (this.fill == core.Fill.EMPTY) {
		if (this.selection) {
			g2.strokeStyle = "#808080";
		} else {
			g2.strokeStyle = this.fillColor;
		}
		a.paint(g2);
	}else if(this.fill == core.Fill.GRADIENT){ 
	  g2._fill=true;		  
	  var grd = g2.createLinearGradient(a.box.x,a.box.y, a.box.max.x,a.box.max.y);
	  grd.addColorStop(0, (this.selection?"#808080":this.fillColor));
	  grd.addColorStop(1, "white");
	  g2.fillStyle = grd;
	  a.paint(g2);
	  g2._fill=false;
      g2.strokeStyle=(this.selection?"#808080":this.fillColor);
      a.paint(g2);
	}else {
		g2._fill=true;
		if (this.selection) {
			g2.fillStyle = "#808080";
		} else {
			g2.fillStyle = this.fillColor;
		}			
		a.paint(g2);
		g2._fill=false;
	} 

	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}
//***old schema
//DIRECTION_WEST = 0x01;
//DIRECTION_NORTH = 0x02;
//DIRECTION_EAST = 0x04;
//DIRECTION_SOUTH = 0x08;
initPoints(orientation,x,y,width,height){     
    if(orientation==0x01){   
    	this.shape.points[0].set(x,y+height/2);        
    	this.shape.points[1].set(x+width,y);    	
    	this.shape.points[2].set(x+width,y+height);    	       
    }else if(orientation==0x02){    	
    	this.shape.points[0].set(x+width/2, y);
    	this.shape.points[1].set(x+width, y+height);
    	this.shape.points[2].set(x, y+height);            
    }else if(orientation==0x04){                  
    	this.shape.points[0].set(x+width,y+height/2);
    	this.shape.points[1].set(x,y+height);
    	this.shape.points[2].set(x,y);            
    }else{      
    	this.shape.points[0].set(x+width/2,y+height);
    	this.shape.points[1].set(x,y);
    	this.shape.points[2].set(x+width,y);
      
    }
    
}
fromXML(data){
	if(j$(data).attr("thickness")){
		this.thickness=parseInt(j$(data).attr("thickness"));
		this.fill=parseInt(j$(data).attr("fill"));
		var tokens = data.textContent.split(",");		
		    	
		this.shape.points[0].set(parseFloat(tokens[0]),parseFloat(tokens[1]));
		this.shape.points[1].set(parseFloat(tokens[2]),parseFloat(tokens[3]));
		this.shape.points[2].set(parseFloat(tokens[4]),parseFloat(tokens[5]));
	}else{
		var tokens = data.textContent.split(",");	
        var orientation=parseInt(tokens[0]);
        this.initPoints(orientation,parseFloat(tokens[1]),parseFloat(tokens[2]),parseFloat(tokens[3]),parseFloat(tokens[4]));           
        this.thickness=parseInt(tokens[5]);
        this.fill=parseInt(tokens[6]);   		
	}
    
}
toXML(){
	let points="";
	this.shape.points.forEach(function(point) {
	   points += utilities.roundFloat(point.x,1) + "," + utilities.roundFloat(point.y,1) + ",";
	});	
    return "<triangle thickness=\"" + this.thickness + "\" fill=\"" + this.fill + "\">"+points+"</triangle>\r\n";	
}
drawControlPoints(g2, viewportWindow, scale){
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.shape.points); 		
}
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
}
Style ={
    LINE:0, /*default*/
    INVERTED:1,
    CLOCK:2,
    INVERTED_CLOCK:3,
    INPUT_LOW:4,
    CLOCK_LOW:5,
    OUTPUT_LOW:6,
    FALLING_EDGE_CLOCK:7,
    NON_LOGIC:8
}
Orientation={
        NORTH:0,
        SOUTH:1,
        WEST:2,
        EAST:3,
mirror:function(isHorizontal,orientation){
    if (isHorizontal) {
        if (orientation == Orientation.EAST)
            return Orientation.WEST;
        else if (orientation == Orientation.WEST)
            return Orientation.EAST;
        else
            return orientation;
    } else {
        if (orientation == Orientation.NORTH)
            return Orientation.SOUTH;
        else if (orientation == Orientation.SOUTH)
            return Orientation.NORTH;
        else
            return orientation;
    }	
},      
rotate:function(isClockwise,orientation) {
       if (isClockwise) {
               if (orientation == Orientation.NORTH)
                    return Orientation.EAST;
                else if (orientation == Orientation.EAST)
                    return Orientation.SOUTH;
                else if (orientation == Orientation.SOUTH)
                    return Orientation.WEST;
                else
                    return Orientation.NORTH;
        } else {
                if (orientation == Orientation.NORTH)
                    return Orientation.WEST;
                else if (orientation == Orientation.WEST)
                    return Orientation.SOUTH;
                else if (orientation == Orientation.SOUTH)
                    return Orientation.EAST;
                else
                    return Orientation.NORTH;
        }
  }        
}
PinType={
		SIMPLE:0,
		COMPLEX:1,
};
var PIN_LENGTH = 2 * utilities.POINT_TO_POINT;

class Pin extends Shape{
constructor() {
		super(0, 0, 0,0, 1,core.Layer.LAYER_ALL);
		this.setDisplayName("Pin");		
		this.selectionRectWidth=4;
		this.fillColor='#000000';
	    this.segment=new d2.Segment(0,0,0,0);        
        this.type = PinType.COMPLEX;
        this.style = Style.LINE;

 	    this.name=new font.SymbolFontTexture("XXX","name",-8,2,0,8);
	    this.number=new font.SymbolFontTexture("1","number",10,-1,0,8);
	    this.init(Orientation.EAST);
	}
clone(){
    var copy=new Pin();
    copy.orientation=this.orientation;
    copy.type=this.type;
    copy.style=this.style;
    copy.name=this.name.clone();
    copy.number=this.number.clone();
    copy.segment=this.segment.clone();
    return copy;
}

alignToGrid(isRequired) {
    var center=this.segment.ps;
    var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
    this.move(point.x - center.x,point.y - center.y);
    return new d2.Point(point.x - center.x, point.y - center.y);  
}
getClickableOrder() {        
    return 1;
}
getClickedTexture(x,y) {
	if(this.type==PinType.SIMPLE){
		return null;
	}
    if(this.name.isClicked(x, y))
        return this.name;
    else if(this.number.isClicked(x, y))
        return this.number;
    else
    return null;
}
getPinPoint(){
	return this.segment.ps;
}
isClickedTexture(x,y) {
    return this.getClickedTexture(x, y)!=null;
}
getTextureByTag(tag) {
    if(tag===(this.name.tag))
        return this.name;
    else if(tag===(this.number.tag))
        return this.number;
    else
    return null;
}
isClicked(x, y) {
	  var rect = d2.Box.fromRect(x
				- (this.selectionRectWidth / 2), y
				- (this.selectionRectWidth / 2), this.selectionRectWidth,
				this.selectionRectWidth);
	  
		if (utilities.intersectLineRectangle(
				this.segment.ps,this.segment.pe, rect.min, rect.max)) {			
			return true;
		}else{
			return false
		}
		
}
mirror(line){	
  let pinorientation=this.segment.isHorizontal?TextOrientation.HORIZONTAL:TextOrientation.VERTICAL;
  
  let oposname= utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
  let oposnumber= utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	
  
  let oalignmentname=TextAlignment.getOrientation(this.name.shape.alignment);
  let alignmentname=this.name.shape.alignment;
  let oalignmentnumber=TextAlignment.getOrientation(this.number.shape.alignment);
  let alignmentnumber=this.number.shape.alignment;
	
  this.segment.mirror(line);	
  if(line.isVertical){ //left-right 	 	  
	  this.orientation = Orientation.mirror(true,this.orientation);	  
  }else{	  
	  this.orientation = Orientation.mirror(false,this.orientation);
  }	
  this.name.mirror(line);
  this.number.mirror(line);
  
  if(oalignmentname!=pinorientation){  //pin and text different orientation
	  this.__normalizeText(this.name, alignmentname, line.isVertical);
  }else{
	  let nposname=utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);  
	  this.normalizeText(this.name,oposname,nposname);
  }
  
  if(oalignmentnumber!=pinorientation){  //pin and text different orientation
	  this.__normalizeText(this.number, alignmentnumber, line.isVertical); 
  }else{
	  let nposnumber=utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);  
	  this.normalizeText(this.number,oposnumber,nposnumber);  
  }

}

rotate(rotation){
	let pinorientation=this.segment.isHorizontal?TextOrientation.HORIZONTAL:TextOrientation.VERTICAL;
	
	//read current position	
	let oposname= utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	let oposnumber= utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);
	
	let oalignmentname=TextAlignment.getOrientation(this.name.shape.alignment);
	let alignmentname=this.name.shape.alignment;
	let oalignmentnumber=TextAlignment.getOrientation(this.number.shape.alignment);
	let alignmentnumber=this.number.shape.alignment;
	
	this.segment.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	this.orientation=Orientation.rotate(rotation.angle>0?false:true,this.orientation);
	this.name.rotate(rotation);
	this.number.rotate(rotation);
	
    if(oalignmentname!=pinorientation){  //pin and text different orientation
        this._normalizeText(this.name,oalignmentname, rotation.angle);  
    }else{  //pin and text same orientation
      //read new position
    	let nposname=utilities.POSITION.findPositionToLine(this.name.shape.anchorPoint.x,this.name.shape.anchorPoint.y,this.segment.ps,this.segment.pe);   
    	this.normalizeText(this.name,oposname,nposname);            
    }

    if(oalignmentnumber!=pinorientation){  //pin and text different orientation
        this._normalizeText(this.number,oalignmentnumber, rotation.angle);  
    }else{  //pin and text same orientation

    	let nposnumber=utilities.POSITION.findPositionToLine(this.number.shape.anchorPoint.x,this.number.shape.anchorPoint.y,this.segment.ps,this.segment.pe);    	
    	this.normalizeText(this.number,oposnumber,nposnumber);
    }    
	
	
}
normalizeText(text,opos,npos){
	if(opos==npos){
	   return;	
	}
	text.mirror(new d2.Line(this.segment.ps,this.segment.pe));
}
//pin and text have different orientation
_normalizeText(text,orientation,angle){
    if(angle<0){  //clockwise              
        if(orientation == TextOrientation.HORIZONTAL){
            text.shape.anchorPoint.set(text.shape.anchorPoint.x+(text.shape.metrics.ascent-text.shape.metrics.descent),text.shape.anchorPoint.y);            
        }
    }else{                   
        if(orientation == TextOrientation.VERTICAL){
            text.shape.anchorPoint.set(text.shape.anchorPoint.x,text.shape.anchorPoint.y+(text.shape.metrics.ascent-text.shape.metrics.descent));                   
        }
    }
}
//pin and text have different orientation
__normalizeText(text, alignment, isVertical){
    if (isVertical) { //right-left mirroring
        if (text.shape.alignment == alignment) {
            text.shape.anchorPoint.set(text.shape.anchorPoint.x +
                                    (text.shape.metrics.ascent - text.shape.metrics.descent),text.shape.anchorPoint.y);
        }
    } else { //***top-botom mirroring          
        if (text.shape.alignment == alignment) {
            text.shape.anchorPoint.set(text.shape.anchorPoint.x,text.shape.anchorPoint.y +(text.shape.metrics.ascent - text.shape.metrics.descent));
        }
    }  
}
move(xoffset,yoffset) {
    this.segment.move(xoffset,yoffset);
	this.name.move(xoffset,yoffset);
	this.number.move(xoffset,yoffset);
}
calculateShape() {
	return this.segment.box;
}
/*
 * keep text orientation too, observing text normalization
 */
setOrientation(orientation){
 let o=this.orientation;
 let r={originx:this.segment.ps.x,
	       originy:this.segment.ps.y,
	       angle:-90};
 
 while(o!=orientation){
	 switch (o) {
	 case Orientation.EAST:        
		 //o=Orientation.SOUTH;
		 this.rotate(r);
     break;
	 case Orientation.WEST:
		 //o=Orientation.NORTH;
		 this.rotate(r);
     break;
	 case Orientation.NORTH:
		 //o=Orientation.EAST;
		 this.rotate(r);
     break;
	 case Orientation.SOUTH:    	
		 //o=Orientation.WEST;
		 this.rotate(r);
  
	 }
	 o=this.orientation; 
 }
}

init(orientation){
	this.orientation=orientation;
    switch (this.orientation) {
    case Orientation.EAST:        
        this.segment.pe.set(this.segment.ps.x + (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2), this.segment.ps.y);
        break;
    case Orientation.WEST:
    	this.segment.pe.set(this.segment.ps.x - (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2), this.segment.ps.y);    	
        break;
    case Orientation.NORTH:
    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y - (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2));    	
        break;
    case Orientation.SOUTH:    	
    	this.segment.pe.set(this.segment.ps.x, this.segment.ps.y + (this.type == PinType.COMPLEX ? PIN_LENGTH : PIN_LENGTH / 2));
    }   
}
setPinType(type){
	this.type=type;
	this.init(this.orientation);
}
getCenter(){
	return this.segment.ps;
}
setSelected (selection) {
	super.setSelected(selection);
	this.number.setSelected(selection);
	this.name.setSelected(selection);
}

paint(g2, viewportWindow, scale,layersmask) {
	var rect = this.segment.box;
	rect.scale(scale.getScale());
	if (!rect.intersects(viewportWindow)) {
		return;
	}
	
	

	g2.lineWidth = this.thickness ;
	if (this.selection) {
		g2.strokeStyle = "#0000ff";
	  	this.name.fillColor = "#808080";
	  	this.number.fillColor = "#808080";
	} else {
		g2.strokeStyle = this.fillColor;
	  	this.name.fillColor = this.fillColor;
		this.number.fillColor =this.fillColor;
	}
	
	switch(this.style){
	case Style.LINE:
		this.drawPinLine(g2, viewportWindow, scale,0);
		break;
	case Style.INVERTED:
		this.drawPinLine(g2, viewportWindow, scale,(PIN_LENGTH / 3));
		this.drawInverted(g2, viewportWindow, scale);
		break;	  
	case Style.CLOCK:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawTriState(g2, viewportWindow, scale);
		break;
	case Style.INVERTED_CLOCK:
		this.drawPinLine(g2, viewportWindow, scale,(PIN_LENGTH / 3));
		this.drawInverted(g2, viewportWindow, scale);
		this.drawTriState(g2, viewportWindow, scale);
		break;
	case Style.INPUT_LOW:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawInputLow(g2, viewportWindow, scale);
		break;
	case Style.CLOCK_LOW:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawInputLow(g2, viewportWindow, scale);
		this.drawTriState(g2, viewportWindow, scale);
		break;
	case  Style.OUTPUT_LOW:
		this.drawPinLine(g2, viewportWindow, scale,0);
		this.drawOutputLow(g2, viewportWindow, scale);
		break;
	case  Style.FALLING_EDGE_CLOCK:
		this.drawPinLine(g2, viewportWindow, scale,PIN_LENGTH/ 6);
		this.drawFallingEdgeClock(g2, viewportWindow, scale);
		break;
		  
	}
	if (this.type == PinType.COMPLEX) {		  
      this.name.paint(g2, viewportWindow, scale);
      this.number.paint(g2, viewportWindow, scale);
	}
    if (this.isSelected()) {
        let c=new d2.Circle(this.segment.pe.clone(), 2);
        c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
        c.paint(g2,false);        
    }
}
fromXML(data){
	this.type=parseInt(j$(data).attr("type"));
	if(j$(data).attr("style")){
	  this.style=parseInt(j$(data).attr("style"));
	}else{
	  this.style=0;		
	}
	let a=j$(data).find("a");
	if(a.length>0){   //old schema
	  var tokens = a.text().split(",");
	  this.segment.ps.set(parseFloat(tokens[0]),parseFloat(tokens[1]));
	  this.init(parseInt(tokens[3]));
	}else{
        this.segment.ps.set(parseFloat(j$(data).attr("x")),parseFloat(j$(data).attr("y")));   
        this.init(parseInt(j$(data).attr("orientation")));	
	}
    var number=(j$(data).find("number").text()); 
	var name=(j$(data).find("name").text());
	if(number==''){
	  this.number.setText('');
	  this.number.shape.anchorPoint.set(this.segment.ps.x,this.segment.ps.y);
	}else{
	  this.number.fromXML(number);
	}
	if(name==''){
	  this.name.setText('');
	  this.name.shape.anchorPoint.set(this.segment.ps.x,this.segment.ps.y);
	}else{
	  this.name.fromXML(name);
	}	
}
toXML(){
	let xml="<pin type=\"" + this.type + "\"  style=\"" + this.style + "\"   x=\""+utilities.roundFloat(this.segment.ps.x,1)+"\" y=\""+utilities.roundFloat(this.segment.ps.y,1)+"\" orientation=\""+this.orientation+"\">\r\n";	
    if(this.type == PinType.COMPLEX){
	 if (!this.number.isEmpty())
    	xml+="<number>" +
                  this.number.toXML() +
             "</number>\r\n";
     if (!this.name.isEmpty())
       xml+="<name>" +
                  this.name.toXML() +
             "</name>\r\n";	
    }
	xml+="</pin>";
	return xml;
}
drawPinLine(g2,viewportWindow, scale,offset){	
    let line=this.segment.clone();            
        
    switch (this.orientation) {
    case Orientation.SOUTH:
    	line.ps.set(line.ps.x,line.ps.y+offset);
        break;
    case Orientation.NORTH:
    	line.ps.set(line.ps.x,line.ps.y-offset);
        break;
    case Orientation.WEST:
    	line.ps.set(line.ps.x-offset,line.ps.y);  
        break;
    case Orientation.EAST:
    	line.ps.set(line.ps.x+offset,line.ps.y);    	
        break;
    }
	line.scale(scale.getScale());
    line.move(-viewportWindow.x,- viewportWindow.y);
    
    line.paint(g2);
}
drawFallingEdgeClock( g2, viewportWindow,scale) {
	let pinlength = PIN_LENGTH *scale.getScale(); 
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
    case Orientation.SOUTH:
        line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y + pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y + pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.NORTH:
        line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y - pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                      y - pinlength / 6 - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.WEST:
        line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                      x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                      x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.EAST:
        line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                      x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                      x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    }
}
drawOutputLow(g2,viewportWindow, scale) {
	let pinlength = PIN_LENGTH *scale.getScale(); 
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
    case Orientation.SOUTH:
        line.set(x - viewportWindow.x, y+ (pinlength / 3) - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y  - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.NORTH:
        line.set(x - viewportWindow.x, y- (pinlength / 3) - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.WEST:
        line.set(x - viewportWindow.x, y- (pinlength / 6) - viewportWindow.y, x - (pinlength / 3) - viewportWindow.x,
                      y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.EAST:
        line.set(x - viewportWindow.x, y - (pinlength / 6) - viewportWindow.y, x + (pinlength / 3) - viewportWindow.x,
                      y  - viewportWindow.y);
        line.paint(g2);
        break;
    }

}
drawInputLow(g2,viewportWindow, scale) {
	let pinlength = PIN_LENGTH *scale.getScale(); 
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
    case Orientation.SOUTH:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y + (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        line.set(x - (pinlength / 6) - viewportWindow.x, y + (pinlength / 3) - viewportWindow.y,
                      x - viewportWindow.x, y + (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.NORTH:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x - (pinlength / 6) - viewportWindow.x,
                      y - (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        line.set(x - (pinlength / 6) - viewportWindow.x, y - (pinlength / 3) - viewportWindow.y,
                      x - viewportWindow.x, y - (pinlength / 3) - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.WEST:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x - (pinlength / 3) - viewportWindow.x,
                      y - (pinlength / 6) - viewportWindow.y);
        line.paint(g2);
        line.set(x - (pinlength / 3) - viewportWindow.x, y - (pinlength / 6) - viewportWindow.y,
                      x - (pinlength / 3) - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    case Orientation.EAST:
        line.set(x - viewportWindow.x, y - viewportWindow.y, x + (pinlength / 3) - viewportWindow.x,
                      y - (pinlength / 6) - viewportWindow.y);
        line.paint(g2);
        line.set(x + (pinlength / 3) - viewportWindow.x, y - (pinlength / 6) - viewportWindow.y,
                      x + (pinlength / 3) - viewportWindow.x, y - viewportWindow.y);
        line.paint(g2);
        break;
    }

}
drawTriState(g2, viewportWindow, scale){
    let pinlength = PIN_LENGTH *scale.getScale();    
    let line=new d2.Segment(0,0,0,0);
    let x=this.segment.ps.x*scale.getScale();
    let y=this.segment.ps.y*scale.getScale();
    switch (this.orientation) {
      case Orientation.EAST:
          line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                  x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
          line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                  x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
    	  break;
      case Orientation.WEST:
          line.set(x - viewportWindow.x, y - pinlength / 6 - viewportWindow.y,
                  x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
          line.set(x - viewportWindow.x, y + pinlength / 6 - viewportWindow.y,
                  x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y);
          line.paint(g2);
    	  break;
      case Orientation.NORTH:
          line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y + pinlength / 6 - viewportWindow.y);
          line.paint(g2);
          line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y + pinlength / 6 - viewportWindow.y);
          line.paint(g2);
    	  break;
      case Orientation.SOUTH:
          line.set(x - pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y - pinlength / 6 - viewportWindow.y);
          line.paint(g2);
          line.set(x + pinlength / 6 - viewportWindow.x, y - viewportWindow.y, x - viewportWindow.x,
                  y - pinlength / 6 - viewportWindow.y);
          line.paint(g2);
    	  break;	    	  	    
    }
}
drawInverted(g2, viewportWindow, scale){
    let invertCircleRadios = (PIN_LENGTH / 6);
    let circle=new d2.Circle(new d2.Point(this.segment.ps.x,this.segment.ps.y),invertCircleRadios);
    switch (this.orientation) {
      case Orientation.EAST:
    	  circle.move(invertCircleRadios,0);
    	  break;
      case Orientation.WEST:
    	  circle.move(-invertCircleRadios,0);
    	  break;
      case Orientation.NORTH:
    	  circle.move(0,-invertCircleRadios);
    	  break;
      case Orientation.SOUTH:
    	  circle.move(0,invertCircleRadios);
    	  break;	    	  	    
    }
	circle.scale(scale.getScale());
	circle.move(-viewportWindow.x,- viewportWindow.y);
	circle.paint(g2);	
}	
}
module.exports ={
		ArrowLine,
		Triangle,
		Arc,
		Pin,
		Ellipse,
		Line,
		FontLabel,
		RoundRect,
		PIN_LENGTH,
		Orientation,
		SymbolShapeFactory
	}
});

;require.register("symbols/views/symbolloadview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var SymbolContainer=require('symbols/d/symbolcomponent').SymbolContainer;

var SymbolLoadView=Backbone.View.extend({
	  initialize:function(opt){
			j$('#SymbolLoadDialog').jqxWindow('open');
			j$('#SymbolLoadDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#SymbolLoadDialog').on('close', j$.proxy(this.onclose,this)); 			
			this.unitSelectionPanel=new core.UnitSelectionPanel({selectorid:'unitselectionpanel',canvasprefixid:'f',enabled:opt.enabled});
			this.unitSelectionPanel.textColor='#000000';
			this.unitSelectionPanel.backColor='white';
		    this.unitSelectionPanel.unitSelectionGrid.scaleFactor=0;
		    this.unitSelectionPanel.unitSelectionGrid.scaleRatio=1.2;    
		    this.unitSelectionPanel.unitSelectionGrid.minScaleFactor=0;
		    this.unitSelectionPanel.unitSelectionGrid.maxScaleFactor=10;
		    
			this.libraryview=new LibraryView({unitSelectionPanel:this.unitSelectionPanel});  
	    	this.buttonview=new ButtonView({unitSelectionPanel:this.unitSelectionPanel});  
	    	j$('#loadtitle').html("Load Symbol");
		  },
      onclose:function(){
    	  this.undelegateEvents();
    	  this.unitSelectionPanel.release();
    	  this.libraryview.clear();
    	  this.buttonview.clear();
    	  this.remove();
    	  this.unbind();
      },		  
      render:function(){
    	this.libraryview.render();  
    	this.buttonview.render();
    	this.unitSelectionPanel.render();
      }
		  
});

var LibraryView=Backbone.View.extend({
	el:"#librarycomboslot",
	initialize:function(opt){
		this.unitSelectionPanel=opt.unitSelectionPanel;
		j$('#symboltree').jqxTree({width: '100%',height:'260px'});
		//bind select element
		j$('#symboltree').on('select',j$.proxy(this.onvaluechange,this));			
        this.loadlibrary();
	},
	clear:function(){
	    //unbind select element		
		j$('#symboltree').off('select',j$.proxy(this.onvaluechange,this));
		j$('#symboltree').jqxTree('clear');
		j$('#librarycombo').html("");
		this.undelegateEvents();
	},
    events: {
        'change #librarycombo':'onchange',
    },
    onchange:function(event){
    	this.loadcategories(j$('#librarycombo').val()); 
    },
    onvaluechange:function(event){
        //is this category or footprint selection
    	var item = j$('#symboltree').jqxTree('getItem', event.args.element);
    	var url="";
    	var callback=null;
    	if(item.value.fullname!=undefined&&item.value.category!=undefined){
    		callback=this.loadfootprint;
    	  url=item.value.library+"/categories/"+item.value.category+"/"+item.value.fullname;	
    	}else if(item.value.category==undefined){
    		callback=this.loadfootprint;
        	  url=item.value.library+"/categories/null/"+item.value.fullname;	    	
    	}else{
    		//escape if full 
    	  var children = j$(item.element).find("li");
          if(children.length!=0){
        	  return;
          }
    	  callback=this.loadfootprints;
    	  url=item.value.library+"/categories/"+item.value.category;
    	}
    	
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/symbols/libraries/'+url,
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#SymbolLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(callback,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#SymbolLoadDialog').unblock();
	        }
	    });
    	
    },
    loadfootprint:function(data, textStatus, jqXHR){
      this.unitSelectionPanel.release();
      symbolContainer=new SymbolContainer();
      //disable 
      core.isEventEnabled=false;
      symbolContainer.parse(data);
      core.isEventEnabled=true;
      this.unitSelectionPanel.unitSelectionGrid.setModel(symbolContainer);
      this.unitSelectionPanel.unitSelectionGrid.build();   
      this.unitSelectionPanel.render();
//****load it    	
//		  this.footprintComponent.Clear();
//		  this.footprintComponent.setMode(mywebpads.ModeEnum.COMPONENT_MODE);
//		  this.footprintComponent.getModel().Parse(data);
//		  this.footprintComponent.getModel().setActiveUnit(0);
//		  this.footprintComponent.componentResized();
//          //position on center
//          rect=this.footprintComponent.getModel().getUnit().getBoundingRect();
//          this.footprintComponent.setScrollPosition(rect.getCenterX(),rect.getCenterY());
//          this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type: mywebpads.unit.Event.SELECT_UNIT});
//		  this.footprintComponent.Repaint();
//		  //set button group
//		  this.footprintComponent.getView().setButtonGroup(mywebpads.ModeEnum.COMPONENT_MODE);
    },
    loadfootprints:function(data, textStatus, jqXHR){
    	var item = j$('#symboltree').jqxTree('getSelectedItem');
		var that=this; 
		//fill category with footprints
		j$(data).find("name").each(j$.proxy(function(){	
			j$('#symboltree').jqxTree('addTo', { label: j$(this).text(),value:{library:j$(this).attr("library"),category:j$(this).attr("category"),fullname:j$(this).attr("fullname")}}, item);         
		}),that);
		j$('#symboltree').jqxTree('render');
		//expand
		j$('#symboltree').jqxTree('expandItem', item.element);
    },
    loadlibrary:function(){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/symbols/libraries',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#SymbolLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadlibraries,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#SymbolLoadDialog').unblock();
	        }
	    });
	    
	}, 
	onloadlibraries:function(data, textStatus, jqXHR){
		var that=this; 
		j$(data).find("name").each(j$.proxy(function(){
		  j$('#librarycombo').append('<option value=' +j$(this).text()+ '>' +  j$(this).text() + '</option>');
		}),that);
		//category load		
		this.loadcategories(j$('#librarycombo').val());
	},	
	loadcategories:function(library){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/symbols/libraries/'+library+'/categories',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#SymbolLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadcategories,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#SymbolLoadDialog').unblock();
	        }
	    });		
	},
	onloadcategories:function(data, textStatus, jqXHR){
		var that=this; 
		j$('#symboltree').jqxTree('clear');
		j$(data).find("name").each(j$.proxy(function(){	
			j$('#symboltree').jqxTree('addTo', { label: j$(this).text(),value:{library:j$(this).attr("library"),category:j$(this).attr("category"),fullname:(j$(this).attr("category")==undefined?j$(this).text():undefined)}}, null);         
		}),that);		
		j$('#symboltree').jqxTree('render');
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
		"<select class=\"form-control input-sm\" id=\"librarycombo\">"+
	    "</select>");
		
	}
});
var ButtonView=Backbone.View.extend({
	el:"#buttonslot",
	initialize:function(opt){
	  this.unitSelectionPanel=opt.unitSelectionPanel;
    },	
    clear:function(){
       this.undelegateEvents();
    },
    events: {
        "click  #loadbuttonid" : "onload",	
        "click  #closebuttonid" : "onclose",	
    },
    onload:function(e){
    	 if(this.unitSelectionPanel.unitSelectionGrid.model==null){
    		 return;
    	 }
    	//attach mouse position
    	this.unitSelectionPanel.unitSelectionGrid.model.event=e;    	    	
    	mywebpcb.trigger('libraryview:load',this.unitSelectionPanel.unitSelectionGrid.model);
		//close dialog 
		j$('#SymbolLoadDialog').jqxWindow('close');
    },
    onclose:function(){
    	j$('#SymbolLoadDialog').jqxWindow('close'); 	
    },
    
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
		"<button  id=\"loadbuttonid\" class=\"btn btn-default\">Load</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebuttonid\" class=\"btn btn-default\">Close</button>");
	}
});

module.exports =SymbolLoadView	



});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

