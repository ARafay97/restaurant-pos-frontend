"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

export default function OrdersBar() {
  const [completed, setCompleted] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        const allCompleted = (await fetchOrders(true)) as Order[];
        const barCompleted = allCompleted.filter((order) =>
          order.items.some((i) => i.category === "mocktail"),
        );
        setCompleted(barCompleted);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Could not load completed bar orders");
      }
    }

    refresh();
    socket.on("completed-orders", (orders: Order[]) => {
      const barCompleted = orders.filter((order) =>
        order.items.some((i) => i.category === "mocktail"),
      );
      setCompleted(barCompleted);
    });
    socket.emit("request-completed-orders");
    return () => {
      socket.off("completed-orders");
    };
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Completed Bar Orders</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {completed.map((order) => {
        const mocktails = order.items.filter((i) => i.category === "mocktail");
        return (
          <div
            key={order.id}
            style={{
              border: "2px solid green",
              padding: 20,
              marginBottom: 20,
              width: 500,
              backgroundColor: "#f0fff0",
            }}
          >
            <h3>
              {order.isKitchenOrder
                ? `Order #${order.orderNumber}`
                : `Table ${order.table}`}
            </h3>
            {mocktails.length > 0 && (
              <div style={{ marginBottom: 15 }}>
                <h4 style={{ marginBottom: 8 }}>Mocktails</h4>
                {mocktails.map((item, i) => (
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
