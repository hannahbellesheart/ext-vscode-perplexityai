import * as vscode from 'vscode';
import getSidebarContent from '../ui/webviewSidebar';

export class Sidebar implements vscode.WebviewViewProvider {

    private _view?: vscode.WebviewView;

    private getWebviewContent() {
        return getSidebarContent(this._view!.webview);
    }
    // Publics 
    public static readonly viewType = 'perplexityChatView';
    public static model =  "sonar"; // Default model

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
        };

        webviewView.webview.html = this.getWebviewContent();


        webviewView.webview.onDidReceiveMessage((message) => {
            try {
                switch (message.command) {
                    case 'openChatWindow':
                        console.log('Opening Chat Window');
                        vscode.commands.executeCommand('perplexity-ext.openChatWindow');
                        return;
                    case "selectModel":
                        console.log("Selecting model: " + message.content);
                        Sidebar.model = message.content;
                        break;
                }
            } catch (err: any) {
                vscode.window.showErrorMessage(err.what());
            }
        });
    }


}