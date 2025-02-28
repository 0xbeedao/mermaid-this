import { z } from "zod";
import { DiagramResultSchema } from "./schemas.ts";

export interface Model {
    providerType: "ollama" | "openai"
    provider: string;
    modelName: string;
}

export type DiagramResult = z.infer<typeof DiagramResultSchema>;