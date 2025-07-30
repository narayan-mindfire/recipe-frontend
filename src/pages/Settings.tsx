import { useTheme } from "../hooks/useTheme";

function Settings() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="mb-6 px-4 py-2 rounded bg-[var(--primary)] text-white"
    >
      Toggle to {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
}

export default Settings;
