import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RecipeSteps from "../../components/utils/RecipeStep";

describe("RecipeSteps component", () => {
  it("renders all the steps passed as props", () => {
    const mockSteps = [
      "Chop the vegetables.",
      "Heat oil in a pan.",
      "Add vegetables and stir fry.",
    ];

    render(<RecipeSteps steps={mockSteps} />);

    mockSteps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders nothing when no steps are provided", () => {
    render(<RecipeSteps steps={[]} />);
    expect(screen.queryByText(/step/i)).not.toBeInTheDocument();
  });
});
