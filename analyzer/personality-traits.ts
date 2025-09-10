// personality-traits.ts
// Advanced personality traits analysis

import { ToneProfile } from './types';
import { 
	HUMOR_RE, TECHNICAL_RE, EMPATHY_RE, UNCERTAINTY_RE, CONFIDENCE_RE, SARCASM_RE
} from './patterns';
import { countMatches } from './utils';

export function analyzeHumor(texts: string, totalMsgs: number): ToneProfile['humor'] {
	const humorCount = countMatches(texts, HUMOR_RE);
	const humorRate = humorCount / totalMsgs;
	
	if (SARCASM_RE.test(texts)) return 'sarcastic';
	else if (humorRate > 0.3) return 'heavy';
	else if (humorRate > 0.2) return 'moderate';
	else if (humorRate > 0.1) return 'subtle';
	else return 'none';
}

export function analyzeTechnicality(texts: string, totalMsgs: number): ToneProfile['technicality'] {
	const technicalCount = countMatches(texts, TECHNICAL_RE);
	const technicalRate = technicalCount / totalMsgs;
	
	if (technicalRate > 0.1) return 'expert';
	else if (technicalRate > 0.05) return 'advanced';
	else if (technicalRate > 0.02) return 'intermediate';
	else if (technicalRate > 0.01) return 'basic';
	else return 'non-technical';
}

export function analyzeEmpathy(texts: string, totalMsgs: number): ToneProfile['empathy'] {
	const empathyCount = countMatches(texts, EMPATHY_RE);
	const empathyRate = empathyCount / totalMsgs;
	
	if (empathyRate > 0.15) return 'very-high';
	else if (empathyRate > 0.1) return 'high';
	else if (empathyRate < 0.05) return 'low';
	else return 'moderate';
}

export function analyzeConfidence(texts: string, totalMsgs: number): ToneProfile['confidence'] {
	const uncertaintyCount = countMatches(texts, UNCERTAINTY_RE);
	const confidenceCount = countMatches(texts, CONFIDENCE_RE);
	const uncertaintyRate = uncertaintyCount / totalMsgs;
	const confidenceRate = confidenceCount / totalMsgs;
	
	if (confidenceRate > uncertaintyRate * 2) return 'assertive';
	else if (confidenceRate > uncertaintyRate) return 'confident';
	else if (uncertaintyRate > confidenceRate * 2) return 'tentative';
	else return 'moderate';
}
