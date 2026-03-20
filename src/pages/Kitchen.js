"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchOrders, patchOrder } from "../api";
import { socket } from "../socket";
export default function Kitchen() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const refreshOrders = async () => {
        try {
            const data = (await fetchOrders(false));
            setOrders(data);
            setError(null);
        }
        catch (err) {
            setError(err?.message || "Could not refresh orders");
        }
    };
    useEffect(() => {
        refreshOrders();
        socket.on("all-orders", (data) => setOrders(data));
        socket.on("new-order", (order) => setOrders((prev) => [...prev, order]));
        socket.on("order-status-updated", (order) => setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o))));
        socket.on("order-complete", (order) => setOrders((prev) => prev.filter((o) => o.id !== order.id)));
        return () => {
            socket.off("all-orders");
            socket.off("new-order");
            socket.off("order-status-updated");
            socket.off("order-complete");
        };
    }, []);
    const checkAndCompleteOrder = async (order) => {
        try {
            const updated = await patchOrder(order.id, {
                startersDone: order.startersDone,
                mainsDone: order.mainsDone,
                drinksDone: order.drinksDone,
            });
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        }
        catch (err) {
            setError(err?.message || "Failed to update order status");
        }
    };
    const finishOrder = async (order) => {
        try {
            await patchOrder(order.id, { action: "complete" });
            setOrders((prev) => prev.filter((o) => o.id !== order.id));
            setError(null);
        }
        catch (err) {
            setError(err?.message || "Could not complete order");
        }
    };
    const markStartersDone = (order) => {
        const updatedOrder = { ...order, startersDone: true };
        setOrders((prev) => prev.map((o) => (o.id === order.id ? updatedOrder : o)));
        checkAndCompleteOrder(updatedOrder);
    };
    const markMainsDone = (order) => {
        const updatedOrder = { ...order, mainsDone: true };
        setOrders((prev) => prev.map((o) => (o.id === order.id ? updatedOrder : o)));
        checkAndCompleteOrder(updatedOrder);
    };
    return (_jsxs("div", { style: { padding: 30 }, children: [_jsx("h1", { children: "Kitchen Display" }), error && _jsx("p", { style: { color: "red" }, children: error }), orders
                .filter((order) => {
                const starters = order.items.filter((i) => i.category === "starter");
                const mains = order.items.filter((i) => i.category === "main");
                return starters.length > 0 || mains.length > 0;
            })
                .map((order) => {
                const starters = order.items.filter((i) => i.category === "starter");
                const mains = order.items.filter((i) => i.category === "main");
                const allDone = (starters.length === 0 || order.startersDone) &&
                    (mains.length === 0 || order.mainsDone);
                return (_jsxs("div", { style: {
                        border: "2px solid black",
                        padding: 20,
                        marginBottom: 20,
                        width: 500,
                    }, children: [_jsx("h2", { children: order.isKitchenOrder
                                ? `Order #${order.orderNumber}`
                                : `Table ${order.table}` }), _jsxs("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 20,
                            }, children: [starters.length > 0 && (_jsxs("div", { children: [_jsx("h3", { children: "Starters" }), starters.map((item, i) => (_jsx("p", { style: { fontSize: "18px", fontWeight: "bold" }, children: item.name }, i))), _jsx("button", { onClick: () => markStartersDone(order), style: {
                                                background: order.startersDone ? "green" : "#eee",
                                                color: order.startersDone ? "white" : "black",
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "10px",
                                            }, children: "Done" })] })), mains.length > 0 && (_jsxs("div", { children: [_jsx("h3", { children: "Mains" }), mains.map((item, i) => (_jsx("p", { style: { fontSize: "18px", fontWeight: "bold" }, children: item.name }, i))), _jsx("button", { onClick: () => markMainsDone(order), style: {
                                                background: order.mainsDone ? "green" : "#eee",
                                                color: order.mainsDone ? "white" : "black",
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "10px",
                                            }, children: "Done" })] }))] }), allDone && (_jsx("button", { onClick: () => finishOrder(order), style: {
                                background: "blue",
                                color: "white",
                                padding: "10px 20px",
                                fontWeight: "bold",
                                marginTop: 20,
                                cursor: "pointer",
                            }, children: "Finish Order" }))] }, order.id));
            })] }));
}
