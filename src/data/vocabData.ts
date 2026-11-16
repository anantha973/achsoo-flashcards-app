import { RAW_CARDS_DATA } from './cardsData';

export type CefrLevel = 'A1' | 'A2' | 'B1';
export type CardCategory =
  | 'verb'
  | 'noun'
  | 'adj'
  | 'preposition'
  | 'conn'
  | 'phrase';
export type NounGender = 'der' | 'die' | 'das';
export type RatingKey = 'again' | 'hard' | 'good' | 'easy';
export type FsrsStateKind = 'new' | 'learning' | 'review' | 'relearning';

export interface SixPersonGrid {
  ich: string;
  du: string;
  erSieEs: string;
  wir: string;
  ihr: string;
  sieSie: string;
}

export interface VerbConjugationTable extends SixPersonGrid {
  imperativ?: string;
  konjunktiv2?: string;
  praeteritumGrid?: SixPersonGrid;
  perfektGrid?: SixPersonGrid;
  konjunktiv2Grid?: SixPersonGrid;
  imperativForms?: {
    du: string;
    ihr: string;
    Sie: string;
    wir?: string;
  };
  futurNote?: string;
}

export interface NounDeclensionTable {
  nominativ: string;
  akkusativ: string;
  dativ: string;
  genitiv: string;
  singular?: {
    nom: string;
    akk: string;
    dat: string;
    gen: string;
  };
  plural?: {
    nom: string;
    akk: string;
    dat: string;
    gen: string;
  };
}

export interface WordAnatomy {
  ipa?: string;
  conjugationTable?: VerbConjugationTable;
  nounDeclension?: NounDeclensionTable;
  caseGovernanceNote: string;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  wordFamily: string[];
  b1ExamTip: string;
}

export interface VerbGrammar {
  praesens: string;       // e.g. "er/sie/es spricht"
  praeteritum: string;    // e.g. "sprach"
  perfekt: string;        // e.g. "hat gesprochen"
  auxiliary: 'haben' | 'sein';
  rektion?: string;       // e.g. "mit + Dat. · über + Akk."
  separablePrefix?: string; // e.g. "um", "teil", "an"
  verbStem?: string;        // e.g. "ziehen", "nehmen", "kommen"
}

export interface NounGrammar {
  gender: NounGender;     // 'der' | 'die' | 'das'
  genderLabel: 'Maskulin' | 'Feminin' | 'Neutrum';
  plural: string;         // e.g. "die Bahnhöfe"
  pluralSuffix?: string;  // e.g. "-en", "¨-e", "-nisse"
  genitive?: string;      // e.g. "des Bahnhofs"
  genusRule?: string;     // e.g. "-ung, -heit, -keit → immer feminin (die)"
}

export interface AdjectiveGrammar {
  positiv: string;        // e.g. "schnell"
  komparativ: string;     // e.g. "schneller"
  superlativ: string;     // e.g. "am schnellsten"
  opposite?: string;      // e.g. "langsam"
  rektion?: string;       // e.g. "abhängig von + Dat."
  declensionExamples?: {
    weak: { nom: string; akk: string; dat: string; gen: string };   // nach der/die/das
    mixed: { nom: string; akk: string; dat: string; gen: string };  // nach ein-/kein-
    strong: { nom: string; akk: string; dat: string; gen: string }; // ohne Artikel
  };
}

export interface PrepositionGrammar {
  governedCase: string;   // e.g. "Dativ" | "Genitiv" | "Dativ (Wo?) · Akkusativ (Wohin?)"
  caseShort: 'Akk' | 'Dat' | 'Gen' | 'Dat / Akk' | 'Gen / Dat';
  questionPrompt?: string; // e.g. "Seit wann? / Wo? ↔ Wohin?"
  collocations: string[];
  isWechsel?: boolean;
  wechselDetails?: {
    woRule: string;
    woQuestion: string;
    woExampleDe: string;
    woExampleEn: string;
    wohinRule: string;
    wohinQuestion: string;
    wohinExampleDe: string;
    wohinExampleEn: string;
  };
}

export interface ConnectorGrammar {
  connectorClass:
    | 'Subordinierend (Nebensatz)'
    | 'Konjunktionaladverb (Inversion)'
    | 'Koordinierend (Position 0)';
  verbPositionRule: string; // e.g. "Nebensatz · Verb am Ende"
  hauptsatzFirstDe: string;
  hauptsatzFirstEn: string;
  nebensatzFirstDe: string;
  nebensatzFirstEn: string;
  contrastPair: {
    partnerWord: string;
    partnerRule: string;
    partnerExample: string;
  };
}

export interface PhraseGrammar {
  framePattern: string;   // e.g. "Es kommt (ganz) darauf an, ob / wie …"
  casePattern: string;    // e.g. "auf + Akkusativ · Indirekter Fragesatz"
  registerLabel: 'Formell & B1 Prüfung' | 'Alltag & Gespräch' | 'Schriftlich & Argumentation';
  formalVariant: {
    textDe: string;
    textEn: string;
    contextNote: string;
  };
  informalVariant: {
    textDe: string;
    textEn: string;
    contextNote: string;
  };
  miniDialog: {
    speakerA: string;
    promptDe: string;
    promptEn: string;
    speakerB: string;
    replyDe: string;
    replyEn: string;
  };
}

export interface VocabCard {
  id: string;
  lemma: string;          // Display on front (e.g. "sprechen", "der Bahnhof", "trotz")
  spokenText: string;     // Optimal text for de-DE speechSynthesis
  cefr: CefrLevel;
  category: CardCategory;
  grammarLabel: string;   // e.g. "Verb · trennbar", "Nomen · Feminin", "Konnektor · Nebensatz"
  translation: string;    // English translation
  highlightTarget?: string; // Substring in exampleDe to highlight on Layer 1 Back
  verbDetails?: VerbGrammar;
  nounDetails?: NounGrammar;
  adjDetails?: AdjectiveGrammar;
  prepDetails?: PrepositionGrammar;
  connDetails?: ConnectorGrammar;
  phraseDetails?: PhraseGrammar;
  exampleDe: string;
  exampleEn: string;
  anatomy: WordAnatomy;
}

export interface CardSrsState {
  cardId: string;
  intervalMinutes: number;
  easeFactor: number;
  repetitions: number;
  reviewCount: number;
  lastReviewedAt: string | null;
  dueAt: string;
  lastRating?: RatingKey;
  mastered: boolean;
  // FSRS native scheduling fields
  fsrsState?: FsrsStateKind;
  stability?: number;
  difficulty?: number;
  elapsedDays?: number;
  scheduledDays?: number;
  lapses?: number;
  learningSteps?: number;
}

export type ReviewEventType = 'review' | 'undo';

export interface ReviewLogEntry {
  id: string; // UUID v4 primary key for idempotent multi-device union sync
  eventType?: ReviewEventType; // 'review' (default) or 'undo' append-only marker
  undoTargetId?: string | null; // When eventType === 'undo', the UUID of the review log entry being undone
  cardId: string;
  timestamp: string; // ISO-8601 UTC review timestamp
  reviewedAt: string; // Alias of timestamp for indexed sorting
  studyDayKey: string; // YYYY-MM-DD using 04:00 local time rollover
  rating: RatingKey;
  stateBefore: FsrsStateKind;
  stateAfter: FsrsStateKind;
  dueBefore: string;
  dueAfter: string;
  intervalMinutesBefore: number;
  intervalMinutesAfter: number;
  stabilityAfter: number;
  difficultyAfter: number;
  durationMs: number;
  deviceId: string;
  syncedAt: string | null;
}

export interface StudyStats {
  streakDays: number;
  lastStudyDate: string | null;
  totalReviewsToday: number;
  todayDate: string;
  dailyMasteredHistory?: Record<string, number>;
  dailyReviewsHistory?: Record<string, number>;
  retentionPct?: number;
  timeStudiedMsToday?: number;
  totalTimeStudiedMs?: number;
}

export function stripLeadingGermanArticles(text: string): string {
  return text.trim().replace(/^(?:(?:der|die|das)\s+)+/i, '').trim();
}

export function dedupeGermanArticles(text: string): string {
  return text.replace(/\b(der|die|das)(?:\s+\1)+\b/gi, '$1');
}

export function formatNounLemma(lemma: string, gender?: NounGender): string {
  const cleaned = dedupeGermanArticles(lemma).trim();
  if (gender === 'der' || gender === 'die' || gender === 'das') {
    const bare = stripLeadingGermanArticles(cleaned);
    return bare ? `${gender} ${bare}` : gender;
  }
  return cleaned;
}

export function validateAndNormalizeContentCards(
  cards: VocabCard[]
): VocabCard[] {
  if (!Array.isArray(cards)) {
    throw new Error('Invalid cards dataset: expected an array of cards.');
  }

  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();
  const emptyIdDescriptors: string[] = [];
  const result: VocabCard[] = [];

  cards.forEach((card, index) => {
    const rawId = card && typeof card.id === 'string' ? card.id.trim() : '';
    if (!rawId) {
      const label = card?.lemma ? ` (lemma: "${card.lemma}")` : '';
      emptyIdDescriptors.push(`index ${index}${label}`);
      return;
    }

    if (seenIds.has(rawId)) {
      duplicateIds.add(rawId);
      return;
    }

    seenIds.add(rawId);

    const normalizedLemma =
      card.category === 'noun' && card.nounDetails
        ? formatNounLemma(card.lemma, card.nounDetails.gender)
        : dedupeGermanArticles(card.lemma);

    const normalizedNounDetails = card.nounDetails
      ? {
          ...card.nounDetails,
          plural: dedupeGermanArticles(card.nounDetails.plural),
        }
      : undefined;

    const normalizedAdjDetails = card.adjDetails
      ? {
          ...card.adjDetails,
          positiv: dedupeGermanArticles(card.adjDetails.positiv),
          declensionExamples: card.adjDetails.declensionExamples
            ? {
                weak: {
                  nom: dedupeGermanArticles(card.adjDetails.declensionExamples.weak.nom),
                  akk: dedupeGermanArticles(card.adjDetails.declensionExamples.weak.akk),
                  dat: dedupeGermanArticles(card.adjDetails.declensionExamples.weak.dat),
                  gen: dedupeGermanArticles(card.adjDetails.declensionExamples.weak.gen),
                },
                mixed: {
                  nom: dedupeGermanArticles(card.adjDetails.declensionExamples.mixed.nom),
                  akk: dedupeGermanArticles(card.adjDetails.declensionExamples.mixed.akk),
                  dat: dedupeGermanArticles(card.adjDetails.declensionExamples.mixed.dat),
                  gen: dedupeGermanArticles(card.adjDetails.declensionExamples.mixed.gen),
                },
                strong: {
                  nom: dedupeGermanArticles(card.adjDetails.declensionExamples.strong.nom),
                  akk: dedupeGermanArticles(card.adjDetails.declensionExamples.strong.akk),
                  dat: dedupeGermanArticles(card.adjDetails.declensionExamples.strong.dat),
                  gen: dedupeGermanArticles(card.adjDetails.declensionExamples.strong.gen),
                },
              }
            : undefined,
        }
      : undefined;

    result.push({
      ...card,
      id: rawId,
      lemma: normalizedLemma,
      spokenText: dedupeGermanArticles(card.spokenText),
      exampleDe: dedupeGermanArticles(card.exampleDe),
      nounDetails: normalizedNounDetails,
      adjDetails: normalizedAdjDetails,
    });
  });

  if (emptyIdDescriptors.length > 0 || duplicateIds.size > 0) {
    const parts: string[] = [];
    if (emptyIdDescriptors.length > 0) {
      parts.push(`empty/missing card IDs at [${emptyIdDescriptors.join(', ')}]`);
    }
    if (duplicateIds.size > 0) {
      parts.push(
        `duplicate card IDs [${Array.from(duplicateIds).join(', ')}]`
      );
    }
    throw new Error(`Invalid card content in cards.json: ${parts.join('; ')}`);
  }

  return result;
}

export const INITIAL_CARDS: VocabCard[] =
  validateAndNormalizeContentCards(RAW_CARDS_DATA);
