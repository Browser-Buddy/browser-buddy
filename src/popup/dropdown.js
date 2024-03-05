// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const prompt = document.getElementById("input");
    const generateBtn = document.getElementById("generate-btn");
    const stopBtn = document.getElementById("stop-btn");
    const resultText = document.getElementById("result");

    browser.runtime.onMessage.addListener((request) => {
        if (request.action === "setResultText") {
            resultText.innerText = request.resultText;
        }
    });

    browser.runtime.onMessage.addListener((request) => {
        if (request.action === "updateResultText") {
            // Append the updated resultText to the resultElement
            resultText.innerText += request.resultText;
        }
    });

    generateBtn.addEventListener('click', function() {

        var promptValue = prompt.value;
        var resultTextValue = resultText.innerText;

        resultTextValue = "Generating...";

        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            var activeTab = tabs[0];
            browser.tabs.sendMessage(activeTab.id, {
                action: "generate",
                prompt: promptValue,
                resultText: resultTextValue
            });
        });
    });
});

