import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Summary from "./components/Summary";
import AddTransactionForm from "./components/AddTransactionForm";
import TransactionList from "./components/TransactionList";
import ChartView from "./components/ChartView";
import { loadTransactions, saveTransactions } from "./utils/storage";

function App() {
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [limit, setLimit] = useState(() => {
    const raw = localStorage.getItem("month_limit");
    return raw ? Number(raw) : 0;
  });

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("month_limit", String(limit || 0));
  }, [limit]);

  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const incomes = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = incomes - expenses;

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Summary
          incomes={incomes}
          expenses={expenses}
          balance={balance}
          limit={limit}
          setLimit={setLimit}
        />
        <div className="main-grid">
          <div className="left">
            <AddTransactionForm onAdd={addTransaction} />
            <TransactionList
              transactions={transactions}
              onDelete={deleteTransaction}
              onUpdate={updateTransaction}
            />
          </div>
          <div className="right">
            <ChartView transactions={transactions} />
          </div>
        </div>
      </main>
      <footer className="footer">
        Developed for course — Personal Finance Tracker (Lab)
      </footer>
    </div>
  );
}

export default App;
