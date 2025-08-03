import { useEffect, useState } from "react";
import API from "../service/axiosInterceptor";
import RecipeCard from "../components/cards/RecipeCard";
import { useDebounce } from "../hooks/useDebounce";
import SearchFilters from "../components/dashboard/SearchFilter";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/utils/Button";

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
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ingredients: "",
    minRating: "",
    maxTime: "",
    sortBy: "updatedAt",
  });
  const debouncedFilters = useDebounce(filters, 400);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    setSearchParams({ page: String(page) });
  }, [page, setSearchParams]);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (debouncedFilters.ingredients)
          query.append("ingredients", debouncedFilters.ingredients);
        if (debouncedFilters.minRating)
          query.append("minRating", debouncedFilters.minRating);
        if (debouncedFilters.maxTime)
          query.append("maxTime", debouncedFilters.maxTime);
        if (debouncedFilters.sortBy)
          query.append("sortBy", debouncedFilters.sortBy);
        query.append("page", String(page));
        query.append("limit", String(limit));

        const res = await API.get(`/recipes?${query.toString()}`);
        setRecipes(res.data.recipes);
        setHasMore(res.data.recipes.length === limit);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [debouncedFilters, page]);

  return (
    <div className="min-h-[85vh] bg-[var(--background2)] py-12 px-4">
      <div className="mx-auto">
        <div className="relative mb-8 flex items-center justify-between">
          <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-[var(--primary)]">
            Recipes
          </h2>

          {currentUser && (
            <Button
              onClick={() => navigate("/createRecipe")}
              className="ml-auto px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--primary)] transition"
            >
              + Create Recipe
            </Button>
          )}
        </div>

        <div className="mx-auto max-w-7xl">
          <SearchFilters
            onFilterChange={(newFilters, shouldResetPage) => {
              setFilters(newFilters);
              if (shouldResetPage) setPage(1);
            }}
          />

          {loading ? (
            <div className="text-center text-lg text-[var(--muted)]">
              Loading...
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center text-[var(--muted)]">
              No results found. Try adjusting your search filters.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-8">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
              <div className="flex justify-center mt-6 gap-4">
                <Button
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded disabled:opacity-50"
                  disabled={!hasMore}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
