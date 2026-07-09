"use client";

interface Props {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

export default function TableGrid({ selected, setSelected }: Props) {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="table-grid">
      {tables.map((t) => (
        <div
          key={t}
          onClick={() => setSelected(t)}
          className={`table-tile${selected === t ? " is-selected" : ""}`}
        >
          Table {t}
        </div>
      ))}
    </div>
  );
}
