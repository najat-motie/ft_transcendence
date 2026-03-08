require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../src/config/database');

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const username = process.env.ADMIN_USERNAME || 'admin';

  const existingUser = await prisma.user.findUnique({ where: { email } });

  let userId = existingUser?.id;

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    userId = user.id;
    console.log(`✅ Created admin user: ${email}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${email}`);
  }

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const seededStats = {
    bio: 'Default admin account',
    avatar: null,
    rank: 5,
    level: 12,
    experience: 2450,
    wins: 18,
    losses: 6,
    status: 'online',
    lastSeen: new Date(),
  };

  if (!profile) {
    await prisma.userProfile.create({
      data: {
        userId,
        username,
        ...seededStats,
      },
    });
    console.log(`✅ Created profile for admin user (${username})`);
  } else {
    await prisma.userProfile.update({
      where: { userId },
      data: seededStats,
    });
    console.log('✅ Updated admin profile KPIs');
  }

  console.log('Admin credentials -> email:', email, '| password:', password);
}

main()
  .catch((err) => {
    console.error('❌ Failed to seed admin user:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
