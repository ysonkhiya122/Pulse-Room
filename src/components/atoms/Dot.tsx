import React from 'react';
import { clsx } from 'clsx';

export interface DotProps {
  color?: string;
  ping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Dot: React.FC<DotProps> = ({
  color = '#38E8D0',
  ping = true,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  return (
    <span className={clsx('relative inline-flex items-center justify-center flex-shrink-0', className)}>
      {ping ? (
        <span
          className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', sizes[size])}
          style={{ backgroundColor: color }}
        />
      ) : null}
      <span
        className={clsx('relative inline-flex rounded-full', sizes[size])}
        style={{ backgroundColor: color }}
      />
    </span>
  );
};
