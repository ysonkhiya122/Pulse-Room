import React from 'react';
import { Dot, Badge, Button, InfoTooltip } from '@/components/atoms';
import { Globe, Radio, Settings, Wifi, RefreshCw } from 'lucide-react';

export interface TopBarProps {
  appName?: string;
  isDemoMode?: boolean;
  isLiveFeeds?: boolean;
  isStale?: boolean;
  agentName?: string;
  voiceState?: string;
  onToggleLiveFeeds?: () => void;
  onOpenSettings?: () => void;
  onRefresh?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  appName = 'Pulse Room',
  isLiveFeeds = true,
  isStale = false,
  agentName = 'Nova',
  voiceState = 'idle',
  onToggleLiveFeeds,
  onOpenSettings,
  onRefresh,
}) => {
  return (
    <header className="w-full glass-card border-b border-border px-4 py-2.5 flex items-center justify-between z-20 select-none">
      {/* Brand & telemetry status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '28s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-text">
                {appName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-panel-subtle text-text-muted border border-border">
                v0.3.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <Dot color={isLiveFeeds ? '#10B981' : '#06B6D4'} ping={isLiveFeeds} size="sm" />
              <span>{isLiveFeeds ? 'Live Scientific Feeds Active' : 'Offline Snapshot Mode'}</span>
            </div>
          </div>
        </div>

        {/* Live Network vs Snapshot Mode Interactive Toggle */}
        <div className="hidden sm:flex items-center gap-2 ml-4">
          <button
            type="button"
            onClick={onToggleLiveFeeds}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-colors ${
              isLiveFeeds
                ? 'bg-topic-wildlife/10 text-topic-wildlife border-topic-wildlife/30 hover:bg-topic-wildlife/20'
                : 'bg-panel-subtle text-text-muted border-border hover:text-text hover:border-border-active'
            }`}
            title="Click to toggle between live scientific API polling and offline snapshot mode"
          >
            <Wifi className="w-3 h-3" />
            <span>{isLiveFeeds ? 'Live USGS & NASA Feeds' : 'Snapshot Baseline Mode'}</span>
          </button>

          {isStale ? (
            <Badge variant="stale" className="text-[10px]">
              Showing last known data
            </Badge>
          ) : null}

          <InfoTooltip
            title="Live Scientific Feeds vs Snapshot"
            description="When enabled, Pulse Room actively polls live USGS Seismology (earthquakes ≥M2.5 worldwide), NASA EONET v3 (wildfires, tropical storms), and Open-Meteo (live wind and AQI). If network throttles or is toggled off, verified scientific snapshots load with zero disruption."
            source="USGS · NASA EONET · Open-Meteo APIs"
            baseline="60s–90s Automatic SWR Polling"
          />
        </div>
      </div>

      {/* Voice Agent quick indicator & Actions */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-panel-subtle border border-border text-xs text-text-muted">
          <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>Agent:</span>
          <span className="text-text font-semibold">{agentName}</span>
          <span className="text-[10px] font-mono text-accent capitalize">({voiceState})</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="text-xs hidden sm:inline-flex"
          title="Refresh planetary telemetry feeds"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          <span>Sync</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenSettings}
          className="text-xs"
          title="Settings and preferences"
        >
          <Settings className="w-3.5 h-3.5 mr-1" />
          <span>Settings</span>
        </Button>
      </div>
    </header>
  );
};
