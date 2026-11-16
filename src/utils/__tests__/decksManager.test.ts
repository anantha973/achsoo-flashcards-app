import { describe, expect, it } from 'vitest';
import { DEFAULT_A2_CUSTOM_DECKS } from '../../data/defaultDecks';
import { INITIAL_CARDS, dedupeGermanArticles, formatNounLemma, stripLeadingGermanArticles } from '../../data/vocabData';
import {
  A2_NETZWERK_FOLDER_ID,
  ARCHIVE_FOLDER_ID,
  CustomDeckRecord,
  DeckFolder,
  archiveDummyDecksInWorkspace,
  ensureBuiltInA2Workspace,
  hasMissingBuiltInA2Workspace,
  resolveSavedDeckIndex,
} from '../decksManager';

describe('decksManager multi-device A2 Netzwerk workspace sync', () => {
  it('heals a stale remote workspace missing A2 Netzwerk folder and A2 decks', () => {
    const staleRemoteFolders: DeckFolder[] = [
      {
        id: ARCHIVE_FOLDER_ID,
        name: 'Archive',
        icon: 'Archive',
        tint: 'stone',
        order: 0,
        createdAt: 1710000000000,
      },
    ];
    const staleRemoteCustomDecks: CustomDeckRecord[] = [];

    expect(
      hasMissingBuiltInA2Workspace({
        folders: staleRemoteFolders,
        customDecks: staleRemoteCustomDecks,
      })
    ).toBe(true);

    const healed = ensureBuiltInA2Workspace({
      folders: staleRemoteFolders,
      customDecks: staleRemoteCustomDecks,
    });

    expect(healed.changed).toBe(true);
    expect(healed.folders.some((f) => f.id === A2_NETZWERK_FOLDER_ID)).toBe(true);
    expect(healed.folders.some((f) => f.id === ARCHIVE_FOLDER_ID)).toBe(true);
    expect(healed.customDecks.length).toBe(DEFAULT_A2_CUSTOM_DECKS.length);
    for (const deck of healed.customDecks) {
      expect(deck.folderId).toBe(A2_NETZWERK_FOLDER_ID);
    }

    expect(
      hasMissingBuiltInA2Workspace({
        folders: healed.folders,
        customDecks: healed.customDecks,
      })
    ).toBe(false);
  });

  it('rescues orphaned or archived a2-deck-* entries while preserving user custom decks', () => {
    const userCustomFolder: DeckFolder = {
      id: 'folder-user-1',
      name: 'My Exam Notes',
      icon: 'Star',
      tint: 'blue',
      order: 1,
      createdAt: 1710000001000,
    };
    const userDeck: CustomDeckRecord = {
      id: 'custom-deck-user-1',
      title: 'Personal Deck',
      subtitle: 'Custom',
      icon: 'Star',
      tint: 'blue',
      folderId: userCustomFolder.id,
      cardIds: ['v1'],
      levelTag: 'Custom',
      createdAt: 1710000002000,
    };
    const orphanedA2Deck: CustomDeckRecord = {
      ...DEFAULT_A2_CUSTOM_DECKS[0],
      folderId: ARCHIVE_FOLDER_ID,
      cardIds: DEFAULT_A2_CUSTOM_DECKS[0].cardIds.slice(0, 5),
    };

    const result = ensureBuiltInA2Workspace({
      folders: [userCustomFolder],
      customDecks: [userDeck, orphanedA2Deck],
    });

    expect(result.changed).toBe(true);
    const savedUserDeck = result.customDecks.find((d) => d.id === userDeck.id);
    expect(savedUserDeck?.folderId).toBe(userCustomFolder.id);

    const rescuedA2Deck = result.customDecks.find(
      (d) => d.id === DEFAULT_A2_CUSTOM_DECKS[0].id
    );
    expect(rescuedA2Deck?.folderId).toBe(A2_NETZWERK_FOLDER_ID);
    expect(rescuedA2Deck?.cardIds.length).toBe(
      DEFAULT_A2_CUSTOM_DECKS[0].cardIds.length
    );
  });

  it('keeps A2 Netzwerk folder and all A2 decks intact during archiveDummyDecksInWorkspace', () => {
    const migrated = archiveDummyDecksInWorkspace({
      folders: [],
      customDecks: [],
      deckOverrides: {},
    });

    expect(migrated.changed).toBe(true);
    expect(migrated.folders.some((f) => f.id === ARCHIVE_FOLDER_ID)).toBe(true);
    expect(migrated.folders.some((f) => f.id === A2_NETZWERK_FOLDER_ID)).toBe(
      true
    );
    expect(
      migrated.customDecks.filter((d) => d.folderId === A2_NETZWERK_FOLDER_ID)
        .length
    ).toBe(DEFAULT_A2_CUSTOM_DECKS.length);
  });
});

describe('study session resume & noun article normalization', () => {
  it('resolves exact saved card position by cardId first and clamps numeric fallback', () => {
    const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(resolveSavedDeckIndex(cards, { index: 0, cardId: 'c' })).toBe(2);
    expect(resolveSavedDeckIndex(cards, { index: 1, cardId: 'missing' })).toBe(1);
    expect(resolveSavedDeckIndex(cards, { index: 99 })).toBe(2);
    expect(resolveSavedDeckIndex([], { index: 4 })).toBe(0);
  });

  it('formats nouns without double articles and contains zero duplicate articles in INITIAL_CARDS', () => {
    expect(formatNounLemma('der Verkäufer', 'der')).toBe('der Verkäufer');
    expect(formatNounLemma('der der Verkäufer', 'der')).toBe('der Verkäufer');
    expect(stripLeadingGermanArticles('die die Zukunft')).toBe('Zukunft');
    expect(dedupeGermanArticles('der der Norden, der Südene Schritt')).toBe(
      'der Norden, der Südene Schritt'
    );

    const dupPattern = /\b(der|die|das)\s+\1\b/i;
    for (const card of INITIAL_CARDS) {
      expect(dupPattern.test(card.lemma)).toBe(false);
      expect(dupPattern.test(card.spokenText)).toBe(false);
      expect(dupPattern.test(card.exampleDe)).toBe(false);
    }
  });
});

