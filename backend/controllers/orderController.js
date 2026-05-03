const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create Order with Payment Processing
exports.createOrder = async (req, res) => {
  try {
    console.log('========================================');
    console.log('📦 CREATE ORDER REQUEST RECEIVED');
    console.log('========================================');
    console.log('Full Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user?._id);
    console.log('========================================');
    
    const { shippingAddress, paymentMethod, cardDetails } = req.body;
    const userId = req.user._id;

    // Check if shippingAddress exists and is an object
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      console.error('❌ Invalid shipping address:', shippingAddress);
      return res.status(400).json({ 
        message: "Shipping address is required",
        received: shippingAddress
      });
    }

    const { street, city, state, zipCode, country } = shippingAddress;
    
    console.log('Address fields:', { street, city, state, zipCode, country });

    // Check each field individually for better error messages
    const missingFields = [];
    if (!street || (typeof street === 'string' && !street.trim())) missingFields.push('street');
    if (!city || (typeof city === 'string' && !city.trim())) missingFields.push('city');
    if (!state || (typeof state === 'string' && !state.trim())) missingFields.push('state');
    if (!zipCode || (typeof zipCode === 'string' && !zipCode.trim())) missingFields.push('zipCode');
    if (!country || (typeof country === 'string' && !country.trim())) missingFields.push('country');

    if (missingFields.length > 0) {
      console.error('❌ Missing address fields:', missingFields);
      return res.status(400).json({ 
        message: `Please provide complete shipping address. Missing: ${missingFields.join(', ')}`,
        missingFields: missingFields
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    console.log('🛒 Cart:', cart ? `Found with ${cart.items.length} items` : 'Not found');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate cart items
    for (const item of cart.items) {
      if (!item.product || !item.product._id) {
        return res.status(400).json({ 
          message: "Invalid product in cart. Please refresh your cart." 
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + (item.product.price * item.quantity),
      0
    );

    console.log('💰 Total Price:', totalPrice);

    // Payment processing
    let paymentStatus = "Pending";
    let transactionId = null;
    let paidAt = null;

    if (paymentMethod && paymentMethod !== "Cash on Delivery") {
      console.log('💳 Processing payment with', paymentMethod);
      const paymentResult = await simulatePayment(paymentMethod, cardDetails, totalPrice);
      
      if (paymentResult.success) {
        paymentStatus = "Paid";
        transactionId = paymentResult.transactionId;
        paidAt = new Date();
        console.log('✅ Payment successful:', transactionId);
      } else {
        return res.status(400).json({ 
          message: "Payment failed. Please try again.",
          error: paymentResult.error 
        });
      }
    } else {
      console.log('📦 Cash on Delivery selected');
    }

    // Create order with trimmed address values
    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: country.trim()
      },
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus,
      paymentDetails: {
        transactionId,
        paidAt
      },
      status: "Pending"
    });

    console.log('💾 Saving order...');
    const savedOrder = await order.save();
    console.log('✅ Order saved successfully:', savedOrder._id);

    // Clear the cart
    cart.items = [];
    await cart.save();
    console.log('🗑️ Cart cleared');

    // Return populated order
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("items.product");

    res.status(201).json(populatedOrder);

  } catch (error) {
    console.error('❌ Create Order Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "A duplicate order was detected. Please try again.",
        keyValue: error.keyValue,
        index: error.keyPattern,
        detail: "This may be caused by a stale unique index on the orders collection."
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: messages 
      });
    }

    res.status(500).json({ 
      message: "Failed to create order",
      error: error.message 
    });
  }
};

// Simulate payment processing
const simulatePayment = async (method, cardDetails, amount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: "Payment processed successfully"
        });
      } else {
        resolve({
          success: false,
          error: "Card declined. Please try another payment method."
        });
      }
    }, 1500);
  });
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Get Orders Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Get All Orders Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status",
        validStatuses 
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error('❌ Update Order Status Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Process Payment
exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, cardDetails } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }
    
    const paymentResult = await simulatePayment(
      paymentMethod, 
      cardDetails, 
      order.totalPrice
    );
    
    if (paymentResult.success) {
      order.paymentStatus = "Paid";
      order.paymentDetails = {
        transactionId: paymentResult.transactionId,
        paidAt: new Date()
      };
      order.paymentMethod = paymentMethod;
      
      const updatedOrder = await order.save();
      
      res.json({
        success: true,
        order: updatedOrder,
        transactionId: paymentResult.transactionId
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }
    
  } catch (error) {
    console.error('❌ Payment Processing Error:', error);
    res.status(500).json({ message: error.message });
  }
};