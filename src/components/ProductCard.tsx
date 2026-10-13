"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product, Brand } from "@prisma/client";
import { getImageUrl } from "@/lib/imageHelper";

type ProductWithBrand = Product & { brand: Brand };

export default function ProductCard({ product }: { product: ProductWithBrand }) {
  const discountPercentage =
    product.discount_price && product.price > 0
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100
        )
      : 0;

  return (
    <motion.div
      className="col-lg-3 col-md-4 col-sm-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{
        opacity: { duration: 0.4, ease: "easeOut" },
        y: { duration: 0.35, ease: "easeOut" },
        scale: { type: "spring", stiffness: 350, damping: 25 },
      }}
    >
      <div className="product-card">
        <div className="product-image">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80&auto=format";
            }}
          />

          {discountPercentage > 0 ? (
            <motion.span
              className="product-badge discount"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              −{discountPercentage}%
            </motion.span>
          ) : product.is_new_arrival ? (
            <motion.span
              className="product-badge new"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              New
            </motion.span>
          ) : null}

          {/* Quick Add bar */}
          <div className="quick-add-bar">
            <span className="quick-add-text">Quick Add</span>
            <div className="icon-btns">
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href={`/product/${product.id}`}
                  className="icon-btn quick-view-btn"
                  title="View Details"
                >
                  <i className="bi bi-eye"></i>
                </Link>
              </motion.div>

              <form action="/api/cart/add" method="POST" style={{ margin: 0 }}>
                <input type="hidden" name="product_id" value={product.id} />
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="icon-btn"
                  title="Add to Cart"
                  disabled={product.stock <= 0}
                >
                  <i className="bi bi-bag-plus"></i>
                </motion.button>
              </form>
            </div>
          </div>
        </div>
        <div className="product-info">
          <span className="product-brand">{product.brand.brand_name}</span>
          <h5 className="product-name">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h5>
          <div className="product-price">
            {product.discount_price && product.discount_price > 0 ? (
              <>
                <span className="current-price">
                  ₹{Math.round(product.discount_price)}
                </span>
                <span className="original-price">
                  ₹{Math.round(product.price)}
                </span>
              </>
            ) : (
              <span className="current-price">₹{Math.round(product.price)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
