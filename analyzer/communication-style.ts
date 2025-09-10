// communication-style.ts
// Core communication style analysis

import { ToneProfile } from './types';
import { 
	CONTRACTION_RE, SLANG_RE, EMOJI_RE, POLITE_RE, IMPERATIVE_RE,
	POSITIVE_EMOJI_RE, NEGATIVE_EMOJI_RE, SARCASM_RE, POSITIVE_WORDS, NEGATIVE_WORDS
} from './patterns';
import { countMatches, calculateSentimentScore, analyzeSentences } from './utils';

export function analyzeFormality(texts: string, totalMsgs: number): ToneProfile['formality'] {
	const contractionCount = countMatches(texts, CONTRACTION_RE);
	const slangCount = countMatches(texts, SLANG_RE);
	const contractionRate = contractionCount / totalMsgs;
	const slangRate = slangCount / totalMsgs;
	
	if (slangRate > 0.2) return 'slang-heavy';
	else if (slangRate > 0.1 || contractionRate > 0.2) return 'casual';
	else if (contractionRate > 0.05) return 'semi-formal';
	else return 'formal';
}

export function analyzePoliteness(texts: string, totalMsgs: number): ToneProfile['politeness'] {
	const politeCount = countMatches(texts, POLITE_RE);
	const imperativeCount = countMatches(texts, IMPERATIVE_RE);
	const politeMarkerRate = politeCount / totalMsgs;
	const imperativeRate = imperativeCount / totalMsgs;
	
	if (politeMarkerRate > 0.1) return 'polite';
	else if (imperativeRate > 0.3) return 'blunt';
	else if (imperativeRate > 0.1) return 'direct';
	else return 'neutral';
}

export function analyzeEmotion(messages: string[], texts: string, totalMsgs: number): ToneProfile['emotion'] {
	let sentimentScore = calculateSentimentScore(messages, POSITIVE_WORDS, NEGATIVE_WORDS);
	sentimentScore += countMatches(texts, POSITIVE_EMOJI_RE);
	sentimentScore -= countMatches(texts, NEGATIVE_EMOJI_RE);
	
	if (SARCASM_RE.test(texts)) return 'sarcastic';
	else if (sentimentScore > totalMsgs * 0.5) return 'enthusiastic';
	else if (sentimentScore > 0) return 'positive';
	else if (sentimentScore < -totalMsgs * 0.5) return 'frustrated';
	else if (sentimentScore < 0) return 'negative';
	else return 'neutral';
}

export function analyzeConciseness(texts: string): ToneProfile['conciseness'] {
	const { avgTokens } = analyzeSentences(texts);
	
	if (avgTokens < 10) return 'concise';
	else if (avgTokens > 20) return 'verbose';
	else return 'balanced';
}

export function analyzeEnergy(texts: string, totalMsgs: number): ToneProfile['energy'] {
	const exclamationCount = countMatches(texts, /!/g);
	const exclamationRate = exclamationCount / totalMsgs;
	const capsCount = countMatches(texts, /\b[A-Z]{2,}\b/g);
	const capsRate = capsCount / totalMsgs;
	
	if (exclamationRate > 1 || capsRate > 0.1) return 'high-energy';
	else if (exclamationRate < 0.1 && capsRate < 0.02) return 'flat';
	else return 'normal';
}
