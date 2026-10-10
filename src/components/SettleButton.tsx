"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LipsIcon } from "./Icons";

const COLORS = ["#ff5a7a", "#ffffff", "#f5a53b", "#9b3bf0", "#ff8fab", "#fde9cc"];

/** Hold timing: wait a beat so a tap stays a tap, then repeat faster and faster. */
const HOLD_DELAY = 320;
const START_INTERVAL = 280;
const MIN_INTERVAL = 160;
const MAX_LIVE = 36;

type Flyer = { id: number; x0: number; y0: number; dx: number; dy: number; rotate: number; size: number; color: string; duration: number };

let flyerId = 0;

function makeFlyer(originX: number, originY: number): Flyer {
  const w = typeof window === "undefined" ? 400 : window.innerWidth;
  const h = typeof window === "undefined" ? 800 : window.innerHeight;
  const x0 = originX;
  const y0 = originY;
  const angle = Math.random() * Math.PI * 2;
  const reach = Math.min(w, h) * (0.35 + Math.random() * 0.4);
  return {
    id: ++flyerId,
    x0,
    y0,
    dx: Math.cos(angle) * reach,
    dy: Math.sin(angle) * reach,
    rotate: (Math.random() - 0.5) * 160,
    size: 64 + Math.random() * 90,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: 2.8 + Math.random() * 1.6,
  };
}

/**
 * Tap to settle one kiss. Press and hold to settle faster and faster.
 * `onSettle` is called once per kiss and returns false when there is nothing left to settle.
 * `onDone` fires when the finger lifts so the parent can sync with the server.
 */
export function SettleButton({
  onSettle,
  onDone,
  owed,
  partnerName,
}: {
  onSettle: (count: number) => number;
  onDone: () => void;
  owed: number;
  partnerName: string;
}) {
  const reduce = useReducedMotion();
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [session, setSession] = useState(0);
  const [holding, setHolding] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);
  const ticks = useRef(0);
  const sessionRef = useRef(0);
  const callbacks = useRef({ onSettle, onDone });
  callbacks.current = { onSettle, onDone };

  const launch = useCallback(() => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect || reduce) return;
    setFlyers((cur) => [...cur, makeFlyer(rect.left + rect.width / 2, rect.top + rect.height / 2)].slice(-MAX_LIVE));
  }, [reduce]);

  const tick = useCallback(() => {
    const done = callbacks.current.onSettle(1);
    if (done <= 0) return false;
    sessionRef.current += 1;
    setSession(sessionRef.current);
    launch();
    navigator.vibrate?.(8);
    ticks.current += 1;
    return true;
  }, [launch]);

  const stop = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
    callbacks.current.onDone();
    setTimeout(() => {
      if (!active.current) {
        sessionRef.current = 0;
        setSession(0);
      }
    }, 1200);
  }, []);

  const loop = useCallback(() => {
    if (!active.current) return;
    if (!tick()) return stop();
    const delay = Math.max(MIN_INTERVAL, START_INTERVAL * Math.pow(0.86, ticks.current));
    timer.current = setTimeout(loop, delay);
  }, [tick, stop]);

  const start = useCallback(() => {
    if (active.current) return;
    active.current = true;
    ticks.current = 0;
    if (!tick()) {
      active.current = false;
      return;
    }
    timer.current = setTimeout(() => {
      setHolding(true);
      loop();
    }, HOLD_DELAY);
  }, [tick, loop]);

  // Auto-stop once everything is settled, and clean up on unmount.
  useEffect(() => {
    if (owed <= 0 && active.current) stop();
  }, [owed, stop]);
  useEffect(
    () => () => {
      active.current = false;
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const drop = useCallback((id: number) => setFlyers((cur) => cur.filter((f) => f.id !== id)), []);

  return (
    <>
      <motion.button
        ref={btnRef}
        type="button"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: holding ? 0.95 : 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => (e.key === "Enter" || e.key === " ") && stop()}
        onBlur={stop}
        aria-label={`Settle kisses with ${partnerName}. Tap for one, hold for many.`}
        className="relative mx-auto mt-3 flex w-fit max-w-full touch-none select-none items-center gap-2.5 overflow-hidden rounded-full bg-white py-1.5 pl-1.5 pr-5 text-left text-ink shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)] [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]"
      >
        <motion.span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose text-white"
          animate={holding ? { scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
          transition={holding ? { duration: 0.35, repeat: Infinity } : { duration: 0.2 }}
        >
          <LipsIcon size={22} />
        </motion.span>
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-extrabold">{session > 0 ? `Got ${session}` : "Get my kisses"}</span>
          <span className="text-[11px] font-semibold text-mute">{holding ? "Keep holding..." : "Tap for 1 · hold for fast"}</span>
        </span>
      </motion.button>

      {flyers.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
            {flyers.map((f) => (
              <motion.span
                key={f.id}
                className="absolute left-0 top-0"
                style={{ color: f.color, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                initial={{ x: f.x0 - f.size / 2, y: f.y0 - f.size / 2, scale: 0.3, opacity: 1, rotate: 0 }}
                animate={{
                  x: f.x0 - f.size / 2 + f.dx,
                  y: f.y0 - f.size / 2 + f.dy,
                  scale: [0.3, 1.3, 1],
                  opacity: [1, 1, 1, 0],
                  rotate: f.rotate,
                }}
                transition={{ duration: f.duration, ease: "easeOut" }}
                onAnimationComplete={() => drop(f.id)}
              >
                <LipsIcon size={f.size} />
              </motion.span>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
