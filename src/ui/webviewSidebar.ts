import * as vscode from 'vscode';
import { PerplexityModels } from '../util/models';
import { getNonce } from '../util/utils';

export default function getSidebarContent(webview: vscode.Webview): string {

    const nonce: string = getNonce();

    const html = /*html*/`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="
            default-src 'none';
            style-src ${webview.cspSource} 'unsafe-inline';
            font-src ${webview.cspSource};
            script-src 'nonce-${nonce}' ${webview.cspSource};
        ">
        
        <style>
            * {
                font-size: 18px;
                font-family: var(--vscode-editor-font-family);
            }
            body { 
                margin: 0;
                padding: 20px;
                height: 100%;
                width: 100%; 
                display: flex;
                flex-direction: column;
                gap: 20px;
                background-color: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                box-sizing: border-box;      /* Added for proper sizing */
            }
    
            .input-container {
                gap: 10px;
                height: fit-content;
            }
        
            #send-button {
                width: 100%;
                padding: 10px 20px;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                cursor: pointer;
                transition: opacity 0.2s;
                align-self: flex-end;
                height: fit-content;
            }
    
            #send-button:hover {
                opacity: 0.8;
            }

            select {
                padding: 10px 20px;
                border: none;
                width: 100%;
                background-color: var(--vscode-input-background);
                color: var(--vscode-editor-foreground); 
            }

            select:focus {
                outline: none;
            }
        </style>
    </head>
    <body>

            <h1>Perplexity Chat</h1>

            <h3> Click the button below to open the chat window </h3>
            <button id="send-button">Open Chat Window</button>

            <h3>  Select your preferred model </h3>
            <select name="Model" id="model-selector" required>
                ${PerplexityModels.map(element => {
                    console.log("Loaded model " + element);
                    return '<option value=' + element + '>' + element + '</option>';
                }).join('')}
            </select>
    

            <script nonce="${nonce}"> 
                
                const vscode = acquireVsCodeApi();
                const button  = document.getElementById('send-button');
                
                button.addEventListener('click', () => {
                    vscode.postMessage({
                        command: 'openChatWindow'
                    });
                });


                // Send message to the parent window once the user selects a model
                const dropdown = document.getElementById('model-selector');
                dropdown.addEventListener('change', (e) => {
                    vscode.postMessage({
                            command: 'selectModel',
                            content: e.target.value
                    });
                });

            </script>
    </body>
    </html>
    `;

    return html;
}

