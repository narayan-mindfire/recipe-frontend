import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./themeContext";

/**
 * ThemeProvider component handles the light/dark theme toggle functionality.
 * It syncs the user's preference with localStorage and applies the appropriate CSS class to the <html> element.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Components that will consume the theme context.
 * @returns {JSX.Element} ThemeContext.Provider with `darkMode` state and `toggleTheme` function.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleTheme: () => setDarkMode((p) => !p) }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeContext };
