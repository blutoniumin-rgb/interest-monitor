import { ImageResponse } from "next/og";
import { HEART_PATH } from "@/components/Icons";

export function heartIcon(size: number, rounded = false) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4a9df4",
          borderRadius: rounded ? size * 0.22 : 0,
        }}
      >
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24">
          <path d={HEART_PATH} fill="#f5a53b" transform="translate(1.2 1.2) scale(0.9)" />
          <path d={HEART_PATH} fill="#ffffff" transform="translate(2.4 2.6) scale(0.8)" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
