// Nova footer: quiet dark panel above a hairline, tiny uppercase column
// labels, muted links that brighten on hover.
import { Link } from "react-router-dom";

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-[13px] text-muted no-underline transition-colors duration-fast hover:text-text"
  >
    {children}
  </Link>
);

const ColumnLabel = ({ children }) => (
  <div className="mb-3.5 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
    {children}
  </div>
);

const Footer = () => (
  <footer className="border-t border-line bg-bg">
    <div className="grid grid-cols-1 gap-10 px-gutter py-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] lg:px-gutter-lg">
      <div>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-gold font-display text-[15px] font-extrabold text-bg">
            O
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight text-text">
            Otaku<span className="text-gold">World</span>
          </span>
        </div>
        <p className="max-w-xs text-[13px] leading-relaxed text-muted">
          Your anime and manga library — browse series, rank characters, and
          keep your watchlist in sync everywhere.
        </p>
      </div>
      <div>
        <ColumnLabel>Explore</ColumnLabel>
        <div className="flex flex-col gap-2">
          <FooterLink to="/anime">Browse anime</FooterLink>
          <FooterLink to="/manga">Browse manga</FooterLink>
          <FooterLink to="/characters">Characters</FooterLink>
          <FooterLink to="/trending">Trending</FooterLink>
          <FooterLink to="/seasonal">Seasonal</FooterLink>
          <FooterLink to="/schedule">Airing schedule</FooterLink>
        </div>
      </div>
      <div>
        <ColumnLabel>Account</ColumnLabel>
        <div className="flex flex-col gap-2">
          <FooterLink to="/for-you">For you</FooterLink>
          <FooterLink to="/favorites">My favorites</FooterLink>
          <FooterLink to="/watchlist">My watchlist</FooterLink>
          <FooterLink to="/profile">Profile</FooterLink>
          <FooterLink to="/login">Sign in</FooterLink>
        </div>
      </div>
    </div>
    <div className="border-t border-line px-gutter py-4 lg:px-gutter-lg">
      <span className="text-[12.5px] text-faint">
        Otaku World © {new Date().getFullYear()} · Created by Bhashit Maheshwari
      </span>
    </div>
  </footer>
);

export default Footer;
