import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q?.trim();
  if (q) {
    return {
      title: `Search: "${q}" - THE HOUSE OF WEAR`,
      description: `Explore search results for "${q}" at The House of Wear. Discover curated luxury menswear and designer collections.`,
    };
  }
  return {
    title: "Search Products - THE HOUSE OF WEAR",
    description: "Search luxury menswear, shirts, trousers, shoes and designer collections.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q?.trim() || "";

  const [products, categories] = await Promise.all([
    query
      ? prisma.product.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
              { brand: { brand_name: { contains: query } } },
              { category: { category_name: { contains: query } } },
            ],
          },
          include: { brand: true },
          orderBy: [
            { is_featured: "desc" },
            { is_new_arrival: "desc" },
            { created_at: "desc" },
          ],
        })
      : prisma.product.findMany({
          take: 12,
          include: { brand: true },
          orderBy: { created_at: "desc" },
        }),
    prisma.category.findMany({
      orderBy: { category_name: "asc" },
    }),
  ]);

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">
              {query ? `Search: "${query}"` : "Search Collection"}
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Search</li>
                {query && <li className="breadcrumb-item active text-truncate">{query}</li>}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Search Input Bar Section */}
      <section className="py-4" style={{ background: "rgba(0, 0, 0, 0.02)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <form action="/search" method="GET" className="d-flex gap-2">
                <div className="position-relative flex-grow-1">
                  <i
                    className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    style={{ fontSize: "1rem" }}
                  ></i>
                  <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Search shirts, trousers, jackets, brands..."
                    className="form-control rounded-pill ps-5 pe-4 py-2"
                    style={{
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontSize: "0.95rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-dark rounded-pill px-4 fw-medium text-uppercase"
                  style={{ letterSpacing: "0.08em", fontSize: "0.85rem" }}
                >
                  Search
                </button>
              </form>

              {/* Quick Suggestion Pills */}
              <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-1 justify-content-center">
                <span className="text-muted small me-1" style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}>
                  POPULAR:
                </span>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?q=${encodeURIComponent(cat.category_name)}`}
                    className="badge rounded-pill text-decoration-none px-3 py-2"
                    style={{
                      background:
                        query.toLowerCase() === cat.category_name.toLowerCase()
                          ? "#000"
                          : "#fff",
                      color:
                        query.toLowerCase() === cat.category_name.toLowerCase()
                          ? "#fff"
                          : "#333",
                      border: "1px solid rgba(0,0,0,0.12)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat.category_name}
                  </Link>
                ))}
                {["Ralph Lauren", "Tommy Hilfiger", "Calvin Klein"].map((brandName) => (
                  <Link
                    key={brandName}
                    href={`/search?q=${encodeURIComponent(brandName)}`}
                    className="badge rounded-pill text-decoration-none px-3 py-2 d-none d-sm-inline-block"
                    style={{
                      background:
                        query.toLowerCase() === brandName.toLowerCase()
                          ? "#000"
                          : "#fff",
                      color:
                        query.toLowerCase() === brandName.toLowerCase()
                          ? "#fff"
                          : "#555",
                      border: "1px solid rgba(0,0,0,0.12)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {brandName}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 pb-2 border-bottom">
            <div>
              <span className="text-muted small text-uppercase" style={{ letterSpacing: "0.1em" }}>
                {query ? "Search Results" : "Featured Suggestions"}
              </span>
              <h2 className="h4 mb-0 fw-semibold">
                {query ? (
                  <>
                    {products.length} {products.length === 1 ? "Result" : "Results"} for{" "}
                    <span className="text-dark">"{query}"</span>
                  </>
                ) : (
                  "Explore Trending Pieces"
                )}
              </h2>
            </div>
            {products.length > 0 && (
              <span className="text-muted small">
                Showing all {products.length} matching items
              </span>
            )}
          </div>

          <div className="row product-grid g-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-12 py-5 text-center">
                <div
                  className="mx-auto p-5 rounded-4"
                  style={{
                    maxWidth: "540px",
                    background: "rgba(0,0,0,0.02)",
                    border: "1px dashed rgba(0,0,0,0.15)",
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: "64px", height: "64px", background: "#f1f1f1" }}
                  >
                    <i className="bi bi-search text-muted" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <h3 className="h5 fw-bold mb-2">No Matching Products Found</h3>
                  <p className="text-muted small mb-4" style={{ lineHeight: "1.6" }}>
                    We couldn't find any results for "{query}". Try checking your spelling or browse our popular categories below.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="btn btn-outline-dark btn-sm rounded-pill px-3"
                      >
                        {cat.category_name}
                      </Link>
                    ))}
                    <Link
                      href="/new-arrivals"
                      className="btn btn-dark btn-sm rounded-pill px-3"
                    >
                      New Arrivals
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
