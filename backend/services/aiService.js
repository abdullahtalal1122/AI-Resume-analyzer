const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatOpenAI } = require('@langchain/openai');
// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// AI Provider configuration
const AI_PROVIDER = `openai` // process.env.AI_PROVIDER || 'openai'; // 'gemini' or 'openai'

// Initialize AI models
const geminiAI = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: 'gemini-1.5-pro',
    temperature: 0.7,
});

const openAI = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4',
    temperature: 0.7,
});

// Select AI provider based on configuration
function getAIProvider() {
    switch (AI_PROVIDER.toLowerCase()) {
        case 'openai':
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY in environment variables.');
            }
            return openAI;
        case 'gemini':
        default:
            if (!process.env.GOOGLE_API_KEY) {
                throw new Error('Google API key not found. Please set GOOGLE_API_KEY in environment variables.');
            }
            return geminiAI;
    }
}

async function analyzeResumeWithAI(resumeText) {
    try {
        // Get the selected AI provider
        const llm = getAIProvider();
        const providerName = AI_PROVIDER.toLowerCase();

        console.log(`Using AI provider: ${providerName}`);

        const prompt = `
Analyze this resume and return a JSON response with the following structure:
{
  "skills": ["skill1", "skill2", "skill3"],
  "jobTitles": ["job title 1", "job title 2", "job title 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "professionalSummary": "A concise 2-line professional summary"
}

Resume text:
${resumeText}

Instructions:
- Extract ALL technical and soft skills mentioned
- Recommend 3-5 job roles that match the candidate's profile
- Suggest 3-5 specific improvements for the resume
- Write a professional 2-line summary highlighting key strengths
- Return ONLY valid JSON, no additional text

JSON Response:`;

        const response = await llm.invoke(prompt);

        // Parse the AI response
        let analysisResult;
        try {
            // Clean the response text and extract JSON
            let cleanResponse;

            // Handle different response formats from different providers
            if (typeof response.content === 'string') {
                cleanResponse = response.content.replace(/```json\n?|\n?```/g, '').trim();
            } else if (typeof response === 'string') {
                cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            } else {
                cleanResponse = JSON.stringify(response);
            }

            analysisResult = JSON.parse(cleanResponse);
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            console.error('Raw response:', response);

            // Fallback response structure
            analysisResult = {
                skills: ['Resume analysis', 'Professional development'],
                jobTitles: ['General position'],
                improvements: ['Add more specific achievements', 'Include relevant keywords', 'Improve formatting'],
                professionalSummary: 'Professional with experience in various domains. Seeking opportunities to contribute skills and grow in a dynamic environment.',
                aiProvider: providerName,
                fallback: true
            };
        }

        // Add metadata about which AI was used
        analysisResult.aiProvider = providerName;
        analysisResult.timestamp = new Date().toISOString();

        return analysisResult;

    } catch (error) {
        console.error('Error in AI analysis:', error);
        throw new Error(`Failed to analyze resume with AI (${AI_PROVIDER}): ${error.message}`);
    }
}

// Function to get available AI providers
function getAvailableProviders() {
    const providers = [];

    if (process.env.GOOGLE_API_KEY) {
        providers.push('gemini');
    }

    if (process.env.OPENAI_API_KEY) {
        providers.push('openai');
    }

    return providers;
}

// Function to switch AI provider dynamically
async function analyzeResumeWithSpecificAI(resumeText, providerName) {
    const originalProvider = process.env.AI_PROVIDER;
    process.env.AI_PROVIDER = providerName;

    try {
        const result = await analyzeResumeWithAI(resumeText);
        return result;
    } finally {
        // Restore original provider
        process.env.AI_PROVIDER = originalProvider;
    }
}

module.exports = {
    analyzeResumeWithAI,
    analyzeResumeWithSpecificAI,
    getAvailableProviders,
    getAIProvider
};
