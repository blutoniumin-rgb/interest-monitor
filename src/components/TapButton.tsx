"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Variant = "white" | "tang" | "sky" | "grape" | "ink" | "glass" | "ghost";

const variants: Record<Variant, string> = {
  white: "bg-white text-ink",
  tang: "bg-tang text-white",
  sky: "bg-sky text-white",
  grape: "bg-grape text-white",
  ink: "bg-ink text-white",
  glass: "glass text-white",
  ghost: "bg-transparent text-current",
};

type Props = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-7 text-lg",
};

export function TapButton({
  variant = "white",
  size = "md",
  loading,
  disabled,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.94 }}
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-opacity disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Dots /> : children}
    </motion.button>
  );
}

function Dots() {
  return (
    <span className="flex items-center gap-1" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-current"
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}
