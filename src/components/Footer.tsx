import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="luxury-footer">
      <div className="container">
        <div className="row g-5">
          {/* Brand & About */}
          <div className="col-lg-5">
            <div className="footer-brand">
              <img
                src="/static/images/wpng.png"
                alt="THE HOUSE OF WEAR"
                className="footer-logo-img"
              />
              <h5 className="footer-title">THE HOUSE OF WEAR</h5>
            </div>
            <p className="footer-text">
              The House of Wear is a curated destination for the modern man,
              offering a collection of premium luxury labels defined by quality
              and timeless aesthetic.
            </p>
            <div className="social-icons">
              <a href="#" className="social-link">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Explorations */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-subtitle">Explorations</h6>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/categories">Collections</Link>
              </li>
              <li>
                <Link href="/new-arrivals">New Arrivals</Link>
              </li>
              <li>
                <Link href="/about">Our Story</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Concierge */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-subtitle">Concierge</h6>
            <ul className="footer-contact">
              <li>
                <i className="bi bi-geo-alt"></i> TheHouseOfWear, Rajkot
              </li>
              <li>
                <i className="bi bi-telephone"></i> 7069757070
              </li>
              <li>
                <i className="bi bi-envelope"></i> support@thehouseofwear.com
              </li>
              <li className="mt-4">
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                  }}
                >
                  Payment Options
                </span>
              </li>
              <li
                style={{
                  color: "var(--white)",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                Cash on Delivery
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="copyright">
              &copy; {currentYear} THE HOUSE OF WEAR. Curated Luxury.
            </p>
          </div>
          <div className="col-md-6">
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Shipping</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
