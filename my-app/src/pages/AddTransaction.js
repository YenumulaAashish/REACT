import TransactionForm from "../components/TransactionForm";
import { addTransaction } from "../services/api";

function AddTransaction({ transactions, setTransactions, userEmail }) {
  const handleAdd = async (tx) => {
    const newTx = {
      ...tx,
      userEmail,
      date: new Date().toISOString(),
    };
    try {
      const res = await addTransaction(newTx);
      setTransactions([...transactions, res.data]);
    } catch (err) {
      alert("Failed to add transaction");
      console.error(err);
    }
  };

  return (
    <div>
      <TransactionForm onAdd={handleAdd} />
    </div>
  );
}

export default AddTransaction;
