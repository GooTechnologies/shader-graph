var Graph = require('./Graph');
var FragColorNode = require('./FragColorNode');

module.exports = FragmentGraph;

function FragmentGraph(options){
	Graph.call(this, options);

	this.fragColorNode = new FragColorNode();
}
FragmentGraph.prototype = Object.create(Graph.prototype);