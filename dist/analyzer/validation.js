import { z } from 'zod';
// Enums as zod schemas
const FormalitySchema = z.enum(['formal', 'semi-formal', 'casual', 'slang-heavy']);
const PolitenessSchema = z.enum(['polite', 'direct', 'blunt', 'neutral']);
const EmotionSchema = z.enum(['positive', 'negative', 'neutral', 'mixed', 'sarcastic', 'enthusiastic', 'frustrated']);
const ConcisenessSchema = z.enum(['concise', 'detailed', 'verbose', 'balanced']);
const EnergySchema = z.enum(['high-energy', 'moderate', 'low-energy', 'flat', 'normal']);
const HumorSchema = z.enum(['none', 'subtle', 'moderate', 'sarcastic', 'playful', 'heavy']);
const TechnicalitySchema = z.enum(['expert', 'advanced', 'intermediate', 'basic', 'non-technical']);
const EmpathySchema = z.enum(['low', 'moderate', 'high', 'very-high']);
const ConfidenceSchema = z.enum(['low', 'moderate', 'high', 'overconfident', 'assertive', 'confident', 'tentative']);
const QuestionStyleSchema = z.enum(['rhetorical', 'clarifying', 'probing', 'leading', 'direct', 'indirect']);
const GreetingStyleSchema = z.enum(['formal', 'warm', 'casual', 'none', 'minimal']);
const ClosingStyleSchema = z.enum(['formal', 'warm', 'abrupt', 'none', 'casual']);
const InterruptionStyleSchema = z.enum(['frequent', 'moderate', 'rare', 'never']);
const VocabularyLevelSchema = z.enum(['basic', 'intermediate', 'advanced', 'sophisticated']);
const SentenceComplexitySchema = z.enum(['simple', 'moderate', 'complex', 'varied', 'compound']);
const DiscourseMarkersSchema = z.enum(['minimal', 'moderate', 'excessive', 'frequent']);
const ConflictStyleSchema = z.enum(['avoidant', 'accommodating', 'competitive', 'collaborative', 'compromising']);
const FeedbackStyleSchema = z.enum(['direct', 'constructive', 'sandwich', 'indirect', 'gentle', 'harsh']);
// Metrics schema
const MetricsSchema = z.object({
    contractionRate: z.number().min(0).max(1),
    slangRate: z.number().min(0).max(1),
    emojiRate: z.number().min(0).max(1),
    politeMarkerRate: z.number().min(0).max(1),
    imperativeRate: z.number().min(0).max(1),
    sentimentScore: z.number(),
    avgTokens: z.number().min(0),
    stdDevTokens: z.number().min(0),
    exclamationRate: z.number().min(0),
    capsRate: z.number().min(0).max(1),
    questionRate: z.number().min(0),
    interjectionRate: z.number().min(0),
    repetitionRate: z.number().min(0),
    vocabularyDiversity: z.number().min(0).max(1),
    avgSentenceLength: z.number().min(0),
    complexSentenceRate: z.number().min(0).max(1),
    passiveVoiceRate: z.number().min(0).max(1),
    firstPersonRate: z.number().min(0).max(1),
    secondPersonRate: z.number().min(0).max(1),
    thirdPersonRate: z.number().min(0).max(1),
    uncertaintyMarkers: z.number().min(0),
    confidenceMarkers: z.number().min(0),
    humorIndicators: z.number().min(0),
    technicalTermRate: z.number().min(0),
    empathyMarkers: z.number().min(0),
    timeMarkers: z.number().min(0),
    spatialMarkers: z.number().min(0),
});
// Main ToneProfile schema
export const ToneProfileSchema = z.object({
    // Core Communication Style
    formality: FormalitySchema,
    politeness: PolitenessSchema,
    emotion: EmotionSchema,
    conciseness: ConcisenessSchema,
    energy: EnergySchema,
    // Personality Traits
    humor: HumorSchema,
    technicality: TechnicalitySchema,
    empathy: EmpathySchema,
    confidence: ConfidenceSchema,
    // Communication Patterns
    questionStyle: QuestionStyleSchema,
    greetingStyle: GreetingStyleSchema,
    closingStyle: ClosingStyleSchema,
    interruptionStyle: InterruptionStyleSchema,
    responsePattern: z.enum(['quick', 'deliberate', 'thoughtful', 'reactive', 'spontaneous', 'immediate']),
    // Linguistic Characteristics
    vocabularyLevel: VocabularyLevelSchema,
    sentenceComplexity: SentenceComplexitySchema,
    discourseMarkers: DiscourseMarkersSchema,
    // Personalization Elements
    signaturePhrases: z.array(z.string()),
    commonWords: z.array(z.string()),
    avoidedWords: z.array(z.string()),
    communicationQuirks: z.array(z.string()),
    // Behavioral Patterns
    conflictStyle: ConflictStyleSchema,
    feedbackStyle: FeedbackStyleSchema,
    // Metrics
    metrics: MetricsSchema,
});
// Type guards
export function isValidToneProfile(profile) {
    return ToneProfileSchema.safeParse(profile).success;
}
// Validation function with detailed error reporting
export function validateToneProfile(profile) {
    const result = ToneProfileSchema.safeParse(profile);
    if (!result.success) {
        return { success: false, error: result.error };
    }
    return { success: true };
}
// Create a default tone profile with all required fields
export function createDefaultToneProfile(overrides = {}) {
    const defaultProfile = {
        formality: 'semi-formal',
        politeness: 'direct',
        emotion: 'neutral',
        conciseness: 'concise',
        energy: 'moderate',
        humor: 'none',
        technicality: 'non-technical',
        empathy: 'moderate',
        confidence: 'moderate',
        questionStyle: 'clarifying',
        greetingStyle: 'casual',
        closingStyle: 'none',
        interruptionStyle: 'moderate',
        responsePattern: 'deliberate',
        vocabularyLevel: 'intermediate',
        sentenceComplexity: 'moderate',
        discourseMarkers: 'moderate',
        signaturePhrases: [],
        commonWords: [],
        avoidedWords: [],
        communicationQuirks: [],
        conflictStyle: 'collaborative',
        feedbackStyle: 'constructive',
        metrics: {
            contractionRate: 0.5,
            slangRate: 0,
            emojiRate: 0.1,
            politeMarkerRate: 0.5,
            imperativeRate: 0.3,
            sentimentScore: 0,
            avgTokens: 10,
            stdDevTokens: 5,
            exclamationRate: 0.1,
            capsRate: 0.05,
            questionRate: 0.2,
            interjectionRate: 0.1,
            repetitionRate: 0,
            vocabularyDiversity: 0.7,
            avgSentenceLength: 12,
            complexSentenceRate: 0.3,
            passiveVoiceRate: 0.2,
            firstPersonRate: 0.5,
            secondPersonRate: 0.3,
            thirdPersonRate: 0.2,
            uncertaintyMarkers: 0,
            confidenceMarkers: 0,
            humorIndicators: 0,
            technicalTermRate: 0,
            empathyMarkers: 0,
            timeMarkers: 0,
            spatialMarkers: 0,
        },
    };
    return { ...defaultProfile, ...overrides };
}
