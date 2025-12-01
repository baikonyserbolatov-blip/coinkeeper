import React, { useMemo } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function groupByCategory(transactions) {
  const res = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      res[t.category] = (res[t.category] || 0) + t.amount;
    }
  });
  return res;
}

function groupByDay(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const day = t.date;
    map[day] = (map[day] || 0) + (t.type === "expense" ? -t.amount : t.amount);
  });
  // sort by day
  const keys = Object.keys(map).sort();
  const vals = keys.map((k) => map[k]);
  return { keys, vals };
}

export default function ChartView({ transactions }) {
  const categoryData = useMemo(() => {
    const grouped = groupByCategory(transactions);
    const labels = Object.keys(grouped);
    const data = labels.map((l) => grouped[l]);
    return { labels, data };
  }, [transactions]);

  const daily = useMemo(() => groupByDay(transactions), [transactions]);

  return (
    <section className="card charts">
      <h3>Аналитика</h3>
      <div className="chart-wrap">
        {categoryData.labels.length ? (
          <div className="chart-block">
            <h4>Категория бойынша шығындар</h4>
            <Pie data={{
              labels: categoryData.labels,
              datasets: [{ data: categoryData.data }]
            }} />
          </div>
        ) : <div>Шығындар жоқ — диаграмма көрсетілмейді</div>}

        {daily.keys && daily.keys.length ? (
          <div className="chart-block">
            <h4>Күн бойынша (табыстар/шығындар)</h4>
            <Line data={{
              labels: daily.keys,
              datasets: [{
                label: "Сумма (позитив = доход, негатив = расход)",
                data: daily.vals,
                tension: 0.3
              }]
            }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
