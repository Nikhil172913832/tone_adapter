// Import the analyzer functions
import { analyzeChatMessages, saveToneProfile, getToneProfile } from './analyzer/analyze-chat.js';

// Store the current chat ID and messages
let currentChatId = null;
let currentMessages = [];

// Initialize the extension
initToneAdapter();

async function initToneAdapter() {
  logChatTitle();
  await observeChatChanges();
  setupMessageListeners();
}

async function logChatTitle() {
  const title = getChatTitle();
  if (title) {
    console.log('[tone_adapter] Chat title:', title);
    currentChatId = generateChatId(title);
    await loadAndDisplayToneProfile(currentChatId);
  } else {
    console.log('[tone_adapter] Chat title not found');
  }
}
function getChatTitle() {
  console.log("[tone_adapter debug] getChatTitle called");
  let container = document.querySelector('title');
  if (container) {
    if (!container.innerText.includes("Telegram Web")) {
      return container.innerText;
    }
  }
  container = document.querySelector('div.user-title');
  if (container) {
    const temp = document.createElement('div');
    temp.innerHTML = container.innerHTML;
    const span = temp.querySelector('span');
    if (span) {
      console.log("[tone_adapter debug] Chat title found:", span.innerText.trim());
      return span.innerText.trim();
    }
  }
  return null;
}
function getRecentChatsInDOM() {
  let chatNodes = document.querySelectorAll('div[role="list"] > div[role="listitem"]');
  if (!chatNodes.length) {
    chatNodes = document.querySelectorAll('[data-peer-id]');
  }
  if (!chatNodes.length) {
    chatNodes = document.querySelectorAll('div.ListItem, div.list-item, div.chatlist-chat');
  }
  console.log("[tone_adapter debug] chatNodes.length:", chatNodes.length);
  if (chatNodes.length > 0) {
    console.log("[tone_adapter debug] First chat node outerHTML:", chatNodes[0].outerHTML);
    console.log("[tone_adapter debug] First chat node innerHTML:", chatNodes[0].innerHTML);
  } else {
    const chatList = document.querySelector('div[role="list"]') || document.querySelector('.chatlist') || document.querySelector('.List');
    if (chatList) {
      console.log("[tone_adapter debug] chatList outerHTML:", chatList.outerHTML);
    } else {
      console.log("[tone_adapter debug] No chat list container found");
    }
    console.warn("No chats found in DOM — maybe wrong selector or chat list not loaded yet");
    return [];
  }
  return Array.from(chatNodes).slice(0, 50).map(node => {
    let title =
      node.getAttribute('aria-label')?.trim() ||
      node.querySelector('div[dir="auto"] span')?.innerText?.trim() ||
      node.querySelector('span[dir="auto"]')?.innerText?.trim() ||
      node.querySelector('span')?.innerText?.trim() ||
      node.querySelector('div[dir="auto"]')?.innerText?.trim() ||
      node.querySelector('div')?.innerText?.trim() ||
      "(No Title)";
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
function getCurrentVisibleMessages(maxMessages = 50) {
  let selectors = [
    'div.text-content.clearfix.with-meta',
    'div.text-content',
    'div.message',
    'div[role="listitem"] div[dir="auto"]',
    'div[role="listitem"] span',
  ];
  let messageNodes = [];
  for (const selector of selectors) {
    messageNodes = Array.from(document.querySelectorAll(selector));
    if (messageNodes.length) {
      console.log(`[tone_adapter debug] Selector '${selector}' found ${messageNodes.length} nodes.`);
      break;
    } else {
      console.log(`[tone_adapter debug] Selector '${selector}' found 0 nodes.`);
    }
  }
  if (messageNodes.length > 0) {
    console.log('[tone_adapter debug] First message node outerHTML:', messageNodes[0].outerHTML);
  } else {
    console.warn('[tone_adapter debug] No message nodes found with any selector.');
    return [];
  }
  messageNodes = messageNodes.filter(node => {
    const style = window.getComputedStyle(node);
    const isVisible = style && style.display !== 'none' && style.visibility !== 'hidden' && node.offsetParent !== null;
    const text = node.innerText?.trim() || '';
    const hasMedia = node.querySelector('a, video, img, audio, source');
    let hasOutClass = false;
    let el = node;
    while (el && el !== document.body) {
      const cls = el.className || '';
      if (/is-out|outgoing/i.test(cls)) {
        hasOutClass = true;
        break;
      }
      el = el.parentElement;
    }
    return isVisible && text.length > 0 && !hasMedia && hasOutClass;
  });
  const messages = messageNodes.slice(-maxMessages).map(node => {
    let text = node.cloneNode(true);
    text.querySelectorAll('.time, .message-meta, .with-meta, [data-testid*="time"], [class*="meta"], [class*="time"]').forEach(e => e.remove());
    return text.innerText.trim();
  }).filter(Boolean);
  console.log(`[tone_adapter debug] Returning ${messages.length} pure chat messages`);
  return messages;
}
// Generate a unique ID for the chat
function generateChatId(chatTitle) {
  return btoa(chatTitle).substring(0, 32);
}

// Observe chat changes and update analysis
async function observeChatChanges() {
  const observer = new MutationObserver(async (mutations) => {
    const messages = getCurrentVisibleMessages();
    if (messages.length !== currentMessages.length) {
      currentMessages = messages;
      if (currentChatId && messages.length > 0) {
        await analyzeAndStoreToneProfile(currentChatId, messages);
      }
    }
  });

  // Start observing the chat container
  const chatContainer = document.querySelector('[role="log"], .messages-container, .chat-container');
  if (chatContainer) {
    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}

// Analyze messages and store the tone profile
async function analyzeAndStoreToneProfile(chatId, messages) {
  try {
    console.log(`[tone_adapter] Analyzing ${messages.length} messages for chat ${chatId}`);
    const toneProfile = await analyzeChatMessages(messages);
    
    if (toneProfile) {
      await saveToneProfile(chatId, toneProfile);
      await updateToneProfileUI(toneProfile);
    }
  } catch (error) {
    console.error('[tone_adapter] Error in analyzeAndStoreToneProfile:', error);
  }
}

// Load and display the tone profile for the current chat
async function loadAndDisplayToneProfile(chatId) {
  const toneProfile = await getToneProfile(chatId);
  if (toneProfile) {
    await updateToneProfileUI(toneProfile);
  }
}

// Update the UI to show the tone profile
async function updateToneProfileUI(toneProfile) {
  // Remove existing tone profile if it exists
  let container = document.getElementById('tone-adapter-profile');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'tone-adapter-profile';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.padding = '10px';
    container.style.background = '#ffffff';
    container.style.border = '1px solid #e0e0e0';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    container.style.zIndex = '9999';
    container.style.maxWidth = '300px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    document.body.appendChild(container);
  }

  // Create HTML for the tone profile
  container.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 4px;">
      💬 Tone Profile
    </div>
    <div style="margin-bottom: 4px;"><strong>Formality:</strong> ${toneProfile.formality}</div>
    <div style="margin-bottom: 4px;"><strong>Politeness:</strong> ${toneProfile.politeness}</div>
    <div style="margin-bottom: 4px;"><strong>Emotion:</strong> ${toneProfile.emotion}</div>
    <div style="margin-bottom: 4px;"><strong>Energy:</strong> ${toneProfile.energy}</div>
    <div style="margin-top: 8px; font-size: 12px; color: #666;">
      Last updated: ${new Date().toLocaleTimeString()}
    </div>
  `;
}

// Set up message listeners
function setupMessageListeners() {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getToneProfile' && currentChatId) {
      getToneProfile(currentChatId).then(profile => {
        sendResponse({ toneProfile: profile });
      });
      return true; // Will respond asynchronously
    }
    return false;
  });
}

// Handle incoming messages from the extension
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "getRecentChats") {
    const chats = getRecentChatsInDOM();
    console.log("Returning recent chats:", chats);
    sendResponse({ chats });
    return true;
  }
  if (req.type === "getMessages") {
    const messages = getCurrentVisibleMessages(50);
    const title = getChatTitle();
    sendResponse({ messages, title });
    return true;
  }
  return true;
});
