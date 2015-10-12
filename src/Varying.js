module.exports = Varying;

function Varying(options){
	options = options || {};

	this.type = options.type || 'float';
	this.name = options.name || 'vUntitled';
	this.attributeKey = options.attributeKey || ''; // e.g. COLOR
	this.ifdef = options.ifdef || ''; // A define name or empty string to indicate no define dependency
}