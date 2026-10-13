"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  cartCount = 0,
  isAuthenticated = false,
}: {
  cartCount?: number;
  isAuthenticated?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu and desktop search dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
    setSuggestions([]);
  }, [pathname]);

  // Close mobile menu if window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Live autocomplete query with 250ms debounce
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#navbarSearchWrapper")) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const executeSearch = (textToSearch: string) => {
    const trimmed = textToSearch.trim();
    if (trimmed.length > 0) {
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
      setSuggestions([]);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <>
      <nav className="navbar navbar-light luxury-navbar fixed-top">
        <div className="container d-flex align-items-center justify-content-between flex-nowrap">
          {/* Brand Logo */}
          <Link className="navbar-brand d-flex align-items-center flex-shrink-1 text-truncate" href="/">
            <img
              src="/static/images/lpng.png"
              alt="The House of Wear"
              className="navbar-logo-img"
            />
            <span className="brand-text text-truncate">THE HOUSE OF WEAR</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center justify-content-between flex-grow-1 ms-4">
            <ul className="navbar-nav mx-auto d-flex flex-row gap-2">
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/" ? "active" : ""}`}
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    pathname === "/categories" ? "active" : ""
                  }`}
                  href="/categories"
                >
                  Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    pathname === "/new-arrivals" ? "active" : ""
                  }`}
                  href="/new-arrivals"
                >
                  New Arrivals
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/about" ? "active" : ""}`}
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    pathname === "/contact" ? "active" : ""
                  }`}
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Right Side Icons */}
            <ul className="navbar-nav nav-icons d-flex flex-row align-items-center gap-1">
              {/* Expandable Search */}
              <li className="nav-item">
                <div
                  className={`navbar-search-wrapper ${
                    isSearchExpanded ? "expanded" : ""
                  }`}
                  id="navbarSearchWrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    id="compactSearchInput"
                    className="luxury-search-input-compact"
                    placeholder="Search collections..."
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        executeSearch(searchQuery);
                      } else if (e.key === "Escape") {
                        setIsSearchExpanded(false);
                      }
                    }}
                  />
                  <a
                    className="nav-link search-trigger-compact"
                    id="compactSearchTrigger"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isSearchExpanded) {
                        if (searchQuery.trim().length > 0) {
                          executeSearch(searchQuery);
                        } else {
                          setIsSearchExpanded(false);
                        }
                      } else {
                        setIsSearchExpanded(true);
                        setTimeout(() => {
                          document.getElementById("compactSearchInput")?.focus();
                        }, 200);
                      }
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </a>
                  <div
                    className={`compact-suggestions-dropdown ${
                      isSearchExpanded && (suggestions.length > 0 || isSearching || searchQuery.trim().length >= 2)
                        ? "active"
                        : ""
                    }`}
                    id="compactSuggestions"
                  >
                    {isSearching && suggestions.length === 0 ? (
                      <div className="compact-empty-state d-flex align-items-center justify-content-center gap-2 py-3">
                        <span className="spinner-border spinner-border-sm text-secondary" role="status"></span>
                        <span>Searching collections...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.map((product: any) => (
                          <Link
                            key={product.id}
                            href={product.url}
                            className="compact-suggestion-item"
                            onClick={() => {
                              setIsSearchExpanded(false);
                              setSuggestions([]);
                            }}
                          >
                            <img
                              src={product.image}
                              className="compact-suggest-img"
                              alt={product.name}
                            />
                            <div className="compact-suggest-info">
                              <span className="compact-suggest-brand">
                                {product.brand}
                              </span>
                              <span className="compact-suggest-name">
                                {product.name}
                              </span>
                              <span className="compact-suggest-price">
                                ₹{Math.round(product.price)}
                              </span>
                            </div>
                          </Link>
                        ))}
                        <div
                          className="p-2 text-center border-top bg-light"
                          style={{ cursor: "pointer" }}
                          onClick={() => executeSearch(searchQuery)}
                        >
                          <span className="small fw-semibold text-dark">
                            View all results for "{searchQuery.trim()}" →
                          </span>
                        </div>
                      </>
                    ) : searchQuery.trim().length >= 2 ? (
                      <div className="compact-empty-state py-3">
                        No products found for "{searchQuery.trim()}"
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>

              {/* Cart */}
              <li className="nav-item">
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                  <Link className="nav-link position-relative" href="/cart">
                    <i className="bi bi-bag"></i>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 15,
                        }}
                        className="cart-badge"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              </li>

              {/* User Account Dropdown */}
              <li className="nav-item dropdown">
                <motion.a
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="nav-link"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person"></i>
                </motion.a>
                <ul className="dropdown-menu dropdown-menu-end luxury-dropdown">
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link className="dropdown-item" href="/profile">
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/profile#orders">
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <form action="/api/auth/logout" method="POST">
                          <button
                            type="submit"
                            className="dropdown-item text-danger"
                            style={{
                              background: "none",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                            }}
                          >
                            Logout
                          </button>
                        </form>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link className="dropdown-item" href="/login">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/register">
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>

          {/* Mobile Right Controls */}
          <div className="d-flex d-lg-none align-items-center gap-1 flex-shrink-0">
            {/* Mobile Cart Shortcut */}
            <Link
              href="/cart"
              className="btn btn-link position-relative p-2 text-dark"
              aria-label="Shopping Bag"
            >
              <i className="bi bi-bag" style={{ fontSize: "1.25rem" }}></i>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* Apple-style Animated Hamburger Toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              className={`mobile-hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <span className="mobile-hamburger-line"></span>
              <span className="mobile-hamburger-line"></span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Apple-Style Mobile Navigation Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="mobile-menu-overlay"
          >
            {/* Search Pill */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSearch(searchQuery);
              }}
              className="mobile-search-pill"
            >
              <i className="bi bi-search text-muted"></i>
              <input
                type="text"
                placeholder="Search collections, shirts, pants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="btn btn-link p-0 text-muted"
                  style={{ textDecoration: "none" }}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </form>

            {/* Mobile Live Suggestions Preview */}
            {suggestions.length > 0 && (
              <div
                className="mobile-suggestions-box my-2 rounded-3 overflow-hidden shadow-sm border"
                style={{ background: "#ffffff" }}
              >
                {suggestions.slice(0, 4).map((item: any) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setSuggestions([]);
                    }}
                    className="d-flex align-items-center p-2 text-decoration-none border-bottom text-dark"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "36px",
                        height: "44px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginRight: "10px",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <div
                        className="text-muted text-uppercase"
                        style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
                      >
                        {item.brand}
                      </div>
                      <div
                        className="text-truncate fw-medium"
                        style={{ fontSize: "0.82rem" }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="fw-semibold text-dark"
                        style={{ fontSize: "0.78rem" }}
                      >
                        ₹{Math.round(item.price)}
                      </div>
                    </div>
                  </Link>
                ))}
                <div
                  className="py-2 text-center bg-light text-dark small fw-semibold"
                  style={{ cursor: "pointer", fontSize: "0.78rem" }}
                  onClick={() => executeSearch(searchQuery)}
                >
                  View all results for "{searchQuery.trim()}" →
                </div>
              </div>
            )}

            {/* Mobile Nav Links */}
            <ul className="mobile-nav-list">
              <li className="mobile-nav-item">
                <Link
                  href="/"
                  className={`mobile-nav-link ${pathname === "/" ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Home</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  href="/categories"
                  className={`mobile-nav-link ${
                    pathname === "/categories" ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Categories</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  href="/new-arrivals"
                  className={`mobile-nav-link ${
                    pathname === "/new-arrivals" ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>New Arrivals</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  href="/about"
                  className={`mobile-nav-link ${
                    pathname === "/about" ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>About</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  href="/contact"
                  className={`mobile-nav-link ${
                    pathname === "/contact" ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Contact</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </li>
            </ul>

            {/* Account & Bag Card */}
            <div className="mobile-actions-card">
              <Link
                href="/cart"
                className="mobile-action-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="bi bi-bag"></i>
                <span>Shopping Bag {cartCount > 0 && `(${cartCount})`}</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="mobile-action-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="bi bi-person"></i>
                    <span>My Profile & Orders</span>
                  </Link>
                  <form action="/api/auth/logout" method="POST" className="m-0">
                    <button
                      type="submit"
                      className="mobile-action-btn text-danger w-100"
                      style={{ border: "none" }}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Logout</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <Link
                    href="/login"
                    className="mobile-action-btn flex-fill justify-content-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="mobile-action-btn flex-fill justify-content-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Footer Tagline */}
            <div
              className="text-center text-muted small mt-auto pt-2"
              style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}
            >
              <span>THE HOUSE OF WEAR • CURATED LUXURY</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
