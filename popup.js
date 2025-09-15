import { generateToneProfile, generateLLMToneProfile } from './dist/analyzer/index.js';
import { rephraseWithGemini } from './gemini.js';

document.addEventListener("DOMContentLoaded", () => {
  const fetchBtn = document.getElementById("fetch");
  const fetchInputBtn = document.getElementById("fetch-input");
  const rephraseInputBtn = document.getElementById("rephrase-input");
  const output = document.getElementById("output");
  // --- Rephrase Input Button Logic ---
  rephraseInputBtn.addEventListener("click", async () => {
    output.textContent = "Rephrasing input message...";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        output.textContent = "No active tab found";
        return;
      }
      const tabId = tabs[0].id;
      // Get input box message
      chrome.tabs.sendMessage(tabId, { type: "getInputBoxMessage" }, (inputBoxResponse) => {
        if (chrome.runtime.lastError) {
          output.textContent = "Error: " + chrome.runtime.lastError.message;
          return;
        }
        const inputMessage = inputBoxResponse?.inputMessage?.trim();
        if (!inputMessage) {
          output.textContent = "No input box message found or input is empty.";
          return;
        }
        // Get last 50 messages for tone profile
        chrome.tabs.sendMessage(tabId, { type: "getMessages" }, async (response) => {
          if (chrome.runtime.lastError) {
            output.textContent = "Error: " + chrome.runtime.lastError.message;
            return;
          }
          if (!response || !response.messages) {
            output.textContent = "No messages found or content script not loaded.";
            return;
          }
          const last50 = response.messages.slice(-50);
          let toneProfile;
          let llmProfile;
          try {
            toneProfile = await generateToneProfile(last50);
            llmProfile = generateLLMToneProfile(toneProfile);
          } catch (e) {
            output.textContent = "Error generating tone profile: " + e;
            return;
          }
          // Call Gemini API to rephrase
          try {
            const rephrased = await rephraseWithGemini(inputMessage, llmProfile);
            output.textContent = `Original:\n${inputMessage}\n\nRephrased:\n${rephrased}`;
          } catch (e) {
            output.textContent = "Gemini API error: " + e;
          }
        });
      });
    });
  });

  fetchInputBtn.addEventListener("click", () => {
    output.textContent = "Fetching input box message...";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        output.textContent = "No active tab found";
        return;
      }
      const tabId = tabs[0].id;
      function requestInputBoxMessage(retry) {
        chrome.tabs.sendMessage(tabId, { type: "getInputBoxMessage" }, (inputBoxResponse) => {
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
                requestInputBoxMessage(true);
              });
              return;
            }
            output.textContent = "Error: " + chrome.runtime.lastError.message + "\n(Try opening the chat or sending a message first.)";
            return;
          }
          if (!inputBoxResponse) {
            output.textContent = "Error: No response from content script.\n(Make sure the chat page is open and re-try.)";
            return;
          }
          if (inputBoxResponse.inputMessage && inputBoxResponse.inputMessage.trim().length > 0) {
            output.textContent = `Input Box Message:\n${inputBoxResponse.inputMessage}`;
          } else {
            output.textContent = "No input box message found or input is empty.";
          }
        });
      }
      requestInputBoxMessage(false);
    });
  });

  fetchBtn.addEventListener("click", () => {
    output.textContent = "Fetching...";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        output.textContent = "No active tab found";
        return;
      }
      const tabId = tabs[0].id;

      // Retrieve input box message first
      chrome.tabs.sendMessage(tabId, { type: "getInputBoxMessage" }, (inputBoxResponse) => {
        let inputBoxMessage = '';
        if (inputBoxResponse && inputBoxResponse.inputMessage) {
          inputBoxMessage = inputBoxResponse.inputMessage;
        }
        // Now proceed to fetch messages as before
        function requestMessages(retry) {
          chrome.tabs.sendMessage(tabId, { type: "getMessages" }, async (response) => {
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

          // --- Persistent Tone Profile Logic ---
          // Use chat title as chatId if available, else hash the last50 messages
          function hashMessages(msgs) {
            // Simple hash function for fallback
            let str = JSON.stringify(msgs);
            let hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
              chr = str.charCodeAt(i);
              hash = ((hash << 5) - hash) + chr;
              hash |= 0;
            }
            return 'chat_' + Math.abs(hash);
          }
          const chatId = response.title ? `chat_${response.title}` : hashMessages(last50);

          // Try to load from storage first
          let toneProfileStr = '';
          let llmProfileStr = '';
          chrome.storage.local.get([chatId], async (result) => {
            if (result[chatId]) {
              // Found cached profile
              const cached = result[chatId];
              toneProfileStr = `\n\n---\nTone Profile (cached):\n` + JSON.stringify(cached.toneProfile, null, 2);
              try {
                llmProfileStr = `\n\n---\nLLM Tone Profile:\n` + generateLLMToneProfile(cached.toneProfile);
              } catch (e) {
                llmProfileStr = `\n\n---\nLLM Tone Profile: Error generating LLM profile: ${e}`;
              }
              let inputBoxStr = inputBoxMessage ? `\n\n---\nInput Box Message:\n${inputBoxMessage}` : '';
              output.textContent = titleStr + msgStr + inputBoxStr + toneProfileStr + llmProfileStr + "\n\n(Loaded from cache)";
              return;
            }
            // Not cached, generate and store
            try {
              const toneProfile = await generateToneProfile(last50);
              toneProfileStr = `\n\n---\nTone Profile:\n` + JSON.stringify(toneProfile, null, 2);
              // Store in chrome.storage.local
              chrome.storage.local.set({ [chatId]: { toneProfile, timestamp: Date.now() } });
              try {
                llmProfileStr = `\n\n---\nLLM Tone Profile:\n` + generateLLMToneProfile(toneProfile);
              } catch (e) {
                llmProfileStr = `\n\n---\nLLM Tone Profile: Error generating LLM profile: ${e}`;
              }
            } catch (e) {
              toneProfileStr = `\n\n---\nTone Profile: Error generating tone profile: ${e}`;
            }
            let inputBoxStr = inputBoxMessage ? `\n\n---\nInput Box Message:\n${inputBoxMessage}` : '';
            output.textContent = titleStr + msgStr + inputBoxStr + toneProfileStr + llmProfileStr;
            console.log("Recent 50 messages:", last50);
          });
          // --- End Persistent Tone Profile Logic ---
        }); // end chrome.tabs.sendMessage
      } // end requestMessages
        requestMessages(false);
      });
    }); // end chrome.tabs.query
  }); // end fetchBtn.addEventListener
}); // end DOMContentLoaded
console.log("popup.js loaded");
console.log("popup.js loaded");