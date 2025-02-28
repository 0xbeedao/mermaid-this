import { z } from 'zod';

// Define the schema for the diagram generation result
const DiagramResultSchema = z.object({
  diagram: z.string(),
});

/**
 * Analyzes JavaScript/TypeScript code to identify functions and their relationships
 */
function analyzeJsCode(content: string) {
  const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)/g;
  const functionCalls = /(\w+)\s*\(([^)]*)\)/g;
  
  const functions: { name: string; params: string[]; calls: string[] }[] = [];
  let match;
  
  // Extract function definitions
  while ((match = functionRegex.exec(content)) !== null) {
    const name = match[1];
    const params = match[2].split(',').map(p => p.trim()).filter(p => p);
    functions.push({ name, params, calls: [] });
  }
  
  // For each function, find function calls within its body
  for (let i = 0; i < functions.length; i++) {
    const currentFunc = functions[i];
    const nextFuncIndex = i < functions.length - 1 ? 
      content.indexOf(`function ${functions[i+1].name}`) : 
      content.length;
    
    const funcStart = content.indexOf(`function ${currentFunc.name}`);
    const funcBody = content.substring(funcStart, nextFuncIndex);
    
    // Find all function calls
    while ((match = functionCalls.exec(funcBody)) !== null) {
      const calledFunc = match[1];
      // Avoid adding the function itself and only add if it's one of our known functions
      if (calledFunc !== currentFunc.name && 
          functions.some(f => f.name === calledFunc) && 
          !currentFunc.calls.includes(calledFunc)) {
        currentFunc.calls.push(calledFunc);
      }
    }
  }
  
  return functions;
}

/**
 * Generates a sequence diagram based on JavaScript/TypeScript code analysis
 */
function generateJsSequenceDiagram(content: string): string {
  const functions = analyzeJsCode(content);
  
  // Find the main function (usually the one that calls others but isn't called)
  const calledFunctions = new Set(functions.flatMap(f => f.calls));
  const mainFunctions = functions.filter(f => !Array.from(calledFunctions).includes(f.name));
  
  let diagram = 'sequenceDiagram\n';
  
  // Add participants
  diagram += '    participant Client\n';
  functions.forEach(func => {
    diagram += `    participant ${func.name}\n`;
  });
  
  // Add sequence for each main function
  mainFunctions.forEach(mainFunc => {
    diagram += `    Client->>+${mainFunc.name}: Call with ${mainFunc.params.join(', ')}\n`;
    
    // Process the call chain
    const processedCalls = new Set<string>();
    const processCalls = (func: typeof functions[0], indent: string = '    ') => {
      func.calls.forEach(calledFuncName => {
        if (processedCalls.has(`${func.name}->${calledFuncName}`)) return;
        
        const calledFunc = functions.find(f => f.name === calledFuncName);
        if (calledFunc) {
          diagram += `${indent}${func.name}->>+${calledFuncName}: Call\n`;
          processedCalls.add(`${func.name}->${calledFuncName}`);
          
          // Process nested calls
          processCalls(calledFunc, indent + '    ');
          
          diagram += `${indent}${calledFuncName}-->>-${func.name}: Return result\n`;
        }
      });
    };
    
    processCalls(mainFunc);
    
    diagram += `    ${mainFunc.name}-->>-Client: Return result\n`;
  });
  
  return diagram;
}

/**
 * Generates a class diagram based on JavaScript/TypeScript code analysis
 */
function generateJsClassDiagram(content: string): string {
  const functions = analyzeJsCode(content);
  
  let diagram = 'classDiagram\n';
  
  // Create a class for each function
  functions.forEach(func => {
    diagram += `    class ${func.name} {\n`;
    diagram += `        +process(${func.params.join(', ')})\n`;
    diagram += '    }\n';
  });
  
  // Add relationships
  functions.forEach(func => {
    func.calls.forEach(calledFunc => {
      diagram += `    ${func.name} --> ${calledFunc}: calls\n`;
    });
  });
  
  return diagram;
}

/**
 * Generates a flowchart diagram based on JavaScript/TypeScript code analysis
 */
function generateJsFlowchartDiagram(content: string): string {
  const functions = analyzeJsCode(content);
  
  let diagram = 'flowchart TD\n';
  
  // Add nodes for each function
  functions.forEach(func => {
    diagram += `    ${func.name}["${func.name}(${func.params.join(', ')}"]\n`;
  });
  
  // Add relationships
  functions.forEach(func => {
    func.calls.forEach(calledFunc => {
      diagram += `    ${func.name} --> ${calledFunc}\n`;
    });
  });
  
  return diagram;
}

/**
 * A function to generate a diagram based on code content
 */
function generateDiagram(content: string, fileType: string, diagramType: string): string {
  // Handle JavaScript/TypeScript files
  if (['js', 'ts', 'jsx', 'tsx'].includes(fileType)) {
    if (diagramType === 'sequence') {
      return generateJsSequenceDiagram(content);
    } else if (diagramType === 'class') {
      return generateJsClassDiagram(content);
    } else if (diagramType === 'flowchart') {
      return generateJsFlowchartDiagram(content);
    }
  }
  
  // Fallback to simple diagrams for other file types
  if (diagramType === 'sequence') {
    return `sequenceDiagram
    participant User
    participant System
    User->>System: Process ${fileType} file
    System->>System: Analyze code structure
    System->>User: Return diagram`;
  } else if (diagramType === 'flowchart') {
    return `flowchart TD
    A[Start] --> B{Analyze ${fileType} file}
    B --> C[Generate diagram]
    C --> D[End]`;
  } else if (diagramType === 'class') {
    return `classDiagram
    class CodeFile {
      +String type
      +String content
      +analyze()
    }
    class Diagram {
      +String type
      +generate()
    }
    CodeFile --> Diagram`;
  }
  
  return `graph TD
    A[${fileType} file] --> B[Diagram]`;
}

/**
 * Analyzes code content and prepares it for diagram generation
 */
async function analyzeCode(content: string, fileType: string, diagramType: string) {
  // In a real implementation, this would perform actual code analysis
  // For now, we'll just return the inputs
  return {
    content,
    fileType,
    diagramType,
    analysis: `Code analysis for ${fileType} file`,
  };
}

/**
 * Generates a mermaid diagram from code content
 * @param content The code content to analyze
 * @param fileType The type of file (e.g., 'js', 'ts', 'java')
 * @param diagramType The type of diagram to generate (e.g., 'sequence', 'class', 'flowchart')
 * @returns A string containing the mermaid diagram
 */
export async function generateMermaidDiagram(
  content: string,
  fileType: string,
  diagramType: string = 'sequence'
): Promise<string> {
  try {
    // Analyze the code
    const analysis = await analyzeCode(content, fileType, diagramType);
    
    // Generate the diagram
    return generateDiagram(content, fileType, diagramType);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate mermaid diagram');
  }
} 