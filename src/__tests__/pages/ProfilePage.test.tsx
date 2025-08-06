import { render, screen, waitFor } from "@testing-library/react";
import Profile from "../../pages/Profile";
import API from "../../service/axiosInterceptor";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ToastProvider } from "../../components/ui";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
vi.mock("../../service/axiosInterceptor", async () => {
  const actual = await vi.importActual("../../service/axiosInterceptor");
  return {
    ...actual,
    default: {
      get: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const mockUser = {
  fname: "Narayan",
  lname: "Pradhan",
  email: "narayan@example.com",
  profileImage: "",
  bio: "Full-stack enthusiast",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockRecipes = [
  {
    _id: "1",
    userId: "123",
    title: "Mock Recipe",
    description: "A tasty test recipe",
    preparationTime: 30,
    difficulty: "easy",
    ingredients: ["eggs", "bread"],
    steps: ["step 1", "step 2"],
    averageRating: 4.5,
    numberOfRatings: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    recipeImage: "",
  },
];

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user data and recipes after loading", async () => {
    // mock API.get calls
    (API.get as any)
      .mockResolvedValueOnce({ data: mockUser }) // /auth/me
      .mockResolvedValueOnce({ data: { myRecipies: mockRecipes } }); // /recipes/me

    render(
      <HelmetProvider>
        <ToastProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </ToastProvider>
      </HelmetProvider>,
    );

    // Initially shows loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for profile data
    await waitFor(() => {
      expect(screen.getByText(/Narayan Pradhan/)).toBeInTheDocument();
      expect(screen.getByText(/Mock Recipe/)).toBeInTheDocument();
    });
  });

  it("renders fallback when no recipes exist", async () => {
    (API.get as any)
      .mockResolvedValueOnce({ data: mockUser })
      .mockResolvedValueOnce({ data: { myRecipies: [] } });
    render(
      <HelmetProvider>
        <ToastProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </ToastProvider>
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You still haven't authored a recipe/),
      ).toBeInTheDocument();
    });
  });
});
