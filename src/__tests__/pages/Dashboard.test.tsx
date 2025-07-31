import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import Dashboard from "../../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";
import API from "../../service/axiosInterceptor";
import "@testing-library/jest-dom";

vi.mock("../../components/cards/RecipeCard", () => ({
  default: ({ recipe }: any) => (
    <div data-testid="recipe-card">{recipe.title}</div>
  ),
}));

vi.mock("../../service/axiosInterceptor");

describe("Dashboard Page", () => {
  it("fetches and displays recipes", async () => {
    const mockRecipes = [
      {
        _id: "1",
        userId: "user1",
        title: "Mutton Curry",
        description: "Spicy mutton curry",
        recipeImage: "https://example.com/mc.jpg",
        preparationTime: 90,
        difficulty: "hard",
        ingredients: ["mutton", "tomato", "potato"],
        steps: ["Step 1", "Step 2"],
        averageRating: 4.5,
        numberOfRatings: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "2",
        userId: "user2",
        title: "Paneer Butter Masala",
        description: "Creamy Indian paneer dish",
        recipeImage: "https://example.com/pbm.jpg",
        preparationTime: 45,
        difficulty: "medium",
        ingredients: ["paneer", "tomato", "butter"],
        steps: ["Step 1", "Step 2"],
        averageRating: 4.8,
        numberOfRatings: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (API.get as any).mockResolvedValueOnce({
      data: { success: true, recipes: mockRecipes },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("recipe-card").length).toBe(2);
    });

    expect(screen.getByText("Mutton Curry")).toBeInTheDocument();
    expect(screen.getByText("Paneer Butter Masala")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    (API.get as any).mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId("recipe-card")).not.toBeInTheDocument();
    });
  });
});
