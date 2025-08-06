import { render, screen } from "@testing-library/react";
import RecipeStats from "../../components/utils/RecipeStats";

describe("RecipeStats", () => {
  const props = {
    preparationTime: 25,
    difficulty: "medium",
    averageRating: 4.3,
    numberOfRatings: 12,
  };

  it("renders all recipe stat labels", () => {
    render(<RecipeStats {...props} />);
    expect(screen.getByText(/Prep Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Rating/i)).toBeInTheDocument();
    expect(screen.getByText(/Ratings/i)).toBeInTheDocument();
  });

  it("displays correct values for each stat", () => {
    render(<RecipeStats {...props} />);
    expect(screen.getByText("25 min")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("4.3 / 5")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
