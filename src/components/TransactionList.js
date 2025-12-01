import React, { useState } from "react";
import ModalEdit from "./ModalEdit";

export default function TransactionList({ transactions, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (search && !t.category.toLowerCase().includes(search.toLowerCase()) && !t.comment.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="card transactions">
      <h3>Операциялар</h3>
      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Барлығы</option>
          <option value="income">Табыс</option>
          <option value="expense">Шығын</option>
        </select>
        <input placeholder="Іздеу по категории/коммент" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? <div className="empty">Операциялар табылмады</div> : (
        <ul className="tx-list">
          {filtered.map((t) => (
            <li key={t.id} className={`tx ${t.type}`}>
              <div className="tx-left">
                <div className="tx-cat">{t.category}</div>
                <div className="tx-comm">{t.comment}</div>
              </div>
              <div className="tx-right">
                <div className="tx-amt">{t.type === "expense" ? "-" : "+"}{t.amount.toLocaleString()}</div>
                <div className="tx-date">{t.date}</div>
                <div className="tx-actions">
                  <button onClick={() => setEditing(t)}>Edit</button>
                  <button onClick={() => onDelete(t.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && <ModalEdit tx={editing} onClose={() => setEditing(null)} onSave={(u) => { onUpdate(u); setEditing(null); }} />}
    </section>
  );
}
