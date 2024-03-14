const API_URL = "https://api.openai.com/v1/chat/completions";

browser.runtime.onMessage.addListener((request) => {
	if (request.action === "summarize") {
		displaySummaryContainer(request.selectedText);
	}
});

browser.runtime.onMessage.addListener((request) => {
	if (request.action === "setResultText") {
		document.getElementById("result-text").innerText = request.resultText;
	}	
});

browser.runtime.onMessage.addListener((request) => {
	if (request.action === "updateResultText") {
		document.getElementById("result-text").innerText += request.resultText;
	}	
});

function displaySummaryContainer(text) {
	let summaryContainer = document.getElementById('summary-container');

	if (summaryContainer) {
		summaryContainer.remove();
	}

	const newSummaryContainer = buildSummaryContainer();
	document.body.appendChild(newSummaryContainer);
	browser.runtime.sendMessage({
		action: "API",
		text: text
	});
}

function buildSummaryContainer() {
	const summaryContainer = document.createElement('div');
	summaryContainer.id = 'summary-container';

	const header = document.createElement('header');
	header.id = 'header';

	const heading = document.createElement('h2');
	heading.textContent = 'Browser Buddy';

	const exitBtn = document.createElement('button');
	exitBtn.id = 'exit-btn';
	exitBtn.textContent = 'X';

	header.appendChild(heading);
	header.appendChild(exitBtn);

	const resultContainer = document.createElement('div');
	resultContainer.id = 'result-container'

	const result = document.createElement('div');
	result.id = 'result-text';
	result.textContent = "";

	resultContainer.appendChild(result);

	const footer = document.createElement('footer');
	footer.id = 'footer';

	const retryBtn = document.createElement('button');
	retryBtn.id = 'retry-btn';
	retryBtn.textContent = 'Retry';

	const copyBtn = document.createElement('button');
	copyBtn.id = 'copy-btn';
	copyBtn.textContent = 'Copy';

	footer.appendChild(retryBtn);
	footer.appendChild(copyBtn);

	summaryContainer.appendChild(header);
	summaryContainer.appendChild(resultContainer);
	summaryContainer.appendChild(footer);

	return summaryContainer;
}

