import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/Button";
import LoginButtons from "../components/user/LoginButtons.jsx";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email/password authentication (optional - can implement later)
    console.log("Form submitted:", formData);
    alert(
      "Email/password auth not implemented yet. Please use Google or Twitter."
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lightText">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="text-3xl font-bold text-primary">�</div>
            <span className="text-2xl font-semibold">Otaku_World</span>
          </div>
          <h2 className="text-3xl font-bold">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="mt-2 text-gray-400">
            {isLogin ? "Welcome back!" : "Join the community today"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "Sign in" : "Sign up"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-red-400 transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <LoginButtons />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
