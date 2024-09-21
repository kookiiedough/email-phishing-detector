chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeEmail") {
      fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email_content: request.content}),
      })
      .then(response => response.json())
      .then(data => {
        chrome.tabs.sendMessage(sender.tab.id, {action: "analysisResult", result: data});
      })
      .catch(error => console.error('Error:', error));
    }
  });
  