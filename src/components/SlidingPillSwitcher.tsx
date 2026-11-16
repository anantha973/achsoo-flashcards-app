import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export interface PillOption<T extends string = string> {
  id: T;
  label: string;
}

interface SlidingPillSwitcherProps<T extends string = string> {
  options: PillOption<T>[];
  value: T;
  onChange: (nextValue: T) => void;
  ariaLabel?: string;
  size?: 'sm' | 'md';
  variant?: 'segmented' | 'filled';
  shortcutHint?: string;
  className?: string;
}

export function SlidingPillSwitcher<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel = 'Segmented view switcher',
  size = 'md',
  variant = 'segmented',
  shortcutHint,
  className = '',
}: SlidingPillSwitcherProps<T>) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const latestValueRef = useRef<T>(value);
  latestValueRef.current = value;
  const prevValueRef = useRef<T>(value);

  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });
  const [canAnimate, setCanAnimate] = useState(false);

  const measureIndicator = useCallback(() => {
    const activeBtn = btnRefs.current[latestValueRef.current];
    const trackEl = trackRef.current;
    if (!activeBtn || !trackEl) return;

    const nextLeft = activeBtn.offsetLeft;
    const nextWidth = activeBtn.offsetWidth;
    if (nextWidth <= 0) return;

    setIndicator((prev) => {
      if (prev.left === nextLeft && prev.width === nextWidth) {
        return prev;
      }
      return {
        left: nextLeft,
        width: nextWidth,
      };
    });
  }, []);

  useLayoutEffect(() => {
    const valueChanged = prevValueRef.current !== value;
    prevValueRef.current = value;

    measureIndicator();

    if (valueChanged) {
      const trackEl = trackRef.current;
      const activeBtn = btnRefs.current[value];
      if (trackEl && activeBtn && trackEl.scrollWidth > trackEl.clientWidth) {
        const targetLeft =
          activeBtn.offsetLeft -
          trackEl.clientWidth / 2 +
          activeBtn.offsetWidth / 2;
        trackEl.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [value, options, measureIndicator]);

  useEffect(() => {
    if (indicator.width > 0 && !canAnimate) {
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setCanAnimate(true);
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }
  }, [indicator.width, canAnimate]);

  useEffect(() => {
    const handleResize = () => measureIndicator();
    window.addEventListener('resize', handleResize);
    window.addEventListener('themechange', handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(() => measureIndicator());
      ro.observe(trackRef.current);
    }

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => measureIndicator()).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('themechange', handleResize);
      ro?.disconnect();
    };
  }, [measureIndicator]);

  const isFilled = variant === 'filled';

  const padClass = isFilled
    ? size === 'sm'
      ? 'min-h-[32px] px-2.5 py-1 text-xs font-semibold'
      : 'min-h-[36px] px-3 py-1.5 text-[12.5px] font-semibold'
    : size === 'sm'
    ? 'px-3 py-1 text-[11px] font-semibold'
    : 'px-3.5 sm:px-4 py-1.5 text-xs font-semibold';

  const trackClass = isFilled
    ? `filled-pill-track max-w-full overflow-x-auto no-scrollbar ${className}`
    : `segmented-pill-track max-w-full overflow-x-auto no-scrollbar ${className}`;

  const indicatorClass = isFilled
    ? 'filled-pill-indicator'
    : 'segmented-pill-indicator';

  return (
    <div
      ref={trackRef}
      role="tablist"
      aria-label={ariaLabel}
      className={trackClass}
    >
      {indicator.width > 0 && (
        <div
          aria-hidden="true"
          className={`${indicatorClass}${
            canAnimate ? '' : ' pill-indicator-no-transition'
          }`}
          style={{
            width: `${indicator.width}px`,
            transform: `translate3d(${indicator.left}px, 0, 0)`,
          }}
        />
      )}

      {options.map((opt) => {
        const isActive = opt.id === value;
        const textStateClass = isFilled
          ? isActive
            ? 'text-[var(--intent-primary-fg)]'
            : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          : isActive
          ? 'text-[var(--seg-text-active)]'
          : 'text-[var(--seg-text)] hover:text-[var(--seg-text-active)]';

        return (
          <button
            key={opt.id}
            ref={(el) => {
              btnRefs.current[opt.id] = el;
            }}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`relative z-10 rounded-[var(--radius-pill)] whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer select-none active:scale-95 theme-focus ${padClass} ${textStateClass}`}
          >
            {opt.label}
          </button>
        );
      })}

      {shortcutHint && (
        <span
          aria-hidden="true"
          className="hidden sm:inline-block pl-2 pr-2.5 font-sans text-[10px] font-medium text-[var(--fg-muted)] select-none"
        >
          [{shortcutHint}]
        </span>
      )}
    </div>
  );
}
