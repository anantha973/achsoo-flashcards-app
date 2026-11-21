package com.achsoo.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Restores scheduled fox reminders and time-of-day icon boundary alarms after device reboot,
 * app update, or local clock/timezone changes.
 */
public class AchsooBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null) return;
        AchsooReminderScheduler.rescheduleAll(context);
        AchsooIconManager.applyTargetIconIfSafe(context, false);
        AchsooIconManager.scheduleNextIconBoundaryAlarm(context);
    }
}
