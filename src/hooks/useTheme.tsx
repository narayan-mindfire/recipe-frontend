import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

/**
 * useTheme hook provides theme context throughout the app
 * @returns theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
