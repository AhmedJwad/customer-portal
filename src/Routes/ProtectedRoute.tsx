import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = { roles?: string[] }; 
export default function ProtectedRoute({ roles }: Props) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role ?? "")) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}