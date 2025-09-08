document.addEventListener("DOMContentLoaded", () => {
  const fetchBtn = document.getElementById("fetch");
  const output = document.getElementById("output");

  fetchBtn.addEventListener("click", () => {
    output.textContent = "Fetching...";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        output.textContent = "No active tab found";
        return;
      }
      const tabId = tabs[0].id;
      function requestMessages(retry) {
        chrome.tabs.sendMessage(tabId, { type: "getMessages" }, (response) => {
          if (chrome.runtime.lastError) {
            if (!retry && chrome.runtime.lastError.message.includes("Receiving end does not exist")) {
              chrome.scripting.executeScript({
                target: { tabId },
                files: ["content.js"]
              }, () => {
                if (chrome.runtime.lastError) {
                  output.textContent = "Failed to inject content script: " + chrome.runtime.lastError.message;
                  return;
                }
                requestMessages(true);
              });
              return;
            }
            output.textContent = chrome.runtime.lastError.message;
            return;
          }
          if (!response || !response.messages) {
            output.textContent = "No messages found or content script not loaded.";
            return;
          }
          const last50 = response.messages.slice(-50);
          let titleStr = response.title ? `Chat: ${response.title}\n\n` : '';
          let msgStr = last50.map((msg, i) => {
            if (typeof msg === 'object' && msg !== null && 'text' in msg && 'sender' in msg) {
              return `${i + 1}. [${msg.sender}] ${msg.text}`;
            } else {
              return `${i + 1}. ${msg}`;
            }
          }).join("\n\n");
          output.textContent = titleStr + msgStr;
          console.log("Recent 50 messages:", last50);
        });
      }
      requestMessages(false);
    });
  });
});
console.log("popup.js loaded");