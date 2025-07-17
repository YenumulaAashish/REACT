function TransactionListPage({ transactions, setTransactions }) {
  const handleDelete = (id) => {
    const updatedList = transactions.filter((tx) => tx.id !== id);
    setTransactions(updatedList); // ✅ Will work now
  };

  return (
     <div className="container">
      <h2>All Transactions</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.title} - ₹{tx.amount} ({tx.type})
            <button onClick={() => handleDelete(tx.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionListPage;
