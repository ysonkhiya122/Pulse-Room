import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';
import { useNews } from '@/features/news';
import { formatRelativeTime } from '@/lib/time';

export const BriefCard: React.FC = () => {
  const { data: articles, isLoading } = useNews();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const activeArticle = articles && articles.length > 0 ? articles[currentIndex % articles.length] : null;

  return (
    <div className="glass-card rounded-panel border border-border p-4 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
            <Radio className="w-3 h-3 text-accent animate-pulse" />
            <span>Live Scientific Dispatches</span>
          </div>

          <div className="flex items-center gap-1">
            {activeArticle?.publishedAt ? (
              <span className="text-[10px] font-mono text-text-muted">
                {formatRelativeTime(activeArticle.publishedAt)}
              </span>
            ) : null}

            <InfoTooltip
              title="Live Planetary Dispatches & Scientific News"
              description="Real-time planetary observation dispatches, satellite telemetry alerts, and earth science reports ingested live from NASA, European Spaceflight, and global observation networks."
              source="Spaceflight News API & NASA RSS"
              baseline="Verified scientific sources with zero fabrication"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2 py-2">
            <div className="h-4 bg-panel-subtle rounded animate-pulse w-3/4" />
            <div className="h-3 bg-panel-subtle rounded animate-pulse w-full" />
            <div className="h-3 bg-panel-subtle rounded animate-pulse w-2/3" />
          </div>
        ) : activeArticle ? (
          <div>
            <h4 className="text-xs font-bold text-text leading-snug mb-1.5">
              {activeArticle.headline}
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-3">
              {activeArticle.summary}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-text-muted">Loading planetary dispatches...</p>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border/60 font-mono">
        <span className="truncate max-w-[170px]">
          {activeArticle?.source || 'NASA / Spaceflight Network'}
        </span>

        <div className="flex items-center gap-2">
          {articles && articles.length > 1 ? (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setCurrentIndex((idx) => (idx > 0 ? idx - 1 : articles.length - 1))}
                className="p-1 rounded text-text-muted hover:text-text hover:bg-panel-subtle"
                aria-label="Previous article"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[9px] px-1">
                {(currentIndex % articles.length) + 1}/{articles.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentIndex((idx) => idx + 1)}
                className="p-1 rounded text-text-muted hover:text-text hover:bg-panel-subtle"
                aria-label="Next article"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ) : null}

          {activeArticle?.url ? (
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-0.5"
              title="Open verified article on publisher site"
            >
              <span>Source</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
