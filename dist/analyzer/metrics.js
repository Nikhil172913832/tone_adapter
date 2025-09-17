// metrics.ts
// Detailed metrics calculation
import { CONTRACTION_RE, SLANG_RE, EMOJI_RE, POLITE_RE, IMPERATIVE_RE, QUESTION_RE, INTERJECTION_RE, REPETITION_RE, COMPLEX_SENTENCE_RE, PASSIVE_VOICE_RE, FIRST_PERSON_RE, SECOND_PERSON_RE, THIRD_PERSON_RE, UNCERTAINTY_RE, CONFIDENCE_RE, HUMOR_RE, TECHNICAL_RE, EMPATHY_RE, TIME_RE, SPATIAL_RE, POSITIVE_WORDS, NEGATIVE_WORDS } from './patterns';
import { countMatches, getVocabularyDiversity, analyzeSentences, calculateSentimentScore } from './utils';
export function calculateDetailedMetrics(texts, messages, totalMsgs) {
    const totalWords = texts.split(/\s+/).length;
    const sentences = texts.split(/[.!?]+/).filter(s => s.trim().length);
    const { avgTokens, stdDevTokens } = analyzeSentences(texts);
    // Basic linguistic metrics
    const contractionRate = countMatches(texts, CONTRACTION_RE) / totalMsgs;
    const slangRate = countMatches(texts, SLANG_RE) / totalMsgs;
    const emojiRate = countMatches(texts, EMOJI_RE) / totalMsgs;
    const politeMarkerRate = countMatches(texts, POLITE_RE) / totalMsgs;
    const imperativeRate = countMatches(texts, IMPERATIVE_RE) / totalMsgs;
    const sentimentScore = calculateSentimentScore(messages, POSITIVE_WORDS, NEGATIVE_WORDS);
    const exclamationRate = countMatches(texts, /!/g) / totalMsgs;
    const capsRate = countMatches(texts, /\b[A-Z]{2,}\b/g) / totalMsgs;
    // Advanced metrics
    const questionRate = countMatches(texts, QUESTION_RE) / totalMsgs;
    const interjectionRate = countMatches(texts, INTERJECTION_RE) / totalMsgs;
    const repetitionRate = countMatches(texts, REPETITION_RE) / totalMsgs;
    const vocabularyDiversity = getVocabularyDiversity(texts);
    const complexSentenceRate = countMatches(texts, COMPLEX_SENTENCE_RE) / sentences.length;
    const passiveVoiceRate = countMatches(texts, PASSIVE_VOICE_RE) / sentences.length;
    const firstPersonRate = countMatches(texts, FIRST_PERSON_RE) / totalMsgs;
    const secondPersonRate = countMatches(texts, SECOND_PERSON_RE) / totalMsgs;
    const thirdPersonRate = countMatches(texts, THIRD_PERSON_RE) / totalMsgs;
    const uncertaintyMarkers = countMatches(texts, UNCERTAINTY_RE) / totalMsgs;
    const confidenceMarkers = countMatches(texts, CONFIDENCE_RE) / totalMsgs;
    const humorIndicators = countMatches(texts, HUMOR_RE) / totalMsgs;
    const technicalTermRate = countMatches(texts, TECHNICAL_RE) / totalMsgs;
    const empathyMarkers = countMatches(texts, EMPATHY_RE) / totalMsgs;
    const timeMarkers = countMatches(texts, TIME_RE) / totalMsgs;
    const spatialMarkers = countMatches(texts, SPATIAL_RE) / totalMsgs;
    return {
        // Basic linguistic metrics
        contractionRate,
        slangRate,
        emojiRate,
        politeMarkerRate,
        imperativeRate,
        sentimentScore,
        avgTokens,
        stdDevTokens,
        exclamationRate,
        capsRate,
        // Advanced metrics
        questionRate,
        interjectionRate,
        repetitionRate,
        vocabularyDiversity,
        avgSentenceLength: avgTokens,
        complexSentenceRate,
        passiveVoiceRate,
        firstPersonRate,
        secondPersonRate,
        thirdPersonRate,
        uncertaintyMarkers,
        confidenceMarkers,
        humorIndicators,
        technicalTermRate,
        empathyMarkers,
        timeMarkers,
        spatialMarkers
    };
}
