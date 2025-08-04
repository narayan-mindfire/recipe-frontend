import { useContext } from "react";
import { AuthContext } from "../context/authContext";

/**
 * useAuth hook to provide auth values
 * @returns auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
