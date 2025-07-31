import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RecipeDetails from "../../pages/RecipeDetails";
import { vi } from "vitest";
import API from "../../service/axiosInterceptor";

vi.mock("../../service/axiosInterceptor");

const mockRecipe = {
  _id: "1",
  userId: "user123",
  title: "Mutton Curry",
  description: "Spicy and rich mutton dish.",
  preparationTime: 90,
  difficulty: "hard",
  averageRating: 4.7,
  numberOfRatings: 48,
  ingredients: ["mutton", "tomato", "potato", "masala"],
  steps: ["Cut mutton", "Make curry", "Mix all"],
  recipeImage: "https://example.com/mutton.jpg",
  createdAt: "2025-07-31T06:01:53.289Z",
  updatedAt: "2025-07-31T06:01:53.289Z",
};

const mockUser = {
  fname: "Narayan",
  lname: "Pradhan",
};

describe("RecipeDetails", () => {
  beforeEach(() => {
    (API.get as any)
      .mockResolvedValueOnce({ data: { recipe: mockRecipe } })
      .mockResolvedValueOnce({ data: { user: mockUser } });
  });

  it("renders recipe details correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/recipes/1"]}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetails />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Mutton Curry")).toBeInTheDocument(),
    );

    expect(screen.getByText("Spicy and rich mutton dish.")).toBeInTheDocument();
    expect(screen.getByText(/90 min/)).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
    expect(screen.getByText(/4.7 \/ 5/)).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();

    mockRecipe.ingredients.forEach((item) =>
      expect(screen.getByText(item)).toBeInTheDocument(),
    );

    mockRecipe.steps.forEach((step) =>
      expect(screen.getByText(step)).toBeInTheDocument(),
    );
  });

  it("shows loading when recipe is not yet fetched", () => {
    (API.get as any).mockResolvedValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/recipes/1"]}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetails />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
