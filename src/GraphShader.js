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
	var shaderDef = {
		processors: [],
		defines: {},
		attributes : {},
		uniforms : {},
		vshader: '',
		fshader : ''
	};

	// Uniforms and attributes
	[this.fragmentGraph, this.vertexGraph].forEach(function (graph){
		var key;

		// Uniforms
		graph.getUniforms().forEach(function(uniform){
			shaderDef.uniforms[uniform.name] = uniform.defaultValue;
		});

		// Attributes
		graph.getAttributes().forEach(function(attribute){
			shaderDef.attributes[attribute.name] = attribute.defaultValue;
		});
	});

	// Source
	shaderDef.fshader = this.fragmentGraph.buildShader();
	shaderDef.vshader = this.vertexGraph.buildShader();

	shaderDef.processors = shaderDef.processors.concat(this.fragmentGraph.getProcessors(), this.vertexGraph.getProcessors());

	return shaderDef;
};