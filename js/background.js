//==============================================================================
// Listens for events and commands
//==============================================================================

chrome.commands.getAll(function(commands) {
    console.log(commands);
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'webgraph') {
        // get the id of the active tab
        chrome.tabs.query({currentWindow: true, active : true}, function(tabs) {
            console.log(tabs);
            if (tabs.length != 1) {
                console.log('Make sure you\'ve seleced a chrome tab');
                return;
            }
            // we have a single, active tab - send a message to the content script
            // the second parameter is passed to the listener as the 'request' parameter (first one)
            chrome.tabs.sendMessage(tabs[0].id, { command: 'webgraph' }, function(response) {
                console.log('Content script response:' + response);
            });
        });
    } else {
        console.log('user gave some command we don\'t yet support');
    }
});

console.log('Background script loaded.');
