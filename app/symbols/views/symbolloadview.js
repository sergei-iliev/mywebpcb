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


