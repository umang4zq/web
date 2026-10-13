import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout - THE HOUSE OF WEAR",
};

export default async function CheckoutPage() {
  const session = await getSession("user");
  if (!session) {
    redirect("/login?next=/checkout");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  
  let cart: Record<string, number> = {};
  if (cartCookie?.value) {
    try {
      cart = JSON.parse(cartCookie.value);
    } catch (e) {
      cart = {};
    }
  }

  if (Object.keys(cart).length === 0) {
    redirect("/cart");
  }

  const cartItems = [];
  let total = 0;

  for (const [key, quantity] of Object.entries(cart)) {
    const [productIdStr, size] = key.split(":");
    const productId = parseInt(productIdStr, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (product) {
      const price = product.discount_price || product.price;
      const subtotal = price * quantity;
      
      cartItems.push({
        product,
        quantity,
        subtotal,
        size: size || "M",
      });
      total += subtotal;
    }
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Checkout</h1>
          </div>
        </div>
      </section>

      <section className="checkout-section section-padding">
        <div className="container">
          <form action="/api/checkout" method="POST">
            <div className="row">
              <div className="col-lg-7">
                <div className="checkout-card mb-4">
                  <h4 className="mb-4">Shipping Information</h4>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="shipping_name"
                        className="form-control"
                        defaultValue={user?.name || ""}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="shipping_phone"
                        className="form-control"
                        defaultValue={user?.phone || ""}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        name="shipping_address"
                        className="form-control"
                        rows={3}
                        defaultValue={user?.address || ""}
                        required
                      ></textarea>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="shipping_city"
                        className="form-control"
                        defaultValue={user?.city || ""}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="shipping_state"
                        className="form-control"
                        defaultValue={user?.state || ""}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">PIN Code</label>
                      <input
                        type="text"
                        name="shipping_pincode"
                        className="form-control"
                        defaultValue={user?.pincode || ""}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-card">
                  <h4 className="mb-4">Payment Method</h4>
                  <div className="payment-options">
                    <div className="form-check payment-method-card active">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment_method"
                        id="cod"
                        value="cod"
                        defaultChecked
                      />
                      <label className="form-check-label w-100" htmlFor="cod">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-bold d-block">Cash on Delivery</span>
                            <small className="text-muted">Pay when your order arrives</small>
                          </div>
                          <i className="bi bi-cash fs-3"></i>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 mt-4 mt-lg-0">
                <div className="checkout-summary sticky-top" style={{ top: "100px" }}>
                  <h4 className="mb-4">Order Summary</h4>
                  
                  <div className="checkout-items mb-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="checkout-item">
                        <div className="d-flex align-items-center">
                          <div className="checkout-item-img me-3">
                            {item.product.image ? (
                              <img src={`/static/uploads/products/${item.product.image}`} alt={item.product.name} style={{ width: "60px", height: "80px", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "60px", height: "80px", background: "#f8f9fa" }}></div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{item.product.name}</h6>
                            <small className="text-muted">Size: {item.size} | Qty: {item.quantity}</small>
                          </div>
                          <div className="text-end fw-medium">
                            ₹{Math.round(item.subtotal)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{Math.round(total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span className="total-price">₹{Math.round(total)}</span>
                  </div>

                  <button type="submit" className="btn btn-primary-luxury btn-lg w-100 mt-4">
                    Place Order (COD)
                  </button>
                  <p className="text-center text-muted small mt-3 mb-0">
                    <i className="bi bi-shield-lock me-1"></i> Secure Checkout Process
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
