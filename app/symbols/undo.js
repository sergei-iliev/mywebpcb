var mywebpcb=require('core/core').mywebpcb;
var core = require('core/core');
var AbstractMemento = require('core/undo').AbstractMemento;
var SymbolFontTextureMemento = require('core/undo').SymbolFontTextureMemento;
var shape = require('core/shapes');
var utilities=require('core/utilities');
var d2=require('d2/d2');

class LineMemento extends AbstractMemento{
	constructor(mementoType){
		super(mementoType);
		this.Ax=[];
        this.Ay=[];  
		this.resumeState;      
	}
loadStateTo(shape) {
            super.loadStateTo(shape);
            shape.polyline.points=[];
            for (let i = 0; i < this.Ax.length; i++) {
                shape.polyline.points.push(new d2.Point(this.Ax[i], this.Ay[i]));
            }
            shape.resumeState=this.resumeState;
            
            //***reset floating start point
            if (shape.polyline.points.length > 0) {
                if(shape.resumeState==core.ResumeState.ADD_AT_END){
                  shape.floatingStartPoint.set(shape.polyline.points[shape.polyline.points.length - 1]);
                }else{
                  shape.floatingStartPoint.set(shape.polyline.points[0]);  
                }
                shape.reset();
            }
        }	
saveStateFrom( shape) {
            super.saveStateFrom(shape);
            this.Ax = [];
            this.Ay = [];
            for (let i = 0; i < shape.polyline.points.length; i++) {
                this.Ax[i] = (shape.polyline.points[i]).x;
                this.Ay[i] = (shape.polyline.points[i]).y;
            }
            this.resumeState=shape.resumeState;            
        }	
clear() {
            super.clear();
            this.Ax = [];
            this.Ay = [];
        }
equals(obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof LineMemento)) {
                return false;
            }
            let other = obj;
            return (super.equals(obj)&&this.resumeState==other.resumeState&&
                    utilities.arrayEquals(this.Ax, other.Ax) &&  utilities.arrayEquals(this.Ay, other.Ay));

        }
isSameState(unit) {
            let line =unit.getShape(this.uuid);
            return (line.getState(this.mementoType).equals(this));
        }
}
class FontLabelMemento extends AbstractMemento{
	constructor(mementoType){
		super(mementoType);
		this.textureMemento=new SymbolFontTextureMemento();      
	}
loadStateTo(shape) {
            super.loadStateTo(shape);
            shape.polyline.points=[];
            for (let i = 0; i < this.Ax.length; i++) {
                shape.polyline.points.push(new d2.Point(this.Ax[i], this.Ay[i]));
            }
            shape.resumeState=this.resumeState;
            
            //***reset floating start point
            if (shape.polyline.points.length > 0) {
                if(shape.resumeState==core.ResumeState.ADD_AT_END){
                  shape.floatingStartPoint.set(shape.polyline.points[shape.polyline.points.length - 1]);
                }else{
                  shape.floatingStartPoint.set(shape.polyline.points[0]);  
                }
                shape.reset();
            }
        }	
saveStateFrom( shape) {
            super.saveStateFrom(shape);
            this.Ax = [];
            this.Ay = [];
            for (let i = 0; i < shape.polyline.points.length; i++) {
                this.Ax[i] = (shape.polyline.points[i]).x;
                this.Ay[i] = (shape.polyline.points[i]).y;
            }
            this.resumeState=shape.resumeState;            
        }	
clear() {
            super.clear();
            this.Ax = [];
            this.Ay = [];
        }
equals(obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof FontLabelMemento)) {
                return false;
            }
            let other = obj;
            return (super.equals(obj)&&this.resumeState==other.resumeState&&
                    utilities.arrayEquals(this.Ax, other.Ax) &&  utilities.arrayEquals(this.Ay, other.Ay));

        }
isSameState(unit) {
            let label =unit.getShape(this.uuid);
            return (label.getState(this.mementoType).equals(this));
        }
}
module.exports ={
	LineMemento,
	FontLabelMemento,	
}