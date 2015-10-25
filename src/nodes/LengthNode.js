var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');
var Utils = require('../Utils');

module.exports = LengthNode;

function LengthNode(options){
	options = options || {};
	MathFunctionNode.call(this, options);
}
LengthNode.prototype = Object.create(MathFunctionNode.prototype);
LengthNode.prototype.constructor = LengthNode;

Node.registerClass('length', LengthNode);

// Output type is always float
LengthNode.prototype.getOutputTypes = function(key){
	return key === 'y' ? ['float'] : [];
};

LengthNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('x');
	var inVarTypeA = this.getInputVariableTypes('x')[0];

	var outVarName = this.getOutputVariableNames('y')[0];
	var outVarType = this.getOutputTypes('y')[0];

	if(inVarNameA && outVarName){
		return outVarName + ' = length(' + inVarNameA + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('y')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
