import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/Login";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { ToastProvider } from "../../components/ui";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    post: vi.fn(),
  },
}));
import API from "../../service/axiosInterceptor";

const renderWithContext = (login = vi.fn()) => {
  return render(
    <AuthContext.Provider
      value={{
        currentUser: null,
        accessToken: null,
        login,
        logout: vi.fn(),
      }}
    >
      <ToastProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </ToastProvider>
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

    // ✅ updated assertion for mocked navigation
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard?page=1", {
      state: {
        toast: {
          message: "Login successful!",
          variant: "success",
          animation: "pop",
          mode: "dark",
        },
      },
    });
  });
});
