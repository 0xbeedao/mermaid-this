import type { Model } from "../types/types.d.ts";
import { A, G } from "@mobily/ts-belt";

export const DEFAULT_MODEL = {
    providerType: "openai",
    provider: "https://api.openai.com/v1/chat/completions",
    modelName: "gpt-4o-mini"
} as Model

export function determineModel(model: string): Model {
    if (!model) {
        return DEFAULT_MODEL;
    }
    const parts = model.split(":");
    if (parts.length === 0) {
        return DEFAULT_MODEL;
    }
    const provider = parts[0]?.toLowerCase();
    switch (provider) {
        case "ollama":
            return {
                providerType: "ollama",
                provider,
                modelName: parts.slice(1).join(":")
            }
        case "openai":
            return {
                providerType: "openai",
                provider: "https://api.openai.com/v1/chat/completions",
                modelName: parts.slice(1).join(":")
            }
        case "http":
        case "https":
            // https://api.openai.com:(optional port)/v1/chat/completions:modelname:optional-size
            const modelName = parts.pop() || DEFAULT_MODEL.modelName;

            return {
                providerType: "openai",
                provider: parts.join(":"),
                modelName
            }
        default:
            throw new Error(`Unsupported model provider: ${provider}`);
    }
}