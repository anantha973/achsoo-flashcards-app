import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CloudOff,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import type { AuthUserSummary, SyncStatusState } from '../utils/supabaseSync';

interface AccountControlProps {
  user: AuthUserSummary;
  syncStatus: SyncStatusState;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSyncNow: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

function getInitials(user: AuthUserSummary): string {
  const source = user.fullName || user.email || 'A';
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatSyncTimestamp(iso: string | null): string {
  if (!iso) return 'Ready to sync';
  const diffMs = Date.now() - Date.parse(iso);
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'Synced just now';
  if (diffMs < 45_000) return 'Synced just now';
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `Synced ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `Synced ${hrs}h ago`;
}

export const AccountControl: React.FC<AccountControlProps> = ({
  user,
  syncStatus,
  isOpen,
  onOpenChange,
  onSyncNow,
  onSignOut,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [popoverState, setPopoverState] = useState<'open' | 'closed'>('closed');
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    right: number;
    maxHeight: number;
    isMobile: boolean;
  } | null>(null);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user.avatarUrl]);

  const updatePopoverPosition = useCallback(() => {
    const trigger = triggerBtnRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const isMobile = viewportW < 640;
    const top = Math.max(12, Math.round(rect.bottom + 10));
    const right = Math.max(12, Math.round(viewportW - rect.right));
    const maxHeight = Math.max(200, Math.round(viewportH - top - 16));
    setPopoverPos((prev) =>
      prev &&
      prev.top === top &&
      prev.right === right &&
      prev.maxHeight === maxHeight &&
      prev.isMobile === isMobile
        ? prev
        : { top, right, maxHeight, isMobile }
    );
  }, []);

  // Bidirectional smooth mount/unmount matching Theme Selector popover
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setPopoverState('open');
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }

    setPopoverState('closed');
    if (!isMounted) return;
    const timer = window.setTimeout(() => {
      setIsMounted(false);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [isOpen, isMounted]);

  useLayoutEffect(() => {
    if (!isMounted) return;
    updatePopoverPosition();
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('orientationchange', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);
    return () => {
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('orientationchange', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [isMounted, updatePopoverPosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const insideTrigger =
        containerRef.current && containerRef.current.contains(target);
      const insidePanel = panelRef.current && panelRef.current.contains(target);
      if (!insideTrigger && !insidePanel) {
        onOpenChange(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  const handleSyncClick = async () => {
    if (isManualSyncing) return;
    setIsManualSyncing(true);
    try {
      await onSyncNow();
    } finally {
      setIsManualSyncing(false);
    }
  };

  const handleSignOutClick = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      onOpenChange(false);
      await onSignOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = user.fullName || user.email?.split('@')[0] || 'Achsoo Learner';
  const firstName = displayName.split(/\s+/)[0] || displayName;
  const initials = getInitials(user);

  const isSyncingNow = isManualSyncing || syncStatus.status === 'syncing';
  const statusDotClass = isSyncingNow
    ? 'bg-amber-500 animate-pulse'
    : syncStatus.status === 'synced'
    ? 'bg-emerald-500'
    : syncStatus.status === 'error'
    ? 'bg-rose-500'
    : 'bg-slate-400';

  const statusText = isSyncingNow
    ? 'Syncing progress…'
    : syncStatus.status === 'offline'
    ? 'Offline · Saved on device'
    : syncStatus.status === 'error'
    ? syncStatus.errorMessage || 'Sync paused · Saved locally'
    : formatSyncTimestamp(syncStatus.lastSyncedAt);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        ref={triggerBtnRef}
        type="button"
        onClick={() => {
          updatePopoverPosition();
          onOpenChange(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Account menu for ${displayName}`}
        title={`${displayName} · Cloud sync`}
        className="min-h-[40px] sm:min-h-[38px] pl-1.5 pr-2 py-1 radius-control surface-1 border shadow-ring flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-95 transition-[background-color,color,border-color,box-shadow,transform] duration-150 theme-focus cursor-pointer"
      >
        <span className="relative w-6 h-6 rounded-full shrink-0">
          {user.avatarUrl && !avatarFailed ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={() => setAvatarFailed(true)}
              className="w-6 h-6 rounded-full object-cover border border-[var(--border-subtle)]"
            />
          ) : (
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] border border-[var(--intent-primary-border)]">
              {initials}
            </span>
          )}
          <span
            aria-hidden="true"
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface-1)] ${statusDotClass}`}
          />
        </span>

        <span className="hidden lg:inline max-w-[88px] truncate">
          {firstName}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 sm:w-3 sm:h-3 text-[var(--fg-muted)] transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isMounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Google account and cloud sync"
            data-state={popoverState}
            style={
              popoverPos
                ? popoverPos.isMobile
                  ? {
                      top: `${popoverPos.top}px`,
                      maxHeight: `${popoverPos.maxHeight}px`,
                    }
                  : {
                      top: `${popoverPos.top}px`,
                      right: `${popoverPos.right}px`,
                      maxHeight: `${popoverPos.maxHeight}px`,
                    }
                : undefined
            }
            className={`fixed z-[70] p-3.5 surface-overlay border space-y-3 popover-panel overflow-y-auto overscroll-contain ${
              popoverPos?.isMobile ?? true
                ? 'left-3 right-3 mx-auto w-auto max-w-[380px]'
                : 'w-80'
            }`}
          >
            {/* User Header */}
            <div className="flex items-center gap-3 pb-2.5 border-b border-[var(--border-subtle)]">
              {user.avatarUrl && !avatarFailed ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-11 h-11 rounded-full object-cover border border-[var(--border-strong)] shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-display text-sm font-bold bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] border border-[var(--intent-primary-border)] shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-bold text-[var(--fg-primary)] truncate">
                  {displayName}
                </div>
                {user.email && (
                  <div className="text-xs text-[var(--fg-secondary)] truncate">
                    {user.email}
                  </div>
                )}
              </div>
            </div>

            {/* Cloud Sync Status */}
            <div className="p-2.5 rounded-[var(--radius-control)] surface-2 border border-[var(--border-subtle)] flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                {syncStatus.status === 'offline' ? (
                  <CloudOff className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
                ) : syncStatus.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-[var(--intent-danger)] shrink-0" />
                ) : (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isSyncingNow
                        ? 'text-amber-500'
                        : 'text-[var(--intent-success)]'
                    }`}
                  />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--fg-primary)]">
                    Cloud Sync
                  </div>
                  <div className="text-[11px] text-[var(--fg-secondary)] truncate">
                    {statusText}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncClick}
                disabled={isSyncingNow}
                className="px-2.5 py-1.5 rounded-[var(--radius-control)] surface-1 border border-[var(--border-subtle)] shadow-ring text-[11px] font-semibold text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-95 disabled:opacity-60 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer theme-focus"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isSyncingNow ? 'animate-spin' : ''}`}
                />
                <span>Sync</span>
              </button>
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOutClick}
              disabled={isSigningOut}
              className="w-full min-h-[40px] px-3 py-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] hover:bg-[var(--intent-danger-soft)] hover:border-[var(--intent-danger-border)] hover:text-[var(--intent-danger)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--fg-secondary)] cursor-pointer theme-focus"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
