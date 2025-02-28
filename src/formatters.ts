export function fenceMermaid(mermaid: string) {
    return `\`\`\`mermaid\n${mermaid}\n\`\`\``;
}

export function formatOutput(file: string, diagramType: string, description: string, mermaid: string) {
    return `# ${file} ${diagramType} Diagram

${description}

${fenceMermaid(mermaid)}`;
}