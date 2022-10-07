var mywebpcb=require('core/core').mywebpcb;
var events=require('core/events');
var core=require('core/core');
var UnitMgr = require('core/unit').UnitMgr;
var utilities =require('core/utilities');
var BaseBuilder = require('core/views/panelview').BaseBuilder;

var GlyphLabel=require('pads/shapes').GlyphLabel;	
var	Line=require('pads/shapes').Line;
var	RoundRect=require('pads/shapes').RoundRect;
var	Circle=require('pads/shapes').Circle;
var	Arc=require('pads/shapes').Arc;
var	Pad=require('pads/shapes').Pad;
var	SolidRegion=require('pads/shapes').SolidRegion;

var ComponentPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  ComponentPanelBuilder.__super__.initialize(component);	
      this.id="componentpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',	
       
    },
	
	onenter:function(event){
		 if(event.keyCode != 13){
			return; 
	     }
		 if(event.target.id=='nameid'){
			 this.target.getModel().setFileName(j$("#nameid").val()); 
			 this.target.fireContainerEvent({target:null,type:events.Event.RENAME_CONTAINER});
		 }
		 if(event.target.id=='importid'){
			 console.log(34);
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
				"</td></tr></table>"
		);	
		return this;
	}
});

var FootprintPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
	  FootprintPanelBuilder.__super__.initialize(component);
      this.id="footprintpanelbuilder";
    },
    events: {
        'keypress #nameid' : 'onenter',
        'keypress #widthid':'onenter',
        'keypress #heightid':'onenter',
        'change #gridrasterid': 'onchange',
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
		    this.component.getModel().getUnit().setSize(core.MM_TO_COORD(parseFloat(j$('#widthid').val())),core.MM_TO_COORD(parseFloat(j$('#heightid').val())));  
		    this.component.componentResized();     
		    this.component.repaint();
		 }
		 if(event.target.id=='nameid'){
			 this.target.unitName=j$("#nameid").val(); 
			 this.component.getModel().fireUnitEvent({target:this.target,type:events.Event.RENAME_UNIT});
		 }
		 if(event.target.id=='originxid'||event.target.id=='originyid'){   
			 if(this.component.getModel().getUnit().getCoordinateSystem()!=null){
			    this.component.getModel().getUnit().getCoordinateSystem().reset(core.MM_TO_COORD(parseFloat(j$('#originxid').val())),core.MM_TO_COORD(parseFloat(j$('#originyid').val())));  
			    this.component.componentResized();     
			    this.component.repaint();
			 }
		 }
		 //mycanvas.focus();
		
	},
	onchange:function(event){
		if(event.target.id=='gridrasterid'){
			this.target.grid.setGridValue(parseFloat(j$("#gridrasterid").val()));
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
	   j$("#widthid").val(core.COORD_TO_MM( this.target.width));    
	   j$("#heightid").val(core.COORD_TO_MM(this.target.height));
	   j$("#gridrasterid").val(this.target.grid.getGridValue());
	   if(this.component.getModel().getUnit().coordinateSystem!=null){
	     j$("#originxid").val(core.COORD_TO_MM(this.component.getModel().getUnit().getCoordinateSystem().getX()));    
	     j$("#originyid").val(core.COORD_TO_MM(this.component.getModel().getUnit().getCoordinateSystem().getY()));
	   }
	   //reference
	   var labels=this.target.getShapes(GlyphLabel);
	   var hash=[];
	   var reftag;
	   var valtag;
	   
	   //add empty entry
	   hash.push({id:-1,value:""});
	   for(i=0;i<labels.length;i++){
		   hash.push({id:labels[i].uuid,value:labels[i].texture.text});
		 
		   if(labels[i].texture.tag=='reference'){
			   reftag=labels[i].uuid;
		   }
		   if(labels[i].texture.tag=='value'){
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
				"<tr><td style='padding:7px'>Units</td><td>" +
				"<select class=\"form-control input-sm\" id=\"unitsid\">"+
			    this.fillComboBox([{id:'mm',value:'MM',selected:true},{id:'inch',value:'INCH'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Grid</td><td>" +
				"<select class=\"form-control input-sm\" id=\"gridrasterid\">"+
			    this.fillComboBox(core.GridRaster)+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Reference</td><td>" +
				"<select class=\"form-control input-sm\" id=\"referenceid\">"+
			    
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Value</td><td>" +
				"<select class=\"form-control input-sm\" id=\"valueid\">"+
			    
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Origin X</td><td><input type='text' id='originxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Origin Y</td><td><input type='text' id='originyid' value='' class='form-control input-sm\'></td></tr>"+

		"</table>");
			
		return this;
	}
});

var PadPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		PadPanelBuilder.__super__.initialize(component);
		this.id="padpanelbuilder";   
    },	
    events: {
        'keypress #padxid' : 'onenter',	
        'keypress #padyid' : 'onenter',
        'keypress #padwidthid' : 'onenter',
        'keypress #padheightid' : 'onenter',
        'keypress #rotateid' : 'onenter',
        'keypress #numberid' : 'onenter',	
        'keypress #numbersizeid' : 'onenter',
        'keypress #numberxid' : 'onenter',	
        'keypress #numberyid' : 'onenter',
        'keypress #netvalueid' : 'onenter',	
        'keypress #netvaluesizeid' : 'onenter',
        'keypress #netvaluexid' : 'onenter',	
        'keypress #netvalueyid' : 'onenter',
        'keypress #drillwidthid' : 'onenter',
        //'keypress #offsetxid' : 'onenter',
        //'keypress #offsetyid' : 'onenter',
        'change #layerid': 'onchange',
        'change #typeid': 'onchange', 
        'change #shapeid': 'onchange', 
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        if(event.target.id=='typeid'){        
        	this.target.setType(PadType.parse(j$('#typeid').find('option:selected').text()));
        	this.updateui();
        }
        if(event.target.id=='shapeid'){        
        	this.target.setShape(PadShape.parse(j$('#shapeid').find('option:selected').text()));
        	this.updateui();
        }
        
       this.component.repaint(); 
      },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }		 
	     if(event.target.id=='padwidthid'){	    	
	        this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#padwidthid').val()))); 
	     }
	     if(event.target.id=='padheightid'){
	    	this.target.setHeight(core.MM_TO_COORD(parseFloat(j$('#padheightid').val()))); 
	     }
	     if(event.target.id=='rotateid'){
		        this.target.setRotation(Math.abs(utilities.round(j$('#rotateid').val()))); 
		     }	     
		 if(event.target.id=='numberid'){ 
			 this.target.getTextureByTag("number").setText(j$('#numberid').val());			   
		 }
		 if(event.target.id=='numbersizeid'){ 
			 this.target.getTextureByTag("number").setSize(core.MM_TO_COORD(parseFloat(j$('#numbersizeid').val())));  
		 }
		 if(event.target.id=='numberxid'||event.target.id=='numberyid'){ 
			 this.target.getTextureByTag("number").setLocation(this.fromUnitX(parseFloat(j$('#numberxid').val())),this.fromUnitY(parseFloat(j$('#numberyid').val())));
			 
		 }
		 //--------netvalue-------
		 if(event.target.id=='netvalueid'){ 
			 this.target.getTextureByTag("netvalue").setText(j$('#netvalueid').val()); 
		 }
		 if(event.target.id=='netvaluesizeid'){ 
			 this.target.getTextureByTag("netvalue").setSize(core.MM_TO_COORD(parseFloat(j$('#netvaluesizeid').val()))); 
		 }
		 if(event.target.id=='netvaluexid'||event.target.id=='netvalueyid'){ 
			 this.target.getTextureByTag("netvalue").setLocation(this.fromUnitX(parseFloat(j$('#netvaluexid').val())),this.fromUnitY(parseFloat(j$('#netvalueyid').val()))); 
		 }
		 if(event.target.id=='drillwidthid'){ 
			 this.target.drill.setWidth(core.MM_TO_COORD(parseFloat(j$('#drillwidthid').val())));   
		 }
		 //if(event.target.id=='offsetxid'){ 
		//	 this.target.offset.x=(core.MM_TO_COORD(parseFloat(j$('#offsetxid').val())));   
		 //}
		 //if(event.target.id=='offsetyid'){ 
		//	 this.target.offset.y=(core.MM_TO_COORD(parseFloat(j$('#offsetyid').val())));   
		 //}
		 this.component.repaint(); 
    },
	updateui:function(){

		 j$('#layerid').val(this.target.copper.getName());
		 j$('#padxid').val(this.toUnitX(this.target.getCenter().x));
		 j$('#padyid').val(this.toUnitY(this.target.getCenter().y));
		 j$("#rotateid").val(this.target.rotation);  
		 j$('#padwidthid').val(core.COORD_TO_MM(this.target.width));
	        if(this.target.getShape()==PadShape.CIRCULAR||this.target.getShape()==PadShape.POLYGON){
	        	j$('#padheightid').prop('disabled',true);
	        	j$('#padheightid').val('');
	        }else{
	        	j$('#padheightid').prop('disabled',false);
	        	j$('#padheightid').val(core.COORD_TO_MM(this.target.height));  
	        }
	        j$('#typeid').val(this.target.type);  
	        j$('#shapeid').val(this.target.getShape());  
	        //-------number---------
	        j$('#numberid').val(this.target.getTextureByTag("number").shape.text); 
	        j$('#numbersizeid').val(core.COORD_TO_MM(this.target.getTextureByTag("number").shape.fontSize)); 
	        
	        if(this.target.getTextureByTag("number").isEmpty()){
	            j$('#numberxid').val('');
				j$('#numberyid').val('');
	        }else{ 
	         j$('#numberxid').val(this.toUnitX(this.target.getTextureByTag("number").shape.anchorPoint.x));
			 j$('#numberyid').val(this.toUnitY(this.target.getTextureByTag("number").shape.anchorPoint.y));
	        }	       	        

	        //-------netvalue--------
	        j$('#netvalueid').val(this.target.getTextureByTag("netvalue").shape.text); 
	        j$('#netvaluesizeid').val(core.COORD_TO_MM(this.target.getTextureByTag("netvalue").shape.fontSize)); 
	        
	        if(this.target.getTextureByTag("netvalue").isEmpty()){
	            j$('#netvaluexid').val('');
				j$('#netvalueyid').val('');
	        }else{ 
	         j$('#netvaluexid').val(this.toUnitX(this.target.getTextureByTag("netvalue").shape.anchorPoint.x));
			 j$('#netvalueyid').val(this.toUnitY(this.target.getTextureByTag("netvalue").shape.anchorPoint.y));
	        }
	        
	        //-----drill and offset------
	        j$('#drillwidthid').val(core.COORD_TO_MM(this.target.drill==null?0:this.target.drill.getWidth()));
	        //j$('#offsetxid').val(core.COORD_TO_MM(this.target.offset.x));
			//j$('#offsetyid').val(core.COORD_TO_MM(this.target.offset.y));
			
	        if(this.target.type== PadType.SMD){
	        	 j$('#drillwidthid').prop('disabled',true);
	        	 //j$('#offsetxid').prop('disabled',true);
	        	 //j$('#offsetyid').prop('disabled',true);
	        }else{
	        	 j$('#drillwidthid').prop('disabled',false);
	        	 //j$('#offsetxid').prop('disabled',false);
	        	 //j$('#offsetyid').prop('disabled',false);	        	
	        }	       
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
				"<table width='100%' height='100%'>"+
				"<tr><td style='width:50%;padding:7px'>Layer</td><td>" +
				"<select class=\"form-control input-sm\" id=\"layerid\">"+
				this.fillComboBox([{id:'FCu',value:'FCu',selected:true},{id:'BCu',value:'BCu'},{id:'Cu',value:'Cu'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>X</td><td><input type='text' id='padxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='padyid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Width</td><td><input type='text' id='padwidthid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Height</td><td><input type='text' id='padheightid' value='' class='form-control input-sm\'></td></tr>"+							
				"<tr><td style='padding:7px'>Rotate</td><td><input type='text' id='rotateid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Pad Type</td><td>" +
				"<select class=\"form-control input-sm\" id=\"typeid\">"+
				this.fillComboBox([{id:0,value:'THROUGH_HOLE',selected:true},{id:1,value:'SMD'},{id:2,value:'CONNECTOR'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='width:50%;padding:7px'>Pad Shape</td><td>" +
				"<select class=\"form-control input-sm\" id=\"shapeid\">"+
				this.fillComboBox([{id:0,value:'RECTANGULAR',selected:true},{id:1,value:'CIRCULAR'},{id:2,value:'OVAL'},{id:3,value:'POLYGON'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Drill Width</td><td><input type='text' id='drillwidthid' value='' class='form-control input-sm\'></td></tr>"+				
				//"<tr><td style='padding:7px'>Offset X</td><td><input type='text' id='offsetxid' value='' class='form-control input-sm\'></td></tr>"+
				//"<tr><td style='padding:7px'>Offset Y</td><td><input type='text' id='offsetyid' value='' class='form-control input-sm\'></td></tr>"+				
				
				"<tr><td style='padding:7px'>Number</td><td><input type='text' id='numberid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Size</td><td><input type='text' id='numbersizeid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>X</td><td><input type='text' id='numberxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='numberyid' value='' class='form-control input-sm\'></td></tr>"+				
				        
				"<tr><td style='padding:7px'>Net name</td><td><input type='text' id='netvalueid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Size</td><td><input type='text' id='netvaluesizeid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>X</td><td><input type='text' id='netvaluexid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Y</td><td><input type='text' id='netvalueyid' value='' class='form-control input-sm\'></td></tr>"+				
				        
		
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
        'change #layerid': 'onchange',
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
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
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 	 
		 if(event.target.id=='rotateid'){
			   this.target.setRotation(Math.abs(utilities.round(j$('#rotateid').val())));			 
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
			 this.target.setRounding(core.MM_TO_COORD(parseFloat(j$('#roundingid').val())));			 
		 }
		 this.component.repaint(); 		 
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundDouble(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x)));
        j$('#yid').val(utilities.roundDouble(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y))); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#rotateid").val(this.target.rotation);    
		j$("#roundingid").val(core.COORD_TO_MM(this.target.roundRect.rounding));
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
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Rotate</td><td><input type='text' id='rotateid' value='' class='form-control input-sm\'></td></tr>"+
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
        'change #arctypeid':'onchange',
        
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }
        if(event.target.id=='arctypeid'){
        	this.target.arcType= (j$('#arctypeid').val());
        }
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
			 this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='widthid'){
			   this.target.setRadius(core.MM_TO_COORD(parseFloat(j$('#widthid').val())));			 
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
		j$('#layerid').val(this.target.copper.getName());		
		j$('#arctypeid').val(this.target.arcType);	
		j$("#startangleid").val(utilities.roundDouble(this.target.arc.startAngle));    
		j$("#extendangleid").val(utilities.roundDouble(this.target.arc.endAngle));		
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundDouble(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x)));
        j$('#yid').val(utilities.roundDouble(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y))); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#widthid").val(utilities.roundDouble(core.COORD_TO_MM(this.target.arc.r)));
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
				"<tr><td style='width:50%;padding:7px'>Arc Type</td><td>" +
				"<select class=\"form-control input-sm\" id=\"arctypeid\">"+
				this.fillComboBox([{id:0,value:'TWO POINT ARC',selected:true},{id:1,value:'CENTER POINT ARC'}])+
			    "</select>" +
				"</td></tr>"+
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+							
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+								
				"<tr><td style='padding:7px'>Radius</td><td><input type='text' id='widthid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Start&deg</td><td><input type='text' id='startangleid' value='' class='form-control input-sm\'></td></tr>"+	
				"<tr><td style='padding:7px'>Extend&deg</td><td><input type='text' id='extendangleid' value='' class='form-control input-sm\'></td></tr>"+
		"</table>");
		return this;
	}
});
var SolidRegionPanelBuilder=BaseBuilder.extend({
	initialize:function(component){
		SolidRegionPanelBuilder.__super__.initialize(component);
		this.id="solidregionpanelbuilder";  
    },	
    events: {
        'change #layerid':'onchange'
    },
    onchange:function(event){
        if(event.target.id=='layerid'){
        	this.target.copper= core.Layer.Copper.valueOf(j$('#layerid').val());
        }              
        this.component.repaint(); 
    }, 
	updateui:function(){
		
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
        this.component.repaint(); 
      },    
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		 if(event.target.id=='thicknessid'){
			this.target.thickness=core.MM_TO_COORD(parseFloat(j$('#thicknessid').val()));			 
		 } 
		 if(event.target.id=='radiusid'){
		   this.target.circle.r=(core.MM_TO_COORD(parseFloat(j$('#radiusid').val())));			 
		 } 
		 if(event.target.id=='xid'){			 
	         var x=this.fromUnitX(j$('#xid').val()); 
	         this.target.circle.pc.x=x;			   
		 } 
	     if(event.target.id=='yid'){		
	         var y=this.fromUnitY(j$('#yid').val()); 
	         this.target.circle.pc.y=y;		   			 
		 } 		 
		 this.component.repaint(); 		 
    },

	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        //j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        //j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.circle.pc.x));
        j$('#yid').val(this.toUnitY(this.target.circle.pc.y)); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#radiusid").val(core.COORD_TO_MM(this.target.circle.radius));    
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
				"<tr><td style='width:50%;padding:7px'>Center X</td><td><input type='text' id='xid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Center Y</td><td><input type='text' id='yid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Fill</td><td>" +
				"<select class=\"form-control input-sm\" id=\"fillid\">"+
				this.fillComboBox([{id:1,value:'EMPTY',selected:true},{id:2,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+				
				"<tr><td style='padding:7px'>Radius</td><td><input type='text' id='radiusid' value='' class='form-control input-sm\'></td></tr>"+
				
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
        this.component.repaint(); 
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
		 this.component.repaint();  
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
		'change #layerid':'onchange',
    },
    onchange:function(event){      
	  if(event.target.id=='layerid'){
		  this.target.setCopper(core.Layer.Copper.valueOf(j$('#layerid').val()));
      }
      this.component.repaint(); 
    },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
		  if(event.target.id=='rotateid'){
		      this.target.setRotation(Math.abs(utilities.round(j$('#rotateid').val()))); 
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
		 if((event.target.id=='yid')||(event.target.id=='xid')){	            
			 this.target.texture.setLocation(this.fromUnitX(j$('#xid').val()),this.fromUnitY(j$('#yid').val()));  
	     }		 
		 this.component.repaint();     		    	
    },
	updateui:function(){
	 j$("#rotateid").val(this.target.texture.rotation); 	
	 j$('#layerid').val(this.target.copper.getName());	
	 j$('#textid').val(this.target.texture.text);	
	 j$('#xid').val(this.toUnitX(this.target.texture.anchorPoint.x));
	 j$('#yid').val(this.toUnitY(this.target.texture.anchorPoint.y));	 
	 j$('#sizeid').val(core.COORD_TO_MM(this.target.texture.size));
	 j$('#thicknessid').val(core.COORD_TO_MM(this.target.texture.thickness));
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
				"<tr><td style='padding:7px'>Rotate</td><td><input type='text' id='rotateid' value='' class='form-control input-sm\'></td></tr>"+				
				"<tr><td style='padding:7px'>Size</td><td><input type='text' id='sizeid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Thickness</td><td><input type='text' id='thicknessid' value='' class='form-control input-sm\'></td></tr>"+
		        "</table>");
			
		return this;
	}
});

var FootprintsTree=Backbone.View.extend({	
	initialize:function(opt){		
	    //creat tree
		this.name=opt.name;
		this.footprintComponent=opt.footprintComponent;		
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
			//this.footprintComponent.getModel().getUnit().setScrollPosition(this.footprintComponent.viewportWindow.x,this.footprintComponent.viewportWindow.y);
			
			this.footprintComponent.getModel().setActiveUnitUUID(item.id);
			this.footprintComponent.getModel().getUnit().setSelected(false);
			this.footprintComponent.componentResized();
			
			//this.footprintComponent.hbar.jqxScrollBar({ value:this.footprintComponent.getModel().getUnit().scrollPositionXValue});
			//this.footprintComponent.vbar.jqxScrollBar({ value:this.footprintComponent.getModel().getUnit().scrollPositionYValue});
			
			this.footprintComponent.repaint();
			mywebpcb.trigger('tree:select',{target:this.footprintComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 
		}
		if(item.value==222){
			//is this the same shape of the current unit
			if(this.footprintComponent.getModel().getUnit().getUUID()!=item.parentId){
		 		   this.$tree.off('select',j$.proxy(this.valuechanged,this));
		 		   this.$tree.jqxTree('selectItem',  j$("#"+item.parentId)[0]);
		 		   this.footprintComponent.getModel().setActiveUnitUUID(item.parentId);
		 		   this.$tree.on('select',j$.proxy(this.valuechanged,this));
			}
			   //shape
			var shape=this.footprintComponent.getModel().getUnit().getShape(item.id);
			this.footprintComponent.getModel().getUnit().setSelected(false);
			shape.setSelected(true);
			
		    //position on shape center
            var rect=shape.getBoundingShape();            
            this.footprintComponent.setViewportPosition(rect.center.x,rect.center.y);
			this.footprintComponent.repaint();
			mywebpcb.trigger('tree:select',{target:shape,type:events.Event.SELECT_SHAPE}); 	
		}
	
	},
	oncontainerevent:function(event){
	      switch (event.type) {
	      case events.Event.SELECT_CONTAINER:

	         break;
	      case events.Event.RENAME_CONTAINER:
	    	  var element=j$('#root')[0];
	    	  this.$tree.jqxTree('updateItem', { label: this.footprintComponent.getModel().formatedFileName},element);
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

var FootprintsInspector=Backbone.View.extend({	
	initialize:function(opt){
		this.footprintComponent=opt.footprintComponent;
		this.collection=new Backbone.Collection([new FootprintPanelBuilder(this.footprintComponent),
		                                         new LinePanelBuilder(this.footprintComponent),
		                                         new RectPanelBuilder(this.footprintComponent),
		                                         new PadPanelBuilder(this.footprintComponent),
		                                         new LabelPanelBuilder(this.footprintComponent),
		                                         new ComponentPanelBuilder(this.footprintComponent),
		                                         new CirclePanelBuilder(this.footprintComponent),
		                                         new SolidRegionPanelBuilder(this.footprintComponent),
		                                         new ArcPanelBuilder(this.footprintComponent)]);
		this.el= '#footprintsinspectorid';	
		//select container
		this.panel=this.collection.get('componentpanelbuilder');
		this.panel.attributes.delegateEvents();
		this.panel.attributes.setTarget(this.footprintComponent);
		//this.oncontainerevent({target:this.footprintComponent,type:mywebpads.container.Event.SELECT_CONTAINER});
		
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
	 			this.panel.attributes.setTarget(this.footprintComponent);
	 			this.render(); 
	 		  }
 	    } 
    	this.panel.attributes.updateui();
    },
    onunitevent:function(event){	
	 	   if(event.type==events.Event.ADD_UNIT){
	 		   //add unit to tree
		 		  if(this.panel.id!='footprintpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('footprintpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.render(); 
			 	  }
	 	   }
	 	  if(event.type==events.Event.PROPERTY_CHANGE){
	 		  
	 	  }
	 	  if(event.type==events.Event.SELECT_UNIT){
	 		   //select unit
	 		  if(this.panel.id!='footprintpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('footprintpanelbuilder');
	 			this.panel.attributes.delegateEvents();
	 			this.render(); 
	 		  }
	 	   }
	 	   if(event.type==events.Event.DELETE_UNIT){
		 		  if(this.panel.id!='componentpanelbuilder'){	
			 			this.panel.attributes.remove();
			 			this.panel=this.collection.get('componentpanelbuilder');
			 			this.panel.attributes.delegateEvents();
			 			this.panel.attributes.setTarget(this.footprintComponent);
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
		if(event.target instanceof GlyphLabel){
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
		if(event.target instanceof Pad){
			if(this.panel.id!='padpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('padpanelbuilder');
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
		if(event.target instanceof Circle){
			if(this.panel.id!='circlepanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('circlepanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}	
		}if(event.target instanceof Arc){
			if(this.panel.id!='arcpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('arcpanelbuilder');
				this.panel.attributes.delegateEvents();
				this.render();
			}	
		}if(event.target instanceof SolidRegion){
			if(this.panel.id!='solidregionpanelbuilder'){
				this.panel.attributes.remove();
				this.panel=this.collection.get('solidregionpanelbuilder');
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
	 		  if(this.panel.id!='footprintpanelbuilder'){	
	 			this.panel.attributes.remove();
	 			this.panel=this.collection.get('footprintpanelbuilder');
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
var FootprintsPanelView=Backbone.View.extend({
	initialize:function(opt){
       this.footprintstree=new FootprintsTree(opt);
       this.footprintinspector=new FootprintsInspector(opt);
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
	   FootprintsPanelView	   
}