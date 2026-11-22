package com.achsoo.app;

import android.Manifest;
import android.content.Context;
import android.os.Build;
import android.view.HapticFeedbackConstants;
import android.view.View;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Custom Capacitor bridge for Achsoo's native Android features:
 * 1. Crisp Gboard-style micro-actuator "bubble" haptics (CLOCK_TICK / KEYBOARD_TAP / CONFIRM)
 * 2. Smart offline fox notifications with runtime Android 13+ permission handling
 * 3. Safe 6-slot dynamic time-of-day launcher icon management
 * 4. One-tap GitHub Releases APK self-updater with SHA-256 verification
 */
@CapacitorPlugin(
    name = "AchsooNative",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = { Manifest.permission.POST_NOTIFICATIONS }
        )
    }
)
public class AchsooNativePlugin extends Plugin {
    private final ExecutorService ioExecutor = Executors.newSingleThreadExecutor();

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        ioExecutor.shutdownNow();
    }

    @PluginMethod
    public void triggerBubbleHaptic(PluginCall call) {
        final String style = call.getString("style", "tick");
        final View view = getBridge() != null ? getBridge().getWebView() : null;
        if (view == null) {
            call.resolve();
            return;
        }

        view.post(() -> {
            int feedbackConstant;
            if ("confirm".equals(style)) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    feedbackConstant = HapticFeedbackConstants.CONFIRM;
                } else {
                    feedbackConstant = HapticFeedbackConstants.CONTEXT_CLICK;
                }
            } else if ("back".equals(style)) {
                feedbackConstant = HapticFeedbackConstants.KEYBOARD_TAP;
            } else {
                feedbackConstant = HapticFeedbackConstants.CLOCK_TICK;
            }
            view.performHapticFeedback(feedbackConstant);
        });

        call.resolve();
    }

    @PluginMethod
    public void getNotificationPermission(PluginCall call) {
        JSObject ret = new JSObject();
        Context context = getContext();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            boolean enabled = AchsooReminderScheduler.hasNotificationPermission(context);
            ret.put("status", enabled ? "granted" : "denied");
            call.resolve(ret);
            return;
        }

        PermissionState state = getPermissionState("notifications");
        if (state == PermissionState.GRANTED) {
            ret.put("status", "granted");
        } else if (state == PermissionState.DENIED) {
            ret.put("status", "denied");
        } else {
            ret.put("status", "prompt");
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            JSObject ret = new JSObject();
            ret.put("status", AchsooReminderScheduler.hasNotificationPermission(getContext()) ? "granted" : "denied");
            call.resolve(ret);
            return;
        }

        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            JSObject ret = new JSObject();
            ret.put("status", "granted");
            call.resolve(ret);
            return;
        }

        requestPermissionForAlias("notifications", call, "notificationsPermissionCallback");
    }

    @PermissionCallback
    private void notificationsPermissionCallback(PluginCall call) {
        JSObject ret = new JSObject();
        boolean granted = getPermissionState("notifications") == PermissionState.GRANTED;
        ret.put("status", granted ? "granted" : "denied");
        if (granted) {
            AchsooReminderScheduler.rescheduleAll(getContext());
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void syncReminders(PluginCall call) {
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", true));
        boolean morningEnabled = Boolean.TRUE.equals(call.getBoolean("morningEnabled", true));
        boolean eveningEnabled = Boolean.TRUE.equals(call.getBoolean("eveningEnabled", true));
        boolean inactivityEnabled = Boolean.TRUE.equals(call.getBoolean("inactivityEnabled", true));
        Integer streakObj = call.getInt("streakDays", 0);
        Integer reviewedObj = call.getInt("reviewedToday", 0);
        Integer dueObj = call.getInt("dueCount", 0);
        Long lastStudyObj = call.getLong("lastStudyMs", System.currentTimeMillis());

        int streakDays = streakObj != null ? streakObj : 0;
        int reviewedToday = reviewedObj != null ? reviewedObj : 0;
        int dueCount = dueObj != null ? dueObj : 0;
        long lastStudyMs = lastStudyObj != null ? lastStudyObj : System.currentTimeMillis();
        boolean dailyGoalMet = Boolean.TRUE.equals(call.getBoolean("dailyGoalMet", false));

        AchsooReminderScheduler.saveStateAndReschedule(
            getContext(),
            enabled,
            morningEnabled,
            eveningEnabled,
            inactivityEnabled,
            streakDays,
            reviewedToday,
            dueCount,
            lastStudyMs,
            dailyGoalMet
        );

        JSObject ret = new JSObject();
        ret.put("scheduled", enabled && AchsooReminderScheduler.hasNotificationPermission(getContext()));
        call.resolve(ret);
    }

    @PluginMethod
    public void sendTestNotification(PluginCall call) {
        Integer poseObj = call.getInt("poseIndex", 0);
        int poseIndex = poseObj != null ? poseObj : 0;
        Context context = getContext();
        if (!AchsooReminderScheduler.hasNotificationPermission(context)) {
            JSObject ret = new JSObject();
            ret.put("sent", false);
            ret.put("reason", "permission_required");
            call.resolve(ret);
            return;
        }

        AchsooReminderScheduler.showTestNotification(context, poseIndex);
        JSObject ret = new JSObject();
        ret.put("sent", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void syncDynamicIcon(PluginCall call) {
        boolean autoEnabled = Boolean.TRUE.equals(call.getBoolean("autoEnabled", true));
        String manualSlot = call.getString("manualSlot", "midday");
        boolean applyNow = Boolean.TRUE.equals(call.getBoolean("applyNow", false));

        Context context = getContext();
        AchsooIconManager.savePreferences(context, autoEnabled, manualSlot);

        if (applyNow) {
            AchsooIconManager.applyTargetIconIfSafe(context, true);
        }

        JSObject ret = new JSObject();
        ret.put("autoEnabled", AchsooIconManager.isAutoEnabled(context));
        ret.put("activeSlot", AchsooIconManager.getActiveSlot(context));
        ret.put("targetSlot", AchsooIconManager.getTargetSlot(context));
        ret.put("currentClockSlot", AchsooIconManager.getCurrentClockSlot());
        call.resolve(ret);
    }

    @PluginMethod
    public void getDynamicIconStatus(PluginCall call) {
        Context context = getContext();
        JSObject ret = new JSObject();
        ret.put("autoEnabled", AchsooIconManager.isAutoEnabled(context));
        ret.put("activeSlot", AchsooIconManager.getActiveSlot(context));
        ret.put("targetSlot", AchsooIconManager.getTargetSlot(context));
        ret.put("currentClockSlot", AchsooIconManager.getCurrentClockSlot());
        call.resolve(ret);
    }

    @PluginMethod
    public void getInstalledAppVersion(PluginCall call) {
        Context context = getContext();
        AchsooAppUpdater.InstalledVersion version = AchsooAppUpdater.getInstalledVersion(context);
        JSObject ret = new JSObject();
        ret.put("versionCode", version.versionCode);
        ret.put("versionName", version.versionName);
        ret.put("hasReadyUpdate", AchsooAppUpdater.hasCachedApk(context));
        call.resolve(ret);
    }

    @PluginMethod
    public void checkForGitHubUpdate(PluginCall call) {
        final String repo = call.getString("repo", "");
        final Context appContext = getContext().getApplicationContext();

        ioExecutor.execute(() -> {
            try {
                AchsooAppUpdater.UpdateCheckResult res = AchsooAppUpdater.checkForUpdate(appContext, repo);
                JSObject ret = new JSObject();
                ret.put("updateAvailable", res.updateAvailable);
                ret.put("currentVersionCode", res.currentVersionCode);
                ret.put("currentVersionName", res.currentVersionName);
                ret.put("latestVersionCode", res.latestVersionCode);
                ret.put("latestVersionName", res.latestVersionName);
                ret.put("tagName", res.tagName);
                ret.put("publishedAt", res.publishedAt);
                ret.put("apkUrl", res.apkUrl);
                ret.put("apkSizeBytes", res.apkSizeBytes);
                ret.put("sha256", res.sha256);
                ret.put("releaseNotes", res.releaseNotes);
                ret.put("signedRelease", res.signedRelease);
                call.resolve(ret);
            } catch (Exception e) {
                call.reject(e.getMessage() != null ? e.getMessage() : "Unable to check GitHub Releases.");
            }
        });
    }

    @PluginMethod
    public void downloadAndInstallUpdate(PluginCall call) {
        final String apkUrl = call.getString("apkUrl", "");
        final String expectedSha256 = call.getString("expectedSha256", "");
        final Context appContext = getContext().getApplicationContext();

        ioExecutor.execute(() -> {
            try {
                AchsooAppUpdater.downloadAndVerifyApk(
                    appContext,
                    apkUrl,
                    expectedSha256,
                    (percent, downloadedBytes, totalBytes) -> {
                        JSObject progress = new JSObject();
                        progress.put("progress", percent);
                        progress.put("downloadedBytes", downloadedBytes);
                        progress.put("totalBytes", totalBytes);
                        notifyListeners("updateDownloadProgress", progress);
                    }
                );

                String installStatus = AchsooAppUpdater.launchCachedApkInstaller(appContext);
                JSObject ret = new JSObject();
                ret.put("status", installStatus);
                call.resolve(ret);
            } catch (Exception e) {
                call.reject(e.getMessage() != null ? e.getMessage() : "Update download failed.");
            }
        });
    }

    @PluginMethod
    public void installReadyUpdate(PluginCall call) {
        Context appContext = getContext().getApplicationContext();
        try {
            String status = AchsooAppUpdater.launchCachedApkInstaller(appContext);
            JSObject ret = new JSObject();
            ret.put("status", status);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage() != null ? e.getMessage() : "Could not launch Android installer.");
        }
    }
}
