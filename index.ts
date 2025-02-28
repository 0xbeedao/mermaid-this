#!/usr/bin/env bun
import { Command } from 'commander';
import path from 'path';
import { codeDiagramAgent, mermaidOutputSchema } from './src/diagram-agent.ts';
import { makeCodePrompt } from './src/prompts.ts';
const program = new Command();

program
  .name('mermaid-this')
  .description('CLI tool to generate mermaid diagrams for code files')
  .version('0.1.1')
  .argument('<file>', 'The file to generate a mermaid diagram for')
  .option('-o, --output <file>', 'Output file (defaults to stdout)')
  .option('-t, --type <type>', 'Type of diagram to generate (defaults to "sequence")')
  .action(async (file, options) => {
    try {
      // Check if file exists
      const inFile = Bun.file(file);
      if (!inFile.exists()) {
        console.error(`Error: File '${file}' does not exist`);
        process.exit(1);
      }

      // Read the file content
      const content = await inFile.text();
      const fileExtension = path.extname(file).slice(1);

      const diagramType = options.type || 'sequence';
      const prompt = makeCodePrompt(content, fileExtension, diagramType);

      // Generate the mermaid diagram
      const result = await codeDiagramAgent.generate(
        [
          {
            role: "user",
            content: prompt,
          },
        ],
        {
          output: mermaidOutputSchema
        }
      );


      const { mermaid, description } = result.object;

      // Output the diagram
      const delimiter = "```";
      const output = [`# ${file} ${diagramType} Diagram`,
        ``,
        `${description}`,
        ``,
        `${delimiter}mermaid`,
        `${mermaid}`,
        `${delimiter}`,
      ].join("\n");

      if (options.output) {
        const outFile = Bun.file(options.output);
        await Bun.write(outFile, output);
        console.log(`Diagram written to ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program.parse();