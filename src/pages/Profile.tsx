import { memo, useEffect, useState } from "react";
import API from "../service/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/utils/Button";
import RecipeCard from "../components/cards/RecipeCard";
import type { Recipe } from "../pages/Dashboard";
import EditProfileModal from "../components/utils/EditProfileModal";
import ConfirmModal from "../components/utils/ConfirmModal";
import { useToast } from "../components/ui/toast/use-toast";

interface User {
  fname: string;
  lname: string;
  email: string;
  profileImage: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => navigate("/login"));

    API.get("/recipes/me")
      .then((res) => {
        setRecipes(res.data.myRecipies);
      })
      .catch((err) => console.error("Error fetching recipes:", err));
  }, [navigate]);

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete("/auth/me");
      navigate("/login", {
        state: {
          toast: {
            message: "Account deleted successfully",
            variant: "info",
            animation: "pop",
            mode: "dark",
            icon: undefined,
          },
        },
      });
    } catch {
      toast.addToast({
        message: "Failed to delete account",
        variant: "error",
        mode: "dark",
        animation: "pop",
        icon: undefined,
      });
    }
    setIsConfirmingDelete(false);
  };
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="text-center text-muted mt-10 animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background2)] py-16 px-6 text-[var(--text)]">
      {isConfirmingDelete && (
        <ConfirmModal
          message="Are you sure you want to delete your account? This action is irreversible."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
      {isEditing && (
        <EditProfileModal
          defaultValues={{ ...user }}
          onClose={() => setIsEditing(false)}
          onSuccess={() =>
            toast.addToast({
              animation: "pop",
              mode: "dark",
              message: "profile edited successfully",
              variant: "default",
              icon: undefined,
            })
          }
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto rounded-2xl shadow-2xl bg-[var(--background)] overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="bg-[var(--accent)] flex flex-col items-center justify-center p-10 text-white">
            <motion.img
              src={
                user.profileImage
                  ? `http://localhost:5000/uploads/${user.profileImage}`
                  : undefined
              }
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
              whileHover={{ scale: 1.1 }}
            />
            <motion.h2
              className="mt-6 text-2xl font-bold text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {user.fname} {user.lname}
            </motion.h2>
            <p className="mt-2 text-sm opacity-80">{user.email}</p>
          </div>

          <div className="md:col-span-2 p-10 flex flex-col gap-6">
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-[var(--primary)]">
                  Bio
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {user.bio || "No bio provided."}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--primary)]">
                  Joined
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {new Date(user.createdAt || "").toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="w-full hover:bg-amber-400"
                >
                  Edit Profile
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="w-full"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {recipes.length > 0 && (
        <motion.div
          className="mt-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">
            <span className="text-[var(--accent)]">Recipes</span> you{" "}
            <span className="text-[var(--accent)]">authored</span>
          </h2>

          <div className="w-full flex justify-center">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 overflow-x-auto md:overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[var(--primary)] max-w-screen-lg mx-auto px-4">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="md:shrink-0">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      {recipes.length === 0 && (
        <motion.div
          className="mt-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center )]">
            You still haven't authored a recipe, share you're favourites right{" "}
            <Link to="/createRecipe">
              <span className="text-[var(--primary)]">now</span>
            </Link>
            !
          </h2>
        </motion.div>
      )}
    </div>
  );
};

export default memo(ProfilePage);
