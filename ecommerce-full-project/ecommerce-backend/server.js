const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const initSampleData = require('./utils/initSampleData');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const localDevOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const allowedOrigins = new Set(configuredOrigins);

// Security & core middleware
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || localDevOriginPattern.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Basic rate limiting on auth routes to slow down brute force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Please add JWT_SECRET to your .env file.');
  process.exit(1);
}

const startServer = async () => {
  await connectDB();

  try {
    await initSampleData();
  } catch (error) {
    console.error('Error seeding sample data:', error.message || error);
  }

  const startListening = (port) => {
    const server = app.listen(port, () => {
      const assignedPort = server.address().port;
      process.env.PORT = String(assignedPort);
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${assignedPort}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        const fallbackPort = port + 1;
        console.warn(`Port ${port} is already in use. Trying ${fallbackPort} instead.`);
        server.close(() => startListening(fallbackPort));
        return;
      }

      console.error('Server startup error:', error);
      process.exit(1);
    });
  };

  startListening(PORT);
};

startServer();

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

