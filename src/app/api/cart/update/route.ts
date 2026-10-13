import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const cartKey = formData.get("cart_key")?.toString(); // e.g., "1:M"
  const quantityStr = formData.get("quantity")?.toString();

  if (!cartKey || !quantityStr) {
    return NextResponse.redirect(new URL("/cart", req.url), 303);
  }

  const quantity = parseInt(quantityStr, 10);
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

  if (quantity <= 0) {
    delete cart[cartKey];
  } else {
    cart[cartKey] = quantity;
  }

  const response = NextResponse.redirect(new URL("/cart", req.url), 303);
  response.cookies.set("cart", JSON.stringify(cart), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return response;
}
