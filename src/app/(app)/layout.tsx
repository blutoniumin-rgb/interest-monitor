import { LiveToaster } from "@/components/LiveToaster";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LiveToaster />
      {children}
    </>
  );
}
