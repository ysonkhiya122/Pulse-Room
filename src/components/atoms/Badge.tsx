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
    default: 'bg-panel-subtle text-text-muted border-border',
    calamity: 'bg-topic-calamity/10 text-topic-calamity border-topic-calamity/25',
    wildlife: 'bg-topic-wildlife/10 text-topic-wildlife border-topic-wildlife/25',
    sports: 'bg-topic-sports/10 text-topic-sports border-topic-sports/25',
    news: 'bg-accent/10 text-accent border-accent/25',
    entertainment: 'bg-topic-entertainment/10 text-topic-entertainment border-topic-entertainment/25',
    stale: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
