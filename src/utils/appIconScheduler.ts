export type AppIconTimeSlot = 'day' | 'night';

export interface AppIconAssets {
  slot: AppIconTimeSlot;
  title: string;
  scheduleLabel: string;
  favicon: string;
  appleTouchIcon: string;
  icon192: string;
  icon512: string;
  maskable512: string;
  manifest: string;
}

export const DAY_START_HOUR = 6;
export const NIGHT_START_HOUR = 18;
export const APP_ICON_CHANGE_EVENT = 'achsoo-app-icon-change';

const APP_ICON_ASSETS: Record<AppIconTimeSlot, AppIconAssets> = {
  day: {
    slot: 'day',
    title: 'Daytime Icon (HI! DE)',
    scheduleLabel: '06:00 – 18:00',
    favicon: '/favicon-day.png',
    appleTouchIcon: '/apple-touch-icon-day.png',
    icon192: '/pwa-day-192x192.png',
    icon512: '/pwa-day-512x512.png',
    maskable512: '/pwa-day-maskable-512x512.png',
    manifest: '/manifest-day.webmanifest',
  },
  night: {
    slot: 'night',
    title: 'Evening Icon (Ah-ha! JA!)',
    scheduleLabel: '18:00 – 06:00',
    favicon: '/favicon-night.png',
    appleTouchIcon: '/apple-touch-icon-night.png',
    icon192: '/pwa-night-192x192.png',
    icon512: '/pwa-night-512x512.png',
    maskable512: '/pwa-night-maskable-512x512.png',
    manifest: '/manifest-night.webmanifest',
  },
};

export function getTimeOfDayIconSlot(date: Date = new Date()): AppIconTimeSlot {
  const hour = date.getHours();
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? 'day' : 'night';
}

export function getTimeOfDayIconAssets(
  slot: AppIconTimeSlot = getTimeOfDayIconSlot()
): AppIconAssets {
  return APP_ICON_ASSETS[slot];
}

export function getMsUntilNextIconBoundary(now: Date = new Date()): number {
  const next = new Date(now.getTime());
  const hour = now.getHours();

  if (hour < DAY_START_HOUR) {
    next.setHours(DAY_START_HOUR, 0, 1, 0);
  } else if (hour < NIGHT_START_HOUR) {
    next.setHours(NIGHT_START_HOUR, 0, 1, 0);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(DAY_START_HOUR, 0, 1, 0);
  }

  return Math.max(1000, next.getTime() - now.getTime());
}

export function applyTimeOfDayAppIcons(
  slot: AppIconTimeSlot = getTimeOfDayIconSlot()
): AppIconAssets {
  const assets = APP_ICON_ASSETS[slot];

  if (typeof document === 'undefined') {
    return assets;
  }

  const head = document.head;

  // 1. Update favicon
  let faviconLink = document.getElementById('app-favicon') as HTMLLinkElement | null;
  if (!faviconLink) {
    faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  }
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.id = 'app-favicon';
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.setAttribute('sizes', '64x64');
    head.appendChild(faviconLink);
  }
  if (faviconLink.getAttribute('href') !== assets.favicon) {
    faviconLink.type = 'image/png';
    faviconLink.setAttribute('sizes', '64x64');
    faviconLink.setAttribute('href', assets.favicon);
  }

  // 2. Update Apple Touch Icon (iOS / iPadOS Add to Home Screen)
  let appleIconLink = document.getElementById('app-apple-touch-icon') as HTMLLinkElement | null;
  if (!appleIconLink) {
    appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
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

  // 3. Deduplicate and update Web App Manifest link (handles VitePWA-injected link cleanly)
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
      new CustomEvent<AppIconAssets>(APP_ICON_CHANGE_EVENT, { detail: assets })
    );
  }

  return assets;
}

export function startTimeOfDayIconScheduler(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let timerId: number | null = null;
  let lastSlot = getTimeOfDayIconSlot();
  applyTimeOfDayAppIcons(lastSlot);

  const scheduleNext = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
    const delayMs = getMsUntilNextIconBoundary();
    timerId = window.setTimeout(() => {
      const nextSlot = getTimeOfDayIconSlot();
      lastSlot = nextSlot;
      applyTimeOfDayAppIcons(nextSlot);
      scheduleNext();
    }, delayMs);
  };

  const handleVisibilityOrFocus = () => {
    if (document.visibilityState === 'hidden') return;
    const currentSlot = getTimeOfDayIconSlot();
    if (currentSlot !== lastSlot) {
      lastSlot = currentSlot;
      applyTimeOfDayAppIcons(currentSlot);
    }
    scheduleNext();
  };

  scheduleNext();
  document.addEventListener('visibilitychange', handleVisibilityOrFocus);
  window.addEventListener('focus', handleVisibilityOrFocus);

  return () => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
    document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    window.removeEventListener('focus', handleVisibilityOrFocus);
  };
}
