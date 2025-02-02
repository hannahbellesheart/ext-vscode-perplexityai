import * as vscode from 'vscode';

export default function getWebviewContent(webview: vscode.Webview): string {

    function getNonce(): string {
        let nonce = '';
        const possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 32; i++) {
            nonce += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return nonce;
    }

    const nonce: string = getNonce();

    const html = /*html*/`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" 
              content="default-src 'none'; 
                      style-src ${webview.cspSource} 'unsafe-inline'; 
                      script-src 'nonce-${nonce}';">
        <style>
            body {
                margin: 0;
                padding: 20px;
                height: calc(100dvh - 40px); /* Fixed calculation syntax */
                width: calc(100dvw - 40px);  /* Fixed calculation syntax */
                display: flex;               /* Removed quotes */
                flex-direction: column;      /* Removed quotes */
                gap: 20px;
                background-color: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                box-sizing: border-box;      /* Added for proper sizing */
            }
    
            #response-container {
                flex: 1;
                overflow-y: auto;
                background-color: var(--vscode-editorWidget-background);
                border: 1px solid var(--vscode-editorWidget-border);
                border-radius: 4px;
                padding: 15px;
                min-height: 100px;
            }
    
            .input-container {
                flex: 0 0 auto;
                display: flex;
                gap: 10px;
                height: fit-content;
            }
    
            #code-input { 
                flex: 1;
                padding: 15px;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-family: var(--vscode-editor-font-family);
                font-size: 14px;
                border-radius: 3px;
                resize: vertical;
                min-height: 50px;
                box-sizing: border-box;
            }
    
            #send-button {
                width: 100px; 
                padding: 10px 20px;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 3px;
                cursor: pointer;
                transition: opacity 0.2s;
                align-self: flex-end;
                height: fit-content;
            }
    
            #send-button:hover {
                opacity: 0.8;
            }
    
            #send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
    
            .response-text {
                white-space: pre-wrap;
                line-height: 1.5;
                font-family: var(--vscode-editor-font-family);
            }
    
            .typing-cursor {
                display: inline-block;
                width: 8px;
                background: var(--vscode-editor-foreground);
                animation: blink 1s step-end infinite;
            }
    
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        </style>
    </head>
    <body>
        <div id="response-container">
            <div id="response-text" class="response-text"></div>
        </div>
    
        <div class="input-container">
            <textarea 
                id="code-input" 
                placeholder="Enter your code question..."
                spellcheck="false"
            ></textarea>
            <button id="send-button" disabled>
                Send
            </button>
        </div>
    
        <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const input = document.getElementById('code-input');
        const button = document.getElementById('send-button');
        const responseText = document.getElementById('response-text');
        let cursorElement = null;

        // Handle input validation
        input.addEventListener('input', () => {
            button.disabled = input.value.trim().length === 0;
        });

        // Handle Enter key (Shift+Enter for newline)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Send message to extension
        button.addEventListener('click', sendMessage);

        function sendMessage() {
            const message = input.value.trim();
            if (message) {
                vscode.postMessage({
                    command: 'submit',
                    text: message
                });
                input.value = '';
                button.disabled = true;
            }
        }

        window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.command) {
                // Create text node for safe HTML escaping
                const responseText = document.getElementById("response-text"); 
                responseText.innerText += message.content; 
            }
        });		
        </script>
    </body>
    </html>
    `;

    return html;
}

