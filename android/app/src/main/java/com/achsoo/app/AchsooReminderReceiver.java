package com.achsoo.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Receives scheduled study reminder alarms and renders the matching rich fox notification.
 */
public class AchsooReminderReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null) return;
        String slotType = intent != null
            ? intent.getStringExtra(AchsooReminderScheduler.EXTRA_SLOT_TYPE)
            : AchsooReminderScheduler.SLOT_MORNING;
        if (slotType == null || slotType.isEmpty()) {
            slotType = AchsooReminderScheduler.SLOT_MORNING;
        }
        AchsooReminderScheduler.handleScheduledAlarm(context, slotType);
    }
}
