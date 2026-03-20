"use client";

interface Props {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

export default function TableGrid({ selected, setSelected }: Props) {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginBottom: "16px",
      }}
    >
      {tables.map((t) => (
        <div
          key={t}
          onClick={() => setSelected(t)}
          style={{
            border: "1px solid #999",
            padding: "16px 6px",
            cursor: "pointer",
            background: selected === t ? "#c8f7c5" : "#ffffff",
            color: "#000",
            textAlign: "center",
            borderRadius: 10,
            boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
            fontWeight: 700,
          }}
        >
          Table {t}
        </div>
      ))}
    </div>
  );
}
