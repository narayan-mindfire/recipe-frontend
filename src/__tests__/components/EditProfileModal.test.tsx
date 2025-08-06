import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfileModal from "../../components/utils/EditProfileModal";
import { vi } from "vitest";
import { ToastProvider } from "../../components/ui";
vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe("EditProfileModal", () => {
  const mockClose = vi.fn();
  const mockSuccess = vi.fn();
  const defaultValues = {
    fname: "John",
    lname: "Doe",
    email: "john@example.com",
    bio: "Food lover",
    profileImage: undefined,
  };

  const renderWithToast = (ui: React.ReactElement) =>
    render(<ToastProvider>{ui}</ToastProvider>);

  it("renders input fields with default values", () => {
    renderWithToast(
      <EditProfileModal
        defaultValues={defaultValues}
        onClose={mockClose}
        onSuccess={mockSuccess}
      />,
    );

    expect(screen.getByPlaceholderText("First Name")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Email")).toHaveValue(
      "john@example.com",
    );
    expect(screen.getByPlaceholderText("Bio")).toHaveValue("Food lover");
  });

  it("shows validation error when required fields are empty", async () => {
    renderWithToast(
      <EditProfileModal
        defaultValues={{
          ...defaultValues,
          fname: "",
          lname: "",
          email: "",
        }}
        onClose={mockClose}
        onSuccess={mockSuccess}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name/i)).toBeInTheDocument();
      expect(screen.getByText(/last name/i)).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });
  });

  it("calls onSuccess and onClose on successful submit", async () => {
    renderWithToast(
      <EditProfileModal
        defaultValues={defaultValues}
        onClose={mockClose}
        onSuccess={mockSuccess}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
