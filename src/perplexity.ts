interface PerplexityRequest {
	model: string;
	messages: Array<{ role: string; content: string }>;
	temperature?: number;
	top_p?: number;
	max_tokens?: number;
	stream?: boolean;
}




export default async function sendMessageToPerplexity(
	message: string,
	model: string, 
	apiKey: string,
	sendContentToInnerWebView: Function
) {

	// request body for Perplexity
	const requestBody: PerplexityRequest = {
		model: model,
		messages: [
			{
				role: "system",
				content: "Be precise and concise."
			},
			{
				role: "user",
				content: message
			}
		],
		stream: true
	};

	try {

		const response = await fetch('https://api.perplexity.ai/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const error: any = await response.json();
            sendContentToInnerWebView({
                command: 'error',
                content: error
            });
        }

		const reader: any = response.body?.getReader();
		const decoder: any = new TextDecoder();
		let listOfSources: string[] = []; 
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();
            if(done){ 
				await listOfSources.forEach(source => {
					sendContentToInnerWebView({
						command: 'source',
						content: source
					});
				});
                sendContentToInnerWebView({ command: 'complete' });
                return; 
            }
			buffer += decoder.decode(value, { stream: true });

			while (buffer.includes('\n')) {
				const lineIndex = buffer.indexOf('\n');
				const line = buffer.slice(0, lineIndex).trim();
				buffer = buffer.slice(lineIndex + 1);

				if (line.startsWith('data: ')) {
					const jsonStr = line.replace('data: ', '');
					if (jsonStr === '[DONE]') {
						sendContentToInnerWebView({ command: 'complete' });
						return;
					}

					try {
						const data = JSON.parse(jsonStr);
						const chunk = data.choices[0]?.delta?.content || '';
						listOfSources = data.citations; 
                        console.log(chunk);
						if (chunk) {
							sendContentToInnerWebView({
								command: 'stream',
								content: chunk
							});
                            if(chunk.finished_reason) {
                                sendContentToInnerWebView({ command: 'complete' });
                                return; 
                            }
						}
					} catch (error) {
						sendContentToInnerWebView({
							command: 'error',
							content: error
						});
					}
				}
			}
		}
		



	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			throw new Error("Request timed out after 15 seconds");
		}
		throw new Error(`Failed to complete request: ${(error as Error).message}`);
	}
}

