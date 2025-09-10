# Tone Analyzer Module

This directory contains the modular tone analysis system, organized for better maintainability and debugging.

## File Structure

### Core Files
- **`index.ts`** - Main orchestrator that combines all analysis modules
- **`types.ts`** - TypeScript interfaces and type definitions
- **`patterns.ts`** - Regex patterns and linguistic constants
- **`utils.ts`** - Utility functions for text analysis

### Analysis Modules
- **`communication-style.ts`** - Core communication style analysis (formality, politeness, emotion, etc.)
- **`personality-traits.ts`** - Advanced personality traits (humor, technicality, empathy, confidence)
- **`communication-patterns.ts`** - Communication patterns (question style, greetings, closings)
- **`linguistic-sophistication.ts`** - Linguistic analysis (vocabulary, sentence complexity, discourse markers)
- **`personalization.ts`** - Personalization elements (signature phrases, quirks, common words)
- **`behavioral-patterns.ts`** - Behavioral patterns (conflict style, feedback style)
- **`metrics.ts`** - Detailed metrics calculation
- **`llm-generator.ts`** - LLM-friendly profile generation

## Usage

```typescript
import { generateToneProfile, generateLLMToneProfile } from './analyzer';

// Generate tone profile from messages
const profile = generateToneProfile(messages);

// Generate LLM-friendly description
const llmProfile = generateLLMToneProfile(profile);
```

## Benefits of Modular Structure

1. **Easier Debugging** - Each analysis component is isolated and can be tested independently
2. **Better Maintainability** - Changes to specific analysis logic don't affect other components
3. **Improved Readability** - Each file has a focused responsibility
4. **Enhanced Testing** - Individual modules can be unit tested separately
5. **Flexible Extensions** - New analysis features can be added as separate modules

## Adding New Analysis Features

1. Create a new file in the analyzer directory (e.g., `new-feature.ts`)
2. Implement your analysis functions
3. Import and use them in `index.ts`
4. Update the `ToneProfile` interface in `types.ts` if needed

## Dependencies

Each module imports only what it needs:
- `types.ts` - No dependencies
- `patterns.ts` - No dependencies  
- `utils.ts` - Imports from `patterns.ts`
- Analysis modules - Import from `types.ts`, `patterns.ts`, and `utils.ts`
- `index.ts` - Imports from all other modules
