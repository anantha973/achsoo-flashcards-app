import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { VelocityPoint } from '../utils/srsEngine';
import { Card } from './HeroPrimitives';
import { FoxMascot } from './FoxMascot';
import { SlidingPillSwitcher } from './SlidingPillSwitcher';

export type VelocityChartMode = 'daily' | 'mastered';

export interface LearningVelocityChartProps {
  velocityData: VelocityPoint[];
  masteredCount: number;
  isAnimationActive: boolean;
}

export const LearningVelocityChart: React.FC<LearningVelocityChartProps> = ({
  velocityData,
  masteredCount,
  isAnimationActive,
}) => {
  const [mode, setMode] = useState<VelocityChartMode>('daily');

  const total7DayReviews = useMemo(
    () => velocityData.reduce((sum, pt) => sum + (pt.reviews || 0), 0),
    [velocityData]
  );

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface-1)',
    borderColor: 'var(--border-strong)',
    borderRadius: 'var(--radius-control)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    color: 'var(--fg-primary)',
    boxShadow: 'var(--shadow-overlay)',
  };

  return (
    <Card.Root className="p-5 space-y-4 surface-paper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <FoxMascot
            pose="runner"
            size="sm"
            interactive
            speechPlacement="right"
          />
          <div className="min-w-0">
            <h2 className="font-display text-sm font-bold text-[var(--fg-primary)]">
              Learning Velocity
            </h2>
            <p className="text-xs text-[var(--fg-secondary)]">
              {mode === 'daily'
                ? 'German flashcard reviews completed per day over the last 7 days'
                : 'Cumulative German cards mastered over the last 7 days'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 flex-wrap">
          <SlidingPillSwitcher
            options={[
              { id: 'daily', label: 'Daily Activity' },
              { id: 'mastered', label: 'Total Mastered' },
            ]}
            value={mode}
            onChange={setMode}
            ariaLabel="Learning velocity chart mode"
            size="sm"
          />

          <div className="text-right font-sans tabular-nums">
            <div className="text-sm font-bold text-[var(--accent-secondary)]">
              {mode === 'daily'
                ? `${total7DayReviews} reviews`
                : `${masteredCount} mastered`}
            </div>
            <div className="text-[11px] text-[var(--fg-muted)]">
              {mode === 'daily' ? '7-day total' : '7-day trend'}
            </div>
          </div>
        </div>
      </div>

      <div
        key={mode}
        className="h-56 w-full pt-2 transition-opacity duration-200"
      >
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'daily' ? (
            <BarChart
              data={velocityData}
              accessibilityLayer={false}
              margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-subtle)"
              />
              <XAxis
                dataKey="dayLabel"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: 'var(--fg-muted)',
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                }}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: 'var(--fg-muted)',
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                }}
              />
              <Tooltip
                cursor={{ fill: 'var(--surface-2)', opacity: 0.7 }}
                contentStyle={tooltipStyle}
                labelFormatter={(_label, payload) => {
                  const point = payload?.[0]?.payload;
                  return point
                    ? `${point.dayLabel} (${point.fullDateLabel})`
                    : String(_label);
                }}
                formatter={(value) => {
                  const n = Number(value ?? 0);
                  return [
                    `${n} ${n === 1 ? 'review' : 'reviews'}`,
                    'Daily Activity',
                  ];
                }}
              />
              <Bar
                dataKey="reviews"
                isAnimationActive={isAnimationActive}
                animationDuration={320}
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          ) : (
            <LineChart
              data={velocityData}
              accessibilityLayer={false}
              margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-subtle)"
              />
              <XAxis
                dataKey="dayLabel"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: 'var(--fg-muted)',
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                }}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: 'var(--fg-muted)',
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(_label, payload) => {
                  const point = payload?.[0]?.payload;
                  return point
                    ? `${point.dayLabel} (${point.fullDateLabel})`
                    : String(_label);
                }}
                formatter={(value) => [`${value ?? 0} cards`, 'Mastered']}
              />
              <Line
                type="monotone"
                dataKey="mastered"
                isAnimationActive={isAnimationActive}
                animationDuration={320}
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: 'var(--chart-1)',
                  strokeWidth: 2,
                  stroke: 'var(--surface-1)',
                }}
                activeDot={{ r: 6, fill: 'var(--chart-2)' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card.Root>
  );
};
