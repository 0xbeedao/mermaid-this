import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";

export const mermaidOutputSchema = z.object({
    mermaid: z.string(),
    description: z.string()
})

const codeInstructions = `
You are a helpful assistant that can generate mermaid diagrams for code
- Output in the following format: { mermaid: string, description: string }
- The mermaid string should be a valid mermaid diagram.
- The description should be a short description of the diagram.
`

export const codeDiagramAgent = new Agent({
  model: openai("gpt-4o-mini"),
  instructions: codeInstructions,
  name: "Code Diagram Agent",
});






