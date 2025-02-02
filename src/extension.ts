// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import getWebviewContent from './webviewContent';
import sendMessageToPerplexity from './perplexity';

export function activate(context: vscode.ExtensionContext) {


	// Allow the user to set the API token for the perplexity API
	vscode.commands.registerCommand('perplexity-ext.setAPIToken', () => {

		vscode.window.showInputBox({
			prompt: 'Enter your API key',
			placeHolder: 'e.g. pplx-...1234',
			title: 'Set API Key for Perplexity'
		}).then(async (apiKey) => {
			if (apiKey) {
				await context.secrets.store("perplexity-ext.apiKey", apiKey);
			} else {
				vscode.window.showErrorMessage("No API Token Provided!");
			}
		});
	});

	const disposableChatWindow = vscode.commands.registerCommand('perplexity-ext.openChatWindow', async () => {

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
		panel.webview.onDidReceiveMessage(async message => {
			if (!apiKey) {
				vscode.window.showErrorMessage("API key not configured");
			} else {
				switch (message.command) {
					case 'submit':
						try {
							await sendMessageToPerplexity(message.text, model, apiKey, panel.webview.postMessage.bind(panel.webview));
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
				}
			}
		}, undefined, context.subscriptions);



		panel.webview.html = getWebviewContent(panel.webview);
	});

	context.subscriptions.push(disposableChatWindow);

}

export function deactivate() { }
