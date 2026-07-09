import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";
import { groupOrderItems } from "@data/categories";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = async () => {
    try {
      const data = (await fetchOrders(false)) as Order[];
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not load orders");
    }
  };

  useEffect(() => {
    refreshOrders();
    socket.on("all-orders", (data: Order[]) => setOrders(data));
    socket.on("new-order", (order: Order) =>
      setOrders((prev) => [...prev, order]),
    );
    socket.on("order-status-updated", (order: Order) =>
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o))),
    );
    socket.on("order-complete", (order: Order) =>
      setOrders((prev) => prev.filter((o) => o.id !== order.id)),
    );
    return () => {
      socket.off("all-orders");
      socket.off("new-order");
      socket.off("order-status-updated");
      socket.off("order-complete");
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">Active Orders</h1>
      {error && <p className="error-text">{error}</p>}
      {orders.length === 0 && <p className="empty-state">No active orders.</p>}

      {orders.map((order) => {
        const sections = groupOrderItems(order.items);
        const total = order.items.reduce((sum, i) => sum + i.price, 0);

        return (
          <div key={order.id} className="ticket" style={{ maxWidth: 560 }}>
            <div className="ticket__header">
              <span className="ticket__badge">
                {order.isKitchenOrder ? `Order #${order.orderNumber}` : `Table ${order.table}`}
              </span>
            </div>

            <div className="ticket-grid">
              {sections.map((section) => (
                <div key={section.title} className="ticket-section">
                  <div className="ticket-section__title">{section.title}</div>
                  {section.items.map((item, i) => (
                    <p key={i} className="ticket-section__item">
                      {item.name}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <p className="ticket__total">Total: £{total.toFixed(2)}</p>
            <button
              type="button"
              className="btn btn-success btn-block"
              style={{ marginTop: 12 }}
              onClick={async () => {
                try {
                  setOrders((prev) => prev.filter((o) => o.id !== order.id));
                  await patchOrder(order.id, { action: "complete" });
                } catch (err: any) {
                  setOrders((prev) => [...prev, order]);
                  alert(err?.message || "Failed to complete order");
                }
              }}
            >
              Done
            </button>
          </div>
        );
      })}
    </div>
  );
}
