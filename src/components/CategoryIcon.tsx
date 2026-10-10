"use client";

import { useId, type ReactNode } from "react";

/** Theme-colored 3D category marks. The stored emoji is the key so older deals still match. */
export function CategoryIcon({ emoji, size = 56 }: { emoji: string; size?: number }) {
  const uid = useId().replace(/:/g, "");
  const draw = GLYPHS[emoji] ?? GLYPHS["💋"];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="drop-shadow-[0_1px_0_rgba(17,17,17,0.18)] drop-shadow-[0_6px_6px_rgba(17,17,17,0.14)]">
      <defs>
        <linearGradient id={`${uid}-a`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="42%" stopColor={draw.a} />
          <stop offset="100%" stopColor={draw.b} />
        </linearGradient>
        <linearGradient id={`${uid}-c`} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor={draw.c} />
        </linearGradient>
        <radialGradient id={`${uid}-shine`} cx="32%" cy="28%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {draw.path(uid)}
    </svg>
  );
}

type Glyph = { a: string; b: string; c: string; path: (id: string) => ReactNode };

const GLYPHS: Record<string, Glyph> = {
  "🍿": {
    a: "#ffd27a",
    b: "#e88f22",
    c: "#ff5a7a",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M18 28h28l-3 26a6 6 0 0 1-6 5H27a6 6 0 0 1-6-5L18 28z" />
        <path fill={`url(#${id}-c)`} d="M22 34h6l1 20h-6zm8 0h6l-1 20h-6zm8 0h6l-2 20h-5z" opacity="0.95" />
        <g stroke="#f0b24f" strokeWidth="1.4">
          <ellipse cx="24" cy="22" rx="7" ry="6" fill="#fff6e4" />
          <ellipse cx="33" cy="18" rx="8" ry="7" fill="#fffdf6" />
          <ellipse cx="42" cy="23" rx="6.5" ry="5.5" fill="#ffe7b8" />
          <ellipse cx="32" cy="26" rx="6" ry="4.5" fill="#fff3d4" />
        </g>
        <ellipse cx="32" cy="20" rx="16" ry="10" fill={`url(#${id}-shine)`} />
      </>
    ),
  },
  "🍕": {
    a: "#ffb067",
    b: "#e07020",
    c: "#ff5a7a",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M32 8l22 40a4 4 0 0 1-3.6 6H13.6A4 4 0 0 1 10 48L32 8z" />
        <path fill={`url(#${id}-c)`} d="M32 16l16 30H16L32 16z" />
        <circle cx="28" cy="32" r="3.2" fill="#fff3d4" />
        <circle cx="36" cy="40" r="2.8" fill="#ffe08a" />
        <circle cx="26" cy="42" r="2.4" fill="#fff" />
        <path fill={`url(#${id}-shine)`} d="M32 8l22 40a4 4 0 0 1-3.6 6H13.6A4 4 0 0 1 10 48L32 8z" />
      </>
    ),
  },
  "☕": {
    a: "#7bb8f8",
    b: "#2f7fe0",
    c: "#2f7fe0",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M16 22h26v16a12 12 0 0 1-12 12h-2a12 12 0 0 1-12-12V22z" />
        <path fill="#2f7fe0" d="M42 26h6a7 7 0 0 1 0 14h-6v-4h5a3 3 0 0 0 0-6h-5v-4z" />
        <ellipse cx="29" cy="22" rx="13" ry="4" fill="#fff" stroke="#2f7fe0" strokeWidth="1.5" />
        <ellipse cx="29" cy="22.4" rx="10" ry="2.6" fill="#8a4b1f" />
        <path d="M24 12c-2 2 2 3 0 5M31 10c-2 2 2 3 0 5" stroke="#f5a53b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path fill={`url(#${id}-shine)`} d="M16 22h26v16a12 12 0 0 1-12 12h-2a12 12 0 0 1-12-12V22z" />
      </>
    ),
  },
  "🧹": {
    a: "#8ec8ff",
    b: "#2f86e8",
    c: "#f5a53b",
    path: (id) => (
      <>
        <path stroke={`url(#${id}-c)`} strokeWidth="5" strokeLinecap="round" d="M40 8L22 40" />
        <path fill={`url(#${id}-a)`} d="M14 38c6 2 10 8 12 16 6-6 14-8 22-6-8-8-16-14-22-14-4 0-8 1-12 4z" />
        <path fill={`url(#${id}-shine)`} d="M14 38c6 2 10 8 12 16 6-6 14-8 22-6-8-8-16-14-22-14-4 0-8 1-12 4z" />
      </>
    ),
  },
  "💆": {
    a: "#ffd0dc",
    b: "#ff5a7a",
    c: "#f5a53b",
    path: (id) => (
      <>
        <circle cx="32" cy="24" r="12" fill={`url(#${id}-a)`} />
        <path fill={`url(#${id}-c)`} d="M18 46c2-8 8-12 14-12s12 4 14 12v6H18v-6z" />
        <path fill="#fff" d="M26 23c1.2 1.4 2 1.4 3.2 0M35 23c1.2 1.4 2 1.4 3.2 0" stroke="#e07090" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M29 29c1.6 1.4 4 1.4 6 0" stroke="#e07090" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="32" cy="24" r="12" fill={`url(#${id}-shine)`} />
      </>
    ),
  },
  "🎬": {
    a: "#2a2a2a",
    b: "#111",
    c: "#f5a53b",
    path: (id) => (
      <>
        <rect x="10" y="18" width="44" height="30" rx="6" fill={`url(#${id}-a)`} />
        <path fill={`url(#${id}-c)`} d="M10 18h44v8H10z" />
        <path fill="#4a9df4" d="M18 18l6 8h-8l-4-8zm12 0l6 8h-8l-4-8zm12 0l6 8h-8l-4-8z" />
        <rect x="10" y="18" width="44" height="30" rx="6" fill={`url(#${id}-shine)`} />
      </>
    ),
  },
  "🛍️": {
    a: "#ffb3c4",
    b: "#ff5a7a",
    c: "#fff",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M16 24h32l-3 28a6 6 0 0 1-6 5H25a6 6 0 0 1-6-5L16 24z" />
        <path d="M24 24v-4a8 8 0 0 1 16 0v4" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path fill={`url(#${id}-shine)`} d="M16 24h32l-3 28a6 6 0 0 1-6 5H25a6 6 0 0 1-6-5L16 24z" />
      </>
    ),
  },
  "🚗": {
    a: "#8ec8ff",
    b: "#2f86e8",
    c: "#f5a53b",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M14 36l4-10a8 8 0 0 1 7-5h14a8 8 0 0 1 7 5l4 10v8H14v-8z" />
        <path fill="#e8f3ff" d="M24 24h8l2 8H20zm10 0h8l4 8H32z" />
        <circle cx="22" cy="46" r="5" fill="#111" />
        <circle cx="42" cy="46" r="5" fill="#111" />
        <circle cx="22" cy="46" r="2" fill={`url(#${id}-c)`} />
        <circle cx="42" cy="46" r="2" fill={`url(#${id}-c)`} />
        <path fill={`url(#${id}-shine)`} d="M14 36l4-10a8 8 0 0 1 7-5h14a8 8 0 0 1 7 5l4 10v8H14v-8z" />
      </>
    ),
  },
  "💐": {
    a: "#ff8fa3",
    b: "#ff5a7a",
    c: "#9b3bf0",
    path: (id) => (
      <>
        <circle cx="24" cy="24" r="8" fill={`url(#${id}-a)`} />
        <circle cx="40" cy="24" r="8" fill={`url(#${id}-c)`} />
        <circle cx="32" cy="34" r="8" fill="#f5a53b" />
        <circle cx="32" cy="26" r="5" fill="#fff6c8" />
        <path stroke="#2f86e8" strokeWidth="3" strokeLinecap="round" d="M32 40v14" />
        <path fill="#7dce8a" d="M32 46c6 1 8 5 8 5s-6 0-8-3c-2 3-8 3-8 3s2-4 8-5z" />
      </>
    ),
  },
  "🎮": {
    a: "#d7b4ff",
    b: "#9b3bf0",
    c: "#ff5a7a",
    path: (id) => (
      <>
        <rect x="10" y="20" width="44" height="26" rx="12" fill={`url(#${id}-a)`} />
        <circle cx="24" cy="33" r="3" fill="#fff" />
        <path stroke="#fff" strokeWidth="2.4" strokeLinecap="round" d="M24 27v12M18 33h12" />
        <circle cx="42" cy="30" r="2.4" fill={`url(#${id}-c)`} />
        <circle cx="47" cy="35" r="2.4" fill="#4a9df4" />
        <rect x="10" y="20" width="44" height="26" rx="12" fill={`url(#${id}-shine)`} />
      </>
    ),
  },
  "😴": {
    a: "#c9b6ff",
    b: "#7048e8",
    c: "#fff",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M18 40c0-10 8-16 18-14 2-8 12-10 18-4-2 12-10 22-22 22-8 0-14-2-14-4z" />
        <path fill="#fff" d="M40 16h8l-6 6h8" stroke="#f5a53b" strokeWidth="2" strokeLinejoin="round" />
        <path fill={`url(#${id}-shine)`} d="M18 40c0-10 8-16 18-14 2-8 12-10 18-4-2 12-10 22-22 22-8 0-14-2-14-4z" />
      </>
    ),
  },
  "💋": {
    a: "#ff8fa3",
    b: "#ff5a7a",
    c: "#fff",
    path: (id) => (
      <>
        <path fill={`url(#${id}-a)`} d="M8 30c6-10 12-14 16-10 3 3 5 3 8 0 4-4 10 0 16 10-8 12-16 16-24 16S16 42 8 30z" />
        <path d="M16 32c6 3 12 4 16 4s10-1 16-4" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
        <path fill={`url(#${id}-shine)`} d="M8 30c6-10 12-14 16-10 3 3 5 3 8 0 4-4 10 0 16 10-8 12-16 16-24 16S16 42 8 30z" />
      </>
    ),
  },
};
