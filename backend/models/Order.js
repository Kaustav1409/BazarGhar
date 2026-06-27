const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: { type: Number, default: 1 },
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
  },
  deliveryInstructions: String,
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets', 'EMI'],
    default: 'Cash on Delivery',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Cash on Delivery', 'Refunded', 'Cancelled'],
    default: 'Cash on Delivery',
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
