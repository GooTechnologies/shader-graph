var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = Vector4Node;

// A vector with four components/values.
function Vector4Node(options){
	options = options || {};
	Node.call(this, {
		name: 'Vector4'
	});
	this.defaultValue = options.defaultValue ? options.defaultValue.slice(0) : [0,0,0,0];
}
Vector4Node.prototype = Object.create(Node.prototype);
Vector4Node.prototype.constructor = Vector4Node;

Node.registerClass('vec4', Vector4Node);

Vector4Node.prototype.getInputPorts = function(){
	return ['r', 'g', 'b', 'a'];
};

Vector4Node.prototype.getOutputPorts = function(){
	return ['rgba'];
};

Vector4Node.prototype.getInputTypes = function(key){
	var types;
	switch(key){
	case 'r': types = ['float']; break;
	case 'g': types = ['float']; break;
	case 'b': types = ['float']; break;
	case 'a': types = ['float']; break;
	}
	return types;
};

Vector4Node.prototype.getOutputTypes = function(key){
	return key === 'rgba' ? ['vec4'] : [];
};

Vector4Node.prototype.getOutputVarNames = function(key){
	return key === 'rgba' ? ['rgba' + this.id] : [];
};

Vector4Node.prototype.render = function(){
	var r = this.getInputVariableNames('r')[0] || "0";
	var g = this.getInputVariableNames('g')[0] || "0";
	var b = this.getInputVariableNames('b')[0] || "0";
	var a = this.getInputVariableNames('a')[0] || "1";
	return this.getOutputVariableNames('rgba')[0] + ' = vec4(' + r + ',' + g + ',' + b + ',' + a + ');';
};
