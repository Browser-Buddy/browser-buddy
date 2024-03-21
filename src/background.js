browser.contextMenus.create({
	id: "summarize",
	title: "Summarize",
	contexts: ["selection"],
});

browser.contextMenus.onClicked.addListener((info) => {
	if (info.menuItemId === "summarize") {
		browser.tabs.query({active: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "summarize",
				selectedText: info.selectionText 
			});
		});	
	}
});

browser.runtime.onMessage.addListener((request) => {
	if(request.action === 'API') {
		let prompt = request.text;
		generate(prompt);
	}	
});

const generate = async (prompt) => {
	var resultText = "";

    // Don't waste network bandwidth.
    if (!prompt) {
        alert("Enter a prompt!");
        return;
    }

	let newPrompt = "Make the following text significantly shorter: " + prompt;

	console.log(newPrompt);

	let API_URL = "https://api.openai.com/v1/chat/completions"
	let API_KEY = await browser.storage.local.get('apiKey');
	console.log(API_KEY);

	browser.tabs.query({active: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "setResultText",
					resultText: "Generating..."
				})
			});

    // Perform the fetch
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY.apiKey}`
            },
            // The actual prompt being sent to OpenAI.:
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: newPrompt
                }]
            }),
        });
		const data = await response.json();
		browser.tabs.query({active: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "setResultText",
					resultText: data.choices[0].message.content
				})
			});
    } catch (e) {
			console.log(e.message)
			browser.tabs.query({active: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "setResultText",
					resultText: "Failure."
				})
			});
    }
}
