import React, { useCallback, useEffect, useRef, useState } from 'react';
import { triggerHapticFeedback } from '../utils/srsEngine';

interface UseSheetSwipeDismissOptions {
  isOpen: boolean;
  onDismiss: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  threshold?: number;
}

/**
 * Provides native iOS/Android-style pull-down-to-dismiss touch physics for bottom sheets and modals.
 * Respects internal scrollable containers (only engages when scrolled to top or dragging from header/handle).
 */
export function useSheetSwipeDismiss({
  isOpen,
  onDismiss,
  scrollContainerRef,
  threshold = 88,
}: UseSheetSwipeDismissOptions) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startRef = useRef<{
    x: number;
    y: number;
    time: number;
    isFromHandle: boolean;
    eligible: boolean;
    locked: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      startRef.current = null;
    }
  }, [isOpen]);

  const isScrollAtTop = useCallback(
    (target: EventTarget | null): boolean => {
      const el = target as HTMLElement | null;
      const scrollEl = scrollContainerRef?.current;
      const innerScrollable = el?.closest(
        '[data-sheet-scroll]'
      ) as HTMLElement | null;
      if (scrollEl && scrollEl.scrollTop > 2) return false;
      if (innerScrollable && innerScrollable.scrollTop > 2) return false;
      return true;
    },
    [scrollContainerRef]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      const isFromHandle = Boolean(target?.closest('[data-sheet-handle]'));
      const atTop = isFromHandle || isScrollAtTop(target);

      const touch = e.touches[0];
      startRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
        isFromHandle,
        eligible: atTop,
        locked: false,
      };
    },
    [isScrollAtTop]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const start = startRef.current;
      if (!start || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;

      // If user started scrolled slightly down and pulled back to top in one motion, hand off seamlessly
      if (!start.eligible) {
        if (dy > 8 && isScrollAtTop(e.target)) {
          start.eligible = true;
          start.x = touch.clientX;
          start.y = touch.clientY;
          start.time = performance.now();
        }
        return;
      }

      if (!start.locked) {
        if (Math.abs(dy) < 8 && Math.abs(dx) < 8) return;
        if (dy <= 0 || Math.abs(dx) > dy * 0.9) {
          // Horizontal or upward gesture — yield to normal scrolling / tab swipe
          start.eligible = false;
          return;
        }
        if (!start.isFromHandle && !isScrollAtTop(e.target)) {
          start.eligible = false;
          return;
        }
        start.locked = true;
        setIsDragging(true);
      }

      const clamped = Math.max(0, Math.min(dy * 0.92, 340));
      setDragY(clamped);
    },
    [isScrollAtTop]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const start = startRef.current;
      startRef.current = null;

      if (!start || !start.locked) {
        setIsDragging(false);
        return;
      }

      const touch = e.changedTouches[0];
      const dy = Math.max(0, (touch?.clientY ?? start.y) - start.y);
      const elapsed = Math.max(16, performance.now() - start.time);
      const velocity = dy / elapsed;

      setIsDragging(false);

      if (dy >= threshold || (dy >= 42 && velocity >= 0.45)) {
        triggerHapticFeedback(10);
        setDragY(0);
        onDismiss();
      } else {
        setDragY(0);
      }
    },
    [onDismiss, threshold]
  );

  const onTouchCancel = useCallback(() => {
    startRef.current = null;
    setIsDragging(false);
    setDragY(0);
  }, []);

  const sheetStyle: React.CSSProperties =
    dragY > 0 || isDragging
      ? {
          transform: `translate3d(0, ${dragY}px, 0)`,
          transition: isDragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }
      : {
          transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        };

  return {
    dragY,
    isDragging,
    sheetTouchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
    },
    sheetStyle,
  };
}
