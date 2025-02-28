# mermaid-this

A CLI tool to generate mermaid diagrams for code files.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mermaid-this.git
cd mermaid-this

# Install dependencies
bun install

# Link the CLI for development
bun link
```

## Usage

```bash
# Generate a mermaid diagram for a file
mermaid-this path/to/file.js > diagram.md

# Specify the output file
mermaid-this path/to/file.js -o diagram.md

# Specify the diagram type
mermaid-this path/to/file.js -t class
```

## Supported Diagram Types

- `sequence` (default): Generate a sequence diagram
- `class`: Generate a class diagram
- `flowchart`: Generate a flowchart diagram

## Supported File Types

The tool can analyze various code file types, including:
- JavaScript (.js)
- TypeScript (.ts, .tsx)
- Java (.java)
- Rust (.rs)
- Bash (.sh)
- And more...

## Example

Input file:
```javascript
function checkout(cart, paymentInfo) {
  const order = createOrder(cart);
  const payment = processPayment(paymentInfo);
  if (payment.success) {
    updateInventory(cart);
    createShipping(order);
    return { success: true, orderId: order.id };
  }
  return { success: false, error: payment.error };
}
```

Output:
```mermaid
sequenceDiagram
    participant Customer
    participant Cart
    participant PaymentProcessor
    participant Inventory
    participant ShippingService
    
    Customer->>Cart: Add items to cart
    Customer->>Cart: Proceed to checkout
    Cart->>Customer: Request shipping information
    Customer->>Cart: Provide shipping details
    Cart->>Customer: Request payment information
    Customer->>Cart: Provide payment details
    Cart->>PaymentProcessor: Process payment
    PaymentProcessor->>Cart: Payment confirmation
    Cart->>Inventory: Update inventory
    Inventory->>Cart: Inventory updated
    Cart->>ShippingService: Create shipping order
    ShippingService->>Cart: Shipping confirmation
    Cart->>Customer: Order confirmation
```

## License

MIT
