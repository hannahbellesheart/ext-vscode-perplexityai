# Perplexity AI Chat for VS Code

Integrate Perplexity AI's API directly into VS Code with real-time chat capabilities and streaming responses.

## Features

- **Streaming responses** with incremental output
- **Secure API key storage** using VS Code secrets
- **Model selection** (default: `sonar`)
- **Citation tracking** for AI responses
- **Error handling** with user notifications
- **Dark theme** matching VS Code aesthetics

## Installation

I would suggest installing it from the vscode marketplace, but if you'd like to manually install it, please follow the below steps

```bash
$ git clone https://github.com/gabrielhutu/perplexity-ext 
$ cd ./perplexity-ext
$ npm install 
$ npx @vscode/vsce packge
```

After the above is completed, the VS Code extension will be packaged in a `.vsix` file in the root directory of this repository. 
To install a vsix manually (ie... not from the Extensions menu within VSCode, and not from the VSCode Marketplace),

Use the **Install from VSIX** command in the Extensions view command dropdown, 
or the **Extensions: Install from VSIX** command in the **Command Palette**, and point 
to the `.vsix` file.

You can also install using the VS Code command, `code`, 
followed by a space, and then the command-line switch `--install-extension`, 
providing the path to the `.vsix` file.

### Example (single extension)
>code --install-extension `c:\docuents\extensions\myExtension01.vsix`
### Example (multiple extensions) (**)
>code --install-extension `c:\docuents\extensions\myExtension01.vsix`  --install-extension `c:\docuents\extensions\myExtension02.vsix`

(**) You may provide the `--install-extension` multiple times on the command line to install multiple extensions at once.

>Note
>
>When you install an extension via VSIX, 
>[auto update](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_extension-auto-update) 
>for that extension is disabled by default.

**[See here for more details](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_install-from-a-vsix)

## Set API key

### Open Command Palette → "Perplexity: Set API Token" → Enter pplx-key

For more details regarding how to generate an API key for Perplexity, please check their [initial setup here](https://docs.perplexity.ai/guides/getting-started)

## Usage

![Usage](https://raw.githubusercontent.com/gabrielhutu/perplexity-ext/refs/heads/master/images/usage.gif)

### 1. Open chat

Click on the Chat icon on the activity bar and hit "Open chat window" 

### 2. Select model from dropdown  

On the left sidebar, there is a dropdown menu. the menu allows you to select which model would you like to use with Perplexity. The current available options are 
- `sonar`
- `sonar-pro`
- `sonar-reasoning`
- `sonar-reasoning-pro`
- `sonar-deep-research`
| r1-1776 is currently not supported

For more details regarding how they work, please check their documentation.

### 3. Enter questions in chat input

Type in anything!

### 4. Receive streaming responses with citations

Wait for the model to respond. It will stream every word to you, which is captured in the

## Architecture

```
 src/  
├── extension.ts        # Core logic   
├── util/               # Directory for utility classes and object 
│   ├── perplexity.ts   # API communication 
│   ├── sidebar.ts      # Sidebar class 
│   ├── util.js         # Util functions 
│   └── models.js       # Currently just hosting 1 variable for all model types.
│                         I'll possibly implement some way of fecthing the models automatically here.                             
└── ui/ # UI Components 
    ├── webviewContent.ts # component for the chat window 
    └── webviewSidebar.ts # Component for the sidebar 
```

## Security - API keys encrypted via VS Code Secret Storage

- CSP nonce protection for webviews
- Storage of sensitive data in vscode secret 
