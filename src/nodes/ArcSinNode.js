var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = ArcSinNode;

function ArcSinNode(options){
	options = options || {};
	options.functionName = 'asin';
	MathFunctionNode.call(this, options);
}
ArcSinNode.prototype = Object.create(MathFunctionNode.prototype);
ArcSinNode.prototype.constructor = ArcSinNode;

Node.registerClass('asin', ArcSinNode);