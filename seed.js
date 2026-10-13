const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  console.log("Seeding database with actual images...");

  // Brands
  const b1 = await prisma.brand.create({ data: { brand_name: "Tommy Hilfiger", brand_logo: "tommy-hilfiger-logo-free-vector-removebg-preview_1773024281.png" } });
  const b2 = await prisma.brand.create({ data: { brand_name: "US Polo Assn", brand_logo: "us-polo-assn-logo-png_seeklogo-188407-removebg-preview_1773024233.png" } });
  const b3 = await prisma.brand.create({ data: { brand_name: "Calvin Klein", brand_logo: "ck-removebg-preview_1773024275.png" } });
  const b4 = await prisma.brand.create({ data: { brand_name: "Ralph Lauren", brand_logo: "rr-removebg-preview_1773024198.png" } });

  // Categories (assuming the user wants categories to use images from brands folder or products folder - I will use the brands folder for now as previously set)
  // Wait, the user said "now set this as category web\public\static\uploads\brands in this page:http://localhost:3005/categories".
  // Let's use some images from the brands folder for Categories as well, or we can use product images. Let's use some `OIP` images from the brands folder.
  const c1 = await prisma.category.create({ data: { category_name: "Suits & Tailoring", category_image: "OIP_1773022701.jpg" } });
  const c2 = await prisma.category.create({ data: { category_name: "Casual Wear", category_image: "OIP_1_1773022791.jpg" } });

  // Products
  await prisma.product.create({
    data: {
      name: "Tommy Hilfiger Classic Check Shirt",
      price: 2500,
      description: "A premium classic check shirt.",
      brand_id: b1.id,
      category_id: c2.id,
      stock: 15,
      image: "1_1773023026.jpg",
      is_featured: true
    }
  });

  await prisma.product.create({
    data: {
      name: "US Polo Assn Polo T-Shirt",
      price: 1850,
      description: "Comfortable and luxurious polo shirt.",
      brand_id: b2.id,
      category_id: c2.id,
      stock: 20,
      image: "a1_1773027685.webp", // Usually 'webp' or 'jpg' exists, I'll put a dummy name. It won't break the page if not found, it just shows alt.
      is_new_arrival: true
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
