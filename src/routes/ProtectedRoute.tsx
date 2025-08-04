import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

//allows authenticated users only
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate to="/unauthenticated" state={{ from: location }} replace />
    );
  }

  return children;
};
