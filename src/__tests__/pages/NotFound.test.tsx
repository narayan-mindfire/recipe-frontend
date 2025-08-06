import { render, screen } from "@testing-library/react";
import NotFound from "../../pages/NotFound";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

describe("NotFound", () => {
  it("renders 404 page content correctly", () => {
    render(
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>,
    );

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();

    expect(
      screen.getByText("Sorry, the page you’re looking for doesn’t exist."),
    ).toBeInTheDocument();
  });
});
