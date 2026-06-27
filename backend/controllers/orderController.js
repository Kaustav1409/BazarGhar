const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { 
      products, 
      shippingAddress, 
      deliveryInstructions,
      paymentMethod,
      shippingPrice,
      taxPrice,
      discount 
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate total from actual DB prices
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      totalPrice += product.price * item.quantity;
      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      products: orderProducts,
      totalPrice,
      shippingAddress,
      deliveryInstructions,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Pending',
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      discount: discount || 0,
      status: 'Pending',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order', error: error.message, stack: error.stack });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('products.productId', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders', error: error.message, stack: error.stack });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId', 'name image price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'Cancelled';
    order.paymentStatus = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error cancelling order', error: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder };
