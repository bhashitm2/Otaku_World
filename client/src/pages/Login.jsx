// Login — "Ink & Impact": centered card, rotated sticker, Firebase Google auth
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [signingIn, setSigningIn] = useState(false);

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
    return (
      <div className="ink-halftone flex min-h-[560px] items-center justify-center bg-ink-bg">
        <div className="ink-display animate-pulse text-2xl text-ink">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="ink-halftone flex min-h-[560px] animate-popIn items-center justify-center bg-ink-bg px-6 py-16">
      <div className="ink-card ink-shadow-lg relative w-full max-w-[420px] px-9 pb-8 pt-10">
        {/* rotated sticker */}
        <div className="ink-display absolute -top-[18px] -right-3.5 rotate-6 animate-bob2 border-[3px] border-ink bg-ink-red px-3.5 py-2 text-sm tracking-[1px] text-ink-paper">
          FREE FOREVER!
        </div>

        <img
          src="/Main_Logo.png"
          alt="logo"
          className="mb-3.5 h-14 w-14 object-contain"
        />
        <h1 className="ink-display m-0 text-[38px] leading-none">
          Join the <span className="text-ink-red">crew</span>
        </h1>
        <p className="mb-7 mt-3.5 text-[13.5px] font-medium leading-[1.7] text-ink-mut2">
          One account. Every favorite, every watchlist entry, synced across
          the multiverse.
        </p>

        <button
          onClick={handleGoogle}
          disabled={signingIn}
          className="ink-btn ink-press-sm mb-3 w-full gap-2.5 bg-ink-paper py-4 text-[13.5px] text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="font-display text-[17px] text-ink-red">G</span>
          {signingIn ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="mt-5 text-center text-[11px] font-medium text-ink-mut4">
          Secure authentication powered by Google.
        </p>
      </div>
    </div>
  );
};

export default Login;
