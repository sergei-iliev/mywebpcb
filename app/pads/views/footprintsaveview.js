var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var FootprintContainer=require('pads/d/footprintcomponent').FootprintContainer;


var FootprintSaveView=Backbone.View.extend({
	el:"#savedialogcontentslot",
	initialize:function(opt){
			this.footprintComponent=opt.footprintComponent; 
			j$('#FootprintSaveDialog').jqxWindow({height: 300, width: 420});
			j$('#FootprintSaveDialog').jqxWindow('open');
			j$('#FootprintSaveDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#FootprintSaveDialog').on('close', j$.proxy(this.onclose,this)); 				    	
			this.delegateEvents();	
			this.loadlibrary();
	},
	
    events: {
       "click  #savebutton" : "onsave",	
	   "click  #closebutton" : "onremove",
       //"change #savelibrarycombo": "onchangelibrary",
       "select #savelibrarycombo": "onchangelibrary",
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
		j$('#savelibrarycombo').editableSelect('clear');
		j$(data).find("name").each(j$.proxy(function(){
		  j$('#savelibrarycombo').editableSelect('add',j$(this).text());  //('<option value=' +j$(this).text()+ '>' +  j$(this).text() + '</option>');
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
	        url: '/rest/footprints/libraries/'+library+'/categories?includefiles=false',
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
		j$('#savecategorycombo').editableSelect('clear');
		j$('#savecategorycombo').empty();
		j$(data).find("name").each(j$.proxy(function(){
			  j$('#savecategorycombo').editableSelect('add',j$(this).text()); //('<option value=' +j$(this).text()+ '>' +  j$(this).text() + '</option>');
		}),that);
		
		//set category
		j$('#savecategorycombo').val(this.footprintComponent.getModel().categoryname);

	},	
    onclose:function(){
      this.undelegateEvents();  	  
  	  this.unbind();
    },		  
    onsave:function(){
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
        "<div class=\"row voffset3 text-center\">"+                       
        "<div class=\"col-md-6\">"+         
        "Name" +
        "</div>"+
        "<div class=\"col-md-6\">"+        
        "<input type='text' id='name' value='"+this.footprintComponent.getModel().formatedFileName+"' class='form-control input-sm\'>" +
        "</div>"+                       
        "</div>"+
        
        "<div class=\"row voffset2 text-center\">"+                       
        "<div class=\"col-sm-6\">"+         
        "Library" +
        "</div>"+
        "<div class=\"col-sm-6\">"+        
		"<select class=\"form-control\" id=\"savelibrarycombo\"></select>"+        
        "</div>"+                       
        "</div>"+
        
        "<div class=\"row voffset2 text-center\">"+                       
        "<div class=\"col-sm-6\">"+         
        "Category" +
        "</div>"+
        "<div class=\"col-sm-6\">"+        
        "<select class=\"form-control\" id=\"savecategorycombo\"></select>"+
        "</div>"+                       
        "</div>"+    

        "<div class=\"row voffset2 text-center\">"+                       
        "<div class=\"col-md-6\">"+         
        "Override existing unit" +
        "</div>"+
        "<div class=\"col-md-6\">"+   
        "<input type='checkbox' id='overrideCheck' style='width:3vw;height:3vh;'>" +
        "</div>"+                       
        "</div>"+    
        
        "<div class=\"row voffset2 text-center\" style=\"height:40px;\">"+        
        "<div class=\"col-sm-12\">"+
		"<button  id=\"savebutton\" class=\"btn btn-default\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebutton\" class=\"btn btn-default\">Close</button>"+        
        "</div>"+
        "</div>");  	
		j$('#savelibrarycombo').editableSelect({ filter: false });
		j$('#savecategorycombo').editableSelect({ filter: false });
		return this;
    }
		  
});

module.exports =FootprintSaveView