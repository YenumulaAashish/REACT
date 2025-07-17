import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionListPage from "./pages/TransactionListPage";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import "./custom.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

import { getTransactions } from "./services/api";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    if (userEmail) {
      getTransactions(userEmail)
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error("Failed to fetch transactions:", err));
    } else {
      setTransactions([]);
    }
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        <Navbar
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard transactions={transactions} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddTransaction
                  transactions={transactions}
                  setTransactions={setTransactions}
                  userEmail={userEmail}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <TransactionListPage
                  transactions={transactions}
                  setTransactions={setTransactions}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-center" />
      </div>
    </BrowserRouter>
  );
}

export default App;
