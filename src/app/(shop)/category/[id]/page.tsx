import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(resolvedParams.id) },
  });

  if (!category) return { title: "Category Not Found" };
  return { title: `${category.category_name} - THE HOUSE OF WEAR` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.id);
  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: {
        include: { brand: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">{category.category_name}</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/categories">Categories</Link>
                </li>
                <li className="breadcrumb-item active">
                  {category.category_name}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header mb-5">
            <span className="section-subtitle">Category Collection</span>
            <h2 className="section-title h3">
              Shop {category.category_name}
            </h2>
            <div className="section-rule"></div>
          </div>

          <div className="row product-grid g-4">
            {category.products.length > 0 ? (
              category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-12 py-5 text-center">
                <p className="text-muted">
                  No products available in this category currently.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
