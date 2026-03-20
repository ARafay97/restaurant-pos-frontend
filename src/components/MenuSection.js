"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function MenuSection({ title, items, addItem }) {
    return (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h2", { children: title }), _jsx("div", { className: "menu-grid", style: { width: "100%" }, children: items.map((item) => (_jsxs("button", { onClick: () => addItem(item), style: {
                        textAlign: "left",
                        border: "1px solid #b3d7ff",
                        borderRadius: 10,
                        padding: "11px 11px",
                        background: "linear-gradient(135deg, #e8f3ff 0%, #f5fbff 100%)",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        transition: "transform 120ms ease, box-shadow 120ms ease",
                        minHeight: 70,
                        width: "100%",
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.12)";
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                    }, onTouchStart: (e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.12)";
                    }, onTouchEnd: (e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                    }, children: [_jsx("div", { style: { fontWeight: 600 }, children: item.name }), _jsxs("div", { style: { color: "#444", marginTop: 4 }, children: ["\u00A3", item.price.toFixed(2)] })] }, item.name))) })] }));
}
