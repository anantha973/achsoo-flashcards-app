import React, { useCallback, useEffect, useRef, useState } from 'react';
import { triggerHapticFeedback } from '../utils/srsEngine';

export type FoxMascotPose =
  | 'aha'
  | 'juggler'
  | 'studio'
  | 'welcome'
  | 'runner'
  | 'champion';

export type FoxMascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export interface FoxPoseMetadata {
  pose: FoxMascotPose;
  src: string;
  title: string;
  germanTitle: string;
  alt: string;
  animClass: string;
  glowVar: string;
  phrases: ReadonlyArray<{ de: string; en: string }>;
}

export const FOX_POSE_CATALOG: Record<FoxMascotPose, FoxPoseMetadata> = {
  aha: {
    pose: 'aha',
    src: '/assets/mascot/fox-aha.png',
    title: 'The Aha! Moment',
    germanTitle: 'Der Ach-so!-Moment',
    alt: 'Achsoo Flashcard Fox having an Aha! moment with a glowing lightbulb and checkmark card',
    animClass: 'fox-pose-aha',
    glowVar: 'var(--intent-warning-soft)',
    phrases: [
      { de: 'Ach so!', en: 'Aha! Now it clicks!' },
      { de: 'Jetzt leuchtet’s ein!', en: 'That makes total sense!' },
      { de: 'Geistesblitz!', en: 'Flash of insight!' },
    ],
  },
  juggler: {
    pose: 'juggler',
    src: '/assets/mascot/fox-juggler.png',
    title: 'The Juggler',
    germanTitle: 'Der Karten-Jongleur',
    alt: 'Achsoo Flashcard Fox juggling colorful German flashcards in an arc',
    animClass: 'fox-pose-juggler',
    glowVar: 'var(--intent-primary-soft)',
    phrases: [
      { de: 'Im Fokus-Loop!', en: 'Juggling active cards!' },
      { de: 'Bleib im Rhythmus!', en: 'Stay in the groove!' },
      { de: 'Endspurt läuft!', en: 'Retention sweep active!' },
    ],
  },
  studio: {
    pose: 'studio',
    src: '/assets/mascot/fox-studio.png',
    title: 'The Studio Fox',
    germanTitle: 'Der Studio-Fuchs',
    alt: 'Achsoo Studio Fox wearing glasses and a graduation cap while reading a grammar book',
    animClass: 'fox-pose-studio',
    glowVar: 'var(--intent-primary-soft)',
    phrases: [
      { de: 'Schlau wie ein Fuchs!', en: 'Clever as a fox!' },
      { de: 'Alles im Blick!', en: 'Everything reviewed!' },
      { de: 'Wort-Anatomie sitzt!', en: 'Grammar mastered!' },
    ],
  },
  welcome: {
    pose: 'welcome',
    src: '/assets/mascot/fox-welcome.png',
    title: 'The Welcome',
    germanTitle: 'Willkommen!',
    alt: 'Achsoo Flashcard Fox warmly welcoming you with flashcards in hand',
    animClass: 'fox-pose-welcome',
    glowVar: 'var(--intent-primary-soft)',
    phrases: [
      { de: 'Los geht’s!', en: 'Let’s dive in!' },
      { de: 'Bereit für neue Wörter?', en: 'Ready for new words?' },
      { de: 'Karte umdrehen!', en: 'Flip the card to start!' },
    ],
  },
  runner: {
    pose: 'runner',
    src: '/assets/mascot/fox-runner.png',
    title: 'The Runner',
    germanTitle: 'Auf Erfolgskurs',
    alt: 'Achsoo Flashcard Fox sprinting forward carrying a stack of flashcards',
    animClass: 'fox-pose-runner',
    glowVar: 'var(--intent-warning-soft)',
    phrases: [
      { de: 'Starkes Tempo!', en: 'Great momentum!' },
      { de: 'Serie hält!', en: 'Streak is rolling!' },
      { de: 'Unaufhaltsam!', en: 'Unstoppable pace!' },
    ],
  },
  champion: {
    pose: 'champion',
    src: '/assets/mascot/fox-champion.png',
    title: 'The Champion',
    germanTitle: 'Deck-Champion',
    alt: 'Achsoo Champion Fox cheering with stars and confetti flashcards',
    animClass: 'fox-pose-champion',
    glowVar: 'var(--intent-success-soft)',
    phrases: [
      { de: 'Deck geschafft!', en: 'Deck mastered!' },
      { de: 'Meisterhaft!', en: 'Masterful recall!' },
      { de: '100 % Fuchs-Power!', en: '100% Fox power!' },
    ],
  },
};

const SIZE_CLASSES: Record<
  FoxMascotSize,
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
    wrapper: 'w-24 h-24 sm:w-28 sm:h-28',
    img: 'w-24 h-24 sm:w-28 sm:h-28',
    showAmbientSparkles: true,
  },
  xl: {
    wrapper: 'w-32 h-32 sm:w-36 sm:h-36',
    img: 'w-32 h-32 sm:w-36 sm:h-36',
    showAmbientSparkles: true,
  },
  hero: {
    wrapper: 'w-36 h-36 sm:w-44 sm:h-44',
    img: 'w-36 h-36 sm:w-44 sm:h-44',
    showAmbientSparkles: true,
  },
};

const POSE_CYCLE_ORDER: ReadonlyArray<FoxMascotPose> = [
  'aha',
  'juggler',
  'champion',
  'studio',
  'runner',
  'welcome',
];

export interface FoxMascotProps {
  pose: FoxMascotPose;
  size?: FoxMascotSize;
  interactive?: boolean;
  cyclePosesOnClick?: boolean;
  showSpeechBubbleOnClick?: boolean;
  speechPlacement?: 'top' | 'bottom' | 'right';
  className?: string;
  onClick?: (activePose: FoxMascotPose) => void;
}

export const FoxMascot: React.FC<FoxMascotProps> = ({
  pose,
  size = 'md',
  interactive = false,
  cyclePosesOnClick = false,
  showSpeechBubbleOnClick = true,
  speechPlacement = 'top',
  className = '',
  onClick,
}) => {
  const [currentPose, setCurrentPose] = useState<FoxMascotPose>(pose);
  const [isJumping, setIsJumping] = useState(false);
  const [clickSeq, setClickSeq] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [imgError, setImgError] = useState(false);

  const jumpTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentPose(pose);
    setImgError(false);
  }, [pose]);

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

  const meta = FOX_POSE_CATALOG[currentPose] || FOX_POSE_CATALOG.aha;
  const sizeSpec = SIZE_CLASSES[size];
  const activePhrase = meta.phrases[phraseIndex % meta.phrases.length];

  const handleInteract = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if (!interactive) return;
      e.stopPropagation();
      triggerHapticFeedback(12);

      let nextPose = currentPose;
      if (cyclePosesOnClick) {
        const idx = POSE_CYCLE_ORDER.indexOf(currentPose);
        nextPose = POSE_CYCLE_ORDER[(idx + 1) % POSE_CYCLE_ORDER.length];
        setCurrentPose(nextPose);
      }

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

      onClick?.(nextPose);
    },
    [
      currentPose,
      cyclePosesOnClick,
      interactive,
      onClick,
      showSpeechBubbleOnClick,
    ]
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
          ? `${meta.title} (${meta.germanTitle}) — Click to animate`
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
        className="fox-ambient-halo pointer-events-none absolute inset-1 rounded-full opacity-75 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle, ${meta.glowVar} 0%, transparent 72%)`,
        }}
      />

      {/* Click Ring Burst */}
      {isJumping && (
        <span
          key={`fox-ring-${clickSeq}`}
          aria-hidden="true"
          className="fox-click-ring pointer-events-none absolute inset-1 rounded-full"
        />
      )}

      {/* Ambient Floating Sparkles for Medium/Large Displays */}
      {sizeSpec.showAmbientSparkles && (
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="fox-ambient-sparkles pointer-events-none absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] overflow-visible"
        >
          <path
            d="M18 26 L20.5 32.5 L27 35 L20.5 37.5 L18 44 L15.5 37.5 L9 35 L15.5 32.5 Z"
            fill="var(--brand-coral)"
            className="fox-sparkle-1"
            opacity="0.78"
          />
          <path
            d="M104 22 L106 27 L111 29 L106 31 L104 36 L102 31 L97 29 L102 27 Z"
            fill="var(--brand-sage)"
            className="fox-sparkle-2"
            opacity="0.75"
          />
          <circle
            cx="98"
            cy="92"
            r="2.6"
            fill="var(--brand-fjord)"
            className="fox-sparkle-3"
            opacity="0.7"
          />
        </svg>
      )}

      {/* High-DPI Transparent Mascot Sprite */}
      {!imgError ? (
        <img
          src={meta.src}
          alt={meta.alt}
          referrerPolicy="no-referrer"
          draggable={false}
          onError={() => setImgError(true)}
          className={`fox-mascot-img relative z-10 object-contain drop-shadow-sm ${
            sizeSpec.img
          } ${meta.animClass} ${isJumping ? 'is-fox-jumping' : ''}`}
        />
      ) : (
        <span
          aria-label={meta.alt}
          className={`relative z-10 flex items-center justify-center rounded-2xl bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] font-display font-bold text-xs ${sizeSpec.img}`}
        >
          Achsoo!
        </span>
      )}

      {/* Interactive German Expression Speech Pill on Click */}
      {interactive && showSpeechBubbleOnClick && showBubble && (
        <span
          key={`fox-bubble-${clickSeq}`}
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
