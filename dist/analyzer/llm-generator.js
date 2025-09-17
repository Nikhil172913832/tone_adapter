// llm-generator.ts
// LLM-friendly tone profile generation
import { validateToneProfile } from './validation';
// Helper function to format percentage values
const formatPercent = (value, decimals = 1) => `${(value * 100).toFixed(decimals)}%`;
// Helper function to format number with decimals
const formatNumber = (value, decimals = 1) => value.toFixed(decimals);
// Helper function to create a section with a title and items
const createSection = (title, items) => [
    `## ${title}`,
    ...items,
    ''
];
// Helper function to create a key-value pair with description
const createKeyValue = (key, value, descriptions) => `**${key}**: ${value} - ${descriptions[value] || 'No description available'}`;
// Description maps for each tone profile property
const INTERRUPTION_STYLE_DESCRIPTIONS = {
    'frequent': 'Interrupts often during conversation',
    'moderate': 'Occasionally interrupts, but not disruptive',
    'rare': 'Rarely interrupts, generally waits for others to finish',
    'never': 'Never interrupts, always waits for others to finish speaking'
};
const RESPONSE_PATTERN_DESCRIPTIONS = {
    'quick': 'Responds rapidly, often without delay',
    'deliberate': 'Takes time to consider before responding',
    'thoughtful': 'Gives well-considered, reflective responses',
    'reactive': 'Responds directly to the previous message',
    'spontaneous': 'Responds in an unplanned, impulsive manner',
    'immediate': 'Replies instantly, with little to no pause'
};
const FORMALITY_DESCRIPTIONS = {
    'formal': 'Professional language, no contractions, formal vocabulary',
    'semi-formal': 'Some contractions, mixed formal/casual vocabulary',
    'casual': 'Frequent contractions, everyday language, some slang',
    'slang-heavy': 'Heavy use of slang, internet abbreviations, informal expressions'
};
const POLITENESS_DESCRIPTIONS = {
    'polite': 'Frequent use of "please", "thank you", "could you", apologetic language',
    'direct': 'Straightforward communication, minimal politeness markers',
    'blunt': 'Very direct, potentially harsh, minimal softening language',
    'neutral': 'Neither overtly polite nor impolite; balanced tone'
};
const EMOTION_DESCRIPTIONS = {
    'positive': 'Upbeat, optimistic language and sentiment',
    'negative': 'Pessimistic, critical, or frustrated tone',
    'neutral': 'Balanced emotional expression',
    'mixed': 'Combination of different emotional tones',
    'sarcastic': 'Ironic, mocking, or satirical emotional tone',
    'enthusiastic': 'Excited, passionate, and energetic emotional tone',
    'frustrated': 'Impatient, annoyed, or dissatisfied emotional tone'
};
const CONCISENESS_DESCRIPTIONS = {
    'concise': 'Short, to-the-point messages',
    'detailed': 'Thorough explanations with additional context',
    'verbose': 'Lengthy, detailed communications with extensive explanations',
    'balanced': 'Balanced between concise and detailed'
};
const ENERGY_DESCRIPTIONS = {
    'high-energy': 'Lots of exclamations, emojis, caps',
    'moderate': 'Balanced energy level',
    'low-energy': 'Calm, measured, minimal emphasis',
    'flat': 'Monotone, lacking energy',
    'normal': 'Standard, expected energy level'
};
// ... (other description maps)
/**
 * Generates an LLM-friendly tone profile description
 * @param profile The tone profile to generate a description for
 * @returns Formatted markdown string with the tone profile analysis
 */
export function generateLLMToneProfile(profile) {
    // Validate the profile first
    const { success, error } = validateToneProfile(profile);
    if (!success) {
        console.warn('Invalid tone profile:', error);
        throw new Error('Cannot generate LLM profile: Invalid tone profile data');
    }
    // Build each section of the profile
    const sections = [
        ...createSection('Communication Style Analysis', [
            createKeyValue('Formality', profile.formality, FORMALITY_DESCRIPTIONS),
            createKeyValue('Politeness', profile.politeness, POLITENESS_DESCRIPTIONS),
            createKeyValue('Emotional Tone', profile.emotion, EMOTION_DESCRIPTIONS),
            createKeyValue('Conciseness', profile.conciseness, CONCISENESS_DESCRIPTIONS),
            createKeyValue('Energy Level', profile.energy, ENERGY_DESCRIPTIONS)
        ]),
        // Personality Traits Section
        ...createSection('Personality Traits', [
            `**Humor Style**: ${profile.humor} - ${getHumorDescription(profile.humor)}`,
            `**Technical Level**: ${profile.technicality} - ${getTechnicalityDescription(profile.technicality)}`,
            `**Empathy Level**: ${profile.empathy} - ${getEmpathyDescription(profile.empathy)}`,
            `**Confidence Level**: ${profile.confidence} - ${getConfidenceDescription(profile.confidence)}`
        ]),
        // Communication Patterns Section
        ...createSection('Communication Patterns', [
            `**Question Style**: ${profile.questionStyle} - ${getQuestionStyleDescription(profile.questionStyle)}`,
            `**Greeting Style**: ${profile.greetingStyle} - ${getGreetingStyleDescription(profile.greetingStyle)}`,
            `**Closing Style**: ${profile.closingStyle} - ${getClosingStyleDescription(profile.closingStyle)}`,
            `**Interruption Style**: ${profile.interruptionStyle} - ${getInterruptionStyleDescription(profile.interruptionStyle)}`,
            `**Response Pattern**: ${profile.responsePattern} - ${getResponsePatternDescription(profile.responsePattern)}`
        ]),
        // Linguistic Characteristics Section
        ...createSection('Linguistic Characteristics', [
            `**Vocabulary Level**: ${profile.vocabularyLevel} - ${getVocabularyLevelDescription(profile.vocabularyLevel)}`,
            `**Sentence Complexity**: ${profile.sentenceComplexity} - ${getSentenceComplexityDescription(profile.sentenceComplexity)}`,
            `**Discourse Markers**: ${profile.discourseMarkers} - ${getDiscourseMarkersDescription(profile.discourseMarkers)}`
        ]),
        // Personalization Elements Section
        ...createSection('Personalization Elements', [
            `**Signature Phrases**: ${profile.signaturePhrases.length > 0 ? profile.signaturePhrases.join(', ') : 'None detected'}`,
            `**Common Words**: ${profile.commonWords.slice(0, 5).join(', ')}`,
            `**Communication Quirks**: ${profile.communicationQuirks.length > 0 ? profile.communicationQuirks.join(', ') : 'None detected'}`
        ]),
        // Behavioral Patterns Section
        ...createSection('Behavioral Patterns', [
            `**Conflict Style**: ${profile.conflictStyle} - ${getConflictStyleDescription(profile.conflictStyle)}`,
            `**Feedback Style**: ${profile.feedbackStyle} - ${getFeedbackStyleDescription(profile.feedbackStyle)}`
        ]),
        // Key Metrics Section
        ...createSection('Key Metrics', [
            `- Contraction Rate: ${formatPercent(profile.metrics.contractionRate)}`,
            `- Slang Usage: ${formatPercent(profile.metrics.slangRate)}`,
            `- Emoji Usage: ${formatPercent(profile.metrics.emojiRate)}`,
            `- Question Rate: ${formatPercent(profile.metrics.questionRate)}`,
            `- Vocabulary Diversity: ${formatPercent(profile.metrics.vocabularyDiversity)}`,
            `- Average Sentence Length: ${formatNumber(profile.metrics.avgSentenceLength)} words`
        ]),
        // Adaptation Guidelines Section
        ...createSection('Adaptation Guidelines', [
            'When adapting messages to match this person\'s style:',
            `1. Use ${profile.formality} language with ${profile.politeness} politeness`,
            `2. Maintain ${profile.emotion} emotional tone and ${profile.energy === 'high-energy' ? 'high energy' : profile.energy}`,
            `3. Keep responses ${profile.conciseness} in length`,
            `4. ${profile.humor === 'none' ? 'Avoid humor' : `Use ${profile.humor} humor when appropriate`}`,
            `5. Use ${profile.vocabularyLevel === 'sophisticated' ? 'sophisticated vocabulary in short, punchy sentences' : profile.vocabularyLevel}`,
            `6. Structure sentences with ${profile.sentenceComplexity} complexity`,
            ...(profile.discourseMarkers === 'excessive' ? ['7. Allow frequent use of fillers and transition markers'] : []),
            ...(profile.discourseMarkers === 'excessive'
                ? [`8. ${profile.signaturePhrases.length > 0 ? `Incorporate signature phrases like "${profile.signaturePhrases[0]}"` : 'Avoid signature phrases'}`]
                : [`7. ${profile.signaturePhrases.length > 0 ? `Incorporate signature phrases like "${profile.signaturePhrases[0]}"` : 'Avoid signature phrases'}`]),
            ...(profile.discourseMarkers === 'excessive'
                ? [`9. ${profile.communicationQuirks.length > 0 ? `Include quirks: ${profile.communicationQuirks.join(', ')}` : 'Maintain clean communication style'}`]
                : [`8. ${profile.communicationQuirks.length > 0 ? `Include quirks: ${profile.communicationQuirks.join(', ')}` : 'Maintain clean communication style'}`])
        ])
    ];
    return sections.join('\n');
}
// Description maps for the remaining properties
const HUMOR_DESCRIPTIONS = {
    'none': 'No humor detected',
    'subtle': 'Occasional, understated humor',
    'moderate': 'Regular but balanced use of humor',
    'sarcastic': 'Ironic, mocking, or satirical humor',
    'playful': 'Light-hearted and fun humor',
    'heavy': 'Frequent, intense use of humor'
};
const TECHNICALITY_DESCRIPTIONS = {
    'expert': 'Expert-level technical language and concepts',
    'advanced': 'Advanced technical terminology and explanations',
    'intermediate': 'Intermediate technical terms, some explanations',
    'basic': 'Basic technical terms with explanations',
    'non-technical': 'No technical terminology used'
};
const EMPATHY_DESCRIPTIONS = {
    'low': 'Minimal emotional consideration for others',
    'moderate': 'Balanced emotional consideration',
    'high': 'High level of emotional consideration and understanding',
    'very-high': 'Exceptionally empathetic and understanding'
};
const CONFIDENCE_DESCRIPTIONS = {
    'low': 'Hesitant, uncertain language',
    'moderate': 'Balanced confidence',
    'high': 'Assertive, self-assured language',
    'overconfident': 'Overly assertive, potentially dismissive of others',
    'assertive': 'Confident and direct, but not overbearing',
    'confident': 'Self-assured and positive',
    'tentative': 'Cautious, hesitant, or unsure'
};
const QUESTION_STYLE_DESCRIPTIONS = {
    'rhetorical': 'Questions used for effect rather than to get information',
    'clarifying': 'Questions that seek to understand better',
    'probing': 'In-depth questions that explore a topic',
    'leading': 'Questions that suggest a particular answer',
    'direct': 'Straightforward, explicit questions',
    'indirect': 'Subtle, implied questions'
};
const GREETING_STYLE_DESCRIPTIONS = {
    'formal': 'Professional, traditional greetings',
    'warm': 'Friendly, welcoming greetings',
    'casual': 'Informal, relaxed greetings',
    'none': 'No greeting, gets straight to the point',
    'minimal': 'Minimal or token greeting'
};
const CLOSING_STYLE_DESCRIPTIONS = {
    'formal': 'Professional sign-offs',
    'warm': 'Friendly, personal closings',
    'abrupt': 'Ends messages suddenly',
    'none': 'No closing, ends with the last point',
    'casual': 'Informal, relaxed closing'
};
const VOCABULARY_LEVEL_DESCRIPTIONS = {
    'basic': 'Simple, everyday vocabulary',
    'intermediate': 'Good range of vocabulary',
    'advanced': 'Sophisticated word choice',
    'sophisticated': 'Sophisticated vocabulary in short, punchy sentences'
};
const SENTENCE_COMPLEXITY_DESCRIPTIONS = {
    'simple': 'Short, straightforward sentences',
    'moderate': 'Mix of simple and complex sentences',
    'complex': 'Longer, more complex sentence structures',
    'varied': 'Wide range of sentence structures',
    'compound': 'Sentences with two or more independent clauses'
};
const DISCOURSE_MARKERS_DESCRIPTIONS = {
    'minimal': 'Few transition words or phrases',
    'moderate': 'Appropriate use of transitions',
    'excessive': 'Overuse of transition words and phrases',
    'frequent': 'Frequent use of discourse markers'
};
const CONFLICT_STYLE_DESCRIPTIONS = {
    'avoidant': 'Avoids direct confrontation',
    'accommodating': 'Seeks to please others in conflict',
    'competitive': 'Seeks to win in conflict situations',
    'collaborative': 'Works with others to find solutions',
    'compromising': 'Seeks middle ground in conflicts'
};
const FEEDBACK_STYLE_DESCRIPTIONS = {
    'direct': 'Straightforward, to-the-point feedback',
    'constructive': 'Balanced feedback with suggestions',
    'sandwich': 'Negative feedback between positive comments',
    'indirect': 'Subtle, implied feedback',
    'gentle': 'Soft, kind, and encouraging feedback',
    'harsh': 'Severe, critical, or blunt feedback'
};
// Helper functions for descriptions (kept for backward compatibility)
function getFormalityDescription(formality) {
    return FORMALITY_DESCRIPTIONS[formality] || '';
}
function getPolitenessDescription(politeness) {
    return POLITENESS_DESCRIPTIONS[politeness] || '';
}
function getEmotionDescription(emotion) {
    return EMOTION_DESCRIPTIONS[emotion] || '';
}
function getConcisenessDescription(conciseness) {
    return CONCISENESS_DESCRIPTIONS[conciseness] || '';
}
function getEnergyDescription(energy) {
    return ENERGY_DESCRIPTIONS[energy] || '';
}
function getHumorDescription(humor) {
    return HUMOR_DESCRIPTIONS[humor] || '';
}
function getTechnicalityDescription(technicality) {
    return TECHNICALITY_DESCRIPTIONS[technicality] || '';
}
function getEmpathyDescription(empathy) {
    return EMPATHY_DESCRIPTIONS[empathy] || '';
}
function getConfidenceDescription(confidence) {
    return CONFIDENCE_DESCRIPTIONS[confidence] || '';
}
function getQuestionStyleDescription(questionStyle) {
    return QUESTION_STYLE_DESCRIPTIONS[questionStyle] || '';
}
function getGreetingStyleDescription(greetingStyle) {
    return GREETING_STYLE_DESCRIPTIONS[greetingStyle] || '';
}
function getClosingStyleDescription(closingStyle) {
    return CLOSING_STYLE_DESCRIPTIONS[closingStyle] || '';
}
function getVocabularyLevelDescription(vocabularyLevel) {
    return VOCABULARY_LEVEL_DESCRIPTIONS[vocabularyLevel] || '';
}
function getSentenceComplexityDescription(complexity) {
    return SENTENCE_COMPLEXITY_DESCRIPTIONS[complexity] || '';
}
function getDiscourseMarkersDescription(markers) {
    return DISCOURSE_MARKERS_DESCRIPTIONS[markers] || '';
}
function getConflictStyleDescription(style) {
    return CONFLICT_STYLE_DESCRIPTIONS[style] || '';
}
function getFeedbackStyleDescription(style) {
    return FEEDBACK_STYLE_DESCRIPTIONS[style] || '';
}
function getInterruptionStyleDescription(interruptionStyle) {
    return INTERRUPTION_STYLE_DESCRIPTIONS[interruptionStyle] || '';
}
function getResponsePatternDescription(pattern) {
    return RESPONSE_PATTERN_DESCRIPTIONS[pattern] || 'No specific response pattern detected';
}
