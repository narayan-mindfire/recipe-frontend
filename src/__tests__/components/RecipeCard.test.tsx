import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RecipeCard from "../../components/cards/RecipeCard";
import type { Recipe } from "../../pages/Dashboard";

vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          user: {
            fname: "Narayan",
            lname: "Pradhan",
            profileImage: "profile.jpg",
          },
        },
      }),
    ),
  },
}));

const sampleRecipe: Recipe = {
  _id: "1",
  userId: "user1",
  title: "Test Recipe",
  description: "This is a test recipe description.",
  recipeImage: "",
  preparationTime: 30,
  difficulty: "easy",
  ingredients: ["1 cup flour", "2 eggs", "1 tsp salt"],
  steps: ["Mix ingredients", "Bake for 30 minutes", "Cool before serving"],
  averageRating: 4.5,
  numberOfRatings: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const renderRecipeCard = () => {
  return render(
    <BrowserRouter>
      <RecipeCard recipe={sampleRecipe} />
    </BrowserRouter>,
  );
};

describe("RecipeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recipe title and description", async () => {
    renderRecipeCard();
    expect(await screen.findByText("Test Recipe")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test recipe description.", { exact: false }),
    ).toBeInTheDocument();
  });

  it("displays user info after fetching", async () => {
    renderRecipeCard();
    await waitFor(() => {
      expect(screen.getByText("Narayan Pradhan")).toBeInTheDocument();
    });
  });

  it("renders rating stars and count", async () => {
    renderRecipeCard();
    const ratingSection = await screen.findByLabelText("rating");
    expect(ratingSection).toBeInTheDocument();
    expect(screen.getByText("(10)")).toBeInTheDocument();
  });

  it("renders view full recipe button with correct link", async () => {
    renderRecipeCard();
    const button = await screen.findByRole("link", {
      name: /view full recipe/i,
    });
    expect(button).toHaveAttribute("href", "/recipes/1");
  });
});
