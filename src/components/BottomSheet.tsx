"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect } from "react";

export function BottomSheet({
  open,
  onClose,
  children,
  className = "bg-white text-ink",
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  const dragControls = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex justify-center" role="dialog" aria-modal aria-label={label}>
        <div className="relative h-full w-full md:max-w-[430px]">
          <motion.div
            className="absolute inset-0 bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[32px] pb-safe ${className}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="flex cursor-grab touch-none justify-center pb-2 pt-3"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <span className="h-1.5 w-12 rounded-full bg-current opacity-20" />
            </div>
            {children}
          </motion.div>
        </div>
        </div>
      )}
    </AnimatePresence>
  );
}
