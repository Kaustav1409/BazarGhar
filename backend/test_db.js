const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const order = await Order.findOne();
    console.log("Found order:", !!order);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    process.exit(0);
  }
}
run();
