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
        <meta http-equiv="Content-Security-Policy" content="
            default-src 'none';
            script-src 'nonce-${nonce}' https://cdn.jsdelivr.net;
            style-src ${webview.cspSource} 'unsafe-inline';
            font-src ${webview.cspSource};
        ">
        
        <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js" integrity="sha256-OMcKHnypGrQOLZ5uYBKYUacX7Rx9Ssu91Bv5UDeRz2g=" crossorigin="anonymous"></script>        
        <style>
            * {
                font-size: 18px;
            }
            body { 
                margin: 0;
                padding: 20px;
                height: calc(100dvh - 40px); /* Fixed calculation syntax */
                width: calc(100dvw - 40px);  /* Fixed calculation syntax */
                display: flex;
                flex-direction: column;
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
                min-height: 450px;
            }
    
            .input-container {
                gap: 10px;
                height: fit-content;
            }
    
            #user-input { 
                flex: 1;
                padding: 15px;
                width: 100%;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-family: var(--vscode-editor-font-family);
                border-radius: 3px;
                resize: vertical;  /* Allows vertical resizing only */
                min-height: 100px; /* Minimum height */
                max-height: 70vh;  /* Maximum height (70% of viewport height) */
                overflow-y: auto;  /* Show scrollbar when content exceeds height */                box-sizing: border-box;
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
            select {
                padding: 10px;
                border: none;
                border-radius: 4px;
                width: 200px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-editor-foreground); 
            }

            select:focus {
                outline: none;
            }

            #sources {
                overflow: auto; 
                max-height: 20dvh; 
                margin-top: 15px;
                border-top: 1px solid var(--vscode-editorWidget-border);
                padding-top: 10px;
                font-size: 0.9em;
            }

            #sources div {
                margin: 5px 0;
                padding-left: 15px;
                position: relative;
            }

            #sources div::before {
                position: absolute;
                left: 0;
                color: var(--vscode-editor-foreground);
            }

            .navbar {
                flex-direction: row; 
                display: flex; 
                gap: 20px;
                justify-content: space-between; 
            }

            .userMessage { 
                color: #00fff7; 
                font-size: 2rem; 
                text-align: right;
            }

        </style>
    </head>
    <body>
    <div class="navbar">  
        <div style="font-size: 32px; font-weight: 400"> Perplexity AI </div>
        <select name="Model" id="model-selector" required>
            <option value="sonar">Sonar</option>
            <option value="sonar-pro">Sonar-Pro</option>
            <option value="sonar-reasoning">Sonar-Reasoning</option>
            <option value="sonar-reasoning-pro">Sonar-Reasoning-Pro</option>

        </select>
    </div> 

        <div id="sources">
        </div> 
        <div id="response-container">

            <div id="response-text" class="response-text">
            </div>
            <div id="current-message"> </div> 
        </div>
    
        <div class="input-container">
            <textarea  
                id="user-input" 
                placeholder="Enter your code question... Hit Enter to send. Hit Shift + Enter to add another line"
                spellcheck="false"
            ></textarea>

        </div>
    
        <script nonce="${nonce}">

            // Markdown parser to render the response text 
            const md = window.markdownit({
                breaks: true, 
                linkify: true, 
                typographer: true,
                html: true
            });

            const vscode = acquireVsCodeApi();
            const input = document.getElementById('user-input');
            let userPrompt = "";
            const responseText = document.getElementById('response-text');
            const currentResponseText = document.getElementById("current-message");
            let cursorElement = null;
            let responseTextMessageForContext = ""; 

        // Handle Enter key (Shift+Enter for newline)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                currentResponseText.innerText += '\\n\\n<div class="userMessage" >' + input.value + ' </div>\\n\\n';
                userPrompt = input.value; 
                sendMessage();
            }
        });


            // This function is called when the message is complete and we want to send the context back to the parent window for future messages
            function sendContext(prompt, response) { 
                vscode.postMessage({
                    command: "setContext",
                    prompt: prompt,
                    response: response 
                })
            }


            function removeThinkings(text) {

                //The reasoning tokens are removed from the response text. Everything between <think> and </think> is a reasoning token returned by the model and we don't want the chat to be cluttered with them.
                const indexOfStartReasoningTokens = currentResponseText.innerText.indexOf("<think>");
                const indexOfEndReasoningTokens = currentResponseText.innerText.indexOf("</think>");    
                return text.slice(0, indexOfStartReasoningTokens) + text.slice(indexOfEndReasoningTokens + 8, text.length).trim();
            }


            window.addEventListener('message', event => {
                const message = event.data;
                let streamChunk = ""; 
                const sourcesList = document.getElementById("sources");

                if (message.command === "stream") {
                    // Append streaming text safely
                    currentResponseText.innerText += message.content;

                    //Scroll to the bottom of the response container
                    const responseContainer = document.getElementById('response-container');
                    responseContainer.scrollTop = responseText.scrollHeight;

                } else if (message.command === "complete") {
                    // Process final Markdown rendering

                    // Remove all returned reasononing tokens from the response as they take a lot tokens
                    const indexOfStartReasoningTokens = currentResponseText.innerText.indexOf("<think>");
                    const indexOfEndReasoningTokens = currentResponseText.innerText.indexOf("</think>");

                    currentResponseText.innerText = removeThinkings(currentResponseText.innerText); 

                    // Render the final response text and remove the "current response" text
                    currentResponseText.innerHTML =   md.render(currentResponseText.innerText)
                    responseText.insertAdjacentHTML('beforeend', currentResponseText.innerHTML);
                    currentResponseText.innerText = "";
                    currentResponseText.style.whiteSpace = 'pre-wrap';

                    // Send back the context (being just the users' prompt essentially) to the parent window. No need to send the response as it is already stored in the parent window
                    sendContext(userPrompt, responseTextMessageForContext); 

                    // Allow the user to type again 
                    input.readOnly = false;

                } else if (message.command === "source") {
                    // Create new source element with Markdown parsing
                    const sourceItem = document.createElement('div');
                    sourceItem.innerHTML = md.render('- ' + message.content);
                    sourcesList.prepend(sourceItem);  // Add to top of sources list
                }
            });


            // Send message to extension

            function sendMessage() {
                const message = input.value.trim();
                if (message) {
                    
                    input.readOnly = true;
                    vscode.postMessage({
                        command: 'submit',
                        content: message
                    });
                    input.value = '';
                }
            }



            // Send message to the parent window once the user selects a model
            const dropdown = document.getElementById('model-selector');
            dropdown.addEventListener('change', (e) => {
                vscode.postMessage({
                        command: 'selectModel',
                        content: e.target.value
                });
            });

            //send errors to vscode

        </script>
    </body>
    </html>
    `;

    return html;
}

