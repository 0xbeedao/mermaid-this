import { z } from "zod";

// Define the schema for the diagram generation result
export const DiagramResultSchema = z.object({
    mermaid: z.string(),
    description: z.string(),
  });