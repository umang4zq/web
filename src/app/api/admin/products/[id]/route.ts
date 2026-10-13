import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  
  if (!adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    // Check if product exists and get its images to delete files
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "public", "static", "uploads", "products");

    // Attempt to delete main image
    if (product.image) {
      try { await unlink(path.join(uploadDir, product.image)); } catch (e) {}
    }

    // Attempt to delete extra images
    for (const img of product.images) {
      try { await unlink(path.join(uploadDir, img.image)); } catch (e) {}
    }

    // Prisma cascade delete will remove the product_images rows
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  
  if (!adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
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
    
    // Existing product
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const uploadDir = path.join(process.cwd(), "public", "static", "uploads", "products");

    // Main image
    const mainImageFile = formData.get("image") as File | null;
    let mainImageFilename = product.image;

    if (mainImageFile && mainImageFile.size > 0) {
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      const ext = path.extname(mainImageFile.name);
      mainImageFilename = `${crypto.randomBytes(16).toString("hex")}${ext}`;
      await writeFile(path.join(uploadDir, mainImageFilename), buffer);
      
      // Attempt to delete old main image
      if (product.image) {
        try { await unlink(path.join(uploadDir, product.image)); } catch (e) {}
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
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
        image: mainImageFilename,
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

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}
