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
  const brand = await prisma.brand.findUnique({
    where: { id: parseInt(resolvedParams.id) },
  });

  if (!brand) return { title: "Brand Not Found" };
  return { title: `${brand.brand_name} - THE HOUSE OF WEAR` };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const brandId = parseInt(resolvedParams.id);
  if (isNaN(brandId)) {
    notFound();
  }

  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      products: {
        include: { brand: true },
      },
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">{brand.brand_name}</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/categories">Brands</Link>
                </li>
                <li className="breadcrumb-item active">{brand.brand_name}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header mb-5">
            <span className="section-subtitle">Brand Collection</span>
            <h2 className="section-title h3">
              All Products by {brand.brand_name}
            </h2>
            <div className="section-rule"></div>
          </div>

          <div className="row product-grid g-4">
            {brand.products.length > 0 ? (
              brand.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-12 py-5 text-center">
                <p className="text-muted">
                  No products available for this brand currently.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
