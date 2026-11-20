export type AppIconChapterId =
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'evening'
  | 'late-night'
  | 'sleep';

export interface AppIconChapter {
  slot: AppIconChapterId;
  shortLabel: string;
  title: string;
  scheduleLabel: string;
  startHour: number;
  endHour: number;
  favicon: string;
  appleTouchIcon: string;
  icon192: string;
  icon512: string;
  maskable512: string;
  manifest: string;
}

export const APP_ICON_CHANGE_EVENT = 'achsoo-app-icon-change';

const CHAPTER_BOUNDARY_HOURS = [0, 5, 9, 13, 17, 21] as const;

export const APP_ICON_CHAPTERS: ReadonlyArray<AppIconChapter> = [
  {
    slot: 'morning',
    shortLabel: 'Morning',
    title: 'Coffee & Cards',
    scheduleLabel: '05:00 – 09:00',
    startHour: 5,
    endHour: 9,
    favicon: '/icons/favicon-morning.png',
    appleTouchIcon: '/icons/apple-touch-icon-morning.png',
    icon192: '/icons/pwa-morning-192x192.png',
    icon512: '/icons/pwa-morning-512x512.png',
    maskable512: '/icons/pwa-morning-maskable-512x512.png',
    manifest: '/manifest-morning.webmanifest',
  },
  {
    slot: 'midday',
    shortLabel: 'Midday',
    title: 'Study Peak (HI! DE)',
    scheduleLabel: '09:00 – 13:00',
    startHour: 9,
    endHour: 13,
    favicon: '/icons/favicon-midday.png',
    appleTouchIcon: '/icons/apple-touch-icon-midday.png',
    icon192: '/icons/pwa-midday-192x192.png',
    icon512: '/icons/pwa-midday-512x512.png',
    maskable512: '/icons/pwa-midday-maskable-512x512.png',
    manifest: '/manifest-midday.webmanifest',
  },
  {
    slot: 'afternoon',
    shortLabel: 'Afternoon',
    title: 'HAUS Card',
    scheduleLabel: '13:00 – 17:00',
    startHour: 13,
    endHour: 17,
    favicon: '/icons/favicon-afternoon.png',
    appleTouchIcon: '/icons/apple-touch-icon-afternoon.png',
    icon192: '/icons/pwa-afternoon-192x192.png',
    icon512: '/icons/pwa-afternoon-512x512.png',
    maskable512: '/icons/pwa-afternoon-maskable-512x512.png',
    manifest: '/manifest-afternoon.webmanifest',
  },
  {
    slot: 'evening',
    shortLabel: 'Evening',
    title: 'Eureka Flag (Ah-ha!)',
    scheduleLabel: '17:00 – 21:00',
    startHour: 17,
    endHour: 21,
    favicon: '/icons/favicon-evening.png',
    appleTouchIcon: '/icons/apple-touch-icon-evening.png',
    icon192: '/icons/pwa-evening-192x192.png',
    icon512: '/icons/pwa-evening-512x512.png',
    maskable512: '/icons/pwa-evening-maskable-512x512.png',
    manifest: '/manifest-evening.webmanifest',
  },
  {
    slot: 'late-night',
    shortLabel: 'Late Night',
    title: 'Midnight Oil',
    scheduleLabel: '21:00 – 00:00',
    startHour: 21,
    endHour: 24,
    favicon: '/icons/favicon-late-night.png',
    appleTouchIcon: '/icons/apple-touch-icon-late-night.png',
    icon192: '/icons/pwa-late-night-192x192.png',
    icon512: '/icons/pwa-late-night-512x512.png',
    maskable512: '/icons/pwa-late-night-maskable-512x512.png',
    manifest: '/manifest-late-night.webmanifest',
  },
  {
    slot: 'sleep',
    shortLabel: 'Sleep',
    title: 'Study Sleepy',
    scheduleLabel: '00:00 – 05:00',
    startHour: 0,
    endHour: 5,
    favicon: '/icons/favicon-sleep.png',
    appleTouchIcon: '/icons/apple-touch-icon-sleep.png',
    icon192: '/icons/pwa-sleep-192x192.png',
    icon512: '/icons/pwa-sleep-512x512.png',
    maskable512: '/icons/pwa-sleep-maskable-512x512.png',
    manifest: '/manifest-sleep.webmanifest',
  },
];

const CHAPTER_BY_ID: Record<AppIconChapterId, AppIconChapter> =
  APP_ICON_CHAPTERS.reduce(
    (acc, chapter) => {
      acc[chapter.slot] = chapter;
      return acc;
    },
    {} as Record<AppIconChapterId, AppIconChapter>
  );

export function getTimeOfDayIconSlot(date: Date = new Date()): AppIconChapterId {
  const hour = date.getHours();
  if (hour >= 5 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 13) return 'midday';
  if (hour >= 13 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21) return 'late-night';
  return 'sleep';
}

export function getTimeOfDayIconAssets(
  slot: AppIconChapterId = getTimeOfDayIconSlot()
): AppIconChapter {
  return CHAPTER_BY_ID[slot] || CHAPTER_BY_ID.midday;
}

export function getMsUntilNextIconBoundary(now: Date = new Date()): number {
  const hour = now.getHours();
  const next = new Date(now.getTime());

  const nextBoundaryHour = CHAPTER_BOUNDARY_HOURS.find((h) => h > hour);
  if (typeof nextBoundaryHour === 'number') {
    next.setHours(nextBoundaryHour, 0, 1, 0);
  } else {
    // Wrap to 00:00 of the next day (sleep chapter boundary)
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 1, 0);
  }

  return Math.max(1000, next.getTime() - now.getTime());
}

export function applyTimeOfDayAppIcons(
  slot: AppIconChapterId = getTimeOfDayIconSlot()
): AppIconChapter {
  const assets = getTimeOfDayIconAssets(slot);

  if (typeof document === 'undefined') {
    return assets;
  }

  const head = document.head;

  // 1. Update favicon (re-append link on change so Chrome/Safari immediately swap the tab icon)
  let faviconLink = document.getElementById('app-favicon') as HTMLLinkElement | null;
  if (!faviconLink) {
    faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  }
  if (!faviconLink || faviconLink.getAttribute('href') !== assets.favicon) {
    if (faviconLink) {
      faviconLink.remove();
    }
    faviconLink = document.createElement('link');
    faviconLink.id = 'app-favicon';
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.setAttribute('sizes', '64x64');
    faviconLink.setAttribute('href', assets.favicon);
    head.appendChild(faviconLink);
  }

  // 2. Update Apple Touch Icon
  let appleIconLink = document.getElementById(
    'app-apple-touch-icon'
  ) as HTMLLinkElement | null;
  if (!appleIconLink) {
    appleIconLink = document.querySelector(
      'link[rel="apple-touch-icon"]'
    ) as HTMLLinkElement | null;
  }
  if (!appleIconLink) {
    appleIconLink = document.createElement('link');
    appleIconLink.id = 'app-apple-touch-icon';
    appleIconLink.rel = 'apple-touch-icon';
    appleIconLink.setAttribute('sizes', '180x180');
    head.appendChild(appleIconLink);
  }
  if (appleIconLink.getAttribute('href') !== assets.appleTouchIcon) {
    appleIconLink.setAttribute('href', assets.appleTouchIcon);
  }

  // 3. Deduplicate and update Web App Manifest link
  const manifestLinks = Array.from(
    document.querySelectorAll('link[rel="manifest"]')
  ) as HTMLLinkElement[];

  let primaryManifest =
    (document.getElementById('app-manifest') as HTMLLinkElement | null) ||
    manifestLinks[0] ||
    null;

  if (!primaryManifest) {
    primaryManifest = document.createElement('link');
    primaryManifest.id = 'app-manifest';
    primaryManifest.rel = 'manifest';
    head.appendChild(primaryManifest);
  }

  if (primaryManifest.getAttribute('href') !== assets.manifest) {
    primaryManifest.setAttribute('href', assets.manifest);
  }

  for (const link of manifestLinks) {
    if (link !== primaryManifest) {
      link.remove();
    }
  }

  document.documentElement.setAttribute('data-app-icon-slot', slot);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<AppIconChapter>(APP_ICON_CHANGE_EVENT, { detail: assets })
    );
  }

  return assets;
}

export function startTimeOfDayIconScheduler(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let timerId: number | null = null;
  let intervalId: number | null = null;
  let lastSlot = getTimeOfDayIconSlot();
  applyTimeOfDayAppIcons(lastSlot);

  const syncSlotIfNeeded = () => {
    const currentSlot = getTimeOfDayIconSlot();
    if (currentSlot !== lastSlot) {
      lastSlot = currentSlot;
      applyTimeOfDayAppIcons(currentSlot);
    }
  };

  const scheduleNext = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
    const delayMs = getMsUntilNextIconBoundary();
    timerId = window.setTimeout(() => {
      syncSlotIfNeeded();
      scheduleNext();
    }, delayMs);
  };

  const handleVisibilityOrFocus = () => {
    if (document.visibilityState === 'hidden') return;
    syncSlotIfNeeded();
    scheduleNext();
  };

  scheduleNext();
  // Backup check every 5 minutes in case long timers are throttled by background tabs
  intervalId = window.setInterval(syncSlotIfNeeded, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', handleVisibilityOrFocus);
  window.addEventListener('focus', handleVisibilityOrFocus);

  return () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
    if (intervalId !== null) {
      window.clearInterval(intervalId);
    }
    document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    window.removeEventListener('focus', handleVisibilityOrFocus);
  };
}
