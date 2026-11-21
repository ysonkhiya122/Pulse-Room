import React from 'react';
import { VoiceState } from '@/features/voice/useVoiceSession';
import { Mic, Square, Radio, Sparkles, Volume2, Clock } from 'lucide-react';
import { Button, InfoTooltip } from '@/components/atoms';

export interface VoiceDockProps {
  agentName?: string;
  state: VoiceState;
  transcript: string;
  lastReply: string;
  minutesRemaining: number;
  hasSelectedEvent: boolean;
  onToggle: () => void;
  onStop: () => void;
  onAskPrompt: (prompt: string) => void;
}

export const VoiceDock: React.FC<VoiceDockProps> = ({
  agentName = 'Nova',
  state,
  transcript,
  lastReply,
  minutesRemaining,
  hasSelectedEvent,
  onToggle,
  onStop,
  onAskPrompt,
}) => {
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';

  return (
    <div className="w-full glass-card rounded-panel border border-border p-4 flex flex-col gap-3 relative overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping-slow" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text">
            Voice Agent: {agentName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-panel-subtle text-accent border border-border capitalize">
            {state}
          </span>
          <InfoTooltip
            title="Conversational World Awareness Agent (Nova)"
            description="Speaks aloud using live planetary telemetry, atmospheric measurements, and general geographical knowledge. Automatically switches between LiveKit WebRTC and native browser speech synthesis."
            source="Pulse Room Dual-Engine Voice Subsystem"
            baseline="Target Latency < 600ms | Max Response 20s"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono" title="Daily free voice quota">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{minutesRemaining}m free left</span>
        </div>
      </div>

      {/* Center Interactive Orb & Waveforms */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2 z-10">
        {/* Professional Pulsing Orb */}
        <button
          type="button"
          onClick={onToggle}
          className={`relative group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
            isSpeaking
              ? 'bg-accent/20 border-2 border-accent text-accent'
              : isListening
              ? 'bg-topic-calamity/20 border-2 border-topic-calamity text-topic-calamity animate-pulse'
              : isThinking
              ? 'bg-topic-sports/20 border-2 border-topic-sports text-topic-sports animate-spin'
              : 'bg-panel-subtle hover:bg-panel border border-border hover:border-accent text-text'
          }`}
          aria-label={`Voice agent orb. Current state: ${state}. Click to toggle listening.`}
        >
          {isSpeaking ? (
            <Volume2 className="w-6 h-6 text-accent" />
          ) : isListening ? (
            <Mic className="w-6 h-6 text-topic-calamity" />
          ) : isThinking ? (
            <Radio className="w-6 h-6 text-topic-sports" />
          ) : (
            <Mic className="w-6 h-6 text-accent group-hover:scale-105 transition-transform" />
          )}
        </button>

        {/* Live Audio Visualizer Bars */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <div className="flex items-center gap-1.5 h-6 px-3 rounded-lg bg-panel-subtle border border-border/80">
            {[35, 65, 25, 80, 50, 30, 75, 40, 85, 30, 60, 45, 70, 20, 55, 75].map((height, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-accent'
                    : isListening
                    ? 'bg-topic-calamity'
                    : isThinking
                    ? 'bg-topic-sports'
                    : 'bg-border/60'
                }`}
                style={{
                  height: isSpeaking || isListening ? `${Math.max(15, (height * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2.2)}%` : '20%',
                }}
              />
            ))}
          </div>

          {/* Real-time Spoken Answer / Transcript Line (ALWAYS VISIBLE per Blueprint) */}
          <div className="mt-2 text-xs text-text font-medium leading-relaxed min-h-[36px] flex items-center px-1" aria-live="polite">
            {transcript ? (
              <span className="text-text-muted italic mr-1.5">{transcript}</span>
            ) : null}
            <span className="text-text">{lastReply}</span>
          </div>
        </div>

        {/* Instant Stop Button */}
        {isSpeaking || isListening ? (
          <Button
            variant="danger"
            size="sm"
            onClick={onStop}
            className="flex-shrink-0"
            title="Stop agent speaking or listening"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
        ) : null}
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/60 z-10">
        <span className="text-[11px] text-text-muted font-medium flex items-center mr-1">
          <Sparkles className="w-3 h-3 text-accent mr-1 inline" /> Ask:
        </span>

        <button
          type="button"
          onClick={() => onAskPrompt('Give me a 20-second world brief')}
          className="text-[11px] px-2.5 py-1 rounded-chip bg-panel-subtle hover:bg-panel border border-border hover:border-border-active text-text transition-colors"
        >
          World Brief
        </button>

        <button
          type="button"
          onClick={() => onAskPrompt('What is the global weather and wind situation?')}
          className="text-[11px] px-2.5 py-1 rounded-chip bg-panel-subtle hover:bg-panel border border-border hover:border-border-active text-text transition-colors"
        >
          Weather & Wind
        </button>

        <button
          type="button"
          onClick={() => onAskPrompt('What are the latest seismic and calamity reports?')}
          className="text-[11px] px-2.5 py-1 rounded-chip bg-panel-subtle hover:bg-panel border border-border hover:border-border-active text-text transition-colors"
        >
          Seismic Reports
        </button>

        {hasSelectedEvent ? (
          <button
            type="button"
            onClick={() => onAskPrompt('Explain the currently selected event and its local wind and air quality')}
            className="text-[11px] px-2.5 py-1 rounded-chip bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 transition-colors font-medium"
          >
            Explain Selected Event
          </button>
        ) : null}
      </div>
    </div>
  );
};
