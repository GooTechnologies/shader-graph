var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = ArcTanNode;

function ArcTanNode(options){
	options = options || {};
	options.functionName = 'atan';
	MathFunctionNode.call(this, options);
}
ArcTanNode.prototype = Object.create(MathFunctionNode.prototype);
ArcTanNode.prototype.constructor = ArcTanNode;

Node.registerClass('atan', ArcTanNode);