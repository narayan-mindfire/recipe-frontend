import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Setting from "./pages/Settings";
import { Footer } from "./components/utils/Footer";
import Navbar from "./components/utils/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecipeDetails from "./pages/RecipeDetails";
import ProfilePage from "./pages/Profile";
function App() {
  return (
    <div className="transition-colors duration-300">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/me" element={<ProfilePage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
