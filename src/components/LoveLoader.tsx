import { HeartIcon, LipsIcon } from "./Icons";

const ORBITERS = [
  { delay: "0s", color: "#ff5a7a", lips: false },
  { delay: "-0.6s", color: "#ffffff", lips: true },
  { delay: "-1.2s", color: "#f5a53b", lips: false },
  { delay: "-1.8s", color: "#9b3bf0", lips: false },
];

export function LoveLoader({ label = "Loading love", size = "lg" }: { label?: string; size?: "sm" | "lg" }) {
  const scale = size === "sm" ? "scale-[0.6]" : "";
  return (
    <div className="flex flex-col items-center" role="status" aria-live="polite">
      <div className={`relative flex h-32 w-32 items-center justify-center ${scale}`}>
        <span className="absolute h-20 w-20 rounded-full bg-white/40 [animation:ripple_1.6s_ease-out_infinite]" />
        <span className="absolute h-20 w-20 rounded-full bg-white/30 [animation:ripple_1.6s_ease-out_0.8s_infinite]" />
        {ORBITERS.map((o, i) => (
          <span
            key={i}
            className="absolute"
            style={{ color: o.color, animation: `orbit 2.4s linear ${o.delay} infinite` }}
          >
            {o.lips ? <LipsIcon size={16} /> : <HeartIcon size={14} />}
          </span>
        ))}
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-rose shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] [animation:heartbeat_1.2s_ease-in-out_infinite]">
          <HeartIcon size={32} />
        </span>
      </div>
      {label && (
        <p className="mt-4 flex items-center text-base font-semibold text-white">
          {label}
          {[0, 1, 2].map((i) => (
            <span key={i} className="ml-0.5 inline-block" style={{ animation: `dot 1s ease-in-out ${i * 0.15}s infinite` }}>
              .
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export function FullScreenLoader({ bg = "bg-sky", label }: { bg?: string; label?: string }) {
  return (
    <main className={`flex min-h-dvh items-center justify-center ${bg}`}>
      <LoveLoader label={label} />
    </main>
  );
}
