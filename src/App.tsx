import { useTheme } from "./hooks/useTheme";

const App = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-8 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="mb-6 px-4 py-2 rounded bg-[var(--primary)] text-white"
      >
        Toggle to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <h1 className="text-4xl font-bold mb-4">🍲 Recipe Sharing Platform</h1>

      <div className="bg-[var(--accent)] text-[var(--text)] p-4 rounded mb-4">
        Welcome! Discover and share your favorite recipes.
      </div>

      <div className="bg-[var(--highlight)] text-[var(--text)] p-4 rounded">
        Featured Recipe: Pakhala bhata
      </div>
    </div>
  );
};

export default App;
