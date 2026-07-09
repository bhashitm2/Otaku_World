// Login — Nova: glass card over a blurred backdrop, Firebase Google auth
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useTrendingAnime } from "../hooks/useAnimeQueries";
import { Loader } from "../components/nova";

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [signingIn, setSigningIn] = useState(false);

  // Blurred cover art behind the card (usually already cached from Home)
  const { data: trendingData } = useTrendingAnime(1);
  const backdrop = trendingData?.data?.[0]?.images?.jpg?.large_image_url;

  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/anime";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  const handleGoogle = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      if (error.code === "auth/popup-blocked") {
        alert("Pop-up was blocked. Please allow pop-ups for this site.");
      } else if (error.code !== "auth/popup-closed-by-user") {
        alert("Sign-in failed. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return <Loader fullscreen label="Checking your session…" />;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden px-6 py-16">
      {/* Blurred backdrop */}
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-lg"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 to-bg" />

      {/* Glass card */}
      <div className="relative w-full max-w-[400px] rounded-xl border border-line-strong bg-[rgba(21,21,27,0.85)] p-10 shadow-lg backdrop-blur-[20px]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-gold font-display text-[15px] font-extrabold text-bg">
            O
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight text-text">
            Otaku<span className="text-gold">World</span>
          </span>
        </div>

        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-tight text-text">
          Welcome back
        </h1>
        <p className="mb-7 mt-3 text-[13.5px] leading-relaxed text-muted">
          Sign in to sync your favorites and watchlist across every device.
        </p>

        <button
          onClick={handleGoogle}
          disabled={signingIn}
          className="flex w-full items-center justify-center gap-2.5 rounded border border-line-strong bg-surface-2 py-3.5 font-body text-[14.5px] font-bold leading-none text-text transition-transform duration-fast active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="font-display text-[16px] font-extrabold text-gold">
            G
          </span>
          {signingIn ? "Signing in…" : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-[11.5px] text-faint">
          Free forever · Secure authentication by Google
        </p>
      </div>
    </div>
  );
};

export default Login;
