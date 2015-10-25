var Node = require('./Node');

module.exports = Vector4Node;

// A vector with four components/values.
function Vector4Node(options){
	options = options || {};
	Node.call(this, options);
	this.value = options.value ? options.value.slice(0) : [0,0,0,0];
}
Vector4Node.prototype = Object.create(Node.prototype);
Vector4Node.prototype.constructor = Vector4Node;

Node.registerClass('vec4', Vector4Node);

Vector4Node.prototype.getInputPorts = function(){
	return [];
};

Vector4Node.prototype.getOutputPorts = function(){
	return ['rgba'];
};

Vector4Node.prototype.getOutputTypes = function(key){
	return key === 'rgba' ? ['vec4'] : [];
};

Vector4Node.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('rgba')[0];
	return outVarName ? outVarName + ' = vec4(' + this.value.join(',') + ');' : '';
};
