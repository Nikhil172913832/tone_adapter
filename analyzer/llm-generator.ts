// llm-generator.ts
// LLM-friendly tone profile generation

import { 
  ToneProfile, 
  Formality, 
  Politeness, 
  Emotion, 
  Conciseness, 
  Energy, 
  Humor, 
  Technicality, 
  Empathy, 
  Confidence, 
  QuestionStyle, 
  GreetingStyle, 
  ClosingStyle, 
  VocabularyLevel, 
  SentenceComplexity, 
  DiscourseMarkers, 
  ConflictStyle, 
  FeedbackStyle, 
  InterruptionStyle
} from './tone-profile';
import { validateToneProfile } from './validation';

type DescriptionMap<T extends string> = Record<T, string>;

// Helper function to format percentage values
const formatPercent = (value: number, decimals = 1): string => 
  `${(value * 100).toFixed(decimals)}%`;

// Helper function to format number with decimals
const formatNumber = (value: number, decimals = 1): string => 
  value.toFixed(decimals);

// Helper function to create a section with a title and items
const createSection = (title: string, items: string[]): string[] => [
  `## ${title}`,
  ...items,
  ''
];

// Helper function to create a key-value pair with description
const createKeyValue = <T extends string>(
  key: string, 
  value: T, 
  descriptions: DescriptionMap<T>
): string => `**${key}**: ${value} - ${descriptions[value] || 'No description available'}`;

// Description maps for each tone profile property
const INTERRUPTION_STYLE_DESCRIPTIONS: DescriptionMap<InterruptionStyle> = {
  'frequent': 'Interrupts often during conversation',
  'moderate': 'Occasionally interrupts, but not disruptive',
  'rare': 'Rarely interrupts, generally waits for others to finish',
  'never': 'Never interrupts, always waits for others to finish speaking'
};

const RESPONSE_PATTERN_DESCRIPTIONS: DescriptionMap<'quick' | 'deliberate' | 'thoughtful' | 'reactive' | 'spontaneous' | 'immediate'> = {
  'quick': 'Responds rapidly, often without delay',
  'deliberate': 'Takes time to consider before responding',
  'thoughtful': 'Gives well-considered, reflective responses',
  'reactive': 'Responds directly to the previous message',
  'spontaneous': 'Responds in an unplanned, impulsive manner',
  'immediate': 'Replies instantly, with little to no pause'
};
const FORMALITY_DESCRIPTIONS: DescriptionMap<Formality> = {
  'formal': 'Professional language, no contractions, formal vocabulary',
  'semi-formal': 'Some contractions, mixed formal/casual vocabulary',
  'casual': 'Frequent contractions, everyday language, some slang',
  'slang-heavy': 'Heavy use of slang, internet abbreviations, informal expressions'
};

const POLITENESS_DESCRIPTIONS: DescriptionMap<Politeness> = {
  'polite': 'Frequent use of "please", "thank you", "could you", apologetic language',
  'direct': 'Straightforward communication, minimal politeness markers',
  'blunt': 'Very direct, potentially harsh, minimal softening language',
  'neutral': 'Neither overtly polite nor impolite; balanced tone'
};

const EMOTION_DESCRIPTIONS: DescriptionMap<Emotion> = {
  'positive': 'Upbeat, optimistic language and sentiment',
  'negative': 'Pessimistic, critical, or frustrated tone',
  'neutral': 'Balanced emotional expression',
  'mixed': 'Combination of different emotional tones',
  'sarcastic': 'Ironic, mocking, or satirical emotional tone',
  'enthusiastic': 'Excited, passionate, and energetic emotional tone',
  'frustrated': 'Impatient, annoyed, or dissatisfied emotional tone'
};

const CONCISENESS_DESCRIPTIONS: DescriptionMap<Conciseness> = {
  'concise': 'Short, to-the-point messages',
  'detailed': 'Thorough explanations with additional context',
  'verbose': 'Lengthy, detailed communications with extensive explanations',
  'balanced': 'Balanced between concise and detailed'
};

const ENERGY_DESCRIPTIONS: DescriptionMap<Energy> = {
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
export function generateLLMToneProfile(profile: ToneProfile): string {
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
        : [`7. ${profile.signaturePhrases.length > 0 ? `Incorporate signature phrases like "${profile.signaturePhrases[0]}"` : 'Avoid signature phrases'}`]
      ),
      ...(profile.discourseMarkers === 'excessive'
        ? [`9. ${profile.communicationQuirks.length > 0 ? `Include quirks: ${profile.communicationQuirks.join(', ')}` : 'Maintain clean communication style'}`]
        : [`8. ${profile.communicationQuirks.length > 0 ? `Include quirks: ${profile.communicationQuirks.join(', ')}` : 'Maintain clean communication style'}`]
      )
    ])
  ];

  return sections.join('\n');
}

// Description maps for the remaining properties
const HUMOR_DESCRIPTIONS: DescriptionMap<Humor> = {
  'none': 'No humor detected',
  'subtle': 'Occasional, understated humor',
  'moderate': 'Regular but balanced use of humor',
  'sarcastic': 'Ironic, mocking, or satirical humor',
  'playful': 'Light-hearted and fun humor',
  'heavy': 'Frequent, intense use of humor'
};

const TECHNICALITY_DESCRIPTIONS: DescriptionMap<Technicality> = {
  'expert': 'Expert-level technical language and concepts',
  'advanced': 'Advanced technical terminology and explanations',
  'intermediate': 'Intermediate technical terms, some explanations',
  'basic': 'Basic technical terms with explanations',
  'non-technical': 'No technical terminology used'
};

const EMPATHY_DESCRIPTIONS: DescriptionMap<Empathy> = {
  'low': 'Minimal emotional consideration for others',
  'moderate': 'Balanced emotional consideration',
  'high': 'High level of emotional consideration and understanding',
  'very-high': 'Exceptionally empathetic and understanding'
};

const CONFIDENCE_DESCRIPTIONS: DescriptionMap<Confidence> = {
  'low': 'Hesitant, uncertain language',
  'moderate': 'Balanced confidence',
  'high': 'Assertive, self-assured language',
  'overconfident': 'Overly assertive, potentially dismissive of others',
  'assertive': 'Confident and direct, but not overbearing',
  'confident': 'Self-assured and positive',
  'tentative': 'Cautious, hesitant, or unsure'
};

const QUESTION_STYLE_DESCRIPTIONS: DescriptionMap<QuestionStyle> = {
  'rhetorical': 'Questions used for effect rather than to get information',
  'clarifying': 'Questions that seek to understand better',
  'probing': 'In-depth questions that explore a topic',
  'leading': 'Questions that suggest a particular answer',
  'direct': 'Straightforward, explicit questions',
  'indirect': 'Subtle, implied questions'
};

const GREETING_STYLE_DESCRIPTIONS: DescriptionMap<GreetingStyle> = {
  'formal': 'Professional, traditional greetings',
  'warm': 'Friendly, welcoming greetings',
  'casual': 'Informal, relaxed greetings',
  'none': 'No greeting, gets straight to the point',
  'minimal': 'Minimal or token greeting'
};

const CLOSING_STYLE_DESCRIPTIONS: DescriptionMap<ClosingStyle> = {
  'formal': 'Professional sign-offs',
  'warm': 'Friendly, personal closings',
  'abrupt': 'Ends messages suddenly',
  'none': 'No closing, ends with the last point',
  'casual': 'Informal, relaxed closing'
};

const VOCABULARY_LEVEL_DESCRIPTIONS: DescriptionMap<VocabularyLevel> = {
  'basic': 'Simple, everyday vocabulary',
  'intermediate': 'Good range of vocabulary',
  'advanced': 'Sophisticated word choice',
  'sophisticated': 'Sophisticated vocabulary in short, punchy sentences'
};

const SENTENCE_COMPLEXITY_DESCRIPTIONS: DescriptionMap<SentenceComplexity> = {
  'simple': 'Short, straightforward sentences',
  'moderate': 'Mix of simple and complex sentences',
  'complex': 'Longer, more complex sentence structures',
  'varied': 'Wide range of sentence structures',
  'compound': 'Sentences with two or more independent clauses'
};

const DISCOURSE_MARKERS_DESCRIPTIONS: DescriptionMap<DiscourseMarkers> = {
  'minimal': 'Few transition words or phrases',
  'moderate': 'Appropriate use of transitions',
  'excessive': 'Overuse of transition words and phrases',
  'frequent': 'Frequent use of discourse markers'
};

const CONFLICT_STYLE_DESCRIPTIONS: DescriptionMap<ConflictStyle> = {
  'avoidant': 'Avoids direct confrontation',
  'accommodating': 'Seeks to please others in conflict',
  'competitive': 'Seeks to win in conflict situations',
  'collaborative': 'Works with others to find solutions',
  'compromising': 'Seeks middle ground in conflicts'
};

const FEEDBACK_STYLE_DESCRIPTIONS: DescriptionMap<FeedbackStyle> = {
  'direct': 'Straightforward, to-the-point feedback',
  'constructive': 'Balanced feedback with suggestions',
  'sandwich': 'Negative feedback between positive comments',
  'indirect': 'Subtle, implied feedback',
  'gentle': 'Soft, kind, and encouraging feedback',
  'harsh': 'Severe, critical, or blunt feedback'
};

// Helper functions for descriptions (kept for backward compatibility)
function getFormalityDescription(formality: Formality): string {
  return FORMALITY_DESCRIPTIONS[formality] || '';
}

function getPolitenessDescription(politeness: Politeness): string {
  return POLITENESS_DESCRIPTIONS[politeness] || '';
}

function getEmotionDescription(emotion: Emotion): string {
  return EMOTION_DESCRIPTIONS[emotion] || '';
}

function getConcisenessDescription(conciseness: Conciseness): string {
  return CONCISENESS_DESCRIPTIONS[conciseness] || '';
}

function getEnergyDescription(energy: Energy): string {
  return ENERGY_DESCRIPTIONS[energy] || '';
}

function getHumorDescription(humor: Humor): string {
  return HUMOR_DESCRIPTIONS[humor] || '';
}

function getTechnicalityDescription(technicality: Technicality): string {
  return TECHNICALITY_DESCRIPTIONS[technicality] || '';
}

function getEmpathyDescription(empathy: Empathy): string {
  return EMPATHY_DESCRIPTIONS[empathy] || '';
}

function getConfidenceDescription(confidence: Confidence): string {
  return CONFIDENCE_DESCRIPTIONS[confidence] || '';
}

function getQuestionStyleDescription(questionStyle: QuestionStyle): string {
  return QUESTION_STYLE_DESCRIPTIONS[questionStyle] || '';
}

function getGreetingStyleDescription(greetingStyle: GreetingStyle): string {
  return GREETING_STYLE_DESCRIPTIONS[greetingStyle] || '';
}

function getClosingStyleDescription(closingStyle: ClosingStyle): string {
  return CLOSING_STYLE_DESCRIPTIONS[closingStyle] || '';
}

function getVocabularyLevelDescription(vocabularyLevel: VocabularyLevel): string {
  return VOCABULARY_LEVEL_DESCRIPTIONS[vocabularyLevel] || '';
}

function getSentenceComplexityDescription(complexity: SentenceComplexity): string {
  return SENTENCE_COMPLEXITY_DESCRIPTIONS[complexity] || '';
}

function getDiscourseMarkersDescription(markers: DiscourseMarkers): string {
  return DISCOURSE_MARKERS_DESCRIPTIONS[markers] || '';
}

function getConflictStyleDescription(style: ConflictStyle): string {
  return CONFLICT_STYLE_DESCRIPTIONS[style] || '';
}

function getFeedbackStyleDescription(style: FeedbackStyle): string {
  return FEEDBACK_STYLE_DESCRIPTIONS[style] || '';
}

function getInterruptionStyleDescription(interruptionStyle: InterruptionStyle): string {
  return INTERRUPTION_STYLE_DESCRIPTIONS[interruptionStyle] || '';
}

function getResponsePatternDescription(pattern: 'quick' | 'deliberate' | 'thoughtful' | 'reactive' | 'spontaneous' | 'immediate'): string {
  return RESPONSE_PATTERN_DESCRIPTIONS[pattern] || 'No specific response pattern detected';
}
