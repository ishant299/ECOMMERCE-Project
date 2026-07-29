const mongoose = require('mongoose');

const defaultLocalUri = 'mongodb://127.0.0.1:27017/ecommerce';

const connectDB = async () => {
  console.log("MONGO_URI from .env:", process.env.MONGO_URI);

  const candidateUris = [
    process.env.MONGO_URI,
    process.env.LOCAL_MONGO_URI,
    defaultLocalUri
  ].filter(Boolean);

  for (const mongoUri of candidateUris) {
    console.log("Trying URI:", mongoUri);

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });

      console.log("✅ MongoDB Connected:", conn.connection.host);
      return conn;
    } catch (error) {
      console.log("❌ Failed:", error.message);
    }
  }

  return null;
};

module.exports = connectDB;
