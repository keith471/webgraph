//==============================================================================
// For parsing the page for links when triggered
//==============================================================================

//var request = require('request');
var http = require('http');
var Node = require('./node');

// the map of url to graph node
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
        // generate the graph
        generateGraph(request.rootUrl);
        // respond to background... really not needed at this point... or ever
        sendResponse('test');
    }
});

//==============================================================================
// Graph construction
//==============================================================================

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
    expand(root, 1);
}

/**
 * This is where the magic happens. Recursively expands the graph outwards from
 * the root up to levelsToExpand.
 */
function expand(root, levelsToExpand) {
    // base cases
    if (levelsToExpand == 0) {
        return;
    }

    if (root.isExpanded) {
        // we've already expanded a node with the same url
        return;
    }

    // we mark the node as expanded before completing expansion because one of its
    // links could loop back to the current node and attempt to reexpand it
    root.isExpanded = true;

    // expand the node by generating a new node for each neighbor url
    var urls = root.neighborUrls;
    for (var i = 0; i < urls.length; i++) {
        generateNode(urls[i], function(err, node) {
            if (err) {
                // an error occurred generating the node, e.g. a 404 response was received
                return;
            }
            // recursively expand the new node
            expand(node, levelsToExpand - 1);
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
            var err = new Error(`Request Failed. Status Code: ${statusCode}`);
            console.log(err.message);
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
            console.log(`received chunk ${count} for ${url}`);
        });

        // done collecting data
        res.on('end', () => {
            //console.log(`Body:\n${rawData}`);
            console.log(`done collecting chunks for ${url}`);
            // parse the urls from the html string
            var urls = parseUrlsFromHtml(rawData);
            // add a new node to the nodeMap!!!
            var node = new Node(url, urls);
            nodeMap[url] = node;
            cb(null, node);
        });
    }).on('error', (e) => {
        var err = new Error(`Request failed due to error ${e.message}`);
        console.log(err.message);
        cb(err);
    });

    /*
    request(url, function(err, response, body) {
        if (err) {
            cb(err);
            return;
        }

        if (response.statusCode != 200) {
            cb(response);
            return;
        }

        // successful get request
        // parse the urls from the html string
        var urls = parseUrlsFromHtml(body);
        // add a new node to the nodeMap!!!
        var node = new Node(url, urls);
        nodeMap[url] = node;
        cb(null, node);
    });
    */
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
