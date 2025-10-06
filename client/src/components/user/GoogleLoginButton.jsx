import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";

export default function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Don't navigate here - let the Login component handle redirect when user state changes
    } catch (error) {
      console.error("Google sign-in failed:", error);

      // Handle specific Firebase auth errors
      let errorMessage = "Sign-in failed. Please try again.";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage =
            "Pop-up was blocked by your browser. Please allow pop-ups for this site.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage =
            "An account already exists with this email using a different sign-in method.";
          break;
        default:
          errorMessage = "Sign-in failed. Please try again.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
    >
      {/* Google Logo */}
      <div className="flex-shrink-0">
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </div>

      {/* Button Text */}
      <span className="text-lg font-medium">
        {loading ? (
          <span className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </span>
        ) : (
          "Continue with Google"
        )}
      </span>

      {/* Arrow Icon */}
      {!loading && (
        <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
