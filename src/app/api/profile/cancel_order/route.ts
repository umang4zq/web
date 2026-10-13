import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession("user");
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), 303);
  }

  const formData = await req.formData();
  const orderIdStr = formData.get("order_id")?.toString();
  
  if (!orderIdStr) {
    return NextResponse.redirect(new URL("/profile", req.url), 303);
  }
  
  const orderId = parseInt(orderIdStr, 10);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { order_items: true },
  });

  if (!order || order.user_id !== session.id || order.status !== "pending") {
    return NextResponse.redirect(new URL("/profile?error=Cannot_cancel_order", req.url), 303);
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });

    for (const item of order.order_items) {
      if (item.product_id) {
        await tx.product.update({
          where: { id: item.product_id },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
  });

  return NextResponse.redirect(new URL("/profile?success=Order_cancelled", req.url), 303);
}
