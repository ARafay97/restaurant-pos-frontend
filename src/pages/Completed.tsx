import { useEffect, useState } from "react";
import { fetchOrders } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";
import { groupOrderItems } from "@data/categories";

export default function Completed() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const data = (await fetchOrders(true)) as Order[];
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not load completed orders");
    }
  };

  useEffect(() => {
    refresh();
    socket.on("order-complete", () => refresh());
    socket.on("completed-orders", (data: Order[]) => setOrders(data));
    return () => {
      socket.off("order-complete");
      socket.off("completed-orders");
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">Completed Orders</h1>
      {error && <p className="error-text">{error}</p>}
      {orders.length === 0 && <p className="empty-state">No completed orders.</p>}

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
          </div>
        );
      })}
    </div>
  );
}
