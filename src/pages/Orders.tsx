import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

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
    <div style={{ padding: 30 }}>
      <h1>Active Orders</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {orders.length === 0 && <p>No active orders.</p>}

      {orders.map((order) => {
        const starters = order.items.filter((i) => i.category === "starter");
        const streetFood = order.items.filter((i) => i.category === "streetfood");
        const mains = order.items.filter(
          (i) => i.category === "main" || i.category === "main-veg",
        );
        const burgers = order.items.filter((i) => i.category === "burger");
        const sides = order.items.filter((i) => i.category === "side");
        const mocktails = order.items.filter((i) => i.category === "mocktail");
        const desserts = order.items.filter((i) => i.category === "dessert");
        const shakes = order.items.filter((i) => i.category === "shake");
        const drinks = order.items.filter((i) => i.category === "drink");

        const sections = [
          { title: "Starters", items: starters },
          { title: "Street Food", items: streetFood },
          { title: "Mains", items: mains },
          { title: "Burgers", items: burgers },
          { title: "Sides", items: sides },
          { title: "Mocktails", items: mocktails },
          { title: "Desserts", items: desserts },
          { title: "Ice-Cream Shakes", items: shakes },
          { title: "Drinks", items: drinks },
        ].filter((s) => s.items.length > 0);

        const total = order.items.reduce((sum, i) => sum + i.price, 0);

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
              {sections.map((section) => (
                <div key={section.title}>
                  <h3>{section.title}</h3>
                  {section.items.map((item, i) => (
                    <p key={i} style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {item.name}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <p style={{ marginTop: 16, fontWeight: "bold" }}>
              Total: £{total.toFixed(2)}
            </p>
            <button
              onClick={async () => {
                try {
                  setOrders((prev) => prev.filter((o) => o.id !== order.id));
                  await patchOrder(order.id, { action: "complete" });
                } catch (err: any) {
                  setOrders((prev) => [...prev, order]);
                  alert(err?.message || "Failed to complete order");
                }
              }}
              style={{
                marginTop: 12,
                padding: "8px 20px",
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 16,
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
