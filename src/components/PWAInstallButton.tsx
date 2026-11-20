import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share, X } from 'lucide-react';
import {
  APP_ICON_CHANGE_EVENT,
  APP_ICON_CHAPTERS,
  AppIconChapterId,
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
  const [activeSlot, setActiveSlot] = useState<AppIconChapterId>(() =>
    getTimeOfDayIconSlot()
  );

  useEffect(() => {
    const handleIconChange = () => {
      setActiveSlot(getTimeOfDayIconSlot());
    };
    window.addEventListener(APP_ICON_CHANGE_EVENT, handleIconChange);
    return () => {
      window.removeEventListener(APP_ICON_CHANGE_EVENT, handleIconChange);
    };
  }, []);

  if (isInstalled || (!canPrompt && !isIos)) {
    return null;
  }

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
        className="inline-flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full surface-2 border border-[var(--border-subtle)] text-xs font-medium text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-terracotta shrink-0" />
        <span className="hidden sm:inline">Install</span>
      </button>

      {showIosGuide &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] h-[100dvh] w-screen flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={() => setShowIosGuide(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl surface-1 border border-[var(--border-subtle)] shadow-2xl p-5 space-y-4"
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
                  6 daily fox icons shift automatically around the clock.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                aria-label="Close install instructions"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-full text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {APP_ICON_CHAPTERS.map((chapter) => {
                const isActive = chapter.slot === activeSlot;
                return (
                  <div
                    key={chapter.slot}
                    className={`rounded-xl p-2.5 border text-center transition-colors ${
                      isActive
                        ? 'border-[var(--intent-primary)] bg-[var(--intent-primary-soft)]'
                        : 'border-[var(--border-subtle)] opacity-80'
                    }`}
                  >
                    <img
                      src={chapter.icon192}
                      alt={`${chapter.title} app icon`}
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl mx-auto shadow-sm"
                    />
                    <div className="mt-1.5 text-[11px] font-semibold text-[var(--fg-primary)] truncate">
                      {chapter.shortLabel}
                    </div>
                    <div className="text-[10px] text-[var(--fg-muted)] tabular-nums">
                      {chapter.scheduleLabel}
                    </div>
                  </div>
                );
              })}
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
          </div>,
          document.body
        )}
    </>
  );
};
