import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { ProtectedRoute } from "../../routes/ProtectedRoute";
import { AuthContext } from "../../context/authContext";

const mockUser = {
  _id: "1",
  fname: "Narayan",
  lname: "Pradhan",
  email: "narayan@example.com",
  profileImage: "profile.png",
};

describe("ProtectedRoute", () => {
  it("renders children when user is authenticated", () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: mockUser,
          accessToken: "fake-token",
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
