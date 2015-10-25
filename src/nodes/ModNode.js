var Node = require('./Node');
var OperatorNode = require('./OperatorNode');
var Utils = require('../Utils');

module.exports = ModNode;

function ModNode(options){
	options = options || {};
	options.functionName = 'mod';
	OperatorNode.call(this, options);
}
ModNode.prototype = Object.create(OperatorNode.prototype);
ModNode.prototype.constructor = ModNode;

Node.registerClass('mod', ModNode);

ModNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = mod(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
