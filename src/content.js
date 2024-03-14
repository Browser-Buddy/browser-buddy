const API_URL = "https://api.openai.com/v1/chat/completions";

browser.runtime.onMessage.addListener((request) => {
	switch (request.action) {
		case 'summarize':
			displaySummaryContainer(request.selectedText);
			break;
		case 'setResultText':
			document.getElementById("result-text").innerText = request.resultText;
			break;
		case 'updateResultText':
			document.getElementById("result-text").innerText += request.resultText;
			break;

		default:
			break;
	}
});

function displaySummaryContainer(text) {
  removeSummaryContainer();
  const newSummaryContainer = buildSummaryContainer();
  document.body.appendChild(newSummaryContainer);
  sendMessageToExtension(text);
}

function removeSummaryContainer() {
  const summaryContainer = document.getElementById('summary-container');
  if (summaryContainer) {
    summaryContainer.remove();
  }
}

function sendMessageToExtension(text) {
  browser.runtime.sendMessage({
    action: "API",
    text: text
  });
}

function buildSummaryContainer() {
	const summaryContainer = createElement('div', 'summary-container');
	const header = createHeader();
	const resultContainer = createResultContainer();
	const footer = createFooter(resultContainer);

	summaryContainer.append(header, resultContainer, footer);
  	return summaryContainer;
}

function createElement(tagName, id) {
  	const element = document.createElement(tagName);
  	if (id) element.id = id;
  	return element;
}

function createHeader() {
  	const header = createElement('header', 'header');
  	
	const heading = createElement('h2');
  	heading.textContent = 'Browser Buddy';
  	
	const exitBtn = createElement('button', 'exit-btn');
  	exitBtn.textContent = 'X';

  	header.append(heading, exitBtn);
  	return header;
}

function createResultContainer() {
  	const resultContainer = createElement('div', 'result-container');
  	const result = createElement('div', 'result-text');
  	result.textContent = '';

  	resultContainer.appendChild(result);
  	return resultContainer;
}

function createFooter(resultContainer) {
  	const footer = createElement('footer', 'footer');
  	const retryBtn = createElement('button', 'retry-btn');
  	retryBtn.textContent = 'Retry';
  	const copyBtn = createElement('button', 'copy-btn');
  	copyBtn.textContent = 'Copy';

  	copyBtn.addEventListener('click', () => {
    	const resultText = resultContainer.querySelector('#result-text').textContent;
    	navigator.clipboard.writeText(resultText)
    		.then(() => console.log('Copied!'))
    		.catch((err) => console.error('Failed to copy:', err));
  	});

  	footer.append(retryBtn, copyBtn);
  	return footer;
}
