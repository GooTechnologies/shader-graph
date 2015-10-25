var Node = require('./Node');
var Utils = require('../Utils');

module.exports = ClampNode;

function ClampNode(options){
	options = options || {};
	Node.call(this, options);
}
ClampNode.prototype = Object.create(Node.prototype);
ClampNode.prototype.constructor = ClampNode;

Node.registerClass('clamp', ClampNode);

ClampNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

ClampNode.prototype.getInputPorts = function(key){
	return ['min', 'max', 'x'];
};

ClampNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

ClampNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		if(this.anyInputPortIsConnected()){
			// Something is connected to the input - choose the vector type of largest dimension
			types = [
				Utils.getHighestDimensionVectorType(
					this.getInputVariableTypes('min')
						.concat(this.getInputVariableTypes('max'))
						.concat(this.getInputVariableTypes('x'))
				)
			];
		} else {
			// Nothing connected - use default float type
			types = ['float'];
		}
	}
	return types;
};

ClampNode.prototype.getInputTypes = function(key){
	return this.getInputPorts().indexOf(key) !== -1 ? ClampNode.supportedTypes : [];
};

ClampNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('min');
	var inVarTypeA = this.getInputVariableTypes('min')[0];

	var inVarNameB = this.getInputVariableName('max');
	var inVarTypeB = this.getInputVariableTypes('max')[0];

	var inVarNameX = this.getInputVariableName('x');
	var inVarTypeX = this.getInputVariableTypes('x')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB  && inVarNameX && outVarName){
		return outVarName + ' = clamp(' + Utils.convertGlslType(inVarNameX, inVarTypeX, outVarType) + ',' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
