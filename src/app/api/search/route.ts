import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/imageHelper";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "8"), 1), 30);

    if (!q) {
      return NextResponse.json({ query: "", total: 0, products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { brand: { brand_name: { contains: q } } },
          { category: { category_name: { contains: q } } },
        ],
      },
      include: {
        brand: true,
        category: true,
      },
      take: limit,
      orderBy: [
        { is_featured: "desc" },
        { is_new_arrival: "desc" },
        { created_at: "desc" },
      ],
    });

    const items = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand?.brand_name || "",
      category: p.category?.category_name || "",
      price: p.discount_price || p.price,
      original_price: p.price,
      discount_price: p.discount_price,
      image: getImageUrl(p.image),
      url: `/product/${p.id}`,
    }));

    return NextResponse.json({
      query: q,
      total: items.length,
      products: items,
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", products: [], total: 0 },
      { status: 500 }
    );
  }
}
