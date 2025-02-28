#!/usr/bin/env bun
import { Command } from 'commander';
import { generateMermaidDiagram } from './src/generator.ts';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('mermaid-this')
  .description('CLI tool to generate mermaid diagrams for code files')
  .version('0.1.0')
  .argument('<file>', 'The file to generate a mermaid diagram for')
  .option('-o, --output <file>', 'Output file (defaults to stdout)')
  .option('-t, --type <type>', 'Type of diagram to generate (defaults to "sequence")')
  .action(async (file, options) => {
    try {
      // Check if file exists
      if (!fs.existsSync(file)) {
        console.error(`Error: File '${file}' does not exist`);
        process.exit(1);
      }

      // Read the file content
      const content = fs.readFileSync(file, 'utf-8');
      const fileExtension = path.extname(file).slice(1);

      // Generate the mermaid diagram
      const diagram = await generateMermaidDiagram(content, fileExtension, options.type || 'sequence');

      // Output the diagram
      const output = `\`\`\`mermaid\n${diagram}\n\`\`\``;
      
      if (options.output) {
        fs.writeFileSync(options.output, output);
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