import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Unauthenticated from "../../pages/Unauthenticated";
describe("Unauthenticated", () => {
  it("renders the unauthorized heading", () => {
    render(<Unauthenticated />);
    expect(
      screen.getByRole("heading", { name: /unauthorized access/i }),
    ).toBeInTheDocument();
  });

  it("renders the message prompting login", () => {
    render(<Unauthenticated />);
    expect(
      screen.getByText(/you must be logged in to view this page/i),
    ).toBeInTheDocument();
  });

  it("applies expected container styles", () => {
    render(<Unauthenticated />);
    const container = screen.getByText(/unauthorized access/i).parentElement;
    expect(container?.className).toMatch(/flex/);
    expect(container?.className).toMatch(/items-center/);
    expect(container?.className).toMatch(/h-\[80vh\]/);
  });
});
