var FragMainNode = require('./FragMainNode');
var FragmentGraph = require('./FragmentGraph');
var VertexGraph = require('./VertexGraph');

module.exports = GraphShader;

function GraphShader(){
	this.fragmentGraph = new FragmentGraph({
		shader: this
	});
	this.vertexGraph = new VertexGraph({
		shader: this
	});
}

GraphShader.prototype.buildShader = function(){
	var varCount = 0;
	var shaderDef = {
		attributes : {},
		uniforms : {},
		vshader: '',
		fshader : ''
	};

	shaderDef.fshader = this.fragmentGraph.buildShader();

	[this.fragmentGraph, this.vertexGraph].forEach(function (graph){
		var key;

		// Uniforms
		graph.getUniforms().forEach(function(uniform){
			shaderDef.uniforms[uniform.name] = uniform.defaultValue;
		});

		// Attributes
		var attributes = graph.getAttributes();
		for(key in attributes){
			shaderDef.attributes[key] = attributes[key];
		}
	});

	shaderDef.vshader = this.vertexGraph.buildShader();

	return shaderDef;
};