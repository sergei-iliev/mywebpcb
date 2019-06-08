(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("core/core.js", function(exports, require, module) {
var d2=require('d2/d2');

var mywebpcb = mywebpcb || {};

var SELECT_RECT_WIDTH = 3000; 
 
var  UUID=(function(){
	 var count=0;
	 return function(){
		 return ++count;
	 }
})();

GridRaster=[{id:2.54,value:2.54},{id:1.27,value:1.27},{id:0.635,value:0.635},{id:0.508,value:0.508},{id:0.254,value:0.254},{id:0.127,value:0.127},{id:0.0635,value:0.0635},{id:0.0508,value:0.0508},{id:0.0254,value:0.0254},{id:0.0127,value:0.0127},{id:5.0,value:5.0},{id:2.5,value:2.5},{id:1.0,value:1.0},{id:0.5,value:0.5},{id:0.25,value:0.25},{id:0.8,value:0.8},{id:0.2,value:0.2},{id:0.1,value:0.1},{id:0.05,value:0.05},{id:0.025,value:0.025},{id:0.01,value:0.01}];

Fill = {
		EMPTY : 0,
		FILLED : 1,
		GRADIENT : 2,
		toString : {
			0 : {
				name : "EMPTY"
			},
			1 : {
				name : "FILLED"
			},
			2 : {
				name : "GRADIENT"
			}
		},
};

var Units=(function(){
	return {
        MM:0,
        INCH:1,
        PIXEL:2		
	}
})();

var ModeEnum=(function(){
	return{
		   COMPONENT_MODE:0,		   
		   PAD_MODE : 1,
		   RECT_MODE : 2,
		   LINE_MODE : 3,
		   ELLIPSE_MODE : 4,
		   ARC_MODE : 5,
		   LABEL_MODE : 6,
		   DRAGHEAND_MODE:7,
		   ORIGIN_SHIFT_MODE:8,
		   FOOTPRINT_MODE:9,
		   TRACK_MODE:10,
		   MEASUMENT_MODE : 12,
		   COPPERAREA_MODE:13,
		   VIA_MODE:14,
		   HOLE_MODE:15,
		   SOLID_REGION_MODE:16,
	}
})();

var BOARD_LAYERS=[{id:'FCu',value:'FCu',selected:true},{id:'BCu',value:'BCu'},{id:'BSilkS',value:'BSilkS'},{id:'FSilkS',value:'FSilkS'},{id:'All',value:'All'},{id:'None',value:'None'}];
var PCB_SYMBOL_LAYERS=[{id:'FCu',value:'FCu',selected:true},{id:'BCu',value:'BCu'},{id:'BSilkS',value:'BSilkS'},{id:'FSilkS',value:'FSilkS'}];

var Layer=(function(){
	return{
	    /* Layer identification (layer number) */
	       FIRST_COPPER_LAYER  :    0,
	       LAYER_N_BACK         :   0,
	       LAYER_N_2              : 1,
	       LAYER_N_3             :  2,
	       LAYER_N_4             :  3,
	       LAYER_N_5             :  4,
	       LAYER_N_6             :  5,
	       LAYER_N_7             :  6,
	       LAYER_N_8             :  7,
	       LAYER_N_9              : 8,
	       LAYER_N_10             : 9,
	       LAYER_N_11             : 10,
	       LAYER_N_12            :  11,
	       LAYER_N_13             : 12,
	       LAYER_N_14             : 13,
	       LAYER_N_15             : 14,
	       LAYER_N_FRONT          : 15,
	       LAST_COPPER_LAYER      : 15,
	       NB_COPPER_LAYERS       : (15 + 1),

	      FIRST_NO_COPPER_LAYER  : 16,
	      ADHESIVE_N_BACK        :16,
	      ADHESIVE_N_FRONT       : 17,
	      //SOLDERPASTE_N_BACK      :18,
	      //SOLDERPASTE_N_FRONT     :19,
	      SILKSCREEN_N_BACK       :20,
	      SILKSCREEN_N_FRONT      :21,
	      SOLDERMASK_N_BACK       :22,
	      SOLDERMASK_N_FRONT      :23,
	      DRAW_N                  :24,
	      COMMENT_N               :25,
	      ECO1_N                  :26,
	      ECO2_N                  :27,
	      EDGE_N                  :28,
	      LAST_NO_COPPER_LAYER    :28,
	      UNUSED_LAYER_29         :29,
	      UNUSED_LAYER_30         :30,
	      UNUSED_LAYER_31         :31,
	      NB_LAYERS               :(28 + 1),

	      LAYER_COUNT             :32,

	    // Masks to identify a layer by a bit map
	      LAYER_BACK        :      (1 << 0),     ///< bit mask for copper layer
	      LAYER_2            :     (1 << 1),        ///< bit mask for layer 2
	      LAYER_3            :     (1 << 2),        ///< bit mask for layer 3
	      LAYER_4            :     (1 << 3),        ///< bit mask for layer 4
	      LAYER_5             :    (1 << 4),        ///< bit mask for layer 5
	      LAYER_6             :    (1 << 5),        ///< bit mask for layer 6
	      LAYER_7             :    (1 << 6),        ///< bit mask for layer 7
	      LAYER_8             :    (1 << 7),        ///< bit mask for layer 8
	      LAYER_9             :    (1 << 8),        ///< bit mask for layer 9
	      LAYER_10             :   (1 << 9),       ///< bit mask for layer 10
	      LAYER_11            :   (1 << 10),       ///< bit mask for layer 11
	      LAYER_12            :    (1 << 11),       ///< bit mask for layer 12
	      LAYER_13            :    (1 << 12),       ///< bit mask for layer 13
	      LAYER_14            :    (1 << 13),      ///< bit mask for layer 14
	      LAYER_15            :    (1 << 14),      ///< bit mask for layer 15
	      LAYER_FRONT          :   (1 << 15),    ///< bit mask for component layer
	      ADHESIVE_LAYER_BACK    : (1 << 16),
	      ADHESIVE_LAYER_FRONT   : (1 << 17),
		  SILKSCREEN_LAYER_BACK :  (1 << 20),
	      SILKSCREEN_LAYER_FRONT : (1 << 21),
		  SOLDERMASK_LAYER_BACK  : (1 << 22),
	      SOLDERMASK_LAYER_FRONT : (1 << 23),
	      DRAW_LAYER             : (1 << 25),
	      COMMENT_LAYER          : (1 << 26),
	      ECO1_LAYER             : (1 << 27),
	      ECO2_LAYER             : (1 << 28),
	      EDGE_LAYER             : (1 << 29),
	      
	      LAYER_ALL :0xFFFFFF,
	          
	      BOARD_COLOR_FRONT:'rgb(56,0,0)',
	      BOARD_COLOR_BACK:'rgb(0,0,56)',
	      BOARD_COLOR_ALL:'black',
	    Side:{
		   TOP:1,
           BOTTOM:2,
           change:function(copper){
               if (copper.getLayerMaskID() == LAYER_FRONT) {
                   return Copper.BCu;
               } else if (copper.getLayerMaskID() == SILKSCREEN_LAYER_FRONT) {
                   return Copper.BSilkS;
               } else if (copper.getLayerMaskID() == SOLDERMASK_LAYER_FRONT) {
                   return Copper.BMask;
               } else if (copper.getLayerMaskID() == LAYER_BACK) {
                   return Copper.FCu;
               } else if (copper.getLayerMaskID() == SILKSCREEN_LAYER_BACK) {
                   return Copper.FSilkS;
               } else if (copper.getLayerMaskID() == SOLDERMASK_LAYER_BACK) {
                   return Copper.FMask;
               }

               return copper;        	   
           },
		   resolve:function(layermaskId) {
            if (layermaskId == Layer.LAYER_BACK) {
                return Layer.Side.BOTTOM;
            } else if (layermaskId == Layer.SILKSCREEN_LAYER_BACK) {
                return Layer.Side.BOTTOM;
            } else if (layermaskId == Layer.SOLDERMASK_LAYER_BACK) {
                return Layer.Side.BOTTOM;
            }
            return Layer.Side.TOP;
           }
		},			
		Copper:{
			FCu:{
		          toString:function(){
		              return "F.Cu";
		          },
		          getName:function(){
		              return "FCu";
		          },
		          getLayerMaskID:function(){
		              return Layer.LAYER_FRONT;
		          },
		          getColor:function(){
		              return 'red';
		          },
		          getBoardColor:function(){
		              return Layer.BOARD_COLOR_FRONT;
		          }				
			},
			BCu:{
	            toString:function(){
	                return "B.Cu";
	            },
	            getName:function(){
	                return "BCu";
	            },
	            getLayerMaskID:function(){
	                return Layer.LAYER_BACK;
	            },
	            getColor:function(){
	                return 'green';
	            },
	            getBoardColor:function(){
	                  return Layer.BOARD_COLOR_BACK;
	            },				
			},
			Cu:{
	            toString:function(){
	                return "Cu";
	            },
	            getName:function(){
	                return "Cu";
	            },
	            getLayerMaskID:function(){	                
	                return Layer.LAYER_FRONT | Layer.LAYER_BACK;
	            },
	            getColor:function(){
	            	return 'rgb(128,128,0)';
	            },
	            getBoardColor:function(){
	                  return Layer.BOARD_COLOR_BACK;
	            },				
			},			
	        FSilkS:{
		          toString:function(){
		              return "F.SilkS";
		          },
		          getName:function(){
		              return "FSilkS";
		          },
		          getLayerMaskID:function(){
		              return Layer.SILKSCREEN_LAYER_FRONT;
		          },
		          getColor:function(){
		              return 'cyan';
		          },
		          getBoardColor:function(){
		                return Layer.BOARD_COLOR_FRONT;
		          }
		        },
		    BSilkS:{
		          toString:function(){
		              return "B.SilkS";
		          },
		          getName:function(){
		              return "BSilkS";
		          },
		          getLayerMaskID:function(){
		              return Layer.SILKSCREEN_LAYER_BACK;
		          },
		          getColor:function(){
		              return 'magenta';
		          },
		          getBoardColor:function(){
		                return Layer.BOARD_COLOR_BACK;
		          }
		        }, 			
			All:{
	            toString:function(){
	                return "All";
	            },
	            getName:function(){
	                return "All";
	            },
	            getLayerMaskID:function(){
	                return Layer.LAYER_ALL;
	            },	            
	            getColor:function(){
	                return 'rgb(128,128,0)';
	            },
	            getBoardColor:function(){
	                  return 'black';
	            }
			},
			None:{
	            toString:function(){
	                return "None";
	            },
	            getName:function(){
	                return "None";
	            },
	            getLayerMaskID:function(){
	                return 0;
	            },
	            getColor:function(){
	                return 'gray';
	            },
	            getBoardColor:function(){
	                  return 'black';
	            }				
			},
	        resolve:function(layermask){
	            if(layermask==Layer.LAYER_FRONT){
	                return Layer.Copper.FCu;
	            }
	            if(layermask==Layer.SILKSCREEN_LAYER_FRONT){
	                return Layer.Copper.FSilkS;
	            }
	            if(layermask==Layer.LAYER_BACK){
	                return Layer.Copper.BCu;
	            }
	            if(layermask==Layer.SILKSCREEN_LAYER_BACK){
	                return Layer.Copper.BSilkS;
	            }	            
	            if(layermask==(Layer.LAYER_BACK|Layer.LAYER_FRONT)){
	                return Layer.Copper.Cu;
	            } 
	            if (layermask == Layer.LAYER_ALL) {
	                return Layer.Copper.All;
	            }else{
	                return Layer.Copper.None;
	            }	            	            
	        },
			valueOf:function(copper){
				switch(copper){
				case 'FCu': return this.FCu;
				case 'BCu': return this.BCu;
				case 'Cu': return this.Cu;
				case 'FSilkS':return this.FSilkS;
				case 'BSilkS':return this.BSilkS;
				case 'All': return this.All;
				case 'None': return this.None;
					default:
						throw  'Unknown copper text : '+copper;
				}
			}
		}
	};
})();

var isEventEnabled=true;

class CompositeLayer{
  constructor() {
	     this.compositelayer=Layer.LAYER_ALL;
	     this.activeSide=Layer.Side.TOP;
  }
isLayerVisible(mask) {
	     return (this.compositelayer & mask)!=0;          
  } 
getLayerMaskID() {
    return this.compositelayer;
}
setLayerVisible(mask,flag) {
    if(flag){
        this.compositelayer |= mask;     
    }else{
        this.compositelayer &= ~mask;
    }
}
	  
}

var AffineTransform=(function(){
	var x,y,a;
	return{
		createRotateInstance:function(originx,originy,angle){
			x=originx;
			y=originy;
			a=angle;
			return {
				originx:x,
				originy:y,
				angle:a,
				toString:function(){
				  return "x="+x+",y="+y+"angle="+a;	
				}
			};
		},
	}; 
})();

class ScalableTransformation{
  constructor(scaleFactor,minScaleFactor,maxScaleFactor) {
        this.Reset(scaleFactor,minScaleFactor,maxScaleFactor);
  }
  getScaleRatio(){
     return 0.5;  
   }
   
  getInverseScaleRatio(){
     return 2;  
  }
  getScaleFactor(){
     return this.scaleFactor;  
  }
  setScaleFactor(newScaleFactor){
    this.Reset(newScaleFactor,this.minScaleFactor,this.maxScaleFactor); 
  } 
  Reset(scaleFactor,minScaleFactor,maxScaleFactor){
        this.scaleFactor=scaleFactor;
        this.maxScaleFactor=maxScaleFactor;
        this.minScaleFactor=minScaleFactor;
        this.scale=this.calculateTransformation();
  }
  getScale(){
     return this.scale;
  }
  ScaleOut(){
        this.scaleFactor --;
        if (this.scaleFactor == this.minScaleFactor-1) {
                this.scaleFactor = this.minScaleFactor;
                return false;
        }
        
        this.scale=this.calculateTransformation();
        return true;
  }
  ScaleIn(){
            this.scaleFactor++ ;
            if (this.scaleFactor == this.maxScaleFactor) {
                this.scaleFactor = this.maxScaleFactor-1;
                return false;
            }            
            this.scale=this.calculateTransformation();
            return true;   
  }
  getInversePoint(x,y){
       let s=1.0;
       if(this.scaleFactor!=0){     
           for(i=0;i<this.scaleFactor;i++){
             s*=2;
           }
       }
	  return new d2.Point(x*s,y*s);
}
  getInverseRect(r){
       let s=1.0;
       if(this.scaleFactor!=0){     
           for(let i=0;i<this.scaleFactor;i++){
             s*=2;
           }
       }
	  return d2.Box.fromRect(r.x*s,r.y*s,r.width*s,r.height*s);
  }  
  calculateTransformation(){
       let x=1.0;
       if(this.scaleFactor!=0){     
           for(let i=0;i<this.scaleFactor;i++){
             x*=0.5;
           }
       }
       return x;
  }
}

class ViewportWindow{
	 constructor(x,y,width,height){
	   this.x=x;
	   this.y=y;
	   this.width=width;
	   this.height=height;
	 }
	 getX(){
	   return this.x;
	 }
	 getY(){
	   return this.y;
	 }
	 getWidth(){
	   return this.width;
	 }
	 getHeight(){
	   return this.height;
	 }
	 setSize(width,height){
	     this.width=width;
	     this.height=height;	 
	 }
	 scalein( xx, yy,scalableTransformation){ 
	    let a=this.x*scalableTransformation.getInverseScaleRatio();
		let b=this.y*scalableTransformation.getInverseScaleRatio();
	    this.x=parseInt(a)+xx;
	    this.y=parseInt(b)+yy;   
	 }
	 scaleout( xx, yy,scalableTransformation){ 
	    let a=(this.x-xx)*scalableTransformation.getScaleRatio();
		let b=(this.y-yy)*scalableTransformation.getScaleRatio();
	    this.x=parseInt(a);
	    this.y=parseInt(b); 
	 }
	 toString(){
	   return "{"+this.x+","+this.y+","+this.width+","+this.height+"}";
	 }
}

    //must be 10000 for printing
var MM_TO_COORD=function(mm){
      return Math.floor(mm*10000);
}
 
var COORD_TO_MM=function(coord){ 
	return (coord/10000);    
}
   
class Grid{
 constructor(value,units) {
   this.gridPointToPoint=0;
   this.pixelToPixelLimit=10;
   this.paintable=true;
   this.setGridUnits(value,units);
 }
 clone(){
	var copy=new Grid(this.value,this.units);
	return copy;
 }
getGridPointToPoint(){
     return this.gridPointToPoint;
}
getGridUnits(){
    return this.units;
}
setGridUnits(value,units){
     this.value=value;
     this.units=units;
     switch(units){
     case Units.MM:
         this.gridPointToPoint=MM_TO_COORD(value);
         break;
     case Units.INCH:
         throw  "BG is in EU -> stick to mm for now.";
     case Units.PIXEL:
         this.gridPointToPoint=value;        
     }          
}
setGridValue(value){
     this.setGridUnits(value,this.units);
}
getGridValue(){
    return this.value; 
} 
UNIT_TO_COORD(mm){
    switch(this.units){ 
      case Units.MM:
          return MM_TO_COORD(mm);
      case Units.INCH:
          throw  "BG is in EU -> stick to mm for now.";
      case Units.PIXEL:
          return mm;
    default:
        throw "Unknown/unsupported units.";
    }            
}
COORD_TO_UNIT(coord){
    switch(this.units){ 
      case Units.MM:
          return COORD_TO_MM(coord);
      case Units.INCH:
          throw  "BG is in EU -> stick to mm for now.";
      case Units.PIXEL:
          return coord;
    default:
        throw  "Unknown/unsupported units.";
    }            
  }
paint(g2,viewportWindow,scalableTransformation){
    
	if(this.paintable){
	 this.drawPoints(g2, viewportWindow, scalableTransformation);
    }
 }
 drawPoints(g2, viewportWindow, scalableTransformation){
   var w = 0, h = 0;
 
        //scale out the visible static rectangle to the real schema size to see which point fall in to be rendered.
        //scale back to origine
    let r=d2.Box.fromRect(parseInt(viewportWindow.x/scalableTransformation.getScale()),parseInt(viewportWindow.y/scalableTransformation.getScale()),parseInt(viewportWindow.getWidth()/scalableTransformation.getScale()),parseInt(viewportWindow.getHeight()/scalableTransformation.getScale()));

    
    let position=this.positionOnGrid(r.x,r.y);
	
	
	if(!this.isGridDrawable(position,scalableTransformation)){
        return;
    }
		
	let point=new d2.Point();  
	for (let h =position.y; h <= position.y+r.height; h += this.gridPointToPoint) {
            for (w =position.x; w <=position.x+r.width; w += this.gridPointToPoint) {
                 point.set(w, h); 
                 //let scaledPoint=point.clone();
                 point.scale(scalableTransformation.scale);
                	 
                 point.set(point.x-viewportWindow.x,point.y-viewportWindow.y);
                 //***no need to draw outside of visible rectangle
                 //if(point.x>viewportWindow.getWidth()||point.y>viewportWindow.getHeight()){                   
                 //  continue;  
                 //}   
                
				 
				 g2.beginPath();
				 g2.fillRect(point.x, point.y,2,2);
				 g2.fillStyle = 'white';
				 g2.fill();                                       
            }
	}
   
 }
isGridDrawable(point,scalableTransformation){
        let x=point.x*scalableTransformation.scale;    
	    let xx=(point.x+this.gridPointToPoint)*scalableTransformation.scale;
	    return  (parseInt(Math.round(xx-x)))>this.pixelToPixelLimit;
	    //var scaledPoint=point.getScaledPoint(scalableTransformation);  
        //var x=scaledPoint.x;
        //point.x=point.x+this.gridPointToPoint;
        //scaledPoint=point.getScaledPoint(scalableTransformation);
        //return  (parseInt(Math.round(scaledPoint.x-x)))>this.pixelToPixelLimit;    
    }
positionOnGrid( x,  y) {        
        let ftmp     =  x / this.gridPointToPoint;
        let xx = ( parseInt( Math.round( ftmp )) ) * this.gridPointToPoint;

        ftmp     = y / this.gridPointToPoint;
        let yy = ( parseInt( Math.round( ftmp )) ) * this.gridPointToPoint;
        return new d2.Point(xx,yy);        
    } 
lengthOnGrid(length){
        let  ftmp     =  length / this.gridPointToPoint;
        let xx = ( parseInt(Math.round( ftmp ) )) * this.gridPointToPoint;        
        return xx;	
}
snapToGrid(p){        
   p.set(this.lengthOnGrid(p.x), this.lengthOnGrid(p.y));
} 
}

class ChipText{
constructor() {
	   this.text=[];
	 }
clone(){
    var copy =new ChipText();                                                                
    this.text.forEach(function(texture){
           copy.Add(texture.clone()); 
     });       
    return copy;	
}	 
Add(texture){
	  this.text.push(texture);	 
	 }
Move( xoffset,  yoffset) {
	  this.text.forEach(function(texture){
	     texture.Move(xoffset,yoffset); 
	   });         
	 }	
Mirror( A, B) {
	  this.text.forEach(function(texture){
		 texture.Mirror(A,B); 
	  });         
}
setRotation(alpha,pt){
	  this.text.forEach(function(texture){
			 texture.setRotation(alpha,pt); 
		  }); 	
}
Rotate(rotate,pt) {
		  this.text.forEach(function(texture){
		     texture.Rotate(rotate,pt); 
		   });         
		 }		 
paint( g2,  viewportWindow,  scale) {
	  this.text.forEach(function(texture){
		  texture.paint(g2,viewportWindow,scale); 
	   }); 
	  }
setLocation( x,  y) {
	  this.text.forEach(function(texture){
		  texture.setLocation(x,y); 
	   });
}
getTextureByTag(tag){
	 var _texture=null; 
	 this.text.some(function(texture){
	        if(texture.tag==tag){
	           _texture= texture;
	           return true;
	        }
            return false;			
	      });
    return _texture;         
}
getClickedTexture( x,  y) { 
    var _texture=null; 
	this.text.some(function(texture){
       if(texture.isClicked(x, y)){
    	   _texture= texture;
            return true;
       }
	   return false;
       
    });
	 return _texture;  
}
get(index){
 return this.text[index];	
}
isClicked( x,  y) {
	var result=false;
	this.text.some(function(texture){
       if(texture.isClicked(x, y)){
            result= true;
            return true;
       }   
       return false;
    });
    return result;
}
getBoundingRect() {
    //***sum up rectangles
    var r=null;
    var x1=Number.MAX_VALUE,y1=Number.MAX_VALUE,x2=0,y2=0;
    
    this.text.forEach(function(texture){
        var tmp=texture.getBoundingRect();
        if(tmp!=null){
            x1=Math.min(x1,tmp.x);
            y1=Math.min(y1,tmp.y);
            x2=Math.max(x2,tmp.x+tmp.width);
            y2=Math.max(y2,tmp.y+tmp.height);                   
            if(r==null){
              r=new Rectangle();  
            }
        } 
    });
    
    if(r!=null){
      r.setRect(x1,y1,x2-x1,y2-y1);
    }
    return r;
}
setSelected(isSelected) {
	 this.text.forEach(function(texture){
		 texture.selection=isSelected; 	 
	 });
}
isSelected() {
    return (this.text.length>0)&&this.text[0].isSelected();
}
Clear() {
	 this.text.forEach(function(texture){
		 texture=null;	 
	 });
    
    this.text.length = 0;
    this.text=[];
}
}




 
class UnitFrame{
constructor(width,height) {
	      this.rectangle=new d2.Box(0,0,0,0);
	      this.offset=0;
	      this.setSize(width,height);   
}
setSize(width,height) {
    this.width=width;
    this.height=height;
    this.rectangle.setRect(this.offset,this.offset,this.width-(2*this.offset),this.height-(2*this.offset));
 }	  
 
paint(g2, viewportWindow, scale) {
	  var rect=this.rectangle.clone();	  
	  rect.scale(scale.scale);
	  
      if(!rect.intersects(viewportWindow)){
      	  return;   
      }
      g2.beginPath();
      g2.lineWidth="1";
      g2.strokeStyle = "white";
      g2.rect(rect.x-viewportWindow.x, rect.y-viewportWindow.y, rect.width, rect.height);      
      g2.stroke(); 
}
setOffset(offset) {
    this.offset=offset;
    this.rectangle.setRect(this.offset,this.offset,this.width-(2*this.offset),this.height-(2*this.offset));
 }
getOffset(){
   return this.offset;    
 }	  
}


//-----------------------UnitSelectionCell---------
var UnitSelectionCell = function (uuid,x, y,width,height,name) {
	 return {
	       x: x-20,
	       y: y-20,
	       width:width+(2*20),
	       height:height+(2*20),
	       name:name,
	       selected:false,
	       uuid:uuid
	 };
}

//------------------------UnitSelectionGrid--------
var UnitSelectionGrid = Backbone.Model.extend({
	initialize: function(){
    this.model=null;
    this.cells=[];
  },
setModel:function(model){
		this.model=model;
	},
getModel:function(model){
		return	this.model;
},
release:function(){
	this.cells=[];
	if(this.model!=null){
	   this.model.clear();
	}   
	this.model=null;
},

build:function(){
	 var width=300;
	 for(let unit of this.model.getUnits()){
	     //hide grid
		 unit.getGrid().paintable=false;
		 //hide frame
		 unit.frame=null;
		 //make it smaller
		 unit.scalableTransformation=new ScalableTransformation(10,4,13);
	     var w=Math.round(unit.getBoundingRect().width*unit.scalableTransformation.getScale());
		 width=Math.max(width,w);
       
	  }
	 for(let unit of this.model.getUnits()){     
		 var r=unit.getBoundingRect();
		 var x=Math.round(r.x*unit.scalableTransformation.getScale());
		 var y=Math.round(r.y*unit.scalableTransformation.getScale());
         var height=Math.round(r.height*unit.getScalableTransformation().getScale());             
         var cell=UnitSelectionCell(unit.getUUID(),x,y,width,height,unit.unitName);
         cell.selected=( this.model.getUnit()==unit?true:false);
         this.cells.push(cell);        
	  }
	 
}

});

//------------------------UnitSelectionPanel-------
var UnitSelectionPanel=Backbone.View.extend({
	//el:"#unitselectionpanel",
	initialize: function(opt){		
	this.setElement('#'+opt.selectorid);
	this.unitSelectionGrid=new UnitSelectionGrid();
	this.canvasprefixid=opt.canvasprefixid;
    this.enabled=opt.enabled;
  },
  events: {
	  'click [type="checkbox"]': 'processClick',
  },
	
  processClick:function(event){
	  
	  var j$box = j$(event.currentTarget);
	  if (j$box.is(":checked")) {
	    // the name of the box is retrieved using the .attr() method
	    // as it is assumed and expected to be immutable
	    var group = "input:checkbox[name='" + j$box.attr("name") + "']";
	    // the checked state of the group/box on the other hand will change
	    // and the current value is retrieved using .prop() method
	    j$(group).prop("checked", false);
	    j$box.prop("checked", true);
	  } else {
	    j$box.prop("checked", true);
	  }
	  if(this.enabled){
		  this.unitSelectionGrid.getModel().setActiveUnitUUID(parseInt(j$box[0].id));
	  }
  },
  release:function(){
  	this.unitSelectionGrid.release();  
  	this.undelegateEvents();
  },
  repaint:function(){
  	if(this.unitSelectionGrid.model!=null){
  		var i=0;
		for(let unit of this.unitSelectionGrid.model.getUnits()){  	
  	        var cell=this.unitSelectionGrid.cells[i];
  			var canvas = j$('#'+this.canvasprefixid+(i++));
  	  	    var ctx = canvas[0].getContext("2d");
  	        ctx.fillStyle = "rgb(0,0,0)";
  	        ctx.fillRect(0, 0, cell.width, cell.height);  

  	        unit.paint(ctx,d2.Box.fromRect(cell.x,cell.y,cell.width,cell.height));                    	         
  		  };
  	}
  },
  render:function(){
		    	//create picker
		    var panel=""
		    if(this.unitSelectionGrid.model!=null){
		      for(i=0;i<this.unitSelectionGrid.cells.length;i++){
		    	var cell=this.unitSelectionGrid.cells[i];
		    	
		    	panel+="<div><canvas id=\""+this.canvasprefixid+i+"\" width=\""+cell.width+"px\" height=\""+cell.height+"px\">"+
		        "</canvas></div>"+
		        "<div><input type=checkbox name='cb' id='"+cell.uuid+"' style='vertical-align: -2px;margin-left:10px;margin-right:5px;' "+
		        (cell.selected?" checked ":(this.enabled?" ":" checked "))+
		        (this.enabled?'':'disabled')+"><label for='"+cell.uuid+"' style='color:white'>"+cell.name+"</label></div>";		       
			   }
		      }
			 j$(this.el).empty();
			 j$(this.el).append(
				"<div style=\"background-color:black\">"+panel+
				"</div>"				
		     );	
			 this.repaint();
			 this.delegateEvents();
	}
});


module.exports ={
	mywebpcb,	
	UUID,
	GridRaster,
	Fill,
	Units,
	ModeEnum,
	BOARD_LAYERS,PCB_SYMBOL_LAYERS,
	Layer,
	ScalableTransformation,
	ViewportWindow,
	Grid,	
	ChipText,
	UnitFrame,
	AffineTransform,
    MM_TO_COORD,
    COORD_TO_MM,
	UnitSelectionPanel,
	CompositeLayer,
	isEventEnabled
}

var events=require('core/events');
var utilities=require('core/utilities');
var font = require('core/text/d2font');
});

require.register("core/events.js", function(exports, require, module) {
var core = require('core/core');
var d2=require('d2/d2');

Event={
	    SELECT_SHAPE:1,
	    DELETE_SHAPE:2,
	    RENAME_SHAPE:3,
	    ADD_SHAPE:4,
	    PROPERTY_CHANGE:5,
	    ADD_UNIT:6,
	    DELETE_UNIT:7,
	    SELECT_UNIT:8,  
	    RENAME_UNIT:9,
	    SELECT_CONTAINER:10,
	    RENAME_CONTAINER:11,
	    DELETE_CONTAINER:12
};

class EventHandle{
	 constructor(component) {
	     this.component=component;
	     this.mx=0;
		 this.mx=0;
		 this.target=null;
	 }	
	 Attach(){
	     this.ctrlButtonPress = false;
	     this.mx=0;
	     this.my=0;  	     
	 }
	 dblClick(){
 
	 }
	 keyPressed(event){
		 //default
		 if(this.component.popup.isOpen()){
			this.component.popup.close(); 
			return; 
		 }
		 if (this.component.getModel().getUnit() != null) { 
			 if (event.keyCode == 8) { //BACKSPACE
				 this.component.getModel().getUnit().getSelectedShapes().forEach(function(shape) {
					 this.component.getModel().getUnit().remove(shape.getUUID());	
		           }.bind(this));  
				 this.component.Repaint();
			 }
			 if (this.component.getEventMgr().getTargetEventHandle() != null&&event.keyCode==27) {	
			   this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		       this.component.setMode(core.ModeEnum.COMPONENT_MODE);       
		     } 
		 }		 
	 }
	 setTarget(target){
       this.target=target;
	 }
	 Clear(){
		 
	 }
	 Detach(){
	   this.Clear();
	 }
isRightMouseButton(e){	 
	  return e.which!=1
}
}

class MoveEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 mousePressed(event){	
	    this.component.getModel().getUnit().setSelected(false);
	    this.target.setSelected(true);
		this.component.Repaint();
		if(super.isRightMouseButton(event)){
            if (this.target["getLinePoints"]!=undefined){
            	this.component.popup.registerLineSelectPopup(this.target,event);
            }else if(this.target["getPinsRect"]!=undefined){
            	this.component.popup.registerPadPopup(this.target,event);
            }
            else{
                this.component.popup.registerShapePopup(this.target,event);
                
            }
            return;
        }
	    
	    this.mx=event.x;
		this.my=event.y;
	 }
	 mouseReleased(event){
		if(super.isRightMouseButton(event)){
			 return;
		}
		this.target.alignToGrid(false || this.component.getParameter("snaptogrid"));
				 
		this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
		this.component.Repaint();
	 }
	 
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
			 return;
		} 
	 	let new_mx = event.x;
	    let new_my = event.y;
		
	    this.target.Move(new_mx - this.mx, new_my - this.my);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();
	 }
	 mouseMove(event){
	 
	 }	 
}

class ResizeEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.targetPoint=null;
	 }
	 mousePressed(event){
		if(super.isRightMouseButton(event)){
	            if (this.target["getLinePoints"]!=undefined){
	            	this.component.popup.registerLineSelectPopup(this.target,event);            
	            }            
	    }
	     
	    this.component.getModel().getUnit().setSelected(false);
	    this.target.setSelected(true);
		this.mx=event.x;
		this.my=event.y;
	        
	    this.targetPoint=this.target.isControlRectClicked(event.x,event.y);
	    this.target.setResizingPoint(this.targetPoint);
	    
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    
		this.component.Repaint();
	 }
	 mouseReleased(event){
		    if(this.component.getParameter("snaptogrid")){
	         this.target.alignResizingPointToGrid(this.targetPoint);
		     this.component.Repaint();	 
			}
			
	 }
	 mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
	    this.target.Resize(new_mx - this.mx, new_my - this.my,this.targetPoint);
	    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();
	 }
	 mouseMove(event){
	 
	 }
	 
}
class DragingEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
mousePressed(event){
   this.mx = event.windowx;
   this.my = event.windowy;
   
		 }
mouseReleased(event){

		 }
mouseDragged(event){
   var newX =this.component.viewportWindow.x- (event.windowx - this.mx);
   var newY =this.component.viewportWindow.y- (event.windowy - this.my);        
    

   this.component.viewportWindow.x=newX;
   this.component.viewportWindow.y=newY;
   
   this.component.hbar.jqxScrollBar('setPosition',newX); 
   this.component.vbar.jqxScrollBar('setPosition',newY);
   
   this.mx = event.windowx;
   this.my = event.windowy;
   this.component.Repaint();  
		 }
mouseMove(event){
		 
		 }	 
}

class UnitEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectionBox=new d2.Box(0,0,0,0);
	 }
	 Attach(){
		 super.Attach();
	     this.selectionBox.setRect(0,0,0,0);
	 }
	 mousePressed(event){
		this.component.getModel().getUnit().setSelected(false);
		this.component.Repaint();
			
		if(super.isRightMouseButton(event)){
			this.component.popup.registerUnitPopup(this.target,event);
			//this.component.popup.open(event.data.originalEvent.clientX,event.data.originalEvent.clientY);		
			return;
		} 
		this.mx=event.windowx;
		this.my=event.windowy;
	 }
	 mouseReleased(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
		 this.selectionBox.move(this.component.viewportWindow.x,this.component.viewportWindow.y);
		 this.component.getModel().getUnit().setSelectedInRect(this.component.getModel().getUnit().getScalableTransformation().getInverseRect(this.selectionBox));
	     this.component.Repaint();
	 }
	 mouseDragged(event){
		 if(super.isRightMouseButton(event)){
			 return;
		 }
	 	  let w = event.windowx-this.mx;
	      let h = event.windowy-this.my;
		
		  let x=this.mx - (w < 0 ? Math.abs(w) : 0);
		  let y=this.my - (h < 0 ? Math.abs(h) : 0);
		
	      this.selectionBox.setRect(x,y,Math.abs(w),Math.abs(h));	
	      this.component.Repaint();
		  
		  this.component.ctx.globalCompositeOperation='lighter';
	      this.component.ctx.beginPath();
	      this.component.ctx.rect(this.selectionBox.x,this.selectionBox.y,this.selectionBox.width,this.selectionBox.height);
	      this.component.ctx.fillStyle = 'gray';
	      this.component.ctx.fill();
	      this.component.ctx.lineWidth = 1;
	      this.component.ctx.strokeStyle = '#5B5B5B';
	      this.component.ctx.stroke();
		  this.component.ctx.globalCompositeOperation='source-over';
	 }
	 mouseMove(event){

	 }	 
}

class OriginEventHandle extends EventHandle{
constructor(component) {
		super(component);		
	}
Attach(){
		 super.Attach();
		 this.component.getModel().getUnit().coordinateSystem.reset(0,0);  
	 }
mousePressed(event){
	     this.component.getModel().getUnit().getCoordinateSystem().reset(event.x,event.y); 
	     this.mx = event.x;
	     this.my = event.y; 
	     this.component.getModel().getUnit().setSelected(false);	     
		 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		 
	 }
mouseReleased(event){
	if (event.which == 3) {
      //this.component.getModel().getUnit().coordinateSystem=null;   		 			   	
	}else{
	   this.component.getModel().getUnit().getCoordinateSystem().alignToGrid(false || this.component.getParameter("snaptogrid")); 
	}
	this.component.setMode(core.ModeEnum.COMPONENT_MODE);	 
}
mouseDragged(event){
		 this.mouseMove(event);
		 }
mouseMove(event){
	        let new_mx = event.x;
	        let new_my = event.y;
	       
	        this.component.getModel().getUnit().getCoordinateSystem().Move((new_mx - this.mx), (new_my - this.my));
	        this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:Event.PROPERTY_CHANGE});

	        this.mx = new_mx;
	        this.my = new_my;     
	        this.component.Repaint();   		 
		 }

}

class CursorEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
	 }
	 Attach(){
		 super.Attach();
		    this.mx = this.target.getCenter().x;
		    this.my = this.target.getCenter().y;
	 }	 
	 mousePressed(event){
		 if(event.which==3){
			 this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
	         this.component.setMode(core.ModeEnum.COMPONENT_MODE);  
			 return;
		 }
	     var shape = this.target.clone();	            
	         this.component.getModel().getUnit().add(shape);       
	         this.component.getModel().getUnit().setSelected(false);
	         shape.setSelected(true);
	         shape.alignToGrid();
	         this.component.getModel().getUnit().fireShapeEvent({target:shape,type:Event.SELECT_SHAPE});
	         this.component.Repaint();	            
	 }
	 mouseReleased(event){

	 }
	 mouseDragged(event){

	 }
	 mouseMove(event){		    
		 	let new_mx = event.x;
		    let   new_my = event.y;
		    
			
		    this.target.Move(new_mx - this.mx, new_my - this.my);

		    this.mx = new_mx;
		    this.my = new_my;
			this.component.Repaint(); 
	 }
}

class BlockEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.selectedShapes=[];
	 }
	 Attach(){
		 super.Attach();
	     this.selectedShapes = this.component.getModel().getUnit().getSelectedShapes(false);
	 }
	 Detach(){
	     this.selectedShapes=null;
	     super.Detach();
	 }
	 mousePressed(event){
		if(super.isRightMouseButton(event)){
		   this.component.popup.registerBlockPopup(this.target,event);					
		   return;
		}   
		if(event.data.ctrlKey){
		  this.component.getModel().getUnit().setSelectedShape(this.target.uuid,
	                   !this.target.isSelected());
	      this.ctrlButtonPress = true;
	      this.component.Repaint();
	      return;		   
		}		
		this.mx=event.x;
		this.my=event.y;
	 }
	 mouseReleased(event){
		if(super.isRightMouseButton(event)){
		  return;
		}
		UnitMgr.getInstance().alignBlock(this.component.getModel().getUnit().grid, this.selectedShapes);
		this.component.Repaint();
	 }
	 mouseDragged(event){
		if(super.isRightMouseButton(event)){
		  return;	 
		}
		let new_mx = event.x;
	    let new_my = event.y;
		
	    UnitMgr.getInstance().moveBlock(this.selectedShapes,new_mx - this.mx, new_my - this.my);
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();
	   
	 }
	 mouseMove(event){
	 
	 }
}

class TextureEventHandle extends EventHandle{
	 constructor(component) {
		 super(component);
		 this.texture=null;
	 }
Clear() {
	 this.texture=null;
}
mousePressed(event){
   this.component.getModel().getUnit().setSelected(false);
   this.target.setSelected(true);
	this.mx=event.x;
	this.my=event.y;

	this.texture= this.target.getChipText().getClickedTexture(event.x,event.y);  
	this.component.Repaint();
	
}
mouseReleased(event){

}
mouseDragged(event){
	 	let new_mx = event.x;
	    let new_my = event.y;
		
		this.texture.Move(new_mx - this.mx, new_my - this.my);
		this.target.owningUnit.fireShapeEvent({target:this.target,type: Event.PROPERTY_CHANGE});
		
	    this.mx = new_mx;
	    this.my = new_my;
		this.component.Repaint();       
}
mouseMove(event){

}
}

class MeasureEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
Attach(){
	 super.Attach();
}	 
Detach() {
    this.component.getModel().getUnit().ruler.resizingPoint=null;
    super.Detach();
}
mouseReleased(e){

}
mouseDragged(e){
}
mousePressed(e) {        
        this.component.getModel().getUnit().ruler.resizingPoint=new d2.Point(e.x,e.y);
        this.mx = e.x;
        this.my = e.y;
}
mouseMove(e) {
        let new_mx = e.x;
        let new_my = e.y;
        this.component.getModel().getUnit().ruler.Resize(new_mx - this.mx, new_my - this.my);
        // update our data
        this.mx = new_mx;
        this.my = new_my;
        
        this.component.Repaint();
    }	
}

class MouseScaledEvent{
 constructor(x,y,basePoint,originalEvent) {
   this.windowx=x;
   this.windowy=y;
   this.x=basePoint.x;
   this.y=basePoint.y;
   this.which=originalEvent.which;
   this.data=originalEvent;
 }
 toString(){
   return    "base x="+this.x+
             "; base y="+this.y+
			 "; window x="+this.windowx+
			 "; window y="+this.windowy+
			 "; which="+this.which; 
 }
}

 
module.exports ={
   Event,
   MouseScaledEvent,
   TextureEventHandle,
   BlockEventHandle,
   CursorEventHandle,
   OriginEventHandle,
   UnitEventHandle,
   DragingEventHandle,
   MoveEventHandle,
   ResizeEventHandle,
   EventHandle,
   MeasureEventHandle
}
var UnitMgr = require('core/unit').UnitMgr;

});

require.register("core/models/togglebutton.js", function(exports, require, module) {


/*
 * ToggleButton model on the UI
 */
var ToggleButtonModel=Backbone.Model.extend({
	defaults: {
	  active:false,
      id:'unkown',
      group:''
	},
    update:function(){
       if(this.attributes.active){	
         j$('#'+this.id).addClass("active");
       }else{
    	 j$('#'+this.id).removeClass("active");  
       }
    },	
	setActive:function(active){
		this.attributes.active=active;
		this.update();
	},
    isActive:function(){
    	return this.attributes.active;
    }
});

/*
* Button Collection
*/
var ToggleButtonCollection=Backbone.Collection.extend({
	model: ToggleButtonModel
});

module.exports ={
	ToggleButtonCollection,
	ToggleButtonModel
}
});

;require.register("core/popup/contextmenu.js", function(exports, require, module) {
var core=require('core/core');
var UnitMgr = require('core/unit').UnitMgr;
var d2=require('d2/d2');

class ContextMenu{
constructor(component,placeholderid){
	this.component=component;
	this.placeholder = document.getElementById(placeholderid);	
	this.content="";
	this.x=this.y=0;
	this.opened = false;	
}
registerShapePopup(target,event){
var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
  items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
  items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
  items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
  items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
  items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
  items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
  items+="</table></div>";
  this.setContent(items,{target:target});	
  this.open(event);	
}
registerLineSelectPopup(target,event){
	  let bending=target.isBendingPointClicked(event.x,event.y);
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='cloneid' ><td style='padding: 0.4em;'>Clone</td></tr>";
	    if(bending!=null){
	      if(target.isEndPoint(event.x,event.y)){	
	        items+="<tr id='resumeid'><td style='padding: 0.4em;'>Resume</td></tr>";
	      }
	    }else{
	    	items+="<tr id='addbendingpointid'><td style='padding: 0.4em;'>Add Bending point</td></tr>";	
	    }
	    
	    if(bending!=null){
	      items+="<tr id='deletebendingpointid'><td style='padding: 0.4em'>Delete Bending point</td></tr>";
	    }
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
	    this.open(event);	
}
open(event){ 
	this.x=event.x;
	this.y=event.y;
    this.placeholder.style.left=event.data.originalEvent.offsetX+"px";
    this.placeholder.style.top=event.data.originalEvent.offsetY+"px";
    this.show();				  
}
show(){
    if (!this.opened) {
	   this.placeholder.className = "visible";
	}    
	this.opened = true;		  		  
}
close() {
	
	j$(this.placeholder).removeClass("visible");
	j$(this.placeholder).empty();
    this.opened = false;  
}
isOpen(){
	return this.opened;
}
setContent(content,context) {
    this.placeholder.innerHTML ="<div class='content'>" + content + "</div>";
    //attach event listeners
    this.attachEventListeners(context);
}	

attachEventListeners(context){
	
}

actionPerformed(id,context){
	 if (id=="resumeid") {
	        this.component.getView().setButtonGroup(core.ModeEnum.LINE_MODE);
	        this.component.setMode(core.ModeEnum.LINE_MODE);         
	        this.component.resumeLine(context.target,"line", {x:this.x, y:this.y,which:3});
	 } 
	 if(id=='cancelid') {
		   this.component.getEventMgr().resetEventHandle();
		   context.target.setSelected(false);
		   this.component.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
	       this.component.setMode(core.ModeEnum.COMPONENT_MODE); 
	       this.component.Repaint();
	 }
     if (id=="addbendingpointid") {
    	 let line=context.target;
         line.insertPoint(this.x, this.y);
         
         this.component.Repaint();
         return;
    }	 
     if(id=='deletelastpointid') {
        let line=context.target;
        line.deleteLastPoint();

        if (line.points.length == 1) {
            //getUnitComponent().getModel().getUnit().registerMemento(getTarget().getState(MementoType.DELETE_MEMENTO));
            this.component.getEventMgr().resetEventHandle();
            this.component.getModel().getUnit().remove(line.uuid);
        }

         this.component.Repaint();
         return;
     }
     if(id=='deletebendingpointid'){
    	 let line=context.target;
    	 line.removePoint(this.x,this.y);
         //***delete wire if one point remains only
         if (line.getLinePoints().length == 1) {
        	 this.component.getEventMgr().resetEventHandle();
        	 this.component.getModel().getUnit().remove(line.uuid);
         }
         this.component.Repaint();
         return;
     }
     if (id=="deletelineid") {
    	 let line=context.target;
         //this.component.getModel().getUnit().registerMemento(getTarget().getState(MementoType.DELETE_MEMENTO));
         this.component.getEventMgr().resetEventHandle();
         this.component.getModel().getUnit().remove(line.uuid);
         this.component.Repaint();                    
   } 
	 if(id=='topbottomid'||id=='leftrightid'){
         let shapes= this.component.getModel().getUnit().getSelectedShapes(false);         
         if(shapes.length==0){
             return; 
         }
         
         let r=this.component.getModel().getUnit().getShapesRect(shapes);       
         let unitMgr = UnitMgr.getInstance();
         let p=this.component.getModel().getUnit().grid.positionOnGrid(r.center.x,r.center.y); 
         if(id=='topbottomid'){
             unitMgr.mirrorBlock(shapes,new d2.Line(new d2.Point(p.x-10,p.y),new d2.Point(p.x+10,p.y)));
         }else{
             unitMgr.mirrorBlock(shapes,new d2.Line(new d2.Point(p.x,p.y-10),new d2.Point(p.x,p.y+10)));
         }         
         unitMgr.alignBlock(this.component.getModel().getUnit().grid,shapes);
         this.component.Repaint();		 
	 }	
	 if(id=='rotaterightid'||id=='rotateleftid'){
         let shapes= this.component.getModel().getUnit().getSelectedShapes(false);         
         if(shapes.length==0){
             return; 
         }
         
         let r=this.component.getModel().getUnit().getShapesRect(shapes);       
         let unitMgr = UnitMgr.getInstance();
         
         unitMgr.rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(id==("rotateleftid")?1:-1)*(90.0)));
         
         unitMgr.alignBlock(this.component.getModel().getUnit().grid,shapes);
         this.component.Repaint();		 
	 }
	 if(id=='positiontocenterid'){
	     let unit=this.component.getModel().getUnit();           
	     let rect =unit.getBoundingRect();
	    
	     let x=rect.center.x;
	     let y=rect.center.y;
	     
	     let unitMgr = UnitMgr.getInstance();
	     
	     unitMgr.moveBlock(unit.shapes, (unit.width/2)-x, (unit.height/2)-y);
	     unitMgr.alignBlock(unit.grid,unit.shapes);
	      
	     //scroll to center
	     this.component.setScrollPosition((unit.width/2), (unit.height/2));
	     this.component.Repaint();
	 }
	 if(id=='deleteunit'){
         this.component.getModel().delete(this.component.getModel().getUnit().getUUID());
         if (this.component.getModel().unitsmap.size> 0) {
        	 this.component.getModel().setActiveUnit(0);
        	 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:Event.SELECT_UNIT});
         }else{
        	 this.component.Clear();
        	 this.component.fireContainerEvent({target:null, type:Event.DELETE_CONTAINER});
         }
         this.component.Repaint();  
	 }
     if (id=='deleteid') {
    	 let unit=this.component.getModel().getUnit(); 
    	 let unitMgr = UnitMgr.getInstance();        
         unitMgr.deleteBlock(unit,unit.getSelectedShapes(false));
         this.component.Repaint();                     
     } 
	 if(id=='cloneid'){
		 let unit=this.component.getModel().getUnit();  
		 let unitMgr = UnitMgr.getInstance();
         unitMgr.cloneBlock(unit,unit.getSelectedShapes(true));
         let shapes= unit.getSelectedShapes(false); 
         let r=unit.getShapesRect(shapes);
         unitMgr.moveBlock(shapes,
                              r.width,r.height);
         unitMgr.alignBlock(unit.grid,shapes);
         
         this.component.Repaint();
         //***emit property event change
         if (shapes.length == 1) {            
	       unit.fireShapeEvent({target:shapes[0],type:Event.SELECT_SHAPE});
         }             
         return; 		 
	 }
	 if(id=='selectallid'){ 
	     this.component.getModel().getUnit().setSelected(true);
	     this.component.Repaint();  
	 }	
}
}

module.exports ={
		   ContextMenu
}
});

;require.register("core/shapes.js", function(exports, require, module) {
var core=require('core/core');
var utilities =require('core/utilities');
var d2=require('d2/d2');
var font = require('core/text/d2font');

class Shape{
	constructor(x, y, width, height, thickness,
			layermask) {
		this.owningUnit=null;
		this.uuid = core.UUID();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.thickness = thickness;
		this.selection = false;
		this.displayName = "noname";
		this.fill = Fill.EMPTY;
		this.fillColor;		 
		this.copper = core.Layer.Copper.resolve(layermask);
	}
getCenter(){
	return new d2.Point(this.x,this.y);
}	
setDisplayName(displayName) {
		this.displayName = displayName;
	}
clear() {
    this.owningUnit=null;
	}
clone() {
	copy=new Shape(this.x,this.y,this.width,this.height,this.layermask);
	copy.fill=this.fill;	
	return copy;
	}
alignToGrid(isRequired) {
        let point=this.owningUnit.getGrid().positionOnGrid(this.getX(), this.getY());
        this.setX(point.x);
        this.setY(point.y);      
        return null;
}
setX(x) {
		this.x = x;
	}
getX() {
		return this.x;
	}
setY(y) {
		this.y = y;
	}
getY() {
		return this.y;
	}
setWidth(width) {
		this.width = width;
	}
getWidth() {
		return this.width;
	}
setHeight (height) {
		this.height = height;
	}
getHeight() {
		return this.height;
	}
getDrawingOrder() {
    return 100;
}
getOrderWeight() {
		return (this.getWidth() * this.getHeight());
	}
getUUID() {
		return this.uuid;
	}
calculateShape() {

	}
isVisibleOnLayers(layermasks){
    if((this.copper.getLayerMaskID()&layermasks)!=0){
        return true;
    }else{
        return false;
    }
}
isInRect(r){
	let rect=this.getBoundingShape();
        if(r.contains(rect.center))
            return true;
           else
            return false; 		
	}
isClicked(x,y) {
        let r=this.getBoundingShape();
        if(r.contains(x,y))
         return true;
        else
         return false;           
    }
getBoundingShape() {
	return this.calculateShape();
	}
setSelected (selection) {
		this.selection = selection;
	}
isSelected() {
		return this.selection;
	}

Move(xoffset,yoffset) {
      this.setX(this.getX() + xoffset);
      this.setY(this.getY() + yoffset);    
}

Mirror(line) {

}
    

Rotate(rotation) {
		let point = new Point(this.getX(), this.getY());
		point = utilities.rotate(point, rotation.originx,rotation.originy, rotation.angle);
	
        this.x=(point.x);
        this.y=(point.y);
}	
fromXML(data) {

	}

} 

/**********************Ruler**********************************/
class Ruler extends Shape{
constructor () {
	super(0, 0, 0, 0, 0, 0);
    this.text=new font.FontTexture('label','',0,0,core.MM_TO_COORD(1),0);
    this.text.constSize=true;
    this.text.fillColor='white';        
	this.resizingPoint=null;
}
Resize( xOffset, yOffset) {
    this.resizingPoint.set(this.resizingPoint.x+xOffset,this.resizingPoint.y+yOffset);
    this.text.shape.anchorPoint.set(this.resizingPoint.x, this.resizingPoint.y);
}	
paint( g2,  viewportWindow,  scale) {        
		if(this.resizingPoint==null){
            return;
        }
        this.text.setText(parseFloat(core.COORD_TO_MM(this.resizingPoint.distanceTo(new d2.Point(this.x,this.y)))).toFixed(4)+' MM');
                
        this.text.paint(g2, viewportWindow, scale);
        let line=new d2.Segment(this.x,this.y,this.resizingPoint.x,this.resizingPoint.y);

        g2.strokeStyle  = 'white';
		g2.lineWidth=1; 
        
        line.scale(scale.getScale());
        line.move(-viewportWindow.x,-viewportWindow.y);
        line.paint(g2);
		
    }	
}
/**********************Coordinate System**********************************/
class CoordinateSystem extends Shape {
	constructor (owningUnit) {
		super(0, 0, 0, 0, 0, 0);
		this.owningUnit=owningUnit;
        this.selectionRectWidth=3000;		
	}
alignToGrid(isRequired) {
    if(isRequired){
           return super.alignToGrid(isRequired);
    }else{
          return null;
    }
}
calculateShape() {
    return d2.Box.fromRect(this.x-this.selectionRectWidth/2,this.y-this.selectionRectWidth/2,this.selectionRectWidth,this.selectionRectWidth);
}
reset(x, y) {
		if (x < 0) {
			x = 0;
		} else if (x > this.owningUnit.getWidth()) {
			x = this.owningUnit.getWidth();
		}
		if (y < 0) {
			y = 0;
		} else if (y > this.owningUnit.getWidth()) {
			y = this.owningUnit.getWidth();
		}
		this.x=x;
		this.y=y;
}

paint(g2, viewportWindow, scale) {
		var line = new d2.Segment(0,0,0,0);		

		g2.strokeStyle  = 'blue';
		g2.lineWidth=1; 
	

		line.set(0, this.y, this.owningUnit.getWidth(),
				this.y);
		line.scale(scale.getScale());
		line.move(-viewportWindow.x,- viewportWindow.y);
	    line.paint(g2);
	    
	
		line.set(this.x, 0, this.x, this.owningUnit.getHeight());
		line.scale(scale.getScale());
		line.move(-viewportWindow.x,- viewportWindow.y);		
		line.paint(g2);
	}
}
class AbstractLine extends Shape{
	constructor(thickness,layermaskId) {
		super(0, 0, 0, 0, thickness,layermaskId);
		this.selectionRectWidth = 3000;
		this.setDisplayName("Line");			
		this.polyline=new d2.Polyline();
		this.floatingStartPoint = new d2.Point(); // ***the
																			// last
																			// wire
																			// point
		this.floatingMidPoint = new d2.Point(); // ***mid
																		// 90
																		// degree
																		// forming
		this.floatingEndPoint = new d2.Point();
		this.rotate=0;
		
}
getLinePoints(){
		return this.polyline.points;
	}
Clear(){
		this.polyline.points=null;		
	}
alignResizingPointToGrid(targetPoint) {
    this.owningUnit.grid.snapToGrid(targetPoint);         
}
isClicked(x, y) {
	  var result = false;
		// build testing rect
	  var rect = d2.Box.fromRect(x
								- (this.thickness / 2), y
								- (this.thickness / 2), this.thickness,
								this.thickness);
	  var r1 = rect.min;
	  var r2 = rect.max;

	  // ***make lines and iterate one by one
	  var prevPoint = this.polyline.points[0];

	  this.polyline.points.some(function(wirePoint) {
							// skip first point
							{
								if (utilities.intersectLineRectangle(
										prevPoint, wirePoint, r1, r2)) {
									result = true;
									return true;
								}
								prevPoint = wirePoint;
							}

						});

	return result;
}
addPoint(point) {
    this.polyline.add(point);
}
resetToPoint(point) {
	this.floatingStartPoint.set(point);
	this.floatingMidPoint.set(point);
	this.floatingEndPoint.set(point);
}
reset() {
	this.resetToPoint(this.floatingStartPoint);
}
reverse(x,y) {
    let p=this.isBendingPointClicked(x, y);
    if (this.points[0].x == p.x &&
        this.points[0].y == p.y) {
    	this.points.reverse(); 
    }       
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
shiftFloatingPoints(){
    this.floatingStartPoint.set(this.polyline.points[this.polyline.points.length-1].x, this.polyline.points[this.polyline.points.length-1].y);
    this.floatingMidPoint.set(this.floatingEndPoint.x, this.floatingEndPoint.y); 	
}
insertPoint( x, y) {
    
    let flag = false;
    let point = this.owningUnit.grid.positionOnGrid(x, y);

    var rect = new core.Rectangle(x - this.owningUnit.grid.getGridPointToPoint(),
                      y - this.owningUnit.grid.getGridPointToPoint() ,
                      2*this.owningUnit.grid.getGridPointToPoint(),
                      2*this.owningUnit.grid.getGridPointToPoint());

    let line = new core.Line();


    let tmp = new core.Point(point.x, point.y);
    let midium = new core.Point();

    //***add point to the end;
    this.points.push(point);

    let prev = this.points[0];
    this.points.forEach(function(next){
        if(prev!=next){
    	 if (!flag) {
            //***find where the point is - 2 points between the new one
            line.setLine(prev.x,prev.y, next.x,next.y);
            if (line.intersectRect(rect))
                flag = true;
         } else {
            midium.setLocationPoint(tmp); //midium.setPin(tmp.getPin());
            tmp.setLocationPoint(prev); //tmp.setPin(prev.getPin());
            prev.setLocationPoint(midium); //prev.setPin(midium.getPin());
         }
        }
        prev = next;
    });
    if (flag)
        prev.setLocationPoint(tmp); //prev.setPin(tmp.getPin());
}
removePoint(x, y) {
    let point = this.isBendingPointClicked(x, y);
    if (point != null) {
    	
    	var tempArr = this.points.filter(function(item) { 
    	    return item !== point;
    	});
        
    	this.points=tempArr;
    }
}
deleteLastPoint() {
	if (this.points.length == 0)
		return;

	this.points.pop();

						// ***reset floating start point
	if (this.points.length > 0)
					this.floatingStartPoint
									.setLocation(this.points[this.points.length - 1]);
}
isEndPoint(x,y){
    if (this.points.length< 2) {
        return false;
    }

    let point = this.isBendingPointClicked(x, y);
    if (point == null) {
        return false;
    }
    //***head point
    if (this.points[0].x == point.x && this.points[0].y == point.y) {
        return true;
    }
    //***tail point
    if ((this.points[this.points.length - 1].x == point.x )&& (this.points[this.points.length - 1].y == point.y)) {
        return true;
    }
    return false;	
}
isInRect(r) {
	var result = true;
	this.polyline.points.some(function(wirePoint) {
			if (!r.contains(wirePoint)) {
				result = false;
				return true;
			}else{
			  return false;
			}
	});
	return result;
}
setSelected(selection) {
     super.setSelected(selection);
     if (!selection) {
        this.resizingPoint = null;
     }
}
isBendingPointClicked( x,  y) {
	var rect = new core.Rectangle(x
			- this.selectionRectWidth / 2, y - this.selectionRectWidth
			/ 2, this.selectionRectWidth, this.selectionRectWidth);

    let point = null;

	this.points.some(function(wirePoint) {
		if (rect.contains(wirePoint.x, wirePoint.y)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polyline.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}

Move(xoffset, yoffset) {
	this.polyline.move(xoffset,yoffset);
}
Mirror(line) {
    this.polyline.mirror(line);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	let box=this.polyline.box;
	if(center==undefined){
		this.polyline.rotate(alpha,box.center);
	}else{
		this.polyline.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
Rotate(rotation) {
	//fix angle
	let alpha=this.rotate+rotation.angle;
	if(alpha>=360){
	  alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotate=alpha;	
	this.polyline.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
calculateShape() {
	return this.polyline.box;
}


drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.polyline.points);	
}
isFloating() {
	return (!(this.floatingStartPoint
								.equals(this.floatingEndPoint) && this.floatingStartPoint
								.equals(this.floatingMidPoint)));
}
getResizingPoint() {
	return this.resizingPoint;
}

setResizingPoint(point) {
	this.resizingPoint = point;
}



}
module.exports ={
		Shape,
		CoordinateSystem,
		Ruler,
		AbstractLine
}
});

;require.register("core/text/d2font.js", function(exports, require, module) {
var d2=require('d2/d2');
class TextureCache{
	constructor(shape) {
		this.shape=shape;
		this.rotation=0;
		this.fontSize=0;
		this.text=0;
	}
	reset(shape,fontSize,text,rotation){
		this.shape=shape;
		this.rotation=rotation;
		this.fontSize=fontSize;
		this.text=text;
	
	}
}
class FontTexture{
 constructor(tag,text,x,y,fontSize,rotation) {
    this.tag=tag;
	this.shape=new d2.FontText(new d2.Point(x,y),text,fontSize,rotation);    
	this.selection=false;
	this.selectionRectWidth=3000;
	this.constSize=false;
	this.cache=new TextureCache(this);
 }
clone(){
     var copy=new FontTexture(this.tag,this.shape.text,this.shape.anchorPoint.x,this.shape.anchorPoint.y,this.shape.fontSize,this.shape.rotation);     
     return copy;	 
 } 
isEmpty() {
     return this.shape.text==null||this.shape.text.length==0;
 }
isClicked(x,y){
    if (this.shape.text == null || this.shape.text.length == 0){
        return false;
    } 
    return this.shape.contains(new d2.Point(x,y));
    
}
getBoundingRect(){
    if (this.shape.text == null || this.shape.text.length == 0){
        return null;
    } 
    
}
isChanged(fontSize,text,rotation){
	return fontSize===this.cache.fontSize&&text===this.cache.text&&rotation===this.cache.rotation
}
setLocation(x,y){
	this.shape.setLocation(x,y);
}
setText(text){
	this.shape.setText(text);
}
setSize(size){
	this.shape.setSize(size);
}
setRotation(rotate,pt){	
  this.shape.rotate(rotate,pt);
}
Move(xoffset, yoffset){
   this.shape.move(xoffset, yoffset);  
}

paint(g2,viewportWindow,scale){
	 if(this.isEmpty()){
	   return;	 
	 }
	 if(this.constSize){
	   g2.font = ""+parseInt(this.shape.fontSize)+"px Monospace";
	 }else{	 
		 if(this.shape.fontSize*scale.getScale()<8){
			 return;
		 }
		 g2.font = ""+parseInt(this.shape.fontSize*scale.getScale())+"px Monospace";
	 }
	 g2.fillStyle = 'white';
	 
//	 if(!this.isChanged(parseInt(this.shape.fontSize*scale.getScale()),this.shape.text,this.shape.rotation)){
//	  this.cache.reset(this.shape.clone(),parseInt(this.shape.fontSize*scale.getScale()),this.shape.text,this.shape.rotation);
//      this.cache.shape.scale(scale.getScale());
//      this.cache.shape.move(-viewportWindow.x,- viewportWindow.y);
//	 }else{
//		 
//		 console.log('2222');
//	 }
//     this.cache.shape.paint(g2);
	 
//     let t=this.shape.clone();
//     t.scale(scale.getScale());
//     t.move(-viewportWindow.x,- viewportWindow.y);     
//     t.paint(g2);
  
	 this.shape.scalePaint(g2,viewportWindow,scale.getScale());
		 
     if(this.selection){
 		 g2.lineWidth =1;
 		 g2.strokeStyle = 'blue';
 		 let p=this.shape.anchorPoint.clone();
         p.scale(scale.getScale());
         p.move(-viewportWindow.x,- viewportWindow.y);
         p.paint(g2);    	 
     }
	
}
toXML(){
    return (this.text=="" ? "" :
        this.shape.text + "," + this.shape.anchorPoint.x + "," + this.shape.anchorPoint.y +
        ",,,"+this.shape.fontSize+"," +this.shape.rotation);	 
}
fromXML(node){
    if (node == null || node.length==0) {
        this.text = "";
        return;
    }
    var tokens=node.split(',');
    this.shape.anchorPoint.set(parseInt(tokens[1]),
            parseInt(tokens[2]));     
    
    this.shape.setText(tokens[0]);
    this.shape.setSize(parseInt(tokens[5]));
    this.shape.rotate(parseFloat(tokens[6])||0);
    
}
}

var core=require('core/core');
var utilities=require('core/utilities');


module.exports ={
   FontTexture
}
});

;require.register("core/text/d2glyph.js", function(exports, require, module) {
var d2=require('d2/d2');

class Glyph{

	constructor(){
	    this.character=null;
	    //distance to next symbol
	    this.delta=8;
	    this.segments=[];
	    
	    this.minx=0;
		this.miny=0;
	    this.maxx=0;
		this.maxy=0;  
	}
	clone(){	        
	        var copy=new Glyph();
	        copy.segments=[];
	        for(let i=0;i<this.segments.length;i++){
	           copy.segments.push(this.segments[i].clone());           
	        }
			copy.character=this.character;
	        copy.delta=this.delta;
			
	        copy.minx=this.minx;
		    copy.miny=this.miny;
	        copy.maxx=this.maxx;
		    copy.maxy=this.maxy;          
	        return copy;
	}

	    /*
	     * Enlarge to real size
	     * 200 1 mm 
	     */

	    /*Height comes in mm!!!!!!!!!!!!!!!!!!!!
	     * assume that the step is 0.1(20)
	     */
	scale(size){                        
	        let ratio=20*((size*10));
	        for(let i=0;i<this.segments.length;i++){
                 this.segments[i].scale(ratio);
	        }             
	        this.delta*=ratio;
	        this.resize();
	    }
	    //protected void 
	resize(){
	        this.minx=Number.MAX_VALUE;
	        this.miny=Number.MAX_VALUE;
	        this.maxx=Number.MIN_VALUE;
	        this.maxy=Number.MIN_VALUE;
	        
	        
	        for(let i=0;i<this.segments.length;i++){
	        	let box=this.segments[i].box;	            
	        	
	            if(this.minx>box.min.x){
	                this.minx=box.min.x;
	            }
	            if(this.miny>box.min.y){
	                this.miny=box.min.y;
	            }
	            if(this.maxx<box.max.x){
	              this.maxx=box.max.x;
	            }
	            if(this.maxy<box.max.y){
	              this.maxy=box.max.y;
	            }            
	        }
	}
	move(xoffset,yoffset){
		this.segments.forEach(function(segment){
			segment.move(xoffset,yoffset);
		});
		this.resize();
	}
	get width(){
	 return this.maxx-this.minx; 
	}
	    
	get height(){
	 return this.maxy-this.miny;  
	}

	setSize(size){
	  this.resetGlyph(size); 
	}
    get box(){
    	return new d2.Box(this.minx,this.miny,this.maxx,this.maxy);
    }
	resetGlyph(size){
	        let glyph = GlyphManager.getInstance().getGlyph(this.character);    
	        for(let i=0;i<this.segments.length;i++){
	          this.segments[i].ps.set(glyph.segments[i].ps);
	          this.segments[i].pe.set(glyph.segments[i].pe);
	        }
	        this.scale(size);
	}
	rotate(angle,pt) {
	        for(let i=0;i<this.segments.length;i++){
	        	this.segments[i].rotate(angle,pt);						
	        }
	        this.resize();
	}
	mirror(line){
        for(let i=0;i<this.segments.length;i++){
        	this.segments[i].mirror(line);						
        }
        this.resize();
	}
	fromXML(node){
		this.character=j$(node).attr("char");
		this.delta=parseInt(j$(node).attr("delta"));		
		let that=this;

		j$(node).children().each(function(){

		   let line=this.textContent;
		   let array=line.split(',');
		   that.segments.push(new d2.Segment(array[0],array[1],array[2],array[3]));
		});
		
	}
}

class GlyphTexture{
	constructor(text,tag, x,y,size){	    
		this.tag=tag;
	    this.id=1;
		this.anchorPoint = new d2.Point(x, y);
	    this.glyphs = [];
	    this.thickness = core.MM_TO_COORD(0.2);	    
		
	    this.selectionRectWidth=3000;        
	    this.text = text;
		this.height=0;
		this.width=0;
	    this.setSize(size);
		this.fillColor='gray';
	    this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
	    this.isSelected=false;	
	    this.rotate=0;
	    this.mirrored=false;
}
clone(){
	       var copy = new GlyphTexture(this.text,this.tag,this.x,this.y,this.size);
	       copy.anchorPoint = new d2.Point(this.anchorPoint.x,this.anchorPoint.y);       
		   copy.glyphs = [];
	       copy.width=this.width;
		   copy.height=this.height;    
		   this.glyphs.forEach(function(glyph) {
	            copy.glyphs.push(glyph.clone());
	       });
		   copy.mirrored=this.mirrored;
		   copy.rotate=this.rotate;
	       copy.thickness = this.thickness;
		   copy.fillColor=this.fillColor;
	       copy.layermaskId=this.layermaskId;		
			
	       return copy;
}
copy( _copy){    
    this.anchorPoint.set(_copy.anchorPoint.x,_copy.anchorPoint.y); 
    this.text = _copy.text;
    this.tag = _copy.tag;
    this.rotate=_copy.rotate;
    this.mirrored=_copy.mirrored;
    this.fillColor=_copy.fillColor;    
    this.thickness=_copy.thickness;
    this.setSize(_copy.size);                
}
clear() {
    this.glyphs=[];
    this.width=0;
    this.height=0;
}
isEmpty() {
	   return this.text == null || this.text.length == 0;
}
resetGlyphText(text) {
        this.clear();
        if (text == null) {
            return null;
        }
        let result = "";

        for (let i=0;i<text.length;i++) {
            let glyph = GlyphManager.getInstance().getGlyph(text.charAt(i));
            if (glyph != null) {
                this.glyphs.push(glyph);
                result+=text.charAt(i);
            } else {
                this.glyphs.push(GlyphManager.getInstance().getGlyph('!'));
                result+='!';
            }             
        }
        return result;
}
resetGlyphsLine(){
	let xoffset = 0,yoffset=0;
    this.glyphs.forEach(function(glyph) {
        if(glyph.character==' '){
            xoffset += glyph.delta;
            this.width += glyph.delta;
            return;
        }
        //calculate its width
        glyph.resize();
        yoffset=glyph.height;
        for (let i = 0; i < glyph.segments.length ; i++) {        	
        	glyph.segments[i].move(this.anchorPoint.x + xoffset,this.anchorPoint.y); 			  		  
        }        
        xoffset += glyph.width + glyph.delta;
        this.height = Math.max(glyph.height+ glyph.miny, this.height);
        this.width += glyph.width + glyph.delta;
    }.bind(this));
    
    this.glyphs.forEach(function(glyph) {
        for (let i = 0; i < glyph.segments.length ; i++) {        	
        	glyph.segments[i].move(0,-this.height); 			  		  
        }        
    }.bind(this));
    
}
reset(){
    if (this.text == null) {
        return;
    }
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //arrange it according to anchor point
    this.resetGlyphsLine();
    //rotate
	this.glyphs.forEach(function(glyph){		  
		glyph.rotate(this.rotate,this.anchorPoint);		     
    }.bind(this));
}
setSize(size) {

    this.size=size;
    if(this.mirrored){
       let line=new d2.Line(this.anchorPoint,new d2.Point(this.anchorPoint.x,this.anchorPoint.y+100));
       this.mirror(true,line);
    }else{
       this.reset();
    }
}
setText(text) {
    //read original text
    this.text = text;
    if(this.mirrored){
      let line=new d2.Line(this.anchorPoint,new d2.Point(this.anchorPoint.x,this.anchorPoint.y+100));
      this.mirror(true,line);
    }else{
      this.reset();
    }
}
getBoundingShape() {
    if (this.text == null || this.text.length == 0) {
          return null;
    }
     return this.getBoundingRect().box;
}
//@private
getBoundingRect(){
    if(this.mirrored){
        let rect= new d2.Rectangle(this.anchorPoint.x-this.width,this.anchorPoint.y-this.height,this.width,this.height);
        rect.rotate(this.rotate,this.anchorPoint);
        return rect;
     }else{    	
        let rect= new d2.Rectangle(this.anchorPoint.x,this.anchorPoint.y-this.height,this.width,this.height);
        rect.rotate(this.rotate,this.anchorPoint);
        return rect;
     }	
}
isClicked(x,y){
    if (this.text == null || this.text.length == 0){
        return false;
    } 
    return this.getBoundingRect().contains(x,y);   
}
mirror(mirrored,line){
	this.mirrored=mirrored;
	
    //reset original text
    this.text = this.resetGlyphText(this.text);
    //reset size
    this.glyphs.forEach(function(glyph){
        glyph.setSize(core.COORD_TO_MM(this.size));
    }.bind(this));        
    
    //arrange it according to anchor point
    this.resetGlyphsLine();
    
    this.anchorPoint.mirror(line);
    this.glyphs.forEach(function(glyph){
       if(this.mirrored){
    	glyph.mirror(line);    	        
       } 
       glyph.rotate(this.rotate,this.anchorPoint);
        
    }.bind(this));
        
}
Move(xoffset,yoffset) {
    this.anchorPoint.move(xoffset,yoffset);
    this.glyphs.forEach(function(glyph){
        glyph.move(xoffset,yoffset);
    }.bind(this));      
}
setRotation(rotate,pt){
	let alpha=rotate-this.rotate;
	this.anchorPoint.rotate(alpha,pt);
	this.glyphs.forEach(function(glyph){
		glyph.rotate(alpha,pt);   
	}.bind(this));	
	this.rotate=rotate;   	
}
Rotate(rotate,pt){
	//fix angle
	let alpha=this.rotate+rotate;
	if(alpha>=360){
		alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotate=alpha;
	//rotate anchor point
	this.anchorPoint.rotate(rotate,pt);
	//rotate glyphs
	this.glyphs.forEach(function(glyph){
	   glyph.rotate(rotate,pt);   
	}.bind(this));	
		
}
paint(g2,viewportWindow,scale,layermaskId){
   if (this.isEmpty()) {
        return;
   }
   if (this.isSelected)
       g2.strokeStyle='gray';
   else
       g2.strokeStyle=this.fillColor;

   g2.lineWidth = this.thickness * scale.getScale();
   g2.lineCap = 'round';
   g2.lineJoin = 'round';
   
   this.glyphs.forEach(function(glyph){
	   for(let i=0;i<glyph.segments.length;i++){	
		   if(glyph.character==' '){
			   continue;
		   }
		   let copy=glyph.segments[i].clone();
		     copy.scale(scale.getScale());
			 copy.move(-viewportWindow.x,- viewportWindow.y);
	         copy.paint(g2); 
	   }
   });
   
   //let box=this.getBoundingRect();
   //box.scale(scale.getScale());
   //box.move(-viewportWindow.x,- viewportWindow.y);
   //box.paint(g2);
   if (this.isSelected){
       this.drawControlShape(g2,viewportWindow,scale);
   }   
}
drawControlShape(g2, viewportWindow,scale){
    utilities.drawCrosshair(g2, viewportWindow, scale, null, this.selectionRectWidth, [this.anchorPoint]);
}
toXML(){
    return (this.isEmpty()? "" :
        this.text + "," + utilities.roundFloat(this.anchorPoint.x,5) + "," + utilities.roundFloat(this.anchorPoint.y,5) +
        ",,"+this.thickness+","+this.size+","+this.rotate);	
}
fromXML(node){	
	
	if (node == null || j$(node).text().length==0) {
         this.text = "";
         return;
     }
	 //layer?
     if(j$(node).attr("layer")!=null){
        this.layermaskId=core.Layer.Copper.valueOf(j$(node).attr("layer")).getLayerMaskID();
       }else{
    	this.layermaskId=core.Layer.SILKSCREEN_LAYER_FRONT;	
     }
     
	 var tokens=j$(node).text().split(',');
     this.text=tokens[0];
	 
     this.anchorPoint.set(parseInt(tokens[1]),
             parseInt(tokens[2]));  

	 this.thickness=parseInt(tokens[4]); 
	 if(isNaN(this.thickness)){
		 this.thickness=2000;
	 } 
     let size=parseInt(tokens[5]);
     if(isNaN(size)){
    	 size=20000;
     }
     this.size=size;

	 let rotate=parseFloat(tokens[6]);
     if(isNaN(rotate)){
    	 rotate=0;
     }
	 this.rotate=rotate;
	 
	 //mirror?
     let side=core.Layer.Side.resolve(this.layermaskId);
	 if(side==core.Layer.Side.BOTTOM){
		this.mirrored=true;		 
	 }
	 //invalidate
	 this.setText(this.text);
}
}
var GlyphManager = (function () {

	var instance=null;
	 

	class manager{
	constructor(){
	   this.glyphs=new Map();	
	   this.initialize();
	}

	initialize(){
	  	    j$.ajax({
		        type: 'GET',
		        contentType: 'application/xml',
		        url: 'fonts/defaultfont.xml',
		        dataType: "xml",	        
		        success: j$.proxy(this.onLoadFont,this),
		        
		        error: function(jqXHR, textStatus, errorThrown){
		            	alert(errorThrown+":"+jqXHR.responseText);
		        },
		    });
	}

	onLoadFont(data){
	let that=this;
		 	   j$(data).find('symbol').each(function(){
	               var glyph=new Glyph();
				   glyph.fromXML(this);
				   that.glyphs.set(glyph.character,glyph);
		 	   });

	}	

	getGlyph(symbol){
	      let glyph= this.glyphs.get(symbol);    
	      if(glyph!=null){      
	        return glyph.clone();        
	      }
	      return null;
	    }
	}
	    return {
	        getInstance: function () {
	            if (!instance) {
	                instance = new manager();
	            }
	            return instance;
	        }
	    };
	})();

	var core=require('core/core');
	var utilities=require('core/utilities');
	
module.exports ={
			   Glyph,
			   GlyphTexture,
			   GlyphManager
			}	
});

;require.register("core/unit.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var shape = require('core/shapes');
var events=require('core/events');
var GlyphManager=require('core/text/d2glyph').GlyphManager;
var ViewportWindow=require('core/core').ViewportWindow;
var d2=require('d2/d2');

//**********************UnitMgr***************************************
var UnitMgr=(function(){
	var instance=null;
	//private
    function getPinsRect(shapes){
        var x1=Number.MAX_VALUE,y1=Number.MAX_VALUE,x2=Number.MIN_VALUE,y2=Number.MIN_VALUE;
        var isPinnable=false;        
        
        shapes.forEach(function(shape) {            
            if(typeof shape.getPinsRect === 'function'){
                r=shape.getPinsRect();
                x1=Math.min(x1,r.x );
                y1=Math.min(y1,r.y);
                x2=Math.max(x2,r.x+r.width);
                y2=Math.max(y2,r.y +r.height);             
                isPinnable=true;	
            }  
           });
        
        if(isPinnable)
            return  d2.Box.fromRect(x1,y1,x2-x1,y2-y1);            
        else
            return null;  
        };

class manager{
        alignBlock(grid,shapes) {
            let r = getPinsRect(shapes);
            if (r == null) {
                return;
            }
            let point =grid.positionOnGrid(r.x, r.y); 
            
      	   shapes.forEach(function(shape) {
      		 shape.Move((point.x - r.x),(point.y - r.y));
           });
        }
        moveBlock(shapes, xoffset,yoffset){
        	   shapes.forEach(function(shape) {
         		shape.Move(xoffset,yoffset);
               });
         }    
        mirrorBlock(shapes,A,B){
     	   shapes.forEach(function(shape) {
        		shape.Mirror(A,B);
           });
        }
        rotateBlock(shapes, rotation){
       	   shapes.forEach(function(shape) {
        		shape.Rotate(rotation);
                });
        }
        deleteBlock(unit,shapes){
        	shapes.forEach(function(shape) {               
               unit.remove(shape.uuid);
            });	
        }
        cloneBlock(unit,shapes){
            //***disselect old block
            unit.setSelected(false);
            shapes.forEach(function(shape) {
            	let copy = shape.clone();
            	copy.setSelected(true);
            	unit.add(copy);
            });
        }
        isBlockSelected(shapes){
            var count = 0;
    	    shapes.forEach(function(shape) {
                   if (shape.isSelected()) {
    					count++;
                    }  
               });
            return count > 1;
        }        
        getLabelByTag(unit,tag){
           let result=null;
       	   unit.shapes.some(function(shape) {
       		if(undefined !=shape['getTexture']){
       			let text=shape.getTexture();
       		    if (text.tag==tag){        			
        				result=shape;
        			    return true;
        			}
        				
            }
       		return false;
           });
            return result;
        }
    
    }
	return {getInstance:function(){
		    if (!instance) {
              instance = new manager();
            }
            return instance;
	      }
	};
		
	
})();
//**********************Unit*******************************************
class Unit{
    constructor(width,height) {
        //this.silent=false; 	 
    	this.scalableTransformation=new core.ScalableTransformation(8,4,13);
    	this.uuid=core.UUID();
    	this.shapes=[];
    	this.width=width;
    	this.height=height;
    	this.unitName="Uknown";
    	this.grid=new core.Grid(0.8,core.Units.MM);
        this.scrollPositionXValue = 0;
        this.scrollPositionYValue = 0;
        this.frame=new core.UnitFrame(this.width,this.height);
        this.coordinateSystem;//=new core.CoordinateSystem(this);
		this.ruler=new shape.Ruler();
		this.shapeFactory=null;
        
    }
setScrollPositionValue(scrollPositionXValue,scrollPositionYValue) {
        this.scrollPositionXValue = scrollPositionXValue;
        this.scrollPositionYValue = scrollPositionYValue;
       }
fireShapeEvent(event){
		if(!core.isEventEnabled)
			return;

		switch(event.type){
		  case events.Event.SELECT_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.DELETE_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.RENAME_SHAPE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.ADD_SHAPE:	 
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  core.mywebpcb.trigger('shape:inspector',event);
			  break;
		}       	
}
	
getCoordinateSystem(){
        return this.coordinateSystem;
    }
getSelectedShapes() {
       var v=[];
       var len=this.shapes.length;
 	   for(var i=0;i<len;i++){
            if (this.shapes[i].isSelected()) {
				v.push(this.shapes[i]);
            } 
 	    }
       return v;
    }	
release(){
		this.clear();
		
	}
clear(){
        //***go through all lists and delete them
 	   this.shapes.forEach(function(shape) {
 		  shape.owningUnit=null;
 		  shape.clear();
 		  shape=null;
       },this);
        this.shapes=[];	
	}
add(shape){
	 if(shape==undefined){
		return;	
	 }
	 shape.owningUnit=this;
	 this.shapes.push(shape);
	 this.fireShapeEvent({target:shape,type:events.Event.ADD_SHAPE});
}
getBoundingRect() {
        return this.getShapesRect(this.shapes);
    }
getShapesRect(shapes) {
        var r = new d2.Box(0,0,0,0);
        var x1 = Number.MAX_VALUE; 
        var y1 = Number.MAX_VALUE;
        var x2 = Number.MIN_VALUE;
        var y2 = Number.MIN_VALUE;

        //***empty schematic,element,package
        if (shapes.length == 0) {
            return r;
        }
        var len=shapes.length;
  	    for(var i=0;i<len;i++){
  	    	var tmp = shapes[i].getBoundingShape();
            if (tmp != null) {
                x1 = Math.min(x1, tmp.x);
                y1 = Math.min(y1, tmp.y);
                x2 = Math.max(x2, tmp.x+tmp.width);
                y2 = Math.max(y2, tmp.y+tmp.height);
            }
            
        }
        r.setRect(x1, y1, x2 - x1, y2 - y1);
        return r;
    }	
remove(uuid) {
 	   this.shapes = this.shapes.filter(function(item) { 
               if(item.getUUID()==uuid){
			      this.fireShapeEvent({target:item,type:events.Event.DELETE_SHAPE});
         	      item.clear();
         	      item=null;
				  return false;
			   }
			   return true;
        }.bind(this));
}  
getGrid(){
 	  return this.grid;
 	}
getUUID(){
 	  return this.uuid;  
 	}
getWidth(){
 		return this.width;
 	}
getHeight(){
 	return this.height;
 	}
buildClickedShapesList(x,  y,  isTextIncluded){
   var orderElements = [];
   let len=this.shapes.length;
   for(i=0;i<len;i++){   
       if(isTextIncluded){
    	if((undefined !=this.shapes[i]['getChipText'])&&this.shapes[i].getChipText().isClicked(x, y)){                               
             orderElements.splice(0, 0, this.shapes[i]);
             continue;
        }
       }     
       if(this.shapes[i].isClicked(x, y)){
          orderElements.push(this.shapes[i]);
       
       }  
   }
   return orderElements;
}
getClickedShape( x,  y,  isTextIncluded){
    let clickedShapes = this.buildClickedShapesList(x,y,isTextIncluded);
    if(clickedShapes.length==0){
        return null;
    }
    //Text?
    if (undefined !=clickedShapes[0]['getChipText']) {   
        if(this.isShapeVisibleOnLayers(clickedShapes[0])){             
          return clickedShapes[0];
        }
    }

    clickedShapes.sort(function(o1, o2){
       
            //both on same side
    	 if(o1.owningUnit.compositeLayer!=undefined){    
    	   let s1=core.Layer.Side.resolve(o1.copper.getLayerMaskID());
           let s2=core.Layer.Side.resolve(o2.copper.getLayerMaskID());
           let active=o1.owningUnit.compositeLayer.activeSide;
             //active layer has presedense
           if(s1!=s2){
               if(s1==active){
                     return -1;
                 }else{
                     return 1;
                 }
           }
    	 }
                   
       if ((o1.getOrderWeight() - o2.getOrderWeight()) == 0)
           return 0;
       if ((o1.getOrderWeight() - o2.getOrderWeight()) > 0)
           return 1;
       else
           return -1;
       
   }.bind(this));
    
    for(i=0;i<clickedShapes.length;i++){
       if(!this.isShapeVisibleOnLayers(clickedShapes[i])){             
           continue;              
       }        
       return clickedShapes[i];
    };
    return null;  
}
isShapeVisibleOnLayers(shape){
   if (undefined !=this.compositeLayer) {	
    if(shape.isVisibleOnLayers(this.compositeLayer.getLayerMaskID())){
      return true;
    }else{
      return false;  
    }    
   }else{
	   return true;
   }
}
//buildClickableOrderItem(x,  y,  isTextIncluded){
//     var orderElements = [];
//     var index = 0;
//     this.shapes.forEach(function(shape){
//         if(isTextIncluded){
//           	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
//           	    orderElements.push({index:index,orderWeight:0});
//           	}
//         }		 
//         
//		if(!shape.isClicked(x, y)){
//               index++;
//               return; 
//        }
//         //***give selected a higher priority
//        orderElements.push({index:index,
//         	                orderWeight:shape.isSelected() && shape.getOrderWeight() > 1 ? 2 : shape.getOrderWeight()});
//
//         index++;
//     }.bind(this));
//     return orderElements;
// }
//getClickedShape( x,  y,  isTextIncluded){
// 	       var result=null;
// 	       var orderElements=this.buildClickableOrderItem(x,y,isTextIncluded);
//
// 	       orderElements.sort(function(a,b) {
// 	    	   if (a.orderWeight < b.orderWeight){
// 		    	      return -1;
// 	    	   }
// 		       if (a.orderWeight > b.orderWeight){
// 		    	     return 1;
// 		       }	     
// 		       return 0;
// 		    });
// 	    
// 	       orderElements.some(function(item) {			   
// 	    	    var shape=this.shapes[item.index];
//				
//                 if(isTextIncluded){
//                 	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
//                 	    result=shape;
//                 		return true;
//                 	}
//                 }
// 	 		   
// 	 		    //if (shape.isClicked(x, y)) {
//                 result=shape;
// 				 return true;				 
//                //}  
//				 
//            }.bind(this));
// 		   
// 		   return result;
// 	}
isControlRectClicked( x,  y) {
         /*
          * if two symbols overlap and one is selected
          * then the selected should be checked for control rect click first
          */
         
         var shape = this.getShape(this.getSelected());		 
         if ((shape != null)&&(shape['isControlRectClicked']!=undefined)&&(shape.isControlRectClicked(x, y) != null)){
                return shape;
         }
         return null;
     }
getShapes(clazz) {
        var selectionList=[];
  	    this.shapes.forEach(function(shape) {
            if (shape instanceof clazz) {
         	   selectionList.push(shape);				
            }
         });           
         return selectionList;
 }    
getShape(uuid){
 	    if (uuid == null){
             return null;
         }    
 	   var shape=null;
 	   this.shapes.forEach(function(ashape) {
             if (ashape.getUUID()==uuid) {
                shape=ashape;
 				return;
             }
        }.bind(this));
 	   
         return shape;
 	}
getSelected() {
 	   var uuid=-1;
 	   this.shapes.forEach(function(shape) {
             if (shape.isSelected()) {
                 uuid=shape.getUUID();
 				return;
             }
        }.bind(this));
         return uuid;
     }
setSelectedShape(uuid,flag){
	   this.shapes.some(function(shape) {
		   if(shape.uuid==uuid){
			   shape.setSelected(flag);
			   return true;
		   }else{
			   return false;
		   }	
		   
       });	
} 	
setSelected(flag) {
 	   this.shapes.forEach(function(shape) {
 			shape.setSelected(flag);
        });
     }
setSelectedInRect(r){
 	   this.shapes.forEach(j$.proxy(function(shape) {
 	        if (shape.isInRect(r)) {
                 shape.setSelected(true);
             }
        },this));	
     }	
getScalableTransformation(){
 	  return this.scalableTransformation;
 	}
notifyListeners(eventType) {
  	   this.shapes.forEach(j$.proxy(function(shape) {
  		  this.fireShapeEvent({target:shape,type:eventType}); 
       },this));
 }	
 setSize(width,height){
     this.width = width;
     this.height = height;
     this.frame.setSize(width, height);	
 }
paint(g2, viewportWindow){
 	   let len=this.shapes.length;
 	   for(let i=0;i<len;i++){
 		   this.shapes[i].paint(g2,viewportWindow,this.scalableTransformation);  
 	   }
 	   //grid
       this.grid.paint(g2,viewportWindow,this.scalableTransformation);
        //coordinate system
       if(this.coordinateSystem!=null){
         this.coordinateSystem.paint(g2, viewportWindow,this.scalableTransformation);
       }	
         //ruler
	   this.ruler.paint(g2, viewportWindow,this.scalableTransformation);
        //frame
       if(this.frame!=null){
	     this.frame.paint(g2, viewportWindow,this.scalableTransformation);
       }
     }    
       
}

//**********************UnitContainer*******************************************
class UnitContainer{
	constructor(){
	      //this.silent= silent || false;;	
		  this.unitsmap=new Map();
		  this.unit=null;
		  this.fileName="";
		  this.libraryname="";
		  this.categoryname="";	
	}
    setFileName(fileName) {
        this.fileName = fileName;
        this.formatedFileName=this.fileName;
    }
	add(unit){
	  this.unitsmap.set(unit.getUUID(), unit);
      if(this.unitsmap.size==1){
          this.setActiveUnit(0);   
      }
      this.fireUnitEvent({target:unit,type:events.Event.ADD_UNIT});
      
	}
    delete( uuid) {
        var _unit = this.unitsmap.get(uuid);
        if(_unit==null){
            return;
        }
        _unit.release();
        this.fireUnitEvent({target:_unit,type:events.Event.DELETE_UNIT});
        if (_unit == this.unit) {
            this.unit = null;
        }
        _unit = null;
        this.unitsmap.delete(uuid);
    }
    clear(){
    	for(let item of this.unitsmap.keys()){
    		  this.delete(item);
    		  this.unitsmap.delete(item);
        };
		this.unitsmap.clear();
    }	
	getUnits() {
        return this.unitsmap.values();
    }
    setActiveUnitUUID(uuid){
    	this.unit=this.unitsmap.get(Number(uuid));
    }
	setActiveUnit(index) {	
	let units=this.unitsmap.values();
	  for(let i=0;i<this.unitsmap.size;i++){
        let aunit=units.next();
		if(index==i){
		  this.unit=aunit.value;
		  break;
		}
	  }
    }
	getUnit(){
	  return this.unit;
	}

	fireUnitEvent(event){
		if(!core.isEventEnabled)
			return;
		
		switch(event.type){
		  case events.Event.ADD_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.DELETE_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.SELECT_UNIT:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.RENAME_UNIT:	 
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  core.mywebpcb.trigger('unit:inspector',event);
			  break;
		}  		
	}	
}

//**********************UnitComponent*******************************************
class UnitComponent{
	constructor(hbar,vbar,canvas,popup){
	GlyphManager.getInstance();
    
	if(canvas!=null){	
        this.canvas = j$('#'+canvas);
  	  this.ctx = this.canvas[0].getContext("2d");
  	  
  	  //keypress
  	  j$('body').keydown(j$.proxy(this.keyPress,this));
  	  //right popup
  	  j$('body').on('contextmenu', '#'+canvas, function(e){ return false; });
  	  //mouse wheel event
  	  j$('#'+canvas).bind('mousewheel',j$.proxy(this.mouseWheelMoved,this));
  	  //mouse click event 
  	  j$('#'+canvas).on('mouseup',j$.proxy(this.mouseUp,this)); 
  	  j$('#'+canvas).on('mousedown',j$.proxy(this.mouseDown,this));
  	  j$('#'+canvas).on('mousemove',j$.proxy(this.mouseMove,this));
  	  j$(window).resize(j$.proxy(this.screenResized,this));
  	  j$('#'+canvas).dblclick(j$.proxy(this.dblClick,this));
  	}
	
    var container = j$(this.canvas).parent();	  
	this.width=j$(container).width();
	this.height=j$(container).height();

	//set canvas width
	this.canvas.attr('width',this.width);
	this.canvas.attr('height',this.height); 
	
	this.viewportWindow=new ViewportWindow(0,0,this.width,this.height);
	this.parameters=new Map();
	this.parameters.set("snaptogrid",false);
	if(hbar!=null&&vbar!=null){
		this.hbar = j$('#'+hbar);
		this.vbar=j$('#'+vbar);
		this.hbar.jqxScrollBar({ width: '100%', height: 18, min: 0, max: 100});
		this.vbar.jqxScrollBar({ width: 18, height:'100%', min: 0, max: 100, vertical: true});
		this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
		this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	}
	
	this.mode=core.ModeEnum.COMPONENT_MODE;
	this.view=null;
	this.cursor=null;
	
}
resumeLine(line,handleKey,event) {	      
	   line.reset(event.x,event.y);
	      //***do we need to reorder
	   line.reverse(event.x,event.y);     
	   this.eventMgr.setEventHandle(handleKey,line);
} 
getMode(){
	return this.mode; 
} 
getEventMgr(){
	return this.eventMgr;
	}	  
getModel(){
	return this.model;
    }
setView(_view){
    this.view=_view; 
    }
getView(){
	return this.view;  
	}
getParameter(key) {
		return this.parameters.get(key); 
	}
	 
setParameter(key,value){
	    this.parameters.set(key,value); 
	}
setScrollPosition(x,y) {
    var xx=x*this.getModel().getUnit().getScalableTransformation().getScale();
    var yy=y*this.getModel().getUnit().getScalableTransformation().getScale();
    
    xx=parseInt(xx-(this.width/2));
    yy=parseInt(yy-(this.height/2));

    this.hbar.jqxScrollBar('setPosition',xx); 
    this.vbar.jqxScrollBar('setPosition',yy);
}
setSize( width, height){
     this.viewportWindow.setSize(width,height);      
 }
Clear(){
	this.viewportWindow.setSize(1,1); 
    this.getEventMgr().resetEventHandle();
    this.getModel().clear();
  }
fireContainerEvent(event){
	
	  if(!core.isEventEnabled)
		return;
	
	  mywebpcb.trigger('container:inspector',event); 
}
keyPress(event){
	  if(event.target.tagName=="INPUT"){
		  return;
	  }
	  
	 //if(event.target instanceof HTMLBodyElement||event.target instanceof HTMLCanvasElement){
		 event.preventDefault();
	     if (this.getEventMgr().targetEventHandle != null && this.getModel().getUnit() != null) {
	            this.getEventMgr().targetEventHandle.keyPressed(event);
	     }
	 //}	 
}
getScaledEvent(event){
	  var x,y;
	  if (event.pageX != undefined && event.pageY != undefined) {
		   x = event.pageX;
		   y = event.pageY;
	  }else {
		   x = event.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
		   y = event.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	 }
	       x -= parseInt(this.canvas.offset().left);
	       y -= parseInt(this.canvas.offset().top);
	  
	  return new events.MouseScaledEvent(x,y,this.getModel().getUnit().getScalableTransformation().getInversePoint(this.viewportWindow.x+x,this.viewportWindow.y+y),event);     
}
dblClick(event){
	  event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		 return; 
	  }
		
    var scaledEvent =this.getScaledEvent(event);

	  if (this.getEventMgr().getTargetEventHandle() != null) {
	            this.getEventMgr().getTargetEventHandle().dblClick(scaledEvent);
	  } 	  
}
mouseUp(event){
    event.preventDefault();
	if (this.getModel().getUnit() == null) { 
			 return; 
    }
	this.canvas.off('mousemove',j$.proxy(this.mouseDrag,this));
	this.canvas.on('mousemove',j$.proxy(this.mouseMove,this));
	
    var scaledEvent =this.getScaledEvent(event);

	if (this.getEventMgr().getTargetEventHandle() != null) {
            this.getEventMgr().getTargetEventHandle().mouseReleased(scaledEvent);
    }      
	   	
}
mouseDrag(event){
    event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
			 return; 
	  }
       
     var scaledEvent =this.getScaledEvent(event);  
	  
	if(event.button==0&&this.getEventMgr().getTargetEventHandle() != null) {		
            this.getEventMgr().getTargetEventHandle().mouseDragged(scaledEvent);
      }
	   
  }
mouseMove(event){
	   event.preventDefault();
	   if (this.getModel().getUnit() == null) { 
			return; 
	   }
	   
	   var scaledEvent =this.getScaledEvent(event);  
	     
	   if(this.getEventMgr().getTargetEventHandle() != null) {		
	            this.getEventMgr().getTargetEventHandle().mouseMove(scaledEvent);
	   }

}
mouseWheelMoved(event){
    event.preventDefault();
	  if (this.getModel().getUnit() == null) { 
		return; 
	  }
	var e=this.getScaledEvent(event);
	if(event.originalEvent.wheelDelta /120 > 0) {
		   this.ZoomIn(e.windowx,e.windowy);
      }
      else{
		   this.ZoomOut(e.windowx,e.windowy);
      }
}
ZoomIn(x,y){
    if(this.getModel().getUnit().getScalableTransformation().ScaleOut()){
        this.viewportWindow.scalein(x,y, this.getModel().getUnit().getScalableTransformation());
        this.Repaint();         
    }else{
        return false;
    } 
	this.hbar.off(); 
	this.vbar.off(); 
	//set new maximum 
	this.hbar.jqxScrollBar({ value:this.viewportWindow.x,width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
	this.vbar.jqxScrollBar({ value:this.viewportWindow.y,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});
	
	this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
	this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	
	return true;
}
ZoomOut(x,y){
    if(this.getModel().getUnit().getScalableTransformation().ScaleIn()){
            this.viewportWindow.scaleout(x,y, this.getModel().getUnit().getScalableTransformation());
            this.Repaint();                       
    }else{
            return false;
    }

	this.hbar.off(); 
	this.vbar.off(); 
              //set new maximum 
   	this.hbar.jqxScrollBar({value:this.viewportWindow.x, width: this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
	this.vbar.jqxScrollBar({value:this.viewportWindow.y, width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height)});

	this.hbar.on('valueChanged', j$.proxy(this.hStateChanged,this));
	this.vbar.on('valueChanged',j$.proxy(this.vStateChanged,this));
	
	return true;
}
vStateChanged(event){
    this.viewportWindow.y= parseInt(event.currentValue);
    this.Repaint();
	
  }
hStateChanged(event){
    this.viewportWindow.x= parseInt(event.currentValue);
    this.Repaint();
  }
screenResized(e){	  
	  var container = j$('#mycanvasframe');	  
	  var oldwidth=this.width;
	  this.width=j$(container).width()-18;  //mind combo width
	  
	  if(oldwidth==this.width){
		  return;
	  }
	  //set canvas width
	  this.canvas.attr('width',this.width);
	  this.componentResized();
	  this.Repaint();
	}
componentResized(){
    if(this.getModel().getUnit()==null){
  	  this.setSize(1,1);
  	  this.hbar.jqxScrollBar({ width: this.width, height: 18, min: 0, max: 1});
		  this.vbar.jqxScrollBar({ width: 18, min: 0, max: 1, vertical: true});
    }else{
  	this.setSize(this.width,this.height); 
      
  	var hCurrentValue = this.hbar.jqxScrollBar('value');
      var vCurrentValue = this.vbar.jqxScrollBar('value');
  	
  	
		this.hbar.jqxScrollBar({ value:hCurrentValue,width:this.width, height: 18, min: 0, max: parseInt(this.getModel().getUnit().getWidth()*this.getModel().getUnit().getScalableTransformation().getScale()-this.width)});
		this.vbar.jqxScrollBar({ value:vCurrentValue,width: 18, min: 0, max: parseInt(this.getModel().getUnit().getHeight()*this.getModel().getUnit().getScalableTransformation().getScale()-this.height), vertical: true});
    }  
	  
}
setContainerCursor(_cursor) {
    this.cursor = _cursor;
}
getContainerCursor() {
    return this.cursor;
}
Repaint(){
	  if(this.getModel().getUnit()!=null){
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.width, this.height); 
	  this.getModel().getUnit().paint(this.ctx,this.viewportWindow);
      if (this.cursor != null) {
      	this.cursor.paint(this.ctx,this.viewportWindow, this.getModel().getUnit().getScalableTransformation());

      }
	  }else{
	        this.ctx.clearRect(0, 0, this.width, this.height);  
	  }
}
}
module.exports ={
		Unit,
		UnitContainer,
		UnitComponent,
		UnitMgr
}

});

;require.register("core/utilities.js", function(exports, require, module) {
var core=require('core/core');
var d2=require('d2/d2');

    /*
     * Find out in which quadrant is a point B, in regard to a point origine A
     *
     *        2   |  1
     *        ----------
     *        3   |  4
     */
var QUADRANT=(function(){
	return{
        FIRST:1,
        SECOND:2,
        THIRD:3,
        FORTH:4
	}
})();
var roundDouble=function(number){
	return Math.round(number*10000)/10000 ;
}
var round=function(angle){
	return Math.round(angle*100.0)/100.0;
}

var roundFloat=function(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
var mirrorPoint=function(A,B,sourcePoint){
        let x = sourcePoint.x, y = sourcePoint.y;
        //***is this right-left mirroring
        if (A.x == B.x) {
            //***which place in regard to x origine
            if ((x - A.x) < 0)
                x = A.x + (A.x - x);
            else
                x = A.x - (x - A.x);
        } else { //***top-botom mirroring
            //***which place in regard to y origine
            if ((y - A.y) < 0)
                y = A.y + (A.y - y);
            else
                y = A.y - (y - A.y);
        }

        sourcePoint.setLocation(x, y);
        return sourcePoint;	
}
var getQuadrantLocation=function(origin,point) {
        if (point.x >= origin.x && point.y <= origin.y)
            return QUADRANT.FIRST;
        else if (point.x <= origin.x && point.y <= origin.y)
            return QUADRANT.SECOND;
        else if (point.x <= origin.x && point.y >= origin.y)
            return QUADRANT.THIRD;
        else
            return QUADRANT.FORTH;
}
var drawCrosshair=function(g2,viewportWindow,scale,resizingPoint,length,points){
        let line = new d2.Segment(0,0,0,0);
        
		g2.lineWidth = 1;

        points.forEach(function(point){
            if (resizingPoint != null && resizingPoint.equals(point))
                g2.strokeStyle = 'yellow';
            else
                g2.strokeStyle='blue';
			
            line.set(point.x - length, point.y, point.x + length, point.y);
            line.scale(scale.getScale());
            line.move(-viewportWindow.x,-viewportWindow.y);
            line.paint(g2);

            line.set(point.x, point.y - length, point.x, point.y + length);            
            line.scale(scale.getScale());
            line.move(-viewportWindow.x,-viewportWindow.y);
            line.paint(g2);
        });	

}

var radians = function(degrees) {
	  return degrees * Math.PI / 180;
};
	 
var degrees = function(radians) {
	  return radians * 180 / Math.PI;
};

var rotate=function(point, originX, originY, angle){
	angle = angle * Math.PI / 180.0;
		return {
				x: Math.cos(angle) * (point.x-originX) - Math.sin(angle) * (point.y-originY) + originX,
				y: Math.sin(angle) * (point.x-originX) + Math.cos(angle) * (point.y-originY) + originY
	    };
};

/*****
*
*   Intersect Line with Line
*
*****/
var intersectLineLine = function(a1, a2, b1, b2) {
    var result=false;
    
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
};
/*****
*
*   Intersect Line with Rectangle
*
*****/
var intersectLineRectangle = function(a1, a2, r1, r2) {
    var min        = Min(r1,r2);
    var max        = Max(r1,r2);
    var topRight   = new d2.Point( max.x, min.y );
    var bottomLeft = new d2.Point( min.x, max.y );
    
    var inter1 = intersectLineLine(min, topRight, a1, a2);
    var inter2 = intersectLineLine(topRight, max, a1, a2);
    var inter3 = intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = intersectLineLine(bottomLeft, min, a1, a2);
    
    return inter1||inter2||inter3||inter4;
};
var Min=function(p1,p2){
	return new d2.Point(Math.min(p1.x,p2.x),Math.min(p1.y,p2.y));	
}
var Max=function(p1,p2){
    return new d2.Point(Math.max(p1.x,p2.x),Math.max(p1.y,p2.y));	
}
//*******DELETE*************
var roundrect=function (g2,x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
		g2.moveTo(x+r, y);
		g2.arcTo(x+w, y,   x+w, y+h, r);
		g2.arcTo(x+w, y+h, x,   y+h, r);
		g2.arcTo(x,   y+h, x,   y,   r);
		g2.arcTo(x,   y,   x+w, y,   r);
};

//var ellipse=function(g2,xC, yC, width, height, rotation) {
//	var x, y, rW, rH, inc;
//	inc = 0.01 //value by which we increment the angle in each step
//	rW = width / 2; //horizontal radius
//	rH = height / 2; //vertical radius
//	x = xC + rW * Math.cos(rotation); // ...we will treat this as angle = 0
//	y = yC + rW * Math.sin(rotation);
//
//	g2.moveTo(x, y); //set the starting position
//		for (var angle = inc; angle<2*Math.PI; angle+=inc) { //increment the angle from just past zero to full circle (2 Pi radians)
//			x = xC + rW * Math.cos(angle) * Math.cos(rotation) - rH * Math.sin(angle) * Math.sin(rotation);
//			y = yC + rW * Math.cos(angle) * Math.sin(rotation) + rH * Math.sin(angle) * Math.cos(rotation);
//			g2.lineTo(x, y); //draw a straight line segment. if the increment is small enough, this will be
//								//indistinguishable from a curve in an on-screen pixel array
//		}
//};

version=(function(){
	return {
		MYWEBPCB_VERSION:"3.0",
	    SYMBOL_VERSION:"1.0",
        CIRCUIT_VERSION:"1.2",     
        FOOTPRINT_VERSION:"3.0", 
        BOARD_VERSION:"2.0" 
	};
})();

module.exports = {
  version,
  round,
  roundDouble,
  roundFloat,
  getQuadrantLocation,  
  drawCrosshair,
  //ellipse,
  roundrect,
  intersectLineRectangle,
  intersectLineLine,
  rotate,
  degrees,
  radians,
  QUADRANT,
  mirrorPoint
}

});

;require.register("core/views/panelview.js", function(exports, require, module) {
var core=require('core/core');

//**********************BaseBuilder*******************************************
var BaseBuilder=Backbone.View.extend({
	  initialize:function(component){
		this.component=component;  
	  }, 	
	  setTarget:function(target){
		  this.target=target;
	  },
	  fillComboBox:function(items){
		  var result="";
		  var len = items.length;
		  for (var i=0; i<len; ++i) {
			  if(items[i].selected!=undefined&&items[i].selected==true){
				 selected="selected"; 
			  }else{
				 selected=""; 
			  }
			  result+="<option value='"+items[i].id+"' "+selected+">"+ items[i].value+"</option>";
		  }
		  return result;
	  },
	  reloadComboBox:function(combo,items){
			j$('#'+combo).empty();  
			  var len = items.length;
			  for (var i=0; i<len; ++i) {
				  if(items[i].selected!=undefined&&items[i].selected==true){
					  j$('#'+combo).append('<option value=' + items[i].id + ' selected>' +  items[i].value + '</option>'); 
				  }else{
					  j$('#'+combo).append('<option value=' + items[i].id + '>' +  items[i].value + '</option>');
				  }
			  }			
	  },
	  validateAlignmentComboText:function(combo,texture){
		if(texture.alignment.getOrientation()==OrientEnum.HORIZONTAL){
			this.reloadComboBox(combo,[{id:0,value:'LEFT',selected:true},{id:1,value:'RIGHT'}]);
		}else{
			this.reloadComboBox(combo,[{id:2,value:'TOP',selected:true},{id:3,value:'BOTTOM'}]);
		}
		j$('#'+combo).val(texture.alignment.get());
	  },
	  
	  toUnitX:function(value){        
	      var coordinateSystem=this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	    	  return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value-coordinateSystem.x);  
	      else
	          return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value);      
	  },
	  toUnitY:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value-coordinateSystem.y);
	      else
	    	return this.component.getModel().getUnit().getGrid().COORD_TO_UNIT(value);	  
	  },  
	  fromUnitX:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value))+coordinateSystem.x;
	      else
	    	return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value));	  
	  },
	  fromUnitY:function(value){
	      var coordinateSystem =this.component.getModel().getUnit().getCoordinateSystem();
	      if(coordinateSystem!=null)
	        return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value))+coordinateSystem.y;
	      else
	    	return this.component.getModel().getUnit().getGrid().UNIT_TO_COORD(parseFloat(value));  
	  }
	  
});

module.exports ={
		BaseBuilder
}
});

;require.register("d2/d2.js", function(exports, require, module) {
		
var d2 ={
		
};

require("./shapes/fonttext")(d2);
require("./shapes/point")(d2);
require("./shapes/box")(d2);
require("./shapes/line")(d2);
require("./shapes/segment")(d2);
require("./shapes/vector")(d2);
require("./shapes/polygon")(d2);
require("./shapes/rectangle")(d2);
require("./shapes/hexagon")(d2);
require("./shapes/arc")(d2);
require("./shapes/circle")(d2);
require("./shapes/roundrectangle")(d2);
require("./shapes/oval")(d2);
require("./shapes/obround")(d2);
require("./shapes/polyline")(d2);
require("./shapes/utils")(d2);

module.exports = d2;
});

require.register("d2/shapes/arc.js", function(exports, require, module) {
module.exports = function(d2) {

  d2.Arc = class Arc {
        /**
         *
         * @param {Point} pc - arc center
         * @param {number} r - arc radius
         * @param {number} startAngle - start angle in degrees from 0 to 360
         * @param {number} endAngle - end angle in degrees from -360 to 360        
         */
        constructor(pc=new d2.Point(), r=1, startAngle=0, endAngle=360) {
            this.pc = pc;
            this.r = r;
            this.startAngle = startAngle;
            this.endAngle = endAngle;            
        } 
        clone(){
           return new d2.Arc(this.pc.clone(),this.r,this.startAngle,this.endAngle);  	
        }
        get area(){
           return  ( Math.PI * this.r*this.r ) * ( this.sweep / 360 )	
        }
        get center(){
        	return this.pc;
        }
        get start() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate(this.startAngle, this.pc);
            return p0;
        }
                
        get middle() {
            let angle = this.endAngle>0 ? this.startAngle + this.sweep/2 : this.startAngle - this.sweep/2;
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate(angle, this.pc);
            return p0;
        }
        
        get end() {
            let p0 = new d2.Point(this.pc.x + this.r, this.pc.y);
            p0.rotate((this.startAngle+this.endAngle), this.pc);
            return p0;
        }
        
        get sweep(){
        	return Math.abs(this.endAngle);
        }
        get box(){
          return new d2.Box([this.start,this.end,this.middle]);      	
        }
        contains(pt){
        	//is outside of the circle
        	if (d2.utils.GE(this.pc.distanceTo(pt), this.r)){
                return false;
        	}    
        	let l=new d2.Line(this.pc,this.middle);
        	let projectionPoint=l.projectionPoint(pt);
        	
        	let middle=this.middle;
        	let mid=new d2.Point((this.start.x+this.end.x)/2,(this.start.y+this.end.y)/2);  
        	
        	let dist1=this.middle.distanceTo(mid);
        	let dist2=this.middle.distanceTo(projectionPoint);
        	
        	return d2.utils.GE(dist1,dist2);

        }
        move(offsetX,offsetY){
          this.pc.move(offsetX,offsetY);	
        }
        rotate(angle,center = {x:0, y:0}){
        	 this.pc.rotate(angle,center);
        	 this.startAngle+=angle;
        	 if(this.startAngle>=360){
        		 this.startAngle-=360;
        	 }
        	 if(this.startAngle<0){
        		 this.startAngle+=360; 
        	 }
        }
        mirror(line){
        	this.pc.mirror(line);
        	this.endAngle=-1*this.endAngle;
        	if(line.isVertical){
        		if(this.startAngle>=0&&this.startAngle<=180){
        		  this.startAngle=180-this.startAngle;  
        		}else{
        		  this.startAngle=180+(360-this.startAngle);		
        		}
        	}else{
        		this.startAngle=360-this.startAngle; 
        	}	
        	
        }
        scale(alpha){
           this.pc.scale(alpha);
           this.r*=alpha;
        }
        convert(start,extend){
    		
    		let s = 360 - start;
    		let e=0;
    		if(extend>0){
    		 e = 360 - (start+extend); 
    		}else{
    		 if(start>Math.abs(extend)){  	
    		   e = s+Math.abs(extend); 
    		 }else{
               e = Math.abs(extend+start);   		 
    		 }		 
    		}
    		return  [s,e];
        }
        paint(g2){
        	g2.beginPath();
        	//convert to HTML Canvas API
    		let angles=this.convert(this.startAngle,this.endAngle);
        	g2.arc(this.pc.x,this.pc.y,this.r, d2.utils.radians(angles[0]), d2.utils.radians(angles[1]),this.endAngle>0);        	
        	
        	if(g2._fill!=undefined&&g2._fill){
          	  g2.fill();	
          	}else{
          	  g2.stroke();
          	}
            //let ps=this.start;
            //let pe=this.end;
            //let pm=this.middle;
            //d2.utils.drawCrosshair(g2,5,[ps,pe,pm]);
        }
        

    }
}
});

;require.register("d2/shapes/box.js", function(exports, require, module) {
module.exports = function(d2) {

  d2.Box = class Box {
	  constructor(...args) {
          if (typeof(args[0]) == "number") {   // 4 numbers for min and max points
              this.min = new d2.Point(args[0],args[1]);
              this.max = new d2.Point(args[2],args[3]);
              return;
          }
          
          if(arguments.length==1){              //array of points
        	  let x=Number.MAX_VALUE,y=Number.MAX_VALUE;
        	  for(var i = 0; i < arguments[0].length; ++ i){
        	     x=Math.min(x,arguments[0][i].x);
        	     y=Math.min(y,arguments[0][i].y);
        	  }  
        	  this.min=new d2.Point(x,y);

        	  x=Number.MIN_VALUE,y=Number.MIN_VALUE;
        	  for(var i = 0; i < arguments[0].length; ++ i){
         	     x=Math.max(x,arguments[0][i].x);
         	     y=Math.max(y,arguments[0][i].y);
         	  }  
        	  this.max=new d2.Point(x,y);
        	  return;
          }
	  }
	  static fromRect(x,y,width,height){
			var box=new d2.Box(0,0,0,0);
			box.setRect(x,y,width,height);
			return box;
	  }
	  clone(){
		  return new d2.Box([this.min,this.max]);
	  }
	  get area(){
		 return (this.max.x-this.min.x)*(this.max.y-this.min.y);  
	  }
	  setRect(x,y,width,height){
		  this.min.set(x,y);
		  this.max.set(x+width,y+height);
	  }
      get center() {
          return new d2.Point( (this.min.x + this.max.x)/2, (this.min.y + this.max.y)/2 );
      }
      get x(){
    	 return this.min.x; 
      }
      get y(){
    	  return this.min.y; 
      }
      get width(){
    	  return this.max.x-this.min.x;
      }
      
      get height(){
    	  return this.max.y-this.min.y;
      }
      scale(alpha){
    	this.min.scale(alpha);
    	this.max.scale(alpha);
      }
      contains(...args){
    	if(args.length==1){  //point  
    	  if(this.min.x<=args[0].x&&args[0].x<=this.max.x){
    	    if(this.min.y<=args[0].y&&args[0].y<=this.max.y)
    		  return true;
    	  }
    	  return false;
    	}else{       //coordinates
      	  if(this.min.x<=args[0]&&args[0]<=this.max.x){
      	    if(this.min.y<=args[1]&&args[1]<=this.max.y)
      		  return true;
      	  }
      	  return false;    		
    	}  
      }
      not_intersects(other) {
          return (
              this.max.x < other.min.x ||
              this.min.x > other.max.x ||
              this.max.y < other.min.y ||
              this.min.y > other.max.y
          );
      }
      move(offsetX,offsetY){
    	  this.min.move(offsetX,offsetY);
    	  this.max.move(offsetX,offsetY);
      }
      intersects(other) {
    	  if (other instanceof d2.Box) {
    		  return !this.not_intersects(other);  
    	  }else{
    		  //window rect
    		  let o=new d2.Box(other.x,other.y,other.x+other.width,other.y+other.height);
    		  return !this.not_intersects(o);
    	  }
          
      }
      
	  get vertices() {
		 return [this.min,new d2.Point(this.max.x,this.min.y),this.max,new d2.Point(this.min.x,this.max.y)];	
	  }
      paint(g2){
    	    g2.beginPath();
    	    g2.rect(this.min.x,this.min.y,this.width,this.height);                   
        	  if(g2._fill!=undefined&&g2._fill){
            	  g2.fill();	
              }else{
            	  g2.stroke();
              }
      }
  }
}
});

;require.register("d2/shapes/circle.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Circle = class Circle {
        /**
        *
        * @param {Point} pc - circle center point
        * @param {number} r - circle radius
        */
       constructor(pc, r) {
           this.pc = pc;
           this.r = r;
       }
       clone() {
           return new d2.Circle(this.pc.clone(), this.r);
       } 
       get area(){
           return  ( Math.PI * this.r*this.r );	
       }
       get center() {
           return this.pc;
       }
       get radius(){
    	   return this.r;
       }
       get box() {
           return new d2.Box(
               this.pc.x - this.r,
               this.pc.y - this.r,
               this.pc.x + this.r,
               this.pc.y + this.r
           );
       }
	   get vertices() {
		    return this.box.vertices;	
	   }
       contains(pt){
    	   return d2.utils.LE(pt.distanceTo(this), this.r);    	   
       }
       rotate(angle,center = {x:this.pc.x, y:this.pc.y}){
    	  this.pc.rotate(angle,center);    	  
       }
       move(offX,offY){
    	  this.pc.move(offX,offY); 
       }
       mirror(line){
    	   this.pc.mirror(line);
       }
       scale(alpha){
    	   this.pc.scale(alpha);
    	   this.r*=alpha;
       }
       grow(offset){
     	  this.r+=offset; 
       }
       paint(g2){
       	g2.beginPath();       	
       	g2.arc(this.pc.x,this.pc.y,this.r,0,2*Math.PI,true);
    	  if(g2._fill!=undefined&&g2._fill){
        	  g2.fill();	
          }else{
        	  g2.stroke();
          }
       }       
       
    }
}    
});

;require.register("d2/shapes/fonttext.js", function(exports, require, module) {
var fontmetrics=require('d2/text/fontmetrics');

/*Text Rectangle
*
*                  |-ascent----------------|
*                  |                       |
*       anchorPoint|-----------------------|
*                  |_descent_______________|
*
*
*
*
*
*/
class TextMetrics{
	 constructor() {
		    this.BUG_FONT_SIZE=100;
		    this.updated = false;
	        this.fontSize=-1;
	        this.width=this.height=0;
	        this.descent=0;
	        this.ascent=0;
	        this.xHeight=0;
		 }	
	
updateMetrics() {
       this.updated=false;
       this.fontSize=-1;
}
calculateMetrics(fontSize,text) {
	    if(this.fontSize!=fontSize){
	        this.fontSize=fontSize;
	        this.updated = false;
	    }else{
	       return;	
	    }     
	    
	    var ctx=fontmetrics.getCanvasContext();	    	    
	    	    
        	let metrics = fontmetrics.FontMetrics({
		    	  fontFamily: 'Monospace',
		    	  fontWeight: 'normal',
		    	  fontSize: 10,
		    	  origin: 'baseline'
   	        });
        	
        	ctx.font=""+this.fontSize+"px Monospace";		
            this.width=ctx.measureText(text).width;
            this.xHeight=metrics.xHeight;
    	    this.ascent=Math.abs(metrics.ascent*this.fontSize);
	        this.descent=Math.abs(metrics.descent*this.fontSize);
	        this.height=this.fontSize;	     
	    
	        this.updated=true; 
	    	    
	       	 
}
recalculateMetrics(fontSize,text) {
    this.fontSize=fontSize;    
    var ctx=fontmetrics.getCanvasContext();	    	    
    	    
    	let metrics = fontmetrics.FontMetrics({
	    	  fontFamily: 'Monospace',
	    	  fontWeight: 'normal',
	    	  fontSize: 10,
	    	  origin: 'baseline'
	        });
    	
    	ctx.font=""+this.fontSize+"px Monospace";		
        this.width=ctx.measureText(text).width;
        this.xHeight=metrics.xHeight;
	    this.ascent=Math.abs(metrics.ascent*this.fontSize);
        this.descent=Math.abs(metrics.descent*this.fontSize);
        this.height=this.fontSize;	     
    
        this.updated=true; 	
}
}

module.exports = function(d2) {
	d2.FontText = class FontText{
		constructor(pt,text,fontSize,rotation){
			this.anchorPoint=pt;
			this.text=text;
			this.fontSize=fontSize;
		    this.rotation=rotation;	
		    this.metrics=new TextMetrics();  
		    this.metrics.recalculateMetrics(this.fontSize,this.text);
		}
		clone(){
			let copy=new FontText(this.anchorPoint.clone(),this.text,this.fontSize,this.rotation);		
			return copy;
		}
		setText(text){
			this.text=text;
			this.metrics.recalculateMetrics(this.fontSize,this.text);
		}
		setSize(size){
			this.fontSize=size;
			this.metrics.recalculateMetrics(this.fontSize,this.text);
		}
		scale(alpha){
	      	this.anchorPoint.scale(alpha);
			this.fontSize=parseInt(this.fontSize*alpha);
			this.metrics.recalculateMetrics(this.fontSize,this.text);
			
		}
		setLocation(x,y){
			this.anchorPoint.set(x,y);
		    //this.metrics.recalculateMetrics(this.fontSize, this.text);			
		}
		move(offsetX,offsetY){
			this.anchorPoint.move(offsetX,offsetY);
		    //this.metrics.recalculateMetrics(this.fontSize, this.text);
		}
		rotate(angle, center = {x:this.anchorPoint.x, y:this.anchorPoint.y}) {        	
        	this.anchorPoint.rotate((angle-this.rotation),center);
        	this.rotation=angle;
        	this.metrics.recalculateMetrics(this.fontSize,this.text);
        }
		mirror(line){
		   	
		}
		//anchor point is text center
		get box(){
			let ps=this.anchorPoint.clone();
			ps.move(-(this.metrics.width/2),-(this.metrics.height/2));
			
			let pe=this.anchorPoint.clone();
			pe.move(this.metrics.width/2,this.metrics.height/2);			
			return new d2.Box([ps,pe]);	
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){			   
			
			/*
			 * Based on the assumption that anchorPoint is middle normal aligned
			 */
			
			let ps=this.anchorPoint.clone();
			ps.move(-(this.metrics.width/2),0);
			
			let pe=this.anchorPoint.clone();
			pe.move(this.metrics.width/2,0);
			
			let l=new d2.Line(ps,pe);
			l.rotate(this.rotation,this.anchorPoint);

        	let projectionPoint=l.projectionPoint(pt);
        	
		    let a=(projectionPoint.x-ps.x)/((pe.x-ps.x)==0?1:pe.x-ps.x);
		    let b=(projectionPoint.y-ps.y)/((pe.y-ps.y)==0?1:pe.y-ps.y);

		    let dist=projectionPoint.distanceTo(pt);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(Math.abs(this.metrics.xHeight * (this.fontSize)))){
		        	return true;
		        }    
		    	
		    }
			return false;
			/*	
			 * Based on the assumption that anchorPoint is left normal aligned
				let ps=this.anchorPoint;
				let pe=new d2.Point(ps.x,ps.y);
				pe.move(this.metrics.width,0);
				
				pe.rotate(this.rotation,this.anchorPoint);
				
				let l=new d2.Line(ps,pe);
	        	let projectionPoint=l.projectionPoint(pt);
	        	
			    let a=(projectionPoint.x-ps.x)/((pe.x-ps.x)==0?1:pe.x-ps.x);
			    let b=(projectionPoint.y-ps.y)/((pe.y-ps.y)==0?1:pe.y-ps.y);

			    let dist=projectionPoint.distanceTo(pt);
			    
			    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
			        if(dist<=(Math.abs(this.metrics.xHeight * (this.fontSize)))){
			        	return true;
			        }    
			    	
			    }
	        	*/
        	
		}
		scalePaint(g2,viewportWindow,alpha){
			let scaledAnchorPoint=this.anchorPoint.clone();			
	      	scaledAnchorPoint.scale(alpha);
	      	scaledAnchorPoint.move(-viewportWindow.x,- viewportWindow.y);
			let scaledFontSize=parseInt(this.fontSize*alpha);
			
			
			g2.font = ""+(scaledFontSize)+"px Monospace";
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.save();
			g2.translate(scaledAnchorPoint.x,scaledAnchorPoint.y);
			if(0<=this.rotation&&this.rotation<90){
			  g2.rotate(d2.utils.radians(360-this.rotation));
			}else if(90<=this.rotation&&this.rotation<=180){
			  g2.rotate(d2.utils.radians(180-this.rotation));	
			}else{
			  g2.rotate(d2.utils.radians(360-(this.rotation-180)));	
			}
            //let box=this.box;
            //box.move(-this.anchorPoint.x,-this.anchorPoint.y);
            //box.paint(g2);
            
			g2.fillText(this.text,0,0);				
			g2.restore();
			
		}
		paint(g2){					
			g2.font = ""+(this.fontSize)+"px Monospace";
			g2.textBaseline='middle';
			g2.textAlign='center';
			g2.save();
			g2.translate(this.anchorPoint.x,this.anchorPoint.y);
			if(0<=this.rotation&&this.rotation<90){
			  g2.rotate(d2.utils.radians(360-this.rotation));
			}else if(90<=this.rotation&&this.rotation<=180){
			  g2.rotate(d2.utils.radians(180-this.rotation));	
			}else{
			  g2.rotate(d2.utils.radians(360-(this.rotation-180)));	
			}
            //let box=this.box;
            //box.move(-this.anchorPoint.x,-this.anchorPoint.y);
            //box.paint(g2);
            
			g2.fillText(this.text,0,0);				
			g2.restore();

		}
	}

}
});

;require.register("d2/shapes/hexagon.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Hexagon = class Hexagon extends d2.Polygon {
    	constructor(center,width) {
    		super();
    		this.center=center;
    		this.width=width;    		
    		this.reset();
    	}
    	clone(){
    		let copy=new Hexagon(this.center.clone(),this.width);    	    
    		copy.points=[];
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    		return copy;
    	}
    	scale(alpha){
        	this.center.scale(alpha);
        	this.width*=alpha;  
        	super.scale(alpha);        	              	  
        }    	
		setWidth(width){
			  this.width=width;
			  this.reset();			    
		}
        move(offsetX,offsetY){
        	this.center.move(offsetX,offsetY);
            this.points.forEach(point=>{
            	point.move(offsetX,offsetY);
            });	
        }
		rotate(angle,center = {x:this.center.x, y:this.center.y}){
			this.center.rotate(angle,center);
			super.rotate(angle,center);
		}        
    	reset(){
    		this.points=[];
    		
            let da = (2 * Math.PI) / 6;
            let lim = (2 * Math.PI) - (da / 2);

            let r=this.width/2;
            var point=new d2.Point(r * Math.cos(0), r * Math.sin(0));
            point.move(this.center.x,this.center.y);            
            this.add(point);
			for (let a = da; a < lim; a += da) {
                point=new d2.Point(r * Math.cos(a),r * Math.sin(a));
                point.move(this.center.x,this.center.y);
                this.add(point);
			}      		
    	}
   	
    	
    	
    }
}
});

;require.register("d2/shapes/line.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Line = class Line{
		constructor(p1,p2) {
			this.p1=p1;
			this.p2=p2;
		}
	    /*
	     * Find point belonging to line, which the pt projects on.
	     */
		projectionPoint(pt){
			let v1=new d2.Vector(this.p1,pt);
			let v2=new d2.Vector(this.p1,this.p2); 	
		    
			let v=v1.projectionOn(v2);
	    	//translate point
			let x=this.p1.x +v.x;
			let y=this.p1.y +v.y;
		    return new d2.Point(x,y);
		}
		get isHorizontal(){
			let v=new d2.Vector(this.p1,this.p2);
			let oy=new d2.Vector(1,0);
			//are they colinear?
			return d2.utils.EQ(v.cross(oy),0);			
		}
		get isVertical(){
			let v=new d2.Vector(this.p1,this.p2);
			let oy=new d2.Vector(0,1);
			//are they colinear?
			return d2.utils.EQ(v.cross(oy),0);
		}
        rotate(angle,center){            
            this.p1.rotate(angle,center);
            this.p2.rotate(angle,center);            
        }
        
		paint(g2){			
			g2.moveTo(this.p1.x, this.p1.y);
			g2.lineTo(this.p2.x, this.p2.y);
			
			g2.stroke();
		}
	
	}
}
});

;require.register("d2/shapes/obround.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Obround = class Obround{
		/**
		 * Obround is regarded as a line with variable thickness
		 * @input pt - center 
		 * @input width - relative,  line width + 2  arcs at both ends
		 * this.width=ps to pe + 2 rcs radius
		 * @input height - relative but still height
		 * @warning obround may change its width and height - it should recalculate its size
		 */
		constructor(pt,width,height) {
			this.pc=pt.clone();
			this.width=width;
			this.height=height;
			this.ps;
			this.pe;
			this.reset();
		}
		clone(){
			let copy=new Obround(this.pc,this.width,this.height);
			copy.ps.x=this.ps.x;
			copy.ps.y=this.ps.y;
			
			copy.pe.x=this.pe.x;
			copy.pe.y=this.pe.y;
			return copy;
		}
		get box(){
			 return new d2.Box(
		                Math.min(this.ps.x, this.pe.x),
		                Math.min(this.ps.y, this.pe.y),
		                Math.max(this.ps.x, this.pe.x),
		                Math.max(this.ps.y, this.pe.y)
		            );			
		}
		setWidth(width){
			this.width=width;	
			this.reset();
		}
		setHeight(height){
		    this.height=height;
		    this.reset();
		}
		/**
		if (x-x1)/(x2-x1) = (y-y1)/(y2-y1) = alpha (a constant), then the point C(x,y) will lie on the line between pts 1 & 2.
		If alpha < 0.0, then C is exterior to point 1.
		If alpha > 1.0, then C is exterior to point 2.
		Finally if alpha = [0,1.0], then C is interior to 1 & 2.
		*/
		contains(pt){			
			let l=new d2.Line(this.ps,this.pe);
        	let projectionPoint=l.projectionPoint(pt);
			
		    let a=(projectionPoint.x-this.ps.x)/((this.pe.x-this.ps.x)==0?1:this.pe.x-this.ps.x);
		    let b=(projectionPoint.y-this.ps.y)/((this.pe.y-this.ps.y)==0?1:this.pe.y-this.ps.y);
		    
		    let dist=projectionPoint.distanceTo(pt);
		    //arc diameter
		    let r=(this.width>this.height?this.height:this.width);
		    
		    if(0<=a&&a<=1&&0<=b&&b<=1){  //is projection between start and end point
		        if(dist<=(r/2)){
		        	return true;
		        }    
		    	
		    }
        	
		    //check the 2 circles
        	if (d2.utils.LE(this.ps.distanceTo(pt), r/2)){
                return true;
        	}
        	if (d2.utils.LE(this.pe.distanceTo(pt), r/2)){
                return true;
        	}
        	return false;
		    
		}
		get center(){
			return this.pc;
		}		
		reset(){
			let w=0,h=0;
			if(this.width>this.height){  //horizontal
			  w=this.width;
			  h=this.height;
   			  let d=(w-h);//always positive
			  this.ps=new d2.Point(this.pc.x-(d/2),this.pc.y);
			  this.pe=new d2.Point(this.pc.x+(d/2),this.pc.y);								   	
			}else{						 //vertical
			  w=this.height;
			  h=this.width;
  			  let d=(w-h);//always positive
			  this.ps=new d2.Point(this.pc.x,this.pc.y-(d/2));
			  this.pe=new d2.Point(this.pc.x,this.pc.y+(d/2));								   				  
			}
		}
    	rotate(angle,center = {x:this.pc.x, y:this.pc.y}){
    	   this.pc.rotate(angle,center);
      	   this.ps.rotate(angle,center);
      	   this.pe.rotate(angle,center);      	   
      	}
    	scale(alpha){
      	  this.pc.scale(alpha);
      	  this.ps.scale(alpha);
      	  this.pe.scale(alpha);
      	  this.width*=alpha;
      	  this.height*=alpha;
      	  
      	}
        move(offsetX,offsetY){
            this.pc.move(offsetX,offsetY);
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);
        }  
	    grow(offset){
			if(this.width>=this.height){
			  this.height+=2*offset;
			}else{
			  this.width+=2*offset;
			}
	    }
		paint(g2){
			g2.beginPath();
			let l=g2.lineWidth;
			if(this.width>=this.height)
			  g2.lineWidth =this.height;
			else
			  g2.lineWidth =this.width;
			
			g2.lineCap="round";
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();		    
			g2.lineWidth =l;
		}
			
	}
}
});

;require.register("d2/shapes/oval.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Oval = class Oval extends d2.Rectangle{
		constructor(p1,width,height) {
		  super(p1,width,height);	
		  this.width=0;
		  this.height=0;
		  this.arc=0;
		  this.segments=[];
	      this.arcs=[];
	         
		  this.setWidth(width);
		  this.setHeight(height);
		  
		  this.reset();
		}
        createArc(center, start, end){
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            
            let r = (new d2.Vector(center, start)).length;
            return new d2.Arc(center, r, startAngle, 180);        	
        }
        findArcPoints(p1,p2,p3,p4){
    		  let pt=p1;
      		  let v=new d2.Vector(pt,p2);
      		  let norm=v.normalize();  		  
      		  let x=pt.x +(this.arc/2)*norm.x;
      		  let y=pt.y + (this.arc/2)*norm.y;  			
      		  let A=new d2.Point(x,y);
      		  
    		  //end angle point 
   		      pt=p4;
   		      v=new d2.Vector(pt,p3);
   		      norm=v.normalize();		  
   		      x=pt.x +(this.arc/2)*norm.x;
   		      y=pt.y +(this.arc/2)*norm.y;			
   		      let B=new d2.Point(x,y);		  		  
   		   
   		   
   		      //center is the mid point
   		      let C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
   		   
              return [C,A,B];   		     
        }
        //****TEST************
        eval(g2){
      //*********************LEFT****************************  	
  		  //start angle point
//  		  let pt=this.points[0];
//  		  let v=new d2.Vector(pt,this.points[1]);
//  		  let norm=v.normalize();  		  
//  		  let x=pt.x +(this.arc/2)*norm.x;
//  		  let y=pt.y + (this.arc/2)*norm.y;  			
//  		  let A=new d2.Point(x,y);    
//  		  //d2.utils.drawCrosshair(g2,10,[A]);
//  		  
//  		  
//		  //end angle point 
//		   pt=this.points[3];
//		   v=new d2.Vector(pt,this.points[2]);
//		   norm=v.normalize();		  
//		   x=pt.x +(this.arc/2)*norm.x;
//		   y=pt.y +(this.arc/2)*norm.y;			
//		   let B=new d2.Point(x,y);		  		  
//		   //d2.utils.drawCrosshair(g2,10,[B]);
//		   
//		   //center is the mid point
//		   let C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
//		   //d2.utils.drawCrosshair(g2,10,[C]);
//		     
//		   let arc=this.createArc(C,A,B);
//		   arc.paint(g2);
		   
			let r=this.findArcPoints(this.points[0],this.points[1],this.points[2],this.points[3]);  
			let arc=this.createArc(r[0],r[1],r[2]);			
			arc.paint(g2);	
       //************************RIGHT************************
//	  		  //start angle point
//	  		 pt=this.points[1];
//	  		 v=new d2.Vector(pt,this.points[0]);
//	  		 norm=v.normalize();  		  
//	  		 x=pt.x +(this.arc/2)*norm.x;
//	  		 y=pt.y + (this.arc/2)*norm.y;  			
//	  		 A=new d2.Point(x,y);    
//	  		 //d2.utils.drawCrosshair(g2,10,[A]);
//	  		  
//	  		  
//			  //end angle point 
//			   pt=this.points[2];
//			   v=new d2.Vector(pt,this.points[3]);
//			   norm=v.normalize();		  
//			   x=pt.x +(this.arc/2)*norm.x;
//			   y=pt.y +(this.arc/2)*norm.y;			
//			   B=new d2.Point(x,y);		  		  
//			   //d2.utils.drawCrosshair(g2,10,[B]);
//			   
//			   //center is the mid point			  			   
//			   C=new d2.Point((A.x+B.x)/2,(A.y+B.y)/2);
//			   //d2.utils.drawCrosshair(g2,10,[C]);
//			     
//			   arc=this.createArc(C,B,A);
//			   arc.paint(g2);		   
		   
			r=this.findArcPoints(this.points[1],this.points[0],this.points[3],this.points[2]);  
			arc=this.createArc(r[0],r[2],r[1]);			
			arc.paint(g2);
		   
        }
        resize(offX,offY,point){
    		super.resize(offX,offY,point);
    		this.reset(); 	
        }
		reset(){
			 this.segments=[];
	         this.arcs=[];
			 //segments 
	         let top=new d2.Segment(0,0,0,0);
	    	 this.segments.push(top);
	    	   
	    	 let bottom=new d2.Segment(0,0,0,0);
	    	 this.segments.push(bottom);
	    	 
	    	 
	    	 
	         //arcs
			 let r=this.findArcPoints(this.points[0],this.points[1],this.points[2],this.points[3]);  
			 this.arcs.push(this.createArc(r[0],r[1],r[2]));			
			 top.ps=r[1].clone();
			 bottom.ps=r[2].clone();  	
				
			 r=this.findArcPoints(this.points[1],this.points[0],this.points[3],this.points[2]);  
			 this.arcs.push(this.createArc(r[0],r[2],r[1]));	
			 top.pe=r[1].clone();
			 bottom.pe=r[2].clone();  	
			  
				
        }
        
        setWidth(width) {
            this.width=width;
            if (width < this.height) {
                this.arc = width;
            } else {
                this.arc = this.height;
            }
        }

        setHeight(height) {
            this.height=height;
            if (height < this.width) {
                this.arc =this.height;
            } else {
                this.arc = this.width;
            }
        }
    	rotate(angle,center = {x:0, y:0}){
     	   super.rotate(angle,center);
     	   this.reset();    	
     	}
    	mirror(line){
    	   super.mirror(line);
    	   this.reset();
			this.arcs.forEach(arc=>{
				arc.endAngle=-1*arc.endAngle;
			});  
    	}
    	scale(alpha){
    	  super.scale(alpha);
    	  this.reset();
    	}
        paint(g2){	
			this.segments.forEach(segment=>{
				segment.paint(g2);
			});
			
			this.arcs.forEach(arc=>{
				arc.paint(g2);
			});  			
			
        }
	}
	
}	
});

;require.register("d2/shapes/point.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Point = class Point{
		constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new d2.Point(this.x, this.y);
        }
        set(...args){
           if(args.length==1){//point
             this.x=args[0].x;
             this.y=args[0].y;
           }else{	   //coordinates
            this.x=args[0];
            this.y=args[1];
           }
        }
		translate(vec) {       
		       this.x += vec.x;
		       this.y += vec.y;
		    }
		
		scale(alpha){
		       this.x *=alpha;
		       this.y *=alpha;		  		
		}
        /**
         * rotates by given angle around given center point.
         * If center point is omitted, rotates around zero point (0,0).
         * Positive value of angle defines rotation in counter clockwise direction,
         * negative angle defines rotation in clockwise clockwise direction
         * @param {number} angle - angle in degrees
         * @param {Point} [center=(0,0)] center
         */
		rotate(angle, center = {x:0, y:0}) {
			    
		        let a=-1*d2.utils.radians(angle);		        
			    let x_rot = center.x + (this.x - center.x) * Math.cos(a) - (this.y - center.y) * Math.sin(a);
		        let y_rot = center.y + (this.x - center.x) * Math.sin(a) + (this.y - center.y) * Math.cos(a);
	            
		        this.x=x_rot;
		        this.y=y_rot;
		    }
		move(offsetX,offsetY){
	        this.x+=offsetX;
	        this.y+=offsetY;	
		}   
		/*
		 * Mirror point around horizontal or vertical line
		 */
		mirror(line){
		 let prj=line.projectionPoint(this);
		 let v=new d2.Vector(this,prj);
		 prj.translate(v); 
		 this.x=prj.x;
		 this.y=prj.y;	
		}
		distanceTo(shape) {
		        if (shape instanceof d2.Point) {
		            let dx = shape.x - this.x;
		            let dy = shape.y - this.y;
		            return Math.sqrt(dx*dx + dy*dy);
		        }	
	            if (shape instanceof d2.Circle) {
		            let dx = shape.center.x - this.x;
		            let dy = shape.center.y - this.y;
		            return Math.sqrt(dx*dx + dy*dy);	               
	            }
		}
        equals(pt) {
            return d2.utils.EQ(this.x, pt.x) && d2.utils.EQ(this.y, pt.y);
        }
        toString(){
           return this.x+","+this.y;	
        }
		paint(g2){
		  d2.utils.drawCrosshair(g2,10,[this]);
		}
	}

}
});

;require.register("d2/shapes/polygon.js", function(exports, require, module) {
module.exports = function(d2) {

    d2.Polygon = class Polygon {
    	constructor() {
    		this.points=[];
    	}
    	clone(){
    	    let copy=new d2.Polygon();
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    	    return copy;	
    	}
    	add(point){
    	    this.points.push(point);	
    	}
        contains(...args){
          let x=0;
          let y=0;

       	  if(args.length==1){//point
                x=args[0].x;
                y=args[0].y;
          }else{	   //coordinates
               x=args[0];
               y=args[1];
          }	
      	  let inside = false;
          // use some raycasting to test hits
          // https://github.com/substack/point-in-polygon/blob/master/index.js
          
    	  //flat out points
    	  let p = [];

          for (let i = 0, il = this.points.length; i < il; i++)
          {
              p.push(this.points[i].x, this.points[i].y);
          }

    	  
    	  let length = p.length / 2;

          for (let i = 0, j = length - 1; i < length; j = i++)
          {
              let xi = p[i * 2];
              let yi = p[(i * 2) + 1];
              let xj = p[j * 2];
              let yj = p[(j * 2) + 1];
              let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);

              if (intersect)
              {
                  inside = !inside;
              }
          }

          return inside;   	   
        }
        move(offsetX,offsetY){
            this.points.forEach(point=>{
            	point.move(offsetX,offsetY);
            });	
        }
        mirror(line){
        	this.points.forEach(point=>{
            	point.mirror(line);
            });        	
        }
        scale(alpha){
            this.points.forEach(point=>{
            	point.scale(alpha);
            });        	
        }
        rotate(angle,center = {x:0, y:0}){
            this.points.forEach(point=>{
            	point.rotate(angle,center);
            });
        }
        get box(){
          return new d2.Box(this.points);	
        }
		get vertices() {
		    return this.points;	
		}        
        paint(g2){
	    	g2.beginPath();
	    	g2.moveTo(this.points[0].x,this.points[0].y);
	    	for (var i = 1; i < this.points.length; i++) {
	    						g2.lineTo(this.points[i].x, this.points[i].y);
	    	}
	    	g2.closePath();                    
	    	if(g2._fill!=undefined&&g2._fill){
	        	  g2.fill();	
	        }else{
	        	  g2.stroke();
	        }
        }
    }
}
});

;require.register("d2/shapes/polyline.js", function(exports, require, module) {
module.exports = function(d2) {
	d2.Polyline = class{
	   constructor(){
		 this.points = [];
		   
	   }
   	   clone(){
   			let copy=new d2.Polyline();
   			this.points.forEach(function(point){
   				copy.points.push(point.clone());
   			});  
   			return copy;	
   	   }
   	   remove(x,y){
       	let item=new d2.Point(x,y);
   		var tempArr = this.points.filter(function(point) { 
    	    return ! point.equals(item);
    	});
   		this.points=tempArr;
   	   }
	   add(...args){
          if(args.length==1){//point               
               this.points.push(new d2.Point(args[0].x,args[0].y));  
          }else{	   //coordinates             
             this.points.push(new d2.Point(args[0],args[1]));              
          }		   
		 
	   }
       move(offsetX,offsetY){
           this.points.forEach(point=>{
           	point.move(offsetX,offsetY);
           });	
       }
       mirror(line){
       	this.points.forEach(point=>{
           	point.mirror(line);
           });        	
       }
       scale(alpha){
           this.points.forEach(point=>{
           	point.scale(alpha);
           });        	
       }
       rotate(angle,center = {x:0, y:0}){
           this.points.forEach(point=>{
           	point.rotate(angle,center);
           });
       }
       get box(){
         return new d2.Box(this.points);	
       }
		get vertices() {
		    return this.points;	
		} 	   
	   paint(g2){		
		  g2.beginPath();
		  g2.moveTo(this.points[0].x, this.points[0].y);
		  
 		  this.points.forEach((point)=>{
			 g2.lineTo(point.x, point.y); 			  
 		  });
		  

		  g2.stroke();
	   }
	   
	}
	
}
});

;require.register("d2/shapes/rectangle.js", function(exports, require, module) {
module.exports = function(d2) {
	/*
	 * rectangle is represented by 4 points
	 */
	d2.Rectangle = class Rectangle extends d2.Polygon{
		constructor(...args) {
			super();
			if(args.length==3){     //***topleft point,width,height
			  let p1=args[0];
			  let width=args[1];
			  let height=args[2];
			  
			  this.points.push(p1.clone());     
			  this.points.push(new d2.Point(p1.x+width,p1.y));
			  this.points.push(new d2.Point(p1.x+width,p1.y+height));
			  this.points.push(new d2.Point(p1.x,p1.y+height));
			}
			if(args.length==4){	  //***x,y,width,height
				  let p1=new d2.Point(args[0],args[1]);
				  let width=args[2];
				  let height=args[3];
				  
				  this.points.push(p1);     
				  this.points.push(new d2.Point(p1.x+width,p1.y));
				  this.points.push(new d2.Point(p1.x+width,p1.y+height));
				  this.points.push(new d2.Point(p1.x,p1.y+height));				
			}
		}
		clone(){
    	    let copy=new d2.Rectangle(new d2.Point(0,0),0,0);
    	    copy.points=[];
    	    this.points.forEach(function(point){
    	    	copy.points.push(point.clone());
    	    });  
    	    return copy;
		}
		get area(){
			return (this.points[0].distanceTo(this.points[1]))*(this.points[1].distanceTo(this.points[2]));
		}
		reset(width,height){
			let pc=this.box.center;			
			this.points=[];
			this.points.push(new d2.Point(pc.x-(width/2),pc.y-(height/2)));     //topleft point
			this.points.push(new d2.Point(pc.x+(width/2),pc.y-(height/2)));
			this.points.push(new d2.Point(pc.x+(width/2),pc.y+(height/2)));
			this.points.push(new d2.Point(pc.x-(width/2),pc.y+(height/2)));						
		}
		setSize(width,height){
		  this.reset(width,height);			    
		}
		setRect(x,y,width,height){						  
			  this.points[0].set(x,y);			  
			  this.points[1].set(x+width,y);
			  this.points[2].set(x+width,y+height);
			  this.points[3].set(x,y+height);									
		}
		createArc(center, start, end) {
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            
            if (d2.utils.EQ(startAngle, endAngle)) {
                endAngle = 360;
            }
            let r = (new d2.Vector(center, start)).length;
            return new d2.Arc(center, r, startAngle, 90);
        }
        //****TEST************
		eval(g2){
		  //start angle point
//		  let pt=this.points[0];
//		  let v=new d2.Vector(pt,this.points[1]);
//		  let norm=v.normalize();
//		  
//		  let x=pt.x +this.rounding*norm.x;
//		  let y=pt.y + this.rounding*norm.y;
//			
//		  let A=new d2.Point(x,y);
//		  
//		  //d2.utils.drawCrosshair(g2,10,[A]);
//			
//		  //end angle point 
//		   pt=this.points[0];
//		   v=new d2.Vector(pt,this.points[3]);
//		   norm=v.normalize();
//		  
//		   x=pt.x +this.rounding*norm.x;
//		   y=pt.y + this.rounding*norm.y;
//			
//		   let A1=new d2.Point(x,y);
//		  
//		  
//		  // d2.utils.drawCrosshair(g2,10,[A1]);
//		   
//		   //center
//		   v=new d2.Vector(pt,A1);
//		   
//		   x=A.x +v.x;
//		   y=A.y +v.y;
//		   
//		   let C=new d2.Point(x,y);
//		   //d2.utils.drawCrosshair(g2,10,[C]);
			
		   let r=this.findArcPoints(this.points[0],this.points[1],this.points[3]);
		   let arc=this.createArc(r[0],r[1],r[2]);
		   arc.paint(g2);
		   //----------------------RT-------------------------------------
//			//start angle point
//			let pt=this.points[1];
//			let v=new d2.Vector(pt,this.points[2]);
//			let norm=v.normalize();
//			  
//			let x=pt.x +this.rounding*norm.x;
//			let y=pt.y + this.rounding*norm.y;
//				
//			let A=new d2.Point(x,y);
//			  
//			//d2.utils.drawCrosshair(g2,10,[A]);
//			
//			  //end angle point 
//			pt=this.points[1];
//			v=new d2.Vector(pt,this.points[0]);
//			norm=v.normalize();
//			  
//			x=pt.x +this.rounding*norm.x;
//			y=pt.y + this.rounding*norm.y;
//				
//			let A1=new d2.Point(x,y);
//			  
//			  
//			//d2.utils.drawCrosshair(g2,10,[A1]);
//			   //center
//			v=new d2.Vector(pt,A1);
//			   
//			x=A.x +v.x;
//			y=A.y +v.y;
//			   
//			let C=new d2.Point(x,y);
//			//d2.utils.drawCrosshair(g2,10,[C]);
		    
		    r=this.findArcPoints(this.points[1],this.points[2],this.points[0]);   
			arc=this.createArc(r[0],r[1],r[2]);
			arc.paint(g2);	
/*
			//----------------------RB-------------------------------------
			//start angle point
			pt=this.points[2];
			v=new d2.Vector(pt,this.points[1]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A=new d2.Point(x,y);
			  
			//d2.utils.drawCrosshair(g2,10,[A]);			
			  //end angle point 
			pt=this.points[2];
			v=new d2.Vector(pt,this.points[3]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A1=new d2.Point(x,y);			  			  
			//d2.utils.drawCrosshair(g2,10,[A1]);		
			
			   //center
			v=new d2.Vector(pt,A1);			   
			x=A.x +v.x;
			y=A.y +v.y;
			   
			C=new d2.Point(x,y);
			//d2.utils.drawCrosshair(g2,10,[C]);			
*/			
			r=this.findArcPoints(this.points[2],this.points[3],this.points[1]);  
			arc=this.createArc(r[0],r[1],r[2]);
			arc.paint(g2);	
/*			
			//----------------------LB-------------------------------------
			//start angle point
			pt=this.points[3];
			v=new d2.Vector(pt,this.points[2]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A=new d2.Point(x,y);
			  
			//d2.utils.drawCrosshair(g2,10,[A]);
			  //end angle point 
			pt=this.points[3];
			v=new d2.Vector(pt,this.points[0]);
			norm=v.normalize();
			  
			x=pt.x +this.rounding*norm.x;
			y=pt.y + this.rounding*norm.y;
				
			A1=new d2.Point(x,y);			  			  
			//d2.utils.drawCrosshair(g2,10,[A1]);				
			   //center
			v=new d2.Vector(pt,A1);			   
			x=A.x +v.x;
			y=A.y +v.y;
			   
			C=new d2.Point(x,y);
			//d2.utils.drawCrosshair(g2,10,[C]);			
*/			
			r=this.findArcPoints(this.points[3],this.points[0],this.points[2]);  
			arc=this.createArc(r[0],r[1],r[2]);			
			arc.paint(g2);	
	
		}
        /**
        *
        * @param {Point} p1 corner point
        * @param {Point} p2 left point
        * @param {Point} p3 right point   
        * @returns {array of arc points[center,start point,end point]}           
        */
		findArcPoints(p1,p2,p3){
			  //start angle point
			  //let pt=this.points[0];
			  let v=new d2.Vector(p1,p2);
			  let norm=v.normalize();
			  
			  let x=p1.x +this.rounding*norm.x;
			  let y=p1.y + this.rounding*norm.y;
				
			  let A=new d2.Point(x,y);
			  
			  //d2.utils.drawCrosshair(g2,10,[A]);
				
			  //end angle point 
			   //pt=this.points[0];
			   v=new d2.Vector(p1,p3);
			   norm=v.normalize();
			  
			   x=p1.x +this.rounding*norm.x;
			   y=p1.y + this.rounding*norm.y;
				
			   let A1=new d2.Point(x,y);
			  
			  
			  // d2.utils.drawCrosshair(g2,10,[A1]);
			   
			   //center
			   v=new d2.Vector(p1,A1);
			   
			   x=A.x +v.x;
			   y=A.y +v.y;
			   
			   let C=new d2.Point(x,y);
			   //d2.utils.drawCrosshair(g2,10,[C]);
			   
			   return [C,A,A1];
			   			
		}
		resize(offX,offY,point){
			if(point==this.points[2]){
	    	//do same
				let pt=this.points[2];
				pt.move(offX,offY);
	    	//do left 
				let v1=new d2.Vector(this.points[0],pt);
				let v2=new d2.Vector(this.points[0],this.points[1]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[1].x=this.points[0].x +v.x;
				this.points[1].y=this.points[0].y + v.y;
	    	
	    	//do right 
				v2=new d2.Vector(this.points[0],this.points[3]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[3].x=this.points[0].x +v.x;
				this.points[3].y=this.points[0].y + v.y;
	    	
	    	
			}else if(point==this.points[1]){
		    	//do same
				let pt=this.points[1];
				pt.move(offX,offY);

	    		    	//do left 
				let v1=new d2.Vector(this.points[3],pt);
				let v2=new d2.Vector(this.points[3],this.points[0]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[0].x=this.points[3].x +v.x;
				this.points[0].y=this.points[3].y + v.y;
	    	//do right 
				v2=new d2.Vector(this.points[3],this.points[2]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[2].x=this.points[3].x +v.x;
				this.points[2].y=this.points[3].y + v.y;				
			}else if(point==this.points[3]){
		    	//do same
				let pt=this.points[3];
				pt.move(offX,offY);		
				
		    	//do left 
				let v1=new d2.Vector(this.points[1],pt);
				let v2=new d2.Vector(this.points[1],this.points[0]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[0].x=this.points[1].x +v.x;
				this.points[0].y=this.points[1].y + v.y;
				
		    	//do right 
				v2=new d2.Vector(this.points[1],this.points[2]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[2].x=this.points[1].x +v.x;
				this.points[2].y=this.points[1].y + v.y;
			}else{
		    	//do same
				let pt=this.points[0];
				pt.move(offX,offY);		
				
		    	//do left 
				let v1=new d2.Vector(this.points[2],pt);
				let v2=new d2.Vector(this.points[2],this.points[1]);
	    	
				let v=v1.projectionOn(v2);
	    	//translate point
				this.points[1].x=this.points[2].x +v.x;
				this.points[1].y=this.points[2].y + v.y;
				
		    	//do right 
				v2=new d2.Vector(this.points[2],this.points[3]);
	    	
				v=v1.projectionOn(v2);
	    	//translate point
				this.points[3].x=this.points[2].x +v.x;
				this.points[3].y=this.points[2].y + v.y;				
			}
	    	
		}
	    grow(offset){
	    	let copy=this.clone();
	    	//left
	    	let v=new d2.Vector(copy.points[1],copy.points[0]);
	    	let p=copy.points[0].clone();
	    	let norm=v.normalize();
	    	let x=p.x+offset*norm.x;
	    	let y=p.y+offset*norm.y;
	    	
	    	let a=new d2.Vector(p,new d2.Point(x,y));
	    	
	    	 v=new d2.Vector(copy.points[3],copy.points[0]);
	    	 norm=v.normalize();
	    	 x=p.x+offset*norm.x;
	    	 y=p.y+offset*norm.y;
			
	    	 
	    	 let b=new d2.Vector(p,new d2.Point(x,y));
	    	 let c=a.add(b);
	    	 let length=c.length;
	    	 
	    	 
	    	 norm=c.normalize();
	    	 x=p.x+length*norm.x;
	    	 y=p.y+length*norm.y;
	    	 
	    	 this.points[0].set(x,y);
	    	
	    	 //right
		     v=new d2.Vector(copy.points[0],copy.points[1]);
		     p=copy.points[1].clone();
		     norm=v.normalize();
		     x=p.x+offset*norm.x;
		     y=p.y+offset*norm.y;
		    	
		     a=new d2.Vector(p,new d2.Point(x,y));
		    	
		     v=new d2.Vector(copy.points[2],copy.points[1]);
		     norm=v.normalize();
		     x=p.x+offset*norm.x;
		     y=p.y+offset*norm.y;

				    
		     b=new d2.Vector(p,new d2.Point(x,y));
		     c=a.add(b);
		     length=c.length;
		    	 
		    	 
		     norm=c.normalize();
		     x=p.x+length*norm.x;
		     y=p.y+length*norm.y;
		    	 
		     this.points[1].set(x,y);
	    	 
	    	 //bottom right
		     v=new d2.Vector(copy.points[1],copy.points[2]);
		     p=this.points[2].clone();
		     norm=v.normalize();
		     x=p.x+offset*norm.x;
		     y=p.y+offset*norm.y;
		    	
		     a=new d2.Vector(p,new d2.Point(x,y));
		    	
		    	
		     v=new d2.Vector(copy.points[3],copy.points[2]);
		     norm=v.normalize();
		     x=p.x+offset*norm.x;
		     y=p.y+offset*norm.y;
		    				 
				    
		     b=new d2.Vector(p,new d2.Point(x,y));
		     c=a.add(b);
		     length=c.length;
		    	 
		    	 
		     norm=c.normalize();
		     x=p.x+length*norm.x;
		     y=p.y+length*norm.y;
		    	 
		     this.points[2].set(x,y);
		     
	    	 //bottom left
		     v=new d2.Vector(copy.points[0],copy.points[3]);
		     p=copy.points[3].clone();
		     norm=v.normalize();
		     x=p.x+offset*norm.x;
		     y=p.y+offset*norm.y;
		    	
		     a=new d2.Vector(p,new d2.Point(x,y));
		    	
		    	
		     v=new d2.Vector(copy.points[2],copy.points[3]);
		     norm=v.normalize();
		     x=p.x+offset*norm.x;
		     y=p.y+offset*norm.y;
		    				 
				    
		     b=new d2.Vector(p,new d2.Point(x,y));
		     c=a.add(b);
		     length=c.length;
		    	 
		    	 
		     norm=c.normalize();
		     x=p.x+length*norm.x;
		     y=p.y+length*norm.y;
		    	 
		     this.points[3].set(x,y);		     
	    }
		intersects(r) {
			let box=this.box;	
	    // calculate the left common area coordinate:
			let left = Math.max( box.min.x, r.x );
	    // calculate the right common area coordinate:
			let right  = Math.min( box.min.x +box.width, r.x + r.width );
	    // calculate the upper common area coordinate:
			let top    = Math.max( box.min.y,r.y );
	    // calculate the lower common area coordinate:
			let bottom = Math.min( box.min.y +box.height, r.y + r.height );
	
	    // if a common area exists, it must have a positive (null accepted) size
			if( left <= right && top <= bottom )
				return true;
			else
				return false;			  	    
		
		}
		
	    contains(...args){
	      	if(args.length==1){  //point  
	      	  return super.contains(args[0]);
	      	}else{       //coordinates
	      	  return super.contains({x:args[0],y:args[1]});    		
	      	}  
	    }
		rotate(angle,center = {x:this.box.center.x, y:this.box.center.y}){
			super.rotate(angle,center);
		}
		get box(){
			return super.box;
		}
		get center(){
			return super.box.center;
		}
		get vertices() {
		    return this.points;	
		}
		paint(g2){
	    	g2.beginPath();
	    	g2.moveTo(this.points[0].x,this.points[0].y);
	    	for (var i = 1; i < this.points.length; i++) {
	    						g2.lineTo(this.points[i].x, this.points[i].y);
	    	}
	    	g2.closePath();                    
	    	if(g2._fill!=undefined&&g2._fill){
	        	  g2.fill();	
	        }else{
	        	  g2.stroke();
	        }
		}
	}

}
});

;require.register("d2/shapes/roundrectangle.js", function(exports, require, module) {
module.exports = function(d2) {
    /*
     * Round rectangle is represented by 4 segments and 4 arcs
     */
    d2.RoundRectangle = class RoundRectangle  extends d2.Rectangle{
    	constructor(p1,width,height,rounding) {
    		super(p1,width,height);
    		this.p1=p1;
    		this.width=width;
    		this.height=height;
    		this.rounding=rounding;
    		this.segments=[];
    		this.arcs=[];    		
    		this.reset();
    	}
    	clone(){
    		let copy=new d2.RoundRectangle(new d2.Point(),0,0,this.rounding);
    		copy.points=[];
    		this.points.forEach(point=>{
    			copy.points.push(point.clone());
    		});
    		copy.reset();
    		return copy;
    	}
    	setPoints(points){
    	   this.points=[];
    	   this.points=points;
    	   this.reset();
    	}
    	setRect(x,y,width,height,rounding){
    		super.setRect(x,y,width,height);
    		this.rounding=rounding;
    		this.p1.set(x,y);
    		this.width=width;
    		this.height=height;
    		this.reset();
    	}    	
        /**
         * Create specific rounding arc 90 degrees long
         * @param center of the arc
         * @param start angle point
         * @param end angle point
         */
    	createArc(center, start, end) {
            let startAngle =360 -(new d2.Vector(center,start)).slope;
            let endAngle = (new d2.Vector(center, end)).slope;
            if (d2.utils.EQ(startAngle, endAngle)) {
                endAngle = 360;
            }
            let r = (new d2.Vector(center, start)).length;           
            return new d2.Arc(center, r, startAngle, 90);
        }
        /**
        *
        * @param {Point} p1 corner point
        * @param {Point} p2 left point
        * @param {Point} p3 right point   
        * @returns {array of arc points[center,start point,end point]}           
        */
		findArcPoints(p1,p2,p3){
			  //start angle point
			  let v=new d2.Vector(p1,p2);
			  let norm=v.normalize();			  
			  let x=p1.x +this.rounding*norm.x;
			  let y=p1.y + this.rounding*norm.y;				
			  let A=new d2.Point(x,y);

				
			  //end angle point 
			   v=new d2.Vector(p1,p3);
			   norm=v.normalize();			  
			   x=p1.x +this.rounding*norm.x;
			   y=p1.y + this.rounding*norm.y;				
			   let B=new d2.Point(x,y);
			   
			   //center
			   v=new d2.Vector(p1,B);			   
			   x=A.x +v.x;
			   y=A.y +v.y;			   
			   let C=new d2.Point(x,y);
			   
			   return [C,A,B];
			   			
		}
    	reset(){
		 this.segments=[];
         this.arcs=[];
            
    	 if(this.rounding==0){
      	   let top=new d2.Segment(this.points[0],this.points[1]);
    	   this.segments.push(top);
    	   
    	   let right=new d2.Segment(this.points[1],this.points[2]);
    	   this.segments.push(right);

    	   let bottom=new d2.Segment(this.points[2],this.points[3]);
    	   this.segments.push(bottom);

    	   let left=new d2.Segment(this.points[3],this.points[0]);
    	   this.segments.push(left);
    	   	 
    	 }else{  
    	   //rect	 
    	   let top=new d2.Segment(0,0,0,0);
    	   this.segments.push(top);
    	   
    	   let right=new d2.Segment(0,0,0,0);
    	   this.segments.push(right);

    	   let bottom=new d2.Segment(0,0,0,0);
    	   this.segments.push(bottom);

    	   let left=new d2.Segment(0,0,0,0);
    	   this.segments.push(left);

    	   //arcs	 
    	   let r=this.findArcPoints(this.points[0],this.points[1],this.points[3]);
		   this.arcs.push(this.createArc(r[0],r[1],r[2]));
		   top.ps=r[1].clone();
		   left.ps=r[2].clone();
		   
		   r=this.findArcPoints(this.points[1],this.points[2],this.points[0]);   
		   this.arcs.push(this.createArc(r[0],r[1],r[2]));
		   top.pe=r[2].clone();
		   right.ps=r[1].clone();
		   
		   r=this.findArcPoints(this.points[2],this.points[3],this.points[1]);  
		   this.arcs.push(this.createArc(r[0],r[1],r[2]));
		   right.pe=r[2].clone();
		   bottom.ps=r[1].clone();
			
		   
		   r=this.findArcPoints(this.points[3],this.points[0],this.points[2]);  
		   this.arcs.push(this.createArc(r[0],r[1],r[2]));
		   bottom.pe=r[2].clone();
		   left.pe=r[1].clone();
    	 }      	
    	}
    	resize(offX,offY,point){
    		super.resize(offX,offY,point);
    		this.reset();
    	}
    	rotate(angle,center = {x:0, y:0}){
    	   super.rotate(angle,center);
    	   this.reset();    	
    	}
    	move(offX,offY){
    	   super.move(offX,offY);
    	   this.reset();
    	}
        contains(pt){
      	   if(!super.contains(pt)){
      		   return false;
      	   }    	   
      	   
      	   //constrauct polygon
      	   let pol=new d2.Polygon();
      	   this.segments.forEach(segment=>{
      		 pol.add(segment.ps);
      		 pol.add(segment.pe);
      	   });
      	   
      	   return pol.contains(pt);
         }
		scale(alpha){
			super.scale(alpha);
			this.rounding*=alpha;
			this.reset();
		}
		setRounding(rounding){
		 this.rounding=rounding;
		 this.reset();
		}
    	mirror(line){
    		super.mirror(line);
    		let p=this.points[0];
    		this.points[0]=this.points[1];
    		this.points[1]=p
    		
    		p=this.points[2];
    		this.points[2]=this.points[3];
    		this.points[3]=p
    		
    		this.reset();
    	}
		get box(){
			return super.box;
		}
		get polygon() {
			let vertices=[];
			let p=this.segments[0].ps;
			
    		this.segments.forEach(segment=>{
    		   let a=p.distanceTo(segment.ps);
    		   let b=p.distanceTo(segment.pe);
    		   if(a<b){
    		     vertices.push(segment.ps);
			     vertices.push(segment.pe);
    		   }else{
        		 vertices.push(segment.pe);
    			 vertices.push(segment.ps);    			   
    		   }
			   p=vertices[vertices.length-1];  //keep the last one
			});
          return vertices;		   	
		}
    	paint(g2){
    		if(g2._fill!=undefined&&g2._fill){
    			let vertices=this.polygon;
        		
    	    	g2.beginPath();	    		    		    	
    	    	g2.moveTo(vertices[0].x,vertices[0].y);
    	    	for (var i = 1; i < vertices.length; i++) {
    	    						g2.lineTo(vertices[i].x, vertices[i].y);
    	    	}
    	    	g2.closePath(); 
    	    	g2.fill();    	    	       		

    	    	this.arcs.forEach(arc=>{
    				var circle=new d2.Circle(arc.pc,arc.r);
    	    		circle.paint(g2);
    			});
    		}else{
			 this.segments.forEach(segment=>{
				segment.paint(g2);
			 });
			
    		
			 this.arcs.forEach(arc=>{
				arc.paint(g2);
			 });
    		}
    	}
    }
    
}
});

;require.register("d2/shapes/segment.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Segment = class Segment{
		constructor(...args) {
            if (args.length == 2 && args[0] instanceof d2.Point && args[1] instanceof d2.Point) {
                this.ps = args[0].clone();
                this.pe = args[1].clone();
                return;
            }

            if (args.length == 4) {
                this.ps = new d2.Point(args[0], args[1]);
                this.pe = new d2.Point(args[2], args[3]);
                return;
            }
        }
        clone() {
            return new Segment(this.ps, this.pe);
        }
        set(x1,y1,x2,y2){
        	this.ps.set(x1,y1);
        	this.pe.set(x2,y2);
        }
        get length() {
            return this.ps.distanceTo(this.pe);
        } 
        get box() {
            return new d2.Box(
                Math.min(this.ps.x, this.pe.x),
                Math.min(this.ps.y, this.pe.y),
                Math.max(this.ps.x, this.pe.x),
                Math.max(this.ps.y, this.pe.y)
            )
        }
        middle() {
            return new d2.Point((this.ps.x + this.pe.x)/2, (this.ps.y + this.pe.y)/2);
        }
        translate(vec) {
            this.ps.translate(vec);
            this.pe.translate(vec);
        }
        contains(pt){
      	   return false;    	   
        }
        rotate(angle, center = {x:0, y:0}) {
          this.ps.rotate(angle,center);
          this.pe.rotate(angle,center);
        }
        move(offsetX,offsetY){
            this.ps.move(offsetX,offsetY);
            this.pe.move(offsetX,offsetY);           	
        }
        mirror(line){
        	this.ps.mirror(line);
        	this.pe.mirror(line);
        }
        scale(alpha){
        	this.ps.scale(alpha);
        	this.pe.scale(alpha);        	
        }
		paint(g2){	
			g2.beginPath();
			g2.moveTo(this.ps.x, this.ps.y);
			g2.lineTo(this.pe.x, this.pe.y);
			
			g2.stroke();
		}
    }
}
});

;require.register("d2/shapes/utils.js", function(exports, require, module) {
const DP_TOL = 0.000001;

module.exports = function(d2) {
	d2.utils={
		 DP_TOL: DP_TOL,
			
		 drawCrosshair:function(g2,length,points){                
				

		        points.forEach(function(point){
		        	let line = new d2.Segment(point.x - length, point.y, point.x + length, point.y);
					line.paint(g2);
		            
					line = new d2.Segment(point.x, point.y - length, point.x, point.y + length);            
					line.paint(g2);
		        });	
	   	 },
	
	   radians:function(degrees) {
			  return degrees * Math.PI / 180;
	   },
			 
			// Converts from radians to degrees.
	   degrees :function(radians) {
			  return radians * 180 / Math.PI;
	   },
	   GT: (x,y) => {
	        return ( (x)-(y) >  DP_TOL );
	   },
	   GE: (x,y) => {
	        return ( (x)-(y) > -DP_TOL );
	   },
	   EQ: function(x,y) {
	        return ( (x)-(y) <  DP_TOL && (x)-(y) > -DP_TOL );
	   },
	   LT:function(x,y){
	        return ( (x)-(y) < -DP_TOL );
	    },
	   LE:function(x,y){
	        return ( (x)-(y) <  DP_TOL );
	    },
    }

};
});

require.register("d2/shapes/vector.js", function(exports, require, module) {
module.exports = function(d2) {
	
	d2.Vector = class Vector{
		constructor(...args) {
			 this.x = 0;
	         this.y = 0;
	         
             let a1 = args[0];
             let a2 = args[1];

             if (typeof(a1) == "number" && typeof(a2) == "number") {
                 this.x = a1;
                 this.y = a2;
                 return;
             }

             if (a1 instanceof d2.Point && a2 instanceof d2.Point) {
                 this.x = a2.x - a1.x;
                 this.y = a2.y - a1.y;
                 return;
             }	         
		}
        clone() {
            return new Vector(this.x, this.y);
        }
        
        get length() {
            return Math.sqrt(this.dot(this));
        }        
        
        /**
         * Returns scalar product (dot product) of two vectors <br/>
         * <code>dot_product = (this * v)</code>
         */
        dot(v) {
            return ( this.x * v.x + this.y * v.y );
        }
        
        /**
         * Returns vector product (cross product) of two vectors <br/>
         * <code>cross_product = (this x v)</code>
         */
        cross(v) {
            return ( this.x * v.y - this.y * v.x );
        } 
        /**
         * Slope of the vector in degrees from 0 to 360
         */
        get slope() {
            let angle = Math.atan2(this.y, this.x);
            if (angle<0) angle = 2*Math.PI + angle;
            
            return d2.utils.degrees(angle);
        }
        invert() {
            this.x=-this.x;
            this.y=-this.y;
        }
        /**
         * Returns unit vector.<br/>
         */
        normalize() {            
            return ( new Vector(this.x / this.length, this.y / this.length) );            
        }        
        /**
         * Returns new vector rotated by given angle,
         * positive angle defines rotation in counter clockwise direction,
         * negative - in clockwise direction
         */
        rotate(angle) {
            let point = new d2.Point(this.x, this.y);
            point.rotate(angle);
            this.x=point.x
            this.y=point.y;
        }        
        /**
         *rotate 90 degrees counter clockwise         
         */
        rotate90CCW() {
            this.x=-this.y;
            this.y= this.x;
        }    
        /**
         * rotate 90 degrees clockwise
         */
        rotate90CW() {
            this.x=this.y;
            this.y=-this.x;
        };
        
        /**
         * Return angle between this vector and other vector. <br/>
         * Angle is measured from 0 to 2*PI in the counter clockwise direction
         * from current vector to other.
         */
        angleTo(v) {
            let norm1 = this.normalize();
            let norm2 = v.normalize();
            let angle = Math.atan2(norm1.cross(norm2), norm1.dot(norm2));
            if (angle<0) angle += 2*Math.PI;
            return angle;
        }
        /**
         * Return vector projection of the current vector on another vector
         * @param {Vector} v Another vector
         * @returns {Vector}
         */
        projectionOn(v){
            let n = v.normalize();
            let d = this.dot(n);
            n.multiply(d);
            return n;
        }
        
        multiply(scalar) {
            this.x=scalar * this.x;
            this.y=scalar * this.y;
        }
        add(v){
        	return new Vector(this.x+v.x,this.y+v.y);
        }

	}
	
}	
});

;require.register("d2/text/fontmetrics.js", function(exports, require, module) {
// ��������������������������������������������������
// Variables
// ��������������������������������������������������

let initialized = false
let padding
let context
let canvas

// ��������������������������������������������������
// Settings
// ��������������������������������������������������

const settings = {
  chars: {
    capHeight: 'S',
    baseline: 'n',
    xHeight: 'x',
    descent: 'p',
    ascent: 'h',
    tittle: 'i'
  }
}

// ��������������������������������������������������
// Methods
// ��������������������������������������������������

const initialize = () => {
  canvas = document.createElement('canvas')
  context = canvas.getContext('2d')
  initialized = true
}
const getCanvasContext=()=>{
	 if (!initialized) initialize()
	   return context;
}
const setFont = (fontFamily, fontSize, fontWeight) => {
  if (!initialized) initialize()
  padding = fontSize * 0.5
  canvas.width = fontSize * 2
  canvas.height = fontSize * 2 + padding
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  context.textBaseline = 'top'
  context.textAlign = 'center'	  
}

const setAlignment = (baseline = 'top') => {
  const ty = baseline === 'bottom' ? canvas.height : 0
  context.setTransform(1, 0, 0, 1, 0, ty)
  context.textBaseline = baseline
}

const updateText = (text) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, padding, canvas.width)
}
const computeLineHeight = () => {
  const letter = 'A'
  setAlignment('bottom')
  const gutter = canvas.height - measureBottom(letter)
  setAlignment('top')
  return measureBottom(letter) + gutter
}

const getPixels = (text) => {
  updateText(text)
  return context.getImageData(0, 0, canvas.width, canvas.height).data
}

const getFirstIndex = (pixels) => {
  for (let i = 3, n = pixels.length; i < n; i += 4) {
    if (pixels[i] > 0) return (i - 3) / 4
  } return pixels.length
}

const getLastIndex = (pixels) => {
  for (let i = pixels.length - 1; i >= 3; i -= 4) {
    if (pixels[i] > 0) return i / 4
  } return 0
}

const normalize = (metrics, fontSize, origin) => {
  const result = {}
  const offset = metrics[origin]
  for (let key in metrics) { 
	   if(key!='width'){
	     result[key] = (metrics[key] - offset) / fontSize;
	   }else{
		 result[key]= metrics[key];  
	   }
	  }
  return result;
}

const measureTop = (text) => (
  Math.round(
    getFirstIndex(
      getPixels(text)
    ) / canvas.width
  ) - padding
)

const measureBottom = (text) => (
  Math.round(
    getLastIndex(
      getPixels(text)
    ) / canvas.width
  ) - padding
)

const getMetrics = (chars = settings.chars) => ({
  capHeight: measureTop(chars.capHeight),
  baseline: measureBottom(chars.baseline),
  xHeight: measureTop(chars.xHeight),
  descent: measureBottom(chars.descent),
  bottom: computeLineHeight(),
  ascent: measureTop(chars.ascent),
  tittle: measureTop(chars.tittle),
  top: 0
})

// ��������������������������������������������������
// FontMetrics
// ��������������������������������������������������

const FontMetrics = ({
  fontFamily = 'Times',
  fontWeight = 'normal',
  fontSize = 10,
  origin = 'baseline'
  
} = {}) => (
  setFont(fontFamily, fontSize, fontWeight), {
    ...normalize(getMetrics(), fontSize, origin),
    fontFamily,
    fontWeight,
    fontSize,

  }
)

FontMetrics.settings = settings

// ��������������������������������������������������
// Exports
// ��������������������������������������������������

module.exports = {
		FontMetrics,
		getCanvasContext
}
});

;require.register("pads/d/footprintcomponent.js", function(exports, require, module) {
var Unit = require('core/unit').Unit;
var UnitContainer = require('core/unit').UnitContainer;
var UnitComponent = require('core/unit').UnitComponent;
var UnitMgr = require('core/unit').UnitMgr;
var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var FootprintEventMgr = require('pads/events').FootprintEventMgr;
var events=require('core/events');
var RoundRect=require('pads/shapes').RoundRect;
var Circle=require('pads/shapes').Circle;
var Arc=require('pads/shapes').Arc;
var Pad=require('pads/shapes').Pad;
var SolidRegion=require('pads/shapes').SolidRegion;
var FootprintShapeFactory=require('pads/shapes').FootprintShapeFactory;
var Drill=require('pads/shapes').Drill;
var GlyphLabel=require('pads/shapes').GlyphLabel;
var Line=require('pads/shapes').Line;
var LineEventHandle=require('pads/events').LineEventHandle;
var SolidRegionEventHandle=require('pads/events').SolidRegionEventHandle;
var FootprintContextMenu=require('pads/popup/footprintpopup').FootprintContextMenu;
var GlyphManager=require('core/text/d2glyph').GlyphManager;
var d2=require('d2/d2');

class Footprint extends Unit{
constructor(width,height) {
       super(width,height); 
	   this.shapeFactory = new FootprintShapeFactory();
	}
clone(){
	  var copy=new Footprint(this.width,this.height);
	  //copy.silent=true;
	  copy.unitName=this.unitName;
	  copy.grid=this.grid.clone();
      var len=this.shapes.length;
	  for(var i=0;i<len;i++){
           var clone=this.shapes[i].clone();
	       copy.add(clone);
	  }
	  //copy.silent=false;
	  return copy;
	}	
parse(data){
	 	   this.unitName=j$(data).find("name").text();
	 	   this.grid.setGridUnits(j$(data).find("units").attr("raster"),core.Units.MM);
	 	   
	 	   var reference=j$(data).find("reference");
	 	   var value=j$(data).find("value");
	 	   if(reference!=null&&reference.text()!=''){
	           var label = new GlyphLabel(0,0,0);
	           label.fromXML(reference[0]);
	           label.texture.tag="reference";
	           this.add(label);      
	 	   }
	 	   if(value!=null&&value.text()!=''){
	           var label = new GlyphLabel(0,0,0);
	           label.fromXML(value[0]);
	           label.texture.tag="value";
	           this.add(label);	 		   
	 	   }
	 	   var that=this;
	 	   j$(data).find('shapes').children().each(function(){
               var shape=that.shapeFactory.createShape(this);
               that.add(shape);
	 	   });


	}	
format(){   
   var xml="<footprint width=\""+ this.width +"\" height=\""+this.height+"\">\r\n"; 
   xml+="<name>"+this.unitName+"</name>\r\n";
   //***reference
   var text=UnitMgr.getInstance().getLabelByTag(this,'reference');
   if(text!=null){
       xml+="<reference>";
       xml+=text.getTexture().toXML();
       xml+="</reference>\r\n";
   } 
   //value
   text=UnitMgr.getInstance().getLabelByTag(this,'value');
   if(text!=null){
       xml+="<value>";
       xml+=text.getTexture().toXML();
       xml+="</value>\r\n";
   }    
   xml+="<units raster=\""+this.grid.getGridValue()+"\">MM</units>\r\n"; 
   xml+="<shapes>\r\n";
   this.shapes.forEach(function(shape) {
	   if(!((shape instanceof GlyphLabel)&&(shape.texture.tag=='reference'||shape.texture.tag=='value'))){
		   xml+=shape.toXML();
		   xml+='\r\n';   
	   }
   });
   xml+="</shapes>\r\n";   
   xml+="</footprint>";
   return xml;
}	
}

class FootprintContainer extends UnitContainer{
    constructor() {
       super();
       this.formatedFileName="Footprints"
	}

    parse(xml){
    	  this.setFileName(j$(xml).find("filename").text());
    	  this.libraryname=(j$(xml).find("library").text());
    	  this.categoryname=(j$(xml).find("category").text());    	  
    	  
    	  var that=this;
	      j$(xml).find("footprint").each(j$.proxy(function(){
	    	var footprint=new Footprint(j$(this).attr("width"),j$(this).attr("height"));
	    	    footprint.unitName=j$(this).find("name").text();
	    	//silent mode
	    	//footprint.silent=that.silent;
	    	//need to have a current unit
            that.add(footprint);
            footprint.parse(this);
	    }),that);	
    }
    format() {
        var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n"; 
        xml+="<footprints identity=\"Footprint\" version=\"1.0\">\r\n";      
    	let units=this.unitsmap.values();
  	    for(let i=0;i<this.unitsmap.size;i++){
          let unit=units.next().value;
          xml+=unit.format();
  		  xml+="\r\n";
  	    }    	    	
        xml+="</footprints>";
        
        return xml;
    }
	
}


class FootprintComponent extends UnitComponent{
  constructor(hbar,vbar,canvas,popup) {
	super(hbar,vbar,canvas,popup); 
	
	this.eventMgr=new FootprintEventMgr(this); 
	this.model=new FootprintContainer();
	this.popup=new FootprintContextMenu(this,popup);
	  
}
setMode(_mode){
	this.mode=_mode;
	let shape=null;
	 if (this.cursor != null) {
	     this.cursor.clear();
	     this.cursor = null;
	 }
	 this.eventMgr.resetEventHandle();
	        
	 switch (this.mode) {
     		case core.ModeEnum.SOLID_REGION:
         	break;	 
	        case core.ModeEnum.PAD_MODE:
	            shape=new Pad(0,0,core.MM_TO_COORD(1.52),core.MM_TO_COORD(2.52));	            	            		                        
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape);  
	          break;
	        case  core.ModeEnum.RECT_MODE:
	            shape=new RoundRect(0,0,core.MM_TO_COORD(7),core.MM_TO_COORD(7),core.MM_TO_COORD(0.8),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);	            
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.LINE_MODE:
	          
	          break;
	        case  core.ModeEnum.ELLIPSE_MODE:	
	            shape=new Circle(0,0,core.MM_TO_COORD(3.4),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.ARC_MODE:
	        	shape=new Arc(0,0,core.MM_TO_COORD(3.4),core.MM_TO_COORD(0.2),core.Layer.SILKSCREEN_LAYER_FRONT);
	            this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case  core.ModeEnum.LABEL_MODE:
	            shape=new GlyphLabel("sergei_iliev@yahoo.com",core.MM_TO_COORD(0.3),core.Layer.SILKSCREEN_LAYER_FRONT);			
		        this.setContainerCursor(shape);               
	            this.getEventMgr().setEventHandle("cursor",shape); 
	          break;
	        case core.ModeEnum.ORIGIN_SHIFT_MODE:  
	            this.getEventMgr().setEventHandle("origin",null);   
	            break;          
	        default:
	          this.Repaint();
	      }       
} 


//  contextMenu:function(event){ 
//	  var x,y;
//	  if (event.pageX != undefined && event.pageY != undefined) {
//		   x = event.pageX;
//		   y = event.pageY;
//	  }else {
//		   x = event.clientX + document.body.scrollLeft +
//	            document.documentElement.scrollLeft;
//		   y = event.clientY + document.body.scrollTop +
//	            document.documentElement.scrollTop;
//	 }
//	       x -= parseInt(this.canvas.offset().left);
//	       y -= parseInt(this.canvas.offset().top);
//	       
//	       
//  },



mouseDown(event){
    event.preventDefault();

	if (this.getModel().getUnit() == null) { 
	   return; 
	}

    this.canvas.on('mousemove',j$.proxy(this.mouseDrag,this));
    this.canvas.off('mousemove',j$.proxy(this.mouseMove,this));
    
	//****Dynamic event handling
    var scaledEvent =this.getScaledEvent(event);
	

	if(this.getModel().getUnit()==null){
          this.getEventMgr().resetEventHandle();
    }else{
    	switch (this.getMode()){
    	case  core.ModeEnum.COMPONENT_MODE:
         if(this.getModel().getUnit().getCoordinateSystem()!=null){ 
    	  if(this.getModel().getUnit().getCoordinateSystem().isClicked(scaledEvent.x, scaledEvent.y)){
              this.getEventMgr().setEventHandle("origin",null); 
        	  break;
          } 
         }
    		
    	  var shape=this.getModel().getUnit().isControlRectClicked(scaledEvent.x, scaledEvent.y);
		  if(shape!=null){
                if(shape instanceof Arc){
                     if(shape.isStartAnglePointClicked(scaledEvent.x , scaledEvent.y)){ 
                         this.getEventMgr().setEventHandle("arc.start.angle",shape);                    
                     }else if(shape.isExtendAnglePointClicked(scaledEvent.x , scaledEvent.y)){
                         this.getEventMgr().setEventHandle("arc.extend.angle",shape);                      
                     }else if(shape.isMidPointClicked(scaledEvent.x , scaledEvent.y)){
                    	  this.getEventMgr().setEventHandle("arc.mid.point",shape);
                     }else{
                          this.getEventMgr().setEventHandle("resize",shape);    
                     }
                    }else{
						this.getEventMgr().setEventHandle("resize",shape); 
                    }
			
 
		  }else{
		     shape = this.getModel().getUnit().getClickedShape(scaledEvent.x, scaledEvent.y, true);
		     
		     if(shape!=null){
			   if (UnitMgr.getInstance().isBlockSelected(this.getModel().getUnit().shapes) && shape.isSelected()){
                 this.getEventMgr().setEventHandle("block", null);						 
		       }else if ((!(shape instanceof GlyphLabel))&&(undefined !=shape['getChipText'])&&shape.getChipText().isClicked(scaledEvent.x, scaledEvent.y)){
			     this.getEventMgr().setEventHandle("texture",shape);
               }else
		         this.getEventMgr().setEventHandle("move",shape);
		     }else{
		         this.getEventMgr().setEventHandle("component",null);
		     }
		  }
		  break;
    	case core.ModeEnum.SOLID_REGION:
            //is this a new copper area
            if ((this.getEventMgr().targetEventHandle == null) ||
                !(this.getEventMgr().targetEventHandle instanceof SolidRegionEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape =new SolidRegion(core.Layer.LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                this.getEventMgr().setEventHandle("solidregion", shape);
            }     		
    		break;
    	case core.ModeEnum.LINE_MODE:
            //***is this a new wire
            if ((this.getEventMgr().getTargetEventHandle() == null) ||
                !(this.getEventMgr().getTargetEventHandle() instanceof LineEventHandle)) {
            	if(event.which!=1){
            		return;
            	}
                shape = new Line(core.MM_TO_COORD(0.3),core.Layer.SILKSCREEN_LAYER_FRONT);
                this.getModel().getUnit().add(shape);
                
            	this.getEventMgr().setEventHandle("line", shape);
            }
    	  break;
    	case core.ModeEnum.DRAGHEAND_MODE:  
    		this.getEventMgr().setEventHandle("dragheand", null);
    	  break;	
    	case core.ModeEnum.MEASUMENT_MODE:
                if ((this.getEventMgr().getTargetEventHandle() != null) ||
                    (this.getEventMgr().getTargetEventHandle() instanceof events.MeasureEventHandle)) {
                     this.getModel().getUnit().ruler.resizingPoint=null;
                     this.getEventMgr().resetEventHandle();
                     this.Repaint();
                }else{
                   this.getEventMgr().setEventHandle("measure",this.getModel().getUnit().ruler);   
				   this.getModel().getUnit().ruler.setX(scaledEvent.x);
				   this.getModel().getUnit().ruler.setY(scaledEvent.y);                   
                }
		  break;
		}
	}
	
	if (this.getEventMgr().getTargetEventHandle() != null) {
      this.getEventMgr().getTargetEventHandle().mousePressed(scaledEvent);
    } 
	
  }

 
}


module.exports ={
	   FootprintContainer,
	   Footprint,
	   FootprintComponent	   
}
});

;require.register("pads/events.js", function(exports, require, module) {
var EventHandle = require('core/events').EventHandle;
var events = require('core/events');
var core = require('core/core');
var d2 = require('d2/d2');

class ArcMidPointEventHandle extends EventHandle{
constructor(component) {
		 super(component);
	 }
 
mousePressed(event){
	if(super.isRightMouseButton(event)){
            if (this.target["getLinePoints"]!=undefined){
            	this.component.popup.registerLineSelectPopup(this.target,event);            
            }            
    }
     
    this.component.getModel().getUnit().setSelected(false);
    this.target.setSelected(true);
	this.mx=event.x;
	this.my=event.y;
        
    this.targetPoint=this.target.isControlRectClicked(event.x,event.y);
    this.target.setResizingPoint(this.targetPoint);
    
    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
    
	this.component.Repaint();
 }
 mouseReleased(event){
	    if(this.component.getParameter("snaptogrid")){
         this.target.alignResizingPointToGrid(this.targetPoint);
	     this.component.Repaint();	 
		}
	    this.target.resizingPoint=null;
 }
 mouseDragged(event){
 	let new_mx = event.x;
    let new_my = event.y;
    
    this.target.Resize(0,0,event);
    
    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:Event.PROPERTY_CHANGE});
    this.mx = new_mx;
    this.my = new_my;
	this.component.Repaint();
 }
 mouseMove(event){
 
 }
}

class ArcStartAngleEventHandle extends EventHandle{
 constructor(component) {
	 super(component);
 }
 mousePressed(event){
 }
 mouseDragged(event){
 	let new_mx = event.x;
    let new_my = event.y;
    
	
        
    let centerX=this.target.arc.center.x;
    let centerY=this.target.arc.center.y;
           
    let start = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

    if(start<0){
        this.target.setStartAngle(-1*(start));            
    }else{
        this.target.setStartAngle(360-(start));            
    }
		
	this.mx = new_mx;
    this.my = new_my;

	this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
		
	this.component.Repaint();
 }
mouseReleased(event){

} 
mouseMove(event){
 
}

}	
class ArcExtendAngleEventHandler extends EventHandle{
 constructor(component) {
	 super(component);

 }
 mousePressed(event){
 }
 mouseDragged(event){
 	let new_mx = event.x;
    let new_my = event.y;
        
    let centerX=this.target.arc.center.x;
    let centerY=this.target.arc.center.y;
        
        
    let extend = (180/Math.PI*Math.atan2(new_my-centerY,new_mx-centerX));

    if(extend<0){
        extend=(-1*(extend));                  
    }else{
        extend=(360-extend);         
    }
        
        //-360<extend<360 
    let extendAngle=this.target.arc.endAngle;
    if(extendAngle<0){        
          if(extend-this.target.arc.startAngle>0) {                
              this.target.setExtendAngle(((extend-this.target.arc.startAngle))-360);
          }else{
              this.target.setExtendAngle(extend-this.target.arc.startAngle);
            }
        }else{           
            if(extend-this.target.arc.startAngle>0) {
              this.target.setExtendAngle(extend-this.target.arc.startAngle);
            }else{
              this.target.setExtendAngle((360-this.target.arc.startAngle)+extend);
            }
        }
        
    //***update PropertiesPanel           
	this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
		
	this.component.Repaint();
 }
mouseReleased(event){

} 
mouseMove(event){
 
}

}

class LineEventHandle extends EventHandle{
constructor(component) {
		 super(component);
		 (function(that){
			   //private
			   var line=null;
			    /*
			     * Wiring rule-> discard point if overlaps with last line point
			     */
			    function isOverlappedPoint( line, pointToAdd){
			        if(line.polyline.points.length>0){
			          let lastPoint=line.polyline.points[line.polyline.points.length-1]; 
			            //***is this the same point as last one?   
			          if(pointToAdd.equals(lastPoint))
			            return true;    
			        }
			        return false;
			    }
			    /*
			     * Wiring rule -> if the point is on a line with previous,shift the previous the the new one,
			     *                 without adding the point
			     */
			   function isPointOnLine(line,pointToAdd){
			         if(line.polyline.points.length>=2){
			             let lastPoint=line.polyline.points[line.polyline.points.length-1];  
			             let lastlastPoint=line.polyline.points[line.polyline.points.length-2]; 
			            
			            //***check if point to add overlaps last last point
			            if(lastlastPoint.equals(pointToAdd)){
			              line.deleteLastPoint();
			              lastPoint.setLocation(pointToAdd);  
			              return true;
			            }
			            if((lastPoint.x==pointToAdd.x&&lastlastPoint.x==pointToAdd.x)||(lastPoint.y==pointToAdd.y&&lastlastPoint.y==pointToAdd.y)){                  
			                lastPoint.setLocation(pointToAdd);                           
			                return true;
			            }                    
			         }
			        return false;
			    };
		       that.lineBendingProcessor={
			  
		       Initialize:function(_line){
				  line=_line; 
			   },
			   addLinePoint:function(p){				  
				        let result=false;
				        if(!isOverlappedPoint(line,p)){
				            if(!isPointOnLine(line,p)){
				                line.polyline.add(p);   
				                result=true;
				            }               
				        }         
				        line.resetToPoint(p); 
				        return result;
			   },
			   Release:function(){
			          line.reset(); 
			          if(line.polyline.points.length<2){
			                line.owningUnit.remove(line.getUUID());                
			          }
			 
			   }
			   
			};
			
		 })(this);
	 }
mousePressed(event){
	this.component.popup.close();
	
	if(super.isRightMouseButton(event)){
	  //if(this.target.points.length<2){		 
	  //   this.component.getModel().getUnit().remove(this.target.getUUID());                
	  //   this.target=null;
	  //}		
	  //this.component.setMode(core.ModeEnum.LINE_MODE);
	  //this.component.Repaint();	
	   this.component.popup.registerLinePopup(this.target,event);
	  	
		
	   return; 
	}
	
	this.component.getModel().getUnit().setSelected(false);
	this.lineBendingProcessor.Initialize(this.target);
	this.target.setSelected(true);
	
    this.target.setResizingPoint(new d2.Point(event.x,event.y));
    this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
	
    if(this.component.getParameter("snaptogrid")){
    	let p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y); 
    	this.lineBendingProcessor.addLinePoint(p);	
    }else{
       this.lineBendingProcessor.addLinePoint(new d2.Point(event.x,event.y));
    }
	this.component.Repaint();	 
   }
 mouseReleased(event){

   }
 mouseDragged(event){
   }
 mouseMove(event){
	 this.target.floatingEndPoint.set(event.x,event.y); 
	 this.target.floatingMidPoint.set(event.x,event.y);
	 this.component.getModel().getUnit().fireShapeEvent({target:this.target,type:events.Event.PROPERTY_CHANGE});
	 this.component.Repaint(); 
   }
 dblClick(){
     this.target.reset();  
     this.target.setSelected(false);
     this.component.getEventMgr().resetEventHandle();
     this.component.Repaint();	 
	 } 
// keyPressed(event){
//	 if(event.keyCode==27){   //ESCAPE
//       console.log(33);      
//			 //this.dblClick(null);
//		   //this.component.getView().setButtonGroup(ModeEnum.COMPONENT_MODE);
//	       //this.component.setMode(ModeEnum.COMPONENT_MODE);  
//     }   
// }
 Detach(){
	 if(this.target!=null){
		 this.lineBendingProcessor.Release();
	     this.target.reset();  
	 }	     
	 super.Detach();
 }    
}
class SolidRegionEventHandle extends EventHandle{
	constructor(component) {
		 super(component);
	 }
mousePressed(event){
      this.mx=event.x;
	  this.my=event.y;
	  if(super.isRightMouseButton(event)){                                  
           return;
      }
      this.component.getModel().getUnit().setSelected(false);
	  this.target.setSelected(true);

      let p;      
      
      if(this.component.getParameter("snaptogrid")){
        p=this.component.getModel().getUnit().getGrid().positionOnGrid(event.x,event.y);       		
      }else{
        p=new d2.Point(event.x,event.y);
      }
      let justcreated=this.target.polygon.points.length==2;
      
      if(this.target.getLinePoints().length==0){
    	  this.target.add(p);    
          //avoid point over point
      }else if(!this.target.getLinePoints()[this.target.getLinePoints().length-1].equals(p)){
    	  this.target.add(p);           
      }
      
      
	  this.component.Repaint();	   
	    
	 }
mouseReleased(event){
		
	 }
	 
mouseDragged(event){
		
	 }
mouseMove(event){
    this.target.floatingEndPoint.set(event.x,event.y);   
    this.component.Repaint();	 
	 }	 
dblClick(){
      
    this.target.setSelected(false);
    this.component.getEventMgr().resetEventHandle();
    this.component.Repaint();	 
} 
Detach() {
    this.target.reset(); 
    if(this.target.polygon.points.length<3){
        this.target.owningUnit.remove(this.target.uuid);
    }
    super.Detach();
}	
}
class FootprintEventMgr{
 constructor(component) {
    this.component=component;
	this.targetEventHandle=null;	
	this.hash = new Map();
	this.hash.set("arc.mid.point",new ArcMidPointEventHandle(component));
	this.hash.set("arc.start.angle",new ArcStartAngleEventHandle(component));
	this.hash.set("arc.extend.angle",new ArcExtendAngleEventHandler(component));
	this.hash.set("move",new events.MoveEventHandle(component));
	this.hash.set("resize",new events.ResizeEventHandle(component));
    this.hash.set("component",new events.UnitEventHandle(component));
	this.hash.set("block",new events.BlockEventHandle(component));
	this.hash.set("line",new LineEventHandle(component));
	this.hash.set("cursor",new events.CursorEventHandle(component));
	this.hash.set("texture",new events.TextureEventHandle(component));
	this.hash.set("dragheand",new events.DragingEventHandle(component));
	this.hash.set("origin",new events.OriginEventHandle(component));
	this.hash.set("measure",new events.MeasureEventHandle(component));
	this.hash.set("solidregion",new SolidRegionEventHandle(component));
 }
 //****private
 getEventHandle(eventKey,target) {
    var handle=this.hash.get(eventKey);
	if(handle!=null){
	  handle.setTarget(target);
	  if(eventKey=='resize'||eventKey=='move'||eventKey=='line'||eventKey=='solidregion'||eventKey=='texture'){
	     this.component.getModel().getUnit().fireShapeEvent({target:target,type:events.Event.SELECT_SHAPE});
	  }
	  if(eventKey=='component'||eventKey=="origin"){
		 this.component.getModel().fireUnitEvent({target:this.component.getModel().getUnit(),type:events.Event.SELECT_UNIT});
	  }
	  handle.Attach();
	}
	return handle;
 }
 
 getTargetEventHandle(){
   return this.targetEventHandle;
 }
 
 setEventHandle(eventKey,target){
        this.resetEventHandle();
        this.targetEventHandle=this.getEventHandle(eventKey,target);
    }
 
 resetEventHandle(){
	    //hide context menu
	    this.component.popup.close();
        if (this.targetEventHandle != null) {
            this.targetEventHandle.Detach();
        }
        this.targetEventHandle = null;                
    }
 
}

module.exports ={
	  FootprintEventMgr,
	  ArcExtendAngleEventHandler,
	  ArcStartAngleEventHandle,
	  ArcMidPointEventHandle,
	  LineEventHandle,
	  SolidRegionEventHandle
}
});

;require.register("pads/pads.js", function(exports, require, module) {
var core = require('core/core');
var events = require('core/events');
var Footprint=require('pads/d/footprintcomponent').Footprint;
var togglebutton=require('core/models/togglebutton');
var ToggleButtonView=require('pads/views/togglebuttonview');
var mywebpcb=require('core/core').mywebpcb;
var FootprintsPanelView=require('pads/views/footprintspanelview').FootprintsPanelView;
var FootprintComponent=require('pads/d/footprintcomponent').FootprintComponent;


(function($){
	
	j$=jQuery.noConflict();
	
	j$( document ).ready(function() {
		    _.extend(mywebpcb, Backbone.Events);
		    
			//prevent context menu
			document.body.oncontextmenu = (e) => {e.preventDefault()};
		    
			//enable tooltips
			j$('[data-toggle="tooltip"]').tooltip();

			var fc=new FootprintComponent('jqxHorizontalScrollBar','jqxVerticalScrollBar','mycanvas','popup-menu');
			
			//create ui
			var toggleButtonCollection=new togglebutton.ToggleButtonCollection(
			[new togglebutton.ToggleButtonModel({id:'mainmenuid'}),
			 new togglebutton.ToggleButtonModel({id:'printfootrpintid'}),
			 new togglebutton.ToggleButtonModel({id:'saveid'}),
			 new togglebutton.ToggleButtonModel({id:'loadid'}),
			 new togglebutton.ToggleButtonModel({id:'zoominid'}),
			 new togglebutton.ToggleButtonModel({id:'zoomoutid'}),
			 new togglebutton.ToggleButtonModel({id:'rotateleftid'}),
			 new togglebutton.ToggleButtonModel({id:'rotaterightid'}),
			 new togglebutton.ToggleButtonModel({id:'grabid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'tocenterid'}),
			 new togglebutton.ToggleButtonModel({active:true,id:'selectionid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'rectid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'ellipseid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'arcid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'lineid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'solidregionid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'padid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'labelid',group:'lefttogglegroup'}),
			 new togglebutton.ToggleButtonModel({id:'anchorid'}),
			 new togglebutton.ToggleButtonModel({id:'originid'}),
			 new togglebutton.ToggleButtonModel({id:'measureid',group:'lefttogglegroup'})
			]
			);
			
			 var view=new ToggleButtonView({collection:toggleButtonCollection,footprintComponent:fc});
			 fc.setView(view);
	         
			 //creat tree			 
			 j$('#jqxTree').jqxTree({ height: '250px', width: '100%'});
				
			 var footrpintsPanel=new FootprintsPanelView({footprintComponent:fc,name:'jqxTree'});
			 footrpintsPanel.render();
				//***add footprint
			 fc.getModel().add(new Footprint(core.MM_TO_COORD(50),core.MM_TO_COORD(50)));
			 fc.getModel().setActiveUnit(0);
			 fc.getModel().fireUnitEvent({target:fc.getModel().getUnit(),type:events.Event.SELECT_UNIT});
				
			 fc.componentResized();
			 fc.Repaint();
			
			//init load dialog
				j$('#FootprintLoadDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 520,
		            height: 400,
		            autoOpen:false
                });
				
			//init save dialog
				j$('#FootprintSaveDialog').jqxWindow({
				    resizable: false,
				    position: 'center',
		            width: 350,
		            height: 270,
		            autoOpen:false
                });	
				
		   //load demo footprint
			    	//loadDemo(fc);
	});	
	loadDemo=function(fc){
		
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: 'demo/pads.xml',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
		    },
	        success: function(data, textStatus, jqXHR){

	      //****load it    	
	      		  fc.Clear();
	      		  fc.getModel().parse(data);
	      		  fc.getModel().setActiveUnit(0);
	      		  fc.componentResized();
	                //position on center
	              var rect=fc.getModel().getUnit().getBoundingRect();
	              fc.setScrollPosition(rect.center.x,rect.center.y);
	              fc.getModel().fireUnitEvent({target:fc.getModel().getUnit(),type: events.Event.SELECT_UNIT});
	      		  fc.Repaint();
	      		  //set button group
	      		  fc.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);	        
	        },
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#mywebpadsid').unblock();
	        }	        
	    });	
	}
	
	
})(jQuery);
});

require.register("pads/popup/footprintpopup.js", function(exports, require, module) {
var ContextMenu = require('core/popup/contextmenu').ContextMenu;
var core=require('core/core');

class FootprintContextMenu extends ContextMenu{
constructor(component,placeholderid){
		super(component,placeholderid);	
	}	
registerPadPopup(target,event){
	var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	  items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	  items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	  items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	  items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	  items+="</table></div>";
	  this.setContent(items,{target:target});	
	  this.open(event);	
	}
registerUnitPopup(target,event){	          	            
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='selectallid' ><td style='padding: 0.4em;'>Select All</td></tr>";
	    items+="<tr id='undoid'><td style='padding: 0.4em;'>Undo</td></tr>";	  
	    items+="<tr id='redoid'><td style='padding: 0.4em;'>Redo</td></tr>";
	    items+="<tr id='loadid'><td style='padding: 0.4em'>Load</td></tr>";
	    items+="<tr id='reloadid'><td style='padding: 0.4em'>Reload</td></tr>";
	    items+="<tr id='deleteunit'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="<tr id='copyid'><td style='padding: 0.4em'>Copy</td></tr>";
	    items+="<tr id='pasteid'><td style='padding: 0.4em'>Paste</td></tr>";		    
	    items+="<tr id='positiontocenterid'><td style='padding: 0.4em'>Position drawing to center</td></tr>";
	    items+="</table></div>";
	    this.setContent(items,{target:target});	    
	    this.open(event);	
}
registerBlockPopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='rotateleftid' ><td style='padding: 0.4em;'>Rotate Left</td></tr>";
	    items+="<tr id='rotaterightid'><td style='padding: 0.4em;'>Rotate Right</td></tr>";	  
	    items+="<tr id='cloneid'><td style='padding: 0.4em;'>Clone</td></tr>";
	    items+="<tr id='topbottomid'><td style='padding: 0.4em'>Mirror Top-Bottom</td></tr>";
	    items+="<tr id='leftrightid'><td style='padding: 0.4em'>Mirror Left-Right</td></tr>";
	    items+="<tr id='deleteid'><td style='padding: 0.4em'>Delete</td></tr>";	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
		this.open(event);		
}
registerLinePopup(target,event){
	  var items="<div id='menu-items'><table style='cursor: default;'>";		  		  			  
	    items+="<tr id='deletelastpointid' ><td style='padding: 0.4em;'>Delete Last Point</td></tr>";
	    items+="<tr id='deletelineid'><td style='padding: 0.4em;'>Delete Line</td></tr>";	  
	    items+="<tr id='cancelid'><td style='padding: 0.4em;'>Cancel</td></tr>";	    	    	
	    items+="</table></div>";
	    this.setContent(items,{target:target});	
	    this.open(event);	  	
}
attachEventListeners(context){
	  var placeholder=document.getElementById('menu-items');		  
	  var rows=placeholder.getElementsByTagName("table")[0].rows;
	  var self=this;
	  for (var i = 0; i < rows.length; i++) {
	      //closure		   
	      (function(row) {
	          row.addEventListener("click", function() {	    		          	    	  		        	 
	        	  self.close();	        	  
	        	  self.actionPerformed(row.id,context);
	          });
	      })(rows[i]);
	  }
}
actionPerformed(id,context){ 	
	
   super.actionPerformed(id,context);
   
}


}

module.exports ={
		FootprintContextMenu
		}
});

;require.register("pads/shapes.js", function(exports, require, module) {
var core=require('core/core');
var utilities =require('core/utilities');
var Shape=require('core/shapes').Shape;
var AbstractLine=require('core/shapes').AbstractLine;
var glyph=require('core/text/d2glyph');
var font=require('core/text/d2font');
var d2=require('d2/d2');


class FootprintShapeFactory{
	
createShape(data){
	if (data.tagName.toLowerCase() == 'pad') {
		var pad = new Pad(0, 0, 0, 0);
		pad.fromXML(data);
		return pad;
	}
	if (data.tagName.toLowerCase() == 'rectangle') {
		var roundRect = new RoundRect(0, 0, 0, 0, 0,0, core.Layer.SILKSCREEN_LAYER_FRONT);
		roundRect.fromXML(data);
		return roundRect;
	}
	if (data.tagName.toLowerCase() == 'circle') {
		var circle = new Circle(0, 0, 0, 0, 0);
		circle.fromXML(data);
		return circle;
	}
	if (data.tagName.toLowerCase() == 'line') {
		var line = new Line( 0, 0, 0, 0, 0);
		line.fromXML(data);
		return line;
	}
	if (data.tagName.toLowerCase() == 'arc') {
		var arc = new Arc(0, 0, 0, 0, 0);
		arc.fromXML(data);
		return arc;
	}
	if (data.tagName.toLowerCase() == 'label') {
		var label = new GlyphLabel(0, 0, 0);
		label.fromXML(data);		
		return label;
	}
	if (data.tagName.toLowerCase() == 'solidregion') {
		var region = new SolidRegion(0);
		region.fromXML(data);		
		return region;
	}	
}
}	

class GlyphLabel extends Shape{
constructor(text,thickness,layermaskId) {
		super( 0, 0, 0, 0, thickness,layermaskId);
		this.setDisplayName("Label");
		this.texture=new glyph.GlyphTexture(text,"",0,0,thickness);
        this.texture.setSize(core.MM_TO_COORD(2));
	}
clone(){
    var copy = new GlyphLabel(this.text,this.thickness,this.layermaskId);    
        copy.texture = this.texture.clone();        
        copy.copper=this.copper;
		return copy;
    }
setCopper(copper){
	this.copper= copper;
	//mirror horizontally
	let line=new d2.Line(this.texture.anchorPoint,new d2.Point(this.texture.anchorPoint.x,this.texture.anchorPoint.y+100));
	
	let side=core.Layer.Side.resolve(this.copper.getLayerMaskID());
	
	this.texture.mirror(side==core.Layer.Side.BOTTOM,line);
}
setRotation(rotate,center){	
	if(center==undefined){
		  this.texture.setRotation(rotate,this.getCenter());
	}else{
		  this.texture.setRotation(rotate,center);	
	}
}
calculateShape(){ 
  return this.texture.getBoundingShape();
}
isClicked(x,y){
    return this.texture.isClicked(x,y);
}
getCenter(){
   return this.texture.getBoundingShape().center;
}
getTexture(){
  return this.texture;    
}
setSelected(selected) {
    this.texture.isSelected=selected;
}
isSelected() {
   return this.texture.isSelected;
}
Rotate(rotation) {	
	this.texture.Rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
}
Mirror(line) {

}
Move(xoffset,yoffset) {
  this.texture.Move(xoffset, yoffset);
}
toXML() {
    if (!this.texture.isEmpty())
        return "<label layer=\""+this.copper.getName()+"\">" + this.texture.toXML() + "</label>";
    else
        return "";
}
fromXML(data){
        //extract layer info        
        if(j$(data).attr("layer")!=null){
           this.copper =core.Layer.Copper.valueOf(j$(data).attr("layer"));
        }else{
           this.copper=core.Layer.Copper.FSilkS;
        }
        this.texture.fromXML(data);  
}    
paint(g2, viewportWindow, scale) {
        //if((this.getCopper().getLayerMaskID()&layermask)==0){
        //    return;
        //}
		var rect = this.texture.getBoundingShape();
			rect.scale(scale.getScale());
			if (!rect.intersects(viewportWindow)) {
				return;
			}

		if (this.selection) {
			this.texture.fillColor = "gray";
		} else {
			this.texture.fillColor = this.copper.getColor();
		}
		this.texture.paint(g2, viewportWindow, scale,this.copper.getLayerMaskID());
    }
}	
class RoundRect extends Shape{
	constructor(x, y, width, height,arc,thickness,layermaskid) {
		super(x, y, width, height, thickness,layermaskid);
		this.setDisplayName("Rect");		
		this.selectionRectWidth=3000;
		this.resizingPoint = null;
		this.rotate=0;
		this.roundRect=new d2.RoundRectangle(new d2.Point(x,y),width,height,arc);		
	}
	clone() {
		var copy = new RoundRect(0,0,0,0,0,this.thickness,this.copper.getLayerMaskID());
		copy.roundRect = this.roundRect.clone();
		copy.rotate=this.rotate;
		copy.fill = this.fill;		
		return copy;
	}
	calculateShape() {
		return this.roundRect.box;		
	}
	getCenter() {
		let box=this.roundRect.box;
	    return new d2.Point(box.center.x,box.center.y);
	}
	setSelected (selection) {
		super.setSelected(selection);
			if (!selection) {
				this.resizingPoint = null;
	        }
	}	
	isClicked(x, y) {
		if (this.roundRect.contains(new d2.Point(x, y)))
			return true;
		else
			return false;
	}
	isControlRectClicked(x,y){
	   	let pt=new d2.Point(x,y);
	   	let result=null
		this.roundRect.vertices.some(v=>{
	   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
	   		  	result=v;
	   			return true;
	   		}else{
	   			return false;
	   		}
	   	});
	   	return result;
	}	
	setRotation(rotate,center){
		let alpha=rotate-this.rotate;
		let box=this.roundRect.box;
		if(center==undefined){
		  this.roundRect.rotate(alpha,box.center);
		}else{
		  this.roundRect.rotate(alpha,center);	 	
		}
		this.rotate=rotate;
	}
	setRounding(rounding){	  
	  this.roundRect.setRounding(rounding);
	}
	setResizingPoint(pt){
		this.resizingPoint=pt;
	}
	getResizingPoint() {
		return this.resizingPoint;
	}
	Move(xoffset, yoffset) {
		this.roundRect.move(xoffset,yoffset);
	}
	Mirror(line){
		this.roundRect.mirror(line);
	}
	Rotate(rotation){	
		//fix angle
		let alpha=this.rotate+rotation.angle;
		if(alpha>=360){
			alpha-=360
		}
		if(alpha<0){
		 alpha+=360; 
		}	
		this.rotate=alpha;		
		this.roundRect.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}
	Resize(xoffset, yoffset,clickedPoint){
		this.roundRect.resize(xoffset, yoffset,clickedPoint);
	}
	getOrderWeight(){
		return this.roundRect.area; 
	}	
	toXML() {
		let points="";
		this.roundRect.points.forEach(function(point) {
			points += utilities.roundFloat(point.x,5) + "," + utilities.roundFloat(point.y,5) + ",";
		},this);
		return "<rectangle copper=\"" + this.copper.getName()
		        +"\" thickness=\"" + this.thickness
				+ "\" fill=\"" + this.fill + "\" arc=\"" + this.roundRect.rounding
				+"\" points=\"" + points
				+ "\"></rectangle>";
	}
	fromXML(data) {
		if(j$(data)[0].hasAttribute("copper")){
		  this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
		}
		if(j$(data).attr("width")!=undefined){
		  this.roundRect.setRect(parseInt(j$(data).attr("x")),parseInt(j$(data).attr("y")),parseInt(j$(data).attr("width")),parseInt(j$(data).attr("height")),parseInt(j$(data).attr("arc")));
		}else{			
			var array = JSON.parse("[" + j$(data).attr("points") + "]");
			let points=[];
			points.push(new d2.Point(array[0],array[1]));
			points.push(new d2.Point(array[2],array[3]));
			points.push(new d2.Point(array[4],array[5]));
			points.push(new d2.Point(array[6],array[7]));
			this.roundRect.rounding=parseInt(j$(data).attr("arc"));
			this.roundRect.setPoints(points);
		}
		
		this.thickness = (parseInt(j$(data).attr("thickness")));
		this.fill = parseInt(j$(data).attr("fill"));
	}
	paint(g2, viewportWindow, scale) {
		var rect = this.roundRect.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}
		
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			g2.globalCompositeOperation = 'lighter';
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}
			g2.globalCompositeOperation = 'source-over';
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}			
		}
		let r=this.roundRect.clone();	
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		r.paint(g2);
		
		g2._fill=false;
		
		

		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
	}

drawControlPoints(g2, viewportWindow, scale){
	utilities.drawCrosshair(g2,viewportWindow,scale,this.resizingPoint,this.selectionRectWidth,this.roundRect.vertices); 		
	}	
}

class Circle extends Shape{
	constructor(x,y,r,thickness,layermaskId) {
		super(0, 0, 0, 0, thickness,
				layermaskId);
		this.setDisplayName("Circle");
		this.selectionRectWidth=3000;
		this.resizingPoint=null;
		this.circle=new d2.Circle(new d2.Point(x,y),r);
		this.rotate=0;
	}
clone() {
	let copy=new Circle(this.circle.center.x,this.circle.center.y,this.circle.radius,this.thickness,this.copper.getLayerMaskID());
	copy.rotate=this.rotate;
	copy.fill=this.fill;
	return copy				
	}	
calculateShape(){    
	 return this.circle.box;	 
    }
alignToGrid(isRequired) {
        if(isRequired){
          return super.alignToGrid(isRequired);
        }else{
            return null;
        }
}
alignResizingPointToGrid(point) {          
        this.width=this.owningUnit.getGrid().lengthOnGrid(this.width);                
}
isClicked(x, y) {
	if (this.circle.contains(new d2.Point(x, y)))
		return true;
	else
		return false;
	}
isControlRectClicked(x,y) {
   	let pt=new d2.Point(x,y);
   	let result=null
	this.circle.vertices.some(v=>{
   		if(d2.utils.LE(pt.distanceTo(v),this.selectionRectWidth/2)){
   		  	result=v;
   			return true;
   		}else{
   			return false;
   		}
   	});
   	return result;
    }	
toXML() {
        return "<circle copper=\""+this.copper.getName()+"\" x=\""+(this.circle.pc.x)+"\" y=\""+(this.circle.pc.y)+"\" radius=\""+(this.circle.r)+"\" thickness=\""+this.thickness+"\" fill=\""+this.fill+"\"/>";
	}
fromXML(data) {	        
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
        
 		let xx=parseInt(j$(data).attr("x"));
 		let yy=parseInt(j$(data).attr("y"));
 		
 		if(j$(data).attr("width")!=undefined){
 			let diameter=parseInt(parseInt(j$(data).attr("width")));
 	        this.circle.pc.set(xx+(parseInt(diameter/2)),yy+(parseInt(diameter/2)));
 	        this.circle.r=parseInt(diameter/2); 			
 		}else{
 			let radius=parseInt(parseInt(j$(data).attr("radius")));
 	        this.circle.pc.set(xx,yy);
 	        this.circle.r=radius; 			 		
 		}
 		 
         
 		 this.thickness = (parseInt(j$(data).attr("thickness")));
 		 this.fill = parseInt(j$(data).attr("fill")); 		
	}
	Mirror(line){
	   this.circle.mirror(line);	
	}
	Move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}	
	setRotation(rotate,center){
		let alpha=rotate-this.rotate;
		if(center==null){
			this.circle.rotate(alpha,this.circle.center);
		}else{
			this.circle.rotate(alpha,center);	 	
		}
		this.rotate=rotate;						
	}		
	Rotate(rotation){
		//fix angle
		let alpha=this.rotate+rotation.angle;
		if(alpha>=360){
			alpha-=360
		}
		if(alpha<0){
		 alpha+=360; 
		}	
		this.rotate=alpha;
		this.circle.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));
	}
	Resize(xoffset, yoffset,point) {    
        let quadrant= utilities.getQuadrantLocation(point,this.circle.center);
        let radius=this.circle.r;
        switch(quadrant){
        case utilities.QUADRANT.FIRST:case utilities.QUADRANT.FORTH: 
            //uright
             if(xoffset<0){
               //grows             
                radius+=Math.abs(xoffset);
             }else{
               //shrinks
                radius-=Math.abs(xoffset);
             }             
            break;
        case utilities.QUADRANT.SECOND:case utilities.QUADRANT.THIRD:
            //uleft
             if(xoffset<0){
               //shrinks             
                radius-=Math.abs(xoffset);
             }else{
               //grows
                radius+=Math.abs(xoffset);
             }             
            break;        
        }
         
        this.circle.r=radius;
    }	
	paint(g2, viewportWindow, scale) {
		var rect = this.circle.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		// ****3 http://scienceprimer.com/draw-oval-html5-canvas
		g2.globalCompositeOperation = 'lighter';
		g2.lineWidth = this.thickness * scale.getScale();

		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
				g2.strokeStyle = "gray";
			} else {
				g2.strokeStyle = this.copper.getColor();
			}
		} else {
			g2._fill=true;
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}			
		}

		let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		g2._fill=false;

		g2.globalCompositeOperation = 'source-over';
		
		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
  } 
 }
drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.circle.vertices);	
}
getOrderWeight(){
	return this.circle.area; 
}	
getResizingPoint() {
        return null;
}

setResizingPoint(point) {

}

}

class Arc extends Shape{
constructor(x,y,r,thickness,layermaskid){	
        super(0, 0, 0,0,thickness,layermaskid);  
		this.setDisplayName("Arc");
		this.selectionRectWidth=3000;
		this.resizingPoint=null;
		this.arc=new d2.Arc(new d2.Point(x,y),r,50,70);
		this.rotate=0;
		this.center=null;
		this.temp=1;
}
clone() {
		var copy = new Arc(this.arc.center.x,this.arc.center.y, this.arc.r,this.thickness,this.copper.getLayerMaskID());		
        copy.arc.startAngle = this.arc.startAngle;
        copy.arc.endAngle = this.arc.endAngle; 
        copy.rotate=this.rotate;
		copy.fill = this.fill;
		return copy;
}
calculateShape() {
	return this.arc.box;	
}
getOrderWeight(){
	return this.arc.area; 
}
fromXML(data){
        
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));        
		let xx=parseInt(j$(data).attr("x"));
		let yy=parseInt(j$(data).attr("y"));
		
 		if(j$(data).attr("width")!=undefined){
 			let diameter=parseInt(parseInt(j$(data).attr("width")));
 	        this.arc.pc.set(xx+(parseInt(diameter/2)),yy+(parseInt(diameter/2)));
 	        this.arc.r=parseInt(diameter/2); 			
 		}else{
 			let radius=parseInt(parseInt(j$(data).attr("radius")));
 	        this.arc.pc.set(xx,yy);
 	        this.arc.r=radius; 			 		
 		}
		let diameter=parseInt(parseInt(j$(data).attr("width"))); 
		
        //this.arc.pc.set(xx+(parseInt(diameter/2)),yy+(parseInt(diameter/2)));
        //this.arc.r = parseInt(diameter/2);
        
		this.arc.startAngle = parseInt(j$(data).attr("start"));
        this.arc.endAngle = parseInt(j$(data).attr("extend"));        
		this.thickness = (parseInt(j$(data).attr("thickness")));
		this.fill = (parseInt(j$(data).attr("fill"))||0);
}
toXML() {
    return '<arc copper="'+this.copper.getName()+'"  x="'+(this.arc.pc.x)+'" y="'+(this.arc.pc.y)+'" radius="'+(this.arc.r)+'"  thickness="'+this.thickness+'" start="'+this.arc.startAngle+'" extend="'+this.arc.endAngle+'" fill="'+this.fill+'" />';
}
setRadius(r){
	this.arc.r=r;	
}
setExtendAngle(extendAngle){
    this.arc.endAngle=utilities.round(extendAngle);
}
setStartAngle(startAngle){        
    this.arc.startAngle=utilities.round(startAngle);
}

isControlRectClicked(x,y) {
	 if(this.isStartAnglePointClicked(x,y)){
		    return this.arc.start;
		 }
	 if(this.isExtendAnglePointClicked(x,y)){
		    return this.arc.end;
		 }
	 if(this.isMidPointClicked(x,y)){
		    return this.arc.middle;	 
		 }
	     return null;
	}
isClicked(x, y) {
	if (this.arc.contains(new d2.Point(x, y)))
		return true;
	else
		return false;
	}
isMidPointClicked(x,y){
    let p=this.arc.middle;
    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                 this.selectionRectWidth, this.selectionRectWidth);
    if (box.contains({x,y})) {
        return true;
    }else{                   
        return false;
	}	
}
isStartAnglePointClicked(x,y){	
    let p=this.arc.start;
    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                 this.selectionRectWidth, this.selectionRectWidth);
    if (box.contains({x,y})) {
        return true;
    }else{                   
        return false;
	}
}
isExtendAnglePointClicked(x,y){
    let p=this.arc.end;
    let box=d2.Box.fromRect(p.x - this.selectionRectWidth / 2, p.y - this.selectionRectWidth / 2,
                 this.selectionRectWidth, this.selectionRectWidth);
    if (box.contains({x,y})) {
        return true;
    }else{                   
        return false;
	}
}	
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	if(center==undefined){
		this.arc.rotate(alpha,this.arc.center);
	}else{
		this.arc.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
Rotate(rotation){
	//fix angle
  let alpha=this.rotate+rotation.angle;
  if(alpha>=360){
		alpha-=360
  }
  if(alpha<0){
	 alpha+=360; 
  }	
  this.rotate=alpha;	
  this.arc.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy)); 
}
Mirror(line) {
  this.arc.mirror(line);
}
/*
 * Resize through mouse position point
 */
Resize(xoffset, yoffset,point) {    
    let pt=this.calculateResizingMidPoint(point.x,point.y);    
    let r=this.arc.center.distanceTo(pt);
    this.arc.r=r;
/*	
	//old middle point on arc
	let a1=this.arc.middle;  
	//mid point on line
	let m=new d2.Point((this.arc.start.x+this.arc.end.x)/2,(this.arc.start.y+this.arc.end.y)/2);
	//new middle point on arc
	let a2=this.calculateResizingMidPoint(point.x,point.y);  //new middle
	
	//do they belong to the same plane in regard to m 
	let vec = new d2.Vector(m, a2);
	let linevec=new d2.Vector(m,a1);
    let samePlane = d2.utils.GT(vec.dot(linevec.normalize()), 0);
    
    
//which plane
	console.log(samePlane);
	if(!samePlane){
		this.temp*=-1;
		//this.arc.endAngle*=-1;	
	}
	if(this.temp>0){
		let C=this.calculateResizingMidPoint(point.x,point.y);  //projection
		let C1=new d2.Point((this.arc.start.x+this.arc.end.x)/2,(this.arc.start.y+this.arc.end.y)/2);
    
		let y=C1.distanceTo(C);
		let x=C1.distanceTo(this.arc.start);
    
		let l=(x*x)/y;
		let lambda=(l-y)/2;

		let v=new d2.Vector(C,C1);
		let norm=v.normalize();			  
	
		let a=C1.x +lambda*norm.x;
		let b=C1.y + lambda*norm.y;
		let center=new d2.Point(a,b);
    
    
		let startAngle =new d2.Vector(center,this.arc.start).slope;
		let endAngle = new d2.Vector(center, this.arc.end).slope;
    
		let r = center.distanceTo(this.arc.start);

    //fix angles
		let start = 360 - startAngle;
		let end= (360-endAngle-start);
		if(end<0){ 
			end=360-Math.abs(end);
		}

	
		this.arc.center.set(center.x,center.y);
		this.arc.r=r;
		this.arc.startAngle=start;
		this.arc.endAngle=end;
	}else{
		
	}
*/
}
Move(xoffset,yoffset){
  this.arc.move(xoffset,yoffset);	
}
paint(g2, viewportWindow, scale) {
		
		var rect = this.arc.box;
		rect.scale(scale.getScale());
		if (!rect.intersects(viewportWindow)) {
			return;
		}

		g2.globalCompositeOperation = 'lighter';
		g2.beginPath(); // clear the canvas context
		g2.lineCap = 'round';

						
		g2.lineWidth = this.thickness * scale.getScale();
        		
		
		if (this.fill == core.Fill.EMPTY) {
			if (this.selection) {
					g2.strokeStyle = "gray";
			} else {
					g2.strokeStyle = this.copper.getColor();
			}
			g2._fill=false;
		} else {
			if (this.selection) {
				g2.fillStyle = "gray";
			} else {
				g2.fillStyle = this.copper.getColor();
			}
			g2._fill=true;
		}

		let a=this.arc.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);

		g2._fill=undefined;
		
		g2.globalCompositeOperation = 'source-over';

		if (this.isSelected()) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}
		if (this.center!=null) {
			utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[this.center]);	
		}
}
drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[this.arc.center,this.arc.start,this.arc.end,this.arc.middle]);	
}
setResizingPoint(pt){
	this.resizingPoint=pt;
}
getResizingPoint() {
	return this.resizingPoint;
}
calculateResizingMidPoint(x,y){
	let line=new d2.Line(this.arc.center,this.arc.middle);
	return line.projectionPoint(new d2.Point(x,y));	
}
//drawMousePoint(g2,viewportWindow,scale){
//
//	let point=this.calculateResizingMidPoint(this.resizingPoint.x,this.resizingPoint.y);
//    
//	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,[point]);
//    
//}

}
class SolidRegion extends Shape{
	constructor(layermaskId) {
        super( 0, 0, 0,0, 0, layermaskId);
        this.displayName = "Solid Region";
        this.floatingStartPoint=new d2.Point();
        this.floatingEndPoint=new d2.Point();                 
        this.selectionRectWidth = 3000;
        this.polygon=new d2.Polygon();
        this.resizingPoint;
        this.rotate=0;
    }
clone(){
	  var copy=new SolidRegion(this.copper.getLayerMaskID());
      copy.polygon=this.polygon.clone();
      copy.rotate=this.rotate;
      return copy;
}
getOrderWeight(){
	return this.polygon.box.area; 
}
alignResizingPointToGrid(targetPoint) {
    this.owningUnit.grid.snapToGrid(targetPoint);         
}
calculateShape() {
	return this.polygon.box;	
}
getLinePoints() {
	   return this.polygon.points;
}
add(point) {
	    this.polygon.add(point);
}
setResizingPoint(point) {
	    this.resizingPoint=point;
}
isFloating() {
    return (!this.floatingStartPoint.equals(this.floatingEndPoint));                
}
isClicked(x,y){
	  return this.polygon.contains(x,y);
}
isControlRectClicked(x, y) {
	var rect = d2.Box.fromRect(x-this.selectionRectWidth / 2, y - this.selectionRectWidth/ 2, this.selectionRectWidth, this.selectionRectWidth);
	let point = null;

	this.polygon.points.some(function(wirePoint) {
		if (rect.contains(wirePoint)) {
					point = wirePoint;
		  return true;
		}else{
		  return false;
		}
	});

	return point;
}
Resize(xoffset, yoffset, clickedPoint) {
	clickedPoint.set(clickedPoint.x + xoffset,
								clickedPoint.y + yoffset);
}
reset(){
	this.resetToPoint(this.floatingStartPoint);	
}
resetToPoint(p){
    this.floatingStartPoint.set(p.x,p.y);
    this.floatingEndPoint.set(p.x,p.y); 
}
Move(xoffset, yoffset) {
	this.polygon.move(xoffset,yoffset);
}
Mirror(line) {
    this.polygon.mirror(line);
}
setRotation(rotate,center){
	let alpha=rotate-this.rotate;
	let box=this.polygon.box;
	if(center==null){
		this.polygon.rotate(alpha,box.center);
	}else{
		this.polygon.rotate(alpha,center);	 	
	}
	this.rotate=rotate;
}
Rotate(rotation) {
	//fix angle
	let alpha=this.rotate+rotation.angle;
	if(alpha>=360){
		alpha-=360
	}
	if(alpha<0){
	 alpha+=360; 
	}	
	this.rotate=alpha;
	this.polygon.rotate(rotation.angle,{x:rotation.originx,y:rotation.originy});
}
paint(g2, viewportWindow, scale) {		
	var rect = this.polygon.box;
	rect.scale(scale.getScale());		
	if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
		return;
	}
	
	g2.lineWidth = 1;
	
	if(this.isFloating()){
      g2.strokeStyle = this.copper.getColor();		
	}else{
	  g2._fill=true;
	  if (this.selection) {
		 g2.fillStyle = "gray";
	  } else {
		 g2.fillStyle = this.copper.getColor();
	  }
	}

	

	let a=this.polygon.clone();	
	if (this.isFloating()) {
		let p = this.floatingEndPoint.clone();
		a.add(p);	
    }
	a.scale(scale.getScale());
	a.move( - viewportWindow.x, - viewportWindow.y);		
	a.paint(g2);
	g2._fill=false;
    
	if (this.isSelected()) {
		this.drawControlPoints(g2, viewportWindow, scale);
	}
}
drawControlPoints(g2, viewportWindow, scale) {
	utilities.drawCrosshair(g2,viewportWindow,scale,null,this.selectionRectWidth,this.polygon.points);	
}
toXML() {
	var result = "<solidregion copper=\"" + this.copper.getName() + "\">";
	this.polygon.points.forEach(function(point) {
		result += point.x + "," + point.y + ",";
	});
	result += "</solidregion>";
	return result;
}
fromXML(data) {
       if(j$(data).attr("copper")!=null){
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
       }else{
        this.copper=core.Layer.Copper.FSilkS;
       }	
   	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseFloat(tokens[index]);
			var y = parseFloat(tokens[index + 1]);
			this.polygon.points.push(new d2.Point(x, y));
		}
}
}

class Line extends AbstractLine{
constructor(thickness,layermaskId) {
			super(thickness,layermaskId);	
}
clone() {
		  var copy = new Line(this.thickness,this.copper.getLayerMaskID());
		  copy.polyline=this.polyline.clone();
		  copy.rotate=this.rotate;
		  return copy;
		}
alignToGrid(isRequired) {
    if (isRequired) {
        this.polyline.points.forEach(function(wirePoint){
            let point = this.owningUnit.getGrid().positionOnGrid(wirePoint.x, wirePoint.y);
              wirePoint.set(point.x,point.y);
        }.bind(this));
    }
    return null;
}

getOrderWeight() {
	return 2;
}

paint(g2, viewportWindow, scale) {		
		var rect = this.polyline.box;
		rect.scale(scale.getScale());		
		if (!this.isFloating()&& (!rect.intersects(viewportWindow))) {
			return;
		}
				
		g2.globalCompositeOperation = 'lighter';
		g2.lineCap = 'round';
		g2.lineJoin = 'round';
		

		g2.lineWidth = this.thickness * scale.getScale();


		if (this.selection)
			g2.strokeStyle = "gray";
		else
			g2.strokeStyle = this.copper.getColor();

		let a=this.polyline.clone();
		a.scale(scale.getScale());
		a.move( - viewportWindow.x, - viewportWindow.y);		
		a.paint(g2);
		
		// draw floating point
		if (this.isFloating()) {
				let p = this.floatingEndPoint.clone();
				p.scale(scale.getScale());
				p.move( - viewportWindow.x, - viewportWindow.y);
					g2.lineTo(p.x, p.y);									
					g2.stroke();					
		}
		
		g2.globalCompositeOperation = 'source-over';
		if (this.selection) {
			this.drawControlPoints(g2, viewportWindow, scale);
		}

}

toXML() {
	var result = "<line copper=\"" + this.copper.getName()
								+ "\" thickness=\"" + this.thickness + "\">";
	this.polyline.points.forEach(function(point) {
		result += utilities.roundFloat(point.x,5) + "," + utilities.roundFloat(point.y,5) + ",";
	},this);
	result += "</line>";
	return result;
}
fromXML(data) {
       if(j$(data).attr("copper")!=null){
        this.copper =core.Layer.Copper.valueOf(j$(data).attr("copper"));
       }else{
        this.copper=core.Layer.Copper.FSilkS;
       }	
	   this.thickness = (parseInt(j$(data).attr("thickness")));
   	   var tokens = data.textContent.split(",");
	   var len = Math.floor(tokens.length / 2) * 2;
	   for (var index = 0; index < len; index += 2) {
			var x = parseFloat(tokens[index]);
			var y = parseFloat(tokens[index + 1]);
			this.polyline.points.push(new d2.Point(x, y));
		}
}
}


class Drill{
	 constructor(x,y,width) {
	    this.circle=new d2.Circle(new d2.Point(x,y),width/2);
	 }
	 clone(){
		 let copy= new Drill(0);
		 copy.circle.pc.x=this.circle.pc.x;
		 copy.circle.pc.y=this.circle.pc.y;
		 copy.circle.r=this.circle.r;
		 return copy;
	 }
	 setLocation(x,y){
        this.circle.pc.x=x;
        this.circle.pc.y=y;
	 }
	 Move( xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	 }
	 getWidth(){
		 return 2*this.circle.r;
	 }
	 setWidth(width){
		 this.circle.r=width/2;
	 }
	 rotate(alpha,origin){
	    if(origin==null){
	       this.circle.rotate(alpha);
	    }else{
	       this.circle.rotate(alpha,origin);	
	    }		 
	 }
	paint(g2,viewportWindow,scale){
	    g2._fill=true;
	    g2.fillStyle = 'black';
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
		g2._fill=false;
	}
	toXML(){
	    return "<drill type=\"CIRCULAR\" x=\""+this.circle.pc.x+"\" y=\""+this.circle.pc.y+"\" width=\""+2*this.circle.radius+"\" />";	
	}
	fromXML(data){ 
	   this.setLocation(parseInt(j$(data).attr("x")),parseInt(j$(data).attr("y")));
	   this.setWidth(parseInt(j$(data).attr("width")));  	   
	}
}


PadShape={
	 RECTANGULAR:0,
	 CIRCULAR:1,
	 OVAL:2,
	 POLYGON:3,
	 parse:function(shape){
		 switch(shape){
		  case 'RECTANGULAR':
			     return this.RECTANGULAR;
				 break;
		  case 'CIRCULAR':
				 return this.CIRCULAR;
				 break; 
		  case 'OVAL':
				 return this.OVAL;
				 break;	
		  case 'POLYGON':
				 return this.POLYGON;
				 break;					 
		  default:
			  throw new TypeError('Unrecognized pad Shape:'+shape+' to parse');  
		  } 
	 },
	format:function(shape){
		if(shape==this.RECTANGULAR)
			return 'RECTANGULAR';
		if(shape==this.CIRCULAR)
			return 'CIRCULAR';
		if(shape==this.OVAL)
			return 'OVAL';
		if(shape==this.POLYGON)
			return 'POLYGON';
		else
			return '';
	} 
};
	    
PadType={
	   THROUGH_HOLE:0,
	   SMD:1,
	   CONNECTOR:2,
	   parse:function(type){
		  switch(type){
		  case 'THROUGH_HOLE':
			     return this.THROUGH_HOLE;
				 break;
		  case 'SMD':
				 return this.SMD;
				 break; 
		  case 'CONNECTOR':
				 return this.CONNECTOR;
				 break;	
		  default:
			  throw new TypeError('Unrecognized pad Type:'+type+' to parse');  
		  } 
	   },
	   format:function(type){
		  if(type==this.THROUGH_HOLE)
			 return 'THROUGH_HOLE';
		  if(type==this.SMD)
				 return 'SMD';
		  if(type==this.CONNECTOR)
				 return 'CONNECTOR';
		  else
			  return '';
	   }
};

class Pad extends Shape{
	constructor(x,y,width,height) {
	   super(0, 0, width, height, -1, core.Layer.LAYER_BACK);
	   this.drill=null;
	   this.rotate=0;
	   this.offset=new d2.Point(0,0);
	   this.shape=new CircularShape(0,0,width,this);
	   this.setType(PadType.THROUGH_HOLE);	   
	   this.setDisplayName("Pad");
	   this.text=new core.ChipText();
	   this.text.Add(new font.FontTexture("number","1",x,y,4000,0));
	   this.text.Add(new font.FontTexture("netvalue","",x,y,4000,0));   
	}
clone(){
	     var copy=new Pad(0,0,this.width,this.height);
	     copy.setType(this.type);
	     copy.width=this.width;
	     copy.height=this.height;
	     copy.rotate=this.rotate;
	     copy.shape=this.shape.copy(copy);
	     copy.copper=this.copper;
	     copy.text=this.text.clone();
	     if(this.drill!=null){
	    	 copy.drill=this.drill.clone();
	     }
	     return copy;
	}
getChipText() {
	    return this.text;
}
getCenter(){
	return this.shape.center;
}
toXML(){
	    var xml="<pad copper=\""+this.copper.getName()+"\" type=\"" +PadType.format(this.type) + "\" shape=\""+PadShape.format(this.getShape())+"\" x=\""+this.shape.center.x+"\" y=\""+this.shape.center.y+"\" width=\""+this.getWidth()+"\" height=\""+this.getHeight()+"\" rt=\""+this.rotate+"\">\r\n";
	        //xml+=this.shape.toXML()+"\r\n";
	        xml+="<offset x=\""+this.offset.x+"\" y=\""+this.offset.y+"\" />\r\n";
	    
	        if (!this.text.getTextureByTag("number").isEmpty())
	        	xml+="<number>" +
	                      this.text.getTextureByTag("number").toXML() +
	                      "</number>\r\n";
	    if (!this.text.getTextureByTag("netvalue").isEmpty())
	           xml+="<netvalue>" +
	                      this.text.getTextureByTag("netvalue").toXML() +
	                      "</netvalue>\r\n";
	    if(this.drill!=null){
	        xml+=this.drill.toXML()+"\r\n";  
	    }
	    xml+="</pad>";
	    return xml;	
	}	
fromXML(data){   
		      this.copper=core.Layer.Copper.valueOf(j$(data).attr("copper"));
		      this.setType(PadType.parse(j$(data).attr("type")));
		      
			  let x=(parseInt(j$(data).attr("x")));
			  let y=(parseInt(j$(data).attr("y")));
		      this.width=(parseInt(j$(data).attr("width")));
		      this.height=(parseInt(j$(data).attr("height")));
		      
		      if(j$(data).attr("rt")!=undefined)
		        this.rotate=(parseInt(j$(data).attr("rt")));
		      
		      this.setShape(x,y,PadShape.parse(j$(data).attr("shape")));
			  
		      var offset=(j$(data).find("offset"));
		      this.offset.x=(parseInt(j$(offset).attr("x")));
		      this.offset.y=(parseInt(j$(offset).attr("y")));
		      
		      if(this.drill!=null){
		          this.drill.fromXML(j$(data).find("drill"));
		      }   

		      var number=(j$(data).find("number").text()); 
			  var netvalue=(j$(data).find("netvalue").text());
			  if(number==''){
				  this.text.getTextureByTag("number").setLocation(this.getX(), this.getY());
			  }else{
				  this.text.getTextureByTag("number").fromXML(number);
			  }
			  if(netvalue==''){
				  this.text.getTextureByTag("netvalue").setLocation(this.getX(), this.getY());
			  }else{
				  this.text.getTextureByTag("netvalue").fromXML(netvalue);
			  }
		     
	}
getPinsRect() {
	     return d2.Box.fromRect(this.shape.center.x, this.shape.center.y, 0,0);
	}
alignToGrid(isRequired){
	     var center=this.shape.center;
	     var point=this.owningUnit.getGrid().positionOnGrid(center.x,center.y);
	     this.Move(point.x - center.x,point.y - center.y);
	     return null;     
	}	
getOrderWeight(){
	     return 2; 
	}
isClicked(x,y){
	    if(this.shape.contains(new d2.Point(x,y)))
	     return true;
	    else
	     return false;  
	 }
isInRect(r) {
		 let rect=super.getBoundingShape();
	     if(r.contains(rect.center))
	         return true;
	        else
	         return false; 
	}
setSelected (selection) {
	super.setSelected(selection);
	this.text.setSelected(selection);
}
Move(xoffset, yoffset){
	   this.shape.move(xoffset, yoffset);
	   
	   if(this.drill!=null){
	     this.drill.Move(xoffset, yoffset);
	   }
	   this.text.Move(xoffset,yoffset);
	   
	}

Mirror(line) {
//    let source = new d2.Point(this.x,this.y);
//    utilities.mirrorPoint(A, B, source);
//    this.setX(source.x);
//    this.setY(source.y);
//    if (this.drill != null) {
//        this.drill.Mirror(A, B);
//    }
//    this.text.Mirror(A, B);
}
setRotation(rotate,center){	
	let alpha=rotate-this.rotate;	
	if(center==null){
	  this.shape.rotate(alpha);
	  this.text.setRotation(rotate,this.shape.center);
	  if(this.drill!=null){
		this.drill.rotate(alpha);
	  }	  	  
	}else{		
	  this.shape.rotate(alpha,center);
	  this.text.setRotation(rotate,center);
	  if(this.drill!=null){
	    this.drill.rotate(alpha,center);
	  }	  
	}
	this.rotate=rotate;
}
Rotate(rotation){
	let alpha=this.rotate+rotation.angle;
	if(alpha>=360){
		alpha-=360
	}
	 if(alpha<0){
		 alpha+=360; 
	 }
	this.shape.rotate(rotation.angle,new d2.Point(rotation.originx,rotation.originy));	
    if(this.drill!=null){
     this.drill.Rotate(rotation);
    }	
	this.text.setRotation(alpha,new d2.Point(rotation.originx,rotation.originy));
	this.rotate=alpha;
	
	}
setType(type) {
	        this.type = type;
	        switch(type){
	        case PadType.THROUGH_HOLE:
	            if(this.drill==null){
	            	this.drill=new Drill(this.shape.center.x,this.shape.center.y,core.MM_TO_COORD(0.8));		               	                
	            }
	            break;
	        case PadType.SMD:
	                this.drill=null;
	            break;
			}
}
setShape(...args){
	    let shape,x,y; 
	    if(args.length==1){
	      x=this.shape.center.x;
	      y=this.shape.center.y;
	      shape=args[0];
	    }else{
		  x=args[0];
		  y=args[1];
		  shape=args[2];	      	
	    }
	    switch(shape){
	    case PadShape.CIRCULAR:
	        this.shape=new CircularShape(x,y,this.width,this);
	    break;
	     case PadShape.OVAL: 
	        this.shape=new OvalShape(x,y,this.width,this.height,this);
	        break;
	    case PadShape.RECTANGULAR:
	        this.shape=new RectangularShape(x,y,this.width,this.height,this);
	        break;
	    case PadShape.POLYGON:
		    this.shape = new PolygonShape(x,y,this.width,this);
	        break;
	    } 
	    //restore rotation
	    if(this.rotate!=0){
		  this.shape.rotate(this.rotate);
	    }
}
getShape(){
		if(this.shape instanceof CircularShape)
	        return PadShape.CIRCULAR;
		if(this.shape instanceof RectangularShape)
	        return PadShape.RECTANGULAR;
		if(this.shape instanceof OvalShape)
	        return PadShape.OVAL;
		if(this.shape instanceof PolygonShape)
	        return PadShape.POLYGON;		
}    
setWidth(width){
	        this.width=width;
	        this.shape.setWidth(width);    
	    }
setHeight(height){
	        this.height=height;
	        this.shape.setHeight(height);
	    }
calculateShape() {
	return this.shape.box;
} 
validateClearance(source){
    //is different layer and SMD -> no clearance
    if ((source.copper.getLayerMaskID() & this.copper.getLayerMaskID()) == 0) {
        //if(this.type==PadType.SMD)
           return false; //not on the same layer
    }	
	return true;
}
drawClearence(g2,viewportWindow,scale,source){
    if(!this.validateClearance(source)){
        return;
    }
	
	this.shape.drawClearence(g2,viewportWindow,scale,source);
}
paint(g2,viewportWindow,scale){
	    switch(this.type){
	    case PadType.THROUGH_HOLE:
	        if(this.shape.paint(g2, viewportWindow, scale)){
	         if(this.drill!=null){
	            this.drill.paint(g2, viewportWindow, scale);
	         }
	        }
	        break;
	    case PadType.SMD:
	        this.shape.paint(g2, viewportWindow, scale);
	        break;
	    
	    }
	    this.text.paint(g2, viewportWindow, scale);	    
	 }

}
	//----------CircularShape-------------------
class CircularShape{
	constructor(x,y,width,pad){
		this.pad=pad;
		this.circle=new d2.Circle(new d2.Point(x,y),width/2);		
	}
	drawClearence(g2,viewportWindow,scale,source){
	    let c=this.circle.clone();
	    
		
		g2._fill=true;
		g2.fillStyle = "black";	
		
		c.grow(source.clearance);
		
		
	    c.scale(scale.getScale());		
	    c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
	    g2._fill=false;			
	}	
    paint(g2,viewportWindow,scale){
	     var box=this.circle.box;
	     box.scale(scale.scale);     
       //check if outside of visible window
	     var window=new d2.Box(0,0,0,0);
	     window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
         if(!box.intersects(window)){
           return false;
         }
	    
	    
		if(this.pad.isSelected())
	        g2.fillStyle = "gray";  
	    else{
	        g2.fillStyle = this.pad.copper.getColor();
	    }
	    g2._fill=true;
		
	    let c=this.circle.clone();
		c.scale(scale.getScale());
        c.move(-viewportWindow.x,- viewportWindow.y);
		c.paint(g2);
		
		g2._fill=false;
		
		return true;
	}
    copy(pad){
  	  let _copy=new CircularShape(0,0,0,pad);
  	  _copy.circle=this.circle.clone();	  
  	  return _copy;  
  	} 
    rotate(alpha,origin){
    	if(origin==null){
    	  this.circle.rotate(alpha);
    	}else{
    	  this.circle.rotate(alpha,origin);	
    	}
    }    
    contains(pt){
    	return this.circle.contains(pt);
    }
	move(xoffset, yoffset) {
		this.circle.move(xoffset,yoffset);
	}	
	get box(){
		return this.circle.box;
	}
	get center(){
		return this.circle.center;	
	}
    setWidth(width) {
	   this.circle.r=width/2;
	}
    setHeight(height){
	
    }

}
//------------RectangularShape----------------
class RectangularShape{
	constructor(x,y,width,height,pad){
		this.pad=pad;
		this.rect=new d2.Rectangle(new d2.Point(x-width/2,y-height/2),width,height);			
}
drawClearence(g2,viewportWindow,scale,source){
    let r=this.rect.clone();
    
	
	g2._fill=true;
	g2.fillStyle = "black";	
	
	r.grow(source.clearance);
	
    r.scale(scale.getScale());		
    r.move(-viewportWindow.x,- viewportWindow.y);
	r.paint(g2);
	
    g2._fill=false;			
}
paint(g2,viewportWindow,scale){
	   var box=this.rect.box;
	   box.scale(scale.scale);     
       //check if outside of visible window
	   var window=new d2.Box(0,0,0,0);
	   window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
       if(!box.intersects(window)){
         return false;
       }
       
	    if(this.pad.isSelected())
	      g2.fillStyle = "gray";  
	    else{
	      g2.fillStyle = this.pad.copper.getColor();
	    }
	    g2._fill=true;
        let r=this.rect.clone();
		r.scale(scale.getScale());
        r.move(-viewportWindow.x,- viewportWindow.y);
		r.paint(g2);
	    
		g2._fill=false;
	    return true;
}
copy(pad){
  let _copy=new RectangularShape(0,0,0,0,pad);
  _copy.rect=this.rect.clone();	  
  return _copy;  
}
contains(pt){
	return this.rect.contains(pt);
}
rotate(alpha,origin){
	if(origin==null){
		  this.rect.rotate(alpha);
	}else{
		  this.rect.rotate(alpha,origin);	
	}
	
}
move(xoffset, yoffset) {
	this.rect.move(xoffset,yoffset);
}
get box(){
	return this.rect.box;
}
get center(){
	return this.rect.box.center;	
}
setWidth(width) {
		   this.rect.setSize(this.pad.width,this.pad.height);
		   this.rect.rotate(this.pad.rotate);
}
setHeight(height) {
		   this.rect.setSize(this.pad.width,this.pad.height);
		   this.rect.rotate(this.pad.rotate);
}
}
//------------OvalShape-----------------------
class OvalShape{
	constructor(x,y,width,height,pad){
	   this.pad=pad;
	   this.obround=new d2.Obround(new d2.Point(x,y),width,height);
	}
	drawClearence(g2,viewportWindow,scale,source){
		let o=this.obround.clone();
	    o.grow(source.clearance);

	    g2.strokeStyle = "black";  

		o.scale(scale.getScale());
	    o.move(-viewportWindow.x,- viewportWindow.y);
		o.paint(g2);
		
	}
paint(g2,viewportWindow,scale){
	     var box=this.obround.box;
	     box.scale(scale.scale);     
       //check if outside of visible window
	     var window=new d2.Box(0,0,0,0);
	     window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
         if(!box.intersects(window)){
           return false;
         }
         
	     g2.lineWidth = this.obround.width * scale.getScale();
	     if(this.pad.isSelected())
	        g2.strokeStyle = "gray";  
	     else{
	        g2.strokeStyle = this.pad.copper.getColor();
	     }
	      
		   let o=this.obround.clone();
		   o.scale(scale.getScale());
	       o.move(-viewportWindow.x,- viewportWindow.y);
		   o.paint(g2);

	      return true;
}
copy(pad){
	  let _copy=new OvalShape(0,0,0,0,pad);
	  _copy.obround=this.obround.clone();	  
	  return _copy;  
	}
rotate(alpha,origin){
	if(origin==null){
	  this.obround.rotate(alpha);
	}else{
	  this.obround.rotate(alpha,origin);	
	}
}
contains(pt){
	return this.obround.contains(pt);
}
move(xoffset, yoffset) {
	this.obround.move(xoffset,yoffset);
}
get box(){
	return this.obround.box;
}
get center(){
	return this.obround.center;	
}
setWidth(width) {	    
	    this.obround.setWidth(width);
}
setHeight(height) {	    
	    this.obround.setHeight(height);
	    this.obround.rotate(this.pad.rotate);
}
}

//--------------PolygonShape-------------------------
class PolygonShape{
constructor(x,y,width,pad){
		this.pad=pad;
		this.hexagon=new d2.Hexagon(new d2.Point(x,y),width);		
}	
drawClearence(g2,viewportWindow,scale,source){
	    let h=new d2.Hexagon(this.hexagon.center.clone(),(this.hexagon.width+2*source.clearance));
	    h.rotate(this.pad.rotate);
     
	    g2._fill=true;		   
		g2.fillStyle = "black";	
	    h.scale(scale.getScale());
        h.move(-viewportWindow.x,- viewportWindow.y);
	    h.paint(g2);
	    
	    g2._fill=false;
}
paint(g2, viewportWindow, scale) {
		   var box=this.hexagon.box;
		   box.scale(scale.scale);     
	       //check if outside of visible window
		   var window=new d2.Box(0,0,0,0);
		   window.setRect(viewportWindow.x,viewportWindow.y,viewportWindow.width,viewportWindow.height);
	       if(!box.intersects(window)){
	         return false;
	       }
	       if(this.pad.isSelected()){
	         g2.fillStyle = "gray";  
		   }else{
	         g2.fillStyle = this.pad.copper.getColor();
	       }
	        
		   g2._fill=true;		   
	       let p=this.hexagon.clone();
		   p.scale(scale.getScale());
	       p.move(-viewportWindow.x,- viewportWindow.y);
		   p.paint(g2);
		    
		   g2._fill=false;
            
           return true;
}
copy(pad){
	  let _copy=new PolygonShape(0,0,0,pad);
	  _copy.hexagon=this.hexagon.clone();	  
	  return _copy;  
	}
contains(pt){
		return this.hexagon.contains(pt);
	}
rotate(alpha,origin){
	if(origin==null){
	  this.hexagon.rotate(alpha);
	}else{
	  this.hexagon.rotate(alpha,origin);	
	}
}
get box(){
	return this.hexagon.box;
}
get center(){
	return this.hexagon.center;	
}
move(xoffset, yoffset) {
		this.hexagon.move(xoffset,yoffset);
	}
setWidth(width) {
        this.hexagon.setWidth(width);
}
setHeight(height) {
            
}	
}
module.exports ={
	GlyphLabel,
	Line,
	RoundRect,
	Circle,
	Arc,
	SolidRegion,
	Pad,Drill,
	FootprintShapeFactory
}

});

;require.register("pads/views/footprintloadview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var FootprintContainer=require('pads/d/footprintcomponent').FootprintContainer;

var FootprintLoadView=Backbone.View.extend({
	  initialize:function(opt){
			j$('#FootprintLoadDialog').jqxWindow('open');
			j$('#FootprintLoadDialog').off('close', j$.proxy(this.onclose,this)); 
			j$('#FootprintLoadDialog').on('close', j$.proxy(this.onclose,this)); 			
			this.unitSelectionPanel=new core.UnitSelectionPanel({selectorid:'unitselectionpanel',canvasprefixid:'f',enabled:opt.enabled});
			this.libraryview=new LibraryView({unitSelectionPanel:this.unitSelectionPanel});  
	    	this.buttonview=new ButtonView({unitSelectionPanel:this.unitSelectionPanel});  
	    	j$('#loadtitle').html("Load Footprint");
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
		j$('#footprinttree').jqxTree({width: '100%',height:'260px'});
		//bind select element
		j$('#footprinttree').on('select',j$.proxy(this.onvaluechange,this));			
        this.loadlibrary();
	},
	clear:function(){
	    //unbind select element		
		j$('#footprinttree').off('select',j$.proxy(this.onvaluechange,this));
		j$('#footprinttree').jqxTree('clear');
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
    	var item = j$('#footprinttree').jqxTree('getItem', event.args.element);
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
	        url: '/rest/footprints/libraries/'+url,
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#FootprintLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(callback,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#FootprintLoadDialog').unblock();
	        }
	    });
    	
    },
    loadfootprint:function(data, textStatus, jqXHR){
      this.unitSelectionPanel.release();
      footprintContainer=new FootprintContainer(true);
      //disable 
      core.isEventEnabled=false;
      footprintContainer.parse(data);
      core.isEventEnabled=true;
      this.unitSelectionPanel.unitSelectionGrid.setModel(footprintContainer);
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
    	var item = j$('#footprinttree').jqxTree('getSelectedItem');
		var that=this; 
		//fill category with footprints
		j$(data).find("name").each(j$.proxy(function(){	
			j$('#footprinttree').jqxTree('addTo', { label: j$(this).text(),value:{library:j$(this).attr("library"),category:j$(this).attr("category"),fullname:j$(this).attr("fullname")}}, item);         
		}),that);
		j$('#footprinttree').jqxTree('render');
		//expand
		j$('#footprinttree').jqxTree('expandItem', item.element);
    },
    loadlibrary:function(){
	    j$.ajax({
	        type: 'GET',
	        contentType: 'application/xml',
	        url: '/rest/footprints/libraries',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#FootprintLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadlibraries,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#FootprintLoadDialog').unblock();
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
	        url: '/rest/footprints/libraries/'+library+'/categories',
	        dataType: "xml",
	        beforeSend:function(){
		          j$('#FootprintLoadDialog').block({message:'<h5>Loading...</h5>'});	
		        },
	        success: j$.proxy(this.onloadcategories,this),
	        
	        error: function(jqXHR, textStatus, errorThrown){
	            	alert(errorThrown+":"+jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus){
	        	j$('#FootprintLoadDialog').unblock();
	        }
	    });		
	},
	onloadcategories:function(data, textStatus, jqXHR){
		var that=this; 
		j$('#footprinttree').jqxTree('clear');
		j$(data).find("name").each(j$.proxy(function(){	
			j$('#footprinttree').jqxTree('addTo', { label: j$(this).text(),value:{library:j$(this).attr("library"),category:j$(this).attr("category"),fullname:(j$(this).attr("category")==undefined?j$(this).text():undefined)}}, null);         
		}),that);		
		j$('#footprinttree').jqxTree('render');
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
		j$('#FootprintLoadDialog').jqxWindow('close');
    },
    onclose:function(){
    	j$('#FootprintLoadDialog').jqxWindow('close'); 	
    },
    
	render:function(){
		j$(this.el).empty();
		j$(this.el).append(
		"<button  id=\"loadbuttonid\" class=\"btn btn-default\">Load</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	    "<button  id=\"closebuttonid\" class=\"btn btn-default\">Close</button>");
	}
});

module.exports =FootprintLoadView	



});

;require.register("pads/views/footprintsaveview.js", function(exports, require, module) {
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
});

;require.register("pads/views/footprintspanelview.js", function(exports, require, module) {
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
		console.log(this.target.getModel());
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
		    this.component.Repaint();
		 }
		 if(event.target.id=='nameid'){
			 this.target.unitName=j$("#nameid").val(); 
			 this.component.getModel().fireUnitEvent({target:this.target,type:events.Event.RENAME_UNIT});
		 }
		 if(event.target.id=='originxid'||event.target.id=='originyid'){   
			 if(this.component.getModel().getUnit().getCoordinateSystem()!=null){
			    this.component.getModel().getUnit().getCoordinateSystem().reset(core.MM_TO_COORD(parseFloat(j$('#originxid').val())),core.MM_TO_COORD(parseFloat(j$('#originyid').val())));  
			    this.component.componentResized();     
			    this.component.Repaint();
			 }
		 }
		 //mycanvas.focus();
		
	},
	onchange:function(event){
		if(event.target.id=='gridrasterid'){
			this.target.grid.setGridValue(parseFloat(j$("#gridrasterid").val()));
			this.component.Repaint();
		}		
		if(event.target.id=='referenceid'){
			var texture=UnitMgr.getInstance().getTextureByTag(this.target,'reference');
			if(texture!=null){
				texture.tag='label';
			}
			//unmark the other
			if(j$("#referenceid").val()==-1)
				return;
			label=this.target.getShape(j$("#referenceid").val());
			label.getChipText().get(0).tag='reference';
			this.component.Repaint();
		}
		if(event.target.id=='valueid'){
			var texture=UnitMgr.getInstance().getTextureByTag(this.target,'value');
			if(texture!=null){
				texture.tag='label';
			}
			//unmark the other
			if(j$("#valueid").val()==-1)
				return;
			label=this.target.getShape(j$("#valueid").val());
			label.getChipText().get(0).tag='value';
			this.component.Repaint();
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
        'keypress #offsetxid' : 'onenter',
        'keypress #offsetyid' : 'onenter',
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
        
       this.component.Repaint(); 
      },
    onenter:function(event){
		 if(event.keyCode != 13){
				return; 
		 }
	     if(event.target.id=='padwidthid'){
	    	console.log(1); 
	        this.target.setWidth(core.MM_TO_COORD(parseFloat(j$('#padwidthid').val()))); 
	     }
	     if(event.target.id=='padheightid'){
	    	this.target.setHeight(core.MM_TO_COORD(parseFloat(j$('#padheightid').val()))); 
	     }
	     if(event.target.id=='rotateid'){
		        this.target.setRotation(Math.abs(utilities.round(j$('#rotateid').val()))); 
		     }	     
		 if(event.target.id=='numberid'){ 
			 this.target.getChipText().getTextureByTag("number").setText(j$('#numberid').val());			   
		 }
		 if(event.target.id=='numbersizeid'){ 
			 this.target.getChipText().getTextureByTag("number").setSize(core.MM_TO_COORD(parseFloat(j$('#numbersizeid').val())));  
		 }
		 if(event.target.id=='numberxid'||event.target.id=='numberyid'){ 
			 this.target.getChipText().getTextureByTag("number").setLocation(this.fromUnitX(parseFloat(j$('#numberxid').val())),this.fromUnitY(parseFloat(j$('#numberyid').val())));
			 
		 }
		 //--------netvalue-------
		 if(event.target.id=='netvalueid'){ 
			 this.target.getChipText().getTextureByTag("netvalue").setText(j$('#netvalueid').val()); 
		 }
		 if(event.target.id=='netvaluesizeid'){ 
			 this.target.getChipText().getTextureByTag("netvalue").setSize(core.MM_TO_COORD(parseFloat(j$('#netvaluesizeid').val()))); 
		 }
		 if(event.target.id=='netvaluexid'||event.target.id=='netvalueyid'){ 
			 this.target.getChipText().getTextureByTag("netvalue").setLocation(this.fromUnitX(parseFloat(j$('#netvaluexid').val())),this.fromUnitY(parseFloat(j$('#netvalueyid').val()))); 
		 }
		 if(event.target.id=='drillwidthid'){ 
			 this.target.drill.setWidth(core.MM_TO_COORD(parseFloat(j$('#drillwidthid').val())));   
		 }
		 if(event.target.id=='offsetxid'){ 
			 this.target.offset.x=(core.MM_TO_COORD(parseFloat(j$('#offsetxid').val())));   
		 }
		 if(event.target.id=='offsetyid'){ 
			 this.target.offset.y=(core.MM_TO_COORD(parseFloat(j$('#offsetyid').val())));   
		 }
		 this.component.Repaint(); 
    },
	updateui:function(){

		 j$('#layerid').val(this.target.copper.getName());
		 j$('#padxid').val(this.toUnitX(this.target.getCenter().x));
		 j$('#padyid').val(this.toUnitY(this.target.getCenter().y));
		 j$("#rotateid").val(this.target.rotate);  
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
	        j$('#numberid').val(this.target.getChipText().getTextureByTag("number").shape.text); 
	        j$('#numbersizeid').val(core.COORD_TO_MM(this.target.getChipText().getTextureByTag("number").shape.fontSize)); 
	        
	        if(this.target.getChipText().getTextureByTag("number").isEmpty()){
	            j$('#numberxid').val('');
				j$('#numberyid').val('');
	        }else{ 
	         j$('#numberxid').val(this.toUnitX(this.target.getChipText().getTextureByTag("number").shape.anchorPoint.x));
			 j$('#numberyid').val(this.toUnitY(this.target.getChipText().getTextureByTag("number").shape.anchorPoint.y));
	        }	       	        

	        //-------netvalue--------
	        j$('#netvalueid').val(this.target.getChipText().getTextureByTag("netvalue").shape.text); 
	        j$('#netvaluesizeid').val(core.COORD_TO_MM(this.target.getChipText().getTextureByTag("netvalue").shape.fontSize)); 
	        
	        if(this.target.getChipText().getTextureByTag("netvalue").isEmpty()){
	            j$('#netvaluexid').val('');
				j$('#netvalueyid').val('');
	        }else{ 
	         j$('#netvaluexid').val(this.toUnitX(this.target.getChipText().getTextureByTag("netvalue").shape.anchorPoint.x));
			 j$('#netvalueyid').val(this.toUnitY(this.target.getChipText().getTextureByTag("netvalue").shape.anchorPoint.y));
	        }
	        
	        //-----drill and offset------
	        j$('#drillwidthid').val(core.COORD_TO_MM(this.target.drill==null?0:this.target.drill.getWidth()));
	        j$('#offsetxid').val(core.COORD_TO_MM(this.target.offset.x));
			j$('#offsetyid').val(core.COORD_TO_MM(this.target.offset.y));
			
	        if(this.target.type== PadType.SMD){
	        	 j$('#drillwidthid').prop('disabled',true);
	        	 j$('#offsetxid').prop('disabled',true);
	        	 j$('#offsetyid').prop('disabled',true);
	        }else{
	        	 j$('#drillwidthid').prop('disabled',false);
	        	 j$('#offsetxid').prop('disabled',false);
	        	 j$('#offsetyid').prop('disabled',false);	        	
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
				"<tr><td style='padding:7px'>Offset X</td><td><input type='text' id='offsetxid' value='' class='form-control input-sm\'></td></tr>"+
				"<tr><td style='padding:7px'>Offset Y</td><td><input type='text' id='offsetyid' value='' class='form-control input-sm\'></td></tr>"+				
				
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
        this.component.Repaint(); 
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
		 this.component.Repaint(); 		 
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(utilities.roundDouble(this.toUnitX(this.target.resizingPoint==null?0:this.target.resizingPoint.x)));
        j$('#yid').val(utilities.roundDouble(this.toUnitY(this.target.resizingPoint==null?0:this.target.resizingPoint.y))); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		//j$("#rotateid").val(this.target.rotate);    
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
				this.fillComboBox([{id:0,value:'EMPTY',selected:true},{id:1,value:'FILLED'}])+
			    "</select>" +
				"</td></tr>"+
				//"<tr><td style='padding:7px'>Rotate</td><td><input type='text' id='rotateid' value='' class='form-control input-sm\'></td></tr>"+
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
			   this.target.setRadius(core.MM_TO_COORD(parseFloat(j$('#widthid').val())));			 
		 } 
		 if(event.target.id=='startangleid'){
			   this.target.setStartAngle(j$('#startangleid').val());			 
		 } 
		 if(event.target.id=='extendangleid'){
			   this.target.setExtendAngle(j$('#extendangleid').val());	
		 } 	
		 this.component.Repaint(); 	
    },
	updateui:function(){
		j$('#layerid').val(this.target.copper.getName());
		j$("#startangleid").val(this.target.arc.startAngle);    
		j$("#extendangleid").val(this.target.arc.endAngle);		
        j$('#xid').prop('disabled',this.target.resizingPoint==null?true:false);  
        j$('#yid').prop('disabled',this.target.resizingPoint==null?true:false);
        j$('#xid').val(this.toUnitX(this.target.resizingPoint==null?0:(this.target.resizingPoint.x)));
        j$('#yid').val(this.toUnitY(this.target.resizingPoint==null?0:(this.target.resizingPoint.y))); 
		j$('#thicknessid').val(core.COORD_TO_MM(this.target.thickness));
		j$("#widthid").val(core.COORD_TO_MM(this.target.arc.r));
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
        this.component.Repaint(); 
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
		   this.target.circle.r=(core.MM_TO_COORD(parseFloat(j$('#radiusid').val())));			 
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
      this.component.Repaint(); 
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
		 if(event.target.id=='xid'){	            
			 this.target.texture.anchorPoint.x=this.fromUnitX(j$('#xid').val()); 
	     }	         
		 if(event.target.id=='yid'){	            
			 this.target.texture.anchorPoint.y=this.fromUnitY(j$('#yid').val());  
	     }		 
		 this.component.Repaint();     		    	
    },
	updateui:function(){
	 j$("#rotateid").val(this.target.texture.rotate); 	
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
			this.footprintComponent.getModel().getUnit().setScrollPositionValue(this.footprintComponent.viewportWindow.x,this.footprintComponent.viewportWindow.y);
			
			this.footprintComponent.getModel().setActiveUnitUUID(item.id);
			this.footprintComponent.getModel().getUnit().setSelected(false);
			this.footprintComponent.componentResized();
			
			this.footprintComponent.hbar.jqxScrollBar({ value:this.footprintComponent.getModel().getUnit().scrollPositionXValue});
			this.footprintComponent.vbar.jqxScrollBar({ value:this.footprintComponent.getModel().getUnit().scrollPositionYValue});
			
			this.footprintComponent.Repaint();
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
			this.footprintComponent.Repaint();
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
});

;require.register("pads/views/togglebuttonview.js", function(exports, require, module) {
var mywebpcb=require('core/core').mywebpcb;
var core=require('core/core');
var shape=require('core/shapes');
var events=require('core/events');
var FootprintLoadView=require('pads/views/footprintloadview');
var FootprintSaveView=require('pads/views/footprintsaveview');
var Footprint=require('pads/d/footprintcomponent').Footprint;
var UnitMgr = require('core/unit').UnitMgr;
var FootprintContainer=require('pads/d/footprintcomponent').FootprintContainer;

var ToggleButtonView=Backbone.View.extend({

	/*
	 * initialize UI
	 */
	initialize:function(opt){
		this.collection=opt.collection;
		this.footprintComponent=opt.footprintComponent;
		mywebpcb.bind('libraryview:load',this.onload,this);
		this.bind();	       
		this.update();
	},
	bind:function(){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
				j$("#"+model.id).bind( "click",{model:model},j$.proxy(this.onclick,this));
			}),this);
		j$("#importfromclipboardid").click(j$.proxy(this.onimport,this));
		
	},
	update:function(){
		_.each(this.collection.models,function(model,index,list) {
              model.update();
			});
	
	},
	togglegroup:function(group){
		_.each(this.collection.models,j$.proxy(function(model,index,list) {
			if(model.attributes.group===group){
				model.attributes.active=false;
		    }
		}),this);		
	},
	onimport:function(event){
		navigator.clipboard.readText().then(data =>{ 
		      let footprintContainer=new FootprintContainer(true);
		      //disable 
		      core.isEventEnabled=false;
		      footprintContainer.parse(data);
		      core.isEventEnabled=true;
		  	  mywebpcb.trigger('libraryview:load',footprintContainer);
			});
	},
	onclick:function(event){
	    event.preventDefault();
	    //is this a group button
	    if(event.data.model.attributes.active&&event.data.model.attributes.group!=''){
	    	return;
	    }
	    if(event.data.model.attributes.group!=''){
	    	//toggle group
	    	this.togglegroup(event.data.model.attributes.group);
		    event.data.model.attributes.active=!event.data.model.attributes.active;
	    }
		this.update();
//		if(event.data.model.id=='newfootprintid'){
			
//			var footprint=new Footprint(core.MM_TO_COORD(50),core.MM_TO_COORD(50));
//            footprint.name="Sergio Leone";
//			this.footprintComponent.getModel().add(footprint);
//            this.footprintComponent.getModel().setActiveUnitUUID(footprint.getUUID());
//            this.footprintComponent.componentResized(); 
//            this.footprintComponent.Repaint();
//            this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type:events.Event.SELECT_UNIT}); 	
//		}
		if(event.data.model.id=='saveid'){
//		    j$.ajax({
//		        type: 'GET',
//		        contentType: 'application/xml',
//		        url: '/rest/demo',
//		        dataType: "xml",
//		        beforeSend:function(){
//			          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
//			        },
//		        success: j$.proxy(this.onloadsuccess,this),
//		        
//		        error: function(jqXHR, textStatus, errorThrown){
//		            	alert(errorThrown+":"+jqXHR.responseText);
//		        },
//		        complete:function(jqXHR, textStatus){
//		        	j$('#mywebpadsid').unblock();
//		        }
//		    });
			console.log(this.footprintComponent.getModel().format());
			new FootprintSaveView({footprintComponent:this.footprintComponent}).render();			
		}

		if(event.data.model.id=='loadid'){
			 new FootprintLoadView({enabled:false}).render();			
			 
			/**
		    j$.ajax({
		        type: 'GET',
		        contentType: 'application/xml',
		        url: '/rest/demo',
		        dataType: "xml",
		        beforeSend:function(){
			          j$('#mywebpadsid').block({message:'<h5>Loading...</h5>'});	
			        },
		        success: j$.proxy(this.onloadsuccess,this),
		        
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
		        	j$('#mywebpadsid').unblock();
		        }
		    });
		    */
		}
		//set mode
		if(event.data.model.id=='lineid'){
		  //Line mode
		   this.footprintComponent.setMode(core.ModeEnum.LINE_MODE);
		}
		if(event.data.model.id=='anchorid'){
			event.data.model.setActive(!event.data.model.isActive());  
			this.footprintComponent.setParameter("snaptogrid",event.data.model.isActive());
		}
		if(event.data.model.id=='originid'){	
			event.data.model.setActive(!event.data.model.isActive());
			if(event.data.model.isActive()){
			  this.footprintComponent.getModel().getUnit().coordinateSystem=new shape.CoordinateSystem(this.footprintComponent.getModel().getUnit());
			  this.footprintComponent.setMode(core.ModeEnum.ORIGIN_SHIFT_MODE);
			}else{
			  this.footprintComponent.getModel().getUnit().coordinateSystem=null;
			  this.footprintComponent.setMode(core.ModeEnum.COMPONENT_MODE);
			}
						
		}
		if(event.data.model.id=='measureid'){ 
			this.footprintComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
		}
		if(event.data.model.id=='rectid'){
			this.footprintComponent.setMode(core.ModeEnum.RECT_MODE);
		}
		if(event.data.model.id=='ellipseid'){
			this.footprintComponent.setMode(core.ModeEnum.ELLIPSE_MODE);
		}
		if(event.data.model.id=='arcid'){
			this.footprintComponent.setMode(core.ModeEnum.ARC_MODE);
		}
		if(event.data.model.id=='labelid'){
			this.footprintComponent.setMode(core.ModeEnum.LABEL_MODE);
		}
		if(event.data.model.id=='padid'){
			this.footprintComponent.setMode(core.ModeEnum.PAD_MODE);
		}
		if(event.data.model.id=='solidregionid'){
			this.footprintComponent.setMode(core.ModeEnum.SOLID_REGION);
		}		
		if(event.data.model.id=='selectionid'){
		  //Footprint mode
		   this.footprintComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		}		
		if((event.data.model.id=='rotateleftid')||(event.data.model.id=='rotaterightid')){
            shapes= this.footprintComponent.getModel().getUnit().shapes;
            if(shapes.length==0){
               return; 
            }  
			//shapes= this.footprintComponent.getModel().getUnit().getSelectedShapes();
			var r=this.footprintComponent.getModel().getUnit().getShapesRect(shapes);
            
            UnitMgr.getInstance().rotateBlock(shapes,core.AffineTransform.createRotateInstance(r.center.x,r.center.y,(event.data.model.id==("rotateleftid")?1:-1)*(90.0)));   
            UnitMgr.getInstance().alignBlock(this.footprintComponent.getModel().getUnit().grid,shapes);  
            
            this.footprintComponent.Repaint();
		}
		if(event.data.model.id=='zoominid'){
			this.footprintComponent.ZoomIn(parseInt(this.footprintComponent.width/2),parseInt(this.footprintComponent.height/2));
		}
		if(event.data.model.id=='zoomoutid'){
			this.footprintComponent.ZoomOut(parseInt(this.footprintComponent.width/2),parseInt(this.footprintComponent.height/2));
		}	
		if(event.data.model.id=='grabid'){
			 this.footprintComponent.setMode(core.ModeEnum.DRAGHEAND_MODE);
		}	
		if(event.data.model.id=='tocenterid'){
			
            this.footprintComponent.setScrollPosition(parseInt(this.footprintComponent.getModel().getUnit().width/2),
            		parseInt(this.footprintComponent.getModel().getUnit().height/2));
		}		
        if (event.data.model.id=='measureid') {
            this.footprintComponent.setMode(core.ModeEnum.MEASUMENT_MODE);
        }		
	},
	onload:function(selectedModel){
		//****load it    	
		  this.footprintComponent.Clear();
		  this.footprintComponent.setMode(core.ModeEnum.COMPONENT_MODE);
		  
		  
		  for(let unit of selectedModel.getUnits()){
			  core.isEventEnabled=false;
			  var copy=unit.clone();
			  core.isEventEnabled=true;
			  
			  this.footprintComponent.getModel().add(copy);  			  			  
			  copy.notifyListeners(events.Event.ADD_SHAPE);
		  };
		  
		  
		  
		  this.footprintComponent.getModel().setActiveUnit(0);
		  this.footprintComponent.getModel().formatedFileName=selectedModel.formatedFileName;
		  this.footprintComponent.getModel().libraryname=selectedModel.libraryname;
		  this.footprintComponent.getModel().categoryname=selectedModel.categoryname;
		  
		  this.footprintComponent.componentResized();
        //position on center
          let rect=this.footprintComponent.getModel().getUnit().getBoundingRect();
          this.footprintComponent.setScrollPosition(rect.center.x,rect.center.y);
          this.footprintComponent.fireContainerEvent({target:null,type: events.Event.RENAME_CONTAINER});
          this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type: events.Event.SELECT_UNIT});
		  this.footprintComponent.Repaint();
		  //set button group
		  this.footprintComponent.getView().setButtonGroup(core.ModeEnum.COMPONENT_MODE);
		  
	        //position all to symbol center
		  for(let unit of this.footprintComponent.getModel().getUnits()){			   
	            let r=unit.getBoundingRect();
	            var x=unit.getScalableTransformation().getScale()*r.x-(this.footprintComponent.viewportWindow.width-unit.getScalableTransformation().getScale()*r.width)/2;
	            var y=unit.getScalableTransformation().getScale()*r.y-(this.footprintComponent.viewportWindow.height-unit.getScalableTransformation().getScale()*r.height)/2;;
	            unit.setScrollPositionValue(x,y);            			  
		  }		

	},
//	onloadsuccess:function(data, textStatus, jqXHR){
//		  this.footprintComponent.Clear();
//		  this.footprintComponent.setMode(ModeEnum.COMPONENT_MODE);
//		  this.footprintComponent.getModel().Parse(data);
//		  this.footprintComponent.getModel().setActiveUnit(0);
//		  this.footprintComponent.componentResized();
//          //position on center
//          rect=this.footprintComponent.getModel().getUnit().getBoundingRect();
//          this.footprintComponent.setScrollPosition(rect.getCenterX(),rect.getCenterY());
//          this.footprintComponent.fireContainerEvent({target:null,type: mywebpads.container.Event.RENAME_CONTAINER});
//          this.footprintComponent.getModel().fireUnitEvent({target:this.footprintComponent.getModel().getUnit(),type: mywebpads.unit.Event.RENAME_UNIT});
//		  this.footprintComponent.Repaint();
//		  //set button group
//		  this.footprintComponent.getView().setButtonGroup(ModeEnum.COMPONENT_MODE);
//	},
    setButtonGroup:function(requestedMode) {
         if (requestedMode == core.ModeEnum.COMPONENT_MODE) {
        	 //find selection button and pressed
        	 var model=this.collection.get('selectionid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();
         }
         if(requestedMode==core.ModeEnum.LINE_MODE){
        	 var model=this.collection.get('lineid');
        	 this.togglegroup(model.attributes.group);
     	     model.attributes.active=true;
    		 this.update();
          
         }

}
});

module.exports =ToggleButtonView

});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=pads.js.map