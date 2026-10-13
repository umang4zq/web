import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CancelOrderButton from "@/components/CancelOrderButton";

export const metadata = {
  title: "My Profile - THE HOUSE OF WEAR",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getSession("user");
  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      orders: {
        orderBy: { created_at: "desc" },
        include: {
          order_items: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="badge bg-warning text-dark">Pending</span>;
      case "confirmed": return <span className="badge bg-info text-dark">Confirmed</span>;
      case "shipped": return <span className="badge bg-primary">Shipped</span>;
      case "delivered": return <span className="badge bg-success">Delivered</span>;
      case "cancelled": return <span className="badge bg-danger">Cancelled</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">My Account</h1>
          </div>
        </div>
      </section>

      <section className="profile-section section-padding">
        <div className="container">
          {resolvedParams.success && (
            <div className="alert alert-success mb-4">
              {resolvedParams.success.replace(/_/g, " ")}
            </div>
          )}

          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              {/* Profile Details Card */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar">
                    <i className="bi bi-person"></i>
                  </div>
                  <h4 className="mb-0">{user.name}</h4>
                  <p className="text-muted mb-0">{user.email}</p>
                </div>

                <div className="profile-card-body">
                  <form action="/api/profile/edit" method="POST">
                    <h5 className="mb-3">Personal Information</h5>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input type="text" name="name" className="form-control" defaultValue={user.name} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" name="phone" className="form-control" defaultValue={user.phone || ""} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea name="address" className="form-control" rows={2} defaultValue={user.address || ""}></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">City</label>
                        <input type="text" name="city" className="form-control" defaultValue={user.city || ""} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">State</label>
                        <input type="text" name="state" className="form-control" defaultValue={user.state || ""} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label">PIN Code</label>
                      <input type="text" name="pincode" className="form-control" defaultValue={user.pincode || ""} />
                    </div>
                    <button type="submit" className="btn btn-outline-dark w-100">Update Profile</button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-8" id="orders">
              <h3 className="mb-4">Order History</h3>
              
              {user.orders.length > 0 ? (
                <div className="orders-list">
                  {user.orders.map((order) => (
                    <div key={order.id} className="order-card mb-4">
                      <div className="order-card-header d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <span className="order-id">Order #{order.id}</span>
                          <span className="order-date ms-3 text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="order-status-wrap">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      <div className="order-card-body">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="order-item d-flex align-items-center mb-3">
                            <div className="order-item-img me-3">
                              {item.product?.image ? (
                                <img src={`/static/uploads/products/${item.product.image}`} alt={item.product?.name || "Product"} style={{ width: "60px", height: "80px", objectFit: "cover" }} />
                              ) : (
                                <div style={{ width: "60px", height: "80px", background: "#eee" }}></div>
                              )}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{item.product?.name || "Product Unavailable"}</h6>
                              <div className="text-muted small">
                                <span>Size: {item.size}</span>
                                <span className="mx-2">|</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-end fw-bold">
                              ₹{Math.round(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-card-footer d-flex justify-content-between align-items-center">
                        <div className="order-total">
                          <span className="text-muted me-2">Total Amount:</span>
                          <span className="fw-bold fs-5">₹{Math.round(order.total_price)}</span>
                        </div>
                        {order.status === "pending" && (
                          <CancelOrderButton orderId={order.id} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state text-center py-5 bg-light rounded">
                  <i className="bi bi-bag-x display-4 text-muted mb-3 d-block"></i>
                  <h5>No orders yet</h5>
                  <p className="text-muted">When you place orders, they will appear here.</p>
                  <Link href="/categories" className="btn btn-primary-luxury mt-2">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
