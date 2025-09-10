// types.ts
// Type definitions for the tone profile analysis system

// Re-export all types from tone-profile.d.ts
export * from './tone-profile';

/**
 * Represents the result of an analysis operation
 * @template T The type of the analysis result value
 */
export interface AnalysisResult<T = any> {
  /** The analysis result value */
  value: T;
  /** Confidence score between 0 and 1 */
  confidence: number;
  /** Additional metrics about the analysis */
  metrics: number[];
}

/**
 * Defines a pattern for linguistic analysis
 */
export interface LinguisticPattern {
  /** Regular expression to match the pattern */
  pattern: RegExp;
  /** Weight of this pattern in analysis (0-1) */
  weight: number;
  /** Category this pattern belongs to */
  category: string;
}
