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
			this.component.getModel().getUnit().setSize(parseFloat(j$('#widthid').val()),parseFloat(j$('#heightid').val()));  
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
			
			//this.circuitComponent.hbar.jqxScrollBar({ value:this.circuitComponent.getModel().getUnit().scrollPositionXValue});
			//this.circuitComponent.vbar.jqxScrollBar({ value:this.circuitComponent.getModel().getUnit().scrollPositionYValue});
			
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