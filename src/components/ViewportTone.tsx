"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TANG = "#f5a53b";
const SKY = "#4a9df4";

/** Paint the page behind the app so a pull-down never flashes cream. */
export function ViewportTone() {
  const path = usePathname();
  useEffect(() => {
    const tang = path.startsWith("/deal") || path === "/nest" || path.startsWith("/nest/join");
    const color = tang ? TANG : SKY;
    document.documentElement.style.background = color;
    document.body.style.background = color;
  }, [path]);
  return null;
}
