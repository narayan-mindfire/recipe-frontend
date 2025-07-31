import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Setting from "./pages/Settings";
import { Footer } from "./components/utils/Footer";
import Navbar from "./components/utils/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
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
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
