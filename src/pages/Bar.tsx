"use client";

import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";
import { groupOrderItems, hasBarItems, hasKitchenItems } from "@data/categories";

export default function Bar() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filterBar = (list: Order[]) => list.filter((o) => hasBarItems(o.items));

  const refreshOrders = async () => {
    try {
      const data = (await fetchOrders(false)) as Order[];
      setOrders(filterBar(data));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load bar orders");
    }
  };

  useEffect(() => {
    refreshOrders();
    socket.on("all-orders", (data: Order[]) => setOrders(filterBar(data)));
    socket.on("new-order", (order: Order) => {
      if (hasBarItems(order.items)) {
        setOrders((prev) => [...prev, order]);
      }
    });
    socket.on("order-complete", (order: Order) =>
      setOrders((prev) => prev.filter((o) => o.id !== order.id)),
    );
    socket.on("order-status-updated", (order: Order) =>
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o))),
    );
    return () => {
      socket.off("all-orders");
      socket.off("new-order");
      socket.off("order-complete");
      socket.off("order-status-updated");
    };
  }, []);

  const markBarItemsDone = async (order: Order) => {
    try {
      await patchOrder(order.id, { drinksDone: true });

      if (!hasKitchenItems(order.items)) {
        await patchOrder(order.id, { action: "complete" });
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, drinksDone: true } : o)),
        );
      }
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not mark bar items done");
    }
  };

  return (
    <div>
      <h1 className="page-title">Drinks / Mocktails</h1>
      {error && <p className="error-text">{error}</p>}
      {orders.length === 0 && <p className="empty-state">No active bar orders.</p>}

      {orders.map((order) => {
        const sections = groupOrderItems(order.items, "bar");

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
                      • {item.name}
                    </p>
                  ))}
                  <button
                    type="button"
                    className={`status-btn${order.drinksDone ? " is-done" : ""}`}
                    onClick={() => markBarItemsDone(order)}
                  >
                    {order.drinksDone ? "Done" : "Mark Done"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
