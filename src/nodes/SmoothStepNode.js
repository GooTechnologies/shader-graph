var Node = require('./Node');
var Utils = require('../Utils');

module.exports = SmoothStepNode;

function SmoothStepNode(options){
	options = options || {};
	Node.call(this, options);
}
SmoothStepNode.prototype = Object.create(Node.prototype);
SmoothStepNode.prototype.constructor = SmoothStepNode;

Node.registerClass('smoothstep', SmoothStepNode);

SmoothStepNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

SmoothStepNode.prototype.getInputPorts = function(key){
	return ['a', 'b', 'x'];
};

SmoothStepNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

SmoothStepNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		if(this.inputPortIsConnected('a') || this.inputPortIsConnected('b') || this.inputPortIsConnected('x')){
			// Something is connected to the input - choose the vector type of largest dimension
			types = [
				Utils.getHighestDimensionVectorType(
					this.getInputVariableTypes('a').concat(this.getInputVariableTypes('b')).concat(this.getInputVariableTypes('x'))
				)
			];
		} else {
			// Nothing connected - use default float type
			types = ['float'];
		}
	}
	return types;
};

SmoothStepNode.prototype.getInputTypes = function(key){
	return (key === 'a' || key === 'b' || key === 'x') ? SmoothStepNode.supportedTypes : [];
};

SmoothStepNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var inVarNameX = this.getInputVariableName('x');
	var inVarTypeX = this.getInputVariableTypes('x')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB  && inVarNameX && outVarName){
		return outVarName + ' = smoothstep(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType)+ ',' + Utils.convertGlslType(inVarNameX, inVarTypeX, outVarType) + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
