require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

let logLevel;
if (process.env.NODE_ENV === 'development') {
  logLevel = ['query', 'error', 'warn'];
} else {
  logLevel = ['error'];
}

const prisma = new PrismaClient({
  log: logLevel,
});

prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
