import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../service/axiosInterceptor";
import CommentCard from "../cards/CommentCard";
import { useAuth } from "../../hooks/useAuth";

interface Comment {
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

interface CommentSectionProps {
  recipeId: string;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [hasCommented, setHasCommented] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await API.get(`/comments/${recipeId}`);
        const commentData = await Promise.all(
          res.data.comments.map(async (comment: Comment) => {
            const userRes = await API.get(`/users/${comment.userId}`);
            return {
              ...comment,
              user: userRes.data.user,
            };
          }),
        );
        setComments(commentData);

        if (currentUser) {
          const alreadyCommented = commentData.some(
            (c) => c.userId === currentUser._id && c.parentCommentId === null,
          );
          setHasCommented(alreadyCommented);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    fetchComments();
  }, [recipeId, currentUser]);

  const handleSubmit = async () => {
    try {
      await API.post("/comments", {
        recipeId,
        comment: commentText,
      });
      setCommentText("");
      setHasCommented(true);

      const res = await API.get(`/comments/${id}`);
      const commentData = await Promise.all(
        res.data.comments.map(async (comment: Comment) => {
          const userRes = await API.get(`/users/${comment.userId}`);
          return {
            ...comment,
            user: userRes.data.user,
          };
        }),
      );
      setComments(commentData);
    } catch (err) {
      console.error("Error submitting comment", err);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
        Comments
      </h2>

      {currentUser ? (
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
              onClick={handleSubmit}
              disabled={hasCommented || !commentText.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">
          Please{" "}
          <Link to={"/login"} className="text-[var(--primary)] hover:underline">
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
          comments.map((c) => (
            <CommentCard
              key={c._id}
              recipeId={recipeId}
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
  );
}
