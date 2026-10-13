"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ 
  product, 
  brands, 
  categories 
}: { 
  product?: any, 
  brands: any[], 
  categories: any[] 
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [extraImageInputs, setExtraImageInputs] = useState<number[]>([Date.now()]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      
      // Check if new arrival / featured are checked safely
      const isNewArrivalEl = formElement.querySelector('input[name="is_new_arrival"]') as HTMLInputElement;
      const isFeaturedEl = formElement.querySelector('input[name="is_featured"]') as HTMLInputElement;
      
      formData.set("is_new_arrival", isNewArrivalEl?.checked ? "true" : "false");
      formData.set("is_featured", isFeaturedEl?.checked ? "true" : "false");

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      
      console.log(`Submitting to ${url} with method ${method}`);

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-4">
      {error && <div className="alert alert-danger w-100">{error}</div>}

      <div className="col-md-8">
        <div style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "12px", border: "1px solid #E4E4E7", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h5 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>Basic Information</h5>
          
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Product Name</label>
            <input type="text" className="form-control" name="name" defaultValue={product?.name || ""} required />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Description</label>
            <textarea className="form-control" name="description" rows={5} defaultValue={product?.description || ""}></textarea>
          </div>
        </div>

        <div style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "12px", border: "1px solid #E4E4E7", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: "1.5rem" }}>
          <h5 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>Images</h5>
          
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Main Image (Required for new)</label>
            <input type="file" className="form-control" name="image" accept="image/*" required={!product} />
            {product?.image && <div className="mt-2 text-muted" style={{ fontSize: "0.875rem" }}>Current: {product.image}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label d-flex align-items-center justify-content-between" style={{ fontWeight: 500, fontSize: "0.875rem" }}>
              <span>Extra Images (Gallery)</span>
              <button 
                type="button" 
                onClick={() => setExtraImageInputs([...extraImageInputs, Date.now()])}
                style={{ background: "none", border: "none", padding: "0.25rem", color: "#18181B", cursor: "pointer", display: "flex", alignItems: "center" }}
                title="Add another image"
              >
                <i className="bi bi-plus-circle" style={{ fontSize: "1.2rem" }}></i>
              </button>
            </label>
            
            {extraImageInputs.map((id, index) => (
              <div key={id} className="d-flex mb-2 align-items-center gap-2">
                <input type="file" className="form-control" name="extra_images" accept="image/*" />
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setExtraImageInputs(extraImageInputs.filter(inputId => inputId !== id))}
                    style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "0.25rem" }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            ))}
            
            {product?.images && product.images.length > 0 && (
              <div className="mt-2 text-muted" style={{ fontSize: "0.875rem" }}>
                Current extras: {product.images.map((i:any) => i.image).join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "12px", border: "1px solid #E4E4E7", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h5 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>Organization</h5>
          
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Brand</label>
            <select className="form-select" name="brand_id" defaultValue={product?.brand_id || ""} required>
              <option value="" disabled>Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Category</label>
            <select className="form-select" name="category_id" defaultValue={product?.category_id || ""} required>
              <option value="" disabled>Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "12px", border: "1px solid #E4E4E7", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: "1.5rem" }}>
          <h5 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>Pricing & Inventory</h5>
          
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Price (₹)</label>
            <input type="number" className="form-control" name="price" defaultValue={product?.price || ""} step="0.01" required />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Discount Price (₹)</label>
            <input type="number" className="form-control" name="discount_price" defaultValue={product?.discount_price || ""} step="0.01" />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Stock Quantity</label>
            <input type="number" className="form-control" name="stock" defaultValue={product?.stock || 0} required />
          </div>

          <div className="form-check mb-2 mt-4">
            <input className="form-check-input" type="checkbox" name="is_new_arrival" id="is_new_arrival" defaultChecked={product?.is_new_arrival} />
            <label className="form-check-label" htmlFor="is_new_arrival">New Arrival</label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" name="is_featured" id="is_featured" defaultChecked={product?.is_featured} />
            <label className="form-check-label" htmlFor="is_featured">Featured Product</label>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" disabled={isSubmitting} style={{ 
            width: "100%", 
            padding: "1rem", 
            backgroundColor: "#18181B", 
            color: "#FFFFFF", 
            border: "none", 
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer"
          }}>
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
