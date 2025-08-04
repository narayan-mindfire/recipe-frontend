import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import API from "../service/axiosInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import type { Recipe } from "./Dashboard";
import foodImage from "../assets/food3.png";
import CommentCard from "../components/cards/CommentCard";

import {
  faClock,
  faSignal,
  faStar,
  faThumbsUp,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as blankStar } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/toast/use-toast";

const serverUrl = import.meta.env.VITE_SERVER_URL;

interface UserData {
  fname: string;
  lname: string;
}

export interface Comment {
  comment: string;
  createdAt: string;
  hasChildren: boolean;
  parentCommentId: string | null;
  recipeId: string;
  updatedAt: string;
  userId: string;
  _id: string;
  user: {
    fname: string;
    lname: string;
  };
}

/**
 * RecipeDetails Component
 * Renders full information of a selected recipe.
 */
export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [hasCommented, setHasCommented] = useState(false);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const toast = useToast();
  const hasShownToast = useRef(false);
  const location = useLocation();

  /**
   * Shows toast message only once when redirected from another page.
   */
  useEffect(() => {
    if (location.state?.toast && !hasShownToast.current) {
      toast.addToast(location.state.toast);
      hasShownToast.current = true;
    }
  }, [location.state, toast]);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await API.get(`/recipes/${id}`);
        setRecipe(res.data.recipe);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          const status = (err as { response: { status: number } }).response
            .status;
          if (status === 404) {
            setMyRating(null);
            setRatingId(null);
          } else {
            console.error("Failed to fetch my rating", err);
          }
        } else {
          console.error("Unexpected error", err);
        }
      }
    }
    fetchRecipe();
  }, [id]);

  /**
   * Fetch user of this recipe
   */
  useEffect(() => {
    async function fetchUser() {
      if (recipe?.userId) {
        try {
          const res = await API.get(`/users/${recipe.userId}`);
          setUser(res.data.user);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    }
    fetchUser();
  }, [recipe]);

  /**
   * Fetch comments for this recipe, and determine if current user has already commented.
   */
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await API.get(`/comments/${id}`);
        const commentData = await Promise.all(
          res.data.comments.map(async (comment: Comment) => {
            const userRes = await API.get(`/users/${comment.userId}`);
            return {
              ...comment,
              user: userRes.data.user,
            };
          })
        );
        setComments(commentData);

        if (currentUser) {
          const alreadyCommented = commentData.some(
            (c) => c.userId === currentUser._id && c.parentCommentId === null
          );
          setHasCommented(alreadyCommented);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    fetchComments();
  }, [id, currentUser]);

  useEffect(() => {
    async function fetchMyRating() {
      try {
        const res = await API.get(`/ratings/${id}`);
        setMyRating(res.data.myRating.rating);
        setRatingId(res.data.myRating._id);
      } catch (err: unknown) {
        if (typeof err === "object") {
          setMyRating(null);
          setRatingId(null);
        } else {
          console.error("Failed to fetch my rating", err);
        }
      }
    }
    if (currentUser) {
      fetchMyRating();
    }
  }, [currentUser, id]);

  /**
   * Handles the user's rating action for a recipe.
   *
   * - If a user is authenticated and has not rated the recipe, it creates a new rating.
   * - If the user is in edit mode and has an existing rating, it updates the rating.
   * - Prevents actions if no user is logged in, if the recipe ID is missing,
   *   or if the user already rated and is not in edit mode.
   *
   * @param {number} star - The rating value selected by the user (typically 1–5).
   * @returns {Promise<void>} - A promise that resolves after rating is handled.
   */
  const handleRatingClick = async (star: number) => {
    if (!currentUser || !id || (myRating && !editMode)) return;
    try {
      if (myRating && editMode) {
        await API.put(`/ratings/${ratingId}`, { rating: star });
      } else {
        const res = await API.post("/ratings", {
          recipeId: id,
          rating: star,
        });
        setRatingId(res.data.rating._id);
      }
      setMyRating(star);
      setEditMode(false);
      toast.addToast({
        message: "rating added successfully",
        variant: "info",
        animation: "pop",
        mode: "dark",
        icon: undefined,
      });
    } catch (err) {
      console.error("Rating failed", err);
    }
  };

  if (!recipe)
    return <div className="text-center p-10 text-xl">Loading...</div>;

  /**
   * formats the date into user friendly format
   */
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 sm:p-12 bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-5xl mx-auto gap-8">
        <div>
          <img
            src={
              recipe.recipeImage
                ? `${serverUrl}/uploads/${recipe.recipeImage}`
                : foodImage
            }
            alt={recipe.title}
            className="rounded-xl w-full h-[300px] sm:h-[400px] object-contain shadow-lg"
          />
          <h1 className="mt-6 text-3xl font-bold text-[var(--primary)]">
            {recipe.title}
          </h1>
          <p className="text-base leading-relaxed text-[var(--text)]">
            {recipe.description}
          </p>
          <p className="text-sm text-[var(--muted)] mt-6">{formattedDate}</p>

          <div className="mt-4 flex items-center gap-3 mb-3 ">
            <FontAwesomeIcon
              icon={faUserCircle}
              size="2x"
              className="text-[var(--accent)]"
            />
            <span className="font-semibold text-[var(--accent)]">
              {user ? `${user.fname} ${user.lname}` : "Loading..."}
            </span>
          </div>
        </div>

        <div className="bg-[var(--background2)] p-6 rounded-xl shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl shadow-sm">
              <FontAwesomeIcon
                icon={faClock}
                className="text-[var(--accent)] text-xl"
              />
              <div>
                <p className="text-[var(--muted)] text-xs font-medium">
                  Prep Time
                </p>
                <p className="text-[var(--text)] font-semibold text-base">
                  {recipe.preparationTime} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl shadow-sm">
              <FontAwesomeIcon
                icon={faSignal}
                className="text-[var(--accent)] text-xl"
              />
              <div>
                <p className="text-[var(--muted)] text-xs font-medium">
                  Difficulty
                </p>
                <p className="capitalize font-semibold text-[var(--text)] text-base">
                  {recipe.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl shadow-sm">
              <FontAwesomeIcon
                icon={faStar}
                className="text-[var(--accent)] text-xl"
              />
              <div>
                <p className="text-[var(--muted)] text-xs font-medium">
                  Avg Rating
                </p>
                <p className="font-semibold text-[var(--text)] text-base">
                  {recipe.averageRating.toFixed(1)} / 5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl shadow-sm">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className="text-[var(--accent)] text-xl"
              />
              <div>
                <p className="text-[var(--muted)] text-xs font-medium">
                  Ratings
                </p>
                <p className="font-semibold text-[var(--text)] text-base">
                  {recipe.numberOfRatings}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-[var(--primary)] flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-[var(--accent)]"
              />
              <span className="text-[var(--accent)]">Ingredients</span> Required
            </h2>
            <ul className="list-disc pl-5 text-sm space-y-1 ">
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-[var(--primary)] flex items-center gap-2">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-[var(--accent)]"
              />
              Cooking
              <span className="text-[var(--accent)]">instructions</span>
            </h2>

            <div className="flex flex-col gap-4">
              {recipe.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-[var(--background)] p-4 rounded-xl shadow-sm border-l-4 border-[var(--accent)]"
                >
                  <div className="text-xl font-bold text-[var(--accent)]">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </div>
                  <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-4 ">
            <h2 className="text-lg font-bold mb-2 text-[var(--primary)]">
              {currentUser ? (
                myRating ? (
                  "Your Rating"
                ) : (
                  "Rate this recipe"
                )
              ) : (
                <p className="text-black">
                  Please{" "}
                  <Link
                    to={"/login"}
                    className="text-[var(--primary)] hover:underline"
                  >
                    login
                  </Link>{" "}
                  to rate this recipe
                </p>
              )}
            </h2>

            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={
                    (hoveredStar ?? myRating ?? 0) >= star ? faStar : blankStar
                  }
                  className="text-yellow-400 text-2xl cursor-pointer"
                  onMouseEnter={() =>
                    (!myRating || editMode) ?? setHoveredStar(star)
                  }
                  onMouseLeave={() =>
                    (!myRating || editMode) ?? setHoveredStar(null)
                  }
                  onClick={() => handleRatingClick(star)}
                />
              ))}
              {myRating && !editMode && (
                <button
                  className="ml-4 px-3 py-1 rounded-md bg-[var(--accent)] text-white text-sm"
                  onClick={() => setEditMode(true)}
                >
                  Edit Rating
                </button>
              )}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
              Comments
            </h2>

            {currentUser && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">
                  {hasCommented
                    ? "You’ve already commented on this recipe."
                    : "Leave a Comment"}
                </h3>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <textarea
                    className="w-full p-3 rounded-md border border-gray-300 text-sm text-[var(--text)] bg-[var(--background)] resize-none"
                    rows={3}
                    placeholder="Write your comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={hasCommented}
                  />
                  <button
                    className="bg-[var(--accent)] text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      try {
                        await API.post("/comments", {
                          recipeId: recipe._id,
                          comment: commentText,
                        });
                        setCommentText("");
                        setHasCommented(true);
                        const res = await API.get(`/comments/${id}`);
                        const commentData = await Promise.all(
                          res.data.comments.map(async (comment: Comment) => {
                            const userRes = await API.get(
                              `/users/${comment.userId}`
                            );
                            return {
                              ...comment,
                              user: userRes.data.user,
                            };
                          })
                        );
                        setComments(commentData);
                      } catch (err) {
                        console.error("Error submitting comment", err);
                      }
                    }}
                    disabled={hasCommented || !commentText.trim()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {!currentUser && (
              <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">
                Please{" "}
                <Link
                  to={"/login"}
                  className="text-[var(--primary)] hover:underline"
                >
                  login
                </Link>{" "}
                to comment on this recipe
              </h3>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-[var(--muted)]">
                  No comments yet. Be the first one to comment!
                </p>
              ) : (
                comments.map((c, _i) => (
                  <CommentCard
                    recipeId={recipe._id}
                    key={c._id}
                    commentId={c._id}
                    comment={c.comment}
                    commentUser={c.user}
                    createdAt={c.createdAt}
                    hasChildren={c.hasChildren}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
