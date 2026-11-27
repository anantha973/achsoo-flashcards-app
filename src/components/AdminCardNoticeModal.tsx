import React, { useRef } from 'react';
import { Lock, X } from 'lucide-react';
import { useSheetSwipeDismiss } from '../hooks/useMobileGestures';
import { FoxMascot } from './FoxMascot';
import { Button } from './HeroPrimitives';

interface AdminCardNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCardNoticeModal: React.FC<AdminCardNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { dragY, sheetTouchHandlers, sheetStyle } = useSheetSwipeDismiss({
    isOpen,
    onDismiss: onClose,
    scrollContainerRef: scrollRef,
    threshold: 88,
  });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-card-notice-title"
      onClick={onClose}
      style={{ opacity: Math.max(0.1, 1 - dragY / 280) }}
      className="fixed inset-0 z-[60] h-[100dvh] w-screen flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
    >
      <div
        ref={scrollRef}
        onClick={(e) => e.stopPropagation()}
        style={sheetStyle}
        onTouchStart={sheetTouchHandlers.onTouchStart}
        onTouchMove={sheetTouchHandlers.onTouchMove}
        onTouchEnd={sheetTouchHandlers.onTouchEnd}
        onTouchCancel={sheetTouchHandlers.onTouchCancel}
        className="w-full max-w-md rounded-t-3xl sm:rounded-[var(--radius-card)] surface-overlay border p-6 pt-3.5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pt-6 sm:pb-6 space-y-4 max-h-[90dvh] overflow-y-auto anatomy-sheet-enter sm:modal-pop-enter"
      >
        <div
          data-sheet-handle="true"
          className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto sm:hidden"
        />

        <div
          data-sheet-handle="true"
          className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--intent-primary-soft)] border border-[var(--intent-primary-border)] flex items-center justify-center text-[var(--intent-primary)]">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <h2
              id="admin-card-notice-title"
              className="font-display text-base font-bold text-[var(--fg-primary)]"
            >
              Request New Flashcards
            </h2>
          </div>

          <Button
            intent="tertiary"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center text-center gap-3 py-2">
          <FoxMascot
            pose="studio"
            size="md"
            interactive
            speechPlacement="top"
          />
          <div className="space-y-1.5">
            <p className="font-display text-sm font-bold text-[var(--fg-primary)]">
              Flashcards are managed by the admin
            </p>
            <p className="text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
              Decks are updated centrally so everyone studies the exact same
              curated German cards. Please request the admin to add new
              flashcards!
            </p>
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <Button
            intent="primary"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};
