const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { seedDatabase } = require("../scripts/seed");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bazarghar');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Standard MongoDB Connection Failed. Booting up In-Memory MongoDB Server...");
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`Memory MongoDB Connected: ${mongoUri}`);
      
      console.log("Seeding memory database for you...");
      await seedDatabase(true);
    } catch (memError) {
      console.error("Memory Database Connection Failed:", memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;