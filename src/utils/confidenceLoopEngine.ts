import {
  CardSrsState,
  ConfidenceRating,
  normalizeRatingKey,
  RatingKey,
  ratingToConfidence,
  ReviewLogEntry,
  StudyDirection,
} from '../data/vocabData';

export const EN_DE_KEY_SUFFIX = '::en-de';

export function stripDirectionSuffix(cardOrStateKey: string): string {
  if (cardOrStateKey.endsWith(EN_DE_KEY_SUFFIX)) {
    return cardOrStateKey.slice(0, -EN_DE_KEY_SUFFIX.length);
  }
  return cardOrStateKey;
}

export function getSrsStateKey(
  cardId: string,
  direction: StudyDirection = 'de-en'
): string {
  const baseId = stripDirectionSuffix(cardId);
  return direction === 'en-de' ? `${baseId}${EN_DE_KEY_SUFFIX}` : baseId;
}

export function parseSrsStateKey(stateKey: string): {
  cardId: string;
  direction: StudyDirection;
} {
  if (stateKey.endsWith(EN_DE_KEY_SUFFIX)) {
    return {
      cardId: stateKey.slice(0, -EN_DE_KEY_SUFFIX.length),
      direction: 'en-de',
    };
  }
  return { cardId: stateKey, direction: 'de-en' };
}

export function getDeckSessionKey(
  deckId: string,
  direction: StudyDirection = 'de-en'
): string {
  const baseId = stripDirectionSuffix(deckId);
  return direction === 'en-de' ? `${baseId}${EN_DE_KEY_SUFFIX}` : baseId;
}

export interface ConfidenceLoopConfig {
  workingSetCap: number;
  minActiveWorkingSet: number;
  clearConsecutiveHighCount: number;
  clearThresholdRating: 1 | 2 | 3 | 4 | 5;
  minGapCards: number;
  gapTable: Record<1 | 2 | 3 | 4 | 5, readonly [number, number]>;
  fourMultiplier: number;
  fiveMultiplier: number;
  maxEndgameInterleaveLow: number;
  maxEndgameInterleaveHigh: number;
  maxFinalCheckCards: number;
  recentClearedCheckCount: number;
  maxReopenedRefreshCards: number;
}

export const CONFIDENCE_LOOP_CONFIG: ConfidenceLoopConfig = {
  workingSetCap: 10,
  minActiveWorkingSet: 3,
  clearConsecutiveHighCount: 2,
  clearThresholdRating: 4,
  minGapCards: 1,
  gapTable: {
    1: [2, 3],
    2: [4, 5],
    3: [6, 9],
    4: [9, 14],
    5: [14, 22],
  },
  fourMultiplier: 1.5,
  fiveMultiplier: 1.4,
  maxEndgameInterleaveLow: 2,
  maxEndgameInterleaveHigh: 3,
  maxFinalCheckCards: 8,
  recentClearedCheckCount: 3,
  maxReopenedRefreshCards: 15,
};

export type DeckLoopPhase = 'loop' | 'sweep' | 'done';
export type LoopSlotKind = 'active' | 'interleave' | 'final-check';

export interface DeckLoopCardMeta {
  cardId: string;
  dueAt: number;
  confidence: ConfidenceRating;
  reviewCount: number;
  consecutiveHighCount: number;
  consecutiveFiveCount: number;
  lastShownAt: number;
  clearedAtClock: number | null;
  hadStruggleInSession: boolean;
  verifiedAfterClear: boolean;
  interleaveCount: number;
}

export interface DeckLoopState {
  deckId: string;
  direction: StudyDirection;
  phase: DeckLoopPhase;
  virtualClock: number;
  orderedCardIds: string[];
  waitingQueue: string[];
  activePool: string[];
  clearedIds: string[];
  sweepQueue: string[];
  sweepPassedIds: string[];
  sweepRound: number;
  lastCardId: string | null;
  recentCardIds: string[];
  currentCardId: string | null;
  currentSlotKind: LoopSlotKind | null;
  interleaveStreak: number;
  finalCheckTotal: number;
  isReopenedRefresh: boolean;
  cardLoopMeta: Record<string, DeckLoopCardMeta>;
}

export function deterministicHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function deterministicShuffle<T extends string>(
  items: readonly T[],
  seed: string
): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const h = deterministicHash(`${seed}:${i}:${arr[i]}`);
    const j = h % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function computeLoopGap(
  cardId: string,
  reviewCount: number,
  rating: 1 | 2 | 3 | 4 | 5,
  consecutiveHighAfter: number,
  consecutiveFiveAfter: number,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG,
  effectiveDeckSize?: number
): number {
  const [minBase, maxBase] = config.gapTable[rating];
  const span = Math.max(1, maxBase - minBase + 1);
  const jitter = deterministicHash(`${cardId}:${reviewCount}`) % span;
  const baseGap = minBase + jitter;

  let multiplier = 1;
  if (rating === 4) {
    multiplier = Math.pow(
      config.fourMultiplier,
      Math.max(0, consecutiveHighAfter - 1)
    );
  } else if (rating === 5) {
    multiplier = Math.pow(
      config.fiveMultiplier,
      Math.max(0, consecutiveFiveAfter - 1)
    );
  }

  let scaled = Math.round(baseGap * multiplier);

  // Gracefully scale high-rating gaps on compact decks so Rating 4/5 cards
  // verify naturally mid-session instead of piling up at the tail.
  if (
    typeof effectiveDeckSize === 'number' &&
    effectiveDeckSize > 0 &&
    rating >= 3
  ) {
    const softCap =
      rating === 3
        ? Math.max(4, Math.round(effectiveDeckSize * 0.45))
        : rating === 4
        ? Math.max(5, Math.round(effectiveDeckSize * 0.6))
        : Math.max(6, Math.round(effectiveDeckSize * 0.75));
    scaled = Math.min(scaled, softCap);
  }

  return Math.max(config.minGapCards, scaled);
}

function pushRecentCard(
  recentCardIds: readonly string[],
  cardId: string
): string[] {
  const next = [...recentCardIds, cardId];
  return next.length > 3 ? next.slice(next.length - 3) : next;
}

function getOrderIndexMap(orderedCardIds: readonly string[]): Map<string, number> {
  const map = new Map<string, number>();
  orderedCardIds.forEach((id, idx) => map.set(id, idx));
  return map;
}

function pickInterleaveCandidate(
  state: DeckLoopState,
  excludeIds: ReadonlySet<string>
): string | null {
  const orderMap = getOrderIndexMap(state.orderedCardIds);
  const recentSet = new Set(state.recentCardIds);

  const primaryPool = state.clearedIds.filter(
    (id) => !excludeIds.has(id) && !recentSet.has(id)
  );
  const secondaryPool =
    primaryPool.length > 0
      ? primaryPool
      : state.clearedIds.filter(
          (id) => !excludeIds.has(id) && id !== state.lastCardId
        );

  if (secondaryPool.length === 0) return null;

  const sorted = [...secondaryPool].sort((a, b) => {
    const ma = state.cardLoopMeta[a];
    const mb = state.cardLoopMeta[b];
    const interA = ma?.interleaveCount ?? 0;
    const interB = mb?.interleaveCount ?? 0;
    if (interA !== interB) return interA - interB;

    // Prefer gently refreshing cards that had earlier struggles in this session
    const struggleA = ma?.hadStruggleInSession ? 0 : 1;
    const struggleB = mb?.hadStruggleInSession ? 0 : 1;
    if (struggleA !== struggleB) return struggleA - struggleB;

    // Pick the least recently seen cleared card
    const shownA = ma?.lastShownAt ?? -1;
    const shownB = mb?.lastShownAt ?? -1;
    if (shownA !== shownB) return shownA - shownB;

    return (orderMap.get(a) ?? 0) - (orderMap.get(b) ?? 0);
  });

  return sorted[0] ?? null;
}

function resolveNextSlot(
  state: DeckLoopState,
  config: ConfidenceLoopConfig
): { cardId: string | null; slotKind: LoopSlotKind | null } {
  if (state.phase === 'done') {
    return { cardId: null, slotKind: null };
  }

  if (state.phase === 'sweep') {
    const headId = state.sweepQueue[0] ?? null;
    if (!headId) {
      return { cardId: null, slotKind: null };
    }

    // If the sole remaining Final Check card was just missed, buffer it with
    // up to 2 Quick Refresh cards so it never repeats immediately back-to-back.
    if (state.sweepQueue.length === 1) {
      const meta = state.cardLoopMeta[headId];
      const cardsBetween =
        meta && meta.lastShownAt >= 0
          ? state.virtualClock - meta.lastShownAt
          : Infinity;
      const needsCooldown =
        meta &&
        meta.lastShownAt >= 0 &&
        cardsBetween < config.maxEndgameInterleaveLow &&
        state.interleaveStreak < config.maxEndgameInterleaveLow;

      if (needsCooldown) {
        const bufferId = pickInterleaveCandidate(state, new Set([headId]));
        if (bufferId) {
          return { cardId: bufferId, slotKind: 'interleave' };
        }
      }
    }

    return { cardId: headId, slotKind: 'final-check' };
  }

  // phase === 'loop'
  if (state.activePool.length === 0) {
    return { cardId: null, slotKind: null };
  }

  const orderMap = getOrderIndexMap(state.orderedCardIds);
  const nonRepeatCandidates = state.activePool.filter(
    (id) => id !== state.lastCardId
  );
  const candidatePool =
    nonRepeatCandidates.length > 0 ? nonRepeatCandidates : state.activePool;

  // Prefer cards that are genuinely due (dueAt <= virtualClock)
  const dueCandidates = candidatePool.filter((id) => {
    const due = state.cardLoopMeta[id]?.dueAt ?? 0;
    return due <= state.virtualClock;
  });

  const pickBestFrom = (pool: readonly string[]): string => {
    let bestId = pool[0];
    let bestDue = state.cardLoopMeta[bestId]?.dueAt ?? 0;
    let bestOrder = orderMap.get(bestId) ?? 0;
    for (let i = 1; i < pool.length; i += 1) {
      const id = pool[i];
      const due = state.cardLoopMeta[id]?.dueAt ?? 0;
      const ord = orderMap.get(id) ?? 0;
      if (due < bestDue || (due === bestDue && ord < bestOrder)) {
        bestId = id;
        bestDue = due;
        bestOrder = ord;
      }
    }
    return bestId;
  };

  if (dueCandidates.length > 0) {
    return { cardId: pickBestFrom(dueCandidates), slotKind: 'active' };
  }

  // No active card is strictly due yet. Pick the closest upcoming active card.
  const bestActiveId = pickBestFrom(candidatePool);
  const bestMeta = state.cardLoopMeta[bestActiveId];

  // Endgame Spacing Interleaver: when waitingQueue is empty and the remaining
  // 1-3 active cards are still in their cooldown gap, interleave mastered cards
  // (bounded at 2-3 buffers) to flush working memory and stop back-to-back repeats.
  if (state.waitingQueue.length === 0 && state.clearedIds.length > 0 && bestMeta) {
    const cardsBetween =
      bestMeta.lastShownAt >= 0
        ? state.virtualClock - bestMeta.lastShownAt
        : Infinity;
    const boundedCooldown =
      bestMeta.confidence <= 2
        ? config.maxEndgameInterleaveLow
        : config.maxEndgameInterleaveHigh;
    const plannedGap =
      bestMeta.lastShownAt >= 0
        ? Math.max(1, bestMeta.dueAt - bestMeta.lastShownAt)
        : 0;
    const requiredEndgameGap = Math.min(plannedGap, boundedCooldown);

    const stillCoolingDown =
      bestMeta.lastShownAt >= 0 &&
      cardsBetween < requiredEndgameGap &&
      state.interleaveStreak < boundedCooldown;

    if (stillCoolingDown) {
      const activeSet = new Set(state.activePool);
      const bufferId = pickInterleaveCandidate(state, activeSet);
      if (bufferId) {
        return { cardId: bufferId, slotKind: 'interleave' };
      }
    }
  }

  return { cardId: bestActiveId, slotKind: 'active' };
}

function finalizeLoopSelection(
  state: DeckLoopState,
  config: ConfidenceLoopConfig
): DeckLoopState {
  const { cardId, slotKind } = resolveNextSlot(state, config);
  if (
    state.currentCardId === cardId &&
    state.currentSlotKind === slotKind
  ) {
    return state;
  }
  return {
    ...state,
    currentCardId: cardId,
    currentSlotKind: slotKind,
  };
}

export function admitFromWaitingQueue(
  state: DeckLoopState,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
): DeckLoopState {
  if (state.waitingQueue.length === 0) return state;

  let waitingQueue = state.waitingQueue;
  let activePool = state.activePool;
  let cardLoopMeta = state.cardLoopMeta;
  let changed = false;

  while (
    waitingQueue.length > 0 &&
    activePool.length < config.workingSetCap
  ) {
    const minDue =
      activePool.length === 0
        ? Infinity
        : activePool.reduce((acc, id) => {
            const d = cardLoopMeta[id]?.dueAt ?? 0;
            return d < acc ? d : acc;
          }, Infinity);

    const hasDueNonRepeat = activePool.some((id) => {
      if (id === state.lastCardId && activePool.length > 1) return false;
      const d = cardLoopMeta[id]?.dueAt ?? 0;
      return d <= state.virtualClock;
    });

    // Gate new cards cleanly:
    // 1. Always admit if activePool is empty.
    // 2. Admit 1 new card if no active card is currently due (minDue > virtualClock).
    // 3. Also maintain a healthy working rhythm (>= minActiveWorkingSet) when
    //    no non-repeating active card is due yet.
    const shouldAdmit =
      activePool.length === 0 ||
      minDue > state.virtualClock ||
      (activePool.length < config.minActiveWorkingSet && !hasDueNonRepeat);

    if (!shouldAdmit) {
      break;
    }

    const [nextId, ...rest] = waitingQueue;
    waitingQueue = rest;
    activePool = [...activePool, nextId];
    const prevMeta = cardLoopMeta[nextId];
    cardLoopMeta = {
      ...cardLoopMeta,
      [nextId]: {
        cardId: nextId,
        dueAt: state.virtualClock,
        confidence: prevMeta?.confidence ?? 0,
        reviewCount: prevMeta?.reviewCount ?? 0,
        consecutiveHighCount: prevMeta?.consecutiveHighCount ?? 0,
        consecutiveFiveCount: prevMeta?.consecutiveFiveCount ?? 0,
        lastShownAt: prevMeta?.lastShownAt ?? -1,
        clearedAtClock: prevMeta?.clearedAtClock ?? null,
        hadStruggleInSession: prevMeta?.hadStruggleInSession ?? false,
        verifiedAfterClear: prevMeta?.verifiedAfterClear ?? false,
        interleaveCount: prevMeta?.interleaveCount ?? 0,
      },
    };
    changed = true;

    // Admit 1 card per step once pool has an item ready to show at now
    break;
  }

  if (!changed) return state;
  return {
    ...state,
    waitingQueue,
    activePool,
    cardLoopMeta,
  };
}

function buildSmartFinalCheckQueue(
  state: DeckLoopState,
  config: ConfidenceLoopConfig
): string[] {
  const passedSet = new Set(state.sweepPassedIds);
  const deckSize = state.orderedCardIds.length;
  if (deckSize === 0) return [];

  const maxChecks = Math.min(
    config.maxFinalCheckCards,
    Math.max(
      Math.min(config.recentClearedCheckCount, deckSize),
      Math.ceil(deckSize * 0.25)
    )
  );

  // 1. Cards that had any struggle (<4) during this session and haven't
  //    already been re-verified as an endgame Quick Refresh card after clearing
  const struggledIds = state.orderedCardIds.filter((id) => {
    if (passedSet.has(id)) return false;
    const meta = state.cardLoopMeta[id];
    if (!meta) return false;
    return meta.hadStruggleInSession && !meta.verifiedAfterClear;
  });

  // 2. Most recently cleared cards (top 2-3 cleared at the latest virtualClock)
  //    that haven't already been re-verified post-clear
  const recentClearedIds = [...state.orderedCardIds]
    .filter((id) => {
      if (passedSet.has(id)) return false;
      const meta = state.cardLoopMeta[id];
      if (!meta || meta.clearedAtClock === null) return false;
      return !meta.verifiedAfterClear;
    })
    .sort((a, b) => {
      const ca = state.cardLoopMeta[a]?.clearedAtClock ?? -1;
      const cb = state.cardLoopMeta[b]?.clearedAtClock ?? -1;
      return cb - ca;
    })
    .slice(0, config.recentClearedCheckCount);

  const selectedSet = new Set<string>();
  const prioritized: string[] = [];

  for (const id of struggledIds) {
    if (prioritized.length >= maxChecks) break;
    if (!selectedSet.has(id)) {
      selectedSet.add(id);
      prioritized.push(id);
    }
  }
  for (const id of recentClearedIds) {
    if (prioritized.length >= maxChecks) break;
    if (!selectedSet.has(id)) {
      selectedSet.add(id);
      prioritized.push(id);
    }
  }

  if (prioritized.length === 0) return [];

  const nextRound = state.sweepRound + 1;
  const shuffled = deterministicShuffle(
    prioritized,
    `${state.deckId}:${state.direction}:finalcheck:${nextRound}`
  );

  // Avoid immediately re-showing the card that just closed the main loop
  if (shuffled.length > 1 && shuffled[0] === state.lastCardId) {
    const tmp = shuffled[0];
    shuffled[0] = shuffled[1];
    shuffled[1] = tmp;
  }

  return shuffled;
}

export function createInitialDeckLoopState(
  deckId: string,
  cardIds: readonly string[],
  persistedStates: Record<string, CardSrsState | undefined>,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG,
  direction: StudyDirection = 'de-en'
): DeckLoopState {
  const seen = new Set<string>();
  const orderedCardIds: string[] = [];
  for (const id of cardIds) {
    const baseId = stripDirectionSuffix(id);
    if (baseId && !seen.has(baseId)) {
      seen.add(baseId);
      orderedCardIds.push(baseId);
    }
  }

  if (orderedCardIds.length === 0) {
    return {
      deckId,
      direction,
      phase: 'done',
      virtualClock: 0,
      orderedCardIds: [],
      waitingQueue: [],
      activePool: [],
      clearedIds: [],
      sweepQueue: [],
      sweepPassedIds: [],
      sweepRound: 0,
      lastCardId: null,
      recentCardIds: [],
      currentCardId: null,
      currentSlotKind: null,
      interleaveStreak: 0,
      finalCheckTotal: 0,
      isReopenedRefresh: false,
      cardLoopMeta: {},
    };
  }

  const loopNeedSeen: string[] = [];
  const loopUnseen: string[] = [];
  const clearedIds: string[] = [];
  const cardLoopMeta: Record<string, DeckLoopCardMeta> = {};
  const lastReviewedTsByCard = new Map<string, number>();

  for (const cardId of orderedCardIds) {
    const stateKey = getSrsStateKey(cardId, direction);
    const st = persistedStates[stateKey];
    const rawConf =
      typeof st?.confidence === 'number'
        ? st.confidence
        : st?.lastRating
        ? ratingToConfidence(normalizeRatingKey(st.lastRating) ?? '1')
        : 0;
    const confidence = Math.max(
      0,
      Math.min(5, Math.round(rawConf))
    ) as ConfidenceRating;
    const reviewCount = Math.max(0, st?.reviewCount ?? 0);
    const consecutiveHighCount =
      typeof st?.consecutiveHighCount === 'number'
        ? Math.max(0, st.consecutiveHighCount)
        : confidence >= config.clearThresholdRating
        ? config.clearConsecutiveHighCount
        : 0;
    const consecutiveFiveCount =
      typeof st?.consecutiveFiveCount === 'number'
        ? Math.max(0, st.consecutiveFiveCount)
        : confidence === 5
        ? 1
        : 0;

    const ts = st?.lastReviewedAt ? Date.parse(st.lastReviewedAt) : 0;
    lastReviewedTsByCard.set(cardId, Number.isNaN(ts) ? 0 : ts);

    const isAlreadyCleared =
      confidence >= config.clearThresholdRating &&
      consecutiveHighCount >= config.clearConsecutiveHighCount;

    cardLoopMeta[cardId] = {
      cardId,
      dueAt: 0,
      confidence,
      reviewCount,
      consecutiveHighCount,
      consecutiveFiveCount,
      lastShownAt: -1,
      clearedAtClock: isAlreadyCleared ? 0 : null,
      hadStruggleInSession: false,
      verifiedAfterClear: isAlreadyCleared,
      interleaveCount: 0,
    };

    if (isAlreadyCleared) {
      clearedIds.push(cardId);
    } else if (reviewCount > 0) {
      loopNeedSeen.push(cardId);
    } else {
      loopUnseen.push(cardId);
    }
  }

  // Reopened decks prioritize unsettled seen cards (lowest confidence first,
  // then cards waiting for their 2nd high hit), followed by unseen cards.
  loopNeedSeen.sort((a, b) => {
    const ca = cardLoopMeta[a]?.confidence ?? 0;
    const cb = cardLoopMeta[b]?.confidence ?? 0;
    return ca - cb;
  });

  const waitingQueue = [...loopNeedSeen, ...loopUnseen];

  // If every card in this direction is already fully cleared, start a crisp,
  // finite Refresh Session prioritized by oldest-reviewed & lowest confidence.
  if (waitingQueue.length === 0) {
    const prioritizedForRefresh = [...orderedCardIds].sort((a, b) => {
      const ca = cardLoopMeta[a]?.confidence ?? 5;
      const cb = cardLoopMeta[b]?.confidence ?? 5;
      if (ca !== cb) return ca - cb;
      const ta = lastReviewedTsByCard.get(a) ?? 0;
      const tb = lastReviewedTsByCard.get(b) ?? 0;
      if (ta !== tb) return ta - tb;
      return (
        deterministicHash(`${deckId}:${direction}:refresh:${a}`) -
        deterministicHash(`${deckId}:${direction}:refresh:${b}`)
      );
    });
    const refreshQueue = prioritizedForRefresh.slice(
      0,
      Math.min(orderedCardIds.length, config.maxReopenedRefreshCards)
    );

    const refreshState: DeckLoopState = {
      deckId,
      direction,
      phase: 'sweep',
      virtualClock: 0,
      orderedCardIds,
      waitingQueue: [],
      activePool: [],
      clearedIds,
      sweepQueue: refreshQueue,
      sweepPassedIds: [],
      sweepRound: 1,
      lastCardId: null,
      recentCardIds: [],
      currentCardId: refreshQueue[0] ?? null,
      currentSlotKind: refreshQueue.length > 0 ? 'final-check' : null,
      interleaveStreak: 0,
      finalCheckTotal: refreshQueue.length,
      isReopenedRefresh: true,
      cardLoopMeta,
    };
    return finalizeLoopSelection(refreshState, config);
  }

  const initial: DeckLoopState = {
    deckId,
    direction,
    phase: 'loop',
    virtualClock: 0,
    orderedCardIds,
    waitingQueue,
    activePool: [],
    clearedIds,
    sweepQueue: [],
    sweepPassedIds: [],
    sweepRound: 0,
    lastCardId: null,
    recentCardIds: [],
    currentCardId: null,
    currentSlotKind: null,
    interleaveStreak: 0,
    finalCheckTotal: 0,
    isReopenedRefresh: false,
    cardLoopMeta,
  };

  return finalizeLoopSelection(admitFromWaitingQueue(initial, config), config);
}

export function getCurrentLoopCardId(state: DeckLoopState): string | null {
  if (state.phase === 'done') return null;
  if (state.currentCardId) return state.currentCardId;
  return resolveNextSlot(state, CONFIDENCE_LOOP_CONFIG).cardId;
}

export function applyLoopRating(
  state: DeckLoopState,
  cardId: string,
  rating: RatingKey | 1 | 2 | 3 | 4 | 5,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
): DeckLoopState {
  if (state.phase === 'done') return state;

  const baseCardId = stripDirectionSuffix(cardId);
  const ratingNum = (
    typeof rating === 'number'
      ? Math.max(1, Math.min(5, Math.round(rating)))
      : ratingToConfidence(rating)
  ) as 1 | 2 | 3 | 4 | 5;

  const nextClock = state.virtualClock + 1;
  const prevMeta: DeckLoopCardMeta = state.cardLoopMeta[baseCardId] ?? {
    cardId: baseCardId,
    dueAt: state.virtualClock,
    confidence: 0 as ConfidenceRating,
    reviewCount: 0,
    consecutiveHighCount: 0,
    consecutiveFiveCount: 0,
    lastShownAt: -1,
    clearedAtClock: null,
    hadStruggleInSession: false,
    verifiedAfterClear: false,
    interleaveCount: 0,
  };

  const nextReviewCount = prevMeta.reviewCount + 1;
  const nextRecent = pushRecentCard(state.recentCardIds, baseCardId);
  const deckSize = state.orderedCardIds.length;

  // Detect whether the rated card was served as an Endgame Quick Refresh buffer
  const isInterleaveSlot =
    state.currentCardId === baseCardId &&
    state.currentSlotKind === 'interleave';

  // ==================== CASE 1: INTERLEAVED QUICK REFRESH CARD ====================
  if (isInterleaveSlot) {
    if (ratingNum >= config.clearThresholdRating) {
      // Mastered card held up! Advances spacing clock & marks post-clear verified
      const refreshedMeta: DeckLoopCardMeta = {
        ...prevMeta,
        confidence: ratingNum,
        reviewCount: nextReviewCount,
        consecutiveHighCount: prevMeta.consecutiveHighCount + 1,
        consecutiveFiveCount:
          ratingNum === 5 ? prevMeta.consecutiveFiveCount + 1 : 0,
        lastShownAt: nextClock,
        verifiedAfterClear: true,
        interleaveCount: prevMeta.interleaveCount + 1,
      };
      const nextState: DeckLoopState = {
        ...state,
        virtualClock: nextClock,
        lastCardId: baseCardId,
        recentCardIds: nextRecent,
        interleaveStreak: state.interleaveStreak + 1,
        cardLoopMeta: {
          ...state.cardLoopMeta,
          [baseCardId]: refreshedMeta,
        },
      };
      return finalizeLoopSelection(nextState, config);
    }

    // Real lapse caught on a Quick Refresh card (<4)!
    if (state.phase === 'sweep') {
      const gap = computeLoopGap(
        baseCardId,
        nextReviewCount,
        ratingNum,
        0,
        0,
        config,
        deckSize
      );
      const lapsedMeta: DeckLoopCardMeta = {
        ...prevMeta,
        dueAt: nextClock + gap,
        confidence: ratingNum,
        reviewCount: nextReviewCount,
        consecutiveHighCount: 0,
        consecutiveFiveCount: 0,
        lastShownAt: nextClock,
        hadStruggleInSession: true,
        verifiedAfterClear: false,
        interleaveCount: prevMeta.interleaveCount + 1,
      };
      const nextSweepQueue = state.sweepQueue.includes(baseCardId)
        ? state.sweepQueue
        : [...state.sweepQueue, baseCardId];
      const nextState: DeckLoopState = {
        ...state,
        virtualClock: nextClock,
        sweepQueue: nextSweepQueue,
        sweepPassedIds: state.sweepPassedIds.filter((id) => id !== baseCardId),
        finalCheckTotal: Math.max(
          state.finalCheckTotal,
          state.sweepPassedIds.filter((id) => id !== baseCardId).length +
            nextSweepQueue.length
        ),
        lastCardId: baseCardId,
        recentCardIds: nextRecent,
        interleaveStreak: 0,
        cardLoopMeta: {
          ...state.cardLoopMeta,
          [baseCardId]: lapsedMeta,
        },
      };
      return finalizeLoopSelection(nextState, config);
    }

    // In 'loop' phase: pull the forgotten Quick Refresh card back into activePool
    const gap = computeLoopGap(
      baseCardId,
      nextReviewCount,
      ratingNum,
      0,
      0,
      config,
      deckSize
    );
    const lapsedMeta: DeckLoopCardMeta = {
      ...prevMeta,
      dueAt: nextClock + gap,
      confidence: ratingNum,
      reviewCount: nextReviewCount,
      consecutiveHighCount: 0,
      consecutiveFiveCount: 0,
      lastShownAt: nextClock,
      clearedAtClock: null,
      hadStruggleInSession: true,
      verifiedAfterClear: false,
      interleaveCount: prevMeta.interleaveCount + 1,
    };
    const nextState: DeckLoopState = {
      ...state,
      virtualClock: nextClock,
      activePool: state.activePool.includes(baseCardId)
        ? state.activePool
        : [...state.activePool, baseCardId],
      clearedIds: state.clearedIds.filter((id) => id !== baseCardId),
      lastCardId: baseCardId,
      recentCardIds: nextRecent,
      interleaveStreak: 0,
      cardLoopMeta: {
        ...state.cardLoopMeta,
        [baseCardId]: lapsedMeta,
      },
    };
    return finalizeLoopSelection(nextState, config);
  }

  // ==================== CASE 2: SMART FINAL CHECK ('sweep') ====================
  if (state.phase === 'sweep') {
    const remainingSweep = state.sweepQueue.filter((id) => id !== baseCardId);

    if (ratingNum >= config.clearThresholdRating) {
      const nextPassed = state.sweepPassedIds.includes(baseCardId)
        ? state.sweepPassedIds
        : [...state.sweepPassedIds, baseCardId];
      const nextMeta: DeckLoopCardMeta = {
        ...prevMeta,
        confidence: ratingNum,
        reviewCount: nextReviewCount,
        consecutiveHighCount: prevMeta.consecutiveHighCount + 1,
        consecutiveFiveCount:
          ratingNum === 5 ? prevMeta.consecutiveFiveCount + 1 : 0,
        lastShownAt: nextClock,
        verifiedAfterClear: true,
      };
      const nextCardMetaMap = {
        ...state.cardLoopMeta,
        [baseCardId]: nextMeta,
      };

      if (remainingSweep.length > 0) {
        return finalizeLoopSelection(
          {
            ...state,
            virtualClock: nextClock,
            sweepQueue: remainingSweep,
            sweepPassedIds: nextPassed,
            lastCardId: baseCardId,
            recentCardIds: nextRecent,
            interleaveStreak: 0,
            cardLoopMeta: nextCardMetaMap,
          },
          config
        );
      }

      return {
        ...state,
        phase: 'done',
        virtualClock: nextClock,
        sweepQueue: [],
        sweepPassedIds: nextPassed,
        lastCardId: baseCardId,
        recentCardIds: nextRecent,
        currentCardId: null,
        currentSlotKind: null,
        interleaveStreak: 0,
        cardLoopMeta: nextCardMetaMap,
      };
    }

    // Missed during Final Check (<4): keep in Final Check and re-insert
    // 3-4 slots later (or buffer with Quick Refresh if sole remaining card)
    // instead of collapsing back into a broken 1-card loop!
    const gap = computeLoopGap(
      baseCardId,
      nextReviewCount,
      ratingNum,
      0,
      0,
      config,
      deckSize
    );
    const reinsertIndex = Math.min(remainingSweep.length, 3);
    const nextSweepQueue = [
      ...remainingSweep.slice(0, reinsertIndex),
      baseCardId,
      ...remainingSweep.slice(reinsertIndex),
    ];

    const missedMeta: DeckLoopCardMeta = {
      ...prevMeta,
      dueAt: nextClock + gap,
      confidence: ratingNum,
      reviewCount: nextReviewCount,
      consecutiveHighCount: 0,
      consecutiveFiveCount: 0,
      lastShownAt: nextClock,
      hadStruggleInSession: true,
      verifiedAfterClear: false,
    };

    const nextState: DeckLoopState = {
      ...state,
      phase: 'sweep',
      virtualClock: nextClock,
      sweepQueue: nextSweepQueue,
      sweepPassedIds: state.sweepPassedIds.filter((id) => id !== baseCardId),
      lastCardId: baseCardId,
      recentCardIds: nextRecent,
      interleaveStreak: 0,
      cardLoopMeta: {
        ...state.cardLoopMeta,
        [baseCardId]: missedMeta,
      },
    };
    return finalizeLoopSelection(nextState, config);
  }

  // ==================== CASE 3: MAIN CONFIDENCE LOOP ('loop') ====================
  const nextConsecutiveHigh =
    ratingNum >= config.clearThresholdRating
      ? prevMeta.consecutiveHighCount + 1
      : 0;
  const nextConsecutiveFive =
    ratingNum === 5 ? prevMeta.consecutiveFiveCount + 1 : 0;
  const isCleared = nextConsecutiveHigh >= config.clearConsecutiveHighCount;

  const nextDueAt = isCleared
    ? nextClock
    : nextClock +
      computeLoopGap(
        baseCardId,
        nextReviewCount,
        ratingNum,
        nextConsecutiveHigh,
        nextConsecutiveFive,
        config,
        deckSize
      );

  const nextMeta: DeckLoopCardMeta = {
    ...prevMeta,
    cardId: baseCardId,
    dueAt: nextDueAt,
    confidence: ratingNum,
    reviewCount: nextReviewCount,
    consecutiveHighCount: nextConsecutiveHigh,
    consecutiveFiveCount: nextConsecutiveFive,
    lastShownAt: nextClock,
    clearedAtClock: isCleared ? nextClock : null,
    hadStruggleInSession:
      prevMeta.hadStruggleInSession || ratingNum < config.clearThresholdRating,
    verifiedAfterClear: false,
  };

  let nextActivePool = state.activePool;
  let nextClearedIds = state.clearedIds;

  if (isCleared) {
    nextActivePool = state.activePool.filter((id) => id !== baseCardId);
    if (!nextClearedIds.includes(baseCardId)) {
      nextClearedIds = [...nextClearedIds, baseCardId];
    }
  } else if (!nextActivePool.includes(baseCardId)) {
    nextActivePool = [...nextActivePool, baseCardId];
  }

  let nextState: DeckLoopState = {
    ...state,
    virtualClock: nextClock,
    activePool: nextActivePool,
    clearedIds: nextClearedIds,
    lastCardId: baseCardId,
    recentCardIds: nextRecent,
    interleaveStreak: 0,
    cardLoopMeta: {
      ...state.cardLoopMeta,
      [baseCardId]: nextMeta,
    },
  };

  nextState = admitFromWaitingQueue(nextState, config);

  if (
    nextState.activePool.length === 0 &&
    nextState.waitingQueue.length === 0
  ) {
    const finalCheckQueue = buildSmartFinalCheckQueue(nextState, config);

    if (finalCheckQueue.length > 0) {
      const nextRound = nextState.sweepRound + 1;
      return finalizeLoopSelection(
        {
          ...nextState,
          phase: 'sweep',
          sweepRound: nextRound,
          sweepQueue: finalCheckQueue,
          finalCheckTotal: finalCheckQueue.length,
          isReopenedRefresh: false,
        },
        config
      );
    }

    return {
      ...nextState,
      phase: 'done',
      sweepQueue: [],
      currentCardId: null,
      currentSlotKind: null,
      finalCheckTotal: 0,
    };
  }

  return finalizeLoopSelection(nextState, config);
}

export function computeDeckLoopProgressPct(state: DeckLoopState): number {
  const total = state.orderedCardIds.length;
  if (total === 0) return 0;
  if (state.phase === 'done') return 100;

  if (state.phase === 'sweep') {
    const totalChecks = Math.max(
      1,
      state.finalCheckTotal ||
        state.sweepPassedIds.length + state.sweepQueue.length
    );
    const passed = Math.min(totalChecks, state.sweepPassedIds.length);
    if (state.isReopenedRefresh) {
      return Math.min(99, Math.round((passed / totalChecks) * 100));
    }
    return Math.min(99, 90 + Math.round((passed / totalChecks) * 9));
  }

  // Main loop maps smoothly across 0% -> 90%, granting 0.45 partial credit
  // for cards that have already earned their 1st high hit (>=4).
  let weighted = state.clearedIds.length;
  for (const id of state.activePool) {
    const meta = state.cardLoopMeta[id];
    if (meta && meta.consecutiveHighCount >= 1) {
      weighted += 0.45;
    }
  }
  return Math.min(90, Math.round((weighted / total) * 90));
}

export function replayDeckLoopSession(
  deckId: string,
  deckCardIds: readonly string[],
  basePersistedStates: Record<string, CardSrsState | undefined>,
  sessionReviewLogs: readonly Pick<
    ReviewLogEntry,
    'cardId' | 'rating' | 'reviewIndex' | 'timestamp' | 'eventType' | 'direction'
  >[],
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG,
  direction: StudyDirection = 'de-en'
): DeckLoopState {
  let state = createInitialDeckLoopState(
    deckId,
    deckCardIds,
    basePersistedStates,
    config,
    direction
  );

  const deckSet = new Set(deckCardIds.map(stripDirectionSuffix));
  const orderedLogs = [...sessionReviewLogs]
    .filter((log) => {
      if (log.eventType && log.eventType !== 'review') return false;
      const parsed = parseSrsStateKey(log.cardId);
      const logDirection: StudyDirection = log.direction ?? parsed.direction;
      return logDirection === direction && deckSet.has(parsed.cardId);
    })
    .sort((a, b) => {
      const ia = typeof a.reviewIndex === 'number' ? a.reviewIndex : Infinity;
      const ib = typeof b.reviewIndex === 'number' ? b.reviewIndex : Infinity;
      if (ia !== ib) return ia - ib;
      return (a.timestamp || '').localeCompare(b.timestamp || '');
    });

  for (const log of orderedLogs) {
    const norm = normalizeRatingKey(log.rating);
    if (!norm) continue;
    const { cardId } = parseSrsStateKey(log.cardId);
    state = applyLoopRating(state, cardId, norm, config);
  }

  return state;
}

export function computeConfidenceMasteryPct(
  cardIds: readonly string[],
  srsMap: Record<string, CardSrsState | undefined>,
  direction: StudyDirection = 'de-en'
): number {
  if (cardIds.length === 0) return 0;
  let sum = 0;
  for (const id of cardIds) {
    const key = getSrsStateKey(id, direction);
    const st = srsMap[key];
    const conf =
      typeof st?.confidence === 'number'
        ? Math.max(0, Math.min(5, st.confidence))
        : st?.lastRating
        ? ratingToConfidence(normalizeRatingKey(st.lastRating) ?? '1')
        : 0;
    sum += conf;
  }
  return Math.round((sum / (5 * cardIds.length)) * 100);
}
