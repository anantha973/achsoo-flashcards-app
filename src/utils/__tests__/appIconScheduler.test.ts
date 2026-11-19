import { describe, expect, it } from 'vitest';
import {
  getMsUntilNextIconBoundary,
  getTimeOfDayIconAssets,
  getTimeOfDayIconSlot,
} from '../appIconScheduler';

describe('appIconScheduler', () => {
  it('selects daytime icon from 06:00 through 17:59', () => {
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 6, 0, 0))).toBe('day');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 12, 30, 0))).toBe('day');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 17, 59, 59))).toBe('day');
  });

  it('selects evening/night icon from 18:00 through 05:59', () => {
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 18, 0, 0))).toBe('night');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 23, 45, 0))).toBe('night');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 0, 0, 0))).toBe('night');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 5, 59, 59))).toBe('night');
  });

  it('maps day and night slots to matching high-res manifests and PNG assets', () => {
    const day = getTimeOfDayIconAssets('day');
    expect(day.manifest).toBe('/manifest-day.webmanifest');
    expect(day.appleTouchIcon).toBe('/apple-touch-icon-day.png');
    expect(day.icon512).toBe('/pwa-day-512x512.png');

    const night = getTimeOfDayIconAssets('night');
    expect(night.manifest).toBe('/manifest-night.webmanifest');
    expect(night.appleTouchIcon).toBe('/apple-touch-icon-night.png');
    expect(night.icon512).toBe('/pwa-night-512x512.png');
  });

  it('computes milliseconds until next 06:00 or 18:00 transition', () => {
    const morning = new Date(2026, 5, 1, 5, 0, 0);
    expect(getMsUntilNextIconBoundary(morning)).toBe(60 * 60 * 1000 + 1000);

    const afternoon = new Date(2026, 5, 1, 17, 30, 0);
    expect(getMsUntilNextIconBoundary(afternoon)).toBe(30 * 60 * 1000 + 1000);

    const lateNight = new Date(2026, 5, 1, 23, 0, 0);
    expect(getMsUntilNextIconBoundary(lateNight)).toBe(
      7 * 60 * 60 * 1000 + 1000
    );
  });
});
