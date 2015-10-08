module.exports = Attribute;

function Attribute(options){
	options = options || {};

	this.type = options.type || 'float';
	this.name = options.name || 'aUntitled';
	this.key = options.key || 'POSITION';
	this.dependsOnDefine = ''; // A define name or empty string to indicate no define dependency
}