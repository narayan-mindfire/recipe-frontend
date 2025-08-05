import { render, screen, waitFor } from "@testing-library/react";
import CommentSection from "../../components/utils/CommentSection";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter } from "react-router-dom";
import API from "../../service/axiosInterceptor";
import { vi } from "vitest";

const mockUser = {
  _id: "user123",
  fname: "John",
  lname: "Doe",
  email: "john@example.com",
  profileImage: "profile.jpg",
};

const mockAuthContextValue = {
  currentUser: mockUser,
  accessToken: "mock-token",
  login: vi.fn(),
  logout: vi.fn(),
};

const mockComments = [
  {
    _id: "c1",
    comment: "Nice recipe!",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    parentCommentId: null,
    hasChildren: false,
    userId: "user123",
    recipeId: "r1",
    user: {
      fname: "John",
      lname: "Doe",
    },
  },
];

describe("CommentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'No comments yet' if no comments", async () => {
    vi.spyOn(API, "get").mockResolvedValueOnce({ data: { comments: [] } });

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <BrowserRouter>
          <CommentSection recipeId="r123" />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    await waitFor(() =>
      expect(screen.getByText(/No comments yet/i)).toBeInTheDocument(),
    );
  });

  it("displays a comment if present", async () => {
    vi.spyOn(API, "get")
      .mockResolvedValueOnce({ data: { comments: mockComments } })
      .mockResolvedValueOnce({ data: { user: mockUser } });

    render(
      <AuthContext.Provider
        value={{
          currentUser: mockUser,
          accessToken: "mockToken",
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <BrowserRouter>
          <CommentSection recipeId="r1" />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Nice recipe/i)).toBeInTheDocument(),
    );
  });
});
