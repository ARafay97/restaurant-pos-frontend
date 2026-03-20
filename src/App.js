import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from "react-router-dom";
export default function AppLayout() {
    return (_jsxs("div", { children: [_jsxs("header", { style: {
                    display: "flex",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: "1px solid #ddd",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                    boxSizing: "border-box",
                }, children: [_jsx("strong", { style: { marginRight: 8 }, children: "Restaurant POS" }), _jsx(Link, { to: "/", children: "Home" }), _jsx(Link, { to: "/employee", children: "Employee" }), _jsx(Link, { to: "/kitchen", children: "Kitchen" }), _jsx(Link, { to: "/bar", children: "Bar" }), _jsx(Link, { to: "/ordersBar", children: "Completed Bar" }), _jsx(Link, { to: "/ordersKitchen", children: "Completed Kitchen" })] }), _jsx("main", { style: { padding: "12px 14px" }, children: _jsx(Outlet, {}) })] }));
}
