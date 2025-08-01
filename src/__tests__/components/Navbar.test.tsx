import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../components/utils/Navbar";

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

vi.mock("../../hooks/useTheme", () => ({
  useTheme: () => ({
    darkMode: false,
    toggleTheme: vi.fn(),
  }),
}));

const renderWithAuth = (currentUser: User | null = null) => {
  const login = vi.fn();
  const logout = vi.fn();

  render(
    <AuthContext.Provider
      value={{ currentUser, accessToken: "fake-token", login, logout }}
    >
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>,
  );

  return { login, logout };
};

describe("Navbar component", () => {
  it("renders login and sign up links when user is not authenticated", () => {
    renderWithAuth(null);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("renders user info and logout when user is authenticated", () => {
    const mockUser = {
      _id: "1",
      fname: "Narayan",
      lname: "Pradhan",
      email: "narayan@pradhan.com",
    };

    renderWithAuth(mockUser);

    expect(screen.getByText("Narayan")).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it("calls logout and redirects on logout click", async () => {
    const mockUser = {
      _id: "1",
      fname: "Narayan",
      lname: "Pradhan",
      email: "narayan@pradhan.com",
    };

    const logout = vi.fn();
    const originalHref = window.location.href;
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    render(
      <AuthContext.Provider
        value={{
          currentUser: mockUser,
          accessToken: "fake-token",
          login: vi.fn(),
          logout,
        }}
      >
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    await userEvent.click(screen.getByText(/logout/i));

    expect(logout).toHaveBeenCalled();
    expect(window.location.href).toBe("/");
    window.location.href = originalHref;
  });
});
