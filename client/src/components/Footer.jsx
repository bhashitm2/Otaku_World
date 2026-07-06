// Ink & Impact footer: inverted light panel, red top border
import { Link } from "react-router-dom";

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-[13px] font-bold text-ink-link no-underline hover:text-ink-paper"
  >
    {children}
  </Link>
);

const Footer = () => (
  <footer className="border-t-4 border-ink-red bg-ink text-ink-paper">
    <div className="grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] md:px-16">
      <div>
        <div className="mb-3 flex items-center gap-2.5">
          <img
            src="/Main_Logo.png"
            alt="logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-xl tracking-[1px]">
            OTAKU WORLD<span className="text-ink-red">!</span>
          </span>
        </div>
        <p className="max-w-xs text-[13px] font-medium leading-relaxed text-ink-mut4">
          The anime database with main-character energy. Series, characters
          and lore — all in one place.
        </p>
      </div>
      <div>
        <div className="mb-3.5 font-display text-sm tracking-[2px] text-ink-red">
          EXPLORE
        </div>
        <div className="flex flex-col gap-2">
          <FooterLink to="/anime">Anime Archive</FooterLink>
          <FooterLink to="/manga">Manga Archive</FooterLink>
          <FooterLink to="/characters">Character Files</FooterLink>
          <FooterLink to="/trending">Power Rankings</FooterLink>
          <FooterLink to="/seasonal">Seasonal</FooterLink>
          <FooterLink to="/schedule">Airing Schedule</FooterLink>
        </div>
      </div>
      <div>
        <div className="mb-3.5 font-display text-sm tracking-[2px] text-ink-red">
          ACCOUNT
        </div>
        <div className="flex flex-col gap-2">
          <FooterLink to="/for-you">For You</FooterLink>
          <FooterLink to="/favorites">My Favorites</FooterLink>
          <FooterLink to="/watchlist">My Watchlist</FooterLink>
          <FooterLink to="/profile">Profile</FooterLink>
          <FooterLink to="/login">Login</FooterLink>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center justify-between gap-2 border-t border-ink-body px-6 py-4 sm:flex-row md:px-16">
      <span className="font-display text-[13px] tracking-[2px] text-ink-mut5">
        OTAKU WORLD © {new Date().getFullYear()} · CREATED BY BHASHIT
        MAHESHWARI
      </span>
      <span className="font-display text-[13px] tracking-[2px] text-ink-red">
        TO BE CONTINUED...
      </span>
    </div>
  </footer>
);

export default Footer;
