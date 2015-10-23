var Node = require('./Node');
var Uniform = require('../Uniform');
var Attribute = require('../Attribute');
var Varying = require('../Varying');

module.exports = TextureNode;

function TextureNode(options){
	options = options || {};
	Node.call(this, options);
}
TextureNode.prototype = Object.create(Node.prototype);
TextureNode.prototype.constructor = TextureNode;

Node.registerClass('texture', TextureNode);

TextureNode.prototype.getInputPorts = function(key){
	return ['uv'];
};

TextureNode.prototype.getInputTypes = function(key){
	var types = [];
	switch(key){
	case 'uv':
		types = ['vec2'];
		break;
	}
	return types;
};

TextureNode.prototype.getOutputPorts = function(key){
	return ['rgba'];
};

TextureNode.prototype.getOutputTypes = function(key){
	var types = [];
	switch(key){
	case 'rgba':
		types = ['vec4'];
		break;
	}
	return types;
};

TextureNode.prototype.getUniforms = function(){
	return [
		new Uniform({
			name: 'texture' + this.id,
			type: 'sampler2D',
			defaultValue: 'TEXTURE' + this.id
		})
	];
};

TextureNode.prototype.render = function(){
	var source = [];
	var outName = this.getOutputVariableNames('rgba')[0];
	var inName = this.getInputVariableName('uv');
	if(outName && inName){
		source.push(outName + ' = texture2D(texture' + this.id + ', vec2(' + inName + '));');
	} else if(outName){
		source.push(outName + ' = vec4(0,0,0,1);');
	}

	return source.join('\n');
};
