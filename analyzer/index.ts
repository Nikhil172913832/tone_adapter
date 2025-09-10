// index.ts
// Main analyzer that orchestrates all tone analysis components

import { ToneProfile } from './types';
import { analyzeFormality, analyzePoliteness, analyzeEmotion, analyzeConciseness, analyzeEnergy } from './communication-style';
import { analyzeHumor, analyzeTechnicality, analyzeEmpathy, analyzeConfidence } from './personality-traits';
import { analyzeQuestionStyle, analyzeGreetingStyle, analyzeClosingStyle, analyzeResponsePattern } from './communication-patterns';
import { analyzeVocabularyLevel, analyzeSentenceComplexity, analyzeDiscourseMarkers } from './linguistic-sophistication';
import { analyzePersonalizationElements } from './personalization';
import { analyzeConflictStyle, analyzeFeedbackStyle } from './behavioral-patterns';
import { calculateDetailedMetrics } from './metrics';
import { generateLLMToneProfile } from './llm-generator';

/**
 * Generate a comprehensive tone profile from a list of messages
 * @param messages Array of message strings to analyze
 * @returns Complete tone profile with all analysis results
 */
export function generateToneProfile(messages: string[]): ToneProfile {
	const texts = messages.join('\n');
	const totalMsgs = messages.length;
	const totalWords = texts.split(/\s+/).length;

	// === CORE COMMUNICATION STYLE ===
	const formality = analyzeFormality(texts, totalMsgs);
	const politeness = analyzePoliteness(texts, totalMsgs);
	const emotion = analyzeEmotion(messages, texts, totalMsgs);
	const conciseness = analyzeConciseness(texts);
	const energy = analyzeEnergy(texts, totalMsgs);

	// === ADVANCED PERSONALITY TRAITS ===
	const humor = analyzeHumor(texts, totalMsgs);
	const technicality = analyzeTechnicality(texts, totalMsgs);
	const empathy = analyzeEmpathy(texts, totalMsgs);
	const confidence = analyzeConfidence(texts, totalMsgs);

	// === COMMUNICATION PATTERNS ===
	const questionStyle = analyzeQuestionStyle(texts, totalMsgs);
	const greetingStyle = analyzeGreetingStyle(texts);
	const closingStyle = analyzeClosingStyle(texts);
	const responsePattern = analyzeResponsePattern(messages);

	// === LINGUISTIC SOPHISTICATION ===
	const vocabularyLevel = analyzeVocabularyLevel(texts);
	const sentenceComplexity = analyzeSentenceComplexity(texts);
	const discourseMarkers = analyzeDiscourseMarkers(texts, totalMsgs);

	// === PERSONALIZATION ELEMENTS ===
	const personalization = analyzePersonalizationElements(texts, totalWords);

	// === CONTEXTUAL BEHAVIOR ===
	const conflictStyle = analyzeConflictStyle(texts, messages, totalMsgs);
	const feedbackStyle = analyzeFeedbackStyle(texts, messages, totalMsgs);

	// === DETAILED METRICS ===
	const metrics = calculateDetailedMetrics(texts, messages, totalMsgs);

	return {
		// Core Communication Style
		formality,
		politeness,
		emotion,
		conciseness,
		energy,
		
		// Advanced Personality Traits
		humor,
		technicality,
		empathy,
		confidence,
		
		// Communication Patterns
		questionStyle,
		greetingStyle,
		closingStyle,
		interruptionStyle: 'moderate', // Would need timing data to determine accurately
		
		// Linguistic Sophistication
		vocabularyLevel,
		sentenceComplexity,
		discourseMarkers,
		
		// Personalization Elements
		signaturePhrases: personalization.signaturePhrases,
		commonWords: personalization.commonWords,
		avoidedWords: personalization.avoidedWords,
		communicationQuirks: personalization.communicationQuirks,
		
		// Contextual Behavior
		responsePattern,
		conflictStyle,
		feedbackStyle,
		
		// Detailed Metrics
		metrics
	};
}

// Re-export the LLM generator function
export { generateLLMToneProfile };

// Re-export types for external use
export type { ToneProfile } from './types';
