import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar({ userEmail, setUserEmail, darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
    navigate("/login");
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-left">
        <h1 className="logo">💰 SmartFinance</h1>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/add" className="nav-link">Add</Link>
        <Link to="/list" className="nav-link">Transactions</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>

      <div className="nav-right">
        <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle">
          {darkMode ? "🌙" : "☀️"}
        </button>

        {userEmail ? (
          <>
            <span className="user-email">👋 {userEmail}</span>
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
