#!/usr/bin/env bun
import { Command } from 'commander';
import { main } from './src/main';
import path from 'path';

const program = new Command();

program
  .name('mermaid-this')
  .description('CLI tool to generate mermaid diagrams for code files')
  .version('0.1.1')
  .argument('<file>', 'The file to generate a mermaid diagram for')
  .option('-o, --output <file>', 'Output file (defaults to stdout)')
  .option('-t, --type <type>', 'Type of diagram to generate (defaults to "sequence"), separate multiple types with commas')
  .option('-m, --model <model>', 'Model to use (defaults to "openai:gpt-4o-mini"). Use "openai:<model>" for OpenAI API, use "http://host:port/path" for local OpenAI-compatible API')
  .option('--auto', 'Automatically name the output file to [inputfile].md', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (file, options) => {
    try {
      let outfile = options.output;
      if (options.auto) {
        const parts = file.split('.');
        parts.pop();
        outfile = parts.join('.') + '.md';
      }
      main(file, outfile, options.model, options.type, options.verbose);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program.parse();