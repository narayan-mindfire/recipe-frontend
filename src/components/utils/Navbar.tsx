import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="w-full z-10 px-6 py-4 flex justify-between items-center bg-[var(--background)] text-[var(--text)] shadow-2xl">
      <Link to={currentUser ? "/dashboard" : "/"}>
        <div className="text-xl font-bold flex items-center gap-2">
          🍛 <span>Eatos</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {!currentUser ? (
          <>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/me"
              className="hover:text-[var(--primary)] transition-colors duration-200"
            >
              <div className="text-sm font-medium flex items-center gap-2">
                <i
                  className="fas fa-user-circle text-xl"
                  title={`${currentUser.fname} ${currentUser.lname}`}
                ></i>
                <span>{currentUser.fname}</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium hover:text-[var(--primary)] transition-colors duration-200"
            >
              Logout
            </button>
          </>
        )}
        <button
          onClick={toggleTheme}
          className="text-lg hover:text-[var(--primary)] transition-colors duration-200"
          aria-label="Toggle Theme"
        >
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
