import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession("user");
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), 303);
  }

  const formData = await req.formData();
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  
  let cart: Record<string, number> = {};
  if (cartCookie?.value) {
    try {
      cart = JSON.parse(cartCookie.value);
    } catch (e) {
      cart = {};
    }
  }

  if (Object.keys(cart).length === 0) {
    return NextResponse.redirect(new URL("/cart", req.url), 303);
  }

  // Calculate total and validate stock
  let total = 0;
  const orderItemsData: { product_id: number; quantity: number; price: number; size: string }[] = [];
  
  for (const [key, quantity] of Object.entries(cart)) {
    const [productIdStr, size] = key.split(":");
    const productId = parseInt(productIdStr, 10);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    
    if (product) {
      if (product.stock < quantity) {
        return NextResponse.redirect(new URL("/cart?error=Out_of_stock", req.url), 303);
      }
      
      const price = product.discount_price || product.price;
      total += price * quantity;
      
      orderItemsData.push({
        product_id: productId,
        quantity,
        price,
        size: size || "M",
      });
    }
  }

  // Create Order in transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        user_id: session.id,
        total_price: total,
        status: "pending",
        shipping_name: formData.get("shipping_name")?.toString(),
        shipping_phone: formData.get("shipping_phone")?.toString(),
        shipping_address: formData.get("shipping_address")?.toString(),
        shipping_city: formData.get("shipping_city")?.toString(),
        shipping_state: formData.get("shipping_state")?.toString(),
        shipping_pincode: formData.get("shipping_pincode")?.toString(),
      }
    });

    for (const item of orderItemsData) {
      await tx.orderItem.create({
        data: {
          order_id: newOrder.id,
          ...item
        }
      });
      
      await tx.product.update({
        where: { id: item.product_id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return newOrder;
  });

  // Clear Cart
  const response = NextResponse.redirect(new URL(`/profile?success=Order_Placed_${order.id}`, req.url), 303);
  response.cookies.delete("cart");
  return response;
}
