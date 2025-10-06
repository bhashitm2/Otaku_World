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
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import { FavoritesProvider } from "./context/FavoritesContext";
import { WatchlistProvider } from "./context/WatchlistContext";

function App() {
  return (
    <FavoritesProvider>
      <WatchlistProvider>
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
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </FavoritesProvider>
  );
}

export default App;
