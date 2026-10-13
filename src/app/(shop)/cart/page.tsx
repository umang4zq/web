import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import CartClient from "@/components/CartClient";

export const metadata = {
  title: "Shopping Cart - THE HOUSE OF WEAR",
};

export default async function CartPage() {
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

  const session = await getSession("user");
  const isAuthenticated = !!session;

  const cartItems = [];
  let total = 0;

  for (const [key, quantity] of Object.entries(cart)) {
    const [productIdStr, size] = key.split(":");
    const productId = parseInt(productIdStr, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { brand: true },
    });

    if (product) {
      const price = product.discount_price || product.price;
      const subtotal = price * quantity;
      
      cartItems.push({
        product,
        quantity,
        subtotal,
        size: size || "M",
        cartKey: key,
      });
      total += subtotal;
    }
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Shopping Cart</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Cart</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="cart-section section-padding">
        <div className="container">
          <CartClient
            cartItems={cartItems}
            total={total}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </section>
    </>
  );
}
