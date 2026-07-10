// React Router keeps the window scroll position across route changes, so a
// page opened from deep in a scrolled list starts mid-page. Reset to the top
// on new navigations; leave POP (back/forward) alone so the browser can
// restore the previous position. "instant" bypasses the global
// scroll-behavior: smooth — route changes shouldn't animate.
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
