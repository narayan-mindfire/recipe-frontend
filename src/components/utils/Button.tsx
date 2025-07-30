import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { Link } from "react-router-dom";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "danger";
  className?: string;
  disabled?: boolean;
  to?: string;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "default",
  className = "",
  disabled = false,
  to = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 text-sm font-medium rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300";

  const variants: Record<string, string> = {
    default:
      "bg-[var(--accent)] text-white hover:bg-[var(--primary)] hover:text-[var(--text)] focus:ring-[var(--primary)]",
    outline:
      "bg-[var(--background)] text-[var(--text)] border border-[var(--text)] hover:bg-[var(--primary)] hover:text-white focus:ring-[var(--primary)]",
    danger:
      "bg-[var(--background)] text-[var(--text)] border border-[var(--text)] hover:bg-red-600 hover:text-white focus:ring-red-500",
  };

  return (
    <Link to={to !== "" ? to : "/"}>
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </Link>
  );
};

export default Button;
