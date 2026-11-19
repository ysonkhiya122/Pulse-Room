# Pulse Room: Architecture Documentation

## 1. System Overview
**Pulse Room** is a personalized, voice-driven world awareness dashboard. It renders real-time planetary events (seismic activity, wildfires, severe storms, ecological migrations, and global affairs) onto an interactive 3D globe with 24-hour replay scrubbing and bidirectional conversational AI via voice agent **Nova**.

```
                  ┌──────────────────────────────────────────────┐
                  │            Browser Client (SPA)              │
                  │   React 19 + TypeScript (Strict) + Vite      │
                  └──────┬─────────────────┬─────────────┬───────┘
                         │                 │             │
        ┌────────────────┼─────────────────┼─────────────┴──────────┐
        │ Direct (Public)│                 │ Cached Proxy           │ Realtime
        ▼                ▼                 ▼                        ▼
 ┌─────────────┐  ┌─────────────┐   ┌─────────────┐          ┌─────────────┐
 │ USGS Quakes │  │ NASA EONET  │   │ /api/wm     │          │ /api/token  │
 │  (GeoJSON)  │  │ (Wildfires) │   │ World Mon.  │          │  LiveKit    │
 └──────┬──────┘  └──────┬──────┘   └──────┬──────┘          └──────┬──────┘
        │                │                 │                        │
        └────────────────┼─────────────────┘                        │
                         ▼                                          ▼
            ┌───────────────────────────┐                 ┌──────────────────┐
            │   Fail-Soft Cache Layer   │                 │ LiveKit Cloud /  │
            │ (Promise.allSettled +     │                 │ Browser Speech   │
            │  public/data/snapshot.json│                 │ Web Speech API   │
            └───────────────────────────┘                 └──────────────────┘
```

## 2. Layer Boundaries & Import Rules
Enforced strictly across the codebase:
- **`components/atoms/`**: Basic UI primitives (`Button`, `Chip`, `Dot`, `Badge`, `Skeleton`, `Slider`).
- **`components/molecules/`**: Compositional widgets (`TopicChip`, `StatTile`, `InsightCard`, `AreaRow`, `TickerItem`).
- **`components/organisms/`**: Complex presentational blocks (`GlobeStage`, `VoiceDock`, `StoryCard`, `TopBar`, `BriefCard`, `ActivityBars`, `Ticker`). Receive all data and handlers strictly via props.
- **`components/templates/`**: Page layout shells (`DashboardLayout`).
- **`features/`**: Domain logic, state machines, and data ingestion (`events`, `insights`, `news`, `voice`). Inter-feature imports only through `index.ts`.
- **`pages/`**: Connect feature hooks to presentational templates.

## 3. Data Ingestion & Fail-Soft Protocol
1. **Adapters:** Every data source implements `EventAdapter` (`fetch(signal): Promise<PulseEvent[]>`).
2. **Concurrent Settlement:** `useEvents` executes all adapters in parallel via `Promise.allSettled`.
3. **Graceful Fallback:** If any adapter times out or fails (HTTP 429/5xx), surviving adapters populate the feed. If all sources fail or when offline, committed `public/data/snapshot.json` loads automatically, displaying a subtle *"showing last known data"* badge.

## 4. Voice Agent Subsystem
- **Dual Engine:**
  - **LiveKit Cloud WebRTC:** High-fidelity real-time voice pipeline.
  - **Web Speech API:** In-browser zero-dependency fallback for offline, demo mode, or when LiveKit minutes are depleted.
- **Cost Guard:** Daily 10-minute cap per user with visible quota remaining indicator.
- **Safety:** Spoken responses capped at 20 seconds; strictly no emergency/medical advice for disasters.
