var Node = require('./Node');
var Utils = require('../Utils');

module.exports = StepNode;

function StepNode(options){
	options = options || {};
	Node.call(this, options);
}
StepNode.prototype = Object.create(Node.prototype);
StepNode.prototype.constructor = StepNode;

Node.registerClass('step', StepNode);

StepNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

StepNode.prototype.getInputPorts = function(key){
	return ['a', 'b'];
};

StepNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

StepNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		if(this.inputPortIsConnected('a') || this.inputPortIsConnected('b')){
			// Something is connected to the input - choose the vector type of largest dimension
			types = [
				Utils.getHighestDimensionVectorType(
					this.getInputVariableTypes('a').concat(this.getInputVariableTypes('b'))
				)
			];
		} else {
			// Nothing connected - use default float type
			types = ['float'];
		}
	}
	return types;
};

StepNode.prototype.getInputTypes = function(key){
	return (key === 'a' || key === 'b') ? StepNode.supportedTypes : [];
};

StepNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = step(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
