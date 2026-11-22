/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Eye,
  Flame,
  GitBranch,
  GraduationCap,
  Info,
  Layers,
  LayoutDashboard,
  Link2,
  Lock,
  Maximize2,
  MessageSquare,
  Minimize2,
  Palette,
  Play,
  RotateCcw,
  RotateCw,
  Search,
  Shapes,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import {
  DeckSubScreen,
  DecksPageView,
  EnrichedUnifiedDeck,
} from './components/DecksPageView';
import {
  Button,
  Card,
  ProgressBar,
  SemanticIntent,
} from './components/HeroPrimitives';
import {
  FOX_POSE_CATALOG,
  FoxMascot,
} from './components/FoxMascot';
import { SlidingPillSwitcher } from './components/SlidingPillSwitcher';
import { PWAInstallButton } from './components/PWAInstallButton';
import { MascotMomentVisual } from './components/MascotMomentVisual';
import { MilestoneInterludeCard } from './components/MilestoneInterludeCard';
import {
  MASCOT_MOMENT_CATALOG,
  MascotMomentCard,
  MascotMomentPoseId,
  MilestoneThreshold,
  MILESTONE_THRESHOLDS,
  evaluateMilestoneTrigger,
  getDailyTimeOfDayMomentPose,
  getUpcomingMomentSrcToPrefetch,
  loadMilestoneInterludesEnabled,
  prefetchMascotMoment,
  saveMilestoneInterludesEnabled,
  selectCheckpointMoment,
  selectDeckCompletionMoment,
  selectEmptyQueueMoment,
} from './utils/mascotMoments';
import {
  APP_ICON_CHAPTERS,
  APP_ICON_CHANGE_EVENT,
  AppIconChapter,
  AppIconChapterId,
  applyTimeOfDayAppIcons,
  getTimeOfDayIconSlot,
} from './utils/appIconScheduler';
import {
  type ReminderPreferences,
  isNativeAndroidApp,
  loadDynamicIconAutoPreference,
  loadLastStudyTimestamp,
  loadReminderPreferences,
  recordLastStudyTimestamp,
  registerAndroidBackButton,
  saveDynamicIconAutoPreference,
  saveReminderPreferences,
  syncNativeDynamicIcon,
  syncNativeStudyReminders,
} from './utils/nativeAndroid';
import { AndroidExperienceCard } from './components/AndroidExperienceCard';
import { AppUpdateCard } from './components/AppUpdateCard';

const AnatomyDrawer = React.lazy(() =>
  import('./components/AnatomyDrawer').then((m) => ({
    default: m.AnatomyDrawer,
  }))
);
const RecallEaseHeatmap = React.lazy(() =>
  import('./components/RecallEaseHeatmap').then((m) => ({
    default: m.RecallEaseHeatmap,
  }))
);
const LearningVelocityChart = React.lazy(() =>
  import('./components/LearningVelocityChart').then((m) => ({
    default: m.LearningVelocityChart,
  }))
);
import { useSheetSwipeDismiss } from './hooks/useMobileGestures';
import {
  CustomDeckRecord,
  DeckFolder,
  DeckMetaOverride,
  DeckStudyDirection,
  DeckTintId,
  LastStudySessionState,
  StudyDeckTrail,
  archiveDummyDecksInWorkspace,
  canStepTrailPrev,
  clearStudyDeckTrail,
  clearTrailRatingForUndo,
  ensureBuiltInA2Workspace,
  ensureInitialTestFolderSeed,
  hasMissingBuiltInA2Workspace,
  loadLastStudySession,
  loadStudyDeckPositions,
  loadStudyDeckTrails,
  needsRemoteArchiveDummyMigration,
  normalizeStudyDirection,
  recordTrailRating,
  resolveSavedDeckIndex,
  saveCustomDecks,
  saveDeckOverrides,
  saveFolders,
  saveLastStudySession,
  saveStudyDeckPosition,
  saveStudyDeckTrail,
  stepTrailNext,
  stepTrailPrev,
  syncTrailWithDeck,
} from './utils/decksManager';
import { syncWorkspaceToSupabase } from './utils/supabaseSync';
import {
  CardCategory,
  CardSrsState,
  CefrLevel,
  NounGender,
  RatingKey,
  StudyStats,
  VocabCard,
  formatNounLemma,
  stripLeadingGermanArticles,
} from './data/vocabData';
import {
  ColorMode,
  ThemeId,
  ThemePreferences,
  appendRatingEvent,
  applyThemePreferencesToDom,
  createDefaultSrsState,
  formatConfidenceBadge,
  getCardSrsForDirection,
  getDeckSessionKey,
  getLast7DaysVelocityData,
  hydrateEngineFromIndexedDB,
  isCardLowConfidence,
  loadAllCards,
  loadSrsMap,
  loadStudyStats,
  loadThemePreferences,
  parseSrsStateKey,
  resetCardsSrsProgress,
  saveCustomCard,
  saveSrsMap,
  speakGermanText,
  triggerHapticFeedback,
  undoLastReview,
} from './utils/srsEngine';
import {
  CONFIDENCE_LOOP_CONFIG,
  DeckLoopState,
  applyLoopRating,
  computeConfidenceMasteryPct,
  computeDeckLoopProgressPct,
  createInitialDeckLoopState,
  getCurrentLoopCardId,
} from './utils/confidenceLoopEngine';

type ActiveView = 'study' | 'decks' | 'dashboard' | 'archive';

const VIEW_ORDER: Record<ActiveView, number> = {
  study: 0,
  decks: 1,
  dashboard: 2,
  archive: 3,
};
type DeckId =
  | 'all'
  | 'low-confidence'
  | 'verb'
  | 'noun'
  | 'adj'
  | 'preposition'
  | 'conn'
  | 'phrase'
  | 'cefr-a1'
  | 'cefr-a2'
  | 'cefr-b1';

const BUILT_IN_DECK_IDS: ReadonlySet<string> = new Set<string>([
  'all',
  'low-confidence',
  'verb',
  'noun',
  'adj',
  'preposition',
  'conn',
  'phrase',
  'cefr-a1',
  'cefr-a2',
  'cefr-b1',
]);

interface DeckDefinition {
  id: DeckId;
  title: string;
  shortTitle: string;
  subtitle: string;
  categoryGroup: 'smart' | 'grammar' | 'level';
  levelTag: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  intent: SemanticIntent;
  predicate: (card: VocabCard, srs: CardSrsState, now: Date) => boolean;
}

interface AchievementMilestone {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  target: number;
  unit: string;
  unlocked: boolean;
  progressPct: number;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  intent: SemanticIntent;
}

interface ThemeEntityOption {
  id: ThemeId;
  name: string;
  shortName: string;
  tagline: string;
  radiusLabel: string;
  previewRadius: string;
  lightPreview: {
    canvas: string;
    card: string;
    border: string;
    shadow: string;
    primary: string;
    secondary: string;
    tertiary: string;
    ink: string;
  };
  darkPreview: {
    canvas: string;
    card: string;
    border: string;
    shadow: string;
    primary: string;
    secondary: string;
    tertiary: string;
    ink: string;
  };
}

const THEME_ENTITIES: ThemeEntityOption[] = [
  {
    id: 'nordic',
    name: 'Linen Nordic',
    shortName: 'Nordic',
    tagline: 'Warm Linen · Sage, Coral & Fjord Blue',
    radiusLabel: '24px · Fraunces',
    previewRadius: '10px',
    lightPreview: {
      canvas: '#FAF8F5',
      card: '#FFFEFC',
      border: '#E6E0D6',
      shadow: '0 2px 6px rgb(60 40 20 / 0.14)',
      primary: '#2E6650',
      secondary: '#147188',
      tertiary: '#C24E32',
      ink: '#1C1917',
    },
    darkPreview: {
      canvas: '#171412',
      card: '#211D1A',
      border: 'rgb(245 239 230 / 0.16)',
      shadow: '0 2px 6px rgb(0 0 0 / 0.55)',
      primary: '#74B094',
      secondary: '#4EB8CE',
      tertiary: '#E88267',
      ink: '#F5EFE6',
    },
  },
  {
    id: 'hero',
    name: 'Hero UI',
    shortName: 'Hero UI',
    tagline: 'Hero-Inspired Surface & Electric Cobalt',
    radiusLabel: '16px · Inter',
    previewRadius: '7px',
    lightPreview: {
      canvas: '#F8FAFC',
      card: '#FFFFFF',
      border: 'rgb(15 23 42 / 0.12)',
      shadow: '0 2px 6px rgb(15 23 42 / 0.14)',
      primary: '#2563eb',
      secondary: '#0284c7',
      tertiary: '#EA580C',
      ink: '#0F172A',
    },
    darkPreview: {
      canvas: '#09090B',
      card: '#141418',
      border: 'rgb(255 255 255 / 0.14)',
      shadow: '0 2px 6px rgb(0 0 0 / 0.6)',
      primary: '#3b82f6',
      secondary: '#38bdf8',
      tertiary: '#FB923C',
      ink: '#FAFAFA',
    },
  },
  {
    id: 'coss',
    name: 'Coss UI',
    shortName: 'Coss UI',
    tagline: 'coss.com/ui Monochrome Zinc & Precision Depth',
    radiusLabel: '10px · Geist',
    previewRadius: '4px',
    lightPreview: {
      canvas: '#FAFAFA',
      card: '#FFFFFF',
      border: 'rgb(24 24 27 / 0.15)',
      shadow: '0 1px 3px rgb(0 0 0 / 0.12)',
      primary: '#18181B',
      secondary: '#0F766E',
      tertiary: '#D97706',
      ink: '#18181B',
    },
    darkPreview: {
      canvas: '#09090B',
      card: '#111113',
      border: 'rgb(255 255 255 / 0.16)',
      shadow: '0 1px 4px rgb(0 0 0 / 0.65)',
      primary: '#FAFAFA',
      secondary: '#2DD4BF',
      tertiary: '#FBBF24',
      ink: '#FAFAFA',
    },
  },
];

const RATING_META: Record<
  RatingKey,
  {
    label: string;
    shortLabel: string;
    shortcutKey: '1' | '2' | '3' | '4' | '5';
    colorVar: string;
    softVar: string;
    borderVar: string;
    solidBgVar: string;
    solidFgVar: string;
    textClass: string;
  }
> = {
  '1': {
    label: '1 · Gar nicht',
    shortLabel: 'Gar nicht',
    shortcutKey: '1',
    colorVar: 'var(--conf-1)',
    softVar: 'var(--conf-1-soft)',
    borderVar: 'var(--conf-1-border)',
    solidBgVar: 'var(--conf-1-solid-bg)',
    solidFgVar: 'var(--conf-1-solid-fg)',
    textClass: 'text-[var(--conf-1)]',
  },
  '2': {
    label: '2 · Kaum',
    shortLabel: 'Kaum',
    shortcutKey: '2',
    colorVar: 'var(--conf-2)',
    softVar: 'var(--conf-2-soft)',
    borderVar: 'var(--conf-2-border)',
    solidBgVar: 'var(--conf-2-solid-bg)',
    solidFgVar: 'var(--conf-2-solid-fg)',
    textClass: 'text-[var(--conf-2)]',
  },
  '3': {
    label: '3 · Mühsam',
    shortLabel: 'Mühsam',
    shortcutKey: '3',
    colorVar: 'var(--conf-3)',
    softVar: 'var(--conf-3-soft)',
    borderVar: 'var(--conf-3-border)',
    solidBgVar: 'var(--conf-3-solid-bg)',
    solidFgVar: 'var(--conf-3-solid-fg)',
    textClass: 'text-[var(--conf-3)]',
  },
  '4': {
    label: '4 · Gut',
    shortLabel: 'Gut',
    shortcutKey: '4',
    colorVar: 'var(--conf-4)',
    softVar: 'var(--conf-4-soft)',
    borderVar: 'var(--conf-4-border)',
    solidBgVar: 'var(--conf-4-solid-bg)',
    solidFgVar: 'var(--conf-4-solid-fg)',
    textClass: 'text-[var(--conf-4)]',
  },
  '5': {
    label: '5 · Sicher',
    shortLabel: 'Sicher',
    shortcutKey: '5',
    colorVar: 'var(--conf-5)',
    softVar: 'var(--conf-5-soft)',
    borderVar: 'var(--conf-5-border)',
    solidBgVar: 'var(--conf-5-solid-bg)',
    solidFgVar: 'var(--conf-5-solid-fg)',
    textClass: 'text-[var(--conf-5)]',
  },
};

function shuffleCardIds(
  cardIds: string[],
  avoidFirstId?: string
): string[] {
  const copy = [...cardIds];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (copy.length > 1 && avoidFirstId && copy[0] === avoidFirstId) {
    const swapIdx = 1 + Math.floor(Math.random() * (copy.length - 1));
    [copy[0], copy[swapIdx]] = [copy[swapIdx], copy[0]];
  }
  return copy;
}

export default function App() {
  // Two-Dimensional Theme Engine: themeId ('nordic' | 'hero' | 'coss') × colorMode ('light' | 'dark')
  const [themePrefs, setThemePrefs] = useState<ThemePreferences>(() =>
    loadThemePreferences()
  );
  const [isThemePopoverOpen, setIsThemePopoverOpen] = useState<boolean>(false);
  const [isThemePopoverMounted, setIsThemePopoverMounted] =
    useState<boolean>(false);
  const [themePopoverState, setThemePopoverState] = useState<'open' | 'closed'>(
    'closed'
  );
  const themePopoverRef = useRef<HTMLDivElement | null>(null);
  const themeTriggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const themePopoverPanelRef = useRef<HTMLDivElement | null>(null);
  const themeCloseTimerRef = useRef<number | null>(null);
  const themeOptionBtnRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );
  const [themePopoverPos, setThemePopoverPos] = useState<{
    top: number;
    right: number;
    maxHeight: number;
    isMobile: boolean;
  } | null>(null);
  const [themeOptionIndicator, setThemeOptionIndicator] = useState<{
    top: number;
    height: number;
  }>({ top: 0, height: 0 });
  const [themeOptionCanAnimate, setThemeOptionCanAnimate] =
    useState<boolean>(false);

  const updateThemePopoverPosition = useCallback(() => {
    const trigger = themeTriggerBtnRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const isMobile = viewportW < 640;
    const top = Math.max(12, Math.round(rect.bottom + 10));
    const right = Math.max(12, Math.round(viewportW - rect.right));
    const maxHeight = Math.max(220, Math.round(viewportH - top - 16));
    setThemePopoverPos((prev) =>
      prev &&
      prev.top === top &&
      prev.right === right &&
      prev.maxHeight === maxHeight &&
      prev.isMobile === isMobile
        ? prev
        : { top, right, maxHeight, isMobile }
    );
  }, []);

  useEffect(() => {
    applyThemePreferencesToDom(themePrefs, false);
  }, [themePrefs]);

  // Smooth bidirectional mount/unmount for Theme Selector popover
  useEffect(() => {
    if (isThemePopoverOpen) {
      setIsThemePopoverMounted(true);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setThemePopoverState('open');
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }

    setThemePopoverState('closed');
    if (!isThemePopoverMounted) return;
    const timer = window.setTimeout(() => {
      setIsThemePopoverMounted(false);
      setThemeOptionCanAnimate(false);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [isThemePopoverOpen, isThemePopoverMounted]);

  useEffect(() => {
    return () => {
      if (themeCloseTimerRef.current !== null) {
        window.clearTimeout(themeCloseTimerRef.current);
      }
    };
  }, []);

  // Measure vertical highlight pill inside Theme Selector popover
  useLayoutEffect(() => {
    if (!isThemePopoverMounted) return;
    const btn = themeOptionBtnRefs.current[themePrefs.themeId];
    if (!btn || btn.offsetHeight <= 0) return;
    const nextTop = btn.offsetTop;
    const nextHeight = btn.offsetHeight;
    setThemeOptionIndicator((prev) =>
      prev.top === nextTop && prev.height === nextHeight
        ? prev
        : { top: nextTop, height: nextHeight }
    );
  }, [isThemePopoverMounted, themePrefs.themeId]);

  useEffect(() => {
    if (
      isThemePopoverMounted &&
      themeOptionIndicator.height > 0 &&
      !themeOptionCanAnimate
    ) {
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setThemeOptionCanAnimate(true);
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }
  }, [isThemePopoverMounted, themeOptionIndicator.height, themeOptionCanAnimate]);

  // Keep theme popover anchored below the live palette button rect across safe-area insets
  useLayoutEffect(() => {
    if (!isThemePopoverMounted) return;
    updateThemePopoverPosition();
    window.addEventListener('resize', updateThemePopoverPosition);
    window.addEventListener('orientationchange', updateThemePopoverPosition);
    window.addEventListener('scroll', updateThemePopoverPosition, true);
    return () => {
      window.removeEventListener('resize', updateThemePopoverPosition);
      window.removeEventListener('orientationchange', updateThemePopoverPosition);
      window.removeEventListener('scroll', updateThemePopoverPosition, true);
    };
  }, [isThemePopoverMounted, updateThemePopoverPosition]);

  // Close anchored theme popover when clicking outside or pressing Escape
  useEffect(() => {
    if (!isThemePopoverOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const insideTrigger =
        themePopoverRef.current && themePopoverRef.current.contains(target);
      const insidePanel =
        themePopoverPanelRef.current &&
        themePopoverPanelRef.current.contains(target);
      if (!insideTrigger && !insidePanel) {
        setIsThemePopoverOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsThemePopoverOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemePopoverOpen]);

  const selectThemeEntity = useCallback((nextThemeId: ThemeId) => {
    setThemePrefs((prev) => {
      const next: ThemePreferences = { ...prev, themeId: nextThemeId };
      applyThemePreferencesToDom(next, true);
      return next;
    });
    if (themeCloseTimerRef.current !== null) {
      window.clearTimeout(themeCloseTimerRef.current);
    }
    themeCloseTimerRef.current = window.setTimeout(() => {
      setIsThemePopoverOpen(false);
      themeCloseTimerRef.current = null;
    }, 160);
  }, []);

  const setColorMode = useCallback((nextMode: ColorMode) => {
    setThemePrefs((prev) => {
      if (prev.colorMode === nextMode) return prev;
      const next: ThemePreferences = { ...prev, colorMode: nextMode };
      applyThemePreferencesToDom(next, true);
      return next;
    });
  }, []);

  const activeThemeMeta = useMemo(
    () =>
      THEME_ENTITIES.find((t) => t.id === themePrefs.themeId) ||
      THEME_ENTITIES[0],
    [themePrefs.themeId]
  );

  // Single-pass startup snapshot for cards & workspace seed (eliminates redundant mount reads)
  const [initialBoot] = useState(() => ({
    cards: loadAllCards(),
    seed: ensureInitialTestFolderSeed(),
  }));

  // Persistent cards, SRS state, and study streak
  const [cards, setCards] = useState<VocabCard[]>(initialBoot.cards);
  const latestCardsRef = useRef<VocabCard[]>(cards);
  latestCardsRef.current = cards;
  const [srsMap, setSrsMap] = useState<Record<string, CardSrsState>>(() =>
    loadSrsMap(initialBoot.cards)
  );
  const [stats, setStats] = useState<StudyStats>(() => loadStudyStats());

  useEffect(() => {
    let active = true;
    let hasCompletedFirstSync = false;

    const runSync = () => {
      const seed = hasCompletedFirstSync
        ? ensureInitialTestFolderSeed()
        : initialBoot.seed;
      const currentCardsSnapshot = hasCompletedFirstSync
        ? latestCardsRef.current
        : initialBoot.cards;
      hasCompletedFirstSync = true;

      hydrateEngineFromIndexedDB(currentCardsSnapshot, {
        folders: seed.folders,
        customDecks: seed.customDecks,
        deckOverrides: seed.deckOverrides,
        themePrefs: loadThemePreferences(),
      })
        .then((hydrated) => {
          if (!active) return;
          setCards(hydrated.cards);
          setSrsMap(hydrated.srsMap);
          setStats(hydrated.stats);
          if (hydrated.remoteWorkspace) {
            const rw = hydrated.remoteWorkspace;
            const shouldMigrateRemote = needsRemoteArchiveDummyMigration({
              folders: rw.folders,
              deckOverrides: rw.deckOverrides,
            });

            let nextFolders: DeckFolder[];
            let nextCustomDecks: CustomDeckRecord[];
            let nextOverrides: Record<string, DeckMetaOverride>;

            if (shouldMigrateRemote) {
              const migrated = archiveDummyDecksInWorkspace({
                folders:
                  Array.isArray(rw.folders) && rw.folders.length > 0
                    ? rw.folders
                    : seed.folders,
                customDecks:
                  Array.isArray(rw.customDecks) && rw.customDecks.length > 0
                    ? rw.customDecks
                    : seed.customDecks,
                deckOverrides:
                  rw.deckOverrides && Object.keys(rw.deckOverrides).length > 0
                    ? rw.deckOverrides
                    : seed.deckOverrides,
              });
              nextFolders = migrated.folders;
              nextCustomDecks = migrated.customDecks;
              nextOverrides = migrated.deckOverrides;
            } else {
              const baseFolders =
                Array.isArray(rw.folders) && rw.folders.length > 0
                  ? rw.folders
                  : seed.folders;
              const baseCustomDecks =
                Array.isArray(rw.customDecks) && rw.customDecks.length > 0
                  ? rw.customDecks
                  : seed.customDecks;
              nextOverrides =
                rw.deckOverrides && Object.keys(rw.deckOverrides).length > 0
                  ? rw.deckOverrides
                  : seed.deckOverrides;

              const ensured = ensureBuiltInA2Workspace({
                folders: baseFolders,
                customDecks: baseCustomDecks,
              });
              nextFolders = ensured.folders;
              nextCustomDecks = ensured.customDecks;
            }

            setFolders(nextFolders);
            saveFolders(nextFolders, true);
            setCustomDecks(nextCustomDecks);
            saveCustomDecks(nextCustomDecks, true);
            if (Object.keys(nextOverrides).length > 0) {
              setDeckOverrides(nextOverrides);
              saveDeckOverrides(nextOverrides, true);
            }

            const remoteNeedsHeal =
              shouldMigrateRemote ||
              !Array.isArray(rw.folders) ||
              rw.folders.length === 0 ||
              !Array.isArray(rw.customDecks) ||
              rw.customDecks.length === 0 ||
              hasMissingBuiltInA2Workspace({
                folders: rw.folders,
                customDecks: rw.customDecks,
              });

            if (remoteNeedsHeal) {
              void syncWorkspaceToSupabase({
                folders: nextFolders,
                customDecks: nextCustomDecks,
                deckOverrides: nextOverrides,
              });
            }

            if (
              rw.themePrefs &&
              rw.themePrefs.themeId &&
              rw.themePrefs.colorMode
            ) {
              setThemePrefs(rw.themePrefs);
              applyThemePreferencesToDom(rw.themePrefs, false);
            }
          }
        })
        .catch(() => {});
    };

    runSync();

    const handleOnline = () => runSync();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        runSync();
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      active = false;
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Navigation, Directional Page Transitions, Filtering & Distraction-Free Zen Session Mode
  const [activeView, setActiveView] = useState<ActiveView>('decks');
  const [decksSubScreen, setDecksSubScreen] = useState<DeckSubScreen>({
    type: 'root',
  });
  const [isDecksOverlayOpen, setIsDecksOverlayOpen] = useState<boolean>(false);
  const closeDecksTopSheetRef = useRef<(() => boolean) | null>(null);
  const [exitingView, setExitingView] = useState<ActiveView | null>(null);
  const [pageDirection, setPageDirection] = useState<'forward' | 'backward'>(
    'forward'
  );
  const [viewTransitionKey, setViewTransitionKey] = useState<number>(0);
  const viewExitTimeoutRef = useRef<number | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const desktopNavBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const latestActiveViewRef = useRef<ActiveView>(activeView);
  latestActiveViewRef.current = activeView;
  const [desktopNavIndicator, setDesktopNavIndicator] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const [desktopNavCanAnimate, setDesktopNavCanAnimate] =
    useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (viewExitTimeoutRef.current !== null) {
        window.clearTimeout(viewExitTimeoutRef.current);
      }
    };
  }, []);

  const navigateToView = useCallback(
    (nextView: ActiveView, directionOverride?: 'forward' | 'backward') => {
      if (nextView === activeView) return;
      const dir =
        directionOverride ??
        (VIEW_ORDER[nextView] >= VIEW_ORDER[activeView]
          ? 'forward'
          : 'backward');
      if (viewExitTimeoutRef.current !== null) {
        window.clearTimeout(viewExitTimeoutRef.current);
      }
      setExitingView(activeView);
      setPageDirection(dir);
      setActiveView(nextView);
      setViewTransitionKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: 'auto' });
      viewExitTimeoutRef.current = window.setTimeout(() => {
        setExitingView(null);
        viewExitTimeoutRef.current = null;
      }, 240);
    },
    [activeView]
  );

  // Interactive Top-Left Brand Lockup (Nordic Linen Triad: Sage, Coral, Fjord Blue)
  const [brandClickSeq, setBrandClickSeq] = useState<number>(0);
  const [isBrandClicking, setIsBrandClicking] = useState<boolean>(false);
  const [showBrandAhaBadge, setShowBrandAhaBadge] = useState<boolean>(false);
  const brandClickTimerRef = useRef<number | null>(null);
  const brandBadgeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (brandClickTimerRef.current !== null) {
        window.clearTimeout(brandClickTimerRef.current);
      }
      if (brandBadgeTimerRef.current !== null) {
        window.clearTimeout(brandBadgeTimerRef.current);
      }
    };
  }, []);

  const handleBrandClick = useCallback(() => {
    setBrandClickSeq((prev) => prev + 1);
    setIsBrandClicking(false);
    window.requestAnimationFrame(() => {
      setIsBrandClicking(true);
    });
    setShowBrandAhaBadge(true);

    if (brandClickTimerRef.current !== null) {
      window.clearTimeout(brandClickTimerRef.current);
    }
    brandClickTimerRef.current = window.setTimeout(() => {
      setIsBrandClicking(false);
      brandClickTimerRef.current = null;
    }, 540);

    if (brandBadgeTimerRef.current !== null) {
      window.clearTimeout(brandBadgeTimerRef.current);
    }
    brandBadgeTimerRef.current = window.setTimeout(() => {
      setShowBrandAhaBadge(false);
      brandBadgeTimerRef.current = null;
    }, 2100);

    navigateToView('decks');
    setDecksSubScreen({ type: 'root' });
  }, [navigateToView]);

  const brandTriadPose = brandClickSeq % 3;
  const brandFoxSlides: ReadonlyArray<{
    src: string;
    de: string;
    en: string;
  }> = [
    { src: FOX_POSE_CATALOG.aha.src, de: 'Ach so!', en: 'Aha!' },
    {
      src: MASCOT_MOMENT_CATALOG['coffee-cards'].src,
      de: 'Kaffee & Karten!',
      en: 'Coffee & cards',
    },
    { src: FOX_POSE_CATALOG.welcome.src, de: 'Los geht’s!', en: 'Let’s dive in' },
    {
      src: MASCOT_MOMENT_CATALOG['study-peak'].src,
      de: 'Hi! Bereit für Deutsch?',
      en: 'Ready for German',
    },
    { src: FOX_POSE_CATALOG.juggler.src, de: 'Im Fokus-Loop!', en: 'In the groove' },
    {
      src: MASCOT_MOMENT_CATALOG['haus-card'].src,
      de: 'Das Haus sitzt!',
      en: 'Articles locked in',
    },
    {
      src: MASCOT_MOMENT_CATALOG['eureka-flag'].src,
      de: 'Ah-ha! Ja!',
      en: 'Breakthrough',
    },
    { src: FOX_POSE_CATALOG.champion.src, de: 'Meisterhaft!', en: 'Champion mode' },
    {
      src: MASCOT_MOMENT_CATALOG['cozy-student'].src,
      de: 'Voll im Flow!',
      en: 'In the flow',
    },
    { src: FOX_POSE_CATALOG.studio.src, de: 'Schlau wie ein Fuchs!', en: 'Clever as a fox' },
    {
      src: MASCOT_MOMENT_CATALOG['triumph-ecstatic'].src,
      de: 'Geschafft!!',
      en: 'Nailed it',
    },
    { src: FOX_POSE_CATALOG.runner.src, de: 'Starkes Tempo!', en: 'Unstoppable streak' },
  ];
  const activeBrandSlide =
    brandFoxSlides[brandClickSeq % brandFoxSlides.length];
  const activeBrandExpression = activeBrandSlide;

  // Overview Gallery visual category (3 curated moods, no "Alle" dump) & live 6-slot App Icon tracker
  const [mascotGalleryCategory, setMascotGalleryCategory] = useState<
    'focus' | 'celebrate' | 'cozy'
  >('focus');
  const [activeAppIconSlot, setActiveAppIconSlot] = useState<AppIconChapterId>(
    () => getTimeOfDayIconSlot()
  );
  const [isAppIconManualPreview, setIsAppIconManualPreview] = useState<boolean>(
    () => !loadDynamicIconAutoPreference()
  );
  const [reminderPrefs, setReminderPrefs] = useState<ReminderPreferences>(() =>
    loadReminderPreferences()
  );
  const [lastStudyMs, setLastStudyMs] = useState<number>(() =>
    loadLastStudyTimestamp()
  );

  useEffect(() => {
    const handleIconChange = (event: Event) => {
      const detail = (event as CustomEvent<AppIconChapter>).detail;
      if (detail?.slot) {
        setActiveAppIconSlot(detail.slot);
      }
    };
    window.addEventListener(APP_ICON_CHANGE_EVENT, handleIconChange);
    return () => {
      window.removeEventListener(APP_ICON_CHANGE_EVENT, handleIconChange);
    };
  }, []);

  // Arm native Android 6-slot dynamic icon schedule on startup
  useEffect(() => {
    if (!isNativeAndroidApp()) return;
    const autoEnabled = loadDynamicIconAutoPreference();
    void syncNativeDynamicIcon({
      autoEnabled,
      manualSlot: activeAppIconSlot,
      applyNow: false,
    });
  }, []);

  const handleUpdateReminderPrefs = useCallback((next: ReminderPreferences) => {
    setReminderPrefs(next);
    saveReminderPreferences(next);
  }, []);

  const handleSelectAppIconPreview = useCallback((slot: AppIconChapterId) => {
    applyTimeOfDayAppIcons(slot);
    setActiveAppIconSlot(slot);
    const isManual = slot !== getTimeOfDayIconSlot();
    setIsAppIconManualPreview(isManual);
    saveDynamicIconAutoPreference(!isManual);
    void syncNativeDynamicIcon({
      autoEnabled: !isManual,
      manualSlot: slot,
      applyNow: false,
    });
  }, []);

  const handleResetAppIconAuto = useCallback(() => {
    const liveSlot = getTimeOfDayIconSlot();
    applyTimeOfDayAppIcons(liveSlot);
    setActiveAppIconSlot(liveSlot);
    setIsAppIconManualPreview(false);
    saveDynamicIconAutoPreference(true);
    void syncNativeDynamicIcon({
      autoEnabled: true,
      manualSlot: liveSlot,
      applyNow: false,
    });
  }, []);

  // Persistent Folders (1-level), Custom Decks & Deck Overrides for "All Decks" page
  const [folders, setFolders] = useState<DeckFolder[]>(
    initialBoot.seed.folders
  );
  const [customDecks, setCustomDecks] = useState<CustomDeckRecord[]>(
    initialBoot.seed.customDecks
  );
  const [deckOverrides, setDeckOverrides] = useState<
    Record<string, DeckMetaOverride>
  >(initialBoot.seed.deckOverrides);

  const [initialStudySession] = useState<LastStudySessionState | null>(() =>
    loadLastStudySession()
  );
  const userChangedDeckRef = useRef<boolean>(false);
  const hasRestoredStudyIndexRef = useRef<boolean>(false);

  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [selectedDeckId, setSelectedDeckId] = useState<DeckId>(() => {
    if (
      initialStudySession &&
      !initialStudySession.isCustomQueue &&
      BUILT_IN_DECK_IDS.has(initialStudySession.deckId)
    ) {
      return initialStudySession.deckId as DeckId;
    }
    return 'all';
  });
  const [allCardsOrder, setAllCardsOrder] = useState<string[]>(() =>
    shuffleCardIds(cards.map((c) => c.id))
  );
  const [customStudyQueue, setCustomStudyQueue] = useState<{
    id: string;
    shortTitle: string;
    cards: VocabCard[];
    studyDirection?: DeckStudyDirection;
  } | null>(() => {
    if (!initialStudySession || !initialStudySession.isCustomQueue) return null;
    const cardById = new Map(cards.map((c) => [c.id, c]));
    const matchedCustom = customDecks.find(
      (d) => d.id === initialStudySession.deckId
    );
    if (matchedCustom) {
      const matchedCards = matchedCustom.cardIds
        .map((id) => cardById.get(id))
        .filter((c): c is VocabCard => Boolean(c));
      if (matchedCards.length > 0) {
        const ov = deckOverrides[matchedCustom.id];
        return {
          id: matchedCustom.id,
          shortTitle: ov?.title || matchedCustom.title,
          cards: matchedCards,
          studyDirection: normalizeStudyDirection(
            matchedCustom.studyDirection ?? initialStudySession.studyDirection
          ),
        };
      }
    }
    if (initialStudySession.cardIds && initialStudySession.cardIds.length > 0) {
      const restoredCards = initialStudySession.cardIds
        .map((id) => cardById.get(id))
        .filter((c): c is VocabCard => Boolean(c));
      if (restoredCards.length > 0) {
        return {
          id: initialStudySession.deckId,
          shortTitle: initialStudySession.shortTitle || 'Study Session',
          cards: restoredCards,
          studyDirection: normalizeStudyDirection(
            initialStudySession.studyDirection
          ),
        };
      }
    }
    return null;
  });

  const handleUpdateFolders = useCallback((next: DeckFolder[]) => {
    setFolders(next);
    saveFolders(next);
  }, []);

  const handleUpdateCustomDecks = useCallback((next: CustomDeckRecord[]) => {
    setCustomDecks(next);
    saveCustomDecks(next);
  }, []);

  const handleUpdateDeckOverrides = useCallback(
    (next: Record<string, DeckMetaOverride>) => {
      setDeckOverrides(next);
      saveDeckOverrides(next);
    },
    []
  );

  // Vocabulary Explorer filters
  const [archiveCategoryFilter, setArchiveCategoryFilter] = useState<
    'all' | CardCategory
  >('all');
  const [archiveCefrFilter, setArchiveCefrFilter] = useState<CefrLevel | 'ALL'>(
    'ALL'
  );
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');

  // Flashcard Study Runner state (Layer 0 -> Layer 1 Meaning -> Scroll-Up 3 Forms & Sentence -> Layer 2 Anatomie)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loopStatesByDeck, setLoopStatesByDeck] = useState<
    Record<string, DeckLoopState>
  >({});
  const loopUndoStackRef = useRef<Record<string, DeckLoopState[]>>({});
  const [studyTrailsByDeck, setStudyTrailsByDeck] = useState<
    Record<string, StudyDeckTrail>
  >(() => {
    const loaded = loadStudyDeckTrails();
    if (
      !initialStudySession ||
      (!initialStudySession.isCustomQueue &&
        initialStudySession.deckId === 'all')
    ) {
      delete loaded['all'];
    }
    return loaded;
  });
  const reshuffleAllCards = useCallback(
    (sourceCards: VocabCard[] = cards) => {
      const nextOrder = shuffleCardIds(
        sourceCards.map((c) => c.id),
        allCardsOrder[0]
      );
      setAllCardsOrder(nextOrder);
      clearStudyDeckTrail('all');
      setStudyTrailsByDeck((prev) => {
        if (!('all' in prev)) return prev;
        const next = { ...prev };
        delete next['all'];
        return next;
      });
      saveStudyDeckPosition('all', 0, nextOrder[0]);
      return nextOrder;
    },
    [cards, allCardsOrder]
  );
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isBackExpanded, setIsBackExpanded] = useState<boolean>(false);
  const [cardMotion, setCardMotion] = useState<
    | 'idle'
    | 'is-exiting-next'
    | 'is-entering-next'
    | 'is-exiting-prev'
    | 'is-entering-prev'
    | 'is-blocked-next'
  >('idle');
  const [rateFirstHint, setRateFirstHint] = useState<boolean>(false);
  const rateFirstTimerRef = useRef<number | null>(null);
  const [exitingRating, setExitingRating] = useState<RatingKey | null>(null);
  const [flashingRating, setFlashingRating] = useState<RatingKey | null>(null);
  const flashingRatingTimerRef = useRef<number | null>(null);
  const [recentRatingEcho, setRecentRatingEcho] = useState<RatingKey | null>(null);
  const recentRatingEchoTimerRef = useRef<number | null>(null);
  const [suppressFlipTransition, setSuppressFlipTransition] =
    useState<boolean>(false);
  const cardMotionTimersRef = useRef<{
    exitTimer: number | null;
    idleTimer: number | null;
    raf1: number | null;
    raf2: number | null;
  }>({ exitTimer: null, idleTimer: null, raf1: null, raf2: null });
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);

  // Mascot Milestone Checkpoints (25% / 50% / 75%) & Session Rating Summary
  const [milestoneInterludesEnabled, setMilestoneInterludesEnabled] =
    useState<boolean>(() => loadMilestoneInterludesEnabled());
  const [activeMilestone, setActiveMilestone] =
    useState<MascotMomentCard | null>(null);
  const shownMilestonesByDeckRef = useRef<
    Record<string, Set<MilestoneThreshold>>
  >({});
  const ratingsSinceMilestoneByDeckRef = useRef<Record<string, number>>({});
  const deckSessionRatingsRef = useRef<
    Record<string, { count: number; sum: number; lowCount: number }>
  >({});

  const handleDismissMilestone = useCallback(() => {
    setActiveMilestone(null);
    cardShownAtRef.current = performance.now();
  }, []);

  const handleToggleMilestoneInterludes = useCallback(() => {
    setMilestoneInterludesEnabled((prev) => {
      const next = !prev;
      saveMilestoneInterludesEnabled(next);
      if (!next) {
        setActiveMilestone(null);
      }
      return next;
    });
  }, []);

  // Mobile & Tablet Flashcard Gesture Physics (4-way swipe + long-press audio + ref-driven 60/120fps drag tracking)
  const flipCardInnerDomRef = useRef<HTMLDivElement | null>(null);
  const edgeStampDomRef = useRef<HTMLDivElement | null>(null);
  const edgeStampTextDomRef = useRef<HTMLSpanElement | null>(null);
  const edgeStampDotDomRef = useRef<HTMLSpanElement | null>(null);
  const dragReleaseTimerRef = useRef<number | null>(null);
  const cardTouchRef = useRef<{
    x: number;
    y: number;
    time: number;
    axis: 'none' | 'horizontal' | 'vertical';
    suppressClick: boolean;
  } | null>(null);
  const backWheelCooldownRef = useRef<number>(0);
  const longPressAudioTimerRef = useRef<number | null>(null);
  const pageSwipeRef = useRef<{
    x: number;
    y: number;
    eligible: boolean;
  } | null>(null);
  const [isDecksSubScreenOpen, setIsDecksSubScreenOpen] = useState(false);

  // Layer 2: Expandable "Anatomie [D]" Drawer state
  const [detailCard, setDetailCard] = useState<VocabCard | null>(null);

  // Add Custom Card Modal state (Supports all 6 archetypes)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const addModalScrollRef = useRef<HTMLDivElement | null>(null);
  const [newLemma, setNewLemma] = useState<string>('');
  const [newTranslation, setNewTranslation] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CardCategory>('noun');
  const [newCefr, setNewCefr] = useState<CefrLevel>('A1');
  const [newGender, setNewGender] = useState<NounGender>('der');
  const [newPlural, setNewPlural] = useState<string>('');
  const [newPraesens, setNewPraesens] = useState<string>('');
  const [newPraeteritum, setNewPraeteritum] = useState<string>('');
  const [newPerfekt, setNewPerfekt] = useState<string>('');
  const [newAux, setNewAux] = useState<'haben' | 'sein'>('haben');
  const [newPrepCase, setNewPrepCase] = useState<string>('Dativ');
  const [newAdjKomp, setNewAdjKomp] = useState<string>('');
  const [newAdjSup, setNewAdjSup] = useState<string>('');
  const [newConnRule, setNewConnRule] = useState<string>(
    'Nebensatz · Verb am Ende'
  );
  const [newPhraseFrame, setNewPhraseFrame] = useState<string>('');
  const [newExampleDe, setNewExampleDe] = useState<string>('');
  const [newExampleEn, setNewExampleEn] = useState<string>('');

  // All 11 Curated Decks (2 Smart + 6 Grammar Archetypes + 3 CEFR Levels)
  const deckDefinitions: DeckDefinition[] = useMemo(
    () => [
      {
        id: 'all',
        title: 'Complete Core Wortschatz',
        shortTitle: 'All Cards',
        subtitle: 'All 6 German grammar archetypes (A1–B1)',
        categoryGroup: 'smart',
        levelTag: 'A1–B1',
        icon: Layers,
        iconBg: 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]',
        intent: 'primary',
        predicate: () => true,
      },
      {
        id: 'low-confidence',
        title: 'Fokus-Loop',
        shortTitle: 'Fokus',
        subtitle: 'Unsichere Karten zum gezielten Wiederholen',
        categoryGroup: 'smart',
        levelTag: 'Fokus',
        icon: Clock,
        iconBg: 'bg-[var(--intent-warning-soft)] text-[var(--intent-warning)]',
        intent: 'warning',
        predicate: (_c, srs) => isCardLowConfidence(srs),
      },
      {
        id: 'verb',
        title: 'Verben & Stammformen',
        shortTitle: 'Verbs',
        subtitle: 'Präsens, Präteritum, Perfekt & Valenz',
        categoryGroup: 'grammar',
        levelTag: 'Verben',
        icon: GitBranch,
        iconBg: 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]',
        intent: 'primary',
        predicate: (c) => c.category === 'verb',
      },
      {
        id: 'noun',
        title: 'Nomen & Genus-System',
        shortTitle: 'Nouns',
        subtitle: 'Color-coded der / die / das & 4-Kasus',
        categoryGroup: 'grammar',
        levelTag: 'Nomen',
        icon: Shapes,
        iconBg: 'bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)]',
        intent: 'primary',
        predicate: (c) => c.category === 'noun',
      },
      {
        id: 'adj',
        title: 'Adjektive & Steigerung',
        shortTitle: 'Adjectives',
        subtitle: 'Komparation, Gegenteile & Endungen',
        categoryGroup: 'grammar',
        levelTag: 'Adjektive',
        icon: SlidersHorizontal,
        iconBg: 'bg-[var(--intent-success-soft)] text-[var(--intent-success)]',
        intent: 'success',
        predicate: (c) => c.category === 'adj',
      },
      {
        id: 'preposition',
        title: 'Präpositionen & Kasus',
        shortTitle: 'Prepositions',
        subtitle: 'Wechselpräpositionen, Dativ & Genitiv',
        categoryGroup: 'grammar',
        levelTag: 'Präpositionen',
        icon: Compass,
        iconBg: 'bg-[var(--intent-success-soft)] text-[var(--intent-success)]',
        intent: 'success',
        predicate: (c) => c.category === 'preposition',
      },
      {
        id: 'conn',
        title: 'Konnektoren & Satzbau',
        shortTitle: 'Connectors',
        subtitle: 'Nebensatz, Inversion & Position 0 (ADUSO)',
        categoryGroup: 'grammar',
        levelTag: 'Konnektoren',
        icon: Link2,
        iconBg: 'bg-[var(--intent-warning-soft)] text-[var(--intent-warning)]',
        intent: 'warning',
        predicate: (c) => c.category === 'conn',
      },
      {
        id: 'phrase',
        title: 'Wendungen & Redemittel',
        shortTitle: 'Phrases',
        subtitle: 'B1 Diskussion, Satzrahmen & Mini-Dialoge',
        categoryGroup: 'grammar',
        levelTag: 'Wendungen',
        icon: MessageSquare,
        iconBg: 'bg-[var(--intent-danger-soft)] text-[var(--intent-danger)]',
        intent: 'danger',
        predicate: (c) => c.category === 'phrase',
      },
      {
        id: 'cefr-a1',
        title: 'CEFR A1 Foundation',
        shortTitle: 'Level A1',
        subtitle: 'Essential everyday German vocabulary',
        categoryGroup: 'level',
        levelTag: 'A1',
        icon: GraduationCap,
        iconBg: 'bg-[var(--intent-success-soft)] text-[var(--intent-success)]',
        intent: 'success',
        predicate: (c) => c.cefr === 'A1',
      },
      {
        id: 'cefr-a2',
        title: 'CEFR A2 Waystage',
        shortTitle: 'Level A2',
        subtitle: 'Separable verbs & core expressions',
        categoryGroup: 'level',
        levelTag: 'A2',
        icon: BookMarked,
        iconBg: 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]',
        intent: 'primary',
        predicate: (c) => c.cefr === 'A2',
      },
      {
        id: 'cefr-b1',
        title: 'CEFR B1 Threshold',
        shortTitle: 'Level B1',
        subtitle: 'Genitive prepositions, connectors & abstract nouns',
        categoryGroup: 'level',
        levelTag: 'B1',
        icon: Award,
        iconBg: 'bg-[var(--intent-danger-soft)] text-[var(--intent-danger)]',
        intent: 'danger',
        predicate: (c) => c.cefr === 'B1',
      },
    ],
    []
  );

  // Enrich each deck with live 1-5 confidence metrics (direction-aware for DE->EN vs EN->DE)
  const enrichedDecks = useMemo(() => {
    const now = new Date();
    return deckDefinitions.map((def) => {
      const deckDir = normalizeStudyDirection(
        deckOverrides[def.id]?.studyDirection
      );
      let matchingCards = cards.filter((c) => {
        const st = getCardSrsForDirection(srsMap, c.id, deckDir);
        return def.predicate(c, st, now);
      });

      if (def.id === 'all' && allCardsOrder.length > 0) {
        const orderMap = new Map<string, number>();
        allCardsOrder.forEach((id, idx) => orderMap.set(id, idx));
        matchingCards = [...matchingCards].sort((a, b) => {
          const ia = orderMap.get(a.id);
          const ib = orderMap.get(b.id);
          if (ia !== undefined && ib !== undefined) return ia - ib;
          if (ia !== undefined) return 1;
          if (ib !== undefined) return -1;
          return 0;
        });
      }

      let mastered = 0;
      let learning = 0;
      let lowConfidence = 0;

      for (const c of matchingCards) {
        const st = getCardSrsForDirection(srsMap, c.id, deckDir);
        if (st.mastered || st.confidence >= 4) mastered += 1;
        else if (st.reviewCount > 0) learning += 1;
        if (isCardLowConfidence(st)) lowConfidence += 1;
      }

      const total = matchingCards.length;
      const masteredPct = total > 0 ? (mastered / total) * 100 : 0;
      const learningPct = total > 0 ? (learning / total) * 100 : 0;
      const confidencePct = computeConfidenceMasteryPct(
        matchingCards.map((c) => c.id),
        srsMap,
        deckDir
      );
      const lowConfProgressPct =
        total === 0
          ? stats.totalReviewsToday > 0
            ? 100
            : 0
          : confidencePct;
      const progressPct =
        def.id === 'low-confidence' ? lowConfProgressPct : confidencePct;

      return {
        ...def,
        cards: matchingCards,
        total,
        mastered,
        learning,
        lowConfidence,
        masteredPct: def.id === 'low-confidence' ? lowConfProgressPct : masteredPct,
        learningPct: def.id === 'low-confidence' ? 0 : learningPct,
        progressPct,
      };
    });
  }, [
    deckDefinitions,
    deckOverrides,
    cards,
    srsMap,
    stats.totalReviewsToday,
    allCardsOrder,
  ]);

  // Global summary metrics
  const summaryMetrics = useMemo(() => {
    let masteredCount = 0;
    let lowConfidenceCount = 0;
    let reviewedCount = 0;
    let totalLifetimeReviews = 0;
    let totalConfidence = 0;
    let masteredVerbs = 0;
    let masteredNouns = 0;
    let masteredB1 = 0;
    let totalVerbs = 0;
    let totalNouns = 0;
    let totalB1 = 0;

    for (const card of cards) {
      const state = srsMap[card.id] || createDefaultSrsState(card.id);
      if (card.category === 'verb') totalVerbs += 1;
      if (card.category === 'noun') totalNouns += 1;
      if (card.cefr === 'B1') totalB1 += 1;

      if (state.mastered || state.confidence >= 4) {
        masteredCount += 1;
        if (card.category === 'verb') masteredVerbs += 1;
        if (card.category === 'noun') masteredNouns += 1;
        if (card.cefr === 'B1') masteredB1 += 1;
      }
      if (isCardLowConfidence(state)) lowConfidenceCount += 1;
      if (state.reviewCount > 0) {
        reviewedCount += 1;
        totalConfidence += state.confidence || 0;
      }
      totalLifetimeReviews += state.reviewCount || 0;
    }

    const masteryPct = Math.round(
      (masteredCount / Math.max(1, cards.length)) * 100
    );
    const avgConfidencePct = computeConfidenceMasteryPct(
      cards.map((c) => c.id),
      srsMap
    );
    const avgConfidenceScore =
      reviewedCount > 0 ? (totalConfidence / reviewedCount).toFixed(1) : '0.0';

    return {
      totalCards: cards.length,
      masteredCount,
      masteryPct,
      lowConfidenceCount,
      reviewedCount,
      totalLifetimeReviews,
      avgConfidencePct,
      avgConfidenceScore,
      masteredVerbs,
      totalVerbs,
      masteredNouns,
      totalNouns,
      masteredB1,
      totalB1,
    };
  }, [cards, srsMap]);

  // Personal Study Achievements & Milestones
  const achievements: AchievementMilestone[] = useMemo(() => {
    const items: Omit<AchievementMilestone, 'unlocked' | 'progressPct'>[] = [
      {
        id: 'first-step',
        title: 'First Step · Erster Schritt',
        subtitle: 'Complete your first German flashcard review session',
        current: Math.min(1, summaryMetrics.reviewedCount),
        target: 1,
        unit: 'card',
        icon: Sparkles,
        accentClass: 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]',
        intent: 'primary',
      },
      {
        id: 'streak-7',
        title: '7-Day Streak · 7-Tage-Serie',
        subtitle: 'Study consistently for 7 consecutive days',
        current: Math.min(7, stats.streakDays),
        target: 7,
        unit: 'days',
        icon: Flame,
        accentClass: 'bg-[var(--intent-warning-soft)] text-[var(--intent-warning)]',
        intent: 'warning',
      },
      {
        id: 'verb-master',
        title: 'Stammformen Master',
        subtitle: 'Master all strong & separable verb cards',
        current: summaryMetrics.masteredVerbs,
        target: Math.max(1, summaryMetrics.totalVerbs),
        unit: 'verbs',
        icon: GitBranch,
        accentClass: 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]',
        intent: 'primary',
      },
      {
        id: 'noun-gender',
        title: 'Genus Specialist · der/die/das',
        subtitle: 'Master all color-coded German nouns & plurals',
        current: summaryMetrics.masteredNouns,
        target: Math.max(1, summaryMetrics.totalNouns),
        unit: 'nouns',
        icon: Shapes,
        accentClass: 'bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)]',
        intent: 'primary',
      },
      {
        id: 'b1-pioneer',
        title: 'B1 Exam Pioneer',
        subtitle: 'Master all CEFR B1 threshold vocabulary cards',
        current: summaryMetrics.masteredB1,
        target: Math.max(1, summaryMetrics.totalB1),
        unit: 'B1 cards',
        icon: GraduationCap,
        accentClass: 'bg-[var(--intent-danger-soft)] text-[var(--intent-danger)]',
        intent: 'danger',
      },
      {
        id: 'wortschatz-scholar',
        title: 'Core Wortschatz Scholar',
        subtitle: 'Master 20 German vocabulary & grammar cards',
        current: Math.min(20, summaryMetrics.masteredCount),
        target: 20,
        unit: 'mastered',
        icon: Trophy,
        accentClass: 'bg-[var(--intent-success-soft)] text-[var(--intent-success)]',
        intent: 'success',
      },
    ];

    return items.map((item) => {
      const progressPct = Math.min(
        100,
        Math.round((item.current / Math.max(1, item.target)) * 100)
      );
      return {
        ...item,
        unlocked: item.current >= item.target,
        progressPct,
      };
    });
  }, [summaryMetrics, stats.streakDays]);

  const unlockedAchievementsCount = useMemo(
    () => achievements.filter((a) => a.unlocked).length,
    [achievements]
  );

  const velocityData = useMemo(
    () => getLast7DaysVelocityData(cards, srsMap, stats),
    [cards, srsMap, stats]
  );

  // Sync smart offline Android fox reminders whenever study stats or reminder toggles change
  useEffect(() => {
    if (!isNativeAndroidApp()) return;
    const dueCount = Math.max(0, cards.length - summaryMetrics.masteredCount);
    const timer = window.setTimeout(() => {
      void syncNativeStudyReminders(reminderPrefs, {
        streakDays: stats.streakDays,
        reviewedToday: stats.totalReviewsToday,
        dueCount,
        lastStudyMs,
        dailyGoalMet: stats.totalReviewsToday >= 10,
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    cards.length,
    lastStudyMs,
    reminderPrefs,
    stats.streakDays,
    stats.totalReviewsToday,
    summaryMetrics.masteredCount,
  ]);

  const cardsById = useMemo(
    () => new Map(cards.map((c) => [c.id, c])),
    [cards]
  );

  // Unified Enriched Decks for the mobile-first "All Decks" view (Built-in + Custom Decks + Overrides)
  const enrichedUnifiedDecks: EnrichedUnifiedDeck[] = useMemo(() => {
    const defaultConfigMap: Record<
      DeckId,
      {
        iconId: string;
        tint: DeckTintId;
        defaultTextTile?: string;
        archetypeFilter?: CardCategory;
        cefrFilter?: CefrLevel;
      }
    > = {
      all: { iconId: 'Layers', tint: 'sage' },
      'low-confidence': { iconId: 'Clock', tint: 'terracotta' },
      verb: { iconId: 'GitBranch', tint: 'sage', archetypeFilter: 'verb' },
      noun: { iconId: 'Shapes', tint: 'blue', archetypeFilter: 'noun' },
      adj: { iconId: 'SlidersHorizontal', tint: 'sage', archetypeFilter: 'adj' },
      preposition: {
        iconId: 'Compass',
        tint: 'terracotta',
        archetypeFilter: 'preposition',
      },
      conn: { iconId: 'Link2', tint: 'ochre', archetypeFilter: 'conn' },
      phrase: {
        iconId: 'MessageSquare',
        tint: 'plum',
        archetypeFilter: 'phrase',
      },
      'cefr-a1': {
        iconId: 'GraduationCap',
        tint: 'sage',
        defaultTextTile: 'A1',
        cefrFilter: 'A1',
      },
      'cefr-a2': {
        iconId: 'BookMarked',
        tint: 'blue',
        defaultTextTile: 'A2',
        cefrFilter: 'A2',
      },
      'cefr-b1': {
        iconId: 'Award',
        tint: 'terracotta',
        defaultTextTile: 'B1',
        cefrFilter: 'B1',
      },
    };

    const builtInList: EnrichedUnifiedDeck[] = enrichedDecks
      .filter((d) => !deckOverrides[d.id]?.hidden)
      .map((d, idx) => {
        const cfg = defaultConfigMap[d.id];
        const ov = deckOverrides[d.id];
        const hasTextTileDefault = Boolean(cfg.defaultTextTile);
        const useTextTile = hasTextTileDefault
          ? !ov?.icon || ov.icon === 'level-text'
          : false;

        const deckDir = normalizeStudyDirection(ov?.studyDirection);
        let lastStudiedAt = 0;
        for (const c of d.cards) {
          const reviewedAt = getCardSrsForDirection(
            srsMap,
            c.id,
            deckDir
          ).lastReviewedAt;
          if (reviewedAt) {
            const ts = Date.parse(reviewedAt);
            if (!Number.isNaN(ts) && ts > lastStudiedAt) {
              lastStudiedAt = ts;
            }
          }
        }

        return {
          id: d.id,
          isSystemSmart: d.categoryGroup === 'smart',
          isCustom: false,
          title: ov?.title || d.title,
          shortTitle: ov?.title || d.shortTitle,
          subtitle: d.subtitle,
          categoryGroup: d.categoryGroup,
          archetypeFilter: cfg.archetypeFilter,
          cefrFilter: cfg.cefrFilter,
          levelTag: d.levelTag,
          defaultTextTile: cfg.defaultTextTile,
          useTextTile,
          iconId:
            ov?.icon && ov.icon !== 'level-text' ? ov.icon : cfg.iconId,
          tint: ov?.tint || cfg.tint,
          folderId: ov?.folderId ?? null,
          studyDirection: deckDir,
          createdAt: 1700000000000 - idx * 1000,
          lastStudiedAt,
          cards: d.cards,
          total: d.total,
          mastered: d.mastered,
          learning: d.learning,
          lowConfidence: d.lowConfidence,
          masteredPct: d.masteredPct,
          learningPct: d.learningPct,
          progressPct: d.progressPct,
        };
      });

    const customList: EnrichedUnifiedDeck[] = customDecks.map((cd) => {
      const deckDir = normalizeStudyDirection(cd.studyDirection);
      const matchingCards = cd.cardIds
        .map((id) => cardsById.get(id))
        .filter((c): c is VocabCard => Boolean(c));
      let mastered = 0;
      let learning = 0;
      let lowConfidence = 0;
      let lastStudiedAt = 0;
      for (const c of matchingCards) {
        const st = getCardSrsForDirection(srsMap, c.id, deckDir);
        if (st.mastered || st.confidence >= 4) mastered += 1;
        else if (st.reviewCount > 0) learning += 1;
        if (isCardLowConfidence(st)) lowConfidence += 1;
        if (st.lastReviewedAt) {
          const ts = Date.parse(st.lastReviewedAt);
          if (!Number.isNaN(ts) && ts > lastStudiedAt) {
            lastStudiedAt = ts;
          }
        }
      }
      const total = matchingCards.length;
      const masteredPct = total > 0 ? (mastered / total) * 100 : 0;
      const learningPct = total > 0 ? (learning / total) * 100 : 0;
      const progressPct = computeConfidenceMasteryPct(
        matchingCards.map((c) => c.id),
        srsMap,
        deckDir
      );

      return {
        id: cd.id,
        isSystemSmart: false,
        isCustom: true,
        title: cd.title,
        shortTitle: cd.title,
        subtitle: cd.subtitle,
        categoryGroup: 'custom',
        levelTag: cd.levelTag || 'Custom',
        useTextTile: false,
        iconId: cd.icon || 'BookOpen',
        tint: cd.tint || 'sage',
        folderId: cd.folderId ?? null,
        studyDirection: deckDir,
        createdAt: cd.createdAt,
        lastStudiedAt,
        cards: matchingCards,
        total,
        mastered,
        learning,
        lowConfidence,
        masteredPct,
        learningPct,
        progressPct,
      };
    });

    return [...builtInList, ...customList];
  }, [enrichedDecks, deckOverrides, customDecks, cardsById, srsMap]);

  const activeDeckObj = useMemo(() => {
    if (customStudyQueue) {
      return {
        id: customStudyQueue.id,
        shortTitle: customStudyQueue.shortTitle,
        cards: customStudyQueue.cards,
      };
    }
    return (
      enrichedDecks.find((d) => d.id === selectedDeckId) || enrichedDecks[0]
    );
  }, [customStudyQueue, enrichedDecks, selectedDeckId]);

  const activeStudyDirection: DeckStudyDirection = useMemo(() => {
    const liveDeck = enrichedUnifiedDecks.find((d) => d.id === activeDeckObj.id);
    if (liveDeck) return liveDeck.studyDirection;
    return normalizeStudyDirection(customStudyQueue?.studyDirection);
  }, [enrichedUnifiedDecks, activeDeckObj.id, customStudyQueue?.studyDirection]);

  const isEnToDe = activeStudyDirection === 'en-de';
  const activeSessionKey = getDeckSessionKey(
    activeDeckObj.id,
    activeStudyDirection
  );

  const getCardEnglishPrompt = useCallback((card: VocabCard) => {
    const trimmed = card.translation?.trim();
    if (trimmed) return trimmed;
    const fallbackEn = card.exampleEn?.trim();
    return fallbackEn || '(No English meaning)';
  }, []);

  const studyDeck = activeDeckObj.cards;

  const activeLoopState: DeckLoopState = useMemo(() => {
    const existing = loopStatesByDeck[activeSessionKey];
    if (existing && existing.direction === activeStudyDirection) {
      return existing;
    }
    return createInitialDeckLoopState(
      activeDeckObj.id,
      studyDeck.map((c) => c.id),
      srsMap,
      CONFIDENCE_LOOP_CONFIG,
      activeStudyDirection
    );
  }, [
    loopStatesByDeck,
    activeSessionKey,
    activeDeckObj.id,
    activeStudyDirection,
    studyDeck,
    srsMap,
  ]);

  const isActiveDeckDone =
    studyDeck.length > 0 && activeLoopState.phase === 'done';

  const activeDeckMasteryProgressPct = useMemo(
    () => computeDeckLoopProgressPct(activeLoopState),
    [activeLoopState]
  );

  // Immediately refresh active study card, loop, and flip state whenever
  // the user toggles a deck's studyDirection (DE->EN <-> EN->DE)
  const prevDirectionSessionRef = useRef<string>(activeSessionKey);
  useEffect(() => {
    if (prevDirectionSessionRef.current === activeSessionKey) return;
    const prevKey = prevDirectionSessionRef.current;
    prevDirectionSessionRef.current = activeSessionKey;

    // Only auto-refresh when direction toggled on the SAME active deck
    const prevBaseDeck = prevKey.endsWith('::en-de')
      ? prevKey.slice(0, -7)
      : prevKey;
    if (prevBaseDeck !== activeDeckObj.id) return;

    const existingForDir = loopStatesByDeck[activeSessionKey];
    const refreshedLoop =
      existingForDir &&
      existingForDir.direction === activeStudyDirection &&
      existingForDir.phase !== 'done'
        ? existingForDir
        : createInitialDeckLoopState(
            activeDeckObj.id,
            studyDeck.map((c) => c.id),
            srsMap,
            CONFIDENCE_LOOP_CONFIG,
            activeStudyDirection
          );

    setLoopStatesByDeck((prev) => ({
      ...prev,
      [activeSessionKey]: refreshedLoop,
    }));

    const nextCardId = getCurrentLoopCardId(refreshedLoop);
    if (nextCardId) {
      const idx = studyDeck.findIndex((c) => c.id === nextCardId);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      setCurrentIndex(0);
    }
    setActiveMilestone(null);
    setIsFlipped(false);
    setIsBackExpanded(false);
    setDetailCard(null);
  }, [
    activeSessionKey,
    activeDeckObj.id,
    activeStudyDirection,
    loopStatesByDeck,
    studyDeck,
    srsMap,
  ]);

  // Predictive JIT idle prefetch for the single upcoming milestone or completion cutout
  useEffect(() => {
    if (activeView !== 'study' || studyDeck.length === 0) return;
    const deckId = activeDeckObj.id;
    const sessionSummary = deckSessionRatingsRef.current[activeSessionKey] || {
      count: 0,
      sum: 0,
      lowCount: 0,
    };
    const recentAvgRating =
      sessionSummary.count > 0 ? sessionSummary.sum / sessionSummary.count : 4;
    const shownSet =
      shownMilestonesByDeckRef.current[activeSessionKey] ||
      new Set<MilestoneThreshold>();

    const nextSrc = getUpcomingMomentSrcToPrefetch({
      progressPct: activeDeckMasteryProgressPct,
      phase: activeLoopState.phase,
      deckSize: studyDeck.length,
      localHour: new Date().getHours(),
      recentAvgRating,
      hasRetries: sessionSummary.lowCount > 0,
      deckId,
      deckTitle: activeDeckObj.shortTitle,
      shownThresholds: shownSet,
      interludesEnabled: milestoneInterludesEnabled,
    });
    if (nextSrc) {
      prefetchMascotMoment(nextSrc);
    }
  }, [
    activeView,
    activeDeckObj.id,
    activeSessionKey,
    activeDeckObj.shortTitle,
    activeDeckMasteryProgressPct,
    activeLoopState.phase,
    studyDeck.length,
    milestoneInterludesEnabled,
  ]);

  // Rehydrate custom/A2 study queue after async DB/Supabase sync if needed
  useEffect(() => {
    if (
      userChangedDeckRef.current ||
      !initialStudySession?.isCustomQueue ||
      customStudyQueue
    ) {
      return;
    }
    const matchedUnified = enrichedUnifiedDecks.find(
      (d) => d.id === initialStudySession.deckId
    );
    if (matchedUnified && matchedUnified.cards.length > 0) {
      const positions = loadStudyDeckPositions();
      const restoredIdx = resolveSavedDeckIndex(
        matchedUnified.cards,
        positions[matchedUnified.id]
      );
      setCustomStudyQueue({
        id: matchedUnified.id,
        shortTitle: matchedUnified.shortTitle,
        cards: matchedUnified.cards,
        studyDirection: matchedUnified.studyDirection,
      });
      setCurrentIndex(restoredIdx);
      hasRestoredStudyIndexRef.current = true;
    }
  }, [initialStudySession, customStudyQueue, enrichedUnifiedDecks]);

  // Restore exact starting loop card for the resumed deck on initial load before first paint
  useLayoutEffect(() => {
    if (hasRestoredStudyIndexRef.current) return;
    if (studyDeck.length === 0) {
      hasRestoredStudyIndexRef.current = true;
      return;
    }
    if (activeDeckObj.id === 'all') {
      clearStudyDeckTrail('all');
    }
    const loopCardId = getCurrentLoopCardId(activeLoopState);
    if (loopCardId) {
      const loopIdx = studyDeck.findIndex((c) => c.id === loopCardId);
      hasRestoredStudyIndexRef.current = true;
      if (loopIdx >= 0 && loopIdx !== currentIndex) {
        setCurrentIndex(loopIdx);
      }
      return;
    }
    const positions = loadStudyDeckPositions();
    const saved = positions[activeSessionKey];
    const restoredIdx = resolveSavedDeckIndex(studyDeck, saved);
    hasRestoredStudyIndexRef.current = true;
    if (restoredIdx !== currentIndex) {
      setCurrentIndex(restoredIdx);
    }
  }, [activeDeckObj.id, activeSessionKey, studyDeck, currentIndex, activeLoopState]);

  useEffect(() => {
    if (currentIndex >= studyDeck.length && studyDeck.length > 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsBackExpanded(false);
      setDetailCard(null);
    }
  }, [studyDeck.length, currentIndex]);

  const currentCard: VocabCard | undefined = studyDeck[currentIndex];

  // Persist active study deck & exact card position continuously so pauses resume cleanly
  useEffect(() => {
    if (!hasRestoredStudyIndexRef.current) return;
    saveLastStudySession({
      deckId: activeDeckObj.id,
      isCustomQueue: Boolean(customStudyQueue),
      shortTitle: customStudyQueue?.shortTitle,
      studyDirection: activeStudyDirection,
      cardIds: customStudyQueue
        ? customStudyQueue.cards.map((c) => c.id)
        : undefined,
    });
    if (studyDeck.length > 0 && currentCard) {
      saveStudyDeckPosition(activeSessionKey, currentIndex, currentCard.id);
    }
  }, [
    activeDeckObj.id,
    activeSessionKey,
    activeStudyDirection,
    customStudyQueue,
    studyDeck.length,
    currentIndex,
    currentCard,
  ]);
  const currentCardSrs: CardSrsState = useMemo(() => {
    if (!currentCard) return createDefaultSrsState('empty');
    return getCardSrsForDirection(srsMap, currentCard.id, activeStudyDirection);
  }, [currentCard, srsMap, activeStudyDirection]);

  const activeTrail: StudyDeckTrail = useMemo(() => {
    return syncTrailWithDeck(
      studyTrailsByDeck[activeSessionKey],
      studyDeck,
      currentCard?.id,
      activeDeckObj.id === 'low-confidence'
    );
  }, [studyTrailsByDeck, activeSessionKey, activeDeckObj.id, studyDeck, currentCard?.id]);

  const currentVisitRating: RatingKey | undefined =
    activeTrail.entries[activeTrail.cursor]?.rating;

  const canGoPrev = useMemo(
    () => canStepTrailPrev(activeTrail, studyDeck),
    [activeTrail, studyDeck]
  );

  const canGoNext = Boolean(currentVisitRating);

  const cardShownAtRef = useRef<number>(performance.now());
  const isRatingTransitionRef = useRef<boolean>(false);

  useEffect(() => {
    cardShownAtRef.current = performance.now();
  }, [currentCard?.id, activeView]);

  const stopActiveAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore synthesis cancel errors
      }
    }
    setSpeakingId(null);
  }, []);

  // Native Web Speech API (de-DE)
  const handlePlayAudio = useCallback(
    (textToSpeak?: string, idTag = 'main', e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const targetText =
        textToSpeak || currentCard?.spokenText || currentCard?.lemma;
      if (!targetText) return;
      speakGermanText(
        targetText,
        () => setSpeakingId(idTag),
        () => setSpeakingId(null)
      );
    },
    [currentCard]
  );

  const clearCardMotionTimers = useCallback(() => {
    const t = cardMotionTimersRef.current;
    if (t.exitTimer !== null) window.clearTimeout(t.exitTimer);
    if (t.idleTimer !== null) window.clearTimeout(t.idleTimer);
    if (t.raf1 !== null) window.cancelAnimationFrame(t.raf1);
    if (t.raf2 !== null) window.cancelAnimationFrame(t.raf2);
    t.exitTimer = null;
    t.idleTimer = null;
    t.raf1 = null;
    t.raf2 = null;
    setExitingRating(null);
  }, []);

  const clearRateFirstHint = useCallback(() => {
    if (rateFirstTimerRef.current !== null) {
      window.clearTimeout(rateFirstTimerRef.current);
      rateFirstTimerRef.current = null;
    }
    setRateFirstHint(false);
  }, []);

  const clearRatingFeedback = useCallback(() => {
    if (flashingRatingTimerRef.current !== null) {
      window.clearTimeout(flashingRatingTimerRef.current);
      flashingRatingTimerRef.current = null;
    }
    if (recentRatingEchoTimerRef.current !== null) {
      window.clearTimeout(recentRatingEchoTimerRef.current);
      recentRatingEchoTimerRef.current = null;
    }
    setFlashingRating(null);
    setRecentRatingEcho(null);
    setExitingRating(null);
  }, []);

  useEffect(() => {
    return () => {
      clearCardMotionTimers();
      if (rateFirstTimerRef.current !== null) {
        window.clearTimeout(rateFirstTimerRef.current);
      }
      if (flashingRatingTimerRef.current !== null) {
        window.clearTimeout(flashingRatingTimerRef.current);
      }
      if (recentRatingEchoTimerRef.current !== null) {
        window.clearTimeout(recentRatingEchoTimerRef.current);
      }
    };
  }, [clearCardMotionTimers]);

  const triggerBlockedNextFeedback = useCallback(() => {
    clearCardMotionTimers();
    setCardMotion('is-blocked-next');
    cardMotionTimersRef.current.idleTimer = window.setTimeout(() => {
      setCardMotion('idle');
    }, 340);

    setRateFirstHint(true);
    if (rateFirstTimerRef.current !== null) {
      window.clearTimeout(rateFirstTimerRef.current);
    }
    rateFirstTimerRef.current = window.setTimeout(() => {
      setRateFirstHint(false);
      rateFirstTimerRef.current = null;
    }, 2400);
  }, [clearCardMotionTimers]);

  const resetFlipInstantaneously = useCallback(() => {
    stopActiveAudio();
    setSuppressFlipTransition(true);
    setIsFlipped(false);
    setIsBackExpanded(false);
    cardMotionTimersRef.current.raf1 = window.requestAnimationFrame(() => {
      cardMotionTimersRef.current.raf2 = window.requestAnimationFrame(() => {
        setSuppressFlipTransition(false);
      });
    });
  }, [stopActiveAudio]);

  const handlePrevCard = useCallback(() => {
    if (studyDeck.length === 0 || isRatingTransitionRef.current) return;
    const prevStep = stepTrailPrev(activeTrail, studyDeck);
    if (!prevStep) {
      return;
    }
    clearRateFirstHint();
    clearCardMotionTimers();
    isRatingTransitionRef.current = true;
    setDetailCard(null);
    setCardMotion('is-exiting-prev');
    const targetSessionKey = activeSessionKey;
    cardMotionTimersRef.current.exitTimer = window.setTimeout(() => {
      resetFlipInstantaneously();
      saveStudyDeckTrail(targetSessionKey, prevStep.trail);
      setStudyTrailsByDeck((prev) => ({
        ...prev,
        [targetSessionKey]: prevStep.trail,
      }));
      setCurrentIndex(prevStep.prevDeckIndex);
      isRatingTransitionRef.current = false;
      setCardMotion('is-entering-prev');
      cardMotionTimersRef.current.idleTimer = window.setTimeout(
        () => setCardMotion('idle'),
        320
      );
    }, 180);
  }, [
    studyDeck,
    activeTrail,
    activeSessionKey,
    clearRateFirstHint,
    clearCardMotionTimers,
    resetFlipInstantaneously,
  ]);

  const handleNextCard = useCallback(() => {
    if (studyDeck.length === 0 || isRatingTransitionRef.current) return;
    const nextStep = stepTrailNext(activeTrail, studyDeck);
    if (nextStep.blocked) {
      triggerBlockedNextFeedback();
      return;
    }
    clearRateFirstHint();
    clearCardMotionTimers();
    isRatingTransitionRef.current = true;
    setDetailCard(null);
    setCardMotion('is-exiting-next');
    const targetSessionKey = activeSessionKey;
    cardMotionTimersRef.current.exitTimer = window.setTimeout(() => {
      resetFlipInstantaneously();
      saveStudyDeckTrail(targetSessionKey, nextStep.trail);
      setStudyTrailsByDeck((prev) => ({
        ...prev,
        [targetSessionKey]: nextStep.trail,
      }));
      setCurrentIndex(nextStep.nextDeckIndex);
      isRatingTransitionRef.current = false;
      setCardMotion('is-entering-next');
      cardMotionTimersRef.current.idleTimer = window.setTimeout(
        () => setCardMotion('idle'),
        320
      );
    }, 180);
  }, [
    studyDeck,
    activeTrail,
    activeSessionKey,
    triggerBlockedNextFeedback,
    clearRateFirstHint,
    clearCardMotionTimers,
    resetFlipInstantaneously,
  ]);

  const handleFlipCard = useCallback(() => {
    setIsBackExpanded(false);
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRateCard = useCallback(
    (rating: RatingKey) => {
      if (!currentCard || isRatingTransitionRef.current) return;
      isRatingTransitionRef.current = true;
      clearRateFirstHint();
      clearCardMotionTimers();

      // Single crisp Gboard-style micro-bubble tick on card rating selection
      triggerHapticFeedback('tick');

      const now = new Date();
      setLastStudyMs(recordLastStudyTimestamp(now.getTime()));
      const targetDeckId = activeDeckObj.id;
      const targetDirection = activeStudyDirection;
      const targetSessionKey = activeSessionKey;
      const durationMs = Math.max(
        0,
        Math.round(performance.now() - cardShownAtRef.current)
      );
      const result = appendRatingEvent({
        cardId: currentCard.id,
        rating,
        srsMap,
        deckId: targetDeckId,
        direction: targetDirection,
        now,
        durationMs,
      });

      const isLowConfidenceDeck = targetDeckId === 'low-confidence';

      let nextIdx = 0;
      let nextCardId: string | undefined;
      let nextTrail: StudyDeckTrail;
      let nextLoopStateForDeck = activeLoopState;

      if (isLowConfidenceDeck) {
        const nextLowConfidenceCards = cards.filter((c) => {
          const st = getCardSrsForDirection(
            result.updatedMap,
            c.id,
            targetDirection
          );
          return isCardLowConfidence(st);
        });
        const nextLoop = applyLoopRating(
          activeLoopState,
          currentCard.id,
          rating,
          CONFIDENCE_LOOP_CONFIG
        );
        const lowSet = new Set(nextLowConfidenceCards.map((c) => c.id));
        const loopCandidate = getCurrentLoopCardId(nextLoop);
        let candidateCardId =
          loopCandidate && lowSet.has(loopCandidate) ? loopCandidate : undefined;
        if (!candidateCardId && nextLowConfidenceCards.length > 0) {
          for (let offset = 1; offset <= studyDeck.length; offset++) {
            const candidate =
              studyDeck[(currentIndex + offset) % studyDeck.length];
            if (candidate && lowSet.has(candidate.id)) {
              candidateCardId = candidate.id;
              break;
            }
          }
          if (!candidateCardId) {
            candidateCardId = nextLowConfidenceCards[0].id;
          }
        }
        nextIdx = candidateCardId
          ? Math.max(
              0,
              nextLowConfidenceCards.findIndex((c) => c.id === candidateCardId)
            )
          : 0;
        nextCardId = nextLowConfidenceCards[nextIdx]?.id;
        nextLoopStateForDeck = createInitialDeckLoopState(
          targetDeckId,
          nextLowConfidenceCards.map((c) => c.id),
          result.updatedMap,
          CONFIDENCE_LOOP_CONFIG,
          targetDirection
        );
        nextTrail = recordTrailRating(activeTrail, rating, nextCardId, {
          isDueDeck: true,
          validNextDeckCardIds: nextLowConfidenceCards.map((c) => c.id),
          ratedAtIso: now.toISOString(),
        });
      } else {
        const isAtFrontier =
          activeTrail.cursor >= activeTrail.entries.length - 1;
        if (!isAtFrontier) {
          const existingNextId =
            activeTrail.entries[activeTrail.cursor + 1]?.cardId;
          const foundIdx = studyDeck.findIndex(
            (c) => c.id === existingNextId
          );
          nextIdx =
            foundIdx >= 0
              ? foundIdx
              : studyDeck.length <= 1
              ? 0
              : (currentIndex + 1) % studyDeck.length;
          nextCardId = studyDeck[nextIdx]?.id;
        } else {
          nextLoopStateForDeck = applyLoopRating(
            activeLoopState,
            currentCard.id,
            rating,
            CONFIDENCE_LOOP_CONFIG
          );
          const loopTargetId = getCurrentLoopCardId(nextLoopStateForDeck);
          if (loopTargetId) {
            const foundIdx = studyDeck.findIndex((c) => c.id === loopTargetId);
            nextIdx = foundIdx >= 0 ? foundIdx : 0;
            nextCardId = studyDeck[nextIdx]?.id;
          } else {
            nextIdx = 0;
            nextCardId = undefined;
          }
        }
        nextTrail = recordTrailRating(activeTrail, rating, nextCardId, {
          ratedAtIso: now.toISOString(),
        });
      }

      if (flashingRatingTimerRef.current !== null) {
        window.clearTimeout(flashingRatingTimerRef.current);
      }
      setFlashingRating(rating);
      flashingRatingTimerRef.current = window.setTimeout(() => {
        setFlashingRating(null);
        flashingRatingTimerRef.current = null;
      }, 220);

      if (recentRatingEchoTimerRef.current !== null) {
        window.clearTimeout(recentRatingEchoTimerRef.current);
      }
      setRecentRatingEcho(rating);
      recentRatingEchoTimerRef.current = window.setTimeout(() => {
        setRecentRatingEcho(null);
        recentRatingEchoTimerRef.current = null;
      }, 1150);

      setDetailCard(null);
      setExitingRating(rating);
      setCardMotion('is-exiting-next');
      const prevLoopSnapshot = activeLoopState;
      cardMotionTimersRef.current.exitTimer = window.setTimeout(() => {
        resetFlipInstantaneously();
        const prevStack = loopUndoStackRef.current[targetSessionKey] || [];
        loopUndoStackRef.current[targetSessionKey] = [
          ...prevStack.slice(-29),
          prevLoopSnapshot,
        ];
        setLoopStatesByDeck((prev) => ({
          ...prev,
          [targetSessionKey]: nextLoopStateForDeck,
        }));
        saveStudyDeckTrail(targetSessionKey, nextTrail);
        setStudyTrailsByDeck((prev) => ({
          ...prev,
          [targetSessionKey]: nextTrail,
        }));
        setSrsMap(result.updatedMap);
        setStats(result.updatedStats);
        setSessionReviewedCount((prev) => prev + 1);
        setCurrentIndex(nextIdx);
        cardShownAtRef.current = performance.now();
        isRatingTransitionRef.current = false;
        setExitingRating(null);
        setCardMotion('is-entering-next');

        // Track deck session rating telemetry & evaluate 25% / 50% / 75% mascot checkpoints
        const numericRating = Number(rating) || 3;
        const prevRatingSummary = deckSessionRatingsRef.current[
          targetSessionKey
        ] || { count: 0, sum: 0, lowCount: 0 };
        const updatedSummary = {
          count: prevRatingSummary.count + 1,
          sum: prevRatingSummary.sum + numericRating,
          lowCount:
            prevRatingSummary.lowCount + (numericRating <= 2 ? 1 : 0),
        };
        deckSessionRatingsRef.current[targetSessionKey] = updatedSummary;

        if (!isLowConfidenceDeck && nextLoopStateForDeck.phase !== 'done') {
          const totalInDeck = studyDeck.length;
          const prevPct = computeDeckLoopProgressPct(prevLoopSnapshot);
          const nextPct = computeDeckLoopProgressPct(nextLoopStateForDeck);

          let shownSet = shownMilestonesByDeckRef.current[targetSessionKey];
          if (!shownSet) {
            shownSet = new Set<MilestoneThreshold>();
            // Pre-mark thresholds already passed before this session started
            for (const th of MILESTONE_THRESHOLDS) {
              if (prevPct >= th) shownSet.add(th);
            }
            shownMilestonesByDeckRef.current[targetSessionKey] = shownSet;
          }

          const ratingsGap =
            (ratingsSinceMilestoneByDeckRef.current[targetSessionKey] ?? 0) + 1;
          const triggeredThreshold = evaluateMilestoneTrigger({
            deckSize: totalInDeck,
            progressPct: nextPct,
            shownThresholds: shownSet,
            ratingsSinceLastMilestone: ratingsGap,
            enabled: milestoneInterludesEnabled,
          });

          if (triggeredThreshold) {
            for (const th of MILESTONE_THRESHOLDS) {
              if (th <= triggeredThreshold) shownSet.add(th);
            }
            ratingsSinceMilestoneByDeckRef.current[targetSessionKey] = 0;
            const recentAvg = updatedSummary.sum / updatedSummary.count;
            triggerHapticFeedback('confirm');
            setActiveMilestone(
              selectCheckpointMoment({
                threshold: triggeredThreshold,
                localHour: now.getHours(),
                recentAvgRating: recentAvg,
                hasRetries: updatedSummary.lowCount > 0,
              })
            );
          } else {
            ratingsSinceMilestoneByDeckRef.current[targetSessionKey] =
              ratingsGap;
          }
        } else {
          if (
            nextLoopStateForDeck.phase === 'done' &&
            prevLoopSnapshot.phase !== 'done'
          ) {
            triggerHapticFeedback('confirm');
          }
          setActiveMilestone(null);
        }

        cardMotionTimersRef.current.idleTimer = window.setTimeout(
          () => setCardMotion('idle'),
          320
        );
      }, 180);
    },
    [
      currentCard,
      srsMap,
      cards,
      studyDeck,
      currentIndex,
      activeDeckObj.id,
      activeStudyDirection,
      activeSessionKey,
      activeLoopState,
      activeTrail,
      milestoneInterludesEnabled,
      clearRateFirstHint,
      clearCardMotionTimers,
      resetFlipInstantaneously,
    ]
  );

  const handleSelectStudyDeck = useCallback(
    (nextDeckId: DeckId) => {
      if (nextDeckId === selectedDeckId && !customStudyQueue) return;
      userChangedDeckRef.current = true;
      stopActiveAudio();
      clearRateFirstHint();
      clearRatingFeedback();
      clearCardMotionTimers();
      isRatingTransitionRef.current = false;
      const prevIdx = enrichedDecks.findIndex((d) => d.id === selectedDeckId);
      const nextIdx = enrichedDecks.findIndex((d) => d.id === nextDeckId);
      const dirClass =
        prevIdx !== -1 && nextIdx !== -1 && nextIdx < prevIdx
          ? 'is-entering-prev'
          : 'is-entering-next';
      let restoredCardIdx = 0;
      const nextDeckCards =
        nextIdx >= 0 ? enrichedDecks[nextIdx].cards : cards;
      const nextDeckDir = normalizeStudyDirection(
        deckOverrides[nextDeckId]?.studyDirection
      );
      const nextSessionKey = getDeckSessionKey(nextDeckId, nextDeckDir);
      const existingLoop = loopStatesByDeck[nextSessionKey];
      const existingOrReopenedLoop =
        existingLoop && existingLoop.direction === nextDeckDir
          ? existingLoop
          : createInitialDeckLoopState(
              nextDeckId,
              nextDeckCards.map((c) => c.id),
              srsMap,
              CONFIDENCE_LOOP_CONFIG,
              nextDeckDir
            );
      setLoopStatesByDeck((prev) => ({
        ...prev,
        [nextSessionKey]: existingOrReopenedLoop,
      }));
      const targetLoopCardId = getCurrentLoopCardId(existingOrReopenedLoop);
      if (targetLoopCardId) {
        const idxInDeck = nextDeckCards.findIndex(
          (c) => c.id === targetLoopCardId
        );
        restoredCardIdx = idxInDeck >= 0 ? idxInDeck : 0;
      } else {
        const savedPositions = loadStudyDeckPositions();
        restoredCardIdx = resolveSavedDeckIndex(
          nextDeckCards,
          savedPositions[nextSessionKey]
        );
      }
      setCustomStudyQueue(null);
      setSelectedDeckId(nextDeckId);
      setCurrentIndex(restoredCardIdx);
      setDetailCard(null);
      setActiveMilestone(null);
      resetFlipInstantaneously();
      setCardMotion(dirClass);
      cardMotionTimersRef.current.idleTimer = window.setTimeout(
        () => setCardMotion('idle'),
        320
      );
    },
    [
      selectedDeckId,
      customStudyQueue,
      enrichedDecks,
      deckOverrides,
      cards,
      loopStatesByDeck,
      srsMap,
      clearRateFirstHint,
      clearRatingFeedback,
      clearCardMotionTimers,
      resetFlipInstantaneously,
      stopActiveAudio,
    ]
  );

  const handleUndoLastRating = useCallback(() => {
    const undone = undoLastReview(cards, srsMap, new Date(), {
      deckId: activeDeckObj.id,
      direction: activeStudyDirection,
    });
    if (!undone.undoneEntry) return;
    stopActiveAudio();
    clearRateFirstHint();
    clearRatingFeedback();
    const baseUndoneCardId = parseSrsStateKey(
      undone.undoneEntry.cardId
    ).cardId;
    const undoResult = clearTrailRatingForUndo(
      activeTrail,
      baseUndoneCardId,
      studyDeck
    );
    const targetDeckId = activeDeckObj.id;
    const targetSessionKey = activeSessionKey;
    const undoStack = loopUndoStackRef.current[targetSessionKey] || [];
    if (undoStack.length > 0) {
      const restoredLoop = undoStack[undoStack.length - 1];
      loopUndoStackRef.current[targetSessionKey] = undoStack.slice(0, -1);
      setLoopStatesByDeck((prev) => ({
        ...prev,
        [targetSessionKey]: restoredLoop,
      }));
    } else {
      const rebuiltLoop = createInitialDeckLoopState(
        targetDeckId,
        studyDeck.map((c) => c.id),
        undone.updatedMap,
        CONFIDENCE_LOOP_CONFIG,
        activeStudyDirection
      );
      setLoopStatesByDeck((prev) => ({
        ...prev,
        [targetSessionKey]: rebuiltLoop,
      }));
    }
    saveStudyDeckTrail(targetSessionKey, undoResult.trail);
    setStudyTrailsByDeck((prev) => ({
      ...prev,
      [targetSessionKey]: undoResult.trail,
    }));
    setSrsMap(undone.updatedMap);
    setStats(undone.updatedStats);
    setSessionReviewedCount((prev) => Math.max(0, prev - 1));
    setCurrentIndex(undoResult.deckIndex);
    setActiveMilestone(null);
    setIsFlipped(false);
    setIsBackExpanded(false);
  }, [
    cards,
    srsMap,
    studyDeck,
    activeTrail,
    activeDeckObj.id,
    activeStudyDirection,
    activeSessionKey,
    clearRateFirstHint,
    clearRatingFeedback,
    stopActiveAudio,
  ]);

  // Flashcard Touch Gesture Handlers (Tap = Flip, Long Press = Audio, Swipe L/R = Next/Prev or Rate, Swipe U/D = Forms/Anatomie/Flip)
  const clearLongPressAudio = useCallback(() => {
    if (longPressAudioTimerRef.current !== null) {
      window.clearTimeout(longPressAudioTimerRef.current);
      longPressAudioTimerRef.current = null;
    }
  }, []);

  const handleCardTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1 || !currentCard) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button')) return;

      clearLongPressAudio();
      const touch = e.touches[0];
      cardTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
        axis: 'none',
        suppressClick: false,
      };

      if (!isEnToDe || isFlipped) {
        longPressAudioTimerRef.current = window.setTimeout(() => {
          if (cardTouchRef.current && cardTouchRef.current.axis === 'none') {
            cardTouchRef.current.suppressClick = true;
            handlePlayAudio(
              currentCard.spokenText,
              isFlipped ? 'back-lemma' : 'front-lemma'
            );
          }
        }, 420);
      }
    },
    [clearLongPressAudio, currentCard, handlePlayAudio, isEnToDe, isFlipped]
  );

  const applyCardDragStyles = useCallback(
    (dx: number, dy: number, active: boolean) => {
      const cardEl = flipCardInnerDomRef.current;
      if (cardEl) {
        if (dragReleaseTimerRef.current !== null) {
          window.clearTimeout(dragReleaseTimerRef.current);
          dragReleaseTimerRef.current = null;
        }
        if (active) {
          cardEl.style.transition = 'none';
          cardEl.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${dx * 0.035}deg)`;
        } else {
          cardEl.style.transition =
            'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)';
          cardEl.style.transform = '';
          dragReleaseTimerRef.current = window.setTimeout(() => {
            if (flipCardInnerDomRef.current) {
              flipCardInnerDomRef.current.style.transition = '';
            }
            dragReleaseTimerRef.current = null;
          }, 230);
        }
      }

      const stampEl = edgeStampDomRef.current;
      if (stampEl) {
        if (active && Math.abs(dx) > 16) {
          const opacity = Math.min(1, (Math.abs(dx) - 14) / 42);
          stampEl.style.opacity = String(opacity);
          stampEl.style.display = 'inline-flex';
          const isNextSwipe = dx < 0;
          const isBlockedNext = isNextSwipe && !canGoNext;
          stampEl.className = `absolute top-4 z-30 pointer-events-none px-3 py-1 rounded-[var(--radius-control)] text-xs font-semibold shadow-ring inline-flex items-center gap-1.5 ${
            isNextSwipe
              ? canGoNext
                ? 'right-4 surface-2 text-[var(--fg-primary)] border'
                : 'right-4 surface-1 text-[var(--intent-warning)] border border-[var(--intent-warning-border)]'
              : canGoPrev
              ? 'left-4 surface-2 text-[var(--fg-primary)] border'
              : 'left-4 surface-2 text-[var(--fg-muted)] border'
          }`;
          if (edgeStampDotDomRef.current) {
            edgeStampDotDomRef.current.style.display = isBlockedNext
              ? 'inline-block'
              : 'none';
          }
          if (edgeStampTextDomRef.current) {
            edgeStampTextDomRef.current.textContent = isNextSwipe
              ? canGoNext
                ? 'Next →'
                : 'Rate first'
              : canGoPrev
              ? '← Prev'
              : 'First card';
          }
        } else {
          stampEl.style.opacity = '0';
          stampEl.style.display = 'none';
        }
      }
    },
    [canGoNext, canGoPrev]
  );

  useEffect(() => {
    return () => {
      if (dragReleaseTimerRef.current !== null) {
        window.clearTimeout(dragReleaseTimerRef.current);
      }
    };
  }, []);

  const handleCardTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const st = cardTouchRef.current;
      if (!st || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const dx = touch.clientX - st.x;
      const dy = touch.clientY - st.y;

      if (st.axis === 'none') {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        clearLongPressAudio();
        st.suppressClick = true;
        st.axis = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
      }

      if (st.axis === 'horizontal') {
        const dampedDx =
          dx < 0
            ? canGoNext
              ? Math.max(-150, dx)
              : Math.max(-56, dx * 0.35)
            : canGoPrev
            ? Math.min(150, dx)
            : Math.min(44, dx * 0.28);
        applyCardDragStyles(
          dampedDx,
          Math.max(-18, Math.min(18, dy * 0.14)),
          true
        );
      } else {
        applyCardDragStyles(0, Math.max(-44, Math.min(44, dy * 0.28)), true);
      }
    },
    [clearLongPressAudio, canGoNext, canGoPrev, applyCardDragStyles]
  );

  const handleCardTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      clearLongPressAudio();
      const st = cardTouchRef.current;
      if (!st) return;

      const touch = e.changedTouches[0];
      const dx = (touch?.clientX ?? st.x) - st.x;
      const dy = (touch?.clientY ?? st.y) - st.y;
      const elapsed = Math.max(16, performance.now() - st.time);
      const vx = Math.abs(dx) / elapsed;
      const vy = Math.abs(dy) / elapsed;

      applyCardDragStyles(0, 0, false);

      if (st.axis === 'horizontal') {
        if (Math.abs(dx) >= 64 || (Math.abs(dx) >= 38 && vx >= 0.42)) {
          if (dx < 0) {
            handleNextCard();
          } else {
            handlePrevCard();
          }
        } else if (dx < -24 && !canGoNext) {
          triggerBlockedNextFeedback();
        }
      } else if (st.axis === 'vertical') {
        if (Math.abs(dy) >= 34 || (Math.abs(dy) >= 22 && vy >= 0.28)) {
          if (!isFlipped) {
            if (dy < 0) {
              handleFlipCard();
            } else if (currentCard && !isEnToDe) {
              handlePlayAudio(currentCard.spokenText, 'front-lemma');
            }
          } else {
            if (dy < 0) {
              if (!isBackExpanded) {
                setIsBackExpanded(true);
              } else if (currentCard) {
                setDetailCard(currentCard);
              }
            } else {
              if (isBackExpanded) {
                setIsBackExpanded(false);
              } else {
                handleFlipCard();
              }
            }
          }
        }
      }

      if (st.suppressClick) {
        window.setTimeout(() => {
          cardTouchRef.current = null;
        }, 120);
      } else {
        cardTouchRef.current = null;
      }
    },
    [
      clearLongPressAudio,
      applyCardDragStyles,
      isEnToDe,
      isFlipped,
      isBackExpanded,
      currentCard,
      canGoNext,
      triggerBlockedNextFeedback,
      handleNextCard,
      handlePrevCard,
      handleFlipCard,
      handlePlayAudio,
    ]
  );

  const handleCardTouchCancel = useCallback(() => {
    clearLongPressAudio();
    cardTouchRef.current = null;
    applyCardDragStyles(0, 0, false);
  }, [clearLongPressAudio, applyCardDragStyles]);

  // Top-Level Horizontal Page Swipe Navigation (Study <-> Decks <-> Overview <-> Vocab)
  const ORDERED_VIEWS: ActiveView[] = ['study', 'decks', 'dashboard', 'archive'];

  const handleMainTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (
        e.touches.length !== 1 ||
        isZenSessionActive ||
        detailCard ||
        isAddModalOpen ||
        isThemePopoverOpen ||
        (activeView === 'decks' && isDecksSubScreenOpen)
      ) {
        pageSwipeRef.current = null;
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          '.perspective-stage, .no-scrollbar, .recharts-wrapper, [data-no-page-swipe], input, textarea, select'
        )
      ) {
        pageSwipeRef.current = null;
        return;
      }
      pageSwipeRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        eligible: true,
      };
    },
    [
      activeView,
      isDecksSubScreenOpen,
      detailCard,
      isAddModalOpen,
      isThemePopoverOpen,
    ]
  );

  const handleMainTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const st = pageSwipeRef.current;
    if (!st || !st.eligible || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - st.x;
    const dy = e.touches[0].clientY - st.y;
    if (Math.abs(dy) > 22 && Math.abs(dy) > Math.abs(dx) * 0.8) {
      st.eligible = false;
    }
  }, []);

  const handleMainTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const st = pageSwipeRef.current;
      pageSwipeRef.current = null;
      if (!st || !st.eligible || e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - st.x;
      const dy = e.changedTouches[0].clientY - st.y;
      if (Math.abs(dx) >= 72 && Math.abs(dx) > Math.abs(dy) * 2.0) {
        const idx = ORDERED_VIEWS.indexOf(activeView);
        const nextIdx = dx < 0 ? idx + 1 : idx - 1;
        if (nextIdx >= 0 && nextIdx < ORDERED_VIEWS.length) {
          navigateToView(ORDERED_VIEWS[nextIdx]);
        }
      }
    },
    [activeView, navigateToView]
  );

  const {
    dragY: addModalDragY,
    sheetTouchHandlers: addModalSheetTouchHandlers,
    sheetStyle: addModalSheetStyle,
  } = useSheetSwipeDismiss({
    isOpen: isAddModalOpen,
    onDismiss: () => setIsAddModalOpen(false),
    scrollContainerRef: addModalScrollRef,
    threshold: 88,
  });

  // Phone / Browser Back Button Navigation Stack across All Decks, Folders, Deck Details, Study, Tabs & Modals
  const decksSubScreenDepth =
    decksSubScreen.type === 'folder'
      ? 1
      : decksSubScreen.type === 'deck-detail'
      ? decksSubScreen.returnFolderId
        ? 2
        : 1
      : 0;
  const desiredHistoryDepth =
    (activeView !== 'decks' ? 1 : 0) +
    (activeView === 'study' && isZenMode ? 1 : 0) +
    decksSubScreenDepth +
    (activeView === 'decks' && isDecksOverlayOpen ? 1 : 0) +
    (isThemePopoverOpen ? 1 : 0) +
    (isAddModalOpen ? 1 : 0) +
    (detailCard ? 1 : 0);

  const syncedHistoryDepthRef = useRef<number>(0);
  const silentPopTargetDepthRef = useRef<number | null>(null);
  const backStackStateRef = useRef({
    activeView,
    isZenMode,
    decksSubScreen,
    isThemePopoverOpen,
    isAddModalOpen,
    detailCard,
  });
  backStackStateRef.current = {
    activeView,
    isZenMode,
    decksSubScreen,
    isThemePopoverOpen,
    isAddModalOpen,
    detailCard,
  };

  const stepBackInApp = useCallback((): boolean => {
    const s = backStackStateRef.current;
    if (s.isThemePopoverOpen) {
      setIsThemePopoverOpen(false);
      return true;
    }
    if (s.detailCard) {
      setDetailCard(null);
      return true;
    }
    if (s.isAddModalOpen) {
      setIsAddModalOpen(false);
      return true;
    }
    if (s.activeView === 'decks' && closeDecksTopSheetRef.current?.()) {
      return true;
    }
    if (s.activeView === 'study' && s.isZenMode) {
      setIsZenMode(false);
      return true;
    }
    if (s.activeView === 'decks' && s.decksSubScreen.type === 'deck-detail') {
      setDecksSubScreen(
        s.decksSubScreen.returnFolderId
          ? { type: 'folder', folderId: s.decksSubScreen.returnFolderId }
          : { type: 'root' }
      );
      return true;
    }
    if (s.activeView === 'decks' && s.decksSubScreen.type === 'folder') {
      setDecksSubScreen({ type: 'root' });
      return true;
    }
    if (s.activeView !== 'study') {
      navigateToView('study', 'backward');
      return true;
    }
    return false;
  }, [navigateToView]);

  useEffect(() => {
    if (!isNativeAndroidApp()) return;
    return registerAndroidBackButton(stepBackInApp);
  }, [stepBackInApp]);

  useEffect(() => {
    if (typeof window === 'undefined' || isNativeAndroidApp()) return;
    const currentState = window.history.state;
    if (!currentState || typeof currentState.achsooDepth !== 'number') {
      window.history.replaceState({ achsooDepth: 0 }, '');
      syncedHistoryDepthRef.current = 0;
    } else {
      syncedHistoryDepthRef.current = currentState.achsooDepth;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isNativeAndroidApp()) return;
    if (desiredHistoryDepth > syncedHistoryDepthRef.current) {
      while (syncedHistoryDepthRef.current < desiredHistoryDepth) {
        syncedHistoryDepthRef.current += 1;
        window.history.pushState(
          { achsooDepth: syncedHistoryDepthRef.current },
          ''
        );
      }
    } else if (desiredHistoryDepth < syncedHistoryDepthRef.current) {
      const diff = desiredHistoryDepth - syncedHistoryDepthRef.current;
      syncedHistoryDepthRef.current = desiredHistoryDepth;
      silentPopTargetDepthRef.current = desiredHistoryDepth;
      window.history.go(diff);
    }
  }, [desiredHistoryDepth]);

  useEffect(() => {
    if (typeof window === 'undefined' || isNativeAndroidApp()) return;
    const handlePopState = (e: PopStateEvent) => {
      const browserDepth =
        e.state && typeof e.state.achsooDepth === 'number'
          ? e.state.achsooDepth
          : 0;

      if (
        silentPopTargetDepthRef.current !== null &&
        browserDepth === silentPopTargetDepthRef.current
      ) {
        silentPopTargetDepthRef.current = null;
        syncedHistoryDepthRef.current = browserDepth;
        return;
      }

      const prevSynced = syncedHistoryDepthRef.current;
      syncedHistoryDepthRef.current = browserDepth;
      if (browserDepth >= prevSynced) return;

      const s = backStackStateRef.current;
      if (s.isThemePopoverOpen) {
        setIsThemePopoverOpen(false);
        return;
      }
      if (s.detailCard) {
        setDetailCard(null);
        return;
      }
      if (s.isAddModalOpen) {
        setIsAddModalOpen(false);
        return;
      }
      if (s.activeView === 'decks' && closeDecksTopSheetRef.current?.()) {
        return;
      }
      if (s.activeView === 'study' && s.isZenMode) {
        setIsZenMode(false);
        return;
      }
      if (s.activeView !== 'decks') {
        navigateToView('decks', 'backward');
        return;
      }
      if (s.decksSubScreen.type === 'deck-detail') {
        setDecksSubScreen(
          s.decksSubScreen.returnFolderId
            ? { type: 'folder', folderId: s.decksSubScreen.returnFolderId }
            : { type: 'root' }
        );
        return;
      }
      if (s.decksSubScreen.type === 'folder') {
        setDecksSubScreen({ type: 'root' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateToView]);

  // Global Keyboard Shortcuts (Space, 1-4, A, D for Anatomie, Z for Zen, Escape, Arrows)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (isThemePopoverOpen) {
          e.preventDefault();
          setIsThemePopoverOpen(false);
          return;
        }
        if (detailCard) {
          e.preventDefault();
          setDetailCard(null);
          return;
        }
        if (isBackExpanded) {
          e.preventDefault();
          setIsBackExpanded(false);
          return;
        }
        if (isAddModalOpen) {
          e.preventDefault();
          setIsAddModalOpen(false);
          return;
        }
        if (isZenMode) {
          e.preventDefault();
          setIsZenMode(false);
          return;
        }
      }

      if (activeView !== 'study' || isAddModalOpen) return;

      if (activeMilestone && !detailCard) {
        if (
          e.code === 'Space' ||
          e.key === 'Enter' ||
          e.key === 'ArrowRight' ||
          e.key === 'Escape'
        ) {
          e.preventDefault();
          handleDismissMilestone();
        }
        return;
      }

      if (e.code === 'Space' && !detailCard) {
        e.preventDefault();
        handleFlipCard();
      } else if (!detailCard && isFlipped && e.key === 'ArrowUp') {
        e.preventDefault();
        setIsBackExpanded(true);
      } else if (!detailCard && isFlipped && e.key === 'ArrowDown') {
        e.preventDefault();
        setIsBackExpanded(false);
      } else if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'z' &&
        !detailCard
      ) {
        e.preventDefault();
        handleUndoLastRating();
      } else if (
        !e.metaKey &&
        !e.ctrlKey &&
        e.key.toLowerCase() === 'z' &&
        !detailCard
      ) {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      } else if (e.key.toLowerCase() === 'd' && currentCard) {
        if (isEnToDe && !isFlipped && !detailCard) return;
        e.preventDefault();
        setDetailCard((prev) => (prev ? null : currentCard));
      } else if (!detailCard && e.key === '1') {
        e.preventDefault();
        if (isFlipped) handleRateCard('1');
        else handleFlipCard();
      } else if (!detailCard && e.key === '2') {
        e.preventDefault();
        if (isFlipped) handleRateCard('2');
        else handleFlipCard();
      } else if (!detailCard && e.key === '3') {
        e.preventDefault();
        if (isFlipped) handleRateCard('3');
        else handleFlipCard();
      } else if (!detailCard && e.key === '4') {
        e.preventDefault();
        if (isFlipped) handleRateCard('4');
        else handleFlipCard();
      } else if (!detailCard && e.key === '5') {
        e.preventDefault();
        if (isFlipped) handleRateCard('5');
        else handleFlipCard();
      } else if (e.key.toLowerCase() === 'a') {
        if (isEnToDe && !isFlipped && !detailCard) return;
        e.preventDefault();
        handlePlayAudio(
          detailCard ? detailCard.spokenText : currentCard?.spokenText,
          detailCard ? 'drawer-lemma' : isFlipped ? 'back-lemma' : 'front-lemma'
        );
      } else if (!detailCard && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (!detailCard && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeView,
    isThemePopoverOpen,
    isAddModalOpen,
    isZenMode,
    isEnToDe,
    isFlipped,
    isBackExpanded,
    detailCard,
    currentCard,
    activeMilestone,
    handleDismissMilestone,
    handleFlipCard,
    handleRateCard,
    handleUndoLastRating,
    handlePlayAudio,
    handleNextCard,
    handlePrevCard,
  ]);

  const launchDeckStudy = (
    deckId: string,
    enterZen = false,
    customCardsOverride?: VocabCard[]
  ) => {
    userChangedDeckRef.current = true;
    stopActiveAudio();
    const builtInMatch = enrichedDecks.find((d) => d.id === deckId);
    let targetCardsForResume: VocabCard[] = [];
    let resumedIndex = 0;

    if (builtInMatch && !customCardsOverride) {
      setCustomStudyQueue(null);
      setSelectedDeckId(builtInMatch.id);
      targetCardsForResume = builtInMatch.cards;
    } else {
      const unifiedMatch = enrichedUnifiedDecks.find((d) => d.id === deckId);
      const targetCards =
        customCardsOverride && customCardsOverride.length > 0
          ? customCardsOverride
          : unifiedMatch?.cards || cards;
      if (builtInMatch) {
        setSelectedDeckId(builtInMatch.id);
      }
      setCustomStudyQueue({
        id: deckId,
        shortTitle: unifiedMatch?.shortTitle || 'Study Session',
        cards: targetCards,
        studyDirection: unifiedMatch?.studyDirection,
      });
      targetCardsForResume = targetCards;
    }

    const unifiedMatchForDir = enrichedUnifiedDecks.find((d) => d.id === deckId);
    const launchDirection = normalizeStudyDirection(
      unifiedMatchForDir?.studyDirection ?? deckOverrides[deckId]?.studyDirection
    );
    const launchSessionKey = getDeckSessionKey(deckId, launchDirection);
    const existingLoop = loopStatesByDeck[launchSessionKey];
    const nextLoop =
      existingLoop &&
      existingLoop.direction === launchDirection &&
      existingLoop.phase !== 'done'
        ? existingLoop
        : createInitialDeckLoopState(
            deckId,
            targetCardsForResume.map((c) => c.id),
            srsMap,
            CONFIDENCE_LOOP_CONFIG,
            launchDirection
          );
    setLoopStatesByDeck((prev) => ({
      ...prev,
      [launchSessionKey]: nextLoop,
    }));
    const loopCardId = getCurrentLoopCardId(nextLoop);
    if (loopCardId) {
      const idx = targetCardsForResume.findIndex((c) => c.id === loopCardId);
      resumedIndex = idx >= 0 ? idx : 0;
    }

    clearRateFirstHint();
    clearRatingFeedback();
    setCurrentIndex(resumedIndex);
    setActiveMilestone(null);
    setIsFlipped(false);
    setIsBackExpanded(false);
    setDetailCard(null);
    navigateToView('study', 'forward');
    if (enterZen) {
      setIsZenMode(true);
    }
  };

  const handleResetDeckSrs = useCallback(
    (cardIds: string[], deckId?: string, direction?: DeckStudyDirection) => {
      const targetDirection: DeckStudyDirection =
        direction ??
        (deckId
          ? normalizeStudyDirection(
              enrichedUnifiedDecks.find((d) => d.id === deckId)
                ?.studyDirection ?? deckOverrides[deckId]?.studyDirection
            )
          : activeStudyDirection);
      const { updatedMap, updatedStats } = resetCardsSrsProgress(
        cardIds,
        srsMap,
        new Date(),
        targetDirection
      );
      setSrsMap(updatedMap);
      setStats(updatedStats);
      if (deckId) {
        const targetSessionKey = getDeckSessionKey(deckId, targetDirection);
        saveStudyDeckPosition(targetSessionKey, 0);
        clearStudyDeckTrail(targetSessionKey);
        delete loopUndoStackRef.current[targetSessionKey];
        delete shownMilestonesByDeckRef.current[targetSessionKey];
        delete deckSessionRatingsRef.current[targetSessionKey];
        delete ratingsSinceMilestoneByDeckRef.current[targetSessionKey];
        const freshLoop = createInitialDeckLoopState(
          deckId,
          cardIds,
          updatedMap,
          CONFIDENCE_LOOP_CONFIG,
          targetDirection
        );
        setLoopStatesByDeck((prev) => ({
          ...prev,
          [targetSessionKey]: freshLoop,
        }));
        if (deckId === 'all') {
          reshuffleAllCards();
        }
        if (activeSessionKey === targetSessionKey) {
          clearRateFirstHint();
          clearRatingFeedback();
          const firstId = getCurrentLoopCardId(freshLoop);
          const nextIdx = firstId
            ? Math.max(
                0,
                studyDeck.findIndex((c) => c.id === firstId)
              )
            : 0;
          setCurrentIndex(nextIdx);
          setIsFlipped(false);
          setIsBackExpanded(false);
        }
      }
      const targetSessionKey = deckId
        ? getDeckSessionKey(deckId, targetDirection)
        : null;
      const resetSet = new Set(cardIds);
      setStudyTrailsByDeck((prev) => {
        const next: Record<string, StudyDeckTrail> = {};
        for (const [sessionKey, trail] of Object.entries(prev)) {
          if (targetSessionKey && sessionKey === targetSessionKey) {
            continue;
          }
          const trailDir: DeckStudyDirection = sessionKey.endsWith('::en-de')
            ? 'en-de'
            : 'de-en';
          if (trailDir !== targetDirection) {
            next[sessionKey] = trail;
            continue;
          }
          const cleanedEntries = trail.entries.map((entry) => {
            if (!resetSet.has(entry.cardId)) return entry;
            const { rating: _r, ratedAt: _ra, ...rest } = entry;
            return rest;
          });
          const cleanedTrail = { ...trail, entries: cleanedEntries };
          saveStudyDeckTrail(sessionKey, cleanedTrail);
          next[sessionKey] = cleanedTrail;
        }
        return next;
      });
    },
    [
      srsMap,
      enrichedUnifiedDecks,
      deckOverrides,
      activeStudyDirection,
      activeSessionKey,
      studyDeck,
      reshuffleAllCards,
      clearRateFirstHint,
      clearRatingFeedback,
    ]
  );

  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLemma.trim() || !newTranslation.trim()) return;

    const id = `custom-${Date.now()}`;
    const genderLabelMap: Record<
      NounGender,
      'Maskulin' | 'Feminin' | 'Neutrum'
    > = {
      der: 'Maskulin',
      die: 'Feminin',
      das: 'Neutrum',
    };

    let grammarLabel = 'Wortschatz';
    if (newCategory === 'verb') {
      grammarLabel = `Verb · ${
        newAux === 'sein' ? 'Perfekt mit sein' : 'Perfekt mit haben'
      }`;
    } else if (newCategory === 'noun') {
      grammarLabel = `Nomen · ${genderLabelMap[newGender]}`;
    } else if (newCategory === 'adj') {
      grammarLabel = 'Adjektiv · regelmäßig';
    } else if (newCategory === 'preposition') {
      grammarLabel = `Präposition · ${newPrepCase}`;
    } else if (newCategory === 'conn') {
      grammarLabel = 'Konnektor · Satzverbindung';
    } else if (newCategory === 'phrase') {
      grammarLabel = 'Wendung · Redemittel';
    }

    const formattedLemma =
      newCategory === 'noun'
        ? formatNounLemma(newLemma, newGender)
        : newLemma.trim();

    const baseWord = stripLeadingGermanArticles(formattedLemma);

    const created: VocabCard = {
      id,
      lemma: formattedLemma,
      spokenText: formattedLemma,
      cefr: newCefr,
      category: newCategory,
      grammarLabel,
      translation: newTranslation.trim(),
      highlightTarget: baseWord,
      verbDetails:
        newCategory === 'verb'
          ? {
              praesens: newPraesens.trim() || `er/sie/es ${baseWord}`,
              praeteritum: newPraeteritum.trim() || '—',
              perfekt:
                newPerfekt.trim() || `${newAux === 'sein' ? 'ist' : 'hat'} …`,
              auxiliary: newAux,
            }
          : undefined,
      nounDetails:
        newCategory === 'noun'
          ? {
              gender: newGender,
              genderLabel: genderLabelMap[newGender],
              plural: newPlural.trim() || `die ${baseWord}`,
              pluralSuffix: '-en',
              genusRule: `${genderLabelMap[newGender]} (${newGender})`,
            }
          : undefined,
      adjDetails:
        newCategory === 'adj'
          ? {
              positiv: baseWord,
              komparativ: newAdjKomp.trim() || `${baseWord}er`,
              superlativ: newAdjSup.trim() || `am ${baseWord}sten`,
              declensionExamples: {
                weak: {
                  nom: `der ${baseWord}e Weg`,
                  akk: `den ${baseWord}en Weg`,
                  dat: `dem ${baseWord}en Weg`,
                  gen: `des ${baseWord}en Wegs`,
                },
                mixed: {
                  nom: `ein ${baseWord}er Weg`,
                  akk: `einen ${baseWord}en Weg`,
                  dat: `einem ${baseWord}en Weg`,
                  gen: `eines ${baseWord}en Wegs`,
                },
                strong: {
                  nom: `${baseWord}er Weg`,
                  akk: `${baseWord}en Weg`,
                  dat: `${baseWord}em Weg`,
                  gen: `${baseWord}en Wegs`,
                },
              },
            }
          : undefined,
      prepDetails:
        newCategory === 'preposition'
          ? {
              governedCase: `+ ${newPrepCase.trim() || 'Dativ'}`,
              caseShort: 'Dat',
              questionPrompt: `Mit ${newPrepCase.trim() || 'Dativ'}`,
              collocations: [formattedLemma],
            }
          : undefined,
      connDetails:
        newCategory === 'conn'
          ? {
              connectorClass: 'Subordinierend (Nebensatz)',
              verbPositionRule: newConnRule.trim() || 'Nebensatz · Verb am Ende',
              hauptsatzFirstDe:
                newExampleDe.trim() ||
                `Beispielsatz mit „${formattedLemma}“ im Alltag.`,
              hauptsatzFirstEn:
                newExampleEn.trim() ||
                `Example sentence using "${formattedLemma}".`,
              nebensatzFirstDe:
                newExampleDe.trim() ||
                `Beispielsatz mit „${formattedLemma}“ im Alltag.`,
              nebensatzFirstEn:
                newExampleEn.trim() ||
                `Example sentence using "${formattedLemma}".`,
              contrastPair: {
                partnerWord: 'Hauptsatz-Konnektor',
                partnerRule: newConnRule.trim() || 'Wortstellung beachten',
                partnerExample:
                  newExampleDe.trim() || `Beispiel mit ${formattedLemma}.`,
              },
            }
          : undefined,
      phraseDetails:
        newCategory === 'phrase'
          ? {
              framePattern: newPhraseFrame.trim() || formattedLemma,
              casePattern: 'Redemittel im Kontext',
              registerLabel: 'Alltag & Gespräch',
              formalVariant: {
                textDe: newExampleDe.trim() || formattedLemma,
                textEn: newExampleEn.trim() || newTranslation.trim(),
                contextNote: 'Formell / B1 Prüfung',
              },
              informalVariant: {
                textDe: newExampleDe.trim() || formattedLemma,
                textEn: newExampleEn.trim() || newTranslation.trim(),
                contextNote: 'Alltag / Gespräch',
              },
              miniDialog: {
                speakerA: 'Partner',
                promptDe: 'Was meinst du dazu?',
                promptEn: 'What do you think about that?',
                speakerB: 'Du',
                replyDe: newExampleDe.trim() || formattedLemma,
                replyEn: newExampleEn.trim() || newTranslation.trim(),
              },
            }
          : undefined,
      exampleDe:
        newExampleDe.trim() ||
        `Beispielsatz mit „${formattedLemma}“ im Alltag.`,
      exampleEn:
        newExampleEn.trim() ||
        `Example sentence using "${formattedLemma}" in daily context.`,
      anatomy: {
        conjugationTable:
          newCategory === 'verb'
            ? {
                ich: `ich ${baseWord}`,
                du: `du …`,
                erSieEs: newPraesens.trim() || `er/sie/es ${baseWord}`,
                wir: `wir ${baseWord}`,
                ihr: `ihr …`,
                sieSie: `sie/Sie ${baseWord}`,
              }
            : undefined,
        nounDeclension:
          newCategory === 'noun'
            ? {
                nominativ: `${formattedLemma} · ${newPlural.trim() || '—'}`,
                akkusativ: `${
                  newGender === 'der' ? 'den' : newGender
                } ${baseWord}`,
                dativ: `${newGender === 'die' ? 'der' : 'dem'} ${baseWord}`,
                genitiv: `${newGender === 'die' ? 'der' : 'des'} ${baseWord}`,
              }
            : undefined,
        caseGovernanceNote:
          newCategory === 'verb'
            ? `Custom verb entry using Perfekt auxiliary "${newAux}".`
            : newCategory === 'noun'
            ? `Custom ${genderLabelMap[newGender]} noun (${newGender}).`
            : `Custom ${grammarLabel} entry.`,
        synonyms: [],
        antonyms: [],
        collocations: [
          newExampleDe.trim() || `${formattedLemma} im Kontext verwenden`,
        ],
        wordFamily: [formattedLemma],
        b1ExamTip: `Practice using "${formattedLemma}" in a full sentence for active recall.`,
      },
    };

    const updatedCards = saveCustomCard(created);
    setCards(updatedCards);
    const updatedSrs = {
      ...srsMap,
      [created.id]: createDefaultSrsState(created.id),
    };
    setSrsMap(updatedSrs);
    saveSrsMap(updatedSrs);

    setNewLemma('');
    setNewTranslation('');
    setNewPlural('');
    setNewPraesens('');
    setNewPraeteritum('');
    setNewPerfekt('');
    setNewAdjKomp('');
    setNewAdjSup('');
    setNewPhraseFrame('');
    setNewExampleDe('');
    setNewExampleEn('');
    setIsAddModalOpen(false);
  };

  // Filtered vocabulary archive with progressive 60-item windowing
  const [archiveVisibleCount, setArchiveVisibleCount] = useState<number>(60);
  const archiveSentinelRef = useRef<HTMLDivElement | null>(null);

  const archiveCards = useMemo(() => {
    return cards.filter((c) => {
      if (archiveCefrFilter !== 'ALL' && c.cefr !== archiveCefrFilter)
        return false;
      if (
        archiveCategoryFilter !== 'all' &&
        c.category !== archiveCategoryFilter
      ) {
        return false;
      }
      if (archiveSearchQuery.trim()) {
        const q = archiveSearchQuery.toLowerCase();
        return (
          c.lemma.toLowerCase().includes(q) ||
          c.translation.toLowerCase().includes(q) ||
          c.exampleDe.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cards, archiveCefrFilter, archiveCategoryFilter, archiveSearchQuery]);

  useEffect(() => {
    setArchiveVisibleCount(60);
  }, [archiveCefrFilter, archiveCategoryFilter, archiveSearchQuery]);

  useEffect(() => {
    if (
      activeView !== 'archive' ||
      archiveVisibleCount >= archiveCards.length ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }
    const target = archiveSentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArchiveVisibleCount((prev) =>
            Math.min(archiveCards.length, prev + 60)
          );
        }
      },
      { rootMargin: '320px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [activeView, archiveVisibleCount, archiveCards.length]);

  const visibleArchiveCards = useMemo(
    () => archiveCards.slice(0, archiveVisibleCount),
    [archiveCards, archiveVisibleCount]
  );

  // Noun Gender Color System (--gender-m / --gender-f / --gender-n tokens)
  const getNounGenderStyles = (gender?: NounGender) => {
    switch (gender) {
      case 'der':
        return {
          text: 'text-[var(--gender-m)]',
          name: 'der · Maskulin',
        };
      case 'die':
        return {
          text: 'text-[var(--gender-f)]',
          name: 'die · Feminin',
        };
      case 'das':
        return {
          text: 'text-[var(--gender-n)]',
          name: 'das · Neutrum',
        };
      default:
        return null;
    }
  };

  // Render Lemma with gender color (Nouns) or terracotta pipe (Separable Verbs: an|kommen)
  const renderFormattedLemma = (card: VocabCard) => {
    if (card.category === 'noun' && card.nounDetails) {
      return (
        <>
          <span className={getNounGenderStyles(card.nounDetails.gender)?.text}>
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

  // 3-Part Grammar Forms for Card Backside (Theme-isolated tokens — zero Hero blue leak)
  const getBacksideThreeForms = (
    card: VocabCard
  ): {
    label: string;
    shortValue: string;
    richValue: React.ReactNode;
  }[] => {
    switch (card.category) {
      case 'verb': {
        const v = card.verbDetails;
        if (!v) return [];
        const praesensClean = v.praesens.replace(/^er\/sie\/es\s+/i, '');
        const auxColor =
          v.auxiliary === 'sein'
            ? 'text-[var(--grammar-aux-sein)] font-semibold'
            : 'text-[var(--grammar-aux-haben)] font-semibold';
        const perfektParts = v.perfekt.split(' ');
        const auxWord = perfektParts[0];
        const participleRest = perfektParts.slice(1).join(' ');

        return [
          {
            label: 'Präsens',
            shortValue: praesensClean,
            richValue: (
              <span className="text-[var(--fg-primary)]">{praesensClean}</span>
            ),
          },
          {
            label: 'Präteritum',
            shortValue: v.praeteritum,
            richValue: <span className="text-terracotta">{v.praeteritum}</span>,
          },
          {
            label: 'Perfekt',
            shortValue: v.perfekt,
            richValue: (
              <span>
                <span className={auxColor}>{auxWord}</span> {participleRest}
              </span>
            ),
          },
        ];
      }
      case 'noun': {
        const n = card.nounDetails;
        if (!n) return [];
        const genderColor = getNounGenderStyles(n.gender)?.text || '';
        return [
          {
            label: 'Singular',
            shortValue: formatNounLemma(card.lemma, n.gender),
            richValue: (
              <span>
                <span className={genderColor}>{n.gender}</span>{' '}
                {stripLeadingGermanArticles(card.lemma)}
              </span>
            ),
          },
          {
            label: 'Plural',
            shortValue: n.plural,
            richValue: (
              <span className="text-[var(--fg-primary)]">{n.plural}</span>
            ),
          },
          {
            label: 'Endung',
            shortValue: `Plural ${n.pluralSuffix || '—'}`,
            richValue: (
              <span className="text-[var(--accent-secondary)]">
                {n.pluralSuffix || n.genusRule}
              </span>
            ),
          },
        ];
      }
      case 'adj': {
        const a = card.adjDetails;
        if (!a) return [];
        return [
          {
            label: 'Positiv',
            shortValue: a.positiv,
            richValue: (
              <span className="text-[var(--fg-primary)]">{a.positiv}</span>
            ),
          },
          {
            label: 'Komparativ',
            shortValue: a.komparativ,
            richValue: (
              <span className="text-[var(--accent-secondary)]">
                {a.komparativ}
              </span>
            ),
          },
          {
            label: 'Superlativ',
            shortValue: a.superlativ,
            richValue: (
              <span className="text-[var(--fg-primary)]">{a.superlativ}</span>
            ),
          },
        ];
      }
      case 'preposition': {
        const p = card.prepDetails;
        if (!p) return [];
        return [
          {
            label: 'Kasus',
            shortValue: p.governedCase,
            richValue: (
              <span className="text-[var(--accent-secondary)]">
                {p.governedCase}
              </span>
            ),
          },
          {
            label: 'Frage',
            shortValue: p.questionPrompt || '—',
            richValue: (
              <span className="text-[var(--fg-primary)]">
                {p.questionPrompt || '—'}
              </span>
            ),
          },
          {
            label: 'Beispiel',
            shortValue: p.collocations[0] || card.lemma,
            richValue: (
              <span className="text-[var(--fg-primary)]">
                {p.collocations[0] || card.lemma}
              </span>
            ),
          },
        ];
      }
      case 'conn': {
        const c = card.connDetails;
        if (!c) return [];
        return [
          {
            label: 'Satztyp',
            shortValue: c.connectorClass.replace(/\s*\(.*\)/, ''),
            richValue: (
              <span className="text-[var(--fg-primary)]">
                {c.connectorClass.replace(/\s*\(.*\)/, '')}
              </span>
            ),
          },
          {
            label: 'Verbposition',
            shortValue: c.verbPositionRule,
            richValue: (
              <span className="text-terracotta">{c.verbPositionRule}</span>
            ),
          },
          {
            label: 'Gegenstück',
            shortValue: c.contrastPair?.partnerWord || '—',
            richValue: (
              <span className="text-[var(--accent-secondary)]">
                {c.contrastPair?.partnerWord || '—'}
              </span>
            ),
          },
        ];
      }
      case 'phrase': {
        const ph = card.phraseDetails;
        if (!ph) return [];
        return [
          {
            label: 'Muster',
            shortValue: ph.framePattern,
            richValue: (
              <span className="text-[var(--fg-primary)]">
                {ph.framePattern}
              </span>
            ),
          },
          {
            label: 'Grammatik',
            shortValue: ph.casePattern,
            richValue: (
              <span className="text-[var(--accent-secondary)]">
                {ph.casePattern}
              </span>
            ),
          },
          {
            label: 'Register',
            shortValue: ph.registerLabel,
            richValue: (
              <span className="text-[var(--fg-primary)]">
                {ph.registerLabel}
              </span>
            ),
          },
        ];
      }
    }
  };

  // Mobile-First Fluid Font Scaling Helpers
  const getFluidLemmaClass = (lemma: string) => {
    const len = lemma.length;
    if (len > 22) return 'fluid-lemma-long';
    if (len > 14) return 'fluid-lemma-medium';
    return 'fluid-lemma-short';
  };

  const getFluidBackLemmaClass = (lemma: string) => {
    const len = lemma.length;
    if (len > 22) return 'fluid-back-lemma-long';
    if (len > 14) return 'fluid-back-lemma-medium';
    return 'fluid-back-lemma';
  };

  const getFluidMeaningClass = (meaning: string) => {
    return meaning.length > 32 ? 'fluid-meaning-long' : 'fluid-meaning';
  };

  const getFluidSentenceClass = (sentence: string) => {
    return sentence.length > 72 ? 'fluid-sentence-long' : 'fluid-sentence';
  };

  // Emphasize target word inside Layer 1 example sentence strictly in bold dark ink (no color or background pill)
  const renderHighlightedSentence = (sentence: string, target?: string) => {
    if (!target) return <>{sentence}</>;
    const idx = sentence.toLowerCase().indexOf(target.toLowerCase());
    if (idx === -1) return <>{sentence}</>;

    const before = sentence.slice(0, idx);
    const match = sentence.slice(idx, idx + target.length);
    const after = sentence.slice(idx + target.length);

    return (
      <>
        {before}
        <strong className="font-bold text-[var(--fg-primary)]">{match}</strong>
        {after}
      </>
    );
  };

  const isZenSessionActive = activeView === 'study' && isZenMode;

  const measureDesktopNav = useCallback(() => {
    const btn = desktopNavBtnRefs.current[latestActiveViewRef.current];
    if (!btn || btn.offsetWidth <= 0) return;
    const nextLeft = btn.offsetLeft;
    const nextWidth = btn.offsetWidth;
    setDesktopNavIndicator((prev) =>
      prev.left === nextLeft && prev.width === nextWidth
        ? prev
        : { left: nextLeft, width: nextWidth }
    );
  }, []);

  useLayoutEffect(() => {
    if (isZenSessionActive) {
      setDesktopNavCanAnimate(false);
      return;
    }
    measureDesktopNav();
  }, [activeView, isZenSessionActive, measureDesktopNav]);

  useEffect(() => {
    if (
      !isZenSessionActive &&
      desktopNavIndicator.width > 0 &&
      !desktopNavCanAnimate
    ) {
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setDesktopNavCanAnimate(true);
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }
  }, [isZenSessionActive, desktopNavIndicator.width, desktopNavCanAnimate]);

  useEffect(() => {
    if (isZenSessionActive) return;
    const handleResize = () => measureDesktopNav();
    window.addEventListener('resize', handleResize);
    window.addEventListener('themechange', handleResize);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && desktopNavRef.current) {
      ro = new ResizeObserver(() => measureDesktopNav());
      ro.observe(desktopNavRef.current);
    }
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => measureDesktopNav()).catch(() => {});
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('themechange', handleResize);
      ro?.disconnect();
    };
  }, [isZenSessionActive, measureDesktopNav]);

  // Reusable Anchored Theme Popover + Separate Light/Dark Mode Toggle
  const renderAppearanceControls = () => (
    <div ref={themePopoverRef} className="relative flex items-center gap-1.5">
      {/* 1. Theme Entity Selector Button (Opens Anchored Popover) */}
      <button
        ref={themeTriggerBtnRef}
        type="button"
        onClick={() => {
          updateThemePopoverPosition();
          setIsThemePopoverOpen((prev) => !prev);
        }}
        aria-expanded={isThemePopoverOpen}
        aria-haspopup="dialog"
        aria-label={`Select theme: ${activeThemeMeta.name}`}
        title={`Theme: ${activeThemeMeta.name} (Click to choose Linen Nordic, Hero UI, or Coss UI)`}
        className="min-h-[40px] sm:min-h-[38px] px-3 py-1.5 radius-control surface-1 border shadow-ring flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-95 transition-[background-color,color,border-color,box-shadow,transform] duration-150 theme-focus cursor-pointer"
      >
        <Palette className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-terracotta" />
        <span className="hidden sm:inline">{activeThemeMeta.shortName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 sm:w-3 sm:h-3 text-[var(--fg-muted)] transition-transform duration-150 ${
            isThemePopoverOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Anchored Theme Popover Window (Portaled to body & positioned cleanly below trigger) */}
      {isThemePopoverMounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={themePopoverPanelRef}
            role="dialog"
            aria-label="Choose visual theme"
            data-state={themePopoverState}
            style={
              themePopoverPos
                ? themePopoverPos.isMobile
                  ? {
                      top: `${themePopoverPos.top}px`,
                      maxHeight: `${themePopoverPos.maxHeight}px`,
                    }
                  : {
                      top: `${themePopoverPos.top}px`,
                      right: `${themePopoverPos.right}px`,
                      maxHeight: `${themePopoverPos.maxHeight}px`,
                    }
                : undefined
            }
            className={`fixed z-[70] p-3 surface-overlay border space-y-2.5 popover-panel overflow-y-auto overscroll-contain ${
              themePopoverPos?.isMobile ?? true
                ? 'left-3 right-3 mx-auto w-auto max-w-[380px]'
                : 'w-88'
            }`}
          >
          <div className="flex items-center justify-between gap-2 px-1 pb-1.5 border-b border-[var(--border-subtle)]">
            <div className="min-w-0">
              <div className="font-display text-xs font-bold text-[var(--fg-primary)]">
                Theme Entities
              </div>
              <div className="text-[11px] text-[var(--fg-muted)] truncate">
                Isolated palettes, shadows, radii &amp; type
              </div>
            </div>
            <SlidingPillSwitcher
              options={[
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
              ]}
              value={themePrefs.colorMode}
              onChange={setColorMode}
              ariaLabel="Color mode"
              size="sm"
              className="shrink-0"
            />
          </div>

          <div className="relative space-y-1.5">
            {themeOptionIndicator.height > 0 && (
              <div
                aria-hidden="true"
                className={`theme-option-indicator${
                  themeOptionCanAnimate ? '' : ' pill-indicator-no-transition'
                }`}
                style={{
                  height: `${themeOptionIndicator.height}px`,
                  transform: `translate3d(0, ${themeOptionIndicator.top}px, 0)`,
                }}
              />
            )}
            {THEME_ENTITIES.map((entity) => {
              const isSelected = themePrefs.themeId === entity.id;
              const swatch =
                themePrefs.colorMode === 'dark'
                  ? entity.darkPreview
                  : entity.lightPreview;

              return (
                <button
                  key={entity.id}
                  ref={(el) => {
                    themeOptionBtnRefs.current[entity.id] = el;
                  }}
                  type="button"
                  onClick={() => selectThemeEntity(entity.id)}
                  className={`relative z-10 w-full p-2.5 radius-control border text-left flex items-center gap-3 transition-[background-color,border-color,transform] duration-200 cursor-pointer theme-focus ${
                    isSelected
                      ? 'border-transparent'
                      : 'bg-transparent hover:bg-[var(--surface-2)]/70 border-[var(--border-subtle)]'
                  }`}
                >
                  {/* Miniature Card Swatch Preview with Theme's Own Radius & Shadow */}
                  <div
                    aria-hidden="true"
                    style={{
                      backgroundColor: swatch.canvas,
                      borderColor: swatch.border,
                      borderRadius: entity.previewRadius,
                    }}
                    className="w-14 h-11 p-1.5 border flex items-center justify-center shrink-0"
                  >
                    <div
                      style={{
                        backgroundColor: swatch.card,
                        borderColor: swatch.border,
                        borderRadius: entity.previewRadius,
                        boxShadow: swatch.shadow,
                      }}
                      className="w-full h-full border px-1.5 py-1 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          style={{ backgroundColor: swatch.ink }}
                          className="w-4 h-1 rounded-full opacity-80"
                        />
                        <span
                          style={{ backgroundColor: swatch.tertiary }}
                          className="w-1.5 h-1.5 rounded-full"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          style={{ backgroundColor: swatch.primary }}
                          className="h-1.5 flex-1 rounded-full"
                        />
                        <span
                          style={{ backgroundColor: swatch.secondary }}
                          className="h-1.5 w-2.5 rounded-full opacity-90"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Title, Tagline & Radius/Font Spec */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-display text-xs font-bold text-[var(--fg-primary)] truncate">
                        {entity.name}
                      </span>
                      <span className="font-sans tabular-nums text-[10px] text-[var(--fg-muted)] shrink-0">
                        {entity.radiusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--fg-secondary)] truncate mt-0.5">
                      {entity.tagline}
                    </p>
                  </div>

                  {/* Active Selection Checkmark */}
                  <div
                    className={`w-5 h-5 radius-pill flex items-center justify-center shrink-0 transition-[background-color,border-color,color,transform] duration-200 ${
                      isSelected
                        ? 'bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] scale-100'
                        : 'border border-[var(--border-strong)] text-transparent scale-90'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[var(--fg-primary)]">
                Milestone breaks
              </div>
              <div className="text-[11px] text-[var(--fg-muted)] truncate">
                Fox check-ins at 25%, 50%, 75%
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={milestoneInterludesEnabled}
              aria-label="Toggle milestone breaks"
              onClick={handleToggleMilestoneInterludes}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-150 cursor-pointer theme-focus ${
                milestoneInterludesEnabled
                  ? 'bg-[var(--intent-primary)] border-transparent'
                  : 'bg-[var(--surface-2)] border-[var(--border-strong)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                  milestoneInterludesEnabled
                    ? 'translate-x-5'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>,
          document.body
        )}
    </div>
  );

  const renderPageView = (viewToRender: ActiveView, isExiting = false) => (
    <>
        {/* ==================== VIEW 1: 3-LAYER FLASHCARD STUDIO ==================== */}
        {viewToRender === 'study' && (
          <div className="study-stage-shell flex-1 flex flex-col gap-3 sm:gap-3.5 md:gap-4">
            {/* Standard Studio Deck Strip OR Minimalist Zen HUD */}
            {!isZenSessionActive ? (
              <div className="flex items-center justify-between gap-2">
                <SlidingPillSwitcher
                  options={[
                    ...(customStudyQueue
                      ? [
                          {
                            id: customStudyQueue.id,
                            label: customStudyQueue.shortTitle,
                          },
                        ]
                      : []),
                    ...enrichedDecks.map((d) => ({
                      id: d.id,
                      label:
                        d.id === 'low-confidence' && d.total > 0
                          ? `${d.shortTitle} (${d.total})`
                          : d.shortTitle,
                    })),
                  ]}
                  value={customStudyQueue ? customStudyQueue.id : selectedDeckId}
                  onChange={(nextId) => {
                    if (customStudyQueue && nextId === customStudyQueue.id) {
                      return;
                    }
                    handleSelectStudyDeck(nextId as DeckId);
                  }}
                  ariaLabel="Select study deck"
                  variant="filled"
                  size="sm"
                  className="flex-1 min-w-0 pr-1"
                />

                {/* Distraction-Free Zen Focus Trigger */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsZenMode(true);
                    }}
                    title="Enter Distraction-Free Zen Session Mode [Z]"
                    aria-label="Enter Zen Focus Mode"
                    className="min-h-[40px] min-w-[40px] md:min-h-[44px] px-3 md:px-3.5 rounded-[var(--radius-pill)] text-xs md:text-[13px] font-semibold text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors theme-focus"
                  >
                    <Maximize2 className="w-4 h-4 text-[var(--accent-secondary)]" />
                    <span className="hidden sm:inline">Zen</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[var(--border-subtle)]">
                <Button
                  intent="secondary"
                  size="sm"
                  onClick={() => setIsZenMode(false)}
                  title="Exit Zen Focus Mode [Esc]"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Zen</span>
                </Button>

                <div className="text-xs font-medium text-[var(--fg-secondary)] truncate">
                  <span className="font-semibold text-[var(--fg-primary)]">
                    {activeDeckObj.shortTitle}
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span className="font-sans tabular-nums">
                    {sessionReviewedCount} reviewed
                  </span>
                </div>

                {renderAppearanceControls()}
              </div>
            )}

            {/* Row 2: Prev / Confidence Loop & Final Sweep Progress Bar / Next HUD */}
            {studyDeck.length > 0 && !isActiveDeckDone && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  disabled={!canGoPrev}
                  aria-label="Previous card"
                  title={canGoPrev ? 'Previous card (←)' : 'Start of session'}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    canGoPrev
                      ? 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer'
                      : 'text-[var(--fg-muted)] opacity-35 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>

                <div className="flex-1 space-y-1 md:space-y-1.5">
                  <div className="flex items-center justify-between text-xs md:text-[13px] font-sans tabular-nums gap-2">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--fg-primary)] truncate min-w-0">
                      {activeLoopState.phase === 'sweep' ? (
                        <MascotMomentVisual
                          poseId="cozy-student"
                          size="xs"
                          interactive
                          speechPlacement="right"
                        />
                      ) : activeLoopState.virtualClock === 0 ? (
                        <MascotMomentVisual
                          poseId={getDailyTimeOfDayMomentPose()}
                          size="xs"
                          interactive
                          speechPlacement="right"
                        />
                      ) : recentRatingEcho === '1' ||
                        recentRatingEcho === '2' ? (
                        <MascotMomentVisual
                          poseId="determined-focus"
                          size="xs"
                          interactive
                          speechPlacement="right"
                        />
                      ) : recentRatingEcho === '3' ? (
                        <MascotMomentVisual
                          poseId="cozy-nest"
                          size="xs"
                          interactive
                          speechPlacement="right"
                        />
                      ) : recentRatingEcho === '4' ||
                        recentRatingEcho === '5' ? (
                        <MascotMomentVisual
                          poseId="eureka-flag"
                          size="xs"
                          interactive
                          speechPlacement="right"
                        />
                      ) : (
                        <FoxMascot
                          pose="juggler"
                          size="xs"
                          interactive
                          speechPlacement="right"
                        />
                      )}
                      <span className="truncate">
                        {activeLoopState.currentSlotKind === 'interleave' ? (
                          <>
                            <span className="text-[var(--intent-primary)] font-semibold">
                              Auffrischung
                            </span>{' '}
                            <span className="text-[var(--fg-muted)] font-normal">
                              · {activeLoopState.clearedIds.length} /{' '}
                              {studyDeck.length} klar
                            </span>
                          </>
                        ) : activeLoopState.phase === 'sweep' ? (
                          <>
                            {activeLoopState.isReopenedRefresh
                              ? 'Auffrischung'
                              : 'Abschluss-Check'}{' '}
                            <span className="text-[var(--fg-muted)] font-normal">
                              · {activeLoopState.sweepPassedIds.length} /{' '}
                              {Math.max(
                                1,
                                activeLoopState.finalCheckTotal ||
                                  activeLoopState.sweepPassedIds.length +
                                    activeLoopState.sweepQueue.length
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            {activeLoopState.clearedIds.length}{' '}
                            <span className="text-[var(--fg-muted)] font-normal">
                              / {studyDeck.length} klar ·{' '}
                              {activeLoopState.activePool.length} aktiv
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                    <div className="flex items-center gap-1.5 text-[var(--fg-secondary)] shrink-0">
                      {recentRatingEcho ? (
                        <span
                          data-testid="rating-echo-hud"
                          role="status"
                          aria-live="polite"
                          className="inline-flex items-center gap-1.5 tracking-tight"
                        >
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                RATING_META[recentRatingEcho].colorVar,
                            }}
                          />
                          <span
                            className="font-semibold"
                            style={{
                              color: RATING_META[recentRatingEcho].colorVar,
                            }}
                          >
                            {RATING_META[recentRatingEcho].label}
                          </span>
                        </span>
                      ) : (
                        <>
                          <span>{formatConfidenceBadge(currentCardSrs)}</span>
                          {stats.streakDays > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-0.5 text-[var(--intent-warning)] font-semibold">
                                <Flame className="w-3 h-3 fill-current" />
                                <span>{stats.streakDays}d</span>
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <ProgressBar
                    value={activeDeckMasteryProgressPct}
                    intent={
                      activeLoopState.phase === 'sweep' ? 'success' : 'primary'
                    }
                    accentColor={
                      recentRatingEcho
                        ? RATING_META[recentRatingEcho].colorVar
                        : undefined
                    }
                    size="sm"
                    label="Deck mastery loop progress"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNextCard}
                  aria-disabled={!canGoNext}
                  aria-label={
                    canGoNext
                      ? 'Next card'
                      : 'Next card (rate confidence first)'
                  }
                  title={
                    canGoNext
                      ? 'Next card (→)'
                      : 'Rate confidence first to advance (→)'
                  }
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    canGoNext
                      ? 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                      : 'text-[var(--fg-muted)] opacity-40 hover:opacity-70'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            )}

            {/* Empty Low Confidence Queue, Deck Done Celebration, OR 25/50/75 Milestone Check-in */}
            {studyDeck.length === 0 ? (
              (() => {
                const emptyMoment = selectEmptyQueueMoment(
                  new Date().getHours()
                );
                return (
                  <Card.Root className="p-6 sm:p-10 text-center space-y-4 my-2 surface-paper">
                    <p className="text-xs font-medium tracking-wide text-[var(--fg-muted)]">
                      {emptyMoment.kicker}
                    </p>
                    <MascotMomentVisual
                      poseId={emptyMoment.poseId}
                      size="lg"
                      priority
                      interactive
                      speechPlacement="top"
                      className="mx-auto"
                    />
                    <div className="space-y-1.5">
                      <h2 className="font-display text-xl font-bold text-[var(--fg-primary)] text-balance">
                        {emptyMoment.headline}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--fg-secondary)] max-w-sm mx-auto">
                        {emptyMoment.subline}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <Button
                        intent="primary"
                        size="md"
                        onClick={() => handleSelectStudyDeck('all')}
                      >
                        Study All {cards.length} Cards
                      </Button>
                      {isZenSessionActive && (
                        <Button
                          intent="secondary"
                          size="md"
                          onClick={() => setIsZenMode(false)}
                        >
                          Exit Zen
                        </Button>
                      )}
                    </div>
                  </Card.Root>
                );
              })()
            ) : isActiveDeckDone ? (
              (() => {
                const summary = deckSessionRatingsRef.current[
                  activeSessionKey
                ] || { count: 0, sum: 0, lowCount: 0 };
                const avgRating =
                  summary.count > 0 ? summary.sum / summary.count : 4;
                const completionMoment = selectDeckCompletionMoment({
                  avgRating,
                  totalReviews: Math.max(
                    activeLoopState.virtualClock,
                    summary.count
                  ),
                  deckSize: studyDeck.length,
                  deckId: activeDeckObj.id,
                  deckTitle: activeDeckObj.shortTitle,
                  localHour: new Date().getHours(),
                });
                return (
                  <Card.Root className="milestone-interlude-enter p-6 sm:p-10 text-center space-y-4 my-2 surface-paper">
                    <p className="text-xs font-medium tracking-wide text-[var(--fg-muted)] tabular-nums">
                      <span>{completionMoment.kicker}</span>
                      <span aria-hidden="true" className="mx-1.5 opacity-55">
                        ·
                      </span>
                      <span>
                        {studyDeck.length} Karten ·{' '}
                        {activeLoopState.virtualClock} Bewertungen
                      </span>
                    </p>
                    <MascotMomentVisual
                      poseId={completionMoment.poseId}
                      size="hero"
                      priority
                      interactive
                      speechPlacement="top"
                      className="mx-auto"
                    />
                    <div className="space-y-1.5">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--fg-primary)] text-balance">
                        {completionMoment.headline}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--fg-secondary)] max-w-md mx-auto leading-relaxed">
                        {completionMoment.subline}
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        intent="primary"
                        size="md"
                        onClick={() => navigateToView('decks', 'forward')}
                        className="min-h-[44px]"
                      >
                        <Layers className="w-4 h-4" />
                        <span>{completionMoment.ctaLabel}</span>
                      </Button>
                      {isZenSessionActive && (
                        <Button
                          intent="tertiary"
                          size="md"
                          onClick={() => setIsZenMode(false)}
                          className="min-h-[44px]"
                        >
                          Exit Zen
                        </Button>
                      )}
                    </div>
                  </Card.Root>
                );
              })()
            ) : activeMilestone ? (
              <MilestoneInterludeCard
                moment={activeMilestone}
                clearedCount={Math.max(
                  activeLoopState.clearedIds.length,
                  activeLoopState.sweepPassedIds.length
                )}
                totalCount={studyDeck.length}
                onContinue={handleDismissMilestone}
              />
            ) : (
              currentCard && (
                <>
                  {/* ==================== 3D FLASHCARD STAGE (FLUID CLAMP(), TOUCH SWIPE & 40/60 SPLIT BACKSIDE) ==================== */}
                  <div className="relative w-full flex-1 flex flex-col">
                    {rateFirstHint && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="rate-first-toast pointer-events-none absolute bottom-11 left-1/2 z-40 px-3.5 py-2 rounded-[var(--radius-control)] surface-overlay border border-[var(--intent-warning-border)] text-xs font-medium shadow-overlay inline-flex items-center gap-2 whitespace-nowrap max-w-[calc(100%-24px)]"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, var(--intent-warning-soft) 0%, transparent 72%)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="w-2 h-2 rounded-full bg-[var(--intent-warning)] shrink-0"
                        />
                        <span className="font-semibold text-[var(--intent-warning)]">
                          Rate difficulty first
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-[var(--fg-muted)] opacity-45 hidden sm:inline"
                        >
                          ·
                        </span>
                        <span className="text-[var(--fg-secondary)] hidden sm:inline">
                          to continue
                        </span>
                      </div>
                    )}

                    <div
                      className={`perspective-stage relative w-full flex-1 flex flex-col card-deck-motion touch-none overscroll-contain ${
                        cardMotion !== 'idle' ? cardMotion : ''
                      }`}
                    >
                      <div
                        ref={!isExiting ? flipCardInnerDomRef : undefined}
                        role="button"
                        tabIndex={0}
                        aria-label={
                          isEnToDe
                            ? `Flashcard English meaning: ${getCardEnglishPrompt(currentCard)}. Tap to flip and reveal the German word.`
                            : `Flashcard ${currentCard.lemma}. Tap to flip, swipe left to go next after rating, swipe right to go back.`
                        }
                        onTouchStart={!isExiting ? handleCardTouchStart : undefined}
                        onTouchMove={!isExiting ? handleCardTouchMove : undefined}
                        onTouchEnd={!isExiting ? handleCardTouchEnd : undefined}
                        onTouchCancel={!isExiting ? handleCardTouchCancel : undefined}
                        onClick={() => {
                          if (cardTouchRef.current?.suppressClick) return;
                          handleFlipCard();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleFlipCard();
                          }
                        }}
                        className={`flip-card-inner cursor-pointer select-none rounded-[var(--radius-card)] theme-focus ${
                          isFlipped ? 'is-flipped' : ''
                        } ${suppressFlipTransition ? 'no-flip-transition' : ''}`}
                      >
                        {/* Live Edge Gesture Stamp (Ref-driven at 60/120fps without React re-renders) */}
                        {!isExiting && (
                          <div
                            ref={edgeStampDomRef}
                            aria-hidden="true"
                            style={{ opacity: 0, display: 'none' }}
                            className="absolute top-4 z-30 pointer-events-none px-3 py-1 rounded-[var(--radius-control)] text-xs font-semibold shadow-ring items-center gap-1.5"
                          >
                            <span
                              ref={edgeStampDotDomRef}
                              aria-hidden="true"
                              style={{ display: 'none' }}
                              className="w-1.5 h-1.5 rounded-full bg-[var(--intent-warning)] shrink-0"
                            />
                            <span ref={edgeStampTextDomRef} />
                          </div>
                        )}

                        {/* ==================== LAYER 0: CARD FRONT (GERMAN WORD OR ENGLISH PROMPT) ==================== */}
                        <div
                          className={`relative flip-card-face flip-card-front rounded-[var(--radius-card)] surface-paper border fluid-card-pad flex flex-col justify-between ${
                            exitingRating
                              ? `card-rated-wash-${exitingRating}`
                              : ''
                          }`}
                        >
                          {currentVisitRating && (
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
                              style={{
                                backgroundImage: `linear-gradient(90deg, transparent 6%, ${RATING_META[currentVisitRating].colorVar} 26%, ${RATING_META[currentVisitRating].colorVar} 74%, transparent 94%)`,
                              }}
                            />
                          )}
                          {/* Top Row: Harmonious Unboxed Previous Rating + Audio Button (DE->EN) or Subtle Direction Cue (EN->DE) */}
                          <div className="flex items-center justify-between gap-2 min-h-[44px]">
                            {currentVisitRating ? (
                              <span
                                data-testid="card-previous-rating"
                                className="inline-flex items-center gap-1.5 text-xs md:text-[13px] tracking-tight min-w-0"
                              >
                                <span
                                  aria-hidden="true"
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      RATING_META[currentVisitRating].colorVar,
                                  }}
                                />
                                <span className="text-[var(--fg-muted)] font-medium">
                                  Rated
                                </span>
                                <span
                                  aria-hidden="true"
                                  className="text-[var(--fg-muted)] opacity-45"
                                >
                                  ·
                                </span>
                                <span
                                  className="font-semibold truncate"
                                  style={{
                                    color:
                                      RATING_META[currentVisitRating].colorVar,
                                  }}
                                >
                                  {RATING_META[currentVisitRating].label}
                                </span>
                              </span>
                            ) : (
                              <span aria-hidden="true" />
                            )}
                            {isEnToDe ? (
                              <span className="font-sans text-[11.5px] font-semibold tracking-wide text-[var(--fg-muted)] select-none">
                                EN → DE
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) =>
                                  handlePlayAudio(
                                    currentCard.spokenText,
                                    'front-lemma',
                                    e
                                  )
                                }
                                aria-label="Play German pronunciation"
                                title="Listen [A]"
                                className={`w-11 h-11 -mr-1 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90 theme-focus ${
                                  speakingId === 'front-lemma'
                                    ? 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] scale-105'
                                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                }`}
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                        {/* Center: Pure German Word Prompt (DE->EN) or Pure English Meaning Prompt (EN->DE) */}
                        <div className="my-auto text-center py-3 sm:py-5 md:py-6 px-1 md:px-3">
                          {isEnToDe ? (
                            <h2
                              className={`font-display font-bold tracking-tight text-[var(--fg-primary)] break-words text-balance ${getFluidMeaningClass(
                                getCardEnglishPrompt(currentCard)
                              )}`}
                            >
                              {getCardEnglishPrompt(currentCard)}
                            </h2>
                          ) : (
                            <h2
                              className={`font-lemma font-semibold tracking-tight text-[var(--fg-primary)] break-words text-balance ${getFluidLemmaClass(
                                currentCard.lemma
                              )}`}
                            >
                              {renderFormattedLemma(currentCard)}
                            </h2>
                          )}
                        </div>

                        {/* Bottom Row: Subtle Flip Hint */}
                        <div className="pt-2.5 md:pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[13px] sm:text-xs md:text-[13px] text-[var(--fg-muted)]">
                          <span className="inline-flex items-center gap-1.5">
                            <RotateCw className="w-4 h-4 md:w-4 md:h-4 sm:w-3.5 sm:h-3.5" />
                            <span>Tap to flip</span>
                          </span>
                          <span className="font-sans text-xs sm:hidden">
                            {isEnToDe ? 'Swipe to navigate' : 'Swipe · Hold for audio'}
                          </span>
                          <span className="font-sans text-xs md:text-[13px] hidden sm:inline">
                            {isEnToDe ? '[Space] Flip' : '[Space] Flip · [D] Anatomie'}
                          </span>
                        </div>
                      </div>

                      {/* ==================== LAYER 1: CARD BACK (40/60 UPPER-LOWER SPLIT -> STAGE 2 EXPANDED FORMS & SENTENCE) ==================== */}
                      <div
                        onWheel={(e) => {
                          if (!isFlipped) return;
                          if (Math.abs(e.deltaY) <= 8) return;
                          e.stopPropagation();
                          const now = performance.now();
                          if (now < backWheelCooldownRef.current) return;

                          if (e.deltaY > 8) {
                            if (!isBackExpanded) {
                              backWheelCooldownRef.current = now + 260;
                              setIsBackExpanded(true);
                            }
                          } else if (e.deltaY < -8) {
                            backWheelCooldownRef.current = now + 300;
                            if (isBackExpanded) {
                              setIsBackExpanded(false);
                            } else {
                              setIsFlipped(false);
                            }
                          }
                        }}
                        className={`relative flip-card-face flip-card-back rounded-[var(--radius-card)] surface-paper border fluid-card-pad flex flex-col ${
                          exitingRating
                            ? `card-rated-wash-${exitingRating}`
                            : ''
                        }`}
                      >
                        {currentVisitRating && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
                            style={{
                              backgroundImage: `linear-gradient(90deg, transparent 6%, ${RATING_META[currentVisitRating].colorVar} 26%, ${RATING_META[currentVisitRating].colorVar} 74%, transparent 94%)`,
                            }}
                          />
                        )}
                        {(() => {
                          const threeForms = getBacksideThreeForms(currentCard);

                          return (
                            <div className="backside-stage-grid">
                              {/* ========== STAGE 1 LAYER: 40% UPPER GERMAN WORD / 60% LOWER ENGLISH MEANING + 3 FORMS ========== */}
                              <div
                                aria-hidden={isBackExpanded}
                                className={`backside-stage-layer ${
                                  isBackExpanded
                                    ? 'backside-stage-1-scrolled-up'
                                    : 'backside-stage-1-visible'
                                }`}
                              >
                                {/* UPPER ~40% ZONE: Top-Left Anatomie + Top-Right Speaker & Prominent Centered German Word */}
                                <div className="flex-[2] flex flex-col justify-between pb-3 border-b border-[var(--border-subtle)] min-h-0 min-w-0 max-w-full">
                                  <div className="flex items-center justify-between gap-2 shrink-0 min-w-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDetailCard(currentCard);
                                      }}
                                      className="min-h-[40px] md:min-h-[44px] -ml-1.5 inline-flex items-center px-2.5 py-1.5 rounded-[var(--radius-control)] text-[14px] md:text-[15px] font-semibold text-[var(--accent-secondary)] hover:opacity-80 active:scale-95 transition-all cursor-pointer theme-focus"
                                      title="Open Anatomie [D]"
                                    >
                                      <span>Anatomie</span>
                                    </button>

                                    {currentVisitRating && (
                                      <span className="inline-flex items-center gap-1.5 text-xs md:text-[13px] tracking-tight min-w-0">
                                        <span
                                          aria-hidden="true"
                                          className="w-1.5 h-1.5 rounded-full shrink-0"
                                          style={{
                                            backgroundColor:
                                              RATING_META[currentVisitRating]
                                                .colorVar,
                                          }}
                                        />
                                        <span className="text-[var(--fg-muted)] font-medium">
                                          Rated
                                        </span>
                                        <span
                                          aria-hidden="true"
                                          className="text-[var(--fg-muted)] opacity-45"
                                        >
                                          ·
                                        </span>
                                        <span
                                          className="font-semibold truncate"
                                          style={{
                                            color:
                                              RATING_META[currentVisitRating]
                                                .colorVar,
                                          }}
                                        >
                                          {
                                            RATING_META[currentVisitRating]
                                              .label
                                          }
                                        </span>
                                      </span>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handlePlayAudio(
                                          currentCard.spokenText,
                                          'back-lemma',
                                          e
                                        )
                                      }
                                      aria-label="Play word audio"
                                      title="Listen [A]"
                                      className={`w-11 h-11 -mr-1 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-90 theme-focus ${
                                        speakingId === 'back-lemma'
                                          ? 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] scale-105'
                                          : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                      }`}
                                    >
                                      <Volume2 className="w-5 h-5" />
                                    </button>
                                  </div>

                                  {/* Prominent Centered Anchor in Upper 40% (German in DE->EN, English Prompt in EN->DE) */}
                                  <div className="my-auto text-center py-2 px-1 min-w-0 max-w-full">
                                    {isEnToDe ? (
                                      <div
                                        className={`font-display font-semibold tracking-tight text-[var(--fg-secondary)] break-words text-balance ${getFluidMeaningClass(
                                          getCardEnglishPrompt(currentCard)
                                        )}`}
                                      >
                                        {getCardEnglishPrompt(currentCard)}
                                      </div>
                                    ) : (
                                      <div
                                        className={`font-lemma font-semibold tracking-tight text-[var(--fg-primary)] break-words text-balance ${getFluidBackLemmaClass(
                                          currentCard.lemma
                                        )}`}
                                      >
                                        {renderFormattedLemma(currentCard)}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* LOWER ~60% ZONE: Prominent Centered Reveal Hero + Subordinate 3-Forms Whisper Strip */}
                                <div className="flex-[3] flex flex-col justify-between pt-3 md:pt-4 min-h-0 min-w-0 max-w-full">
                                  {/* Center of Lower 60%: English Meaning Hero (DE->EN) or Revealed German Lemma Hero (EN->DE) */}
                                  <div className="my-auto text-center py-2 sm:py-3 md:py-4 px-1 md:px-3 min-w-0 max-w-full">
                                    {isEnToDe ? (
                                      <p
                                        className={`font-lemma font-semibold tracking-tight text-[var(--fg-primary)] break-words text-balance ${getFluidBackLemmaClass(
                                          currentCard.lemma
                                        )}`}
                                      >
                                        {renderFormattedLemma(currentCard)}
                                      </p>
                                    ) : (
                                      <p
                                        className={`font-display font-bold tracking-tight text-[var(--fg-primary)] break-words text-balance ${getFluidMeaningClass(
                                          currentCard.translation
                                        )}`}
                                      >
                                        {currentCard.translation}
                                      </p>
                                    )}
                                  </div>

                                  {/* Bottom Whisper Strip: Subordinate Smaller 3 Forms + Clean Static ChevronUp */}
                                  <div
                                    role="button"
                                    tabIndex={isBackExpanded ? -1 : 0}
                                    aria-label="Expand forms and example sentence"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsBackExpanded(true);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsBackExpanded(true);
                                      }
                                    }}
                                    className="pt-2 md:pt-3 border-t border-[var(--border-subtle)] px-1 md:px-2 pb-0.5 md:pb-1 min-w-0 max-w-full rounded-b-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                  >
                                    {/* Minimal Static Pull-Up Indicator */}
                                    <div className="flex items-center justify-center text-[var(--fg-muted)] group-hover:text-[var(--accent-secondary)] transition-colors mb-1 md:mb-1.5">
                                      <ChevronUp className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                    </div>

                                    {/* Small 3-Forms Whisper Preview */}
                                    {threeForms.length > 0 && (
                                      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-1.5 md:gap-4 text-center min-w-0 max-w-full">
                                        {threeForms.map((f) => (
                                          <div key={f.label} className="min-w-0 overflow-hidden">
                                            <div className="text-[10.5px] md:text-xs font-sans font-medium text-[var(--fg-muted)] opacity-85 truncate">
                                              {f.label}
                                            </div>
                                            <div className="text-xs md:text-sm font-medium text-[var(--fg-secondary)] truncate">
                                              {f.shortValue}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* ========== STAGE 2 LAYER: SCROLLED-UP BIG 3 FORMS (MULTI-COLUMN STACK) & SENTENCE ========== */}
                              <div
                                aria-hidden={!isBackExpanded}
                                className={`backside-stage-layer ${
                                  isBackExpanded
                                    ? 'backside-stage-2-scrolled-up'
                                    : 'backside-stage-2-hidden-below'
                                }`}
                              >
                                {/* Compact Docked German + English Meaning Header */}
                                <div
                                  role="button"
                                  tabIndex={isBackExpanded ? 0 : -1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsBackExpanded(false);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setIsBackExpanded(false);
                                    }
                                  }}
                                  className="flex items-center justify-between gap-2 pb-2.5 md:pb-3.5 border-b border-[var(--border-subtle)] cursor-pointer group min-w-0 max-w-full"
                                  title="Scroll down or tap to return to 40/60 German-English split"
                                >
                                  <div className="min-w-0 flex items-baseline gap-2 md:gap-2.5 flex-wrap">
                                    {isEnToDe ? (
                                      <>
                                        <span className="font-display text-sm sm:text-base md:text-lg font-bold text-[var(--accent-secondary)] truncate max-w-full">
                                          {getCardEnglishPrompt(currentCard)}
                                        </span>
                                        <span className="text-[var(--fg-muted)] text-xs md:text-sm">
                                          —
                                        </span>
                                        <span className="font-lemma text-sm sm:text-base md:text-lg font-semibold text-[var(--fg-primary)] break-words">
                                          {renderFormattedLemma(currentCard)}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="font-lemma text-sm sm:text-base md:text-lg font-semibold text-[var(--fg-primary)] break-words">
                                          {renderFormattedLemma(currentCard)}
                                        </span>
                                        <span className="text-[var(--fg-muted)] text-xs md:text-sm">
                                          —
                                        </span>
                                        <span className="font-display text-sm sm:text-base md:text-lg font-bold text-[var(--accent-secondary)] truncate max-w-full">
                                          {currentCard.translation}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  <span className="w-9 h-9 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center text-xs font-medium text-[var(--fg-muted)] group-hover:text-[var(--fg-primary)] group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.06] shrink-0">
                                    <ChevronDown className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                  </span>
                                </div>

                                {/* Big 3 Forms (Staggered Spring Rise + Responsive Multi-Column Stacking) */}
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="my-auto py-3 md:py-5 space-y-3 md:space-y-5 cursor-default min-w-0 max-w-full"
                                >
                                  {threeForms.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-[repeat(3,minmax(0,1fr))] gap-2 sm:gap-3 md:gap-5 pb-3 md:pb-4 border-b border-[var(--border-subtle)] min-w-0 max-w-full">
                                      {threeForms.map((f, idx) => (
                                        <div
                                          key={f.label}
                                          style={{
                                            transitionDelay: isBackExpanded
                                              ? `${idx * 45}ms`
                                              : '0ms',
                                          }}
                                          className="scroll-up-item flex items-baseline justify-between sm:flex-col sm:items-start sm:justify-start gap-2 sm:gap-0.5 md:gap-1 min-w-0"
                                        >
                                          <span className="text-xs md:text-[13px] font-sans font-medium text-[var(--fg-muted)] shrink-0">
                                            {f.label}
                                          </span>
                                          <span className="font-lemma fluid-form-value font-semibold tracking-tight text-right sm:text-left break-words">
                                            {f.richValue}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Big Example Sentence (Fluid clamp() Sizing + Staggered Rise) */}
                                  <div
                                    style={{
                                      transitionDelay: isBackExpanded
                                        ? '135ms'
                                        : '0ms',
                                    }}
                                    className="scroll-up-item flex items-start justify-between gap-2.5 md:gap-4"
                                  >
                                    <div className="space-y-1 md:space-y-1.5 min-w-0">
                                      <p
                                        className={`font-sans font-normal text-[var(--fg-secondary)] text-pretty ${getFluidSentenceClass(
                                          currentCard.exampleDe
                                        )}`}
                                      >
                                        {renderHighlightedSentence(
                                          currentCard.exampleDe,
                                          currentCard.highlightTarget
                                        )}
                                      </p>
                                      <p className="font-sans text-xs sm:text-[13px] md:text-[15px] text-[var(--fg-muted)] leading-snug text-pretty">
                                        {currentCard.exampleEn}
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handlePlayAudio(
                                          currentCard.exampleDe,
                                          'back-sentence',
                                          e
                                        )
                                      }
                                      aria-label="Listen to example sentence"
                                      title="Play sentence"
                                      className={`w-11 h-11 -mr-1 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-90 theme-focus ${
                                        speakingId === 'back-sentence'
                                          ? 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]'
                                          : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                      }`}
                                    >
                                      <Volume2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Back Footer: Flip / Collapse / Anatomie */}
                                <div className="pt-2.5 md:pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3.5 md:gap-5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFlipCard();
                                      }}
                                      className="min-h-[40px] md:min-h-[44px] inline-flex items-center gap-1.5 text-[13px] md:text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
                                    >
                                      <RotateCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                      <span>Flip</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsBackExpanded(false);
                                      }}
                                      className="min-h-[40px] md:min-h-[44px] inline-flex items-center gap-1.5 text-[13px] md:text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                      <span>{isEnToDe ? 'German' : 'Meaning'}</span>
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDetailCard(currentCard);
                                    }}
                                    className="min-h-[40px] md:min-h-[44px] inline-flex items-center gap-1 py-1.5 px-2.5 -mr-1 rounded-[var(--radius-control)] text-[14px] md:text-[15px] font-semibold text-[var(--accent-secondary)] hover:opacity-80 transition-all active:scale-95 cursor-pointer theme-focus"
                                  >
                                    <span>Anatomie</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                  {/* ==================== TWO-STAGE BOTTOM ACTION DOCK: "REVEAL ANSWER" (FRONT) -> 4 RATING BUTTONS (BACK) ==================== */}
                  {!isFlipped ? (
                    <button
                      type="button"
                      onClick={handleFlipCard}
                      aria-label="Reveal flashcard answer"
                      style={
                        recentRatingEcho
                          ? {
                              borderColor:
                                RATING_META[recentRatingEcho].borderVar,
                              backgroundImage: `linear-gradient(135deg, ${RATING_META[recentRatingEcho].softVar} 0%, transparent 68%)`,
                            }
                          : undefined
                      }
                      className="min-h-[48px] md:min-h-[52px] w-full py-2.5 md:py-2.5 px-4 md:px-5 rounded-[var(--radius-control)] surface-paper border border-[var(--border-strong)] hover:border-[var(--intent-primary-border)] hover:bg-[var(--intent-primary-soft)] active:scale-[0.98] transition-all duration-300 grid grid-cols-[1fr_auto_1fr] items-center gap-2 cursor-pointer theme-focus"
                    >
                      <span aria-hidden="true" />
                      <span className="inline-flex items-center justify-center gap-2">
                        <RotateCw className="w-4 h-4 md:w-[18px] md:h-[18px] text-[var(--intent-primary)]" />
                        <span className="text-[15px] md:text-base font-bold text-[var(--fg-primary)] leading-tight">
                          Reveal Answer
                        </span>
                      </span>
                      <span className="justify-self-end min-w-0">
                        {recentRatingEcho && (
                          <span
                            data-testid="rating-echo-dock"
                            className="hidden min-[360px]:inline-flex items-center gap-1.5 text-xs tracking-tight"
                          >
                            <span
                              aria-hidden="true"
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  RATING_META[recentRatingEcho].colorVar,
                              }}
                            />
                            <span
                              className="font-semibold truncate"
                              style={{
                                color: RATING_META[recentRatingEcho].colorVar,
                              }}
                            >
                              {RATING_META[recentRatingEcho].label}
                            </span>
                          </span>
                        )}
                      </span>
                    </button>
                  ) : (
                    <div
                      role="group"
                      aria-label="Rate flashcard confidence (1 to 5)"
                      className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-2.5"
                    >
                      {(
                        [
                          {
                            key: '1' as const,
                            hoverClass:
                              'hover:border-[var(--conf-1-border)] hover:bg-[var(--conf-1-soft)]',
                          },
                          {
                            key: '2' as const,
                            hoverClass:
                              'hover:border-[var(--conf-2-border)] hover:bg-[var(--conf-2-soft)]',
                          },
                          {
                            key: '3' as const,
                            hoverClass:
                              'hover:border-[var(--conf-3-border)] hover:bg-[var(--conf-3-soft)]',
                          },
                          {
                            key: '4' as const,
                            hoverClass:
                              'hover:border-[var(--conf-4-border)] hover:bg-[var(--conf-4-soft)]',
                          },
                          {
                            key: '5' as const,
                            hoverClass:
                              'hover:border-[var(--conf-5-border)] hover:bg-[var(--conf-5-soft)]',
                          },
                        ] as const
                      ).map(({ key, hoverClass }) => {
                        const meta = RATING_META[key];
                        const isSelected = currentVisitRating === key;
                        const isFlashing = flashingRating === key;
                        const isEmphasized = isSelected || isFlashing;
                        const isDimmedSibling =
                          (Boolean(flashingRating) ||
                            Boolean(currentVisitRating)) &&
                          !isEmphasized;
                        return (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${meta.shortcutKey} ${meta.shortLabel}`}
                            onClick={() => handleRateCard(key)}
                            style={
                              isEmphasized
                                ? {
                                    backgroundColor: meta.solidBgVar,
                                    borderColor: meta.solidBgVar,
                                    color: meta.solidFgVar,
                                    boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.16), 0 4px 12px -2px ${meta.borderVar}`,
                                    ...(isFlashing
                                      ? { transitionDuration: '75ms' }
                                      : {}),
                                  }
                                : undefined
                            }
                            className={`relative min-h-[52px] md:min-h-[56px] py-2 px-1 sm:px-2 md:px-3 rounded-[var(--radius-control)] surface-paper border active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer theme-focus min-w-0 ${
                              isEmphasized ? '' : hoverClass
                            } ${isFlashing ? 'scale-[0.96]' : ''} ${
                              isDimmedSibling
                                ? 'opacity-55 hover:opacity-100'
                                : ''
                            }`}
                          >
                            <span
                              style={
                                isEmphasized
                                  ? { color: meta.solidFgVar }
                                  : undefined
                              }
                              className={`text-sm sm:text-base md:text-lg font-display font-bold leading-none tabular-nums ${
                                isEmphasized ? '' : meta.textClass
                              }`}
                            >
                              {meta.shortcutKey}
                            </span>
                            <span
                              style={
                                isEmphasized
                                  ? { color: meta.solidFgVar }
                                  : undefined
                              }
                              className={`text-[10px] sm:text-xs font-semibold leading-tight truncate max-w-full ${
                                isEmphasized
                                  ? 'opacity-90'
                                  : 'text-[var(--fg-secondary)]'
                              }`}
                            >
                              {meta.shortLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )
            )}
          </div>
        )}

        {/* ==================== VIEW 2: ALL DECKS MOBILE-FIRST VIEW ==================== */}
        {viewToRender === 'decks' && (
          <DecksPageView
            allCards={cards}
            srsMap={srsMap}
            enrichedDecks={enrichedUnifiedDecks}
            folders={folders}
            customDecks={customDecks}
            deckOverrides={deckOverrides}
            onUpdateFolders={handleUpdateFolders}
            onUpdateCustomDecks={handleUpdateCustomDecks}
            onUpdateDeckOverrides={handleUpdateDeckOverrides}
            onStartDeckStudy={(deckId, customCardsOverride) =>
              launchDeckStudy(deckId, false, customCardsOverride)
            }
            onOpenNewCardModal={() => setIsAddModalOpen(true)}
            onSelectCardDetail={(card) => setDetailCard(card)}
            onPlayAudio={handlePlayAudio}
            speakingId={speakingId}
            onResetDeckSrs={handleResetDeckSrs}
            onSubScreenChange={
              isExiting ? undefined : (isNested) => setIsDecksSubScreenOpen(isNested)
            }
            controlledSubScreen={decksSubScreen}
            onControlledSubScreenChange={setDecksSubScreen}
            onOpenSheetChange={setIsDecksOverlayOpen}
            dismissTopSheetRef={closeDecksTopSheetRef}
          />
        )}

        {/* ==================== VIEW 3: PERSONAL OVERVIEW & ACHIEVEMENTS DASHBOARD ==================== */}
        {viewToRender === 'dashboard' && (
          <div className="space-y-6">
            <section
              aria-label="Study statistics"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              <Card.Root className="p-4 space-y-2 surface-paper">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--fg-secondary)]">
                    Mastered
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[var(--intent-success)]" />
                </div>
                <div className="font-display text-2xl font-bold tabular-nums">
                  {summaryMetrics.masteredCount}
                  <span className="text-xs font-sans font-normal text-[var(--fg-muted)]">
                    /{summaryMetrics.totalCards}
                  </span>
                </div>
              </Card.Root>

              <Card.Root className="p-4 space-y-2 surface-paper">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--fg-secondary)]">
                    Fokus
                  </span>
                  <Clock className="w-4 h-4 text-[var(--accent-terracotta)]" />
                </div>
                <div className="font-display text-2xl font-bold tabular-nums">
                  {summaryMetrics.lowConfidenceCount}
                </div>
              </Card.Root>

              <Card.Root className="p-4 space-y-2 surface-paper">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--fg-secondary)]">
                    Daily Streak
                  </span>
                  <Flame className="w-4 h-4 text-[var(--intent-warning)]" />
                </div>
                <div className="font-display text-2xl font-bold tabular-nums">
                  {stats.streakDays}d
                </div>
              </Card.Root>

              <Card.Root className="p-4 space-y-2 surface-paper">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--fg-secondary)]">
                    Vertrauen
                  </span>
                  <Target className="w-4 h-4 text-[var(--accent-secondary)]" />
                </div>
                <div className="font-display text-2xl font-bold tabular-nums">
                  {summaryMetrics.avgConfidencePct}%
                  <span className="ml-1.5 text-xs font-sans font-normal text-[var(--fg-muted)]">
                    Ø {summaryMetrics.avgConfidenceScore}/5
                  </span>
                </div>
              </Card.Root>
            </section>

            {/* Recall Ease Heatmap across Grammar Archetypes & CEFR Levels */}
            <Suspense
              fallback={
                <div className="h-64 rounded-[var(--radius-card)] surface-paper border animate-pulse" />
              }
            >
              <RecallEaseHeatmap
                cards={cards}
                srsMap={srsMap}
                themeId={themePrefs.themeId}
                colorMode={themePrefs.colorMode}
                onSelectArchetypeDeck={(category) =>
                  launchDeckStudy(category, false)
                }
              />
            </Suspense>

            {/* Learning Velocity Chart */}
            <Card.Root className="p-5 space-y-4 surface-paper">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FoxMascot
                    pose="runner"
                    size="sm"
                    interactive
                    speechPlacement="right"
                  />
                  <div>
                    <h2 className="font-display text-sm font-bold text-[var(--fg-primary)]">
                      Learning Velocity
                    </h2>
                    <p className="text-xs text-[var(--fg-secondary)]">
                      Cumulative German cards mastered over the last 7 days
                    </p>
                  </div>
                </div>

                <div className="text-right font-sans tabular-nums">
                  <div className="text-sm font-bold text-[var(--accent-secondary)]">
                    {summaryMetrics.masteredCount} mastered
                  </div>
                  <div className="text-[11px] text-[var(--fg-muted)]">
                    7-day trend
                  </div>
                </div>
              </div>

              <Suspense
                fallback={
                  <div className="h-56 w-full pt-2 rounded-[var(--radius-control)] surface-2 animate-pulse" />
                }
              >
                <LearningVelocityChart
                  velocityData={velocityData}
                  isAnimationActive={!isExiting}
                />
              </Suspense>
            </Card.Root>

            {/* Personal Milestones */}
            <Card.Root className="p-5 space-y-4 surface-paper">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <MascotMomentVisual
                    poseId="triumph-ecstatic"
                    size="sm"
                    interactive
                    showSparkles
                    speechPlacement="right"
                  />
                  <div>
                    <h2 className="font-display text-sm font-bold text-[var(--fg-primary)]">
                      Personal Milestones
                    </h2>
                    <p className="text-xs text-[var(--fg-secondary)]">
                      Private German mastery &amp; consistency milestones
                    </p>
                  </div>
                </div>

                <div className="font-sans text-xs font-bold tabular-nums text-[var(--intent-warning)]">
                  {unlockedAchievementsCount} / {achievements.length} unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {achievements.map((ach) => {
                  const IconComponent = ach.icon;
                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        ach.unlocked
                          ? 'bg-[var(--intent-warning-soft)] border-[var(--intent-warning-border)]'
                          : 'surface-2 border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ach.accentClass}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display text-xs font-bold text-[var(--fg-primary)] truncate">
                              {ach.title}
                            </h3>
                            <p className="text-[11px] text-[var(--fg-secondary)] line-clamp-2 mt-0.5">
                              {ach.subtitle}
                            </p>
                          </div>
                        </div>

                        {ach.unlocked ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--intent-warning)] shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[var(--fg-muted)] shrink-0" />
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-sans tabular-nums">
                          <span className="text-[var(--fg-secondary)]">
                            {ach.current} / {ach.target} {ach.unit}
                          </span>
                          <span
                            className={
                              ach.unlocked
                                ? 'font-bold text-[var(--intent-warning)]'
                                : 'font-semibold text-[var(--fg-primary)]'
                            }
                          >
                            {ach.progressPct}%
                          </span>
                        </div>
                        <ProgressBar
                          value={ach.progressPct}
                          intent={ach.intent}
                          size="sm"
                          label={ach.title}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Root>

            {/* Interactive Flashcard Fox Mascot Gallery (3 Visually Curated Mood Categories) */}
            <Card.Root className="p-5 space-y-4 surface-paper">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold text-[var(--fg-primary)]">
                    Der Flashcard-Fuchs · Dein Lernbegleiter
                  </h2>
                  <p className="text-xs text-[var(--fg-secondary)] mt-0.5">
                    Tippe auf eine Pose für Animation &amp; Spruch — geordnet nach Lern-Stimmung
                  </p>
                </div>
                <SlidingPillSwitcher
                  options={[
                    { id: 'focus', label: 'Lernen & Fokus' },
                    { id: 'celebrate', label: 'Erfolge & Aha!' },
                    { id: 'cozy', label: 'Gemütlich & Nacht' },
                  ]}
                  value={mascotGalleryCategory}
                  onChange={setMascotGalleryCategory}
                  ariaLabel="Fuchs-Stimmung wählen"
                  size="sm"
                />
              </div>

              {(() => {
                type GalleryEntry =
                  | {
                      kind: 'core';
                      pose: 'welcome' | 'juggler' | 'aha' | 'studio' | 'runner' | 'champion';
                      situation: string;
                    }
                  | {
                      kind: 'moment';
                      poseId: MascotMomentPoseId;
                      situation: string;
                    };

                const CATEGORY_ENTRIES: Record<
                  'focus' | 'celebrate' | 'cozy',
                  ReadonlyArray<GalleryEntry>
                > = {
                  focus: [
                    {
                      kind: 'moment',
                      poseId: 'study-peak',
                      situation: 'Mittags-Check · HI! DE',
                    },
                    {
                      kind: 'core',
                      pose: 'welcome',
                      situation: 'Deck-Start & Begrüßung',
                    },
                    {
                      kind: 'moment',
                      poseId: 'haus-card',
                      situation: 'Nomen & Artikel sitzen',
                    },
                    {
                      kind: 'core',
                      pose: 'studio',
                      situation: 'Wort-Anatomie & Regeln',
                    },
                    {
                      kind: 'moment',
                      poseId: 'determined-focus',
                      situation: 'Fokus-Loop & knifflige Karten',
                    },
                    {
                      kind: 'core',
                      pose: 'juggler',
                      situation: 'Aktiv im Karten-Loop',
                    },
                  ],
                  celebrate: [
                    {
                      kind: 'core',
                      pose: 'aha',
                      situation: 'Ach-so!-Moment & Logo',
                    },
                    {
                      kind: 'moment',
                      poseId: 'eureka-flag',
                      situation: '75 %-Endspurt · Durchbruch',
                    },
                    {
                      kind: 'core',
                      pose: 'runner',
                      situation: 'Tages-Serie & Lerntempo',
                    },
                    {
                      kind: 'moment',
                      poseId: 'triumph-ecstatic',
                      situation: '100 % Deck-Meister',
                    },
                    {
                      kind: 'core',
                      pose: 'champion',
                      situation: 'Meilenstein & Konfetti',
                    },
                    {
                      kind: 'moment',
                      poseId: 'relieved-satisfied',
                      situation: 'Geschafft & entspannt',
                    },
                  ],
                  cozy: [
                    {
                      kind: 'moment',
                      poseId: 'coffee-cards',
                      situation: 'Morgen-Kaffee & erste Karten',
                    },
                    {
                      kind: 'moment',
                      poseId: 'cozy-nest',
                      situation: 'Schal & Karteikasten',
                    },
                    {
                      kind: 'moment',
                      poseId: 'cozy-student',
                      situation: 'Herbst-Flow & Halbzeit',
                    },
                    {
                      kind: 'moment',
                      poseId: 'midnight-oil',
                      situation: 'Spätabends unter der Decke',
                    },
                    {
                      kind: 'moment',
                      poseId: 'study-sleepy',
                      situation: 'Feierabend · Träum auf Deutsch',
                    },
                  ],
                };

                const activeEntries = CATEGORY_ENTRIES[mascotGalleryCategory];
                const gridColsClass =
                  activeEntries.length === 5
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';

                return (
                  <div className={`grid ${gridColsClass} gap-3`}>
                    {activeEntries.map((entry) => {
                      if (entry.kind === 'core') {
                        const meta = FOX_POSE_CATALOG[entry.pose];
                        return (
                          <div
                            key={`core-${entry.pose}`}
                            className="p-3 rounded-2xl surface-2 border flex flex-col items-center text-center gap-2"
                          >
                            <FoxMascot
                              pose={entry.pose}
                              size="md"
                              interactive
                              speechPlacement="top"
                            />
                            <div className="space-y-0.5 min-w-0 w-full">
                              <div className="font-display text-xs font-bold text-[var(--fg-primary)] truncate">
                                {meta.germanTitle}
                              </div>
                              <div className="text-[11px] text-[var(--fg-secondary)] leading-tight">
                                {entry.situation}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      const asset = MASCOT_MOMENT_CATALOG[entry.poseId];
                      return (
                        <div
                          key={`moment-${entry.poseId}`}
                          className="p-3 rounded-2xl surface-2 border flex flex-col items-center text-center gap-2"
                        >
                          <MascotMomentVisual
                            poseId={entry.poseId}
                            size="md"
                            interactive
                            speechPlacement="top"
                          />
                          <div className="space-y-0.5 min-w-0 w-full">
                            <div className="font-display text-xs font-bold text-[var(--fg-primary)] truncate">
                              {asset.germanTitle}
                            </div>
                            <div className="text-[11px] text-[var(--fg-secondary)] leading-tight">
                              {entry.situation}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Dynamic 6-Chapter Daily App Icon Schedule & Live Browser Tab Preview */}
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="font-display text-xs font-bold text-[var(--fg-primary)]">
                      Tages-App-Icon · 6-Stufen-Uhr
                    </h3>
                    <p className="text-[11px] text-[var(--fg-secondary)]">
                      {isAppIconManualPreview
                        ? 'Fest gewählt · wird beim Verlassen der App auf dein Android-Homescreen-Icon übernommen'
                        : 'Wechselt automatisch mit deiner lokalen Uhrzeit (05 / 09 / 13 / 17 / 21 / 00 Uhr) · tippe ein Kapitel zum Fixieren'}
                    </p>
                  </div>
                  {isAppIconManualPreview && (
                    <button
                      type="button"
                      onClick={handleResetAppIconAuto}
                      className="text-xs font-sans font-semibold text-[var(--intent-primary)] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Zurück auf Auto-Uhr
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {APP_ICON_CHAPTERS.map((chapter) => {
                    const isActive = chapter.slot === activeAppIconSlot;
                    return (
                      <button
                        key={chapter.slot}
                        type="button"
                        onClick={() => handleSelectAppIconPreview(chapter.slot)}
                        aria-pressed={isActive}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-colors cursor-pointer theme-focus ${
                          isActive
                            ? 'bg-[var(--intent-primary-soft)]/55 border-[var(--intent-primary-border)]'
                            : 'surface-2 border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <img
                          src={chapter.icon192}
                          alt={chapter.title}
                          width={36}
                          height={36}
                          loading="lazy"
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-black/10 dark:border-white/10"
                        />
                        <div className="min-w-0">
                          <div className="font-display text-[11px] font-bold text-[var(--fg-primary)] truncate">
                            {chapter.shortLabel}
                          </div>
                          <div className="font-sans text-[10px] text-[var(--fg-muted)] tabular-nums truncate">
                            {chapter.scheduleLabel}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card.Root>

            {/* Smart Offline Fox Study Reminders (Android Notifications & Controls) */}
            <AndroidExperienceCard
              reminderPrefs={reminderPrefs}
              onUpdateReminderPrefs={handleUpdateReminderPrefs}
              streakDays={stats.streakDays}
              reviewedToday={stats.totalReviewsToday}
            />

            {/* One-Tap GitHub Release Updater (Android APK Download & In-Place Install) */}
            <AppUpdateCard />
          </div>
        )}

        {/* ==================== VIEW 4: VOCABULARY ARCHIVE (ALL 6 ARCHETYPES) ==================== */}
        {viewToRender === 'archive' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <SlidingPillSwitcher
                options={[
                  { id: 'all', label: `All (${cards.length})` },
                  { id: 'verb', label: 'Verben' },
                  { id: 'noun', label: 'Nomen' },
                  { id: 'adj', label: 'Adjektive' },
                  { id: 'preposition', label: 'Präpositionen' },
                  { id: 'conn', label: 'Konnektoren' },
                  { id: 'phrase', label: 'Wendungen' },
                ]}
                value={archiveCategoryFilter}
                onChange={setArchiveCategoryFilter}
                ariaLabel="Filter vocabulary by archetype"
                size="sm"
              />

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={archiveSearchQuery}
                  onChange={(e) => setArchiveSearchQuery(e.target.value)}
                  placeholder="Search German or English..."
                  className="w-full sm:w-60 pl-8 pr-3 py-2 rounded-[var(--radius-control)] border surface-1 text-xs text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)] [box-shadow:var(--shadow-ring)] theme-focus"
                />
              </div>
            </div>

            {archiveCards.length === 0 ? (
              <Card.Root className="p-8 text-center space-y-3 surface-paper">
                <MascotMomentVisual
                  poseId="haus-card"
                  size="lg"
                  interactive
                  speechPlacement="top"
                  className="mx-auto"
                />
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-[var(--fg-primary)]">
                    Keine passenden Wörter im Archiv
                  </h3>
                  <p className="text-xs text-[var(--fg-secondary)]">
                    Der Wortschatz-Fuchs hat für „{archiveSearchQuery}“ noch keinen Treffer gefunden.
                  </p>
                </div>
              </Card.Root>
            ) : (
            <Card.Root className="divide-y divide-[var(--border-subtle)] overflow-hidden surface-paper">
              {visibleArchiveCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setDetailCard(card)}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[var(--surface-2)]/60 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-lemma font-semibold text-base text-[var(--fg-primary)]">
                          {renderFormattedLemma(card)}
                        </span>
                        <span className="font-sans text-[11px] font-bold text-[var(--accent-secondary)]">
                          {card.cefr}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--fg-secondary)] truncate">
                        {card.translation}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        intent="secondary"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailCard(card);
                        }}
                        aria-label={`Open Anatomie for ${card.lemma}`}
                        title="Anatomie [D]"
                      >
                        <Info className="w-4 h-4" />
                      </Button>

                      <Button
                        intent={
                          speakingId === card.id ? 'primary' : 'secondary'
                        }
                        size="icon"
                        onClick={(e) =>
                          handlePlayAudio(card.spokenText, card.id, e)
                        }
                        aria-label={`Play pronunciation for ${card.lemma}`}
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>

                      <Button
                        intent="secondary"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          userChangedDeckRef.current = true;
                          setCustomStudyQueue(null);
                          setSelectedDeckId('all');
                          const allDeck = enrichedDecks.find((d) => d.id === 'all');
                          const deckCards = allDeck?.cards || cards;
                          const orderedIds = [
                            card.id,
                            ...deckCards
                              .map((c) => c.id)
                              .filter((id) => id !== card.id),
                          ];
                          const focusedLoop = createInitialDeckLoopState(
                            'all',
                            orderedIds,
                            {
                              ...srsMap,
                              [card.id]: createDefaultSrsState(card.id),
                            },
                            CONFIDENCE_LOOP_CONFIG
                          );
                          setLoopStatesByDeck((prev) => ({
                            ...prev,
                            all: focusedLoop,
                          }));
                          const idx = deckCards.findIndex((c) => c.id === card.id);
                          setCurrentIndex(idx >= 0 ? idx : 0);
                          setIsFlipped(false);
                          setIsBackExpanded(false);
                          navigateToView('study', 'forward');
                        }}
                        aria-label={`Study ${card.lemma} in Flashcard Studio`}
                        title="Practice flashcard"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              {archiveVisibleCount < archiveCards.length && (
                <div
                  ref={archiveSentinelRef}
                  className="p-3.5 flex items-center justify-center"
                >
                  <Button
                    intent="secondary"
                    size="sm"
                    onClick={() =>
                      setArchiveVisibleCount((prev) =>
                        Math.min(archiveCards.length, prev + 60)
                      )
                    }
                  >
                    Mehr Wörter laden ({archiveVisibleCount} /{' '}
                    {archiveCards.length})
                  </Button>
                </div>
              )}
            </Card.Root>
            )}
          </div>
        )}
    </>
  );

  return (
    <div className="app-viewport-shell flex flex-col bg-[var(--bg-canvas)] text-[var(--fg-primary)] transition-colors duration-200">
      {/* ==================== TOP APP BAR (3-Zone Contract, Hidden in Zen Mode) ==================== */}
      {!isZenSessionActive && (
        <header className="sticky top-0 z-30 pt-[var(--safe-area-inset-top,env(safe-area-inset-top,0px))] bg-[var(--surface-1)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto h-14 flex items-center justify-between gap-3 sm:gap-6 px-3.5 sm:px-6">
            {/* Zone 1: Interactive Flashcard Fox Mascot Emblem + Animated Wordmark */}
            <div className="relative flex items-center shrink-0">
              <button
                type="button"
                onClick={handleBrandClick}
                aria-label="Achsoo — Flashcard Fox Mascot · Click to animate & open Decks"
                title="Achsoo! Click to animate the Flashcard Fox & open Decks"
                className={`brand-lockup group cursor-pointer theme-focus ${
                  isBrandClicking ? 'is-clicking' : ''
                }`}
              >
                {/* Interactive Flashcard Fox Mascot Avatar */}
                <span className="brand-icon-stage" aria-hidden="true">
                  {isBrandClicking && (
                    <span
                      key={`ring-${brandClickSeq}`}
                      className="brand-click-ring"
                    />
                  )}
                  <img
                    src={activeBrandSlide.src}
                    alt=""
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="brand-fox-avatar"
                  />
                </span>

                {/* Animated Wordmark with Nordic Triad Accents & 3-Segment Ribbon */}
                <span className="brand-wordmark-wrap">
                  <span className="brand-wordmark-text text-base sm:text-[1.15rem] whitespace-nowrap">
                    <span className="brand-letter brand-letter-stem brand-letter-a">
                      A
                    </span>
                    <span className="brand-letter brand-letter-stem brand-letter-c">
                      c
                    </span>
                    <span className="brand-letter brand-letter-stem brand-letter-h">
                      h
                    </span>
                    <span className="brand-letter brand-letter-s">s</span>
                    <span className="brand-letter brand-letter-o1">o</span>
                    <span className="brand-letter brand-letter-o2">o</span>
                  </span>
                  {/* Subtle Nordic Triad Underline Ribbon (Sage Green · Fjord Blue · Terracotta Coral) */}
                  <span className="brand-triad-bar" aria-hidden="true">
                    <span
                      className="brand-triad-seg"
                      style={{
                        width: brandTriadPose === 0 ? '44%' : '28%',
                        backgroundColor: 'var(--brand-sage)',
                      }}
                    />
                    <span
                      className="brand-triad-seg"
                      style={{
                        width: brandTriadPose === 2 ? '44%' : '28%',
                        backgroundColor: 'var(--brand-fjord)',
                      }}
                    />
                    <span
                      className="brand-triad-seg"
                      style={{
                        width: brandTriadPose === 1 ? '44%' : '28%',
                        backgroundColor: 'var(--brand-coral)',
                      }}
                    />
                  </span>
                </span>
              </button>

              {/* Playful Click Micro-Interaction Pop-Up ("Ach so! · Aha!") */}
              {showBrandAhaBadge && (
                <span
                  key={`aha-${brandClickSeq}`}
                  aria-live="polite"
                  className="brand-aha-pill inline-flex absolute left-full inset-y-0 my-auto h-fit ml-2.5 sm:ml-3.5 z-30 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium surface-paper backdrop-blur-md border border-[var(--border-strong)] shadow-sm pointer-events-none whitespace-nowrap max-w-[calc(100vw-230px)] sm:max-w-none truncate"
                >
                  <span className="font-display font-bold text-[var(--intent-primary)]">
                    {activeBrandExpression.de}
                  </span>
                  <span className="text-[var(--fg-muted)]" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-[var(--fg-secondary)] truncate">
                    {activeBrandExpression.en}
                  </span>
                </span>
              )}
            </div>

            {/* Zone 2: Clean Single-Line Navigation Links with Sliding Active Underline */}
            <nav
              ref={desktopNavRef}
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-6 text-sm font-medium relative"
            >
              {desktopNavIndicator.width > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--intent-primary)] pointer-events-none ${
                    desktopNavCanAnimate
                      ? 'transition-[transform,width] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
                      : 'pill-indicator-no-transition'
                  }`}
                  style={{
                    width: `${desktopNavIndicator.width}px`,
                    transform: `translate3d(${desktopNavIndicator.left}px, 0, 0)`,
                  }}
                />
              )}
              {(
                [
                  { id: 'study', label: 'Study' },
                  { id: 'decks', label: 'Decks' },
                  { id: 'dashboard', label: 'Overview' },
                  { id: 'archive', label: 'Vocab' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    desktopNavBtnRefs.current[item.id] = el;
                  }}
                  type="button"
                  onClick={() => navigateToView(item.id)}
                  className={`py-1.5 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer theme-focus ${
                    activeView === item.id
                      ? 'text-[var(--fg-primary)] font-semibold'
                      : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Zone 3: PWA Install Action + Anchored Theme Popover + Light/Dark Mode Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <PWAInstallButton />
              {renderAppearanceControls()}
            </div>
          </div>
        </header>
      )}

      {/* ==================== MAIN CONTENT VIEWPORT WITH DIRECTIONAL PAGE TRANSITIONS ==================== */}
      <main
        onTouchStart={handleMainTouchStart}
        onTouchMove={handleMainTouchMove}
        onTouchEnd={handleMainTouchEnd}
        className={`flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 overflow-x-clip flex flex-col ${
          isZenSessionActive
            ? 'py-3 sm:py-8 justify-center min-h-[100dvh]'
            : activeView === 'study'
            ? 'study-main-shell'
            : 'pt-2.5 pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:py-8'
        }`}
      >
        <div
          className={`page-transition-stage ${
            activeView === 'study' ? 'flex-1 flex flex-col' : ''
          }`}
        >
          {exitingView && (
            <div
              key={`exit-${exitingView}-${viewTransitionKey}`}
              aria-hidden="true"
              className={`page-exit-layer ${
                pageDirection === 'forward'
                  ? 'page-exit-forward'
                  : 'page-exit-backward'
              }`}
            >
              {renderPageView(exitingView, true)}
            </div>
          )}
          <div
            key={`enter-${activeView}-${viewTransitionKey}`}
            className={`${
              activeView === 'study' ? 'flex-1 flex flex-col' : ''
            } ${
              viewTransitionKey > 0
                ? pageDirection === 'forward'
                  ? 'page-enter-forward'
                  : 'page-enter-backward'
                : ''
            }`.trim()}
          >
            {renderPageView(activeView, false)}
          </div>
        </div>
      </main>

      {/* ==================== MOBILE FIXED BOTTOM TAB BAR (Hidden during Zen Session Mode) ==================== */}
      {!isZenSessionActive && (
        <nav
          aria-label="Mobile Navigation"
          className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--surface-1)] border-t border-[var(--border-subtle)]"
        >
          <div className="relative h-[64px] grid grid-cols-4 items-center px-2">
            {/* Smooth sliding top indicator pill across the 4 tabs */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-2 right-2"
            >
              <div
                className="w-1/4 flex justify-center transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                style={{
                  transform: `translate3d(${VIEW_ORDER[activeView] * 100}%, 0, 0)`,
                }}
              >
                <span className="w-9 h-[2.5px] rounded-b-full bg-[var(--intent-primary)]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateToView('study')}
              className={`flex flex-col items-center justify-center h-full gap-1 transition-colors duration-200 cursor-pointer ${
                activeView === 'study'
                  ? 'text-[var(--intent-primary)]'
                  : 'text-[var(--fg-muted)]'
              }`}
            >
              <Sparkles className="w-[22px] h-[22px]" />
              <span className="text-xs font-semibold tracking-tight">
                Study
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('decks')}
              className={`flex flex-col items-center justify-center h-full gap-1 transition-colors duration-200 cursor-pointer ${
                activeView === 'decks'
                  ? 'text-[var(--intent-primary)]'
                  : 'text-[var(--fg-muted)]'
              }`}
            >
              <Layers className="w-[22px] h-[22px]" />
              <span className="text-xs font-semibold tracking-tight">
                Decks
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('dashboard')}
              className={`flex flex-col items-center justify-center h-full gap-1 transition-colors duration-200 cursor-pointer ${
                activeView === 'dashboard'
                  ? 'text-[var(--intent-primary)]'
                  : 'text-[var(--fg-muted)]'
              }`}
            >
              <LayoutDashboard className="w-[22px] h-[22px]" />
              <span className="text-xs font-semibold tracking-tight">
                Overview
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('archive')}
              className={`flex flex-col items-center justify-center h-full gap-1 transition-colors duration-200 cursor-pointer ${
                activeView === 'archive'
                  ? 'text-[var(--intent-primary)]'
                  : 'text-[var(--fg-muted)]'
              }`}
            >
              <BookOpen className="w-[22px] h-[22px]" />
              <span className="text-xs font-semibold tracking-tight">
                Vocab
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* ==================== LAYER 2: ANATOMIE DRAWER (Opens with [D], Cycles with [T], Closes with [Esc]) ==================== */}
      {detailCard && (
        <Suspense fallback={null}>
          <AnatomyDrawer
            card={detailCard}
            onClose={() => setDetailCard(null)}
            onPlayAudio={handlePlayAudio}
            speakingId={speakingId}
          />
        </Suspense>
      )}

      {/* ==================== MODAL: ADD CUSTOM VOCABULARY CARD (ALL 6 ARCHETYPES) ==================== */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-card-title"
          onClick={() => setIsAddModalOpen(false)}
          style={{ opacity: Math.max(0.1, 1 - addModalDragY / 280) }}
          className="fixed inset-0 z-[60] h-[100dvh] w-screen flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
        >
          <div
            ref={addModalScrollRef}
            onClick={(e) => e.stopPropagation()}
            style={addModalSheetStyle}
            onTouchStart={addModalSheetTouchHandlers.onTouchStart}
            onTouchMove={addModalSheetTouchHandlers.onTouchMove}
            onTouchEnd={addModalSheetTouchHandlers.onTouchEnd}
            onTouchCancel={addModalSheetTouchHandlers.onTouchCancel}
            className="w-full max-w-lg rounded-t-3xl sm:rounded-[var(--radius-card)] surface-overlay border p-6 pt-3.5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pt-6 sm:pb-6 space-y-4 max-h-[90dvh] overflow-y-auto anatomy-sheet-enter"
          >
            <div
              data-sheet-handle="true"
              className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto sm:hidden"
            />
            <div
              data-sheet-handle="true"
              className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]"
            >
              <h2
                id="add-card-title"
                className="font-display text-base font-bold text-[var(--fg-primary)]"
              >
                New Custom Flashcard
              </h2>
              <Button
                intent="tertiary"
                size="icon"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form
              onSubmit={handleCreateCustomCard}
              className="space-y-3.5 text-sm"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--fg-secondary)] mb-1">
                    Word Type (Archetype)
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as CardCategory)
                    }
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs font-medium text-[var(--fg-primary)]"
                  >
                    <option value="noun">Nomen (der/die/das)</option>
                    <option value="verb">Verb (Stammformen)</option>
                    <option value="adj">Adjektiv (Steigerung)</option>
                    <option value="preposition">Präposition (Kasus)</option>
                    <option value="conn">Konnektor (Satzbau)</option>
                    <option value="phrase">Wendung / Redemittel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--fg-secondary)] mb-1">
                    CEFR Level
                  </label>
                  <select
                    value={newCefr}
                    onChange={(e) => setNewCefr(e.target.value as CefrLevel)}
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs font-medium text-[var(--fg-primary)]"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--fg-secondary)] mb-1">
                    German Word / Phrase *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLemma}
                    onChange={(e) => setNewLemma(e.target.value)}
                    placeholder="e.g. die Erfahrung / ankommen"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--fg-secondary)] mb-1">
                    English Meaning *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    placeholder="e.g. experience / to arrive"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                </div>
              </div>

              {newCategory === 'noun' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--fg-secondary)] mb-1">
                      Article
                    </label>
                    <select
                      value={newGender}
                      onChange={(e) =>
                        setNewGender(e.target.value as NounGender)
                      }
                      className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                    >
                      <option value="der">der (Blue)</option>
                      <option value="die">die (Red)</option>
                      <option value="das">das (Green)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--fg-secondary)] mb-1">
                      Plural
                    </label>
                    <input
                      type="text"
                      value={newPlural}
                      onChange={(e) => setNewPlural(e.target.value)}
                      placeholder="die Erfahrungen"
                      className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                    />
                  </div>
                </div>
              )}

              {newCategory === 'verb' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newPraesens}
                    onChange={(e) => setNewPraesens(e.target.value)}
                    placeholder="Präsens (er/sie/es …)"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                  <input
                    type="text"
                    value={newPraeteritum}
                    onChange={(e) => setNewPraeteritum(e.target.value)}
                    placeholder="Präteritum (z.B. kam an)"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                  <input
                    type="text"
                    value={newPerfekt}
                    onChange={(e) => setNewPerfekt(e.target.value)}
                    placeholder="Perfekt (z.B. ist angekommen)"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                  <select
                    value={newAux}
                    onChange={(e) =>
                      setNewAux(e.target.value as 'haben' | 'sein')
                    }
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  >
                    <option value="haben">Aux: haben</option>
                    <option value="sein">Aux: sein</option>
                  </select>
                </div>
              )}

              {newCategory === 'adj' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newAdjKomp}
                    onChange={(e) => setNewAdjKomp(e.target.value)}
                    placeholder="Komparativ (z.B. schneller)"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                  <input
                    type="text"
                    value={newAdjSup}
                    onChange={(e) => setNewAdjSup(e.target.value)}
                    placeholder="Superlativ (z.B. am schnellsten)"
                    className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                  />
                </div>
              )}

              {newCategory === 'preposition' && (
                <input
                  type="text"
                  value={newPrepCase}
                  onChange={(e) => setNewPrepCase(e.target.value)}
                  placeholder="Governed case (e.g. Dativ / Genitiv)"
                  className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                />
              )}

              {newCategory === 'conn' && (
                <input
                  type="text"
                  value={newConnRule}
                  onChange={(e) => setNewConnRule(e.target.value)}
                  placeholder="Word order rule (e.g. Nebensatz · Verb am Ende)"
                  className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                />
              )}

              {newCategory === 'phrase' && (
                <input
                  type="text"
                  value={newPhraseFrame}
                  onChange={(e) => setNewPhraseFrame(e.target.value)}
                  placeholder="Sentence frame (e.g. Es kommt darauf an, ob …)"
                  className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
                />
              )}

              <input
                type="text"
                value={newExampleDe}
                onChange={(e) => setNewExampleDe(e.target.value)}
                placeholder="German example sentence"
                className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
              />

              <input
                type="text"
                value={newExampleEn}
                onChange={(e) => setNewExampleEn(e.target.value)}
                placeholder="English translation of example"
                className="w-full px-3 py-2 rounded-xl border surface-2 text-xs text-[var(--fg-primary)]"
              />

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  intent="tertiary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button intent="primary" size="md" type="submit">
                  Save Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
