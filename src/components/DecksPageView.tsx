import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Folder,
  FolderInput,
  FolderPlus,
  Layers,
  MoreHorizontal,
  Play,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import {
  CardCategory,
  CardSrsState,
  CefrLevel,
  VocabCard,
  formatNounLemma,
} from '../data/vocabData';
import {
  ASSIGNABLE_ICONS,
  CustomDeckRecord,
  DECK_TINT_SWATCHES,
  DeckFolder,
  DeckMetaOverride,
  DeckSortOption,
  DeckTintId,
  ICON_GROUP_ORDER,
  getTintConfig,
  loadDeckSortOption,
  loadLastPickerChoice,
  resolveIconComponent,
  saveDeckSortOption,
  saveLastPickerChoice,
  suggestIconFromKeywords,
} from '../utils/decksManager';
import { useSheetSwipeDismiss } from '../hooks/useMobileGestures';
import {
  createDefaultSrsState,
  formatIntervalBadge,
  isCardDueToday,
  triggerHapticFeedback,
} from '../utils/srsEngine';
import { SlidingPillSwitcher } from './SlidingPillSwitcher';

export interface EnrichedUnifiedDeck {
  id: string;
  isSystemSmart: boolean;
  isCustom: boolean;
  title: string;
  shortTitle: string;
  subtitle: string;
  categoryGroup: 'smart' | 'grammar' | 'level' | 'custom';
  archetypeFilter?: CardCategory;
  cefrFilter?: CefrLevel;
  levelTag: string;
  defaultTextTile?: string;
  useTextTile: boolean;
  iconId: string;
  tint: DeckTintId;
  folderId: string | null;
  createdAt: number;
  lastStudiedAt: number;
  cards: VocabCard[];
  total: number;
  mastered: number;
  learning: number;
  due: number;
  masteredPct: number;
  learningPct: number;
  progressPct: number;
}

export type DeckSubScreen =
  | { type: 'root' }
  | { type: 'folder'; folderId: string }
  | { type: 'deck-detail'; deckId: string; returnFolderId?: string | null };

interface DecksPageViewProps {
  allCards: VocabCard[];
  srsMap: Record<string, CardSrsState>;
  enrichedDecks: EnrichedUnifiedDeck[];
  folders: DeckFolder[];
  customDecks: CustomDeckRecord[];
  deckOverrides: Record<string, DeckMetaOverride>;
  onUpdateFolders: (next: DeckFolder[]) => void;
  onUpdateCustomDecks: (next: CustomDeckRecord[]) => void;
  onUpdateDeckOverrides: (next: Record<string, DeckMetaOverride>) => void;
  onStartDeckStudy: (deckId: string, customCardsOverride?: VocabCard[]) => void;
  onOpenNewCardModal: () => void;
  onSelectCardDetail: (card: VocabCard) => void;
  onPlayAudio: (text?: string, idTag?: string, e?: React.MouseEvent) => void;
  speakingId: string | null;
  onResetDeckSrs: (cardIds: string[], deckId?: string) => void;
  onSubScreenChange?: (isNested: boolean) => void;
  controlledSubScreen?: DeckSubScreen;
  onControlledSubScreenChange?: (next: DeckSubScreen) => void;
  onOpenSheetChange?: (hasOpenOverlay: boolean) => void;
  dismissTopSheetRef?: React.MutableRefObject<(() => boolean) | null>;
}

type RootChipTab = 'all' | 'folders' | 'smart';

export const DecksPageView: React.FC<DecksPageViewProps> = ({
  allCards,
  srsMap,
  enrichedDecks,
  folders,
  customDecks,
  deckOverrides,
  onUpdateFolders,
  onUpdateCustomDecks,
  onUpdateDeckOverrides,
  onStartDeckStudy,
  onOpenNewCardModal,
  onSelectCardDetail,
  onPlayAudio,
  speakingId,
  onResetDeckSrs,
  onSubScreenChange,
  controlledSubScreen,
  onControlledSubScreenChange,
  onOpenSheetChange,
  dismissTopSheetRef,
}) => {
  // Sub-screen navigation stack (Root <-> Folder View <-> Deck Card List) with 220ms push/pop
  const [internalSubScreen, setInternalSubScreen] = useState<DeckSubScreen>({
    type: 'root',
  });
  const subScreen = controlledSubScreen ?? internalSubScreen;
  const setSubScreen = useCallback(
    (next: DeckSubScreen) => {
      if (onControlledSubScreenChange) {
        onControlledSubScreenChange(next);
      } else {
        setInternalSubScreen(next);
      }
    },
    [onControlledSubScreenChange]
  );
  const [subScreenNavDir, setSubScreenNavDir] = useState<'push' | 'pop'>('push');
  const [subScreenDragX, setSubScreenDragX] = useState(0);
  const [isSubScreenSwiping, setIsSubScreenSwiping] = useState(false);
  const subScreenTouchRef = useRef<{
    x: number;
    y: number;
    time: number;
    axis: 'none' | 'horizontal' | 'vertical';
  } | null>(null);
  const [subScreenKey, setSubScreenKey] = useState<number>(0);

  // Top Header controls
  const [activeChip, setActiveChip] = useState<RootChipTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<DeckSortOption>(() =>
    loadDeckSortOption()
  );
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [isSortMenuMounted, setIsSortMenuMounted] = useState<boolean>(false);
  const [sortMenuState, setSortMenuState] = useState<'open' | 'closed'>('closed');
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState<boolean>(false);
  const [isNewMenuMounted, setIsNewMenuMounted] = useState<boolean>(false);
  const [newMenuState, setNewMenuState] = useState<'open' | 'closed'>('closed');
  const newMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isNewMenuOpen) {
      setIsNewMenuMounted(true);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => setNewMenuState('open'));
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }
    setNewMenuState('closed');
    if (!isNewMenuMounted) return;
    const t = window.setTimeout(() => setIsNewMenuMounted(false), 220);
    return () => window.clearTimeout(t);
  }, [isNewMenuOpen, isNewMenuMounted]);

  useEffect(() => {
    if (isSortMenuOpen) {
      setIsSortMenuMounted(true);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => setSortMenuState('open'));
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }
    setSortMenuState('closed');
    if (!isSortMenuMounted) return;
    const t = window.setTimeout(() => setIsSortMenuMounted(false), 220);
    return () => window.clearTimeout(t);
  }, [isSortMenuOpen, isSortMenuMounted]);

  // Filter Sheet state ("CEFR Levels" and "6 Archetypes")
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [filterCefr, setFilterCefr] = useState<CefrLevel | 'ALL'>('ALL');
  const [filterArchetype, setFilterArchetype] = useState<CardCategory | 'ALL'>(
    'ALL'
  );

  // Overflow "⋯" Action Sheet for a Deck or Folder
  const [actionDeckId, setActionDeckId] = useState<string | null>(null);
  const [actionFolderId, setActionFolderId] = useState<string | null>(null);

  // Move to Folder Sheet
  const [moveTargetDeckId, setMoveTargetDeckId] = useState<string | null>(null);

  // Delete Folder Dialog
  const [deleteFolderTarget, setDeleteFolderTarget] =
    useState<DeckFolder | null>(null);

  // Assign Existing Loose Decks to Current Folder Sheet
  const [assignToFolderId, setAssignToFolderId] = useState<string | null>(null);

  // Drag-and-Drop state (Desktop)
  const [draggedDeckId, setDraggedDeckId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Long-press ref for touch devices
  const longPressTimerRef = useRef<number | null>(null);

  // Deck / Folder Create & Edit Sheet state (with 30-icon + 6-tint picker)
  const [editorState, setEditorState] = useState<{
    mode: 'create-deck' | 'edit-deck' | 'create-folder' | 'edit-folder';
    targetId?: string;
    initialFolderId?: string | null;
    autoMoveDeckIdAfterFolderCreate?: string | null;
  } | null>(null);

  const [editorName, setEditorName] = useState<string>('');
  const [editorSubtitle, setEditorSubtitle] = useState<string>('');
  const [editorIcon, setEditorIcon] = useState<string>('BookOpen');
  const [editorUseTextTile, setEditorUseTextTile] = useState<boolean>(false);
  const [editorTint, setEditorTint] = useState<DeckTintId>('sage');
  const [editorFolderId, setEditorFolderId] = useState<string | null>(null);
  const [editorSelectedCardIds, setEditorSelectedCardIds] = useState<string[]>(
    []
  );
  const [editorIconSearch, setEditorIconSearch] = useState<string>('');
  const [editorCardSearch, setEditorCardSearch] = useState<string>('');
  const [hasManualIconPick, setHasManualIconPick] = useState<boolean>(false);

  // Close "+ New" and "Sort" menus when clicking outside or pressing Escape
  useEffect(() => {
    if (!isNewMenuOpen && !isSortMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        isNewMenuOpen &&
        newMenuRef.current &&
        !newMenuRef.current.contains(e.target as Node)
      ) {
        setIsNewMenuOpen(false);
      }
      if (
        isSortMenuOpen &&
        sortMenuRef.current &&
        !sortMenuRef.current.contains(e.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNewMenuOpen(false);
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isNewMenuOpen, isSortMenuOpen]);

  const handleSelectSortOption = (next: DeckSortOption) => {
    triggerHapticFeedback(6);
    setSortOption(next);
    saveDeckSortOption(next);
    setIsSortMenuOpen(false);
  };

  // Navigate between sub-screens with 220ms push/pop transition
  const navigateSubScreen = useCallback(
    (next: DeckSubScreen, direction: 'push' | 'pop') => {
      triggerHapticFeedback(8);
      setSubScreenDragX(0);
      setIsSubScreenSwiping(false);
      setSubScreenNavDir(direction);
      setSubScreen(next);
      setSubScreenKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [setSubScreen]
  );

  useEffect(() => {
    onSubScreenChange?.(subScreen.type !== 'root');
  }, [subScreen.type, onSubScreenChange]);

  const handlePopSubScreen = useCallback(() => {
    if (subScreen.type === 'deck-detail') {
      navigateSubScreen(
        subScreen.returnFolderId
          ? { type: 'folder', folderId: subScreen.returnFolderId }
          : { type: 'root' },
        'pop'
      );
    } else if (subScreen.type === 'folder') {
      navigateSubScreen({ type: 'root' }, 'pop');
    }
  }, [subScreen, navigateSubScreen]);

  const handleSubScreenTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (subScreen.type === 'root' || e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;
      const touch = e.touches[0];
      subScreenTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
        axis: 'none',
      };
    },
    [subScreen.type]
  );

  const handleSubScreenTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const st = subScreenTouchRef.current;
      if (!st || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - st.x;
      const dy = e.touches[0].clientY - st.y;

      if (st.axis === 'none') {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        if (dx <= 0 || Math.abs(dy) > Math.abs(dx) * 0.85) {
          st.axis = 'vertical';
          return;
        }
        st.axis = 'horizontal';
        setIsSubScreenSwiping(true);
      }

      if (st.axis === 'horizontal') {
        setSubScreenDragX(Math.max(0, Math.min(dx * 0.85, 240)));
      }
    },
    []
  );

  const handleSubScreenTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const st = subScreenTouchRef.current;
      subScreenTouchRef.current = null;
      if (!st || st.axis !== 'horizontal') {
        setIsSubScreenSwiping(false);
        setSubScreenDragX(0);
        return;
      }

      const dx = (e.changedTouches[0]?.clientX ?? st.x) - st.x;
      const dy = (e.changedTouches[0]?.clientY ?? st.y) - st.y;
      const elapsed = Math.max(16, performance.now() - st.time);
      const velocity = dx / elapsed;

      setIsSubScreenSwiping(false);

      if (
        (dx >= 68 || (dx >= 42 && velocity >= 0.45)) &&
        dx > Math.abs(dy) * 1.4
      ) {
        setSubScreenDragX(0);
        handlePopSubScreen();
      } else {
        setSubScreenDragX(0);
      }
    },
    [handlePopSubScreen]
  );

  const handleSubScreenTouchCancel = useCallback(() => {
    subScreenTouchRef.current = null;
    setIsSubScreenSwiping(false);
    setSubScreenDragX(0);
  }, []);

  // System Smart Decks (Daily Due Queue & Complete Core Wortschatz)
  const dueQueueDeck = useMemo(
    () => enrichedDecks.find((d) => d.id === 'due') || enrichedDecks[0],
    [enrichedDecks]
  );

  const smartDecks = useMemo(
    () => enrichedDecks.filter((d) => d.isSystemSmart),
    [enrichedDecks]
  );

  // Non-system user/curated decks (9 built-in archetype/level decks + custom decks)
  const userDecks = useMemo(
    () => enrichedDecks.filter((d) => !d.isSystemSmart),
    [enrichedDecks]
  );

  // Alphanumeric comparator ("01, 02... A -> Z")
  const compareDecksAlphanumeric = useCallback(
    (a: EnrichedUnifiedDeck, b: EnrichedUnifiedDeck) =>
      a.title.localeCompare(b.title, 'de', {
        numeric: true,
        sensitivity: 'base',
      }),
    []
  );

  // Active deck comparator based on Sort dropdown ('last-studied' | 'due' | 'name')
  const compareDecksBySort = useCallback(
    (a: EnrichedUnifiedDeck, b: EnrichedUnifiedDeck) => {
      if (sortOption === 'last-studied') {
        return (
          b.lastStudiedAt - a.lastStudiedAt ||
          b.due - a.due ||
          compareDecksAlphanumeric(a, b)
        );
      }
      if (sortOption === 'due') {
        return b.due - a.due || compareDecksAlphanumeric(a, b);
      }
      return compareDecksAlphanumeric(a, b);
    },
    [sortOption, compareDecksAlphanumeric]
  );

  // Filtered user decks matching search, CEFR filter, and Archetype filter
  const matchesSearchAndFilters = useCallback(
    (deck: EnrichedUnifiedDeck): boolean => {
      if (filterCefr !== 'ALL') {
        const hasCefr =
          deck.cefrFilter === filterCefr ||
          deck.levelTag === filterCefr ||
          deck.cards.some((c) => c.cefr === filterCefr);
        if (!hasCefr) return false;
      }
      if (filterArchetype !== 'ALL') {
        const hasArch =
          deck.archetypeFilter === filterArchetype ||
          deck.cards.some((c) => c.category === filterArchetype);
        if (!hasArch) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          deck.title.toLowerCase().includes(q) ||
          deck.subtitle.toLowerCase().includes(q) ||
          deck.levelTag.toLowerCase().includes(q)
        );
      }
      return true;
    },
    [filterCefr, filterArchetype, searchQuery]
  );

  // Folders with computed child deck stats (sorted by active Sort option, default newest -> oldest)
  const enrichedFolders = useMemo(() => {
    return folders
      .map((folder) => {
        const childDecks = userDecks
          .filter((d) => d.folderId === folder.id)
          .sort(compareDecksBySort);

        let totalCards = 0;
        let totalMastered = 0;
        let totalLearning = 0;
        let totalDue = 0;
        let lastStudiedAt = 0;
        const levelCounts: Record<string, number> = { A1: 0, A2: 0, B1: 0 };

        for (const d of childDecks) {
          totalCards += d.total;
          totalMastered += d.mastered;
          totalLearning += d.learning;
          totalDue += d.due;
          if (d.lastStudiedAt > lastStudiedAt) {
            lastStudiedAt = d.lastStudiedAt;
          }
          for (const c of d.cards) {
            levelCounts[c.cefr] = (levelCounts[c.cefr] || 0) + 1;
          }
        }

        const masteredPct =
          totalCards > 0 ? (totalMastered / totalCards) * 100 : 0;
        const learningPct =
          totalCards > 0 ? (totalLearning / totalCards) * 100 : 0;
        const progressPct =
          totalCards > 0
            ? Math.min(
                100,
                Math.round(((totalMastered + totalLearning) / totalCards) * 100)
              )
            : 0;

        let dominantLevel = 'A1–B1';
        const topEntry = Object.entries(levelCounts).sort(
          (a, b) => b[1] - a[1]
        )[0];
        if (topEntry && topEntry[1] > 0) {
          dominantLevel = topEntry[0];
        }

        return {
          ...folder,
          childDecks,
          deckCount: childDecks.length,
          totalCards,
          totalMastered,
          totalLearning,
          totalDue,
          lastStudiedAt,
          masteredPct,
          learningPct,
          progressPct,
          dominantLevel,
        };
      })
      .sort((a, b) => {
        if (sortOption === 'last-studied') {
          return (
            b.lastStudiedAt - a.lastStudiedAt || b.createdAt - a.createdAt
          );
        }
        if (sortOption === 'due') {
          return b.totalDue - a.totalDue || b.createdAt - a.createdAt;
        }
        return b.createdAt - a.createdAt;
      })
      .filter((f) => {
        if (
          !searchQuery.trim() &&
          filterCefr === 'ALL' &&
          filterArchetype === 'ALL'
        ) {
          return true;
        }
        const q = searchQuery.trim().toLowerCase();
        const nameMatches = q ? f.name.toLowerCase().includes(q) : true;
        const childMatches = f.childDecks.some(matchesSearchAndFilters);
        if (filterCefr !== 'ALL' || filterArchetype !== 'ALL') {
          return childMatches;
        }
        return nameMatches || childMatches;
      });
  }, [
    folders,
    userDecks,
    compareDecksBySort,
    sortOption,
    searchQuery,
    filterCefr,
    filterArchetype,
    matchesSearchAndFilters,
  ]);

  // Loose decks at root (folderId === null), sorted by active Sort option
  const looseDecks = useMemo(() => {
    const validFolderIds = new Set(folders.map((f) => f.id));
    return userDecks
      .filter(
        (d) =>
          (!d.folderId || !validFolderIds.has(d.folderId)) &&
          matchesSearchAndFilters(d)
      )
      .sort(compareDecksBySort);
  }, [userDecks, folders, matchesSearchAndFilters, compareDecksBySort]);

  // Active Folder when subScreen.type === 'folder'
  const activeFolder = useMemo(() => {
    if (subScreen.type !== 'folder') return null;
    return (
      enrichedFolders.find((f) => f.id === subScreen.folderId) ||
      (() => {
        const raw = folders.find((f) => f.id === subScreen.folderId);
        if (!raw) return null;
        return {
          ...raw,
          childDecks: [] as EnrichedUnifiedDeck[],
          deckCount: 0,
          totalCards: 0,
          totalMastered: 0,
          totalLearning: 0,
          totalDue: 0,
          lastStudiedAt: 0,
          masteredPct: 0,
          learningPct: 0,
          progressPct: 0,
          dominantLevel: 'A1–B1',
        };
      })()
    );
  }, [subScreen, enrichedFolders, folders]);

  // Active Deck when subScreen.type === 'deck-detail'
  const activeDetailDeck = useMemo(() => {
    if (subScreen.type !== 'deck-detail') return null;
    return enrichedDecks.find((d) => d.id === subScreen.deckId) || null;
  }, [subScreen, enrichedDecks]);

  // Open Editor Helper
  const openEditor = (
    mode: 'create-deck' | 'edit-deck' | 'create-folder' | 'edit-folder',
    options?: {
      targetId?: string;
      initialFolderId?: string | null;
      autoMoveDeckIdAfterFolderCreate?: string | null;
    }
  ) => {
    const lastChoice = loadLastPickerChoice();
    setEditorIconSearch('');
    setEditorCardSearch('');

    if (mode === 'create-deck') {
      setEditorName('');
      setEditorSubtitle('Eigenes Wortschatz-Deck');
      setEditorIcon(lastChoice.icon);
      setEditorUseTextTile(false);
      setEditorTint(lastChoice.tint);
      setEditorFolderId(options?.initialFolderId ?? null);
      setEditorSelectedCardIds(allCards.slice(0, 8).map((c) => c.id));
      setHasManualIconPick(false);
    } else if (mode === 'edit-deck' && options?.targetId) {
      const deck = enrichedDecks.find((d) => d.id === options.targetId);
      if (!deck) return;
      setEditorName(deck.title);
      setEditorSubtitle(deck.subtitle);
      setEditorIcon(deck.iconId);
      setEditorUseTextTile(deck.useTextTile);
      setEditorTint(deck.tint);
      setEditorFolderId(deck.folderId);
      setEditorSelectedCardIds(deck.cards.map((c) => c.id));
      setHasManualIconPick(true);
    } else if (mode === 'create-folder') {
      setEditorName('');
      setEditorSubtitle('');
      setEditorIcon(lastChoice.icon);
      setEditorUseTextTile(false);
      setEditorTint(lastChoice.tint);
      setEditorFolderId(null);
      setEditorSelectedCardIds([]);
      setHasManualIconPick(false);
    } else if (mode === 'edit-folder' && options?.targetId) {
      const folder = folders.find((f) => f.id === options.targetId);
      if (!folder) return;
      setEditorName(folder.name);
      setEditorSubtitle('');
      setEditorIcon(folder.icon);
      setEditorUseTextTile(false);
      setEditorTint(folder.tint);
      setEditorFolderId(null);
      setEditorSelectedCardIds([]);
      setHasManualIconPick(true);
    }

    setEditorState({
      mode,
      targetId: options?.targetId,
      initialFolderId: options?.initialFolderId,
      autoMoveDeckIdAfterFolderCreate: options?.autoMoveDeckIdAfterFolderCreate,
    });
  };

  // Auto-suggest icon & tint from keywords when typing a new deck or folder name
  const handleEditorNameChange = (val: string) => {
    setEditorName(val);
    if (!hasManualIconPick) {
      const suggestion = suggestIconFromKeywords(val);
      if (suggestion) {
        setEditorIcon(suggestion.iconId);
        if (suggestion.tint) {
          setEditorTint(suggestion.tint);
        }
      }
    }
  };

  // Save Editor Form
  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorState) return;
    const trimmedName = editorName.trim();
    if (!trimmedName) return;

    triggerHapticFeedback(12);
    saveLastPickerChoice({ icon: editorIcon, tint: editorTint });

    if (editorState.mode === 'create-folder') {
      const newFolder: DeckFolder = {
        id: `folder-${Date.now()}`,
        name: trimmedName,
        icon: editorIcon,
        tint: editorTint,
        order: folders.length,
        createdAt: Date.now(),
      };
      onUpdateFolders([newFolder, ...folders]);

      if (editorState.autoMoveDeckIdAfterFolderCreate) {
        handleAssignDeckToFolder(
          editorState.autoMoveDeckIdAfterFolderCreate,
          newFolder.id
        );
      }
    } else if (editorState.mode === 'edit-folder' && editorState.targetId) {
      const updated = folders.map((f) =>
        f.id === editorState.targetId
          ? { ...f, name: trimmedName, icon: editorIcon, tint: editorTint }
          : f
      );
      onUpdateFolders(updated);
    } else if (editorState.mode === 'create-deck') {
      const chosenCards =
        editorSelectedCardIds.length > 0
          ? editorSelectedCardIds
          : allCards.slice(0, 6).map((c) => c.id);
      const newDeck: CustomDeckRecord = {
        id: `custom-deck-${Date.now()}`,
        title: trimmedName,
        subtitle: editorSubtitle.trim() || `${chosenCards.length} Karten`,
        icon: editorIcon,
        tint: editorTint,
        folderId: editorFolderId,
        cardIds: chosenCards,
        levelTag: 'Custom',
        createdAt: Date.now(),
      };
      onUpdateCustomDecks([...customDecks, newDeck]);
    } else if (editorState.mode === 'edit-deck' && editorState.targetId) {
      const targetId = editorState.targetId;
      const isCustom = customDecks.some((d) => d.id === targetId);
      if (isCustom) {
        const updated = customDecks.map((d) =>
          d.id === targetId
            ? {
                ...d,
                title: trimmedName,
                subtitle: editorSubtitle.trim() || d.subtitle,
                icon: editorIcon,
                tint: editorTint,
                folderId: editorFolderId,
                cardIds:
                  editorSelectedCardIds.length > 0
                    ? editorSelectedCardIds
                    : d.cardIds,
              }
            : d
        );
        onUpdateCustomDecks(updated);
      } else {
        const prevOverride = deckOverrides[targetId] || {};
        onUpdateDeckOverrides({
          ...deckOverrides,
          [targetId]: {
            ...prevOverride,
            title: trimmedName,
            icon: editorUseTextTile ? 'level-text' : editorIcon,
            tint: editorTint,
            folderId: editorFolderId,
          },
        });
      }
    }

    setEditorState(null);
  };

  // Move a deck into a folder (or back to root when folderId === null)
  const handleAssignDeckToFolder = (
    deckId: string,
    targetFolderId: string | null
  ) => {
    triggerHapticFeedback(10);
    const isCustom = customDecks.some((d) => d.id === deckId);
    if (isCustom) {
      onUpdateCustomDecks(
        customDecks.map((d) =>
          d.id === deckId ? { ...d, folderId: targetFolderId } : d
        )
      );
    } else {
      const prev = deckOverrides[deckId] || {};
      onUpdateDeckOverrides({
        ...deckOverrides,
        [deckId]: {
          ...prev,
          folderId: targetFolderId,
        },
      });
    }
    setMoveTargetDeckId(null);
    setActionDeckId(null);
  };

  // Delete a deck
  const handleDeleteDeck = (deckId: string) => {
    triggerHapticFeedback(14);
    const isCustom = customDecks.some((d) => d.id === deckId);
    if (isCustom) {
      onUpdateCustomDecks(customDecks.filter((d) => d.id !== deckId));
    } else {
      const prev = deckOverrides[deckId] || {};
      onUpdateDeckOverrides({
        ...deckOverrides,
        [deckId]: { ...prev, hidden: true, folderId: null },
      });
    }
    setActionDeckId(null);
    if (subScreen.type === 'deck-detail' && subScreen.deckId === deckId) {
      navigateSubScreen(
        subScreen.returnFolderId
          ? { type: 'folder', folderId: subScreen.returnFolderId }
          : { type: 'root' },
        'pop'
      );
    }
  };

  // Delete Folder option 1: "Nur Ordner löschen (Decks bleiben)"
  const handleDeleteFolderKeepDecks = (folder: DeckFolder) => {
    triggerHapticFeedback(12);
    const nextCustom = customDecks.map((d) =>
      d.folderId === folder.id ? { ...d, folderId: null } : d
    );
    const nextOverrides: Record<string, DeckMetaOverride> = {
      ...deckOverrides,
    };
    for (const [k, v] of Object.entries(nextOverrides)) {
      if (v.folderId === folder.id) {
        nextOverrides[k] = { ...v, folderId: null };
      }
    }
    onUpdateCustomDecks(nextCustom);
    onUpdateDeckOverrides(nextOverrides);
    onUpdateFolders(folders.filter((f) => f.id !== folder.id));
    setDeleteFolderTarget(null);
    setActionFolderId(null);
    if (subScreen.type === 'folder' && subScreen.folderId === folder.id) {
      navigateSubScreen({ type: 'root' }, 'pop');
    }
  };

  // Delete Folder option 2: "Ordner und Decks löschen"
  const handleDeleteFolderAndDecks = (folder: DeckFolder) => {
    triggerHapticFeedback(16);
    const nextCustom = customDecks.filter((d) => d.folderId !== folder.id);
    const nextOverrides: Record<string, DeckMetaOverride> = {
      ...deckOverrides,
    };
    for (const d of userDecks) {
      if (d.folderId === folder.id && !d.isCustom) {
        nextOverrides[d.id] = {
          ...(nextOverrides[d.id] || {}),
          hidden: true,
          folderId: null,
        };
      }
    }
    onUpdateCustomDecks(nextCustom);
    onUpdateDeckOverrides(nextOverrides);
    onUpdateFolders(folders.filter((f) => f.id !== folder.id));
    setDeleteFolderTarget(null);
    setActionFolderId(null);
    if (subScreen.type === 'folder' && subScreen.folderId === folder.id) {
      navigateSubScreen({ type: 'root' }, 'pop');
    }
  };

  // Render Sleek 36x36 Tinted Icon or Fraunces Level Text Tile
  const renderIconTile = (options: {
    tint: DeckTintId;
    iconId: string;
    textTile?: string;
    useTextTile?: boolean;
  }) => {
    const swatch = getTintConfig(options.tint);
    const IconComp = resolveIconComponent(options.iconId);

    return (
      <div
        style={{
          backgroundColor: swatch.bgVar,
          color: swatch.fgVar,
          borderRadius: '10px',
        }}
        className="w-9 h-9 shrink-0 flex items-center justify-center select-none"
      >
        {options.useTextTile && options.textTile ? (
          <span className="font-display text-[14px] font-bold tracking-tight leading-none">
            {options.textTile}
          </span>
        ) : (
          <IconComp className="w-[18px] h-[18px]" strokeWidth={1.75} />
        )}
      </div>
    );
  };

  // Render Individual Standalone Deck Card Row (Refined Compact Proportions)
  const renderDeckCardRow = (
    deck: EnrichedUnifiedDeck,
    options?: {
      indexNumber?: number;
      parentFolderId?: string | null;
      allowDrag?: boolean;
    }
  ) => {
    const swatch = getTintConfig(deck.tint);
    const numPrefix =
      typeof options?.indexNumber === 'number'
        ? `${String(options.indexNumber + 1).padStart(2, '0')} · `
        : '';

    return (
      <div
        key={deck.id}
        role="button"
        tabIndex={0}
        draggable={options?.allowDrag}
        onDragStart={(e) => {
          if (!options?.allowDrag) return;
          setDraggedDeckId(deck.id);
          e.dataTransfer.setData('text/plain', deck.id);
        }}
        onDragEnd={() => {
          setDraggedDeckId(null);
          setDragOverFolderId(null);
        }}
        onTouchStart={() => {
          if (longPressTimerRef.current) {
            window.clearTimeout(longPressTimerRef.current);
          }
          longPressTimerRef.current = window.setTimeout(() => {
            triggerHapticFeedback(16);
            setActionDeckId(deck.id);
          }, 500);
        }}
        onTouchEnd={() => {
          if (longPressTimerRef.current) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }}
        onTouchMove={() => {
          if (longPressTimerRef.current) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }}
        onClick={() =>
          navigateSubScreen(
            {
              type: 'deck-detail',
              deckId: deck.id,
              returnFolderId: options?.parentFolderId ?? null,
            },
            'push'
          )
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateSubScreen(
              {
                type: 'deck-detail',
                deckId: deck.id,
                returnFolderId: options?.parentFolderId ?? null,
              },
              'push'
            );
          }
        }}
        className="surface-paper card-hover-lift border px-3 py-2.5 md:p-3.5 flex items-center gap-2.5 cursor-pointer select-none theme-focus"
      >
        {/* 1. Left: 36x36 Icon Tile (10px radius, ~12% tint, stroke 1.75 or Fraunces level text) */}
        {renderIconTile({
          tint: deck.tint,
          iconId: deck.iconId,
          textTile: deck.defaultTextTile,
          useTextTile: deck.useTextTile,
        })}

        {/* 2. Center: Title (Fraunces 15px, 600, up to 2 lines) + 3px Progress Bar + 1-Line Stats */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-display text-[15px] font-semibold leading-[1.24] text-[var(--fg-primary)] line-clamp-2 break-words">
            {numPrefix}
            {deck.title}
          </h3>

          {/* Segmented progress bar: mastered (solid) + reviewed (soft) */}
          <div className="flex items-center gap-2">
            <div
              role="progressbar"
              aria-valuenow={deck.progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${deck.title} progress: ${deck.mastered} mastered, ${deck.learning} reviewed`}
              className="h-1 flex-1 rounded-full bg-[var(--surface-3)] overflow-hidden flex"
            >
              {deck.masteredPct > 0 && (
                <div
                  style={{
                    width: `${Math.min(100, deck.masteredPct)}%`,
                    backgroundColor: swatch.fgVar,
                  }}
                  className="h-full transition-all duration-300"
                />
              )}
              {deck.learningPct > 0 && (
                <div
                  style={{
                    width: `${Math.min(
                      100 - Math.min(100, deck.masteredPct),
                      deck.learningPct
                    )}%`,
                    backgroundColor: swatch.fgVar,
                    opacity: 0.42,
                  }}
                  className="h-full transition-all duration-300"
                />
              )}
            </div>
            <span className="font-sans text-[11px] font-medium text-[var(--fg-muted)] tabular-nums shrink-0 leading-none">
              {deck.progressPct}%
            </span>
          </div>

          {/* Stats: ONE line, muted, tabular-nums */}
          <div className="font-sans text-[12px] text-[var(--fg-muted)] tabular-nums whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            <span>{deck.total} cards</span>
            {deck.learning > 0 && (
              <span className="hidden min-[375px]:inline">
                {' '}
                · {deck.learning} reviewed
              </span>
            )}
            <span className="hidden min-[375px]:inline">
              {' '}
              · {deck.mastered} mastered
            </span>
          </div>
        </div>

        {/* 3. Right: Play Button (44px height hit zone) + "⋯" Menu */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartDeckStudy(deck.id, deck.cards);
            }}
            aria-label={`Play ${deck.title}`}
            title="Start study session"
            className="w-10 h-[44px] -my-1 flex items-center justify-center shrink-0 cursor-pointer theme-focus rounded-full"
          >
            <span className="w-8 h-8 rounded-full bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] flex items-center justify-center shadow-ring active:scale-95 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHapticFeedback(8);
              setActionDeckId(deck.id);
            }}
            aria-label={`More actions for ${deck.title}`}
            title="More options"
            className="w-9 h-[44px] -my-1 -mr-1 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors shrink-0 cursor-pointer theme-focus"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render Folder Card Row (Refined Compact Proportions)
  const renderFolderCardRow = (folder: (typeof enrichedFolders)[number]) => {
    const swatch = getTintConfig(folder.tint);
    const isDropTarget = dragOverFolderId === folder.id;

    return (
      <div
        key={folder.id}
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          if (!draggedDeckId) return;
          e.preventDefault();
          setDragOverFolderId(folder.id);
        }}
        onDragLeave={() => {
          if (dragOverFolderId === folder.id) {
            setDragOverFolderId(null);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          const deckId = draggedDeckId || e.dataTransfer.getData('text/plain');
          setDragOverFolderId(null);
          setDraggedDeckId(null);
          if (deckId) {
            handleAssignDeckToFolder(deckId, folder.id);
          }
        }}
        onClick={() =>
          navigateSubScreen({ type: 'folder', folderId: folder.id }, 'push')
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateSubScreen({ type: 'folder', folderId: folder.id }, 'push');
          }
        }}
        style={
          isDropTarget
            ? { borderColor: swatch.fgVar, backgroundColor: swatch.bgVar }
            : undefined
        }
        className="surface-paper card-hover-lift border px-3 py-2.5 md:p-3.5 flex items-center gap-2.5 cursor-pointer select-none theme-focus"
      >
        {/* 36x36 Folder-Tinted Icon Tile */}
        {renderIconTile({
          tint: folder.tint,
          iconId: folder.icon || 'Folder',
        })}

        {/* Center: Title + Segmented Progress Bar + "A2 · 10 decks" */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-display text-[15px] font-semibold leading-[1.24] text-[var(--fg-primary)] line-clamp-2 break-words">
              {folder.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="progressbar"
              aria-valuenow={folder.progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${folder.name} folder progress: ${folder.totalMastered} mastered, ${folder.totalLearning} reviewed`}
              className="h-1 flex-1 rounded-full bg-[var(--surface-3)] overflow-hidden flex"
            >
              {folder.masteredPct > 0 && (
                <div
                  style={{
                    width: `${Math.min(100, folder.masteredPct)}%`,
                    backgroundColor: swatch.fgVar,
                  }}
                  className="h-full transition-all duration-300"
                />
              )}
              {folder.learningPct > 0 && (
                <div
                  style={{
                    width: `${Math.min(
                      100 - Math.min(100, folder.masteredPct),
                      folder.learningPct
                    )}%`,
                    backgroundColor: swatch.fgVar,
                    opacity: 0.42,
                  }}
                  className="h-full transition-all duration-300"
                />
              )}
            </div>
            <span className="font-sans text-[11px] font-medium text-[var(--fg-muted)] tabular-nums shrink-0 leading-none">
              {folder.progressPct}%
            </span>
          </div>

          <div className="font-sans text-[12px] text-[var(--fg-muted)] tabular-nums whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            <span>{folder.dominantLevel}</span>
            <span>
              {' '}
              · {folder.deckCount} {folder.deckCount === 1 ? 'deck' : 'decks'}
            </span>
            {folder.totalLearning > 0 && (
              <span className="hidden min-[375px]:inline">
                {' '}
                · {folder.totalLearning} reviewed
              </span>
            )}
          </div>
        </div>

        {/* Right: "⋯" Menu + Chevron */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHapticFeedback(8);
              setActionFolderId(folder.id);
            }}
            aria-label={`Folder options for ${folder.name}`}
            title="Folder options"
            className="w-9 h-[44px] -my-1 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors shrink-0 cursor-pointer theme-focus"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <ChevronRight className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
        </div>
      </div>
    );
  };

  const activeFilterCount =
    (filterCefr !== 'ALL' ? 1 : 0) + (filterArchetype !== 'ALL' ? 1 : 0);

  const sheetScrollRef = useRef<HTMLDivElement | null>(null);
  const dismissActiveSheet = useCallback((): boolean => {
    if (editorState) {
      setEditorState(null);
      return true;
    }
    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
      return true;
    }
    if (deleteFolderTarget) {
      setDeleteFolderTarget(null);
      return true;
    }
    if (assignToFolderId) {
      setAssignToFolderId(null);
      return true;
    }
    if (moveTargetDeckId) {
      setMoveTargetDeckId(null);
      return true;
    }
    if (actionFolderId) {
      setActionFolderId(null);
      return true;
    }
    if (actionDeckId) {
      setActionDeckId(null);
      return true;
    }
    if (isSortMenuOpen) {
      setIsSortMenuOpen(false);
      return true;
    }
    if (isNewMenuOpen) {
      setIsNewMenuOpen(false);
      return true;
    }
    return false;
  }, [
    editorState,
    isFilterSheetOpen,
    deleteFolderTarget,
    assignToFolderId,
    moveTargetDeckId,
    actionFolderId,
    actionDeckId,
    isSortMenuOpen,
    isNewMenuOpen,
  ]);

  const hasSwipeSheet = Boolean(
    editorState ||
      isFilterSheetOpen ||
      assignToFolderId ||
      moveTargetDeckId
  );

  const hasOpenSheet = Boolean(
    hasSwipeSheet ||
      deleteFolderTarget ||
      actionFolderId ||
      actionDeckId
  );

  const hasOpenOverlay = Boolean(hasOpenSheet || isSortMenuOpen || isNewMenuOpen);

  useEffect(() => {
    onOpenSheetChange?.(hasOpenOverlay);
  }, [hasOpenOverlay, onOpenSheetChange]);

  useEffect(() => {
    if (!dismissTopSheetRef) return;
    dismissTopSheetRef.current = dismissActiveSheet;
    return () => {
      dismissTopSheetRef.current = null;
    };
  }, [dismissTopSheetRef, dismissActiveSheet]);

  const {
    dragY: activeSheetDragY,
    sheetTouchHandlers: activeSheetTouchHandlers,
    sheetStyle: activeSheetStyle,
  } = useSheetSwipeDismiss({
    isOpen: hasSwipeSheet,
    onDismiss: dismissActiveSheet,
    scrollContainerRef: sheetScrollRef,
    threshold: 86,
  });

  const activeSheetBackdropStyle: React.CSSProperties | undefined =
    hasSwipeSheet && activeSheetDragY > 0
      ? { opacity: Math.max(0.1, 1 - activeSheetDragY / 280) }
      : undefined;

  return (
    <div className="max-w-4xl w-full mx-auto pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <div
        key={`${subScreen.type}-${subScreenKey}`}
        onTouchStart={subScreen.type !== 'root' ? handleSubScreenTouchStart : undefined}
        onTouchMove={subScreen.type !== 'root' ? handleSubScreenTouchMove : undefined}
        onTouchEnd={subScreen.type !== 'root' ? handleSubScreenTouchEnd : undefined}
        onTouchCancel={subScreen.type !== 'root' ? handleSubScreenTouchCancel : undefined}
        style={
          subScreenDragX > 0 || isSubScreenSwiping
            ? {
                transform: `translate3d(${subScreenDragX}px, 0, 0)`,
                opacity: Math.max(0.55, 1 - subScreenDragX / 360),
                transition: isSubScreenSwiping
                  ? 'none'
                  : 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
              }
            : undefined
        }
        className={
          subScreenKey > 0
            ? subScreenNavDir === 'push'
              ? 'deck-subscreen-push'
              : 'deck-subscreen-pop'
            : undefined
        }
      >
        {/* ====================================================================
         * SUB-SCREEN 1: ROOT "ALL DECKS" VIEW
         * ==================================================================== */}
        {subScreen.type === 'root' && (
          <div className="space-y-3">
            {/* 1. TOP PAGE HEADER: Title "Decks" + Filter Button + "+ New" Menu */}
            <div className="flex items-center justify-between gap-2">
              <h1 className="font-display text-[21px] font-bold tracking-tight text-[var(--fg-primary)]">
                Decks
              </h1>

              <div className="flex items-center gap-1.5">
                {/* Filter Sheet Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHapticFeedback(8);
                    setIsFilterSheetOpen(true);
                  }}
                  aria-label="Filter decks by CEFR level or grammar archetype"
                  title="Filter decks"
                  className={`relative w-10 h-10 rounded-[var(--radius-control)] border flex items-center justify-center transition-colors cursor-pointer theme-focus ${
                    activeFilterCount > 0
                      ? 'bg-[var(--intent-primary-soft)] border-[var(--intent-primary-border)] text-[var(--intent-primary)]'
                      : 'surface-1 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] shadow-ring'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--intent-primary)]" />
                  )}
                </button>

                {/* "+ New" Menu (New deck / New folder / New card) */}
                <div ref={newMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticFeedback(8);
                      setIsSortMenuOpen(false);
                      setIsNewMenuOpen((prev) => !prev);
                    }}
                    aria-expanded={isNewMenuOpen}
                    aria-haspopup="menu"
                    className="h-10 px-3 rounded-[var(--radius-control)] bg-[var(--intent-primary)] hover:bg-[var(--intent-primary-hover)] text-[var(--intent-primary-fg)] font-sans text-[13px] font-semibold inline-flex items-center gap-1.5 shadow-ring active:scale-[0.98] transition-all cursor-pointer theme-focus"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New</span>
                  </button>

                  {isNewMenuMounted && (
                    <div
                      role="menu"
                      aria-label="Create new item"
                      data-state={newMenuState}
                      className="absolute right-0 top-[calc(100%+6px)] z-50 w-48 p-1.5 surface-overlay border space-y-0.5 popover-panel"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsNewMenuOpen(false);
                          openEditor('create-deck');
                        }}
                        className="w-full min-h-[42px] px-3 rounded-[var(--radius-control)] flex items-center gap-2.5 text-left font-sans text-[13px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-[var(--intent-primary)]" />
                        <span>New deck</span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsNewMenuOpen(false);
                          openEditor('create-folder');
                        }}
                        className="w-full min-h-[42px] px-3 rounded-[var(--radius-control)] flex items-center gap-2.5 text-left font-sans text-[13px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                      >
                        <FolderPlus className="w-4 h-4 text-[var(--accent-secondary)]" />
                        <span>New folder</span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsNewMenuOpen(false);
                          onOpenNewCardModal();
                        }}
                        className="w-full min-h-[42px] px-3 rounded-[var(--radius-control)] flex items-center gap-2.5 text-left font-sans text-[13px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[var(--accent-terracotta)]" />
                        <span>New card</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. COMPACT SEARCH FIELD */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Decks oder Ordner suchen…"
                aria-label="Search decks or folders"
                className="w-full h-10 pl-9 pr-9 rounded-[var(--radius-control)] border surface-1 font-sans text-[13.5px] text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)] shadow-ring theme-focus"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="w-10 h-10 absolute right-0 top-0 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 3. CHIPS (Alle · Ordner · Smart) + SORT DROPDOWN MENU */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <SlidingPillSwitcher
                  options={[
                    { id: 'all', label: 'Alle' },
                    { id: 'folders', label: `Ordner (${enrichedFolders.length})` },
                    { id: 'smart', label: 'Smart' },
                  ]}
                  value={activeChip}
                  onChange={(nextChip) => {
                    triggerHapticFeedback(6);
                    setActiveChip(nextChip);
                  }}
                  ariaLabel="Decks view filter"
                  variant="filled"
                  size="md"
                  className="min-w-0"
                />

                {/* Sort Dropdown Menu ("Last Studied" | "Due Cards" | "Name") */}
                <div ref={sortMenuRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticFeedback(6);
                      setIsNewMenuOpen(false);
                      setIsSortMenuOpen((prev) => !prev);
                    }}
                    aria-expanded={isSortMenuOpen}
                    aria-haspopup="menu"
                    aria-label="Sort decks"
                    className={`min-h-[38px] px-2.5 rounded-[var(--radius-control)] border font-sans text-[12.5px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer theme-focus ${
                      isSortMenuOpen
                        ? 'bg-[var(--surface-2)] text-[var(--fg-primary)] border-[var(--border-strong)]'
                        : 'surface-1 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] shadow-ring'
                    }`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-[var(--fg-muted)] shrink-0" />
                    <span>
                      {sortOption === 'last-studied'
                        ? 'Last Studied'
                        : sortOption === 'due'
                        ? 'Due Cards'
                        : 'Name'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[var(--fg-muted)] transition-transform duration-150 ${
                        isSortMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isSortMenuMounted && (
                    <div
                      role="menu"
                      aria-label="Sort order"
                      data-state={sortMenuState}
                      className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 p-1.5 surface-overlay border space-y-0.5 popover-panel"
                    >
                      {(
                        [
                          { id: 'last-studied', label: 'Last Studied' },
                          { id: 'due', label: 'Due Cards' },
                          { id: 'name', label: 'Name' },
                        ] as const
                      ).map((opt) => {
                        const isSelected = sortOption === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="menuitemradio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectSortOption(opt.id)}
                            className={`w-full min-h-[40px] px-2.5 rounded-[var(--radius-control)] flex items-center justify-between gap-2 text-left font-sans text-[13px] transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] font-semibold'
                                : 'text-[var(--fg-primary)] font-medium hover:bg-[var(--surface-2)]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCefr('ALL');
                      setFilterArchetype('ALL');
                    }}
                    className="min-h-[32px] px-2.5 rounded-[var(--radius-pill)] bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] font-sans text-[12px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {filterCefr !== 'ALL' ? filterCefr : ''}{' '}
                      {filterArchetype !== 'ALL' ? filterArchetype : ''}
                    </span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. PINNED HERO CARD AT TOP: "Heute lernen: 24 due" with a single Start button */}
            <div className="surface-paper border px-3 py-2.5 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {renderIconTile({
                  tint: 'terracotta',
                  iconId: 'Clock',
                })}
                <div className="min-w-0 space-y-0.5">
                  <div className="font-display text-[15px] font-semibold text-[var(--fg-primary)] leading-snug">
                    Heute lernen:{' '}
                    <span className="tabular-nums text-[var(--accent-terracotta)]">
                      {dueQueueDeck.due} due
                    </span>
                  </div>
                  <div className="font-sans text-[12px] text-[var(--fg-muted)] tabular-nums truncate">
                    {dueQueueDeck.due > 0
                      ? `Daily Due Queue · ${dueQueueDeck.mastered} mastered`
                      : `Alle ${allCards.length} Karten für heute erledigt`}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onStartDeckStudy(
                    dueQueueDeck.due > 0 ? 'due' : 'all',
                    dueQueueDeck.due > 0 ? dueQueueDeck.cards : allCards
                  )
                }
                className="h-9 px-3.5 rounded-[var(--radius-control)] bg-[var(--intent-primary)] hover:bg-[var(--intent-primary-hover)] text-[var(--intent-primary-fg)] font-sans text-[12.5px] font-semibold inline-flex items-center gap-1.5 shrink-0 shadow-ring active:scale-95 transition-all cursor-pointer theme-focus"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start</span>
              </button>
            </div>

            {/* 5. TAB CONTENT: "Alle" (Folders + Loose Decks), "Ordner" (Folders only), or "Smart" (System Smart Queues) */}
            {activeChip === 'smart' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {smartDecks.map((sd) => renderDeckCardRow(sd))}
              </div>
            ) : activeChip === 'folders' ? (
              <div className="space-y-2.5">
                {enrichedFolders.length === 0 ? (
                  <div className="surface-paper border p-5 text-center space-y-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[var(--intent-primary-soft)] text-[var(--intent-primary)] flex items-center justify-center mx-auto">
                      <Folder className="w-[18px] h-[18px]" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-display text-[15px] font-semibold text-[var(--fg-primary)]">
                        Noch keine Ordner
                      </h2>
                      <p className="font-sans text-[12.5px] text-[var(--fg-secondary)] max-w-xs mx-auto">
                        Erstelle einen Ordner, um deine Decks nach Niveau oder Thema zu bündeln.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditor('create-folder')}
                      className="h-10 px-4 rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Neuer Ordner</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {enrichedFolders.map((folder) =>
                      renderFolderCardRow(folder)
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Folders Section */}
                {enrichedFolders.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {enrichedFolders.map((folder) =>
                      renderFolderCardRow(folder)
                    )}
                  </div>
                )}

                {/* Loose Decks Section (folderId === null, Sorted by active Sort option) */}
                {looseDecks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {looseDecks.map((deck) =>
                      renderDeckCardRow(deck, { allowDrag: true })
                    )}
                  </div>
                ) : (
                  enrichedFolders.length === 0 && (
                    <div className="surface-paper border p-5 text-center space-y-1.5">
                      <div className="font-display text-[15px] font-semibold text-[var(--fg-primary)]">
                        Keine passenden Decks gefunden
                      </div>
                      <p className="font-sans text-[12.5px] text-[var(--fg-secondary)]">
                        Passe deine Suche oder Filter an.
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
         * SUB-SCREEN 2: FOLDER DRILL-DOWN VIEW (220ms Push Screen, 1-Level Only)
         * ==================================================================== */}
        {subScreen.type === 'folder' && activeFolder && (
          <div className="space-y-3">
            {/* Folder Header: "‹ Decks" Back Button + Folder Title + "+ Deck" + Folder "⋯" */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigateSubScreen({ type: 'root' }, 'pop')}
                className="min-h-[40px] pr-2.5 rounded-[var(--radius-control)] inline-flex items-center gap-1 font-sans text-[13.5px] font-semibold text-[var(--accent-secondary)] hover:text-[var(--fg-primary)] cursor-pointer theme-focus"
              >
                <ChevronLeft className="w-4 h-4 -ml-0.5" />
                <span>Decks</span>
              </button>

              <h1 className="font-display text-[17px] font-bold text-[var(--fg-primary)] truncate text-center flex-1">
                {activeFolder.name}
              </h1>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setAssignToFolderId(activeFolder.id)}
                  className="h-9 px-3 rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[12.5px] font-semibold inline-flex items-center gap-1 shadow-ring cursor-pointer theme-focus"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deck</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionFolderId(activeFolder.id)}
                  aria-label="Folder options"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)] cursor-pointer theme-focus"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* "Study all due in this folder" Top CTA Card */}
            <div className="surface-paper border px-3 py-2.5 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {renderIconTile({
                  tint: activeFolder.tint,
                  iconId: activeFolder.icon || 'Folder',
                })}
                <div className="min-w-0 space-y-0.5">
                  <div className="font-display text-[15px] font-semibold text-[var(--fg-primary)] leading-snug">
                    Study all due in this folder
                  </div>
                  <div className="font-sans text-[12px] text-[var(--fg-muted)] tabular-nums truncate">
                    {activeFolder.deckCount}{' '}
                    {activeFolder.deckCount === 1 ? 'deck' : 'decks'} ·{' '}
                    {activeFolder.totalDue} due · {activeFolder.progressPct}%
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={activeFolder.totalCards === 0}
                onClick={() => {
                  const now = new Date();
                  const allFolderCards = activeFolder.childDecks.flatMap(
                    (d) => d.cards
                  );
                  const uniqueMap = new Map<string, VocabCard>();
                  for (const c of allFolderCards) uniqueMap.set(c.id, c);
                  const uniqueCards = Array.from(uniqueMap.values());
                  const dueCards = uniqueCards.filter((c) =>
                    isCardDueToday(
                      srsMap[c.id] || createDefaultSrsState(c.id),
                      now
                    )
                  );
                  onStartDeckStudy(
                    activeFolder.childDecks[0]?.id || 'all',
                    dueCards.length > 0 ? dueCards : uniqueCards
                  );
                }}
                className="h-9 px-3.5 rounded-[var(--radius-control)] bg-[var(--intent-primary)] hover:bg-[var(--intent-primary-hover)] disabled:opacity-40 text-[var(--intent-primary-fg)] font-sans text-[12.5px] font-semibold inline-flex items-center gap-1.5 shrink-0 shadow-ring cursor-pointer theme-focus"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start ({activeFolder.totalDue})</span>
              </button>
            </div>

            {/* Child Decks (Sorted by active sort mode, with 01, 02 numbering) */}
            {activeFolder.childDecks.length === 0 ? (
              <div className="surface-paper border p-5 text-center space-y-3">
                <div className="font-display text-[15px] font-semibold text-[var(--fg-primary)]">
                  Dieser Ordner ist leer
                </div>
                <p className="font-sans text-[12.5px] text-[var(--fg-secondary)] max-w-xs mx-auto">
                  Füge bestehende Decks hinzu oder erstelle ein neues Deck direkt in diesem Ordner.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAssignToFolderId(activeFolder.id)}
                    className="h-10 px-3.5 rounded-[var(--radius-control)] surface-2 border font-sans text-[12.5px] font-semibold text-[var(--fg-primary)] cursor-pointer"
                  >
                    Bestehendes Deck hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEditor('create-deck', {
                        initialFolderId: activeFolder.id,
                      })
                    }
                    className="h-10 px-3.5 rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[12.5px] font-semibold cursor-pointer"
                  >
                    + Neues Deck
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {activeFolder.childDecks.map((deck, idx) =>
                  renderDeckCardRow(deck, {
                    indexNumber: idx,
                    parentFolderId: activeFolder.id,
                    allowDrag: false,
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
         * SUB-SCREEN 3: DECK CARD LIST VIEW (Unified Compact List Container)
         * ==================================================================== */}
        {subScreen.type === 'deck-detail' && activeDetailDeck && (
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Top Bar: Back Button + Edit + "⋯" Menu */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  navigateSubScreen(
                    subScreen.returnFolderId
                      ? { type: 'folder', folderId: subScreen.returnFolderId }
                      : { type: 'root' },
                    'pop'
                  )
                }
                className="min-h-[40px] pr-2.5 rounded-[var(--radius-control)] inline-flex items-center gap-1 font-sans text-[13.5px] font-semibold text-[var(--accent-secondary)] hover:text-[var(--fg-primary)] cursor-pointer theme-focus"
              >
                <ChevronLeft className="w-4 h-4 -ml-0.5" />
                <span>
                  {subScreen.returnFolderId
                    ? folders.find((f) => f.id === subScreen.returnFolderId)
                        ?.name || 'Ordner'
                    : 'Decks'}
                </span>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    openEditor('edit-deck', { targetId: activeDetailDeck.id })
                  }
                  className="h-9 px-3 rounded-[var(--radius-control)] surface-1 border font-sans text-[12.5px] font-semibold text-[var(--fg-primary)] inline-flex items-center gap-1.5 cursor-pointer theme-focus"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Bearbeiten</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionDeckId(activeDetailDeck.id)}
                  aria-label="Deck options"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)] cursor-pointer theme-focus"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Deck Summary Hero Card + Primary "Start" Button */}
            <div className="surface-paper border px-3 py-2.5 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {renderIconTile({
                  tint: activeDetailDeck.tint,
                  iconId: activeDetailDeck.iconId,
                  textTile: activeDetailDeck.defaultTextTile,
                  useTextTile: activeDetailDeck.useTextTile,
                })}
                <div className="min-w-0 space-y-0.5">
                  <h1 className="font-display text-[15.5px] font-semibold text-[var(--fg-primary)] leading-tight line-clamp-2">
                    {activeDetailDeck.title}
                  </h1>
                  <div className="font-sans text-[12px] text-[var(--fg-muted)] tabular-nums whitespace-nowrap">
                    <span>{activeDetailDeck.total} cards</span>
                    <span> · {activeDetailDeck.mastered} mastered</span>
                    <span> · {activeDetailDeck.due} due</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={activeDetailDeck.cards.length === 0}
                onClick={() =>
                  onStartDeckStudy(activeDetailDeck.id, activeDetailDeck.cards)
                }
                className="h-9 px-3.5 rounded-[var(--radius-control)] bg-[var(--intent-primary)] hover:bg-[var(--intent-primary-hover)] disabled:opacity-40 text-[var(--intent-primary-fg)] font-sans text-[12.5px] font-semibold inline-flex items-center gap-1.5 shrink-0 shadow-ring active:scale-95 transition-all cursor-pointer theme-focus"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start</span>
              </button>
            </div>

            {/* Unified Grouped Card List inside this Deck (No separate spaced tiles per word) */}
            <div className="surface-paper border overflow-hidden divide-y divide-[var(--border-subtle)]">
              {activeDetailDeck.cards.map((card) => {
                const st = srsMap[card.id] || createDefaultSrsState(card.id);
                const isDue = isCardDueToday(st);
                return (
                  <div
                    key={card.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectCardDetail(card)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCardDetail(card);
                      }
                    }}
                    className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 hover:bg-[var(--surface-2)]/60 active:bg-[var(--surface-2)] transition-colors cursor-pointer theme-focus"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-display text-[15px] font-semibold text-[var(--fg-primary)] leading-snug">
                          {card.nounDetails
                            ? formatNounLemma(card.lemma, card.nounDetails.gender)
                            : card.lemma}
                        </span>
                        <span className="font-sans text-[11.5px] font-semibold text-[var(--accent-secondary)]">
                          {card.cefr}
                        </span>
                        <span className="font-sans text-[11.5px] text-[var(--fg-muted)] tabular-nums">
                          · {formatIntervalBadge(st.intervalMinutes, st.reviewCount)}
                        </span>
                      </div>
                      <div className="font-sans text-[12.5px] text-[var(--fg-secondary)] truncate">
                        {card.translation}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isDue ? (
                        <span className="h-[22px] px-2 rounded-[var(--radius-pill)] bg-[var(--intent-warning-soft)] text-[var(--intent-warning)] font-sans text-[11px] font-semibold inline-flex items-center">
                          Due
                        </span>
                      ) : st.reviewCount === 0 ? (
                        <span className="h-[22px] px-2 rounded-[var(--radius-pill)] bg-[var(--surface-2)] text-[var(--fg-secondary)] font-sans text-[11px] font-semibold inline-flex items-center">
                          New
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-[var(--surface-2)] text-[var(--intent-success)] flex items-center justify-center font-sans text-[11px] font-semibold">
                          ✓
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) =>
                          onPlayAudio(card.spokenText, `deck-card-${card.id}`, e)
                        }
                        aria-label={`Play audio for ${card.lemma}`}
                        className={`w-10 h-10 -mr-1.5 rounded-full flex items-center justify-center transition-colors cursor-pointer theme-focus ${
                          speakingId === `deck-card-${card.id}`
                            ? 'bg-[var(--intent-primary-soft)] text-[var(--intent-primary)]'
                            : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)]'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
       * POPUP MODAL 1: DECK "⋯" OVERFLOW MENU (Preview / Edit / Move / Reset / Delete)
       * ==================================================================== */}
      {actionDeckId &&
        (() => {
          const targetDeck = enrichedDecks.find((d) => d.id === actionDeckId);
          if (!targetDeck) return null;
          const isInsideFolderScreen = subScreen.type === 'folder';

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Options for ${targetDeck.title}`}
              onClick={() => setActionDeckId(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[380px] sm:max-w-md rounded-[var(--radius-card)] surface-overlay border p-4 sm:p-5 space-y-3 max-h-[85dvh] overflow-y-auto modal-pop-enter"
              >
                <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3 min-w-0">
                    {renderIconTile({
                      tint: targetDeck.tint,
                      iconId: targetDeck.iconId,
                      textTile: targetDeck.defaultTextTile,
                      useTextTile: targetDeck.useTextTile,
                    })}
                    <div className="min-w-0">
                      <h2 className="font-display text-[17px] font-semibold text-[var(--fg-primary)] truncate">
                        {targetDeck.title}
                      </h2>
                      <p className="font-sans text-[13px] text-[var(--fg-muted)] tabular-nums">
                        {targetDeck.total} cards · {targetDeck.due} due
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActionDeckId(null)}
                    aria-label="Close menu"
                    className="w-[44px] h-[44px] -mr-1.5 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer shrink-0 theme-focus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      const dId = targetDeck.id;
                      setActionDeckId(null);
                      navigateSubScreen(
                        {
                          type: 'deck-detail',
                          deckId: dId,
                          returnFolderId:
                            subScreen.type === 'folder'
                              ? subScreen.folderId
                              : null,
                        },
                        'push'
                      );
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                  >
                    <Layers className="w-4 h-4 shrink-0 text-[var(--accent-secondary)]" />
                    <span className="min-w-0 flex-1 leading-snug">
                      Karten ansehen (Preview)
                    </span>
                  </button>

                  {!targetDeck.isSystemSmart && (
                    <button
                      type="button"
                      onClick={() => {
                        const dId = targetDeck.id;
                        setActionDeckId(null);
                        openEditor('edit-deck', { targetId: dId });
                      }}
                      className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                    >
                      <Edit3 className="w-4 h-4 shrink-0 text-[var(--intent-primary)]" />
                      <span className="min-w-0 flex-1 leading-snug">
                        Deck bearbeiten (Name, Icon &amp; Farbe)
                      </span>
                    </button>
                  )}

                  {/* Hide "Move to folder" targets inside a folder per Spec §3; inside a folder show "Aus Ordner entfernen" */}
                  {!targetDeck.isSystemSmart && !isInsideFolderScreen && (
                    <button
                      type="button"
                      onClick={() => {
                        const dId = targetDeck.id;
                        setActionDeckId(null);
                        setMoveTargetDeckId(dId);
                      }}
                      className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                    >
                      <FolderInput className="w-4 h-4 shrink-0 text-[var(--intent-warning)]" />
                      <span className="min-w-0 flex-1 leading-snug">
                        In Ordner verschieben…
                      </span>
                    </button>
                  )}

                  {!targetDeck.isSystemSmart && targetDeck.folderId && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAssignDeckToFolder(targetDeck.id, null)
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                    >
                      <Folder className="w-4 h-4 shrink-0 text-[var(--fg-secondary)]" />
                      <span className="min-w-0 flex-1 leading-snug">
                        Aus Ordner entfernen (Kein Ordner)
                      </span>
                    </button>
                  )}

                  <div className="pt-1.5 mt-1 border-t border-[var(--border-subtle)] space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        onResetDeckSrs(
                          targetDeck.cards.map((c) => c.id),
                          targetDeck.id
                        );
                        setActionDeckId(null);
                      }}
                      className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0 text-[var(--fg-secondary)]" />
                      <span className="min-w-0 flex-1 leading-snug">
                        Fortschritt für dieses Deck zurücksetzen
                      </span>
                    </button>

                    {!targetDeck.isSystemSmart && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDeck(targetDeck.id)}
                        className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--intent-danger)] hover:bg-[var(--intent-danger-soft)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        <span className="min-w-0 flex-1 leading-snug">
                          Deck löschen
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ====================================================================
       * POPUP MODAL 2: FOLDER "⋯" OVERFLOW MENU (Edit Folder / Delete Folder)
       * ==================================================================== */}
      {actionFolderId &&
        (() => {
          const targetFolder = folders.find((f) => f.id === actionFolderId);
          if (!targetFolder) return null;

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Folder options for ${targetFolder.name}`}
              onClick={() => setActionFolderId(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[380px] sm:max-w-md rounded-[var(--radius-card)] surface-overlay border p-4 sm:p-5 space-y-3 max-h-[85dvh] overflow-y-auto modal-pop-enter"
              >
                <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3 min-w-0">
                    {renderIconTile({
                      tint: targetFolder.tint,
                      iconId: targetFolder.icon || 'Folder',
                    })}
                    <h2 className="font-display text-[17px] font-semibold text-[var(--fg-primary)] truncate">
                      {targetFolder.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActionFolderId(null)}
                    aria-label="Close folder menu"
                    className="w-[44px] h-[44px] -mr-1.5 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer shrink-0 theme-focus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      const fId = targetFolder.id;
                      setActionFolderId(null);
                      openEditor('edit-folder', { targetId: fId });
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--fg-primary)] hover:bg-[var(--surface-2)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                  >
                    <Edit3 className="w-4 h-4 shrink-0 text-[var(--intent-primary)]" />
                    <span className="min-w-0 flex-1 leading-snug">
                      Ordner bearbeiten (Name, Icon &amp; Farbe)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionFolderId(null);
                      setDeleteFolderTarget(targetFolder);
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-control)] flex items-center gap-3 text-left font-sans text-[14px] font-medium text-[var(--intent-danger)] hover:bg-[var(--intent-danger-soft)] active:scale-[0.99] transition-colors cursor-pointer theme-focus"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span className="min-w-0 flex-1 leading-snug">
                      Ordner löschen…
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ====================================================================
       * SHEET 3: MOVE TO FOLDER ("⋯ > In Ordner verschieben")
       * ==================================================================== */}
      {moveTargetDeckId &&
        (() => {
          const deck = enrichedDecks.find((d) => d.id === moveTargetDeckId);
          if (!deck) return null;

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="In Ordner verschieben"
              onClick={() => setMoveTargetDeckId(null)}
              style={activeSheetBackdropStyle}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={activeSheetStyle}
                onTouchStart={activeSheetTouchHandlers.onTouchStart}
                onTouchMove={activeSheetTouchHandlers.onTouchMove}
                onTouchEnd={activeSheetTouchHandlers.onTouchEnd}
                onTouchCancel={activeSheetTouchHandlers.onTouchCancel}
                className="w-full max-w-md rounded-t-3xl sm:rounded-[var(--radius-card)] surface-overlay border p-5 pt-3 sm:pt-5 space-y-3 anatomy-sheet-enter"
              >
                <div
                  data-sheet-handle="true"
                  className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto sm:hidden"
                />
                <div
                  data-sheet-handle="true"
                  className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]"
                >
                  <div>
                    <h2 className="font-display text-[17px] font-semibold text-[var(--fg-primary)]">
                      In Ordner verschieben
                    </h2>
                    <p className="font-sans text-[13px] text-[var(--fg-secondary)] truncate">
                      {deck.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMoveTargetDeckId(null)}
                    aria-label="Close move sheet"
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div
                  data-sheet-scroll="true"
                  className="space-y-1.5 max-h-64 overflow-y-auto"
                >
                  {/* Option: Kein Ordner */}
                  <button
                    type="button"
                    onClick={() => handleAssignDeckToFolder(deck.id, null)}
                    className={`w-full min-h-[44px] px-3 rounded-[var(--radius-control)] border flex items-center justify-between font-sans text-[14px] font-medium cursor-pointer ${
                      !deck.folderId
                        ? 'bg-[var(--intent-primary-soft)] border-[var(--intent-primary-border)] text-[var(--intent-primary)]'
                        : 'surface-1 text-[var(--fg-primary)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span>Kein Ordner (Lose auf Decks-Startseite)</span>
                    {!deck.folderId && <Check className="w-4 h-4" />}
                  </button>

                  {/* Existing Folders (Sorted Latest -> Oldest) */}
                  {[...folders]
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((folder) => {
                      const isCurrent = deck.folderId === folder.id;
                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() =>
                            handleAssignDeckToFolder(deck.id, folder.id)
                          }
                          className={`w-full min-h-[48px] p-2 rounded-[var(--radius-control)] border flex items-center justify-between gap-3 font-sans text-[14px] font-medium cursor-pointer ${
                            isCurrent
                              ? 'bg-[var(--intent-primary-soft)] border-[var(--intent-primary-border)] text-[var(--intent-primary)]'
                              : 'surface-1 text-[var(--fg-primary)] hover:bg-[var(--surface-2)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {renderIconTile({
                              tint: folder.tint,
                              iconId: folder.icon || 'Folder',
                            })}
                            <span className="truncate font-display text-[15px] font-semibold">
                              {folder.name}
                            </span>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                </div>

                {/* Option: + Neuer Ordner */}
                <button
                  type="button"
                  onClick={() => {
                    const dId = deck.id;
                    setMoveTargetDeckId(null);
                    openEditor('create-folder', {
                      autoMoveDeckIdAfterFolderCreate: dId,
                    });
                  }}
                  className="w-full h-[44px] rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Neuer Ordner</span>
                </button>
              </div>
            </div>
          );
        })()}

      {/* ====================================================================
       * SHEET 4: ADD DECK INSIDE FOLDER ("+ Deck" button inside Folder View)
       * ==================================================================== */}
      {assignToFolderId &&
        (() => {
          const folder = folders.find((f) => f.id === assignToFolderId);
          if (!folder) return null;
          const availableDecks = userDecks.filter(
            (d) => d.folderId !== folder.id
          );

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Add deck to ${folder.name}`}
              onClick={() => setAssignToFolderId(null)}
              style={activeSheetBackdropStyle}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={activeSheetStyle}
                onTouchStart={activeSheetTouchHandlers.onTouchStart}
                onTouchMove={activeSheetTouchHandlers.onTouchMove}
                onTouchEnd={activeSheetTouchHandlers.onTouchEnd}
                onTouchCancel={activeSheetTouchHandlers.onTouchCancel}
                className="w-full max-w-md rounded-t-3xl sm:rounded-[var(--radius-card)] surface-overlay border p-5 pt-3 sm:pt-5 space-y-3.5 anatomy-sheet-enter"
              >
                <div
                  data-sheet-handle="true"
                  className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto sm:hidden"
                />
                <div
                  data-sheet-handle="true"
                  className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]"
                >
                  <div>
                    <h2 className="font-display text-[17px] font-semibold text-[var(--fg-primary)]">
                      Deck zu „{folder.name}“ hinzufügen
                    </h2>
                    <p className="font-sans text-[13px] text-[var(--fg-secondary)]">
                      Wähle ein bestehendes Deck oder erstelle ein neues Deck.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssignToFolderId(null)}
                    aria-label="Close"
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fId = folder.id;
                    setAssignToFolderId(null);
                    openEditor('create-deck', { initialFolderId: fId });
                  }}
                  className="w-full h-[44px] rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Neues Deck in „{folder.name}“ erstellen</span>
                </button>

                {availableDecks.length > 0 && (
                  <div
                    data-sheet-scroll="true"
                    className="space-y-1.5 max-h-60 overflow-y-auto pt-1"
                  >
                    <div className="font-sans text-[12px] font-semibold text-[var(--fg-muted)]">
                      Bestehende Decks hierher verschieben
                    </div>
                    {availableDecks.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          handleAssignDeckToFolder(d.id, folder.id);
                          setAssignToFolderId(null);
                        }}
                        className="w-full min-h-[48px] p-2 rounded-[var(--radius-control)] border surface-1 hover:bg-[var(--surface-2)] flex items-center justify-between gap-3 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {renderIconTile({
                            tint: d.tint,
                            iconId: d.iconId,
                            textTile: d.defaultTextTile,
                            useTextTile: d.useTextTile,
                          })}
                          <div className="min-w-0">
                            <div className="font-display text-[15px] font-semibold text-[var(--fg-primary)] truncate">
                              {d.title}
                            </div>
                            <div className="font-sans text-[12px] text-[var(--fg-muted)] tabular-nums">
                              {d.total} cards · {d.due} due
                            </div>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-[var(--intent-primary)] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      {/* ====================================================================
       * DIALOG 5: DELETE FOLDER DIALOG (2 Explicit Options per Spec §3)
       * ==================================================================== */}
      {deleteFolderTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ordner löschen"
          onClick={() => setDeleteFolderTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] sm:max-w-md rounded-[var(--radius-card)] surface-overlay border p-5 space-y-4 max-h-[85dvh] overflow-y-auto modal-pop-enter"
          >
            <div className="space-y-1">
              <h2 className="font-display text-[18px] font-bold text-[var(--fg-primary)]">
                Ordner „{deleteFolderTarget.name}“ löschen?
              </h2>
              <p className="font-sans text-[13px] text-[var(--fg-secondary)]">
                Wie soll mit den Decks in diesem Ordner verfahren werden?
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDeleteFolderKeepDecks(deleteFolderTarget)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-[var(--radius-control)] border surface-1 hover:bg-[var(--surface-2)] font-sans text-[13px] font-semibold text-[var(--fg-primary)] text-left cursor-pointer"
              >
                Nur Ordner löschen (Decks bleiben)
              </button>

              <button
                type="button"
                onClick={() => handleDeleteFolderAndDecks(deleteFolderTarget)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-[var(--radius-control)] border border-[var(--intent-danger-border)] bg-[var(--intent-danger-soft)] font-sans text-[13px] font-semibold text-[var(--intent-danger)] text-left cursor-pointer"
              >
                Ordner und Decks löschen
              </button>

              <button
                type="button"
                onClick={() => setDeleteFolderTarget(null)}
                className="w-full h-[44px] rounded-[var(--radius-control)] font-sans text-[13px] font-semibold text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] cursor-pointer"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * SHEET 6: FILTER SHEET ("CEFR Levels" & "6 Archetypes" per Spec §2)
       * ==================================================================== */}
      {isFilterSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter decks"
          onClick={() => setIsFilterSheetOpen(false)}
          style={activeSheetBackdropStyle}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={activeSheetStyle}
            onTouchStart={activeSheetTouchHandlers.onTouchStart}
            onTouchMove={activeSheetTouchHandlers.onTouchMove}
            onTouchEnd={activeSheetTouchHandlers.onTouchEnd}
            onTouchCancel={activeSheetTouchHandlers.onTouchCancel}
            className="w-full max-w-md rounded-t-3xl sm:rounded-[var(--radius-card)] surface-overlay border p-5 pt-3 sm:pt-5 space-y-4 anatomy-sheet-enter"
          >
            <div
              data-sheet-handle="true"
              className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto sm:hidden"
            />
            <div
              data-sheet-handle="true"
              className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]"
            >
              <h2 className="font-display text-[17px] font-semibold text-[var(--fg-primary)]">
                Decks filtern
              </h2>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                aria-label="Close filter sheet"
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CEFR Levels Filter */}
            <div className="space-y-2">
              <div className="font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                CEFR Levels
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => {
                  const active = filterCefr === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFilterCefr(lvl)}
                      className={`h-[44px] rounded-[var(--radius-control)] border font-sans text-[13px] font-semibold cursor-pointer ${
                        active
                          ? 'bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] border-transparent'
                          : 'surface-1 text-[var(--fg-primary)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      {lvl === 'ALL' ? 'Alle' : lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6 Grammar Archetypes Filter */}
            <div className="space-y-2">
              <div className="font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                6 Archetypes (Wortarten)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'ALL', label: 'Alle Wortarten' },
                    { id: 'verb', label: 'Verben' },
                    { id: 'noun', label: 'Nomen' },
                    { id: 'adj', label: 'Adjektive' },
                    { id: 'preposition', label: 'Präpositionen' },
                    { id: 'conn', label: 'Konnektoren' },
                    { id: 'phrase', label: 'Wendungen' },
                  ] as const
                ).map((arch) => {
                  const active = filterArchetype === arch.id;
                  return (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => setFilterArchetype(arch.id)}
                      className={`h-[44px] px-3 rounded-[var(--radius-control)] border font-sans text-[13px] font-semibold text-left truncate cursor-pointer ${
                        active
                          ? 'bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] border-transparent'
                          : 'surface-1 text-[var(--fg-primary)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      {arch.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFilterCefr('ALL');
                  setFilterArchetype('ALL');
                }}
                className="h-[44px] px-4 rounded-[var(--radius-control)] border surface-1 font-sans text-[13px] font-semibold text-[var(--fg-secondary)] cursor-pointer"
              >
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="h-[44px] flex-1 rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[13px] font-semibold cursor-pointer"
              >
                Anwenden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * SHEET 7: DECK / FOLDER EDITOR WITH 30-ICON + 6-TINT PICKER (Spec §4)
       * ==================================================================== */}
      {editorState &&
        (() => {
          const isFolderEditor =
            editorState.mode === 'create-folder' ||
            editorState.mode === 'edit-folder';
          const targetDeckForLevelCheck =
            editorState.targetId
              ? enrichedDecks.find((d) => d.id === editorState.targetId)
              : undefined;

          const filteredIcons = editorIconSearch.trim()
            ? ASSIGNABLE_ICONS.filter((ic) => {
                const q = editorIconSearch.trim().toLowerCase();
                return (
                  ic.label.toLowerCase().includes(q) ||
                  ic.group.toLowerCase().includes(q) ||
                  ic.keywords.some((kw) => kw.includes(q))
                );
              })
            : ASSIGNABLE_ICONS;

          const filteredCardsForPicker = editorCardSearch.trim()
            ? allCards.filter((c) => {
                const q = editorCardSearch.trim().toLowerCase();
                return (
                  c.lemma.toLowerCase().includes(q) ||
                  c.translation.toLowerCase().includes(q) ||
                  c.cefr.toLowerCase().includes(q)
                );
              })
            : allCards;

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={
                isFolderEditor ? 'Ordner anpassen' : 'Deck anpassen'
              }
              onClick={() => setEditorState(null)}
              style={activeSheetBackdropStyle}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs anatomy-backdrop-enter"
            >
              <div
                ref={sheetScrollRef}
                onClick={(e) => e.stopPropagation()}
                style={activeSheetStyle}
                onTouchStart={activeSheetTouchHandlers.onTouchStart}
                onTouchMove={activeSheetTouchHandlers.onTouchMove}
                onTouchEnd={activeSheetTouchHandlers.onTouchEnd}
                onTouchCancel={activeSheetTouchHandlers.onTouchCancel}
                className="w-full max-w-lg rounded-t-3xl sm:rounded-[var(--radius-card)] surface-overlay border p-5 pt-3 sm:pt-5 space-y-4 max-h-[90vh] overflow-y-auto anatomy-sheet-enter"
              >
                <div
                  data-sheet-handle="true"
                  className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto sm:hidden"
                />
                <div
                  data-sheet-handle="true"
                  className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-3">
                    {renderIconTile({
                      tint: editorTint,
                      iconId: editorIcon,
                      textTile: targetDeckForLevelCheck?.defaultTextTile,
                      useTextTile: editorUseTextTile,
                    })}
                    <div>
                      <h2 className="font-display text-[17px] font-semibold text-[var(--fg-primary)]">
                        {editorState.mode === 'create-folder'
                          ? 'Neuer Ordner'
                          : editorState.mode === 'edit-folder'
                          ? 'Ordner bearbeiten'
                          : editorState.mode === 'create-deck'
                          ? 'Neues Deck'
                          : 'Deck bearbeiten'}
                      </h2>
                      <p className="font-sans text-[12px] text-[var(--fg-muted)]">
                        Icon-Tile · 6 Theme-Farben · 30 Icons
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditorState(null)}
                    aria-label="Close editor"
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditor} className="space-y-4">
                  {/* Name Field (with live keyword-based icon suggestion) */}
                  <div className="space-y-1">
                    <label className="block font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                      {isFolderEditor ? 'Ordnername' : 'Deck-Titel'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editorName}
                      onChange={(e) => handleEditorNameChange(e.target.value)}
                      placeholder={
                        isFolderEditor
                          ? 'z. B. A2 Prüfung, Reise, Gefühle…'
                          : 'z. B. Reise & Bahnhof, Arbeit B1…'
                      }
                      className="w-full h-[44px] px-3.5 rounded-[var(--radius-control)] border surface-1 font-sans text-[14px] text-[var(--fg-primary)] shadow-ring theme-focus"
                    />
                  </div>

                  {/* Optional Folder Assignment for Decks (Hidden when inside a folder or editing a folder) */}
                  {!isFolderEditor && subScreen.type !== 'folder' && (
                    <div className="space-y-1">
                      <label className="block font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                        Ordner (optional, 1 Ebene)
                      </label>
                      <select
                        value={editorFolderId || ''}
                        onChange={(e) =>
                          setEditorFolderId(e.target.value || null)
                        }
                        className="w-full h-[44px] px-3 rounded-[var(--radius-control)] border surface-1 font-sans text-[13px] text-[var(--fg-primary)]"
                      >
                        <option value="">Kein Ordner (Lose auf Startseite)</option>
                        {[...folders]
                          .sort((a, b) => b.createdAt - a.createdAt)
                          .map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* 6 Theme-Token Tint Swatches */}
                  <div className="space-y-1.5">
                    <label className="block font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                      Farb-Akzent (6 Theme-Tints)
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {DECK_TINT_SWATCHES.map((swatch) => {
                        const isSelected = editorTint === swatch.id;
                        return (
                          <button
                            key={swatch.id}
                            type="button"
                            onClick={() => {
                              triggerHapticFeedback(6);
                              setEditorTint(swatch.id);
                            }}
                            title={swatch.label}
                            aria-label={swatch.label}
                            style={{
                              backgroundColor: swatch.bgVar,
                              color: swatch.fgVar,
                              borderColor: isSelected
                                ? swatch.fgVar
                                : 'transparent',
                            }}
                            className="h-[44px] rounded-[var(--radius-control)] border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-transform active:scale-95"
                          >
                            <span
                              style={{ backgroundColor: swatch.fgVar }}
                              className="w-4 h-4 rounded-full flex items-center justify-center"
                            >
                              {isSelected && (
                                <Check className="w-2.5 h-2.5 text-[var(--surface-1)]" />
                              )}
                            </span>
                            <span className="font-sans text-[10px] font-semibold leading-none">
                              {swatch.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level Text Tile Toggle if editing a Level Deck (A1 / A2 / B1) */}
                  {targetDeckForLevelCheck?.defaultTextTile && (
                    <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-control)] surface-2 border">
                      <span className="font-sans text-[12px] font-medium text-[var(--fg-primary)]">
                        Niveau-Text-Tile („{targetDeckForLevelCheck.defaultTextTile}“ in Fraunces)
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditorUseTextTile((prev) => !prev)}
                        className={`h-[34px] px-3 rounded-[var(--radius-pill)] font-sans text-[12px] font-semibold cursor-pointer ${
                          editorUseTextTile
                            ? 'bg-[var(--intent-primary)] text-[var(--intent-primary-fg)]'
                            : 'surface-1 border text-[var(--fg-secondary)]'
                        }`}
                      >
                        {editorUseTextTile ? 'Aktiv' : 'Icon nutzen'}
                      </button>
                    </div>
                  )}

                  {/* 5-Column Grouped Icon Picker (~30 Lucide Icons + Search Box) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                        Icon auswählen (6 Gruppen)
                      </label>
                      <div className="relative w-44">
                        <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="search"
                          value={editorIconSearch}
                          onChange={(e) => setEditorIconSearch(e.target.value)}
                          placeholder="Icon suchen…"
                          className="w-full h-[34px] pl-8 pr-2.5 rounded-[var(--radius-control)] border surface-1 font-sans text-[12px] text-[var(--fg-primary)]"
                        />
                      </div>
                    </div>

                    <div
                      data-sheet-scroll="true"
                      className="max-h-52 overflow-y-auto pr-1 space-y-3"
                    >
                      {ICON_GROUP_ORDER.map((groupName) => {
                        const groupIcons = filteredIcons.filter(
                          (i) => i.group === groupName
                        );
                        if (groupIcons.length === 0) return null;
                        const activeSwatch = getTintConfig(editorTint);

                        return (
                          <div key={groupName} className="space-y-1.5">
                            <div className="font-sans text-[11px] font-semibold text-[var(--fg-muted)]">
                              {groupName}
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {groupIcons.map((entry) => {
                                const IconComp = entry.component;
                                const isPicked =
                                  !editorUseTextTile && editorIcon === entry.id;
                                return (
                                  <button
                                    key={entry.id}
                                    type="button"
                                    onClick={() => {
                                      triggerHapticFeedback(6);
                                      setEditorIcon(entry.id);
                                      setEditorUseTextTile(false);
                                      setHasManualIconPick(true);
                                    }}
                                    title={entry.label}
                                    aria-label={entry.label}
                                    style={
                                      isPicked
                                        ? {
                                            backgroundColor: activeSwatch.bgVar,
                                            color: activeSwatch.fgVar,
                                            borderColor: activeSwatch.fgVar,
                                          }
                                        : undefined
                                    }
                                    className={`h-[44px] rounded-[14px] border flex items-center justify-center transition-all cursor-pointer ${
                                      isPicked
                                        ? 'border-2 shadow-ring'
                                        : 'surface-1 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)]'
                                    }`}
                                  >
                                    <IconComp
                                      className="w-5 h-5"
                                      strokeWidth={1.75}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Selection for Custom Decks (Confirmed in Phase 1) */}
                  {(editorState.mode === 'create-deck' ||
                    (editorState.mode === 'edit-deck' &&
                      customDecks.some(
                        (cd) => cd.id === editorState.targetId
                      ))) && (
                    <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-sans text-[12px] font-semibold text-[var(--fg-secondary)]">
                          Karten im Deck ({editorSelectedCardIds.length} ausgewählt)
                        </label>
                        <input
                          type="search"
                          value={editorCardSearch}
                          onChange={(e) => setEditorCardSearch(e.target.value)}
                          placeholder="Wort filtern…"
                          className="w-40 h-[34px] px-2.5 rounded-[var(--radius-control)] border surface-1 font-sans text-[12px] text-[var(--fg-primary)]"
                        />
                      </div>

                      <div
                        data-sheet-scroll="true"
                        className="max-h-40 overflow-y-auto divide-y divide-[var(--border-subtle)] rounded-[var(--radius-control)] border surface-1"
                      >
                        {filteredCardsForPicker.map((c) => {
                          const checked = editorSelectedCardIds.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setEditorSelectedCardIds((prev) =>
                                  prev.includes(c.id)
                                    ? prev.filter((id) => id !== c.id)
                                    : [...prev, c.id]
                                );
                              }}
                              className="w-full min-h-[44px] px-3 py-1.5 flex items-center justify-between gap-2 text-left hover:bg-[var(--surface-2)] cursor-pointer"
                            >
                              <div className="min-w-0">
                                <span className="font-display text-[14px] font-semibold text-[var(--fg-primary)]">
                                  {c.lemma}
                                </span>
                                <span className="font-sans text-[12px] text-[var(--fg-muted)]">
                                  {' '}
                                  · {c.translation} ({c.cefr})
                                </span>
                              </div>
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                  checked
                                    ? 'bg-[var(--intent-primary)] text-[var(--intent-primary-fg)]'
                                    : 'border border-[var(--border-strong)]'
                                }`}
                              >
                                {checked && <Check className="w-3.5 h-3.5" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditorState(null)}
                      className="h-[44px] px-4 rounded-[var(--radius-control)] border surface-1 font-sans text-[13px] font-semibold text-[var(--fg-secondary)] cursor-pointer"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      className="h-[44px] px-5 rounded-[var(--radius-control)] bg-[var(--intent-primary)] text-[var(--intent-primary-fg)] font-sans text-[13px] font-semibold cursor-pointer"
                    >
                      Speichern
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
