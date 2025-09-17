// test_analyzer.ts
// Simple test to verify the modular analyzer structure works
import { generateToneProfile, generateLLMToneProfile } from './analyzer/index';
// Sample messages from a casual, enthusiastic user
const sampleMessages = [
    "Hey there! How's it going? 😊",
    "I'm so excited about this new project! It's going to be amazing!",
    "Lol, that's hilarious! You always crack me up 😂",
    "Could you please send me the details when you get a chance? Thanks!",
    "OMG, I can't believe how awesome this is! Seriously, it's incredible!"
];
console.log("🧪 Testing modular tone analyzer...");
try {
    // Test tone profile generation
    const profile = generateToneProfile(sampleMessages);
    console.log("✅ Tone profile generation successful!");
    console.log(`   Formality: ${profile.formality}`);
    console.log(`   Emotion: ${profile.emotion}`);
    console.log(`   Energy: ${profile.energy}`);
    console.log(`   Humor: ${profile.humor}`);
    // Test LLM profile generation
    const llmProfile = generateLLMToneProfile(profile);
    console.log("✅ LLM profile generation successful!");
    console.log(`   Profile length: ${llmProfile.length} characters`);
    console.log("\n🎉 All tests passed! The modular structure is working correctly.");
}
catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
}
