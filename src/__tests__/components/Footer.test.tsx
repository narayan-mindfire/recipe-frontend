import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../components/utils/Footer";
describe("Footer", () => {
  it("renders the footer with correct text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 Eatos\. Built with love\./i),
    ).toBeInTheDocument();
  });

  it("renders the footer element", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("applies expected CSS classes", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).toMatch(/bg-\[var\(--background\)\]/);
    expect(footer.className).toMatch(/text-\[var\(--muted\)\]/);
  });
});
