import React, { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { CardCategory, CardSrsState, VocabCard } from '../data/vocabData';
import { createDefaultSrsState } from '../utils/srsEngine';
import { Card } from './HeroPrimitives';

export interface MasteredArchetypeDonutProps {
  cards: VocabCard[];
  srsMap: Record<string, CardSrsState>;
  isAnimationActive: boolean;
}

type DonutArchetypeId = Extract<
  CardCategory,
  'noun' | 'verb' | 'adj' | 'phrase'
>;

interface ArchetypeMeta {
  id: DonutArchetypeId;
  label: string;
  shortLabel: string;
  color: string;
}

const ARCHETYPE_CONFIG: ReadonlyArray<ArchetypeMeta> = [
  {
    id: 'noun',
    label: 'Nouns (der/die/das)',
    shortLabel: 'Nouns',
    color: 'var(--chart-1)',
  },
  { id: 'verb', label: 'Verbs', shortLabel: 'Verbs', color: 'var(--chart-2)' },
  {
    id: 'adj',
    label: 'Adjectives',
    shortLabel: 'Adjectives',
    color: 'var(--chart-3)',
  },
  {
    id: 'phrase',
    label: 'Phrases / Idioms',
    shortLabel: 'Phrases',
    color: 'var(--chart-4)',
  },
];

const TRACKED_CATEGORIES = new Set<string>(
  ARCHETYPE_CONFIG.map((cfg) => cfg.id)
);

export const MasteredArchetypeDonut: React.FC<MasteredArchetypeDonutProps> = ({
  cards,
  srsMap,
  isAnimationActive,
}) => {
  const [selectedId, setSelectedId] = useState<DonutArchetypeId | null>(null);
  const [hoveredId, setHoveredId] = useState<DonutArchetypeId | null>(null);

  const { slices, activeSlices, totalMastered, totalTrackedCards } =
    useMemo(() => {
      const masteredByCat: Record<DonutArchetypeId, number> = {
        noun: 0,
        verb: 0,
        adj: 0,
        phrase: 0,
      };
      const totalByCat: Record<DonutArchetypeId, number> = {
        noun: 0,
        verb: 0,
        adj: 0,
        phrase: 0,
      };

      let masteredSum = 0;
      let trackedSum = 0;

      for (const card of cards) {
        if (!TRACKED_CATEGORIES.has(card.category)) continue;
        const cat = card.category as DonutArchetypeId;
        totalByCat[cat] += 1;
        trackedSum += 1;

        const st = srsMap[card.id] || createDefaultSrsState(card.id);
        if (st.mastered === true || (st.confidence || 0) >= 4) {
          masteredByCat[cat] += 1;
          masteredSum += 1;
        }
      }

      const built = ARCHETYPE_CONFIG.map((cfg) => {
        const value = masteredByCat[cfg.id];
        const categoryTotal = totalByCat[cfg.id];
        const sharePct =
          masteredSum > 0 ? Math.round((value / masteredSum) * 100) : 0;
        return {
          ...cfg,
          value,
          categoryTotal,
          sharePct,
        };
      });

      return {
        slices: built,
        activeSlices: built.filter((s) => s.value > 0),
        totalMastered: masteredSum,
        totalTrackedCards: trackedSum,
      };
    }, [cards, srsMap]);

  const highlightedId = selectedId ?? hoveredId;
  const highlightedSlice = useMemo(
    () => slices.find((s) => s.id === highlightedId) ?? null,
    [slices, highlightedId]
  );

  const toggleHighlight = (id: DonutArchetypeId) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const chartData =
    activeSlices.length > 0
      ? activeSlices
      : [
          {
            id: 'empty' as const,
            label: 'Unmastered',
            shortLabel: 'mastered',
            value: 1,
            color: 'var(--border-subtle)',
            sharePct: 0,
            categoryTotal: 0,
          },
        ];

  return (
    <Card.Root className="p-5 space-y-4 surface-paper">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 radius-control bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)] flex items-center justify-center shrink-0">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-bold text-[var(--fg-primary)]">
              Mastered Vocabulary Breakdown
            </h2>
            <p className="text-xs text-[var(--fg-secondary)]">
              Mastered cards across Nouns, Verbs, Adjectives &amp; Phrases
            </p>
          </div>
        </div>

        <div className="text-right font-sans tabular-nums shrink-0">
          <div className="text-sm font-bold text-[var(--fg-primary)]">
            {totalTrackedCards > 0
              ? `${Math.round((totalMastered / totalTrackedCards) * 100)}%`
              : '0%'}
          </div>
          <div className="text-[11px] text-[var(--fg-muted)]">
            of {totalTrackedCards} total
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[216px_1fr] gap-5 items-center pt-1">
        {/* Donut Ring with Centered Total / Active Highlight Readout */}
        <div className="relative h-52 w-full max-w-[216px] mx-auto select-none">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer={false}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="64%"
                outerRadius="88%"
                paddingAngle={activeSlices.length > 1 ? 3 : 0}
                cornerRadius={activeSlices.length > 0 ? 5 : 0}
                stroke="none"
                rootTabIndex={-1}
                isAnimationActive={isAnimationActive && activeSlices.length > 0}
                animationDuration={340}
                onMouseLeave={() => setHoveredId(null)}
              >
                {chartData.map((entry) => {
                  const isRealSlice = entry.id !== 'empty';
                  const isHighlighted =
                    isRealSlice && highlightedId === entry.id;
                  const isDimmed =
                    isRealSlice &&
                    highlightedId !== null &&
                    highlightedId !== entry.id;

                  return (
                    <Cell
                      key={entry.id}
                      fill={entry.color}
                      fillOpacity={isDimmed ? 0.25 : 1}
                      stroke={isHighlighted ? entry.color : 'none'}
                      strokeWidth={isHighlighted ? 3 : 0}
                      style={{
                        cursor: isRealSlice ? 'pointer' : 'default',
                        outline: 'none',
                        transition:
                          'fill-opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), stroke-width 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={() => {
                        if (isRealSlice) setHoveredId(entry.id);
                      }}
                      onClick={() => {
                        if (isRealSlice) toggleHighlight(entry.id);
                      }}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-5">
            {highlightedSlice ? (
              <>
                <span
                  className="font-display text-2xl font-bold tabular-nums leading-none transition-colors duration-200"
                  style={{ color: highlightedSlice.color }}
                >
                  {highlightedSlice.value}
                </span>
                <span className="text-[11px] font-semibold text-[var(--fg-primary)] mt-1 truncate max-w-full">
                  {highlightedSlice.shortLabel}
                </span>
                <span className="text-[10px] font-medium tabular-nums text-[var(--fg-muted)] mt-0.5">
                  {highlightedSlice.sharePct}% of mastered
                </span>
              </>
            ) : (
              <>
                <span className="font-display text-2xl font-bold tabular-nums text-[var(--fg-primary)] leading-none">
                  {totalMastered}
                </span>
                <span className="text-[11px] font-medium text-[var(--fg-muted)] mt-1">
                  mastered
                </span>
              </>
            )}
          </div>
        </div>

        {/* Interactive Highlight-Only Legend (No Page Redirection) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {slices.map((item) => {
            const isSelected = selectedId === item.id;
            const isDimmed =
              highlightedId !== null && highlightedId !== item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleHighlight(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group px-3 py-2.5 radius-control border text-left flex items-center justify-between gap-2.5 cursor-pointer transition-[background-color,border-color,opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] theme-focus ${
                  isSelected
                    ? 'surface-2 border-[var(--fg-primary)]/45'
                    : 'surface-2/70 hover:bg-[var(--surface-2)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                } ${isDimmed ? 'opacity-55' : 'opacity-100'}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200 ${
                      isSelected ? 'scale-125' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-[var(--fg-primary)] truncate">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 font-sans tabular-nums shrink-0">
                  <span className="text-xs font-bold text-[var(--fg-primary)]">
                    {item.value}
                  </span>
                  <span className="text-[11px] text-[var(--fg-muted)]">
                    · {item.sharePct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card.Root>
  );
};
