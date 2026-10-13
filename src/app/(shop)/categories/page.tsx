import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import BrandCard from "@/components/BrandCard";

export const metadata = {
  title: "Categories - THE HOUSE OF WEAR",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  const brands = await prisma.brand.findMany();

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Categories</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Categories</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Split Layout Section */}
      <section className="split-layout-section section-padding">
        <div className="container">
          <div className="row">
            {/* Categories Column */}
            <div
              className="col-lg-6 mb-5 mb-lg-0 pe-lg-5"
              style={{ borderRight: "1px solid var(--border-grey)" }}
            >
              <div className="section-header mb-4">
                <span className="section-subtitle">Browse By</span>
                <h2 className="section-title h3">All Categories</h2>
              </div>

              <div className="row g-3">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>

            {/* Brands Column */}
            <div className="col-lg-6 ps-lg-5">
              <div className="section-header mb-4">
                <span className="section-subtitle">Premium Partners</span>
                <h2 className="section-title h3">Shop By Brand</h2>
              </div>

              <div className="row g-3">
                {brands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
