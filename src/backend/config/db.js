const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supplyguard_db';

let isConnected = false;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return { connected: true, uri: MONGODB_URI };
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = mongoose.connection.readyState === 1;
    return { connected: isConnected, uri: MONGODB_URI };
  } catch (error) {
    isConnected = false;
    return { connected: false, error: error.message };
  }
};

module.exports = {
  connectDatabase,
  MONGODB_URI,
  getIsConnected: () => mongoose.connection.readyState === 1
};
