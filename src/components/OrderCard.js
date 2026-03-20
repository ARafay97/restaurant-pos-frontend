"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export default function OrderCard({ table, items, sendOrder }) {
    return (_jsxs("div", { style: {
            border: "1px solid grey",
            padding: "10px",
            marginTop: "20px",
        }, children: [_jsxs("h2", { children: ["Table ", table] }), items.map((item, index) => (_jsxs("p", { children: [item.name, " - \u00A3", item.price] }, index))), _jsx("button", { onClick: sendOrder, children: "Send Order" })] }));
}
