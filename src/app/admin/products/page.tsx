import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import ProductRowActions from "@/components/admin/ProductRowActions";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  if (!adminToken) {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { id: "desc" },
    take: 50 // Limit for now to prevent huge page load
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>Products</h2>
          <div className="text-muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>Manage your store inventory</div>
        </div>
        <Link href="/admin/products/new" style={{ 
          backgroundColor: "#18181B", 
          color: "#FFFFFF", 
          border: "none", 
          padding: "0.5rem 1rem", 
          borderRadius: "6px",
          fontWeight: 500,
          fontSize: "0.875rem",
          textDecoration: "none"
        }}>
          + Add Product
        </Link>
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
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Image</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Product Name</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Brand</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Price</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569" }}>Stock</th>
                <th style={{ borderBottom: "1px solid #E4E4E7", borderTop: "none", padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ transition: "background 0.2s" }} className="admin-tr-hover">
                  <td style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle" }}>
                    {product.image ? (
                      <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", border: "1px solid #E4E4E7" }}>
                        <img 
                          src={`/static/uploads/products/${product.image}`} 
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "6px", backgroundColor: "#F4F4F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="bi bi-image text-muted"></i>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", fontWeight: 500, verticalAlign: "middle" }}>
                    {product.name}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", color: "#475569", verticalAlign: "middle" }}>
                    {product.brand.brand_name}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle" }}>
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle" }}>
                    <span style={{ 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "6px", 
                      fontSize: "0.75rem", 
                      fontWeight: 500,
                      backgroundColor: product.stock > 10 ? '#DCFCE7' : product.stock > 0 ? '#FEF3C7' : '#FEE2E2',
                      color: product.stock > 10 ? '#166534' : product.stock > 0 ? '#92400E' : '#991B1B',
                    }}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #E4E4E7", verticalAlign: "middle", textAlign: "right" }}>
                    <ProductRowActions productId={product.id} />
                  </td>
                </tr>
              ))}
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
