import { Navigate } from "react-router-dom";

export default function PublicGuard({ children }: { children: React.ReactNode }) {
  const isUser = localStorage.getItem("user");

  if (!isUser) return <Navigate to="/sign-up" replace />;

  return <>{children}</>;
}
