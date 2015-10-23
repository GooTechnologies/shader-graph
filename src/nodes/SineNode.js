var Node = require('./Node');
var Utils = require('../Utils');

module.exports = SineNode;

// Adds a vec4 uniform to the shader.
function SineNode(options){
	options = options || {};
	Node.call(this, options);
}
SineNode.prototype = Object.create(Node.prototype);
SineNode.prototype.constructor = SineNode;

Node.registerClass('sine', SineNode);

SineNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

SineNode.prototype.getInputPorts = function(key){
	return ['x'];
};

SineNode.prototype.getOutputPorts = function(key){
	return ['y'];
};

// Output type is same as what we get in.
SineNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'y'){
		types = this.inputPortIsConnected('x') ? this.getInputVariableTypes('x') : ['float'];
	}
	return types;
};

SineNode.prototype.getInputTypes = function(key){
	return key === 'x' ? SineNode.supportedTypes : [];
};

SineNode.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('y')[0];
	var outVarType = this.getOutputTypes('y')[0];

	var inVarName = this.getInputVariableName('x');
	var inVarType = this.getInputVariableTypes('x')[0];

	if(outVarName && inVarName){
		return outVarName + ' = sin(' + Utils.convertGlslType(inVarName, inVarType, outVarType) + ');';
	} else if(outVarName){
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
	} else {
		return '';
	}
};
