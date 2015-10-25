var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = CeilNode;

function CeilNode(options){
	options = options || {};
	options.functionName = 'ceil';
	MathFunctionNode.call(this, options);
}
CeilNode.prototype = Object.create(MathFunctionNode.prototype);
CeilNode.prototype.constructor = CeilNode;

Node.registerClass('floor', CeilNode);