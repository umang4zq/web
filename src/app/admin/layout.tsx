import Link from "next/link";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken) {
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh", color: "#09090B" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "250px 1fr", 
      minHeight: "100vh",
      backgroundColor: "#FAFAFA",
      color: "#09090B",
      fontFamily: "var(--bs-body-font-family)" 
    }}>
      {/* Sidebar */}
      <aside style={{ 
        backgroundColor: "#FFFFFF", 
        borderRight: "1px solid #E4E4E7",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1.5rem"
      }}>
        <div style={{ marginBottom: "3rem" }}>
          <h4 style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>Admin Pro</h4>
        </div>
        
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/admin" style={{ textDecoration: "none", color: "#09090B", padding: "0.75rem 1rem", borderRadius: "6px", backgroundColor: "#F4F4F5", fontWeight: 500 }}>
            <i className="bi bi-grid me-2"></i> Dashboard
          </Link>
          <Link href="/admin/products" style={{ textDecoration: "none", color: "#475569", padding: "0.75rem 1rem", borderRadius: "6px", transition: "background 0.2s" }} className="admin-link">
            <i className="bi bi-box-seam me-2"></i> Products
          </Link>
          <Link href="/admin/orders" style={{ textDecoration: "none", color: "#475569", padding: "0.75rem 1rem", borderRadius: "6px", transition: "background 0.2s" }} className="admin-link">
            <i className="bi bi-cart me-2"></i> Orders
          </Link>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid #E4E4E7", paddingTop: "1.5rem" }}>
          <form action="/api/auth/logout" method="POST">
            <input type="hidden" name="type" value="admin" />
            <button type="submit" style={{ 
              width: "100%", 
              padding: "0.75rem", 
              backgroundColor: "#18181B", 
              color: "#FFFFFF", 
              border: "none", 
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer"
            }}>
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: "3rem 4rem", overflowY: "auto", height: "100vh" }}>
        <style dangerouslySetInnerHTML={{__html: `
          .admin-link:hover { background-color: #F4F4F5; color: #09090B !important; }
        `}} />
        {children}
      </main>
    </div>
  );
}
