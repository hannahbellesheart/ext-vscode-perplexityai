
Here's the complete README.md in a code block for easy copying:

# Perplexity AI Chat for VS Code   
Integrate Perplexity AI's API directly into VS Code with real-time chat capabilities and streaming responses.   
## Features 
- **Streaming responses** with incremental output 
- **Secure API key storage** using VS Code secrets 
- **Model selection** (default: `sonar`) 
- **Citation tracking** for AI responses 
- **Error handling** with user notifications 
- **Dark theme** matching VS Code aesthetics   
## Install dependencies:
```
npm install
```

## Set API key 

### Open Command Palette → "Perplexity: Set API Token" → Enter pplx-key 
For more details regarding how to generate an API key for Perplexity, please check their [initial setup here](https://docs.perplexity.ai/guides/getting-started)

## Usage 
### 1. Open chat: 
Open Command Palette → "Perplexity: Open Chat Window"

### 2. Select model from dropdown  
On the top-right corner, there is a dropdown menu. the menu allows you to select which model would you like to use with Perplexity. The current available options are `sonar`, `sonar-pro` and `sonar-reasoning`
For more details regarding how they work, please check their documentation. 

### 3. Enter questions in chat input 
Type in anything! 

### 4. Receive streaming responses with citations[2][3]   
Wait for the model to respond. It will stream every word to you, which is captured in the 
## Configuration
Below is the only current command that allows configuration, which is essentially only the API token. 
```
{  
"command": "perplexity-ext.setAPIToken",  
}
```
## Architecture
``` 
 src/  
├── extension.ts # Core logic  
├── perplexity.ts # API communication 
└── webviewContent.ts # UI components
```

## Security - API keys encrypted via VS Code Secret Storage
- CSP nonce protection for webviews 
## TODO
- Add menu to select what files should be included in context
- If possible, add counter for tokens to allow the end user to see how many tokens left. 
