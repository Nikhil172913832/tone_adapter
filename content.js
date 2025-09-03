console.log("✅ content.js injected into Telegram Web");


// Scrape the 50 most recent chats from the chat list sidebar
function getRecentChatsInDOM() {
  // Try several possible selectors for chat list items
  let chatNodes = document.querySelectorAll('div[role="list"] > div[role="listitem"]');
  if (!chatNodes.length) {
    chatNodes = document.querySelectorAll('[data-peer-id]'); // fallback: try peer id attribute
  }
  if (!chatNodes.length) {
    chatNodes = document.querySelectorAll('div.ListItem, div.list-item, div.chatlist-chat'); // try common class names
  }
  console.log("[tone_adapter debug] chatNodes.length:", chatNodes.length);
  if (chatNodes.length > 0) {
    console.log("[tone_adapter debug] First chat node outerHTML:", chatNodes[0].outerHTML);
    console.log("[tone_adapter debug] First chat node innerHTML:", chatNodes[0].innerHTML);
  } else {
    // Try to log the chat list container
    const chatList = document.querySelector('div[role="list"]') || document.querySelector('.chatlist') || document.querySelector('.List');
    if (chatList) {
      console.log("[tone_adapter debug] chatList outerHTML:", chatList.outerHTML);
    } else {
      console.log("[tone_adapter debug] No chat list container found");
    }
    console.warn("⚠️ No chats found in DOM — maybe wrong selector or chat list not loaded yet");
    return [];
  }
  // Extract chat title and last message preview if available
  return Array.from(chatNodes).slice(0, 50).map(node => {
    // Try multiple ways to get the chat title
    let title =
      node.getAttribute('aria-label')?.trim() ||
      node.querySelector('div[dir="auto"] span')?.innerText?.trim() ||
      node.querySelector('span[dir="auto"]')?.innerText?.trim() ||
      node.querySelector('span')?.innerText?.trim() ||
      node.querySelector('div[dir="auto"]')?.innerText?.trim() ||
      node.querySelector('div')?.innerText?.trim() ||
      "(No Title)";
    // If still no title, try to find the first child with text content
    if (title === "(No Title)") {
      const children = node.querySelectorAll('*');
      for (const child of children) {
        if (child.innerText && child.innerText.trim().length > 0) {
          title = child.innerText.trim();
          break;
        }
      }
    }
    const preview = node.querySelector('div.text-content')?.innerText?.trim() || node.querySelector('.last-message')?.innerText?.trim() || "";
    return { title, preview };
  });
}

// listen for requests from popup.js



function getRecentMessagesNoScroll(maxMessages = 50) {
  let messages = Array.from(document.querySelectorAll('div.text-content.clearfix.with-meta'));
  if (!messages.length) {
    messages = Array.from(document.querySelectorAll('div.text-content'));
  }
  messages = messages.slice(-maxMessages).map(m => m.innerText.trim());
  console.log(`[tone_adapter debug] Returning ${messages.length} messages (no scroll)`);
  return messages;
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "getRecentChats") {
    const chats = getRecentChatsInDOM();
    console.log("📩 Returning recent chats:", chats);
    sendResponse({ chats });
    return true;
  }
  if (req.type === "getMessages") {
    const messages = getRecentMessagesNoScroll(50);
    sendResponse({ messages });
    return true;
  }
  return true;
});
