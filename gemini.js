// gemini.js
// Gemini API integration for rephrasing messages
// Loads GEMINI_API_KEY from .env (via import.meta.env, process.env, or window.env for browser context)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function getGeminiApiKey() {
  // Try window.env (for browser extensions with injected env)
  if (typeof window !== 'undefined' && window.env && window.env.GEMINI_API_KEY) {
    return window.env.GEMINI_API_KEY;
  }
  // Try process.env (Node, some bundlers)
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
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
  // const GEMINI_API_KEY = getGeminiApiKey();
  const GEMINI_API_KEY = "AIzaSyC2Nk_HYq6p9RWSR3PbW4Ldn3XG_t2Renw";
  const prompt = `You are an expert communication and tone adaptation assistant.

Your job is to take an input message and rewrite it so it matches the speaker's tone, style, and phrasing as closely as possible.

Context for tone and style (from previous chat history):
${llmToneProfile}

---
Message to rephrase:
"""${inputMessage}"""

Guidelines:
- Analyze the provided context carefully to infer tone (formality, directness, emotional vibe, word choice, sentence rhythm).
- Preserve the *intent and meaning* of the original message.
- Match the *style markers* of the speaker:
  • Word choice (casual vs formal, technical vs simple).  
  • Sentence structure (short, punchy vs long, flowing).  
  • Level of politeness, assertiveness, or enthusiasm.  
  • Use of contractions, slang, emojis, or punctuation style if present.  
- Do not add explanations, only return the final rephrased message.

Rephrased message:`;

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
