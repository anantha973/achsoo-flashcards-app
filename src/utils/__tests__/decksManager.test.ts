import { describe, expect, it } from 'vitest';
import { DEFAULT_A2_CUSTOM_DECKS } from '../../data/defaultDecks';
import { INITIAL_CARDS, dedupeGermanArticles, formatNounLemma, stripLeadingGermanArticles } from '../../data/vocabData';
import {
  A2_NETZWERK_FOLDER_ID,
  ARCHIVE_FOLDER_ID,
  CustomDeckRecord,
  DeckFolder,
  archiveDummyDecksInWorkspace,
  canStepTrailPrev,
  clearTrailRatingForUndo,
  ensureBuiltInA2Workspace,
  hasMissingBuiltInA2Workspace,
  recordTrailRating,
  resolveSavedDeckIndex,
  stepTrailNext,
  stepTrailPrev,
  syncTrailWithDeck,
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
    const grammarLeakPattern =
      /[()+]|\b(?:Akk|Dat|Gen|Akkusativ|Dativ|Genitiv|Partizip|Aktion)\b/i;
    for (const card of INITIAL_CARDS) {
      expect(dupPattern.test(card.lemma)).toBe(false);
      expect(dupPattern.test(card.spokenText)).toBe(false);
      expect(dupPattern.test(card.exampleDe)).toBe(false);
      expect(grammarLeakPattern.test(card.lemma)).toBe(false);
      if (card.verbDetails?.separablePrefix && card.verbDetails?.verbStem) {
        expect(
          card.lemma.endsWith(
            `${card.verbDetails.separablePrefix}${card.verbDetails.verbStem}`
          )
        ).toBe(true);
      }
    }
  });
});

describe('study trail rating gate, backward rating visibility & spaced repetition reset', () => {
  const deck = [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }];

  it('blocks advancing to the next card when current card is unrated, and unlocks after rating', () => {
    const initial = syncTrailWithDeck(undefined, deck, 'c1');
    expect(canStepTrailPrev(initial, deck)).toBe(false);
    expect(stepTrailNext(initial, deck)).toEqual({ blocked: true });

    // Rate c1 as 'hard' -> advances to c2 (unrated)
    const afterC1 = recordTrailRating(initial, 'hard', 'c2');
    expect(afterC1.entries[0].rating).toBe('hard');
    expect(afterC1.cursor).toBe(1);
    expect(afterC1.entries[1]).toEqual({ cardId: 'c2' });
    expect(afterC1.entries[1].rating).toBeUndefined();

    // Cannot advance past c2 while c2 is unrated
    expect(stepTrailNext(afterC1, deck)).toEqual({ blocked: true });
  });

  it('shows previously given ratings when swiping back and allows moving forward over rated cards', () => {
    let trail = syncTrailWithDeck(undefined, deck, 'c1');
    trail = recordTrailRating(trail, 'again', 'c2');
    trail = recordTrailRating(trail, 'good', 'c3');

    // Currently at c3 (unrated)
    expect(trail.entries[trail.cursor].cardId).toBe('c3');
    expect(trail.entries[trail.cursor].rating).toBeUndefined();
    expect(stepTrailNext(trail, deck)).toEqual({ blocked: true });

    // Swipe back to c2 -> sees 'good'
    const backToC2 = stepTrailPrev(trail, deck);
    expect(backToC2).not.toBeNull();
    expect(backToC2!.prevDeckIndex).toBe(1);
    expect(backToC2!.trail.entries[backToC2!.trail.cursor].rating).toBe('good');

    // Swipe back to c1 -> sees 'again'
    const backToC1 = stepTrailPrev(backToC2!.trail, deck);
    expect(backToC1).not.toBeNull();
    expect(backToC1!.prevDeckIndex).toBe(0);
    expect(backToC1!.trail.entries[backToC1!.trail.cursor].rating).toBe('again');

    // Swipe forward from c1 -> allowed because c1 was already rated
    const fwdToC2 = stepTrailNext(backToC1!.trail, deck);
    expect(fwdToC2.blocked).toBe(false);
    if (!fwdToC2.blocked) {
      expect(fwdToC2.nextDeckIndex).toBe(1);
      // Forward from c2 -> allowed to c3
      const fwdToC3 = stepTrailNext(fwdToC2.trail, deck);
      expect(fwdToC3.blocked).toBe(false);
      if (!fwdToC3.blocked) {
        expect(fwdToC3.nextDeckIndex).toBe(2);
        // Now at c3 (still unrated) -> blocked again
        expect(stepTrailNext(fwdToC3.trail, deck)).toEqual({ blocked: true });
      }
    }
  });

  it('clears rating when a card appears again in the deck (wrap-around or spaced repetition re-entry)', () => {
    let trail = syncTrailWithDeck(undefined, deck, 'c1');
    trail = recordTrailRating(trail, 'easy', 'c2');
    trail = recordTrailRating(trail, 'hard', 'c3');
    // Finish last card c3 -> wraps around to c1 again
    trail = recordTrailRating(trail, 'good', 'c1');

    // New appearance of c1 at cursor 3 has NO rating
    expect(trail.cursor).toBe(3);
    expect(trail.entries[trail.cursor].cardId).toBe('c1');
    expect(trail.entries[trail.cursor].rating).toBeUndefined();
    expect(stepTrailNext(trail, deck)).toEqual({ blocked: true });

    // Swiping back from second-pass c1 still shows c3's previous rating ('good')
    const backToC3 = stepTrailPrev(trail, deck);
    expect(backToC3!.trail.entries[backToC3!.trail.cursor].cardId).toBe('c3');
    expect(backToC3!.trail.entries[backToC3!.trail.cursor].rating).toBe('good');

    // Due Today queue: rated card leaves validNextDeckCardIds and re-enters later unrated
    let dueTrail = syncTrailWithDeck(undefined, [{ id: 'c1' }, { id: 'c2' }], 'c1', true);
    dueTrail = recordTrailRating(dueTrail, 'again', 'c2', {
      isDueDeck: true,
      validNextDeckCardIds: ['c2'],
    });
    expect(dueTrail.entries).toEqual([{ cardId: 'c2' }]);

    // Later c1 becomes due again and re-appears
    dueTrail = recordTrailRating(dueTrail, 'good', 'c1', {
      isDueDeck: true,
      validNextDeckCardIds: ['c1'],
    });
    expect(dueTrail.entries).toEqual([{ cardId: 'c1' }]);
    expect(dueTrail.entries[0].rating).toBeUndefined();
  });

  it('clears the undone card rating and restores cursor on undo', () => {
    let trail = syncTrailWithDeck(undefined, deck, 'c1');
    trail = recordTrailRating(trail, 'good', 'c2');
    const undone = clearTrailRatingForUndo(trail, 'c1', deck);
    expect(undone.deckIndex).toBe(0);
    expect(undone.trail.cursor).toBe(0);
    expect(undone.trail.entries).toEqual([{ cardId: 'c1' }]);
  });
});


