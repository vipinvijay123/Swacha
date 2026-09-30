const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../utils/seedData');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    await seedData();
  } catch (err) {
    console.log('[MongoDB] Local MongoDB server connection failed or not running. Starting in-memory MongoMemoryServer...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to in-memory database at ${uri}`);
      await seedData();
    } catch (memoryErr) {
      console.error(`[MongoDB Error] Failed to connect: ${memoryErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
