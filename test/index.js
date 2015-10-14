var GraphShader = require('../src/GraphShader');
var Vector4Node = require('../src/nodes/Vector4Node');

module.exports = {
	GraphShader: {
		fragColor: function (test) {
			var shader = new GraphShader();
			var fragmentGraph = shader.fragmentGraph;
			var vertexGraph = shader.vertexGraph;

			var vectorNode = new Vector4Node({
				defaultValue: [1,1,1,1]
			});
			shader.fragmentGraph.addNode(vectorNode);

			test.ok(fragmentGraph.mainNode.canConnect('rgba', vectorNode, 'rgba'));
			fragmentGraph.mainNode.connect('rgba', vectorNode, 'rgba');

			var shaderDef = shader.buildShader();

			var expectedUniforms = {
				viewProjectionMatrix: 'VIEW_PROJECTION_MATRIX',
				worldMatrix: 'WORLD_MATRIX'
			};
			expectedUniforms['color' + vectorNode.id] = [1, 1, 1, 1];
			test.deepEqual(shaderDef.uniforms, expectedUniforms);

			test.deepEqual(shaderDef.attributes, {
				vertexPosition: 'POSITION'
			});

			test.deepEqual(shaderDef.vshader(), [
				'attribute vec3 vertexPosition;',
				'uniform mat4 viewProjectionMatrix;',
				'uniform mat4 worldMatrix;',
				'void main(void){',
					'',
					'',
					'{',
					'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);',
					'}',
				'}'
			].join('\n'));

			test.deepEqual(shaderDef.fshader(), [
				'',
				'uniform vec4 color' + vectorNode.id + ';',
				'void main(void){',
					'vec4 rgba' + vectorNode.id + ';',
					'{',
						'rgba' + vectorNode.id + ' = color' + vectorNode.id + ';',
					'}',
					'{',
						'gl_FragColor = rgba' + vectorNode.id + ';',
					'}',
				'}'
			].join('\n'));

			test.done();
		}
	}
};