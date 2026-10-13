import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  
  let cartCount = 0;
  if (cartCookie?.value) {
    try {
      const cart = JSON.parse(cartCookie.value);
      cartCount = Number(Object.values(cart).reduce((a: any, b: any) => a + b, 0)) || 0;
    } catch (e) {}
  }

  const session = await getSession("user");
  const isAuthenticated = !!session;

  return (
    <>
      <Navbar cartCount={cartCount} isAuthenticated={isAuthenticated} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
