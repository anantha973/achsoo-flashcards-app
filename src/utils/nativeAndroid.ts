import {
  Capacitor,
  registerPlugin,
  SystemBars,
  SystemBarsStyle,
} from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import type { AppIconChapterId } from './appIconScheduler';

export type BubbleHapticStyle = 'tick' | 'back' | 'confirm';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

export interface ReminderPreferences {
  enabled: boolean;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  inactivityEnabled: boolean;
}

export interface StudyReminderSnapshot {
  streakDays: number;
  reviewedToday: number;
  dueCount: number;
  lastStudyMs: number;
  dailyGoalMet: boolean;
}

export interface DynamicIconStatus {
  autoEnabled: boolean;
  activeSlot: AppIconChapterId;
  targetSlot: AppIconChapterId;
  currentClockSlot: AppIconChapterId;
}

interface AchsooNativePluginInterface {
  triggerBubbleHaptic(options: { style: BubbleHapticStyle }): Promise<void>;
  getNotificationPermission(): Promise<{ status: NotificationPermissionStatus }>;
  requestNotificationPermission(): Promise<{ status: NotificationPermissionStatus }>;
  syncReminders(
    options: ReminderPreferences & StudyReminderSnapshot
  ): Promise<{ scheduled: boolean }>;
  sendTestNotification(options: {
    poseIndex: number;
  }): Promise<{ sent: boolean; reason?: string }>;
  syncDynamicIcon(options: {
    autoEnabled: boolean;
    manualSlot: AppIconChapterId;
    applyNow: boolean;
  }): Promise<DynamicIconStatus>;
  getDynamicIconStatus(): Promise<DynamicIconStatus>;
}

const AchsooNative = registerPlugin<AchsooNativePluginInterface>('AchsooNative');

const REMINDER_PREFS_STORAGE_KEY = 'achsoo_reminder_prefs_v1';
const LAST_STUDY_TS_STORAGE_KEY = 'achsoo_last_study_ts_v1';
const AUTO_ICON_PREF_STORAGE_KEY = 'achsoo_android_auto_icon_v1';

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  enabled: true,
  morningEnabled: true,
  eveningEnabled: true,
  inactivityEnabled: true,
};

export function isNativeAndroidApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function loadReminderPreferences(): ReminderPreferences {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_REMINDER_PREFERENCES };
  }
  try {
    const raw = window.localStorage.getItem(REMINDER_PREFS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_REMINDER_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<ReminderPreferences>;
    return {
      enabled:
        typeof parsed.enabled === 'boolean'
          ? parsed.enabled
          : DEFAULT_REMINDER_PREFERENCES.enabled,
      morningEnabled:
        typeof parsed.morningEnabled === 'boolean'
          ? parsed.morningEnabled
          : DEFAULT_REMINDER_PREFERENCES.morningEnabled,
      eveningEnabled:
        typeof parsed.eveningEnabled === 'boolean'
          ? parsed.eveningEnabled
          : DEFAULT_REMINDER_PREFERENCES.eveningEnabled,
      inactivityEnabled:
        typeof parsed.inactivityEnabled === 'boolean'
          ? parsed.inactivityEnabled
          : DEFAULT_REMINDER_PREFERENCES.inactivityEnabled,
    };
  } catch {
    return { ...DEFAULT_REMINDER_PREFERENCES };
  }
}

export function saveReminderPreferences(prefs: ReminderPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      REMINDER_PREFS_STORAGE_KEY,
      JSON.stringify(prefs)
    );
  } catch {
    // Ignore storage quota errors
  }
}

export function loadLastStudyTimestamp(): number {
  if (typeof window === 'undefined') return Date.now();
  try {
    const raw = window.localStorage.getItem(LAST_STUDY_TS_STORAGE_KEY);
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : Date.now();
  } catch {
    return Date.now();
  }
}

export function recordLastStudyTimestamp(ts: number = Date.now()): number {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LAST_STUDY_TS_STORAGE_KEY, String(ts));
    } catch {
      // Ignore storage errors
    }
  }
  return ts;
}

export function loadDynamicIconAutoPreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(AUTO_ICON_PREF_STORAGE_KEY);
    if (raw === null) return true;
    return raw !== 'false';
  } catch {
    return true;
  }
}

export function saveDynamicIconAutoPreference(autoEnabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      AUTO_ICON_PREF_STORAGE_KEY,
      autoEnabled ? 'true' : 'false'
    );
  } catch {
    // Ignore storage errors
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

/**
 * Triggers a crisp, quiet Gboard-style micro-actuator bubble tick on native Android
 * (CLOCK_TICK / KEYBOARD_TAP / CONFIRM) without spinning a buzzy vibration motor.
 */
export function triggerBubbleHaptic(style: BubbleHapticStyle = 'tick'): boolean {
  if (!isNativeAndroidApp()) return false;
  try {
    void AchsooNative.triggerBubbleHaptic({ style }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export async function getNativeNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNativeAndroidApp()) return 'unsupported';
  try {
    const res = await AchsooNative.getNotificationPermission();
    return res?.status ?? 'prompt';
  } catch {
    return 'unsupported';
  }
}

export async function requestNativeNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNativeAndroidApp()) return 'unsupported';
  try {
    const res = await AchsooNative.requestNotificationPermission();
    return res?.status ?? 'denied';
  } catch {
    return 'denied';
  }
}

export async function syncNativeStudyReminders(
  prefs: ReminderPreferences,
  snapshot: StudyReminderSnapshot
): Promise<boolean> {
  if (!isNativeAndroidApp()) return false;
  try {
    const res = await AchsooNative.syncReminders({
      ...prefs,
      ...snapshot,
    });
    return Boolean(res?.scheduled);
  } catch {
    return false;
  }
}

export async function sendNativeTestNotification(
  poseIndex: number
): Promise<{ sent: boolean; reason?: string }> {
  if (!isNativeAndroidApp()) {
    return { sent: false, reason: 'web_preview' };
  }
  try {
    return await AchsooNative.sendTestNotification({ poseIndex });
  } catch {
    return { sent: false, reason: 'native_error' };
  }
}

export async function syncNativeDynamicIcon(options: {
  autoEnabled: boolean;
  manualSlot: AppIconChapterId;
  applyNow?: boolean;
}): Promise<DynamicIconStatus | null> {
  if (!isNativeAndroidApp()) return null;
  try {
    return await AchsooNative.syncDynamicIcon({
      autoEnabled: options.autoEnabled,
      manualSlot: options.manualSlot,
      applyNow: Boolean(options.applyNow),
    });
  } catch {
    return null;
  }
}

export async function getNativeDynamicIconStatus(): Promise<DynamicIconStatus | null> {
  if (!isNativeAndroidApp()) return null;
  try {
    return await AchsooNative.getDynamicIconStatus();
  } catch {
    return null;
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
    if (handled) {
      triggerBubbleHaptic('back');
    } else {
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
