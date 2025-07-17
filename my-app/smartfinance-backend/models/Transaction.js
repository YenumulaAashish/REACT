const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  title: String,
  amount: Number,
  type: String, // 'income' or 'expense'
  category: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
