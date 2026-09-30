const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../utils/seedData');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const isRemote = mongoUri && !mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost');

  if (isRemote) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected to remote database: ${conn.connection.host}`);
      await seedData();
      return;
    } catch (err) {
      console.warn(`[MongoDB] Remote connection failed (${err.message}). Falling back to in-memory server...`);
    }
  }

  // Use MongoMemoryServer (In-Memory Database)
  console.log('[MongoDB] Initializing in-memory MongoMemoryServer...');
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      binary: {
        version: process.env.MONGOMS_VERSION || '7.0.3',
      },
    });
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to in-memory database at ${uri}`);
    await seedData();
  } catch (memoryErr) {
    console.error(`[MongoDB Error] Failed to connect to in-memory database: ${memoryErr.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
