# mermaid-this

A cli tool to generate mermaid diagrams for documents.

## Example usage

```bash
mermaid-this somefile.tsx > somefile.md
```

This will generate a mermaid document, something like this:

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
