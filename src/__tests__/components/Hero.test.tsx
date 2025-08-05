import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../../components/utils/Hero";
import { BrowserRouter } from "react-router-dom";

describe("HeroSection", () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>,
    );

  it("renders the description", () => {
    renderComponent();
    expect(
      screen.getByText(/A community-driven platform to explore/i),
    ).toBeInTheDocument();
  });

  it("renders the Get Started button", () => {
    renderComponent();
    const button = screen.getByRole("link", { name: /Get Started/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/dashboard");
  });

  it("renders the food image", () => {
    renderComponent();
    const image = screen.getByAltText("Food");
    expect(image).toBeInTheDocument();
  });
});
