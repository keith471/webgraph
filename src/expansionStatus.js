//==============================================================================
// Expansion statuses
//==============================================================================

module.exports = Object.freeze({
    ALREADY_EXPANDED: 0,    // the node has already been expanded
    AT_EXPANSION_LIMIT: 1,  // the node is at the edge of the expansion limit of the graph (i.e. simply at the edge of the graph - where we chose to stop expanding)
    EXPANDED: 2,            // the node has just been expanded
    NOTHING_TO_EXPAND: 3    // the node's html contains no links
});
