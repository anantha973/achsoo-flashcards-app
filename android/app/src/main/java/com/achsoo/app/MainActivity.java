package com.achsoo.app;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Register AchsooNativePlugin before BridgeActivity initializes Capacitor
        registerPlugin(AchsooNativePlugin.class);

        super.onCreate(savedInstanceState);

        Window window = getWindow();
        if (window != null) {
            window.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#171412")));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setNavigationBarContrastEnforced(false);
                window.setStatusBarContrastEnforced(false);
            }
        }

        AchsooReminderScheduler.ensureChannel(this);
        AchsooIconManager.scheduleNextIconBoundaryAlarm(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        AchsooIconManager.setAppInForeground(true);
    }

    @Override
    public void onStop() {
        super.onStop();
        AchsooIconManager.setAppInForeground(false);
        // Safely apply the active time-of-day launcher icon when the user backgrounds the app
        AchsooIconManager.applyTargetIconIfSafe(this, false);
        AchsooIconManager.scheduleNextIconBoundaryAlarm(this);
    }
}
