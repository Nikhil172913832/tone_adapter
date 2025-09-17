let currentChatId = null;
let currentMessages = [];

initToneAdapter();

async function initToneAdapter() {
  logChatTitle();
}

async function logChatTitle() {
  const title = getChatTitle();
  if (title) {
    console.log('[tone_adapter] Chat title:', title);
    currentChatId = generateChatId(title);
  } else {
    console.log('[tone_adapter] Chat title not found');
  }
}

function getChatTitle() {
  console.log("[tone_adapter debug] getChatTitle called");
  let container = document.querySelector('title');
  if (container) {
    if (!container.innerText.includes("Telegram")) {
      return container.innerText;
    }
  }
  container = document.querySelector('div.top');
  let temp = document.createElement('div');
  temp.innerHTML = container.innerHTML;
  container = temp.querySelector('div.user-title');
  if (container) {
    temp = document.createElement('div');
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
function generateChatId(chatTitle) {
  return btoa(chatTitle).substring(0, 32);
}
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
  if (req.type === "getInputBoxMessage") {
    // Try by id first
    let inputDiv = document.getElementById('editable-message-text');
    if (!inputDiv) {
      // Try by class
      inputDiv = document.querySelector('div.input-field-input-fake');
    }
    let inputMessage = '';
    if (inputDiv) {
      inputMessage = inputDiv.innerText || inputDiv.textContent || '';
    }
    sendResponse({ inputMessage });
    return true;
  }
  return true;
});

// Rephrase button injection logic
function createRephraseButton() {
  const btn = document.createElement('button');
  btn.className = 'tone-adapter-rephrase-btn';
  btn.title = 'Rephrase this text';
  btn.style.cssText = `
    position: absolute;
    width: 20px;
    height: 20px;
    background: url(${chrome.runtime.getURL('icon.png')}) no-repeat center center;
    background-size: contain;
    border: none;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
  `;
  btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
  btn.addEventListener('mouseleave', () => btn.style.opacity = '0.6');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const target = e.target._taTarget;
    const message = target.value || target.innerText || '';
    const msgs = getCurrentVisibleMessages(50);
    chrome.runtime.sendMessage({ type: 'triggerRephrase', inputMessage: message, contextMessages: msgs });
  });
  return btn;
}

function attachRephraseButton(el) {
  if (el._taAttached) return;
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
  const btn = createRephraseButton();
  btn._taTarget = el;
  wrapper.appendChild(btn);
  const rect = el.getBoundingClientRect();
  btn.style.top = (el.offsetTop + 4) + 'px';
  btn.style.left = (el.offsetLeft + el.offsetWidth - 24) + 'px';
  el._taAttached = true;
}

function scanAndAttach() {
  const inputs = Array.from(document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]'));
  inputs.forEach(attachRephraseButton);
}

// Observe DOM for new inputs
const taObserver = new MutationObserver(scanAndAttach);
taObserver.observe(document.body, { childList: true, subtree: true });
// Initial attach
scanAndAttach();
