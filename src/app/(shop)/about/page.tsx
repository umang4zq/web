import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AnimatedReveal from "@/components/AnimatedReveal";

export const metadata = {
  title: "About Us - THE HOUSE OF WEAR",
};

export default async function AboutPage() {
  const brands = await prisma.brand.findMany();

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">About Us</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">About</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <AnimatedReveal delay={0.1}>
                <div className="about-image">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                    alt="Our Store"
                    className="img-fluid"
                  />
                  <div className="experience-badge">
                    <span className="years">10+</span>
                    <span className="text">
                      Years of<br />Excellence
                    </span>
                  </div>
                </div>
              </AnimatedReveal>
            </div>
            <div className="col-lg-6">
              <AnimatedReveal delay={0.2}>
                <div className="about-content">
                  <span className="section-subtitle">Our Story</span>
                  <h2 className="section-title">Redefining Men's Fashion</h2>
                  <p className="about-text">
                    Founded in 2014, THE HOUSE OF WEAR has grown from a small
                    boutique to one of India's premier destinations for luxury men's
                    fashion. We believe that style is not just about clothing—it's
                    about expressing your personality and confidence.
                  </p>
                  <p className="about-text">
                    Our curated collection features the finest brands from around the
                    world, handpicked for their quality, craftsmanship, and timeless
                    appeal. From classic formal wear to contemporary casuals, we
                    offer a comprehensive range that caters to every occasion.
                  </p>

                  <div className="about-stats">
                    <div className="stat-item">
                      <span className="stat-number">50+</span>
                      <span className="stat-label">Premium Brands</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">10K+</span>
                      <span className="stat-label">Happy Customers</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">100K+</span>
                      <span className="stat-label">Products Sold</span>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section section-padding bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <AnimatedReveal delay={0.1}>
                <div className="mission-card h-100">
                  <div className="mission-icon">
                    <i className="bi bi-gem"></i>
                  </div>
                  <h4 className="mission-title">Our Mission</h4>
                  <p className="mission-text">
                    To provide men with access to the world's finest fashion brands,
                    delivering exceptional quality and style that inspires
                    confidence.
                  </p>
                </div>
              </AnimatedReveal>
            </div>
            <div className="col-lg-4">
              <AnimatedReveal delay={0.2}>
                <div className="mission-card h-100">
                  <div className="mission-icon">
                    <i className="bi bi-eye"></i>
                  </div>
                  <h4 className="mission-title">Our Vision</h4>
                  <p className="mission-text">
                    To become India's most trusted destination for luxury men's
                    fashion, known for our curated collections and unparalleled
                    customer experience.
                  </p>
                </div>
              </AnimatedReveal>
            </div>
            <div className="col-lg-4">
              <AnimatedReveal delay={0.3}>
                <div className="mission-card h-100">
                  <div className="mission-icon">
                    <i className="bi bi-heart"></i>
                  </div>
                  <h4 className="mission-title">Our Values</h4>
                  <p className="mission-text">
                    Quality, authenticity, and customer satisfaction are at the heart
                    of everything we do. We believe in building lasting
                    relationships.
                  </p>
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Our Partners</span>
            <h2 className="section-title">Brands We Carry</h2>
            <p className="section-description">
              We partner with the world's most prestigious fashion houses to bring
              you authentic luxury
            </p>
          </div>

          <div className="row brand-grid">
            {brands.map((brand) => (
              <div className="col-lg-2 col-md-4 col-6" key={brand.id}>
                <div className="brand-item text-center">
                  {brand.brand_logo ? (
                    <img
                      src={`/static/uploads/brands/${brand.brand_logo}`}
                      alt={brand.brand_name}
                      className="img-fluid"
                    />
                  ) : (
                    <span className="brand-name">{brand.brand_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
