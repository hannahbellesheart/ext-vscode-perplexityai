// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import getWebviewContent from './ui/webviewContent';
import sendMessageToPerplexity from './util/perplexity';
import { PerplexityMessage } from './util/perplexity';
export function activate(context: vscode.ExtensionContext) {


	// Allow the user to set the API token for the perplexity API
	vscode.commands.registerCommand('perplexity-ext.setAPIToken', () => {

		vscode.window.showInputBox({
			prompt: 'Enter your API key',
			placeHolder: 'e.g. pplx-...1234',
			title: 'Set API Key for Perplexity'
		}).then(async (apiKey?: string) => {
			if (apiKey) {
				await context.secrets.store("perplexity-ext.apiKey", apiKey);
			} else {
				vscode.window.showErrorMessage("No API Token Provided!");
			}
		});
	});

	const disposableChatWindow = vscode.commands.registerCommand('perplexity-ext.openChatWindow', async () => {

		let messageContext: PerplexityMessage[] = [];

		let model = "sonar"; 

		const panel = vscode.window.createWebviewPanel(
			'perplexity',
			'Perplexity Chat',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [context.extensionUri],
				retainContextWhenHidden: true
			}
		);


		const apiKey = await context.secrets.get("perplexity-ext.apiKey");



		// If the rendered page is sending a message, we check what type of message it is (In this case it can only be "submit") so we go ahead and call sendMessageToPerplexity in order to get the response from the API. 
		panel.webview.onDidReceiveMessage(async (message: {
			context: PerplexityMessage,
			content: string, 
			command: string, 
			prompt?: string, 
			response?: string
		}) => {
			if (!apiKey) {
				vscode.window.showErrorMessage("API key not configured");
			} else {
				switch (message.command) {
					case 'submit':
						try {
							await sendMessageToPerplexity(message.content, messageContext, model, apiKey, panel.webview.postMessage.bind(panel.webview));
						} catch (error) {
							panel.webview.postMessage({
								command: 'error',
								error: (error as Error).message
							});
						}
						break; 
					case "selectModel": 
						console.log("Selecting model: " + message.content); 
						model = message.content; 
						break; 
					case "webviewError": 
						console.error(message.content); 
						break;
					case "setContext": 
						// messageContext.push(message.context);
						
						// If we receive the setContext signal from the embedded window, we set the previous user prompt and assistant response in the message history 
						console.log("Setting context: " + message.response);
						const previousUserPrompt: PerplexityMessage = {
							role: "user", 
							content: message.prompt ?? "NO PROMPT"
						};
						
						const previousAiResponse: PerplexityMessage = {
							role: "assistant", 
							content: message.response ?? "NO RESPONSE"
						};
						messageContext.push(previousUserPrompt); 
						messageContext.push(previousAiResponse); 

						// Add limit of 16 total messages to not use up too many tokens 

						if(messageContext.length > 16) {
							messageContext.shift(); 
							messageContext.shift(); 
						}

						console.log(messageContext);
				}
			}
		}, undefined, context.subscriptions);



		panel.webview.html = getWebviewContent(panel.webview);
	});

	context.subscriptions.push(disposableChatWindow);

}

export function deactivate() { }
