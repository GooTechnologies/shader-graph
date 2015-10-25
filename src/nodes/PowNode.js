var Node = require('./Node');
var Utils = require('../Utils');

module.exports = PowNode;

function PowNode(options){
	options = options || {};
	Node.call(this, options);
}
PowNode.prototype = Object.create(Node.prototype);
PowNode.prototype.constructor = PowNode;

Node.registerClass('pow', PowNode);

PowNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

PowNode.prototype.getInputPorts = function(key){
	return ['val', 'exp'];
};

PowNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

PowNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		if(this.inputPortIsConnected('val') || this.inputPortIsConnected('exp')){
			// Something is connected to the input - choose the vector type of largest dimension
			types = [
				Utils.getHighestDimensionVectorType(
					this.getInputVariableTypes('val').concat(this.getInputVariableTypes('exp'))
				)
			];
		} else {
			// Nothing connected - use default float type
			types = ['float'];
		}
	}
	return types;
};

PowNode.prototype.getInputTypes = function(key){
	return (key === 'val' || key === 'exp') ? PowNode.supportedTypes : [];
};

PowNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('val');
	var inVarTypeA = this.getInputVariableTypes('val')[0];

	var inVarNameB = this.getInputVariableName('exp');
	var inVarTypeB = this.getInputVariableTypes('exp')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = pow(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
