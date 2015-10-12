'use strict';

/* global goo */

var setup = function (args, ctx) {
	var RenderTarget = goo.RenderTarget;
	var MeshData = goo.MeshData;
	var Shader = goo.Shader;
	var Quad = goo.Quad;
	var MeshDataComponent = goo.MeshDataComponent;
	var MeshRendererComponent = goo.MeshRendererComponent;
	var Material = goo.Material;
	var FullscreenUtils = goo.FullscreenUtils;
	var Transform = goo.Transform;

	var shader = {
		attributes: {
			vertexPosition: 'POSITION',
			vertexUV0: 'TEXCOORD0'
		},
		uniforms: {},
		vshader: [
			'attribute vec3 vertexPosition;',
			'attribute vec2 vertexUV0;',
			'varying vec2 textureCoord;',

			'void main(void) {',
			'   textureCoord = vertexUV0;',
			'	gl_Position = vec4(vertexPosition.xy, 0.0, 1.0);',
			'}'
		].join('\n'),
		fshader: [
			'varying vec2 textureCoord;',

			'void main(void){',
			'	gl_FragColor = vec4(textureCoord.xy, 0.0, 1.0);',
			'}'
		].join('\n')
	};

	var renderable = {
		meshData: FullscreenUtils.quad,
		materials: [new Material(shader)],
		transform: new Transform()
	};

	var size = 64;
	var renderer = ctx.world.gooRunner.renderer;

	ctx.renderTarget = new RenderTarget(size, size);
	renderer.render(renderable, FullscreenUtils.camera, [], ctx.renderTarget, true);
	var pixels = new Uint8Array(size * size * 4);
	renderer.readPixels(0,0,size,size,pixels);

	// Draw the pixels to a canvas element
	var canvas = document.createElement('CANVAS');
	canvas.width = canvas.height = size;
	var context = canvas.getContext('2d');
	var imgData = context.createImageData(size, size);
	imgData.data.set(pixels);
	context.putImageData(imgData,0,0);

	var texture = new goo.Texture(canvas, {
		wrapS: 'EdgeClamp',
		wrapT: 'EdgeClamp'
	}, size, size);
	ctx.entity.meshRendererComponent.materials[0].setTexture('DIFFUSE_MAP', texture);
};

var cleanup = function (args, ctx) {
	ctx.entity.meshRendererComponent.materials[0].removeTexture('DIFFUSE_MAP');
};

var update = function (args, ctx) {

};

var parameters = [];