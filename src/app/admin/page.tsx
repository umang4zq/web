import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  if (!adminToken) {
    redirect("/admin/login");
  }

  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    include: { user: true }
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 style={{ fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>Overview</h2>
        <div className="text-muted" style={{ fontSize: "0.9rem" }}>Welcome back, Admin</div>
      </div>
      
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div style={{ 
            backgroundColor: "#FFFFFF", 
            border: "1px solid #E4E4E7", 
            borderRadius: "12px", 
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <h6 style={{ color: "#475569", fontWeight: 500, margin: 0, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Total Users</h6>
            <div style={{ fontSize: "2.5rem", fontWeight: 600, marginTop: "0.5rem", letterSpacing: "-0.02em" }}>{userCount}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{ 
            backgroundColor: "#FFFFFF", 
            border: "1px solid #E4E4E7", 
            borderRadius: "12px", 
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <h6 style={{ color: "#475569", fontWeight: 500, margin: 0, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Total Products</h6>
            <div style={{ fontSize: "2.5rem", fontWeight: 600, marginTop: "0.5rem", letterSpacing: "-0.02em" }}>{productCount}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{ 
            backgroundColor: "#FFFFFF", 
            border: "1px solid #E4E4E7", 
            borderRadius: "12px", 
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <h6 style={{ color: "#475569", fontWeight: 500, margin: 0, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Total Orders</h6>
            <div style={{ fontSize: "2.5rem", fontWeight: 600, marginTop: "0.5rem", letterSpacing: "-0.02em" }}>{orderCount}</div>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: "#FFFFFF", 
        border: "1px solid #E4E4E7", 
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ 
          padding: "1.5rem", 
          borderBottom: "1px solid #E4E4E7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h5 style={{ fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Recent Orders</h5>
          <Link href="/admin/orders" style={{ fontSize: "0.875rem", color: "#18181B", textDecoration: "none", fontWeight: 500 }}>
            View All &rarr;
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table mb-0" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAFAFA" }}>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Order ID</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Customer</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Date</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Amount</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} style={{ transition: "background 0.2s" }} className="admin-tr-hover">
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7" }}>#{order.id}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", fontWeight: 500 }}>{order.user.name}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", color: "#475569" }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7" }}>₹{order.total_price.toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "9999px", 
                      fontSize: "0.75rem", 
                      fontWeight: 500,
                      backgroundColor: order.status === 'pending' ? '#FEF3C7' : '#DCFCE7',
                      color: order.status === 'pending' ? '#92400E' : '#166534',
                      textTransform: "capitalize"
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
          <style dangerouslySetInnerHTML={{__html: `
            .admin-tr-hover:hover { background-color: #FAFAFA; }
            .admin-tr-hover:last-child td { border-bottom: none !important; }
          `}} />
        </div>
      </div>
    </div>
  );
}
