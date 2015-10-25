var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = NormalizeNode;

function NormalizeNode(options){
	options = options || {};
	options.functionName = 'normalize';
	MathFunctionNode.call(this, options);
}
NormalizeNode.prototype = Object.create(MathFunctionNode.prototype);
NormalizeNode.prototype.constructor = NormalizeNode;

Node.registerClass('normalize', NormalizeNode);