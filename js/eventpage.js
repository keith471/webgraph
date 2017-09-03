//==============================================================================
// Listens for events and commands
//==============================================================================

console.log("this thing has loaded");

chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
});
