// personalization.ts
// Personalization elements analysis

import { COMMON_ENGLISH_WORDS } from './patterns';
import { extractSignaturePhrases, getMostFrequentWords, detectCommunicationQuirks, getAvoidedWords } from './utils';

export function analyzePersonalizationElements(texts: string, totalWords: number) {
	const signaturePhrases = extractSignaturePhrases(texts);
	const commonWords = getMostFrequentWords(texts, 10);
	const communicationQuirks = detectCommunicationQuirks(texts);
	const avoidedWords = getAvoidedWords(texts, COMMON_ENGLISH_WORDS, totalWords);
	
	return {
		signaturePhrases,
		commonWords,
		avoidedWords,
		communicationQuirks
	};
}
