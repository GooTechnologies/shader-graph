var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = FloorNode;

function FloorNode(options){
	options = options || {};
	options.functionName = 'floor';
	MathFunctionNode.call(this, options);
}
FloorNode.prototype = Object.create(MathFunctionNode.prototype);
FloorNode.prototype.constructor = FloorNode;

Node.registerClass('floor', FloorNode);