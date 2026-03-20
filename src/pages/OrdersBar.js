"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchOrders } from "../api";
import { socket } from "../socket";
export default function OrdersBar() {
    const [completed, setCompleted] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function refresh() {
            try {
                const allCompleted = (await fetchOrders(true));
                const barCompleted = allCompleted.filter((order) => order.items.some((i) => i.category === "mocktail"));
                setCompleted(barCompleted);
                setError(null);
            }
            catch (err) {
                setError(err?.message || "Could not load completed bar orders");
            }
        }
        refresh();
        socket.on("completed-orders", (orders) => {
            const barCompleted = orders.filter((order) => order.items.some((i) => i.category === "mocktail"));
            setCompleted(barCompleted);
        });
        socket.emit("request-completed-orders");
        return () => {
            socket.off("completed-orders");
        };
    }, []);
    return (_jsxs("div", { style: { padding: 30 }, children: [_jsx("h1", { children: "Completed Bar Orders" }), error && _jsx("p", { style: { color: "red" }, children: error }), completed.map((order) => {
                const mocktails = order.items.filter((i) => i.category === "mocktail");
                return (_jsxs("div", { style: {
                        border: "2px solid green",
                        padding: 20,
                        marginBottom: 20,
                        width: 500,
                        backgroundColor: "#f0fff0",
                    }, children: [_jsx("h3", { children: order.isKitchenOrder
                                ? `Order #${order.orderNumber}`
                                : `Table ${order.table}` }), mocktails.length > 0 && (_jsxs("div", { style: { marginBottom: 15 }, children: [_jsx("h4", { style: { marginBottom: 8 }, children: "Mocktails" }), mocktails.map((item, i) => (_jsxs("p", { style: { margin: 4 }, children: ["\u2022 ", item.name] }, i)))] }))] }, order.id));
            })] }));
}
