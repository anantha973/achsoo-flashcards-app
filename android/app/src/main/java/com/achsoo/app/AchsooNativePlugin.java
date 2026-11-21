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

/**
 * Custom Capacitor bridge for Achsoo's native Android polish:
 * 1. Crisp Gboard-style micro-actuator "bubble" haptics (CLOCK_TICK / KEYBOARD_TAP / CONFIRM)
 * 2. Smart offline fox notifications with runtime Android 13+ permission handling
 * 3. Safe 6-slot dynamic time-of-day launcher icon management
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
                // Default crisp Gboard-style soft micro-bubble tick
                feedbackConstant = HapticFeedbackConstants.CLOCK_TICK;
            }
            // Respects system touch-feedback setting; never triggers buzzy vibration motor bursts
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

        // Only apply immediately if explicitly requested; otherwise switches cleanly on app background (onStop)
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
}
