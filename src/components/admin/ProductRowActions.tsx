"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductRowActions({ productId }: { productId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
        setIsDeleting(false);
      }
    } catch (err) {
      alert("Failed to delete product");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleEdit}
        disabled={isDeleting}
        style={{ background: "none", border: "none", padding: "0.25rem", color: "#475569", cursor: "pointer" }}
      >
        <i className="bi bi-pencil-square"></i>
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        style={{ background: "none", border: "none", padding: "0.25rem", color: "#EF4444", cursor: "pointer", marginLeft: "0.5rem", opacity: isDeleting ? 0.5 : 1 }}
      >
        <i className="bi bi-trash"></i>
      </button>
    </>
  );
}
