"use client";

import { motion } from "framer-motion";

const HEART = "M0 -5 C-9 -15 -21 -2 0 13 C21 -2 9 -15 0 -5 Z";
const box = { transformBox: "fill-box" as const, transformOrigin: "center" };

type Mood = "hug" | "kiss" | "wave";

/**
 * Two cute bear-ish lovebirds. Left one is cream, right one is orange.
 * Pure SVG + framer-motion so it matches the theme and stays crisp.
 */
export function Couple({ size = 220, mood = "hug", className = "" }: { size?: number; mood?: Mood; className?: string }) {
  const kiss = mood === "kiss";
  const lean = kiss ? 7 : 3;

  return (
    <svg
      width={size}
      height={size * (200 / 240)}
      viewBox="0 0 240 200"
      fill="none"
      role="img"
      aria-label="A cute couple"
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* ground shadow */}
      <ellipse cx="120" cy="188" rx="88" ry="7" fill="#000" opacity="0.12" />

      {/* floating hearts */}
      <motion.g
        style={box}
        animate={{ y: [0, -8, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d={HEART} transform="translate(120 52)" fill="#ff5a7a" />
        <path d="M-6 -3 q2 -4 6 -3" transform="translate(120 52)" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      </motion.g>
      <motion.path
        d={HEART}
        transform="translate(70 40) scale(0.45)"
        fill="#fff"
        opacity="0.85"
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.95, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.path
        d={HEART}
        transform="translate(176 36) scale(0.4)"
        fill="#fde9cc"
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
      />

      {/* LEFT: cream one */}
      <motion.g
        style={box}
        animate={{ rotate: [lean, lean + 2, lean], y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="52" cy="92" r="15" fill="#fff" />
        <circle cx="52" cy="92" r="7.5" fill="#ffc2cf" />
        <circle cx="108" cy="92" r="15" fill="#fff" />
        <circle cx="108" cy="92" r="7.5" fill="#ffc2cf" />
        <ellipse cx="80" cy="140" rx="50" ry="46" fill="#fff" />
        <ellipse cx="80" cy="162" rx="26" ry="18" fill="#fdf3ea" />
        {/* eyes */}
        <motion.g
          style={box}
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.94, 0.98, 1] }}
        >
          <ellipse cx="65" cy="124" rx="4.6" ry="5.4" fill="#2a2230" />
          <ellipse cx="95" cy="124" rx="4.6" ry="5.4" fill="#2a2230" />
          <circle cx="66.6" cy="122" r="1.5" fill="#fff" />
          <circle cx="96.6" cy="122" r="1.5" fill="#fff" />
        </motion.g>
        <ellipse cx="52" cy="137" rx="8" ry="5" fill="#ff8fa6" opacity="0.65" />
        <ellipse cx="108" cy="137" rx="8" ry="5" fill="#ff8fa6" opacity="0.65" />
        <ellipse cx="80" cy="133" rx="3" ry="2.2" fill="#2a2230" />
        <path d="M73 140 Q80 148 87 140" stroke="#2a2230" strokeWidth="2.4" strokeLinecap="round" />
      </motion.g>

      {/* RIGHT: orange one */}
      <motion.g
        style={box}
        animate={{ rotate: [-lean, -lean - 2, -lean], y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      >
        <circle cx="132" cy="92" r="15" fill="#f5a53b" />
        <circle cx="132" cy="92" r="7.5" fill="#fde9cc" />
        <circle cx="188" cy="92" r="15" fill="#f5a53b" />
        <circle cx="188" cy="92" r="7.5" fill="#fde9cc" />
        <ellipse cx="160" cy="140" rx="50" ry="46" fill="#f5a53b" />
        <ellipse cx="160" cy="162" rx="26" ry="18" fill="#fde9cc" opacity="0.8" />
        {/* happy closed eyes */}
        <path d="M143 125 q5 -7 10 0" stroke="#2a2230" strokeWidth="3" strokeLinecap="round" />
        <path d="M167 125 q5 -7 10 0" stroke="#2a2230" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="132" cy="137" rx="8" ry="5" fill="#ff5a7a" opacity="0.55" />
        <ellipse cx="188" cy="137" rx="8" ry="5" fill="#ff5a7a" opacity="0.55" />
        <ellipse cx="160" cy="133" rx="3" ry="2.2" fill="#2a2230" />
        <path d="M153 140 Q160 150 167 140 Z" fill="#c8402f" stroke="#2a2230" strokeWidth="2" strokeLinejoin="round" />
        {/* bow on the ear */}
        <g transform="translate(176 101) rotate(-20)">
          <path d="M0 0 L-12 -8 L-12 8 Z" fill="#ff5a7a" />
          <path d="M0 0 L12 -8 L12 8 Z" fill="#ff5a7a" />
          <circle r="4" fill="#ff8fa6" />
        </g>
      </motion.g>

      {/* arms hugging across the middle */}
      <motion.ellipse
        cx="116"
        cy="150"
        rx="22"
        ry="9"
        fill="#fff"
        transform="rotate(-14 116 150)"
        style={box}
        animate={{ rotate: [-14, -20, -14] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="124"
        cy="154"
        rx="22"
        ry="9"
        fill="#f5a53b"
        transform="rotate(14 124 154)"
        style={box}
        animate={{ rotate: [14, 20, 14] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      />

      {/* sparkle */}
      <motion.path
        d="M214 118 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z"
        fill="#fff"
        style={box}
        animate={{ scale: [0.6, 1.1, 0.6], rotate: [0, 45, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M20 110 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z"
        fill="#fde9cc"
        style={box}
        animate={{ scale: [1, 0.5, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
}

/** Couple that pops in with a spring; safe to use from server components. */
export function CoupleHero({ size = 230, mood = "hug" as Mood }: { size?: number; mood?: Mood }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.25 }}
      className="mt-6 flex justify-center"
    >
      <Couple size={size} mood={mood} />
    </motion.div>
  );
}

/** Smaller single-heart-eyed buddy used on empty states. */
export function LoveBuddy({ size = 72, tone = "orange" }: { size?: number; tone?: "orange" | "cream" }) {
  const body = tone === "orange" ? "#f5a53b" : "#fff";
  const stroke = tone === "cream" ? "#f1e6da" : "none";
  const inner = tone === "orange" ? "#fde9cc" : "#ffc2cf";
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
      animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="20" cy="22" r="10" fill={body} stroke={stroke} strokeWidth="1.5" />
      <circle cx="20" cy="22" r="5" fill={inner} />
      <circle cx="60" cy="22" r="10" fill={body} stroke={stroke} strokeWidth="1.5" />
      <circle cx="60" cy="22" r="5" fill={inner} />
      <ellipse cx="40" cy="46" rx="28" ry="26" fill={body} stroke={stroke} strokeWidth="1.5" />
      <path d={HEART} transform="translate(30 42) scale(0.36)" fill="#ff5a7a" />
      <path d={HEART} transform="translate(50 42) scale(0.36)" fill="#ff5a7a" />
      <ellipse cx="22" cy="54" rx="5" ry="3" fill="#ff5a7a" opacity="0.4" />
      <ellipse cx="58" cy="54" rx="5" ry="3" fill="#ff5a7a" opacity="0.4" />
      <path d="M35 54 Q40 60 45 54" stroke="#2a2230" strokeWidth="2.2" strokeLinecap="round" />
    </motion.svg>
  );
}
