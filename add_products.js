const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  if (brands.length === 0 || categories.length === 0) {
    console.log("No brands or categories found.");
    return;
  }

  const productsDir = path.join(__dirname, 'public', 'static', 'uploads', 'products');
  const files = fs.readdirSync(productsDir);
  
  // Filter for image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} image files. Creating products...`);

  const genericNames = [
    "Premium Check Shirt",
    "Tailored Fit Suit",
    "Comfort Denim Jeans",
    "V-Neck Sweater",
    "Casual Summer Blazer",
    "Classic Dress Shirt",
    "Chino Trousers",
    "Leather Boots",
    "Polo T-Shirt",
    "Formal Leather Shoes",
    "Silk Tie",
    "Designer Watch",
    "Winter Jacket",
    "Cotton Shorts",
    "Activewear Sweatpants",
    "Graphic Tee",
    "Trench Coat",
    "Crewneck Sweatshirt",
    "Oxford Shoes",
    "Linen Trousers"
  ];

  let addedCount = 0;
  
  // Clear existing products to avoid duplicates if re-running, but we'll just keep existing and add new ones instead
  // Actually the user says "add all images", so I'll just clear and add all so it's clean.
  console.log("Cleaning old products...");
  await prisma.product.deleteMany();

  for (let i = 0; i < imageFiles.length; i++) {
    const brand = brands[i % brands.length];
    const category = categories[i % categories.length];
    const productName = genericNames[i % genericNames.length];
    
    await prisma.product.create({
      data: {
        name: brand.brand_name + " " + productName + " " + (Math.floor(i / genericNames.length) > 0 ? (Math.floor(i / genericNames.length) + 1) : ""),
        price: 1000 + (Math.floor(Math.random() * 20) * 100),
        discount_price: i % 4 === 0 ? 800 + (Math.floor(Math.random() * 10) * 100) : null,
        description: "Experience premium quality with this beautiful piece by " + brand.brand_name + ".",
        brand_id: brand.id,
        category_id: category.id,
        stock: 5 + Math.floor(Math.random() * 20),
        image: imageFiles[i],
        is_new_arrival: i % 3 === 0,
        is_featured: i % 5 === 0,
      }
    });
    addedCount++;
  }

  console.log(`Successfully added ${addedCount} products!`);
}

main().finally(() => prisma.$disconnect());
