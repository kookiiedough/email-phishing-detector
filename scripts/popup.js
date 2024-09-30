document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getLastResult"}, function(response) {
          if (response && response.result) {
              displayResult(response.result);
          } else {
              document.getElementById('result').textContent = 'No analysis available for the current email.';
          }
      });
  });
});

function displayResult(result) {
  const resultDiv = document.getElementById('result');
  let html = '<h2>Analysis Result:</h2>';
  
  if (result.basic_checks && result.basic_checks.length > 0) {
      html += '<p class="warning">Potential phishing detected!</p>';
      html += '<h3>Suspicious Elements:</h3><ul>';
      result.basic_checks.forEach(element => {
          html += `<li>${element}</li>`;
      });
      html += '</ul>';
  } else {
      html += '<p class="safe">No suspicious elements detected in basic checks.</p>';
  }
  
  if (result.ai_analysis) {
      html += '<h3>AI Analysis:</h3>';
      html += `<p>${result.ai_analysis}</p>`;
  }
  
  resultDiv.innerHTML = html;
}