/**
 * E-commerce checkout process
 */

/**
 * Creates a new order from the cart items
 */
function createOrder(cart) {
  return {
    id: Math.random().toString(36).substring(2, 9),
    items: cart.items,
    total: cart.total,
    date: new Date()
  };
}

/**
 * Processes the payment
 */
function processPayment(paymentInfo) {
  // Simulate payment processing
  const success = Math.random() > 0.2; // 80% success rate
  
  if (success) {
    return {
      success: true,
      transactionId: Math.random().toString(36).substring(2, 9)
    };
  } else {
    return {
      success: false,
      error: 'Payment failed'
    };
  }
}

/**
 * Updates inventory after successful order
 */
function updateInventory(cart) {
  // Simulate inventory update
  cart.items.forEach(item => {
    console.log(`Reducing inventory for ${item.name} by ${item.quantity}`);
  });
  
  return true;
}

/**
 * Creates a shipping order
 */
function createShipping(order) {
  return {
    orderId: order.id,
    trackingNumber: Math.random().toString(36).substring(2, 15).toUpperCase(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  };
}

/**
 * Main checkout function
 */
function checkout(cart, paymentInfo) {
  // Create the order
  const order = createOrder(cart);
  
  // Process the payment
  const payment = processPayment(paymentInfo);
  
  if (payment.success) {
    // Update inventory
    updateInventory(cart);
    
    // Create shipping
    const shipping = createShipping(order);
    
    // Return success response
    return { 
      success: true, 
      orderId: order.id,
      trackingNumber: shipping.trackingNumber,
      estimatedDelivery: shipping.estimatedDelivery
    };
  }
  
  // Return failure response
  return { 
    success: false, 
    error: payment.error 
  };
} 