import React from 'react';
import { Dot, Badge, Button } from '@/components/atoms';
import { Globe, Radio, Settings, Sparkles } from 'lucide-react';

export interface TopBarProps {
  appName?: string;
  isDemoMode?: boolean;
  isStale?: boolean;
  agentName?: string;
  voiceState?: string;
  onOpenSettings?: () => void;
  onRefresh?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  appName = 'Pulse Room',
  isDemoMode = true,
  isStale = false,
  agentName = 'Nova',
  voiceState = 'idle',
  onOpenSettings,
  onRefresh,
}) => {
  return (
    <header className="w-full glass-panel border-b border-border/80 px-4 py-2.5 flex items-center justify-between z-20 select-none">
      {/* Brand & telemetry status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center text-accent glow-cyan">
            <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-text">
                {appName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-panel-subtle text-muted border border-border">
                v0.1
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted">
              <Dot color="#38E8D0" ping={true} size="sm" />
              <span>Planetary Telemetry Live</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="hidden sm:flex items-center gap-2 ml-4">
          {isDemoMode ? (
            <Badge variant="news" className="text-[10px]">
              <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" /> Demo Mode (Offline Safe)
            </Badge>
          ) : null}

          {isStale ? (
            <Badge variant="stale" className="text-[10px]">
              Showing last known data
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Voice Agent quick indicator & Actions */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-panel-subtle/80 border border-border text-xs text-muted">
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
          title="Refresh planetary feeds"
        >
          Sync
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
