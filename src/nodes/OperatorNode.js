var Node = require('./Node');
var Utils = require('../Utils');

module.exports = OperatorNode;

function OperatorNode(options){
	options = options || {};
	this.operator = options.operator || '*';
	Node.call(this, options);
}
OperatorNode.prototype = Object.create(Node.prototype);
OperatorNode.prototype.constructor = OperatorNode;

OperatorNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

OperatorNode.prototype.getInputPorts = function(key){
	return ['a', 'b'];
};

OperatorNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

OperatorNode.prototype.getOutputTypes = function(key){
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

OperatorNode.prototype.getInputTypes = function(key){
	return (key === 'a' || key === 'b') ? OperatorNode.supportedTypes : [];
};

OperatorNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = ' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + this.operator + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ';';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
