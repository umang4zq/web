import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const productId = formData.get("product_id")?.toString();
  const quantityStr = formData.get("quantity")?.toString() || "1";
  const size = formData.get("size")?.toString() || "M";

  if (!productId) {
    return NextResponse.redirect(new URL("/categories", req.url));
  }

  const quantity = parseInt(quantityStr, 10) || 1;
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

  const key = `${productId}:${size.toUpperCase()}`;
  if (cart[key]) {
    cart[key] += quantity;
  } else {
    cart[key] = quantity;
  }

  const response = NextResponse.redirect(new URL("/cart", req.url), 303);
  response.cookies.set("cart", JSON.stringify(cart), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  });

  return response;
}
