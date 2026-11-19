import React, { useEffect, useState } from 'react';
import {
  MASCOT_MOMENT_CATALOG,
  MascotMomentPoseId,
} from '../utils/mascotMoments';

export interface MascotMomentVisualProps {
  poseId: MascotMomentPoseId;
  size?: 'md' | 'lg' | 'hero';
  priority?: boolean;
  className?: string;
}

const SIZE_MAP: Record<
  NonNullable<MascotMomentVisualProps['size']>,
  string
> = {
  md: 'w-32 h-32 sm:w-36 sm:h-36',
  lg: 'w-36 h-36 sm:w-44 sm:h-44',
  hero: 'w-40 h-40 sm:w-48 sm:h-48',
};

export const MascotMomentVisual: React.FC<MascotMomentVisualProps> = ({
  poseId,
  size = 'lg',
  priority = false,
  className = '',
}) => {
  const asset = MASCOT_MOMENT_CATALOG[poseId];
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [poseId]);

  const sizeClass = SIZE_MAP[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${sizeClass} ${className}`}
    >
      {/* Soft theme-aware optical halo behind transparent cutout */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-full opacity-70 dark:opacity-55"
        style={{
          background:
            'radial-gradient(circle, var(--intent-primary-soft) 0%, transparent 72%)',
        }}
      />

      {!failed ? (
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          onError={() => setFailed(true)}
          className="mascot-moment-cutout relative z-10 w-full h-full object-contain"
        />
      ) : (
        <div
          role="img"
          aria-label={asset.alt}
          className="relative z-10 w-full h-full rounded-3xl surface-2 border border-[var(--border-subtle)] flex flex-col items-center justify-center px-3 text-center"
        >
          <span className="font-display font-bold text-lg text-[var(--intent-primary)]">
            Achsoo!
          </span>
          <span className="text-xs text-[var(--fg-muted)] mt-0.5">
            {asset.label}
          </span>
        </div>
      )}
    </div>
  );
};
