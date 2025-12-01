const KEY = "coinkeeper_transactions_v1";

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return sampleData();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : sampleData();
  } catch (e) {
    console.error("loadTransactions error", e);
    return sampleData();
  }
}

export function saveTransactions(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    console.error("saveTransactions error", e);
  }
}

function sampleData() {
  // небольшой набор начальных данных чтобы интерфейс не пустой был
  const now = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  return [
    { id: "1", type: "income", category: "Salary", amount: 120000, date: iso(now), comment: "Monthly salary" },
    { id: "2", type: "expense", category: "Food", amount: 2500, date: iso(new Date(now.getTime() - 86400000)), comment: "Lunch" },
    { id: "3", type: "expense", category: "Transport", amount: 800, date: iso(new Date(now.getTime() - 2*86400000)), comment: "" }
  ];
}
