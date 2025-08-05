import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "../../components/utils/ConfirmModal";

describe("ConfirmModal", () => {
  const message = "Are you sure you want to delete this?";
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    render(
      <ConfirmModal
        message={message}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
  });

  it("renders the message", () => {
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("calls onCancel when 'Cancel' button is clicked", () => {
    fireEvent.click(screen.getByText(/cancel/i));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when 'Yes, Delete' button is clicked", () => {
    fireEvent.click(screen.getByText(/yes, delete/i));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
