var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var BoardContainer=require('board/d/boardcomponent').BoardContainer;


BoardLoadView=Backbone.View.extend({
	  initialize:function(opt){
			j$('#BoardLoadDialog').jqxWindow('open');
			j$('#BoardLoadDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#BoardLoadDialog').on('close', j$.proxy(this.onclose,this)); 
			this.unitSelectionPanel=new core.UnitSelectionPanel({selectorid:'boardselectionpanel',canvasprefixid:'b',enabled:opt.enabled});
			this.libraryview=new LibraryView({unitSelectionPanel:this.unitSelectionPanel});  
	    	this.buttonview=new ButtonView({unitSelectionPanel:this.unitSelectionPanel});  
	    	//j$('#loadtitle').html("Load Board");
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
		j$('#boardtree').jqxTree({width: '100%',height:'260px'});
		//bind select element
		j$('#boardtree').on('select',j$.proxy(this.onvaluechange,this));			
        this.loadprojects();
	},
	clear:function(){
	    //unbind select element		
		j$('#boardtree').off('select',j$.proxy(this.onvaluechange,this));
		j$('#boardtree').jqxTree('clear');
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
    	var item = j$('#boardtree').jqxTree('getItem', event.args.element);
    	var	callback=this.loadboard;
    	var  url=item.value.project+"/"+item.value.fullname;	

	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/boards/projects/'+url,
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#BoardLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(callback,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#BoardLoadDialog').unblock();
	        }
	    });
    	
    },
    loadboard:function(data, textStatus, jqXHR){
      this.unitSelectionPanel.release();
      let boardContainer=new BoardContainer(true);      
      boardContainer.parse(data);
      this.unitSelectionPanel.unitSelectionGrid.setModel(boardContainer);
      this.unitSelectionPanel.unitSelectionGrid.build();   
      this.unitSelectionPanel.render();
    },
    loadprojects:function(){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/boards/projects',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#BoardLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadprojects,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#BoardLoadDialog').unblock();
	        }
	    });
	    
	}, 
	onloadprojects:function(data, textStatus, jqXHR){
		var that=this; 
		j$(data).find("name").each(j$.proxy(function(){
		  j$('#projectcombo').append('<option value=' +j$(this).text()+ '>' +  j$(this).text() + '</option>');
		}),that);
		//category load		
		this.loadboards(j$('#projectcombo').val());
	},	
	loadboards:function(project){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/boards/projects/'+project,
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#BoardLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadboards,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#BoardLoadDialog').unblock();
	        }
	    });		
	},
	onloadboards:function(data, textStatus, jqXHR){
		var that=this; 
		j$('#boardtree').jqxTree('clear');
		j$(data).find("name").each(j$.proxy(function(){	
			j$('#boardtree').jqxTree('addTo', { label: j$(this).text(),value:{project:j$(this).attr("project"),fullname:(j$(this).attr("fullname")!=undefined?j$(this).text():undefined)}}, null);         
		}),that);		
		j$('#boardtree').jqxTree('render');
	},
	render:function(){
		j$(this.el).empty();
		j$(this.el).append("<select class=\"form-control input-sm\" id=\"projectcombo\"></select>");
		
	}
});
ButtonView=Backbone.View.extend({
	el:"#boardbuttonslot",
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
		j$('#BoardLoadDialog').jqxWindow('close');
    },
    onclose:function(){
    	j$('#BoardLoadDialog').jqxWindow('close'); 	
    },
    
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
		"<button  id=\"loadbuttonid\" class=\"btn btn-default\">Load</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebuttonid\" class=\"btn btn-default\">Close</button>");
	}
});

module.exports =BoardLoadView;