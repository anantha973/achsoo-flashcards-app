import {
  Capacitor,
  type PluginListenerHandle,
  registerPlugin,
  SystemBars,
  SystemBarsStyle,
} from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import type { AppIconChapterId } from './appIconScheduler';

export type BubbleHapticStyle = 'tick' | 'back' | 'confirm';

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unsupported';

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

export interface InstalledAppVersionInfo {
  versionCode: number;
  versionName: string;
  hasReadyUpdate: boolean;
}

export interface GitHubUpdateCheckResult {
  updateAvailable: boolean;
  currentVersionCode: number;
  currentVersionName: string;
  latestVersionCode: number;
  latestVersionName: string;
  tagName: string;
  publishedAt: string;
  apkUrl: string;
  apkSizeBytes: number;
  sha256: string;
  releaseNotes: string;
  signedRelease: boolean;
}

export interface UpdateDownloadProgress {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
}

export type InstallUpdateStatus = 'installing' | 'permission_needed' | 'missing_apk';

interface AchsooNativePluginInterface {
  triggerBubbleHaptic(options: { style: BubbleHapticStyle }): Promise<void>;
  getNotificationPermission(): Promise<{ status: NotificationPermissionStatus }>;
  requestNotificationPermission(): Promise<{
    status: NotificationPermissionStatus;
  }>;
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
  getInstalledAppVersion(): Promise<InstalledAppVersionInfo>;
  checkForGitHubUpdate(options: {
    repo: string;
  }): Promise<GitHubUpdateCheckResult>;
  downloadAndInstallUpdate(options: {
    apkUrl: string;
    expectedSha256?: string;
  }): Promise<{ status: InstallUpdateStatus }>;
  installReadyUpdate(): Promise<{ status: InstallUpdateStatus }>;
  addListener(
    eventName: 'updateDownloadProgress',
    listenerFunc: (event: UpdateDownloadProgress) => void
  ): Promise<PluginListenerHandle>;
}

const AchsooNative = registerPlugin<AchsooNativePluginInterface>('AchsooNative');

const REMINDER_PREFS_STORAGE_KEY = 'achsoo_reminder_prefs_v1';
const LAST_STUDY_TS_STORAGE_KEY = 'achsoo_last_study_ts_v1';
const AUTO_ICON_PREF_STORAGE_KEY = 'achsoo_android_auto_icon_v1';
const GITHUB_REPO_STORAGE_KEY = 'achsoo_github_repo_v1';

const VALID_GITHUB_REPO_REGEX = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

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

export function isValidGitHubRepoSlug(repo: string): boolean {
  return VALID_GITHUB_REPO_REGEX.test(repo.trim());
}

export function getBuildTimeGitHubRepo(): string {
  const envRepo =
    typeof import.meta !== 'undefined' && import.meta.env
      ? String(import.meta.env.VITE_GITHUB_REPO || '').trim()
      : '';
  return isValidGitHubRepoSlug(envRepo) ? envRepo : '';
}

export function getBuildTimeAppVersion(): {
  versionCode: number;
  versionName: string;
} {
  const rawCode =
    typeof import.meta !== 'undefined' && import.meta.env
      ? Number(import.meta.env.VITE_APP_VERSION_CODE || 3)
      : 3;
  const rawName =
    typeof import.meta !== 'undefined' && import.meta.env
      ? String(import.meta.env.VITE_APP_VERSION_NAME || '1.2.0').trim()
      : '1.2.0';
  return {
    versionCode: Number.isFinite(rawCode) && rawCode > 0 ? rawCode : 3,
    versionName: rawName || '1.2.0',
  };
}

export function getConfiguredGitHubRepo(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(GITHUB_REPO_STORAGE_KEY)?.trim() || '';
      if (isValidGitHubRepoSlug(saved)) {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
  }
  return getBuildTimeGitHubRepo();
}

export function saveConfiguredGitHubRepo(repo: string): string {
  const cleaned = repo
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    try {
      if (!cleaned) {
        window.localStorage.removeItem(GITHUB_REPO_STORAGE_KEY);
      } else if (isValidGitHubRepoSlug(cleaned)) {
        window.localStorage.setItem(GITHUB_REPO_STORAGE_KEY, cleaned);
      }
    } catch {
      // Ignore storage errors
    }
  }
  return isValidGitHubRepoSlug(cleaned) ? cleaned : '';
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

  try {
    await SystemBars.setStyle({
      style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
    });
  } catch {
    // Fallback handled below
  }

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

export async function getInstalledAndroidVersion(): Promise<InstalledAppVersionInfo> {
  const fallback = getBuildTimeAppVersion();
  if (!isNativeAndroidApp()) {
    return {
      versionCode: fallback.versionCode,
      versionName: fallback.versionName,
      hasReadyUpdate: false,
    };
  }
  try {
    return await AchsooNative.getInstalledAppVersion();
  } catch {
    return {
      versionCode: fallback.versionCode,
      versionName: fallback.versionName,
      hasReadyUpdate: false,
    };
  }
}

export async function checkForGitHubReleaseUpdate(
  repo: string
): Promise<GitHubUpdateCheckResult> {
  const cleanedRepo = repo.trim();
  if (!isValidGitHubRepoSlug(cleanedRepo)) {
    throw new Error('Enter a valid GitHub repository (owner/repo).');
  }

  if (isNativeAndroidApp()) {
    return AchsooNative.checkForGitHubUpdate({ repo: cleanedRepo });
  }

  // Web browser preview fallback: query public GitHub Releases API directly
  const current = getBuildTimeAppVersion();
  const res = await fetch(
    `https://api.github.com/repos/${cleanedRepo}/releases/latest`,
    {
      headers: { Accept: 'application/vnd.github+json' },
    }
  );
  if (res.status === 404) {
    throw new Error('No published GitHub Releases found for this repository yet.');
  }
  if (!res.ok) {
    throw new Error(`GitHub Releases check failed (HTTP ${res.status}).`);
  }

  const json = (await res.json()) as {
    tag_name?: string;
    published_at?: string;
    body?: string;
    assets?: Array<{
      name?: string;
      size?: number;
      browser_download_url?: string;
    }>;
  };
  const assets = Array.isArray(json.assets) ? json.assets : [];
  const apkAsset =
    assets.find((a) => a.name?.toLowerCase() === 'achsoo.apk') ||
    assets.find((a) => a.name?.toLowerCase().endsWith('.apk'));

  if (!apkAsset?.browser_download_url) {
    throw new Error('Latest GitHub Release does not contain an APK asset yet.');
  }

  let parsedApkUrl: URL;
  try {
    parsedApkUrl = new URL(apkAsset.browser_download_url);
  } catch {
    throw new Error('Invalid APK download URL returned by GitHub Releases.');
  }
  const allowedWebHosts = new Set([
    'github.com',
    'objects.githubusercontent.com',
    'release-assets.githubusercontent.com',
    'github-releases.githubusercontent.com',
  ]);
  if (
    parsedApkUrl.protocol !== 'https:' ||
    !allowedWebHosts.has(parsedApkUrl.hostname.toLowerCase())
  ) {
    throw new Error('Blocked untrusted APK download host.');
  }

  const tagName = json.tag_name || '';
  const numMatch = tagName.match(/(\d+)(?!.*\d)/);
  const parsedNum = numMatch ? Number(numMatch[1]) : 0;
  const latestVersionCode =
    parsedNum > 0 ? (parsedNum < 100 ? 100 + parsedNum : parsedNum) : 0;
  const latestVersionName = tagName.replace(/^v/i, '') || 'latest';

  return {
    updateAvailable: latestVersionCode > current.versionCode,
    currentVersionCode: current.versionCode,
    currentVersionName: current.versionName,
    latestVersionCode,
    latestVersionName,
    tagName,
    publishedAt: json.published_at || '',
    apkUrl: parsedApkUrl.toString(),
    apkSizeBytes: Number(apkAsset.size || 0),
    sha256: '',
    releaseNotes: (json.body || '').split('\n')[0] || 'Latest Achsoo update',
    signedRelease: false,
  };
}

export async function downloadAndInstallNativeUpdate(
  apkUrl: string,
  expectedSha256?: string
): Promise<InstallUpdateStatus> {
  if (!isNativeAndroidApp()) {
    throw new Error('One-tap installation runs inside the installed Android APK.');
  }
  const res = await AchsooNative.downloadAndInstallUpdate({
    apkUrl,
    expectedSha256: expectedSha256 || '',
  });
  return res.status;
}

export async function installReadyNativeUpdate(): Promise<InstallUpdateStatus> {
  if (!isNativeAndroidApp()) {
    throw new Error('One-tap installation runs inside the installed Android APK.');
  }
  const res = await AchsooNative.installReadyUpdate();
  return res.status;
}

export function addUpdateDownloadProgressListener(
  onProgress: (event: UpdateDownloadProgress) => void
): () => void {
  if (!isNativeAndroidApp()) {
    return () => {};
  }
  let disposed = false;
  let handle: PluginListenerHandle | null = null;

  void AchsooNative.addListener('updateDownloadProgress', onProgress)
    .then((h) => {
      if (disposed) {
        void h.remove();
      } else {
        handle = h;
      }
    })
    .catch(() => {});

  return () => {
    disposed = true;
    if (handle) {
      void handle.remove().catch(() => {});
    }
  };
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
