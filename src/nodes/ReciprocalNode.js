var Node = require('./Node');
var Utils = require('../Utils');

module.exports = ReciprocalNode;

function ReciprocalNode(options){
	options = options || {};
	Node.call(this, options);
}
ReciprocalNode.prototype = Object.create(Node.prototype);
ReciprocalNode.prototype.constructor = ReciprocalNode;

Node.registerClass('reciprocal', ReciprocalNode);

ReciprocalNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

ReciprocalNode.prototype.getInputPorts = function(key){
	return ['x'];
};

ReciprocalNode.prototype.getOutputPorts = function(key){
	return ['y'];
};

// Output type is same as what we get in.
ReciprocalNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'y'){
		types = this.inputPortIsConnected('x') ? this.getInputVariableTypes('x') : ['float'];
	}
	return types;
};

ReciprocalNode.prototype.getInputTypes = function(key){
	return key === 'x' ? ReciprocalNode.supportedTypes : [];
};

ReciprocalNode.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('y')[0];
	var outVarType = this.getOutputTypes('y')[0];

	var inVarName = this.getInputVariableName('x');
	var inVarType = this.getInputVariableTypes('x')[0];

	if(outVarName && inVarName){
		return outVarName + ' = ' + inVarType + '(1) / (' + Utils.convertGlslType(inVarName, inVarType, outVarType) + ');';
	} else if(outVarName){
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
	} else {
		return '';
	}
};
