var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = ValueNode;

// A vector with four components/values.
function ValueNode(options){
	options = options || {};
	Node.call(this, options);
	this.value = options.value || 0;
}
ValueNode.prototype = Object.create(Node.prototype);
ValueNode.prototype.constructor = ValueNode;

Node.registerClass('value', ValueNode);

ValueNode.prototype.getOutputPorts = function(key){
	return ['value'];
};

ValueNode.prototype.getOutputTypes = function(key){
	return key === 'value' ? ['float'] : [];
};

ValueNode.prototype.render = function(){
	return this.getOutputVariableNames('value')[0] + ' = ' + this._numberToGLSL(this.value) + ';';
};
