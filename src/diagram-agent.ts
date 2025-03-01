import ollama from "ollama";
import type { DiagramResult, Model} from "../types/types.d.ts";
import { DiagramResultSchema } from "../types/schemas.ts";
/**
 * Call an OpenAI-compatible API endpoint
 */
async function callOpenAICompatible(endpoint: string, apiKey: string, model: string, prompt: string): Promise<DiagramResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Add API key if provided
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing code and generating mermaid diagrams."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  try {
    // Parse the content as JSON
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    // Validate the result against our schema
    return DiagramResultSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to parse API response:", error);
    throw new Error("Invalid response format from API");
  }
}

/**
 * Call Ollama API
 */
async function callOllama(model: string, prompt: string): Promise<DiagramResult> {
  const response = await ollama.generate({
    model,
    prompt,
    format: "json"
  });

  try {
    // Parse the response
    const parsed = JSON.parse(response.response);
    
    // Validate the result against our schema
    return DiagramResultSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to parse Ollama response:", error);
    throw new Error("Invalid response format from Ollama");
  }
}

/**
 * Generate a mermaid diagram using the specified model
 * 
 * @param modelSpec - Model specification
 * @param instructions - The prompt instructions
 * @returns A DiagramResult object containing the mermaid diagram and description
 */
export async function diagramMaker(modelSpec: Model, instructions: string, verbose: boolean): Promise<DiagramResult> {
  const prompt = `
    ${instructions}
    
    - Output in the following json format: { diagram: string, description: string }
    - The diagram string should be a valid mermaid diagram.
    - The description should be a short description of the diagram.
  `;

  if (verbose) {
    console.log(`DiagramMaker prompt:\n${prompt}`);
  }

  const { provider, providerType, modelName } = modelSpec;

  // Call the appropriate API based on the provider
  if (providerType === "ollama") {
    if (verbose) {
      console.log(`Calling Ollama ${modelName}`);
    }
    return callOllama(modelName, prompt);
  } else if (providerType === "openai") {
    if (verbose) {
      console.log(`Calling OpenAI ${modelName}`);
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey && provider === "https://api.openai.com/v1/chat/completions") {
      throw new Error("OPENAI_API_KEY environment variable is required for OpenAI API");
    }
    return callOpenAICompatible(provider, apiKey || "", modelName, prompt);
  } else {
    throw new Error(`Unsupported model provider: ${provider}`);
  }
}






