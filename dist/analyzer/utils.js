// utils.ts
// Utility functions for tone analysis
import { EMOJI_RE, EXCESSIVE_EXCLAMATION_RE, EXCESSIVE_QUESTION_RE, EXCESSIVE_ELLIPSIS_RE, CAPS_WORDS_RE, LETTER_REPETITION_RE } from './patterns';
// Basic statistical functions
export function countMatches(text, re) {
    const matches = text.match(re);
    return matches ? matches.length : 0;
}
export function avg(arr) {
    return arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
}
export function stdDev(arr) {
    const m = avg(arr);
    const v = avg(arr.map(x => (x - m) ** 2));
    return Math.sqrt(v);
}
// Vocabulary analysis
export function getVocabularyDiversity(text) {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
}
export function getMostFrequentWords(text, limit = 10) {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    return Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([word]) => word);
}
// Signature phrase extraction
export function extractSignaturePhrases(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    // Look for repeated phrases (2+ words)
    const phraseCount = {};
    sentences.forEach(sentence => {
        const words = sentence.trim().split(/\s+/);
        for (let i = 0; i < words.length - 1; i++) {
            const phrase = `${words[i]} ${words[i + 1]}`.toLowerCase();
            phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
        }
    });
    return Object.entries(phraseCount)
        .filter(([, count]) => count >= 2)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([phrase]) => phrase);
}
// Communication quirks detection
export function detectCommunicationQuirks(text) {
    const quirks = [];
    // Check for excessive punctuation
    if (countMatches(text, EXCESSIVE_EXCLAMATION_RE) > 0)
        quirks.push('excessive exclamation');
    if (countMatches(text, EXCESSIVE_QUESTION_RE) > 0)
        quirks.push('excessive questioning');
    if (countMatches(text, EXCESSIVE_ELLIPSIS_RE) > 0)
        quirks.push('excessive ellipsis');
    // Check for all caps usage
    if (countMatches(text, CAPS_WORDS_RE) > 0)
        quirks.push('frequent caps');
    // Check for repeated letters
    if (countMatches(text, LETTER_REPETITION_RE) > 0)
        quirks.push('letter repetition');
    // Check for emoji usage patterns
    if (countMatches(text, EMOJI_RE) > 5)
        quirks.push('heavy emoji usage');
    return quirks;
}
// Avoided words detection
export function getAvoidedWords(text, commonWords, totalWords) {
    return commonWords.filter(word => !text.toLowerCase().includes(word) ||
        countMatches(text, new RegExp(`\\b${word}\\b`, 'gi')) < totalWords * 0.01);
}
// Sentiment analysis
export function calculateSentimentScore(messages, positiveWords, negativeWords) {
    let sentimentScore = 0;
    messages.forEach(msg => {
        const words = msg.toLowerCase().split(/\W+/);
        words.forEach(w => {
            if (positiveWords.includes(w))
                sentimentScore++;
            if (negativeWords.includes(w))
                sentimentScore--;
        });
    });
    return sentimentScore;
}
// Sentence analysis
export function analyzeSentences(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length);
    const tokenCounts = sentences.map(s => s.trim().split(/\s+/).length);
    return {
        avgTokens: avg(tokenCounts),
        stdDevTokens: stdDev(tokenCounts),
        sentences
    };
}
// Message length analysis
export function analyzeMessageLengths(messages) {
    const messageLengths = messages.map(msg => msg.length);
    const avgLength = avg(messageLengths);
    const lengthVariation = stdDev(messageLengths) / avgLength;
    return { avgLength, lengthVariation };
}
