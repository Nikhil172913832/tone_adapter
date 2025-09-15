// gemini.js
// Gemini API integration for rephrasing messages
// Loads GEMINI_API_KEY from .env (via import.meta.env, process.env, or window.env for browser context)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function getGeminiApiKey() {
  // Try Vite/webpack style import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.GEMINI_API_KEY) {
    return import.meta.env.GEMINI_API_KEY;
  }
  // Try process.env (Node, some bundlers)
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  // Try window.env (for browser extensions with injected env)
  if (typeof window !== 'undefined' && window.env && window.env.GEMINI_API_KEY) {
    return window.env.GEMINI_API_KEY;
  }
  // Try globalThis.env (for some bundlers)
  if (typeof globalThis !== 'undefined' && globalThis.env && globalThis.env.GEMINI_API_KEY) {
    return globalThis.env.GEMINI_API_KEY;
  }
  throw new Error('GEMINI_API_KEY not found in environment. Please set it in .env or inject at runtime.');
}

/**
 * Rephrase a message using Gemini API, given a tone profile and input message.
 * @param {string} inputMessage - The message to rephrase.
 * @param {string} llmToneProfile - The LLM-friendly tone profile string.
 * @returns {Promise<string>} - The rephrased message.
 */
export async function rephraseWithGemini(inputMessage, llmToneProfile) {
  const GEMINI_API_KEY = getGeminiApiKey();
  const prompt = `You are an expert communication assistant.\n\nHere is a detailed tone profile describing the user's communication style:\n\n${llmToneProfile}\n\n---\n\nPlease rephrase the following message so that it matches the user's tone profile as closely as possible.\n\nMessage to rephrase:\n"""${inputMessage}"""\n\nRephrased message:`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  };

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // Gemini returns candidates[0].content.parts[0].text
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No rephrased message returned.';
  return text.trim();
}
