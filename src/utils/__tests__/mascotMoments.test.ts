import { describe, expect, it } from 'vitest';
import {
  MASCOT_MOMENT_CATALOG,
  MilestoneThreshold,
  evaluateMilestoneTrigger,
  getUpcomingMomentSrcToPrefetch,
  selectCheckpointMoment,
  selectDeckCompletionMoment,
  selectEmptyQueueMoment,
} from '../mascotMoments';

describe('mascotMoments choreography engine', () => {
  it('registers all 11 upscaled transparent WebP mascot cutouts', () => {
    const keys = Object.keys(MASCOT_MOMENT_CATALOG);
    expect(keys).toHaveLength(11);
    for (const asset of Object.values(MASCOT_MOMENT_CATALOG)) {
      expect(asset.src).toMatch(/^\/assets\/mascot\/moments\/.+\.webp$/);
      expect(asset.width).toBe(512);
      expect(asset.height).toBe(512);
    }
  });

  it('enforces deck size, cooldown, opt-out, and non-repeat guardrails for 25/50/75 milestones', () => {
    expect(
      evaluateMilestoneTrigger({
        deckSize: 3,
        progressPct: 50,
        shownThresholds: new Set(),
        ratingsSinceLastMilestone: 5,
        enabled: true,
      })
    ).toBeNull();

    expect(
      evaluateMilestoneTrigger({
        deckSize: 12,
        progressPct: 30,
        shownThresholds: new Set(),
        ratingsSinceLastMilestone: 1,
        enabled: true,
      })
    ).toBeNull();

    expect(
      evaluateMilestoneTrigger({
        deckSize: 12,
        progressPct: 30,
        shownThresholds: new Set(),
        ratingsSinceLastMilestone: 3,
        enabled: false,
      })
    ).toBeNull();

    expect(
      evaluateMilestoneTrigger({
        deckSize: 12,
        progressPct: 28,
        shownThresholds: new Set(),
        ratingsSinceLastMilestone: 2,
        enabled: true,
      })
    ).toBe(25);

    expect(
      evaluateMilestoneTrigger({
        deckSize: 12,
        progressPct: 52,
        shownThresholds: new Set<MilestoneThreshold>([25, 50]),
        ratingsSinceLastMilestone: 4,
        enabled: true,
      })
    ).toBeNull();
  });

  it('selects context-appropriate checkpoint poses across time and performance', () => {
    expect(
      selectCheckpointMoment({
        threshold: 25,
        localHour: 8,
        recentAvgRating: 4,
        hasRetries: false,
      }).poseId
    ).toBe('coffee-cards');

    expect(
      selectCheckpointMoment({
        threshold: 25,
        localHour: 15,
        recentAvgRating: 4,
        hasRetries: false,
      }).poseId
    ).toBe('cozy-nest');

    expect(
      selectCheckpointMoment({
        threshold: 25,
        localHour: 22,
        recentAvgRating: 4,
        hasRetries: false,
      }).poseId
    ).toBe('midnight-oil');

    expect(
      selectCheckpointMoment({
        threshold: 50,
        localHour: 14,
        recentAvgRating: 2.8,
        hasRetries: true,
      }).poseId
    ).toBe('determined-focus');

    expect(
      selectCheckpointMoment({
        threshold: 50,
        localHour: 14,
        recentAvgRating: 4.5,
        hasRetries: false,
      }).poseId
    ).toBe('cozy-student');

    expect(
      selectCheckpointMoment({
        threshold: 75,
        localHour: 14,
        recentAvgRating: 4.2,
        hasRetries: false,
      }).poseId
    ).toBe('eureka-flag');
  });

  it('chooses adaptive deck completion and empty-queue cutouts', () => {
    expect(
      selectDeckCompletionMoment({
        avgRating: 4.6,
        totalReviews: 14,
        deckSize: 10,
        deckId: 'verb',
        deckTitle: 'Verbs',
        localHour: 11,
      }).poseId
    ).toBe('triumph-ecstatic');

    expect(
      selectDeckCompletionMoment({
        avgRating: 3.1,
        totalReviews: 28,
        deckSize: 10,
        deckId: 'verb',
        deckTitle: 'Verbs',
        localHour: 14,
      }).poseId
    ).toBe('relieved-satisfied');

    expect(
      selectDeckCompletionMoment({
        avgRating: 4.0,
        totalReviews: 14,
        deckSize: 10,
        deckId: 'noun',
        deckTitle: 'Nouns',
        localHour: 15,
      }).poseId
    ).toBe('haus-card');

    expect(
      selectDeckCompletionMoment({
        avgRating: 4.0,
        totalReviews: 14,
        deckSize: 10,
        deckId: 'all',
        deckTitle: 'All Cards',
        localHour: 15,
      }).poseId
    ).toBe('study-peak');

    expect(
      selectDeckCompletionMoment({
        avgRating: 4.8,
        totalReviews: 12,
        deckSize: 10,
        deckId: 'all',
        deckTitle: 'All Cards',
        localHour: 23,
      }).poseId
    ).toBe('study-sleepy');

    expect(selectEmptyQueueMoment(23).poseId).toBe('study-sleepy');
    expect(selectEmptyQueueMoment(14).poseId).toBe('relieved-satisfied');
  });

  it('returns JIT prefetch URLs strictly inside lookahead windows', () => {
    const early = getUpcomingMomentSrcToPrefetch({
      progressPct: 10,
      phase: 'loop',
      deckSize: 12,
      localHour: 10,
      recentAvgRating: 4,
      hasRetries: false,
      deckId: 'all',
      deckTitle: 'All',
      shownThresholds: new Set(),
      interludesEnabled: true,
    });
    expect(early).toBeNull();

    const approaching25 = getUpcomingMomentSrcToPrefetch({
      progressPct: 20,
      phase: 'loop',
      deckSize: 12,
      localHour: 9,
      recentAvgRating: 4,
      hasRetries: false,
      deckId: 'all',
      deckTitle: 'All',
      shownThresholds: new Set(),
      interludesEnabled: true,
    });
    expect(approaching25).toBe('/assets/mascot/moments/coffee-cards.webp');

    const sweepPrefetch = getUpcomingMomentSrcToPrefetch({
      progressPct: 85,
      phase: 'sweep',
      deckSize: 12,
      localHour: 14,
      recentAvgRating: 4.6,
      hasRetries: false,
      deckId: 'all',
      deckTitle: 'All',
      shownThresholds: new Set<MilestoneThreshold>([25, 50, 75]),
      interludesEnabled: true,
    });
    expect(sweepPrefetch).toBe('/assets/mascot/moments/triumph-ecstatic.webp');
  });
});
