//==============================================================================
// For parsing the page for links when triggered
//==============================================================================

import Node from ./node.js;
import LeafNode from ./leafNode.js;

// a map of url to graph node
var nodeMap = {};

//==============================================================================
// listen for incoming messages
//==============================================================================

// request contains parameters sent to the listener
// sender is an object containing the id of the plugin that sent the message - don't think this is relevant unless communicating with other plugins
// sendResponse is a function which returns a response to the function that send the message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('received message from background');
    if (request.command == 'webgraph') {
        // parse the html to get all the urls!
        var urls = getUrls();
        // construct the webgraph from the urls
        getRoot(request.rootUrl, urls, function(rootNode) {
            console.log('we have the root!');
            // add the root to the nodeMap
            nodeMap[request.rootUrl] = rootNode;
            // TODO use the root node to build the ui.....
            console.log('now we need to build the ui from the root...');
            // respond to background... really not needed at this point... or ever
            sendResponse(rootNode);
        });
    }
});

//==============================================================================
// Graph construction
//==============================================================================

// get the root node of the graph (we root the graph at the url of the active tab)
function getRoot(rootUrl, urls, cb) {
    if (urls.length == 0) {
        cb(new Node(rootUrl, []));
        return;
    }
    // we extend the graph one bfs from the root
    var level = 1;
    // construct the neighbors of the root
    var neighbors = [];
    // count the number of neighbors we've made
    var count = 0;
    for (var i = 0; i < urls.length; i++) {
        getNode(urls[i], level - 1, function(node) {
            // add the node to neighbors
            neighbors.push(node);
            // don't forget to add the node to the nodeMap!
            nodeMap[node.url] = node;
            // use count hack in place of async module...figure out how to use npm modules with chrome extensions
            // is there a race condition here?? js is single threaded but how does it context switch between async function returns?
            count++;
            if (count == urls.length) {
                // construct and return the root via the callback
                cb(new Node(rootUrl, neighbors));
            }
        });
    }
}

function getNode(url, level, cb) {
    // see if the graph already contains a node corresponding to this url, and if so return that node
    if (map[url]) {
        cb(map[url]);
    }

    // fetch the html for the url and, IN THE CALLBACK of the html fetcher, do the following
    $.ajax({
        url: url,
        success: function(html) {
            console.log(html);
            // TODO get the urls from the html
            var urls = [];
            if (level == 0) {
                // create and return a leaf node
                cb(new LeafNode(url, urls));
            } else {
                if (urls.length == 0) {
                    cb(new Node(url, []));
                    return;
                }
                var neighbors = [];
                var count = 0;
                for (var i = 0; i < urls.length; i++) {
                    getNode(urls[i], level - 1, function(node) {
                        neighbors.push(node);
                        nodeMap[node.url] = node;
                        // race condition?
                        count++;
                        if (count == urls.length) {
                            cb(new Node(url, neighbors));
                        }
                    });
                }
            }
        }
    });
}

//==============================================================================
// Get urls from the active tab
//==============================================================================

function getUrls() {
    // get all the link elements in the document
    var linkElements = document.links;

    // collect the urls
    var urls = {};
    var href;
    for (var i = 0; i < linkElements.length; i++) {
        href = linkElements[i].href;
        // not all links have hrefs and not all hrefs are urls
        if (href && isUrl(href) && !urls[href]) {
            urls[href] = true;
        }
    }

    // return just the urls as an array
    return Object.keys(urls);
}

function isUrl(href) {
    // match all http/https/www sites
    var re = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return href.match(re);
}



//==============================================================================
// junk....
//==============================================================================

// never find a node with type ATTRIBUTE_NODE for some reason...
function getLinksFromDocument(root) {
    var links = [],
        node  = root.firstChild;
    while (node) {
        if (node.nodeType == Node.ATTRIBUTE_NODE) {
            console.log('here3');
            if (node.nodeName == 'href') {
                console.log('here4');
                console.log(node.nodeValue);
            }
        }
    }
}

// could do this and then search string for urls, but string will be very long...
function domToString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

console.log('Content script loaded.');

// END
