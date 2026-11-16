import React from 'react';
import {
  Apple,
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

export function loadFolders(): DeckFolder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
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
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
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

export function ensureInitialTestFolderSeed(): {
  folders: DeckFolder[];
  deckOverrides: Record<string, DeckMetaOverride>;
} {
  const folders = loadFolders();
  const deckOverrides = loadDeckOverrides();

  try {
    const alreadySeeded = localStorage.getItem(TEST_FOLDER_SEED_KEY) === '1';
    if (!alreadySeeded && folders.length === 0) {
      const sampleFolderId = 'folder-test-cefr';
      const seededFolder: DeckFolder = {
        id: sampleFolderId,
        name: 'CEFR Stufen',
        icon: 'GraduationCap',
        tint: 'blue',
        order: 0,
        createdAt: Date.now(),
      };
      const nextFolders = [seededFolder];
      const nextOverrides: Record<string, DeckMetaOverride> = {
        ...deckOverrides,
        'cefr-a1': {
          ...(deckOverrides['cefr-a1'] || {}),
          folderId: deckOverrides['cefr-a1']?.folderId ?? sampleFolderId,
        },
        'cefr-a2': {
          ...(deckOverrides['cefr-a2'] || {}),
          folderId: deckOverrides['cefr-a2']?.folderId ?? sampleFolderId,
        },
        'cefr-b1': {
          ...(deckOverrides['cefr-b1'] || {}),
          folderId: deckOverrides['cefr-b1']?.folderId ?? sampleFolderId,
        },
      };
      saveFolders(nextFolders, true);
      saveDeckOverrides(nextOverrides, true);
      localStorage.setItem(TEST_FOLDER_SEED_KEY, '1');
      return { folders: nextFolders, deckOverrides: nextOverrides };
    }
    if (!alreadySeeded) {
      localStorage.setItem(TEST_FOLDER_SEED_KEY, '1');
    }
  } catch {
    // Ignore storage errors
  }

  return { folders, deckOverrides };
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
