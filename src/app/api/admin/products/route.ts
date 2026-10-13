import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  
  if (!adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const discount_price = formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null;
    const brand_id = parseInt(formData.get("brand_id") as string);
    const category_id = parseInt(formData.get("category_id") as string);
    const description = formData.get("description") as string;
    const stock = parseInt(formData.get("stock") as string);
    const is_new_arrival = formData.get("is_new_arrival") === "true";
    const is_featured = formData.get("is_featured") === "true";
    
    // File uploads
    const mainImageFile = formData.get("image") as File | null;
    let mainImageFilename = "";

    const uploadDir = path.join(process.cwd(), "public", "static", "uploads", "products");

    if (mainImageFile && mainImageFile.size > 0) {
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      const ext = path.extname(mainImageFile.name);
      mainImageFilename = `${crypto.randomBytes(16).toString("hex")}${ext}`;
      await writeFile(path.join(uploadDir, mainImageFilename), buffer);
    }

    // Create the product in db
    const product = await prisma.product.create({
      data: {
        name,
        price,
        discount_price,
        brand_id,
        category_id,
        description,
        stock,
        is_new_arrival,
        is_featured,
        image: mainImageFilename || null,
      }
    });

    // Handle multiple extra images
    const extraImages = formData.getAll("extra_images") as File[];
    for (const file of extraImages) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name);
        const filename = `${crypto.randomBytes(16).toString("hex")}${ext}`;
        await writeFile(path.join(uploadDir, filename), buffer);
        
        await prisma.productImage.create({
          data: {
            product_id: product.id,
            image: filename
          }
        });
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
