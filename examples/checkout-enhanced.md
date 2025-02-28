```mermaid
sequenceDiagram
    participant Client
    participant createOrder
    participant processPayment
    participant updateInventory
    participant createShipping
    participant checkout
    Client->>+checkout: Call with cart, paymentInfo
    checkout->>+createOrder: Call
    createOrder-->>-checkout: Return result
    checkout->>+processPayment: Call
    processPayment-->>-checkout: Return result
    checkout->>+updateInventory: Call
    updateInventory-->>-checkout: Return result
    checkout->>+createShipping: Call
    createShipping-->>-checkout: Return result
    checkout-->>-Client: Return result

```