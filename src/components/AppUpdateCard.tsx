import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Card } from './HeroPrimitives';
import {
  type GitHubUpdateCheckResult,
  type InstalledAppVersionInfo,
  type UpdateDownloadProgress,
  addUpdateDownloadProgressListener,
  checkForGitHubReleaseUpdate,
  downloadAndInstallNativeUpdate,
  getBuildTimeAppVersion,
  getConfiguredGitHubRepo,
  getInstalledAndroidVersion,
  installReadyNativeUpdate,
  isNativeAndroidApp,
  isValidGitHubRepoSlug,
  triggerBubbleHaptic,
} from '../utils/nativeAndroid';

type UpdateUiPhase =
  | 'idle'
  | 'checking'
  | 'up-to-date'
  | 'available'
  | 'downloading'
  | 'permission-needed'
  | 'installing'
  | 'error';

function formatMegabytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const AppUpdateCard: React.FC = () => {
  const isNative = isNativeAndroidApp();
  const buildFallback = getBuildTimeAppVersion();
  const repo = getConfiguredGitHubRepo();

  const [installedInfo, setInstalledInfo] = useState<InstalledAppVersionInfo>({
    versionCode: buildFallback.versionCode,
    versionName: buildFallback.versionName,
    hasReadyUpdate: false,
  });

  const [phase, setPhase] = useState<UpdateUiPhase>('idle');
  const [updateInfo, setUpdateInfo] = useState<GitHubUpdateCheckResult | null>(
    null
  );
  const [downloadProgress, setDownloadProgress] =
    useState<UpdateDownloadProgress>({
      progress: 0,
      downloadedBytes: 0,
      totalBytes: 0,
    });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getInstalledAndroidVersion().then((info) => {
      if (active) setInstalledInfo(info);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const removeListener = addUpdateDownloadProgressListener((event) => {
      setDownloadProgress(event);
    });
    return () => removeListener();
  }, []);

  const handleCheckForUpdate = useCallback(async () => {
    const activeRepo = repo.trim();
    if (!isValidGitHubRepoSlug(activeRepo)) {
      setPhase('error');
      setStatusMessage(
        'Automatic update checks are active in installed Android releases.'
      );
      return;
    }

    setPhase('checking');
    setStatusMessage(null);

    try {
      const result = await checkForGitHubReleaseUpdate(activeRepo);
      setUpdateInfo(result);
      setInstalledInfo((prev) => ({
        ...prev,
        versionCode: result.currentVersionCode,
        versionName: result.currentVersionName,
      }));

      if (result.updateAvailable) {
        setPhase('available');
      } else {
        setPhase('up-to-date');
        setStatusMessage(
          `You're on the latest version (v${result.currentVersionName}).`
        );
      }
    } catch (err) {
      setPhase('error');
      setStatusMessage(
        err instanceof Error
          ? err.message
          : 'Could not check for updates. Check your connection and try again.'
      );
    }
  }, [repo]);

  const handleDownloadAndInstall = useCallback(async () => {
    if (!updateInfo?.apkUrl) return;
    if (!isNative) {
      setStatusMessage(
        'One-tap APK installation runs directly inside the installed Android app on your phone.'
      );
      return;
    }

    setPhase('downloading');
    setStatusMessage(null);
    setDownloadProgress({
      progress: 0,
      downloadedBytes: 0,
      totalBytes: updateInfo.apkSizeBytes || 0,
    });

    try {
      const installStatus = await downloadAndInstallNativeUpdate(
        updateInfo.apkUrl,
        updateInfo.sha256
      );
      setInstalledInfo((prev) => ({ ...prev, hasReadyUpdate: true }));
      triggerBubbleHaptic('confirm');

      if (installStatus === 'permission_needed') {
        setPhase('permission-needed');
        setStatusMessage(
          'Allow "Install unknown apps" for Achsoo once in Android Settings, then come back and tap Install Ready Update.'
        );
      } else {
        setPhase('installing');
        setStatusMessage(
          'Android installer opened — tap Update to apply the new version.'
        );
      }
    } catch (err) {
      setPhase('error');
      setStatusMessage(
        err instanceof Error
          ? err.message
          : 'Update download failed. Tap to try again.'
      );
    }
  }, [isNative, updateInfo]);

  const handleInstallReady = useCallback(async () => {
    setStatusMessage(null);
    try {
      const installStatus = await installReadyNativeUpdate();
      if (installStatus === 'permission_needed') {
        setPhase('permission-needed');
        setStatusMessage(
          'Enable "Install unknown apps" for Achsoo, then return here and tap Install Ready Update.'
        );
      } else if (installStatus === 'missing_apk') {
        setInstalledInfo((prev) => ({ ...prev, hasReadyUpdate: false }));
        setPhase('idle');
        setStatusMessage('Cached installer expired. Tap Check for Update again.');
      } else {
        triggerBubbleHaptic('confirm');
        setPhase('installing');
        setStatusMessage(
          'Android installer opened — confirm Update to finish.'
        );
      }
    } catch (err) {
      setPhase('error');
      setStatusMessage(
        err instanceof Error ? err.message : 'Could not open Android installer.'
      );
    }
  }, []);

  const isBusy = phase === 'checking' || phase === 'downloading';

  return (
    <Card.Root className="p-5 surface-paper space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[var(--intent-primary)] shrink-0" />
            <h3 className="font-display text-sm font-bold text-[var(--fg-primary)]">
              App Updates
            </h3>
          </div>
          <p className="text-xs text-[var(--fg-secondary)] mt-1 leading-relaxed">
            Installed{' '}
            <span className="font-semibold text-[var(--fg-primary)] tabular-nums">
              v{installedInfo.versionName}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleCheckForUpdate}
          disabled={isBusy}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold surface-2 border border-[var(--border-subtle)] text-[var(--fg-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] disabled:opacity-55 theme-focus"
        >
          {phase === 'checking' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--intent-primary)]" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 text-[var(--intent-primary)]" />
          )}
          <span>
            {phase === 'checking' ? 'Checking...' : 'Check for Update'}
          </span>
        </button>
      </div>

      {/* Available Update Banner */}
      {phase === 'available' && updateInfo && (
        <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-display font-bold text-[var(--fg-primary)] tabular-nums">
                Update available · v{updateInfo.latestVersionName}
              </span>
              {updateInfo.apkSizeBytes > 0 && (
                <span className="text-[11px] text-[var(--fg-muted)] tabular-nums shrink-0">
                  {formatMegabytes(updateInfo.apkSizeBytes)}
                </span>
              )}
            </div>
            {updateInfo.releaseNotes && (
              <p className="text-xs text-[var(--fg-secondary)] leading-relaxed line-clamp-2">
                {updateInfo.releaseNotes}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--intent-success)] shrink-0" />
              <span>
                {updateInfo.sha256 ? 'Verified package' : 'Ready to download'}
              </span>
            </div>

            {isNative ? (
              <button
                type="button"
                onClick={handleDownloadAndInstall}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold bg-[var(--intent-primary)] text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] theme-focus"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download &amp; Install Update</span>
              </button>
            ) : (
              <a
                href={updateInfo.apkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold bg-[var(--intent-primary)] text-white hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 min-h-[44px] theme-focus"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Download APK</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Live Download Progress */}
      {phase === 'downloading' && (
        <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--fg-primary)]">
              {downloadProgress.progress >= 100
                ? 'Verifying package integrity...'
                : 'Downloading update...'}
            </span>
            <span className="tabular-nums text-[var(--fg-secondary)] font-semibold">
              {downloadProgress.progress}%
              {downloadProgress.totalBytes > 0
                ? ` · ${formatMegabytes(downloadProgress.downloadedBytes)} / ${formatMegabytes(downloadProgress.totalBytes)}`
                : ''}
            </span>
          </div>
          <div className="h-2 w-full rounded-full surface-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--intent-primary)] transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${Math.max(4, downloadProgress.progress)}%` }}
            />
          </div>
        </div>
      )}

      {/* Install Ready Update button (after returning from unknown-sources settings or if cached) */}
      {isNative &&
        (phase === 'permission-needed' ||
          phase === 'installing' ||
          (phase === 'idle' && installedInfo.hasReadyUpdate)) && (
          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--fg-secondary)]">
              Verified update package is ready on your phone.
            </span>
            <button
              type="button"
              onClick={handleInstallReady}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold bg-[var(--intent-primary)] text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] theme-focus"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Ready Update</span>
            </button>
          </div>
        )}

      {/* Status / Confirmation / Error Feedback */}
      {statusMessage && (
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-start gap-2 text-xs text-[var(--fg-secondary)] leading-relaxed">
          {phase === 'up-to-date' && (
            <CheckCircle2 className="w-4 h-4 text-[var(--intent-success)] shrink-0 mt-0.5" />
          )}
          <p>{statusMessage}</p>
        </div>
      )}
    </Card.Root>
  );
};
