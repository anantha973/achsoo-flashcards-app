import React from 'react';

export type SemanticIntent =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface HeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: SemanticIntent;
  size?: ButtonSize;
  children: React.ReactNode;
}

const intentClasses: Record<SemanticIntent, string> = {
  primary:
    'bg-[var(--intent-primary)] hover:bg-[var(--intent-primary-hover)] text-[var(--intent-primary-fg)] border border-transparent shadow-ring',
  secondary:
    'surface-1 border text-[var(--fg-primary)] hover:bg-[var(--surface-2)] shadow-ring',
  tertiary:
    'bg-transparent border border-transparent text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-2)]',
  danger:
    'bg-[var(--intent-danger-soft)] hover:opacity-90 text-[var(--intent-danger)] border border-[var(--intent-danger-border)]',
  warning:
    'bg-[var(--intent-warning-soft)] hover:opacity-90 text-[var(--intent-warning)] border border-[var(--intent-warning-border)]',
  success:
    'bg-[var(--intent-success-soft)] hover:opacity-90 text-[var(--intent-success)] border border-[var(--intent-success-border)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-3 py-1.5 radius-control text-xs font-semibold gap-1.5',
  md: 'min-h-[42px] px-4 py-2 radius-control text-xs sm:text-sm font-semibold gap-2',
  lg: 'min-h-[48px] px-5 py-2.5 radius-card text-sm font-semibold gap-2',
  icon: 'min-h-[40px] min-w-[40px] radius-control p-0 justify-center',
};

export const Button: React.FC<HeroButtonProps> = ({
  intent = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-[background-color,color,border-color,box-shadow,transform] duration-150 active:scale-[0.97] theme-focus cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${intentClasses[intent]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardSubProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardRoot: React.FC<CardSubProps & { level?: 1 | 2 }> = ({
  level = 1,
  className = '',
  children,
  ...props
}) => {
  const surfaceClass =
    level === 1 ? 'surface-paper' : 'surface-2 radius-card shadow-ring';
  return (
    <div
      className={`border ${surfaceClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardSubProps> = ({ className = '', children, ...props }) => (
  <div
    className={`px-5 pt-5 pb-3 flex items-center justify-between gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardBody: React.FC<CardSubProps> = ({ className = '', children, ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter: React.FC<CardSubProps> = ({ className = '', children, ...props }) => (
  <div
    className={`px-5 py-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
};

interface ProgressBarProps {
  value: number;
  intent?: SemanticIntent;
  accentColor?: string;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

const progressIntentBar: Record<SemanticIntent, string> = {
  primary: 'bg-[var(--intent-primary)]',
  secondary: 'bg-[var(--accent-secondary)]',
  tertiary: 'bg-[var(--fg-muted)]',
  danger: 'bg-[var(--intent-danger)]',
  warning: 'bg-[var(--intent-warning)]',
  success: 'bg-[var(--intent-success)]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  intent = 'primary',
  accentColor,
  size = 'sm',
  label = 'Progress',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full ${heightClass} radius-pill bg-[var(--surface-3)] overflow-hidden ${className}`}
    >
      <div
        className={`h-full radius-pill transition-[width,background-color] duration-300 ${
          accentColor ? '' : progressIntentBar[intent]
        }`}
        style={{
          width: `${clamped}%`,
          ...(accentColor ? { backgroundColor: accentColor } : {}),
        }}
      />
    </div>
  );
};
