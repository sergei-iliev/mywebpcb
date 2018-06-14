var mywebpcb=require('core/core').mywebpcb;
var events=require('core/events');
var core=require('core/core');
//var UnitMgr = require('core/unit').UnitMgr;
var utilities =require('core/utilities');
var BaseBuilder = require('core/views/panelview').BaseBuilder;

var PCBFootprint=require('board/shapes').PCBFootprint;
var PCBLabel=require('board/shapes').PCBLabel;
var PCBTrack=require('board/shapes').PCBTrack;
var PCBVia=require('board/shapes').PCBVia;
var PCBCircle=require('board/shapes').PCBCircle;
var PCBArc=require('board/shapes').PCBArc;
var PCBLine=require('board/shapes').PCBLine;
var PCBRoundRect=require('board/shapes').PCBRoundRect;
var PCBCopperArea=require('board/shapes').PCBCopperArea;
var PCBHole=require('board/shapes').PCBHole;

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
var CirclePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		CirclePanelBuilder.__super__.initialize(component);
		this.id="circlepanelbuilder";  
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',        
        'keypress #radiusid' : 'onenter',
        'change #fillid': 'onchange',
        'change #layerid':'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }
        this.component.Repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='radiusid'){
		   this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#radiusid').val())));			 
		 } 
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.Resize(x-this.target.resizingPoint.x, 0, this.target.resizingPoint);			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.Resize(0, y-this.target.resizingPoint.y, this.target.resizingPoint);		   			 
		 } 		 
		 this.component.Repaint(); 		 
    },

	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y)); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#radiusid").val(core.COORD_TO_MM(this.target.getWidth()));    
		j$("#fillid").val(this.target.fill);		
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox(core.PCB_SYMBOL_LAYERS)+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:0,value:'EMPTY',selected:true},{id:1,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='padding:7px'>Radius</td><td><input type='text' id='radiusid' value='' class='form-control input-sm\'></td></tr>"+
				
		"</table>");
			
		return this;
	}
});
var RectPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		RectPanelBuilder.__super__.initialize(component);
		this.id="rectpanelbuilder";
		//app.bind('itemlinkimpl:oncklick', $.proxy(this.onitemclick,this));    
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',
        'keypress #widthid' : 'onenter',
        'keypress #heightid' : 'onenter',
        'keypress #roundingid' : 'onenter',
        'change #fillid': 'onchange',
        'change #layerid': 'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
    	if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }
        this.component.Repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='widthid'){
		   this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#widthid').val())));			 
		 } 
		 if(event.target.id=='heightid'){
			   this.target.setHeight(core.MM_TO_COORD(parseFloat(j$('#heightid').val())));			 
		 } 	
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.Resize(x-this.target.resizingPoint.x, 0, this.target.resizingPoint);			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.Resize(0, y-this.target.resizingPoint.y, this.target.resizingPoint);		   			 
		 } 	
		 if(event.target.id=='roundingid'){
			 this.target.arc=core.MM_TO_COORD(parseFloat(j$('#roundingid').val()));			 
			 }
		 this.component.Repaint(); 		 
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y)); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#widthid").val(core.COORD_TO_MM(this.target.getWidth()));    
		j$("#heightid").val(core.COORD_TO_MM(this.target.getHeight()));
		j$("#roundingid").val(core.COORD_TO_MM(this.target.arc));
		j$("#fillid").val(this.target.fill);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox(core.PCB_SYMBOL_LAYERS)+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:0,value:'EMPTY',selected:true},{id:1,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Width</td><td><input type='text' id='widthid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Height</td><td><input type='text' id='heightid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Rounding</td><td><input type='text' id='roundingid' value='' class='form-control input-sm\'></td></tr>"+						        
		"</table>");
			
		return this;
	}
});
var ArcPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		ArcPanelBuilder.__super__.initialize(component);
		this.id="arcpanelbuilder";  
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',
        'keypress #widthid' : 'onenter',
        'keypress #startangleid' : 'onenter',
        'keypress #extendangleid' : 'onenter',
        'change #fillid': 'onchange', 
        'change #layerid':'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }
        this.component.Repaint(); 
    }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='widthid'){
			   this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#widthid').val())));			 
		 } 
		 if(event.target.id=='startangleid'){
			   this.target.startAngle=utilities.round(j$('#startangleid').val());			 
		 } 
		 if(event.target.id=='extendangleid'){
			   this.target.extendAngle=utilities.round(j$('#extendangleid').val());	
		 } 	
		 this.component.Repaint(); 	
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
		j$("#startangleid").val(this.target.startAngle);    
		j$("#extendangleid").val(this.target.extendAngle);		
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:(this.target.resizingPoint.x)));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:(this.target.resizingPoint.y))); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#widthid").val(core.COORD_TO_MM(this.target.getWidth()));
		j$("#fillid").val(this.target.fill);
	},
	render:function(){
						
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox(core.PCB_SYMBOL_LAYERS)+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:0,value:'EMPTY',selected:true},{id:1,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Radius</td><td><input type='text' id='widthid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Start&deg</td><td><input type='text' id='startangleid' value='' class='form-control input-sm\'></td></tr>"+	
				"<tr><td style='padding:7px'>Extend&deg</td><td><input type='text' id='extendangleid' value='' class='form-control input-sm\'></td></tr>"+
		"</table>");
		return this;
	}
});
var CopperAreaPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		CopperAreaPanelBuilder.__super__.initialize(component);
		this.id="copperareapanelbuilder";  
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #clearanceid' : 'onenter',
        'keypress #netid' : 'onenter',
        'change #fillid': 'onchange', 
        'change #layerid':'onchange',
        'change #paddconnectionid': 'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }
        this.component.Repaint(); 
    }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='netid'){
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='clearanceid'){
			   this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#widthid').val())));			 
		 } 
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.Resize(x-this.target.resizingPoint.x, 0, this.target.resizingPoint);			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.Resize(0, y-this.target.resizingPoint.y, this.target.resizingPoint);		   			 
		 } 
		 this.component.Repaint(); 	
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
		//j$("#startangleid").val(this.target.startAngle);    
		//j$("#extendangleid").val(this.target.extendAngle);		
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:(this.target.resizingPoint.x)));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:(this.target.resizingPoint.y))); 
		//j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		//j$("#widthid").val(core.COORD_TO_MM(this.target.getWidth()));
		j$("#fillid").val(this.target.fill);
	},
	render:function(){
						
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox(core.PCB_SYMBOL_LAYERS)+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:0,value:'EMPTY',selected:true},{id:1,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Clearance</td><td><input type='text' id='clearanceid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Pad Connect</td><td>" +
				"<select class=\"form-control input-sm\" id=\"paddconnectionid\">"+
				this.fillComboBox([{id:0,value:'DIRECT',selected:true},{id:1,value:'THERMAL'}])+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='padding:7px'>Net</td><td><input type='text' id='netid' value='' class='form-control input-sm\'></td></tr>"+	
				
		"</table>");
		return this;
	}
});
var FootprintPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  BoardPanelBuilder.__super__.initialize(component);
      this.id="footprintpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',   
        'keypress #valueid' : 'onenter',	
        'keypress #referenceid' : 'onenter',	
        'change #rorientationid': 'onchange',
        'change #ralignmentid': 'onchange',
        'change #vorientationid': 'onchange',
        'change #valignmentid': 'onchange',
        
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
		   var texture=core.UnitMgr.getInstance().getTextureByTag(this.target,'reference');
		   texture.text=j$("#referenceid").val();
		 }
		 if(event.target.id=='valueid'){
		   texture=core.UnitMgr.getInstance().getTextureByTag(this.target,'value');
		   texture.text=j$("#valueid").val();
		 }
		 this.component.Repaint();   
	},   
	onchange:function(event){
	      if(event.target.id=='rorientationid'){
	    	  var texture=core.UnitMgr.getInstance().getTextureByTag(this.target,'reference');	    	  
	    	  texture.getAlignment().setOrientation(parseInt((j$('#rorientationid :selected').val())));
	    	  //update 
	    	  this.validateAlignmentComboText('ralignmentid',texture);
	    	  this.component.Repaint(); 
	      }
	      if(event.target.id=='ralignmentid'){
	    	  var texture=core.UnitMgr.getInstance().getTextureByTag(this.target,'reference');	    	  
	    	  texture.getAlignment().set(parseInt((j$('#ralignmentid :selected').val()))); 
	    	  this.component.Repaint(); 
	      }		
	      if(event.target.id=='vorientationid'){
	    	  var texture=core.UnitMgr.getInstance().getTextureByTag(this.target,'value');	    	  
	    	  texture.getAlignment().setOrientation(parseInt((j$('#vorientationid :selected').val())));
	    	  //update 
	    	  this.validateAlignmentComboText('valignmentid',texture);
	    	  this.component.Repaint(); 
	      }
	      if(event.target.id=='valignmentid'){
	    	  var texture=core.UnitMgr.getInstance().getTextureByTag(this.target,'value');	    	  
	    	  texture.getAlignment().set(parseInt((j$('#valignmentid :selected').val()))); 
	    	  this.component.Repaint(); 
	      }		      
	},	
	updateui:function(){
		   j$("#nameid").val(this.target.displayName);
		   
		   var texture=this.target.getChipText().getTextureByTag('reference');
		   j$("#referenceid").val(texture==null?"":texture.text);
			 //set orientation
		   j$('#rorientationid').val(texture.getAlignment().getOrientation());
			 //set alignment
		   this.validateAlignmentComboText('ralignmentid',texture);
			 
		   texture=this.target.getChipText().getTextureByTag('value');
		   j$("#valueid").val(texture==null?"":texture.text);
			 //set orientation
		   j$('#vorientationid').val(texture.getAlignment().getOrientation());
			 //set alignment
		   this.validateAlignmentComboText('valignmentid',texture);
	},
	render:function(){	
		j$(this.el).empty();
		j$(this.el).append(
		"<table width='100%'>"+
		"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+
		"<tr><td style='width:50%;padding:7px'>Reference</td><td><input type='text' id='referenceid' value='' class='form-control input-sm\'></td></tr>"+
		"<tr><td style='padding:7px'>Orientation</td><td>" +
		"<select class=\"form-control input-sm\" id=\"rorientationid\">"+
		this.fillComboBox([{id:0,value:'HORIZONTAL',selected:true},{id:1,value:'VERTICAL'}])+
	    "</select>" +
		"</td></tr>"+
		"<tr><td style='padding:7px'>Alignment</td><td>" +
		"<select class=\"form-control input-sm\" id=\"ralignmentid\">"+
		this.fillComboBox([{id:0,value:'LEFT',selected:true},{id:1,value:'RIGHT'}])+
	    "</select>" +
		"</td></tr>"+		
		"<tr><td style='width:50%;padding:7px'>Value</td><td><input type='text' id='valueid' value='' class='form-control input-sm\'></td></tr>"+
		"<tr><td style='padding:7px'>Orientation</td><td>" +
		"<select class=\"form-control input-sm\" id=\"vorientationid\">"+
		this.fillComboBox([{id:0,value:'HORIZONTAL',selected:true},{id:1,value:'VERTICAL'}])+
	    "</select>" +
		"</td></tr>"+
		"<tr><td style='padding:7px'>Alignment</td><td>" +
		"<select class=\"form-control input-sm\" id=\"valignmentid\">"+
		this.fillComboBox([{id:0,value:'LEFT',selected:true},{id:1,value:'RIGHT'}])+
	    "</select>" +
		"</td></tr>"+

		"</table>");
			
		return this;
	}
});

var BoardPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  BoardPanelBuilder.__super__.initialize(component);
      this.id="boardpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',
        'keypress #widthid':'onenter',
        'keypress #heightid':'onenter',
        'change #gridrasterid': 'onchange',
        'keypress #originxid':'onenter',
        'keypress #originyid':'onenter',
    },
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='widthid'||event.target.id=='heightid'){           
		    this.component.getModel().getUnit().setSize(core.MM_TO_COORD(parseFloat(j$('#widthid').val())),core.MM_TO_COORD(parseFloat(j$('#heightid').val())));  
		    this.component.componentResized();     
		    this.component.Repaint();
		 }
		 if(event.target.id=='nameid'){
			 this.target.unitName=j$("#nameid").val(); 
			 this.component.getModel().fireUnitEvent({target:this.target,type:events.Event.RENAME_UNIT});
		 }
		 if(event.target.id=='originxid'||event.target.id=='originyid'){           
			    this.component.getModel().getUnit().getCoordinateSystem().Reset(core.MM_TO_COORD(parseFloat(j$('#originxid').val())),core.MM_TO_COORD(parseFloat(j$('#originyid').val())));  
			    this.component.componentResized();     
			    this.component.Repaint();
		 }
		 //mycanvas.focus();
		
	},
	onchange:function(event){
		if(event.target.id=='gridrasterid'){
			this.target.grid.setGridValue(parseFloat(j$("#gridrasterid").val()));
			this.component.Repaint();
		}		
	},
	updateui:function(){
	   j$("#nameid").val(this.target.unitName);
	   j$("#widthid").val(core.COORD_TO_MM( this.target.width));    
	   j$("#heightid").val(core.COORD_TO_MM(this.target.height));
	   j$("#gridrasterid").val(this.target.grid.getGridValue());
	   j$("#originxid").val(core.COORD_TO_MM(this.component.getModel().getUnit().getCoordinateSystem().getX()));    
	   j$("#originyid").val(core.COORD_TO_MM(this.component.getModel().getUnit().getCoordinateSystem().getY()));	   
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Width</td><td><input type='text' id='widthid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Height</td><td><input type='text' id='heightid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Units</td><td>" +
				"<select class=\"form-control input-sm\" id=\"unitsid\">"+
			    this.fillComboBox([{id:'mm',value:'MM',selected:true},{id:'inch',value:'INCH'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Grid</td><td>" +
				"<select class=\"form-control input-sm\" id=\"gridrasterid\">"+
			    this.fillComboBox(core.gridraster)+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Origin X</td><td><input type='text' id='originxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Origin Y</td><td><input type='text' id='originyid' value='' class='form-control input-sm\'></td></tr>"+

		"</table>");
			
		return this;
	}
});
var HolePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		ViaPanelBuilder.__super__.initialize(component);
		this.id="holepanelbuilder"; 
    },
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',	
        'keypress #drillsizeid' : 'onenter',        
    },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		     }
		 if(event.target.id=='drillsizeid'){
			 this.target.width=core.MM_TO_COORD(parseFloat(j$('#drillsizeid').val())); 
		 }     

		 if(event.target.id=='xid'){	            
			 this.target.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.y=this.fromUnitY(j$('#yid').val());  
	     }
		 this.component.Repaint();  
   },
	updateui:function(){		
        j$('#xid').val(this.toUnitX(this.target.x));
        j$('#yid').val(this.toUnitY(this.target.y)); 
        j$('#drillsizeid').val(core.COORD_TO_MM(this.target.width));
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Drill size</td><td><input type='text' id='drillsizeid' value='' class='form-control input-sm\'></td></tr>"+
				"</table>");
			
		return this;
	}    
});
var ViaPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		ViaPanelBuilder.__super__.initialize(component);
		this.id="viapanelbuilder"; 
    },
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',	
        'keypress #drillsizeid' : 'onenter',
        'keypress #viasizeid':'onenter',
    },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		     }
		 if(event.target.id=='drillsizeid'){
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#drillsizeid').val())); 
		 }   
		 if(event.target.id=='viasizeid'){
			 
			 this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#viasizeid').val()))); 
		 }   

		 if(event.target.id=='xid'){	            
			 this.target.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.y=this.fromUnitY(j$('#yid').val());  
	     }
		 this.component.Repaint();  
   },
	updateui:function(){		
        j$('#xid').val(this.toUnitX(this.target.x));
        j$('#yid').val(this.toUnitY(this.target.y)); 
        j$('#drillsizeid').val(core.COORD_TO_MM(this.target.thickness));
        j$('#viasizeid').val(core.COORD_TO_MM(this.target.width));
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Drill size</td><td><input type='text' id='drillsizeid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Via size</td><td><input type='text' id='viasizeid' value='' class='form-control input-sm\'></td></tr>"+        
				"</table>");
			
		return this;
	}    
});
var LinePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		LinePanelBuilder.__super__.initialize(component);
		this.id="linepanelbuilder";
		//app.bind('itemlinkimpl:oncklick', $.proxy(this.onitemclick,this));    
    },
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',	
        'keypress #thicknessid' : 'onenter',
        'change #layerid':'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        this.component.Repaint(); 
      }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		     }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val())); 
		 }   
		 if(event.target.id=='xid'){	            
			 this.target.resizingPoint.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.resizingPoint.y=this.fromUnitY(j$('#yid').val());  
	     }
		 this.component.Repaint();  
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y)); 
        j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox(core.PCB_SYMBOL_LAYERS)+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
		        "</table>");
			
		return this;
	}
});
var TrackPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		TrackPanelBuilder.__super__.initialize(component);
		this.id="trackpanelbuilder";
		//app.bind('itemlinkimpl:oncklick', $.proxy(this.onitemclick,this));    
    },
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',	
        'keypress #thicknessid' : 'onenter',
        'change #layerid':'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        this.component.Repaint(); 
      }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		     }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val())); 
		 }   
		 if(event.target.id=='xid'){	            
			 this.target.resizingPoint.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.resizingPoint.y=this.fromUnitY(j$('#yid').val());  
	     }
		 this.component.Repaint();  
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y)); 
        j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox([{id:'FCu',value:'FCu',selected:true},{id:'BCu',value:'BCu'}])+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Clearance</td><td><input type='text' id='clearanceid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Net</td><td><input type='text' id='netid' value='' class='form-control input-sm\'></td></tr>"+

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
        'keypress #sizeid' : 'onenter',	
        'keypress #thicknessid' : 'onenter',	
		'change #orientationid': 'onchange',
        'change #alignmentid': 'onchange',
		'change #layerid':'onchange',
    },
    onchange:function(event){
      if(event.target.id=='orientationid'){
    	  this.target.texture.setOrientation(parseInt((j$('#orientationid :selected').val())));
    	  //update 
    	  this.validateAlignmentComboText('alignmentid',this.target.texture); 
      }
      if(event.target.id=='alignmentid'){
    	  this.target.texture.setAlignment(parseInt((j$('#alignmentid :selected').val()))); 
      }
	  if(event.target.id=='layerid'){
      	  this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
      }
      this.component.Repaint(); 
    },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='textid'){
			 this.target.texture.setText(j$('#textid').val());			  
		 }
		 if(event.target.id=='sizeid'){
			 this.target.texture.setSize(core.MM_TO_COORD(parseFloat(j$('#sizeid').val())));			 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.texture.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 }		 
		 if(event.target.id=='xid'){	            
			 this.target.texture.anchorPoint.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.texture.anchorPoint.y=this.fromUnitY(j$('#yid').val());  
	     }		 
		 this.component.Repaint();     		    	
    },
	updateui:function(){
	j$('#layerid').val(this.target.copper.getName());	
	 j$('#textid').val(this.target.texture.text);	
	 j$('#xid').val(this.toUnitX(this.target.texture.anchorPoint.x));
	 j$('#yid').val(this.toUnitY(this.target.texture.anchorPoint.y));	 
	 j$('#sizeid').val(core.COORD_TO_MM(this.target.texture.size));
	 j$('#thicknessid').val(core.COORD_TO_MM(this.target.texture.thickness));
	 //set orientation
	 j$('#orientationid').val(this.target.texture.alignment.getOrientation());
	 //set alignment
	 this.validateAlignmentComboText('alignmentid',this.target.texture);


	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox(core.PCB_SYMBOL_LAYERS)+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Text</td><td><input type='text' id='textid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Size</td><td><input type='text' id='sizeid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Orientation</td><td>" +
				"<select class=\"form-control input-sm\" id=\"orientationid\">"+
				this.fillComboBox([{id:0,value:'HORIZONTAL',selected:true},{id:1,value:'VERTICAL'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Alignment</td><td>" +
				"<select class=\"form-control input-sm\" id=\"alignmentid\">"+
				this.fillComboBox([{id:0,value:'LEFT',selected:true},{id:1,value:'RIGHT'}])+
			    "</select>" +
				"</td></tr>"+
		        "</table>");
			
		return this;
	}
});

var BoardsTree=Backbone.View.extend({	
	initialize:function(opt){		
	    //creat tree
		this.name=opt.name;
		this.boardComponent=opt.boardComponent;		
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
			this.boardComponent.getModel().getUnit().setScrollPositionValue(this.boardComponent.viewportWindow.x,this.boardComponent.viewportWindow.y);
			
			this.boardComponent.getModel().setActiveUnitUUID(item.id);
			this.boardComponent.getModel().getUnit().setSelected(false);
			this.boardComponent.componentResized();
			
			this.boardComponent.hbar.jqxScrollBar({ value:this.boardComponent.getModel().getUnit().scrollPositionXValue});
			this.boardComponent.vbar.jqxScrollBar({ value:this.boardComponent.getModel().getUnit().scrollPositionYValue});
			
			this.boardComponent.Repaint();
			mywebpcb.trigger('tree:select',{target:this.boardComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 
		}
		if(item.value==222){
			//is this the same shape of the current unit
			if(this.boardComponent.getModel().getUnit().getUUID()!=item.parentId){
		 		   this.$tree.off('select',j$.proxy(this.valuechanged,this));
		 		   this.$tree.jqxTree('selectItem',  j$("#"+item.parentId)[0]);
		 		   this.boardComponent.getModel().setActiveUnitUUID(item.parentId);
		 		   this.$tree.on('select',j$.proxy(this.valuechanged,this));
			}
			   //shape
			var shape=this.boardComponent.getModel().getUnit().getShape(item.id);
			this.boardComponent.getModel().getUnit().setSelected(false);
			shape.setSelected(true);			
			this.boardComponent.Repaint();
			            
	        //position on shape center
            var rect=shape.getBoundingRect();            
            this.boardComponent.setScrollPosition(rect.getCenterX(),rect.getCenterY());
             		  
			mywebpcb.trigger('tree:select',{target:shape,type:events.Event.SELECT_SHAPE}); 	
		}
	
	},
	oncontainerevent:function(event){
	      switch (event.type) {
	      case events.Event.SELECT_CONTAINER:

	         break;
	      case events.Event.RENAME_CONTAINER:
	    	  var element=j$('#root')[0];
	    	  this.$tree.jqxTree('updateItem', { label: this.boardComponent.getModel().formatedFileName},element);
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
        	   this.$tree.jqxTree('updateItem', { label: event.target.name}, selectedItem.element);
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

var BoardsInspector=Backbone.View.extend({	
	initialize:function(opt){
		this.boardComponent=opt.boardComponent;
		this.collection=new Backbone.Collection([
		                                         new BoardPanelBuilder(this.boardComponent),
		                                         new TrackPanelBuilder(this.boardComponent),
		                                         new FootprintPanelBuilder(this.boardComponent),
		                                         new ViaPanelBuilder(this.boardComponent),
		                                         new LabelPanelBuilder(this.boardComponent),
		                                         new ComponentPanelBuilder(this.boardComponent),
		                                         new CirclePanelBuilder(this.boardComponent),
		                                         new ArcPanelBuilder(this.boardComponent),
		                                         new LinePanelBuilder(this.boardComponent),
		                                         new RectPanelBuilder(this.boardComponent),
		                                         new HolePanelBuilder(this.boardComponent),
		                                         new CopperAreaPanelBuilder(this.boardComponent)
		                                         ]);
		this.el= '#boardsinspectorid';	
		//select container
		this.panel=this.collection.get('componentpanelbuilder');
		this.panel.attributes.delegateEvents();
		this.panel.attributes.setTarget(this.boardComponent);
		//this.oncontainerevent({target:this.boardComponent,type:mywebpads.container.Event.SELECT_CONTAINER});
		
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
	 			this.panel.attributes.setTarget(this.boardComponent);
	 			this.render(); 
	 		  }
 	    } 
    	this.panel.attributes.updateui();
    },
    onunitevent:function(event){	
	 	   if(event.type==events.Event.ADD_UNIT){
	 		   //add unit to tree
		 		  if(this.panel.id!='boardpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('boardpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.render(); 
			 	  }
	 	   }
	 	  if(event.type==events.Event.PROPERTY_CHANGE){
	 		  
	 	  }
	 	  if(event.type==events.Event.SELECT_UNIT){
	 		   //select unit
	 		  if(this.panel.id!='boardpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('boardpanelbuilder');
	 			this.panel.attributes.delegateEvents();
	 			this.render(); 
	 		  }
	 	   }
	 	   if(event.type==events.Event.DELETE_UNIT){
		 		  if(this.panel.id!='componentpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('componentpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.panel.attributes.setTarget(this.boardComponent);
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
		if(event.target instanceof PCBFootprint){
			if(this.panel.id!='footprintpanelbuilder'){
					this.panel.attributes.remove();
					this.panel=this.collection.get('footprintpanelbuilder');
					this.panel.attributes.delegateEvents();
					this.render();
		    }
		}			
		if(event.target instanceof PCBLabel){
			if(this.panel.id!='labelpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('labelpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof PCBTrack){
			if(this.panel.id!='trackpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('trackpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof PCBRoundRect){
			if(this.panel.id!='rectpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('rectpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}		
		if(event.target instanceof PCBLine){
			if(this.panel.id!='linepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('linepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}		
		if(event.target instanceof PCBVia){
			if(this.panel.id!='viapanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('viapanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof PCBHole){
			if(this.panel.id!='holepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('holepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}		
		if((event.target instanceof PCBCircle)){
			if(this.panel.id!='circlepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('circlepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}
		}	
		if((event.target instanceof PCBCopperArea)){
			if(this.panel.id!='copperareapanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('copperareapanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}
		}	
		if((event.target instanceof PCBTrack)){
			if(this.panel.id!='trackpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('trackpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}
		}		
		if(event.target instanceof PCBArc){
			if(this.panel.id!='arcpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('arcpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}	
		}
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
var BoardsPanelView=Backbone.View.extend({
	initialize:function(opt){
       this.footprintstree=new BoardsTree(opt);
       this.footprintinspector=new BoardsInspector(opt);
	},
	update:function(){
		
	},
	render:function(){
		 this.footprintstree.render();
		 this.footprintinspector.render();
	},
	
});

module.exports ={
	       ComponentPanelBuilder,
		   BoardsPanelView	   
	}