import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthProvider";
import { AuthContext } from "../../context/authContext";
import API from "../../service/axiosInterceptor";

vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("provides login and logout functionality", async () => {
    const TestComponent = () => {
      const context = React.useContext(AuthContext);

      if (!context) {
        return <div>Context not found</div>;
      }

      const { currentUser, accessToken, login, logout } = context;

      return (
        <div>
          <p>Current: {currentUser?.fname || "Guest"}</p>
          <p>Token: {accessToken || "None"}</p>
          <button
            onClick={() =>
              login(
                {
                  _id: "1",
                  fname: "Narayan",
                  lname: "Pradhan",
                  email: "test@example.com",
                  profileImage: "a@b.com",
                },
                "test-token",
              )
            }
          >
            Login
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText(/Guest/)).toBeInTheDocument();
    expect(screen.getByText(/None/)).toBeInTheDocument();

    screen.getByText("Login").click();
    expect(await screen.findByText(/Narayan/)).toBeInTheDocument();
    expect(await screen.findByText(/test-token/)).toBeInTheDocument();

    screen.getByText("Logout").click();
    expect(await screen.findByText(/Guest/)).toBeInTheDocument();
    expect(await screen.findByText(/None/)).toBeInTheDocument();

    expect(API.post).toHaveBeenCalledWith("auth/logout");
  });
});
