export const CATEGORIES = [
  { emoji: "🍿", label: "Snacks", bg: "#fff1d6" },
  { emoji: "🍕", label: "Dinner", bg: "#ffe0d6" },
  { emoji: "☕", label: "Coffee run", bg: "#efe2d6" },
  { emoji: "🧹", label: "Chores", bg: "#dff3ff" },
  { emoji: "💆", label: "Massage", bg: "#f3e3ff" },
  { emoji: "🎬", label: "Movie pick", bg: "#e3e6ff" },
  { emoji: "🛍️", label: "Shopping", bg: "#ffe3ef" },
  { emoji: "🚗", label: "Ride", bg: "#e0f5e6" },
  { emoji: "💐", label: "Surprise", bg: "#ffe6ea" },
  { emoji: "🎮", label: "Game time", bg: "#e2f0ff" },
  { emoji: "😴", label: "Sleep in", bg: "#ece8ff" },
  { emoji: "💋", label: "Other", bg: "#ffe0e8" },
] as const;

export function categoryBg(emoji: string) {
  return CATEGORIES.find((c) => c.emoji === emoji)?.bg ?? "#ffe0e8";
}
