import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { FoxMascot } from './FoxMascot';

interface AuthGateScreenProps {
  onSignInWithGoogle: () => Promise<{ error: string | null }>;
  initialError?: string | null;
  appearanceControls?: React.ReactNode;
}

export const AuthGateScreen: React.FC<AuthGateScreenProps> = ({
  onSignInWithGoogle,
  initialError = null,
  appearanceControls,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

  const handleGoogleClick = async () => {
    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    const result = await onSignInWithGoogle();
    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
    }
    // On web redirect, browser navigates away; on native Android, keep spinner brief
    // until appUrlOpen fires or user cancels returning from Chrome
    window.setTimeout(() => {
      setIsSubmitting(false);
    }, 8000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--bg-canvas)] text-[var(--fg-primary)] transition-colors duration-200">
      {/* Top minimal utility bar for theme toggle */}
      <header className="w-full pt-[var(--safe-area-inset-top,env(safe-area-inset-top,0px))]">
        <div className="max-w-5xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-[var(--fg-primary)]">
              Achsoo
            </span>
            <span className="inline-flex items-center gap-1" aria-hidden="true">
              <span className="w-2 h-1 rounded-full bg-[var(--brand-sage)]" />
              <span className="w-2 h-1 rounded-full bg-[var(--brand-fjord)]" />
              <span className="w-2 h-1 rounded-full bg-[var(--brand-coral)]" />
            </span>
          </div>
          {appearanceControls}
        </div>
      </header>

      {/* Centered Welcome & Google Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <div className="w-full max-w-[420px] rounded-[var(--radius-card)] surface-paper border border-[var(--border-subtle)] shadow-ring p-6 sm:p-8 text-center space-y-6 modal-pop-enter">
          <div className="flex justify-center">
            <FoxMascot
              pose="welcome"
              size="lg"
              interactive
              speechPlacement="top"
            />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-[1.65rem] font-bold tracking-tight text-[var(--fg-primary)]">
              Willkommen bei Achsoo!
            </h1>
            <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
              Sign in with your Google account to save your German flashcards,
              study streaks, and progress across all your devices.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-[var(--radius-control)] border border-[var(--intent-danger-border)] bg-[var(--intent-danger-soft)] text-left flex items-start gap-2.5 text-xs text-[var(--fg-primary)]"
            >
              <AlertCircle className="w-4 h-4 text-[var(--intent-danger)] shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isSubmitting}
            className="w-full min-h-[48px] px-4 py-3 rounded-[var(--radius-control)] surface-1 border border-[var(--border-strong)] shadow-ring hover:bg-[var(--surface-2)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait transition-all duration-150 flex items-center justify-center gap-3 font-sans text-sm font-semibold text-[var(--fg-primary)] cursor-pointer theme-focus"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[var(--intent-primary)]" />
                <span>Connecting to Google…</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.09.73-2.49 1.16-4.22 1.16-3.24 0-5.99-2.19-6.97-5.13H1.02v3.14C3.03 21.15 7.18 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.03 14.02c-.25-.73-.39-1.52-.39-2.32s.14-1.59.39-2.32V6.24H1.02C.37 7.53 0 8.98 0 10.5s.37 2.97 1.02 4.26l4.01-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.07 1.19 15.3 0 12 0 7.18 0 3.03 2.85 1.02 6.24l4.01 3.14c.98-2.94 3.73-5.13 6.97-5.13Z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1.5 text-[11.5px] text-[var(--fg-muted)]">
            <div className="inline-flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--intent-success)] shrink-0" />
              <span>One-tap sign in · Works offline once signed in</span>
            </div>
            <div className="inline-flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
              <span>Your streaks &amp; stats stay private to your account</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
