import { motion } from "framer-motion";
import { HeroSection } from "../components/utils/Hero";

const Landing = () => {
  return (
    <div className="bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <HeroSection />
      <section className="py-16 px-4 sm:px-6 bg-[var(--primary)] text-[var(--text)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 sm:py-30 py-30 lg:gap-10">
          {[
            {
              title: "Create Recipes",
              desc: "Share your own recipes with step-by-step instructions and rich media.",
            },
            {
              title: "Explore Cuisine",
              desc: "Browse thousands of recipes from different cultures and dietary styles.",
            },
            {
              title: "You have power",
              desc: "Search recipes based on what you have in the fridge",
            },
          ].map(({ title, desc }) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={title}
              className="bg-[var(--background)] p-5 sm:p-6 rounded-2xl shadow-xl  transition-all "
            >
              <h3 className="text-lg sm:text-xl text-center font-semibold mb-2">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-center text-[var(--muted)]">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
