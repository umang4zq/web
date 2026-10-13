import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "New Arrivals - THE HOUSE OF WEAR",
};

export default async function NewArrivalsPage() {
  const newArrivals = await prisma.product.findMany({
    where: { is_new_arrival: true },
    include: { brand: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">New Arrivals</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">New Arrivals</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header mb-5 text-center">
            <span className="section-subtitle">Fresh Drops</span>
            <h2 className="section-title h3">Just In</h2>
            <div className="section-rule centered"></div>
          </div>

          <div className="row product-grid g-4">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No new arrivals at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
