import React from 'react';
import {
  Apple,
  Archive,
  Award,
  BookMarked,
  BookOpen,
  Briefcase,
  Clock,
  Coffee,
  Compass,
  Flame,
  Folder,
  GitBranch,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Key,
  Laptop,
  Layers,
  Link2,
  MapPin,
  MessageSquare,
  Music,
  Plane,
  Shapes,
  ShoppingBag,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  Train,
  TrendingUp,
  Users,
  Utensils,
  Wine,
} from 'lucide-react';
import {
  CardCategory,
  CefrLevel,
  normalizeRatingKey,
  RatingKey,
} from '../data/vocabData';
import {
  DEFAULT_A2_CUSTOM_DECKS,
  DEFAULT_BUILTIN_CUSTOM_DECKS,
  DEFAULT_CONVERSATIONAL_DECKS,
} from '../data/defaultDecks';
import { syncWorkspaceToSupabase } from './supabaseSync';

export type DeckTintId =
  | 'sage'
  | 'terracotta'
  | 'ochre'
  | 'blue'
  | 'plum'
  | 'stone';

export interface TintSwatchConfig {
  id: DeckTintId;
  label: string;
  fgVar: string;
  bgVar: string;
  borderVar: string;
  barVar: string;
}

export const DECK_TINT_SWATCHES: TintSwatchConfig[] = [
  {
    id: 'sage',
    label: 'Salbei',
    fgVar: 'var(--intent-primary)',
    bgVar: 'var(--intent-primary-soft)',
    borderVar: 'var(--intent-primary-border)',
    barVar: 'var(--progress-bar-primary)',
  },
  {
    id: 'terracotta',
    label: 'Terrakotta',
    fgVar: 'var(--accent-terracotta)',
    bgVar: 'var(--accent-terracotta-soft)',
    borderVar: 'var(--intent-danger-border)',
    barVar: 'var(--progress-conf-2)',
  },
  {
    id: 'ochre',
    label: 'Ocker',
    fgVar: 'var(--intent-warning)',
    bgVar: 'var(--intent-warning-soft)',
    borderVar: 'var(--intent-warning-border)',
    barVar: 'var(--progress-bar-warning)',
  },
  {
    id: 'blue',
    label: 'Blau',
    fgVar: 'var(--accent-secondary)',
    bgVar: 'var(--accent-secondary-soft)',
    borderVar: 'var(--accent-secondary-border)',
    barVar: 'var(--progress-bar-secondary)',
  },
  {
    id: 'plum',
    label: 'Beere',
    fgVar: 'var(--intent-danger)',
    bgVar: 'var(--intent-danger-soft)',
    borderVar: 'var(--intent-danger-border)',
    barVar: 'var(--progress-bar-danger)',
  },
  {
    id: 'stone',
    label: 'Stein',
    fgVar: 'var(--fg-secondary)',
    bgVar: 'var(--surface-3)',
    borderVar: 'var(--border-strong)',
    barVar: 'var(--fg-muted)',
  },
];

export function getTintConfig(tint: DeckTintId): TintSwatchConfig {
  return (
    DECK_TINT_SWATCHES.find((s) => s.id === tint) || DECK_TINT_SWATCHES[0]
  );
}

export type IconGroupCategory =
  | 'Lernen'
  | 'Reisen'
  | 'Gefühle'
  | 'Arbeit'
  | 'Essen'
  | 'Alltag';

export interface AssignableIconEntry {
  id: string;
  label: string;
  group: IconGroupCategory;
  keywords: string[];
  component: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export const ASSIGNABLE_ICONS: AssignableIconEntry[] = [
  // 1. Lernen (5)
  {
    id: 'BookOpen',
    label: 'Buch',
    group: 'Lernen',
    keywords: ['lernen', 'buch', 'lesen', 'studium', 'wort', 'wortschatz', 'book', 'read'],
    component: BookOpen,
  },
  {
    id: 'GraduationCap',
    label: 'Abschluss',
    group: 'Lernen',
    keywords: ['prüfung', 'test', 'schule', 'uni', 'zertifikat', 'goethe', 'telc', 'b1', 'a2', 'a1', 'exam'],
    component: GraduationCap,
  },
  {
    id: 'Layers',
    label: 'Stapel',
    group: 'Lernen',
    keywords: ['karten', 'stapel', 'deck', 'sammlung', 'alle', 'cards', 'stack'],
    component: Layers,
  },
  {
    id: 'Sparkles',
    label: 'Fokus',
    group: 'Lernen',
    keywords: ['neu', 'fokus', 'smart', 'tipp', 'wichtig', 'magic', 'star'],
    component: Sparkles,
  },
  {
    id: 'Award',
    label: 'Auszeichnung',
    group: 'Lernen',
    keywords: ['erfolg', 'ziel', 'meister', 'award', 'medal', 'level'],
    component: Award,
  },

  // 2. Reisen (5)
  {
    id: 'Plane',
    label: 'Flugzeug',
    group: 'Reisen',
    keywords: ['reise', 'reisen', 'urlaub', 'flug', 'flughafen', 'ferien', 'travel', 'trip', 'flight'],
    component: Plane,
  },
  {
    id: 'Compass',
    label: 'Kompass',
    group: 'Reisen',
    keywords: ['richtung', 'orientierung', 'präposition', 'ort', 'weg', 'abenteuer', 'compass', 'direction'],
    component: Compass,
  },
  {
    id: 'MapPin',
    label: 'Ort',
    group: 'Reisen',
    keywords: ['stadt', 'ort', 'adresse', 'hotel', 'land', 'karte', 'city', 'place', 'map'],
    component: MapPin,
  },
  {
    id: 'Globe',
    label: 'Welt',
    group: 'Reisen',
    keywords: ['welt', 'sprache', 'international', 'ausland', 'kultur', 'world', 'globe'],
    component: Globe,
  },
  {
    id: 'Train',
    label: 'Bahn',
    group: 'Reisen',
    keywords: ['bahn', 'zug', 'verkehr', 'bahnhof', 'ticket', 'unterwegs', 'train', 'transit'],
    component: Train,
  },

  // 3. Gefühle (5)
  {
    id: 'Heart',
    label: 'Herz',
    group: 'Gefühle',
    keywords: ['gefühl', 'gefühle', 'liebe', 'herz', 'emotion', 'freundschaft', 'gesundheit', 'heart', 'love', 'feelings'],
    component: Heart,
  },
  {
    id: 'Smile',
    label: 'Freude',
    group: 'Gefühle',
    keywords: ['freude', 'glück', 'stimmung', 'laune', 'charakter', 'mensch', 'happy', 'smile', 'mood'],
    component: Smile,
  },
  {
    id: 'Flame',
    label: 'Energie',
    group: 'Gefühle',
    keywords: ['energie', 'leidenschaft', 'wut', 'intensiv', 'streak', 'feuer', 'fire', 'passion'],
    component: Flame,
  },
  {
    id: 'Sun',
    label: 'Sonne',
    group: 'Gefühle',
    keywords: ['wetter', 'sommer', 'morgen', 'tag', 'positiv', 'natur', 'sun', 'weather'],
    component: Sun,
  },
  {
    id: 'Star',
    label: 'Favorit',
    group: 'Gefühle',
    keywords: ['favorit', 'wunsch', 'traum', 'besonders', 'top', 'star', 'favorite'],
    component: Star,
  },

  // 4. Arbeit (5)
  {
    id: 'Briefcase',
    label: 'Beruf',
    group: 'Arbeit',
    keywords: ['arbeit', 'beruf', 'job', 'büro', 'karriere', 'firma', 'business', 'work', 'office'],
    component: Briefcase,
  },
  {
    id: 'Clock',
    label: 'Zeit',
    group: 'Arbeit',
    keywords: ['zeit', 'termin', 'alltag', 'fällig', 'stunde', 'kalender', 'time', 'schedule'],
    component: Clock,
  },
  {
    id: 'Target',
    label: 'Ziel',
    group: 'Arbeit',
    keywords: ['ziel', 'projekt', 'plan', 'strategie', 'fokus', 'target', 'goal'],
    component: Target,
  },
  {
    id: 'TrendingUp',
    label: 'Fortschritt',
    group: 'Arbeit',
    keywords: ['wirtschaft', 'finanzen', 'geld', 'wachstum', 'fortschritt', 'erfolg', 'growth', 'finance'],
    component: TrendingUp,
  },
  {
    id: 'Laptop',
    label: 'Technik',
    group: 'Arbeit',
    keywords: ['technik', 'computer', 'medien', 'digital', 'internet', 'email', 'tech', 'laptop'],
    component: Laptop,
  },

  // 5. Essen (5)
  {
    id: 'Coffee',
    label: 'Café',
    group: 'Essen',
    keywords: ['kaffee', 'café', 'frühstück', 'trinken', 'pause', 'getränk', 'coffee', 'drink'],
    component: Coffee,
  },
  {
    id: 'Utensils',
    label: 'Restaurant',
    group: 'Essen',
    keywords: ['essen', 'kochen', 'küche', 'restaurant', 'gericht', 'mahlzeit', 'food', 'cook'],
    component: Utensils,
  },
  {
    id: 'Apple',
    label: 'Obst',
    group: 'Essen',
    keywords: ['obst', 'gemüse', 'gesund', 'supermarkt', 'lebensmittel', 'natur', 'fruit', 'healthy'],
    component: Apple,
  },
  {
    id: 'Wine',
    label: 'Feier',
    group: 'Essen',
    keywords: ['wein', 'feier', 'party', 'abend', 'gäste', 'getränke', 'wine', 'dinner'],
    component: Wine,
  },
  {
    id: 'ShoppingBag',
    label: 'Einkauf',
    group: 'Essen',
    keywords: ['einkaufen', 'markt', 'laden', 'kleidung', 'preis', 'shop', 'shopping', 'store'],
    component: ShoppingBag,
  },

  // 6. Alltag (5)
  {
    id: 'Home',
    label: 'Zuhause',
    group: 'Alltag',
    keywords: ['alltag', 'haus', 'wohnung', 'wohnen', 'möbel', 'zimmer', 'familie', 'home', 'house'],
    component: Home,
  },
  {
    id: 'MessageSquare',
    label: 'Dialog',
    group: 'Alltag',
    keywords: ['gespräch', 'dialog', 'wendung', 'redemittel', 'sprechen', 'meinung', 'diskussion', 'phrase', 'chat'],
    component: MessageSquare,
  },
  {
    id: 'Music',
    label: 'Kultur',
    group: 'Alltag',
    keywords: ['musik', 'kunst', 'kultur', 'freizeit', 'hobby', 'film', 'music', 'art'],
    component: Music,
  },
  {
    id: 'Users',
    label: 'Menschen',
    group: 'Alltag',
    keywords: ['familie', 'freunde', 'gesellschaft', 'leute', 'team', 'sozial', 'people', 'friends'],
    component: Users,
  },
  {
    id: 'Key',
    label: 'Schlüssel',
    group: 'Alltag',
    keywords: ['wichtig', 'regel', 'grammatik', 'grundlagen', 'geheimnis', 'key', 'core'],
    component: Key,
  },
];

// Additional Grammar Archetype & System Icons mapped by ID
const ARCHETYPE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Archive,
  GitBranch,
  Shapes,
  SlidersHorizontal,
  Link2,
  BookMarked,
  Folder,
};

export const ICON_GROUP_ORDER: IconGroupCategory[] = [
  'Lernen',
  'Reisen',
  'Gefühle',
  'Arbeit',
  'Essen',
  'Alltag',
];

export function resolveIconComponent(
  iconId: string
): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const found = ASSIGNABLE_ICONS.find((i) => i.id === iconId);
  if (found) return found.component;
  if (ARCHETYPE_ICON_MAP[iconId]) return ARCHETYPE_ICON_MAP[iconId];
  return BookOpen;
}

export function suggestIconFromKeywords(
  title: string
): { iconId: string; tint?: DeckTintId } | null {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return null;

  for (const entry of ASSIGNABLE_ICONS) {
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      const groupTintMap: Record<IconGroupCategory, DeckTintId> = {
        Lernen: 'sage',
        Reisen: 'blue',
        Gefühle: 'plum',
        Arbeit: 'ochre',
        Essen: 'terracotta',
        Alltag: 'stone',
      };
      return { iconId: entry.id, tint: groupTintMap[entry.group] };
    }
  }
  return null;
}

// ============================================================================
// PERSISTENT FOLDERS, CUSTOM DECKS & DECK OVERRIDES
// ============================================================================

const FOLDERS_STORAGE_KEY = 'wortschatz_folders_v1';
const CUSTOM_DECKS_STORAGE_KEY = 'wortschatz_custom_decks_v1';
const DECK_OVERRIDES_STORAGE_KEY = 'wortschatz_deck_overrides_v1';
const LAST_PICKER_CHOICE_KEY = 'wortschatz_last_icon_tint_v1';
const DECK_SORT_STORAGE_KEY = 'wortschatz_deck_sort_v1';
const TEST_FOLDER_SEED_KEY = 'wortschatz_test_folder_seeded_v1';
const ARCHIVE_DUMMY_MIGRATION_KEY = 'wortschatz_archive_dummy_v1';

export const ARCHIVE_FOLDER_ID = 'folder-archive-dummy';
export const LEGACY_TEST_FOLDER_ID = 'folder-test-cefr';
export const A2_NETZWERK_FOLDER_ID = 'folder-a2-netzwerk';
export const ALLTAG_GESPRAECHE_FOLDER_ID = 'folder-alltag-gespraeche';

export const DEFAULT_A2_FOLDER: DeckFolder = {
  id: A2_NETZWERK_FOLDER_ID,
  name: 'A2 Netzwerk',
  icon: 'BookOpen',
  tint: 'sage',
  order: 0,
  createdAt: 1700000000000,
};

export const DEFAULT_ALLTAG_FOLDER: DeckFolder = {
  id: ALLTAG_GESPRAECHE_FOLDER_ID,
  name: 'Alltag & Gespräche',
  icon: 'MessageSquare',
  tint: 'terracotta',
  order: 1,
  createdAt: 1700000010000,
};

export const DEFAULT_BUILTIN_FOLDERS: DeckFolder[] = [
  DEFAULT_A2_FOLDER,
  DEFAULT_ALLTAG_FOLDER,
];

export const DUMMY_BUILTIN_DECK_IDS = [
  'verb',
  'noun',
  'adj',
  'preposition',
  'conn',
  'phrase',
  'cefr-a1',
  'cefr-a2',
  'cefr-b1',
] as const;

export type DeckSortOption = 'last-studied' | 'low-confidence' | 'name';

export type DeckStudyDirection = 'de-en' | 'en-de';

export function normalizeStudyDirection(dir?: unknown): DeckStudyDirection {
  return dir === 'en-de' ? 'en-de' : 'de-en';
}

export interface DeckFolder {
  id: string;
  name: string;
  icon: string;
  tint: DeckTintId;
  order: number;
  createdAt: number;
}

export interface CustomDeckRecord {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tint: DeckTintId;
  folderId: string | null;
  cardIds: string[];
  levelTag: string;
  studyDirection?: DeckStudyDirection;
  createdAt: number;
}

export interface DeckMetaOverride {
  title?: string;
  icon?: string;
  tint?: DeckTintId;
  folderId?: string | null;
  hidden?: boolean;
  studyDirection?: DeckStudyDirection;
}

export interface UnifiedDeckItem {
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
  /** If set (e.g. 'A1', 'A2', 'B1') and no custom icon override, render Fraunces text tile */
  defaultTextTile?: string;
  iconId: string;
  tint: DeckTintId;
  folderId: string | null;
  studyDirection: DeckStudyDirection;
  createdAt: number;
}

export function ensureBuiltInA2Workspace(params: {
  folders: DeckFolder[];
  customDecks: CustomDeckRecord[];
}): {
  folders: DeckFolder[];
  customDecks: CustomDeckRecord[];
  changed: boolean;
} {
  let changed = false;

  const existingA2Folder = params.folders.find(
    (f) =>
      f.id === A2_NETZWERK_FOLDER_ID ||
      f.name.trim().toLowerCase() === 'a2 netzwerk'
  );
  const targetA2FolderId = existingA2Folder?.id || A2_NETZWERK_FOLDER_ID;

  const existingAlltagFolder = params.folders.find(
    (f) =>
      f.id === ALLTAG_GESPRAECHE_FOLDER_ID ||
      f.name.trim().toLowerCase() === 'alltag & gespräche'
  );
  const targetAlltagFolderId =
    existingAlltagFolder?.id || ALLTAG_GESPRAECHE_FOLDER_ID;

  let nextFolders = [...params.folders];
  if (!existingAlltagFolder) {
    nextFolders = [DEFAULT_ALLTAG_FOLDER, ...nextFolders];
    changed = true;
  }
  if (!existingA2Folder) {
    nextFolders = [DEFAULT_A2_FOLDER, ...nextFolders];
    changed = true;
  }

  const defaultA2ById = new Map(
    DEFAULT_A2_CUSTOM_DECKS.map((d) => [d.id, d] as const)
  );
  const defaultConvById = new Map(
    DEFAULT_CONVERSATIONAL_DECKS.map((d) => [d.id, d] as const)
  );

  const nextCustomDecks = params.customDecks.map((cd) => {
    const isA2Deck = cd.id.startsWith('a2-deck-');
    const isConvDeck = cd.id.startsWith('chat-deck-');
    if (!isA2Deck && !isConvDeck) return cd;

    const canonical = isA2Deck
      ? defaultA2ById.get(cd.id)
      : defaultConvById.get(cd.id);
    const targetFolderId = isA2Deck ? targetA2FolderId : targetAlltagFolderId;

    let deckChanged = false;
    let nextDeck = cd;

    if (nextDeck.folderId !== targetFolderId) {
      nextDeck = { ...nextDeck, folderId: targetFolderId };
      deckChanged = true;
    }

    if (canonical) {
      const existingCardIdSet = new Set(nextDeck.cardIds);
      const missingCardIds = canonical.cardIds.filter(
        (id) => !existingCardIdSet.has(id)
      );
      if (missingCardIds.length > 0) {
        nextDeck = {
          ...nextDeck,
          cardIds: [...nextDeck.cardIds, ...missingCardIds],
          subtitle: canonical.subtitle,
        };
        deckChanged = true;
      } else if (isConvDeck && nextDeck.subtitle !== canonical.subtitle) {
        nextDeck = {
          ...nextDeck,
          subtitle: canonical.subtitle,
        };
        deckChanged = true;
      }
    }

    if (deckChanged) changed = true;
    return nextDeck;
  });

  const existingDeckIds = new Set(nextCustomDecks.map((d) => d.id));
  for (const d of DEFAULT_A2_CUSTOM_DECKS) {
    if (!existingDeckIds.has(d.id)) {
      nextCustomDecks.push({ ...d, folderId: targetA2FolderId });
      changed = true;
    }
  }
  for (const d of DEFAULT_CONVERSATIONAL_DECKS) {
    if (!existingDeckIds.has(d.id)) {
      nextCustomDecks.push({
        ...d,
        folderId: targetAlltagFolderId,
        studyDirection: 'de-en',
      });
      changed = true;
    }
  }

  return {
    folders: nextFolders,
    customDecks: nextCustomDecks,
    changed,
  };
}

export function hasMissingBuiltInA2Workspace(params: {
  folders?: DeckFolder[];
  customDecks?: CustomDeckRecord[];
}): boolean {
  const folders = params.folders || [];
  const customDecks = params.customDecks || [];

  const a2Folder = folders.find(
    (f) =>
      f.id === A2_NETZWERK_FOLDER_ID ||
      f.name.trim().toLowerCase() === 'a2 netzwerk'
  );
  if (!a2Folder) return true;

  const alltagFolder = folders.find(
    (f) =>
      f.id === ALLTAG_GESPRAECHE_FOLDER_ID ||
      f.name.trim().toLowerCase() === 'alltag & gespräche'
  );
  if (!alltagFolder) return true;

  const customDeckById = new Map(customDecks.map((d) => [d.id, d] as const));
  for (const def of DEFAULT_A2_CUSTOM_DECKS) {
    const existing = customDeckById.get(def.id);
    if (!existing) return true;
    if (existing.folderId !== a2Folder.id) return true;
    if (existing.cardIds.length < def.cardIds.length) return true;
  }
  for (const def of DEFAULT_CONVERSATIONAL_DECKS) {
    const existing = customDeckById.get(def.id);
    if (!existing) return true;
    if (existing.folderId !== alltagFolder.id) return true;
    if (existing.cardIds.length < def.cardIds.length) return true;
    if (existing.subtitle !== def.subtitle) return true;
  }

  return false;
}

export function loadFolders(): DeckFolder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) return [...DEFAULT_BUILTIN_FOLDERS];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...DEFAULT_BUILTIN_FOLDERS];
    }
    let updated = [...parsed];
    let mutated = false;
    const hasAlltag = updated.some(
      (f: DeckFolder) =>
        f.id === ALLTAG_GESPRAECHE_FOLDER_ID ||
        f.name.trim().toLowerCase() === 'alltag & gespräche'
    );
    if (!hasAlltag) {
      updated = [DEFAULT_ALLTAG_FOLDER, ...updated];
      mutated = true;
    }
    const hasA2 = updated.some(
      (f: DeckFolder) =>
        f.id === A2_NETZWERK_FOLDER_ID ||
        f.name.trim().toLowerCase() === 'a2 netzwerk'
    );
    if (!hasA2) {
      updated = [DEFAULT_A2_FOLDER, ...updated];
      mutated = true;
    }
    if (mutated) {
      saveFolders(updated, true);
    }
    return updated;
  } catch {
    return [...DEFAULT_BUILTIN_FOLDERS];
  }
}

export function saveFolders(
  folders: DeckFolder[],
  skipRemoteSync = false
): void {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch {
    // Ignore storage errors
  }
  if (!skipRemoteSync) {
    void syncWorkspaceToSupabase({ folders });
  }
}

export function loadCustomDecks(): CustomDeckRecord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DECKS_STORAGE_KEY);
    if (!raw) return DEFAULT_BUILTIN_CUSTOM_DECKS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_BUILTIN_CUSTOM_DECKS;
    }
    const folders = loadFolders();
    const normalized = ensureBuiltInA2Workspace({
      folders,
      customDecks: parsed,
    });
    if (normalized.changed) {
      saveCustomDecks(normalized.customDecks, true);
    }
    return normalized.customDecks;
  } catch {
    return DEFAULT_BUILTIN_CUSTOM_DECKS;
  }
}

export function saveCustomDecks(
  decks: CustomDeckRecord[],
  skipRemoteSync = false
): void {
  try {
    localStorage.setItem(CUSTOM_DECKS_STORAGE_KEY, JSON.stringify(decks));
  } catch {
    // Ignore storage errors
  }
  if (!skipRemoteSync) {
    void syncWorkspaceToSupabase({ customDecks: decks });
  }
}

export function loadDeckOverrides(): Record<string, DeckMetaOverride> {
  try {
    const raw = localStorage.getItem(DECK_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveDeckOverrides(
  overrides: Record<string, DeckMetaOverride>,
  skipRemoteSync = false
): void {
  try {
    localStorage.setItem(DECK_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage errors
  }
  if (!skipRemoteSync) {
    void syncWorkspaceToSupabase({ deckOverrides: overrides });
  }
}

export function archiveDummyDecksInWorkspace(params: {
  folders: DeckFolder[];
  customDecks: CustomDeckRecord[];
  deckOverrides: Record<string, DeckMetaOverride>;
}): {
  folders: DeckFolder[];
  customDecks: CustomDeckRecord[];
  deckOverrides: Record<string, DeckMetaOverride>;
  changed: boolean;
} {
  let changed = false;

  const existingArchive = params.folders.find(
    (f) =>
      f.id === ARCHIVE_FOLDER_ID || f.name.trim().toLowerCase() === 'archive'
  );
  const archiveFolderId = existingArchive?.id || ARCHIVE_FOLDER_ID;

  let nextFolders = params.folders.filter((f) => {
    if (f.id === LEGACY_TEST_FOLDER_ID) {
      changed = true;
      return false;
    }
    return true;
  });

  if (!existingArchive) {
    nextFolders = [
      ...nextFolders,
      {
        id: archiveFolderId,
        name: 'Archive',
        icon: 'Archive',
        tint: 'stone',
        order: nextFolders.length,
        createdAt: Date.now(),
      },
    ];
    changed = true;
  }

  const nextOverrides: Record<string, DeckMetaOverride> = {
    ...params.deckOverrides,
  };
  for (const deckId of DUMMY_BUILTIN_DECK_IDS) {
    const prev = nextOverrides[deckId] || {};
    if (!prev.hidden && prev.folderId !== archiveFolderId) {
      nextOverrides[deckId] = {
        ...prev,
        folderId: archiveFolderId,
      };
      changed = true;
    }
  }

  const archivedCustomDecks = params.customDecks.map((cd) => {
    if (
      cd.id.startsWith('a2-deck-') ||
      cd.id.startsWith('chat-deck-') ||
      cd.folderId === A2_NETZWERK_FOLDER_ID ||
      cd.folderId === ALLTAG_GESPRAECHE_FOLDER_ID
    ) {
      return cd;
    }
    if (cd.folderId !== archiveFolderId) {
      changed = true;
      return { ...cd, folderId: archiveFolderId };
    }
    return cd;
  });

  const ensuredA2 = ensureBuiltInA2Workspace({
    folders: nextFolders,
    customDecks: archivedCustomDecks,
  });

  return {
    folders: ensuredA2.folders,
    customDecks: ensuredA2.customDecks,
    deckOverrides: nextOverrides,
    changed: changed || ensuredA2.changed,
  };
}

export function needsRemoteArchiveDummyMigration(params: {
  folders?: DeckFolder[];
  deckOverrides?: Record<string, DeckMetaOverride>;
}): boolean {
  const folders = params.folders || [];
  const hasArchiveFolder = folders.some(
    (f) =>
      f.id === ARCHIVE_FOLDER_ID || f.name.trim().toLowerCase() === 'archive'
  );
  if (hasArchiveFolder) return false;

  const hasLegacyTestFolder = folders.some(
    (f) => f.id === LEGACY_TEST_FOLDER_ID
  );
  const overrides = params.deckOverrides || {};
  const hasLooseDummyBuiltin = DUMMY_BUILTIN_DECK_IDS.some(
    (id) => !overrides[id]?.hidden && !overrides[id]?.folderId
  );

  return hasLegacyTestFolder || hasLooseDummyBuiltin;
}

export function ensureInitialTestFolderSeed(): {
  folders: DeckFolder[];
  customDecks: CustomDeckRecord[];
  deckOverrides: Record<string, DeckMetaOverride>;
} {
  const folders = loadFolders();
  const customDecks = loadCustomDecks();
  const deckOverrides = loadDeckOverrides();

  try {
    const alreadyArchived =
      localStorage.getItem(ARCHIVE_DUMMY_MIGRATION_KEY) === '1';
    if (!alreadyArchived) {
      const migrated = archiveDummyDecksInWorkspace({
        folders,
        customDecks,
        deckOverrides,
      });
      saveFolders(migrated.folders, true);
      saveCustomDecks(migrated.customDecks, true);
      saveDeckOverrides(migrated.deckOverrides, true);
      localStorage.setItem(TEST_FOLDER_SEED_KEY, '1');
      localStorage.setItem(ARCHIVE_DUMMY_MIGRATION_KEY, '1');
      return {
        folders: migrated.folders,
        customDecks: migrated.customDecks,
        deckOverrides: migrated.deckOverrides,
      };
    }

    const ensured = ensureBuiltInA2Workspace({ folders, customDecks });
    if (ensured.changed) {
      saveFolders(ensured.folders, true);
      saveCustomDecks(ensured.customDecks, true);
    }
    return {
      folders: ensured.folders,
      customDecks: ensured.customDecks,
      deckOverrides,
    };
  } catch {
    // Ignore storage errors
  }

  return { folders, customDecks, deckOverrides };
}

export function loadDeckSortOption(): DeckSortOption {
  try {
    const raw = localStorage.getItem(DECK_SORT_STORAGE_KEY);
    if (raw === 'last-studied' || raw === 'low-confidence' || raw === 'name') {
      return raw;
    }
    if (raw === 'due') {
      return 'low-confidence';
    }
  } catch {
    // Fallback
  }
  return 'name';
}

export function saveDeckSortOption(
  sort: DeckSortOption,
  skipRemoteSync = false
): void {
  try {
    localStorage.setItem(DECK_SORT_STORAGE_KEY, sort);
  } catch {
    // Ignore storage errors
  }
  if (!skipRemoteSync) {
    void syncWorkspaceToSupabase({ deckSort: sort });
  }
}

export function loadLastPickerChoice(): {
  icon: string;
  tint: DeckTintId;
} {
  try {
    const raw = localStorage.getItem(LAST_PICKER_CHOICE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.icon && parsed?.tint) {
        return { icon: parsed.icon, tint: parsed.tint };
      }
    }
  } catch {
    // Fallback
  }
  return { icon: 'BookOpen', tint: 'sage' };
}

export function saveLastPickerChoice(choice: {
  icon: string;
  tint: DeckTintId;
}): void {
  try {
    localStorage.setItem(LAST_PICKER_CHOICE_KEY, JSON.stringify(choice));
  } catch {
    // Ignore storage errors
  }
}

const LAST_STUDY_SESSION_KEY = 'achsoo_last_study_session_v1';
const STUDY_DECK_POSITIONS_KEY = 'achsoo_study_positions_v1';

export interface LastStudySessionState {
  deckId: string;
  isCustomQueue: boolean;
  shortTitle?: string;
  studyDirection?: DeckStudyDirection;
  cardIds?: string[];
}

export interface StudyDeckPosition {
  index: number;
  cardId?: string;
}

export function loadLastStudySession(): LastStudySessionState | null {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(LAST_STUDY_SESSION_KEY)
        : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastStudySessionState>;
    if (!parsed || typeof parsed.deckId !== 'string' || !parsed.deckId.trim()) {
      return null;
    }
    return {
      deckId:
        parsed.deckId === 'due' ? 'low-confidence' : parsed.deckId,
      isCustomQueue: Boolean(parsed.isCustomQueue),
      shortTitle:
        typeof parsed.shortTitle === 'string' ? parsed.shortTitle : undefined,
      studyDirection:
        parsed.studyDirection === 'en-de'
          ? 'en-de'
          : parsed.studyDirection === 'de-en'
          ? 'de-en'
          : undefined,
      cardIds: Array.isArray(parsed.cardIds)
        ? parsed.cardIds.filter((id): id is string => typeof id === 'string')
        : undefined,
    };
  } catch {
    return null;
  }
}

export function saveLastStudySession(session: LastStudySessionState): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAST_STUDY_SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore storage errors
  }
}

export function loadStudyDeckPositions(): Record<string, StudyDeckPosition> {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(STUDY_DECK_POSITIONS_KEY)
        : null;
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StudyDeckPosition>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveStudyDeckPosition(
  deckId: string,
  index: number,
  cardId?: string
): void {
  if (!deckId) return;
  try {
    if (typeof localStorage === 'undefined') return;
    const current = loadStudyDeckPositions();
    const safeIndex = Math.max(0, Math.floor(index));
    current[deckId] = cardId
      ? { index: safeIndex, cardId }
      : { index: safeIndex };
    localStorage.setItem(STUDY_DECK_POSITIONS_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage errors
  }
}

export function resolveSavedDeckIndex(
  cards: { id: string }[],
  saved?: StudyDeckPosition | null
): number {
  if (!cards.length || !saved) return 0;
  if (saved.cardId) {
    const byId = cards.findIndex((c) => c.id === saved.cardId);
    if (byId >= 0) return byId;
  }
  if (typeof saved.index === 'number' && Number.isFinite(saved.index)) {
    return Math.max(0, Math.min(cards.length - 1, Math.floor(saved.index)));
  }
  return 0;
}

const STUDY_DECK_TRAILS_KEY = 'achsoo_study_trails_v1';
const MAX_STUDY_TRAIL_ENTRIES = 250;

export interface StudyVisitEntry {
  cardId: string;
  rating?: RatingKey;
  ratedAt?: string;
}

export interface StudyDeckTrail {
  entries: StudyVisitEntry[];
  cursor: number;
}

function clampTrail(trail: StudyDeckTrail): StudyDeckTrail {
  if (trail.entries.length === 0) {
    return { entries: [], cursor: 0 };
  }
  let entries = trail.entries;
  let cursor = Math.max(0, Math.min(entries.length - 1, Math.floor(trail.cursor)));
  if (entries.length > MAX_STUDY_TRAIL_ENTRIES) {
    const overflow = entries.length - MAX_STUDY_TRAIL_ENTRIES;
    entries = entries.slice(overflow);
    cursor = Math.max(0, cursor - overflow);
  }
  return { entries, cursor };
}

export function loadStudyDeckTrails(): Record<string, StudyDeckTrail> {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(STUDY_DECK_TRAILS_KEY)
        : null;
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StudyDeckTrail>;
    if (!parsed || typeof parsed !== 'object') return {};
    const normalized: Record<string, StudyDeckTrail> = {};
    for (const [deckId, trail] of Object.entries(parsed)) {
      if (
        trail &&
        Array.isArray(trail.entries) &&
        typeof trail.cursor === 'number'
      ) {
        const targetDeckId = deckId === 'due' ? 'low-confidence' : deckId;
        normalized[targetDeckId] = clampTrail({
          entries: trail.entries
            .filter(
              (e): e is StudyVisitEntry =>
                Boolean(e) && typeof e.cardId === 'string'
            )
            .map((e) => ({
              ...e,
              rating: e.rating ? normalizeRatingKey(e.rating) : undefined,
            })),
          cursor: trail.cursor,
        });
      }
    }
    return normalized;
  } catch {
    return {};
  }
}

export function saveStudyDeckTrail(
  deckId: string,
  trail: StudyDeckTrail
): void {
  if (!deckId) return;
  try {
    if (typeof localStorage === 'undefined') return;
    const current = loadStudyDeckTrails();
    current[deckId] = clampTrail(trail);
    localStorage.setItem(STUDY_DECK_TRAILS_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage errors
  }
}

export function clearStudyDeckTrail(deckId?: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    if (!deckId) {
      localStorage.removeItem(STUDY_DECK_TRAILS_KEY);
      return;
    }
    const current = loadStudyDeckTrails();
    if (deckId in current) {
      delete current[deckId];
      localStorage.setItem(STUDY_DECK_TRAILS_KEY, JSON.stringify(current));
    }
  } catch {
    // Ignore storage errors
  }
}

export function syncTrailWithDeck(
  trail: StudyDeckTrail | undefined,
  cards: { id: string }[],
  currentCardId?: string,
  pruneMissingCards = false
): StudyDeckTrail {
  if (cards.length === 0) {
    return { entries: [], cursor: 0 };
  }

  const validIds = new Set(cards.map((c) => c.id));
  const targetId =
    currentCardId && validIds.has(currentCardId) ? currentCardId : cards[0].id;

  if (!trail || trail.entries.length === 0) {
    return { entries: [{ cardId: targetId }], cursor: 0 };
  }

  let nextEntries = trail.entries;
  let nextCursor = Math.max(
    0,
    Math.min(nextEntries.length - 1, Math.floor(trail.cursor))
  );

  if (pruneMissingCards) {
    const filtered: StudyVisitEntry[] = [];
    let adjustedCursor = 0;
    nextEntries.forEach((entry, idx) => {
      if (validIds.has(entry.cardId)) {
        filtered.push(entry);
        if (idx <= nextCursor) {
          adjustedCursor = filtered.length - 1;
        }
      }
    });
    nextEntries = filtered;
    nextCursor = Math.max(0, adjustedCursor);
  } else {
    // Even in regular decks, remove entries whose cardId no longer exists in the deck
    const hasStale = nextEntries.some((e) => !validIds.has(e.cardId));
    if (hasStale) {
      const filtered: StudyVisitEntry[] = [];
      let adjustedCursor = 0;
      nextEntries.forEach((entry, idx) => {
        if (validIds.has(entry.cardId)) {
          filtered.push(entry);
          if (idx <= nextCursor) {
            adjustedCursor = filtered.length - 1;
          }
        }
      });
      nextEntries = filtered;
      nextCursor = Math.max(0, adjustedCursor);
    }
  }

  if (nextEntries.length === 0) {
    return { entries: [{ cardId: targetId }], cursor: 0 };
  }

  if (nextEntries[nextCursor]?.cardId === targetId) {
    return clampTrail({ entries: nextEntries, cursor: nextCursor });
  }

  // If the target card is already the trailing unrated card, point cursor to it;
  // otherwise append a fresh unrated visit for the target card.
  const lastIdx = nextEntries.length - 1;
  if (nextEntries[lastIdx]?.cardId === targetId && !nextEntries[lastIdx]?.rating) {
    return clampTrail({ entries: nextEntries, cursor: lastIdx });
  }

  return clampTrail({
    entries: [...nextEntries, { cardId: targetId }],
    cursor: nextEntries.length,
  });
}

export function recordTrailRating(
  trail: StudyDeckTrail,
  rating: RatingKey,
  nextCardId: string | undefined,
  options?: {
    isDueDeck?: boolean;
    validNextDeckCardIds?: string[];
    ratedAtIso?: string;
  }
): StudyDeckTrail {
  const ratedAt = options?.ratedAtIso || new Date().toISOString();
  const entries = trail.entries.map((e) => ({ ...e }));

  if (entries.length === 0) {
    return nextCardId
      ? { entries: [{ cardId: nextCardId }], cursor: 0 }
      : { entries: [], cursor: 0 };
  }

  const safeCursor = Math.max(0, Math.min(entries.length - 1, trail.cursor));
  entries[safeCursor] = {
    ...entries[safeCursor],
    rating,
    ratedAt,
  };

  if (options?.isDueDeck) {
    const validSet = new Set(options.validNextDeckCardIds || []);
    const pruned = entries.filter((e) => validSet.has(e.cardId));
    if (!nextCardId) {
      return clampTrail({
        entries: pruned,
        cursor: Math.max(0, pruned.length - 1),
      });
    }
    const last = pruned[pruned.length - 1];
    if (last && last.cardId === nextCardId && !last.rating) {
      return clampTrail({ entries: pruned, cursor: pruned.length - 1 });
    }
    pruned.push({ cardId: nextCardId });
    return clampTrail({ entries: pruned, cursor: pruned.length - 1 });
  }

  if (safeCursor < entries.length - 1) {
    return clampTrail({
      entries,
      cursor: safeCursor + 1,
    });
  }

  if (nextCardId) {
    entries.push({ cardId: nextCardId });
  }

  return clampTrail({
    entries,
    cursor: Math.max(0, entries.length - 1),
  });
}

export function canStepTrailPrev(
  trail: StudyDeckTrail,
  cards: { id: string }[]
): boolean {
  if (trail.cursor <= 0 || trail.entries.length <= 1) return false;
  const validIds = new Set(cards.map((c) => c.id));
  for (let i = trail.cursor - 1; i >= 0; i--) {
    if (validIds.has(trail.entries[i].cardId)) return true;
  }
  return false;
}

export function stepTrailPrev(
  trail: StudyDeckTrail,
  cards: { id: string }[]
): { trail: StudyDeckTrail; prevDeckIndex: number } | null {
  if (trail.cursor <= 0 || trail.entries.length === 0) return null;
  for (let i = trail.cursor - 1; i >= 0; i--) {
    const deckIdx = cards.findIndex((c) => c.id === trail.entries[i].cardId);
    if (deckIdx >= 0) {
      return {
        trail: { ...trail, cursor: i },
        prevDeckIndex: deckIdx,
      };
    }
  }
  return null;
}

export function stepTrailNext(
  trail: StudyDeckTrail,
  cards: { id: string }[]
):
  | { blocked: true }
  | { blocked: false; trail: StudyDeckTrail; nextDeckIndex: number } {
  if (cards.length === 0 || trail.entries.length === 0) {
    return { blocked: true };
  }
  const safeCursor = Math.max(
    0,
    Math.min(trail.entries.length - 1, trail.cursor)
  );
  const currentEntry = trail.entries[safeCursor];
  if (!currentEntry?.rating) {
    return { blocked: true };
  }

  if (safeCursor < trail.entries.length - 1) {
    for (let i = safeCursor + 1; i < trail.entries.length; i++) {
      const deckIdx = cards.findIndex((c) => c.id === trail.entries[i].cardId);
      if (deckIdx >= 0) {
        return {
          blocked: false,
          trail: { ...trail, cursor: i },
          nextDeckIndex: deckIdx,
        };
      }
    }
  }

  const curDeckIdx = cards.findIndex((c) => c.id === currentEntry.cardId);
  const nextDeckIndex =
    cards.length <= 1 ? 0 : ((curDeckIdx >= 0 ? curDeckIdx : 0) + 1) % cards.length;
  const nextCard = cards[nextDeckIndex];
  const nextEntries = [...trail.entries, { cardId: nextCard.id }];

  return {
    blocked: false,
    trail: clampTrail({
      entries: nextEntries,
      cursor: nextEntries.length - 1,
    }),
    nextDeckIndex,
  };
}

export function clearTrailRatingForUndo(
  trail: StudyDeckTrail,
  undoneCardId: string,
  cards: { id: string }[]
): { trail: StudyDeckTrail; deckIndex: number } {
  const entries = trail.entries.map((e) => ({ ...e }));
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].cardId === undoneCardId && entries[i].rating) {
      const { rating: _r, ratedAt: _ra, ...rest } = entries[i];
      entries[i] = rest;
      // If the trailing entry after the undone card is an unrated frontier card, drop it
      const trimmed =
        i === entries.length - 2 && !entries[entries.length - 1]?.rating
          ? entries.slice(0, i + 1)
          : entries;
      const deckIdx = cards.findIndex((c) => c.id === undoneCardId);
      return {
        trail: clampTrail({ entries: trimmed, cursor: i }),
        deckIndex: deckIdx >= 0 ? deckIdx : 0,
      };
    }
  }
  const fallbackIdx = cards.findIndex((c) => c.id === undoneCardId);
  return {
    trail,
    deckIndex: fallbackIdx >= 0 ? fallbackIdx : 0,
  };
}

export function clearLocalWorkspaceData(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(FOLDERS_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_DECKS_STORAGE_KEY);
    localStorage.removeItem(DECK_OVERRIDES_STORAGE_KEY);
    localStorage.removeItem(DECK_SORT_STORAGE_KEY);
    localStorage.removeItem(TEST_FOLDER_SEED_KEY);
    localStorage.removeItem(ARCHIVE_DUMMY_MIGRATION_KEY);
    localStorage.removeItem(LAST_STUDY_SESSION_KEY);
    localStorage.removeItem(STUDY_DECK_POSITIONS_KEY);
    localStorage.removeItem(STUDY_DECK_TRAILS_KEY);
  } catch {
    // Ignore storage errors
  }
}


