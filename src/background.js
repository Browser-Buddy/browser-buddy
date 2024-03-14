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

	let newPrompt = "Bullet point this information into an easy to read list: " + prompt;

	console.log(newPrompt);

	let API_URL = "https://api.openai.com/v1/chat/completions"
	let API_KEY = browser.storage.local.get('apiKey');
	let whatever = "api key :)"
    // UI stuff, also avoid someone spamming generate until a
    // response is completed.
    // generateBtn.disabled = true;

    // stopBtn.disabled = false;

    controller = new AbortController();
    const signal = controller.signal;

    // Perform the fetch
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${whatever}`
            },
			// swag
            // The actual prompt being sent to OpenAI.:
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: newPrompt
                }],
                stream: true
            }),
            signal,
        });

        // Live-inputs the incoming tokens
        const reader = response.body.getReader();

        // Decoder required because the info is sent as bytes.
        const decoder = new TextDecoder("utf-8");

		browser.tabs.query({active: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "setResultText",
				resultText: resultText
			});
		});
		console.log("set resultText to nothing");
        while (true) {
            const chunk = await reader.read();
            const {done, value} = chunk;
            if (done) {
                break;
            }
            const decodedChunk = decoder.decode(value);

            // Removing the irrelevant information
            const lines = decodedChunk.split("\n");
            const parsedLines = lines
                .map(line => line.replace(/^data: /, "").trim())
                .filter(line => line !== "" && line !== "[DONE]")
                .map(line => JSON.parse(line));

            for (const line of parsedLines) {

                // Dereferencing hell
                const {choices} = line;
                const {delta} = choices[0];
                const {content} = delta;
                if (content) {
                    console.log(content);

					browser.tabs.query({active: true}, function(tabs) {
						chrome.tabs.sendMessage(tabs[0].id, {
							action: "updateResultText",
							resultText: content
						});
					});		
                }
            }
        }

    } catch (e) {
        if (signal.aborted) {
			browser.runtime.sendMessage({
				action: "setResultText",
				resultText: "Aborted."
			});
        } else {
			console.log(e.message)
			browser.tabs.query({active: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "setResultText",
					resultText: "Failure."
				})
			});
			//browser.runtime.sendMessage({
			//	action: "setResultText",
			//	resultText: "Failure."
			//});
		}
    } finally {
        // stopBtn.disabled = true;
        // generateBtn.disabled = false;
        controller = null;
    }
}
