import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function Home() {
    return (_jsxs("div", { style: { padding: 40, display: "flex", flexDirection: "column", gap: 12 }, children: [_jsx("h1", { children: "Restaurant POS" }), _jsx(Link, { to: "/employee", children: "Employee Screen" }), _jsx(Link, { to: "/kitchen", children: "Kitchen Screen" }), _jsx(Link, { to: "/bar", children: "Bar Screen" }), _jsx(Link, { to: "/ordersBar", children: "Completed Bar Orders" }), _jsx(Link, { to: "/ordersKitchen", children: "Completed Kitchen Orders" })] }));
}
