import { useState, useRef, useEffect, useCallback } from 'react';
import { createBrowserVoice, BrowserVoiceController } from './browser-voice';
import { PulseEvent } from '@/features/events/schema';
import { env } from '@/config/env';

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

export interface UseVoiceSessionOptions {
  agentName?: string;
  selectedEvent?: PulseEvent | null;
  events?: PulseEvent[];
}

export interface VoiceSession {
  state: VoiceState;
  transcript: string;
  lastReply: string;
  voiceMode: 'livekit' | 'browser';
  minutesRemaining: number;
  toggleSession: () => void;
  askPrompt: (promptText: string) => void;
  stop: () => void;
  clearTranscript: () => void;
}

export function useVoiceSession({
  agentName = 'Nova',
  selectedEvent = null,
  events = [],
}: UseVoiceSessionOptions = {}): VoiceSession {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [lastReply, setLastReply] = useState<string>('Ready. Tap orb or ask about global events, weather, or news.');
  const [minutesRemaining] = useState<number>(10); // 10 min daily free budget per Section 9 & 12
  const voiceControllerRef = useRef<BrowserVoiceController | null>(null);

  useEffect(() => {
    voiceControllerRef.current = createBrowserVoice();
    return () => {
      voiceControllerRef.current?.stopSpeaking();
      voiceControllerRef.current?.stopListening();
    };
  }, []);

  const generateLocalAnswer = useCallback(
    (query: string): string => {
      const q = query.toLowerCase();

      if (q.includes('event') || q.includes('this') || q.includes('explain') || q.includes('detail')) {
        if (selectedEvent) {
          return `${selectedEvent.title}. ${selectedEvent.summary || 'Recorded on global telemetry.'} Severity level ${selectedEvent.severity} of 5.`;
        }
        return `Currently monitoring ${events.length} planetary events. Select any marker on the globe to hear its specific briefing.`;
      }

      if (q.includes('weather')) {
        return `Global weather telemetry reports active tropical cyclone Halong in the West Pacific, with seasonal frontal systems across the Northern hemisphere.`;
      }

      if (q.includes('brief') || q.includes('world') || q.includes('what happened') || q.includes('update')) {
        const majorCount = events.filter((e) => e.severity >= 3).length;
        return `World Brief: Pacific subduction monitoring is heightened following a magnitude 6.2 off Chiba, Japan. ${majorCount} priority regional alerts are currently tracked.`;
      }

      if (q.includes('wildfire') || q.includes('fire')) {
        const fires = events.filter((e) => e.kind === 'wildfire');
        return `Tracking ${fires.length} active thermal wildfire clusters, including Southern California brush activity under dry Santa Ana conditions.`;
      }

      if (q.includes('who are you') || q.includes('name')) {
        return `I am ${agentName}, your voice agent in Pulse Room. I provide real-time world awareness across seismic, atmospheric, and global events.`;
      }

      return `Received your inquiry about "${query}". Global telemetry shows nominal baseline across plate boundaries and climate sensor nodes.`;
    },
    [agentName, selectedEvent, events]
  );

  const speakAnswer = useCallback(
    (answer: string) => {
      setState('speaking');
      setLastReply(answer);

      voiceControllerRef.current?.speak(answer, () => {
        setState('idle');
      });
    },
    []
  );

  const processQuery = useCallback(
    (queryText: string) => {
      setState('thinking');
      setTranscript(`"${queryText}"`);

      // 400ms synthetic think time for natural feel
      setTimeout(() => {
        const answer = generateLocalAnswer(queryText);
        speakAnswer(answer);
      }, 450);
    },
    [generateLocalAnswer, speakAnswer]
  );

  const toggleSession = useCallback(() => {
    if (state === 'speaking') {
      voiceControllerRef.current?.stopSpeaking();
      setState('idle');
      return;
    }

    if (state === 'listening') {
      voiceControllerRef.current?.stopListening();
      setState('idle');
      return;
    }

    // Start listening
    setState('listening');
    setTranscript('Listening for your voice...');

    voiceControllerRef.current?.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          voiceControllerRef.current?.stopListening();
          processQuery(text);
        }
      },
      (error) => {
        // Fallback to synthetic demonstration query if microphone is restricted
        setTranscript(`Mic note: ${error}`);
        setState('idle');
      }
    );
  }, [state, processQuery]);

  const askPrompt = useCallback(
    (promptText: string) => {
      voiceControllerRef.current?.stopSpeaking();
      processQuery(promptText);
    },
    [processQuery]
  );

  const stop = useCallback(() => {
    voiceControllerRef.current?.stopSpeaking();
    voiceControllerRef.current?.stopListening();
    setState('idle');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    state,
    transcript,
    lastReply,
    voiceMode: env.VITE_FEATURE_LIVEKIT_VOICE ? 'livekit' : 'browser',
    minutesRemaining,
    toggleSession,
    askPrompt,
    stop,
    clearTranscript,
  };
}
