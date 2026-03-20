"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

export default function OrdersKitchen() {
  const [completed, setCompleted] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        const allCompleted = (await fetchOrders(true)) as Order[];
        const kitchenCompleted = allCompleted.filter((order) =>
          order.items.some((i) => i.category !== "mocktail"),
        );
        setCompleted(kitchenCompleted);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Could not load completed kitchen orders");
      }
    }

    refresh();
    socket.on("completed-orders", (orders: Order[]) => {
      const kitchenCompleted = orders.filter((order) =>
        order.items.some((i) => i.category !== "mocktail"),
      );
      setCompleted(kitchenCompleted);
    });
    socket.emit("request-completed-orders");
    return () => {
      socket.off("completed-orders");
    };
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Completed Kitchen Orders</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {completed.map((order) => {
        const starters = order.items.filter((i) => i.category === "starter");
        const mains = order.items.filter((i) => i.category === "main");
        return (
          <div
            key={order.id}
            style={{
              border: "2px solid #444",
              padding: 20,
              marginBottom: 20,
              width: 520,
              backgroundColor: "#f8f8ff",
            }}
          >
            <h3>
              {order.isKitchenOrder
                ? `Order #${order.orderNumber}`
                : `Table ${order.table}`}
            </h3>
            {starters.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <h4>Starters</h4>
                {starters.map((item, i) => (
                  <p key={i} style={{ margin: 4 }}>
                    • {item.name}
                  </p>
                ))}
              </div>
            )}
            {mains.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <h4>Mains</h4>
                {mains.map((item, i) => (
                  <p key={i} style={{ margin: 4 }}>
                    • {item.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
