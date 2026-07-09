import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Loader } from "./components/nova";
import BackendStatus from "./components/BackendStatus";
import { FavoritesProvider } from "./context/FavoritesContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ToastProvider } from "./components/ui/Toast";

// Lazy load pages for code splitting
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Anime = React.lazy(() => import("./pages/Anime"));
const AnimeDetails = React.lazy(() => import("./pages/AnimeDetails"));
const Characters = React.lazy(() => import("./pages/Characters"));
const CharacterDetails = React.lazy(() => import("./pages/CharacterDetails"));
const Trending = React.lazy(() => import("./pages/Trending"));
const Favorites = React.lazy(() => import("./pages/Favorites"));
const Watchlist = React.lazy(() => import("./pages/Watchlist"));
const Seasonal = React.lazy(() => import("./pages/Seasonal"));
const Schedule = React.lazy(() => import("./pages/Schedule"));
const Manga = React.lazy(() => import("./pages/Manga"));
const MangaDetails = React.lazy(() => import("./pages/MangaDetails"));
const Profile = React.lazy(() => import("./pages/Profile"));
const ForYou = React.lazy(() => import("./pages/ForYou"));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime pre-v5)
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
            <BackendStatus>
              <div className="flex min-h-screen flex-col bg-bg font-body text-text">
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<Loader fullscreen />}>
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
                      <Route path="/seasonal" element={<Seasonal />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/manga" element={<Manga />} />
                      <Route path="/manga/:id" element={<MangaDetails />} />
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/for-you"
                        element={
                          <PrivateRoute>
                            <ForYou />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/favorites"
                        element={
                          <PrivateRoute>
                            <Favorites />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/watchlist"
                        element={
                          <PrivateRoute>
                            <Watchlist />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </BackendStatus>
          </WatchlistProvider>
        </FavoritesProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
