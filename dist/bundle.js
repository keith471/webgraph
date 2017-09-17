/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//==============================================================================
// For parsing the page for links when triggered
//==============================================================================

var Node = __webpack_require__(1);

console.log(Node);

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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map