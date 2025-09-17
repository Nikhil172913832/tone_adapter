// Centralized type definitions for tone analysis

export type Formality = 'formal' | 'semi-formal' | 'casual' | 'slang-heavy';
export type Politeness = 'polite' | 'direct' | 'blunt' | 'neutral';
export type Emotion = 'positive' | 'negative' | 'neutral' | 'mixed' | 'sarcastic' | 'enthusiastic' | 'frustrated';
export type Conciseness = 'concise' | 'detailed' | 'verbose' | 'balanced';
export type Energy = 'high-energy' | 'moderate' | 'low-energy' | 'flat' | 'normal';
export type Humor = 'none' | 'subtle' | 'moderate' | 'sarcastic' | 'playful' | 'heavy';
export type Technicality = 'expert' | 'advanced' | 'intermediate' | 'basic' | 'non-technical';
export type Empathy = 'low' | 'moderate' | 'high' | 'very-high';
export type Confidence = 'low' | 'moderate' | 'high' | 'overconfident' | 'assertive' | 'confident' | 'tentative';

export type QuestionStyle = 'rhetorical' | 'clarifying' | 'probing' | 'leading' | 'direct' | 'indirect';
export type GreetingStyle = 'formal' | 'warm' | 'casual' | 'none'| 'minimal';
export type ClosingStyle = 'formal' | 'warm' | 'abrupt' | 'none' | 'casual';
export type InterruptionStyle = 'frequent' | 'moderate' | 'rare' | 'never';

export type VocabularyLevel = 'basic' | 'intermediate' | 'advanced' | 'sophisticated';
export type SentenceComplexity = 'simple' | 'moderate' | 'complex' | 'varied' | 'compound';
export type DiscourseMarkers = 'minimal' | 'moderate' | 'excessive' | 'frequent';

export type ConflictStyle = 'avoidant' | 'accommodating' | 'competitive' | 'collaborative' | 'compromising';
export type FeedbackStyle = 'direct' | 'constructive' | 'sandwich' | 'indirect'| 'gentle' | 'harsh';

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
  responsePattern: 'quick' | 'deliberate' | 'thoughtful' | 'reactive' | 'spontaneous' | 'immediate';

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
