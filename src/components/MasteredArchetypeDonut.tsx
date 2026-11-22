import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { CardCategory, CardSrsState, VocabCard } from '../data/vocabData';
import { createDefaultSrsState } from '../utils/srsEngine';
import { Card } from './HeroPrimitives';

export interface MasteredArchetypeDonutProps {
  cards: VocabCard[];
  srsMap: Record<string, CardSrsState>;
  isAnimationActive: boolean;
  onSelectArchetypeDeck?: (category: CardCategory) => void;
}

interface ArchetypeMeta {
  id: CardCategory;
  label: string;
  color: string;
}

const ARCHETYPE_CONFIG: ReadonlyArray<ArchetypeMeta> = [
  { id: 'noun', label: 'Nouns (der/die/das)', color: 'var(--chart-1)' },
  { id: 'verb', label: 'Verbs', color: 'var(--chart-2)' },
  { id: 'adj', label: 'Adjectives', color: 'var(--chart-3)' },
  { id: 'preposition', label: 'Prepositions', color: 'var(--chart-4)' },
  { id: 'conn', label: 'Connectors', color: 'var(--chart-5)' },
  { id: 'phrase', label: 'Phrases / Idioms', color: 'var(--intent-primary)' },
];

export const MasteredArchetypeDonut: React.FC<MasteredArchetypeDonutProps> = ({
  cards,
  srsMap,
  isAnimationActive,
  onSelectArchetypeDeck,
}) => {
  const { slices, activeSlices, totalMastered, totalCards } = useMemo(() => {
    const masteredByCat: Record<CardCategory, number> = {
      noun: 0,
      verb: 0,
      adj: 0,
      preposition: 0,
      conn: 0,
      phrase: 0,
    };
    const totalByCat: Record<CardCategory, number> = {
      noun: 0,
      verb: 0,
      adj: 0,
      preposition: 0,
      conn: 0,
      phrase: 0,
    };

    let masteredSum = 0;

    for (const card of cards) {
      totalByCat[card.category] = (totalByCat[card.category] || 0) + 1;
      const st = srsMap[card.id] || createDefaultSrsState(card.id);
      if (st.mastered === true || (st.confidence || 0) >= 4) {
        masteredByCat[card.category] = (masteredByCat[card.category] || 0) + 1;
        masteredSum += 1;
      }
    }

    const built = ARCHETYPE_CONFIG.map((cfg) => {
      const value = masteredByCat[cfg.id] || 0;
      const categoryTotal = totalByCat[cfg.id] || 0;
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
      totalCards: cards.length,
    };
  }, [cards, srsMap]);

  const chartData =
    activeSlices.length > 0
      ? activeSlices
      : [{ id: 'empty', label: 'Unmastered', value: 1, color: 'var(--border-subtle)', sharePct: 0, categoryTotal: 0 }];

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
              Mastered cards (confidence 4+) across all 6 German grammar archetypes
            </p>
          </div>
        </div>

        <div className="text-right font-sans tabular-nums shrink-0">
          <div className="text-sm font-bold text-[var(--fg-primary)]">
            {totalCards > 0
              ? `${Math.round((totalMastered / totalCards) * 100)}%`
              : '0%'}
          </div>
          <div className="text-[11px] text-[var(--fg-muted)]">
            of {totalCards} total
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[216px_1fr] gap-5 items-center pt-1">
        {/* Donut Ring with Centered Total Mastered Count */}
        <div className="relative h-52 w-full max-w-[216px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
                isAnimationActive={isAnimationActive && activeSlices.length > 0}
                animationDuration={360}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              {activeSlices.length > 0 && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-1)',
                    borderColor: 'var(--border-strong)',
                    borderRadius: 'var(--radius-control)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--fg-primary)',
                    boxShadow: 'var(--shadow-overlay)',
                  }}
                  formatter={(value, _name, item) => {
                    const count = Number(value ?? 0);
                    const pct = item?.payload?.sharePct ?? 0;
                    return [`${count} mastered (${pct}%)`, item?.payload?.label ?? ''];
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl font-bold tabular-nums text-[var(--fg-primary)] leading-none">
              {totalMastered}
            </span>
            <span className="text-[11px] font-medium text-[var(--fg-muted)] mt-1">
              mastered
            </span>
          </div>
        </div>

        {/* Clean Color-Coded Legend with Counts & Percentages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {slices.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectArchetypeDeck?.(item.id)}
              disabled={!onSelectArchetypeDeck}
              className="group px-3 py-2.5 radius-control surface-2/70 hover:bg-[var(--surface-2)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-left flex items-center justify-between gap-2.5 cursor-pointer disabled:cursor-default theme-focus"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full shrink-0"
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
          ))}
        </div>
      </div>
    </Card.Root>
  );
};
