//==============================================================================
// For parsing the page for links when triggered
//==============================================================================

// listen for incoming messages
// request is
// sender is an object containing the id of the plugin that sent the message - don't think this is relevant unless communicating with other plugins
// sendResponse is a function which returns a response to the function that send the message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    console.log(sendResponse);
    if (request.command == 'webgraph') {
        // parse the html to get all the urls!
        var urls = getUrls();
        console.log(urls.length);
        console.log(urls[0]);
        console.log(urls[1]);
        // respond to background... really not needed at this point... or ever
        sendResponse('eat shit');
    } else if (request.action == 'getSource') {

    }
});

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



// junk....

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
