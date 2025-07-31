import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "../../pages/Register";
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
        <Register />
      </BrowserRouter>
    </AuthContext.Provider>,
  );
};

test("submits register form and redirects on success", async () => {
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

  await userEvent.type(screen.getByPlaceholderText(/First Name/i), "Narayan");
  await userEvent.type(screen.getByPlaceholderText(/Last Name/i), "Pradhan");
  await userEvent.type(
    screen.getByPlaceholderText(/Email/i),
    "test@example.com",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/^Password$/i),
    "password123",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/Confirm Password/i),
    "password123",
  );
  await userEvent.type(screen.getByPlaceholderText(/Bio/i), "Hey I'm testing");
  await userEvent.type(
    screen.getByPlaceholderText(/Profile Image/i),
    "https://example.com/image.png",
  );

  await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(mockPost).toHaveBeenCalledWith("/auth/register", {
      fname: "Narayan",
      lname: "Pradhan",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      bio: "Hey I'm testing",
      profileImage: "https://example.com/image.png",
    });

    expect(mockLogin).toHaveBeenCalledWith(mockUser, "fake-token");
    expect(window.location.href).toBe("/dashboard");
  });
});
