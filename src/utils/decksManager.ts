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
import { CardCategory, CefrLevel } from '../data/vocabData';
import { DEFAULT_A2_CUSTOM_DECKS } from '../data/defaultDecks';
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
}

export const DECK_TINT_SWATCHES: TintSwatchConfig[] = [
  {
    id: 'sage',
    label: 'Salbei',
    fgVar: 'var(--intent-primary)',
    bgVar: 'var(--intent-primary-soft)',
    borderVar: 'var(--intent-primary-border)',
  },
  {
    id: 'terracotta',
    label: 'Terrakotta',
    fgVar: 'var(--accent-terracotta)',
    bgVar: 'var(--accent-terracotta-soft)',
    borderVar: 'var(--intent-danger-border)',
  },
  {
    id: 'ochre',
    label: 'Ocker',
    fgVar: 'var(--intent-warning)',
    bgVar: 'var(--intent-warning-soft)',
    borderVar: 'var(--intent-warning-border)',
  },
  {
    id: 'blue',
    label: 'Blau',
    fgVar: 'var(--accent-secondary)',
    bgVar: 'var(--accent-secondary-soft)',
    borderVar: 'var(--accent-secondary-border)',
  },
  {
    id: 'plum',
    label: 'Beere',
    fgVar: 'var(--intent-danger)',
    bgVar: 'var(--intent-danger-soft)',
    borderVar: 'var(--intent-danger-border)',
  },
  {
    id: 'stone',
    label: 'Stein',
    fgVar: 'var(--fg-secondary)',
    bgVar: 'var(--surface-3)',
    borderVar: 'var(--border-strong)',
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

export const DEFAULT_A2_FOLDER: DeckFolder = {
  id: A2_NETZWERK_FOLDER_ID,
  name: 'A2 Netzwerk',
  icon: 'BookOpen',
  tint: 'sage',
  order: 0,
  createdAt: 1700000000000,
};

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

export type DeckSortOption = 'last-studied' | 'due' | 'name';

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
  createdAt: number;
}

export interface DeckMetaOverride {
  title?: string;
  icon?: string;
  tint?: DeckTintId;
  folderId?: string | null;
  hidden?: boolean;
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

  let nextFolders = [...params.folders];
  if (!existingA2Folder) {
    nextFolders = [DEFAULT_A2_FOLDER, ...nextFolders];
    changed = true;
  }

  const defaultA2ById = new Map(
    DEFAULT_A2_CUSTOM_DECKS.map((d) => [d.id, d] as const)
  );

  const nextCustomDecks = params.customDecks.map((cd) => {
    if (!cd.id.startsWith('a2-deck-')) return cd;
    const canonical = defaultA2ById.get(cd.id);
    let deckChanged = false;
    let nextDeck = cd;

    if (nextDeck.folderId !== targetA2FolderId) {
      nextDeck = { ...nextDeck, folderId: targetA2FolderId };
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

  const customDeckById = new Map(customDecks.map((d) => [d.id, d] as const));
  for (const def of DEFAULT_A2_CUSTOM_DECKS) {
    const existing = customDeckById.get(def.id);
    if (!existing) return true;
    if (existing.folderId !== a2Folder.id) return true;
    if (existing.cardIds.length < def.cardIds.length) return true;
  }

  return false;
}

export function loadFolders(): DeckFolder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) return [DEFAULT_A2_FOLDER];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [DEFAULT_A2_FOLDER];
    const hasA2 = parsed.some(
      (f: DeckFolder) =>
        f.id === A2_NETZWERK_FOLDER_ID ||
        f.name.trim().toLowerCase() === 'a2 netzwerk'
    );
    if (!hasA2) {
      const updated = [DEFAULT_A2_FOLDER, ...parsed];
      saveFolders(updated, true);
      return updated;
    }
    return parsed;
  } catch {
    return [DEFAULT_A2_FOLDER];
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
    if (!raw) return DEFAULT_A2_CUSTOM_DECKS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_A2_CUSTOM_DECKS;
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
    return DEFAULT_A2_CUSTOM_DECKS;
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
      cd.folderId === A2_NETZWERK_FOLDER_ID
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
    if (raw === 'last-studied' || raw === 'due' || raw === 'name') {
      return raw;
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
