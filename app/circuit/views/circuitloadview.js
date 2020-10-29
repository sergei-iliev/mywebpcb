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