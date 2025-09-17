"use strict";(()=>{var E="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";async function f(l,g){var a,i,c,m,d;let h="AIzaSyC2Nk_HYq6p9RWSR3PbW4Ldn3XG_t2Renw",o={contents:[{role:"user",parts:[{text:`You are an expert communication and tone adaptation assistant.

Your job is to take an input message and rewrite it so it matches the speaker's tone, style, and phrasing as closely as possible.

Context for tone and style (from previous chat history):
${g}

---
Message to rephrase:
"""${l}"""

Guidelines:
- Analyze the provided context carefully to infer tone (formality, directness, emotional vibe, word choice, sentence rhythm).
- Preserve the *intent and meaning* of the original message.
- Match the *style markers* of the speaker:
  \u2022 Word choice (casual vs formal, technical vs simple).  
  \u2022 Sentence structure (short, punchy vs long, flowing).  
  \u2022 Level of politeness, assertiveness, or enthusiasm.  
  \u2022 Use of contractions, slang, emojis, or punctuation style if present.  
- Do not add explanations, only return the final rephrased message.

Rephrased message:`}]}]},n=`${E}?key=${h}`,t=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!t.ok)throw new Error(`Gemini API error: ${t.status} ${t.statusText}`);let r=await t.json();return(((d=(m=(c=(i=(a=r==null?void 0:r.candidates)==null?void 0:a[0])==null?void 0:i.content)==null?void 0:c.parts)==null?void 0:m[0])==null?void 0:d.text)||"No rephrased message returned.").trim()}document.addEventListener("DOMContentLoaded",()=>{let l=document.getElementById("fetch"),g=document.getElementById("fetch-input"),h=document.getElementById("rephrase-input"),e=document.getElementById("output");h.addEventListener("click",async()=>{e.textContent="Rephrasing input message...",chrome.tabs.query({active:!0,currentWindow:!0},o=>{if(!o[0]){e.textContent="No active tab found";return}let n=o[0].id;chrome.tabs.sendMessage(n,{type:"getInputBoxMessage"},t=>{var s;if(chrome.runtime.lastError){e.textContent="Error: "+chrome.runtime.lastError.message;return}let r=(s=t==null?void 0:t.inputMessage)==null?void 0:s.trim();if(!r){e.textContent="No input box message found or input is empty.";return}chrome.tabs.sendMessage(n,{type:"getMessages"},async a=>{if(chrome.runtime.lastError){e.textContent="Error: "+chrome.runtime.lastError.message;return}if(!a||!a.messages){e.textContent="No messages found or content script not loaded.";return}let i=a.messages.slice(-50);try{let c=await f(r,i);e.textContent=`Original:
${r}

Rephrased:
${c}`}catch(c){e.textContent="Gemini API error: "+c}})})})}),g.addEventListener("click",()=>{e.textContent="Fetching input box message...",chrome.tabs.query({active:!0,currentWindow:!0},o=>{if(!o[0]){e.textContent="No active tab found";return}let n=o[0].id;function t(r){chrome.tabs.sendMessage(n,{type:"getInputBoxMessage"},s=>{if(chrome.runtime.lastError){if(!r&&chrome.runtime.lastError.message.includes("Receiving end does not exist")){chrome.scripting.executeScript({target:{tabId:n},files:["content.js"]},()=>{if(chrome.runtime.lastError){e.textContent="Failed to inject content script: "+chrome.runtime.lastError.message;return}t(!0)});return}e.textContent="Error: "+chrome.runtime.lastError.message+`
(Try opening the chat or sending a message first.)`;return}if(!s){e.textContent=`Error: No response from content script.
(Make sure the chat page is open and re-try.)`;return}s.inputMessage&&s.inputMessage.trim().length>0?e.textContent=`Input Box Message:
${s.inputMessage}`:e.textContent="No input box message found or input is empty."})}t(!1)})}),l.addEventListener("click",()=>{e.textContent="Fetching...",chrome.tabs.query({active:!0,currentWindow:!0},o=>{if(!o[0]){e.textContent="No active tab found";return}let n=o[0].id;chrome.tabs.sendMessage(n,{type:"getInputBoxMessage"},t=>{let r="";t&&t.inputMessage&&(r=t.inputMessage);function s(a){chrome.tabs.sendMessage(n,{type:"getMessages"},async i=>{if(chrome.runtime.lastError){if(!a&&chrome.runtime.lastError.message.includes("Receiving end does not exist")){chrome.scripting.executeScript({target:{tabId:n},files:["content.js"]},()=>{if(chrome.runtime.lastError){e.textContent="Failed to inject content script: "+chrome.runtime.lastError.message;return}s(!0)});return}e.textContent=chrome.runtime.lastError.message;return}if(!i||!i.messages){e.textContent="No messages found or content script not loaded.";return}let c=i.messages.slice(-50),m=i.title?`Chat: ${i.title}

`:"",d=c.map((u,p)=>typeof u=="object"&&u!==null&&"text"in u&&"sender"in u?`${p+1}. [${u.sender}] ${u.text}`:`${p+1}. ${u}`).join(`

`);e.textContent=m+d})}s(!1)})})})});console.log("popup.js loaded");console.log("popup.js loaded");})();
