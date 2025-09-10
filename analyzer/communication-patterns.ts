// communication-patterns.ts
// Communication patterns analysis

import { ToneProfile } from './types';
import { 
	QUESTION_RE, RHETORICAL_QUESTION_RE, INDIRECT_QUESTION_RE,
	GREETING_PATTERNS, CLOSING_PATTERNS, FORMAL_GREETING_RE, WARM_GREETING_RE,
	FORMAL_CLOSING_RE, WARM_CLOSING_RE
} from './patterns';
import { countMatches, analyzeMessageLengths } from './utils';

export function analyzeQuestionStyle(texts: string, totalMsgs: number): ToneProfile['questionStyle'] {
	const questionCount = countMatches(texts, QUESTION_RE);
	const questionRate = questionCount / totalMsgs;
	
	if (questionRate > 0.3) return 'clarifying';
	else if (RHETORICAL_QUESTION_RE.test(texts)) return 'rhetorical';
	else if (INDIRECT_QUESTION_RE.test(texts)) return 'indirect';
	else return 'direct';
}

export function analyzeGreetingStyle(texts: string): ToneProfile['greetingStyle'] {
	if (FORMAL_GREETING_RE.test(texts)) return 'formal';
	else if (WARM_GREETING_RE.test(texts)) return 'warm';
	else if (GREETING_PATTERNS.test(texts)) return 'casual';
	else return 'minimal';
}

export function analyzeClosingStyle(texts: string): ToneProfile['closingStyle'] {
	if (FORMAL_CLOSING_RE.test(texts)) return 'formal';
	else if (WARM_CLOSING_RE.test(texts)) return 'warm';
	else if (CLOSING_PATTERNS.test(texts)) return 'casual';
	else return 'abrupt';
}

export function analyzeResponsePattern(messages: string[]): ToneProfile['responsePattern'] {
	const { lengthVariation, avgLength } = analyzeMessageLengths(messages);
	
	if (lengthVariation > 0.8) return 'spontaneous';
	else if (lengthVariation < 0.3) return 'deliberate';
	else if (avgLength < 20) return 'immediate';
	else return 'thoughtful';
}
