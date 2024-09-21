function analyzeEmail() {
    const emailContent = document.querySelector('body').innerText;
    chrome.runtime.sendMessage({action: "analyzeEmail", content: emailContent});
  }
  
  const observer = new MutationObserver(analyzeEmail);
  observer.observe(document.body, { childList: true, subtree: true });
  