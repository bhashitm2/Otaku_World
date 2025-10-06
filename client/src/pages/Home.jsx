import { Link } from "react-router-dom";
import Button from "../components/Button";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Premium Hero Section */}
      <HeroBanner />

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            🌟 Your Anime Journey Starts Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/anime" className="group">
              <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer group-hover:scale-105 transform">
                <div className="text-4xl mb-4">🎌</div>
                <h3 className="text-xl font-semibold mb-3">Discover Anime</h3>
                <p className="text-gray-400">
                  Explore thousands of anime series from classic masterpieces to
                  the latest releases.
                </p>
              </div>
            </Link>
            <Link to="/characters" className="group">
              <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer group-hover:scale-105 transform">
                <div className="text-4xl mb-4">�</div>
                <h3 className="text-xl font-semibold mb-3">Explore Characters</h3>
                <p className="text-gray-400">
                  Discover amazing characters from your favorite anime series with detailed
                  profiles and information.
                </p>
              </div>
            </Link>
            <Link to="/trending" className="group">
              <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer group-hover:scale-105 transform">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-xl font-semibold mb-3">Trending Now</h3>
                <p className="text-gray-400">
                  Stay up to date with the hottest anime that everyone's talking
                  about right now.
                </p>
              </div>
            </Link>
            <Link to="/favorites" className="group">
              <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer group-hover:scale-105 transform">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold mb-3">
                  Build Your Collection
                </h3>
                <p className="text-gray-400">
                  Create your personal favorites list and track your anime
                  watching progress.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
