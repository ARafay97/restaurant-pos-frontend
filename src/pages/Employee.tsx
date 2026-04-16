"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import menu from "@data/menu.json";
import TableGrid from "@components/TableGrid";
import MenuSection from "@components/MenuSection";
import { MenuItem } from "@models/order";
import { createOrder } from "@services/api";

export default function Employee() {
  const navigate = useNavigate();
  const [table, setTable] = useState<number>(1);
  const [isKitchenOrder, setIsKitchenOrder] = useState<boolean>(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentOrders, setSentOrders] = useState<
    { id: string; isKitchenOrder: boolean; table: number; orderNumber?: number | null; items: MenuItem[] }[]
  >([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("employeeCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("employeeCart", JSON.stringify(cart));
  }, [cart]);

  const orderTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const addItem = (item: MenuItem) => {
    setCart((prev) => [...prev, item]);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("employeeCart");
  };

  const sendOrder = async () => {
    const order = {
      id: crypto.randomUUID(),
      table: !isKitchenOrder ? table : 0,
      items: cart,
      startersDone: false,
      mainsDone: false,
      drinksDone: false,
      isKitchenOrder: isKitchenOrder,
    };

    try {
      setBusy(true);
      const created = await createOrder(order);
      setCart([]);
      localStorage.removeItem("employeeCart");
      setError(null);
      setSentOrders((prev) => [
        {
          id: created.id,
          isKitchenOrder: created.isKitchenOrder,
          table: created.table,
          orderNumber: created.orderNumber,
          items: created.items,
        },
        ...prev,
      ]);
      // Navigate to kitchen screen after successful order
      navigate("/kitchen");
    } catch (err: any) {
      setError(err?.message || "Unable to send order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h1>Employee Screen</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={isKitchenOrder}
            onChange={(e) => setIsKitchenOrder(e.target.checked)}
          />
          Takeout Order
        </label>
      </div>

      {!isKitchenOrder && <TableGrid selected={table} setSelected={setTable} />}

      <MenuSection title="Starters" items={menu.starters as MenuItem[]} addItem={addItem} />
      <MenuSection title="Street Food" items={menu.streetFood as MenuItem[]} addItem={addItem} />
      <MenuSection title="Mains" items={menu.mains as MenuItem[]} addItem={addItem} />
      <MenuSection title="Vegetarian Mains" items={menu.vegMains as MenuItem[]} addItem={addItem} />
      <MenuSection title="Burgers" items={menu.burgers as MenuItem[]} addItem={addItem} />
      <MenuSection title="Desserts" items={menu.desserts as MenuItem[]} addItem={addItem} />
      <MenuSection title="Mocktails" items={menu.mocktails as MenuItem[]} addItem={addItem} />
      <MenuSection title="Chai & Lassi" items={menu.chai as MenuItem[]} addItem={addItem} />
      <MenuSection title="Ice-Cream Shakes" items={menu.shakes as MenuItem[]} addItem={addItem} />
      <MenuSection title="Soft Drinks & Juices" items={menu.softDrinks as MenuItem[]} addItem={addItem} />
      <MenuSection title="Sides & Sundries" items={menu.sides as MenuItem[]} addItem={addItem} />

      <h2>Current Order</h2>

      <ul>
        {cart.map((item, i) => (
          <li key={i}>{item.name}</li>
        ))}
      </ul>
      {cart.length > 0 && (
        <p style={{ fontWeight: "bold", marginTop: 6 }}>
          Total: £{orderTotal.toFixed(2)}
        </p>
      )}

      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

      <button
        onClick={sendOrder}
        disabled={cart.length === 0 || busy}
        style={{ opacity: cart.length === 0 || busy ? 0.5 : 1, marginRight: "10px" }}
      >
        {busy ? "Sending..." : "Send Order"}
      </button>

      <button
        onClick={clearCart}
        disabled={cart.length === 0}
        style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
      >
        Clear Order
      </button>

      {sentOrders.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Recently Sent Orders</h3>
          {sentOrders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
                background: "#fafafa",
              }}
            >
              <strong>
                {order.isKitchenOrder
                  ? `Kitchen Order #${order.orderNumber ?? "-"}`
                  : `Table ${order.table}`}
              </strong>
              <div style={{ marginTop: 6 }}>
                {order.items.map((item, idx) => (
                  <span key={idx} style={{ marginRight: 8 }}>
                    • {item.name}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 6, fontWeight: "bold" }}>
                Total: £
                {order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
