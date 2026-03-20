"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "../api";
import { socket } from "../socket";
export default function Bar() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const filterBar = (list) => list.filter((order) => order.items.some((item) => item.category === "mocktail"));
    const refreshOrders = async () => {
        try {
            const data = (await fetchOrders(false));
            const barOrders = filterBar(data);
            setOrders(barOrders);
            setError(null);
        }
        catch (err) {
            setError(err?.message || "Failed to load bar orders");
        }
    };
    useEffect(() => {
        refreshOrders();
        socket.on("all-orders", (data) => setOrders(filterBar(data)));
        socket.on("new-order", (order) => {
            if (order.items.some((i) => i.category === "mocktail")) {
                setOrders((prev) => [...prev, order]);
            }
        });
        socket.on("order-complete", (order) => setOrders((prev) => prev.filter((o) => o.id !== order.id)));
        socket.on("order-status-updated", (order) => setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o))));
        return () => {
            socket.off("all-orders");
            socket.off("new-order");
            socket.off("order-complete");
            socket.off("order-status-updated");
        };
    }, []);
    const markMocktailsDone = async (orderId) => {
        try {
            await patchOrder(orderId, { action: "complete" });
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
            setError(null);
        }
        catch (err) {
            setError(err?.message || "Could not mark mocktails done");
        }
    };
    return (_jsxs("div", { style: { padding: 30 }, children: [_jsx("h1", { children: "Drinks / Mocktails" }), error && _jsx("p", { style: { color: "red" }, children: error }), orders.map((order) => {
                const mocktails = order.items.filter((i) => i.category === "mocktail");
                return (_jsxs("div", { style: {
                        border: "2px solid black",
                        padding: 20,
                        marginBottom: 20,
                        width: 500,
                    }, children: [_jsx("h3", { children: order.isKitchenOrder
                                ? `Order #${order.orderNumber}`
                                : `Table ${order.table}` }), _jsxs("div", { children: [_jsx("h4", { children: "Mocktails" }), mocktails.map((item, i) => (_jsxs("p", { style: { fontSize: "18px", fontWeight: "bold" }, children: ["\u2022 ", item.name] }, i))), _jsx("button", { onClick: () => markMocktailsDone(order.id), style: {
                                        background: "#eee",
                                        color: "black",
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "10px",
                                    }, children: "Done" })] })] }, order.id));
            })] }));
}
