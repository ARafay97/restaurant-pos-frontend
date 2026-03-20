import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 12 }}>
      <h1>Restaurant POS</h1>
      <Link to="/employee">Employee Screen</Link>
      <Link to="/kitchen">Kitchen Screen</Link>
      <Link to="/bar">Bar Screen</Link>
      <Link to="/ordersBar">Completed Bar Orders</Link>
      <Link to="/ordersKitchen">Completed Kitchen Orders</Link>
    </div>
  );
}
