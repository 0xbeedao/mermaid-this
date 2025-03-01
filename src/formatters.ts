import type { DiagramTypedResult } from '../types/types.d.ts';

export function fenceMermaid(mermaid: string) {
    return `\`\`\`mermaid\n${mermaid}\n\`\`\``;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatOutput(file: string, results: DiagramTypedResult[], verbose: boolean) {
    if (verbose) {
        console.log(`Formatting output for ${file}`);
    }

    const output: string[] = [
        `# ${file} Diagram${results.length > 1 ? 's' : ''}`,
        ''
    ];
    if (results.length > 0) {
        output.push(`## ${results[0].description}\n`);
    }
    for (const result of results) {
        output.push(`## ${capitalize(result.diagramType)} Diagram\n`);
        output.push(fenceMermaid(result.diagram));
        output.push(`\n`);
    }
    return output.join("\n");
}
