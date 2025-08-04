import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import API from "../../service/axiosInterceptor";
import foodImage from "../../assets/food3.png";
import Button from "../utils/Button";
import type { Recipe } from "../../pages/Dashboard";
import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "../utils/ConfirmModal";

import {
  faStar as filledStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as blankStar } from "@fortawesome/free-regular-svg-icons";
import { useToast } from "../ui/toast/use-toast";

interface RecipeCardProps {
  recipe: Recipe;
}

interface UserData {
  fname: string;
  lname: string;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useToast();
  const { currentUser } = useAuth();
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await API.get(`/users/${recipe.userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [recipe.userId]);

  const handleDeleteConfirmed = async () => {
    if (!recipe._id) return;
    try {
      await API.delete(`/recipes/${recipe._id}`);
      setIsDeleted(true);
      toast.addToast({
        message: "Recipe deleted successfully",
        variant: "info",
        animation: "pop",
        mode: "dark",
        icon: undefined,
      });
    } catch (error) {
      console.error("Failed to delete recipe", error);
      toast.addToast({
        message: "Failed to delete recipe",
        variant: "error",
        animation: "pop",
        mode: "dark",
        icon: undefined,
      });
    }
    setConfirmDelete(false);
  };

  const formattedDate = new Date(recipe.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (isDeleted) {
    return null;
  }
  return (
    <motion.div
      className="relative w-full sm:w-[300px] h-[500px] bg-[var(--highlight)] rounded-2xl shadow-lg text-[var(--text)] overflow-hidden flex flex-col transition-all hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this recipe?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {currentUser?._id === recipe.userId && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-xl font-bold text-[var(--accent)] hover:text-[var(--primary)]"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-[var(--background)] border border-gray-200 rounded shadow-lg z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setConfirmDelete(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--background2)] text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <img
        src={
          recipe.recipeImage
            ? `${process.env.SERVER_URL}/uploads/${recipe.recipeImage}`
            : foodImage
        }
        alt={recipe.title}
        className="w-full h-[300px] object-cover bg-[var(--background2)]"
      />

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            className="text-[var(--accent)]"
          />
          <div className="text-sm font-semibold text-[var(--accent)]">
            {user ? `${user.fname} ${user.lname}` : "Loading..."}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[var(--primary)] truncate">
            {recipe.title}
          </h2>
          <div
            aria-label="rating"
            title={`rating: ${recipe.averageRating}`}
            className="flex items-center gap-1 text-sm text-yellow-400"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const fullStars = Math.floor(recipe.averageRating);
              const isHalf = recipe.averageRating - fullStars >= 0.5;

              let icon;
              if (i < fullStars) {
                icon = filledStar;
              } else if (i === fullStars && isHalf) {
                icon = faStarHalfAlt;
              } else {
                icon = blankStar;
              }

              return (
                <FontAwesomeIcon key={i} icon={icon} className="text-base" />
              );
            })}
            <span className="text-[var(--muted)] ml-2 text-xs">
              ({recipe.numberOfRatings})
            </span>
          </div>

          <p className="text-xs text-[var(--accent)]">{formattedDate}</p>
          <p className="text-sm text-[var(--accent)] leading-snug truncate w-full">
            {recipe.description}
          </p>
          <Button
            variant="default"
            to={`/recipes/${recipe._id}`}
            className="w-full"
          >
            view full recipe
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
