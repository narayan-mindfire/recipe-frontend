import { motion } from "framer-motion";
import { HeroSection } from "../components/utils/Hero";
import { useToast } from "../components/ui/toast/use-toast";
import { useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";

/**
 * Landing page with hero section and features.
 */
const Landing = () => {
  const toast = useToast();
  const hasShownToast = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast && !hasShownToast.current) {
      toast.addToast(location.state.toast);
      hasShownToast.current = true;
    }
  }, [location.state, toast]);

  const features = useMemo(
    () => [
      {
        title: "Create Recipes",
        desc: "Share your own recipes with step-by-step instructions and rich media.",
      },
      {
        title: "Explore Cuisine",
        desc: "Browse thousands of recipes from different cultures and dietary styles.",
      },
      {
        title: "You Have Power",
        desc: "Search recipes based on what you have in the fridge.",
      },
    ],
    [],
  );

  return (
    <main className="bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <Helmet>
        <title>Home | Recipe Sharing Platform</title>
        <meta
          name="description"
          content="Discover, create, and share delicious recipes on the Recipe Sharing Platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Home | Recipe Sharing Platform" />
        <meta
          property="og:description"
          content="Explore global cuisines, share your favorite dishes, and find recipes by ingredients you already have!"
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Recipe Sharing Platform" />
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>

      <HeroSection />

      <section className="py-16 px-4 sm:px-6 bg-[var(--primary)] text-[var(--text)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 sm:py-30 py-30 lg:gap-10">
          {features.map(({ title, desc }) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={title}
              className="bg-[var(--background)] p-5 sm:p-6 rounded-2xl shadow-xl transition-all"
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
    </main>
  );
};

export default Landing;
