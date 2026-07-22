import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAppSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
