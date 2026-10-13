const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllProducts() {
  console.log("Deleting all products...");
  
  // Due to potential foreign key constraints, we should delete images first just in case
  await prisma.productImage.deleteMany();
  const result = await prisma.product.deleteMany();
  
  console.log(`Successfully deleted ${result.count} products.`);
}

deleteAllProducts()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
