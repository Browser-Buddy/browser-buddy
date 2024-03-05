// background.js

// Listen for a message from the content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
 // Log the message to the console
 console.log(request);
});

// Create a new selection within the context menu
// Currently, prints grabbed text to the console
browser.menus.create( 
    {
        id: "log-selection",
        title: "Log % to console",
        contexts: ["selection"],
    }
);

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "log-selection") {
        console.log(info.selectionText);
    }
})



