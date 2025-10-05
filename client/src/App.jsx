import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/movies"
            element={
              <div className="p-8 text-center">
                <h1 className="text-3xl">Movies Page - Coming Soon</h1>
              </div>
            }
          />
          <Route
            path="/trending"
            element={
              <div className="p-8 text-center">
                <h1 className="text-3xl">Trending Page - Coming Soon</h1>
              </div>
            }
          />
          <Route
            path="/favorites"
            element={
              <div className="p-8 text-center">
                <h1 className="text-3xl">Favorites Page - Coming Soon</h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
