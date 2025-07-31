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
    <div className="min-h-screen bg-[var(--background2)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-[var(--primary)]">
          <span className="text-[var(--accent)]">Your</span> Recipes
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
