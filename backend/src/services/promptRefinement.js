const { ChatOpenAI } = require('@langchain/openai');

// Initialize the OpenAI model
const getModel = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  
  return new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: apiKey,
  });
};

// Refinement prompt template
const REFINEMENT_PROMPT = `You are an expert at refining and improving prompts for AI systems. Your task is to enhance the following prompt while maintaining its original intent and structure.

Original Prompt:
{prompt}

Please refine this prompt by:
1. Improving clarity and specificity
2. Adding missing context or details that would help the AI better understand the requirements
3. Ensuring the prompt is well-structured and easy to follow
4. Maintaining all original requirements and specifications
5. Using clear, professional language
6. Organizing sections logically if needed

Return only the refined prompt without any additional commentary or explanation.`;

/**
 * Refines a prompt using LangChain and OpenAI
 * @param {string} originalPrompt - The original prompt to refine
 * @returns {Promise<string>} - The refined prompt
 */
async function refinePrompt(originalPrompt) {
  try {
    if (!originalPrompt || !originalPrompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    const model = getModel();
    const prompt = REFINEMENT_PROMPT.replace('{prompt}', originalPrompt);
    
    const response = await model.invoke(prompt);
    
    // Extract the text content from the response
    const refinedPrompt = response.content || response.text || '';
    
    if (!refinedPrompt.trim()) {
      throw new Error('Received empty response from AI');
    }
    
    return refinedPrompt.trim();
  } catch (error) {
    console.error('Error refining prompt:', error);
    throw error;
  }
}

module.exports = {
  refinePrompt,
};

