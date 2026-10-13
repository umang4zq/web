const { PrismaClient } = require('@prisma/client');
const { pbkdf2Sync, randomBytes } = require('crypto');
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.deleteMany();
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync('admin123', salt, 600000, 32, 'sha256').toString('hex');
  const hashed = 'pbkdf2:sha256:600000$' + salt + '$' + hash;
  
  await prisma.admin.create({
    data: { username: 'admin', password: hashed }
  });
  console.log('Admin user recreated');
}

main().finally(() => prisma.$disconnect());
