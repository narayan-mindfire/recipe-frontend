import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faReply,
  faChevronDown,
  faChevronUp,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import API from "../../service/axiosInterceptor";
interface CommentCardProps {
  comment: string;
  recipeId: string;
  commentUser: {
    fname: string;
    lname: string;
  };
  createdAt: string;
  commentId: string;
  hasChildren: boolean;
}

interface Reply {
  userId: string;
  _id: string;
  comment: string;
  createdAt: string;
  user: {
    fname: string;
    lname: string;
  };
  hasChildren: boolean;
}

export default function CommentCard({
  comment,
  recipeId,
  commentUser,
  createdAt,
  commentId,
  hasChildren,
}: CommentCardProps) {
  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const { currentUser } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);

  const handleFetchReplies = async () => {
    try {
      const res = await API.get(`/comments/${commentId}/replies`);
      const populatedReplies = await Promise.all(
        res.data.commentChildren.map(async (reply: Reply) => {
          const userRes = await API.get(`/users/${reply.userId}`);
          return {
            ...reply,
            user: userRes.data.user,
          };
        }),
      );
      setReplies(populatedReplies);
    } catch (err) {
      console.error("Failed to load replies", err);
    }
  };

  const handleReplySubmit = async () => {
    try {
      await API.post("/comments", {
        recipeId: recipeId,
        parentCommentId: commentId,
        comment: replyText,
      });
      setReplyText("");
      setShowReplyInput(false);
      handleFetchReplies();
      setShowReplies(true);
    } catch (err) {
      console.error("Failed to submit reply", err);
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      await handleFetchReplies();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="bg-[var(--background)] p-4 rounded-xl shadow-sm border-l-4 border-[var(--accent)] space-y-2">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-[var(--accent)] text-xl"
        />
        <span className="font-semibold text-[var(--text)]">
          {commentUser.fname} {commentUser.lname}
        </span>
        <span className="ml-auto text-xs text-[var(--muted)]">
          {formattedDate}
        </span>
      </div>
      <p className="text-sm text-[var(--text)]">{comment}</p>

      <div className="flex justify-between items-center mt-2">
        <div className="min-w-[120px]">
          {hasChildren ? (
            <button
              className="text-[var(--primary)] text-sm font-semibold hover:underline flex items-center gap-1"
              onClick={handleToggleReplies}
            >
              <FontAwesomeIcon
                icon={showReplies ? faChevronUp : faChevronDown}
              />
              {showReplies ? "Hide Replies" : "Show Replies"}
            </button>
          ) : (
            <span className="invisible">Placeholder</span>
          )}
        </div>

        <button
          className="text-[var(--accent)] text-sm font-semibold hover:underline flex items-center gap-1"
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          <FontAwesomeIcon icon={faReply} />
          Reply
        </button>
      </div>

      {showReplyInput && currentUser && (
        <div className="mt-2 flex gap-2 items-center">
          <input
            className="w-full p-2 rounded-md border bg-[var(--highlight)] border-gray-300 text-sm text-[var(--text)]"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="text-[var(--accent)]"
            onClick={handleReplySubmit}
            disabled={!replyText.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      )}

      {showReplies && replies.length > 0 && (
        <div className="ml-4 mt-4 space-y-3 border-l-2 border-[var(--highlight)] pl-4">
          {replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply.comment}
              recipeId={recipeId}
              commentUser={reply.user}
              createdAt={reply.createdAt}
              commentId={reply._id}
              hasChildren={reply.hasChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
}
