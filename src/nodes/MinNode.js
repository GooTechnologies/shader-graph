var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = MinNode;

function MinNode(options){
	options = options || {};
	options.functionName = 'min';
	MathFunctionNode.call(this, options);
}
MinNode.prototype = Object.create(MathFunctionNode.prototype);
MinNode.prototype.constructor = MinNode;

Node.registerClass('min', MinNode);