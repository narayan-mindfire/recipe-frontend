import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import API from "../../service/axiosInterceptor";
import foodImage from "../../assets/food3.png";
import Button from "../utils/Button";
import type { Recipe } from "../../pages/Dashboard";
import {
  faStar as filledStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as blankStar } from "@fortawesome/free-regular-svg-icons";

interface RecipeCardProps {
  recipe: Recipe;
}

interface UserData {
  fname: string;
  lname: string;
  profileImage: string;
}

/**
 * Displays a styled recipe card with title, author, image, rating, and description.
 * Allows owner to delete their recipe.
 */
export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [user, setUser] = useState<UserData | null>(null);
  // Fetch user info for the recipe owner
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

  const formattedDate = new Date(recipe.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <motion.div
      className="relative w-full sm:w-[300px] h-[550px] bg-[var(--highlight)] rounded-2xl shadow-lg text-[var(--text)] overflow-hidden flex flex-col transition-all hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={recipe.recipeImage ? recipe.recipeImage : foodImage}
        alt={recipe.title}
        className="w-full h-[300px] object-cover bg-[var(--background2)]"
      />

      <div className="p-5 flex flex-col justify-between flex-1 overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              size="2x"
              className="text-[var(--accent)]"
            />
          )}
          <div className="text-sm font-semibold text-[var(--accent)] truncate">
            {user ? `${user.fname} ${user.lname}` : "Loading..."}
          </div>
        </div>

        <div className="space-y-1 flex-1 overflow-hidden">
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

          <p className="text-xs text-[var(--accent)] truncate">
            {formattedDate}
          </p>
          <p className="text-sm text-[var(--muted)] leading-snug line-clamp-3">
            {recipe.description}
          </p>
        </div>

        <Button
          variant="default"
          to={`/recipes/${recipe._id}`}
          className="w-full mt-4"
        >
          view full recipe
        </Button>
      </div>
    </motion.div>
  );
}
