var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = ArcCosNode;

function ArcCosNode(options){
	options = options || {};
	options.functionName = 'acos';
	MathFunctionNode.call(this, options);
}
ArcCosNode.prototype = Object.create(MathFunctionNode.prototype);
ArcCosNode.prototype.constructor = ArcCosNode;

Node.registerClass('asin', ArcCosNode);