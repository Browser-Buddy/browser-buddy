// background.js

// Listen for a message from the content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
 // Log the message to the console
 console.log(request);
});



