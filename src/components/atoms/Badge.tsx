import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'calamity' | 'wildlife' | 'sports' | 'news' | 'entertainment' | 'stale';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const styles = {
    default: 'bg-panel-subtle text-muted border-border',
    calamity: 'bg-topic-calamity/15 text-topic-calamity border-topic-calamity/30',
    wildlife: 'bg-topic-wildlife/15 text-topic-wildlife border-topic-wildlife/30',
    sports: 'bg-topic-sports/15 text-topic-sports border-topic-sports/30',
    news: 'bg-accent/15 text-accent border-accent/30',
    entertainment: 'bg-topic-entertainment/15 text-topic-entertainment border-topic-entertainment/30',
    stale: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
