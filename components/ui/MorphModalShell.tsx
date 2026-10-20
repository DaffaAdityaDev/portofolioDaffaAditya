import React from 'react';
import { m } from 'framer-motion';
import { X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { cn } from '@/utils/cn';

/**
 * Shared shell for the card-to-modal morphs: portal, backdrop, panel, sheet handle, header bar, close button,
 * Escape and scroll lock. Render it inside <AnimatePresence>; pass the trigger card's `layoutId` to morph from it.
 * Reduced motion is handled by the app-wide <MotionConfig reducedMotion="user"> (the morph becomes a fade).
 */
const MorphModalShell = ({
  onClose,
  layoutId,
  labelledBy,
  header,
  closeLabel = 'Close',
  className,
  bodyClassName,
  children,
}: {
  onClose: () => void;
  /** Shared layout id of the card that opened the modal. */
  layoutId?: string;
  /** Id of the heading inside `children` that names the dialog. */
  labelledBy: string;
  /** Left side of the header bar (kicker, date chip, icon). */
  header?: React.ReactNode;
  closeLabel?: string;
  /** Panel classes, mostly the width: `max-w-3xl`. */
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) => {
  // Mounted only while open (inside <AnimatePresence>), so dismissal is always armed.
  useModalDismiss(true, onClose);

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
        <m.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl -z-10"
          aria-hidden="true"
        />

        <m.div
          layoutId={layoutId}
          transition={SPRING_MOBILE_OS}
          className={cn(
            'relative w-full max-w-2xl max-h-[90vh] bg-surface-2 border border-border rounded-lg shadow-[0_32px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-100 focus:outline-none',
            className,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
        >
          {/* Content fades separately so it doesn't stretch while the panel morphs. */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 overflow-hidden w-full"
          >
            {/* Sheet handle (mobile) */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-border bg-surface-2/70 backdrop-blur-md shrink-0">
              <div className="min-w-0">{header}</div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono"
                aria-label={closeLabel}
              >
                <span className="hidden sm:inline pl-1 text-2xs">ESC</span>
                <X size={16} />
              </button>
            </div>

            <div className={cn('overflow-y-auto p-6 md:p-8 space-y-6', bodyClassName)}>{children}</div>
          </m.div>
        </m.div>
      </div>
    </Portal>
  );
};

export default MorphModalShell;
