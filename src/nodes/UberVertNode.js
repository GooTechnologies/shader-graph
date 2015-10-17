var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = UberVertNode;

function UberVertNode(){
	Node.call(this, {
		name: 'UberFrag'
	});
}
UberVertNode.prototype = Object.create(Node.prototype);
UberVertNode.prototype.constructor = UberVertNode;

UberVertNode.prototype.canBuildShader = function(){
	return true;
};

UberVertNode.prototype.getUniforms = function(){
	var uniforms = [
		new Uniform({
			name: 'viewProjectionMatrix',
			defaultValue: 'VIEW_PROJECTION_MATRIX',
			type: 'vec3'
		}),
		new Uniform({
			name: 'worldMatrix',
			defaultValue: 'WORLD_MATRIX',
			type: 'mat4'
		}),
		new Uniform({
			name: 'normalMatrix',
			defaultValue: 'NORMAL_MATRIX',
			type: 'mat3'
		}),
		new Uniform({
			name: 'cameraPosition',
			defaultValue: 'CAMERA',
			type: 'vec3'
		})
	];
	return uniforms;
	// diffuseMap: Shader.DIFFUSE_MAP,
	// offsetRepeat: [0, 0, 1, 1],
	// normalMap: Shader.NORMAL_MAP,
	// normalMultiplier: 1.0,
	// specularMap: Shader.SPECULAR_MAP,
	// emissiveMap: Shader.EMISSIVE_MAP,
	// aoMap: Shader.AO_MAP,
	// lightMap: Shader.LIGHT_MAP,
	// environmentCube: 'ENVIRONMENT_CUBE',
	// environmentSphere: 'ENVIRONMENT_SPHERE',
	// reflectionMap: 'REFLECTION_MAP',
	// transparencyMap: 'TRANSPARENCY_MAP',
	// opacity: 1.0,
	// reflectivity: 0.0,
	// refractivity: 0.0,
	// etaRatio: -0.5,
	// fresnel: 0.0,
	// discardThreshold: -0.01,
	// fogSettings: [0, 10000],
	// fogColor: [1, 1, 1],
	// shadowDarkness: 0.5,
	// vertexColorAmount: 1.0,
	// lodBias: 0.0,
	// wrapSettings: [0.5, 0.0]
};

UberVertNode.prototype.getAttributes = function(){
	var attribute = [
		new Attribute({
			name: 'vertexPosition',
			key: 'POSITION',
			type: 'vec3'
		}),
		new Attribute({
			name: 'vertexNormal',
			key: 'NORMAL',
			type: 'vec3',
			ifdef: 'NORMAL'
		}),
		new Attribute({
			name: 'vertexTangent',
			key: 'TANGENT',
			type: 'vec4',
			ifdef: 'NORMAL'
		}),
		new Attribute({
			name: 'vertexColor',
			key: 'COLOR',
			type: 'vec4',
			ifdef: 'COLOR'
		}),
		new Attribute({
			name: 'vertexUV0',
			key: 'TEXCOORD0',
			type: 'vec2',
			ifdef: 'TEXCOORD0'
		}),
		new Attribute({
			name: 'vertexUV1',
			key: 'TEXCOORD1',
			type: 'vec2',
			ifdef: 'TEXCOORD1'
		}),
		new Attribute({
			name: 'vertexJointIDs',
			key: 'JOINTIDS',
			type: 'vec4',
			ifdef: 'JOINTIDS'
		}),
		new Attribute({
			name: 'vertexWeights',
			key: 'WEIGHTS',
			type: 'vec4',
			ifdef: 'WEIGHTS'
		})
	];
	return attribute;
};

UberVertNode.prototype.buildShader = function(){
	return function(){
		this.graph.sortNodes();
		return [
			this.graph.renderAttrubuteDeclarations(),
			this.graph.renderUniformDeclarations(),
			'void main(void){',
				this.graph.renderConnectionVariableDeclarations(),
				this.graph.renderNodeCodes(),
				'{',
					'mat4 wMatrix = worldMatrix;',
					'#ifdef NORMAL',
						'mat3 nMatrix = normalMatrix;',
					'#endif',
					ShaderBuilder.animation.vertex,
					'vec4 worldPos = wMatrix * vec4(vertexPosition, 1.0);',
					'vWorldPos = worldPos.xyz;',
					'gl_Position = viewProjectionMatrix * worldPos;',

					'viewPosition = cameraPosition - worldPos.xyz;',

					'#ifdef NORMAL',
					'	normal = normalize(nMatrix * vertexNormal);',
					'#endif',
					'#ifdef TANGENT',
					'	tangent = normalize(nMatrix * vertexTangent.xyz);',
					'	binormal = cross(normal, tangent) * vec3(vertexTangent.w);',
					'#endif',
					'#ifdef COLOR',
					'	color = vertexColor;',
					'#endif',
					'#ifdef TEXCOORD0',
					'	texCoord0 = vertexUV0 * offsetRepeat.zw + offsetRepeat.xy;',
					'#endif',
					'#ifdef TEXCOORD1',
					'	texCoord1 = vertexUV1;',
					'#endif',

					ShaderBuilder.light.vertex,
				'}',
			'}'
		].join('\n');

	}.bind(this);
};