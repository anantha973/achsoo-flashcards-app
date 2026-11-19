import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { VelocityPoint } from '../utils/srsEngine';

export interface LearningVelocityChartProps {
  velocityData: VelocityPoint[];
  isAnimationActive: boolean;
}

export const LearningVelocityChart: React.FC<LearningVelocityChartProps> = ({
  velocityData,
  isAnimationActive,
}) => {
  return (
    <div className="h-56 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={velocityData}
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
            contentStyle={{
              backgroundColor: 'var(--surface-1)',
              borderColor: 'var(--border-strong)',
              borderRadius: 'var(--radius-control)',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              color: 'var(--fg-primary)',
              boxShadow: 'var(--shadow-overlay)',
            }}
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
      </ResponsiveContainer>
    </div>
  );
};
