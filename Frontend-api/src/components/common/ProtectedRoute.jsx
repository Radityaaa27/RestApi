import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <p className="p-4 text-body text-secondary">Loading...</p>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
