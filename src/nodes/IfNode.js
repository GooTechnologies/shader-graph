var Node = require('./Node');
var Utils = require('../Utils');

module.exports = IfNode;

function IfNode(options){
	options = options || {};
	Node.call(this, options);
}
IfNode.prototype = Object.create(Node.prototype);
IfNode.prototype.constructor = IfNode;

Node.registerClass('if', IfNode);

IfNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

IfNode.prototype.getInputPorts = function(key){
	return ['a', 'b', 'a<b', 'a=b', 'a>b'];
};

IfNode.prototype.getOutputPorts = function(key){
	return ['out'];
};

IfNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		if(this.anyInputPortIsConnected()){
			// Something is connected to the input - choose the vector type of largest dimension
			types = [
				Utils.getHighestDimensionVectorType(
					this.getInputVariableTypes('a')
						.concat(this.getInputVariableTypes('b'))
						.concat(this.getInputVariableTypes('a<b'))
						.concat(this.getInputVariableTypes('a=b'))
						.concat(this.getInputVariableTypes('a>b'))
				)
			];
		} else {
			// Nothing connected - use default float type
			types = ['float'];
		}
	}
	return types;
};

IfNode.prototype.getInputTypes = function(key){
	return this.getInputPorts().indexOf(key) !== -1 ? IfNode.supportedTypes : [];
};

IfNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var inVarNameLess = this.getInputVariableName('a<b');
	var inVarTypeLess = this.getInputVariableTypes('a<b')[0];

	var inVarNameEqual = this.getInputVariableName('a=b');
	var inVarTypeEqual = this.getInputVariableTypes('a=b')[0];

	var inVarNameLarger = this.getInputVariableName('a>b');
	var inVarTypeLarger = this.getInputVariableTypes('a>b')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	// TODO: compare components one by one
	if(inVarNameA && inVarNameB && inVarNameEqual && inVarNameLess && inVarNameLarger && outVarName){
		return (
			'if(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + '<' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + '){' +
				outVarName + '=' + inVarNameLess + ';' +
			'}else if(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + '>' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + '){' +
				outVarName + '=' + inVarNameLarger + ';' +
			'}else{' +
				outVarName + '=' + inVarNameEqual + ';' +
			'}'
		);
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
