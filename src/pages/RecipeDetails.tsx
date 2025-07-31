import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../service/axiosInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import type { Recipe } from "./Dashboard";
import foodImage from "../assets/food3.png";
import {
  faClock,
  faSignal,
  faStar,
  faThumbsUp,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

interface UserData {
  fname: string;
  lname: string;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await API.get(`/recipes/${id}`);
        setRecipe(res.data.recipe);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    }
    fetchRecipe();
  }, [id]);

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

  if (!recipe)
    return <div className="text-center p-10 text-xl">Loading...</div>;

  const formattedDate = new Date(recipe.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 sm:p-12 bg-[var(--background)] text-[var(--text)]">
      <div className="max-w-5xl mx-auto gap-8">
        <div>
          <img
            src={foodImage}
            alt={recipe.title}
            className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover shadow-lg"
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

        <div className="bg-[var(--highlight)] p-6 rounded-xl shadow-md space-y-4">
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
        </div>
      </div>
    </div>
  );
}
