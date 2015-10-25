var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = LogNode;

function LogNode(options){
	options = options || {};
	options.functionName = 'log';
	MathFunctionNode.call(this, options);
}
LogNode.prototype = Object.create(MathFunctionNode.prototype);
LogNode.prototype.constructor = LogNode;

Node.registerClass('log', LogNode);

LogNode.BASE_E = 'log';
LogNode.BASE_2 = 'log2';

LogNode.prototype.setBase = function(base){
	this.functionName = base;
};