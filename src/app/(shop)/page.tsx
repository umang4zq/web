import { prisma } from "@/lib/prisma";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";

export default async function Home() {
  const brands = await prisma.brand.findMany();
  
  const featuredProducts = await prisma.product.findMany({
    where: { is_featured: true },
    include: { brand: true },
    take: 8,
  });

  const newArrivals = await prisma.product.findMany({
    where: { is_new_arrival: true },
    include: { brand: true },
    take: 8,
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <>
      <HeroSection />

      {/* BRAND TICKER */}
      <section id="brands" className="brands-section">
        <div className="brands-scroll">
          <div className="brands-track">
            {brands.map((brand) => (
              <Link
                key={`b1-${brand.id}`}
                href={`/brand/${brand.id}`}
                className="brand-card"
              >
                {brand.brand_logo ? (
                  <img
                    src={`/static/uploads/brands/${brand.brand_logo}`}
                    alt={brand.brand_name}
                  />
                ) : (
                  <span className="brand-name">{brand.brand_name}</span>
                )}
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {brands.map((brand) => (
              <Link
                key={`b2-${brand.id}`}
                href={`/brand/${brand.id}`}
                className="brand-card"
                aria-hidden="true"
              >
                {brand.brand_logo ? (
                  <img
                    src={`/static/uploads/brands/${brand.brand_logo}`}
                    alt={brand.brand_name}
                  />
                ) : (
                  <span className="brand-name">{brand.brand_name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="section-header d-flex justify-content-between align-items-end">
            <div>
              <span className="section-eyebrow">Curated Selection</span>
              <h2 className="section-title">Featured</h2>
              <div className="section-rule"></div>
            </div>
            <Link href="/categories" className="view-all-link">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row product-grid g-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL PROMO STRIP */}
      <section className="promo-section">
        <div className="promo-editorial">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <span className="promo-eyebrow">Limited Offer · This Season</span>
                <h3 className="promo-title">
                  The Summer<br />
                  <strong>Edit. Up to 40% Off.</strong>
                </h3>
                <p className="promo-text">
                  Elevate your wardrobe with our exclusive summer styles. Handpicked
                  from the finest brands, made for the modern man.
                </p>
                <Link href="/categories" className="btn-primary-luxury">
                  Shop the Sale
                </Link>
              </div>
              <div className="col-lg-5 d-none d-lg-block">
                <div className="promo-stats">
                  <div>
                    <span className="promo-stat-value">200+</span>
                    <span className="promo-stat-label">Curated Pieces</span>
                  </div>
                  <div>
                    <span className="promo-stat-value">40%</span>
                    <span className="promo-stat-label">Max Discount</span>
                  </div>
                  <div>
                    <span className="promo-stat-value">15+</span>
                    <span className="promo-stat-label">Premium Brands</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="new-arrivals-section section-padding bg-off-white">
        <div className="container">
          <div className="section-header d-flex justify-content-between align-items-end">
            <div>
              <span className="section-eyebrow">Just In</span>
              <h2 className="section-title">New Arrivals</h2>
              <div className="section-rule"></div>
            </div>
            <Link href="/new-arrivals" className="view-all-link">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row product-grid g-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SHOWCASE */}
      <section className="categories-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Browse By</span>
            <h2 className="section-title">Shop Categories</h2>
            <div className="section-rule centered"></div>
          </div>

          <div className="row category-grid g-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                className="col-lg-3 col-md-6"
              />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND PROMISE / FEATURES */}
      <section className="features-section section-padding">
        <div className="container-fluid px-0">
          <div className="row g-0">
            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="bi bi-truck feature-icon"></i>
                <h5 className="feature-title">Free Shipping</h5>
                <p className="feature-text">
                  Complimentary delivery on all orders above ₹2,999.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="bi bi-shield-check feature-icon"></i>
                <h5 className="feature-title">Secure Payment</h5>
                <p className="feature-text">
                  100% encrypted, secure checkout every time.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="bi bi-arrow-counterclockwise feature-icon"></i>
                <h5 className="feature-title">Easy Returns</h5>
                <p className="feature-text">
                  Hassle-free 30-day return policy, no questions asked.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card" style={{ borderRight: "none" }}>
                <i className="bi bi-headset feature-icon"></i>
                <h5 className="feature-title">24/7 Support</h5>
                <p className="feature-text">
                  Dedicated concierge support at your service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span className="newsletter-eyebrow">Stay Connected</span>
              <h3 className="newsletter-title">Join The Circle</h3>
              <p className="newsletter-text">
                Subscribe for exclusive access to new arrivals, private sales, and
                style editorial.
              </p>
            </div>
            <div className="col-lg-6">
              <form className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control luxury-input"
                    placeholder="Your email address"
                    required
                  />
                  <button className="btn btn-dark" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
