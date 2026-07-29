const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const defaultLocalUri = 'mongodb://127.0.0.1:27017/ecommerce';

const maskMongoUri = (mongoUri) => {
  if (!mongoUri) {
    return '(not set)';
  }

  return mongoUri.replace(/\/\/([^:/?#]+):([^@/]+)@/, '//$1:***@');
};

const getCandidateUris = () => {
  const candidateUris = [];

  if (process.env.MONGO_URI) {
    candidateUris.push(process.env.MONGO_URI);
  }

  if (process.env.LOCAL_MONGO_URI) {
    candidateUris.push(process.env.LOCAL_MONGO_URI);
  }

  if (process.env.ALLOW_LOCAL_DB_FALLBACK === 'true') {
    candidateUris.push(defaultLocalUri);
  }

  return candidateUris;
};

const connectDB = async () => {
  const candidateUris = getCandidateUris();

  if (candidateUris.length === 0) {
    throw new Error(
      'No MongoDB connection string found. Set MONGO_URI to your MongoDB Atlas URI in ecommerce-backend/.env.'
    );
  }

  let lastError;

  for (const mongoUri of candidateUris) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt failed for ${maskMongoUri(mongoUri)}`);
      console.error(error.message || error);
    }
  }

  if (process.env.USE_IN_MEMORY_DB === 'true' || process.env.NODE_ENV !== 'production') {
    console.log('Falling back to MongoDB Memory Server for local development...');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Memory Server connected: ${conn.connection.host}`);
    return conn;
  }

  throw new Error(
    `Unable to connect to MongoDB using the configured URI(s). Last error: ${
      lastError?.message || 'Unknown error'
    }`
  );
};

module.exports = connectDB;
