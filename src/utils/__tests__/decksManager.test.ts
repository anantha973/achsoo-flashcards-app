import { describe, expect, it } from 'vitest';
import {
  DEFAULT_A2_CUSTOM_DECKS,
  DEFAULT_BUILTIN_CUSTOM_DECKS,
  DEFAULT_CONVERSATIONAL_DECKS,
} from '../../data/defaultDecks';
import { CONVERSATIONAL_CHUNK_CARDS } from '../../data/conversationalChunksData';
import { INITIAL_CARDS, dedupeGermanArticles, formatNounLemma, stripLeadingGermanArticles } from '../../data/vocabData';
import {
  A2_NETZWERK_FOLDER_ID,
  ALLTAG_GESPRAECHE_FOLDER_ID,
  ARCHIVE_FOLDER_ID,
  CustomDeckRecord,
  DeckFolder,
  archiveDummyDecksInWorkspace,
  canStepTrailPrev,
  clearLocalWorkspaceData,
  clearTrailRatingForUndo,
  ensureBuiltInA2Workspace,
  hasMissingBuiltInA2Workspace,
  normalizeStudyDirection,
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
    expect(healed.folders.some((f) => f.id === ALLTAG_GESPRAECHE_FOLDER_ID)).toBe(true);
    expect(healed.folders.some((f) => f.id === ARCHIVE_FOLDER_ID)).toBe(true);
    expect(healed.customDecks.length).toBe(DEFAULT_BUILTIN_CUSTOM_DECKS.length);
    for (const deck of healed.customDecks) {
      if (deck.id.startsWith('a2-deck-')) {
        expect(deck.folderId).toBe(A2_NETZWERK_FOLDER_ID);
      } else if (deck.id.startsWith('chat-deck-')) {
        expect(deck.folderId).toBe(ALLTAG_GESPRAECHE_FOLDER_ID);
      }
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
    expect(migrated.folders.some((f) => f.id === ALLTAG_GESPRAECHE_FOLDER_ID)).toBe(
      true
    );
    expect(
      migrated.customDecks.filter((d) => d.folderId === A2_NETZWERK_FOLDER_ID)
        .length
    ).toBe(DEFAULT_A2_CUSTOM_DECKS.length);
    expect(
      migrated.customDecks.filter(
        (d) => d.folderId === ALLTAG_GESPRAECHE_FOLDER_ID
      ).length
    ).toBe(DEFAULT_CONVERSATIONAL_DECKS.length);
  });
});

describe('curated A1-A2 conversational chunks deck collection', () => {
  it('registers all 160 unique A1-A2 phrase cards across 4 themed mini-decks with clean anonymized 2-line exchanges', () => {
    expect(CONVERSATIONAL_CHUNK_CARDS.length).toBe(160);
    expect(DEFAULT_CONVERSATIONAL_DECKS.length).toBe(4);
    for (const deck of DEFAULT_CONVERSATIONAL_DECKS) {
      expect(deck.cardIds.length).toBe(40);
    }

    const cardIdSet = new Set(INITIAL_CARDS.map((c) => c.id));
    const deckCardIds = DEFAULT_CONVERSATIONAL_DECKS.flatMap((d) => d.cardIds);
    expect(deckCardIds.length).toBe(160);
    expect(new Set(deckCardIds).size).toBe(160);

    const normalizedLemmas = CONVERSATIONAL_CHUNK_CARDS.map((c) =>
      c.lemma.trim().toLowerCase()
    );
    expect(new Set(normalizedLemmas).size).toBe(160);

    const forbiddenNames = /\b(?:Matt|Vivian|Hetti|Oscar|Oskar|Cabo|Magdeburg|Jan|Ian)\b/i;
    const forbiddenSlang = /\b(?:safe|cringe|idk|niceu|yesu|oopsie|vibes|oldschool|cardio|dudes|naps|tea spillen)\b/i;
    const emojiPattern = /\p{Extended_Pictographic}/u;

    for (const card of CONVERSATIONAL_CHUNK_CARDS) {
      expect(cardIdSet.has(card.id)).toBe(true);
      expect(card.category).toBe('phrase');
      expect(['A1', 'A2']).toContain(card.cefr);
      expect(card.exampleDe.includes('\n')).toBe(true);
      expect(card.exampleEn.includes('\n')).toBe(true);
      expect(card.highlightTarget).toBeTruthy();
      expect(
        card.exampleDe.toLowerCase().includes(card.highlightTarget!.toLowerCase())
      ).toBe(true);
      expect(card.phraseDetails?.miniDialog).toBeDefined();

      const germanText = [
        card.lemma,
        card.spokenText,
        card.exampleDe,
        card.phraseDetails?.miniDialog.promptDe,
        card.phraseDetails?.miniDialog.replyDe,
      ].join(' ');
      const fullText = [
        germanText,
        card.translation,
        card.exampleEn,
        card.phraseDetails?.miniDialog.speakerA,
        card.phraseDetails?.miniDialog.speakerB,
      ].join(' ');
      expect(forbiddenNames.test(fullText)).toBe(false);
      expect(forbiddenSlang.test(germanText)).toBe(false);
      expect(emojiPattern.test(fullText)).toBe(false);
    }

    const legacyConvDeck: CustomDeckRecord = {
      ...DEFAULT_CONVERSATIONAL_DECKS[0],
      subtitle: '16 Chunks · Begrüßung, Entwarnung & Abschied',
      cardIds: DEFAULT_CONVERSATIONAL_DECKS[0].cardIds.slice(0, 16),
    };
    const upgraded = ensureBuiltInA2Workspace({
      folders: [],
      customDecks: [legacyConvDeck],
    });
    const healedConv = upgraded.customDecks.find(
      (d) => d.id === DEFAULT_CONVERSATIONAL_DECKS[0].id
    );
    expect(healedConv?.cardIds.length).toBe(40);
    expect(healedConv?.subtitle).toBe(DEFAULT_CONVERSATIONAL_DECKS[0].subtitle);
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

    // Rate c1 as '2' -> advances to c2 (unrated)
    const afterC1 = recordTrailRating(initial, '2', 'c2');
    expect(afterC1.entries[0].rating).toBe('2');
    expect(afterC1.cursor).toBe(1);
    expect(afterC1.entries[1]).toEqual({ cardId: 'c2' });
    expect(afterC1.entries[1].rating).toBeUndefined();

    // Cannot advance past c2 while c2 is unrated
    expect(stepTrailNext(afterC1, deck)).toEqual({ blocked: true });
  });

  it('shows previously given ratings when swiping back and allows moving forward over rated cards', () => {
    let trail = syncTrailWithDeck(undefined, deck, 'c1');
    trail = recordTrailRating(trail, '1', 'c2');
    trail = recordTrailRating(trail, '4', 'c3');

    // Currently at c3 (unrated)
    expect(trail.entries[trail.cursor].cardId).toBe('c3');
    expect(trail.entries[trail.cursor].rating).toBeUndefined();
    expect(stepTrailNext(trail, deck)).toEqual({ blocked: true });

    // Swipe back to c2 -> sees '4'
    const backToC2 = stepTrailPrev(trail, deck);
    expect(backToC2).not.toBeNull();
    expect(backToC2!.prevDeckIndex).toBe(1);
    expect(backToC2!.trail.entries[backToC2!.trail.cursor].rating).toBe('4');

    // Swipe back to c1 -> sees '1'
    const backToC1 = stepTrailPrev(backToC2!.trail, deck);
    expect(backToC1).not.toBeNull();
    expect(backToC1!.prevDeckIndex).toBe(0);
    expect(backToC1!.trail.entries[backToC1!.trail.cursor].rating).toBe('1');

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

  it('clears rating when a card appears again in the deck (wrap-around or loop re-entry)', () => {
    let trail = syncTrailWithDeck(undefined, deck, 'c1');
    trail = recordTrailRating(trail, '5', 'c2');
    trail = recordTrailRating(trail, '2', 'c3');
    // Finish last card c3 -> wraps around to c1 again
    trail = recordTrailRating(trail, '4', 'c1');

    // New appearance of c1 at cursor 3 has NO rating
    expect(trail.cursor).toBe(3);
    expect(trail.entries[trail.cursor].cardId).toBe('c1');
    expect(trail.entries[trail.cursor].rating).toBeUndefined();
    expect(stepTrailNext(trail, deck)).toEqual({ blocked: true });

    // Swiping back from second-pass c1 still shows c3's previous rating ('4')
    const backToC3 = stepTrailPrev(trail, deck);
    expect(backToC3!.trail.entries[backToC3!.trail.cursor].cardId).toBe('c3');
    expect(backToC3!.trail.entries[backToC3!.trail.cursor].rating).toBe('4');

    // Low Confidence 1-2 queue: rated card leaves validNextDeckCardIds and re-enters later unrated
    let lowConfTrail = syncTrailWithDeck(undefined, [{ id: 'c1' }, { id: 'c2' }], 'c1', true);
    lowConfTrail = recordTrailRating(lowConfTrail, '1', 'c2', {
      isDueDeck: true,
      validNextDeckCardIds: ['c2'],
    });
    expect(lowConfTrail.entries).toEqual([{ cardId: 'c2' }]);

    // Later c1 re-enters unrated
    lowConfTrail = recordTrailRating(lowConfTrail, '4', 'c1', {
      isDueDeck: true,
      validNextDeckCardIds: ['c1'],
    });
    expect(lowConfTrail.entries).toEqual([{ cardId: 'c1' }]);
    expect(lowConfTrail.entries[0].rating).toBeUndefined();
  });

  it('clears the undone card rating and restores cursor on undo', () => {
    let trail = syncTrailWithDeck(undefined, deck, 'c1');
    trail = recordTrailRating(trail, '4', 'c2');
    const undone = clearTrailRatingForUndo(trail, 'c1', deck);
    expect(undone.deckIndex).toBe(0);
    expect(undone.trail.cursor).toBe(0);
    expect(undone.trail.entries).toEqual([{ cardId: 'c1' }]);
  });
});

describe('per-deck card studyDirection persistence and safety', () => {
  it('normalizes unknown or omitted studyDirection safely to de-en', () => {
    expect(normalizeStudyDirection('en-de')).toBe('en-de');
    expect(normalizeStudyDirection('de-en')).toBe('de-en');
    expect(normalizeStudyDirection(undefined)).toBe('de-en');
    expect(normalizeStudyDirection('invalid')).toBe('de-en');
  });

  it('preserves studyDirection across A2 workspace healing and archive migrations', () => {
    const flippedA2: CustomDeckRecord = {
      ...DEFAULT_A2_CUSTOM_DECKS[0],
      folderId: ARCHIVE_FOLDER_ID,
      studyDirection: 'en-de',
      cardIds: DEFAULT_A2_CUSTOM_DECKS[0].cardIds.slice(0, 3),
    };
    const userFlippedDeck: CustomDeckRecord = {
      id: 'custom-flipped-1',
      title: 'Flipped Custom',
      subtitle: 'Custom',
      icon: 'Star',
      tint: 'sage',
      folderId: null,
      cardIds: ['v1'],
      levelTag: 'Custom',
      studyDirection: 'en-de',
      createdAt: 1710000003000,
    };

    const migrated = archiveDummyDecksInWorkspace({
      folders: [],
      customDecks: [flippedA2, userFlippedDeck],
      deckOverrides: {
        all: { studyDirection: 'en-de' },
        verb: { studyDirection: 'en-de' },
      },
    });

    const healedA2 = migrated.customDecks.find((d) => d.id === flippedA2.id);
    expect(healedA2?.studyDirection).toBe('en-de');
    expect(healedA2?.folderId).toBe(A2_NETZWERK_FOLDER_ID);

    const migratedUser = migrated.customDecks.find(
      (d) => d.id === userFlippedDeck.id
    );
    expect(migratedUser?.studyDirection).toBe('en-de');
    expect(migrated.deckOverrides.all?.studyDirection).toBe('en-de');
    expect(migrated.deckOverrides.verb?.studyDirection).toBe('en-de');
  });

  it('clears workspace localStorage keys safely on account switch or sign-out', () => {
    const store = new Map<string, string>();
    const prevLS = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, String(v)),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
      },
    });
    try {
      store.set('wortschatz_folders_v1', '[]');
      store.set('wortschatz_custom_decks_v1', '[]');
      store.set('achsoo_last_study_session_v1', '{}');
      store.set('wortschatz_theme_v2', '{"themeId":"nordic","colorMode":"light"}');

      clearLocalWorkspaceData();

      expect(store.has('wortschatz_folders_v1')).toBe(false);
      expect(store.has('wortschatz_custom_decks_v1')).toBe(false);
      expect(store.has('achsoo_last_study_session_v1')).toBe(false);
      expect(store.get('wortschatz_theme_v2')).toBe(
        '{"themeId":"nordic","colorMode":"light"}'
      );
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: prevLS,
      });
    }
  });
});



