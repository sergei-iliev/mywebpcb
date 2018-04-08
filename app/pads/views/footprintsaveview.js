var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var FootprintContainer=require('pads/d/footprintcomponent').FootprintContainer;


var FootprintSaveView=Backbone.View.extend({
	el:"#savedialogcontentslot",
	initialize:function(opt){
			this.footprintComponent=opt.footprintComponent; 
			j$('#FootprintSaveDialog').jqxWindow('open');
			j$('#FootprintSaveDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#FootprintSaveDialog').on('close', j$.proxy(this.onclose,this)); 				    	
			this.delegateEvents();	
			this.loadlibrary();
	},
    events: {
       "click  #savebutton" : "onsave",	
	   "click  #closebutton" : "onremove",
       "change #savelibrarycombo": "onchangelibrary",
	},	
    loadlibrary:function(){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/footprints/libraries',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#FootprintSaveDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadlibraries,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#FootprintSaveDialog').unblock();
	        }
	    });
	    
	}, 	
	onloadlibraries:function(data, textStatus, jqXHR){
		var that=this; 
		j$(data).find("name").each(j$.proxy(function(){
		  j$('#savelibrarycombo').append('<option value=' +j$(this).text()+ '>' +  j$(this).text() + '</option>');
		}),that);
		//set library
		j$('#savelibrarycombo').val(this.footprintComponent.getModel().libraryname);
		//category load	
        if (j$('#savelibrarycombo').val()!=""&&j$('#savelibrarycombo').val()!=null) {
          this.loadcategories(j$('#savelibrarycombo').val());
        }
		
	},	
	onchangelibrary:function(){
		this.loadcategories(j$('#savelibrarycombo').val()); 	
	},	
	loadcategories:function(library){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/footprints/libraries/'+library+'/categories',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#FootprintSaveDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadcategories,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#FootprintSaveDialog').unblock();
	        }
	    });		
	},	
	onloadcategories:function(data, textStatus, jqXHR){
		var that=this; 
		j$('#savecategorycombo').empty();
		j$(data).find("name").each(j$.proxy(function(){
			  j$('#savecategorycombo').append('<option value=' +j$(this).text()+ '>' +  j$(this).text() + '</option>');
		}),that);
		
		//set category
		j$('#savecategorycombo').val(this.footprintComponent.getModel().categoryname);

	},	
    onclose:function(){
      this.undelegateEvents();  	  
  	  this.unbind();
    },		  
    onsave:function(){
    	console.log(j$('#savelibrarycombo').val());
    	let library=j$('#savelibrarycombo').val()!=''?j$('#savelibrarycombo').val():'null';
    	let category=j$('#savecategorycombo').val()!=''?j$('#savecategorycombo').val():'null'
	    let name=j$('#name').val()!=''?j$('#name').val():'null'
    	j$.ajax({
	        type: 'POST',
	        contentType: 'application/xml',
	        url: '/rest/footprints/libraries/'+library+'/categories/'+category+'?footprintName='+name+'&overwrite='+j$('#overrideCheck').is(":checked"),
	        dataType: "xml",
	        data:this.footprintComponent.getModel().format(),
	        beforeSend:function(){
		          j$('#FootprintSaveDialog').block({message:'<h5>Saving...</h5>'});	
		        },
	        success: j$.proxy(this.onremove,this), 
	        		        
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
	        	j$('#FootprintSaveDialog').unblock();
	        }
	    });
    },
    onremove:function(){
      j$('#FootprintSaveDialog').jqxWindow('close'); 	
    },  
    render:function(){
		j$(this.el).html(    	
        "<div class=\"row voffset3\">"+                       
        "<div class=\"col-sm-4 col-sm-offset-1\">"+         
        "Name" +
        "</div>"+
        "<div class=\"col-sm-6 col-sm-pull-1\">"+        
        "<input type='text' id='name' value='"+this.footprintComponent.getModel().formatedFileName+"' class='form-control input-sm\'>" +
        "</div>"+                       
        "</div>"+
        
        "<div class=\"row voffset2\">"+                       
        "<div class=\"col-sm-4 col-sm-offset-1\">"+         
        "Library" +
        "</div>"+
        "<div class=\"col-sm-6 col-sm-pull-1\">"+        
		"<select class=\"form-control input-sm\" id=\"savelibrarycombo\"></select>"+        
        "</div>"+                       
        "</div>"+
        
        "<div class=\"row voffset2\">"+                       
        "<div class=\"col-sm-4 col-sm-offset-1\">"+         
        "Category" +
        "</div>"+
        "<div class=\"col-sm-6 col-sm-pull-1\">"+        
        "<select class=\"form-control input-sm\" id=\"savecategorycombo\"></select>"+
        "</div>"+                       
        "</div>"+    

        "<div class=\"row voffset2\">"+                       
        "<div class=\"col-sm-8 col-sm-offset-1\">"+         
        "Override existing unit" +
        "</div>"+
        "<div class=\"col-sm-2 col-sm-pull-1\">"+   
        "<input type='checkbox' id='overrideCheck'>" +
        "</div>"+                       
        "</div>"+    
        
        "<div class=\"row voffset2 text-center\" style=\"height:40px;\">"+        
        "<div class=\"col-sm-12\">"+
		"<button  id=\"savebutton\" class=\"btn btn-default\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebutton\" class=\"btn btn-default\">Close</button>"+        
        "</div>"+
        "</div>");  	
		j$('#savelibrarycombo').editableSelect();
		j$('#savecategorycombo').editableSelect();
		return this;
    }
		  
});

module.exports =FootprintSaveView