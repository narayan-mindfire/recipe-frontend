import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditRecipeModal from "../../components/utils/EditRecipeModal";
import { ToastProvider } from "../../components/ui";
import { vi } from "vitest";
import type { Recipe } from "../../pages/Dashboard";

vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    put: vi.fn().mockResolvedValue({
      data: {
        recipe: {
          _id: "r1",
          title: "Updated",
          description: "Updated desc",
        },
      },
    }),
  },
}));

const mockOnClose = vi.fn();
const mockOnUpdateSuccess = vi.fn();

const mockRecipe = {
  _id: "r1",
  title: "Pasta",
  description: "Delicious pasta",
  preparationTime: 30,
  difficulty: "easy",
  ingredients: ["noodles", "sauce"],
  steps: ["Boil water", "Cook noodles"],
  averageRating: 4.5,
  numberOfRatings: 10,
  createdAt: "",
  updatedAt: "",
  userId: "u1",
  recipeImage: "",
} satisfies Recipe;

const renderComponent = () =>
  render(
    <ToastProvider>
      <EditRecipeModal
        recipe={mockRecipe}
        onClose={mockOnClose}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    </ToastProvider>,
  );

describe("EditRecipeModal", () => {
  it("renders with default values", () => {
    renderComponent();
    expect(screen.getByDisplayValue("Pasta")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Delicious pasta")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("noodles, sauce")).toBeInTheDocument();
  });

  it("submits the form and calls onUpdateSuccess", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /update recipe/i }));

    await waitFor(() => {
      expect(mockOnUpdateSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when Cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
