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

GraphShader.prototype.getNodes = function(){
	return this.vertexGraph.nodes.concat(this.fragmentGraph.nodes);
};

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

		// Uniforms
		graph.getUniforms().forEach(function(uniform){
			shaderDef.uniforms[uniform.name] = uniform.defaultValue;
		});

		// Attributes
		graph.getAttributes().forEach(function(attribute){
			shaderDef.attributes[attribute.name] = attribute.key;
		});
	});

	// Source
	shaderDef.fshader = this.fragmentGraph.mainNode.buildShader();
	shaderDef.vshader = this.vertexGraph.mainNode.buildShader();

	shaderDef.builder = this.fragmentGraph.mainNode.getBuilder() || this.vertexGraph.mainNode.getBuilder();

	shaderDef.processors = shaderDef.processors.concat(this.fragmentGraph.getProcessors(), this.vertexGraph.getProcessors());

	return shaderDef;
};