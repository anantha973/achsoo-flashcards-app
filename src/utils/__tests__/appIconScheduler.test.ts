import { describe, expect, it } from 'vitest';
import {
  APP_ICON_CHAPTERS,
  getMsUntilNextIconBoundary,
  getTimeOfDayIconAssets,
  getTimeOfDayIconSlot,
} from '../appIconScheduler';

describe('appIconScheduler (6-chapter 24-hour clock)', () => {
  it('exposes all 6 daily chapters with distinct manifests and PNG icons', () => {
    expect(APP_ICON_CHAPTERS).toHaveLength(6);
    const manifests = new Set(APP_ICON_CHAPTERS.map((c) => c.manifest));
    const favicons = new Set(APP_ICON_CHAPTERS.map((c) => c.favicon));
    expect(manifests.size).toBe(6);
    expect(favicons.size).toBe(6);
  });

  it('maps every hour of the 24-hour clock to the right chapter', () => {
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 0, 0, 0))).toBe('sleep');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 4, 59, 59))).toBe('sleep');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 5, 0, 0))).toBe('morning');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 8, 59, 59))).toBe('morning');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 9, 0, 0))).toBe('midday');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 12, 59, 59))).toBe('midday');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 13, 0, 0))).toBe('afternoon');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 16, 59, 59))).toBe('afternoon');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 17, 0, 0))).toBe('evening');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 20, 59, 59))).toBe('evening');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 21, 0, 0))).toBe('late-night');
    expect(getTimeOfDayIconSlot(new Date(2026, 5, 1, 23, 59, 59))).toBe('late-night');
  });

  it('returns matching manifest and icon assets per chapter', () => {
    const morning = getTimeOfDayIconAssets('morning');
    expect(morning.manifest).toBe('/manifest-morning.webmanifest');
    expect(morning.icon512).toBe('/icons/pwa-morning-512x512.png');

    const sleep = getTimeOfDayIconAssets('sleep');
    expect(sleep.manifest).toBe('/manifest-sleep.webmanifest');
    expect(sleep.appleTouchIcon).toBe('/icons/apple-touch-icon-sleep.png');
  });

  it('computes exact milliseconds until the next chapter boundary including midnight wrap', () => {
    const earlyMorning = new Date(2026, 5, 1, 4, 0, 0);
    expect(getMsUntilNextIconBoundary(earlyMorning)).toBe(60 * 60 * 1000 + 1000);

    const afternoon = new Date(2026, 5, 1, 16, 30, 0);
    expect(getMsUntilNextIconBoundary(afternoon)).toBe(30 * 60 * 1000 + 1000);

    const lateNight = new Date(2026, 5, 1, 23, 0, 0);
    expect(getMsUntilNextIconBoundary(lateNight)).toBe(60 * 60 * 1000 + 1000);
  });
});
