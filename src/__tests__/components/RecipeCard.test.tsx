import { render, screen, waitFor } from "@testing-library/react";
import RecipeCard from "../../components/cards/RecipeCard";
import { BrowserRouter } from "react-router-dom";
import API from "../../service/axiosInterceptor";
import { vi } from "vitest";
import type { Recipe } from "../../pages/Dashboard";

vi.mock("../../service/axiosInterceptor");

const mockRecipe: Recipe = {
  _id: "123",
  userId: "user123",
  title: "Paneer Butter Masala",
  description: "Rich and creamy North Indian delight.",
  recipeImage: "https://example.com/food.jpg",
  preparationTime: 30,
  difficulty: "medium",
  ingredients: ["paneer", "tomato", "butter"],
  steps: ["Cut paneer", "Make curry", "Mix all"],
  averageRating: 4.5,
  numberOfRatings: 22,
  createdAt: "2025-07-31T06:01:53.289Z",
  updatedAt: "2025-07-31T06:01:53.289Z",
};

describe("RecipeCard Component", () => {
  it("renders recipe content and user name", async () => {
    (API.get as any).mockResolvedValueOnce({
      data: {
        user: {
          fname: "Narayan",
          lname: "Pradhan",
        },
      },
    });

    render(
      <BrowserRouter>
        <RecipeCard recipe={mockRecipe} />
      </BrowserRouter>
    );

    expect(screen.getByText("Paneer Butter Masala")).toBeInTheDocument();
    expect(
      screen.getByText("Rich and creamy North Indian delight.")
    ).toBeInTheDocument();

    const button = screen.getByRole("link", { name: /view full recipe/i });
    expect(button).toHaveAttribute("href", "/recipes/123");

    await waitFor(() => {
      expect(screen.getByText("Narayan Pradhan")).toBeInTheDocument();
    });

    expect(screen.getByText("July 31, 2025")).toBeInTheDocument();
  });

  it("shows 'Loading...' before user data is loaded", () => {
    (API.get as any).mockResolvedValueOnce(new Promise(() => {}));

    render(
      <BrowserRouter>
        <RecipeCard recipe={mockRecipe} />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
