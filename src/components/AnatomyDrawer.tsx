import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Volume2, X } from 'lucide-react';
import {
  CardCategory,
  NounGender,
  VocabCard,
  stripLeadingGermanArticles,
} from '../data/vocabData';
import { useSheetSwipeDismiss } from '../hooks/useMobileGestures';
import { triggerHapticFeedback } from '../utils/srsEngine';
import { Button } from './HeroPrimitives';
import { FoxMascot } from './FoxMascot';
import { PillOption, SlidingPillSwitcher } from './SlidingPillSwitcher';

const ANATOMY_TAB_MEMORY_KEY = 'achsoo_anatomy_tab_memory_v2';

type PrimaryTabId = string;
type NestedTabId = string;

interface TabMemoryMap {
  verb?: string;
  noun?: string;
  adj?: string;
  preposition?: string;
  conn?: string;
  phrase?: string;
}

function loadTabMemory(): TabMemoryMap {
  try {
    const raw = localStorage.getItem(ANATOMY_TAB_MEMORY_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TabMemoryMap;
  } catch {
    return {};
  }
}

function saveTabMemory(category: CardCategory, tabId: string): void {
  try {
    const current = loadTabMemory();
    const updated: TabMemoryMap = { ...current, [category]: tabId };
    localStorage.setItem(ANATOMY_TAB_MEMORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

function getPrimaryTabsForCategory(category: CardCategory): {
  tabs: PillOption<string>[];
  defaultTab: string;
} {
  switch (category) {
    case 'noun':
      return {
        tabs: [
          { id: 'deklination', label: 'Deklination' },
          { id: 'verbindungen', label: 'Wendungen' },
          { id: 'familie', label: 'Familie & Tipp' },
        ],
        defaultTab: 'deklination',
      };
    case 'verb':
      return {
        tabs: [
          { id: 'konjugation', label: 'Konjugation' },
          { id: 'valenz', label: 'Valenz' },
          { id: 'familie', label: 'Familie & Tipp' },
        ],
        defaultTab: 'konjugation',
      };
    case 'adj':
      return {
        tabs: [
          { id: 'endungen', label: 'Endungen' },
          { id: 'synonyme', label: 'Synonyme' },
          { id: 'tipp', label: 'Tipp' },
        ],
        defaultTab: 'endungen',
      };
    case 'preposition':
      return {
        tabs: [
          { id: 'vergleich', label: 'Regel' },
          { id: 'verbindungen', label: 'Wendungen' },
          { id: 'tipp', label: 'Tipp' },
        ],
        defaultTab: 'vergleich',
      };
    case 'conn':
      return {
        tabs: [
          { id: 'satzbau', label: 'Satzbau' },
          { id: 'vergleich', label: 'Kontrast' },
          { id: 'tipp', label: 'Tipp' },
        ],
        defaultTab: 'satzbau',
      };
    case 'phrase':
      return {
        tabs: [
          { id: 'dialog', label: 'Dialog' },
          { id: 'beispiele', label: 'Varianten' },
          { id: 'tipp', label: 'Tipp' },
        ],
        defaultTab: 'dialog',
      };
  }
}

function getNestedTabs(
  card: VocabCard,
  primaryTab: string
): PillOption<string>[] | null {
  if (card.category === 'verb' && primaryTab === 'konjugation') {
    return [
      { id: 'praesens', label: 'Präsens' },
      { id: 'praeteritum', label: 'Präteritum' },
      { id: 'perfekt', label: 'Perfekt' },
      { id: 'konj2', label: 'Konj. II' },
      { id: 'imperativ', label: 'Imperativ' },
    ];
  }
  if (card.category === 'adj' && primaryTab === 'endungen') {
    return [
      { id: 'weak', label: 'der/die/das' },
      { id: 'mixed', label: 'ein/kein' },
      { id: 'strong', label: 'ohne Artikel' },
    ];
  }
  if (
    card.category === 'preposition' &&
    primaryTab === 'vergleich' &&
    card.prepDetails?.isWechsel
  ) {
    return [
      { id: 'wo', label: 'Wo? · Dativ' },
      { id: 'wohin', label: 'Wohin? · Akk.' },
    ];
  }
  if (card.category === 'conn' && primaryTab === 'satzbau') {
    return [
      { id: 'hauptsatz', label: 'Hauptsatz voran' },
      { id: 'nebensatz', label: 'Nebensatz voran' },
    ];
  }
  if (card.category === 'phrase' && primaryTab === 'beispiele') {
    return [
      { id: 'formell', label: 'formell' },
      { id: 'informell', label: 'informell' },
    ];
  }
  return null;
}

interface AnatomyDrawerProps {
  card: VocabCard;
  onClose: () => void;
  onPlayAudio: (text?: string, idTag?: string, e?: React.MouseEvent) => void;
  speakingId: string | null;
}

export const AnatomyDrawer: React.FC<AnatomyDrawerProps> = ({
  card,
  onClose,
  onPlayAudio,
  speakingId,
}) => {
  const { tabs: primaryTabs, defaultTab } = useMemo(
    () => getPrimaryTabsForCategory(card.category),
    [card.category]
  );

  const [activePrimaryTab, setActivePrimaryTab] = useState<PrimaryTabId>(() => {
    const memory = loadTabMemory();
    const saved = memory[card.category];
    if (saved && primaryTabs.some((t) => t.id === saved)) {
      return saved;
    }
    return defaultTab;
  });

  const [primaryTabDir, setPrimaryTabDir] = useState<'next' | 'prev'>('next');
  const [nestedTabDir, setNestedTabDir] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    const memory = loadTabMemory();
    const saved = memory[card.category];
    if (saved && primaryTabs.some((t) => t.id === saved)) {
      setActivePrimaryTab(saved);
    } else {
      setActivePrimaryTab(defaultTab);
    }
    setPrimaryTabDir('next');
    setNestedTabDir('next');
  }, [card.id, card.category, primaryTabs, defaultTab]);

  const handleSelectPrimaryTab = useCallback(
    (tabId: string) => {
      const prevIdx = primaryTabs.findIndex((t) => t.id === activePrimaryTab);
      const nextIdx = primaryTabs.findIndex((t) => t.id === tabId);
      if (prevIdx !== -1 && nextIdx !== -1 && nextIdx !== prevIdx) {
        setPrimaryTabDir(nextIdx > prevIdx ? 'next' : 'prev');
      }
      setActivePrimaryTab(tabId);
      saveTabMemory(card.category, tabId);
    },
    [card.category, primaryTabs, activePrimaryTab]
  );

  const nestedTabs = useMemo(
    () => getNestedTabs(card, activePrimaryTab),
    [card, activePrimaryTab]
  );

  const [activeNestedTab, setActiveNestedTab] = useState<NestedTabId>(() =>
    nestedTabs && nestedTabs.length > 0 ? nestedTabs[0].id : ''
  );

  const handleSelectNestedTab = useCallback(
    (tabId: NestedTabId) => {
      if (nestedTabs && nestedTabs.length > 0) {
        const prevIdx = nestedTabs.findIndex((t) => t.id === activeNestedTab);
        const nextIdx = nestedTabs.findIndex((t) => t.id === tabId);
        if (prevIdx !== -1 && nextIdx !== -1 && nextIdx !== prevIdx) {
          setNestedTabDir(nextIdx > prevIdx ? 'next' : 'prev');
        }
      }
      setActiveNestedTab(tabId);
    },
    [nestedTabs, activeNestedTab]
  );

  useEffect(() => {
    if (nestedTabs && nestedTabs.length > 0) {
      setActiveNestedTab(nestedTabs[0].id);
    } else {
      setActiveNestedTab('');
    }
    setNestedTabDir('next');
  }, [nestedTabs]);

  // Keyboard shortcuts inside Layer 2: [T] cycles primary pill, [Shift+T] cycles nested pill
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (e.shiftKey && nestedTabs && nestedTabs.length > 1) {
          const idx = nestedTabs.findIndex((t) => t.id === activeNestedTab);
          const nextIdx = (idx + 1) % nestedTabs.length;
          handleSelectNestedTab(nestedTabs[nextIdx].id);
        } else {
          const idx = primaryTabs.findIndex((t) => t.id === activePrimaryTab);
          const nextIdx = (idx + 1) % primaryTabs.length;
          handleSelectPrimaryTab(primaryTabs[nextIdx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    primaryTabs,
    activePrimaryTab,
    nestedTabs,
    activeNestedTab,
    handleSelectPrimaryTab,
    handleSelectNestedTab,
  ]);

  const getNounGenderColor = (gender?: NounGender) => {
    if (gender === 'der') return 'text-[var(--gender-m)]';
    if (gender === 'die') return 'text-[var(--gender-f)]';
    if (gender === 'das') return 'text-[var(--gender-n)]';
    return '';
  };

  const renderStyledLemma = () => {
    if (card.category === 'noun' && card.nounDetails) {
      return (
        <>
          <span className={getNounGenderColor(card.nounDetails.gender)}>
            {card.nounDetails.gender}
          </span>{' '}
          <span>{stripLeadingGermanArticles(card.lemma)}</span>
        </>
      );
    }
    if (
      card.category === 'verb' &&
      card.verbDetails?.separablePrefix &&
      card.verbDetails?.verbStem
    ) {
      const pref = card.verbDetails.separablePrefix;
      const stem = card.verbDetails.verbStem;
      const combined = `${pref}${stem}`;
      const cleanLemma = card.lemma.trim();
      if (cleanLemma === combined || cleanLemma.endsWith(combined)) {
        const leading = cleanLemma.slice(0, cleanLemma.length - combined.length);
        return (
          <>
            {leading && <span>{leading}</span>}
            <span className="text-terracotta">{pref}</span>
            <span className="text-terracotta font-normal mx-0.5">|</span>
            <span>{stem}</span>
          </>
        );
      }
      return cleanLemma;
    }
    return card.lemma;
  };

  const headerRef = useRef<HTMLDivElement | null>(null);
  const sheetBodyRef = useRef<HTMLDivElement | null>(null);
  const contentMeasureRef = useRef<HTMLDivElement | null>(null);
  const prevHeightRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [bodyHeight, setBodyHeight] = useState<number | null>(null);

  const scheduleBodyHeight = useCallback(() => {
    const contentEl = contentMeasureRef.current;
    if (!contentEl) return;

    const headerHeight = headerRef.current?.offsetHeight ?? 170;
    const maxBodyHeight = Math.max(
      180,
      Math.floor(window.innerHeight * 0.86) - headerHeight - 4
    );
    const naturalHeight = Math.ceil(contentEl.offsetHeight);
    const clampedHeight = Math.min(naturalHeight, maxBodyHeight);

    // Initial mount: lock height immediately before first paint (no open jump)
    if (prevHeightRef.current === null) {
      prevHeightRef.current = clampedHeight;
      setBodyHeight(clampedHeight);
      return;
    }

    if (prevHeightRef.current === clampedHeight) {
      return;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Commit previous fixed height first, then transition on the next animation frame
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      prevHeightRef.current = clampedHeight;
      setBodyHeight(clampedHeight);
    });
  }, []);

  useLayoutEffect(() => {
    scheduleBodyHeight();
  }, [scheduleBodyHeight, card.id, activePrimaryTab, activeNestedTab]);

  useEffect(() => {
    const contentEl = contentMeasureRef.current;
    if (!contentEl) return;

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        scheduleBodyHeight();
      });
      ro.observe(contentEl);
      if (headerRef.current) ro.observe(headerRef.current);
    }

    window.addEventListener('resize', scheduleBodyHeight);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      ro?.disconnect();
      window.removeEventListener('resize', scheduleBodyHeight);
    };
  }, [scheduleBodyHeight]);

  const bodySwipeRef = useRef<{
    x: number;
    y: number;
    eligible: boolean;
  } | null>(null);

  const { dragY, isDragging, sheetTouchHandlers, sheetStyle } = useSheetSwipeDismiss({
    isOpen: true,
    onDismiss: onClose,
    scrollContainerRef: sheetBodyRef,
    threshold: 76,
  });

  const handleBodyTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      sheetTouchHandlers.onTouchStart(e);
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-no-tab-swipe]')) {
        bodySwipeRef.current = null;
        return;
      }
      bodySwipeRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        eligible: primaryTabs.length > 1,
      };
    },
    [primaryTabs.length, sheetTouchHandlers]
  );

  const handleBodyTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      sheetTouchHandlers.onTouchMove(e);
      const st = bodySwipeRef.current;
      if (!st || !st.eligible || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - st.x;
      const dy = e.touches[0].clientY - st.y;
      if (Math.abs(dy) > 22 && Math.abs(dy) > Math.abs(dx)) {
        st.eligible = false;
      }
    },
    [sheetTouchHandlers]
  );

  const handleBodyTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      sheetTouchHandlers.onTouchEnd(e);
      const st = bodySwipeRef.current;
      bodySwipeRef.current = null;
      if (!st || !st.eligible || e.changedTouches.length === 0) return;

      const dx = e.changedTouches[0].clientX - st.x;
      const dy = e.changedTouches[0].clientY - st.y;
      if (Math.abs(dx) >= 56 && Math.abs(dx) > Math.abs(dy) * 1.45) {
        const idx = primaryTabs.findIndex((t) => t.id === activePrimaryTab);
        if (idx === -1) return;
        const nextIdx =
          dx < 0
            ? Math.min(primaryTabs.length - 1, idx + 1)
            : Math.max(0, idx - 1);
        if (nextIdx !== idx) {
          triggerHapticFeedback(8);
          handleSelectPrimaryTab(primaryTabs[nextIdx].id);
        }
      }
    },
    [
      sheetTouchHandlers,
      primaryTabs,
      activePrimaryTab,
      handleSelectPrimaryTab,
    ]
  );

  const wheelDismissRef = useRef<{
    accum: number;
    lastTs: number;
    startedAtTop: boolean;
  }>({ accum: 0, lastTs: 0, startedAtTop: true });

  const handleSheetWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      const scrollEl = sheetBodyRef.current;
      const atTop = !scrollEl || scrollEl.scrollTop <= 1;
      const now = performance.now();
      const state = wheelDismissRef.current;

      if (now - state.lastTs > 220) {
        state.accum = 0;
        state.startedAtTop = atTop;
      }
      state.lastTs = now;

      if (!atTop || !state.startedAtTop) {
        state.accum = 0;
        if (!atTop) state.startedAtTop = false;
        return;
      }

      if (e.deltaY < 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        state.accum += Math.abs(e.deltaY);
        if (state.accum >= 135) {
          state.accum = 0;
          triggerHapticFeedback(8);
          onClose();
        }
      } else if (e.deltaY > 0) {
        state.accum = 0;
      }
    },
    [onClose]
  );

  const backdropDim = Math.max(0.1, 1 - dragY / 280);

  const drawerContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-anatomy-title"
      onClick={onClose}
      style={{ opacity: backdropDim }}
      className="fixed inset-0 z-[60] h-[100dvh] w-screen flex items-end sm:items-center justify-center sm:p-4 bg-black/45 backdrop-blur-xs anatomy-backdrop-enter overscroll-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={sheetStyle}
        onWheel={handleSheetWheel}
        onTouchStart={handleBodyTouchStart}
        onTouchMove={handleBodyTouchMove}
        onTouchEnd={handleBodyTouchEnd}
        onTouchCancel={sheetTouchHandlers.onTouchCancel}
        className="w-full max-w-xl md:max-w-2xl surface-overlay border rounded-b-none sm:rounded-[var(--radius-card)] max-h-[86dvh] pb-[env(safe-area-inset-bottom,0px)] sm:pb-0 flex flex-col overflow-hidden anatomy-sheet-enter overscroll-y-contain"
      >
        {/* ==================== EDITORIAL HEADER ==================== */}
        <div
          ref={headerRef}
          data-sheet-handle="true"
          className="shrink-0 z-20 surface-1 border-b border-[var(--border-subtle)] px-5 sm:px-7 pt-3.5 pb-4 space-y-3"
        >
          {/* Mobile Grab Handle (Draggable to dismiss) */}
          <div className="w-10 h-1 radius-pill bg-[var(--border-strong)] mx-auto sm:hidden" />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <div className="text-xs font-medium text-[var(--fg-secondary)]">
                <span className="font-sans font-bold text-[var(--accent-secondary)]">
                  {card.cefr}
                </span>
                <span aria-hidden="true"> · </span>
                <span>{card.grammarLabel}</span>
              </div>

              <h2
                id="word-anatomy-title"
                className="font-lemma text-2xl sm:text-3xl font-semibold text-[var(--fg-primary)] tracking-tight leading-tight break-words"
              >
                {renderStyledLemma()}
              </h2>

              <p className="font-display text-sm sm:text-base font-medium text-[var(--fg-secondary)] leading-snug">
                {card.translation}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <FoxMascot
                pose="aha"
                size="sm"
                interactive
                speechPlacement="bottom"
              />
              <Button
                intent={speakingId === 'drawer-lemma' ? 'primary' : 'tertiary'}
                size="icon"
                onClick={(e) =>
                  onPlayAudio(card.spokenText, 'drawer-lemma', e)
                }
                aria-label="Play word pronunciation"
                title="Pronunciation [A]"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                intent="tertiary"
                size="icon"
                onClick={onClose}
                aria-label="Close Anatomie drawer"
                title="Close [Esc]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Primary Sliding Segmented Pill Bar */}
          <div className="pt-0.5" data-no-tab-swipe="true">
            <SlidingPillSwitcher
              options={primaryTabs}
              value={activePrimaryTab}
              onChange={handleSelectPrimaryTab}
              ariaLabel="Anatomie sections"
              size="md"
              shortcutHint="T"
            />
          </div>
        </div>

        {/* ==================== SCROLLABLE EDITORIAL SHEET BODY (FIXED-HEIGHT + RAF TRANSITION) ==================== */}
        <div
          ref={sheetBodyRef}
          data-sheet-scroll="true"
          style={{
            height: bodyHeight !== null ? `${bodyHeight}px` : undefined,
            touchAction: isDragging ? 'none' : 'pan-y',
          }}
          className="overflow-y-auto overflow-x-hidden overscroll-y-contain anatomy-body-transition"
        >
          <div
            ref={contentMeasureRef}
            className="px-5 sm:px-7 py-5"
          >
            <div
              key={`${card.id}-${activePrimaryTab}`}
              className={`space-y-6 ${
                primaryTabDir === 'prev'
                  ? 'anatomy-tab-content-enter-prev'
                  : 'anatomy-tab-content-enter'
              }`}
            >
          {/* ==================== 1. NOMEN ANATOMY ==================== */}
          {card.category === 'noun' && (
            <>
              {activePrimaryTab === 'deklination' && (
                <div className="space-y-6">
                  {/* Editorial Summary Line instead of two nested boxes */}
                  {card.nounDetails && (
                    <div className="space-y-1.5 pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xs font-medium text-[var(--fg-muted)]">
                          Plural
                        </span>
                        <span className="font-display text-sm sm:text-base font-semibold text-[var(--fg-primary)]">
                          {card.nounDetails.plural}
                        </span>
                      </div>
                      {card.nounDetails.genusRule && (
                        <p className="text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
                          {card.nounDetails.genusRule}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Clean Hairline 4-Case Table (No outer box wrapper) */}
                  {card.anatomy.nounDeclension && (
                    <div>
                      <div className="grid grid-cols-[72px_1fr_1fr] sm:grid-cols-[96px_1fr_1fr] pb-2 border-b border-[var(--border-strong)] text-[11px] font-semibold text-[var(--fg-muted)]">
                        <span>Kasus</span>
                        <span>Singular</span>
                        <span>Plural</span>
                      </div>

                      <div className="divide-y divide-[var(--border-subtle)] text-xs sm:text-sm">
                        {(
                          [
                            {
                              label: 'Nom.',
                              sg:
                                card.anatomy.nounDeclension.singular?.nom ||
                                card.anatomy.nounDeclension.nominativ.split('·')[0],
                              pl:
                                card.anatomy.nounDeclension.singular?.nom
                                  ? card.anatomy.nounDeclension.plural?.nom
                                  : card.anatomy.nounDeclension.nominativ.split('·')[1],
                            },
                            {
                              label: 'Akk.',
                              sg:
                                card.anatomy.nounDeclension.singular?.akk ||
                                card.anatomy.nounDeclension.akkusativ.split('·')[0],
                              pl:
                                card.anatomy.nounDeclension.singular?.akk
                                  ? card.anatomy.nounDeclension.plural?.akk
                                  : card.anatomy.nounDeclension.akkusativ.split('·')[1],
                            },
                            {
                              label: 'Dat.',
                              sg:
                                card.anatomy.nounDeclension.singular?.dat ||
                                card.anatomy.nounDeclension.dativ.split('·')[0],
                              pl:
                                card.anatomy.nounDeclension.singular?.dat
                                  ? card.anatomy.nounDeclension.plural?.dat
                                  : card.anatomy.nounDeclension.dativ.split('·')[1],
                            },
                            {
                              label: 'Gen.',
                              sg:
                                card.anatomy.nounDeclension.singular?.gen ||
                                card.anatomy.nounDeclension.genitiv.split('·')[0],
                              pl:
                                card.anatomy.nounDeclension.singular?.gen
                                  ? card.anatomy.nounDeclension.plural?.gen
                                  : card.anatomy.nounDeclension.genitiv.split('·')[1],
                            },
                          ] as const
                        ).map((row, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-[72px_1fr_1fr] sm:grid-cols-[96px_1fr_1fr] py-3 items-baseline gap-2"
                          >
                            <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                              {row.label}
                            </span>
                            <span className="font-semibold text-[var(--fg-primary)] break-words">
                              {row.sg}
                            </span>
                            <span className="text-[var(--fg-secondary)] break-words">
                              {row.pl || '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activePrimaryTab === 'verbindungen' && (
                <div className="space-y-5">
                  <div className="divide-y divide-[var(--border-subtle)]">
                    {card.anatomy.collocations.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) =>
                          onPlayAudio(
                            col.replace(/\s*\(.*?\)/g, ''),
                            `noun-col-${idx}`,
                            e
                          )
                        }
                         className="w-full py-3 flex items-center justify-between gap-3 text-left text-sm text-[var(--fg-primary)] hover:text-[var(--accent-secondary)] transition-colors cursor-pointer"
                      >
                        <span className="font-medium leading-snug">{col}</span>
                        <Volume2 className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
                      </button>
                    ))}
                  </div>

                  <p className="pt-3 border-t border-[var(--border-subtle)] text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
                    {card.anatomy.caseGovernanceNote}
                  </p>
                </div>
              )}

              {activePrimaryTab === 'familie' && (
                <AnatomyFamilyAndTipSection
                  card={card}
                  onPlayAudio={onPlayAudio}
                />
              )}
            </>
          )}

          {/* ==================== 2. VERB ANATOMY ==================== */}
          {card.category === 'verb' && (
            <>
              {activePrimaryTab === 'konjugation' && (
                <div className="space-y-5">
                  {/* Single Nested Sliding Pill for Tenses */}
                  {nestedTabs && (
                    <div
                      data-no-tab-swipe="true"
                      className="flex items-center justify-between gap-2 flex-wrap"
                    >
                      <SlidingPillSwitcher
                        options={nestedTabs}
                        value={activeNestedTab}
                        onChange={handleSelectNestedTab}
                        ariaLabel="Verb tense switcher"
                        size="sm"
                      />
                    </div>
                  )}

                  {/* Clean Hairline Conjugation Rows (No 6 blocky boxes!) */}
                  {card.anatomy.conjugationTable && (
                    <div
                      key={activeNestedTab}
                      className={`space-y-5 ${
                        nestedTabDir === 'prev'
                          ? 'anatomy-tab-content-enter-prev'
                          : 'anatomy-tab-content-enter'
                      }`}
                    >
                      {activeNestedTab === 'imperativ' ? (
                        <div className="divide-y divide-[var(--border-subtle)] text-sm">
                          <div className="py-3 flex items-baseline justify-between gap-4">
                            <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                              du (informell)
                            </span>
                            <span className="font-semibold text-[var(--fg-primary)]">
                              {card.anatomy.conjugationTable.imperativForms?.du ||
                                card.anatomy.conjugationTable.imperativ ||
                                '—'}
                            </span>
                          </div>
                          <div className="py-3 flex items-baseline justify-between gap-4">
                            <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                              ihr (Plural)
                            </span>
                            <span className="font-semibold text-[var(--fg-primary)]">
                              {card.anatomy.conjugationTable.imperativForms?.ihr || '—'}
                            </span>
                          </div>
                          <div className="py-3 flex items-baseline justify-between gap-4">
                            <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                              Sie (formell)
                            </span>
                            <span className="font-semibold text-[var(--fg-primary)]">
                              {card.anatomy.conjugationTable.imperativForms?.Sie ||
                                card.anatomy.conjugationTable.imperativ ||
                                '—'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const tbl = card.anatomy.conjugationTable;
                          const activeGrid =
                            activeNestedTab === 'praeteritum' && tbl.praeteritumGrid
                              ? tbl.praeteritumGrid
                              : activeNestedTab === 'perfekt' && tbl.perfektGrid
                              ? tbl.perfektGrid
                              : activeNestedTab === 'konj2' && tbl.konjunktiv2Grid
                              ? tbl.konjunktiv2Grid
                              : {
                                  ich: tbl.ich,
                                  du: tbl.du,
                                  erSieEs: tbl.erSieEs,
                                  wir: tbl.wir,
                                  ihr: tbl.ihr,
                                  sieSie: tbl.sieSie,
                                };

                          const stripPronoun = (val: string, p: string) =>
                            val.replace(new RegExp(`^${p}\\s+`, 'i'), '');

                          const rows = [
                            { pronoun: 'ich', form: stripPronoun(activeGrid.ich, 'ich') },
                            { pronoun: 'du', form: stripPronoun(activeGrid.du, 'du') },
                            {
                              pronoun: 'er/sie/es',
                              form: stripPronoun(activeGrid.erSieEs, 'er/sie/es'),
                              highlight: true,
                            },
                            { pronoun: 'wir', form: stripPronoun(activeGrid.wir, 'wir') },
                            { pronoun: 'ihr', form: stripPronoun(activeGrid.ihr, 'ihr') },
                            {
                              pronoun: 'sie/Sie',
                              form: stripPronoun(activeGrid.sieSie, 'sie/Sie'),
                            },
                          ];

                          return (
                            <div className="divide-y divide-[var(--border-subtle)] text-sm">
                              {rows.map((r) => (
                                <div
                                  key={r.pronoun}
                                  className="py-2.5 flex items-baseline justify-between gap-4"
                                >
                                  <span className="font-sans text-xs font-medium text-[var(--fg-muted)] w-24 shrink-0">
                                    {r.pronoun}
                                  </span>
                                  <span
                                    className={`text-right break-words ${
                                      r.highlight
                                        ? 'font-bold text-[var(--accent-secondary)]'
                                        : 'font-medium text-[var(--fg-primary)]'
                                    }`}
                                  >
                                    {r.form}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        })()
                      )}

                      {/* Quiet 1-line Futur Note */}
                      <div className="pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--fg-muted)]">
                        {card.anatomy.conjugationTable.futurNote ||
                          `Futur I: wird ${card.lemma} (werden + Infinitiv)`}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activePrimaryTab === 'valenz' && (
                <div className="space-y-5">
                  {card.verbDetails?.rektion && (
                    <div className="pb-4 border-b border-[var(--border-subtle)] space-y-1">
                      <span className="text-xs text-[var(--fg-muted)] block">
                        Rektion &amp; Kasus
                      </span>
                      <div className="font-display text-base font-bold text-[var(--accent-secondary)]">
                        {card.verbDetails.rektion}
                      </div>
                    </div>
                  )}

                  <p className="text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
                    {card.anatomy.caseGovernanceNote}
                  </p>

                  <div className="divide-y divide-[var(--border-subtle)] pt-2">
                    {card.anatomy.collocations.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) =>
                          onPlayAudio(
                            col.replace(/\s*\(.*?\)/g, ''),
                            `verb-col-${idx}`,
                            e
                          )
                        }
                        className="w-full py-3 flex items-center justify-between gap-3 text-left text-sm text-[var(--fg-primary)] hover:text-[var(--accent-secondary)] transition-colors cursor-pointer"
                      >
                        <span className="font-medium leading-snug">{col}</span>
                        <Volume2 className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePrimaryTab === 'familie' && (
                <AnatomyFamilyAndTipSection
                  card={card}
                  onPlayAudio={onPlayAudio}
                />
              )}
            </>
          )}

          {/* ==================== 3. ADJEKTIV ANATOMY ==================== */}
          {card.category === 'adj' && (
            <>
              {activePrimaryTab === 'endungen' && card.adjDetails && (
                <div className="space-y-6">
                  {/* Clean Editorial Steigerung Rows */}
                  <div className="divide-y divide-[var(--border-subtle)] text-sm">
                    <div className="py-2.5 flex items-baseline justify-between gap-4">
                      <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                        Positiv
                      </span>
                      <span className="font-medium text-[var(--fg-primary)]">
                        {card.adjDetails.positiv}
                      </span>
                    </div>
                    <div className="py-2.5 flex items-baseline justify-between gap-4">
                      <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                        Komparativ
                      </span>
                      <span className="font-semibold text-[var(--accent-secondary)]">
                        {card.adjDetails.komparativ}
                      </span>
                    </div>
                    <div className="py-2.5 flex items-baseline justify-between gap-4">
                      <span className="font-sans text-xs font-medium text-[var(--fg-muted)]">
                        Superlativ
                      </span>
                      <span className="font-bold text-[var(--fg-primary)]">
                        {card.adjDetails.superlativ}
                      </span>
                    </div>
                  </div>

                  {/* Single Nested Pill for Adjective Declension Endings */}
                  {nestedTabs && card.adjDetails.declensionExamples && (
                    <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
                      <SlidingPillSwitcher
                        options={nestedTabs}
                        value={activeNestedTab}
                        onChange={handleSelectNestedTab}
                        ariaLabel="Adjective declension type"
                        size="sm"
                      />

                      {(() => {
                        const dec =
                          activeNestedTab === 'mixed'
                            ? card.adjDetails.declensionExamples.mixed
                            : activeNestedTab === 'strong'
                            ? card.adjDetails.declensionExamples.strong
                            : card.adjDetails.declensionExamples.weak;

                        return (
                          <div
                            key={activeNestedTab}
                            className={`divide-y divide-[var(--border-subtle)] text-sm ${
                              nestedTabDir === 'prev'
                                ? 'anatomy-tab-content-enter-prev'
                                : 'anatomy-tab-content-enter'
                            }`}
                          >
                            {(
                              [
                                { k: 'Nom.', v: dec.nom },
                                { k: 'Akk.', v: dec.akk },
                                { k: 'Dat.', v: dec.dat },
                                { k: 'Gen.', v: dec.gen },
                              ] as const
                            ).map((item) => (
                              <div
                                key={item.k}
                                className="py-2.5 flex items-baseline justify-between gap-4"
                              >
                                <span className="font-sans text-xs font-medium text-[var(--fg-muted)] w-16 shrink-0">
                                  {item.k}
                                </span>
                                <span className="font-medium text-[var(--fg-primary)] text-right">
                                  {item.v}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {activePrimaryTab === 'synonyme' && (
                <div className="space-y-6">
                  <SynonymAntonymList card={card} onPlayAudio={onPlayAudio} />
                  <div className="divide-y divide-[var(--border-subtle)] pt-2 border-t border-[var(--border-subtle)]">
                    {card.anatomy.collocations.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) =>
                          onPlayAudio(
                            col.replace(/\s*\(.*?\)/g, ''),
                            `adj-col-${idx}`,
                            e
                          )
                        }
                        className="w-full py-3 flex items-center justify-between gap-3 text-left text-sm text-[var(--fg-primary)] cursor-pointer"
                      >
                        <span className="font-medium">{col}</span>
                        <Volume2 className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePrimaryTab === 'tipp' && (
                <AnatomyFamilyAndTipSection
                  card={card}
                  onPlayAudio={onPlayAudio}
                />
              )}
            </>
          )}

          {/* ==================== 4. PRÄPOSITION ANATOMY ==================== */}
          {card.category === 'preposition' && (
            <>
              {activePrimaryTab === 'vergleich' && card.prepDetails && (
                <div className="space-y-5">
                  {card.prepDetails.isWechsel &&
                  card.prepDetails.wechselDetails &&
                  nestedTabs ? (
                    <div className="space-y-5">
                      <SlidingPillSwitcher
                        options={nestedTabs}
                        value={activeNestedTab}
                        onChange={handleSelectNestedTab}
                        ariaLabel="Wechselpräposition Wo vs Wohin"
                        size="sm"
                      />

                      {activeNestedTab === 'wohin' ? (
                        <div
                          key="wohin"
                          className={`space-y-4 ${
                            nestedTabDir === 'prev'
                              ? 'anatomy-tab-content-enter-prev'
                              : 'anatomy-tab-content-enter'
                          }`}
                        >
                          <div className="pb-3 border-b border-[var(--border-subtle)] space-y-1">
                            <span className="text-xs font-semibold text-[var(--accent-secondary)] block">
                              {card.prepDetails.wechselDetails.wohinQuestion} · + Akkusativ
                            </span>
                            <div className="text-sm sm:text-base font-bold text-[var(--fg-primary)]">
                              {card.prepDetails.wechselDetails.wohinRule}
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm sm:text-base font-medium text-[var(--fg-primary)] leading-relaxed">
                                „{card.prepDetails.wechselDetails.wohinExampleDe}“
                              </p>
                              <p className="text-xs sm:text-sm text-[var(--fg-secondary)]">
                                {card.prepDetails.wechselDetails.wohinExampleEn}
                              </p>
                            </div>
                            <Button
                              intent="tertiary"
                              size="icon"
                              onClick={(e) =>
                                onPlayAudio(
                                  card.prepDetails?.wechselDetails?.wohinExampleDe,
                                  'prep-wohin',
                                  e
                                )
                              }
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key="wo"
                          className={`space-y-4 ${
                            nestedTabDir === 'prev'
                              ? 'anatomy-tab-content-enter-prev'
                              : 'anatomy-tab-content-enter'
                          }`}
                        >
                          <div className="pb-3 border-b border-[var(--border-subtle)] space-y-1">
                            <span className="text-xs font-semibold text-[var(--intent-success)] block">
                              {card.prepDetails.wechselDetails.woQuestion} · + Dativ
                            </span>
                            <div className="text-sm sm:text-base font-bold text-[var(--fg-primary)]">
                              {card.prepDetails.wechselDetails.woRule}
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm sm:text-base font-medium text-[var(--fg-primary)] leading-relaxed">
                                „{card.prepDetails.wechselDetails.woExampleDe}“
                              </p>
                              <p className="text-xs sm:text-sm text-[var(--fg-secondary)]">
                                {card.prepDetails.wechselDetails.woExampleEn}
                              </p>
                            </div>
                            <Button
                              intent="tertiary"
                              size="icon"
                              onClick={(e) =>
                                onPlayAudio(
                                  card.prepDetails?.wechselDetails?.woExampleDe,
                                  'prep-wo',
                                  e
                                )
                              }
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="pb-3 border-b border-[var(--border-subtle)] space-y-1">
                        <span className="text-xs text-[var(--fg-muted)] block">
                          Kasus-Regel
                        </span>
                        <div className="font-display text-base font-bold text-[var(--intent-success)]">
                          {card.prepDetails.governedCase}
                        </div>
                      </div>
                      <p className="text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
                        {card.anatomy.caseGovernanceNote}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activePrimaryTab === 'verbindungen' && (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {card.anatomy.collocations.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) =>
                        onPlayAudio(
                          col.replace(/\s*\(.*?\)/g, ''),
                          `prep-col-${idx}`,
                          e
                        )
                      }
                      className="w-full py-3 flex items-center justify-between gap-3 text-left text-sm text-[var(--fg-primary)] cursor-pointer"
                    >
                      <span className="font-medium leading-snug">{col}</span>
                      <Volume2 className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {activePrimaryTab === 'tipp' && (
                <AnatomyFamilyAndTipSection
                  card={card}
                  onPlayAudio={onPlayAudio}
                />
              )}
            </>
          )}

          {/* ==================== 5. KONNEKTOR ANATOMY ==================== */}
          {card.category === 'conn' && (
            <>
              {activePrimaryTab === 'satzbau' && card.connDetails && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-[var(--border-subtle)] space-y-1">
                    <span className="text-xs font-semibold text-terracotta block">
                      {card.connDetails.connectorClass}
                    </span>
                    <div className="text-sm font-semibold text-[var(--fg-primary)]">
                      {card.connDetails.verbPositionRule}
                    </div>
                  </div>

                  {nestedTabs && (
                    <SlidingPillSwitcher
                      options={nestedTabs}
                      value={activeNestedTab}
                      onChange={handleSelectNestedTab}
                      ariaLabel="Clause order switcher"
                      size="sm"
                    />
                  )}

                  <div
                    key={activeNestedTab}
                    className={`flex items-start justify-between gap-3 py-2 ${
                      nestedTabDir === 'prev'
                        ? 'anatomy-tab-content-enter-prev'
                        : 'anatomy-tab-content-enter'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <p className="text-sm sm:text-base font-medium text-[var(--fg-primary)] leading-relaxed">
                        „
                        {activeNestedTab === 'nebensatz'
                          ? card.connDetails.nebensatzFirstDe
                          : card.connDetails.hauptsatzFirstDe}
                        “
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--fg-secondary)]">
                        {activeNestedTab === 'nebensatz'
                          ? card.connDetails.nebensatzFirstEn
                          : card.connDetails.hauptsatzFirstEn}
                      </p>
                    </div>
                    <Button
                      intent="tertiary"
                      size="icon"
                      onClick={(e) =>
                        onPlayAudio(
                          activeNestedTab === 'nebensatz'
                            ? card.connDetails?.nebensatzFirstDe
                            : card.connDetails?.hauptsatzFirstDe,
                          'conn-order',
                          e
                        )
                      }
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="pt-3 border-t border-[var(--border-subtle)] text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
                    {card.anatomy.caseGovernanceNote}
                  </p>
                </div>
              )}

              {activePrimaryTab === 'vergleich' && card.connDetails && (
                <div className="space-y-5">
                  <div className="pb-4 border-b border-[var(--border-subtle)] space-y-1.5">
                    <div className="text-xs font-bold text-terracotta">
                      {card.lemma} ↔ {card.connDetails.contrastPair.partnerWord}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[var(--fg-primary)] leading-relaxed">
                      {card.connDetails.contrastPair.partnerRule}
                    </p>
                    <p className="text-xs text-[var(--fg-secondary)] italic">
                      „{card.connDetails.contrastPair.partnerExample}“
                    </p>
                  </div>
                  <SynonymAntonymList card={card} onPlayAudio={onPlayAudio} />
                </div>
              )}

              {activePrimaryTab === 'tipp' && (
                <AnatomyFamilyAndTipSection
                  card={card}
                  onPlayAudio={onPlayAudio}
                />
              )}
            </>
          )}

          {/* ==================== 6. WENDUNG / PHRASE ANATOMY ==================== */}
          {card.category === 'phrase' && (
            <>
              {activePrimaryTab === 'dialog' && card.phraseDetails && (
                <div className="space-y-5">
                  <div className="divide-y divide-[var(--border-subtle)]">
                    {/* Speaker A */}
                    <div className="pb-4 space-y-1">
                      <div className="text-[11px] font-semibold text-[var(--fg-muted)]">
                        {card.phraseDetails.miniDialog.speakerA}
                      </div>
                      <p className="text-sm sm:text-base font-medium text-[var(--fg-primary)] leading-relaxed">
                        „{card.phraseDetails.miniDialog.promptDe}“
                      </p>
                      <p className="text-xs text-[var(--fg-secondary)]">
                        {card.phraseDetails.miniDialog.promptEn}
                      </p>
                    </div>

                    {/* Speaker B */}
                    <div className="pt-4 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-[var(--accent-secondary)]">
                          {card.phraseDetails.miniDialog.speakerB} · Antwort
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-[var(--fg-primary)] leading-relaxed">
                          „{card.phraseDetails.miniDialog.replyDe}“
                        </p>
                        <p className="text-xs text-[var(--fg-secondary)]">
                          {card.phraseDetails.miniDialog.replyEn}
                        </p>
                      </div>
                      <Button
                        intent="tertiary"
                        size="icon"
                        onClick={(e) =>
                          onPlayAudio(
                            card.phraseDetails?.miniDialog.replyDe,
                            'dialog-reply',
                            e
                          )
                        }
                      >
                        <Volume2 className="w-4 h-4 text-[var(--accent-secondary)]" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activePrimaryTab === 'beispiele' && card.phraseDetails && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-[var(--border-subtle)] space-y-1">
                    <span className="text-xs text-[var(--fg-muted)] block">
                      Satzrahmen
                    </span>
                    <div className="font-display text-sm sm:text-base font-semibold text-[var(--fg-primary)] break-words">
                      {card.phraseDetails.framePattern}
                    </div>
                  </div>

                  {nestedTabs && (
                    <SlidingPillSwitcher
                      options={nestedTabs}
                      value={activeNestedTab}
                      onChange={handleSelectNestedTab}
                      ariaLabel="Register switcher"
                      size="sm"
                    />
                  )}

                  {(() => {
                    const variant =
                      activeNestedTab === 'informell'
                        ? card.phraseDetails.informalVariant
                        : card.phraseDetails.formalVariant;
                    return (
                      <div
                        key={activeNestedTab}
                        className={`flex items-start justify-between gap-3 pt-1 ${
                          nestedTabDir === 'prev'
                            ? 'anatomy-tab-content-enter-prev'
                            : 'anatomy-tab-content-enter'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-[var(--accent-secondary)] block">
                            {variant.contextNote}
                          </span>
                          <p className="text-sm sm:text-base font-medium text-[var(--fg-primary)] leading-relaxed">
                            „{variant.textDe}“
                          </p>
                          <p className="text-xs sm:text-sm text-[var(--fg-secondary)]">
                            {variant.textEn}
                          </p>
                        </div>
                        <Button
                          intent="tertiary"
                          size="icon"
                          onClick={(e) =>
                            onPlayAudio(variant.textDe, 'phrase-var', e)
                          }
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activePrimaryTab === 'tipp' && (
                <AnatomyFamilyAndTipSection
                  card={card}
                  onPlayAudio={onPlayAudio}
                />
              )}
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};

/* ==================== CLEAN EDITORIAL SUB-SECTIONS (ZERO BOX-IN-BOX) ==================== */

const SynonymAntonymList: React.FC<{
  card: VocabCard;
  onPlayAudio: (text?: string, idTag?: string, e?: React.MouseEvent) => void;
}> = ({ card, onPlayAudio }) => {
  if (
    card.anatomy.synonyms.length === 0 &&
    card.anatomy.antonyms.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-4">
      {card.anatomy.synonyms.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[var(--intent-success)]">
            Synonyme
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {card.anatomy.synonyms.map((syn, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) =>
                  onPlayAudio(syn.replace(/\s*\(.*?\)/g, ''), `syn-${i}`, e)
                }
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg-primary)] hover:text-[var(--intent-success)] transition-colors cursor-pointer"
              >
                <span>{syn}</span>
                <Volume2 className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {card.anatomy.antonyms.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-[var(--border-subtle)]">
          <div className="text-xs font-semibold text-[var(--intent-danger)]">
            Gegenteile
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {card.anatomy.antonyms.map((ant, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) =>
                  onPlayAudio(ant.replace(/\s*\(.*?\)/g, ''), `ant-${i}`, e)
                }
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg-primary)] hover:text-[var(--intent-danger)] transition-colors cursor-pointer"
              >
                <span>↔ {ant}</span>
                <Volume2 className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AnatomyFamilyAndTipSection: React.FC<{
  card: VocabCard;
  onPlayAudio: (text?: string, idTag?: string, e?: React.MouseEvent) => void;
}> = ({ card, onPlayAudio }) => {
  return (
    <div className="space-y-6">
      <SynonymAntonymList card={card} onPlayAudio={onPlayAudio} />

      {card.anatomy.wordFamily.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
          <div className="text-xs font-semibold text-[var(--fg-muted)]">
            Wortfamilie
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {card.anatomy.wordFamily.map((wf, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) =>
                  onPlayAudio(wf.replace(/\s*\(.*?\)/g, ''), `wf-${idx}`, e)
                }
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left text-sm text-[var(--fg-primary)] hover:text-[var(--accent-secondary)] cursor-pointer"
              >
                <span>{wf}</span>
                <Volume2 className="w-3.5 h-3.5 text-[var(--fg-muted)] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {card.anatomy.b1ExamTip && (
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-start gap-3">
          <FoxMascot
            pose="studio"
            size="sm"
            interactive
            speechPlacement="top"
            className="mt-0.5"
          />
          <div className="space-y-1 min-w-0">
            <div className="text-xs font-bold text-[var(--intent-warning)]">
              Studio-Fuchs · B1 Prüfungs- &amp; Praxis-Tipp
            </div>
            <p className="text-xs sm:text-[13px] text-[var(--fg-secondary)] leading-relaxed">
              {card.anatomy.b1ExamTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
