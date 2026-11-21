package com.achsoo.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Triggered at each of the 6 daily clock boundaries (00:00, 05:00, 09:00, 13:00, 17:00, 21:00)
 * to switch the Android launcher icon in the background without interrupting active study sessions.
 */
public class AchsooIconSwitchReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null) return;
        if (AchsooIconManager.isAutoEnabled(context)) {
            AchsooIconManager.applyTargetIconIfSafe(context, false);
            AchsooIconManager.scheduleNextIconBoundaryAlarm(context);
        }
    }
}
