import { Link } from "react-router-dom";

const stations = [
  { to: "/employee", label: "Employee Screen", desc: "Take orders and send them to the kitchen or bar." },
  { to: "/kitchen", label: "Kitchen Screen", desc: "Live kitchen prep display." },
  { to: "/bar", label: "Bar Screen", desc: "Mocktails, desserts, drinks and shakes." },
  { to: "/orders", label: "Active Orders", desc: "Everything currently in progress." },
  { to: "/completed", label: "Completed Orders", desc: "Full history of finished orders." },
  { to: "/ordersBar", label: "Completed Bar Orders", desc: "Bar-only completed history." },
  { to: "/ordersKitchen", label: "Completed Kitchen Orders", desc: "Kitchen-only completed history." },
];

export default function Home() {
  return (
    <div>
      <h1 className="page-title">MyBagh POS</h1>
      <p className="page-subtitle">Pick a station to get started.</p>

      <div className="ticket-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {stations.map((s) => (
          <Link key={s.to} to={s.to} className="card" style={{ padding: 20, textDecoration: "none", display: "block" }}>
            <h3 style={{ color: "var(--gold)", fontSize: 15 }}>{s.label}</h3>
            <p style={{ color: "var(--muted2)", fontSize: 13, margin: 0 }}>{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
