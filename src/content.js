//==============================================================================
// For parsing the page for links when triggered
//==============================================================================

var Node = require('./node');

// get jquery
/*
var script = document.createElement('script');
script.src = '//code.jquery.com/jquery-1.11.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
*/

// a map of url to graph node
//var nodeMap = {};

//==============================================================================
// listen for incoming messages
//==============================================================================

// request contains parameters sent to the listener
// sender is an object containing the id of the plugin that sent the message - don't think this is relevant unless communicating with other plugins
// sendResponse is a function which returns a response to the function that send the message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('received message from background');
    if (request.command == 'webgraph') {
        // generate the graph
        //generateGraph(request.rootUrl);
        // respond to background... really not needed at this point... or ever
        sendResponse('test');
    }
});

//==============================================================================
// Graph construction
//==============================================================================

/*
function generateGraph(rootUrl) {
    // remove www if need be
    var url = getUrl(rootUrl);
    // get the urls from the active tab
    var urls = getUrls(document);
    // construct the root
    var root = new Node(url, urls);
    // add the root to the map
    nodeMap[url] = root;
    // expand the root to generate more of the graph
    expand(root, 1);
}

function expand(root, levelsToExpand) {
    // base cases
    if (levelsToExpand == 0) {
        return;
    }

    if (root.isExpanded) {
        return;
    }

    // set the root node as expanded
    root.isExpanded = true;

    // expand it by generating a new node for each neighbor url
    var urls = root.neighborUrls;
    for (var i = 0; i < urls.length; i++) {
        generateNode(urls[i], function(node) {
            if (!node.isExpanded) {
                expand(node, levelsToExpand - 1);
            }
        });
    }
}

function generateNode(url, cb) {
    // see if the graph already contains a node corresponding to this url
    if (nodeMap[url]) {
        cb(nodeMap[url]);
    }

    // no node has been generated
    $.ajax({
        url: url,
        success: function(html) {
            console.log(html);
            // parse the urls from the html string
            var urls = parseUrlsFromHtml(html);
            // add a new node to the nodeMap!!!
            var node = new Node(url, urls);
            nodeMap[url] = node;
            cb(node);
        }
    });
}

//==============================================================================
// Get urls from the active tab
//==============================================================================

function getUrls(document) {
    // get all the link elements in the document
    var linkElements = document.links;

    // collect the urls
    var urls = {};
    var href;
    var url;
    for (var i = 0; i < linkElements.length; i++) {
        href = linkElements[i].href;
        // get the url from the href, if the href is for a url
        url = getUrl(href);
        if (url) {
            urls[url] = true;
        }
    }

    // return just the urls as an array
    return Object.keys(urls);
}
*/

/**
 * We have an href. Could be a url or could be something else. If a url, could be
 * apple.com/iphone or www.apple.com/iphone. We want both these urls to be considered
 * the same, so we remove the www.
 */
 /*
function getUrl(href) {
    var re = /(?:https?:\/\/(www\.)?)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    var results = href.match(re);
    if (results) {
        var fullMatch = results[0];
        var parts = fullMatch.split('.');
        if (parts[0] == 'www') {
            // remove www
            return fullMatch.substring(4);
        }
        return fullMatch;
    }
    return null;
}

//==============================================================================
// HTML parsing
//==============================================================================

function parseUrlsFromHtml(html) {
    // create a dummy DOM object from the html string
    var elem = document.createElement('html');
    elem.innerHtml = html;
    return getUrls(elem);
}
*/

console.log('Content script loaded.');

// =END=
