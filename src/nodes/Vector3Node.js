var Node = require('./Node');

module.exports = Vector3Node;

function Vector3Node(options){
	options = options || {};
	Node.call(this, options);
	this.value = options.value ? options.value.slice(0) : [0,0,0];
}
Vector3Node.prototype = Object.create(Node.prototype);
Vector3Node.prototype.constructor = Vector3Node;

Node.registerClass('vec3', Vector3Node);

Vector3Node.prototype.getInputPorts = function(){
	return [];
};

Vector3Node.prototype.getOutputPorts = function(){
	return ['rgb'];
};

Vector3Node.prototype.getOutputTypes = function(key){
	return key === 'rgb' ? ['vec3'] : [];
};

Vector3Node.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('rgb')[0];
	return outVarName ? outVarName + ' = vec3(' + this.value.join(',') + ');' : '';
};
