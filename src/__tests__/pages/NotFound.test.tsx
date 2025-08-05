import { render, screen } from "@testing-library/react";
import NotFound from "../../pages/NotFound";

describe("NotFound", () => {
  it("renders 404 page content correctly", () => {
    render(<NotFound />);

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();

    expect(
      screen.getByText("Sorry, the page you’re looking for doesn’t exist."),
    ).toBeInTheDocument();
  });
});
