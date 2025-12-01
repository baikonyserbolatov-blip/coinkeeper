import React, { useState } from "react";

export default function Summary({ incomes, expenses, balance, limit, setLimit }) {
  const [val, setVal] = useState(limit || "");

  const save = () => {
    const n = Number(val) || 0;
    setLimit(n);
    alert("Айлық лимит сақталды: " + n);
  };

  const remaining = limit ? Math.max(limit - expenses, 0) : null;

  return (
    <section className="summary card">
      <div className="row">
        <div className="stat">
          <h3>Баланс</h3>
          <div className="big">{balance.toLocaleString()}</div>
        </div>
        <div className="stat">
          <h4>Доход</h4>
          <div>{incomes.toLocaleString()}</div>
        </div>
        <div className="stat">
          <h4>Расход</h4>
          <div>{expenses.toLocaleString()}</div>
        </div>
        <div className="stat limit">
          <h4>Айлық лимит</h4>
          <input type="number" value={val} onChange={(e) => setVal(e.target.value)} placeholder="0" />
          <button className="btn" onClick={save}>Сақтау</button>
          {limit ? <div>Қалдық: {remaining.toLocaleString()}</div> : <div>Лимит орнатылмаған</div>}
        </div>
      </div>
    </section>
  );
}
