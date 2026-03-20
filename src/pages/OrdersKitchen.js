"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchOrders } from "@services/api";
import { socket } from "@services/socket";
export default function OrdersKitchen() {
    const [completed, setCompleted] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function refresh() {
            try {
                const allCompleted = (await fetchOrders(true));
                const kitchenCompleted = allCompleted.filter((order) => order.items.some((i) => i.category !== "mocktail"));
                setCompleted(kitchenCompleted);
                setError(null);
            }
            catch (err) {
                setError(err?.message || "Could not load completed kitchen orders");
            }
        }
        refresh();
        socket.on("completed-orders", (orders) => {
            const kitchenCompleted = orders.filter((order) => order.items.some((i) => i.category !== "mocktail"));
            setCompleted(kitchenCompleted);
        });
        socket.emit("request-completed-orders");
        return () => {
            socket.off("completed-orders");
        };
    }, []);
    return (_jsxs("div", { style: { padding: 30 }, children: [_jsx("h1", { children: "Completed Kitchen Orders" }), error && _jsx("p", { style: { color: "red" }, children: error }), completed.map((order) => {
                const starters = order.items.filter((i) => i.category === "starter");
                const mains = order.items.filter((i) => i.category === "main");
                return (_jsxs("div", { style: {
                        border: "2px solid #444",
                        padding: 20,
                        marginBottom: 20,
                        width: 520,
                        backgroundColor: "#f8f8ff",
                    }, children: [_jsx("h3", { children: order.isKitchenOrder
                                ? `Order #${order.orderNumber}`
                                : `Table ${order.table}` }), starters.length > 0 && (_jsxs("div", { style: { marginBottom: 10 }, children: [_jsx("h4", { children: "Starters" }), starters.map((item, i) => (_jsxs("p", { style: { margin: 4 }, children: ["\u2022 ", item.name] }, i)))] })), mains.length > 0 && (_jsxs("div", { style: { marginBottom: 10 }, children: [_jsx("h4", { children: "Mains" }), mains.map((item, i) => (_jsxs("p", { style: { margin: 4 }, children: ["\u2022 ", item.name] }, i)))] }))] }, order.id));
            })] }));
}
