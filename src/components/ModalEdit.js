import React, { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Salary", "Other"];

export default function ModalEdit({ tx, onClose, onSave }) {
  const [category, setCategory] = useState(tx.category);
  const [amount, setAmount] = useState(tx.amount);
  const [date, setDate] = useState(tx.date);
  const [comment, setComment] = useState(tx.comment);
  const [type, setType] = useState(tx.type);

  const save = () => {
    const n = Number(amount);
    if (!n || n <= 0) {
      alert("Введите корректную сумму");
      return;
    }
    onSave({ ...tx, category, amount: n, date, comment, type });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit transaction</h3>
        <div className="form-row">
          <label>Тип</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Шығын</option>
            <option value="income">Табыс</option>
          </select>
        </div>
        <div className="form-row">
          <label>Категория</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Сумма</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Дата</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Комментарий</label>
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <div className="form-row actions">
          <button className="btn" onClick={save}>Сақтау</button>
          <button className="btn ghost" onClick={onClose}>Болдырмау</button>
        </div>
      </div>
    </div>
  );
}
