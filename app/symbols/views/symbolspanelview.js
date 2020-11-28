var mywebpcb=require('core/core').mywebpcb;
var events=require('core/events');
var core=require('core/core');
var UnitMgr = require('core/unit').UnitMgr;
var utilities =require('core/utilities');
var BaseBuilder = require('core/views/panelview').BaseBuilder;
var	RoundRect=require('symbols/shapes').RoundRect;
var	Ellipse=require('symbols/shapes').Ellipse;
var	FontLabel=require('symbols/shapes').FontLabel;
var	Line=require('symbols/shapes').Line;
var	Arc=require('symbols/shapes').Arc;
var	Pin=require('symbols/shapes').Pin;
var	ArrowLine=require('symbols/shapes').ArrowLine;
var	Triangle=require('symbols/shapes').Triangle;

var ComponentPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  ComponentPanelBuilder.__super__.initialize(component);	
      this.id="componentpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',	
        'change #symboltypeid': 'onchange',
    },
	
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='nameid'){
			 this.target.getModel().setFileName(j$("#nameid").val()); 
			 this.target.fireContainerEvent({target:null,type:events.Event.RENAME_CONTAINER});
		 }
		
	},
    onchange:function(event){
		 if(event.target.id=='symboltypeid'){
			 this.target.getModel().setType(parseInt(j$('#symboltypeid').val())); 
		 }
		 
    },
	updateui:function(){
		j$("#nameid").val(this.target.getModel().formatedFileName);
		j$("#symboltypeid").val(this.target.getModel().getType());
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+
				"</td></tr>" +
				"<tr><td style='width:50%;padding:7px'>Symbol Type</td><td>" +
				"<select class=\"form-control input-sm\" id=\"symboltypeid\">"+
				this.fillComboBox([{id:0,value:'SYMBOL'},{id:1,value:'GROUND'},{id:2,value:'POWER'}])+
			    "</select>" +
				"</td></tr>"+				
				"</table>"
		);	
		return this;
	}
});
var PinPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		PinPanelBuilder.__super__.initialize(component);
		this.id="pinpanelbuilder";   
    },	
    events: {
        'keypress #numberid' : 'onenter',	
        'keypress #nameid' : 'onenter',	
        'change #namealignmentid': 'onchange',
        'change #numberalignmentid': 'onchange', 
        'change #orientationid': 'onchange',
        'change #styleid': 'onchange', 
        'change #pintypeid': 'onchange',
    },
    onchange:function(event){
        if(event.target.id=='namealignmentid'){
        	this.target.getTextureByTag("name").setAlignment(parseInt(j$("#namealignmentid").val()));        	
        }
        if(event.target.id=='numberalignmentid'){
        	this.target.getTextureByTag("number").setAlignment(parseInt(j$("#numberalignmentid").val()));        	
        }
        if(event.target.id=='orientationid'){        
        	this.target.setOrientation(parseInt(j$('#orientationid').val()));
        }
        if(event.target.id=='pintypeid'){        
        	this.target.setPinType(parseInt(j$('#pintypeid').val()));
        }
        if(event.target.id=='styleid'){        
        	this.target.style=(parseInt(j$('#styleid').val()));
        }
       this.component.repaint(); 
      },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
	     
		 if(event.target.id=='numberid'){ 
			 this.target.getTextureByTag("number").setText(j$('#numberid').val());			   
		 }
		 if(event.target.id=='nameid'){ 
			 this.target.getTextureByTag("name").setText(j$('#nameid').val()); 
		 }
		 this.component.repaint(); 
    },
	updateui:function(){

		 j$('#orientationid').val(this.target.orientation);
		 j$("#nameid").val(this.target.getTextureByTag("name").shape.text); 
		 j$('#styleid').val(this.target.style);
		 j$('#pintypeid').val(this.target.type);
	     j$('#numberid').val(this.target.getTextureByTag("number").shape.text); 
	     j$('#namealignmentid').val(this.target.getTextureByTag("name").getAlignment()); 
	     j$('#numberalignmentid').val(this.target.getTextureByTag("number").getAlignment()); 
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%' height='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Pin Type</td><td>" +
				"<select class=\"form-control input-sm\" id=\"pintypeid\">"+
				this.fillComboBox([{id:0,value:'SIMPLE'},{id:1,value:'COMPLEX',selected:true}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Orientation</td><td>" +
				"<select class=\"form-control input-sm\" id=\"orientationid\">"+
				this.fillComboBox([{id:0,value:'NORTH',selected:true},{id:1,value:'SOUTH'},{id:2,value:'WEST'},{id:3,value:'EAST'}])+
			    "</select></td></tr>"+	
				"<tr><td style='width:50%;padding:7px'>Style</td><td>" +
				"<select class=\"form-control input-sm\" id=\"styleid\">"+
				this.fillComboBox([{id:0,value:'LINE',selected:true},{id:1,value:'INVERTED'},{id:2,value:'CLOCK'},
				                   {id:3,value:'INVERTED_CLOCK'},{id:4,value:'INPUT_LOW'},{id:5,value:'CLOCK_LOW'},
				                   {id:6,value:'OUTPUT_LOW'},{id:7,value:'FALLING_EDGE_CLOCK'}])+
				"</select></td></tr>"+				
				"<tr><td style='padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Text Alignment</td><td>" +
				"<select class=\"form-control input-sm\" id=\"namealignmentid\">"+
				this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
			    "</select></td></tr>"+
				
				"<tr><td style='padding:7px'>Number</td><td><input type='text' id='numberid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Text Alignment</td><td>" +
				"<select class=\"form-control input-sm\" id=\"numberalignmentid\">"+				
				this.fillComboBox([{id:0,value:'RIGHT',selected:true},{id:1,value:'TOP',selected:true},{id:2,value:'LEFT',selected:true},{id:3,value:'BOTTOM'}])+
				"</select>" +
				"</td></tr>"+		        
		
		"</table>");
			
		return this;
	}    
});
var TrianglePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		TrianglePanelBuilder.__super__.initialize(component);
		this.id="trianglepanelbuilder";  
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',        
        'change #fillid': 'onchange', 
    },
    onchange:function(event){
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }        
        this.component.repaint(); 
    }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.Resize(x-this.target.resizingPoint.x, 0, this.target.resizingPoint);			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.Resize(0, y-this.target.resizingPoint.y, this.target.resizingPoint);		   			 
		 }		 
		 this.component.repaint(); 	
    },
	updateui:function(){	
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundFloat(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x),1));
        j$('#yid').val(utilities.roundFloat(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y),1)); 
		j$('#thicknessid').val(this.target.thickness);
		j$("#fillid").val(this.target.fill);
	},
	render:function(){
						
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+	
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+					
				"<tr><td style='width:50%;padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+			
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+				
		"</table>");
		return this;
	}
});
var ArrowLinePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		ArrowLinePanelBuilder.__super__.initialize(component);
		this.id="arrowlinepanelbuilder";  
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',
        'keypress #headsizeid' : 'onenter',
        'change #fillid': 'onchange', 
    },
    onchange:function(event){
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }        
        this.component.repaint(); 
    }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='headsizeid'){
		   this.target.setHeadSize((parseInt(j$('#headsizeid').val())));			 
		 } 
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.Resize(x-this.target.resizingPoint.x, 0, this.target.resizingPoint);			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.Resize(0, y-this.target.resizingPoint.y, this.target.resizingPoint);		   			 
		 } 		 
		 this.component.repaint(); 	
    },
	updateui:function(){	
		j$('#thicknessid').val(this.target.thickness);
		j$("#headsizeid").val((this.target.headSize));
		j$("#fillid").val(this.target.fill);
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundFloat(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x),1));
        j$('#yid').val(utilities.roundFloat(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y),1)); 
	},
	render:function(){
						
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+			
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Head Size</td><td><input type='text' id='headsizeid' value='' class='form-control input-sm\'></td></tr>"+
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
        'keypress #radiusxid' : 'onenter',
        'keypress #radiusyid' : 'onenter',
        'keypress #startangleid' : 'onenter',
        'keypress #extendangleid' : 'onenter',
        'change #fillid': 'onchange', 
    },
    onchange:function(event){
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }        
        this.component.repaint(); 
    }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='radiusxid'){
			   this.target.arc.w=(parseFloat(j$('#radiusxid').val()));			 
		 } 
		 if(event.target.id=='radiusyid'){
			   this.target.arc.h=(parseFloat(j$('#radiusyid').val()));			 
		 } 
		 if(event.target.id=='startangleid'){
			   this.target.setStartAngle(j$('#startangleid').val());			 
		 } 
		 if(event.target.id=='extendangleid'){
			   this.target.setExtendAngle(j$('#extendangleid').val());	
		 } 	
		 this.component.repaint(); 	
    },
	updateui:function(){

		j$("#startangleid").val(this.target.arc.startAngle);    
		j$("#extendangleid").val(this.target.arc.endAngle);		
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundFloat(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x),1));
        j$('#yid').val(utilities.roundFloat(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y),1)); 
		j$('#thicknessid').val(this.target.thickness);
		j$("#radiusxid").val(utilities.roundFloat((this.target.arc.w),1));    
		j$("#radiusyid").val(utilities.roundFloat((this.target.arc.h),1));
		j$("#fillid").val(this.target.fill);
	},
	render:function(){
						
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+			
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Radius X</td><td><input type='text' id='radiusxid' value='' class='form-control input-sm\'></td></tr>"+								
				"<tr><td style='padding:7px'>Radius Y</td><td><input type='text' id='radiusyid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Start&deg</td><td><input type='text' id='startangleid' value='' class='form-control input-sm\'></td></tr>"+	
				"<tr><td style='padding:7px'>Extend&deg</td><td><input type='text' id='extendangleid' value='' class='form-control input-sm\'></td></tr>"+
		"</table>");
		return this;
	}
});
var EllipsePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		EllipsePanelBuilder.__super__.initialize(component);
		this.id="ellipsepanelbuilder";  
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',        
        'keypress #radiusxid' : 'onenter',
        'keypress #radiusyid' : 'onenter',
        'change #fillid': 'onchange',
    },
    onchange:function(event){
        if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }
        this.component.repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			this.target.thickness=parseFloat(j$('#thicknessid').val());			 
		 } 
		 if(event.target.id=='radiusxid'){
		   this.target.ellipse.w=((parseFloat(j$('#radiusxid').val())));			 
		 } 
		 if(event.target.id=='radiusyid'){
			   this.target.ellipse.h=((parseFloat(j$('#radiusyid').val())));			 
		 } 		 
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.Resize(x-this.target.resizingPoint.x, 0, this.target.resizingPoint);			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.Resize(0, y-this.target.resizingPoint.y, this.target.resizingPoint);		   			 
		 } 		 
		 this.component.repaint(); 		 
    },

	updateui:function(){
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundFloat(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x),1));
        j$('#yid').val(utilities.roundFloat(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y),1)); 
		j$('#thicknessid').val(this.target.thickness);
		j$("#radiusxid").val(utilities.roundFloat((this.target.ellipse.w),1));    
		j$("#radiusyid").val(utilities.roundFloat((this.target.ellipse.h),1));
		j$("#fillid").val(this.target.fill);		
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+				
				
				"<tr><td style='padding:7px'>Radius X</td><td><input type='text' id='radiusxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Radius Y</td><td><input type='text' id='radiusyid' value='' class='form-control input-sm\'></td></tr>"+
				
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
        'keypress #widthid':'onenter',
        'keypress #heightid':'onenter',
        'change #textlayoutvisibilityid': 'onchange',
        'change #referenceid':'onchange',
        'change #valueid':'onchange',
        'keypress #originxid':'onenter',
        'keypress #originyid':'onenter',
    },
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='widthid'||event.target.id=='heightid'){           
		    this.component.getModel().getUnit().setSize((parseFloat(j$('#widthid').val())),(parseFloat(j$('#heightid').val())));  
		    this.component.componentResized();     
		    this.component.repaint();
		 }
		 if(event.target.id=='nameid'){
			 this.target.unitName=j$("#nameid").val(); 
			 this.component.getModel().fireUnitEvent({target:this.target,type:events.Event.RENAME_UNIT});
		 }
		 if(event.target.id=='originxid'||event.target.id=='originyid'){   
			 if(this.component.getModel().getUnit().getCoordinateSystem()!=null){
			    this.component.getModel().getUnit().getCoordinateSystem().reset((parseFloat(j$('#originxid').val())),(parseFloat(j$('#originyid').val())));  
			    this.component.componentResized();     
			    this.component.repaint();
			 }
		 }
		 //mycanvas.focus();
		
	},
	onchange:function(event){
		if(event.target.id=='textlayoutvisibilityid'){
			this.target.setTextLayoutVisibility((j$("#textlayoutvisibilityid").val()==='true'));
			this.component.repaint();
		}		
		if(event.target.id=='referenceid'){
			var label=UnitMgr.getInstance().getLabelByTag(this.target,'reference');
			if(label!=null){
				label.texture.tag='label';
			}
			//unmark the other
			if(j$("#referenceid").val()==-1)
				return;
			label=this.target.getShape(j$("#referenceid").val());
			label.getTexture().tag='reference';
			this.component.repaint();
		}
		if(event.target.id=='valueid'){
			var label=UnitMgr.getInstance().getLabelByTag(this.target,'value');
			if(label!=null){
				label.texture.tag='label';
			}
			//unmark the other
			if(j$("#valueid").val()==-1)
				return;
			label=this.target.getShape(j$("#valueid").val());
			label.getTexture().tag='value';
			this.component.repaint();
		}
	},
	updateui:function(){
	   j$("#nameid").val(this.target.unitName);
	   j$("#widthid").val(( this.target.width));    
	   j$("#heightid").val((this.target.height));
	   j$("#textlayoutvisibilityid").val(this.target.isTextLayoutVisible.toString());
	   
	   
	   if(this.component.getModel().getUnit().coordinateSystem!=null){
	     j$("#originxid").val((this.component.getModel().getUnit().getCoordinateSystem().getX()));    
	     j$("#originyid").val((this.component.getModel().getUnit().getCoordinateSystem().getY()));
	   }

	   //reference
	   var labels=this.target.getShapes(FontLabel);
	   var hash=[];
	   var reftag;
	   var valtag;
	   
	   //add empty entry
	   hash.push({id:-1,value:""});
	   for(i=0;i<labels.length;i++){
		   hash.push({id:labels[i].uuid,value:labels[i].texture.shape.text});
		 
		   if(labels[i].texture.tag=='reference'){
			   reftag=labels[i].uuid;
		   }
		   if(labels[i].texture.tag=='unit'){
			   valtag=labels[i].uuid;
		   }
	   }
	   
	   this.reloadComboBox('referenceid',hash);
	   j$('#referenceid').val(reftag);
	   
	   this.reloadComboBox('valueid',hash);
	   j$('#valueid').val(valtag);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Name</td><td><input type='text' id='nameid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Width</td><td><input type='text' id='widthid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Height</td><td><input type='text' id='heightid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Reference</td><td>" +
				"<select class=\"form-control input-sm\" id=\"referenceid\">"+
			    
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Value</td><td>" +
				"<select class=\"form-control input-sm\" id=\"valueid\">"+
			    
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Text Layout Visible</td><td>" +
				"<select class=\"form-control input-sm\" id=\"textlayoutvisibilityid\">"+
				this.fillComboBox([{id:false,value:'false',selected:true},{id:true,value:'true'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Origin X</td><td><input type='text' id='originxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Origin Y</td><td><input type='text' id='originyid' value='' class='form-control input-sm\'></td></tr>"+

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
var LinePanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		LinePanelBuilder.__super__.initialize(component);
		this.id="linepanelbuilder";  
    },
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',	
        'keypress #thicknessid' : 'onenter',
    },
    onchange:function(event){
        this.component.repaint(); 
      }, 
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		     }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=parseFloat(j$('#thicknessid').val()); 
		 }   
		 if(event.target.id=='xid'){	            
			 this.target.resizingPoint.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.resizingPoint.y=this.fromUnitY(j$('#yid').val());  
	     }
		 this.component.repaint();  
    },
	updateui:function(){
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundFloat(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x),1));
        j$('#yid').val(utilities.roundFloat(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y),1)); 
        j$('#thicknessid').val(this.target.thickness);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+				
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
		        "</table>");
			
		return this;
	}
});
var RectPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		RectPanelBuilder.__super__.initialize(component);
		this.id="rectpanelbuilder"; 
    },	
    events: {
        'keypress #xid' : 'onenter',	
        'keypress #yid' : 'onenter',
        'keypress #thicknessid' : 'onenter',
        'keypress #rotateid' : 'onenter',        
        'keypress #roundingid' : 'onenter',
        'change #fillid': 'onchange',
    },
    onchange:function(event){
    	if(event.target.id=='fillid'){        
        	this.target.fill=parseInt(j$('#fillid').find('option:selected').val());        
        }
        this.component.repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			 this.target.thickness=(parseFloat(j$('#thicknessid').val()));			 
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
			 this.target.setRounding((parseFloat(j$('#roundingid').val())));			 
		 }
		 this.component.repaint(); 		 
    },
	updateui:function(){
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundDouble(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x)));
        j$('#yid').val(utilities.roundDouble(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y))); 
		j$('#thicknessid').val(this.target.thickness);
		//j$("#rotateid").val(this.target.rotate);    
		j$("#roundingid").val(this.target.roundRect.rounding);
		j$("#fillid").val(this.target.fill);
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%'>"+			
				"<tr><td style='width:50%;padding:7px'>X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'},{id:3,value:'GRADIENT'}])+
			    "</select>" +
				"</td></tr>"+
				//"<tr><td style='padding:7px'>Rotate</td><td><input type='text' id='rotateid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Rounding</td><td><input type='text' id='roundingid' value='' class='form-control input-sm\'></td></tr>"+						        
		"</table>");
			
		return this;
	}
});
var SymbolsTree=Backbone.View.extend({	
	initialize:function(opt){		
	    //creat tree
		this.name=opt.name;
		this.symbolComponent=opt.symbolComponent;		
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
		this.$tree.jqxTree('render');
	},
	valuechanged:function(event){
		var id=event.args.element.id;
        var item = this.$tree.jqxTree('getItem', event.args.element);
        
		if(id=="root"){
			mywebpcb.trigger('tree:select',{target:null,type:events.Event.SELECT_CONTAINER}); 
		}

		if(item.value==111){
		   //unit	
			this.symbolComponent.getModel().getUnit().setScrollPositionValue(this.symbolComponent.viewportWindow.x,this.symbolComponent.viewportWindow.y);
			
			this.symbolComponent.getModel().setActiveUnitUUID(item.id);
			this.symbolComponent.getModel().getUnit().setSelected(false);
			this.symbolComponent.componentResized();
			
			this.symbolComponent.hbar.jqxScrollBar({ value:this.symbolComponent.getModel().getUnit().scrollPositionXValue});
			this.symbolComponent.vbar.jqxScrollBar({ value:this.symbolComponent.getModel().getUnit().scrollPositionYValue});
			
			this.symbolComponent.repaint();
			mywebpcb.trigger('tree:select',{target:this.symbolComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 
		}
		if(item.value==222){
			//is this the same shape of the current unit
			if(this.symbolComponent.getModel().getUnit().getUUID()!=item.parentId){
		 		   this.$tree.off('select',j$.proxy(this.valuechanged,this));
		 		   this.$tree.jqxTree('selectItem',  j$("#"+item.parentId)[0]);
		 		   this.symbolComponent.getModel().setActiveUnitUUID(item.parentId);
		 		   this.$tree.on('select',j$.proxy(this.valuechanged,this));
			}
			   //shape
			var shape=this.symbolComponent.getModel().getUnit().getShape(item.id);
			this.symbolComponent.getModel().getUnit().setSelected(false);
			shape.setSelected(true);
			this.symbolComponent.repaint();
			mywebpcb.trigger('tree:select',{target:shape,type:events.Event.SELECT_SHAPE}); 	
		}
	
	},
	oncontainerevent:function(event){
	      switch (event.type) {
	      case events.Event.SELECT_CONTAINER:

	         break;
	      case events.Event.RENAME_CONTAINER:
	    	  var element=j$('#root')[0];
	    	  this.$tree.jqxTree('updateItem', { label: this.symbolComponent.getModel().formatedFileName},element);
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
        	   this.$tree.jqxTree('updateItem', { label: event.target.unitName }, selectedItem.element);
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

var SymbolsInspector=Backbone.View.extend({	
	initialize:function(opt){
		this.symbolComponent=opt.symbolComponent;
		this.collection=new Backbone.Collection([
		                                         new SymbolPanelBuilder(this.symbolComponent),
		                                         new LinePanelBuilder(this.symbolComponent),
		                                         new RectPanelBuilder(this.symbolComponent),
		                                         new PinPanelBuilder(this.symbolComponent),
		                                         new LabelPanelBuilder(this.symbolComponent),
		                                         new ComponentPanelBuilder(this.symbolComponent),
		                                         new EllipsePanelBuilder(this.symbolComponent),
		                                         new ArrowLinePanelBuilder(this.symbolComponent),
		                                         new ArcPanelBuilder(this.symbolComponent),
		                                         new TrianglePanelBuilder(this.symbolComponent),
		                                         ]);
		this.el= '#symbolsinspectorid';	
		//select container
		this.panel=this.collection.get('componentpanelbuilder');
		this.panel.attributes.delegateEvents();
		this.panel.attributes.setTarget(this.symbolComponent);
		//this.oncontainerevent({target:this.symbolComponent,type:mywebpads.container.Event.SELECT_CONTAINER});
		
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
	 			this.panel.attributes.setTarget(this.symbolComponent);
	 			this.render(); 
	 		  }
 	    } 
    	this.panel.attributes.updateui();
    },
    onunitevent:function(event){	
	 	   if(event.type==events.Event.ADD_UNIT){
	 		   //add unit to tree
		 		  if(this.panel.id!='symbolpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('symbolpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.render(); 
			 	  }
	 	   }
	 	  if(event.type==events.Event.PROPERTY_CHANGE){
	 		  
	 	  }
	 	  if(event.type==events.Event.SELECT_UNIT){
	 		   //select unit
	 		  if(this.panel.id!='symbolpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('symbolpanelbuilder');
	 			this.panel.attributes.delegateEvents();
	 			this.render(); 
	 		  }
	 	   }
	 	   if(event.type==events.Event.DELETE_UNIT){
		 		  if(this.panel.id!='componentpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('componentpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.panel.attributes.setTarget(this.symbolComponent);
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
		if(event.target instanceof FontLabel){
			if(this.panel.id!='labelpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('labelpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof RoundRect){
			if(this.panel.id!='rectpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('rectpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof Pin){
			if(this.panel.id!='pinpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('pinpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
		    }
		}
		if(event.target instanceof Line){
			if(this.panel.id!='linepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('linepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();				
			}	
		}
		if(event.target instanceof Ellipse){
			if(this.panel.id!='ellipsepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('ellipsepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}
		}	
		if(event.target instanceof Arc){
			if(this.panel.id!='arcpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('arcpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}	
		}	
		if(event.target instanceof ArrowLine){
			if(this.panel.id!='arrowlinepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('arrowlinepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}				
		}
		if(event.target instanceof Triangle){
			if(this.panel.id!='trianglepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('trianglepanelbuilder');
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
	 		  if(this.panel.id!='symbolpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('symbolpanelbuilder');
	 			this.panel.attributes.delegateEvents();
	 			this.render(); 
	 			this.panel.attributes.setTarget(event.target.owningUnit);
	 			this.panel.attributes.updateui();
	 		  }			
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
var SymbolsPanelView=Backbone.View.extend({
	initialize:function(opt){
       this.footprintstree=new SymbolsTree(opt);
       this.footprintinspector=new SymbolsInspector(opt);
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
	   SymbolsPanelView	   
}