"use client";

import { MenuItem } from "../types/order";

interface Props {
  table: number;
  items: MenuItem[];
  sendOrder: () => void;
}

export default function OrderCard({ table, items, sendOrder }: Props) {
  return (
    <div
      style={{
        border: "1px solid grey",
        padding: "10px",
        marginTop: "20px",
      }}
    >
      <h2>Table {table}</h2>

      {items.map((item, index) => (
        <p key={index}>
          {item.name} - £{item.price}
        </p>
      ))}

      <button onClick={sendOrder}>Send Order</button>
    </div>
  );
}
