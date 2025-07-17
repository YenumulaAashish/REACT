import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const signupUser = (data) => API.post("/auth/signup", data);

// 💸 Transactions
export const addTransaction = (data) => API.post("/transactions/add", data);
export const getTransactions = (email) => API.get(`/transactions/${email}`);
