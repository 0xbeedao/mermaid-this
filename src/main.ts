import path from 'path';
import { diagramMaker } from './diagram-agent.ts';
import { makeCodePrompt } from './prompts.ts';
import { formatOutput } from './formatters.ts';
import { determineModel } from './model-parser.ts';
import type { DiagramTypedResult, Model } from '../types/types.d.ts';

export const DEFAULT_DIAGRAM_TYPES = ['sequence'];

async function generateDiagram(model: Model, diagramType: string, fileExtension: string, content: string, verbose: boolean) {
  const prompt = makeCodePrompt(content, fileExtension, diagramType);
  if (verbose) {
    console.log(`Generating diagram for ${diagramType} using ${model.modelName}, prompt:\n${prompt}`);
  }
  return diagramMaker(model, prompt, verbose);
}

export async function main(file: string, outputOption: string, modelOption: string, diagramTypesOption: string, verbose: boolean) {
  // Check if file exists
  const inFile = Bun.file(file);
  if (!inFile.exists()) {
    throw new Error(`Error: File '${file}' does not exist`);
  }

  // Read the file content
  const content = await inFile.text();
  const fileExtension = path.extname(file).slice(1);

  const model = determineModel(modelOption);
  const diagramTypes = diagramTypesOption ? diagramTypesOption.split(',') : DEFAULT_DIAGRAM_TYPES;
  if (verbose) {
    console.log(`Generating diagrams using ${model.modelName} for ${diagramTypes.length} types`);
  }
  const diagrams: DiagramTypedResult[] = await Promise.all(diagramTypes.map(async (diagramType: string) => {
    const { description, diagram } = await generateDiagram(model, diagramType, fileExtension, content, verbose);
    return {
      description,
      diagram,
      diagramType,
    };
  }));

  if (verbose) {
    console.log(`Generated ${diagrams.length} diagrams`);
    console.log(JSON.stringify(diagrams, null, 2));
  }
  const output = formatOutput(file, diagrams, verbose);

  if (outputOption) {
    const outFile = Bun.file(outputOption);
    await Bun.write(outFile, output);
    console.log(`Diagram written to ${outputOption}`);
  } else {
    console.log(output);
  }
}