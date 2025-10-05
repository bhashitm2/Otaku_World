import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Anime from "./pages/Anime";
import AnimeDetails from "./pages/AnimeDetails";
import Manga from "./pages/Manga";
import MangaDetails from "./pages/MangaDetails";
import Characters from "./pages/Characters";
import CharacterDetails from "./pages/CharacterDetails";
import Trending from "./pages/Trending";

function App() {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/manga/:id" element={<MangaDetails />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:id" element={<CharacterDetails />} />
          <Route path="/trending" element={<Trending />} />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-8 text-center">
                  <div className="max-w-4xl mx-auto pt-20">
                    <div className="text-6xl mb-6">❤️</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      My Favorites
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                      Your personal collection of favorite anime and manga
                    </p>
                    <div className="bg-purple-100 border border-purple-200 rounded-lg p-6 inline-block">
                      <p className="text-purple-800 font-medium">
                        🔐 Authentication Required
                      </p>
                      <p className="text-purple-700 mt-2">
                        Save and organize your favorite anime & manga
                      </p>
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
