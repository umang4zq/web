"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Brand, Category, ProductImage } from "@prisma/client";
import { getImageUrl } from "@/lib/imageHelper";

type ProductComplete = Product & {
  brand: Brand;
  category: Category;
  images: ProductImage[];
};

export default function ProductDetailClient({
  product,
}: {
  product: ProductComplete;
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product.image ? getImageUrl(product.image) : ""
  );

  const isShoe =
    product.category.category_name.toLowerCase().includes("shoe") ||
    product.category.category_name.toLowerCase().includes("footwear") ||
    product.category.category_name.toLowerCase().includes("sneaker") ||
    product.category.category_name.toLowerCase().includes("sandal");

  const sizes = isShoe
    ? ["7", "8", "9", "10", "11"]
    : ["S", "M", "L", "XL", "XXL"];

  const [selectedSize, setSelectedSize] = useState(isShoe ? "9" : "M");

  const updateQuantity = (change: number) => {
    setQuantity((prev) => {
      const newQ = prev + change;
      if (newQ >= 1 && newQ <= product.stock) {
        return newQ;
      }
      return prev;
    });
  };

  const discountPercentage =
    product.discount_price && product.price > 0
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100
        )
      : 0;

  const isInStock = product.stock > 0;

  const allImages = Array.from(
    new Set([
      ...(product.image ? [getImageUrl(product.image)] : []),
      ...product.images.map((img) => getImageUrl(img.image)),
    ])
  ).map((imgUrl, index) => ({
    id: `img-${index}`,
    image: imgUrl,
  }));

  return (
    <div className="row g-5">
      {/* Product Image Gallery */}
      <motion.div
        className="col-lg-6"
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="product-image-gallery position-relative">
          <div
            className="main-image position-relative"
            style={{
              overflow: "hidden",
              borderRadius: "16px",
              backgroundColor: "#f4f4f5",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
            }}
          >
            <AnimatePresence mode="wait">
              {activeImage ? (
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  drag={allImages.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 45;
                    const velocityThreshold = 350;
                    if (
                      info.offset.x < -swipeThreshold ||
                      info.velocity.x < -velocityThreshold
                    ) {
                      const currentIndex = allImages.findIndex(
                        (img) => img.image === activeImage
                      );
                      const nextIndex =
                        currentIndex === allImages.length - 1
                          ? 0
                          : currentIndex + 1;
                      setActiveImage(allImages[nextIndex].image);
                    } else if (
                      info.offset.x > swipeThreshold ||
                      info.velocity.x > velocityThreshold
                    ) {
                      const currentIndex = allImages.findIndex(
                        (img) => img.image === activeImage
                      );
                      const prevIndex =
                        currentIndex === 0
                          ? allImages.length - 1
                          : currentIndex - 1;
                      setActiveImage(allImages[prevIndex].image);
                    }
                  }}
                  initial={{ opacity: 0.5, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.5, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "3/4",
                    display: "block",
                    cursor: allImages.length > 1 ? "grab" : "default",
                  }}
                  whileDrag={{ cursor: "grabbing" }}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
                  alt={product.name}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "3/4",
                    display: "block",
                  }}
                />
              )}
            </AnimatePresence>

            {allImages.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const currentIndex = allImages.findIndex(
                      (img) => img.image === activeImage
                    );
                    const prevIndex =
                      currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
                    setActiveImage(allImages[prevIndex].image);
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "1rem",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    border: "none",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  <i className="bi bi-chevron-left" style={{ fontSize: "1.2rem", color: "#000" }}></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const currentIndex = allImages.findIndex(
                      (img) => img.image === activeImage
                    );
                    const nextIndex =
                      currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
                    setActiveImage(allImages[nextIndex].image);
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "1rem",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    border: "none",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  <i className="bi bi-chevron-right" style={{ fontSize: "1.2rem", color: "#000" }}></i>
                </motion.button>
              </>
            )}

            {discountPercentage > 0 && (
              <span className="product-badge discount">-{discountPercentage}%</span>
            )}
            {product.is_new_arrival && (
              <span
                className={`product-badge new ${
                  discountPercentage > 0 ? "offset" : ""
                }`}
              >
                New
              </span>
            )}
          </div>

          {/* Thumbnail Indicators */}
          {allImages.length > 1 && (
            <div className="mt-3 d-flex flex-wrap gap-2">
              {allImages.map((img) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`thumbnail-item ${activeImage === img.image ? "active" : ""}`}
                  style={{
                    width: "80px",
                    height: "100px",
                    borderRadius: "10px",
                    border: activeImage === img.image ? "2px solid #000" : "1px solid rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    opacity: activeImage === img.image ? 1 : 0.65,
                    boxShadow: activeImage === img.image ? "0 4px 14px rgba(0,0,0,0.12)" : "none",
                    transition: "border 0.2s, opacity 0.2s, box-shadow 0.2s",
                  }}
                  onClick={() => setActiveImage(img.image)}
                >
                  <img
                    src={img.image}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    alt="Thumbnail"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        className="col-lg-6"
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="product-info-detail" style={{ position: "sticky", top: "88px" }}>
          <span className="product-brand">{product.brand.brand_name}</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-price-detail">
            {product.discount_price && product.discount_price > 0 ? (
              <>
                <span className="current-price">
                  ₹{Math.round(product.discount_price).toLocaleString("en-IN")}
                </span>
                <span className="original-price">
                  ₹{Math.round(product.price).toLocaleString("en-IN")}
                </span>
                <span className="discount-badge">Save {discountPercentage}%</span>
              </>
            ) : (
              <span className="current-price">
                ₹{Math.round(product.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="product-description">
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category.category_name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              {isInStock ? (
                <span className="meta-value in-stock">
                  <i className="bi bi-check-circle-fill" style={{ color: "#28a745" }}></i> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="meta-value out-of-stock">
                  <i className="bi bi-x-circle-fill" style={{ color: "#dc3545" }}></i> Out of Stock
                </span>
              )}
            </div>
            <div className="meta-item">
              <span className="meta-label">Brand:</span>
              <span className="meta-value">{product.brand.brand_name}</span>
            </div>
          </div>

          {isInStock ? (
            <form action="/api/cart/add" method="POST" className="product-actions-form">
              <input type="hidden" name="product_id" value={product.id} />

              {/* Size Selector */}
              <div className="size-selector">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="size-label mb-0">
                    Size: <span style={{ fontWeight: 600, color: "#000", textTransform: "none", letterSpacing: "normal" }}>{selectedSize}</span>
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.04em" }}>
                    <i className="bi bi-rulers me-1"></i>Standard Fit
                  </span>
                </div>
                <div className="size-options">
                  {sizes.map((sz) => (
                    <motion.button
                      key={sz}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      className={`size-btn ${selectedSize === sz ? "active" : ""}`}
                      onClick={() => setSelectedSize(sz)}
                      aria-label={`Select size ${sz}`}
                    >
                      {sz}
                    </motion.button>
                  ))}
                </div>
                <input type="hidden" name="size" value={selectedSize} />
              </div>

              {/* Quantity Selector */}
              <div className="quantity-selector">
                <span className="quantity-label">Quantity</span>
                <div className="quantity-input-group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="quantity-btn minus"
                    onClick={() => updateQuantity(-1)}
                    aria-label="Decrease quantity"
                  >
                    <i className="bi bi-dash"></i>
                  </motion.button>
                  <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    readOnly
                    className="quantity-input"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="quantity-btn plus"
                    onClick={() => updateQuantity(1)}
                    aria-label="Increase quantity"
                  >
                    <i className="bi bi-plus"></i>
                  </motion.button>
                </div>
              </div>

              <div className="action-buttons">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn btn-primary-luxury btn-lg w-100"
                >
                  <i className="bi bi-bag-plus"></i> Add to Cart • ₹{(Math.round(product.discount_price || product.price) * quantity).toLocaleString("en-IN")}
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="out-of-stock-message">
              <button className="btn btn-secondary btn-lg w-100" disabled style={{ borderRadius: "9999px", height: "56px" }}>
                <i className="bi bi-x-circle me-2"></i> Out of Stock
              </button>
              <p className="notify-text mt-2 text-muted small">
                This item is currently sold out. Check back soon for restock!
              </p>
            </div>
          )}

          {/* Product Features */}
          <div className="product-features mt-4">
            <div className="feature-item">
              <i className="bi bi-truck"></i>
              <div>
                <span style={{ fontWeight: 600, display: "block", color: "#111" }}>Complimentary Express Shipping</span>
                <small style={{ color: "#666" }}>Delivery in 2-4 business days across India</small>
              </div>
            </div>
            <div className="feature-item">
              <i className="bi bi-shield-check"></i>
              <div>
                <span style={{ fontWeight: 600, display: "block", color: "#111" }}>100% Authentic Designer Guarantee</span>
                <small style={{ color: "#666" }}>Directly sourced with certificate of origin</small>
              </div>
            </div>
            <div className="feature-item">
              <i className="bi bi-arrow-counterclockwise"></i>
              <div>
                <span style={{ fontWeight: 600, display: "block", color: "#111" }}>30-Day Hassle-Free Returns</span>
                <small style={{ color: "#666" }}>Complimentary reverse pickup & instant store credit/refund</small>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
