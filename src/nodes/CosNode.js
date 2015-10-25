var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = CosNode;

function CosNode(options){
	options = options || {};
	options.functionName = 'cos';
	MathFunctionNode.call(this, options);
}
CosNode.prototype = Object.create(MathFunctionNode.prototype);
CosNode.prototype.constructor = CosNode;

Node.registerClass('cos', CosNode);