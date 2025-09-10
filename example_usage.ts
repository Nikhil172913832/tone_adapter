// Example usage of the enhanced tone profile system
import { generateToneProfile, generateLLMToneProfile } from './analyzer/index.js';

// Sample messages from a casual, enthusiastic user
const sampleMessages = [
	"Hey there! How's it going? 😊",
	"I'm so excited about this new project! It's going to be amazing!",
	"Lol, that's hilarious! You always crack me up 😂",
	"Could you please send me the details when you get a chance? Thanks!",
	"OMG, I can't believe how awesome this is! Seriously, it's incredible!",
	"Hey, do you think we should maybe consider a different approach?",
	"I totally understand what you mean, and I really appreciate your input!",
	"Let's do this! I'm pumped and ready to go! 💪",
	"Thanks so much for your help! You're the best!",
	"Wait, are you serious? That's actually pretty cool!"
];

// Generate the tone profile
const profile = generateToneProfile(sampleMessages);

// Generate LLM-friendly description
const llmProfile = generateLLMToneProfile(profile);

console.log("=== ENHANCED TONE PROFILE ===");
console.log(JSON.stringify(profile, null, 2));

console.log("\n=== LLM-FRIENDLY FORMAT ===");
console.log(llmProfile);

// Example of how an LLM would use this profile
console.log("\n=== LLM ADAPTATION EXAMPLE ===");
console.log("Original message: 'Please review the document and provide feedback.'");
console.log("Adapted message: 'Hey! Could you please take a look at the document when you get a chance? I'd really appreciate your thoughts on it! Thanks so much! 😊'");
