# Change Log

## v1.1.1
#### Changes 
- Added sonar-reasoning-pro model
- Added the current context up to spec with Perplexity's API standards 
#### Bugfixes
- Resolved the bug in which the model wouldn't 'remember' context or would mix-up messages order 
## v1.1.0 
#### Changes
- Added message history context
- Added limit for message history size (currently 10)
#### Bugfixes
- Ensured that MD content is properly showing up, before it used to render a lot of additional spaces
## v1.0.1
#### Bugfixes 
- Ensured that the AI is being called with the whole request body
- Ensured that the text is loaded in the text area as soon as it arrives 
#### Changes 
- Removed the button, now users can hit enter after the text is typed in and hit Shift + Enter to add multiple lines without sending the message to the AI
- Ensured that API key is stored under secret
- Added mark down text decorations to ensure that's a bit easier to read. 
## v1.0.0
- Initial Version
- Added multiline prompt
- Added text area where the AI response is written 
- AI Response is sent back and written to the object in real time via data stream
- The theme applied to VSCode is controlling the color scheme on the AI model 
