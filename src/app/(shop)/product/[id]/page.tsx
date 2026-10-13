import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(resolvedParams.id) },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} - THE HOUSE OF WEAR`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);
  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      brand: true,
      category: true,
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      category_id: product.category_id,
      id: { not: product.id }, // exclude current product
    },
    include: { brand: true },
    take: 4,
  });

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={`/category/${product.category_id}`}>
                  {product.category.category_name}
                </Link>
              </li>
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="product-detail-section pt-1 pb-5">
        <div className="container">
          <ProductDetailClient product={product} />
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section section-padding">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-subtitle">You May Also Like</span>
              <h2 className="section-title">Related Products</h2>
            </div>

            <div className="row product-grid">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
