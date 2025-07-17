import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

function Dashboard({ transactions }) {
  const [budget, setBudget] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Get current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserEmail(user.email);
      const savedBudget = localStorage.getItem(`${user.email}_budget`);
      if (savedBudget) {
        setBudget(Number(savedBudget));
      }
    }
  }, []);

  // Save budget
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`${userEmail}_budget`, budget);
    }
  }, [budget, userEmail]);

  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filterByMonth = (tx) => {
    if (selectedMonth === "all") return true;
    const txDate = new Date(tx.date);
    const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;
    return txMonth === selectedMonth;
  };

  const filteredTransactions = transactions.filter(filterByMonth);

  const income = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const COLORS = ["#00C49F", "#FF8042"];
  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const categorizedTransactions = filteredTransactions.map((tx) => ({
    ...tx,
    category: tx.category || "Other",
  }));

  const categoryMap = {};
  categorizedTransactions.forEach((tx) => {
    if (tx.type === "expense") {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + Number(tx.amount);
    }
  });

  const barData = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
  }));

  const timelineMap = {};
  filteredTransactions.forEach((tx) => {
    if (tx.type === "expense") {
      const date = new Date(tx.date).toLocaleDateString();
      timelineMap[date] = (timelineMap[date] || 0) + Number(tx.amount);
    }
  });

  const timelineData = Object.entries(timelineMap).map(([date, amount]) => ({
    date,
    amount,
  }));

  const balance = income - expense;
  const percentSpent = budget ? Math.min((expense / budget) * 100, 100).toFixed(0) : 0;

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2>Dashboard</h2>

      {/* Month Filter */}
      <motion.div
        style={{ marginBottom: "20px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="all">All</option>
          {[
            "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
            "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
          ].map((month) => (
            <option key={month} value={month}>
              {new Date(`${month}-01`).toLocaleString("default", {
                month: "long", year: "numeric"
              })}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="summary-cards"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="card income">Income: ₹{income}</div>
        <div className="card expense">Expense: ₹{expense}</div>
        <div className="card balance">Balance: ₹{balance}</div>
      </motion.div>

      {/* Budget */}
      <motion.div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <label>Monthly Budget: ₹</label>
        <input
          type="number"
          value={budget === 0 ? "" : budget}
          onChange={handleBudgetChange}
          placeholder="Set budget"
          style={{ padding: "4px", marginLeft: "10px", width: "120px" }}
        />
        {budget > 0 && (
          <div style={{ marginTop: "10px" }}>
            <p>You've used {percentSpent}% of your budget.</p>
            <div
              style={{
                background: "#ccc",
                width: "100%",
                height: "20px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  background: percentSpent < 100 ? "#28a745" : "#dc3545",
                  height: "100%",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${percentSpent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Pie Chart */}
      <motion.div data-aos="zoom-in" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7 }}>
        <PieChart width={300} height={300}>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </motion.div>

      {/* Bar Chart */}
      <h3>Spending by Category</h3>
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
        <BarChart width={400} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </motion.div>

      {/* Line Chart */}
      <h3>Expense Timeline</h3>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
        <LineChart width={500} height={300} data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#ff7300" />
        </LineChart>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
