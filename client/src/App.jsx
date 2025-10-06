import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Anime from "./pages/Anime";
import AnimeDetails from "./pages/AnimeDetails";
import Characters from "./pages/Characters";
import CharacterDetails from "./pages/CharacterDetails";
import Trending from "./pages/Trending";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import { FavoritesProvider } from "./context/FavoritesContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ToastProvider } from "./components/ui/Toast";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <FavoritesProvider>
          <WatchlistProvider>
            <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-body">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/anime" element={<Anime />} />
                  <Route path="/anime/:id" element={<AnimeDetails />} />
                  <Route path="/characters" element={<Characters />} />
                  <Route
                    path="/characters/:id"
                    element={<CharacterDetails />}
                  />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WatchlistProvider>
        </FavoritesProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
