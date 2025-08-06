import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../../pages/Register";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter } from "react-router-dom";
import API from "../../service/axiosInterceptor";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

vi.mock("../../service/axiosInterceptor");

const mockedPost = API.post as unknown as ReturnType<typeof vi.fn>;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithAuth = () => {
  const login = vi.fn();

  render(
    <HelmetProvider>
      <AuthContext.Provider
        value={{ currentUser: null, accessToken: "", login, logout: vi.fn() }}
      >
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    </HelmetProvider>,
  );

  return { login };
};

describe("Register component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form fields", () => {
    renderWithAuth();

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Bio (optional)")).toBeInTheDocument();
  });

  it("submits form when all fields are valid", async () => {
    const mockLogin = vi.fn();

    mockedPost.mockResolvedValueOnce({
      data: {
        user: {
          _id: "1",
          fname: "Test",
          lname: "User",
          email: "test@example.com",
        },
        accessToken: "mock-token",
      },
    });

    render(
      <HelmetProvider>
        <AuthContext.Provider
          value={{
            currentUser: null,
            accessToken: "",
            login: mockLogin,
            logout: vi.fn(),
          }}
        >
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </AuthContext.Provider>
      </HelmetProvider>,
    );

    fireEvent.input(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    fireEvent.input(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User" },
    });
    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "Test1234@" },
    });
    fireEvent.input(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Test1234@" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard?page=1",
        expect.any(Object),
      );
    });
  });
});
