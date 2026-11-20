export type MascotMomentPoseId =
  | 'coffee-cards'
  | 'study-peak'
  | 'haus-card'
  | 'eureka-flag'
  | 'midnight-oil'
  | 'study-sleepy'
  | 'cozy-nest'
  | 'determined-focus'
  | 'cozy-student'
  | 'triumph-ecstatic'
  | 'relieved-satisfied';

export type MilestoneThreshold = 25 | 50 | 75;

export interface MascotMomentAsset {
  id: MascotMomentPoseId;
  src: string;
  alt: string;
  label: string;
  germanTitle: string;
  situation: string;
  animClass: string;
  glowVar: string;
  phrases: ReadonlyArray<{ de: string; en: string }>;
  width: number;
  height: number;
}

export interface MascotMomentCard {
  poseId: MascotMomentPoseId;
  asset: MascotMomentAsset;
  kicker: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  threshold?: MilestoneThreshold;
}

export const MILESTONE_THRESHOLDS: ReadonlyArray<MilestoneThreshold> = [
  25, 50, 75,
];

export const MILESTONE_MIN_DECK_SIZE = 4;
export const MILESTONE_MIN_RATINGS_GAP = 2;

const MILESTONE_PREF_KEY = 'achsoo_milestone_breaks_v1';

export const MASCOT_MOMENT_ORDER: ReadonlyArray<MascotMomentPoseId> = [
  'coffee-cards',
  'study-peak',
  'haus-card',
  'eureka-flag',
  'cozy-nest',
  'determined-focus',
  'cozy-student',
  'triumph-ecstatic',
  'relieved-satisfied',
  'midnight-oil',
  'study-sleepy',
];

export const MASCOT_MOMENT_CATALOG: Record<
  MascotMomentPoseId,
  MascotMomentAsset
> = {
  'coffee-cards': {
    id: 'coffee-cards',
    src: '/assets/mascot/moments/coffee-cards.webp',
    alt: 'Achsoo fox in a cozy beanie enjoying coffee with German flashcards',
    label: 'Coffee & Cards',
    germanTitle: 'Kaffee & Karten',
    situation: 'Morgen-Start · 25 %-Meilenstein',
    animClass: 'fox-moment-coffee',
    glowVar: 'var(--intent-warning-soft)',
    phrases: [
      { de: 'Guten Morgen!', en: 'Coffee & cards ready!' },
      { de: 'Wach im Kopf!', en: 'Fresh morning recall!' },
      { de: 'Erst Kaffee, dann Artikel!', en: 'Coffee first, then der/die/das!' },
    ],
    width: 512,
    height: 512,
  },
  'study-peak': {
    id: 'study-peak',
    src: '/assets/mascot/moments/study-peak.webp',
    alt: 'Achsoo fox peeking cheerfully over a HI! DE German flashcard',
    label: 'Study Peak',
    germanTitle: 'Hallo Deutsch!',
    situation: 'Mittags-Check & Deck-Abschluss',
    animClass: 'fox-moment-peek',
    glowVar: 'var(--intent-primary-soft)',
    phrases: [
      { de: 'Hi! Bereit für Deutsch?', en: 'Hi! Ready for German?' },
      { de: 'Lass uns üben!', en: 'Let’s practice together!' },
      { de: 'Wort für Wort!', en: 'One card at a time!' },
    ],
    width: 512,
    height: 512,
  },
  'haus-card': {
    id: 'haus-card',
    src: '/assets/mascot/moments/haus-card.webp',
    alt: 'Achsoo fox holding a German HAUS vocabulary flashcard with a checkmark',
    label: 'HAUS Card',
    germanTitle: 'Das HAUS sitzt!',
    situation: 'Nachmittag · Nomen & Wortschatz',
    animClass: 'fox-moment-haus',
    glowVar: 'var(--accent-secondary-soft)',
    phrases: [
      { de: 'Das Haus sitzt!', en: 'Noun gender nailed!' },
      { de: 'Der, die, das — klar!', en: 'Articles locked in!' },
      { de: 'Starker Wortschatz!', en: 'Solid vocabulary!' },
    ],
    width: 512,
    height: 512,
  },
  'eureka-flag': {
    id: 'eureka-flag',
    src: '/assets/mascot/moments/eureka-flag.webp',
    alt: 'Achsoo fox waving a JA! flag celebrating an Ah-ha! German breakthrough',
    label: 'Eureka Flag',
    germanTitle: 'Ah-ha! Ja-Flagge',
    situation: '75 %-Endspurt & Durchbruch',
    animClass: 'fox-moment-eureka',
    glowVar: 'var(--intent-success-soft)',
    phrases: [
      { de: 'Ah-ha! Ja!', en: 'Yes, breakthrough!' },
      { de: 'Fast am Ziel!', en: 'Almost at the finish!' },
      { de: 'Endspurt läuft!', en: 'Final stretch!' },
    ],
    width: 512,
    height: 512,
  },
  'midnight-oil': {
    id: 'midnight-oil',
    src: '/assets/mascot/moments/midnight-oil.webp',
    alt: 'Achsoo fox under a patchwork blanket studying flashcards by flashlight',
    label: 'Midnight Oil',
    germanTitle: 'Nachteulen-Fuchs',
    situation: 'Spätabends · Lernen vor dem Schlafen',
    animClass: 'fox-moment-midnight',
    glowVar: 'var(--accent-secondary-soft)',
    phrases: [
      { de: 'Nachteulen-Modus!', en: 'Burning the midnight oil!' },
      { de: 'Noch eine Runde!', en: 'One more cozy round!' },
      { de: 'Schlaf festigt Wörter!', en: 'Sleep locks in memory!' },
    ],
    width: 512,
    height: 512,
  },
  'study-sleepy': {
    id: 'study-sleepy',
    src: '/assets/mascot/moments/study-sleepy.webp',
    alt: 'Achsoo fox napping peacefully on a stack of flashcards under stars',
    label: 'Study Sleepy',
    germanTitle: 'Schlummer-Fuchs',
    situation: 'Feierabend · Nach dem späten Deck',
    animClass: 'fox-moment-sleepy',
    glowVar: 'var(--intent-primary-soft)',
    phrases: [
      { de: 'Gut gemacht… zzz', en: 'Well done… time to rest' },
      { de: 'Träum auf Deutsch!', en: 'Dream in German!' },
      { de: 'Bis morgen!', en: 'See you tomorrow!' },
    ],
    width: 512,
    height: 512,
  },
  'cozy-nest': {
    id: 'cozy-nest',
    src: '/assets/mascot/moments/cozy-nest.webp',
    alt: 'Achsoo fox in a warm terracotta scarf studying next to a colorful flashcard box',
    label: 'Cozy Study Nest',
    germanTitle: 'Gemütliches Lern-Nest',
    situation: 'Abend-Runde · 25 %-Meilenstein',
    animClass: 'fox-moment-cozy',
    glowVar: 'var(--intent-warning-soft)',
    phrases: [
      { de: 'Schön gemütlich!', en: 'Cozy study nest!' },
      { de: 'Karteikasten bereit!', en: 'Card box ready!' },
      { de: 'Ganz entspannt!', en: 'Calm, steady focus!' },
    ],
    width: 512,
    height: 512,
  },
  'determined-focus': {
    id: 'determined-focus',
    src: '/assets/mascot/moments/determined-focus.webp',
    alt: 'Achsoo fox focused intensely while taking study notes with a pencil',
    label: 'Determined Focus',
    germanTitle: 'Voller Fokus',
    situation: 'Fokus-Loop & knifflige 50 %-Halbzeit',
    animClass: 'fox-moment-focus',
    glowVar: 'var(--intent-danger-soft)',
    phrases: [
      { de: 'Volle Konzentration!', en: 'Locked in!' },
      { de: 'Die knacken wir!', en: 'We’ll crack these tricky ones!' },
      { de: 'Dranbleiben!', en: 'Keep pushing!' },
    ],
    width: 512,
    height: 512,
  },
  'cozy-student': {
    id: 'cozy-student',
    src: '/assets/mascot/moments/cozy-student.webp',
    alt: 'Achsoo fox smiling in a blue duffle coat and yellow scarf holding study cards',
    label: 'Cozy Student',
    germanTitle: 'Lern-Flow',
    situation: '50 %-Halbzeit im Flow & Überblick',
    animClass: 'fox-moment-student',
    glowVar: 'var(--intent-primary-soft)',
    phrases: [
      { de: 'Voll im Flow!', en: 'Cruising in the flow!' },
      { de: 'Halbzeit geschafft!', en: 'Halfway there!' },
      { de: 'Macht richtig Spaß!', en: 'Learning feels great!' },
    ],
    width: 512,
    height: 512,
  },
  'triumph-ecstatic': {
    id: 'triumph-ecstatic',
    src: '/assets/mascot/moments/triumph-ecstatic.webp',
    alt: 'Achsoo fox cheering ecstatically with a glowing checkmark card and flying cards',
    label: 'Triumph Ecstatic',
    germanTitle: 'Jubel-Triumph!',
    situation: '100 % Deck-Meister & Erfolge',
    animClass: 'fox-moment-triumph',
    glowVar: 'var(--intent-success-soft)',
    phrases: [
      { de: 'Geschafft!!', en: 'Nailed it!!' },
      { de: '100 % gemeistert!', en: '100% mastered!' },
      { de: 'Großartig!', en: 'Outstanding recall!' },
    ],
    width: 512,
    height: 512,
  },
  'relieved-satisfied': {
    id: 'relieved-satisfied',
    src: '/assets/mascot/moments/relieved-satisfied.webp',
    alt: 'Achsoo fox smiling in relief wiping its brow over a closed star notebook',
    label: 'Relieved & Satisfied',
    germanTitle: 'Puh, geschafft!',
    situation: 'Durchgekämpft & Fokus-Loop frei',
    animClass: 'fox-moment-relieved',
    glowVar: 'var(--intent-success-soft)',
    phrases: [
      { de: 'Puh, geschafft!', en: 'Whew, all clear!' },
      { de: 'Ausdauer zahlt sich aus!', en: 'Persistence paid off!' },
      { de: 'Alles erledigt!', en: 'Everything’s in order!' },
    ],
    width: 512,
    height: 512,
  },
};

export function getDailyTimeOfDayMomentPose(
  localHour: number = new Date().getHours()
): MascotMomentPoseId {
  if (localHour >= 5 && localHour < 9) return 'coffee-cards';
  if (localHour >= 9 && localHour < 13) return 'study-peak';
  if (localHour >= 13 && localHour < 17) return 'haus-card';
  if (localHour >= 17 && localHour < 21) return 'cozy-nest';
  if (localHour >= 21) return 'midnight-oil';
  return 'study-sleepy';
}

export function loadMilestoneInterludesEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(MILESTONE_PREF_KEY);
    if (raw === '0' || raw === 'false') return false;
    return true;
  } catch {
    return true;
  }
}

export function saveMilestoneInterludesEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MILESTONE_PREF_KEY, enabled ? '1' : '0');
  } catch {
    // Ignore storage quota / private mode failures
  }
}

export function evaluateMilestoneTrigger(params: {
  deckSize: number;
  progressPct: number;
  shownThresholds: ReadonlySet<MilestoneThreshold>;
  ratingsSinceLastMilestone: number;
  enabled: boolean;
}): MilestoneThreshold | null {
  const {
    deckSize,
    progressPct,
    shownThresholds,
    ratingsSinceLastMilestone,
    enabled,
  } = params;

  if (!enabled) return null;
  if (deckSize < MILESTONE_MIN_DECK_SIZE) return null;
  if (ratingsSinceLastMilestone < MILESTONE_MIN_RATINGS_GAP) return null;
  if (progressPct >= 100) return null;

  // Pick the highest crossed milestone not yet shown so rapid jumps never stack stale interludes
  let crossed: MilestoneThreshold | null = null;
  for (const threshold of MILESTONE_THRESHOLDS) {
    if (progressPct >= threshold && !shownThresholds.has(threshold)) {
      crossed = threshold;
    }
  }
  return crossed;
}

export function selectCheckpointMoment(params: {
  threshold: MilestoneThreshold;
  localHour: number;
  recentAvgRating: number;
  hasRetries: boolean;
}): MascotMomentCard {
  const { threshold, localHour, recentAvgRating, hasRetries } = params;

  if (threshold === 25) {
    if (localHour >= 5 && localHour < 12) {
      return {
        poseId: 'coffee-cards',
        asset: MASCOT_MOMENT_CATALOG['coffee-cards'],
        kicker: '25 % · Meilenstein',
        headline: 'Kaffee & Karten — starker Start!',
        subline: 'Ein Viertel sitzt schon. Halte den ruhigen Morgen-Rhythmus.',
        ctaLabel: 'Weiter lernen',
        threshold,
      };
    }
    if (localHour >= 21 || localHour < 5) {
      return {
        poseId: 'midnight-oil',
        asset: MASCOT_MOMENT_CATALOG['midnight-oil'],
        kicker: '25 % · Nachteulen-Meilenstein',
        headline: 'Nachteulen-Modus aktiv!',
        subline: 'Späte Wiederholungen verankern sich besonders tief im Schlaf.',
        ctaLabel: 'Weiter lernen',
        threshold,
      };
    }
    return {
      poseId: 'cozy-nest',
      asset: MASCOT_MOMENT_CATALOG['cozy-nest'],
      kicker: '25 % · Meilenstein',
      headline: 'Gemütlicher Start — 25 % im Kasten!',
      subline: 'Der Anfang ist gemacht. Jetzt kommt dein Fokus in Schwung.',
      ctaLabel: 'Weiter lernen',
      threshold,
    };
  }

  if (threshold === 50) {
    if (hasRetries || recentAvgRating <= 3.1) {
      return {
        poseId: 'determined-focus',
        asset: MASCOT_MOMENT_CATALOG['determined-focus'],
        kicker: '50 % · Halbzeit',
        headline: 'Volle Konzentration — Halbzeit!',
        subline: 'Knifflige Karten machen dich stärker. Genau hier wächst dein Wortschatz.',
        ctaLabel: 'Dranbleiben',
        threshold,
      };
    }
    return {
      poseId: 'cozy-student',
      asset: MASCOT_MOMENT_CATALOG['cozy-student'],
      kicker: '50 % · Halbzeit',
      headline: 'Halbzeit! Du bist voll im Flow.',
      subline: 'Die erste Hälfte lief richtig rund — weiter so!',
      ctaLabel: 'Weiter lernen',
      threshold,
    };
  }

  return {
    poseId: 'eureka-flag',
    asset: MASCOT_MOMENT_CATALOG['eureka-flag'],
    kicker: '75 % · Endspurt',
    headline: 'Ah-ha! Nur noch ein Viertel.',
    subline: 'Der Final Sweep ist zum Greifen nah — hol dir das Deck!',
    ctaLabel: 'Zum Endspurt',
    threshold,
  };
}

export function selectDeckCompletionMoment(params: {
  avgRating: number;
  totalReviews: number;
  deckSize: number;
  deckId: string;
  deckTitle: string;
  localHour: number;
}): MascotMomentCard {
  const { avgRating, totalReviews, deckSize, deckId, deckTitle, localHour } =
    params;

  const isLateNight = localHour >= 22 || localHour < 5;
  const reviewRatio = deckSize > 0 ? totalReviews / deckSize : 1;

  if (isLateNight) {
    return {
      poseId: 'study-sleepy',
      asset: MASCOT_MOMENT_CATALOG['study-sleepy'],
      kicker: 'Feierabend · Deck geschafft',
      headline: 'Deck geschafft — Zeit zum Ausruhen!',
      subline: `Alle ${deckSize} Karten in „${deckTitle}“ sitzen. Dein Gehirn festigt sie jetzt im Schlaf.`,
      ctaLabel: 'Alle Decks',
    };
  }

  if (avgRating >= 4.3 && reviewRatio <= 2.2) {
    return {
      poseId: 'triumph-ecstatic',
      asset: MASCOT_MOMENT_CATALOG['triumph-ecstatic'],
      kicker: 'Meisterhaft · 100 %',
      headline: 'Deck geschafft!',
      subline: `Souveräner Durchlauf durch alle ${deckSize} Karten in „${deckTitle}“ (${totalReviews} Bewertungen).`,
      ctaLabel: 'Alle Decks',
    };
  }

  if (reviewRatio > 2.2 || (avgRating > 0 && avgRating < 3.6)) {
    return {
      poseId: 'relieved-satisfied',
      asset: MASCOT_MOMENT_CATALOG['relieved-satisfied'],
      kicker: 'Durchgekämpft · 100 %',
      headline: 'Whew — Deck geschafft!',
      subline: `Starke Ausdauer bei „${deckTitle}“: ${totalReviews} Wiederholungen haben sich ausgezahlt.`,
      ctaLabel: 'Alle Decks',
    };
  }

  const normalized = `${deckId} ${deckTitle}`.toLowerCase();
  const isNounOrVocabDeck =
    deckId === 'noun' ||
    normalized.includes('noun') ||
    normalized.includes('nomen') ||
    normalized.includes('haus') ||
    normalized.includes('alltag') ||
    normalized.includes('wohnen');

  if (isNounOrVocabDeck) {
    return {
      poseId: 'haus-card',
      asset: MASCOT_MOMENT_CATALOG['haus-card'],
      kicker: 'Wortschatz sitzt · 100 %',
      headline: 'Deck geschafft!',
      subline: `Alle ${deckSize} Karten in „${deckTitle}“ haben Loop und Final Sweep bestanden.`,
      ctaLabel: 'Alle Decks',
    };
  }

  return {
    poseId: 'study-peak',
    asset: MASCOT_MOMENT_CATALOG['study-peak'],
    kicker: '100 % abgeschlossen',
    headline: 'Deck geschafft!',
    subline: `Alle ${deckSize} Karten in „${deckTitle}“ haben Loop und Final Sweep bestanden (${totalReviews} Bewertungen).`,
    ctaLabel: 'Alle Decks',
  };
}

export function selectEmptyQueueMoment(localHour: number): MascotMomentCard {
  if (localHour >= 22 || localHour < 5) {
    return {
      poseId: 'study-sleepy',
      asset: MASCOT_MOMENT_CATALOG['study-sleepy'],
      kicker: 'Alles erledigt',
      headline: 'Keine Fokus-Karten offen',
      subline:
        'Alles ruhig für heute Nacht. Gönn dir eine Pause oder öffne noch ein anderes Deck.',
      ctaLabel: 'Alle Karten öffnen',
    };
  }

  return {
    poseId: 'relieved-satisfied',
    asset: MASCOT_MOMENT_CATALOG['relieved-satisfied'],
    kicker: 'Alles im grünen Bereich',
    headline: 'Keine Fokus-Karten offen',
    subline:
      'Momentan ist keine Karte als unsicher markiert. Starte einfach ein Deck oder alle Karten.',
    ctaLabel: 'Alle Karten öffnen',
  };
}

export function getUpcomingMomentSrcToPrefetch(params: {
  progressPct: number;
  phase: 'loop' | 'sweep' | 'done';
  deckSize: number;
  localHour: number;
  recentAvgRating: number;
  hasRetries: boolean;
  deckId: string;
  deckTitle: string;
  shownThresholds: ReadonlySet<MilestoneThreshold>;
  interludesEnabled: boolean;
}): string | null {
  const {
    progressPct,
    phase,
    deckSize,
    localHour,
    recentAvgRating,
    hasRetries,
    deckId,
    deckTitle,
    shownThresholds,
    interludesEnabled,
  } = params;

  if (phase === 'sweep' || progressPct >= 82) {
    return selectDeckCompletionMoment({
      avgRating: recentAvgRating || 4,
      totalReviews: Math.max(deckSize, Math.round(deckSize * 1.4)),
      deckSize,
      deckId,
      deckTitle,
      localHour,
    }).asset.src;
  }

  if (!interludesEnabled || deckSize < MILESTONE_MIN_DECK_SIZE) {
    return null;
  }

  if (progressPct >= 18 && progressPct < 25 && !shownThresholds.has(25)) {
    return selectCheckpointMoment({
      threshold: 25,
      localHour,
      recentAvgRating,
      hasRetries,
    }).asset.src;
  }

  if (progressPct >= 42 && progressPct < 50 && !shownThresholds.has(50)) {
    return selectCheckpointMoment({
      threshold: 50,
      localHour,
      recentAvgRating,
      hasRetries,
    }).asset.src;
  }

  if (progressPct >= 68 && progressPct < 75 && !shownThresholds.has(75)) {
    return selectCheckpointMoment({
      threshold: 75,
      localHour,
      recentAvgRating,
      hasRetries,
    }).asset.src;
  }

  return null;
}

const prefetchedMomentUrls = new Set<string>();

export function prefetchMascotMoment(src: string | null | undefined): void {
  if (!src || typeof window === 'undefined' || prefetchedMomentUrls.has(src)) {
    return;
  }
  prefetchedMomentUrls.add(src);

  const run = () => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    if (typeof img.decode === 'function') {
      void img.decode().catch(() => {});
    }
  };

  const ric = (
    window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
    }
  ).requestIdleCallback;

  if (typeof ric === 'function') {
    ric(run, { timeout: 1200 });
  } else {
    window.setTimeout(run, 120);
  }
}
