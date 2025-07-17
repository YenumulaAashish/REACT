import { useState } from "react";
import { toast } from 'react-toastify';


function TransactionForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!title || !amount) {
  toast.error("Please fill all fields");
  return;
}


  const newTransaction = {
    id: Date.now(),
    title,
    amount: parseFloat(amount),
    type,
    date: new Date().toISOString(), // ✅ Auto date
  };

  onAdd(newTransaction); // send to parent
toast.success("Transaction added!");
setTitle("");
setAmount("");
setType("income");

};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>
      <input
        type="text"
        placeholder="Title (e.g., Salary)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <br /><br />

      <button type="submit">Add</button>
    </form>
  );
}

export default TransactionForm;
