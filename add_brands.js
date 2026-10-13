const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.brand.create({ data: { brand_name: "Levi's", brand_logo: "OIP_1773022701.jpg" } });
  await prisma.brand.create({ data: { brand_name: "Jack & Jones", brand_logo: "OIP_1_1773022791.jpg" } });
  console.log('Added brands');
}

main().finally(() => prisma.$disconnect());
