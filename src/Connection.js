module.exports = Connection;

function Connection(options){
	options = options || {};

	this.fromNode = options.fromNode || null;
	this.fromPortKey = options.fromPortKey || null;
	this.toNode = options.toNode || null;
	this.toPortKey = options.toPortKey || null;
	this.graph = options.graph || null;
}

/**
 * Check if the connection is still valid. The connection can become invalid if some upstream dependency types change.
 * @return {Boolean}
 */
Connection.prototype.isValid = function(){
	var fromNode = this.fromNode;
	var toNode = this.toNode;
	var toPortKey = this.toPortKey;
	var fromPortKey = this.fromPortKey;

	if(!this.graph) return false;
	if(this.fromNode === this.toNode) return false;
	if(toNode.getInputPorts().indexOf(this.toPortKey) === -1) return false;
	if(fromNode.getInputPorts().indexOf(this.fromPortKey) === -1) return false;

	// Check if they have a type in common
	var outputTypes = fromNode.getOutputTypes(fromPortKey);
	var inputTypes = toNode.getInputTypes(toPortKey);
	var hasSharedType = outputTypes.some(function(type){
		return inputTypes.indexOf(type) !== -1;
	});
	if(!outputTypes.length || !inputTypes.length || !hasSharedType) return false;
	if(fromNode.getOutputPorts().indexOf(fromPortKey) === -1) return false;
	return true;
};