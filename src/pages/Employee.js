"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import menu from "@data/menu.json";
import TableGrid from "@components/TableGrid";
import MenuSection from "@components/MenuSection";
import { createOrder } from "@services/api";
export default function Employee() {
    const [table, setTable] = useState(1);
    const [isKitchenOrder, setIsKitchenOrder] = useState(false);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [sentOrders, setSentOrders] = useState([]);
    const orderTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const addItem = (item) => {
        setCart((prev) => [...prev, item]);
    };
    const sendOrder = async () => {
        const order = {
            id: crypto.randomUUID(),
            table: !isKitchenOrder ? table : 0,
            items: cart,
            startersDone: false,
            mainsDone: false,
            drinksDone: false,
            isKitchenOrder: isKitchenOrder,
        };
        try {
            setBusy(true);
            const created = await createOrder(order);
            setCart([]);
            setError(null);
            setSentOrders((prev) => [
                {
                    id: created.id,
                    isKitchenOrder: created.isKitchenOrder,
                    table: created.table,
                    orderNumber: created.orderNumber,
                    items: created.items,
                },
                ...prev,
            ]);
        }
        catch (err) {
            setError(err?.message || "Unable to send order");
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsxs("div", { style: { padding: 12 }, children: [_jsx("h1", { children: "Employee Screen" }), _jsx("div", { style: { marginBottom: 20 }, children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: isKitchenOrder, onChange: (e) => setIsKitchenOrder(e.target.checked) }), "Takeout Order"] }) }), !isKitchenOrder && _jsx(TableGrid, { selected: table, setSelected: setTable }), _jsx(MenuSection, { title: "Starters", items: menu.starters, addItem: addItem }), _jsx(MenuSection, { title: "Street Food", items: menu.streetFood, addItem: addItem }), _jsx(MenuSection, { title: "Mains", items: menu.mains, addItem: addItem }), _jsx(MenuSection, { title: "Vegetarian Mains", items: menu.vegMains, addItem: addItem }), _jsx(MenuSection, { title: "Burgers", items: menu.burgers, addItem: addItem }), _jsx(MenuSection, { title: "Desserts", items: menu.desserts, addItem: addItem }), _jsx(MenuSection, { title: "Mocktails", items: menu.mocktails, addItem: addItem }), _jsx(MenuSection, { title: "Chai & Lassi", items: menu.chai, addItem: addItem }), _jsx(MenuSection, { title: "Ice-Cream Shakes", items: menu.shakes, addItem: addItem }), _jsx(MenuSection, { title: "Soft Drinks & Juices", items: menu.softDrinks, addItem: addItem }), _jsx(MenuSection, { title: "Sides & Sundries", items: menu.sides, addItem: addItem }), _jsx("h2", { children: "Current Order" }), _jsx("ul", { children: cart.map((item, i) => (_jsx("li", { children: item.name }, i))) }), cart.length > 0 && (_jsxs("p", { style: { fontWeight: "bold", marginTop: 6 }, children: ["Total: \u00A3", orderTotal.toFixed(2)] })), error && _jsx("p", { style: { color: "red", marginBottom: "10px" }, children: error }), _jsx("button", { onClick: sendOrder, disabled: cart.length === 0 || busy, style: { opacity: cart.length === 0 || busy ? 0.5 : 1 }, children: busy ? "Sending..." : "Send Order" }), sentOrders.length > 0 && (_jsxs("div", { style: { marginTop: 30 }, children: [_jsx("h3", { children: "Recently Sent Orders" }), sentOrders.slice(0, 5).map((order) => (_jsxs("div", { style: {
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginTop: "10px",
                            background: "#fafafa",
                        }, children: [_jsx("strong", { children: order.isKitchenOrder
                                    ? `Kitchen Order #${order.orderNumber ?? "-"}`
                                    : `Table ${order.table}` }), _jsx("div", { style: { marginTop: 6 }, children: order.items.map((item, idx) => (_jsxs("span", { style: { marginRight: 8 }, children: ["\u2022 ", item.name] }, idx))) }), _jsxs("div", { style: { marginTop: 6, fontWeight: "bold" }, children: ["Total: \u00A3", order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)] })] }, order.id)))] }))] }));
}
