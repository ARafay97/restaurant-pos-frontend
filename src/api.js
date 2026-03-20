// Default aligns with backend PORT=3001; override via VITE_API_URL.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
function buildUrl(path) {
    return `${API_BASE}${path}`;
}
export async function fetchOrders(completed) {
    const res = await fetch(buildUrl(`/api/orders?completed=${completed}`));
    if (!res.ok)
        throw new Error("Failed to load orders");
    return res.json();
}
export async function createOrder(body) {
    const res = await fetch(buildUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to create order");
    }
    return res.json();
}
export async function patchOrder(id, data) {
    const res = await fetch(buildUrl(`/api/orders/${id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to update order");
    }
    return res.json();
}
