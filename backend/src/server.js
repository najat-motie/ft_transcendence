require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const friendRoutes = require('./routes/friend.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
let PORT;
if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 3000;
}

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  app.use(helmet({ contentSecurityPolicy: false }));
}

let corsOrigin;
if (process.env.CORS_ORIGIN) {
  corsOrigin = process.env.CORS_ORIGIN;
} else {
  // corsOrigin = 'http://localhost:3000';
  corsOrigin = 'http://localhost:5173';
}
app.use(cors({
  // origin: corsOrigin,
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/friends', friendRoutes);
app.use('/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  let errorDetails;
  if (process.env.NODE_ENV === 'development') {
    errorDetails = err;
  } else {
    errorDetails = undefined;
  }
  let statusCode;
  if (err.status) {
    statusCode = err.status;
  } else {
    statusCode = 500;
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: errorDetails,
  });
});

const server = app.listen(PORT, () => {
  let env;
  if (process.env.NODE_ENV) {
    env = process.env.NODE_ENV;
  } else {
    env = 'development';
  }
  console.log(`Server running on port ${PORT} (${env})`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
