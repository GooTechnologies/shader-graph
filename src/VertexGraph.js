var Graph = require('./Graph');
var Uniform = require('./Uniform');

module.exports = VertexGraph;

function VertexGraph(options){
	Graph.call(this, options);
}
VertexGraph.prototype = Object.create(Graph.prototype);

VertexGraph.prototype.getUniforms = function(){
	var uniforms = Graph.prototype.getUniforms.apply(this);
	uniforms.push(
		new Uniform({
			name: 'viewProjectionMatrix',
			type: 'mat4',
			defaultValue: 'VIEW_PROJECTION_MATRIX'
		}),
		new Uniform({
			name: 'worldMatrix',
			type: 'mat4',
			defaultValue: 'WORLD_MATRIX'
		})
	);
	return uniforms;
};

VertexGraph.prototype.getAttributes = function(){
	var attributes = Graph.prototype.getAttributes.apply(this);
	attributes.vertexPosition = 'POSITION';
	return attributes;
};