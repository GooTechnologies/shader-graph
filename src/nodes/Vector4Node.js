var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = Vector4Node;

function Vector4Node(options){
	options = options || {};
	Node.call(this, {
		name: 'Vector4',
		outputPorts: ['rgba']
	});
	this.defaultValue = options.defaultValue ? options.defaultValue.slice(0) : [0,0,0,0];
}
Vector4Node.prototype = Object.create(Node.prototype);
Vector4Node.constructor = Vector4Node;

Vector4Node.prototype.getOutputTypes = function(key){
	return key === 'rgba' ? ['vec4'] : [];
};

Vector4Node.prototype.getOutputVarNames = function(key){
	return key === 'rgba' ? ['rgba' + this.id] : [];
};

Vector4Node.prototype.getUniforms = function(){
	var value = this.defaultValue;
	var uniforms = [
		new Uniform({
			name: 'color' + this.id,
			defaultValue: value.slice(0),
			type: 'vec4'
		})
	];
	return uniforms;
};

Vector4Node.prototype.render = function(){
	return this.getOutputVarNames('rgba')[0] + ' = ' + this.getUniforms()[0].name + ';';
};
