import React, { useEffect, useState } from 'react';
import { Download, Moon, Share, Sun, X } from 'lucide-react';
import {
  APP_ICON_CHANGE_EVENT,
  AppIconTimeSlot,
  getTimeOfDayIconAssets,
  getTimeOfDayIconSlot,
} from '../utils/appIconScheduler';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsInstalled(standalone);

    const ua = window.navigator.userAgent;
    const iosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' &&
        window.navigator.maxTouchPoints > 1);
    setIsIos(iosDevice && !standalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    return outcome === 'accepted';
  };

  return {
    canPrompt: Boolean(deferredPrompt),
    isInstalled,
    isIos,
    promptInstall,
  };
}

export const PWAInstallButton: React.FC = () => {
  const { canPrompt, isInstalled, isIos, promptInstall } = usePWAInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [iconSlot, setIconSlot] = useState<AppIconTimeSlot>(() =>
    getTimeOfDayIconSlot()
  );

  useEffect(() => {
    const handleIconChange = () => {
      setIconSlot(getTimeOfDayIconSlot());
    };
    window.addEventListener(APP_ICON_CHANGE_EVENT, handleIconChange);
    return () => {
      window.removeEventListener(APP_ICON_CHANGE_EVENT, handleIconChange);
    };
  }, []);

  if (isInstalled || (!canPrompt && !isIos)) {
    return null;
  }

  const dayAssets = getTimeOfDayIconAssets('day');
  const nightAssets = getTimeOfDayIconAssets('night');

  const handleClick = async () => {
    if (canPrompt) {
      await promptInstall();
      return;
    }
    if (isIos) {
      setShowIosGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        aria-label="Add Achsoo to Home Screen"
        title="Install Achsoo to Home Screen"
        className="inline-flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full surface-2 border border-[var(--border-subtle)] text-xs font-medium text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-terracotta shrink-0" />
        <span className="hidden sm:inline">Install</span>
      </button>

      {showIosGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl surface-1 border border-[var(--border-subtle)] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="ios-install-title"
                  className="text-base font-semibold text-[var(--fg-primary)]"
                >
                  Add Achsoo to Home Screen
                </h2>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                  App icon adapts automatically by time of day.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                aria-label="Close install instructions"
                className="p-1.5 rounded-full text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`rounded-xl p-3 border text-center transition-colors ${
                  iconSlot === 'day'
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--border-subtle)] opacity-75'
                }`}
              >
                <img
                  src={dayAssets.icon192}
                  alt="Daytime HI! DE Fox app icon"
                  className="w-16 h-16 rounded-2xl mx-auto shadow-md"
                />
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--fg-primary)]">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Day</span>
                </div>
                <p className="text-[11px] text-[var(--fg-muted)]">
                  {dayAssets.scheduleLabel}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 border text-center transition-colors ${
                  iconSlot === 'night'
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--border-subtle)] opacity-75'
                }`}
              >
                <img
                  src={nightAssets.icon192}
                  alt="Evening Ah-ha! JA! Fox app icon"
                  className="w-16 h-16 rounded-2xl mx-auto shadow-md"
                />
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--fg-primary)]">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Evening</span>
                </div>
                <p className="text-[11px] text-[var(--fg-muted)]">
                  {nightAssets.scheduleLabel}
                </p>
              </div>
            </div>

            <ol className="text-xs text-[var(--fg-secondary)] space-y-2 list-decimal list-inside">
              <li>
                Tap the <Share className="inline w-3.5 h-3.5 mx-0.5 -mt-0.5" />{' '}
                <strong>Share</strong> button in Safari&apos;s toolbar.
              </li>
              <li>
                Scroll down and tap <strong>Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong>Add</strong> to pin Achsoo with the active icon.
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};
