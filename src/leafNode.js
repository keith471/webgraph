//==============================================================================
// A leaf in the graph (a node that has yet to be expanded)
//==============================================================================

import Node from ./node.js;

export default function LeafNode(url, neighborUrls) {
    this.url = url;
    this.neighborUrls = neighborUrls;
    this.isLeaf = true;
}

// inherit from Node
LeafNode.prototype = Object.create(Node.prototype);
LeafNode.prototype.constructor = Node;
