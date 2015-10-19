var Node = require('./Node');
var Uniform = require('../Uniform');
var Attribute = require('../Attribute');
var Varying = require('../Varying');

module.exports = UVNode;

function UVNode(options){
	options = options || {};
	Node.call(this, options);
}
UVNode.prototype = Object.create(Node.prototype);
UVNode.prototype.constructor = UVNode;

Node.registerClass('uv', UVNode);

UVNode.prototype.getOutputPorts = function(key){
	return [
		'uv',
		'u',
		'v'
	];
};

UVNode.prototype.getAttributes = function(){
	return [
		new Attribute({
			name: 'vertexUV0',
			key: 'TEXCOORD0',
			type: 'vec2',
			ifdef: 'TEXCOORD0'
		})
	];
};

UVNode.prototype.getVaryings = function(){
	return [
		new Varying({
			type: 'vec2',
			name: 'texCoord0',
			attributeKey: 'TEXCOORD0'
		})
	];
};

UVNode.prototype.getOutputTypes = function(key){
	var types = [];
	switch(key){
	case 'uv':
		types = ['vec2'];
		break;
	case 'u':
	case 'v':
		types = ['float'];
		break;
	}
	return types;
};

UVNode.prototype.getOutputVarNames = function(key){
	return key === 'uv' ? ['uv' + this.id] : [];
};

UVNode.prototype.render = function(){
	var source = [];

	var uvVarName = this.getOutputVariableNames('uv')[0];
	if(uvVarName){
		source.push(uvVarName + ' = texCoord0;');
	}

	var uVarName = this.getOutputVariableNames('u')[0];
	if(uVarName){
		source.push(uVarName + ' = texCoord0.x;');
	}

	var vVarName = this.getOutputVariableNames('v')[0];
	if(vVarName){
		source.push(vVarName + ' = texCoord0.y;');
	}

	return source.join('\n');
};
