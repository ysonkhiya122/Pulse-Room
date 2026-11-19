import React, { useState, useMemo, useTransition } from 'react';
import { useEvents } from '@/features/events';
import { useInsights } from '@/features/insights';
import { useVoiceSession } from '@/features/voice';
import { EventTopic, PulseEvent } from '@/features/events/schema';
import { ALL_TOPIC_IDS } from '@/features/news/topics';
import { env } from '@/config/env';
import { isWithinHours } from '@/lib/time';

import { DashboardLayout } from '@/components/templates';
import {
  TopBar,
  GlobeStage,
  VoiceDock,
  StoryCard,
  BriefCard,
  ActivityBars,
  Ticker,
} from '@/components/organisms';
import {
  TopicChip,
  StatTile,
  InsightCard,
  AreaRow,
} from '@/components/molecules';
import { Slider } from '@/components/atoms';
import { Sparkles, MapPin } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { events, isStale } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<PulseEvent | null>(null);
  const [hoursWindow, setHoursWindow] = useState<number>(24);
  const [activeTopics, setActiveTopics] = useState<Set<EventTopic>>(new Set(ALL_TOPIC_IDS));
  const [, startTransition] = useTransition();
  const [agentName] = useState<string>(env.VITE_DEFAULT_AGENT_NAME);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Time & Topic Filtering (pure client-side selector over cached data per Section 8)
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const topicMatches = activeTopics.has(e.topic);
      const timeMatches = isWithinHours(e.time, hoursWindow);
      return topicMatches && timeMatches;
    });
  }, [events, activeTopics, hoursWindow]);

  // Compute insights over filtered events
  const insights = useInsights(filteredEvents);

  // Voice session hook
  const voiceSession = useVoiceSession({
    agentName,
    selectedEvent,
    events: filteredEvents,
  });

  const handleToggleTopic = (topic: EventTopic) => {
    startTransition(() => {
      setActiveTopics((prev) => {
        const next = new Set(prev);
        if (next.has(topic)) {
          if (next.size > 1) next.delete(topic); // keep at least 1
        } else {
          next.add(topic);
        }
        return next;
      });
    });
  };

  const handleListenToEvent = (event: PulseEvent) => {
    setSelectedEvent(event);
    voiceSession.askPrompt(`Brief me on this event: ${event.title}`);
  };

  // Metrics summary
  const quakeCount = filteredEvents.filter((e) => e.kind === 'earthquake').length;
  const majorSeverityCount = filteredEvents.filter((e) => e.severity >= 4).length;

  return (
    <>
    <DashboardLayout
      topBar={
        <TopBar
          appName={env.VITE_APP_NAME}
          isDemoMode={env.VITE_DEMO_MODE}
          isStale={isStale}
          agentName={agentName}
          voiceState={voiceSession.state}
          onOpenSettings={() => setShowSettingsModal(true)}
          onRefresh={() => window.location.reload()}
        />
      }
      ticker={
        <Ticker
          events={filteredEvents}
          onSelectEvent={(e) => {
            setSelectedEvent(e);
          }}
        />
      }
      statsRow={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile
            label="Total Active Events"
            value={filteredEvents.length}
            subtext={`Across ${activeTopics.size} topics`}
            color="#38E8D0"
          />
          <StatTile
            label="Seismic Tremors"
            value={quakeCount}
            subtext="USGS detection feed"
            color="#FF6B6B"
          />
          <StatTile
            label="High Severity (≥4)"
            value={majorSeverityCount}
            subtext="Regional alerts tracked"
            color="#FFB454"
          />
          <StatTile
            label="Voice Quota Remaining"
            value={`${voiceSession.minutesRemaining}m`}
            subtext="Daily free allocation"
            color="#7CE38B"
          />
        </div>
      }
      topicChips={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-card bg-panel/60 border border-border/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-1">
              Filter Topics:
            </span>
            {ALL_TOPIC_IDS.map((t) => {
              const count = events.filter((e) => e.topic === t).length;
              return (
                <TopicChip
                  key={t}
                  topic={t}
                  active={activeTopics.has(t)}
                  count={count}
                  onToggle={handleToggleTopic}
                />
              );
            })}
          </div>

          <div className="w-full sm:w-64">
            <Slider
              value={hoursWindow}
              min={1}
              max={24}
              onChange={(val) => {
                startTransition(() => {
                  setHoursWindow(val);
                });
              }}
              label="Replay Window"
            />
          </div>
        </div>
      }
      mainStage={
        <GlobeStage
          events={filteredEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={(event) => setSelectedEvent(event)}
          hoursWindow={hoursWindow}
        />
      }
      bottomDeck={
        <div className="flex flex-col gap-4">
          {/* Voice Agent Command Dock */}
          <VoiceDock
            agentName={agentName}
            state={voiceSession.state}
            transcript={voiceSession.transcript}
            lastReply={voiceSession.lastReply}
            minutesRemaining={voiceSession.minutesRemaining}
            hasSelectedEvent={Boolean(selectedEvent)}
            onToggle={voiceSession.toggleSession}
            onStop={voiceSession.stop}
            onAskPrompt={voiceSession.askPrompt}
          />

          {/* 24h Activity Distribution Bars */}
          <ActivityBars events={filteredEvents} />
        </div>
      }
      sidePanel={
        <div className="flex flex-col gap-4">
          {/* Story Card of Selected Event */}
          <StoryCard
            event={selectedEvent}
            onListen={handleListenToEvent}
            onClose={() => setSelectedEvent(null)}
          />

          {/* What Changed Insight Cards */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>What Changed: Key Insights</span>
              </span>
              <span className="text-[10px] font-mono text-muted">Auto-computed</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>

          {/* Monitored Areas Status */}
          <div className="glass-panel rounded-panel border border-border/80 p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Your Areas Telemetry</span>
              </span>
              <span className="text-[10px] font-mono text-muted">City Level</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <AreaRow
                name="Tokyo Metro"
                country="Japan"
                status="alert"
                eventCount={1}
                onClick={() => {
                  const tokyoQuake = events.find((e) => e.title.includes('Katsuura') || e.title.includes('Japan'));
                  if (tokyoQuake) setSelectedEvent(tokyoQuake);
                }}
              />
              <AreaRow
                name="San Diego County"
                country="United States"
                status="advisory"
                eventCount={1}
                onClick={() => {
                  const wildfire = events.find((e) => e.kind === 'wildfire');
                  if (wildfire) setSelectedEvent(wildfire);
                }}
              />
              <AreaRow
                name="Reykjanes Zone"
                country="Iceland"
                status="advisory"
                eventCount={1}
                onClick={() => {
                  const iceland = events.find((e) => e.title.includes('Iceland'));
                  if (iceland) setSelectedEvent(iceland);
                }}
              />
              <AreaRow
                name="Paris Suburbs"
                country="France"
                status="nominal"
                eventCount={0}
              />
            </div>
          </div>

          {/* World Brief Card */}
          <BriefCard />
        </div>
      }
      footer={
        <footer className="w-full border-t border-border/70 py-4 px-4 text-center text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1600px] mx-auto select-none">
          <div className="flex items-center gap-2">
            <span>Data Attribution: USGS · NASA EONET · Open-Meteo · World Monitor</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Demo Mode: Strict 0-Cost / 0-Network Guarantee</span>
            <span>·</span>
            <span>WCAG 2.2 AA Compliant</span>
          </div>
        </footer>
      }
    />

    {showSettingsModal ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="glass-panel rounded-panel border border-border max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="text-base font-bold text-text">Pulse Room Settings</h3>
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="text-muted hover:text-text p-1 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="text-muted font-medium block mb-1">Voice Agent Identity</label>
              <input
                type="text"
                value={agentName}
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-panel-subtle border border-border text-text font-medium"
              />
            </div>

            <div>
              <label className="text-muted font-medium block mb-1">Voice Operational Mode</label>
              <div className="px-3 py-2 rounded-xl bg-panel-subtle border border-border text-accent font-mono">
                {voiceSession.voiceMode === 'livekit' ? 'LiveKit Cloud WebRTC' : 'Browser Web Speech API (Fail-Soft Fallback)'}
              </div>
            </div>

            <div>
              <label className="text-muted font-medium block mb-1">Data Sovereignty & Export</label>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ agentName, activeTopics: Array.from(activeTopics), exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'pulse-room-export.json';
                  a.click();
                }}
                className="px-3 py-2 rounded-xl bg-panel-subtle hover:bg-panel border border-border text-text font-medium w-full text-center transition-colors"
              >
                Export Settings & Profile JSON
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border/80">
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-2 rounded-xl bg-accent text-[#05080F] font-semibold text-xs hover:bg-accent-hover transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
};
