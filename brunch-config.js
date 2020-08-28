// See http://brunch.io for documentation.
exports.files = {	
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
    //  'app.js': /^app/
    },
	order:{
      before: [        
        'vendor/jquery/jquery-3.2.1.min.js',
		'vendor/jqwidgets/js/jqxcore.js',
		'vendor/jqwidgets/js/jqxmenu.js',			
		'vendor/jqwidgets/js/jqxpanel.js',
		'vendor/jqwidgets/js/jqxtree.js',		
		'vendor/jqwidgets/js/jqxbuttons.js',
		'vendor/jqwidgets/js/jqxcheckbox.js',
		'vendor/jqwidgets/js/jqxscrollbar.js',		
		'vendor/jqwidgets/js/jqxwindow.js',
		'vendor/bootstrap/js/bootstrap.min.js',
		'vendor/backbone/underscore-min.js',
		'vendor/backbone/backbone-min.js'
	  ]
	},
	entryPoints: {      
	  'app/symbols/symbols.js':{
      	'symbols/symbols.js': /^app/  
      },
      'app/pads/pads.js':{
    	'pads/pads.js': /^app/        
      },
	  'app/circuit/circuit.js':{
      	'circuit/circuit.js': /^app/  
      },
      'app/board/board.js':{
      	'board/board.js': /^app/  
      }
      
    }
  },
  stylesheets: {
	  joinTo:
		 'app.css',
	  order:{
		 before:[
		  'vendor/bootstrap/css/bootstrap.css', 
		  'vendor/bootstrap/css/bootstrap-theme.css', 
		  'vendor/jqwidgets/css/jqx.base.css', 
		  'vendor/jqwidgets/css/jqx.bootstrap.css', 
		  'vendor/jqwidgets/css/jqx.light.css'
		 ] 		  
	  }	 
  }
};
