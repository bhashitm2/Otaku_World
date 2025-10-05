import Button from "../components/Button";

const Home = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-dark to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">MovieMate</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover, explore, and track your favorite anime and movies. Get
            personalized recommendations and never miss a great title again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Explore Movies
            </Button>
            <Button variant="outline" size="lg">
              Browse Anime
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose MovieMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Personalized</h3>
              <p className="text-gray-400">
                Get recommendations tailored to your taste and viewing history.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-3">Curated</h3>
              <p className="text-gray-400">
                Access a carefully curated collection of the best anime and
                movies.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-gray-400">
                Keep track of what you've watched and plan your next binge
                session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
