var GraphShader = require('../src/GraphShader');
var Vector4Node = require('../src/Vector4Node');

module.exports = {
	GraphShader: {
		function (test) {
			var shader = new GraphShader();
			
			var vectorNode = new Vector4Node({
				defaultValue: [1,1,1,1]
			});
			shader.fragmentGraph.addNode(vectorNode);

			shader.fragmentGraph.fragColorNode.connect('rgba', vectorNode, 'rgba');

			var shaderDef = shader.buildShader();

			test.deepEqual(shaderDef, {
				attributes: {
					vertexPosition: 'POSITION'
				},
				uniforms: {
					viewProjectionMatrix: 'VIEW_PROJECTION_MATRIX',
					worldMatrix: 'WORLD_MATRIX',
					color: [1, 1, 1, 1]
				},
				vshader: [
					'attribute vec3 vertexPosition;',
					'uniform mat4 viewProjectionMatrix;',
					'uniform mat4 worldMatrix;',
					'void main(void) {',
						'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);',
					'}'
				].join('\n'),
				fshader: [
					'uniform vec4 color;',
					'void main(void){',
						'gl_FragColor = color;',
					'}'
				].join('\n')
			});

			test.done();
		}
	}
};