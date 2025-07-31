import { useEffect, useState } from "react";
import API from "../service/axiosInterceptor";
import RecipeCard from "../components/cards/RecipeCard";

export interface Recipe {
  _id: string;
  userId: string;
  title: string;
  description: string;
  recipeImage?: string;
  preparationTime: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: string[];
  steps: string[];
  averageRating: number;
  numberOfRatings: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await API.get("/recipes");
        console.log(res.data);
        setRecipes(res.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
    fetchRecipes();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-[var(--background)] min-h-screen">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default Dashboard;
