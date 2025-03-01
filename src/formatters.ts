import type { DiagramTypedResult } from '../types/types.d.ts';

export function fenceMermaid(mermaid: string) {
    return `\`\`\`mermaid\n${mermaid}\n\`\`\``;
}

export function formatOutput(file: string, results: DiagramTypedResult[]) {
    const resultLines = results.map((result) => {
        return `## ${result.diagramType}\n${fenceMermaid(result.diagram)}\n\n`;
    }).join("\n");
    return [
        file,
        '',
        '',
        `## ${results[0].description}`,
        '',
        ...resultLines,
    ].join("\n");
}
