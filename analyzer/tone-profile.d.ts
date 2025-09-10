// Centralized type definitions for tone analysis

export type Formality = 'formal' | 'semi-formal' | 'casual' | 'slang-heavy';
export type Politeness = 'polite' | 'direct' | 'blunt';
export type Emotion = 'positive' | 'negative' | 'neutral' | 'mixed';
export type Conciseness = 'concise' | 'detailed' | 'verbose';
export type Energy = 'high-energy' | 'moderate' | 'low-energy';
export type Humor = 'none' | 'subtle' | 'moderate' | 'sarcastic' | 'playful';
export type Technicality = 'non-technical' | 'semi-technical' | 'highly-technical';
export type Empathy = 'low' | 'moderate' | 'high';
export type Confidence = 'low' | 'moderate' | 'high' | 'overconfident';

export type QuestionStyle = 'rhetorical' | 'clarifying' | 'probing' | 'leading';
export type GreetingStyle = 'formal' | 'warm' | 'casual' | 'none';
export type ClosingStyle = 'formal' | 'warm' | 'abrupt' | 'none';
export type InterruptionStyle = 'frequent' | 'moderate' | 'rare' | 'never';

export type VocabularyLevel = 'basic' | 'intermediate' | 'advanced' | 'sophisticated';
export type SentenceComplexity = 'simple' | 'moderate' | 'complex' | 'varied';
export type DiscourseMarkers = 'minimal' | 'moderate' | 'excessive';

export type ConflictStyle = 'avoidant' | 'accommodating' | 'competitive' | 'collaborative' | 'compromising';
export type FeedbackStyle = 'direct' | 'constructive' | 'sandwich' | 'indirect';

export interface Metrics {
  contractionRate: number;
  slangRate: number;
  emojiRate: number;
  politeMarkerRate: number;
  imperativeRate: number;
  sentimentScore: number;
  avgTokens: number;
  stdDevTokens: number;
  exclamationRate: number;
  capsRate: number;
  questionRate: number;
  interjectionRate: number;
  repetitionRate: number;
  vocabularyDiversity: number;
  avgSentenceLength: number;
  complexSentenceRate: number;
  passiveVoiceRate: number;
  firstPersonRate: number;
  secondPersonRate: number;
  thirdPersonRate: number;
  uncertaintyMarkers: number;
  confidenceMarkers: number;
  humorIndicators: number;
  technicalTermRate: number;
  empathyMarkers: number;
  timeMarkers: number;
  spatialMarkers: number;
}

export interface ToneProfile {
  // Core Communication Style
  formality: Formality;
  politeness: Politeness;
  emotion: Emotion;
  conciseness: Conciseness;
  energy: Energy;

  // Personality Traits
  humor: Humor;
  technicality: Technicality;
  empathy: Empathy;
  confidence: Confidence;

  // Communication Patterns
  questionStyle: QuestionStyle;
  greetingStyle: GreetingStyle;
  closingStyle: ClosingStyle;
  interruptionStyle: InterruptionStyle;
  responsePattern: 'quick' | 'deliberate' | 'thoughtful' | 'reactive';

  // Linguistic Characteristics
  vocabularyLevel: VocabularyLevel;
  sentenceComplexity: SentenceComplexity;
  discourseMarkers: DiscourseMarkers;

  // Personalization Elements
  signaturePhrases: string[];
  commonWords: string[];
  avoidedWords: string[];
  communicationQuirks: string[];

  // Behavioral Patterns
  conflictStyle: ConflictStyle;
  feedbackStyle: FeedbackStyle;

  // Metrics
  metrics: Metrics;
}
