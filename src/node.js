//==============================================================================
// Represents a node in the graph
//==============================================================================

function Node(url, neighborUrls) {
    // the node's url
    this.url = url;
    // a list of all the urls in the html of the page this node represents
    this.neighborUrls = neighborUrls;
    // whether the node has been expanded
    this.isExpanded = false;
}

module.exports = Node;
