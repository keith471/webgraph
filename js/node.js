//==============================================================================
// Represents a node in the graph
//==============================================================================

function Node(url, neighbors) {
    // the nodes url
    this.url = url;
    // a list of all the Node's neighboring Nodes
    this.neighbors = neighbors;
}
