import { HeartIcon, LipsIcon } from "./Icons";

const items = [
  { left: "8%", top: "12%", size: 22, r: "-14deg", delay: "0s", lips: false, o: 0.35 },
  { left: "82%", top: "8%", size: 30, r: "12deg", delay: "1.2s", lips: true, o: 0.3 },
  { left: "70%", top: "34%", size: 18, r: "-8deg", delay: "2.4s", lips: false, o: 0.25 },
  { left: "14%", top: "46%", size: 26, r: "18deg", delay: "0.8s", lips: true, o: 0.22 },
  { left: "88%", top: "60%", size: 20, r: "-20deg", delay: "3s", lips: false, o: 0.3 },
  { left: "40%", top: "4%", size: 16, r: "6deg", delay: "1.8s", lips: false, o: 0.25 },
];

export function FloatingHearts({ className = "text-white" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute animate-float"
          style={
            {
              left: it.left,
              top: it.top,
              opacity: it.o,
              animationDelay: it.delay,
              "--r": it.r,
            } as React.CSSProperties
          }
        >
          {it.lips ? <LipsIcon size={it.size} /> : <HeartIcon size={it.size} />}
        </span>
      ))}
    </div>
  );
}
