import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  MASCOT_MOMENT_CATALOG,
  MascotMomentPoseId,
} from '../utils/mascotMoments';

export type MascotMomentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export interface MascotMomentVisualProps {
  poseId: MascotMomentPoseId;
  size?: MascotMomentSize;
  priority?: boolean;
  interactive?: boolean;
  showSparkles?: boolean;
  showSpeechBubbleOnClick?: boolean;
  speechPlacement?: 'top' | 'bottom' | 'right';
  className?: string;
  onClick?: (poseId: MascotMomentPoseId) => void;
}

const SIZE_SPECS: Record<
  MascotMomentSize,
  { wrapper: string; img: string; showAmbientSparkles: boolean }
> = {
  xs: {
    wrapper: 'w-8 h-8',
    img: 'w-8 h-8',
    showAmbientSparkles: false,
  },
  sm: {
    wrapper: 'w-11 h-11',
    img: 'w-11 h-11',
    showAmbientSparkles: false,
  },
  md: {
    wrapper: 'w-16 h-16 sm:w-20 sm:h-20',
    img: 'w-16 h-16 sm:w-20 sm:h-20',
    showAmbientSparkles: true,
  },
  lg: {
    wrapper: 'w-32 h-32 sm:w-40 sm:h-40',
    img: 'w-32 h-32 sm:w-40 sm:h-40',
    showAmbientSparkles: true,
  },
  xl: {
    wrapper: 'w-36 h-36 sm:w-44 sm:h-44',
    img: 'w-36 h-36 sm:w-44 sm:h-44',
    showAmbientSparkles: true,
  },
  hero: {
    wrapper: 'w-40 h-40 sm:w-48 sm:h-48',
    img: 'w-40 h-40 sm:w-48 sm:h-48',
    showAmbientSparkles: true,
  },
};

export const MascotMomentVisual: React.FC<MascotMomentVisualProps> = ({
  poseId,
  size = 'lg',
  priority = false,
  interactive = false,
  showSparkles,
  showSpeechBubbleOnClick = true,
  speechPlacement = 'top',
  className = '',
  onClick,
}) => {
  const asset = MASCOT_MOMENT_CATALOG[poseId];
  const [failed, setFailed] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [clickSeq, setClickSeq] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);

  const jumpTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setFailed(false);
  }, [poseId]);

  useEffect(() => {
    return () => {
      if (jumpTimerRef.current !== null) {
        window.clearTimeout(jumpTimerRef.current);
      }
      if (bubbleTimerRef.current !== null) {
        window.clearTimeout(bubbleTimerRef.current);
      }
    };
  }, []);

  const sizeSpec = SIZE_SPECS[size];
  const renderSparkles = showSparkles ?? sizeSpec.showAmbientSparkles;
  const activePhrase =
    asset.phrases[phraseIndex % Math.max(1, asset.phrases.length)];

  const handleInteract = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if (!interactive) return;
      e.stopPropagation();

      setClickSeq((prev) => prev + 1);
      setPhraseIndex((prev) => prev + 1);
      setIsJumping(true);

      if (jumpTimerRef.current !== null) {
        window.clearTimeout(jumpTimerRef.current);
      }
      jumpTimerRef.current = window.setTimeout(() => {
        setIsJumping(false);
      }, 560);

      if (showSpeechBubbleOnClick) {
        setShowBubble(true);
        if (bubbleTimerRef.current !== null) {
          window.clearTimeout(bubbleTimerRef.current);
        }
        bubbleTimerRef.current = window.setTimeout(() => {
          setShowBubble(false);
        }, 2400);
      }

      onClick?.(poseId);
    },
    [interactive, onClick, poseId, showSpeechBubbleOnClick]
  );

  const bubblePositionClass =
    speechPlacement === 'right'
      ? 'left-full top-1/2 -translate-y-1/2 ml-2.5'
      : speechPlacement === 'bottom'
        ? 'top-full left-1/2 -translate-x-1/2 mt-2'
        : 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        interactive
          ? `${asset.label} (${asset.germanTitle}) — Tippen zum Animieren`
          : undefined
      }
      onClick={interactive ? handleInteract : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteract(e);
              }
            }
          : undefined
      }
      className={`fox-mascot-stage relative inline-flex items-center justify-center select-none shrink-0 ${
        sizeSpec.wrapper
      } ${
        interactive
          ? 'cursor-pointer group theme-focus rounded-2xl'
          : 'pointer-events-none'
      } ${className}`}
    >
      {/* Subtle Theme-Aware Ambient Halo */}
      <span
        aria-hidden="true"
        className="fox-ambient-halo pointer-events-none absolute inset-1.5 rounded-full opacity-75 dark:opacity-55 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle, ${asset.glowVar} 0%, transparent 72%)`,
        }}
      />

      {/* Interactive Click Ring Burst */}
      {isJumping && (
        <span
          key={`moment-ring-${clickSeq}`}
          aria-hidden="true"
          className="fox-click-ring pointer-events-none absolute inset-1 rounded-full"
        />
      )}

      {/* Subtle Ambient Twinkling Sparkles (Matched to FoxMascot Nordic Triad) */}
      {renderSparkles && (
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="fox-ambient-sparkles pointer-events-none absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] overflow-visible"
        >
          <path
            d="M18 26 L20.5 32.5 L27 35 L20.5 37.5 L18 44 L15.5 37.5 L9 35 L15.5 32.5 Z"
            fill="var(--brand-coral)"
            className="fox-sparkle-1"
            opacity="0.72"
          />
          <path
            d="M104 22 L106 27 L111 29 L106 31 L104 36 L102 31 L97 29 L102 27 Z"
            fill="var(--brand-sage)"
            className="fox-sparkle-2"
            opacity="0.7"
          />
          <circle
            cx="98"
            cy="92"
            r="2.5"
            fill="var(--brand-fjord)"
            className="fox-sparkle-3"
            opacity="0.65"
          />
        </svg>
      )}

      {/* High-Resolution Transparent Mascot Cutout with Gentle Pose Animation */}
      {!failed ? (
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={priority || size === 'xs' ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          onError={() => setFailed(true)}
          className={`mascot-moment-cutout relative z-10 object-contain ${
            sizeSpec.img
          } ${asset.animClass} ${isJumping ? 'is-fox-jumping' : ''}`}
        />
      ) : (
        <div
          role="img"
          aria-label={asset.alt}
          className={`relative z-10 rounded-3xl surface-2 border border-[var(--border-subtle)] flex flex-col items-center justify-center px-3 text-center ${sizeSpec.img}`}
        >
          <span className="font-display font-bold text-sm text-[var(--intent-primary)]">
            Achsoo!
          </span>
          <span className="text-[11px] text-[var(--fg-muted)] mt-0.5 truncate max-w-full">
            {asset.germanTitle}
          </span>
        </div>
      )}

      {/* Interactive German Expression Speech Pill on Click */}
      {interactive && showSpeechBubbleOnClick && showBubble && activePhrase && (
        <span
          key={`moment-bubble-${clickSeq}`}
          role="status"
          aria-live="polite"
          className={`fox-speech-pill pointer-events-none absolute z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium surface-paper backdrop-blur-md border border-[var(--border-strong)] shadow-md whitespace-nowrap ${bubblePositionClass}`}
        >
          <span className="font-display font-bold text-[var(--intent-primary)]">
            {activePhrase.de}
          </span>
          <span className="text-[var(--fg-muted)]" aria-hidden="true">
            ·
          </span>
          <span className="text-[var(--fg-secondary)] hidden sm:inline">
            {activePhrase.en}
          </span>
        </span>
      )}
    </div>
  );
};
