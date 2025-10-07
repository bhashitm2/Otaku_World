import { Link } from "react-router-dom";
import Button from "../components/Button";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <HeroBanner />
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Your Anime Journey Starts Here
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your One Place Destination for Your Favorite Anime
            </p>
            <p className="text-gray-400 mt-2">
              Discover, explore, and track your anime adventures all in one
              place
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/anime" className="group h-full">
              <div className="relative text-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-gray-700 hover:border-cyan-400/50 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-400/20 transform h-full flex flex-col backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    🔍
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    Discover Anime
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 flex-grow transition-colors duration-300">
                    Explore thousands of anime series from classic masterpieces
                    to the latest releases.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/characters" className="group h-full">
              <div className="relative text-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-gray-700 hover:border-purple-400/50 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-400/20 transform h-full flex flex-col backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/AnimeBase.png"
                      alt="AnimeBase"
                      className="w-16 h-16 object-contain group-hover:drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    Explore Characters
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 flex-grow transition-colors duration-300">
                    Discover amazing characters from your favorite anime series
                    with detailed profiles and information.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/trending" className="group h-full">
              <div className="relative text-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-gray-700 hover:border-pink-400/50 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-pink-400/20 transform h-full flex flex-col backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    📈
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-pink-300 transition-colors duration-300">
                    Trending Now
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 flex-grow transition-colors duration-300">
                    Stay up to date with the hottest anime that everyone's
                    talking about right now.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/favorites" className="group h-full">
              <div className="relative text-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-gray-700 hover:border-green-400/50 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-green-400/20 transform h-full flex flex-col backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    📚
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-green-300 transition-colors duration-300">
                    Build Your Collection
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 flex-grow transition-colors duration-300">
                    Create your personal favorites list and track your anime
                    watching progress.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
