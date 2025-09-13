// patterns.ts
// Regex patterns and linguistic constants for tone analysis
// Basic linguistic patterns
export const CONTRACTION_RE = /\b\w+n't\b/gi;
export const SLANG_WORDS = ['lol', 'brb', 'idk', 'omg', 'wtf', 'btw', 'tbh', 'nvm', 'imo', 'fyi', 'asap', 'irl', 'tbh', 'ngl', 'fr', 'no cap', 'bet', 'periodt'];
export const SLANG_RE = new RegExp(`\b(${SLANG_WORDS.join('|')})\b`, 'gi');
export const EMOJI_RE = /[\p{Emoji_Presentation}\u2600-\u27bf]/gu;
export const POLITE_MARKERS = ['please', 'could you', 'thank you', 'thanks', 'appreciate', 'grateful', 'sorry', 'excuse me', 'pardon'];
export const POLITE_RE = new RegExp(`\b(${POLITE_MARKERS.join('|')})\b`, 'gi');
export const IMPERATIVE_RE = /^(?:[A-Z][a-z]+)\s+[a-z]+/gm;
// Advanced linguistic patterns
export const QUESTION_RE = /\?/g;
export const INTERJECTION_RE = /\b(oh|ah|uh|um|er|hmm|well|so|like|you know|actually|basically|literally|obviously)\b/gi;
export const REPETITION_RE = /\b(\w+)\s+\1\b/gi;
export const COMPLEX_SENTENCE_RE = /[,;:]\s+[a-z]/g;
export const PASSIVE_VOICE_RE = /\b(was|were|been|being)\s+\w+ed\b/gi;
export const FIRST_PERSON_RE = /\b(I|me|my|mine|myself)\b/gi;
export const SECOND_PERSON_RE = /\b(you|your|yours|yourself)\b/gi;
export const THIRD_PERSON_RE = /\b(he|she|it|they|him|her|them|his|hers|theirs)\b/gi;
// Uncertainty and confidence markers
export const UNCERTAINTY_MARKERS = ['maybe', 'perhaps', 'might', 'could', 'possibly', 'probably', 'i think', 'i guess', 'sort of', 'kind of', 'seems like'];
export const UNCERTAINTY_RE = new RegExp(`\b(${UNCERTAINTY_MARKERS.join('|')})\b`, 'gi');
export const CONFIDENCE_MARKERS = ['definitely', 'certainly', 'absolutely', 'surely', 'obviously', 'clearly', 'without doubt', 'i know', 'i believe'];
export const CONFIDENCE_RE = new RegExp(`\b(${CONFIDENCE_MARKERS.join('|')})\b`, 'gi');
// Humor indicators
export const HUMOR_INDICATORS = ['haha', 'lol', 'lmao', 'rofl', 'funny', 'hilarious', 'joke', 'kidding', 'just kidding', 'jk', '😄', '😂', '🤣'];
export const HUMOR_RE = new RegExp(`\b(${HUMOR_INDICATORS.join('|')})\b`, 'gi');
// Technical terms
export const TECHNICAL_TERMS = ['algorithm', 'database', 'API', 'framework', 'protocol', 'interface', 'configuration', 'implementation', 'optimization', 'debugging'];
export const TECHNICAL_RE = new RegExp(`\b(${TECHNICAL_TERMS.join('|')})\b`, 'gi');
// Empathy markers
export const EMPATHY_MARKERS = ['understand', 'feel', 'sorry', 'hope', 'wish', 'care', 'concern', 'support', 'help', 'comfort'];
export const EMPATHY_RE = new RegExp(`\b(${EMPATHY_MARKERS.join('|')})\b`, 'gi');
// Time and spatial markers
export const TIME_MARKERS = ['now', 'then', 'before', 'after', 'soon', 'later', 'recently', 'yesterday', 'today', 'tomorrow', 'always', 'never', 'often', 'sometimes'];
export const TIME_RE = new RegExp(`\b(${TIME_MARKERS.join('|')})\b`, 'gi');
export const SPATIAL_MARKERS = ['here', 'there', 'where', 'everywhere', 'somewhere', 'above', 'below', 'inside', 'outside', 'near', 'far', 'left', 'right'];
export const SPATIAL_RE = new RegExp(`\b(${SPATIAL_MARKERS.join('|')})\b`, 'gi');
// Enhanced sentiment lexicon
export const POSITIVE_WORDS = ['good', 'great', 'happy', 'love', 'fantastic', 'awesome', 'amazing', 'wonderful', 'excellent', 'perfect', 'brilliant', 'outstanding', 'superb', 'marvelous'];
export const NEGATIVE_WORDS = ['bad', 'sad', 'hate', 'terrible', 'awful', 'frustrated', 'angry', 'disappointed', 'upset', 'annoyed', 'furious', 'devastated', 'horrible', 'dreadful'];
// Common English words for avoided words analysis
export const COMMON_ENGLISH_WORDS = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
// Greeting and closing patterns
export const GREETING_PATTERNS = /^(hi|hello|hey|good morning|good afternoon|good evening)/i;
export const CLOSING_PATTERNS = /(bye|goodbye|see you|talk to you|take care|cheers)/i;
// Positive and negative emoji patterns
export const POSITIVE_EMOJI_RE = /😊|😀|👍|❤️|✨/g;
export const NEGATIVE_EMOJI_RE = /😡|😠|👎|💔|😢/g;
// Sarcasm indicators
export const SARCASM_RE = /\?{2,}|!\?|sarcasm|sarcastic|irony|ironic/i;
// Question style patterns
export const RHETORICAL_QUESTION_RE = /rhetorical|don't you think|right\?/i;
export const INDIRECT_QUESTION_RE = /could you|would you|might you/i;
// Formality patterns
export const FORMAL_GREETING_RE = /good morning|good afternoon|good evening/i;
export const WARM_GREETING_RE = /hey there|hi there|hello there/i;
export const FORMAL_CLOSING_RE = /sincerely|best regards|yours truly/i;
export const WARM_CLOSING_RE = /take care|talk soon|see you soon/i;
// Communication quirk patterns
export const EXCESSIVE_EXCLAMATION_RE = /!{3,}/g;
export const EXCESSIVE_QUESTION_RE = /\?{3,}/g;
export const EXCESSIVE_ELLIPSIS_RE = /\.{3,}/g;
export const CAPS_WORDS_RE = /\b[A-Z]{3,}\b/g;
export const LETTER_REPETITION_RE = /(.)\1{2,}/g;
