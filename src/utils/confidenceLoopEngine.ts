import {
  CardSrsState,
  ConfidenceRating,
  normalizeRatingKey,
  RatingKey,
  ratingToConfidence,
  ReviewLogEntry,
} from '../data/vocabData';

export interface ConfidenceLoopConfig {
  workingSetCap: number;
  clearConsecutiveHighCount: number;
  clearThresholdRating: 1 | 2 | 3 | 4 | 5;
  minGapCards: number;
  gapTable: Record<1 | 2 | 3 | 4 | 5, readonly [number, number]>;
  fourMultiplier: number;
  fiveMultiplier: number;
}

export const CONFIDENCE_LOOP_CONFIG: ConfidenceLoopConfig = {
  workingSetCap: 10,
  clearConsecutiveHighCount: 2,
  clearThresholdRating: 4,
  minGapCards: 1,
  gapTable: {
    1: [2, 3],
    2: [4, 6],
    3: [7, 10],
    4: [12, 18],
    5: [25, 40],
  },
  fourMultiplier: 2,
  fiveMultiplier: 1.5,
};

export type DeckLoopPhase = 'loop' | 'sweep' | 'done';

export interface DeckLoopCardMeta {
  cardId: string;
  dueAt: number;
  confidence: ConfidenceRating;
  reviewCount: number;
  consecutiveHighCount: number;
  consecutiveFiveCount: number;
}

export interface DeckLoopState {
  deckId: string;
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
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
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

  return Math.max(config.minGapCards, Math.round(baseGap * multiplier));
}

function getMinDueAtInActivePool(state: DeckLoopState): number {
  if (state.activePool.length === 0) return Infinity;
  let minDue = Infinity;
  for (const id of state.activePool) {
    const due = state.cardLoopMeta[id]?.dueAt ?? 0;
    if (due < minDue) minDue = due;
  }
  return minDue;
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

    // Gate new cards strictly: admit only when active pool is empty or
    // no active card is currently due at or before the virtual clock.
    if (activePool.length > 0 && minDue <= state.virtualClock) {
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

export function createInitialDeckLoopState(
  deckId: string,
  cardIds: readonly string[],
  persistedStates: Record<string, CardSrsState | undefined>,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
): DeckLoopState {
  const seen = new Set<string>();
  const orderedCardIds: string[] = [];
  for (const id of cardIds) {
    if (id && !seen.has(id)) {
      seen.add(id);
      orderedCardIds.push(id);
    }
  }

  if (orderedCardIds.length === 0) {
    return {
      deckId,
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
      cardLoopMeta: {},
    };
  }

  const loopNeedSeen: string[] = [];
  const loopUnseen: string[] = [];
  const clearedIds: string[] = [];
  const cardLoopMeta: Record<string, DeckLoopCardMeta> = {};

  for (const cardId of orderedCardIds) {
    const st = persistedStates[cardId];
    const rawConf =
      typeof st?.confidence === 'number'
        ? st.confidence
        : st?.lastRating
        ? ratingToConfidence(normalizeRatingKey(st.lastRating) ?? '1')
        : 0;
    const confidence = Math.max(0, Math.min(5, Math.round(rawConf))) as ConfidenceRating;
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

    cardLoopMeta[cardId] = {
      cardId,
      dueAt: 0,
      confidence,
      reviewCount,
      consecutiveHighCount,
      consecutiveFiveCount,
    };

    if (confidence >= config.clearThresholdRating) {
      clearedIds.push(cardId);
    } else if (reviewCount > 0) {
      loopNeedSeen.push(cardId);
    } else {
      loopUnseen.push(cardId);
    }
  }

  // Reopened decks prioritize unsettled seen cards (lowest confidence first), followed by unseen cards
  loopNeedSeen.sort((a, b) => {
    const ca = cardLoopMeta[a]?.confidence ?? 0;
    const cb = cardLoopMeta[b]?.confidence ?? 0;
    return ca - cb;
  });

  const waitingQueue = [...loopNeedSeen, ...loopUnseen];

  if (waitingQueue.length === 0) {
    const sweepQueue = deterministicShuffle(orderedCardIds, `${deckId}:sweep:1`);
    return {
      deckId,
      phase: 'sweep',
      virtualClock: 0,
      orderedCardIds,
      waitingQueue: [],
      activePool: [],
      clearedIds,
      sweepQueue,
      sweepPassedIds: [],
      sweepRound: 1,
      lastCardId: null,
      cardLoopMeta,
    };
  }

  const initial: DeckLoopState = {
    deckId,
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
    cardLoopMeta,
  };

  return admitFromWaitingQueue(initial, config);
}

export function getCurrentLoopCardId(state: DeckLoopState): string | null {
  if (state.phase === 'done') return null;
  if (state.phase === 'sweep') {
    return state.sweepQueue[0] ?? null;
  }

  if (state.activePool.length === 0) return null;
  if (state.activePool.length === 1) return state.activePool[0];

  const orderIndexMap = new Map<string, number>();
  state.orderedCardIds.forEach((id, idx) => orderIndexMap.set(id, idx));

  const candidates = state.activePool.filter((id) => id !== state.lastCardId);
  const poolToPick = candidates.length > 0 ? candidates : state.activePool;

  let bestId = poolToPick[0];
  let bestDue = state.cardLoopMeta[bestId]?.dueAt ?? 0;
  let bestOrder = orderIndexMap.get(bestId) ?? 0;

  for (let i = 1; i < poolToPick.length; i += 1) {
    const id = poolToPick[i];
    const due = state.cardLoopMeta[id]?.dueAt ?? 0;
    const ord = orderIndexMap.get(id) ?? 0;
    if (due < bestDue || (due === bestDue && ord < bestOrder)) {
      bestId = id;
      bestDue = due;
      bestOrder = ord;
    }
  }

  return bestId;
}

export function applyLoopRating(
  state: DeckLoopState,
  cardId: string,
  rating: RatingKey | 1 | 2 | 3 | 4 | 5,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
): DeckLoopState {
  if (state.phase === 'done') return state;

  const ratingNum = (
    typeof rating === 'number'
      ? Math.max(1, Math.min(5, Math.round(rating)))
      : ratingToConfidence(rating)
  ) as 1 | 2 | 3 | 4 | 5;

  const nextClock = state.virtualClock + 1;
  const prevMeta = state.cardLoopMeta[cardId] ?? {
    cardId,
    dueAt: state.virtualClock,
    confidence: 0 as ConfidenceRating,
    reviewCount: 0,
    consecutiveHighCount: 0,
    consecutiveFiveCount: 0,
  };

  const nextReviewCount = prevMeta.reviewCount + 1;

  if (state.phase === 'sweep') {
    const remainingSweep = state.sweepQueue.filter((id) => id !== cardId);
    if (ratingNum >= config.clearThresholdRating) {
      const nextPassed = state.sweepPassedIds.includes(cardId)
        ? state.sweepPassedIds
        : [...state.sweepPassedIds, cardId];
      const nextMeta: DeckLoopCardMeta = {
        ...prevMeta,
        confidence: ratingNum,
        reviewCount: nextReviewCount,
        consecutiveHighCount: prevMeta.consecutiveHighCount + 1,
        consecutiveFiveCount:
          ratingNum === 5 ? prevMeta.consecutiveFiveCount + 1 : 0,
      };

      const nextCardMetaMap = {
        ...state.cardLoopMeta,
        [cardId]: nextMeta,
      };

      if (remainingSweep.length > 0) {
        return {
          ...state,
          virtualClock: nextClock,
          sweepQueue: remainingSweep,
          sweepPassedIds: nextPassed,
          lastCardId: cardId,
          cardLoopMeta: nextCardMetaMap,
        };
      }

      if (state.activePool.length > 0 || state.waitingQueue.length > 0) {
        const resumed = admitFromWaitingQueue(
          {
            ...state,
            phase: 'loop',
            virtualClock: nextClock,
            sweepQueue: [],
            sweepPassedIds: nextPassed,
            lastCardId: cardId,
            cardLoopMeta: nextCardMetaMap,
          },
          config
        );
        return resumed;
      }

      return {
        ...state,
        phase: 'done',
        virtualClock: nextClock,
        sweepQueue: [],
        sweepPassedIds: nextPassed,
        lastCardId: cardId,
        cardLoopMeta: nextCardMetaMap,
      };
    }

    // Missed during sweep (< 4): bounces back into loop immediately
    const gap = computeLoopGap(cardId, nextReviewCount, ratingNum, 0, 0, config);
    const bouncedMeta: DeckLoopCardMeta = {
      ...prevMeta,
      dueAt: nextClock + gap,
      confidence: ratingNum,
      reviewCount: nextReviewCount,
      consecutiveHighCount: 0,
      consecutiveFiveCount: 0,
    };

    return {
      ...state,
      phase: 'loop',
      virtualClock: nextClock,
      activePool: state.activePool.includes(cardId)
        ? state.activePool
        : [...state.activePool, cardId],
      clearedIds: state.clearedIds.filter((id) => id !== cardId),
      sweepQueue: remainingSweep,
      sweepPassedIds: state.sweepPassedIds.filter((id) => id !== cardId),
      lastCardId: cardId,
      cardLoopMeta: {
        ...state.cardLoopMeta,
        [cardId]: bouncedMeta,
      },
    };
  }

  // phase === 'loop'
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
        cardId,
        nextReviewCount,
        ratingNum,
        nextConsecutiveHigh,
        nextConsecutiveFive,
        config
      );

  const nextMeta: DeckLoopCardMeta = {
    cardId,
    dueAt: nextDueAt,
    confidence: ratingNum,
    reviewCount: nextReviewCount,
    consecutiveHighCount: nextConsecutiveHigh,
    consecutiveFiveCount: nextConsecutiveFive,
  };

  let nextActivePool = state.activePool;
  let nextClearedIds = state.clearedIds;

  if (isCleared) {
    nextActivePool = state.activePool.filter((id) => id !== cardId);
    if (!nextClearedIds.includes(cardId)) {
      nextClearedIds = [...nextClearedIds, cardId];
    }
  } else if (!nextActivePool.includes(cardId)) {
    nextActivePool = [...nextActivePool, cardId];
  }

  let nextState: DeckLoopState = {
    ...state,
    virtualClock: nextClock,
    activePool: nextActivePool,
    clearedIds: nextClearedIds,
    lastCardId: cardId,
    cardLoopMeta: {
      ...state.cardLoopMeta,
      [cardId]: nextMeta,
    },
  };

  nextState = admitFromWaitingQueue(nextState, config);

  if (
    nextState.activePool.length === 0 &&
    nextState.waitingQueue.length === 0
  ) {
    const passedSet = new Set(nextState.sweepPassedIds);
    const remainingSweepSet = new Set(nextState.sweepQueue);
    const needsSweep = nextState.orderedCardIds.filter(
      (id) => !passedSet.has(id) || remainingSweepSet.has(id)
    );

    if (needsSweep.length > 0) {
      const nextRound = nextState.sweepRound + 1;
      return {
        ...nextState,
        phase: 'sweep',
        sweepRound: nextRound,
        sweepQueue: deterministicShuffle(
          needsSweep,
          `${nextState.deckId}:sweep:${nextRound}`
        ),
      };
    }

    return {
      ...nextState,
      phase: 'done',
      sweepQueue: [],
    };
  }

  return nextState;
}

export function replayDeckLoopSession(
  deckId: string,
  deckCardIds: readonly string[],
  basePersistedStates: Record<string, CardSrsState | undefined>,
  sessionReviewLogs: readonly Pick<
    ReviewLogEntry,
    'cardId' | 'rating' | 'reviewIndex' | 'timestamp' | 'eventType'
  >[],
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
): DeckLoopState {
  let state = createInitialDeckLoopState(
    deckId,
    deckCardIds,
    basePersistedStates,
    config
  );

  const deckSet = new Set(deckCardIds);
  const orderedLogs = [...sessionReviewLogs]
    .filter(
      (log) =>
        (!log.eventType || log.eventType === 'review') &&
        deckSet.has(log.cardId)
    )
    .sort((a, b) => {
      const ia = typeof a.reviewIndex === 'number' ? a.reviewIndex : Infinity;
      const ib = typeof b.reviewIndex === 'number' ? b.reviewIndex : Infinity;
      if (ia !== ib) return ia - ib;
      return (a.timestamp || '').localeCompare(b.timestamp || '');
    });

  for (const log of orderedLogs) {
    const norm = normalizeRatingKey(log.rating);
    if (!norm) continue;
    state = applyLoopRating(state, log.cardId, norm, config);
  }

  return state;
}

export function computeConfidenceMasteryPct(
  cardIds: readonly string[],
  srsMap: Record<string, CardSrsState | undefined>
): number {
  if (cardIds.length === 0) return 0;
  let sum = 0;
  for (const id of cardIds) {
    const st = srsMap[id];
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
