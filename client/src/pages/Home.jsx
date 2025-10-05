import { Link } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-dark to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">Otaku_World</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            🎌 Your ultimate destination for discovering amazing anime series,
            manga, and light novels. Explore top-rated content, get personalized
            recommendations, and build your collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/anime">
              <Button variant="primary" size="lg">
                🎌 Explore Anime
              </Button>
            </Link>
            <Link to="/manga">
              <Button variant="primary" size="lg">
                📚 Browse Manga
              </Button>
            </Link>
            <Link to="/characters">
              <Button variant="primary" size="lg">
                🎭 Discover Characters
              </Button>
            </Link>
            <Link to="/trending">
              <Button variant="outline" size="lg">
                🔥 Trending Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            🌟 Your Anime Journey Starts Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="text-4xl mb-4">�</div>
              <h3 className="text-xl font-semibold mb-3">Discover Anime</h3>
              <p className="text-gray-400">
                Explore thousands of anime series from classic masterpieces to
                the latest releases.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Read Manga</h3>
              <p className="text-gray-400">
                Discover amazing manga, manhwa, and light novels with detailed
                information.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold mb-3">Explore Characters</h3>
              <p className="text-gray-400">
                Meet your favorite anime characters and discover new ones from
                various series.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-3">
                Build Your Collection
              </h3>
              <p className="text-gray-400">
                Create your personal favorites list and track your anime & manga
                progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
