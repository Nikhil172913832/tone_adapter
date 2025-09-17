// behavioral-patterns.ts
// Behavioral patterns analysis
import { POLITE_RE, IMPERATIVE_RE } from './patterns';
import { countMatches, calculateSentimentScore } from './utils';
import { POSITIVE_WORDS, NEGATIVE_WORDS } from './patterns';
export function analyzeConflictStyle(texts, messages, totalMsgs) {
    const sentimentScore = calculateSentimentScore(messages, POSITIVE_WORDS, NEGATIVE_WORDS);
    const politeCount = countMatches(texts, POLITE_RE);
    const imperativeCount = countMatches(texts, IMPERATIVE_RE);
    const politeMarkerRate = politeCount / totalMsgs;
    const imperativeRate = imperativeCount / totalMsgs;
    if (sentimentScore < -totalMsgs * 0.3 && imperativeRate > 0.2)
        return 'competitive';
    else if (sentimentScore < -totalMsgs * 0.1)
        return 'avoidant';
    else if (politeMarkerRate > 0.15)
        return 'accommodating';
    else
        return 'collaborative';
}
export function analyzeFeedbackStyle(texts, messages, totalMsgs) {
    const sentimentScore = calculateSentimentScore(messages, POSITIVE_WORDS, NEGATIVE_WORDS);
    const politeCount = countMatches(texts, POLITE_RE);
    const imperativeCount = countMatches(texts, IMPERATIVE_RE);
    const politeMarkerRate = politeCount / totalMsgs;
    const imperativeRate = imperativeCount / totalMsgs;
    if (imperativeRate > 0.3)
        return 'direct';
    else if (politeMarkerRate > 0.2)
        return 'gentle';
    else if (sentimentScore < -totalMsgs * 0.2)
        return 'harsh';
    else
        return 'constructive';
}
