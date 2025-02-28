#!/usr/bin/env bun
import { Command } from 'commander';
import path from 'path';
import { diagramMaker } from './src/diagram-agent.ts';
import { makeCodePrompt } from './src/prompts.ts';
import { formatOutput } from './src/formatters.ts';
import { determineModel } from './src/model-parser.ts';
const program = new Command();

program
  .name('mermaid-this')
  .description('CLI tool to generate mermaid diagrams for code files')
  .version('0.1.1')
  .argument('<file>', 'The file to generate a mermaid diagram for')
  .option('-o, --output <file>', 'Output file (defaults to stdout)')
  .option('-t, --type <type>', 'Type of diagram to generate (defaults to "sequence")')
  .option('-m, --model <model>', 'Model to use (defaults to "ollama:llama3.1:8b"). Use "openai:<model>" for OpenAI API, use "http://host:port/path" for local OpenAI-compatible API')
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
      const model = determineModel(options.model || 'ollama:llama3.1:8b');
      const prompt = makeCodePrompt(content, fileExtension, diagramType);
      // Generate the mermaid diagram
      const result = await diagramMaker(model, prompt);

      const { mermaid, description } = result;

      const output = formatOutput(file, diagramType, description, mermaid);

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