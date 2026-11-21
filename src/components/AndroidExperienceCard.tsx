import React, { useCallback, useEffect, useState } from 'react';
import { Bell, BellRing, Clock3, Flame, Moon, Sun } from 'lucide-react';
import { Card } from './HeroPrimitives';
import {
  getNativeNotificationPermission,
  isNativeAndroidApp,
  requestNativeNotificationPermission,
  sendNativeTestNotification,
  type NotificationPermissionStatus,
  type ReminderPreferences,
} from '../utils/nativeAndroid';

interface AndroidExperienceCardProps {
  reminderPrefs: ReminderPreferences;
  onUpdateReminderPrefs: (next: ReminderPreferences) => void;
  streakDays: number;
  reviewedToday: number;
}

const TEST_POSE_LABELS = [
  'Coffee & Cards (Morning)',
  'Midnight Oil (Streak Rescue)',
  'Cozy Student (Evening)',
  'HI! DE (16h Nudge)',
  'Study Sleepy (24h Nudge)',
  'Triumph Fox (Ready)',
];

interface ToggleSwitchProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  disabled = false,
  label,
  onChange,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 theme-focus ${
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'
    } ${
      checked
        ? 'bg-[var(--intent-primary)] border-[var(--intent-primary)]'
        : 'surface-2 border-[var(--border-strong)]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        checked ? 'translate-x-5.5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

export const AndroidExperienceCard: React.FC<AndroidExperienceCardProps> = ({
  reminderPrefs,
  onUpdateReminderPrefs,
  streakDays,
  reviewedToday,
}) => {
  const isNative = isNativeAndroidApp();
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>(isNative ? 'prompt' : 'unsupported');
  const [testPoseIdx, setTestPoseIdx] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    if (!isNative) return;
    let active = true;
    void getNativeNotificationPermission().then((status) => {
      if (active) setPermissionStatus(status);
    });
    return () => {
      active = false;
    };
  }, [isNative]);

  const handleToggleMaster = useCallback(async () => {
    const nextEnabled = !reminderPrefs.enabled;
    setStatusMessage(null);

    if (nextEnabled && isNative && permissionStatus !== 'granted') {
      const grantedStatus = await requestNativeNotificationPermission();
      setPermissionStatus(grantedStatus);
      if (grantedStatus !== 'granted') {
        setStatusMessage(
          'Notification permission is off. Enable notifications for Achsoo in Android Settings to receive fox reminders.'
        );
        onUpdateReminderPrefs({ ...reminderPrefs, enabled: false });
        return;
      }
    }

    onUpdateReminderPrefs({ ...reminderPrefs, enabled: nextEnabled });
  }, [isNative, onUpdateReminderPrefs, permissionStatus, reminderPrefs]);

  const handleToggleSlot = useCallback(
    (key: 'morningEnabled' | 'eveningEnabled' | 'inactivityEnabled') => {
      setStatusMessage(null);
      onUpdateReminderPrefs({
        ...reminderPrefs,
        [key]: !reminderPrefs[key],
      });
    },
    [onUpdateReminderPrefs, reminderPrefs]
  );

  const handleSendTest = useCallback(async () => {
    if (isSendingTest) return;
    setIsSendingTest(true);
    setStatusMessage(null);

    try {
      if (!isNative) {
        const label = TEST_POSE_LABELS[testPoseIdx % TEST_POSE_LABELS.length];
        setTestPoseIdx((prev) => (prev + 1) % TEST_POSE_LABELS.length);
        setStatusMessage(
          `Previewing "${label}". Install the Android APK to receive live rich fox banners in your notification shade.`
        );
        return;
      }

      if (permissionStatus !== 'granted') {
        const nextStatus = await requestNativeNotificationPermission();
        setPermissionStatus(nextStatus);
        if (nextStatus !== 'granted') {
          setStatusMessage(
            'Allow notifications in Android Settings to preview fox reminders.'
          );
          return;
        }
      }

      const res = await sendNativeTestNotification(testPoseIdx);
      if (res.sent) {
        const label = TEST_POSE_LABELS[testPoseIdx % TEST_POSE_LABELS.length];
        setTestPoseIdx((prev) => (prev + 1) % TEST_POSE_LABELS.length);
        setStatusMessage(`Sent "${label}" to your Android notification shade.`);
      } else {
        setStatusMessage(
          'Allow notifications for Achsoo in Android Settings to send a test.'
        );
      }
    } finally {
      setIsSendingTest(false);
    }
  }, [isNative, isSendingTest, permissionStatus, testPoseIdx]);

  const slotsDisabled = !reminderPrefs.enabled;

  return (
    <Card.Root className="p-5 surface-paper space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--intent-primary)] shrink-0" />
            <h3 className="font-display text-sm font-bold text-[var(--fg-primary)]">
              Smart Fox Study Reminders
            </h3>
          </div>
          <p className="text-xs text-[var(--fg-secondary)] mt-1 leading-relaxed">
            Calm offline nudges with fox illustrations — automatically paused whenever you study and quiet from{' '}
            <span className="tabular-nums font-medium text-[var(--fg-primary)]">
              22:30 – 07:30
            </span>
            .
          </p>
        </div>

        <ToggleSwitch
          checked={reminderPrefs.enabled}
          label="Toggle all smart fox study reminders"
          onChange={handleToggleMaster}
        />
      </div>

      <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
        {/* Morning practice */}
        <div className="py-3 flex items-center justify-between gap-3 min-h-[48px]">
          <div className="flex items-start gap-2.5 min-w-0">
            <Sun className="w-4 h-4 text-[var(--fg-muted)] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="font-display text-xs font-bold text-[var(--fg-primary)]">
                Morning Practice ·{' '}
                <span className="tabular-nums font-medium text-[var(--fg-secondary)]">
                  08:30
                </span>
              </div>
              <div className="text-[11px] text-[var(--fg-muted)] mt-0.5">
                Coffee &amp; Cards fox · skipped if you already reviewed today
              </div>
            </div>
          </div>
          <ToggleSwitch
            checked={reminderPrefs.morningEnabled}
            disabled={slotsDisabled}
            label="Toggle morning practice reminder"
            onChange={() => handleToggleSlot('morningEnabled')}
          />
        </div>

        {/* Evening & Streak Rescue */}
        <div className="py-3 flex items-center justify-between gap-3 min-h-[48px]">
          <div className="flex items-start gap-2.5 min-w-0">
            <Flame className="w-4 h-4 text-[var(--fg-muted)] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="font-display text-xs font-bold text-[var(--fg-primary)]">
                Evening &amp; Streak Rescue ·{' '}
                <span className="tabular-nums font-medium text-[var(--fg-secondary)]">
                  20:00
                </span>
              </div>
              <div className="text-[11px] text-[var(--fg-muted)] mt-0.5">
                {streakDays > 0 && reviewedToday === 0
                  ? `Lantern fox protects your ${streakDays}-day streak before midnight`
                  : 'Cozy evening wind-down · switches to Streak Rescue when needed'}
              </div>
            </div>
          </div>
          <ToggleSwitch
            checked={reminderPrefs.eveningEnabled}
            disabled={slotsDisabled}
            label="Toggle evening and streak rescue reminder"
            onChange={() => handleToggleSlot('eveningEnabled')}
          />
        </div>

        {/* 16h & 24h Inactivity Nudges */}
        <div className="py-3 flex items-center justify-between gap-3 min-h-[48px]">
          <div className="flex items-start gap-2.5 min-w-0">
            <Clock3 className="w-4 h-4 text-[var(--fg-muted)] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="font-display text-xs font-bold text-[var(--fg-primary)]">
                Inactivity Nudges ·{' '}
                <span className="tabular-nums font-medium text-[var(--fg-secondary)]">
                  16h &amp; 24h
                </span>
              </div>
              <div className="text-[11px] text-[var(--fg-muted)] mt-0.5">
                HI! DE &amp; Sleepy fox · resets after every session and respects quiet hours
              </div>
            </div>
          </div>
          <ToggleSwitch
            checked={reminderPrefs.inactivityEnabled}
            disabled={slotsDisabled}
            label="Toggle 16-hour and 24-hour inactivity nudges"
            onChange={() => handleToggleSlot('inactivityEnabled')}
          />
        </div>
      </div>

      <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)]">
          <Moon className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isNative
              ? permissionStatus === 'granted'
                ? 'Android notifications active'
                : permissionStatus === 'denied'
                  ? 'Blocked in Android Settings'
                  : 'Tap test or toggle to grant permission'
              : 'Active automatically in the Android APK'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSendTest}
          disabled={isSendingTest}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold surface-2 border border-[var(--border-subtle)] text-[var(--fg-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] theme-focus"
        >
          <BellRing className="w-3.5 h-3.5 text-[var(--intent-primary)]" />
          <span>Send Test Fox Notification</span>
        </button>
      </div>

      {statusMessage && (
        <p className="text-xs text-[var(--fg-secondary)] pt-1 border-t border-[var(--border-subtle)] leading-relaxed">
          {statusMessage}
        </p>
      )}
    </Card.Root>
  );
};
