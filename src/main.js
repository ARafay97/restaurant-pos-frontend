import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@styles/styles.css";
import AppLayout from "./App";
import Home from "./pages/Home";
import Employee from "./pages/Employee";
import Kitchen from "./pages/Kitchen";
import Bar from "./pages/Bar";
import OrdersBar from "./pages/OrdersBar";
import OrdersKitchen from "./pages/OrdersKitchen";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(AppLayout, {}),
        children: [
            { index: true, element: _jsx(Home, {}) },
            { path: "employee", element: _jsx(Employee, {}) },
            { path: "kitchen", element: _jsx(Kitchen, {}) },
            { path: "bar", element: _jsx(Bar, {}) },
            { path: "ordersBar", element: _jsx(OrdersBar, {}) },
            { path: "ordersKitchen", element: _jsx(OrdersKitchen, {}) },
        ],
    },
]);
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
