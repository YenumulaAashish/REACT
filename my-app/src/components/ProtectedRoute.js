import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If token exists, allow access; otherwise redirect to login
  return token ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
