import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CommentCard from "../../components/cards/CommentCard";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../service/axiosInterceptor", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          commentChildren: [],
        },
      }),
    ),
    post: vi.fn(() => Promise.resolve()),
  },
}));

const mockUser = {
  _id: "1",
  fname: "Narayan",
  lname: "Pradhan",
  email: "narayan@example.com",
  profileImage: "",
};

const renderWithAuth = () =>
  render(
    <AuthContext.Provider
      value={{
        currentUser: mockUser,
        accessToken: "fake-token",
        login: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <BrowserRouter>
        <CommentCard
          comment="This is a test comment"
          recipeId="123"
          commentUser={{ fname: "Test", lname: "User" }}
          createdAt={new Date().toISOString()}
          commentId="c1"
          hasChildren={true}
        />
      </BrowserRouter>
    </AuthContext.Provider>,
  );

describe("CommentCard", () => {
  it("renders comment with user info and reply button", () => {
    renderWithAuth();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText(/reply/i)).toBeInTheDocument();
  });

  it("shows reply input when reply button is clicked", async () => {
    renderWithAuth();
    await userEvent.click(screen.getByText(/reply/i));
    expect(
      screen.getByPlaceholderText(/write your reply/i),
    ).toBeInTheDocument();
  });

  it("loads replies on 'Show Replies' click", async () => {
    renderWithAuth();
    await userEvent.click(screen.getByText(/show replies/i));
    expect(screen.getByText(/hide replies/i)).toBeInTheDocument();
  });
});
