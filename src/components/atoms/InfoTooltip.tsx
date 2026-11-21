import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface InfoTooltipProps {
  title: string;
  description: string;
  source?: string;
  baseline?: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  description,
  source,
  baseline,
  className,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={clsx('relative inline-flex items-center', className)} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-1 rounded-md text-text-muted hover:text-text hover:bg-panel-subtle transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
        aria-label={`Context information for ${title}`}
        aria-expanded={isOpen}
      >
        <Info className="w-3.5 h-3.5 text-text-muted/80 hover:text-accent transition-colors" />
      </button>

      {isOpen ? (
        <div
          role="tooltip"
          className="absolute right-0 top-full mt-1.5 w-64 z-50 p-3 rounded-card bg-[#111622] border border-border-active shadow-popover text-left text-xs"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border">
            <span className="font-semibold text-text text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {title}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-text-muted hover:text-text p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <p className="text-text-secondary leading-relaxed text-[11px] mb-2">
            {description}
          </p>

          {(source || baseline) ? (
            <div className="flex flex-col gap-1 pt-1.5 border-t border-border/60 text-[10px] font-mono text-text-muted">
              {source ? (
                <div>
                  <span className="text-accent font-medium">Source:</span> {source}
                </div>
              ) : null}
              {baseline ? (
                <div>
                  <span className="text-text-secondary font-medium">Reference:</span> {baseline}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
