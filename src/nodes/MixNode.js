var Node = require('./Node');
var Utils = require('../Utils');

module.exports = MixNode;

function MixNode(options){
	options = options || {};
	Node.call(this, options);
}
MixNode.prototype = Object.create(Node.prototype);
MixNode.prototype.constructor = MixNode;

Node.registerClass('mix', MixNode);

MixNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

MixNode.prototype.getInputPorts = function(key){
	return ['a', 'b', 't'];
};

MixNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

MixNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		if(this.anyInputPortIsConnected()){
			// Something is connected to the input - choose the vector type of largest dimension
			types = [
				Utils.getHighestDimensionVectorType(
					this.getInputVariableTypes('a')
						.concat(this.getInputVariableTypes('b'))
						.concat(this.getInputVariableTypes('t'))
				)
			];
		} else {
			// Nothing connected - use default float type
			types = ['float'];
		}
	}
	return types;
};

MixNode.prototype.getInputTypes = function(key){
	return this.getInputPorts().indexOf(key) !== -1 ? MixNode.supportedTypes : [];
};

MixNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var inVarNameX = this.getInputVariableName('t');
	var inVarTypeX = this.getInputVariableTypes('t')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB  && inVarNameX && outVarName){
		return outVarName + ' = mix(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ',' + Utils.convertGlslType(inVarNameX, inVarTypeX, outVarType) + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
