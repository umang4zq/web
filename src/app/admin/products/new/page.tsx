import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  if (!adminToken) {
    redirect("/admin/login");
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/products" style={{ textDecoration: "none", color: "#475569", fontSize: "0.875rem", fontWeight: 500 }}>
          &larr; Back to Products
        </Link>
        <h2 style={{ fontWeight: 600, letterSpacing: "-0.03em", margin: "1rem 0 0 0" }}>Add New Product</h2>
      </div>

      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
