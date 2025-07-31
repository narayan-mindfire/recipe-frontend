import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import API from "../../service/axiosInterceptor";
import foodImage from "../../assets/food3.png";
import Button from "../utils/Button";
import type { Recipe } from "../../pages/Dashboard";

interface RecipeCardProps {
  recipe: Recipe;
}

interface UserData {
  fname: string;
  lname: string;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [user, setUser] = useState<UserData | null>(null);

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
      className="w-full sm:w-[300px] h-[500px] bg-[var(--highlight)] rounded-2xl shadow-lg text-[var(--text)] overflow-hidden flex flex-col transition-all hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={foodImage}
        alt={recipe.title}
        className="w-full object-cover bg-[var(--background2)]"
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

        <div className="space-y-1 pb-50">
          <h2 className="text-xl font-bold text-[var(--primary)]">
            {recipe.title}
          </h2>
          <p className="text-xs text-[var(--accent)]">{formattedDate}</p>
          <p className="text-sm text-[var(--accent)] leading-snug truncate w-full">
            {recipe.description}
          </p>
          <Button
            variant="default"
            to={`recipes/${recipe._id}`}
            className="w-full"
          >
            view full recipe
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
