const API_URL = "https://api.openai.com/v1/chat/completions";

browser.runtime.onMessage.addListener((request) => {
	switch (request.action) {
		case 'summarize':
			displaySummaryContainer(request.selectedText);
			break;
		case 'setResultText':
			document.getElementById("bb-result-text").innerText = request.resultText;
			break;
		case 'updateResultText':
			document.getElementById("bb-result-text").innerText += request.resultText;
			break;

		default:
			break;
	}
});

function displaySummaryContainer(text) {
  	reloadContainer();
	
	browser.storage.local.get('apiKey').then(function(result) {
		if (result.apiKey) {
			// load the summary container.
			
  			const newSummaryContainer = buildSummaryContainer();
  			document.body.appendChild(newSummaryContainer);
  			sendMessageToExtension(text);
		} else {
			// load prompt container.
			const newPromptContainer = buildPromptContainer();
			document.body.appendChild(newPromptContainer);
			
		}
	});

}

function buildPromptContainer() {
	const promptContainer = createElement('div', 'bb-prompt-container');
	const header = createHeader();
	const prompt = createPrompt();

	promptContainer.append(header, prompt);
	return promptContainer;
}

function createPrompt() {
	const promptContainer = createElement('div', 'bb-prompt-field-container');
  	const promptField = createElement('input', 'bb-prompt-field');
	const promptBtn = createElement('button', 'bb-prompt-btn');

	promptField.setAttribute('type', 'text');
  	promptContainer.appendChild(promptField);
  	
  	promptBtn.textContent = 'Submit';

  	promptBtn.addEventListener('click', () => {
    	const apiKey = promptContainer.querySelector('#bb-prompt-field').value;
    	browser.storage.local.set({"apiKey": apiKey});
  	});

	promptContainer.appendChild(promptBtn);
	return promptContainer;
}


function reloadContainer() {
  	const summaryContainer = document.getElementById('bb-summary-container');
	const promptContainer = document.getElementById('bb-prompt-container');
  	if (summaryContainer) {
    	summaryContainer.remove();
  	}
	if (promptContainer) {
		promptContainer.remove();
	}
}

function sendMessageToExtension(text) {
  browser.runtime.sendMessage({
    action: "API",
    text: text
  });
}

function buildSummaryContainer() {
	const summaryContainer = createElement('div', 'bb-summary-container');
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
  	const header = createElement('header', 'bb-header');
  	
	const heading = createElement('h2');
  	heading.textContent = 'Browser Buddy';
  	
	const exitBtn = createElement('button', 'bb-exit-btn');
  	exitBtn.textContent = 'X';

  	header.append(heading, exitBtn);
  	return header;
}

function createResultContainer() {
  	const resultContainer = createElement('div', 'bb-result-container');
  	const result = createElement('div', 'bb-result-text');
  	result.textContent = '';

  	resultContainer.appendChild(result);
  	return resultContainer;
}

function createFooter(resultContainer) {
  	const footer = createElement('footer', 'bb-footer');
  	const retryBtn = createElement('button', 'bb-retry-btn');
  	retryBtn.textContent = 'Retry';
  	const copyBtn = createElement('button', 'bb-copy-btn');
  	copyBtn.textContent = 'Copy';

  	copyBtn.addEventListener('click', () => {
    	const resultText = resultContainer.querySelector('#bb-result-text').textContent;
    	navigator.clipboard.writeText(resultText)
    		.then(() => console.log('Copied!'))
    		.catch((err) => console.error('Failed to copy:', err));
  	});

  	footer.append(retryBtn, copyBtn);
  	return footer;
}
