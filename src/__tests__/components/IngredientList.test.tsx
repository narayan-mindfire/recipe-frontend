import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IngredientsList from "../../components/utils/IngredientList";

describe("IngredientsList", () => {
  it("renders a list of ingredients", () => {
    const ingredients = ["Flour", "Sugar", "Eggs"];
    render(<IngredientsList ingredients={ingredients} />);

    ingredients.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    expect(screen.getAllByRole("listitem")).toHaveLength(ingredients.length);
  });

  it("renders nothing when ingredient list is empty", () => {
    render(<IngredientsList ingredients={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("handles special characters in ingredients", () => {
    const ingredients = ["Café au lait", "Crème brûlée", "Piñata"];
    render(<IngredientsList ingredients={ingredients} />);
    ingredients.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
