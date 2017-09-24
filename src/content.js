//==============================================================================
// For parsing the page for links when triggered
//==============================================================================

//var request = require('request');
var http = require('http');
var Node = require('./node');
var ExpansionStatus = require('./expansionStatus');
var NodeGenerationError = require('./error').NodeGenerationError;

// Run all the following logic on page load

// this is our representation of the webgraph - a map of url to graph node
var nodeMap = undefined;

// whether the graph is currently being displayed or not
var inWgMode = false;

// make a div the parent of all the body's children, and make the div the child of the body
var nativeDiv = document.createElement('div');
// TODO: it is possible that the html already contains an element with this id
nativeDiv.id = 'native';
// Move the body's children into the nativeDiv
while (document.body.firstChild) {
    nativeDiv.appendChild(document.body.firstChild);
}
document.body.appendChild(nativeDiv);

// Inject the React div into the html
var wgDiv = document.createElement('div');
// TODO: it is possible that the html already contains an element with this id
wgDiv.id = 'wg';
wgDiv.style.display = 'none';
var p = document.createElement('p');
var text = document.createTextNode('This is a test');
p.appendChild(text);
wgDiv.appendChild(p);
document.body.appendChild(wgDiv);

//==============================================================================
// listen for incoming messages
//==============================================================================

// request contains parameters sent to the listener
// sender is an object containing the id of the plugin that sent the message - don't think this is relevant unless communicating with other plugins
// sendResponse is a function which returns a response to the function that send the message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('received message from background');
    if (request.command == 'webgraph') {
        // toggle the webgraph
        toggleWebgraph();

        // if we haven't already generated the graph, then generate it
        if (nodeMap == undefined) {
            nodeMap = {};
            // generate the graph
            generateGraph(request.rootUrl);
        }

        // respond to background... really not needed at this point... or ever
        sendResponse('message received');
    }
});

// switch between showing the webgraph and the original webpage
function toggleWebgraph() {
    if (inWgMode) {
        // hide the webgraph
        wgDiv.style.display = 'none';
        nativeDiv.style.display = 'block';
    } else {
        // show the webgraph
        nativeDiv.style.display = 'none';
        wg.style.display = 'block';
    }
    inWgMode = !inWgMode;
}

//==============================================================================
// Graph construction
//==============================================================================

/**
 * This function is called when expansion for a node has completed
 * We define "completed" as "a Node has been created for each url in the current node's html"
 */
function expansionComplete(node, expansionStatus, results) {
    switch (expansionStatus) {
        case ExpansionStatus.ALREADY_EXPANDED:
            //console.log(`Node for {${node.url}} already expanded`);
            break;
        case ExpansionStatus.AT_EXPANSION_LIMIT:
            //console.log(`Node for {${node.url}} at expansion limit`);
            break;
        case ExpansionStatus.EXPANDED:
            console.log(`Node for {${node.url}} FULLY EXPANDED`);
            break;
        case ExpansionStatus.NOTHING_TO_EXPAND:
            //console.log(`Node for {${node.url}} has nothing to expand`);
            break;
    }
}

/**
 * Starts generation of the graph, rooting it at the url of the current page
 */
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
    expand(root, 1, expansionComplete);
}

/**
 * This is where the magic happens. Recursively expands the graph outwards from
 * the root up to levelsToExpand.
 */
function expand(root, levelsToExpand, cb) {
    // base cases
    if (levelsToExpand == 0) {
        cb(root, ExpansionStatus.AT_EXPANSION_LIMIT);
        return;
    }

    if (root.isExpanded) {
        // we've already expanded a node with the same url
        cb(root, ExpansionStatus.ALREADY_EXPANDED);
        return;
    }

    // we mark the node as expanded before completing expansion because one of its
    // links could loop back to the current node and attempt to reexpand it
    root.isExpanded = true;

    // expand the node by generating a new node for each neighbor url
    var urls = root.neighborUrls;
    var results = {};
    var count = 0;
    var numUrls = urls.length;

    if (numUrls == 0) {
        cb(root, ExpansionStatus.NOTHING_TO_EXPAND);
        return;
    }

    for (var i = 0; i < urls.length; i++) {
        generateNode(urls[i], function(err, node) {
            if (err) {
                // an error occurred generating the node, e.g. a 404 response was received
                results[err.url] = err;
            } else {
                results[node.url] = node;
                // recursively expand the new node
                expand(node, levelsToExpand - 1, expansionComplete);
            }
            // increment the count of nodes generated
            count++;
            if (count == numUrls) {
                // we've fully expanded the 'root' - let the caller know
                cb(root, ExpansionStatus.EXPANDED, results);
            }
        });
    }
}

function generateNode(url, cb) {
    // see if the graph already contains a node corresponding to this url
    if (nodeMap[url]) {
        cb(null, nodeMap[url]);
    }

    // generate a node for this url
    http.get(url, (res) => {
        if (res.statusCode !== 200) {
            var err = new NodeGenerationError(url, `Request Failed. Status Code: ${statusCode}`);
            console.log(err.message + ` {${url}}`);
            cb(err);
            return;
        }

        res.setEncoding('utf8');

        // collect the data returned to us
        var rawData = '';
        var count = 0;
        res.on('data', (chunk) => {
            rawData += chunk;
            count++;
            //console.log(`received chunk ${count} for ${url}`);
        });

        // done collecting data
        res.on('end', () => {
            //console.log(`Body:\n${rawData}`);
            //console.log(`done collecting chunks for ${url}`);
            // parse the urls from the html string
            var urls = parseUrlsFromHtml(rawData);
            // add a new node to the nodeMap!!!
            var node = new Node(url, urls);
            nodeMap[url] = node;
            cb(null, node);
        });
    }).on('error', (e) => {
        var err = new NodeGenerationError(url, `Request failed due to error ${e.message}`);
        console.log(err.message + ` {${url}}`);
        cb(err);
    });
}

//==============================================================================
// Get urls from a DOM object
//==============================================================================

function getUrls(document) {
    // get all the link elements in the document
    var linkElements = document.links;
    if (linkElements == null) {
        return [];
    }

    console.log(`Url count: ${linkElements.length}`);

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
    var urlsAsArray = Object.keys(urls);
    for (var i = 0; i < urlsAsArray.length; i++) {
        console.log(urlsAsArray[i]);
    }
    return Object.keys(urls);
}

/**
 * We have an href. Could be a url or could be something else. If a url, could be
 * apple.com/iphone or www.apple.com/iphone. We want both these urls to be considered
 * the same, so we remove the www.
 */
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

console.log('Content script loaded.');

// =END=
