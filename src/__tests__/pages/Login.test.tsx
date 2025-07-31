import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/Login";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    post: vi.fn(),
  },
}));
import API from "../../service/axiosInterceptor";

vi.spyOn(window, "alert").mockImplementation(() => {});
Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

const renderWithContext = (login = vi.fn()) => {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        accessToken: null,
        login,
        logout: vi.fn(),
      }}
    >
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>,
  );
};

test("submits login form and redirects on success", async () => {
  const mockLogin = vi.fn();
  const mockUser = {
    _id: "123",
    fname: "Narayan",
    lname: "Pradhan",
    email: "test@example.com",
  };

  const mockPost = API.post as unknown as ReturnType<typeof vi.fn>;
  mockPost.mockResolvedValueOnce({
    data: {
      user: mockUser,
      accessToken: "fake-token",
    },
  });

  renderWithContext(mockLogin);

  await userEvent.type(
    screen.getByPlaceholderText(/email/i),
    "test@example.com",
  );
  await userEvent.type(screen.getByPlaceholderText(/password/i), "pass123");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(mockPost).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "pass123",
    });

    expect(mockLogin).toHaveBeenCalledWith(mockUser, "fake-token");
    expect(window.alert).toHaveBeenCalledWith(
      "Login successful. Redirecting to dashboard...",
    );
    expect(window.location.href).toBe("/");
  });
});
