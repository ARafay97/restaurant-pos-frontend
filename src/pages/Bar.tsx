"use client";

import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

export default function Bar() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filterBar = (list: Order[]) =>
    list.filter((order) =>
      order.items.some((item) => item.category === "mocktail"),
    );

  const refreshOrders = async () => {
    try {
      const data = (await fetchOrders(false)) as Order[];
      const barOrders = filterBar(data);
      setOrders(barOrders);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load bar orders");
    }
  };

  useEffect(() => {
    refreshOrders();
    socket.on("all-orders", (data: Order[]) => setOrders(filterBar(data)));
    socket.on("new-order", (order: Order) => {
      if (order.items.some((i) => i.category === "mocktail")) {
        setOrders((prev) => [...prev, order]);
      }
    });
    socket.on("order-complete", (order: Order) =>
      setOrders((prev) => prev.filter((o) => o.id !== order.id)),
    );
    socket.on("order-status-updated", (order: Order) =>
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? order : o)),
      ),
    );
    return () => {
      socket.off("all-orders");
      socket.off("new-order");
      socket.off("order-complete");
      socket.off("order-status-updated");
    };
  }, []);

  const markMocktailsDone = async (orderId: string) => {
    try {
      await patchOrder(orderId, { action: "complete" });
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not mark mocktails done");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Drinks / Mocktails</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.map((order) => {
        const mocktails = order.items.filter((i) => i.category === "mocktail");
        return (
          <div
            key={order.id}
            style={{
              border: "2px solid black",
              padding: 20,
              marginBottom: 20,
              width: 500,
            }}
          >
            <h3>
              {order.isKitchenOrder
                ? `Order #${order.orderNumber}`
                : `Table ${order.table}`}
            </h3>
            <div>
              <h4>Mocktails</h4>
              {mocktails.map((item, i) => (
                <p key={i} style={{ fontSize: "18px", fontWeight: "bold" }}>
                  • {item.name}
                </p>
              ))}
              <button
                onClick={() => markMocktailsDone(order.id)}
                style={{
                  background: "#eee",
                  color: "black",
                  width: "100%",
                  padding: "8px",
                  marginTop: "10px",
                }}
              >
                Done
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
