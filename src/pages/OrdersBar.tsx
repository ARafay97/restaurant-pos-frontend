"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";
import { groupOrderItems, hasBarItems } from "@data/categories";

export default function OrdersBar() {
  const [completed, setCompleted] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        const allCompleted = (await fetchOrders(true)) as Order[];
        setCompleted(allCompleted.filter((order) => hasBarItems(order.items)));
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Could not load completed bar orders");
      }
    }

    refresh();
    socket.on("completed-orders", (orders: Order[]) => {
      setCompleted(orders.filter((order) => hasBarItems(order.items)));
    });
    socket.emit("request-completed-orders");
    return () => {
      socket.off("completed-orders");
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">Completed Bar Orders</h1>
      {error && <p className="error-text">{error}</p>}
      {completed.length === 0 && <p className="empty-state">No completed bar orders.</p>}

      {completed.map((order) => {
        const sections = groupOrderItems(order.items, "bar");
        return (
          <div key={order.id} className="ticket" style={{ maxWidth: 520 }}>
            <div className="ticket__header">
              <span className="ticket__badge">
                {order.isKitchenOrder ? `Order #${order.orderNumber}` : `Table ${order.table}`}
              </span>
            </div>
            {sections.map((section) => (
              <div key={section.title} className="ticket-section" style={{ marginBottom: 12 }}>
                <div className="ticket-section__title">{section.title}</div>
                {section.items.map((item, i) => (
                  <p key={i} className="ticket-section__item">
                    • {item.name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
