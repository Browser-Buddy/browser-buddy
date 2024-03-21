const API_URL = "https://api.openai.com/v1/chat/completions";

function injectFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);
}

browser.runtime.onMessage.addListener((request) => {
	switch (request.action) {
		case 'summarize':
			injectFontAwesome();
			displaySummaryContainer(request.selectedText);
			break;
		case 'setResultText':
			document.getElementById("bot-messages").innerText = request.resultText;
			break;
		case 'updateResultText':
			document.getElementById("bot-messages").innerText += request.resultText;
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
	//const header = createHeader();
	const prompt = createPrompt();

	promptContainer.append(/*header, */prompt);
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
	const summaryContainer = createElement('div', 'summary-container');
	const headerContainer = createHeaderContainer();
	const botContainer = createBotContainer();
	const footerContainer = createFooterContainer();
	
	summaryContainer.append(headerContainer, botContainer, footerContainer);
	return summaryContainer;
}

function createHeaderContainer() {
	const headerContainer = createElement('div', 'header-container');

	const headerTitleContainer = createElement('div', 'header-title-container');
	const headerTitle = createElement('span', 'header-text');
	headerTitle.innerText = 'Browser Buddy';
	headerTitleContainer.append(headerTitle);
	
	const actionBtnContainer = createElement('div', 'action-btn-container');
	
//	const exitBtnIcon = createElementWithClass('i', 'fa fa-close');
//	exitBtn.append(exitBtnIcon);

	const exitBtn = createElement('button', 'exit-btn');

	//const retryBtnIcon = createElementWithClass('i', 'fa fa-repeat');
	//retryBtn.appendChild(retryBtnIcon);

	const exitBtnIcon = document.createElement('i');
	exitBtnIcon.classList.add('fa');
	exitBtnIcon.classList.add('fa-close')

	exitBtn.appendChild(exitBtnIcon);

	exitBtn.addEventListener('click', () => {
		console.log('exit button clicked')
	});
	actionBtnContainer.append(exitBtn);

	headerContainer.append(headerTitleContainer);
	headerContainer.append(actionBtnContainer);

	return headerContainer;
}

function createBotContainer () {
	const botContainer = createElement('div', 'bot-container');
	const botMessages = createElement('div', 'bot-messages');
	botContainer.append(botMessages);

	return botContainer;
}

function createFooterContainer() {
	const footerContainer = createElement('div', 'footer-container');
	
	const retryBtn = createElement('button', 'retry-btn');

	retryBtn.innerText = 'Retry ';

	//const retryBtnIcon = createElementWithClass('i', 'fa fa-repeat');
	//retryBtn.appendChild(retryBtnIcon);

	const retryBtnIcon = document.createElement('i');
	retryBtnIcon.classList.add('fa');
	retryBtnIcon.classList.add('fa-repeat')

	retryBtn.appendChild(retryBtnIcon);

	retryBtn.addEventListener('click', () => {
		console.log('retry button clicked')
	});
	
	const copyBtn = createElement('button', 'copy-btn');

	copyBtn.innerText = 'Copy ';

	//const retryBtnIcon = createElementWithClass('i', 'fa fa-repeat');
	//retryBtn.appendChild(retryBtnIcon);

	const copyBtnIcon = document.createElement('i');
	copyBtnIcon.classList.add('fa');
	copyBtnIcon.classList.add('fa-copy')

	copyBtn.appendChild(copyBtnIcon);

	copyBtn.addEventListener('click', () => {
		console.log('copy button clicked')
	});

	footerContainer.append(retryBtn);
	footerContainer.append(copyBtn);

	return footerContainer;

}

function createButton(id, txt, icon, clickFunction) {

	const btn = createElement('button', id);
	btn.innerText = txt;
	const btnIcon = document.createElement('i');
	btnIcon.classList.add('fa');
	btnIcon.classList.add(icon)

	btn.append(btnIcon);
	
	btn.addEventListener('click', clickFunction);
}

//function createElementWithClass(tagName, className) {
//	const element = document.createElement(tagName);
//	if (className) element.classList.add(className);
//	return element;
//}

function createElement(tagName, id) {
  	const element = document.createElement(tagName);
  	if (id) element.id = id;
  	return element;
}


// OLD STUFF, KEEP IT FOR NOW BUT YKNOW
/*
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
*/
