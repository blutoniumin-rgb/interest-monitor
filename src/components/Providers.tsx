"use client";

import { MotionConfig } from "framer-motion";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 30 }}>
      <SWRConfig value={{ fetcher, revalidateOnFocus: true }}>{children}</SWRConfig>
    </MotionConfig>
  );
}
