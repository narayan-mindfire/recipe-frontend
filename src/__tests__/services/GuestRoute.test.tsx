import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { GuestRoute } from "../../routes/GuestRoute";
import { AuthContext } from "../../context/authContext";

const mockUser = {
  _id: "1",
  fname: "Narayan",
  lname: "Pradhan",
  email: "narayan@example.com",
  profileImage: "profile.png",
};

describe("GuestRoute", () => {
  it("renders children when user is not authenticated", () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: null,
          accessToken: null,
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <BrowserRouter>
          <GuestRoute>
            <div>Guest Page</div>
          </GuestRoute>
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Guest Page")).toBeInTheDocument();
  });

  it("redirects to /dashboard when user is authenticated", () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: mockUser,
          accessToken: "fake-token",
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <div>Guest Page</div>
                </GuestRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });
});
