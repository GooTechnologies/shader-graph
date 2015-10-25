var Node = require('./Node');

module.exports = Matrix4Node;

// A vector with four components/values.
function Matrix4Node(options){
	options = options || {};
	Node.call(this, options);
	this.value = options.value ? options.value.slice(0) : [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1];
}
Matrix4Node.prototype = Object.create(Node.prototype);
Matrix4Node.prototype.constructor = Matrix4Node;

Node.registerClass('mat4', Matrix4Node);

Matrix4Node.prototype.getInputPorts = function(){
	return [];
};

Matrix4Node.prototype.getOutputPorts = function(){
	return ['value'];
};

Matrix4Node.prototype.getOutputTypes = function(key){
	return key === 'value' ? ['mat4'] : [];
};

Matrix4Node.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('value')[0];
	return outVarName ? outVarName + ' = mat4(' + this.value.join(',') + ');' : '';
};
