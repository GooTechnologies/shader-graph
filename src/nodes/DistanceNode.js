var Node = require('./Node');
var OperatorNode = require('./OperatorNode');
var Utils = require('../Utils');

module.exports = DistanceNode;

function DistanceNode(options){
	options = options || {};
	options.functionName = 'distance';
	OperatorNode.call(this, options);
}
DistanceNode.prototype = Object.create(OperatorNode.prototype);
DistanceNode.prototype.constructor = DistanceNode;

Node.registerClass('distance', DistanceNode);

// Output type is always float
DistanceNode.prototype.getOutputTypes = function(key){
	return key === 'out' ? ['float'] : [];
};

DistanceNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarTypeA = this.getInputVariableTypes('a')[0];

	var inVarNameB = this.getInputVariableName('b');
	var inVarTypeB = this.getInputVariableTypes('b')[0];

	var outVarName = this.getOutputVariableNames('out')[0];
	var outVarType = this.getOutputTypes('out')[0];

	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = distance(' + inVarNameA + ',' + inVarNameB + ');';
	} else if(outVarName){
		var outType = this.getOutputTypes('out')[0];
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
	} else {
		return '';
	}
};
