import type { Model } from "../types/types.d.ts";

export function determineModel(model: string): Model {
    const [provider, modelName] = model.split(":", 2);
    switch (provider.toLowerCase()) {
        case "ollama":
            return {
                providerType: "ollama",
                provider,
                modelName
            }
        case "openai":
            return {
                providerType: "openai",
                provider: "https://api.openai.com/v1/chat/completions",
                modelName
            }
        case "http":
        case "https":
            return {
                providerType: "openai",
                provider,
                modelName
            }
        default:
            throw new Error(`Unsupported model provider: ${provider}`);
    }
}