import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Salary", "Other"];

export default function AddTransactionForm({ onAdd }) {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [comment, setComment] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) {
      alert("Сумма должна быть положительной");
      return;
    }
    const tx = {
      id: uuidv4(),
      type,
      category,
      amount: n,
      date,
      comment
    };
    onAdd(tx);
    // reset
    setAmount("");
    setComment("");
    setType("expense");
    setCategory(CATEGORIES[0]);
  };

  return (
    <form className="card add-form" onSubmit={submit}>
      <h3>Жаңа операция қосу</h3>
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
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Введите сумму" />
      </div>
      <div className="form-row">
        <label>Дата</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Комментарий</label>
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Опционально" />
      </div>
      <div className="form-row actions">
        <button className="btn" type="submit">Қосу</button>
      </div>
    </form>
  );
}
