const palettes = [
  ["#ffd1dc", "#d6336c"],
  ["#ffe8cc", "#e8590c"],
  ["#d0ebff", "#1971c2"],
  ["#e5dbff", "#7048e8"],
  ["#d3f9d8", "#2b8a3e"],
  ["#fff3bf", "#e67700"],
];

function paletteFor(name: string) {
  let hash = 0;
  for (const ch of name.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

export function Avatar({ name, size = 44, ring = true }: { name: string; size?: number; ring?: boolean }) {
  const [bg, fg] = paletteFor(name);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ${ring ? "ring-[3px] ring-white" : ""}`}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.42 }}
      title={name}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
