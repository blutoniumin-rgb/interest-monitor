type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 22, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d={HEART_PATH} />
    </svg>
  );
}

export function LipsIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M1.5 11.2C4 7.6 6.6 5.8 8.8 5.8c1.3 0 2.4.6 3.2 1.6.8-1 1.9-1.6 3.2-1.6 2.2 0 4.8 1.8 7.3 5.4-2.9 4.6-6.5 7.4-10.5 7.4S4.4 15.8 1.5 11.2z" />
      <path
        d="M4.6 11.4c2.4.8 4.9 1.2 7.4 1.2s5-.4 7.4-1.2"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5v3.6l-1.6 3a1 1 0 0 0 .9 1.4h14.4a1 1 0 0 0 .9-1.4l-1.6-3V9A6.5 6.5 0 0 0 12 2.5zM9.2 18.8a2.9 2.9 0 0 0 5.6 0z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.6}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.6}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.4}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.6}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.4}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="8" y="8" width="12" height="12" rx="3" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5" />
      <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4L3.5 7.5 7 11M3.5 7.5H17M17 13l3.5 3.5L17 20M20.5 16.5H7" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
    </svg>
  );
}
