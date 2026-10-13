"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product, Brand } from "@prisma/client";
import { getImageUrl } from "@/lib/imageHelper";

type CartItemType = {
  product: Product & { brand: Brand };
  quantity: number;
  subtotal: number;
  size: string;
  cartKey: string;
};

export default function CartClient({
  cartItems,
  total,
  isAuthenticated,
}: {
  cartItems: CartItemType[];
  total: number;
  isAuthenticated: boolean;
}) {
  if (cartItems.length === 0) {
    return (
      <motion.div
        className="empty-cart text-center py-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="empty-cart-icon mb-3"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
        >
          <i className="bi bi-bag-x" style={{ fontSize: "3.5rem", color: "#a1a1aa" }}></i>
        </motion.div>
        <h3 className="fw-semibold">Your cart is empty</h3>
        <p className="text-muted mb-4">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link href="/categories" className="btn btn-primary-luxury px-4 py-2">
            Start Shopping
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.cartKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className={`cart-item ${
                index !== cartItems.length - 1 ? "border-bottom pb-4 mb-4" : ""
              }`}
            >
              <div className="row align-items-center">
                <div className="col-md-2 col-4">
                  <div className="cart-item-image" style={{ borderRadius: "8px", overflow: "hidden" }}>
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      style={{ width: "100%", height: "90px", objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-8">
                  <div className="cart-item-info">
                    <span className="item-brand small text-muted text-uppercase">
                      {item.product.brand.brand_name}
                    </span>
                    <h5 className="item-name mb-1">
                      <Link href={`/product/${item.product.id}`} className="text-decoration-none text-dark">
                        {item.product.name}
                      </Link>
                    </h5>
                    <span className="item-size small text-muted d-block mb-1">Size: {item.size}</span>
                    <span className="item-price fw-semibold">
                      ₹{Math.round(
                        item.product.discount_price || item.product.price
                      )}
                    </span>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <form action="/api/cart/update" method="POST" className="quantity-form">
                    <input type="hidden" name="cart_key" value={item.cartKey} />
                    <div className="quantity-input-group d-flex align-items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="quantity-btn minus btn btn-sm btn-outline-secondary"
                        onClick={(e) => {
                          const input = e.currentTarget.nextElementSibling as HTMLInputElement;
                          input.stepDown();
                          e.currentTarget.form?.submit();
                        }}
                      >
                        <i className="bi bi-dash"></i>
                      </motion.button>
                      <input
                        type="number"
                        name="quantity"
                        defaultValue={item.quantity}
                        min="1"
                        max={item.product.stock}
                        className="quantity-input form-control form-control-sm text-center"
                        style={{ width: "48px" }}
                        onChange={(e) => e.currentTarget.form?.submit()}
                      />
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="quantity-btn plus btn btn-sm btn-outline-secondary"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          input.stepUp();
                          e.currentTarget.form?.submit();
                        }}
                      >
                        <i className="bi bi-plus"></i>
                      </motion.button>
                    </div>
                  </form>
                </div>
                <div className="col-md-2 col-4">
                  <span className="item-subtotal fw-bold">₹{Math.round(item.subtotal)}</span>
                </div>
                <div className="col-md-1 col-2 text-end">
                  <form action="/api/cart/remove" method="POST" style={{ display: "inline" }}>
                    <input type="hidden" name="cart_key" value={item.cartKey} />
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      type="submit"
                      className="remove-item btn btn-outline-danger btn-sm border-0"
                      title="Remove"
                    >
                      <i className="bi bi-trash"></i>
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="cart-actions mt-4">
          <motion.div whileHover={{ x: -4 }} style={{ display: "inline-block" }}>
            <Link href="/categories" className="btn btn-outline-dark">
              <i className="bi bi-arrow-left me-1"></i> Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="col-lg-4">
        <motion.div
          className="cart-summary p-4 border rounded-3 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <h4 className="summary-title fw-semibold mb-3">Order Summary</h4>

          <div className="summary-item d-flex justify-content-between mb-2">
            <span className="text-muted">Subtotal</span>
            <span>₹{Math.round(total)}</span>
          </div>
          <div className="summary-item d-flex justify-content-between mb-2">
            <span className="text-muted">Shipping</span>
            <span className="text-success fw-medium">Free</span>
          </div>
          <div className="summary-item d-flex justify-content-between mb-3">
            <span className="text-muted">Tax</span>
            <span>Included</span>
          </div>

          <div className="summary-divider border-top my-3"></div>

          <div className="summary-item total d-flex justify-content-between mb-4">
            <span className="fw-bold fs-5">Total</span>
            <span className="total-price fw-bold fs-5">₹{Math.round(total)}</span>
          </div>

          {isAuthenticated ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/checkout" className="btn btn-primary-luxury btn-lg w-100 text-center d-block">
                Proceed to Checkout
              </Link>
            </motion.div>
          ) : (
            <div className="cart-login-prompt text-center">
              <p className="login-prompt-text small text-muted mb-3">
                <i className="bi bi-lock me-1"></i> Login to complete your purchase
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/login?next=/checkout"
                  className="btn btn-primary-luxury btn-lg w-100 text-center d-block mb-2"
                >
                  Login to Checkout
                </Link>
              </motion.div>
              <p className="login-prompt-sub small text-muted mt-2 mb-0">
                New here? <Link href="/register" className="text-dark fw-medium">Create an account</Link>
              </p>
            </div>
          )}

          <div className="secure-checkout text-center text-muted small mt-3 pt-3 border-top">
            <i className="bi bi-shield-check text-success me-1"></i>
            <span>Secure Checkout</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
