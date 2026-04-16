import { useEffect, useState } from "react";
import { fetchOrders } from "@services/api";
import { Order } from "@models/order";
import { socket } from "@services/socket";

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
    <div style={{ padding: 30 }}>
      <h1>Completed Orders</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {orders.length === 0 && <p>No completed orders.</p>}

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
              border: "2px solid #22c55e",
              padding: 20,
              marginBottom: 20,
              width: 500,
              backgroundColor: "#f0fff4",
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
          </div>
        );
      })}
    </div>
  );
}
