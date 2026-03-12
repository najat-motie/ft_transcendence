require('dotenv').config();
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const friendRoutes = require('./routes/friend.routes');
const requestRoutes = require('./routes/request.routes');
const userRoutes = require('./routes/user.routes');
const aiRoutes = require('./routes/ai.routes');
const offlineRoutes = require('./routes/offline.routes');
const onlineRoutes = require('./routes/online.routes');
const privateRoomRoutes = require('./routes/private-room.routes');
const { attachOnlineGateway } = require('./ws/online.gateway');

const app = express();
const PRIVATE_ROOM_STATUS_PATH = /^\/room\/[A-Z0-9]{6}$/i;
const GAME_START_PATHS = new Set(['/offline', '/ai']);
const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

const isProduction = process.env.NODE_ENV === 'production';
let generalRateLimitDefault;
if (isProduction) {
  generalRateLimitDefault = 300;
} else {
  generalRateLimitDefault = 2000;
}

let authRateLimitDefault;
if (isProduction) {
  authRateLimitDefault = 10;
} else {
  authRateLimitDefault = 30;
}

const generalRateLimitMax = parsePositiveInteger(
  process.env.RATE_LIMIT_MAX,
  generalRateLimitDefault
);
const authRateLimitMax = parsePositiveInteger(
  process.env.AUTH_RATE_LIMIT_MAX,
  authRateLimitDefault
);
let PORT;
if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 3000;
}

app.set('trust proxy', 1);

const helmetOptions = {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
};

if (process.env.NODE_ENV === 'production') {
  app.use(helmet(helmetOptions));
} else {
  app.use(helmet(helmetOptions));
}

let corsOrigin;
if (process.env.CORS_ORIGIN) {
  corsOrigin = process.env.CORS_ORIGIN;
} else {
  corsOrigin = 'https://localhost';
}
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: generalRateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => (
    req.path === '/health' ||
    (req.method === 'POST' && GAME_START_PATHS.has(req.path)) ||
    (req.method === 'GET' && PRIVATE_ROOM_STATUS_PATH.test(req.path))
  ),
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: authRateLimitMax,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/friends', friendRoutes);
app.use('/requests', requestRoutes);
app.use('/users', userRoutes);
app.use('/ai', aiRoutes);
app.use('/', offlineRoutes);
app.use('/', onlineRoutes);
app.use('/', privateRoomRoutes);

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

const server = http.createServer(app);
attachOnlineGateway(server);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
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
}

module.exports = app;
