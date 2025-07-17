const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// 🔹 Add a new transaction
router.post("/add", async (req, res) => {
  try {
    const newTx = new Transaction(req.body);
    const savedTx = await newTx.save();
    res.status(201).json(savedTx);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// 🔹 Get all transactions for a user
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const txs = await Transaction.find({ userEmail: email });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;
