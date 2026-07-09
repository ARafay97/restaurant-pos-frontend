import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/employee", label: "Employee" },
  { to: "/kitchen", label: "Kitchen" },
  { to: "/bar", label: "Bar" },
  { to: "/orders", label: "Orders" },
  { to: "/completed", label: "Completed" },
  { to: "/ordersBar", label: "Completed Bar" },
  { to: "/ordersKitchen", label: "Completed Kitchen" },
];

export default function AppLayout() {
  return (
    <div>
      <header className="pos-header">
        <div className="pos-header__inner">
          <span className="brand">MyBagh POS</span>
          <nav className="pos-nav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="pos-main">
        <Outlet />
      </main>
    </div>
  );
}
