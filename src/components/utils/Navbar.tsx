import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-[var(--background)] text-[var(--text)] shadow-md">
      <Link to={"/"}>
        <div className="text-xl font-bold flex items-center gap-2">
          🍛 <span>Eatos</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
        >
          Sign Up
        </Link>
        <button
          onClick={toggleTheme}
          className="text-lg hover:text-[var(--primary)] transition-colors"
          aria-label="Toggle Theme"
        >
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
