import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header
        style={{
          display: "flex",
          gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid #ddd",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <strong style={{ marginRight: 8 }}>Restaurant POS</strong>
        <Link to="/">Home</Link>
        <Link to="/employee">Employee</Link>
        <Link to="/kitchen">Kitchen</Link>
        <Link to="/bar">Bar</Link>
        <Link to="/ordersBar">Completed Bar</Link>
        <Link to="/ordersKitchen">Completed Kitchen</Link>
      </header>
      <main style={{ padding: "12px 14px" }}>
        <Outlet />
      </main>
    </div>
  );
}
