"use client";

import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";
import { DoneFlag, groupOrderItems, hasKitchenItems, isStationDone } from "@data/categories";

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = async () => {
    try {
      const data = (await fetchOrders(false)) as Order[];
      setOrders(data.filter((o) => hasKitchenItems(o.items)));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not refresh orders");
    }
  };

  useEffect(() => {
    refreshOrders();
    socket.on("all-orders", (data: Order[]) =>
      setOrders(data.filter((o) => hasKitchenItems(o.items))),
    );
    socket.on("new-order", (order: Order) => {
      if (hasKitchenItems(order.items)) {
        setOrders((prev) => [...prev, order]);
      }
    });
    socket.on("order-status-updated", (order: Order) =>
      setOrders((prev) =>
        hasKitchenItems(order.items)
          ? prev.map((o) => (o.id === order.id ? order : o))
          : prev.filter((o) => o.id !== order.id),
      ),
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

  const checkAndCompleteOrder = async (order: Order) => {
    try {
      const updated = await patchOrder(order.id, {
        startersDone: order.startersDone,
        mainsDone: order.mainsDone,
        drinksDone: order.drinksDone,
      });
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err: any) {
      setError(err?.message || "Failed to update order status");
    }
  };

  const markDone = (order: Order, flag: DoneFlag) => {
    const updatedOrder = { ...order, [flag]: true };
    setOrders((prev) => prev.map((o) => (o.id === order.id ? updatedOrder : o)));
    checkAndCompleteOrder(updatedOrder);
  };

  const finishOrder = async (order: Order) => {
    try {
      await patchOrder(order.id, { action: "complete" });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not complete order");
    }
  };

  const kitchenOrders = orders.filter((order) => groupOrderItems(order.items, "kitchen").length > 0);

  return (
    <div>
      <h1 className="page-title">Kitchen Display</h1>
      {error && <p className="error-text">{error}</p>}
      {kitchenOrders.length === 0 && <p className="empty-state">No active kitchen orders.</p>}

      {kitchenOrders.map((order) => {
        const sections = groupOrderItems(order.items, "kitchen");
        const canComplete = isStationDone(order, "kitchen") && isStationDone(order, "bar");

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
                  <button
                    type="button"
                    className={`status-btn${order[section.doneFlag] ? " is-done" : ""}`}
                    onClick={() => markDone(order, section.doneFlag)}
                  >
                    {order[section.doneFlag] ? "Done" : "Mark Done"}
                  </button>
                </div>
              ))}
            </div>

            {canComplete && (
              <button
                type="button"
                className="btn btn-gold btn-block"
                style={{ marginTop: 16 }}
                onClick={() => finishOrder(order)}
              >
                Finish Order
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
