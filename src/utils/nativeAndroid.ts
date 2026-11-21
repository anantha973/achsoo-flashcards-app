import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';

export function isNativeAndroidApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function syncNativeSystemBars(
  colorMode: 'light' | 'dark',
  backgroundHex: string
): Promise<void> {
  if (!isNativeAndroidApp()) return;

  const isDark = colorMode === 'dark';

  // 1. Capacitor 8 built-in SystemBars controls BOTH top StatusBar & bottom NavigationBar
  try {
    await SystemBars.setStyle({
      style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
    });
  } catch {
    // Fallback handled below
  }

  // 2. Also sync StatusBar plugin for Android < 15 WebView compatibility
  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({
      style: isDark ? StatusBarStyle.Dark : StatusBarStyle.Light,
    });
    await StatusBar.setBackgroundColor({ color: backgroundHex });
  } catch {
    // Ignore when unsupported
  }
}

export function triggerNativeHaptic(pattern: number | number[] = 10): boolean {
  if (!isNativeAndroidApp()) return false;

  try {
    if (Array.isArray(pattern)) {
      if (pattern.length >= 3) {
        void Haptics.notification({ type: NotificationType.Success }).catch(
          () => {}
        );
      } else {
        void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
      }
      return true;
    }

    const style =
      pattern >= 20
        ? ImpactStyle.Heavy
        : pattern >= 12
          ? ImpactStyle.Medium
          : ImpactStyle.Light;

    void Haptics.impact({ style }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export async function hideNativeSplashScreen(): Promise<void> {
  if (!isNativeAndroidApp()) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 260 });
  } catch {
    // Ignore if already hidden
  }
}

export function registerAndroidBackButton(
  onBackPress: () => boolean
): () => void {
  if (!isNativeAndroidApp()) {
    return () => {};
  }

  let disposed = false;
  let removeHandle: (() => Promise<void>) | null = null;

  void CapApp.addListener('backButton', () => {
    const handled = onBackPress();
    if (!handled) {
      void CapApp.minimizeApp().catch(() => {});
    }
  })
    .then((handle) => {
      if (disposed) {
        void handle.remove();
      } else {
        removeHandle = () => handle.remove();
      }
    })
    .catch(() => {});

  return () => {
    disposed = true;
    if (removeHandle) {
      void removeHandle().catch(() => {});
    }
  };
}
