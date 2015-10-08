var Node = require('./Node');

module.exports = UberNode;

function UberNode(){
	Node.call(this, {
		name: 'Uber'
	});
}
UberNode.prototype = Object.create(Node.prototype);
UberNode.constructor = UberNode;

UberNode.prototype.getInputPorts = function(key){
	return [
		'diffuse',
		'normal',
		'specular',
		'emissive',
		'alpha',
		'alphakill'
	];
};

UberNode.prototype.canBuildShader = function(){
	return this.graph.inputPortIsConnected(this, 'color');
};

UberNode.prototype.canConnect = function(key, targetNode, targetPortKey){
	return (key === 'color' && targetNode.getOutputTypes(targetPortKey)[0] === 'vec4') && Node.prototype.canConnect.apply(this, arguments);
};

UberNode.prototype.getInputTypes = function(key){
	var types = [];
	switch(key){
	case 'diffuse':
		types = ['vec4'];
		break;
	case 'normal':
		types = ['vec3'];
		break;
	case 'specular':
		types = ['vec3'];
		break;
	case 'emissive':
		types = ['vec3'];
		break;
	case 'alpha':
		types = ['float'];
		break;
	case 'alphakill':
		types = ['float'];
		break;
	}
	return types;
};

FragColorNode.prototype.getProcessors = function(){
	return [
		ShaderBuilder.uber.processor,
		ShaderBuilder.light.processor,
		ShaderBuilder.animation.processor
	];
};

FragColorNode.prototype.getBuilder = function(){
	return function (shader, shaderInfo) {
		ShaderBuilder.light.builder(shader, shaderInfo);
	};
};

FragColorNode.prototype.getUniforms = function(){
	var uniforms = [
		// new Uniform({
		// 	name: 'color' + this.id,
		// 	defaultValue: value.slice(0),
		// 	type: 'vec4'
		// })
	];
	return uniforms;

	// viewProjectionMatrix: Shader.VIEW_PROJECTION_MATRIX,
	// worldMatrix: Shader.WORLD_MATRIX,
	// normalMatrix: Shader.NORMAL_MATRIX,
	// cameraPosition: Shader.CAMERA,
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

FragColorNode.prototype.getAttributes = function(){
	// vertexPosition: MeshData.POSITION,
	// vertexNormal: MeshData.NORMAL,
	// vertexTangent: MeshData.TANGENT,
	// vertexColor: MeshData.COLOR,
	// vertexUV0: MeshData.TEXCOORD0,
	// vertexUV1: MeshData.TEXCOORD1,
	// vertexJointIDs: MeshData.JOINTIDS,
	// vertexWeights: MeshData.WEIGHTS
	return [];
};

FragColorNode.prototype.render = function(){
	ShaderLib.uber = {
		processors: ,
		attributes: {
		},
		uniforms: {},
		builder: ,
		vshader: function () {
			return [
			'attribute vec3 vertexPosition;',

			'#ifdef NORMAL',
				'attribute vec3 vertexNormal;',
			'#endif',
			'#ifdef TANGENT',
				'attribute vec4 vertexTangent;',
			'#endif',
			'#ifdef COLOR',
				'attribute vec4 vertexColor;',
			'#endif',
			'#ifdef TEXCOORD0',
				'attribute vec2 vertexUV0;',
				'uniform vec4 offsetRepeat;',
				'varying vec2 texCoord0;',
			'#endif',
			'#ifdef TEXCOORD1',
				'attribute vec2 vertexUV1;',
				'varying vec2 texCoord1;',
			'#endif',

			'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 worldMatrix;',
			'uniform mat3 normalMatrix;',
			'uniform vec3 cameraPosition;',

			'varying vec3 vWorldPos;',
			'varying vec3 viewPosition;',
			'#ifdef NORMAL',
			'varying vec3 normal;',
			'#endif',
			'#ifdef TANGENT',
			'varying vec3 binormal;',
			'varying vec3 tangent;',
			'#endif',
			'#ifdef COLOR',
			'varying vec4 color;',
			'#endif',

			ShaderBuilder.light.prevertex,

			ShaderBuilder.animation.prevertex,

			'void main(void) {',
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
			'}'
		].join('\n');
		},
		fshader: function () {
			return [
			'uniform float lodBias;',
			'#ifdef DIFFUSE_MAP',
				'uniform sampler2D diffuseMap;',
			'#endif',
			'#ifdef NORMAL_MAP',
				'uniform sampler2D normalMap;',
				'uniform float normalMultiplier;',
			'#endif',
			'#ifdef SPECULAR_MAP',
				'uniform sampler2D specularMap;',
			'#endif',
			'#ifdef EMISSIVE_MAP',
				'uniform sampler2D emissiveMap;',
			'#endif',
			'#ifdef AO_MAP',
				'uniform sampler2D aoMap;',
			'#endif',
			'#ifdef LIGHT_MAP',
				'uniform sampler2D lightMap;',
			'#endif',
			'#ifdef TRANSPARENCY_MAP',
				'uniform sampler2D transparencyMap;',
			'#endif',
			'#ifdef REFLECTIVE',
				'#ifdef ENVIRONMENT_CUBE',
					'uniform samplerCube environmentCube;',
				'#elif defined(ENVIRONMENT_SPHERE)',
					'uniform sampler2D environmentSphere;',
				'#endif',
				'uniform vec4 clearColor;',
				'uniform float reflectivity;',
				'uniform float fresnel;',
				'uniform float refractivity;',
				'uniform float etaRatio;',
				'#ifdef REFLECTION_MAP',
					'uniform sampler2D reflectionMap;',
				'#endif',
			'#endif',

			'#ifdef OPACITY',
				'uniform float opacity;',
			'#endif',
			'#ifdef DISCARD',
				'uniform float discardThreshold;',
			'#endif',

			'#ifdef FOG',
				'uniform vec2 fogSettings;',
				'uniform vec3 fogColor;',
			'#endif',

			'varying vec3 vWorldPos;',
			'varying vec3 viewPosition;',
			'#ifdef NORMAL',
				'varying vec3 normal;',
			'#endif',
			'#ifdef TANGENT',
				'varying vec3 binormal;',
				'varying vec3 tangent;',
			'#endif',
			'#ifdef COLOR',
				'varying vec4 color;',
				'uniform float vertexColorAmount;',
			'#endif',
			'#ifdef TEXCOORD0',
				'varying vec2 texCoord0;',
			'#endif',
			'#ifdef TEXCOORD1',
				'varying vec2 texCoord1;',
			'#endif',

			'#define M_PI 3.14159265358979323846264338328',

			ShaderBuilder.light.prefragment,

			'void main(void)',
			'{',
				'vec4 final_color = vec4(1.0);',

				'#if defined(DIFFUSE_MAP) && defined(TEXCOORD0)',
					'final_color *= texture2D(diffuseMap, texCoord0, lodBias);',
				'#endif',

				'#ifdef COLOR',
					'final_color *= mix(vec4(1.0), color, vertexColorAmount);',
				'#endif',

				'#if defined(TRANSPARENCY_MAP) && defined(TEXCOORD0)',
					'#ifdef TRANSPARENCY_BW',
						'final_color.a = texture2D(transparencyMap, texCoord0).r;',
					'#else',
						'final_color.a = texture2D(transparencyMap, texCoord0).a;',
					'#endif',
				'#endif',
				'#ifdef OPACITY',
					'final_color.a *= opacity;',
				'#endif',

				'#ifdef DISCARD',
					'if (final_color.a < discardThreshold) discard;',
				'#endif',

				'#ifdef AO_MAP',
					'#ifdef TEXCOORD1',
						'final_color.rgb *= texture2D(aoMap, texCoord1).rgb;',
					'#elif defined(TEXCOORD0)',
						'final_color.rgb *= texture2D(aoMap, texCoord0).rgb;',
					'#endif',
				'#endif',

				'#ifdef LIGHT_MAP',
					'#ifdef TEXCOORD1',
						'final_color.rgb *= texture2D(lightMap, texCoord1).rgb * 2.0;',
					'#elif defined(TEXCOORD0)',
						'final_color.rgb *= texture2D(lightMap, texCoord0).rgb * 2.0;',
					'#endif',
				'#else',
					'vec3 N = vec3(0.0, 1.0, 0.0);',
					'#if defined(NORMAL)', // Do nasty doublework for IE compliance
						'N = normalize(normal);',
					'#endif',
					'#if defined(TANGENT) && defined(NORMAL_MAP) && defined(TEXCOORD0)',
						'mat3 tangentToWorld = mat3(tangent, binormal, normal);',
						'vec3 tangentNormal = texture2D(normalMap, texCoord0, lodBias).xyz * vec3(2.0) - vec3(1.0);',
						'tangentNormal.xy *= normalMultiplier;',
						'vec3 worldNormal = (tangentToWorld * tangentNormal);',
						'N = normalize(worldNormal);',
					// '#elif defined(NORMAL)',
						// 'N = normalize(normal);',
					// '#endif',
					'#endif',

					ShaderBuilder.light.fragment,
				'#endif',

				'#ifdef REFLECTIVE',
					'if (refractivity > 0.0) {',
						'vec4 environment = vec4(0.0);',
						'#ifdef ENVIRONMENT_CUBE',
							'vec3 refractionVector = refract(normalize(viewPosition), N, etaRatio);',
							'refractionVector.x = -refractionVector.x;',
							'environment = textureCube(environmentCube, refractionVector);',
						'#elif defined(ENVIRONMENT_SPHERE)',
							'vec3 refractionVector = refract(normalize(viewPosition), N, etaRatio);',
							'refractionVector = -refractionVector;',
							'float xx = (atan(refractionVector.z, refractionVector.x) + M_PI) / (2.0 * M_PI);',
							'float yy = refractionVector.y * 0.5 + 0.5;',
							'environment = texture2D(environmentSphere, vec2(xx, yy));',
						'#endif',
						'environment.rgb = mix(clearColor.rgb, environment.rgb, environment.a);',

						'final_color.rgb = mix(final_color.rgb, environment.rgb, refractivity);',
					'}',

					'if (reflectivity > 0.0) {',
						'vec4 environment = vec4(0.0);',
						'#ifdef ENVIRONMENT_CUBE',
							'vec3 reflectionVector = reflect(normalize(viewPosition), N);',
							'reflectionVector.yz = -reflectionVector.yz;',
							'environment = textureCube(environmentCube, reflectionVector);',
						'#elif defined(ENVIRONMENT_SPHERE)',
							'vec3 reflectionVector = reflect(normalize(viewPosition), N);',
							'float xx = (atan(reflectionVector.z, reflectionVector.x) + M_PI) / (2.0 * M_PI);',
							'float yy = reflectionVector.y * 0.5 + 0.5;',
							'environment = texture2D(environmentSphere, vec2(xx, yy));',
						'#endif',
						'environment.rgb = mix(clearColor.rgb, environment.rgb, environment.a);',

						'float reflectionAmount = reflectivity;',
						'#if defined(REFLECTION_MAP) && defined(TEXCOORD0)',
							'reflectionAmount *= texture2D(reflectionMap, texCoord0).r;',
						'#endif',

						'float fresnelVal = pow(1.0 - abs(dot(normalize(viewPosition), N)), fresnel * 4.0);',
						'reflectionAmount *= fresnelVal;',

						'#if REFLECTION_TYPE == 0',
							'final_color.rgb = mix(final_color.rgb, environment.rgb, reflectionAmount);',
						'#elif REFLECTION_TYPE == 1',
							'final_color.rgb += environment.rgb * reflectionAmount;',
						'#endif',
						'final_color.a = min(final_color.a + reflectionAmount, 1.0);',
					'}',
				'#endif',

				'#ifndef LIGHT_MAP',
					'final_color.rgb += totalSpecular;',
					'final_color.a = min(final_color.a + length(totalSpecular) / 3.0, 1.0);',
				'#endif',

				'#ifdef FOG',
					'float d = pow(smoothstep(fogSettings.x, fogSettings.y, length(viewPosition)), 1.0);',
					'final_color.rgb = mix(final_color.rgb, fogColor, d);',
				'#endif',

				'gl_FragColor = final_color;',
			'}'
		].join('\n');
		}
	};