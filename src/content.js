const API_KEY = "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"
const API_URL = "https://api.openai.com/v1/chat/completions"

browser.runtime.onMessage.addListener((request) => {
    if (request.action === "generate") {
        var prompt = request.prompt;
        var resultText = request.resultText;

        generate(prompt, resultText);

    }
});

const generate = async (prompt, resultText) => {
    console.log(prompt);
    console.log(resultText);
    // Don't waste network bandwidth.
    if (!prompt) {
        alert("Enter a prompt!");
        return;
    }

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
                Authorization: `Bearer ${API_KEY}`
            },

            // The actual prompt being sent to OpenAI.
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                stream: true
            }),
            signal,
        });

        // Live-inputs the incoming tokens
        const reader = response.body.getReader();

        // Decoder required because the info is sent as bytes.
        const decoder = new TextDecoder("utf-8");

        resultText = "";
        browser.runtime.sendMessage({
            action: "setResultText",
            resultText: resultText
        });

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
                    browser.runtime.sendMessage({
                        action: "updateResultText",
                        resultText: content
                    });
                }
            }
        }

    } catch (e) {
        if (signal.aborted) {
            browser.runtime.sendMessage({
                action: "setResultText",
                resultText: "Aborted!"
            });
        } else {
            browser.runtime.sendMessage({
                action: "setResultText",
                resultText: "Error!"
            });
            console.error("Error: ", e)
        }
    } finally {
        // stopBtn.disabled = true;
        // generateBtn.disabled = false;
        controller = null;
    }
}
