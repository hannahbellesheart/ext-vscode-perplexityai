# Change Log
## V2
### v2.0.0
#### Changes
- Added Sidebar class and activity bar icon
- Restructured the main chat window
- Chat window can now be opened using the button from the sidebar
  
## V1
### v1.3.3
#### Changes
- Added new icon and removed the old one 
- Modified the display name to Perplexity.ai 

### v1.3.2
#### Bugfixes
- Resolved a bug where the responses from the message context (or history) would dissapear and only previous user prompts would be stored

### v1.3.1
#### Changes
- Modified user messages' style, now messages sent by the user are bigger and light blue
- Added autoscrolling and blocked messaging while the AI is responding  
- Added new model - sonar-deep-research
#### Bugfixes
- Resolved an issue from previous version that would mess up the whole webview functionality

### v1.2.0
#### Changes
- Added message history of 16 (8 user messages and 8 responses) to save up tokens
- Removed "thoughts" from the screen after the message is complete for better readability
- Removed "thoughts" from previous messages to not waste AI tokens

### v1.1.2
#### Changes 
- Added sonar-reasoning-pro model
- Added the current context up to spec with Perplexity's API standards 
#### Bugfixes
- Resolved the bug in which the model wouldn't 'remember' context or would mix-up messages order 
### v1.1.0 
#### Changes
- Added message history context
- Added limit for message history size (currently 10)
#### Bugfixes
- Ensured that MD content is properly showing up, before it used to render a lot of additional spaces
### v1.0.1
#### Bugfixes 
- Ensured that the AI is being called with the whole request body
- Ensured that the text is loaded in the text area as soon as it arrives 
#### Changes 
- Removed the button, now users can hit enter after the text is typed in and hit Shift + Enter to add multiple lines without sending the message to the AI
- Ensured that API key is stored under secret
- Added mark down text decorations to ensure that's a bit easier to read. 
### v1.0.0
- Initial Version
- Added multiline prompt
- Added text area where the AI response is written 
- AI Response is sent back and written to the object in real time via data stream
- The theme applied to VSCode is controlling the color scheme on the AI model 
