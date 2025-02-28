```mermaid
flowchart TD
    createOrder["createOrder(cart"]
    processPayment["processPayment(paymentInfo"]
    updateInventory["updateInventory(cart"]
    createShipping["createShipping(order"]
    checkout["checkout(cart, paymentInfo"]
    checkout --> createOrder
    checkout --> processPayment
    checkout --> updateInventory
    checkout --> createShipping

```