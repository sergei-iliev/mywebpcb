var mywebpcb = mywebpcb || {};

var SELECT_RECT_WIDTH = 3000; 

AlignEnum={
  LEFT:0,
  RIGHT:1,
  TOP:2,
  BOTTOM:3,
  parse:function(align){
	  switch(align){
	  case 'LEFT':
		     return this.LEFT;
	  case 'RIGHT':
			 return this.RIGHT; 
	  case 'TOP':
			 return this.TOP;
	  case 'BOTTOM':
			 return this.BOTTOM;			 
	  default:
		  throw new TypeError('Unrecognized align type:'+align+' to parse');  
	  } 	  
  },
  format:function(align){
	 switch(align){
	 case 0:return 'LEFT';
	 case 1:return 'RIGHT';
	 case 2:return 'TOP';
	 case 3:return 'BOTTOM';
	 } 
  }
}

OrientEnum={
  HORIZONTAL:0,
  VERTICAL:1
};
 
var Alignment=function(_alignment){
  var alignment=_alignment;
  
  return {
      getOrientation:function(){
	     if(alignment==AlignEnum.LEFT||alignment==AlignEnum.RIGHT){
		    return OrientEnum.HORIZONTAL;
		 }else{
		    return OrientEnum.VERTICAL;
		 }
	  },
	  setOrientation:function(orientation){
		  if(this.getOrientation()==orientation){
			  return;
		  }
		  switch(orientation){
		  case OrientEnum.HORIZONTAL:
	            if (alignment == AlignEnum.BOTTOM)
	                alignment = AlignEnum.LEFT;
	            else
	                alignment = AlignEnum.RIGHT;
	            break;			  
			  break;
		  case OrientEnum.VERTICAL:
	            if (alignment == AlignEnum.RIGHT)
	                alignment = AlignEnum.TOP;
	            else
	                alignment = AlignEnum.BOTTOM;
	            break;
			  break;
		  }
	  },
	  get:function(){
	    return alignment;
	  },
	  set:function(_alignment){
		alignment=_alignment;  
	  },
	  Rotate:function(isClockwise){
           if(alignment==AlignEnum.LEFT){
              if(isClockwise){
			    alignment= AlignEnum.TOP;
              }else{
			    alignment=AlignEnum.BOTTOM;
              }           
              }else if(alignment==AlignEnum.RIGHT){
                if(isClockwise){
				alignment=AlignEnum.BOTTOM;
                }else{
				alignment=AlignEnum.TOP;         
                }
               
              }else if(alignment==AlignEnum.TOP){
                if(isClockwise){ 
				  alignment=AlignEnum.RIGHT;
                }else{
				alignment=AlignEnum.LEFT;          
                }               
               }else if(alignment==AlignEnum.BOTTOM){
                if(isClockwise){
				  alignment=AlignEnum.LEFT;
                }else{
				alignment=AlignEnum.RIGHT;
				   }
               }else
                  throw  "Wrong alignment"; 	  
	  }
  };
}; 
var  UUID=(function(){
	 var count=0;
	 return function(){
		 return ++count;
	 }
})();

gridraster=[{id:2.54,value:2.54},{id:1.27,value:1.27},{id:0.635,value:0.635},{id:0.508,value:0.508},{id:0.254,value:0.254},{id:0.127,value:0.127},{id:0.0635,value:0.0635},{id:0.0508,value:0.0508},{id:0.0254,value:0.0254},{id:0.0127,value:0.0127},{id:5.0,value:5.0},{id:2.5,value:2.5},{id:1.0,value:1.0},{id:0.5,value:0.5},{id:0.25,value:0.25},{id:0.8,value:0.8},{id:0.2,value:0.2},{id:0.1,value:0.1},{id:0.05,value:0.05},{id:0.025,value:0.025},{id:0.01,value:0.01}];

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
	      
	      BOARD_COLOR_FRONT:'rgb(56,0,0)',
	      BOARD_COLOR_BACK:'rgb(0,0,56)',
	      BOARD_COLOR_ALL:'black',
	    Side:{
		   TOP:1,
           BOTTOM:2,
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
	                return 0xFFFFFFFF;
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
	            else{
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

class Point{
 constructor(x,y) {
    this.x=x;
	this.y=y;
 }
 setLocation(x,y){
   this.x=parseInt(x);
   this.y=parseInt(y);
 }
 min(point){
   return new Point(Math.min(this.x,point.x),Math.min(this.y,point.y));
 }
 max(point){
   return new Point(Math.max(this.x,point.x),Math.max(this.y,point.y));
 }
 equals(point){
   return (this.x==point.x&&this.y==point.y);
 }
 distance(x1,y1){
	 let a = x1 - this.x;
     let b = y1 - this.y
  return Math.sqrt( a*a + b*b );
 }
 getScaledPoint(scalableTransformation){
	let x=this.x*scalableTransformation.getScale(); 
	let y=this.y*scalableTransformation.getScale(); 
	return new Point(x,y);
}
}

class Rectangle{
 constructor(x,y,width,height) {
     this.setRect(x,y,width,height);
 }
getCenterX(){
  return parseInt(this.x+this.width/2);
}
getCenterY(){
  return parseInt(this.y+this.height/2);
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
getP1(){
  return new Point(this.x,this.y);  	
}
getP2(){
  return new Point(this.x+this.width,this.y+this.height);  	
}
getMinX(){
  return this.x;
}
getMinY(){
  return this.y;
}
getMaxX(){
  return this.x+this.width;
}
getMaxY(){
  return this.y+this.height;
}
setRect(x,y,width,height){
    this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
}
contains(x,y){
  if(this.getMinX()<=x&&x<=this.getMaxX()){
    if(this.getMinY()<=y&&y<=this.getMaxY())
	  return true;
  }
  return false;
}
intersects(r){
    // calculate the left common area coordinate:
    let left = Math.max( this.x, r.x );
    // calculate the right common area coordinate:
    let right  = Math.min( this.x +this.width, r.x + r.width );
    // calculate the upper common area coordinate:
    let top    = Math.max( this.y,r.y );
    // calculate the lower common area coordinate:
    let bottom = Math.min( this.y +this.height, r.y + r.height );

    // if a common area exists, it must have a positive (null accepted) size
    if( left <= right && top <= bottom )
        return true;
    else
        return false;	
}

getScaledRect(scalableTransformation){
 let x=this.getMinX()*scalableTransformation.getScale(); 
 let y=this.getMinY()*scalableTransformation.getScale(); 
 let xx=this.getMaxX()*scalableTransformation.getScale(); 
 let yy=this.getMaxY()*scalableTransformation.getScale(); 
 return new Rectangle(x,y,xx-x,yy-y);
}
 toString(){
   return "{"+this.x+","+this.y+","+this.width+","+this.height+"}";
 }
}

class Line{
constructor(x1,y1,x2,y2) {
    this.setLine(x1,y1,x2,y2); 
}
setLine(x1,y1,x2,y2){
  this.x1=x1;
  this.y1=y1;
  this.x2=x2;
  this.y2=y2; 
}

getP1(){
  return new Point(this.x1,this.y1);
}

getP2(){
  return new Point(this.x2,this.y2);	
}

getScaledTrack(scalableTransformation){
  return new Line(this.x1*scalableTransformation.getScale(),this.y1*scalableTransformation.getScale(),this.x2*scalableTransformation.getScale(),this.y2*scalableTransformation.getScale());
}

draw(g2, viewportWindow, scale){
    let line=this.getScaledTrack(scale);
    line.setLine(line.x1-viewportWindow.x, line.y1-viewportWindow.y, line.x2-viewportWindow.x, line.y2-viewportWindow.y);  
    g2.beginPath();
    g2.moveTo(line.x1, line.y1);
    g2.lineTo(line.x2, line.y2);
    g2.stroke();   
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
	  return new Point(x*s,y*s);
}
  getInverseRect(r){
       let s=1.0;
       if(this.scaleFactor!=0){     
           for(let i=0;i<this.scaleFactor;i++){
             s*=2;
           }
       }
	  return new Rectangle(r.x*s,r.y*s,r.width*s,r.height*s);
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
    let r=new Rectangle(parseInt(viewportWindow.x/scalableTransformation.getScale()),parseInt(viewportWindow.y/scalableTransformation.getScale()),parseInt(viewportWindow.getWidth()/scalableTransformation.getScale()),parseInt(viewportWindow.getHeight()/scalableTransformation.getScale()));
    let position=this.positionOnGrid(r.x,r.y);
	
	
	if(!this.isGridDrawable(position,scalableTransformation)){
        return;
    }
		
	let point=new Point();  
	for (let h =position.y; h <= position.y+r.getHeight(); h += this.gridPointToPoint) {
            for (w =position.x; w <=position.x+r.getWidth(); w += this.gridPointToPoint) {
                 point.setLocation(w, h); 
                 let scaledPoint=point.getScaledPoint(scalableTransformation);                
                 scaledPoint.setLocation(scaledPoint.x-viewportWindow.x,scaledPoint.y-viewportWindow.y);
                 //***no need to draw outside of visible rectangle
                 if(scaledPoint.x>viewportWindow.getWidth()||scaledPoint.y>viewportWindow.getHeight()){                   
                   continue;  
                 }   
                
				 
				 g2.beginPath();
				 g2.fillRect(scaledPoint.x, scaledPoint.y,2,2);
				 g2.fillStyle = 'white';
				 g2.fill();

                 //g2.beginPath();
                 //g2.moveTo(scaledPoint.x, scaledPoint.y);
                 //g2.lineTo(scaledPoint.x, scaledPoint.y);
                 //g2.lineWidth = 1;
                 //g2.strokeStyle = 'white';
                 //g2.stroke();                                        
            }
	}
   
 }
isGridDrawable(point,scalableTransformation){
        var scaledPoint=point.getScaledPoint(scalableTransformation);  
        var x=scaledPoint.x;
        point.x=point.x+this.gridPointToPoint;
        scaledPoint=point.getScaledPoint(scalableTransformation);
        return  (parseInt(Math.round(scaledPoint.x-x)))>this.pixelToPixelLimit;    
    }
positionOnGrid( x,  y) {        
        let ftmp     =  x / this.gridPointToPoint;
        let xx = ( parseInt( Math.round( ftmp )) ) * this.gridPointToPoint;

        ftmp     = y / this.gridPointToPoint;
        let yy = ( parseInt( Math.round( ftmp )) ) * this.gridPointToPoint;
        return new Point(xx,yy);        
    } 
lengthOnGrid(length){
        let  ftmp     =  length / this.gridPointToPoint;
        let xx = ( parseInt(Math.round( ftmp ) )) * this.gridPointToPoint;        
        return xx;	
}
snapToGrid(p){        
   p.setLocation(this.lengthOnGrid(p.x), this.lengthOnGrid(p.y));
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
Rotate(rotation) {
		  this.text.forEach(function(texture){
		     texture.Rotate(rotation); 
		   });         
		 }		 
Paint( g2,  viewportWindow,  scale) {
	  this.text.forEach(function(texture){
		  texture.Paint(g2,viewportWindow,scale); 
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
	        if(texture.getTag()==tag){
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
		 texture.setSelected(isSelected); 	 
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
	      this.rectangle=new Rectangle(0,0,0,0);
	      this.offset=0;
	      this.setSize(width,height);   
}
setSize(width,height) {
    this.width=width;
    this.height=height;
    this.rectangle.setRect(this.offset,this.offset,this.width-(2*this.offset),this.height-(2*this.offset));
 }	  
 
paint(g2, viewportWindow, scale) {
	  var rect=this.rectangle.getScaledRect(scale);
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

class Shape{
	constructor(x, y, width, height, thickness,
			layermask) {
		this.owningUnit=null;
		this.uuid = UUID();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.thickness = thickness;
		this.selection = false;
		this.isCasheEnabled = true;
		this.shapeCacheBounds = null;
		this.displayname = "noname";
		this.fill = Fill.EMPTY;
		this.fillColor;
		this.copper = Layer.Copper.resolve(layermask);
	}
setDisplayName(displayname) {
		this.displayname = displayname;
	}
Clear() {
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
getOrderWeight() {
		return (this.getWidth() * this.getHeight());
	}
getUUID() {
		return this.uuid;
	}
enableCache(enable) {
		this.isCasheEnabled = enable;
	}
calculateShape() {

	}
isInRect(r){
	let rect=this.getBoundingShape();
        if(r.contains(rect.getCenterX(),rect.getCenterY()))
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
		// if(this.shapeCacheBounds==null||(!this.isCasheEnabled)){
		this.shapeCacheBounds = this.calculateShape();
		// }
		return this.shapeCacheBounds;
	}
clearCache() {
		this.shapeCacheBounds = null;
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
/*
Mirror(A,B) {
        let point = new Point(this.getX(),this.getY());
        utilities.mirrorPoint(A,B, point);
        this.setX(point.x);
        this.setY(point.y);
}
*/    

Rotate(rotation) {
		let point = new Point(this.getX(), this.getY());
		point = utilities.rotate(point, rotation.originx,rotation.originy, rotation.angle);
	
        this.x=(point.x);
        this.y=(point.y);
}
/*    
Mirror(Moveable.Mirror type) {
        Rectangle r=getBoundingShape().getBounds();
        Point p=new Point((int)r.getCenterX(),(int)r.getCenterY()); 
        switch(type){
         case HORIZONTAL:
            Mirror(new Point(p.x-10,p.y),new Point(p.x+10,p.y));
        break;
         case VERTICAL:
            Mirror(new Point(p.x,p.y-10),new Point(p.x,p.y+10)); 
        }
}
*/	
fromXML(data) {

	}

} 


class ResizeableShape extends Shape{
constructor (x, y, width, height, thickness,
	layermask) {
super(x, y, width, height, thickness, layermask);
this.upperLeft = new Point();
this.upperRight = new Point();
this.bottomLeft = new Point();
this.bottomRight = new Point();
this.resizingPoint = null;
this.init(x, y, width, height);
}
init(x, y, width, height) {
this.upperLeft.setLocation(x, y);
this.upperRight.setLocation(x + width, y);
this.bottomLeft.setLocation(x, y + height);
this.bottomRight.setLocation(x + width, y + height);
}
alignToGrid(isRequired) {
    if(isRequired){
          return super.alignToGrid(isRequired);
    }else{
         return null;
    }
}
getResizingPoint() {
return this.resizingPoint;
}
setResizingPoint(point) {
this.resizingPoint = point;
}
isControlRectClicked(x, y) {
var rect = new Rectangle(0, 0, 0, 0);
rect.setRect(this.upperLeft.x - SELECT_RECT_WIDTH / 2, this.upperLeft.y
		- SELECT_RECT_WIDTH / 2, SELECT_RECT_WIDTH, SELECT_RECT_WIDTH);
if (rect.contains(x, y)) {
	return this.upperLeft;
}
rect.setRect(this.upperRight.x - SELECT_RECT_WIDTH / 2,
		this.upperRight.y - SELECT_RECT_WIDTH / 2, SELECT_RECT_WIDTH,
		SELECT_RECT_WIDTH);
if (rect.contains(x, y))
	return this.upperRight;

rect.setRect(this.bottomLeft.x - SELECT_RECT_WIDTH / 2,
		this.bottomLeft.y - SELECT_RECT_WIDTH / 2, SELECT_RECT_WIDTH,
		SELECT_RECT_WIDTH);
if (rect.contains(x, y))
	return this.bottomLeft;

rect.setRect(this.bottomRight.x - SELECT_RECT_WIDTH / 2,
		this.bottomRight.y - SELECT_RECT_WIDTH / 2, SELECT_RECT_WIDTH,
		SELECT_RECT_WIDTH);
if (rect.contains(x, y))
	return this.bottomRight;

return null;
}
Move(xoffset, yoffset) {
	this.setX(this.getX() + xoffset);
	this.setY(this.getY() + yoffset);
}
Rotate(rotation) {
	let a = new Point();
	let b = new Point();
	if (rotation.angle > 0) {
		a.setLocation(this.upperLeft.x, this.upperLeft.y);
		let p = utilities.rotate(this.bottomLeft, rotation.originx,
			rotation.originy, rotation.angle);
		this.upperLeft.setLocation(p.x, p.y);

	   b.setLocation(this.upperRight.x, this.upperRight.y);
	   p = utilities.rotate(a, rotation.originx,
			rotation.originy, rotation.angle);
	   this.upperRight.setLocation(p.x, p.y);

	   a.setLocation(this.bottomRight.x, this.bottomRight.y);
	   p = utilities.rotate(b, rotation.originx,
			rotation.originy, rotation.angle);
	   this.bottomRight.setLocation(p.x, p.y);

	   p = utilities.rotate(a, rotation.originx,
			rotation.originy, rotation.angle);
	   this.bottomLeft.setLocation(p.x, p.y);
} else {
	   a.setLocation(this.upperLeft.x, this.upperLeft.y);
	   let p = utilities.rotate(this.upperRight, rotation.originx,
			rotation.originy, rotation.angle);
	   this.upperLeft.setLocation(p.x, p.y);

	   b.setLocation(this.bottomLeft.x, this.bottomLeft.y);
	   p = utilities.rotate(a, rotation.originx,
			rotation.originy, rotation.angle);
	   this.bottomLeft.setLocation(p.x, p.y);

	   a.setLocation(this.bottomRight.x, this.bottomRight.y);
	   p = utilities.rotate(b, rotation.originx,
			rotation.originy, rotation.angle);
	   this.bottomRight.setLocation(p.x, p.y);

	   p = utilities.rotate(a, rotation.originx,
			rotation.originy, rotation.angle);
	   this.upperRight.setLocation(p.x, p.y);
}
}
Resize(xOffset, yOffset, clickedPoint) {
if (clickedPoint.equals(this.upperLeft)) {
	this.upperLeft.setLocation(this.upperLeft.x + xOffset,
			this.upperLeft.y + yOffset);
	this.bottomLeft.setLocation(this.bottomLeft.x + xOffset,
			this.bottomLeft.y);
	this.upperRight.setLocation(this.upperRight.x, this.upperRight.y
			+ yOffset);
} else if (clickedPoint.equals(this.upperRight)) {
	this.upperRight.setLocation(this.upperRight.x + xOffset,
			this.upperRight.y + yOffset);
	this.bottomRight.setLocation(this.bottomRight.x + xOffset,
			this.bottomRight.y);
	this.upperLeft.setLocation(this.upperLeft.x, this.upperLeft.y
			+ yOffset);
} else if (clickedPoint.equals(this.bottomLeft)) {
	this.bottomLeft.setLocation(this.bottomLeft.x + xOffset,
			this.bottomLeft.y + yOffset);
	this.upperLeft.setLocation(this.upperLeft.x + xOffset,
			this.upperLeft.y);
	this.bottomRight.setLocation(this.bottomRight.x, this.bottomRight.y
			+ yOffset);
} else if (clickedPoint.equals(this.bottomRight)) {
	this.bottomRight.setLocation(this.bottomRight.x + xOffset,
			this.bottomRight.y + yOffset);
	this.upperRight.setLocation(this.upperRight.x + xOffset,
			this.upperRight.y);
	this.bottomLeft.setLocation(this.bottomLeft.x, this.bottomLeft.y
			+ yOffset);
}

}
isInRect(r) {
	if (r.contains(this.getBoundingShape().getCenterX(), this
		.getBoundingShape().getCenterY()))
		return true;
	else
		return false;
}
drawControlShape(g2, viewportWindow, scale) {
    utilities.drawCrosshair(g2, viewportWindow, scale, this.resizingPoint, this.selectionRectWidth, [this.upperLeft,this.upperRight,this.bottomLeft,this.bottomRight]);
}

setSelected (selection) {
	this.selection = selection;
		if (!selection) {
			this.resizingPoint = null;
}
}

getY () {
	return this.upperLeft.y;
}

getX() {
	return this.upperLeft.x;
}
setY(y) {
	this.init(this.upperLeft.x, y, this.getWidth(), this.getHeight());
}
setX (x) {
	this.init(x, this.upperLeft.y, this.getWidth(), this.getHeight());
}
setWidth (width) {
	this.upperRight
		.setLocation(this.upperLeft.x + width, this.upperRight.y);
	this.bottomRight.setLocation(this.bottomLeft.x + width,
		this.bottomRight.y);
	this.init(this.upperLeft.x, this.upperLeft.y, this.getWidth(), this
		.getHeight());
}
setHeight (height) {
	this.bottomLeft.setLocation(this.bottomLeft.x, this.upperLeft.y
		+ height);
	this.bottomRight.setLocation(this.bottomRight.x, this.upperRight.y
		+ height);
	this.init(this.upperLeft.x, this.upperLeft.y, this.getWidth(), this
		.getHeight());
}

getWidth() {
	return this.upperRight.x - this.upperLeft.x;
}
getHeight() {
	return this.bottomLeft.y - this.upperLeft.y;
}

}

class SquareResizableShape extends ResizeableShape{
	constructor( x, y, width, thickness,
			layermask) {
		super(x, y, width, width, thickness, layermask);
	}

	Resize(xoffset, yoffset, clickedPoint) {
		var offset = 0;
		if (xoffset == 0) {
			offset = yoffset;
		} else {
			if (yoffset == 0) {
				offset = xoffset;
			} else {
				offset = Math.max(xoffset, yoffset);
			}
		}
		var width = this.getWidth() + offset;

		if (clickedPoint.equals(this.upperLeft)) {
			this.upperLeft.setLocation(this.upperLeft.x + xoffset,
					this.upperLeft.y + yoffset);
			this.upperRight.setLocation(this.upperLeft.x + width,
					this.upperLeft.y);
			this.bottomLeft.setLocation(this.upperLeft.x,
					this.upperLeft.y + width);
			this.bottomRight.setLocation(this.upperLeft.x + width,
					this.upperLeft.y + width);
		} else if (clickedPoint.equals(this.upperRight)) {
			this.upperRight.setLocation(this.upperRight.x + xoffset,
					this.upperRight.y + yoffset);
			this.bottomRight.setLocation(this.upperRight.x,
					this.upperRight.y + width);
			this.upperLeft.setLocation(this.upperRight.x - width,
					this.upperRight.y);
			this.bottomLeft.setLocation(this.upperRight.x - width,
					this.upperRight.y + width);
		} else if (clickedPoint.equals(this.bottomLeft)) {
			this.bottomLeft.setLocation(this.bottomLeft.x + xoffset,
					this.bottomLeft.y + yoffset);
			this.bottomRight.setLocation(this.bottomLeft.x + width,
					this.bottomLeft.y);
			this.upperLeft.setLocation(this.bottomLeft.x,
					this.bottomLeft.y - width);
			this.upperRight.setLocation(this.bottomLeft.x + width,
					this.bottomLeft.y - width);
		} else if (clickedPoint.equals(this.bottomRight)) {
			this.bottomRight.setLocation(this.bottomRight.x + xoffset,
					this.bottomRight.y + yoffset);
			this.bottomLeft.setLocation(this.bottomRight.x - width,
					this.bottomRight.y);
			this.upperRight.setLocation(this.bottomRight.x,
					this.bottomRight.y - width);
			this.upperLeft.setLocation(this.bottomRight.x - width,
					this.bottomRight.y - width);
		}
	}
	setWidth(width) {
		this.upperRight.setLocation(this.upperLeft.x + width,
				this.upperRight.y);
		this.bottomRight.setLocation(this.upperLeft.x + width,
				this.upperLeft.y + width);
		this.bottomLeft.setLocation(this.upperLeft.x, this.upperLeft.y
				+ width);
	}
	setHeight(height) {

	}

}
/**********************Ruler**********************************/
class Ruler extends Shape{
constructor () {
	super(0, 0, 0, 0, 0, 0);
    this.text=new font.FontTexture('label','',0,0,new Alignment(AlignEnum.LEFT),MM_TO_COORD(1.2));       
    this.text.fillColor='white';        
	this.resizingPoint=null;
}
Resize( xOffset, yOffset) {
    this.resizingPoint.setLocation(this.resizingPoint.x+xOffset,this.resizingPoint.y+yOffset);
    this.text.setLocation(this.resizingPoint.x, this.resizingPoint.y);
}	
Paint( g2,  viewportWindow,  scale) {        
		if(this.resizingPoint==null){
            return;
        }
        this.text.setText(parseFloat(COORD_TO_MM(this.resizingPoint.distance(this.x,this.y))).toFixed(4)+' MM');
        this.text.Paint(g2, viewportWindow, scale);

        let line=new Line();
 		
        let a=new Point(this.x,this.y);
		
		line.setLine(a.x,a.y,this.resizingPoint.x,this.resizingPoint.y);

        g2.strokeStyle  = 'white';
		g2.lineWidth=1; 
        
		line.draw(g2,viewportWindow,scale);
		
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
    return new Rectangle(this.x-this.selectionRectWidth/2,this.y-this.selectionRectWidth/2,this.selectionRectWidth,this.selectionRectWidth);
}
Reset(x, y) {
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

Paint(g2, viewportWindow, scale) {
		if (this.x == 0 && this.y == 0) {
			return;
		}

		var line = new Line();		

		g2.strokeStyle  = 'blue';
		g2.lineWidth=1; 
		
		line.setLine(0, this.y, this.owningUnit.getWidth(),
				this.y);
	    line.draw(g2, viewportWindow,scale);
		
		line.setLine(this.x, 0, this.x, this.owningUnit
				.getHeight());
		line.draw(g2, viewportWindow,scale);
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
		 //make it smaller
		 unit.scalableTransformation=new ScalableTransformation(10,4,13);
	     var w=Math.round(unit.getBoundingRect().getWidth()*unit.scalableTransformation.getScale());
		 width=Math.max(width,w);
       
	  }
	 for(let unit of this.model.getUnits()){     
		 var r=unit.getBoundingRect();
		 var x=Math.round(r.getX()*unit.scalableTransformation.getScale());
		 var y=Math.round(r.getY()*unit.scalableTransformation.getScale());
         var height=Math.round(r.getHeight()*unit.getScalableTransformation().getScale());             
         var cell=UnitSelectionCell(unit.getUUID(),x,y,width,height,unit.name);
         cell.selected=( this.model.getUnit()==unit?true:false);
         this.cells.push(cell);        
	  }
	 
}

});

//------------------------UnitSelectionPanel-------
var UnitSelectionPanel=Backbone.View.extend({
	el:"#unitselectionpanel",
	initialize: function(opt){		
	this.unitSelectionGrid=new UnitSelectionGrid();
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
  			var canvas = j$('#c'+(i++));
  	  	    var ctx = canvas[0].getContext("2d");
  	        ctx.fillStyle = "rgb(0,0,0)";
  	        ctx.fillRect(0, 0, cell.width, cell.height);  

  	        unit.paint(ctx,new Rectangle(cell.x,cell.y,cell.width,cell.height));                    	         
  		  };
  	}
  },
  render:function(){
		    	//create picker
		    var panel=""
		    if(this.unitSelectionGrid.model!=null){
		      for(i=0;i<this.unitSelectionGrid.cells.length;i++){
		    	var cell=this.unitSelectionGrid.cells[i];
		    	
		    	panel+="<div><canvas id=\"c"+i+"\" width=\""+cell.width+"px\" height=\""+cell.height+"px\">"+
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
            return new Rectangle(x1,y1,x2-x1,y2-y1);            
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
        rotateBlock(shapes, rotation){
       	   shapes.forEach(function(shape) {
        		shape.Rotate(rotation);
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
        getTextureByTag(unit,tag){
           result=null;
       	   unit.shapes.forEach(function(shape) {
        		 if(shape instanceof mywebpcb.pads.shapes.Label){
        			if(shape.getChipText().get(0).getTag()==tag){
        				result=shape.getChipText().get(0);
        			    $break;
        			}
        				
        		 }
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
        this.silent=false; 	 
    	this.scalableTransformation=new ScalableTransformation(8,4,13);
    	this.uuid=UUID();
    	this.shapes=[];
    	this.width=width;
    	this.height=height;
    	this.name="Uknown";
    	this.grid=new Grid(0.8,Units.MM);
        this.scrollPositionXValue = 0;
        this.scrollPositionYValue = 0;
        this.frame=new UnitFrame(this.width,this.height);
        this.coordinateSystem=new CoordinateSystem(this);
		this.ruler=new Ruler();
		this.shapeFactory=null;
        
    }
setScrollPositionValue(scrollPositionXValue,scrollPositionYValue) {
        this.scrollPositionXValue = scrollPositionXValue;
        this.scrollPositionYValue = scrollPositionYValue;
       }
fireShapeEvent(event){
		if(this.silent)
			return;
		switch(event.type){
		  case events.Event.SELECT_SHAPE:
			  mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.DELETE_SHAPE:
			  mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.RENAME_SHAPE:
			  mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.ADD_SHAPE:	 
			  mywebpcb.trigger('shape:inspector',event);
			  break;
		  case events.Event.PROPERTY_CHANGE:
			  mywebpcb.trigger('shape:inspector',event);
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
 		  shape.Clear();
 		  shape=null;
       },this);
        this.shapes=[];	
	}
getBoundingRect() {
        return this.getShapesRect(this.shapes);
    }
getShapesRect(shapes) {
        var r = new Rectangle(0,0,0,0);
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
         	      item.Clear();
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
buildClickableOrderItem(x,  y,  isTextIncluded){
     var orderElements = [];
     var index = 0;
     this.shapes.forEach(function(shape){
         if(isTextIncluded){
           	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
           	    orderElements.push({index:index,orderWeight:0});
           	}
         }		 
         
		if(!shape.isClicked(x, y)){
               index++;
               return; 
        }
         //***give selected a higher priority
        orderElements.push({index:index,
         	                orderWeight:shape.isSelected() && shape.getOrderWeight() > 1 ? 2 : shape.getOrderWeight()});

         index++;
     }.bind(this));
     return orderElements;
 }
getClickedShape( x,  y,  isTextIncluded){
 	       var result=null;
 	       var orderElements=this.buildClickableOrderItem(x,y,isTextIncluded);
 	       
 	      
 	       orderElements.sort(function(a,b) {
 	    	   if (a.orderWeight < b.orderWeight){
 		    	      return -1;
 	    	   }
 		       if (a.orderWeight > b.orderWeight){
 		    	     return 1;
 		       }	     
 		       return 0;
 		    });
 	    
 	       orderElements.some(function(item) {			   
 	    	    var shape=this.shapes[item.index];
				
                 if(isTextIncluded){
                 	if((undefined !=shape['getChipText'])&&shape.getChipText().isClicked(x, y)){
                 	    result=shape;
                 		return true;
                 	}
                 }
 	 		   
 	 		    //if (shape.isClicked(x, y)) {
                 result=shape;
 				 return true;				 
                //}  
				 
            }.bind(this));
 		   
 		   return result;
 	}
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
 	
setSelected(flag) {
 	   this.shapes.forEach(j$.proxy(function(shape) {
 			shape.setSelected(flag);
        },this));
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
 		   this.shapes[i].Paint(g2,viewportWindow,this.scalableTransformation);  
 	   }
 	   //grid
        this.grid.paint(g2,viewportWindow,this.scalableTransformation);
        //coordinate system
        this.coordinateSystem.Paint(g2, viewportWindow,this.scalableTransformation);
		//ruler
		this.ruler.Paint(g2, viewportWindow,this.scalableTransformation);
        //frame
        this.frame.paint(g2, viewportWindow,this.scalableTransformation);
     }    
       
}


module.exports ={
	mywebpcb,
	AlignEnum,
	OrientEnum,
	Alignment,
	UUID,
	gridraster,
	Fill,
	Units,
	ModeEnum,
	BOARD_LAYERS,PCB_SYMBOL_LAYERS,
	Layer,
	ScalableTransformation,
	ViewportWindow,
	Grid,
	Point,
	Line,
	Rectangle,
	ChipText,
	UnitFrame,
	Shape,
	ResizeableShape,
	SquareResizableShape,
	UnitMgr,
	Unit,
	AffineTransform,
    MM_TO_COORD,
    COORD_TO_MM,
	UnitSelectionPanel
}

var events=require('core/events');
var utilities=require('core/utilities');
var glyph = require('core/text/glyph');
var font = require('core/text/font');