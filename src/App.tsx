import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import { Footer } from "./components/utils/Footer";
import Navbar from "./components/utils/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecipeDetails from "./pages/RecipeDetails";
import ProfilePage from "./pages/Profile";
import CreateRecipeForm from "./pages/CreateRecipe";
import NotFound from "./pages/NotFound";
import Unauthenticated from "./pages/Unauthenticated";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { GuestRoute } from "./routes/GuestRoute";

function App() {
  return (
    <div className="transition-colors duration-300">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          <Route path="/recipes/:id" element={<RecipeDetails />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createRecipe"
            element={
              <ProtectedRoute>
                <CreateRecipeForm />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthenticated" element={<Unauthenticated />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
