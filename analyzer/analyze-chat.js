// Import the analyzer functions
import { analyzeTone } from './tone-analyzer.js';

export async function analyzeChatMessages(messages) {
  try {
    // Extract text content from messages
    const messageTexts = messages
      .filter(msg => msg.text && msg.text.trim() !== '')
      .map(msg => ({
        text: msg.text,
        isOutgoing: msg.isOutgoing || false,
        timestamp: msg.timestamp || Date.now()
      }));

    if (messageTexts.length === 0) {
      console.log('[tone_adapter] No valid messages to analyze');
      return null;
    }

    // Analyze the tone of the messages
    const toneProfile = await analyzeTone(messageTexts);
    return toneProfile;
  } catch (error) {
    console.error('[tone_adapter] Error analyzing chat messages:', error);
    return null;
  }
}

export async function saveToneProfile(chatId, toneProfile) {
  try {
    const profiles = await getStoredToneProfiles();
    profiles[chatId] = {
      ...toneProfile,
      lastUpdated: new Date().toISOString()
    };
    
    await chrome.storage.local.set({ toneProfiles: profiles });
    console.log(`[tone_adapter] Saved tone profile for chat: ${chatId}`);
    return true;
  } catch (error) {
    console.error('[tone_adapter] Error saving tone profile:', error);
    return false;
  }
}

export async function getToneProfile(chatId) {
  try {
    const profiles = await getStoredToneProfiles();
    return profiles[chatId] || null;
  } catch (error) {
    console.error('[tone_adapter] Error getting tone profile:', error);
    return null;
  }
}

async function getStoredToneProfiles() {
  try {
    const result = await chrome.storage.local.get('toneProfiles');
    return result.toneProfiles || {};
  } catch (error) {
    console.error('[tone_adapter] Error getting stored tone profiles:', error);
    return {};
  }
}
