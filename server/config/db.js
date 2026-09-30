const mongoose = require('mongoose');
const seedData = require('../utils/seedData');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // 1. Try connecting to specified MONGO_URI if available
  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
      await seedData();
      return;
    } catch (err) {
      console.warn(`[MongoDB Warning] Could not connect to MONGO_URI (${err.message}).`);
    }
  }

  // 2. Try MongoMemoryServer as fallback
  console.log('[MongoDB] Attempting in-memory database fallback...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      binary: {
        version: process.env.MONGOMS_VERSION || '7.0.3',
      },
    });
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to in-memory database at ${uri}`);
    await seedData();
    return;
  } catch (memoryErr) {
    console.error(`[MongoDB Warning] In-memory database startup failed: ${memoryErr.message}`);
    console.log('[MongoDB] Application server running in standalone mode.');
  }
};

module.exports = connectDB;
