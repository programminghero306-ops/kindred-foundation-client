import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="page">
        <div className="container">
          <Loader label="Checking your session..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
}
