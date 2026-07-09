// Nova sticky glass nav: blurred dark stage, hairline bottom border,
// gold "O" wordmark, quiet links that brighten when active.
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Button } from "./nova";

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
  { path: "/for-you", label: "For you" },
  { path: "/favorites", label: "Favorites" },
  { path: "/watchlist", label: "Watchlist" },
];

const Wordmark = ({ onClick }) => (
  <Link to="/" onClick={onClick} className="flex items-center gap-2.5 no-underline">
    <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-gold font-display text-[15px] font-extrabold text-bg">
      O
    </span>
    <span className="font-display text-[17px] font-bold tracking-tight text-text">
      Otaku<span className="text-gold">World</span>
    </span>
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? [...NAV_LINKS, ...USER_LINKS] : NAV_LINKS;
  const isActive = (path) => location.pathname === path;
  const closeMobile = () => setMobileOpen(false);

  const linkClass = (path) =>
    `px-2.5 py-2 font-body text-sm no-underline transition-colors duration-fast ${
      isActive(path)
        ? "font-semibold text-text"
        : "text-muted hover:text-text"
    }`;

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <nav className="ow-glass sticky top-0 z-sticky">
      <div className="flex h-nav items-center justify-between px-gutter lg:px-gutter-lg">
        <Wordmark onClick={closeMobile} />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className={linkClass(link.path)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="hidden items-center gap-3 xl:flex">
          {loading ? (
            <div className="ow-shimmer h-[34px] w-20 rounded" />
          ) : user ? (
            <>
              <Link
                to="/profile"
                title="Your profile"
                className="grid h-[34px] w-[34px] place-items-center rounded-full bg-gradient-to-br from-gold to-gold-strong font-display text-sm font-bold text-bg no-underline"
              >
                {initial}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-sm border border-line-strong p-1.5 text-text xl:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="ow-glass max-h-[calc(100vh-68px)] overflow-y-auto border-t border-line xl:hidden">
          <div className="flex flex-col p-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobile}
                className={`rounded-sm px-4 py-3 font-body text-[15px] no-underline ${
                  isActive(link.path)
                    ? "bg-surface-2 font-semibold text-text"
                    : "text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-line pt-4">
              {loading ? null : user ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 font-body text-[15px] text-text no-underline"
                  >
                    <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-gradient-to-br from-gold to-gold-strong font-display text-[13px] font-bold text-bg">
                      {initial}
                    </span>
                    {user.name || user.email}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      closeMobile();
                      logout();
                    }}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <Button
                  block
                  onClick={() => {
                    closeMobile();
                    navigate("/login");
                  }}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
