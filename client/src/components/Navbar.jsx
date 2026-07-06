// Ink & Impact sticky nav: paper bg, 4px ink bottom border, filled active link
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/anime", label: "Anime" },
  { path: "/manga", label: "Manga" },
  { path: "/characters", label: "Characters" },
  { path: "/trending", label: "Trending" },
  { path: "/seasonal", label: "Seasonal" },
  { path: "/schedule", label: "Schedule" },
];

const USER_LINKS = [
  { path: "/for-you", label: "For You" },
  { path: "/favorites", label: "Favorites" },
  { path: "/watchlist", label: "Watchlist" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? [...NAV_LINKS, ...USER_LINKS] : NAV_LINKS;
  const isActive = (path) => location.pathname === path;
  const closeMobile = () => setMobileOpen(false);

  const linkClass = (path) =>
    `px-3 py-2 text-[12.5px] font-black uppercase tracking-[1px] transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
      isActive(path) ? "bg-ink text-ink-paper" : "text-ink"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-ink bg-ink-paper">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobile}
          className="flex items-center gap-2.5"
        >
          <img
            src="/Main_Logo.png"
            alt="Otaku World logo"
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-[21px] tracking-[1px] text-ink">
            OTAKU WORLD<span className="text-ink-red">!</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={linkClass(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="hidden items-center gap-3 xl:flex">
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-ink-stripe2" />
          ) : user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 border-[3px] border-ink bg-ink-paper px-3.5 py-[7px] text-[12.5px] font-black uppercase tracking-[1px] text-ink transition-all duration-150 hover:bg-ink hover:text-ink-paper"
                title="Your profile"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-ink-red" />
                {user.name || user.email}
              </Link>
              <button
                onClick={logout}
                className="ink-btn ink-press-sm bg-ink-paper px-4 py-[9px] text-[12.5px] text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ink-btn ink-press-sm ink-sh-red bg-ink px-5 py-[9px] text-[13px] text-ink-paper"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="border-[3px] border-ink p-1.5 text-ink xl:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t-[3px] border-ink bg-ink-paper xl:hidden">
          <div className="flex flex-col p-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobile}
                className={`px-4 py-3 text-sm font-black uppercase tracking-[1px] ${
                  isActive(link.path)
                    ? "bg-ink text-ink-paper"
                    : "text-ink hover:bg-ink-red hover:text-ink-paper"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t-[3px] border-ink pt-4">
              {loading ? null : user ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-[1px] text-ink"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-ink-red" />
                    {user.name || user.email}
                  </Link>
                  <button
                    onClick={() => {
                      closeMobile();
                      logout();
                    }}
                    className="ink-btn bg-ink-paper px-4 py-2 text-xs text-ink"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    closeMobile();
                    navigate("/login");
                  }}
                  className="ink-btn ink-press-sm ink-sh-red w-full bg-ink px-5 py-3 text-sm text-ink-paper"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
