var Node = require('./Node');
var Utils = require('../Utils');

module.exports = MathFunctionNode;

function MathFunctionNode(options){
	options = options || {};
	this.functionName = options.functionName || 'f';
	Node.call(this, options);
}
MathFunctionNode.prototype = Object.create(Node.prototype);
MathFunctionNode.prototype.constructor = MathFunctionNode;

MathFunctionNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

MathFunctionNode.prototype.getInputPorts = function(key){
	return ['x'];
};

MathFunctionNode.prototype.getOutputPorts = function(key){
	return ['y'];
};

// Output type is same as what we get in.
MathFunctionNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'y'){
		types = this.inputPortIsConnected('x') ? this.getInputVariableTypes('x') : ['float'];
	}
	return types;
};

MathFunctionNode.prototype.getInputTypes = function(key){
	return key === 'x' ? MathFunctionNode.supportedTypes : [];
};

MathFunctionNode.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('y')[0];
	var outVarType = this.getOutputTypes('y')[0];

	var inVarName = this.getInputVariableName('x');
	var inVarType = this.getInputVariableTypes('x')[0];

	if(outVarName && inVarName){
		return outVarName + ' = ' + this.functionName + '(' + Utils.convertGlslType(inVarName, inVarType, outVarType) + ');';
	} else if(outVarName){
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
	} else {
		return '';
	}
};
