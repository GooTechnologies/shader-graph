var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = Vector4PropertyNode;

// Adds a vec4 uniform to the shader.
function Vector4PropertyNode(options){
	options = options || {};
	Node.call(this, {
		name: 'Vector4'
	});
	this.defaultValue = options.defaultValue ? options.defaultValue.slice(0) : [0,0,0,0];
}
Vector4PropertyNode.prototype = Object.create(Node.prototype);
Vector4PropertyNode.constructor = Vector4PropertyNode;

Vector4PropertyNode.prototype.getOutputPorts = function(key){
	return [
		'rgba'
	];
};

Vector4PropertyNode.prototype.getOutputTypes = function(key){
	return key === 'rgba' ? ['vec4'] : [];
};

Vector4PropertyNode.prototype.getOutputVarNames = function(key){
	return key === 'rgba' ? ['rgba' + this.id] : [];
};

Vector4PropertyNode.prototype.getUniforms = function(){
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

Vector4PropertyNode.prototype.render = function(){
	return this.getOutputVarNames('rgba')[0] + ' = ' + this.getUniforms()[0].name + ';';
};
