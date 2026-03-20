"use client";

import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = async () => {
    try {
      const data = (await fetchOrders(false)) as Order[];
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not refresh orders");
    }
  };

  useEffect(() => {
    refreshOrders();
    socket.on("all-orders", (data: Order[]) => setOrders(data));
    socket.on("new-order", (order: Order) =>
      setOrders((prev) => [...prev, order]),
    );
    socket.on("order-status-updated", (order: Order) =>
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? order : o)),
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

  const finishOrder = async (order: Order) => {
    try {
      await patchOrder(order.id, { action: "complete" });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not complete order");
    }
  };

  const markStartersDone = (order: Order) => {
    const updatedOrder = { ...order, startersDone: true };
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? updatedOrder : o)),
    );
    checkAndCompleteOrder(updatedOrder);
  };

  const markMainsDone = (order: Order) => {
    const updatedOrder = { ...order, mainsDone: true };
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? updatedOrder : o)),
    );
    checkAndCompleteOrder(updatedOrder);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Kitchen Display</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders
        .filter((order) => {
          const starters = order.items.filter((i) => i.category === "starter");
          const mains = order.items.filter((i) => i.category === "main");
          return starters.length > 0 || mains.length > 0;
        })
        .map((order) => {
          const starters = order.items.filter((i) => i.category === "starter");
          const mains = order.items.filter((i) => i.category === "main");

          const allDone =
            (starters.length === 0 || order.startersDone) &&
            (mains.length === 0 || order.mainsDone);

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
              <h2>
                {order.isKitchenOrder
                  ? `Order #${order.orderNumber}`
                  : `Table ${order.table}`}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                {starters.length > 0 && (
                  <div>
                    <h3>Starters</h3>
                    {starters.map((item, i) => (
                      <p
                        key={i}
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        {item.name}
                      </p>
                    ))}
                    <button
                      onClick={() => markStartersDone(order)}
                      style={{
                        background: order.startersDone ? "green" : "#eee",
                        color: order.startersDone ? "white" : "black",
                        width: "100%",
                        padding: "8px",
                        marginTop: "10px",
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}

                {mains.length > 0 && (
                  <div>
                    <h3>Mains</h3>
                    {mains.map((item, i) => (
                      <p
                        key={i}
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        {item.name}
                      </p>
                    ))}
                    <button
                      onClick={() => markMainsDone(order)}
                      style={{
                        background: order.mainsDone ? "green" : "#eee",
                        color: order.mainsDone ? "white" : "black",
                        width: "100%",
                        padding: "8px",
                        marginTop: "10px",
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {allDone && (
                <button
                  onClick={() => finishOrder(order)}
                  style={{
                    background: "blue",
                    color: "white",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    marginTop: 20,
                    cursor: "pointer",
                  }}
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
