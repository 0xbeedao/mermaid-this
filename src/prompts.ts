export function makeCodePrompt(content: string, fileExtension: string, diagramType: string) {
    return `Generate a ${diagramType} diagram for the following ${fileExtension} code
    ---
    ${content}
    `
}

