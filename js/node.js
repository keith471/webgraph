//==============================================================================
// Represents a node in the graph
//==============================================================================

export default function Node(url, neighbors) {
    // the node's url
    this.url = url;
    // a list of all the Node's neighboring Nodes
    this.neighbors = neighbors;
    // whether the node is a leaf
    this.isLeaf = false;
}
