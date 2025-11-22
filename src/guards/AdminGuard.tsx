import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem("auth") === "admin";

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return <>{children}</>;
}
