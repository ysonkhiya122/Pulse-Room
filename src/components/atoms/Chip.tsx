import React from 'react';
import { clsx } from 'clsx';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  color?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  color,
  className,
  style,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-chip transition-all duration-150 border select-none',
        active
          ? 'bg-panel-subtle text-text border-accent/60 shadow-card'
          : 'bg-panel/70 text-text-muted border-border hover:border-border-active hover:text-text',
        className
      )}
      style={{
        borderColor: active && color ? color : undefined,
        color: active && color ? color : undefined,
        ...style,
      }}
      aria-pressed={active}
      {...props}
    >
      {color ? (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
