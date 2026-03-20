"use client";

import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

export default function Bar() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const BAR_CATEGORIES = ["mocktail", "drink", "shake", "dessert"];
  const KITCHEN_CATEGORIES = ["starter", "main", "side", "burger", "streetfood"];

  const hasKitchenItems = (order: Order) =>
    order.items.some((item) => KITCHEN_CATEGORIES.includes(item.category));

  // Treat anything that is NOT a kitchen category as bar so new categories still show up
  const hasBarItems = (order: Order) =>
    order.items.some((item) => !KITCHEN_CATEGORIES.includes(item.category));

  const filterBar = (list: Order[]) => list.filter(hasBarItems);

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
      if (hasBarItems(order)) {
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

  const markBarItemsDone = async (order: Order) => {
    try {
      // First, mark drinks/desserts as done
      await patchOrder(order.id, { drinksDone: true });

      // If there are no kitchen items, we can complete the order here.
      if (!hasKitchenItems(order)) {
        await patchOrder(order.id, { action: "complete" });
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
      } else {
        // Otherwise, keep it in the list; kitchen will complete once their items are done.
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, drinksDone: true } : o)),
        );
      }
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
        const desserts = order.items.filter((i) => i.category === "dessert");
        const shakes = order.items.filter((i) => i.category === "shake");
        const drinks = order.items.filter((i) => i.category === "drink");
        const chaiLassi = drinks.filter((i) =>
          /chai|lassi|tea/i.test(i.name),
        );
        const softJuice = drinks.filter(
          (i) => !/chai|lassi|tea/i.test(i.name),
        );

        const barSections: { title: string; items: typeof order.items }[] = [
          { title: "Mocktails", items: mocktails },
          { title: "Desserts", items: desserts },
          { title: "Chai & Lassi", items: chaiLassi },
          { title: "Soft Drinks & Juices", items: softJuice },
          { title: "Ice-Cream Shakes", items: shakes },
        ].filter((s) => s.items.length > 0);

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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {barSections.map((section) => (
                <div key={section.title}>
                  <h4>{section.title}</h4>
                  {section.items.map((item, i) => (
                    <p key={i} style={{ fontSize: "18px", fontWeight: "bold" }}>
                      • {item.name}
                    </p>
                  ))}
                  <button
                    onClick={() => markBarItemsDone(order)}
                    style={{
                      background: order.drinksDone ? "green" : "#eee",
                      color: order.drinksDone ? "white" : "black",
                      width: "100%",
                      padding: "8px",
                      marginTop: "10px",
                    }}
                  >
                    Done
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
