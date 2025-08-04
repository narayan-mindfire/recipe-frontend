import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

export const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
