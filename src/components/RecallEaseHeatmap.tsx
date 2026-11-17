import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import {
  BookOpen,
  Compass,
  GitCommitHorizontal,
  Link2,
  MessageSquareQuote,
  Play,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  CardCategory,
  CardSrsState,
  CefrLevel,
  VocabCard,
} from '../data/vocabData';
import {
  ColorMode,
  ThemeId,
  createDefaultSrsState,
  isCardNew,
} from '../utils/srsEngine';
import { Button, Card } from './HeroPrimitives';
import { SlidingPillSwitcher } from './SlidingPillSwitcher';

interface RecallEaseHeatmapProps {
  cards: VocabCard[];
  srsMap: Record<string, CardSrsState>;
  themeId: ThemeId;
  colorMode: ColorMode;
  onSelectArchetypeDeck: (category: CardCategory) => void;
}

type HeatmapMode = 'confidence' | 'mastery';

type ConfidenceTier = 'empty' | 'new' | 'low' | 'building' | 'steady' | 'strong';

interface HeatmapCellData {
  category: CardCategory;
  categoryLabel: string;
  categorySubtitle: string;
  categoryShort: string;
  categoryMobileShort: string;
  cefr: CefrLevel | 'ALL';
  confidencePct: number;
  avgConfidence: number;
  cardCount: number;
  reviewedCount: number;
  masteredCount: number;
  lowConfidenceCount: number;
  practicedPct: number;
  masteredPct: number;
  hardestCard: VocabCard | null;
  hardestConfidence: number | null;
  starterCard: VocabCard | null;
}

const ARCHETYPE_ROWS: {
  id: CardCategory;
  label: string;
  subtitle: string;
  short: string;
  mobileShort: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'verb',
    label: 'Verben',
    subtitle: 'Stammformen',
    short: 'Verben',
    mobileShort: 'Verben',
    icon: GitCommitHorizontal,
  },
  {
    id: 'noun',
    label: 'Nomen',
    subtitle: 'Genus & Kasus',
    short: 'Nomen',
    mobileShort: 'Nomen',
    icon: BookOpen,
  },
  {
    id: 'adj',
    label: 'Adjektive',
    subtitle: 'Steigerung',
    short: 'Adjektive',
    mobileShort: 'Adjekt.',
    icon: Sparkles,
  },
  {
    id: 'preposition',
    label: 'Präpositionen',
    subtitle: 'Rektion',
    short: 'Präpositionen',
    mobileShort: 'Präpos.',
    icon: Compass,
  },
  {
    id: 'conn',
    label: 'Konnektoren',
    subtitle: 'Satzbau',
    short: 'Konnektoren',
    mobileShort: 'Konnekt.',
    icon: Link2,
  },
  {
    id: 'phrase',
    label: 'Wendungen',
    subtitle: 'Redemittel',
    short: 'Wendungen',
    mobileShort: 'Wendung',
    icon: MessageSquareQuote,
  },
];

const CEFR_COLS: (CefrLevel | 'ALL')[] = ['A1', 'A2', 'B1', 'ALL'];

function getConfidenceTier(
  cell: HeatmapCellData,
  mode: HeatmapMode
): ConfidenceTier {
  if (cell.cardCount === 0) return 'empty';
  if (cell.reviewedCount === 0) return 'new';

  if (mode === 'mastery') {
    if (cell.masteredPct >= 75) return 'strong';
    if (cell.masteredPct >= 40) return 'steady';
    if (cell.masteredPct >= 15 || cell.practicedPct >= 35) return 'building';
    return 'low';
  }

  if (cell.confidencePct < 40) return 'low';
  if (cell.confidencePct < 60) return 'building';
  if (cell.confidencePct < 80) return 'steady';
  return 'strong';
}

const TIER_STYLES: Record<
  ConfidenceTier,
  {
    bgStyle: string;
    borderStyle: string;
    accentColor: string;
    dotBg: string;
    diagnosticText: string;
    diagnosticColor: string;
  }
> = {
  empty: {
    bgStyle: 'bg-[var(--surface-2)]/40',
    borderStyle: 'border border-dashed border-[var(--border-subtle)]',
    accentColor: 'var(--border-strong)',
    dotBg: 'bg-[var(--border-strong)]',
    diagnosticText: 'Keine Karten in dieser Stufe',
    diagnosticColor: 'text-[var(--fg-muted)]',
  },
  new: {
    bgStyle: 'bg-[var(--surface-2)]/80 hover:bg-[var(--surface-2)]',
    borderStyle: 'border border-[var(--border-subtle)]',
    accentColor: 'var(--fg-muted)',
    dotBg: 'bg-[var(--fg-muted)]/50',
    diagnosticText: 'Noch ungeübt · Bereit zum Start',
    diagnosticColor: 'text-[var(--fg-secondary)]',
  },
  low: {
    bgStyle: 'bg-[var(--heat-1)]',
    borderStyle: 'border border-[var(--conf-1-border)]',
    accentColor: 'var(--conf-1)',
    dotBg: 'bg-[var(--conf-1)]',
    diagnosticText: 'Fokus empfohlen (1–2)',
    diagnosticColor: 'text-[var(--conf-1)]',
  },
  building: {
    bgStyle: 'bg-[var(--heat-2)]',
    borderStyle: 'border border-[var(--conf-3-border)]',
    accentColor: 'var(--conf-3)',
    dotBg: 'bg-[var(--conf-3)]',
    diagnosticText: 'Im Aufbau',
    diagnosticColor: 'text-[var(--conf-3)]',
  },
  steady: {
    bgStyle: 'bg-[var(--heat-3)]',
    borderStyle: 'border border-[var(--conf-4-border)]',
    accentColor: 'var(--conf-4)',
    dotBg: 'bg-[var(--conf-4)]',
    diagnosticText: 'Stabil verankert',
    diagnosticColor: 'text-[var(--conf-4)]',
  },
  strong: {
    bgStyle: 'bg-[var(--heat-4)]',
    borderStyle: 'border border-[var(--conf-5-border)]',
    accentColor: 'var(--conf-5)',
    dotBg: 'bg-[var(--conf-5)]',
    diagnosticText: 'Sicher beherrscht (4–5)',
    diagnosticColor: 'text-[var(--conf-5)]',
  },
};

const CellBreakdownDonut: React.FC<{
  total: number;
  reviewed: number;
  mastered: number;
}> = ({ total, reviewed, mastered }) => {
  const inProgress = Math.max(0, reviewed - mastered);
  const unseen = Math.max(0, total - reviewed);
  const reviewedPct = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  const arcs = useMemo(() => {
    if (total === 0) return [];
    const segments = [
      { key: 'mastered', value: mastered, color: 'var(--conf-5)' },
      { key: 'progress', value: inProgress, color: 'var(--conf-4)' },
      { key: 'unseen', value: unseen, color: 'var(--border-strong)' },
    ].filter((s) => s.value > 0);

    const pieGen = d3
      .pie<{ key: string; value: number; color: string }>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(segments.length > 1 ? 0.05 : 0);

    const arcGen = d3
      .arc<d3.PieArcDatum<{ key: string; value: number; color: string }>>()
      .innerRadius(16)
      .outerRadius(22)
      .cornerRadius(3);

    return pieGen(segments).map((slice) => ({
      key: slice.data.key,
      color: slice.data.color,
      d: arcGen(slice) || '',
    }));
  }, [total, mastered, inProgress, unseen]);

  return (
    <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
      <svg
        width={48}
        height={48}
        viewBox="-24 -24 48 48"
        aria-hidden="true"
      >
        {total === 0 ? (
          <circle
            r={19}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={5.5}
          />
        ) : (
          arcs.map((a) => (
            <path
              key={a.key}
              d={a.d}
              fill={a.color}
              className="transition-all duration-300"
            />
          ))
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sans text-[11px] font-bold tabular-nums text-[var(--fg-primary)]">
        {reviewedPct}%
      </span>
    </div>
  );
};

export const RecallEaseHeatmap: React.FC<RecallEaseHeatmapProps> = ({
  cards,
  srsMap,
  onSelectArchetypeDeck,
}) => {
  const [mode, setMode] = useState<HeatmapMode>('confidence');
  const [selectedKey, setSelectedKey] = useState<{
    category: CardCategory;
    cefr: CefrLevel | 'ALL';
  } | null>(null);

  const { matrixData, hardestReviewedCell, firstActiveCell } = useMemo(() => {
    const cells: HeatmapCellData[] = [];

    for (const row of ARCHETYPE_ROWS) {
      for (const col of CEFR_COLS) {
        const matching = cards.filter(
          (c) =>
            c.category === row.id && (col === 'ALL' ? true : c.cefr === col)
        );

        let totalConfidenceSum = 0;
        let reviewedConfidenceSum = 0;
        let reviewedCount = 0;
        let masteredCount = 0;
        let lowConfidenceCount = 0;
        let hardestCard: VocabCard | null = null;
        let hardestConfidence: number | null = null;

        for (const c of matching) {
          const st = srsMap[c.id] || createDefaultSrsState(c.id);
          const conf = st.confidence || 0;
          totalConfidenceSum += conf;
          if (conf >= 4) masteredCount += 1;

          if (!isCardNew(st) && conf > 0) {
            reviewedCount += 1;
            reviewedConfidenceSum += conf;
            if (conf <= 2) {
              lowConfidenceCount += 1;
            }
            if (hardestConfidence === null || conf < hardestConfidence) {
              hardestConfidence = conf;
              hardestCard = c;
            }
          }
        }

        const confidencePct =
          matching.length > 0
            ? Math.round((totalConfidenceSum / (5 * matching.length)) * 100)
            : 0;
        const avgConfidence =
          reviewedCount > 0
            ? Number((reviewedConfidenceSum / reviewedCount).toFixed(1))
            : 0;

        const practicedPct =
          matching.length > 0
            ? Math.round((reviewedCount / matching.length) * 100)
            : 0;
        const masteredPct =
          matching.length > 0
            ? Math.round((masteredCount / matching.length) * 100)
            : 0;

        cells.push({
          category: row.id,
          categoryLabel: row.label,
          categorySubtitle: row.subtitle,
          categoryShort: row.short,
          categoryMobileShort: row.mobileShort,
          cefr: col,
          confidencePct,
          avgConfidence,
          cardCount: matching.length,
          reviewedCount,
          masteredCount,
          lowConfidenceCount,
          practicedPct,
          masteredPct,
          hardestCard,
          hardestConfidence,
          starterCard: matching[0] || null,
        });
      }
    }

    const reviewedSummaries = cells.filter(
      (c) => c.cefr === 'ALL' && c.reviewedCount > 0
    );
    const sortedReviewed = [...reviewedSummaries].sort(
      (a, b) =>
        a.confidencePct - b.confidencePct ||
        b.lowConfidenceCount - a.lowConfidenceCount
    );

    const firstNonEmpty =
      cells.find((c) => c.cefr === 'ALL' && c.cardCount > 0) || cells[0] || null;

    return {
      matrixData: cells,
      hardestReviewedCell: sortedReviewed[0] || null,
      firstActiveCell: firstNonEmpty,
    };
  }, [cards, srsMap]);

  const activeCell = useMemo(() => {
    if (selectedKey) {
      const found = matrixData.find(
        (c) =>
          c.category === selectedKey.category && c.cefr === selectedKey.cefr
      );
      if (found && found.cardCount > 0) return found;
    }
    return hardestReviewedCell || firstActiveCell;
  }, [selectedKey, matrixData, hardestReviewedCell, firstActiveCell]);

  const activeTier = activeCell ? getConfidenceTier(activeCell, mode) : 'new';
  const activeTierMeta = TIER_STYLES[activeTier];
  const activeRowMeta = activeCell
    ? ARCHETYPE_ROWS.find((r) => r.id === activeCell.category)
    : undefined;
  const ActiveIcon = activeRowMeta?.icon || Target;

  const cellLookup = useMemo(() => {
    const map = new Map<string, HeatmapCellData>();
    for (const cell of matrixData) {
      map.set(`${cell.category}:${cell.cefr}`, cell);
    }
    return map;
  }, [matrixData]);

  return (
    <Card.Root className="p-4 sm:p-5 space-y-4 surface-paper">
      {/* Header Row + Metric Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 radius-control bg-terracotta-soft text-terracotta flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-bold text-[var(--fg-primary)] leading-snug">
              Grammatik-Heatmap
            </h2>
            <p className="text-xs text-[var(--fg-secondary)] leading-snug">
              {mode === 'confidence'
                ? 'Vertrauen (1–5) je Bereich & CEFR-Stufe'
                : 'Anteil sicherer Karten (4–5) je Bereich & CEFR-Stufe'}
            </p>
          </div>
        </div>

        <SlidingPillSwitcher
          options={[
            { id: 'confidence', label: 'Vertrauen %' },
            { id: 'mastery', label: 'Stufe 4–5' },
          ]}
          value={mode}
          onChange={setMode}
          ariaLabel="Heatmap metric mode"
          size="sm"
          className="self-start sm:self-auto shrink-0"
        />
      </div>

      {/* Tactile Responsive CSS Grid Matrix */}
      <div
        role="grid"
        aria-label="Grammatik-Heatmap nach Kategorie und CEFR-Stufe"
        className="space-y-1.5"
      >
        <div
          role="row"
          className="grid grid-cols-[minmax(74px,0.92fr)_repeat(3,minmax(0,1fr))_minmax(0,1fr)] sm:grid-cols-[minmax(156px,1.28fr)_repeat(3,minmax(0,1fr))_minmax(0,1.04fr)] gap-1.5 sm:gap-2 items-center pb-0.5"
        >
          <div
            role="columnheader"
            className="text-[11px] font-medium text-[var(--fg-muted)] pl-0 pr-1.5"
          >
            Bereich
          </div>
          {CEFR_COLS.map((col) => (
            <div
              key={col}
              role="columnheader"
              className={`text-center text-[11px] font-medium ${
                col === 'ALL'
                  ? 'text-[var(--fg-primary)] font-semibold ml-0.5 sm:ml-1.5'
                  : 'text-[var(--fg-secondary)]'
              }`}
            >
              {col === 'ALL' ? (
                <span>
                  <span className="sm:hidden">Gesamt</span>
                  <span className="hidden sm:inline">Ø Gesamt</span>
                </span>
              ) : (
                <span>
                  <span className="sm:hidden">{col}</span>
                  <span className="hidden sm:inline">CEFR {col}</span>
                </span>
              )}
            </div>
          ))}
        </div>

        {ARCHETYPE_ROWS.map((row) => {
          const RowIcon = row.icon;
          const isRowActive = activeCell?.category === row.id;

          return (
            <div
              key={row.id}
              role="row"
              className="grid grid-cols-[minmax(74px,0.92fr)_repeat(3,minmax(0,1fr))_minmax(0,1fr)] sm:grid-cols-[minmax(156px,1.28fr)_repeat(3,minmax(0,1fr))_minmax(0,1.04fr)] gap-1.5 sm:gap-2 items-center"
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedKey({ category: row.id, cefr: 'ALL' })
                }
                className="group flex items-center gap-2.5 text-left radius-control pl-0 pr-1.5 py-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] min-w-0"
              >
                <span
                  className={`hidden sm:flex w-7 h-7 radius-control items-center justify-center shrink-0 transition-colors ${
                    isRowActive
                      ? 'bg-[var(--surface-3)] text-[var(--fg-primary)]'
                      : 'bg-[var(--surface-2)] text-[var(--fg-secondary)] group-hover:bg-[var(--surface-3)] group-hover:text-[var(--fg-primary)]'
                  }`}
                >
                  <RowIcon className="w-3.5 h-3.5" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span
                    className={`block text-[11.5px] sm:text-[12.5px] truncate transition-colors ${
                      isRowActive
                        ? 'font-semibold text-[var(--fg-primary)]'
                        : 'font-medium text-[var(--fg-secondary)] group-hover:text-[var(--fg-primary)]'
                    }`}
                  >
                    <span className="sm:hidden">{row.mobileShort}</span>
                    <span className="hidden sm:inline">{row.label}</span>
                  </span>
                  <span className="hidden sm:block text-[10.5px] text-[var(--fg-muted)] truncate mt-0.5">
                    {row.subtitle}
                  </span>
                </span>
              </button>

              {CEFR_COLS.map((col) => {
                const cell = cellLookup.get(`${row.id}:${col}`);
                if (!cell) return null;

                const tier = getConfidenceTier(cell, mode);
                const meta = TIER_STYLES[tier];
                const isSelected =
                  activeCell?.category === cell.category &&
                  activeCell?.cefr === cell.cefr;
                const isDisabled = cell.cardCount === 0;
                const isSummary = col === 'ALL';

                const fillPct =
                  mode === 'confidence'
                    ? cell.confidencePct
                    : cell.masteredPct > 0
                    ? cell.masteredPct
                    : Math.round(cell.practicedPct * 0.35);

                return (
                  <div
                    key={col}
                    className={isSummary ? 'ml-0.5 sm:ml-1.5 flex' : 'flex'}
                  >
                    <button
                      type="button"
                      role="gridcell"
                      disabled={isDisabled}
                      aria-selected={isSelected}
                      aria-label={`${row.label} ${
                        col === 'ALL' ? 'Gesamt' : col
                      }: ${
                        cell.cardCount === 0
                          ? 'Keine Karten'
                          : cell.reviewedCount === 0
                          ? `${cell.cardCount} neue Karten`
                          : `Vertrauen ${cell.confidencePct}%, ${cell.reviewedCount} von ${cell.cardCount} geübt`
                      }`}
                      onClick={() =>
                        setSelectedKey({
                          category: cell.category,
                          cefr: cell.cefr,
                        })
                      }
                      style={
                        isSelected
                          ? {
                              boxShadow:
                                'inset 0 0 0 1.5px var(--fg-primary), var(--shadow-card)',
                            }
                          : undefined
                      }
                      className={`group relative w-full h-[46px] sm:h-[50px] px-1 sm:px-2.5 radius-control flex flex-col items-center justify-center transition-[background-color,border-color,box-shadow,transform,filter] duration-200 theme-focus ${
                        meta.bgStyle
                      } ${
                        isSelected
                          ? 'border border-transparent'
                          : meta.borderStyle
                      } ${
                        isDisabled
                          ? 'cursor-default opacity-50'
                          : 'cursor-pointer hover:brightness-[0.98] dark:hover:brightness-110 active:scale-[0.98]'
                      }`}
                    >
                      {cell.cardCount === 0 ? (
                        <span className="text-xs text-[var(--fg-muted)]">·</span>
                      ) : cell.reviewedCount === 0 ? (
                        <div className="flex flex-col items-center justify-center leading-none">
                          <span className="font-sans text-[12px] sm:text-[13px] font-semibold tabular-nums text-[var(--fg-secondary)]">
                            {cell.cardCount}
                          </span>
                          <span className="mt-1 text-[9.5px] font-medium text-[var(--fg-muted)]">
                            Neu
                          </span>
                        </div>
                      ) : mode === 'confidence' ? (
                        <div className="flex flex-col items-center justify-center leading-none w-full">
                          <div className="flex items-center justify-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotBg}`}
                              aria-hidden="true"
                            />
                            <span className="font-sans text-[12px] sm:text-[13.5px] font-semibold tabular-nums text-[var(--fg-primary)]">
                              {cell.confidencePct}%
                            </span>
                          </div>
                          <span className="mt-1 text-[9.5px] font-medium tabular-nums text-[var(--fg-secondary)]">
                            <span className="sm:hidden">
                              {cell.reviewedCount}/{cell.cardCount}
                            </span>
                            <span className="hidden sm:inline">
                              {cell.reviewedCount}/{cell.cardCount} geübt
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-1 w-7 sm:w-10 h-[2.5px] rounded-full bg-black/10 dark:bg-white/15 overflow-hidden"
                          >
                            <span
                              className="block h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.max(12, fillPct)}%`,
                                backgroundColor: meta.accentColor,
                              }}
                            />
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center leading-none w-full">
                          <div className="flex items-center justify-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotBg}`}
                              aria-hidden="true"
                            />
                            <span className="font-sans text-[12px] sm:text-[13.5px] font-semibold tabular-nums text-[var(--fg-primary)]">
                              {cell.masteredPct}%
                            </span>
                          </div>
                          <span className="mt-1 text-[9.5px] font-medium tabular-nums text-[var(--fg-secondary)]">
                            <span className="sm:hidden">
                              {cell.masteredCount}/{cell.cardCount}
                            </span>
                            <span className="hidden sm:inline">
                              {cell.masteredCount === 0
                                ? `${cell.reviewedCount} aktiv`
                                : `${cell.masteredCount}/${cell.cardCount} sicher`}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-1 w-7 sm:w-10 h-[2.5px] rounded-full bg-black/10 dark:bg-white/15 overflow-hidden"
                          >
                            <span
                              className="block h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.max(12, fillPct)}%`,
                                backgroundColor: meta.accentColor,
                              }}
                            />
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Compact 5-Step Scale Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-[var(--fg-secondary)]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--surface-2)] border border-[var(--border-strong)] inline-block" />
            <span>Neu</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--heat-1)] border border-[var(--conf-1)] inline-block" />
            <span>{mode === 'confidence' ? 'Fokus (<40%)' : 'Start'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--heat-2)] border border-[var(--conf-3)] inline-block" />
            <span>{mode === 'confidence' ? 'Aufbau (40–59%)' : 'Wachsend'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--heat-3)] border border-[var(--conf-4)] inline-block" />
            <span>{mode === 'confidence' ? 'Stabil (60–79%)' : 'Solide'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--heat-4)] border border-[var(--conf-5)] inline-block" />
            <span>{mode === 'confidence' ? 'Sicher (80%+)' : 'Gemeistert'}</span>
          </span>
        </div>

        <span className="text-[11px] text-[var(--fg-muted)]">
          Kachel antippen für Details
        </span>
      </div>

      {/* Diagnostic Inspector Card */}
      {activeCell && (
        <div className="p-3.5 sm:p-4 radius-card surface-2 border flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5 min-w-0">
            <CellBreakdownDonut
              total={activeCell.cardCount}
              reviewed={activeCell.reviewedCount}
              mastered={activeCell.masteredCount}
            />

            <div className="space-y-1 min-w-0">
              <div className="flex items-baseline gap-x-2 gap-y-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-[var(--fg-primary)]">
                  <ActiveIcon className="w-3.5 h-3.5 text-[var(--fg-secondary)] self-center shrink-0" />
                  <span>{activeCell.categoryLabel}</span>
                </span>
                <span className="text-[var(--fg-muted)] text-xs" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-semibold text-[var(--accent-secondary)]">
                  {activeCell.cefr === 'ALL'
                    ? 'Alle Niveaus (A1–B1)'
                    : `Niveau ${activeCell.cefr}`}
                </span>
                <span className="text-[var(--fg-muted)] text-xs" aria-hidden="true">
                  ·
                </span>
                <span
                  className={`text-xs font-medium ${activeTierMeta.diagnosticColor}`}
                >
                  {activeTierMeta.diagnosticText}
                </span>
              </div>

              <div className="text-xs text-[var(--fg-secondary)] flex items-center gap-x-3 gap-y-1 flex-wrap font-sans tabular-nums">
                <span>
                  Geübt{' '}
                  <strong className="font-semibold text-[var(--fg-primary)]">
                    {activeCell.reviewedCount}/{activeCell.cardCount}
                  </strong>
                </span>
                <span>
                  Sicher (4–5){' '}
                  <strong className="font-semibold text-[var(--fg-primary)]">
                    {activeCell.masteredCount}
                  </strong>
                </span>
                <span>
                  Vertrauen{' '}
                  <strong className="font-semibold text-[var(--fg-primary)]">
                    {activeCell.reviewedCount > 0
                      ? `${activeCell.confidencePct}% (Ø ${activeCell.avgConfidence.toFixed(1)}/5)`
                      : '—'}
                  </strong>
                </span>
                {activeCell.hardestCard ? (
                  <span>
                    Fokuswort{' '}
                    <strong className="font-semibold text-[var(--fg-primary)]">
                      {activeCell.hardestCard.lemma}
                    </strong>{' '}
                    <span className="text-[11px] text-[var(--fg-muted)]">
                      (Stufe {activeCell.hardestConfidence || 1}/5)
                    </span>
                  </span>
                ) : activeCell.starterCard ? (
                  <span>
                    Startwort{' '}
                    <strong className="font-semibold text-[var(--fg-primary)]">
                      {activeCell.starterCard.lemma}
                    </strong>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto md:shrink-0">
            {hardestReviewedCell &&
              hardestReviewedCell.category !== activeCell.category && (
                <Button
                  intent="tertiary"
                  size="sm"
                  className="max-w-full"
                  onClick={() =>
                    setSelectedKey({
                      category: hardestReviewedCell.category,
                      cefr: hardestReviewedCell.cefr,
                    })
                  }
                  title="Zum schwächsten geübten Bereich springen"
                >
                  <Sparkles className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span>Schwächster Bereich</span>
                </Button>
              )}

            <Button
              intent="primary"
              size="sm"
              className="max-w-full"
              onClick={() => onSelectArchetypeDeck(activeCell.category)}
            >
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>{activeCell.categoryShort} üben</span>
            </Button>
          </div>
        </div>
      )}
    </Card.Root>
  );
};
