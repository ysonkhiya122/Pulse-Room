export interface BrowserVoiceController {
  isSupported: boolean;
  speak(text: string, onEnd?: () => void): void;
  stopSpeaking(): void;
  startListening(onTranscript: (text: string, isFinal: boolean) => void, onError: (err: string) => void): void;
  stopListening(): void;
}

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
}

interface ISpeechRecognitionResultItem {
  transcript: string;
}

interface ISpeechRecognitionResult {
  [index: number]: ISpeechRecognitionResultItem;
  isFinal: boolean;
  length: number;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: ISpeechRecognitionResult;
    length: number;
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (event: ISpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognitionInstance;

export function createBrowserVoice(): BrowserVoiceController {
  const isSpeechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  let recognitionConstructor: SpeechRecognitionConstructor | undefined;
  if (typeof window !== 'undefined') {
    const win = window as IWindowWithSpeech;
    recognitionConstructor = (win.SpeechRecognition || win.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
  }

  let recognitionInstance: ISpeechRecognitionInstance | null = null;

  return {
    isSupported: Boolean(isSpeechSynthesisSupported),

    speak(text: string, onEnd?: () => void) {
      if (!isSpeechSynthesisSupported) {
        onEnd?.();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select pleasant voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find((v) =>
        v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Nova'))
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();
      window.speechSynthesis.speak(utterance);
    },

    stopSpeaking() {
      if (isSpeechSynthesisSupported) {
        window.speechSynthesis.cancel();
      }
    },

    startListening(onTranscript, onError) {
      if (!recognitionConstructor) {
        onError('Speech recognition not supported in this browser; text input fallback enabled.');
        return;
      }

      try {
        const instance = new recognitionConstructor();
        instance.continuous = false;
        instance.interimResults = true;
        instance.lang = 'en-US';

        instance.onresult = (event: ISpeechRecognitionEvent) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            const transcript = res?.[0]?.transcript ?? '';
            if (res?.isFinal) {
              onTranscript(transcript, true);
            } else {
              interimTranscript += transcript;
            }
          }
          if (interimTranscript) {
            onTranscript(interimTranscript, false);
          }
        };

        instance.onerror = (e: ISpeechRecognitionErrorEvent) => {
          onError(e.error || 'Speech error');
        };

        instance.start();
        recognitionInstance = instance;
      } catch (err) {
        onError(String(err));
      }
    },

    stopListening() {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch {
          // ignore
        }
        recognitionInstance = null;
      }
    },
  };
}
