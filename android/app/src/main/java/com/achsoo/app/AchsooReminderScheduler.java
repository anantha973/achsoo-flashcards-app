package com.achsoo.app;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import java.util.Calendar;

/**
 * Schedules and renders smart, non-spammy offline study reminders with rich fox pose artwork:
 * - Morning practice (08:30 local time)
 * - Evening practice / Streak rescue (20:00 local time)
 * - 16-hour inactivity gentle nudge (quiet-hours protected)
 * - 24-hour inactivity nudge (quiet-hours protected)
 */
public final class AchsooReminderScheduler {
    public static final String CHANNEL_ID = "achsoo_study_reminders";
    public static final String CHANNEL_NAME = "Study Reminders";
    public static final String CHANNEL_DESC = "Smart daily practice, streak rescue, and inactivity fox reminders";

    public static final String EXTRA_SLOT_TYPE = "achsoo_slot_type";

    public static final String SLOT_MORNING = "morning";
    public static final String SLOT_EVENING = "evening";
    public static final String SLOT_STREAK = "streak";
    public static final String SLOT_NUDGE_16H = "nudge16";
    public static final String SLOT_NUDGE_24H = "nudge24";
    public static final String SLOT_TEST = "test";

    private static final int REQ_MORNING = 8101;
    private static final int REQ_EVENING = 8102;
    private static final int REQ_NUDGE_16H = 8103;
    private static final int REQ_NUDGE_24H = 8104;

    private static final int NOTIF_ID_MORNING = 9101;
    private static final int NOTIF_ID_EVENING = 9102;
    private static final int NOTIF_ID_NUDGE_16H = 9103;
    private static final int NOTIF_ID_NUDGE_24H = 9104;
    private static final int NOTIF_ID_TEST = 9199;

    private static final long HOUR_MS = 60L * 60L * 1000L;
    private static final long MIN_GAP_MS = 150L * 60L * 1000L; // 2.5h minimum separation

    private static final String KEY_ENABLED = "reminders_enabled";
    private static final String KEY_MORNING_ENABLED = "reminders_morning_enabled";
    private static final String KEY_EVENING_ENABLED = "reminders_evening_enabled";
    private static final String KEY_INACTIVITY_ENABLED = "reminders_inactivity_enabled";
    private static final String KEY_STREAK_DAYS = "reminders_streak_days";
    private static final String KEY_REVIEWED_TODAY = "reminders_reviewed_today";
    private static final String KEY_DUE_COUNT = "reminders_due_count";
    private static final String KEY_LAST_STUDY_MS = "reminders_last_study_ms";
    private static final String KEY_DAILY_GOAL_MET = "reminders_daily_goal_met";

    private AchsooReminderScheduler() {}

    public static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            if (nm == null) return;
            NotificationChannel existing = nm.getNotificationChannel(CHANNEL_ID);
            if (existing == null) {
                NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_DEFAULT
                );
                channel.setDescription(CHANNEL_DESC);
                channel.enableLights(true);
                channel.setLightColor(Color.parseColor("#E37A55"));
                channel.enableVibration(false); // Calm, non-buzzy reminder delivery
                nm.createNotificationChannel(channel);
            }
        }
    }

    public static boolean hasNotificationPermission(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return NotificationManagerCompat.from(context).areNotificationsEnabled();
        }
        return ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS)
            == PackageManager.PERMISSION_GRANTED;
    }

    public static void saveStateAndReschedule(
        Context context,
        boolean enabled,
        boolean morningEnabled,
        boolean eveningEnabled,
        boolean inactivityEnabled,
        int streakDays,
        int reviewedToday,
        int dueCount,
        long lastStudyMs,
        boolean dailyGoalMet
    ) {
        SharedPreferences.Editor editor = context
            .getSharedPreferences(AchsooIconManager.PREFS_NAME, Context.MODE_PRIVATE)
            .edit();
        editor.putBoolean(KEY_ENABLED, enabled);
        editor.putBoolean(KEY_MORNING_ENABLED, morningEnabled);
        editor.putBoolean(KEY_EVENING_ENABLED, eveningEnabled);
        editor.putBoolean(KEY_INACTIVITY_ENABLED, inactivityEnabled);
        editor.putInt(KEY_STREAK_DAYS, Math.max(0, streakDays));
        editor.putInt(KEY_REVIEWED_TODAY, Math.max(0, reviewedToday));
        editor.putInt(KEY_DUE_COUNT, Math.max(0, dueCount));
        if (lastStudyMs > 0L) {
            editor.putLong(KEY_LAST_STUDY_MS, lastStudyMs);
        }
        editor.putBoolean(KEY_DAILY_GOAL_MET, dailyGoalMet);
        editor.apply();

        rescheduleAll(context);
    }

    public static void rescheduleAll(Context context) {
        ensureChannel(context);

        SharedPreferences prefs = context.getSharedPreferences(AchsooIconManager.PREFS_NAME, Context.MODE_PRIVATE);
        boolean enabled = prefs.getBoolean(KEY_ENABLED, true);
        boolean morningEnabled = prefs.getBoolean(KEY_MORNING_ENABLED, true);
        boolean eveningEnabled = prefs.getBoolean(KEY_EVENING_ENABLED, true);
        boolean inactivityEnabled = prefs.getBoolean(KEY_INACTIVITY_ENABLED, true);
        int streakDays = prefs.getInt(KEY_STREAK_DAYS, 0);
        int reviewedToday = prefs.getInt(KEY_REVIEWED_TODAY, 0);
        long lastStudyMs = prefs.getLong(KEY_LAST_STUDY_MS, System.currentTimeMillis());
        boolean dailyGoalMet = prefs.getBoolean(KEY_DAILY_GOAL_MET, false);

        cancelAlarm(context, REQ_MORNING, SLOT_MORNING);
        cancelAlarm(context, REQ_EVENING, SLOT_EVENING);
        cancelAlarm(context, REQ_NUDGE_16H, SLOT_NUDGE_16H);
        cancelAlarm(context, REQ_NUDGE_24H, SLOT_NUDGE_24H);

        if (!enabled || !hasNotificationPermission(context)) {
            return;
        }

        long now = System.currentTimeMillis();
        long morningTrigger = -1L;
        long eveningTrigger = -1L;

        // 1. Morning practice at 08:30 (skip today if already reviewed today)
        if (morningEnabled) {
            morningTrigger = nextDailyTimeMillis(8, 30, reviewedToday > 0);
            scheduleAlarm(context, REQ_MORNING, SLOT_MORNING, morningTrigger);
        }

        // 2. Evening practice / Streak rescue at 20:00 (skip today if daily goal met or >= 5 reviews)
        if (eveningEnabled) {
            boolean skipToday = dailyGoalMet || reviewedToday >= 5;
            eveningTrigger = nextDailyTimeMillis(20, 0, skipToday);
            String eveningType = (streakDays >= 1 && reviewedToday == 0 && !skipToday)
                ? SLOT_STREAK
                : SLOT_EVENING;
            scheduleAlarm(context, REQ_EVENING, eveningType, eveningTrigger);
        }

        // 3 & 4. 16-hour & 24-hour inactivity nudges (quiet-hours protected & de-clustered)
        if (inactivityEnabled) {
            long baseStudyMs = lastStudyMs > 0L ? lastStudyMs : now;
            if (baseStudyMs > now) {
                baseStudyMs = now;
            }

            long nudge16 = adjustOutOfQuietHours(baseStudyMs + 16L * HOUR_MS);
            if (nudge16 > now + 5L * 60L * 1000L && !isTooClose(nudge16, morningTrigger) && !isTooClose(nudge16, eveningTrigger)) {
                scheduleAlarm(context, REQ_NUDGE_16H, SLOT_NUDGE_16H, nudge16);
            }

            long nudge24 = adjustOutOfQuietHours(baseStudyMs + 24L * HOUR_MS);
            if (nudge24 > now + 10L * 60L * 1000L && !isTooClose(nudge24, morningTrigger) && !isTooClose(nudge24, eveningTrigger)) {
                scheduleAlarm(context, REQ_NUDGE_24H, SLOT_NUDGE_24H, nudge24);
            }
        }
    }

    public static void handleScheduledAlarm(Context context, String slotType) {
        SharedPreferences prefs = context.getSharedPreferences(AchsooIconManager.PREFS_NAME, Context.MODE_PRIVATE);
        if (!prefs.getBoolean(KEY_ENABLED, true) || !hasNotificationPermission(context)) {
            return;
        }

        int streakDays = prefs.getInt(KEY_STREAK_DAYS, 0);
        int dueCount = prefs.getInt(KEY_DUE_COUNT, 0);

        showRichFoxNotification(context, slotType, streakDays, dueCount);

        // Roll recurring daily slots forward to tomorrow
        if (SLOT_MORNING.equals(slotType) && prefs.getBoolean(KEY_MORNING_ENABLED, true)) {
            long tomorrowMorning = nextDailyTimeMillis(8, 30, true);
            scheduleAlarm(context, REQ_MORNING, SLOT_MORNING, tomorrowMorning);
        } else if ((SLOT_EVENING.equals(slotType) || SLOT_STREAK.equals(slotType))
            && prefs.getBoolean(KEY_EVENING_ENABLED, true)) {
            long tomorrowEvening = nextDailyTimeMillis(20, 0, true);
            scheduleAlarm(context, REQ_EVENING, SLOT_EVENING, tomorrowEvening);
        }
    }

    public static void showTestNotification(Context context, int poseIndex) {
        String[] sampleSlots = {
            SLOT_MORNING,
            SLOT_STREAK,
            SLOT_EVENING,
            SLOT_NUDGE_16H,
            SLOT_NUDGE_24H,
            SLOT_TEST
        };
        int safeIdx = Math.abs(poseIndex) % sampleSlots.length;
        SharedPreferences prefs = context.getSharedPreferences(AchsooIconManager.PREFS_NAME, Context.MODE_PRIVATE);
        int streakDays = Math.max(3, prefs.getInt(KEY_STREAK_DAYS, 3));
        int dueCount = Math.max(8, prefs.getInt(KEY_DUE_COUNT, 8));
        showRichFoxNotification(context, sampleSlots[safeIdx], streakDays, dueCount, true);
    }

    public static void showRichFoxNotification(
        Context context,
        String slotType,
        int streakDays,
        int dueCount
    ) {
        showRichFoxNotification(context, slotType, streakDays, dueCount, false);
    }

    private static void showRichFoxNotification(
        Context context,
        String slotType,
        int streakDays,
        int dueCount,
        boolean isTest
    ) {
        if (!hasNotificationPermission(context)) {
            return;
        }
        ensureChannel(context);

        String title;
        String body;
        int bannerRes;
        int avatarRes;
        int notifId;

        if (SLOT_MORNING.equals(slotType)) {
            title = "Guten Morgen! Coffee & Cards";
            body = dueCount > 0
                ? "Start fresh with " + Math.min(dueCount, 10) + " quick German cards alongside your coffee."
                : "A calm 3-minute morning warm-up keeps your German sharp all day.";
            bannerRes = R.drawable.fox_notif_morning;
            avatarRes = R.drawable.fox_avatar_morning;
            notifId = NOTIF_ID_MORNING;
        } else if (SLOT_STREAK.equals(slotType)) {
            title = "Save your " + Math.max(1, streakDays) + "-day streak!";
            body = "Your fox is holding the lantern — finish 5 quick cards before midnight.";
            bannerRes = R.drawable.fox_notif_streak;
            avatarRes = R.drawable.fox_avatar_streak;
            notifId = NOTIF_ID_EVENING;
        } else if (SLOT_EVENING.equals(slotType)) {
            title = "Abendrunde with Achsoo";
            body = dueCount > 0
                ? dueCount + " cards are ready for a cozy evening review before bed."
                : "A quick evening review locks words into long-term memory overnight.";
            bannerRes = R.drawable.fox_notif_evening;
            avatarRes = R.drawable.fox_avatar_evening;
            notifId = NOTIF_ID_EVENING;
        } else if (SLOT_NUDGE_16H.equals(slotType)) {
            title = "HI! Dein Fuchs vermisst dich";
            body = "It has been 16 hours since your last session — fancy a 2-minute German refresh?";
            bannerRes = R.drawable.fox_notif_nudge16;
            avatarRes = R.drawable.fox_avatar_nudge16;
            notifId = NOTIF_ID_NUDGE_16H;
        } else if (SLOT_NUDGE_24H.equals(slotType)) {
            title = "24 hours since your last cards";
            body = "Don't let yesterday's words fade away — tap to wake up your study fox.";
            bannerRes = R.drawable.fox_notif_nudge24;
            avatarRes = R.drawable.fox_avatar_nudge24;
            notifId = NOTIF_ID_NUDGE_24H;
        } else {
            title = "Achsoo Fox is ready!";
            body = "Rich fox study reminders are active — Morning, Evening, Streak Rescue, and 16h/24h nudges.";
            bannerRes = R.drawable.fox_notif_triumph;
            avatarRes = R.drawable.fox_avatar_triumph;
            notifId = NOTIF_ID_TEST;
        }

        if (isTest) {
            notifId = NOTIF_ID_TEST;
        }

        Intent launchIntent = new Intent(context, MainActivity.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        launchIntent.putExtra("achsoo_open_tab", "study");

        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            piFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent contentIntent = PendingIntent.getActivity(context, notifId, launchIntent, piFlags);

        Bitmap avatarBitmap = BitmapFactory.decodeResource(context.getResources(), avatarRes);
        Bitmap bannerBitmap = BitmapFactory.decodeResource(context.getResources(), bannerRes);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_achsoo_fox)
            .setColor(Color.parseColor("#D97757"))
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setCategory(NotificationCompat.CATEGORY_REMINDER);

        if (avatarBitmap != null) {
            builder.setLargeIcon(avatarBitmap);
        }

        if (bannerBitmap != null) {
            builder.setStyle(
                new NotificationCompat.BigPictureStyle()
                    .bigPicture(bannerBitmap)
                    .bigLargeIcon((Bitmap) null)
                    .setSummaryText(body)
            );
        } else {
            builder.setStyle(new NotificationCompat.BigTextStyle().bigText(body));
        }

        try {
            NotificationManagerCompat.from(context).notify(notifId, builder.build());
        } catch (SecurityException ignored) {
            // Permission revoked concurrently
        }
    }

    private static long nextDailyTimeMillis(int hour, int minute, boolean forceTomorrow) {
        Calendar now = Calendar.getInstance();
        Calendar target = (Calendar) now.clone();
        target.set(Calendar.HOUR_OF_DAY, hour);
        target.set(Calendar.MINUTE, minute);
        target.set(Calendar.SECOND, 0);
        target.set(Calendar.MILLISECOND, 0);

        if (forceTomorrow || target.getTimeInMillis() <= now.getTimeInMillis() + 60_000L) {
            target.add(Calendar.DAY_OF_YEAR, 1);
        }
        return target.getTimeInMillis();
    }

    /**
     * Protects sleep by shifting any inactivity nudge landing between 22:30 and 07:30 to 08:00.
     */
    private static long adjustOutOfQuietHours(long triggerMs) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(triggerMs);
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        int minute = cal.get(Calendar.MINUTE);

        boolean afterLateCutoff = hour > 22 || (hour == 22 && minute >= 30);
        boolean beforeMorningCutoff = hour < 7 || (hour == 7 && minute < 30);

        if (afterLateCutoff) {
            cal.add(Calendar.DAY_OF_YEAR, 1);
            cal.set(Calendar.HOUR_OF_DAY, 8);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
        } else if (beforeMorningCutoff) {
            cal.set(Calendar.HOUR_OF_DAY, 8);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
        }
        return cal.getTimeInMillis();
    }

    private static boolean isTooClose(long candidateMs, long otherMs) {
        return otherMs > 0L && Math.abs(candidateMs - otherMs) < MIN_GAP_MS;
    }

    private static void scheduleAlarm(Context context, int requestCode, String slotType, long triggerAtMillis) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        PendingIntent pi = buildReminderPendingIntent(context, requestCode, slotType);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pi);
            } else {
                alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAtMillis, pi);
            }
        } catch (SecurityException ignored) {
            // Ignore if restricted
        }
    }

    private static void cancelAlarm(Context context, int requestCode, String slotType) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;
        alarmManager.cancel(buildReminderPendingIntent(context, requestCode, slotType));
    }

    private static PendingIntent buildReminderPendingIntent(Context context, int requestCode, String slotType) {
        Intent intent = new Intent(context, AchsooReminderReceiver.class);
        intent.putExtra(EXTRA_SLOT_TYPE, slotType);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getBroadcast(context, requestCode, intent, flags);
    }
}
