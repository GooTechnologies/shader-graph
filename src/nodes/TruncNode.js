var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = TruncNode;

function TruncNode(options){
	options = options || {};
	options.functionName = 'trunc';
	MathFunctionNode.call(this, options);
}
TruncNode.prototype = Object.create(MathFunctionNode.prototype);
TruncNode.prototype.constructor = TruncNode;

Node.registerClass('trunc', TruncNode);