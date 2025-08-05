import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { ToastProvider } from "../../components/ui";
vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          recipes: [
            {
              _id: "1",
              userId: "user1",
              title: "Test Recipe",
              description: "Yummy and easy",
              recipeImage: "",
              preparationTime: 20,
              difficulty: "easy",
              ingredients: ["Salt", "Water"],
              steps: ["Boil water", "Add salt"],
              averageRating: 4.2,
              numberOfRatings: 5,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      }),
    ),
  },
}));

const renderWithProviders = (currentUser = null) => {
  return render(
    <AuthContext.Provider
      value={{
        currentUser,
        accessToken: "token",
        login: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <ToastProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </ToastProvider>
    </AuthContext.Provider>,
  );
};

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'Loading...' initially", async () => {
    renderWithProviders();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    await waitFor(() => screen.getByText(/test recipe/i));
  });

  it("renders fetched recipes", async () => {
    renderWithProviders();
    expect(await screen.findByText(/test recipe/i)).toBeInTheDocument();
    expect(screen.getByText(/yummy and easy/i)).toBeInTheDocument();
  });
});
