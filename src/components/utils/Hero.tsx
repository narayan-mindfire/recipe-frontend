import { motion } from "framer-motion";
import Button from "./Button";
import food from "../../assets/food.png";

export const HeroSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative flex flex-col justify-center items-center text-center gap-6 py-20 px-6 bg-[var(--background)] text-[var(--text)] overflow-hidden"
  >
    <h1 className="text-4xl sm:text-5xl font-bold leading-tight z-10">
      <span className="text-[var(--accent)]">Discover</span> &{" "}
      <span className="text-[var(--primary)]">Share</span> Delicious Recipes
    </h1>
    <p className="max-w-xl text-lg text-[var(--muted)] z-10">
      A community-driven platform to explore, create, and share your favorite
      meals with food lovers around the world.
    </p>
    <div className="flex gap-4 flex-wrap justify-center z-10">
      <Button to="/dashboard" variant="outline">
        Get Started
      </Button>
    </div>

    <img
      src={food}
      alt="Food"
      className="absolute bottom-0 right-0 w-35 sm:w-40 md:w-82 opacity-90 pointer-events-none"
    />
  </motion.section>
);
