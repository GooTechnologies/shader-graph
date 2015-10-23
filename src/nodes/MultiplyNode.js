var Node = require('./Node');
var Utils = require('../Utils');

module.exports = MultiplyNode;

// Adds a vec4 uniform to the shader.
function MultiplyNode(options){
	options = options || {};
	Node.call(this, options);
}
MultiplyNode.prototype = Object.create(Node.prototype);
MultiplyNode.prototype.constructor = MultiplyNode;

Node.registerClass('multiply', MultiplyNode);

MultiplyNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

MultiplyNode.prototype.getInputPorts = function(key){
	return ['a', 'b'];
};

MultiplyNode.prototype.getOutputPorts = function(key){
	return ['product'];
};

// Output types depends on what we get in.
// Always output the largest vector type of the two inputs.
MultiplyNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'product'){
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

MultiplyNode.prototype.getInputTypes = function(key){
	return (key === 'a' || key === 'b') ? MultiplyNode.supportedTypes : [];
};

MultiplyNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];
	
	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var outVarName = this.getOutputVariableNames('product')[0];
	var outVarType = this.getOutputTypes('product')[0];

	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = ' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ' * ' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ';';
	} else if(outVarName){
		var outType = this.getOutputTypes('product')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
