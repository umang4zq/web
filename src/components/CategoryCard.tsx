"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Category } from "@prisma/client";

type CategoryWithCount = Category & {
  _count: { products: number };
};

export default function CategoryCard({
  category,
  className = "col-sm-6",
}: {
  category: CategoryWithCount;
  className?: string;
}) {
  const getInitialImage = () => {
    if (!category.category_image) {
      return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80";
    }
    if (category.category_image.startsWith("http")) {
      return category.category_image;
    }
    if (category.category_image.includes("/")) {
      return `/static/uploads/products/${category.category_image}`;
    }
    return `/static/uploads/brands/${category.category_image}`;
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        opacity: { duration: 0.45, ease: "easeOut" },
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <Link
        href={`/category/${category.id}`}
        className="category-card"
        style={{
          height: "220px",
          display: "block",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#18181B",
          textDecoration: "none",
        }}
      >
        <div
          className="category-image"
          style={{ height: "100%", width: "100%", position: "relative" }}
        >
          <img
            src={imgSrc}
            alt={category.category_name}
            onError={() => {
              setImgSrc(
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
              );
            }}
            style={{
              objectFit: "cover",
              height: "100%",
              width: "100%",
              display: "block",
            }}
          />
          <div
            className="category-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "1.25rem",
            }}
          >
            <div className="category-content text-center px-2">
              <h4
                className="category-name"
                style={{
                  whiteSpace: "nowrap",
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                {category.category_name}
              </h4>
              <span
                className="category-count"
                style={{
                  display: "block",
                  marginTop: "0.25rem",
                  fontSize: "0.8rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {category._count.products} Items
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
