function SummaryCards({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <div>
      <h2>Dashboard Summary</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ padding: "10px", background: "#e0ffe0" }}>
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>
        <div style={{ padding: "10px", background: "#ffe0e0" }}>
          <h3>Expense</h3>
          <p>₹{expense}</p>
        </div>
        <div style={{ padding: "10px", background: "#f0f0f0" }}>
          <h3>Balance</h3>
          <p>₹{balance}</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
