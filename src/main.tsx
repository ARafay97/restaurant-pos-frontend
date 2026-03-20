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
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "employee", element: <Employee /> },
      { path: "kitchen", element: <Kitchen /> },
      { path: "bar", element: <Bar /> },
      { path: "ordersBar", element: <OrdersBar /> },
      { path: "ordersKitchen", element: <OrdersKitchen /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
