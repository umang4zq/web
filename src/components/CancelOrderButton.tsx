"use client";

export default function CancelOrderButton({ orderId }: { orderId: number }) {
  return (
    <form
      action="/api/profile/cancel_order"
      method="POST"
      onSubmit={(e) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="order_id" value={orderId} />
      <button type="submit" className="btn btn-outline-danger btn-sm">
        Cancel Order
      </button>
    </form>
  );
}
