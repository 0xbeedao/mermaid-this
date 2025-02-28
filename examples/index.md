# index.ts sequence Diagram

This sequence diagram illustrates the flow of actions when the CLI tool 'mermaid-this' is executed. It shows the interaction between the User, CLI, FileSystem, and DiagramAgent.

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant FileSystem
    participant DiagramAgent

    User->>CLI: Run mermaid-this <file>
    CLI->>FileSystem: Check if file exists
    FileSystem-->>CLI: File exists
    CLI->>FileSystem: Read file content
    FileSystem-->>CLI: File content
    CLI->>CLI: Generate prompt
    CLI->>DiagramAgent: Generate mermaid diagram
    DiagramAgent-->>CLI: Return mermaid diagram
    CLI->>CLI: Format output
    alt Output to file
        CLI->>FileSystem: Write output to <output file>
        FileSystem-->>CLI: Confirm write
        CLI->>User: Diagram written to <output file>
    else Output to stdout
        CLI->>User: Display diagram
    end
```