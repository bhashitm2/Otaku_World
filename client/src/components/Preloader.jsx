// Preloader.jsx — OtakuWorld adaptive preloader ("2a")
// Drop into client/src/components/ and render at the app root (see README.md).
//
// Behavior:
//   • Warm server  → wordmark reveal, curtain exit as soon as `loading` flips false (~2s feel)
//   • Cold start   → after 2.6s it settles into an honest waiting state:
//     indeterminate gold bar, rotating status lines, elapsed timer, "server naps" note.
//   • Exit: gold seam of light draws down the center, then the dark stage
//     parts like theater curtains to reveal the page. Never a fixed duration —
//     it leaves the moment your first API call resolves.

import React, { useEffect, useRef, useState } from "react";

const GOLD = "#FFC53D";
const GOLD_DEEP = "#E8952B";
const BG = "#0B0B0F";
const TEXT = "#F6F5F3";
const MUTED = "#9C9AA6";
const FAINT = "#66646F";

const MESSAGES = [
  "Waking up the server…",
  "Still stretching — free tiers nap deeply…",
  "Fetching fresh data from the library…",
  "Lining up trending now…",
  "Scoring the top rated…",
  "Almost there — thanks for waiting",
];

const KEYFRAMES = `
@keyframes owPrePop { from { opacity: 0; transform: scale(0.55); } to { opacity: 1; transform: scale(1); } }
@keyframes owPreRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes owPreFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes owPreOut { to { opacity: 0; } }
@keyframes owPreGrowY { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes owPreIndef { from { transform: translateX(-110%); } to { transform: translateX(340%); } }
@keyframes owPreGlow {
  0% { box-shadow: 0 0 0 rgba(255,197,61,0); }
  50% { box-shadow: 0 0 70px rgba(255,197,61,0.35); }
  100% { box-shadow: 0 0 40px rgba(255,197,61,0.18); }
}
@keyframes owPreCaret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .ow-preloader * { animation-duration: 0.01s !important; animation-delay: 0s !important; transition-duration: 0.01s !important; }
}
`;

const WORDMARK = ["O", "t", "a", "k", "u", "W", "o", "r", "l", "d"];

// Types `text` character by character behind a gold caret (solid while
// typing, blinking once done). Retypes from scratch whenever `text` changes.
// With prefers-reduced-motion the full text renders immediately, no caret.
function Typewriter({ text, speed = 30, startDelay = 0, style }) {
  const [count, setCount] = useState(0);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, reduced]);

  const done = count >= text.length;
  return (
    <span style={style}>
      {text.slice(0, count)}
      {!reduced && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "0.95em",
            marginLeft: 3,
            verticalAlign: "-0.08em",
            background: GOLD,
            animation: done ? "owPreCaret 1.1s steps(1) infinite" : "none",
          }}
        />
      )}
    </span>
  );
}

export default function Preloader({ loading }) {
  const [mounted, setMounted] = useState(true); // unmounts after exit animation
  const [exiting, setExiting] = useState(false); // curtain exit in progress
  const [waiting, setWaiting] = useState(false); // cold-start waiting state
  const [elapsed, setElapsed] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const t0 = useRef(Date.now());

  // Settle into the waiting state if the API hasn't answered after 2.6s
  useEffect(() => {
    const wait = setTimeout(() => setWaiting(true), 2600);
    const tick = setInterval(
      () => setElapsed(Math.floor((Date.now() - t0.current) / 1000)),
      1000
    );
    const msg = setInterval(
      () => setMsgIdx((i) => Math.min(i + 1, MESSAGES.length - 1)),
      5000
    );
    return () => {
      clearTimeout(wait);
      clearInterval(tick);
      clearInterval(msg);
    };
  }, []);

  // When the app reports ready, run the curtain exit, then unmount.
  useEffect(() => {
    if (!loading && !exiting) {
      // Let the intro land for a beat on very fast loads
      const minIntro = Math.max(0, 1600 - (Date.now() - t0.current));
      const go = setTimeout(() => setExiting(true), minIntro);
      return () => clearTimeout(go);
    }
  }, [loading, exiting]);

  useEffect(() => {
    if (exiting) {
      const done = setTimeout(() => setMounted(false), 1350);
      return () => clearTimeout(done);
    }
  }, [exiting]);

  if (!mounted) return null;

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const curtain = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50.5%",
    background: BG,
    transition: "transform 0.85s cubic-bezier(0.7, 0, 0.2, 1) 0.35s",
  };

  return (
    <div
      className="ow-preloader"
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: exiting ? "none" : "auto" }}
      aria-busy={!exiting}
      role="status"
      aria-label="OtakuWorld is loading"
    >
      <style>{KEYFRAMES}</style>

      {/* Curtains — solid stage until exit, then they part */}
      <div style={{ ...curtain, left: 0, transform: exiting ? "translateX(-101%)" : "none" }} />
      <div style={{ ...curtain, right: 0, transform: exiting ? "translateX(101%)" : "none" }} />

      {/* Gold seam of light during the exit */}
      {exiting && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "10%",
            bottom: "10%",
            width: 2,
            marginLeft: -1,
            background: `linear-gradient(to bottom, transparent, ${GOLD} 22%, ${GOLD} 78%, transparent)`,
            boxShadow: "0 0 26px rgba(255,197,61,0.55)",
            transformOrigin: "center",
            animation:
              "owPreGrowY 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both, owPreOut 0.45s ease 0.5s forwards",
          }}
        />
      )}

      {/* Center stack */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      >
        {/* Gold "O" tile */}
        <span
          style={{
            width: 74,
            height: 74,
            borderRadius: 19,
            background: GOLD,
            color: BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: 42,
            animation:
              "owPrePop 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.25) 0.1s both, owPreGlow 1.4s ease 0.6s both",
          }}
        >
          O
        </span>

        {/* Wordmark cascade */}
        <div
          style={{
            display: "flex",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 31,
            letterSpacing: "0.02em",
            color: TEXT,
          }}
        >
          {WORDMARK.map((ch, i) => (
            <span
              key={i}
              style={{
                color: i >= 5 ? GOLD : TEXT,
                animation: `owPreRise 0.5s ease ${0.55 + i * 0.045}s both`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {waiting ? (
          /* Cold start — honest waiting state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              animation: "owPreFade 0.6s ease both",
            }}
          >
            <div
              style={{
                width: 340,
                maxWidth: "70vw",
                height: 3,
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "42%",
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})`,
                  animation: "owPreIndef 1.5s ease-in-out infinite",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Typewriter
                text={MESSAGES[msgIdx]}
                speed={28}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: MUTED }}
              />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GOLD }}>
                {mm}:{ss}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: FAINT,
                maxWidth: 380,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              The server naps after inactivity — the first load can take up to a
              minute. After that, everything is instant.
            </span>
          </div>
        ) : (
          /* Warm intro — quiet meta label, typed out after the wordmark lands */
          <Typewriter
            text="Anime & Manga Library"
            speed={30}
            startDelay={1000}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.32em",
              color: FAINT,
              textTransform: "uppercase",
            }}
          />
        )}
      </div>
    </div>
  );
}
