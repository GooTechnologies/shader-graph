var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = ValueNode;

// A vector with four components/values.
function ValueNode(options){
	options = options || {};
	Node.call(this, {
		name: 'Value'
	});
	this.value = options.value || 0;
}
ValueNode.prototype = Object.create(Node.prototype);
ValueNode.constructor = ValueNode;

ValueNode.prototype.getOutputPorts = function(key){
	return ['value'];
};

ValueNode.prototype.getOutputTypes = function(key){
	return key === 'value' ? ['float'] : [];
};

ValueNode.prototype.render = function(){
	return this.getOutputVariableNames('value')[0] + ' = ' + this._numberToGLSL(this.value) + ';';
};
