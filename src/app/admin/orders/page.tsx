import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  if (!adminToken) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    include: { user: true, order_items: { include: { product: true } } },
    orderBy: { created_at: "desc" },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>Orders</h2>
          <div className="text-muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>Review and manage customer orders</div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: "#FFFFFF", 
        border: "1px solid #E4E4E7", 
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div className="table-responsive">
          <table className="table mb-0" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAFAFA" }}>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Order ID</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Customer</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Date</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Items</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Amount</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Status</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ transition: "background 0.2s" }} className="admin-tr-hover">
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", fontWeight: 500, verticalAlign: "middle" }}>
                    #{order.id}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle" }}>
                    <div>{order.user.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: "0.75rem" }}>{order.user.email}</div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", color: "#475569", verticalAlign: "middle" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", color: "#475569", verticalAlign: "middle" }}>
                    {order.order_items.length} items
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle" }}>
                    ₹{order.total_price.toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle" }}>
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
                  <td style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", padding: "0.25rem", color: "#475569", cursor: "pointer", fontSize: "0.875rem" }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>No orders found</td>
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
