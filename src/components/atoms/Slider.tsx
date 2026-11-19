import React from 'react';
import { clsx } from 'clsx';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 1,
  max = 24,
  step = 1,
  onChange,
  label = 'Time Window (Hours)',
  className,
  ...props
}) => {
  return (
    <div className={clsx('flex flex-col gap-1 w-full', className)}>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted font-medium">{label}</span>
        <span className="text-accent font-mono font-semibold">
          {value === 24 ? 'Last 24 Hours (Full)' : `Last ${value} Hour${value > 1 ? 's' : ''}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus:ring-1 focus:ring-accent"
        aria-label={label}
        {...props}
      />
      <div className="flex justify-between text-[10px] text-muted/70 font-mono">
        <span>1h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
};
