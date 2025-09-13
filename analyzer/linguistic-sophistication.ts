// linguistic-sophistication.ts
// Linguistic sophistication analysis

import { ToneProfile } from './types';
import { COMPLEX_SENTENCE_RE, INTERJECTION_RE } from './patterns';
import { countMatches, getVocabularyDiversity, analyzeSentences } from './utils';

export function analyzeVocabularyLevel(texts: string): ToneProfile['vocabularyLevel'] {
	const vocabularyDiversity = getVocabularyDiversity(texts);
	
	if (vocabularyDiversity > 0.7) return 'sophisticated';
	else if (vocabularyDiversity > 0.6) return 'advanced';
	else if (vocabularyDiversity < 0.4) return 'basic';
	else return 'intermediate';
}

export function analyzeSentenceComplexity(texts: string): ToneProfile['sentenceComplexity'] {
	const { avgTokens, stdDevTokens } = analyzeSentences(texts);
	const complexSentenceCount = countMatches(texts, COMPLEX_SENTENCE_RE);
	const sentences = texts.split(/[.!?]+/).filter(s => s.trim().length);
	const complexSentenceRate = complexSentenceCount / sentences.length;
	
	if (complexSentenceRate > 0.3) return 'complex';
	else if (complexSentenceRate < 0.1) return 'simple';
	else if (stdDevTokens > avgTokens * 0.5) return 'varied';
	else return 'compound';
}

export function analyzeDiscourseMarkers(texts: string, totalMsgs: number): ToneProfile['discourseMarkers'] {
	const interjectionCount = countMatches(texts, INTERJECTION_RE);
	const interjectionRate = interjectionCount / totalMsgs;
	
	if (interjectionRate > 0.2) return 'excessive';
	else if (interjectionRate > 0.1) return 'frequent';
	else if (interjectionRate < 0.05) return 'minimal';
	else return 'moderate';
}
