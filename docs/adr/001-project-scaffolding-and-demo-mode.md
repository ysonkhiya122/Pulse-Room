# ADR 001: Project Scaffolding and Zero-Network Demo Mode

## Context
Pulse Room must operate as a portfolio-grade product that is free to run forever and never visibly broken during presentations or outages. External APIs (USGS, NASA, LiveKit, LLMs) may experience transient rate limits or downtime.

## Decision
1. We chose **Vite + React 19 + TypeScript (strict)** for high-speed compilation, predictable bundle boundaries, and modern concurrent UI primitives (`useTransition`, `useDeferredValue`).
2. We established **Demo Mode (`VITE_DEMO_MODE=true`)** as a first-class feature. In Demo Mode, all network calls are intercepted, and data is loaded immediately from committed `public/data/snapshot.json` and `public/data/news.json`.
3. We integrated a dual-engine voice system using the Web Speech API (`SpeechSynthesis` + `SpeechRecognition`) as an automated fallback when LiveKit is unconfigured or rate-limited.

## Consequences
- Guaranteed zero-cost, zero-failure demonstrations.
- Bundle size remains compact ($< 100\text{ KB}$ gzipped initial payload).
- Seamless onboarding with no API keys required for first run.
