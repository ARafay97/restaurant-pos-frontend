"use client";

import { MenuItem } from "@models/order";

interface Props {
  title: string;
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
}

export default function MenuSection({ title, items, addItem }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>{title}</h2>

      <div className="menu-grid" style={{ width: "100%" }}>
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => addItem(item)}
            style={{
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.12)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ color: "#444", marginTop: 4 }}>£{item.price.toFixed(2)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
