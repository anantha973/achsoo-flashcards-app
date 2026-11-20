import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Card } from './HeroPrimitives';
import { MascotMomentVisual } from './MascotMomentVisual';
import { MascotMomentCard } from '../utils/mascotMoments';

export interface MilestoneInterludeCardProps {
  moment: MascotMomentCard;
  clearedCount: number;
  totalCount: number;
  onContinue: () => void;
}

export const MilestoneInterludeCard: React.FC<MilestoneInterludeCardProps> = ({
  moment,
  clearedCount,
  totalCount,
  onContinue,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      onContinue();
    }
  };

  return (
    <Card.Root
      role="region"
      aria-live="polite"
      aria-label={`${moment.kicker}: ${moment.headline}`}
      onClick={onContinue}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="milestone-interlude-enter flex-1 flex flex-col items-center justify-center text-center px-6 py-8 sm:px-10 sm:py-10 surface-paper cursor-pointer select-none min-h-[340px]"
    >
      <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
        {/* Quiet unboxed progress metadata */}
        <p className="text-xs font-medium tracking-wide text-[var(--fg-muted)] tabular-nums">
          <span>{moment.kicker}</span>
          <span aria-hidden="true" className="mx-1.5 opacity-55">
            ·
          </span>
          <span>
            {clearedCount}/{totalCount} Karten
          </span>
        </p>

        {/* Animated, Twinkling & Interactive Floating Fox Cutout */}
        <MascotMomentVisual
          poseId={moment.poseId}
          size="lg"
          interactive
          speechPlacement="top"
          priority
        />

        {/* Display Headline & Encouraging Subline */}
        <div className="space-y-1.5">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--fg-primary)] text-balance">
            {moment.headline}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed max-w-sm mx-auto">
            {moment.subline}
          </p>
        </div>

        {/* Full-Touch Continue CTA (>= 48px mobile thumb target) */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <Button
            intent="primary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className="min-h-[48px] px-6 whitespace-nowrap"
          >
            <span>{moment.ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <span className="text-[11px] text-[var(--fg-muted)]">
            Tippen oder Leertaste zum Weiterlernen
          </span>
        </div>
      </div>
    </Card.Root>
  );
};
