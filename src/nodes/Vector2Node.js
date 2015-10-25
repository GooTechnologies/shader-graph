var Node = require('./Node');

module.exports = Vector2Node;

function Vector2Node(options){
	options = options || {};
	Node.call(this, options);
	this.value = options.value ? options.value.slice(0) : [0,0];
}
Vector2Node.prototype = Object.create(Node.prototype);
Vector2Node.prototype.constructor = Vector2Node;

Node.registerClass('vec2', Vector2Node);

Vector2Node.prototype.getInputPorts = function(){
	return [];
};

Vector2Node.prototype.getOutputPorts = function(){
	return ['rg'];
};

Vector2Node.prototype.getOutputTypes = function(key){
	return key === 'rg' ? ['vec2'] : [];
};

Vector2Node.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('rg')[0];
	return outVarName ? outVarName + ' = vec2(' + this.value.join(',') + ');' : '';
};
