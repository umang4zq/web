const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const CATEGORY_META = {
  pants: {
    name: "Pants",
    titleTemplates: [
      "Slim Fit Stretch Chino Pants",
      "Classic Straight Leg Denim Jeans",
      "Tailored Pleated Trousers",
      "Urban Tapered Cargo Pants",
      "Modern Cotton Casual Khakis",
      "Distressed Vintage Slim Jeans",
      "Relaxed Fit Linen Pants",
      "Comfort Stretch Daily Chinos"
    ],
    priceRange: { min: 2199, max: 3799, discountPct: 0.25 },
    descriptions: [
      "Engineered for maximum comfort and crisp modern style. Crafted with a premium stretch-cotton blend.",
      "Timeless silhouette with durable reinforced stitching, designed for versatile day-to-night wear.",
      "Sophisticated tailoring with clean lines, perfect for both formal meetings and elevated casual outings."
    ]
  },
  shirts: {
    name: "Shirts",
    titleTemplates: [
      "Royal Oxford Button-Down Shirt",
      "Pure Linen Casual Resort Shirt",
      "Signature Tartan Check Shirt",
      "Tailored Spread Collar Formal Shirt",
      "Micro Gingham Pattern Cotton Shirt",
      "Essential Poplin Dress Shirt",
      "Indigo Washed Denim Overshirt",
      "Textured Seersucker Summer Shirt",
      "Mandarin Collar Casual Linen Shirt",
      "Vintage Buffalo Check Twill Shirt",
      "Sky Blue Striped Business Shirt",
      "Luxury Twill Double Cuff Shirt",
      "Casual Chambray Workwear Shirt",
      "Bold Plaid Brushed Cotton Shirt",
      "Modern Minimalist Monogram Shirt",
      "Slim Fit Houndstooth Check Shirt",
      "Breezy Camp Collar Printed Shirt",
      "Classic Navy Twill Oxford Shirt"
    ],
    priceRange: { min: 1899, max: 3499, discountPct: 0.25 },
    descriptions: [
      "Meticulously woven from long-staple cotton for a smooth, breathable finish with effortless drape.",
      "A wardrobe staple featuring crisp collar styling, durable pearlized buttons, and sharp tailoring.",
      "Soft washed for instant comfort, this versatile shirt transitions seamlessly from work to weekend."
    ]
  },
  shoes: {
    name: "Shoes",
    titleTemplates: [
      "Handcrafted Italian Leather Derby Shoes",
      "Classic Wingtip Brogues",
      "Heritage Suede Chelsea Boots",
      "Minimalist Low-Top Leather Sneakers",
      "Penny Loafers in Polished Calfskin",
      "Performance City Runner Sneakers"
    ],
    priceRange: { min: 3499, max: 6499, discountPct: 0.25 },
    descriptions: [
      "Hand-finished genuine leather with cushioned insoles for enduring all-day luxury and support.",
      "Modern minimalist footwear designed for versatility, pairing effortlessly with both suits and denim.",
      "Classic artisanal craftsmanship with Goodyear-welted durability and premium traction outsoles."
    ]
  },
  "t-shirts": {
    name: "T-Shirts",
    titleTemplates: [
      "Pima Cotton Crewneck Essential Tee",
      "Classic Pique Polo T-Shirt",
      "Vintage Heritage Graphic Tee",
      "Waffle Knit Long Sleeve Henley",
      "Embroidered Crest Slim Polo",
      "Organic Striped Nautical Tee",
      "Heavyweight Relaxed Fit T-Shirt",
      "Raw Hem Slub Cotton Tee",
      "Athletic Quick-Dry Tech Tee",
      "Minimalist Tonal Pocket T-Shirt",
      "Original Batwing Graphic T-Shirt",
      "Soft Touch Modal Crewneck Tee",
      "Tipped Ribbed Collar Polo",
      "Collegiate Typography Graphic Tee",
      "Vintage Mineral Wash Oversized Tee",
      "Custom Slim Fit Pima Cotton Tee",
      "Supima Cotton V-Neck Basic Tee"
    ],
    priceRange: { min: 999, max: 2199, discountPct: 0.25 },
    descriptions: [
      "Ultra-soft combed organic cotton with pre-shrunk finish for that perfectly broken-in feel from day one.",
      "Signature breathable pique fabric tailored with a ribbed collar and refined two-button placket.",
      "Everyday luxury basic designed with clean lines and reinforced seams that retain shape wash after wash."
    ]
  }
};

async function main() {
  console.log("Starting uploads scanning & seeding...");

  // 1. Fetch available brands
  let brands = await prisma.brand.findMany();
  if (brands.length === 0) {
    console.log("No brands found. Seeding default brands...");
    await prisma.brand.createMany({
      data: [
        { brand_name: "Ralph Lauren" },
        { brand_name: "Tommy Hilfiger" },
        { brand_name: "Calvin Klein" },
        { brand_name: "Levi's" },
        { brand_name: "Jack & Jones" },
        { brand_name: "US Polo Assn" }
      ]
    });
    brands = await prisma.brand.findMany();
  }
  console.log(`Found ${brands.length} brands:`, brands.map(b => b.brand_name).join(", "));

  // 2. Ensure Categories exist and map them
  const categoryFolderMap = {};
  for (const [folderKey, meta] of Object.entries(CATEGORY_META)) {
    let cat = await prisma.category.findFirst({
      where: {
        category_name: {
          equals: meta.name
        }
      }
    });

    if (!cat) {
      cat = await prisma.category.create({
        data: {
          category_name: meta.name
        }
      });
      console.log(`Created category: ${meta.name} (id: ${cat.id})`);
    } else {
      console.log(`Found existing category: ${meta.name} (id: ${cat.id})`);
    }

    categoryFolderMap[folderKey] = cat;
  }

  // 3. Clear old products to provide a fresh, consistent catalog
  console.log("Clearing existing products and order items...");
  await prisma.orderItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  const productsBasePath = path.join(__dirname, 'public', 'static', 'uploads', 'products');
  let totalProductsAdded = 0;
  let totalImagesAdded = 0;

  let brandIndex = 0;

  for (const [folderKey, meta] of Object.entries(CATEGORY_META)) {
    const category = categoryFolderMap[folderKey];
    const catDirPath = path.join(productsBasePath, folderKey);

    if (!fs.existsSync(catDirPath)) {
      console.warn(`Category folder not found: ${catDirPath}`);
      continue;
    }

    // Get all product directories (product-1, product-2, etc.)
    const productDirs = fs.readdirSync(catDirPath)
      .filter(item => fs.statSync(path.join(catDirPath, item)).isDirectory())
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

    console.log(`\nProcessing category '${meta.name}' (${folderKey}): ${productDirs.length} products found.`);

    let firstProductImage = null;

    for (let pIdx = 0; pIdx < productDirs.length; pIdx++) {
      const pDirName = productDirs[pIdx];
      const pFullPath = path.join(catDirPath, pDirName);

      // Find all image files
      const imgFiles = fs.readdirSync(pFullPath)
        .filter(f => {
          const ext = path.extname(f).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
        })
        .sort();

      if (imgFiles.length === 0) {
        console.warn(`No images found in ${pFullPath}`);
        continue;
      }

      // Main image relative to /static/uploads/products/
      const mainImageRel = `${folderKey}/${pDirName}/${imgFiles[0]}`;
      if (!firstProductImage) {
        firstProductImage = mainImageRel;
      }

      // Pick brand, title, pricing
      const brand = brands[brandIndex % brands.length];
      brandIndex++;

      const titleTemplate = meta.titleTemplates[pIdx % meta.titleTemplates.length];
      const productName = `${brand.brand_name} ${titleTemplate}`;

      // Realistic price calculation
      const basePrice = Math.round((meta.priceRange.min + Math.random() * (meta.priceRange.max - meta.priceRange.min)) / 50) * 50 - 1; // e.g., 2499, 1999
      const hasDiscount = pIdx % 3 !== 0; // 66% of products have discounts
      const discountPrice = hasDiscount
        ? Math.round((basePrice * (1 - meta.priceRange.discountPct)) / 50) * 50 - 1
        : null;

      const description = meta.descriptions[pIdx % meta.descriptions.length];
      const stock = 12 + Math.floor(Math.random() * 25);
      const isNewArrival = pIdx % 4 === 0;
      const isFeatured = pIdx % 3 === 0;

      // Create Product
      const product = await prisma.product.create({
        data: {
          name: productName,
          price: basePrice,
          discount_price: discountPrice,
          description: description,
          brand_id: brand.id,
          category_id: category.id,
          image: mainImageRel,
          stock: stock,
          is_new_arrival: isNewArrival,
          is_featured: isFeatured,
        }
      });
      totalProductsAdded++;

      // Create additional ProductImage gallery entries
      for (let i = 0; i < imgFiles.length; i++) {
        const galleryImageRel = `${folderKey}/${pDirName}/${imgFiles[i]}`;
        await prisma.productImage.create({
          data: {
            product_id: product.id,
            image: galleryImageRel
          }
        });
        totalImagesAdded++;
      }
    }

    // Set category banner/thumbnail image to the first product image
    if (firstProductImage) {
      await prisma.category.update({
        where: { id: category.id },
        data: { category_image: firstProductImage }
      });
      console.log(`Updated category '${meta.name}' image to: ${firstProductImage}`);
    }
  }

  console.log("\n==================================================");
  console.log(`Seeding complete!`);
  console.log(`Total Products added: ${totalProductsAdded}`);
  console.log(`Total Gallery Images added: ${totalImagesAdded}`);
  console.log("==================================================");
}

main()
  .catch(err => {
    console.error("Seeding error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
