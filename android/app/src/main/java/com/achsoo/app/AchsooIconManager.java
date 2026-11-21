package com.achsoo.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import java.util.Calendar;

/**
 * Manages the 6 time-of-day adaptive launcher icons safely via Android activity-alias switching.
 * Always defers icon swaps until the app is backgrounded (onStop) or closed (AlarmManager)
 * so active study sessions are never interrupted.
 */
public final class AchsooIconManager {
    public static final String PREFS_NAME = "achsoo_native_prefs";
    public static final String KEY_AUTO_ICON_ENABLED = "auto_icon_enabled";
    public static final String KEY_MANUAL_ICON_SLOT = "manual_icon_slot";
    public static final String KEY_ACTIVE_ICON_SLOT = "active_icon_slot";

    private static final int ICON_ALARM_REQUEST_CODE = 7401;
    private static final int[] BOUNDARY_HOURS = {0, 5, 9, 13, 17, 21};

    private static final String[] SLOTS = {
        "morning",
        "midday",
        "afternoon",
        "evening",
        "late-night",
        "sleep"
    };

    private static final String[] ALIAS_CLASSES = {
        "com.achsoo.app.MainActivityMorning",
        "com.achsoo.app.MainActivityMidday",
        "com.achsoo.app.MainActivityAfternoon",
        "com.achsoo.app.MainActivityEvening",
        "com.achsoo.app.MainActivityLateNight",
        "com.achsoo.app.MainActivitySleep"
    };

    private static volatile boolean appInForeground = false;

    private AchsooIconManager() {}

    public static void setAppInForeground(boolean inForeground) {
        appInForeground = inForeground;
    }

    public static boolean isAppInForeground() {
        return appInForeground;
    }

    public static String getCurrentClockSlot() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour >= 5 && hour < 9) return "morning";
        if (hour >= 9 && hour < 13) return "midday";
        if (hour >= 13 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";
        if (hour >= 21) return "late-night";
        return "sleep";
    }

    public static boolean isAutoEnabled(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getBoolean(KEY_AUTO_ICON_ENABLED, true);
    }

    public static String getTargetSlot(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        boolean autoEnabled = prefs.getBoolean(KEY_AUTO_ICON_ENABLED, true);
        if (!autoEnabled) {
            String manual = prefs.getString(KEY_MANUAL_ICON_SLOT, "midday");
            if (isValidSlot(manual)) {
                return manual;
            }
            return "midday";
        }
        return getCurrentClockSlot();
    }

    public static String getActiveSlot(Context context) {
        PackageManager pm = context.getPackageManager();
        for (int i = 0; i < ALIAS_CLASSES.length; i++) {
            ComponentName cn = new ComponentName(context.getPackageName(), ALIAS_CLASSES[i]);
            int state = pm.getComponentEnabledSetting(cn);
            if (state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED) {
                return SLOTS[i];
            }
            // Default enabled alias declared in AndroidManifest.xml is midday
            if (state == PackageManager.COMPONENT_ENABLED_STATE_DEFAULT && "midday".equals(SLOTS[i])) {
                return "midday";
            }
        }
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(KEY_ACTIVE_ICON_SLOT, "midday");
    }

    public static void savePreferences(Context context, boolean autoEnabled, String manualSlot) {
        SharedPreferences.Editor editor = context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit();
        editor.putBoolean(KEY_AUTO_ICON_ENABLED, autoEnabled);
        if (isValidSlot(manualSlot)) {
            editor.putString(KEY_MANUAL_ICON_SLOT, manualSlot);
        }
        editor.apply();

        if (autoEnabled) {
            scheduleNextIconBoundaryAlarm(context);
        } else {
            cancelIconBoundaryAlarm(context);
        }
    }

    /**
     * Switches the enabled activity-alias if needed.
     * When forceNow is false, skips if the app is currently in the foreground (will run on onStop).
     */
    public static boolean applyTargetIconIfSafe(Context context, boolean forceNow) {
        if (!forceNow && appInForeground) {
            return false;
        }
        String targetSlot = getTargetSlot(context);
        return applySlot(context, targetSlot);
    }

    public static boolean applySlot(Context context, String targetSlot) {
        int targetIndex = slotIndex(targetSlot);
        if (targetIndex < 0) {
            targetIndex = 1; // midday fallback
            targetSlot = "midday";
        }

        PackageManager pm = context.getPackageManager();
        String pkg = context.getPackageName();

        // Check if target is already exclusively active to avoid pointless launcher redraws
        boolean alreadyMatches = true;
        for (int i = 0; i < ALIAS_CLASSES.length; i++) {
            ComponentName cn = new ComponentName(pkg, ALIAS_CLASSES[i]);
            int state = pm.getComponentEnabledSetting(cn);
            boolean isCurrentlyEnabled =
                state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED ||
                (state == PackageManager.COMPONENT_ENABLED_STATE_DEFAULT && i == 1);
            if ((i == targetIndex) != isCurrentlyEnabled) {
                alreadyMatches = false;
                break;
            }
        }

        if (alreadyMatches) {
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY_ACTIVE_ICON_SLOT, targetSlot)
                .apply();
            return false;
        }

        try {
            // Enable the target alias FIRST so the launcher never sees zero launcher entries
            ComponentName enableTarget = new ComponentName(pkg, ALIAS_CLASSES[targetIndex]);
            pm.setComponentEnabledSetting(
                enableTarget,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP
            );

            // Disable the other 5 aliases
            for (int i = 0; i < ALIAS_CLASSES.length; i++) {
                if (i == targetIndex) continue;
                ComponentName disableTarget = new ComponentName(pkg, ALIAS_CLASSES[i]);
                pm.setComponentEnabledSetting(
                    disableTarget,
                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                    PackageManager.DONT_KILL_APP
                );
            }

            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY_ACTIVE_ICON_SLOT, targetSlot)
                .apply();
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    public static void scheduleNextIconBoundaryAlarm(Context context) {
        if (!isAutoEnabled(context)) {
            cancelIconBoundaryAlarm(context);
            return;
        }

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Calendar now = Calendar.getInstance();
        int currentHour = now.get(Calendar.HOUR_OF_DAY);
        Calendar next = (Calendar) now.clone();
        next.set(Calendar.MINUTE, 0);
        next.set(Calendar.SECOND, 5);
        next.set(Calendar.MILLISECOND, 0);

        int nextHour = -1;
        for (int h : BOUNDARY_HOURS) {
            if (h > currentHour) {
                nextHour = h;
                break;
            }
        }

        if (nextHour >= 0) {
            next.set(Calendar.HOUR_OF_DAY, nextHour);
        } else {
            next.add(Calendar.DAY_OF_YEAR, 1);
            next.set(Calendar.HOUR_OF_DAY, 0);
        }

        long triggerAtMillis = Math.max(System.currentTimeMillis() + 5000L, next.getTimeInMillis());

        PendingIntent pi = buildIconAlarmPendingIntent(context);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC, triggerAtMillis, pi);
            } else {
                alarmManager.set(AlarmManager.RTC, triggerAtMillis, pi);
            }
        } catch (SecurityException ignored) {
            // Ignore if restricted by OEM battery policy
        }
    }

    public static void cancelIconBoundaryAlarm(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;
        alarmManager.cancel(buildIconAlarmPendingIntent(context));
    }

    private static PendingIntent buildIconAlarmPendingIntent(Context context) {
        Intent intent = new Intent(context, AchsooIconSwitchReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getBroadcast(context, ICON_ALARM_REQUEST_CODE, intent, flags);
    }

    private static boolean isValidSlot(String slot) {
        return slotIndex(slot) >= 0;
    }

    private static int slotIndex(String slot) {
        if (slot == null) return -1;
        for (int i = 0; i < SLOTS.length; i++) {
            if (SLOTS[i].equals(slot)) return i;
        }
        return -1;
    }
}
