"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brand } from "@prisma/client";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <motion.div
      className="col-sm-4 col-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        opacity: { duration: 0.35, ease: "easeOut" },
        scale: { type: "spring", stiffness: 350, damping: 25 },
        y: { duration: 0.2 },
      }}
    >
      <Link
        href={`/brand/${brand.id}`}
        className="brand-card-simple p-3 border rounded-3 text-center d-flex align-items-center justify-content-center bg-white shadow-sm"
        style={{ height: "120px", textDecoration: "none", color: "inherit", transition: "box-shadow 0.2s" }}
      >
        {brand.brand_logo ? (
          <img
            src={`/static/uploads/brands/${brand.brand_logo}`}
            alt={brand.brand_name}
            style={{ maxHeight: "60px", maxWidth: "100%", objectFit: "contain" }}
          />
        ) : (
          <span className="brand-name fw-bold">{brand.brand_name}</span>
        )}
      </Link>
    </motion.div>
  );
}
